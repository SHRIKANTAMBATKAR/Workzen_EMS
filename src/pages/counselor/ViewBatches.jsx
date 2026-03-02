import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Clock, Calendar, Search, Users, Loader2, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function ViewBatches() {
    const [batches, setBatches] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-left">
                    <h2 className="text-3xl font-bold tracking-tight text-white italic">Batch Directory</h2>
                    <p className="text-slate-400 mt-1 font-medium italic">Consult current batch schedules and availability.</p>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by batch name or course..."
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-accent transition-all text-white placeholder:text-slate-600"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-xs font-black uppercase tracking-widest">
                                Total Active: {batches.filter(b => b.status === "Active").length}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-white/5 border-t border-white/5">
                        {loading ? (
                            <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500 italic">
                                <Loader2 className="animate-spin text-accent" size={48} />
                                <p className="font-bold">Syncing batch schedules...</p>
                            </div>
                        ) : filteredBatches.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-600 italic">
                                <Tag size={48} strokeWidth={1} className="mx-auto mb-4 opacity-20" />
                                <p>No matching batches found.</p>
                            </div>
                        ) : filteredBatches.map((batch) => {
                            const trainer = trainers.find(t => String(t.id) === String(batch.trainerId));
                            return (
                                <div key={batch.id} className="p-8 hover:bg-white/[0.02] transition-colors group text-left relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10 flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="p-4 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm border border-accent/20">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${batch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    }`}>
                                                    {batch.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors leading-tight italic">
                                                {batch.name}
                                            </h4>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                                                {batch.course}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Timing</p>
                                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                    <Clock size={14} className="text-accent" />
                                                    {batch.startTime}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Intake</p>
                                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                    <Users size={14} className="text-accent" />
                                                    {batch.capacity} Max
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Operational Spectrum</p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <Calendar size={14} className="text-accent" />
                                                {batch.days}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
                                        <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black text-white border border-white/10">
                                            {trainer?.name.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1 text-[8px]">Facilitator</p>
                                            <p className="text-sm font-bold text-slate-300 italic">
                                                {trainer?.name || 'In Allocation'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
