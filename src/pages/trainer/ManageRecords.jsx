import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    FileText,
    Search,
    Filter,
    Trash2,
    Loader2,
    Calendar,
    BookOpen,
    Paperclip,
    AlertCircle,
    ChevronDown,
    FolderOpen,
    Sparkles,
    Download,
    Pencil,
    X,
    Save,
    CheckCircle
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ManageRecords() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);
    const [batches, setBatches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("all");
    const [deletingId, setDeletingId] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "", date: "", batchId: "" });
    const [saving, setSaving] = useState(false);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || user.role !== "TRAINER") {
            navigate("/login");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logRes, batchRes] = await Promise.all([
                api.get(`/sessionLogs`),
                api.get(`/batches`)
            ]);

            const trainerId = String(user.userId);
            const trainerLogs = (logRes.data || [])
                .filter(l => String(l.trainer?.id || l.trainerId) === trainerId)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            const assignedBatches = (batchRes.data || []).filter(b => String(b.trainer?.id || b.trainerId) === trainerId);

            setRecords(trainerLogs);
            setBatches(assignedBatches);
        } catch (error) {
            toast.error("Failed to fetch records");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        setDeletingId(id);
        try {
            await api.delete(`/sessionLogs/${id}`);
            setRecords(prev => prev.filter(r => r.id !== id));
            toast.success("Record deleted successfully");
        } catch (error) {
            toast.error("Failed to delete record");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDownload = (record) => {
        const fileName = record.fileName || record.documentName;
        if (!fileName && !record.fileData) { // Added check for fileData as well
            toast.error("No file attached to this record");
            return;
        }
        let blob;
        let filename;

        if (record.fileData) {
            // If we have binary data from backend (base64 encoded in JSON)
            const byteCharacters = atob(record.fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: record.fileType || "application/octet-stream" });
            filename = record.fileName || `Record_${record.id}.pdf`;
        } else {
            // Fallback for legacy text-based notes
            const content = [
                `Session Record - ${record.title || record.topicCovered || "Untitled"}`,
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `Date: ${new Date(record.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
                `Batch: ${getBatchName(record.batchId)}`,
                `Attached File: ${record.fileName || record.documentName || "N/A"}`,
                ``,
                `Description:`,
                `${record.description || "No description provided"}`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                `Generated from WorkZen EMS - Manage Records`
            ].join("\n");
            blob = new Blob([content], { type: "text/plain" });
            filename = `Record_${(record.topicCovered || record.title || "session").replace(/\s+/g, "_")}_${record.date}.txt`;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Notes downloaded: ${filename}`);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setEditForm({
            title: record.topicCovered || record.title || record.topic || "",
            description: record.description || "",
            date: record.date ? record.date.split("T")[0] : "",
            batchId: record.batchId || ""
        });
    };

    const closeEditModal = () => {
        setEditingRecord(null);
        setEditForm({ title: "", description: "", date: "", batchId: "" });
    };

    const handleEditSave = async () => {
        if (!editForm.title.trim()) {
            toast.error("Title is required");
            return;
        }
        setSaving(true);
        try {
            const updatedRecord = {
                topicCovered: editForm.title,
                description: editForm.description,
                date: editForm.date,
                batchId: editForm.batchId
            };
            await api.put(`/sessionLogs/${editingRecord.id}`, updatedRecord);
            setRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedRecord : r));
            toast.success("Record updated successfully");
            closeEditModal();
        } catch (error) {
            toast.error("Failed to update record");
        } finally {
            setSaving(false);
        }
    };

    const getBatchName = (batchId) => {
        const batch = batches.find(b => String(b.id) === String(batchId));
        return batch ? (batch.batchName || "—") : "—";
    };

    // Filter records based on search & batch
    const filteredRecords = records.filter(record => {
        const title = (record.topicCovered || record.title || "").toLowerCase();
        const desc = (record.description || "").toLowerCase();
        const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
        const matchesBatch = selectedBatchId === "all" || String(record.batchId) === String(selectedBatchId);
        return matchesSearch && matchesBatch;
    });

    if (loading) {
        return (
            <DashboardLayout allowedRoles={["TRAINER"]}>
                <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={48} />
                    <p className="text-slate-400 text-sm font-bold italic uppercase tracking-widest">Loading Records...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 p-6 text-left">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Data Repository</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">Manage Records</h2>
                        <p className="text-slate-500 mt-2 font-medium italic">View and manage all session records uploaded from Batch Progress.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-3">
                            <FolderOpen size={20} />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Total Records</p>
                                <p className="text-2xl font-black">{records.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search records by title or description..."
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="w-full pl-10 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm appearance-none cursor-pointer"
                            value={selectedBatchId}
                            onChange={(e) => setSelectedBatchId(e.target.value)}
                        >
                            <option value="all">All Batches</option>
                            {batches.map(b => (
                                <option key={b.id} value={b.id}>{b.batchName || b.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Records Table */}
                {filteredRecords.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-20 flex flex-col items-center justify-center text-center">
                        <Sparkles size={56} className="text-slate-200 mb-6" />
                        <h3 className="text-xl font-black text-slate-400 italic mb-2">No Records Found</h3>
                        <p className="text-slate-400 text-sm font-medium italic max-w-md">
                            {searchQuery || selectedBatchId !== "all"
                                ? "No records match your current filters. Try adjusting your search or batch filter."
                                : "You haven't uploaded any session records yet. Head over to Batch Progress to create your first entry."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200">
                            <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <Calendar size={12} className="text-indigo-400" /> Date
                            </div>
                            <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <FileText size={12} className="text-emerald-400" /> Title / Topic
                            </div>
                            <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                <BookOpen size={12} className="text-blue-400" /> Batch
                            </div>
                            <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</div>
                            <div className="col-span-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1">
                                <Paperclip size={12} className="text-amber-400" /> File
                            </div>
                            <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-slate-100">
                            {filteredRecords.map((record, idx) => {
                                const title = record.topicCovered || record.title || "Untitled Session";
                                const fileName = record.fileName || record.documentName;
                                return (
                                    <div
                                        key={record.id || idx}
                                        className="grid grid-cols-12 gap-3 px-6 py-5 hover:bg-indigo-50/40 transition-all group items-center"
                                    >
                                        {/* Date */}
                                        <div className="col-span-2">
                                            <p className="text-xs font-black text-slate-700">
                                                {new Date(record.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>

                                        {/* Title */}
                                        <div className="col-span-2">
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-700 transition-colors truncate">
                                                {title}
                                            </p>
                                        </div>

                                        {/* Batch */}
                                        <div className="col-span-2">
                                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-100 truncate max-w-full">
                                                {getBatchName(record.batchId)}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-2">
                                            <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed font-medium">
                                                {record.description || "No description provided"}
                                            </p>
                                        </div>

                                        {/* File */}
                                        <div className="col-span-1">
                                            {fileName ? (
                                                <div className="flex items-center gap-1 text-emerald-600" title={fileName}>
                                                    <Paperclip size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[60px]">
                                                        {fileName.length > 8 ? fileName.substring(0, 8) + "..." : fileName}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 text-[9px] font-bold uppercase">None</span>
                                            )}
                                        </div>

                                        {/* Actions — Download, Edit, Delete */}
                                        <div className="col-span-3 flex justify-center gap-2">
                                            {/* Download */}
                                            <button
                                                onClick={() => handleDownload(record)}
                                                className={`p-2.5 rounded-xl transition-all border shadow-sm ${fileName
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200"
                                                    : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                                    }`}
                                                title={fileName ? `Download: ${fileName}` : "No file attached"}
                                                disabled={!fileName}
                                            >
                                                <Download size={14} />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => openEditModal(record)}
                                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-all border border-indigo-100 hover:border-indigo-200 shadow-sm"
                                                title="Edit record"
                                            >
                                                <Pencil size={14} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                disabled={deletingId === record.id}
                                                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-all border border-rose-100 hover:border-rose-200 shadow-sm disabled:opacity-50"
                                                title="Delete record"
                                            >
                                                {deletingId === record.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Showing {filteredRecords.length} of {records.length} records
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
                                <AlertCircle size={12} />
                                Records are synced from Batch Progress
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl mx-4 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Pencil size={16} className="text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Edit Mode</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 italic tracking-tight">Edit Record</h3>
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="p-3 bg-white rounded-2xl hover:bg-slate-100 transition-all border border-slate-200 shadow-sm"
                            >
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-10 py-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <BookOpen size={12} className="text-indigo-400" /> Target Module
                                    </label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm appearance-none cursor-pointer"
                                        value={editForm.batchId}
                                        onChange={(e) => setEditForm({ ...editForm, batchId: e.target.value })}
                                    >
                                        <option value="" disabled>Select batch...</option>
                                        {batches.map(b => (
                                            <option key={b.id} value={b.id}>{b.batchName || b.name} - {b.course}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <Calendar size={12} className="text-emerald-400" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm"
                                        value={editForm.date}
                                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <FileText size={12} className="text-amber-400" /> Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Session title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <CheckCircle size={12} className="text-blue-400" /> Description
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 italic text-sm resize-none"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Describe the session..."
                                ></textarea>
                            </div>

                            {/* Attached file info (read-only) */}
                            {(editingRecord.fileName || editingRecord.documentName) && (
                                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-3.5 rounded-2xl border border-emerald-100">
                                    <Paperclip size={16} />
                                    <span className="text-xs font-bold italic flex-1">{editingRecord.fileName || editingRecord.documentName}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Attached</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={closeEditModal}
                                className="px-8 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={saving}
                                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
