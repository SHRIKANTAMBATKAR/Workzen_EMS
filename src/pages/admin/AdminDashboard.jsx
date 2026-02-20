import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, BookOpen, GraduationCap, Briefcase, PlusCircle, FileText, ArrowUpRight, Shield, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    trainers: 0,
    analysts: 0,
    counselors: 0,
    total: 0
  });

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then(res => res.json())
      .then(data => {
        const counts = data.reduce((acc, user) => {
          if (user.role === "TRAINER") acc.trainers++;
          if (user.role === "ANALYST") acc.analysts++;
          if (user.role === "COUNSELOR") acc.counselors++;
          acc.total++;
          return acc;
        }, { trainers: 0, analysts: 0, counselors: 0, total: 0 });
        setStats(counts);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const quickActions = [
    { name: "Manage Trainers", icon: Briefcase, color: "from-blue-600 to-blue-400", path: "/admin/trainers", desc: "Add, edit or delete faculty" },
    { name: "Manage Analysts", icon: Shield, color: "from-emerald-600 to-emerald-400", path: "/admin/analysts", desc: "System control and oversight" },
    { name: "Manage Counselors", icon: Users, color: "from-indigo-600 to-indigo-400", path: "/admin/counselors", desc: "Admissions and student support" },
  ];

  const statCards = [
    { label: "Faculty Trainers", value: stats.trainers, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Systems Analysts", value: stats.analysts, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Admissions Counselors", value: stats.counselors, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-16 animate-in slide-in-from-bottom-6 duration-1000">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left border-b border-white/5 pb-10">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">System Hub</h2>
            <p className="text-slate-400 text-xl font-medium text-left">Coordinate and manage specialized staff roles.</p>
          </div>
          <button
            onClick={() => navigate("/admin/all-users")}
            className="group bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all shadow-sm"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform text-accent" />
            Full Directory
          </button>
        </div>

        {/* Stats Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-white/5 rounded-xl text-slate-400 border border-white/10">
              <Activity size={24} />
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">System Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statCards.map((card, idx) => (
              <div key={idx} className="glass-card p-8 flex items-center gap-6 group hover:bg-white/[0.08] transition-all">
                <div className={`p-5 ${card.bg} ${card.color} rounded-2xl border border-white/5 group-hover:scale-110 transition-transform`}>
                  <card.icon size={28} />
                </div>
                <div className="text-left">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</p>
                  <h4 className="text-4xl font-black text-white">{card.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Management Section */}
        <div className="space-y-10 text-left max-w-5xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/20">
              <PlusCircle size={24} />
            </div>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Specialized Management
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-start gap-6 p-10 glass-card hover:bg-white/10 transition-all group text-left active:scale-[0.98] relative overflow-hidden h-full rounded-3xl"
                >
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${action.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}></div>

                  <div className={`p-5 bg-gradient-to-br ${action.color} rounded-2xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <span className="font-black text-xl text-white block mb-2 tracking-tight group-hover:text-accent transition-colors">{action.name}</span>
                    <span className="text-sm text-slate-400 font-medium leading-relaxed">{action.desc}</span>
                  </div>
                </button>

              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
