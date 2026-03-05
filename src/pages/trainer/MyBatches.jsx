import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, Clock, Calendar, MapPin, Grid, List, Loader2, Search, ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function MyBatches() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user || user.role !== "TRAINER") {
            navigate("/login");
            return;
        }
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/batches`);
            const trainerId = String(user.userId);
            const assignedBatches = (res.data || []).filter(b => String(b.trainerId) === trainerId);
            setBatches(assignedBatches);
        } catch (error) {
            toast.error("Failed to recover batch allocation data");
            console.error("Fetch batches error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-1000 p-6 text-left">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-1 bg-indigo-600 rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Personnel Allocation</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-800 italic tracking-tighter">My Allocations</h2>
                        <p className="text-slate-500 mt-2 text-lg font-medium italic">Comprehensive overview of assigned training modules.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filter modules..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none font-bold italic shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Batch Grid */}
                {filteredBatches.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-24 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <BookOpen size={48} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">No active allocations detected.</p>
                            <p className="text-slate-300 text-xs">If this is an error, please contact your training analyst.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBatches.map((batch) => (
                            <div key={batch.id} className="group bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:scale-[1.02] flex flex-col relative">
                                {/* Decorative Gradient Blobs */}
                                <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="p-10 space-y-8 flex-1 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl group-hover:bg-indigo-600 group-hover:rotate-6 transition-all shadow-xl shadow-slate-200">
                                            {batch.name.charAt(0)}
                                        </div>
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${batch.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                            {batch.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-black text-slate-800 italic group-hover:text-indigo-600 transition-colors leading-tight">{batch.name}</h3>
                                        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 mt-2">{batch.course}</p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-4 text-slate-600 text-sm font-bold italic">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                                <Clock size={16} />
                                            </div>
                                            {batch.startTime} • {batch.days}
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-600 text-sm font-bold italic">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                                <Calendar size={16} />
                                            </div>
                                            {batch.capacity} Seat Capacity
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-600 text-sm font-bold italic">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                                <MapPin size={16} />
                                            </div>
                                            Managed Remotely
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-0 relative z-10">
                                    <button
                                        onClick={() => navigate(`/trainer/batch-progress`)}
                                        className="w-full py-5 bg-slate-50 text-slate-800 border border-slate-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                                    >
                                        Log instructional activity
                                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
