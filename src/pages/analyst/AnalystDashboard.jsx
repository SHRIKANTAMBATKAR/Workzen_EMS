import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    BookOpen,
    Users,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    TrendingUp,
    BarChart3,
    Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnalystDashboard() {
    const navigate = useNavigate();

    const activeBatches = [
        { name: "React Fullstack B-12", students: 24, progress: 65, status: "Ongoing" },
        { name: "NodeJS Mastery B-03", students: 18, progress: 40, status: "Ongoing" },
        { name: "UI/UX Design B-07", students: 15, progress: 90, status: "Finishing" },
    ];

    // Stats data
    const stats = [
        { label: "Active Batches", value: "14", icon: BookOpen, color: "from-blue-600 to-cyan-600", bgLight: "bg-blue-50", textColor: "text-blue-600", borderColor: "border-blue-200" },
        { label: "Total Students", value: "285", icon: Users, color: "from-emerald-600 to-teal-600", bgLight: "bg-emerald-50", textColor: "text-emerald-600", borderColor: "border-emerald-200" },
        { label: "Pending Assignments", value: "42", icon: Clock, color: "from-amber-600 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-600", borderColor: "border-amber-200" },
    ];

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in fade-in duration-700 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 min-h-screen p-6">
                {/* Header */}
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4 border border-amber-200">
                        <Sparkles size={16} className="text-amber-600" />
                        <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Analyst Dashboard</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Academic Planning
                        </span>
                    </h2>
                    <p className="text-slate-500 text-lg flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Managing batches and curriculum structuring
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`bg-white border-l-4 border-l-${stat.color.split('-')[1]}-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200`}
                                style={{ borderLeftColor: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('emerald') ? '#10b981' : '#f59e0b' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 ${stat.bgLight} rounded-xl border ${stat.borderColor}`}>
                                        <Icon size={24} className={stat.textColor} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                        <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                                    <TrendingUp size={12} className="text-emerald-500" />
                                    <span>+12% from last month</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Batches */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-left">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-800">Recent Batches</h3>
                            </div>
                            <button
                                onClick={() => navigate("/analyst/batches")}
                                className="text-amber-600 font-bold text-sm flex items-center gap-1 hover:text-amber-700 transition-colors group"
                            >
                                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {activeBatches.map((batch, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{batch.name}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <Users size={12} className="text-slate-400" />
                                                {batch.students} Students
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${batch.status === 'Ongoing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {batch.status}
                                                </span>
                                            </p>
                                        </div>
                                        <span className="text-sm font-black text-amber-600">{batch.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                                            style={{ width: `${batch.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Completion</p>
                                <p className="text-lg font-black text-slate-800">65%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Avg. Size</p>
                                <p className="text-lg font-black text-slate-800">19</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Success</p>
                                <p className="text-lg font-black text-emerald-600">92%</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Planning */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-800">Quick Planning</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => navigate("/analyst/batches")}
                                className="flex items-center gap-4 p-5 border-2 border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all group"
                            >
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <BookOpen size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Create New Batch</p>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                                        <Calendar size={10} className="text-slate-400" />
                                        Setup schedule and curriculum
                                    </p>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                            </button>

                            <button
                                onClick={() => navigate("/analyst/assignments")}
                                className="flex items-center gap-4 p-5 border-2 border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                            >
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Assign Students</p>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                                        <Users size={10} className="text-slate-400" />
                                        Link registered students to batches
                                    </p>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>

                        {/* Upcoming Schedule */}
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-amber-500" />
                                Upcoming This Week
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Batch Review Meeting</p>
                                        <p className="text-xs text-slate-500">Today • 3:00 PM</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[8px] font-black uppercase">Required</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Curriculum Planning</p>
                                        <p className="text-xs text-slate-500">Tomorrow • 10:30 AM</p>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[8px] font-black uppercase">Optional</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4">
                    <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
                        <BarChart3 size={20} className="mx-auto mb-2 text-amber-500" />
                        <p className="text-lg font-black text-slate-800">24</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider">Courses</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
                        <Users size={20} className="mx-auto mb-2 text-emerald-500" />
                        <p className="text-lg font-black text-slate-800">8</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider">Trainers</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
                        <Clock size={20} className="mx-auto mb-2 text-blue-500" />
                        <p className="text-lg font-black text-slate-800">156</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider">Hours/Week</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center">
                        <CheckCircle2 size={20} className="mx-auto mb-2 text-purple-500" />
                        <p className="text-lg font-black text-slate-800">12</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider">Completed</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}