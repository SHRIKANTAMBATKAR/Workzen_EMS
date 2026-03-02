import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, Clock, CheckCircle, PlayCircle, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function TrainerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [logs, setLogs] = useState([]);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || user.role !== "TRAINER") {
            navigate("/login");
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [batchRes, studentRes, logRes] = await Promise.all([
                api.get(`/batches?trainerId=${user.id}`),
                api.get("/students"),
                api.get(`/sessionLogs?trainerId=${user.id}&_limit=5&_sort=date&_order=desc`)
            ]);
            setBatches(batchRes.data);
            setStudents(studentRes.data);
            setLogs(logRes.data);
        } catch (error) {
            toast.error("Failed to sync dashboard intelligence");
        } finally {
            setLoading(false);
        }
    };

    const totalStudents = students.filter(s => batches.some(b => b.id === s.batchId)).length;
    const activeBatches = batches.filter(b => b.status === "Active");

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-end text-left">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-800 italic">Trainer Console</h2>
                        <p className="text-slate-500 mt-2 text-lg italic font-medium">Navigating batch progress and student excellence.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/trainer/logs")}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Calendar size={18} className="text-indigo-600" />
                            Session History
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white border-none shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <PlayCircle size={28} />
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active State</span>
                        </div>
                        <h3 className="text-xl font-black mb-1 italic">Next Delivery</h3>
                        <p className="text-indigo-100/90 font-bold text-sm mb-4">
                            {activeBatches.length > 0 ? `${activeBatches[0].name} • ${activeBatches[0].startTime}` : "No Active Sessions"}
                        </p>
                        <button
                            disabled={activeBatches.length === 0}
                            className="w-full py-3 bg-white text-indigo-700 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10 disabled:opacity-50 disabled:scale-100"
                        >
                            Initialize Session
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border-b-4 border-b-emerald-500 text-left group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Batch Yield</p>
                                <h3 className="text-3xl font-black text-slate-800">{loading ? "..." : batches.length}</h3>
                                <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-bold">
                                    <TrendingUp size={14} />
                                    <span>Assigned Nodes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border-b-4 border-b-indigo-500 text-left group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Learner Base</p>
                                <h3 className="text-3xl font-black text-indigo-600">{loading ? "..." : totalStudents}</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium italic">Managed Intelligence</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 text-left">
                    <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-md">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 italic">Operational Batches</h3>
                            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
                                Allocation Table
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {loading ? (
                                <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                    <span>Synchronizing Data...</span>
                                </div>
                            ) : batches.length === 0 ? (
                                <div className="p-20 text-center text-slate-400 italic font-medium">
                                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No batches assigned to your profile.</p>
                                </div>
                            ) : batches.map((batch) => {
                                const batchStudents = students.filter(s => s.batchId === batch.id).length;
                                return (
                                    <div key={batch.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black border border-indigo-200 group-hover:scale-110 transition-transform">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-800">{batch.name}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                        {batch.status}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{batch.course} • {batch.startTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-4 hidden md:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                                                <p className="text-xs font-bold text-slate-600">{batchStudents} Enrolled</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/trainer/attendance/${batch.id}`)}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                                            >
                                                Attendance
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800 italic">Session Intelligence</h3>
                            <button
                                onClick={() => navigate("/trainer/logs")}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Historical Data
                            </button>
                        </div>
                        <div className="space-y-6 mb-8 relative">
                            {logs.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 italic font-medium">
                                    <Clock size={48} className="mx-auto mb-4 opacity-10" />
                                    <p>No recent session logs detected.</p>
                                </div>
                            ) : logs.map((log, idx) => (
                                <div key={log.id || idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1 shadow-lg shadow-indigo-200 group-hover:scale-125 transition-transform"></div>
                                        {idx !== logs.length - 1 && <div className="w-0.5 h-full bg-slate-100 mt-1"></div>}
                                    </div>
                                    <div className="pb-6 flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(log.date).toLocaleDateString()}</p>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{log.topic}</p>
                                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                                                    {batches.find(b => b.id === log.batchId)?.name || "External Node"}
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase tracking-tighter">
                                                {log.duration}m Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate("/trainer/logs")}
                            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
                        >
                            <PlayCircle size={18} className="group-hover:rotate-12 transition-transform" />
                            Provision New Session Report
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
