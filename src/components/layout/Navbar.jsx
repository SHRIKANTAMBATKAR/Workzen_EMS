import { Bell, Search, User } from "lucide-react";

export default function Navbar({ user }) {
    return (
        <header className="h-24 glass-card-dark rounded-none border-x-0 border-t-0 px-10 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl w-[450px] border border-white/5 focus-within:border-accent/40 transition-all">
                <Search size={20} className="text-indigo-300/40" />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent outline-none text-sm w-full text-white placeholder:text-indigo-300/30 font-medium"
                />
            </div>

            <div className="flex items-center gap-8">
                <button className="relative p-3 text-indigo-200/60 hover:bg-white/5 rounded-2xl transition-all group">
                    <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e1b4b]"></span>
                </button>
            </div>
        </header>
    );
}
