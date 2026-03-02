import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, BookOpen, Search, ArrowRight, Loader2, Link2, CheckCircle2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AssignStudents() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentRes, batchRes] = await Promise.all([
                api.get("/students"),
                api.get("/batches")
            ]);
            setStudents(studentRes.data);
            setBatches(batchRes.data.filter(b => b.status === "Active"));
        } catch (error) {
            toast.error("Failed to fetch assignment intelligence");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (studentId, batchId) => {
        setSubmitting(studentId);
        try {
            await api.patch(`/students/${studentId}`, { batchId: batchId || null });
            toast.success("Entity-Node binding updated");
            fetchData();
        } catch (error) {
            toast.error("Binding orchestration failed");
        } finally {
            setSubmitting(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout allowedRoles={["ANALYST"]}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-vibrant-emerald animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-32 animate-in fade-in zoom-in-95 duration-1000 italic font-['Outfit']">
                {/* Header Block - Entity Linkage */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-16 border-b-8 border-white/5 pb-20 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-vibrant-emerald/5 rounded-full blur-[200px] pointer-events-none"></div>
                    <div className="space-y-8 relative z-10 max-w-4xl">
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-black/40 border-4 border-white/5 rounded-2xl text-vibrant-emerald text-[11px] font-black uppercase tracking-[0.6em]">
                            <Link2 size={22} className="animate-pulse" />
                            ENTITY_NODE_BINDING_PROTOCOL
                        </div>
                        <h2 className="text-[10rem] font-black tracking-tighter italic text-white leading-[0.85] uppercase">
                            Entity <span className="text-vibrant-emerald">Linkage</span>
                        </h2>
                        <p className="text-3xl text-slate-500 font-medium italic border-l-8 border-vibrant-emerald pl-12 lowercase leading-relaxed">
                            Mapping institutional entities to operational distribution nodes. Experience high-fidelity personnel allocation.
                        </p>
                    </div>
                </div>

                <div className="space-y-16">
                    <div className="flex flex-col xl:flex-row gap-12 items-center justify-between bg-slate-950/40 p-10 rounded-[4rem] border-8 border-white/5 shadow-2xl italic">
                        <div className="relative group/search w-full xl:w-[45rem]">
                            <Search size={36} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-vibrant-emerald transition-all" />
                            <input
                                type="text"
                                placeholder="Filter Entity Registry..."
                                className="w-full pl-28 py-8 bg-black/60 border-4 border-white/5 rounded-[3rem] text-white outline-none focus:border-vibrant-emerald/40 transition-all italic text-xl shadow-inner shadow-black/50"
                            />
                        </div>
                        <div className="flex gap-8 w-full xl:w-auto">
                            <div className="px-12 py-7 bg-vibrant-emerald/5 text-vibrant-emerald border-4 border-vibrant-emerald/10 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 shadow-2xl skew-x-[-10deg]">
                                <span>Synchronized Entities: {students.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                        {students.map((student) => {
                            const currentBatch = batches.find(b => String(b.id) === String(student.batchId));
                            return (
                                <div key={student.id} className="group p-12 bg-slate-900/40 border-8 border-white/5 rounded-[4rem] hover:border-vibrant-emerald/40 transition-all duration-700 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] italic flex flex-col justify-between h-[550px]">
                                    <div className="absolute -right-32 -top-32 w-80 h-80 bg-vibrant-emerald/5 rounded-full blur-[100px] group-hover:bg-vibrant-emerald/10 transition-colors duration-1000"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <div className="w-24 h-24 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-vibrant-emerald font-black text-4xl shadow-2xl border-4 border-white/10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border-4 shadow-2xl transition-all duration-500 ${student.batchId ? 'bg-vibrant-emerald/10 text-vibrant-emerald border-vibrant-emerald/20 shadow-vibrant-emerald/20' : 'bg-slate-900/60 text-slate-700 border-white/5'}`}>
                                                {student.batchId ? 'BINDING_ACTIVE' : 'IDLE_ENTITY'}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-5xl font-black text-white group-hover:text-vibrant-emerald transition-colors tracking-tighter leading-none italic uppercase">{student.name}</h3>
                                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em] border-l-4 border-vibrant-emerald/40 pl-6 italic">{student.email}</p>
                                        </div>

                                        <div className="p-8 bg-black/40 rounded-[2.5rem] border-4 border-white/5 space-y-4 shadow-inner">
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em] leading-none ml-4">Current Allocation</p>
                                            <div className="flex items-center gap-6 text-white font-black text-2xl italic tracking-tight">
                                                <BookOpen size={28} className={currentBatch ? 'text-vibrant-emerald' : 'text-slate-800'} />
                                                <span className={currentBatch ? 'text-white' : 'text-slate-700'}>
                                                    {currentBatch ? currentBatch.name : 'NULL_ORCHESTRATION'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-6 pt-8 border-t-8 border-white/5">
                                        <label className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] ml-6 italic">Protocol Assignment</label>
                                        <div className="relative group/select">
                                            <BookOpen size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/select:text-vibrant-emerald transition-colors" />
                                            <select
                                                className="w-full pl-24 py-7 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white appearance-none cursor-pointer outline-none focus:border-vibrant-emerald/40 transition-all italic text-xl"
                                                value={student.batchId || ""}
                                                onChange={(e) => handleAssign(student.id, e.target.value)}
                                                disabled={submitting === student.id}
                                            >
                                                <option value="" className="bg-slate-900">DECOMMISSION_BINDING</option>
                                                {batches.map(b => (
                                                    <option key={b.id} value={b.id} className="bg-slate-900">
                                                        {b.name} ({b.course})
                                                    </option>
                                                ))}
                                            </select>
                                            {submitting === student.id ? (
                                                <Loader2 size={24} className="absolute right-10 top-1/2 -translate-y-1/2 text-vibrant-emerald animate-spin" />
                                            ) : (
                                                <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ArrowRight size={24} className="text-slate-700 group-hover/select:translate-x-2 transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
