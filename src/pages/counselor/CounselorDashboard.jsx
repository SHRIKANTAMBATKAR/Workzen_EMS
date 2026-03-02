import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Users, GraduationCap, TrendingUp, Search, MoreHorizontal, Loader2, Clock, Link2 } from "lucide-react";
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
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-end text-left">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-800 italic">Counselor Hub</h2>
                        <p className="text-slate-500 mt-2 text-lg italic font-medium">Empowering student journeys through expert guidance.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/counselor/assign-batch")}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Link2 size={18} className="text-indigo-600" />
                            Assign Batch
                        </button>
                        <button
                            onClick={() => navigate("/counselor/students")}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <UserPlus size={18} />
                            New Admission
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 text-left relative overflow-hidden group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 blur-2xl group-hover:bg-blue-200 transition-colors"></div>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">New Leads</p>
                        <h3 className="text-3xl font-black text-slate-800">{loading ? "..." : leadsCount}</h3>
                        <div className="flex items-center gap-1 mt-2 text-blue-600 text-xs font-bold">
                            <TrendingUp size={14} />
                            <span>Inquiry Pipeline</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border-b-4 border-b-indigo-500 text-left group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Enrolled</p>
                        <h3 className="text-3xl font-black text-indigo-600">{loading ? "..." : enrolledCount}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">Active Students</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-left group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Pending Follow-ups</p>
                        <h3 className="text-3xl font-black text-amber-600">{loading ? "..." : pendingCount}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">High Priority</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-left group border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Active Batches</p>
                        <h3 className="text-3xl font-black text-emerald-600">{loading ? "..." : batches.filter(b => b.status === "Active").length}</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-600 text-[10px] font-black uppercase">
                            <span>Ready for Intake</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 text-left">
                    <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-200 shadow-md">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Recent Registrations</h3>
                            <button
                                onClick={() => navigate("/counselor/students")}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                View full list
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1">
                            {loading ? (
                                <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                                    <span>Updating registrations...</span>
                                </div>
                            ) : recentStudents.map((student, idx) => (
                                <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black border border-indigo-200 group-hover:scale-110 transition-transform">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{student.name}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{student.course} • {student.enrolmentDate || "Recent"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${student.status === "Enrolled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
                                            }`}>
                                            {student.status}
                                        </span>
                                        <button
                                            onClick={() => navigate("/counselor/students")}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-200"
                                            title="Edit Student"
                                        >
                                            <UserPlus size={18} className="rotate-90" />
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
                            className="w-full py-4 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all border-t border-slate-200"
                        >
                            Explore Student Directory
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white border-none shadow-xl shadow-indigo-200 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <GraduationCap size={48} className="mb-4 opacity-50 relative z-10" />
                            <h3 className="text-2xl font-black mb-2 relative z-10 italic">Admission Kit</h3>
                            <p className="text-indigo-100 opacity-90 text-sm mb-6 leading-relaxed relative z-10 font-medium">
                                Download the latest course brochures and admission forms for the 2026 intake.
                            </p>
                            <button className="w-full py-4 bg-white text-indigo-700 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10">
                                Download PDF
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-8 group border border-slate-200 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-slate-800 italic">Upcoming Counseling</h3>
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <Clock size={16} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { time: "10:30 AM", name: "David Miller" },
                                    { time: "01:00 PM", name: "Jessica Lane" },
                                ].map((slot, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all">
                                        <div className="text-center border-r border-slate-200 pr-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Time</p>
                                            <p className="text-xs font-black text-indigo-600">{slot.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{slot.name}</p>
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