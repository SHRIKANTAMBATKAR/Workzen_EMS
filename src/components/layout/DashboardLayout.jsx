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
        <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white">
            <Sidebar role={user.role} onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-5"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-5"></div>
                </div>

                <Navbar user={user} />

                <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
