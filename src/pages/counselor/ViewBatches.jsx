import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Clock, Calendar, Search, Users, Loader2, Tag, TrendingUp, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function ViewBatches() {
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

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

    const filteredBatches = batches.filter(b =>
        (b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.course.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterStatus === "All" || b.status === filterStatus)
    );

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                {/* Header Section */}
                <div className="text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-3">
                        <BookOpen size={14} />
                        Batch Management
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 italic">Batch Directory</h2>
                    <p className="text-slate-500 mt-1 font-medium italic">Consult current batch schedules and availability.</p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                    <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/80">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by batch name or course..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex gap-3 items-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterStatus("All")}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === "All"
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStatus("Active")}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === "Active"
                                        ? "bg-emerald-600 text-white shadow-md"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilterStatus("Upcoming")}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === "Upcoming"
                                        ? "bg-amber-600 text-white shadow-md"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Upcoming
                                </button>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                <Users size={14} />
                                Active: {batches.filter(b => b.status === "Active").length}
                            </span>
                        </div>
                    </div>

                    {/* Batches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-200">
                        {loading ? (
                            <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500">
                                <Loader2 className="animate-spin text-indigo-600" size={48} />
                                <p className="font-bold italic">Syncing batch schedules...</p>
                            </div>
                        ) : filteredBatches.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                    <Tag size={48} strokeWidth={1} className="opacity-30" />
                                    <p className="text-slate-500 italic font-medium">No matching batches found.</p>
                                </div>
                            </div>
                        ) : filteredBatches.map((batch) => {
                            const trainer = trainers.find(t => String(t.id) === String(batch.trainerId));
                            return (
                                <div key={batch.id} className="p-8 bg-white hover:bg-slate-50/80 transition-all duration-300 group text-left relative overflow-hidden border-b border-slate-200">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Status Badge - Moved to top right */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${batch.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                            }`}>
                                            {batch.status}
                                        </span>
                                    </div>

                                    <div className="relative z-10">
                                        {/* Icon and Title */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-indigo-200">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight italic">
                                                    {batch.name}
                                                </h4>
                                                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-1 mt-1">
                                                    <Tag size={10} />
                                                    {batch.course}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Batch Details Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={12} className="text-indigo-400" />
                                                    Timing
                                                </p>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {batch.startTime}
                                                </p>
                                            </div>
                                            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Users size={12} className="text-indigo-400" />
                                                    Capacity
                                                </p>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {batch.capacity} Seats
                                                </p>
                                            </div>
                                        </div>

                                        {/* Schedule */}
                                        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <Calendar size={12} className="text-indigo-400" />
                                                Operational Spectrum
                                            </p>
                                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                {batch.days}
                                            </p>
                                        </div>

                                        {/* Trainer Info */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-sm font-black text-indigo-700 border border-indigo-200 shadow-sm">
                                                {trainer?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                                    Lead Facilitator
                                                </p>
                                                <p className="text-sm font-bold text-slate-800 italic flex items-center gap-2">
                                                    {trainer?.name || 'To Be Assigned'}
                                                    {trainer && (
                                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[8px] font-black uppercase">
                                                            Active
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="flex-1 py-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-200">
                                                View Details
                                            </button>
                                            <button className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                <TrendingUp size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Summary */}
                    {!loading && filteredBatches.length > 0 && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex justify-between items-center text-xs">
                            <span className="text-slate-600 font-medium">
                                Showing <span className="font-black text-indigo-600">{filteredBatches.length}</span> of <span className="font-black text-slate-800">{batches.length}</span> batches
                            </span>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1 text-slate-600">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    Active: {batches.filter(b => b.status === "Active").length}
                                </span>
                                <span className="flex items-center gap-1 text-slate-600">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                    Upcoming: {batches.filter(b => b.status === "Upcoming").length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}