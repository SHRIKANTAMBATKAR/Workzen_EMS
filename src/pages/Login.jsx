import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, UserCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      const authData = {
        token: res.token,
        role: res.role,
        name: res.name,
        email: res.email,
        userId: res.userId,
        loginTime: new Date().toISOString(),
      };

      // Standardize on currentUser for DashboardLayout
      localStorage.setItem("currentUser", JSON.stringify(authData));
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      toast.success(`Welcome back, ${res.name}!`);

      // Role-based redirect
      setTimeout(() => {
        switch (res.role) {
          case "ADMIN": navigate("/admin"); break;
          case "TRAINER": navigate("/trainer"); break;
          case "ANALYST": navigate("/analyst"); break;
          case "COUNSELOR": navigate("/counselor"); break;
          default: navigate("/");
        }
      }, 500);

    } catch (err) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Role-based gradient mapping
  const getRoleGradient = (role) => {
    switch (role) {
      case "ADMIN": return "from-indigo-600 to-purple-600";
      case "TRAINER": return "from-emerald-600 to-teal-600";
      case "ANALYST": return "from-amber-600 to-orange-600";
      case "COUNSELOR": return "from-blue-600 to-cyan-600";
      default: return "from-indigo-600 to-purple-600";
    }
  };

  // Role-based badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "TRAINER": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ANALYST": return "bg-amber-100 text-amber-700 border-amber-200";
      case "COUNSELOR": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden relative font-['Inter']">
      {/* Colorful animated background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-blue-300/30 via-cyan-300/30 to-teal-300/30 rounded-full blur-[120px] animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-gradient-to-r from-amber-300/20 via-orange-300/20 to-red-300/20 rounded-full blur-[100px] animate-pulse"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      {/* Visual Side - Light Theme */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 items-center justify-center p-20 z-10 border-r border-indigo-100/50">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-[120px] -mr-40 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300 to-cyan-300 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className={`w-20 h-20 bg-gradient-to-br ${getRoleGradient(form.role)} rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30 rotate-3 animate-bounce-active group`}>
            <ShieldCheck size={40} className="text-white" />
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-ping" />
          </div>

          <h1 className="text-6xl font-black leading-[1.1] mb-8 tracking-tighter">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Empowering
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent underline decoration-indigo-200/50">
              IT Training
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Excellence.
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Join hundreds of institutes streamlining their operations with WorkZen's secure, role-based platform.
          </p>

          {/* Testimonial card */}
          <div className="mt-16 p-8 bg-white border border-indigo-100/50 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br ${i === 1 ? 'from-indigo-500 to-purple-500' :
                        i === 2 ? 'from-emerald-500 to-teal-500' :
                          i === 3 ? 'from-amber-500 to-orange-500' :
                            'from-blue-500 to-cyan-500'
                        } flex items-center justify-center text-xs font-black text-white shadow-lg hover:-translate-y-1 hover:scale-110 transition-all duration-300 cursor-pointer`}
                    >
                      U{i}
                    </div>
                  ))}
                </div>
                <div className="border-l-2 border-indigo-200 pl-4">
                  <p className="text-sm font-black text-slate-800">Staff Network</p>
                  <p className="text-xs font-bold text-indigo-600">Trusted by 500+ professionals</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold">4.9/5</span>
                <span className="text-slate-400">from 2,500+ reviews</span>
              </div>
            </div>
          </div>

          {/* Role indicator */}
          <div className="mt-8 flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border ${getRoleBadgeColor(form.role)} text-xs font-black uppercase tracking-wider`}>
              Selected: {form.role}
            </div>
            <div className="text-slate-400 text-xs">Switch role to see theme change</div>
          </div>
        </div>
      </div>

      {/* Login Form Side - Light Theme */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md p-12 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-indigo-100/50 shadow-2xl space-y-8 animate-in slide-in-from-right-8 duration-700 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="text-center md:text-left relative z-10">
            <div className="md:hidden flex justify-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${getRoleGradient(form.role)} rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/30`}>
                <ShieldCheck size={32} className="text-white" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>

            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleGradient(form.role)}`}></span>
              Portal Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 text-left relative z-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} className="text-indigo-400" />
                Email ID
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  placeholder="name@workzen.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-slate-800 placeholder:text-slate-400"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} className="text-indigo-400" />
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-slate-800 placeholder:text-slate-400"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <UserCircle size={12} className="text-indigo-400" />
                Domain Role
              </label>
              <div className="relative group">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none z-10" />
                <select
                  className="w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="ADMIN" className="bg-white">Administrator</option>
                  <option value="TRAINER" className="bg-white">Trainer</option>
                  <option value="ANALYST" className="bg-white">Analyst</option>
                  <option value="COUNSELOR" className="bg-white">Counselor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleGradient(form.role)}`}></div>
                </div>
              </div>

              {/* Role preview */}

            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 ml-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">
                Stay Signed In
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${getRoleGradient(form.role)} text-white py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Security Badge */}

          </form>

          {/* Footer */}
          <div className="text-center text-[10px] text-slate-400 border-t border-indigo-100/50 pt-6">
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div >
  );
}

// Star component for ratings
function Star(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}