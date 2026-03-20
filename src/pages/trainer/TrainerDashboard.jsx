import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, TrendingUp, Calendar, Loader2, PlayCircle, Star, Sparkles, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function TrainerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState([]);
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
            const [batchRes, logRes] = await Promise.all([
                api.get(`/batches`),
                api.get(`/sessionLogs?_sort=date&_order=desc`)
            ]);

            // JSON Server v1 coerces numeric query params, so client-side filter is safer
            const trainerId = String(user.userId);
            const assignedBatches = (batchRes.data || []).filter(b => String(b.trainerId) === trainerId);
            const trainerLogs = (logRes.data || []).filter(l => String(l.trainerId) === trainerId);

            setBatches(assignedBatches);
            setLogs(trainerLogs);
        } catch (error) {
            toast.error("Failed to sync dashboard data");
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    const activeBatches = batches.filter(b => b.status === "Active");

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6 text-left">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Intelligence Hub</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-800 italic">Trainer Console</h2>
                        <p className="text-slate-500 mt-2 text-lg italic font-medium">Monitoring batch performance and curriculum delivery.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/trainer/my-batches")}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <BookOpen size={18} className="text-emerald-600" />
                            My Batches
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <PlayCircle size={32} />
                            </div>
                            <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Live Status</span>
                        </div>
                        <h3 className="text-2xl font-black mb-1 italic">Active Modules</h3>
                        <p className="text-indigo-100/90 font-bold text-lg mb-6">
                            {activeBatches.length} Batches assigned
                        </p>
                        <button
                            onClick={() => navigate("/trainer/batch-progress")}
                            className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10"
                        >
                            Report New Session
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:rotate-6 transition-transform">
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Allotment</p>
                                <h3 className="text-4xl font-black text-slate-800">{loading ? "..." : batches.length}</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium italic">Assigned Training Nodes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl group-hover:-rotate-6 transition-transform">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Session Volume</p>
                                <h3 className="text-4xl font-black text-slate-800">{loading ? "..." : logs.length}</h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium italic">Commited Logs</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Active Batches List */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 italic flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-600" />
                                Current Deliverables
                            </h3>
                            <button
                                onClick={() => navigate("/trainer/my-batches")}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                            >
                                View All
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {loading ? (
                                <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400 italic">
                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                    <span>Syncing Repositories...</span>
                                </div>
                            ) : activeBatches.length === 0 ? (
                                <div className="p-20 text-center text-slate-400 italic font-medium">
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-10" />
                                    <p>No active module assignments detected.</p>
                                </div>
                            ) : activeBatches.map((batch) => (
                                <div key={batch.id} className="p-6 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black group-hover:scale-110 transition-transform border border-indigo-100 shadow-sm">
                                                {(batch.batchName || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{batch.batchName}</p>
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-tighter rounded-full border border-emerald-200">
                                                        Active
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{batch.course} • {batch.startTime || 'TBD'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate("/trainer/batch-progress")}
                                            className="px-5 py-2.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Timeline */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800 italic flex items-center gap-2">
                                <Calendar size={20} className="text-emerald-600" />
                                Session Timeline
                            </h3>
                            <button
                                onClick={() => navigate("/trainer/batch-progress")}
                                className="text-[10px] font-black uppercase tracking-widest text-emerald-600"
                            >
                                History
                            </button>
                        </div>
                        <div className="space-y-6 relative flex-1">
                            {logs.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 italic font-medium">
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-10" />
                                    <p>No instructional activity recorded yet.</p>
                                </div>
                            ) : logs.slice(0, 5).map((log, idx) => {
                                const title = log?.topicCovered || log?.title || log?.topic || "Untitled Session";
                                const attachmentName = log?.fileName || log?.documentName;
                                const sliceLen = logs.slice(0, 5).length;

                                return (
                                    <div key={log.id || idx} className="flex gap-5 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 group-hover:scale-125 transition-transform z-10"></div>
                                            {idx !== sliceLen - 1 && <div className="w-0.5 h-full bg-slate-100 -mt-1"></div>}
                                        </div>
                                        <div className="pb-8 flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                                {new Date(log.date).toLocaleDateString()}
                                            </p>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-base font-black text-slate-800 italic uppercase underline decoration-indigo-200 decoration-2 underline-offset-4">
                                                        {title}
                                                    </p>
                                                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-wider mt-2">
                                                        Module: {batches.find(b => String(b.id) === String(log.batchId))?.batchName || "Independent"}
                                                    </p>
                                                </div>
                                                {attachmentName && (
                                                    <span className="text-[9px] font-black px-2 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 uppercase tracking-tighter">
                                                        Notes Attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
