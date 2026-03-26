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
    ChevronRight,
    Link2,
    TrendingUp,
    Sparkles,
    Star,
    FileText
} from "lucide-react";

export default function Sidebar({ role, onLogout }) {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("currentUser")) || { name: "User", role: role };

    const menuItems = {
        ADMIN: [
            { name: "Dashboard", path: "/admin", icon: LayoutDashboard, color: "from-indigo-500 to-blue-500" },
            { name: "Manage Trainers", path: "/admin/trainers", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
            { name: "Manage Analysts", path: "/admin/analysts", icon: BarChart3, color: "from-purple-500 to-pink-500" },
            { name: "Manage Counselors", path: "/admin/counselors", icon: Users, color: "from-amber-500 to-orange-500" },
        ],
        TRAINER: [
            { name: "My Batch", path: "/trainer/my-batches", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
            { name: "Batch Progress", path: "/trainer/batch-progress", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
            { name: "Manage Records", path: "/trainer/manage-records", icon: FileText, color: "from-amber-500 to-orange-500" },
        ],
        ANALYST: [
            { name: "Dashboard", path: "/analyst", icon: LayoutDashboard, color: "from-indigo-500 to-blue-500" },
            { name: "Create Batch", path: "/analyst/create-batch", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
            { name: "Batches", path: "/analyst/batches", icon: BookOpen, color: "from-purple-500 to-pink-500" },
        ],
        COUNSELOR: [
            { name: "Dashboard", path: "/counselor", icon: LayoutDashboard, color: "from-indigo-500 to-blue-500" },
            { name: "Students", path: "/counselor/students", icon: Users, color: "from-emerald-500 to-teal-500" },
            { name: "Assign Batch", path: "/counselor/assign-batch", icon: Link2, color: "from-purple-500 to-pink-500" },
            { name: "View Batches", path: "/counselor/batches", icon: BookOpen, color: "from-amber-500 to-orange-500" },
        ],
    };

    const navLinks = menuItems[role] || [];

    // Get role-specific gradient
    const getRoleGradient = () => {
        switch (role) {
            case 'ADMIN': return 'from-indigo-600 to-purple-600';
            case 'TRAINER': return 'from-emerald-600 to-teal-600';
            case 'ANALYST': return 'from-amber-600 to-orange-600';
            case 'COUNSELOR': return 'from-blue-600 to-cyan-600';
            default: return 'from-indigo-600 to-purple-600';
        }
    };

    return (
        <aside className="w-80 h-screen bg-white border-r border-indigo-100/50 sticky top-0 flex flex-col z-30 shadow-xl shadow-indigo-500/5">
            {/* Premium Header with Gradient */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getRoleGradient()} rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 group`}>
                        <Hexagon size={32} className="text-white fill-white/20" />
                        <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter">
                            WorkZen
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleGradient()} animate-pulse`}></div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
                                {role} Portal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Role-based decorative element */}
                <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent rounded-full"></div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar-light">
                {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                                ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                                : "text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 w-1.5 h-full bg-white/40 blur-[2px]"></div>
                            )}

                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive
                                    ? 'bg-white/20'
                                    : 'bg-indigo-100/50 group-hover:bg-indigo-200/50'
                                    }`}>
                                    <Icon
                                        size={18}
                                        className={`transition-all duration-300 ${isActive
                                            ? "text-white scale-110"
                                            : "text-indigo-600 group-hover:text-indigo-700 group-hover:scale-110"
                                            }`}
                                    />
                                </div>
                                <span className={`font-bold text-sm tracking-wide ${isActive ? "text-white" : "text-slate-700"
                                    }`}>
                                    {item.name}
                                </span>
                            </div>

                            {isActive && (
                                <ChevronRight size={16} className="text-white/80 relative z-10 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Card with Gradient */}
            <div className="p-5 mt-auto border-t border-indigo-100/50 bg-gradient-to-b from-white to-indigo-50/30">
                <div className="bg-white rounded-2xl p-5 border border-indigo-100/80 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {/* Decorative background elements */}
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
                    <div className="absolute -left-8 -top-8 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-pink-200/30 rounded-full blur-2xl"></div>

                    {/* Role badge floating */}
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r ${getRoleGradient()} text-white shadow-sm`}>
                            {role}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getRoleGradient()} p-[2px] shadow-lg`}>
                            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                <span className="text-xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {user.name?.substring(0, 2).toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-slate-800 truncate flex items-center gap-1">
                                {user.name}
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                            </h4>
                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                                {user.email || 'user@workzen.com'}
                            </p>
                        </div>
                    </div>

                    {/* Quick stats or meta info */}


                    <button
                        onClick={onLogout}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-600 hover:text-rose-700 transition-all duration-300 border border-rose-200 hover:border-rose-300 shadow-sm font-bold text-xs flex items-center justify-center gap-2 group/btn relative z-10"
                    >
                        <LogOut size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Version info */}
                <div className="mt-3 text-center">
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider">
                        © 2024 WorkZen • v2.0.0
                    </p>
                </div>
            </div>
        </aside>
    );
}