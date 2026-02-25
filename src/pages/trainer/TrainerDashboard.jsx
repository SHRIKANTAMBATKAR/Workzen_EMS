import DashboardLayout from "../../components/layout/DashboardLayout";
import { BookOpen, Users, Clock, CheckCircle, ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrainerDashboard() {
    const navigate = useNavigate();

    const myBatches = [
        { id: 1, name: "React Fullstack B-12", time: "10:00 AM", students: 24, topic: "Context API & Hooks" },
        { id: 2, name: "NodeJS Mastery B-03", time: "02:00 PM", students: 18, topic: "Express Middleware" },
    ];

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight">Trainer Console</h2>
                        <p className="text-slate-500 mt-2 text-lg">Managing sessions and student attendance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl shadow-blue-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <PlayCircle size={28} />
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Streaming Live</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 underline-offset-4 decoration-white/30">Next Session</h3>
                        <p className="text-blue-100/80 font-medium mb-4">React Fullstack B-12 • 10:00 AM</p>
                        <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                            Start Session
                        </button>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">Attendance Marked</p>
                                <h3 className="text-2xl font-bold">12/14</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total Batches</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500">Total Assigned Students</p>
                                <h3 className="text-2xl font-bold">42</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Unique Learners</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-8">My Active Batches</h3>
                        <div className="space-y-4">
                            {myBatches.map((batch) => (
                                <div key={batch.id} className="p-5 border border-slate-100 rounded-2xl hover:border-accent/40 transition-all hover:bg-slate-50/50 group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{batch.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{batch.time} • {batch.students} Students</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Topic</p>
                                            <p className="text-sm font-semibold text-slate-700">{batch.topic}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/trainer/attendance/${batch.id}`)}
                                            className="px-4 py-2 bg-accent/5 text-accent text-xs font-bold rounded-lg hover:bg-accent hover:text-white transition-all shadow-sm"
                                        >
                                            Mark Attendance
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Session Logs</h3>
                            <button className="text-xs font-bold text-slate-500 hover:text-slate-400">View History</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { date: "Yesterday", batch: "React B-12", topic: "Redux Setup", status: "Completed" },
                                { date: "20 Feb 2026", batch: "NodeJS B-03", topic: "REST API Design", status: "Completed" },
                            ].map((log, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                        <div className="w-0.5 h-full bg-white/10 mt-1"></div>
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">{log.date}</p>
                                        <p className="text-sm font-bold text-white">{log.topic}</p>
                                        <p className="text-xs text-slate-400">{log.batch}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 font-bold text-sm hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2">
                            <PlayCircle size={18} /> Add Training Log
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
