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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-white overflow-hidden">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-accent to-blue-900 items-center justify-center p-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-40 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">Empowering IT Training Excellence.</h1>
          <p className="text-lg text-blue-100/70 leading-relaxed font-medium">
            Join hundreds of institutes streamlining their operations with WorkZen's secure, role-based platform.
          </p>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-accent bg-slate-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
              ))}
            </div>
            <p className="text-sm font-semibold text-blue-100/60">Trusted by 500+ Staff Members</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white text-slate-900">
        <div className="w-full max-w-md space-y-10 animate-in slide-in-from-right-8 duration-700">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  placeholder="e.g. admin@workzen.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" className="text-xs font-bold text-accent hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">System Role</label>
              <div className="relative group">
                <ShieldCheck size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="ANALYST">Analyst</option>
                  <option value="COUNSELOR">Counselor</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent" />
              <label htmlFor="remember" className="text-sm font-semibold text-slate-600">Remember for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Development Access</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500">ADMIN</p>
                  <p className="text-[11px] font-mono text-accent">admin@workzen.com</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500">PASS</p>
                  <p className="text-[11px] font-mono text-accent">admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}