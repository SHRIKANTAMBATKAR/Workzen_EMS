import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { registerAdmin } from "../services/authService";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, "")))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        mobile: form.mobile.trim(),
      };

      await registerAdmin(payload);
      toast.success("Admin account created successfully! Please log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-4 bg-slate-50 border rounded-xl outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-400 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    }`;

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (p.length < 8) return { label: "Fair", color: "bg-amber-400", width: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden relative font-['Inter']">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-blue-300/30 via-cyan-300/30 to-teal-300/30 rounded-full blur-[120px] animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-gradient-to-r from-violet-300/20 via-indigo-300/20 to-purple-300/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 items-center justify-center p-20 z-10 border-r border-indigo-100/50">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-[120px] -mr-40 -mt-20" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300 to-cyan-300 rounded-full blur-[100px] -ml-20 -mb-20" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30 rotate-3">
            <ShieldCheck size={40} className="text-white" />
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-ping" />
          </div>

          <h1 className="text-5xl font-black leading-[1.1] mb-6 tracking-tighter">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Create Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Account
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10">
            Set up your administrator profile and take full control of the
            WorkZen EMS platform.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Full platform access & control" },
              { icon: User, text: "Manage trainers, analysts & counselors" },
              { icon: CheckCircle2, text: "Real-time dashboards & reports" },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-slate-700 font-semibold text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-indigo-100/50 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center md:text-left">
            <div className="md:hidden flex justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                <ShieldCheck size={28} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Admin Registration
              </h2>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" />
              Create your administrator account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-left">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User size={11} className="text-indigo-400" /> Full Name
              </label>
              <div className="relative group">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type="text"
                  name="name"
                  id="reg-name"
                  placeholder="John Doe"
                  className={inputClass("name")}
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={11} className="text-indigo-400" /> Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  id="reg-email"
                  placeholder="admin@workzen.com"
                  className={inputClass("email")}
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={11} className="text-indigo-400" /> Mobile Number
              </label>
              <div className="relative group">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type="tel"
                  name="mobile"
                  id="reg-mobile"
                  placeholder="9876543210"
                  maxLength={10}
                  className={inputClass("mobile")}
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.mobile}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={11} className="text-indigo-400" /> Password
              </label>
              <div className="relative group">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="reg-password"
                  placeholder="••••••••"
                  className={`${inputClass("password")} pr-12`}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Password strength bar */}
              {strength && (
                <div className="ml-1 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                      />
                    </div>
                    <span className={`text-xs font-bold ${
                      strength.label === "Weak" ? "text-red-500" :
                      strength.label === "Fair" ? "text-amber-500" :
                      strength.label === "Good" ? "text-blue-500" : "text-emerald-500"
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 font-semibold ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={11} className="text-indigo-400" /> Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  id="reg-confirm-password"
                  placeholder="••••••••"
                  className={`${inputClass("confirmPassword")} pr-12`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2
                    size={17}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500"
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-semibold ml-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-admin-btn"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300 disabled:opacity-60 shadow-lg mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center relative z-10 border-t border-indigo-100/50 pt-5">
            <p className="text-sm text-slate-500 font-semibold">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-black inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} />
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
