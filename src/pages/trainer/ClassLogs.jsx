import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Clock, Calendar, Plus, Search, Loader2, PlayCircle, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function ClassLogs() {
    const [logs, setLogs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const [form, setForm] = useState({
        batchId: "",
        topic: "",
        duration: "90",
        date: new Date().toISOString().split('T')[0],
        remarks: "",
        progress: "0"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logRes, batchRes] = await Promise.all([
                api.get(`/sessionLogs?trainerId=${user.id}&_sort=date&_order=desc`),
                api.get(`/batches?trainerId=${user.id}`)
            ]);
            setLogs(logRes.data);
            setBatches(batchRes.data);
            if (batchRes.data.length > 0) {
                setForm(prev => ({ ...prev, batchId: batchRes.data[0].id }));
            }
        } catch (error) {
            toast.error("Failed to synchronize session logs");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                trainerId: user.id,
                timestamp: new Date().toISOString()
            };
            await api.post("/sessionLogs", payload);
            toast.success("Session intelligence recorded successfully");
            setForm({ ...form, topic: "", remarks: "" });
            setShowAdd(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to commit session report");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 italic uppercase">Session Intelligence Logs</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">Documenting instructional delivery and batch progress.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        {showAdd ? <AlertCircle size={18} /> : <Plus size={18} />}
                        {showAdd ? "Terminate Entry" : "Record Session"}
                    </button>
                </div>

                {showAdd && (
                    <div className="bg-white rounded-2xl p-8 animate-in zoom-in-95 duration-300 text-left border border-slate-200 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-xl font-black text-slate-800 italic uppercase tracking-tight">New Session Report</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Batch</label>
                                <select
                                    value={form.batchId}
                                    onChange={e => setForm({ ...form, batchId: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold italic"
                                    required
                                >
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Delivery Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration (Min)</label>
                                <input
                                    type="number"
                                    value={form.duration}
                                    onChange={e => setForm({ ...form, duration: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold"
                                    placeholder="90"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Instructional Topic</label>
                                <input
                                    type="text"
                                    value={form.topic}
                                    onChange={e => setForm({ ...form, topic: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold italic"
                                    placeholder="e.g. Advanced State Management with Redux"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Syllabus Progress (%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={form.progress}
                                    onChange={e => setForm({ ...form, progress: e.target.value })}
                                    className="w-full h-10 accent-indigo-600 cursor-pointer"
                                />
                                <div className="text-right text-[10px] font-black text-indigo-600">{form.progress}% Complete</div>
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Remarks</label>
                                <textarea
                                    value={form.remarks}
                                    onChange={e => setForm({ ...form, remarks: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-medium italic h-24 resize-none"
                                    placeholder="Internal observations, student participation notes, or blockers..."
                                />
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
                                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                                    Commit Log
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200">
                                <BarChart3 size={20} />
                            </div>
                            <p className="font-black text-slate-700 uppercase tracking-tighter italic">Session Repository</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Total Logs: {logs.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-8 py-5 italic">Chronicle</th>
                                    <th className="px-8 py-5 italic">Operational Node</th>
                                    <th className="px-8 py-5 italic">Intellectual Subject</th>
                                    <th className="px-8 py-5 italic">Metrics</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Loader2 size={48} className="animate-spin text-indigo-600" />
                                                <p className="font-black uppercase tracking-widest text-xs">Accessing Archives...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                            <Search size={48} className="mx-auto mb-4 opacity-10" />
                                            <p>No instructional logs found in the repository.</p>
                                        </td>
                                    </tr>
                                ) : logs.map((log) => {
                                    const batch = batches.find(b => b.id === log.batchId);
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={14} className="text-indigo-400" />
                                                    <p className="text-sm font-bold text-slate-800 uppercase italic">
                                                        {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold ml-6">{new Date(log.date).getFullYear()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-800 italic">{batch?.name || "System Node"}</p>
                                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{batch?.course || "Internal"}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-800 mb-1 italic">{log.topic}</p>
                                                <p className="text-xs text-slate-500 italic max-w-md truncate">{log.remarks}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Duration</p>
                                                        <p className="text-xs font-bold text-slate-700">{log.duration}m</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative group/progress">
                                                        <span className="text-[10px] font-black text-indigo-600 italic">{log.progress}%</span>
                                                        <div className="absolute inset-0 border-r-2 border-indigo-500 rounded-xl opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
