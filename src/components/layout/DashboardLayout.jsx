import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, allowedRoles = [] }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!storedUser) {
            navigate("/login");
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(storedUser.role)) {
            // Redirect to home or login if role not allowed
            navigate("/");
            return;
        }

        setUser(storedUser);
    }, [navigate, allowedRoles]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <Sidebar role={user.role} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background decorative elements - Light theme pastel version */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full filter blur-3xl opacity-40"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full filter blur-3xl opacity-40"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/20 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                {/* Subtle grid pattern overlay for texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

                <Navbar user={user} />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar-light relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Animated content wrapper */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Optional footer indicator */}
                <div className="absolute bottom-3 right-6 text-[10px] text-slate-400 font-medium italic z-20">
                    v2.0 • {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}