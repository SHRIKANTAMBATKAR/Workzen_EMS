import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, Clock, CheckCircle, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function MyBatches() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || user.role !== "TRAINER") {
            navigate("/login");
            return;
        }
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const [batchRes, studentRes] = await Promise.all([
                api.get(`/batches?trainerId=${user.id}`),
                api.get("/students")
            ]);
            setBatches(batchRes.data);
            setStudents(studentRes.data);
        } catch (error) {
            toast.error("Failed to load your batches");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-end text-left">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-800 italic">My Assigned Batches</h2>
                        <p className="text-slate-500 mt-2 text-lg italic font-medium">Comprehensive overview of your active and historical instructional nodes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                            <Loader2 className="animate-spin text-indigo-600" size={48} />
                            <span className="font-black uppercase tracking-widest text-sm">Accessing Batch Repository...</span>
                        </div>
                    ) : batches.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-slate-400 italic font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <BookOpen size={64} className="mx-auto mb-6 opacity-10" />
                            <p className="text-xl">No batches currently assigned to your protocol.</p>
                        </div>
                    ) : (
                        batches.map((batch) => {
                            const batchStudents = students.filter(s => s.batchId === batch.id);
                            return (
                                <div key={batch.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>

                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                                            <BookOpen size={28} />
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${batch.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                            {batch.status}
                                        </span>
                                    </div>

                                    <div className="mb-8 text-left relative z-10">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors italic">{batch.name}</h3>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{batch.course}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8 text-left relative z-10">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={14} className="text-indigo-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learners</span>
                                            </div>
                                            <p className="text-lg font-black text-slate-800">{batchStudents.length}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock size={14} className="text-indigo-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                                            </div>
                                            <p className="text-lg font-black text-slate-800">{batch.startTime}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-3 relative z-10">
                                        <button
                                            onClick={() => navigate(`/trainer/attendance/${batch.id}`)}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            <CheckCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            Attendance Console
                                        </button>
                                        <button
                                            onClick={() => navigate(`/trainer/logs`)}
                                            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Search size={16} />
                                            View Chronicles
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
