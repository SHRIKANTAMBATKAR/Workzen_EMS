import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    Users,
    BookOpen,
    Search,
    ArrowRight,
    Loader2,
    Link2,
    CheckCircle2,
    UserPlus,
    Sparkles,
    Filter,
    Download,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AssignStudents() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBatch, setFilterBatch] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [studentRes, batchRes] = await Promise.all([
                api.get("/students"),
                api.get("/batches")
            ]);
            setStudents(studentRes.data);
            setBatches(batchRes.data.filter(b => b.status === "Active"));
        } catch (error) {
            toast.error("Failed to fetch assignment intelligence");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (studentId, batchId) => {
        setSubmitting(studentId);
        try {
            const url = batchId ? `/students/${studentId}/assign?batchId=${batchId}` : `/students/${studentId}/assign`;
            await api.patch(url);
            toast.success("Entity-Node binding updated");
            fetchData();
        } catch (error) {
            toast.error("Binding orchestration failed");
        } finally {
            setSubmitting(null);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBatch = filterBatch === "all" || student.batchId === filterBatch;
        return matchesSearch && matchesBatch;
    });

    if (loading) {
        return (
            <DashboardLayout allowedRoles={["ANALYST"]}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    // Stats
    const assignedCount = students.filter(s => s.batchId).length;
    const unassignedCount = students.filter(s => !s.batchId).length;

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 min-h-screen p-6">
                {/* Header Block */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 border-b border-emerald-200 pb-12 text-left relative overflow-hidden">
                    <div className="space-y-6 relative z-10 max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                            <Link2 size={16} className="text-emerald-600" />
                            ENTITY_NODE_BINDING_PROTOCOL
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-tight">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Entity
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Linkage
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 font-medium border-l-4 border-emerald-500 pl-6 leading-relaxed">
                            Mapping institutional entities to operational distribution nodes. Experience high-fidelity personnel allocation.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white border-2 border-emerald-200 rounded-xl text-emerald-700 font-bold hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Total Entities</p>
                        <p className="text-3xl font-black text-slate-800">{students.length}</p>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Active Batches</p>
                        <p className="text-3xl font-black text-emerald-600">{batches.length}</p>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Assigned</p>
                        <p className="text-3xl font-black text-emerald-600">{assignedCount}</p>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Unassigned</p>
                        <p className="text-3xl font-black text-amber-600">{unassignedCount}</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-white border border-emerald-200 p-6 rounded-2xl shadow-md">
                    <div className="relative group/search w-full xl:w-96">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus/search:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter Entity Registry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
                        />
                    </div>

                    <div className="flex gap-4 w-full xl:w-auto">
                        <select
                            value={filterBatch}
                            onChange={(e) => setFilterBatch(e.target.value)}
                            className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        >
                            <option value="all">All Batches</option>
                            <option value="unassigned">Unassigned Only</option>
                            {batches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <div className="px-6 py-3.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3">
                            <Users size={18} />
                            <span>Entities: {filteredStudents.length}</span>
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => {
                        const currentBatch = batches.find(b => String(b.id) === String(student.batchId));
                        return (
                            <div key={student.id} className="group p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                                {/* Decorative gradient */}
                                <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

                                <div className="relative z-10 space-y-4">
                                    {/* Header with avatar and status */}
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-emerald-700 font-black text-2xl border-2 border-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 shadow-sm ${student.batchId
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                            {student.batchId ? 'BINDING_ACTIVE' : 'IDLE_ENTITY'}
                                        </span>
                                    </div>

                                    {/* Student Info */}
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">
                                            {student.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium border-l-2 border-emerald-400 pl-3">
                                            {student.email}
                                        </p>
                                    </div>

                                    {/* Current Allocation */}
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                                            Current Allocation
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={18} className={currentBatch ? 'text-emerald-600' : 'text-slate-300'} />
                                            <span className={`font-bold text-sm ${currentBatch ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {currentBatch ? currentBatch.name : 'NULL_ORCHESTRATION'}
                                            </span>
                                        </div>
                                        {currentBatch && (
                                            <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-black uppercase">
                                                <CheckCircle2 size={10} />
                                                <span>Active in batch</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assignment Controls */}
                                <div className="relative z-10 space-y-3 pt-4 mt-2 border-t border-slate-200">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-2">
                                        Protocol Assignment
                                    </label>
                                    <div className="relative group/select">
                                        <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus/select:text-emerald-600 transition-colors" />
                                        <select
                                            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 appearance-none cursor-pointer outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-medium"
                                            value={student.batchId || ""}
                                            onChange={(e) => handleAssign(student.id, e.target.value)}
                                            disabled={submitting === student.id}
                                        >
                                            <option value="" className="bg-white">DECOMMISSION_BINDING</option>
                                            {batches.map(b => (
                                                <option key={b.id} value={b.id} className="bg-white">
                                                    {b.name} ({b.course})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {submitting === student.id ? (
                                                <Loader2 size={16} className="text-emerald-600 animate-spin" />
                                            ) : (
                                                <ArrowRight size={16} className="text-slate-400 group-hover/select:text-emerald-600 group-hover/select:translate-x-1 transition-all" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick action hint */}
                                    {!student.batchId && batches.length > 0 && (
                                        <p className="text-[8px] text-amber-600 font-medium flex items-center gap-1 mt-2">
                                            <TrendingUp size={8} />
                                            Select a batch to assign this entity
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredStudents.length === 0 && (
                    <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-2xl">
                        <Users size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 font-medium">No entities match your filters</p>
                        <button
                            onClick={() => { setSearchTerm(""); setFilterBatch("all"); }}
                            className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Footer Summary */}
                {filteredStudents.length > 0 && (
                    <div className="flex justify-between items-center pt-4 text-sm text-slate-500 border-t border-slate-200">
                        <span>
                            Showing <span className="font-bold text-emerald-600">{filteredStudents.length}</span> of <span className="font-bold text-slate-800">{students.length}</span> entities
                        </span>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                Assigned: {assignedCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                Unassigned: {unassignedCount}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}