import { Bell, Search, User, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-indigo-100/50 px-6 md:px-10 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            {/* Left Section - Welcome Message */}
            <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" />
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}
                    </h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></span>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] italic">
                        WorkZen Enterprise Management System
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search Bar - Optional */}
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white px-4 py-2.5 rounded-xl border border-indigo-200/50 shadow-sm hover:shadow-md transition-all group">
                    <Search size={16} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-40 lg:w-60"
                    />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-2 ml-2">
                        ⌘K
                    </span>
                </div>

                {/* Notification Bell */}
                <button className="relative p-3 text-slate-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl transition-all group border border-slate-200 shadow-sm hover:border-indigo-200">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5">
                        <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-ping"></span>
                        <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></span>
                    </span>
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 bg-gradient-to-r from-white to-indigo-50/30 px-4 py-2 rounded-xl border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex flex-col text-right">
                            <p className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                {user?.name}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] ${user?.role === 'COUNSELOR'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : user?.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {user?.role}
                                </span>
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                            ) : (
                                <span className="font-black text-lg">{user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>

                        <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-indigo-100 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                <p className="text-[10px] text-slate-500">{user?.email}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                                <User size={14} className="text-indigo-400" />
                                Profile Settings
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2">
                                <span className="text-rose-400">●</span>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}