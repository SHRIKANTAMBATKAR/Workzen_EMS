import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Users, GraduationCap, TrendingUp, Search, MoreHorizontal, Loader2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CounselorDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setBatches(batchRes.data);
        } catch (error) {
            console.error("Dashboard data fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const enrolledCount = students.filter(s => s.status === "Enrolled").length;
    const leadsCount = students.filter(s => s.status === "Lead").length;
    const pendingCount = students.filter(s => s.status === "Pending").length;

    // Get 5 most recent registrations
    const recentStudents = [...students].sort((a, b) => parseInt(b.id) - parseInt(a.id)).slice(0, 5);

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end text-left">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-white italic">Counselor Hub</h2>
                        <p className="text-slate-400 mt-2 text-lg italic font-medium">Empowering student journeys through expert guidance.</p>
                    </div>
                    <button
                        onClick={() => navigate("/counselor/students")}
                        className="btn-premium-primary flex items-center gap-2 shadow-accent/20 shadow-lg"
                    >
                        <UserPlus size={18} />
                        New Admission
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6 text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">New Leads</p>
                        <h3 className="text-3xl font-black text-white">{loading ? "..." : leadsCount}</h3>
                        <div className="flex items-center gap-1 mt-2 text-blue-500 text-xs font-bold">
                            <TrendingUp size={14} />
                            <span>Inquiry Pipeline</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-b-4 border-b-accent text-left group">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Enrolled</p>
                        <h3 className="text-3xl font-black text-accent">{loading ? "..." : enrolledCount}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">Active Students</p>
                    </div>
                    <div className="glass-card p-6 text-left group">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Pending Follow-ups</p>
                        <h3 className="text-3xl font-black text-orange-500">{loading ? "..." : pendingCount}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">High Priority</p>
                    </div>
                    <div className="glass-card p-6 text-left group">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Active Batches</p>
                        <h3 className="text-3xl font-black text-emerald-500">{loading ? "..." : batches.filter(b => b.status === "Active").length}</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-500 text-[10px] font-black uppercase">
                            <span>Ready for Intake</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 text-left">
                    <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="text-xl font-bold text-white">Recent Registrations</h3>
                            <button
                                onClick={() => navigate("/counselor/students")}
                                className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors"
                            >
                                View full list
                            </button>
                        </div>
                        <div className="divide-y divide-white/5 flex-1">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                                    <Loader2 className="animate-spin text-accent" size={32} />
                                    <span>Updating registrations...</span>
                                </div>
                            ) : recentStudents.map((student, idx) => (
                                <div key={student.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-white/5 text-accent rounded-2xl flex items-center justify-center font-black border border-white/5 group-hover:scale-110 transition-transform">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-accent transition-colors">{student.name}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{student.course} • {student.enrolmentDate || "Recent"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${student.status === "Enrolled" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                            }`}>
                                            {student.status}
                                        </span>
                                        <button className="text-slate-600 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {!loading && recentStudents.length === 0 && (
                                <div className="p-12 text-center text-slate-500 italic">No registrations found.</div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate("/counselor/students")}
                            className="w-full py-4 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 hover:text-white hover:bg-white/5 transition-all border-t border-white/5"
                        >
                            Explore Student Directory
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-8 bg-accent text-white border-none shadow-2xl shadow-accent/40 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <GraduationCap size={48} className="mb-4 opacity-50 relative z-10" />
                            <h3 className="text-2xl font-black mb-2 relative z-10 italic">Admission Kit</h3>
                            <p className="text-accent-50 opacity-80 text-sm mb-6 leading-relaxed relative z-10 font-medium">
                                Download the latest course brochures and admission forms for the 2026 intake.
                            </p>
                            <button className="w-full py-4 bg-white text-accent rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10">
                                Download PDF
                            </button>
                        </div>

                        <div className="glass-card p-8 group">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white italic">Upcoming Counseling</h3>
                                <div className="p-2 bg-white/5 rounded-lg text-slate-500">
                                    <Clock size={16} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { time: "10:30 AM", name: "David Miller" },
                                    { time: "01:00 PM", name: "Jessica Lane" },
                                ].map((slot, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-accent/40 transition-colors">
                                        <div className="text-center border-r border-white/10 pr-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Time</p>
                                            <p className="text-xs font-black text-accent">{slot.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{slot.name}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pre-Admit Call</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
