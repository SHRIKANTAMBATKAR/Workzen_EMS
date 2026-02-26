import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                {/* Decorative background glow */}
                <div className="absolute top-0 inset-x-0 h-32 bg-red-500/10 blur-3xl -z-10"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all z-20"
                >
                    <X size={18} />
                </button>

                <div className="p-10 space-y-8 text-center relative z-10">
                    {/* Alert Icon */}
                    <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                        <AlertTriangle size={40} className="text-red-500 animate-pulse" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-3xl font-extrabold text-white tracking-tight">{title || "Confirm Removal"}</h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            {message || "This action cannot be undone. Are you sure you want to remove this profile from the system?"}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-8 py-4.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all active:scale-95"
                        >
                            Keep Member
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-8 py-4.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
