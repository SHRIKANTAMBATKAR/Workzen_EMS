import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-white overflow-hidden relative font-['Inter']">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 relative bg-[#020617] items-center justify-center p-20 z-10 border-r border-white/5">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] -mr-40 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-accent/40 rotate-3 animate-pulse">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-6xl font-black leading-[1.1] mb-8 text-white tracking-tighter">
            Empowering <span className="text-accent underline decoration-accent/20">IT Training</span> Excellence.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">
            Join hundreds of institutes streamlining their operations with WorkZen's secure, role-based platform.
          </p>

          <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group backdrop-blur-xl">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/40 transition-all duration-500"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm relative hover:z-20 hover:-translate-y-1 transition-transform">U{i}</div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-tight">Staff Network</p>
                <p className="text-xs font-bold text-slate-500">Trusted by 500+ professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#020617] relative z-10">
        <div className="w-full max-w-md p-12 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-glass space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-2xl shadow-accent/40">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-3 text-white">Welcome Back</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email ID</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  placeholder="name@workzen.com"
                  className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-white placeholder:text-slate-700"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <Lock size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-white placeholder:text-slate-700"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Domain Role</label>
              <div className="relative group">
                <ShieldCheck size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-accent transition-colors pointer-events-none" />
                <select
                  className="w-full pl-14 pr-10 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-white appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="ADMIN" className="bg-[#0f172a] text-white">Administrator</option>
                  <option value="TRAINER" className="bg-[#0f172a] text-white">Trainer</option>
                  <option value="ANALYST" className="bg-[#0f172a] text-white">Analyst</option>
                  <option value="COUNSELOR" className="bg-[#0f172a] text-white">Counselor</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-accent focus:ring-accent/20 transition-all cursor-pointer" />
              <label htmlFor="remember" className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-400 transition-colors">Stay Signed In</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={20} className="animate-bounce-x" />
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}