import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    Plus,
    BookOpen,
    Clock,
    Calendar,
    Search,
    MoreVertical,
    Trash2,
    Edit2,
    Users,
    CheckCircle,
    XCircle,
    Loader2,
    Type,
    UserCheck,
    Activity,
    GraduationCap,
    Sparkles,
    Filter,
    Download,
    TrendingUp,
    ChevronDown
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

export default function BatchManagement() {
    const location = useLocation();
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState(location.pathname === "/analyst/create-batch" ? "manage" : "directory");
    const [editingBatch, setEditingBatch] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
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

    useEffect(() => {
        if (location.pathname === "/analyst/create-batch") {
            setActiveTab("manage");
            setEditingBatch(null);
        } else if (location.pathname === "/analyst/batches") {
            setActiveTab("directory");
        }
    }, [location]);

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
        if (location.pathname === "/analyst/create-batch") {
            navigate("/analyst/batches");
        } else {
            setActiveTab("directory");
        }
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

    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || batch.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const activeCount = batches.filter(b => b.status === "Active").length;
    const inactiveCount = batches.filter(b => b.status === "Inactive").length;
    const completedCount = batches.filter(b => b.status === "Completed").length;

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4 border border-indigo-200">
                            <Sparkles size={16} className="text-indigo-600" />
                            <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Batch Management</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Batch Management
                            </span>
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            Design and schedule training batches
                        </p>
                    </div>


                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Total Batches</p>
                        <p className="text-3xl font-black text-slate-800">{batches.length}</p>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Active</p>
                        <p className="text-3xl font-black text-emerald-600">{activeCount}</p>
                    </div>
                    <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Inactive</p>
                        <p className="text-3xl font-black text-amber-600">{inactiveCount}</p>
                    </div>
                    <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Completed</p>
                        <p className="text-3xl font-black text-blue-600">{completedCount}</p>
                    </div>
                </div>

                {activeTab === "manage" && (
                    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-8 animate-in zoom-in-95 duration-300 text-left shadow-xl">
                        <h3 className="text-xl font-bold mb-6 text-slate-800">
                            {editingBatch ? "Update Batch Configuration" : "Initialize New Batch"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-left">
                            {/* Section 1: Core Configuration */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-indigo-200">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                                    <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Core Configuration</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Batch Name</label>
                                        <div className="relative group">
                                            <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                                                placeholder="e.g. FullStack Elite B1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Course Program</label>
                                        <div className="relative group">
                                            <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="text"
                                                value={form.course}
                                                onChange={e => setForm({ ...form, course: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                                                placeholder="e.g. Advanced System Design"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Logistics & Faculty */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-indigo-200">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                                    <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Logistics & Faculty</h4>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Assigned Trainer</label>
                                        <div className="relative group">
                                            <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <select
                                                value={form.trainerId}
                                                onChange={e => setForm({ ...form, trainerId: e.target.value })}
                                                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Trainer</option>
                                                {trainers.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Start Time</label>
                                        <div className="relative group">
                                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="time"
                                                value={form.startTime}
                                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Operational Days</label>
                                        <div className="relative group">
                                            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="text"
                                                value={form.days}
                                                onChange={e => setForm({ ...form, days: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                                                placeholder="e.g. Mon, Wed, Fri"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Student Capacity</label>
                                        <div className="relative group">
                                            <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <input
                                                type="number"
                                                value={form.capacity}
                                                onChange={e => setForm({ ...form, capacity: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                                                placeholder="e.g. 30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Operational Status */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 pb-2 border-b border-indigo-200">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                                    <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Operational Status</h4>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Execution Status</label>
                                        <div className="relative group">
                                            <Activity size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                            <select
                                                value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}
                                                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 appearance-none cursor-pointer"
                                            >
                                                <option value="Active">Operational / Active</option>
                                                <option value="Inactive">Paused / Inactive</option>
                                                <option value="Completed">Finalized / Completed</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-3.5 rounded-xl font-bold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : editingBatch ? <CheckCircle size={18} /> : <Plus size={18} />}
                                    {editingBatch ? "Update Configuration" : "Initialize Batch"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "directory" && (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
                        {/* Search and Filter Bar */}
                        <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/80">
                            <div className="relative w-full md:w-80">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search batches..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <span className="px-4 py-3 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen size={16} />
                                    Total: {filteredBatches.length}
                                </span>
                            </div>
                        </div>

                        {/* Batch Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-200">
                            {loading ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                                        <p className="font-medium">Loading batches...</p>
                                    </div>
                                </div>
                            ) : filteredBatches.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-slate-500">
                                    <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="font-medium">No batches found matching your criteria</p>
                                </div>
                            ) : filteredBatches.map((batch) => {
                                const trainer = trainers.find(t => String(t.id) === String(batch.trainerId));
                                return (
                                    <div key={batch.id} className="p-6 bg-white hover:bg-slate-50 transition-colors group text-left relative overflow-hidden border-b border-slate-200">
                                        {/* Status-based gradient background */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${batch.status === 'Active' ? 'from-emerald-200/30' :
                                            batch.status === 'Completed' ? 'from-blue-200/30' :
                                                'from-slate-200/30'
                                            } to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                        <div className="relative z-10">
                                            {/* Header with Icon and Status */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-3 items-center">
                                                    <div className={`p-3 rounded-xl ${batch.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                                        batch.status === 'Completed' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-slate-100 text-slate-600'
                                                        } group-hover:scale-110 transition-all duration-300`}>
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                        batch.status === 'Completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            'bg-slate-100 text-slate-700 border-slate-200'
                                                        }`}>
                                                        {batch.status}
                                                    </span>
                                                </div>

                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEdit(batch)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                                                        title="Edit batch"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(batch.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                                        title="Delete batch"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Batch Details */}
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        {batch.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                        {batch.course}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-slate-50 p-2 rounded-lg">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Schedule</p>
                                                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                            <Clock size={12} className="text-indigo-400" />
                                                            {batch.startTime}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-lg">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Capacity</p>
                                                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                            <Users size={12} className="text-indigo-400" />
                                                            {batch.capacity} seats
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-2 rounded-lg">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Schedule Days</p>
                                                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                        <Calendar size={12} className="text-indigo-400" />
                                                        {batch.days}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Trainer Info */}
                                            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-700">
                                                        {trainer?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Trainer</p>
                                                        <p className="text-xs font-bold text-slate-700">
                                                            {trainer?.name || 'Unassigned'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleStatus(batch)}
                                                    className={`p-1.5 rounded-lg border transition-all ${batch.status === 'Active'
                                                        ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                                                        : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                                        }`}
                                                    title={batch.status === 'Active' ? "Deactivate" : "Activate"}
                                                >
                                                    {batch.status === 'Active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Summary */}
                        {!loading && filteredBatches.length > 0 && (
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-sm">
                                <span className="text-slate-600">
                                    Showing <span className="font-bold text-indigo-600">{filteredBatches.length}</span> of <span className="font-bold text-slate-800">{batches.length}</span> batches
                                </span>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                        Active: {activeCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Inactive: {inactiveCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        Completed: {completedCount}
                                    </span>
                                </div>
                            </div>
                        )}
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