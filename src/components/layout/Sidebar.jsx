import { Link, useLocation } from "react-router-dom";
import {
    BarChart3,
    Users,
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Settings,
    LogOut,
    Hexagon,
    ChevronRight
} from "lucide-react";

export default function Sidebar({ role, onLogout }) {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("currentUser")) || { name: "User", role: role };

    const menuItems = {
        ADMIN: [
            { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
            { name: "User Management", path: "/admin/users", icon: Users },
            { name: "System Analytics", path: "/admin/analytics", icon: BarChart3 },
            { name: "Settings", path: "/admin/settings", icon: Settings },
        ],
        TRAINER: [
            { name: "My Batches", path: "/trainer", icon: BookOpen },
            { name: "Attendance", path: "/trainer/attendance", icon: GraduationCap },
            { name: "Logs", path: "/trainer/logs", icon: LayoutDashboard },
        ],
        ANALYST: [
            { name: "Dashboard", path: "/analyst", icon: LayoutDashboard },
            { name: "Batches", path: "/analyst/batches", icon: BookOpen },
            { name: "Assignments", path: "/analyst/assignments", icon: Users },
        ],
        COUNSELOR: [
            { name: "Dashboard", path: "/counselor", icon: LayoutDashboard },
            { name: "Students", path: "/counselor/students", icon: Users },
            { name: "Admissions", path: "/counselor/admissions", icon: GraduationCap },
        ],
    };

    const navLinks = menuItems[role] || [];

    return (
        <aside className="w-80 h-screen glass-card-dark rounded-none border-y-0 border-l-0 sticky top-0 flex flex-col z-30">
            {/* Premium Header */}
            <div className="p-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Hexagon size={28} className="text-white fill-white/10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent tracking-tighter">
                            WorkZen
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-indigo-300/40 uppercase tracking-[0.3em] font-black">
                                {role} Center
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-6 space-y-3 mt-4">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${isActive
                                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                                    : "text-indigo-200/40 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 w-1.5 h-full bg-accent blur-[2px]"></div>
                            )}

                            <div className="flex items-center gap-4 relative z-10">
                                <Icon
                                    size={22}
                                    className={`transition-all duration-500 ${isActive ? "text-accent scale-110" : "group-hover:text-white group-hover:scale-110"
                                        }`}
                                />
                                <span className={`font-bold text-sm tracking-wide transition-colors ${isActive ? "text-white" : "group-hover:text-white"
                                    }`}>
                                    {item.name}
                                </span>
                            </div>

                            {isActive && (
                                <ChevronRight size={16} className="text-accent relative z-10" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Card */}
            <div className="p-6">
                <div className="glass-card-dark bg-white/5 p-6 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500"></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
                                <span className="text-sm font-black text-white">{user.name.substring(0, 2).toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                            <p className="text-[10px] text-indigo-300/40 uppercase font-black tracking-widest">{user.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-red-500/10 text-indigo-200/60 hover:text-red-400 transition-all duration-300 font-bold text-xs flex items-center justify-center gap-3 group/btn relative z-10"
                    >
                        <LogOut size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
