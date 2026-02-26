import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, BookOpen, Clock, Calendar, Search, MoreVertical, Trash2, Edit2, Users, CheckCircle, XCircle, Loader2, Type, UserCheck, Activity, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

export default function BatchManagement() {
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState("directory"); // "directory" or "manage"
    const [editingBatch, setEditingBatch] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState(null);
    const [form, setForm] = useState({
        name: "",
        course: "",
        startTime: "",
        days: "",
        capacity: "",
        trainerId: "",
        status: "Active"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [batchRes, trainerRes] = await Promise.all([
                api.get("/batches"),
                api.get("/users?role=TRAINER")
            ]);
            setBatches(batchRes.data);
            setTrainers(trainerRes.data);
        } catch (error) {
            toast.error("Failed to synchronize with server");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.course || !form.trainerId || !form.startTime || !form.days || !form.capacity) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            if (editingBatch) {
                const response = await api.patch(`/batches/${editingBatch.id}`, form);
                if (response.status === 200) {
                    toast.success("Batch configuration updated");
                    resetForm();
                    fetchData();
                }
            } else {
                const response = await api.post("/batches", {
                    ...form,
                    id: String(Date.now())
                });
                if (response.status === 201) {
                    toast.success("New batch initialized");
                    resetForm();
                    fetchData();
                }
            }
        } catch (error) {
            toast.error("Server synchronization failed");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            course: "",
            startTime: "",
            days: "",
            capacity: "",
            trainerId: "",
            status: "Active"
        });
        setEditingBatch(null);
        setActiveTab("directory");
    };

    const handleEdit = (batch) => {
        setEditingBatch(batch);
        setForm({
            name: batch.name,
            course: batch.course,
            startTime: batch.startTime,
            days: batch.days,
            capacity: batch.capacity,
            trainerId: batch.trainerId,
            status: batch.status
        });
        setActiveTab("manage");
    };

    const handleDelete = (id) => {
        setBatchToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!batchToDelete) return;
        setSubmitting(true);
        try {
            const response = await api.delete(`/batches/${batchToDelete}`);
            if (response.status === 200) {
                toast.success("Batch removed from system");
                fetchData();
                setIsDeleteModalOpen(false);
                setBatchToDelete(null);
            }
        } catch (error) {
            toast.error("Deletion failed");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (batch) => {
        const newStatus = batch.status === "Active" ? "Inactive" : "Active";
        try {
            await api.patch(`/batches/${batch.id}`, { status: newStatus });
            toast.success(`Batch ${newStatus.toLowerCase()}`);
            fetchData();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white italic">Batch Management</h2>
                        <p className="text-slate-400 mt-1 font-medium italic">Design and schedule training batches.</p>
                    </div>

                    <div className="flex bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("directory")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'directory' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <BookOpen size={18} />
                            Batch Directory
                        </button>
                        <button
                            onClick={() => setActiveTab("manage")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'manage' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {editingBatch ? <Edit2 size={18} /> : <Plus size={18} />}
                            {editingBatch ? "Edit Configuration" : "New Batch"}
                        </button>
                    </div>
                </div>

                {activeTab === "manage" && (
                    <div className="glass-card p-8 animate-in zoom-in-95 duration-300 text-left">
                        <h3 className="text-xl font-bold mb-6 text-white">
                            {editingBatch ? "Update Batch Configuration" : "Initialize New Batch"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10 text-left">
                            {/* Section 1: Core Configuration */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"></div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Core Configuration</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Batch Name</label>
                                        <div className="relative group">
                                            <Type size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="input-premium-with-icon"
                                                placeholder="e.g. FullStack Elite B1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Course Program</label>
                                        <div className="relative group">
                                            <GraduationCap size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="text"
                                                value={form.course}
                                                onChange={e => setForm({ ...form, course: e.target.value })}
                                                className="input-premium-with-icon"
                                                placeholder="e.g. Advanced System Design"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Logistics & Faculty */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"></div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Logistics & Faculty</h4>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Assigned Trainer</label>
                                        <div className="relative group">
                                            <UserCheck size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <select
                                                value={form.trainerId}
                                                onChange={e => setForm({ ...form, trainerId: e.target.value })}
                                                className="input-premium-with-icon bg-slate-900/50 appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Trainer</option>
                                                {trainers.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <MoreVertical size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Start Time</label>
                                        <div className="relative group">
                                            <Clock size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="time"
                                                value={form.startTime}
                                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                                className="input-premium-with-icon [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Operational Days</label>
                                        <div className="relative group">
                                            <Calendar size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="text"
                                                value={form.days}
                                                onChange={e => setForm({ ...form, days: e.target.value })}
                                                className="input-premium-with-icon"
                                                placeholder="e.g. Mon, Wed, Fri"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Student Capacity</label>
                                        <div className="relative group">
                                            <Users size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <input
                                                type="number"
                                                value={form.capacity}
                                                onChange={e => setForm({ ...form, capacity: e.target.value })}
                                                className="input-premium-with-icon"
                                                placeholder="e.g. 30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Operational Status */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"></div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Status</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Execution Status</label>
                                        <div className="relative group">
                                            <Activity size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                            <select
                                                value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}
                                                className="input-premium-with-icon bg-slate-900/50 appearance-none cursor-pointer"
                                            >
                                                <option value="Active">Operational / Active</option>
                                                <option value="Inactive">Paused / Inactive</option>
                                                <option value="Completed">Finalized / Completed</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <MoreVertical size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-white transition-all hover:bg-white/5"
                                >
                                    Discard Changes
                                </button>
                                <button type="submit" disabled={submitting} className="btn-premium-primary px-10 flex items-center gap-2 shadow-accent/20 shadow-lg">
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : editingBatch ? <CheckCircle size={18} /> : <Plus size={18} />}
                                    {editingBatch ? "Update Configuration" : "Initialize Batch"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "directory" && (
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="relative w-72">
                                <Search size={18} className="absolute left-4 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search batches..."
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-accent text-white placeholder:text-slate-600"
                                />
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Active: {batches.length}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-white/5">
                            {batches.map((batch) => {
                                const trainer = trainers.find(t => String(t.id) === String(batch.trainerId));
                                return (
                                    <div key={batch.id} className="p-8 hover:bg-white/[0.02] transition-colors group text-left relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${batch.status === 'Active' ? 'from-emerald-500/5' : 'from-slate-500/5'} to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                        <div className="relative z-10 flex justify-between items-start mb-6">
                                            <div className="flex gap-4 items-center">
                                                <div className="p-4 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm border border-accent/20">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        batch.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                        }`}>
                                                        {batch.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(batch); }}
                                                    className="p-2.5 text-slate-500 hover:text-accent hover:bg-accent/10 rounded-xl transition-all border border-transparent hover:border-accent/20 z-20"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(batch.id); }}
                                                    className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 z-20"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative z-10 space-y-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors leading-tight">
                                                    {batch.name}
                                                </h4>
                                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                                    {batch.course}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Schedule</p>
                                                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                        <Clock size={14} className="text-accent" />
                                                        {batch.startTime}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Capacity</p>
                                                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                                                        <Users size={14} className="text-accent" />
                                                        {batch.capacity} Students
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Facility Access</p>
                                                <div className="flex items-center gap-2 text-white font-medium text-sm mb-4">
                                                    <Calendar size={14} className="text-accent" />
                                                    {batch.days}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between mt-4 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-inner">
                                                    {trainer?.name.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1">Assigned Trainer</p>
                                                    <p className="text-sm font-bold text-slate-300">
                                                        {trainer?.name || 'Unassigned'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleStatus(batch)}
                                                className={`p-2 rounded-xl border transition-all ${batch.status === 'Active' ? 'text-red-500 border-red-500/20 hover:bg-red-500/10' : 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10'
                                                    }`}
                                                title={batch.status === 'Active' ? "Deactivate" : "Activate"}
                                            >
                                                {batch.status === 'Active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Decommission Batch"
                message="Are you sure you want to permanently remove this training batch from the system? This action cannot be undone."
            />
        </DashboardLayout>
    );
}
