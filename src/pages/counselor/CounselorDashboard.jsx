import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Users, GraduationCap, TrendingUp, Search, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CounselorDashboard() {
    const navigate = useNavigate();

    const recentAdmissions = [
        { name: "Alice Thompson", course: "Data Science", status: "Enrolled", date: "2 mins ago" },
        { name: "Bob Wilson", course: "Cybersecurity", status: "Pending", date: "15 mins ago" },
        { name: "Charlie Davis", course: "Fullstack Java", status: "Enrolled", date: "1 hour ago" },
    ];

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold tracking-tight">Student Lifecycle</h2>
                        <p className="text-slate-500 mt-2 text-lg">Managing registrations and student success.</p>
                    </div>
                    <button
                        onClick={() => navigate("/counselor/students")}
                        className="btn-premium-primary flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        Register Student
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6">
                        <p className="text-slate-500 font-medium mb-1">New Leads</p>
                        <h3 className="text-3xl font-bold">24</h3>
                        <div className="flex items-center gap-1 mt-2 text-blue-500 text-sm font-bold">
                            <TrendingUp size={14} />
                            <span>+8 this week</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-b-4 border-b-accent">
                        <p className="text-slate-500 font-medium mb-1">Total Admissions</p>
                        <h3 className="text-3xl font-bold text-accent">152</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Session 2026</p>
                    </div>
                    <div className="glass-card p-6">
                        <p className="text-slate-500 font-medium mb-1">Fee Pending</p>
                        <h3 className="text-3xl font-bold text-orange-500">12</h3>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">High Priority</p>
                    </div>
                    <div className="glass-card p-6">
                        <p className="text-slate-500 font-medium mb-1">Placement Ready</p>
                        <h3 className="text-3xl font-bold text-emerald-500">38</h3>
                        <div className="flex items-center gap-1 mt-2 text-emerald-500 text-xs font-bold">
                            <span>Verified Profiles Only</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 text-left">
                    <div className="lg:col-span-2 glass-card overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Recent Registrations</h3>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Find student..."
                                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-64"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentAdmissions.map((student, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-accent/5 text-accent rounded-full flex items-center justify-center font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{student.name}</p>
                                            <p className="text-xs text-slate-500">{student.course} • {student.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.status === "Enrolled" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                            }`}>
                                            {student.status}
                                        </span>
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate("/counselor/students")}
                            className="w-full py-4 text-sm font-bold text-accent hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                            View All Students
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-8 bg-accent text-white border-none shadow-xl shadow-accent/20">
                            <GraduationCap size={48} className="mb-4 opacity-50" />
                            <h3 className="text-2xl font-bold mb-2">Admission Kit</h3>
                            <p className="text-accent-50 opacity-80 text-sm mb-6 leading-relaxed">
                                Download the latest course brochures and admission forms for the 2026 intake.
                            </p>
                            <button className="w-full py-3 bg-white text-accent rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
                                Download PDF
                            </button>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-lg font-bold mb-4">Upcoming Counseling</h3>
                            <div className="space-y-4">
                                {[
                                    { time: "10:30 AM", name: "David Miller" },
                                    { time: "01:00 PM", name: "Jessica Lane" },
                                ].map((slot, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="text-center border-r border-slate-200 pr-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">TIme</p>
                                            <p className="text-xs font-bold text-slate-700">{slot.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{slot.name}</p>
                                            <p className="text-[10px] text-accent font-bold uppercase">Pre-Admit Call</p>
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
