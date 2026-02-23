import { Bell, Search, User } from "lucide-react";

export default function Navbar({ user }) {
    return (
        <header className="h-24 bg-white/5 backdrop-blur-xl border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-20">
            <div className="flex flex-col text-left">
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back, {user.name}</h2>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1 italic">WorkZen Enterprise Management System</p>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
                    <div className="flex flex-col text-right hidden sm:block">
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest leading-none mt-1">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent border border-accent/20">
                        <User size={20} />
                    </div>
                </div>

                <button className="relative p-3 text-slate-400 hover:bg-white/5 rounded-2xl transition-all group">
                    <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#020617]"></span>
                </button>
            </div>
        </header>
    );
}
