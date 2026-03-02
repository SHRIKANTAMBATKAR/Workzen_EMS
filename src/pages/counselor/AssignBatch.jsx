import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, BookOpen, Search, ArrowRight, Loader2, Link2, UserCheck, GraduationCap, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AssignBatch() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentRes, batchRes] = await Promise.all([
                api.get("/students"),
                api.get("/batches")
            ]);
            setStudents(studentRes.data);
            setBatches(batchRes.data.filter(b => b.status === "Active"));
        } catch (error) {
            toast.error("Failed to fetch synchronization data");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (studentId, batchId) => {
        setSubmitting(studentId);
        try {
            await api.patch(`/students/${studentId}`, { batchId: batchId || null });
            toast.success("Student registration updated");
            // Optimistic update
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, batchId } : s));
        } catch (error) {
            toast.error("Assignment failed");
        } finally {
            setSubmitting(null);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                {/* Header section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest">
                            <Link2 size={14} />
                            Batch Allocation Protocol
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 italic tracking-tight">Batch <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-8">Assignment</span></h2>
                        <p className="text-slate-500 font-medium italic max-w-2xl">
                            Orchestrating student distribution across active training nodes. Ensure high-fidelity operational alignment.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-medium italic"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
                            <Users size={16} />
                            <span>Registry: {students.length}</span>
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="font-bold uppercase tracking-widest text-xs">Synchronizing Intelligence...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudents.map((student) => {
                            const currentBatch = batches.find(b => String(b.id) === String(student.batchId));
                            return (
                                <div key={student.id} className="p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-indigo-300 hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[400px] shadow-md">
                                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl group-hover:bg-indigo-200 transition-colors"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-2xl border border-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${student.batchId ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {student.batchId ? 'Assigned' : 'Unassigned'}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-8 text-left">
                                            <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight italic uppercase">{student.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{student.email}</p>
                                        </div>

                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mb-8 text-left">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</p>
                                            <div className="flex items-center gap-3 text-slate-700 font-bold italic">
                                                <GraduationCap size={18} className={currentBatch ? 'text-indigo-600' : 'text-slate-400'} />
                                                <span className={currentBatch ? 'text-slate-800' : 'text-slate-400'}>
                                                    {currentBatch ? currentBatch.name : 'No active batch'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-6 border-t border-slate-200 text-left">
                                        <div className="relative">
                                            <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
                                            <select
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 appearance-none cursor-pointer outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-bold italic"
                                                value={student.batchId || ""}
                                                onChange={(e) => handleAssign(student.id, e.target.value)}
                                                disabled={submitting === student.id}
                                            >
                                                <option value="" className="bg-white">Select Batch</option>
                                                {batches.map(b => (
                                                    <option key={b.id} value={b.id} className="bg-white">
                                                        {b.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {submitting === student.id ? (
                                                    <Loader2 size={16} className="text-indigo-600 animate-spin" />
                                                ) : (
                                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                )}
                                            </div>
                                        </div>
                                        {student.batchId && (
                                            <button
                                                onClick={() => handleAssign(student.id, null)}
                                                className="mt-3 flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                                            >
                                                <XCircle size={12} />
                                                Remove Deployment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}