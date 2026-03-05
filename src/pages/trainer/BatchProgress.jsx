import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    BookOpen,
    FileText,
    Upload,
    Send,
    Loader2,
    Calendar,
    History,
    CheckCircle,
    ChevronRight,
    Paperclip,
    Trash2,
    Search,
    Filter
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BatchProgress() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [batches, setBatches] = useState([]);
    const [logs, setLogs] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [uploadingFile, setUploadingFile] = useState(null);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const [formData, setFormData] = useState({
        title: "",
        batchId: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        fileName: ""
    });

    useEffect(() => {
        if (!user || user.role !== "TRAINER") return;
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [batchRes, logRes] = await Promise.all([
                api.get(`/batches`),
                api.get(`/sessionLogs`)
            ]);

            const trainerId = String(user.userId);
            const assignedBatches = (batchRes.data || []).filter(b => String(b.trainerId) === trainerId);
            const trainerLogs = (logRes.data || [])
                .filter(l => String(l.trainerId) === trainerId)
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setBatches(assignedBatches);
            setLogs(trainerLogs);

            if (batchRes.data?.length > 0) {
                setFormData(prev => ({ ...prev, batchId: batchRes.data[0].id }));
                setSelectedBatchId(batchRes.data[0].id);
            }
        } catch (error) {
            toast.error("Failed to sync repository data");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["application/pdf", "text/plain"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF or Text files are permitted for archival");
            return;
        }

        setUploadingFile(file);
        setFormData(prev => ({ ...prev, fileName: file.name }));
        toast.success(`Artifact '${file.name}' staged for deployment`);
    };

    const removeFile = () => {
        setUploadingFile(null);
        setFormData(prev => ({ ...prev, fileName: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.batchId) {
            toast.error("Module selection required");
            return;
        }

        setSubmitting(true);
        try {
            const logEntry = {
                ...formData,
                trainerId: user.userId,
                id: Date.now().toString(),
                duration: 120, // Default for now
                progress: 50,  // Standard yield
                topic: formData.title // Alignment with historical schema
            };

            await api.post("/sessionLogs", logEntry);
            toast.success("Intelligence report committed to central repository");

            // Reset form but keep batchId
            setFormData({
                title: "",
                batchId: formData.batchId,
                description: "",
                date: new Date().toISOString().split('T')[0],
                fileName: ""
            });
            setUploadingFile(null);

            // Refresh logs
            const logRes = await api.get(`/sessionLogs`);
            const trainerId = String(user.userId);
            const trainerLogs = (logRes.data || [])
                .filter(l => String(l.trainerId) === trainerId)
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setLogs(trainerLogs);
        } catch (error) {
            toast.error("Log commitment failure: Terminal error");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLogs = logs.filter(log => selectedBatchId === "all" || String(log.batchId) === String(selectedBatchId));

    if (loading) {
        return (
            <DashboardLayout allowedRoles={["TRAINER"]}>
                <div className="h-[80vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 p-6 text-left">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-1 bg-emerald-600 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Curriculum Logistics</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">Batch Progress</h2>
                        <p className="text-slate-500 mt-2 font-medium italic">Record daily instructional activity and archive class resources.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Log Entry Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 space-y-8 relative overflow-hidden">
                            {/* Decorative Background Blob */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl"></div>

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <BookOpen size={12} className="text-indigo-400" /> Target Module
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic appearance-none cursor-pointer"
                                        value={formData.batchId}
                                        onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select active batch...</option>
                                        {batches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name} - {b.course}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Calendar size={12} className="text-emerald-400" /> Temporal Stamp
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <FileText size={12} className="text-amber-400" /> Instructional Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Brief title of the session topics..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <CheckCircle size={12} className="text-blue-400" /> Instructional Description
                                </label>
                                <textarea
                                    placeholder="Detail the curriculum delivery, student queries, and key takeaways..."
                                    rows="5"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Paperclip size={12} className="text-rose-400" /> Class Notes Artifact
                                </label>
                                <div className="flex items-center gap-4">
                                    {!formData.fileName ? (
                                        <label className="flex items-center gap-2 px-6 py-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                            <Upload size={16} />
                                            Upload PDF or Text
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.txt"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    ) : (
                                        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl border border-emerald-100 flex-1 group">
                                            <FileText size={18} />
                                            <span className="text-xs font-bold italic flex-1 truncate">{formData.fileName}</span>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-slate-400 italic">Optional archival resources.</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.25em] text-xs hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 relative z-10"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                Commiting Session Report
                            </button>
                        </form>
                    </div>

                    {/* Sidebar / History List */}
                    <div className="space-y-8 flex flex-col">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col">
                            {/* Decorative Elements */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h3 className="text-xl font-black italic flex items-center gap-2">
                                    <History size={20} className="text-indigo-400" />
                                    Archival History
                                </h3>
                                <select
                                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
                                    value={selectedBatchId}
                                    onChange={(e) => setSelectedBatchId(e.target.value)}
                                >
                                    <option value="all" className="bg-slate-800">All Nodes</option>
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id} className="bg-slate-800">{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar-dark relative z-10 flex-1">
                                {filteredLogs.length === 0 ? (
                                    <div className="py-20 text-center text-slate-500 italic opacity-50">
                                        <History size={48} className="mx-auto mb-4" />
                                        <p className="text-xs uppercase tracking-widest font-black">No archival records detected</p>
                                    </div>
                                ) : filteredLogs.map((log, idx) => (
                                    <div key={log.id || idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group cursor-default">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{new Date(log.date).toLocaleDateString()}</p>
                                            <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-tighter rounded-full">
                                                {batches.find(b => String(b.id) === String(log.batchId))?.name || "Independent"}
                                            </div>
                                        </div>
                                        <h4 className="font-black text-white text-sm leading-snug mb-2 uppercase tracking-tight group-hover:text-indigo-300 transition-colors underline decoration-white/20 underline-offset-4">
                                            {log?.title || log?.topic || "Untitled Session"}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed italic">{log.description}</p>

                                        {(log.fileName || log.documentName) && (
                                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <Paperclip size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[120px]">{log.fileName || log.documentName}</span>
                                                </div>
                                                <button className="text-[8px] font-black uppercase text-indigo-400 hover:text-white transition-colors">Download Artifact</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                                <button
                                    onClick={() => navigate("/trainer")}
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 border border-white/10"
                                >
                                    Dashboard Intelligence <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Trainer Tip */}
                        <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100 flex items-start gap-5 italic shadow-sm">
                            <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm flex-shrink-0">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h4 className="text-indigo-900 font-black text-xs uppercase tracking-widest mb-2">Protocol Reminder</h4>
                                <p className="text-indigo-600 text-[11px] font-medium leading-relaxed underline decoration-indigo-200">
                                    Uploading daily class notes as PDF artifacts ensures transparency for analysts and provides persistent resources for student retrieval.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
