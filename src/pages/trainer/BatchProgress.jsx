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
            const assignedBatches = (batchRes.data || []).filter(b => String(b.trainer?.id || b.trainerId) === trainerId);
            const trainerLogs = (logRes.data || [])
                .filter(l => String(l.trainer?.id || l.trainerId) === trainerId)
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
            const formDataToSend = new FormData();
            formDataToSend.append("date", formData.date);
            formDataToSend.append("topicCovered", formData.title);
            formDataToSend.append("notes", formData.description); // Changed from formData.notes to formData.description
            formDataToSend.append("completionPercentage", 100); // Changed from parseInt(formData.completion) to 100
            formDataToSend.append("batchId", formData.batchId);
            formDataToSend.append("trainerId", user.userId);

            if (uploadingFile) {
                formDataToSend.append("file", uploadingFile);
            }

            await api.post("/sessionLogs/upload", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Instructional record synchronized successfully!");

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
                .filter(l => String(l.trainer?.id || l.trainerId) === trainerId)
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setLogs(trainerLogs);
        } catch (error) {
            toast.error("Log commitment failure: Terminal error");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLogs = logs.filter(log => selectedBatchId === "all" || String(log.batch?.id || log.batchId) === String(selectedBatchId));

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
                                        <BookOpen size={12} className="text-indigo-400" /> Batch Name
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic appearance-none cursor-pointer"
                                        value={formData.batchId}
                                        onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select active batch...</option>
                                        {batches.map(b => (
                                            <option key={b.id} value={b.id}>{b.batchName} - {b.course}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Calendar size={12} className="text-emerald-400" /> Time
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
                                    <FileText size={12} className="text-amber-400" /> Topic
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
                                    <CheckCircle size={12} className="text-blue-400" /> Description
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
                                    <Paperclip size={12} className="text-rose-400" /> Class Notes
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


                </div>
            </div>
        </DashboardLayout>
    );
}
