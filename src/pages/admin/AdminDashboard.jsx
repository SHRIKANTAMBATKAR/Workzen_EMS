import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, BookOpen, GraduationCap, Briefcase, PlusCircle, FileText, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: "Total Trainers", value: "12", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Total Students", value: "120", icon: GraduationCap, color: "text-green-500", bg: "bg-green-50" },
    { title: "Active Batches", value: "8", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Counselors", value: "5", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const quickActions = [
    { name: "Manage Trainers", icon: PlusCircle, color: "bg-blue-600", path: "/admin/trainers" },
    { name: "Manage Analysts", icon: PlusCircle, color: "bg-emerald-600", path: "/admin/analysts" },
    { name: "Manage Counselors", icon: PlusCircle, color: "bg-indigo-600", path: "/admin/counselors" },
    { name: "View Reports", icon: FileText, color: "bg-slate-800", path: "/admin/reports" },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-1000">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">System Overview</h2>
            <p className="text-indigo-200/60 text-xl font-medium">Managing the heart of your digital institute.</p>
          </div>
          <button
            onClick={() => navigate("/admin/all-users")}
            className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/20 transition-all shadow-2xl"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            Manage All Users
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Total Trainers", value: "12", icon: Briefcase, color: "from-blue-400 to-indigo-500" },
            { title: "Total Students", value: "120", icon: GraduationCap, color: "from-purple-400 to-pink-500" },
            { title: "Active Batches", value: "8", icon: BookOpen, color: "from-green-400 to-emerald-500" },
            { title: "Counselors", value: "5", icon: Users, color: "from-orange-400 to-red-500" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card-dark p-8 group cursor-default hover:border-white/20 transition-all hover:transform hover:-translate-y-2 relative overflow-hidden text-left border-none shadow-none">
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-black tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    <ArrowUpRight size={14} />
                    <span>+12%</span>
                  </div>
                </div>

                <div>
                  <p className="text-indigo-200/40 font-bold text-xs uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions & Staff Status */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8 text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <PlusCircle className="text-accent" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "Register Trainer", icon: Users, color: "from-blue-600 to-blue-400", desc: "Add new faculty member" },
                { name: "Enroll Student", icon: GraduationCap, color: "from-emerald-600 to-emerald-400", desc: "Register a new learner" },
                { name: "Create Batch", icon: BookOpen, color: "from-purple-600 to-purple-400", desc: "Plan a new training cycle" },
                { name: "Analytics Report", icon: FileText, color: "from-slate-700 to-slate-500", desc: "Generate system reports" },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(action.path || "/admin/all-users")}
                    className="flex items-center gap-6 p-6 glass-card-dark hover:bg-white/5 transition-all group border-white/5 text-left active:scale-[0.98]"
                  >
                    <div className={`p-4 bg-gradient-to-br ${action.color} rounded-2xl text-white shadow-xl group-hover:rotate-12 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="font-bold text-lg text-white block mb-1">{action.name}</span>
                      <span className="text-xs text-indigo-200/40 font-medium">{action.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card-dark p-10 border-white/5 relative overflow-hidden text-left bg-black/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold mb-10 text-white flex items-center justify-between">
              Live Staff
              <span className="text-[10px] bg-accent/20 text-accent px-3 py-1 rounded-full uppercase tracking-widest font-black">Online</span>
            </h3>
            <div className="space-y-8">
              {[
                { name: "John Doe", role: "Sr. Trainer", status: "Active", initials: "JD" },
                { name: "Sarah Smith", role: "Counselor", status: "Offline", initials: "SS" },
                { name: "Mike Ross", role: "Data Analyst", status: "Active", initials: "MR" },
                { name: "Rachel Zane", role: "Counselor", status: "Active", initials: "RZ" },
              ].map((staff, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sm font-bold text-indigo-100 group-hover:bg-accent/20 group-hover:text-white transition-all">
                      {staff.initials}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-accent transition-colors">{staff.name}</p>
                      <p className="text-[10px] text-indigo-300/40 uppercase font-black tracking-widest">{staff.role}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${staff.status === "Active" ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-white/10"}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
