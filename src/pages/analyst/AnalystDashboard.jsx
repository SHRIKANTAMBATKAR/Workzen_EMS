import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnalystDashboard() {
    const navigate = useNavigate();

    const activeBatches = [
        { name: "React Fullstack B-12", students: 24, progress: 65, status: "Ongoing" },
        { name: "NodeJS Mastery B-03", students: 18, progress: 40, status: "Ongoing" },
        { name: "UI/UX Design B-07", students: 15, progress: 90, status: "Finishing" },
    ];

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-white">Academic Planning</h2>
                    <p className="text-slate-400 mt-2 text-lg text-left">Managing batches and curriculum structuring.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Active Batches</p>
                                <h3 className="text-2xl font-bold text-white">14</h3>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Total Students</p>
                                <h3 className="text-2xl font-bold text-white">285</h3>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-l-orange-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Pending Assignments</p>
                                <h3 className="text-2xl font-bold text-white">42</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 text-left">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Recent Batches</h3>
                            <button
                                onClick={() => navigate("/analyst/batches")}
                                className="text-accent font-semibold text-sm flex items-center gap-1 hover:underline"
                            >
                                View All <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {activeBatches.map((batch, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{batch.name}</p>
                                            <p className="text-xs text-slate-500">{batch.students} Students • {batch.status}</p>
                                        </div>
                                        <span className="text-sm font-bold text-slate-400">{batch.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent transition-all duration-1000"
                                            style={{ width: `${batch.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 text-left">
                        <h3 className="text-xl font-bold mb-6 text-white">Quick Planning</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => navigate("/analyst/batches")}
                                className="flex items-center gap-4 p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group"
                            >
                                <div className="p-3 bg-accent text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <BookOpen size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Create New Batch</p>
                                    <p className="text-xs text-slate-500 font-medium">Setup schedule and curriculum</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate("/analyst/assignments")}
                                className="flex items-center gap-4 p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group"
                            >
                                <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">Assign Students</p>
                                    <p className="text-xs text-slate-500 font-medium">Link registered students to batches</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
