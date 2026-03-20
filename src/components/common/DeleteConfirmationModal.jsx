import { AlertTriangle, X, Shield, AlertCircle } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white border-2 border-rose-200 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                {/* Decorative background glow - Light theme version */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-100/50 to-transparent blur-3xl -z-10"></div>

                {/* Decorative elements */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-50"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition-all z-20 shadow-sm"
                >
                    <X size={18} />
                </button>

                <div className="p-8 space-y-6 text-center relative z-10">
                    {/* Alert Icon - Light theme version */}
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto border-2 border-rose-200 shadow-lg">
                            <AlertTriangle size={36} className="text-rose-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            !
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {title || "Confirm Removal"}
                        </h3>
                        <p className="text-slate-600 text-base font-medium leading-relaxed max-w-sm mx-auto">
                            {message || "This action cannot be undone. Are you sure you want to remove this profile from the system?"}
                        </p>
                    </div>

                    {/* Warning note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-left">
                        <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-700 font-medium">
                            This action is permanent and will remove all associated data
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold border-2 border-slate-200 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                        >
                            Keep Member
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/30 transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                            <AlertTriangle size={16} />
                            Confirm Delete
                        </button>
                    </div>

                    {/* Security note */}
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <Shield size={10} />
                        Administrative action • Audit trail will be recorded
                    </p>
                </div>
            </div>
        </div>
    );
}