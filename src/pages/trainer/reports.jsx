import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, Search, Award, AlertTriangle, MessageSquare, Save, Loader2, Filter, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function StudentPerformance() {
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [submitting, setSubmitting] = useState(null);
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentRes, batchRes] = await Promise.all([
                api.get("/students"),
                api.get(`/batches?trainerId=${user.id}`)
            ]);

            // Only show students belonging to this trainer's batches
            const trainerBatchIds = batchRes.data.map(b => b.id);
            const filteredStudents = studentRes.data.filter(s => trainerBatchIds.includes(s.batchId));

            setStudents(filteredStudents);
            setBatches(batchRes.data);
        } catch (error) {
            toast.error("Failed to load performance metrics");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePerformance = async (studentId, field, value) => {
        setSubmitting(studentId);
        try {
            await api.patch(`/students/${studentId}`, { [field]: value });
            setStudents(prev => prev.map(s => s.id === studentId ? { ...s, [field]: value } : s));
            toast.success("Student profile updated");
        } catch (error) {
            toast.error("Cloud synchronization failed");
        } finally {
            setSubmitting(null);
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesBatch = selectedBatch === "all" || s.batchId === selectedBatch;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBatch && matchesSearch;
    });

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-end text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 italic uppercase">Learner Performance Analytics</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">Monitoring academic progression and behavioral indicators.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 flex-1">
                        <div className="relative w-full md:w-64">
                            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search learner..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold italic"
                            />
                        </div>
                        <div className="relative w-full md:w-64">
                            <Filter size={16} className="absolute left-3 top-3 text-slate-400" />
                            <select
                                value={selectedBatch}
                                onChange={e => setSelectedBatch(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold italic appearance-none"
                            >
                                <option value="all">Global Matrix View</option>
                                {batches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Population</p>
                            <p className="text-xl font-black text-slate-800">{students.length}</p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <div className="text-center px-4">
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">High Performers</p>
                            <p className="text-xl font-black text-emerald-600">{students.filter(s => s.performance === "high").length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-indigo-600" size={48} />
                            <p className="font-black uppercase tracking-widest text-xs text-slate-400">Retrieving Learner Profiles...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-slate-400 italic">
                            <Users size={64} className="mx-auto mb-4 opacity-10" />
                            <p>No learners detected in the current filter context.</p>
                        </div>
                    ) : filteredStudents.map((student) => (
                        <div key={student.id} className={`bg-white rounded-3xl p-6 border-2 transition-all group relative overflow-hidden ${student.performance === 'high' ? 'border-emerald-100 shadow-emerald-50' :
                            student.performance === 'low' ? 'border-amber-100 shadow-amber-50' :
                                'border-slate-100 shadow-slate-50'
                            } hover:shadow-xl`}>
                            {student.performance === 'high' && <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full blur-xl opacity-50"></div>}

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-transform group-hover:scale-110 ${student.performance === 'high' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                        student.performance === 'low' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                            'bg-slate-50 border-slate-200 text-slate-400'
                                        }`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black text-slate-800 italic uppercase leading-none mb-1">{student.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {batches.find(b => b.id === student.batchId)?.name || "External Node"}
                                        </p>
                                    </div>
                                </div>
                                {submitting === student.id && <Loader2 size={16} className="animate-spin text-indigo-600" />}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdatePerformance(student.id, "performance", student.performance === "high" ? null : "high")}
                                        className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 transition-all ${student.performance === 'high' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                                            }`}
                                    >
                                        <Award size={14} /> High Asset
                                    </button>
                                    <button
                                        onClick={() => handleUpdatePerformance(student.id, "performance", student.performance === "low" ? null : "low")}
                                        className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 transition-all ${student.performance === 'low' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                                            }`}
                                    >
                                        <Star size={14} /> Flag At-Risk
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 top-3.5">
                                        <MessageSquare size={14} className="text-slate-300" />
                                    </div>
                                    <textarea
                                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-medium text-slate-600 outline-none focus:border-indigo-300 focus:bg-white transition-all h-20 resize-none italic"
                                        placeholder="Enter clinical assessment or behavioral remarks..."
                                        defaultValue={student.remarks || ""}
                                        onBlur={(e) => handleUpdatePerformance(student.id, "remarks", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1">
                                    <AlertTriangle size={12} className={student.performance === 'low' ? 'text-amber-500' : 'text-slate-200'} />
                                    Profile Health
                                </span>
                                <span className={student.performance === 'high' ? 'text-emerald-500' : 'text-slate-400'}>
                                    {student.performance || "Neutral"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
