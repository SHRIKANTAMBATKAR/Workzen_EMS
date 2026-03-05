import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Users,
  BookOpen,
  GraduationCap,
  Briefcase,
  PlusCircle,
  FileText,
  ArrowUpRight,
  Shield,
  Activity,
  Sparkles,
  TrendingUp,
  UserCog,
  BarChart3,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    trainers: 0,
    analysts: 0,
    counselors: 0,
    total: 0
  });

  useEffect(() => {
    api.get("/users")
      .then(res => {
        const data = res.data;
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
    {
      name: "Manage Trainers",
      icon: Briefcase,
      gradient: "from-blue-600 to-indigo-600",
      lightGradient: "from-blue-50 to-indigo-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/admin/trainers",
      desc: "Add, edit or delete faculty",
      stats: `${stats.trainers} active`,
      badgeColor: "bg-blue-500"
    },
    {
      name: "Manage Analysts",
      icon: Shield,
      gradient: "from-emerald-600 to-teal-600",
      lightGradient: "from-emerald-50 to-teal-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      path: "/admin/analysts",
      desc: "System control and oversight",
      stats: `${stats.analysts} active`,
      badgeColor: "bg-emerald-500"
    },
    {
      name: "Manage Counselors",
      icon: Users,
      gradient: "from-purple-600 to-pink-600",
      lightGradient: "from-purple-50 to-pink-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/admin/counselors",
      desc: "Admissions and student support",
      stats: `${stats.counselors} active`,
      badgeColor: "bg-purple-500"
    },
  ];

  const statCards = [
    {
      label: "Faculty Trainers",
      value: stats.trainers,
      icon: Briefcase,
      gradient: "from-blue-600 to-indigo-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      increase: "+12%",
      chart: TrendingUp
    },
    {
      label: "Systems Analysts",
      value: stats.analysts,
      icon: Shield,
      gradient: "from-emerald-600 to-teal-600",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      increase: "+8%",
      chart: TrendingUp
    },
    {
      label: "Admissions Counselors",
      value: stats.counselors,
      icon: Users,
      gradient: "from-purple-600 to-pink-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      increase: "+15%",
      chart: TrendingUp
    },
  ];

  const recentActivities = [
    { action: "New Trainer Added", user: "Dr. Sarah Chen", role: "TRAINER", time: "2 hours ago", color: "blue" },
    { action: "Analyst Permissions Updated", user: "Michael Rodriguez", role: "ANALYST", time: "5 hours ago", color: "emerald" },
    { action: "Counselor Schedule Modified", user: "Jessica Williams", role: "COUNSELOR", time: "1 day ago", color: "purple" },
  ];

  return (
    <DashboardLayout allowedRoles={["ADMIN"]}>
      <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen p-6">
        {/* Welcome Block with Gradient */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left border-b border-indigo-100/50 pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4 border border-indigo-200">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Admin Control Center</span>
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                System Hub
              </span>
            </h2>
            <p className="text-slate-500 text-xl font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Coordinate and manage specialized staff roles
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/admin/all-users")}
              className="group bg-white border-2 border-indigo-200 text-indigo-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Users size={20} className="group-hover:scale-110 transition-transform text-indigo-600" />
              Full Directory
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
              <Zap size={20} className="group-hover:rotate-12 transition-transform" />
              Quick Actions
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600 border border-indigo-200">
                <Activity size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                System Overview
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black">Live</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black">Total: {stats.total}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              const ChartIcon = card.chart;
              return (
                <div
                  key={idx}
                  className={`bg-white p-8 rounded-2xl flex items-start gap-6 group hover:shadow-xl transition-all border ${card.borderColor} relative overflow-hidden`}
                >
                  {/* Decorative gradient */}
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-2xl`}></div>

                  <div className={`p-4 ${card.iconBg} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon size={28} className={card.textColor} />
                  </div>

                  <div className="text-left flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{card.label}</p>
                      <span className={`text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1`}>
                        <ChartIcon size={10} />
                        {card.increase}
                      </span>
                    </div>

                    <h4 className="text-4xl font-black text-slate-800 mb-2">{card.value}</h4>

                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient}`}></div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Staff</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Management Section */}
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600 border border-indigo-200">
              <PlusCircle size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                Specialized Management
              </h3>
              <p className="text-slate-500 text-sm mt-1">Role-based control panels with custom permissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-start gap-5 p-8 bg-white border border-indigo-100/50 rounded-2xl hover:shadow-xl transition-all group text-left active:scale-[0.98] relative overflow-hidden h-full"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  {/* Decorative orbs */}
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-full blur-2xl`}></div>

                  <div className="flex items-center gap-4 w-full relative z-10">
                    <div className={`p-4 ${action.iconBg} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md`}>
                      <Icon size={28} className={action.iconColor} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {action.name}
                        </span>
                        <span className={`px-2 py-1 ${action.badgeColor} text-white text-[8px] font-black rounded-full`}>
                          {action.stats}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 font-medium">{action.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mt-2 relative z-10">
                    <span>Manage Now</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout >
  );
}