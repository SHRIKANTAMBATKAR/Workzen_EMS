import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Role Based Access",
      description: "Secure dashboards for Admin, Trainer, Analyst and Counselor with custom permissions",
      color: "from-blue-400 to-indigo-500",
      stats: "4+ Roles"
    },
    {
      icon: AcademicCapIcon,
      title: "Batch Management",
      description: "Create, assign and track batches efficiently with real-time progress monitoring",
      color: "from-purple-400 to-pink-500",
      stats: "Unlimited Batches"
    },
    {
      icon: UserGroupIcon,
      title: "Attendance Tracking",
      description: "Monitor student attendance with automated tracking and instant insights",
      color: "from-green-400 to-emerald-500",
      stats: "98% Accuracy"
    },
    {
      icon: ChartBarIcon,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and analytics for data-driven decision making",
      color: "from-orange-400 to-red-500",
      stats: "Real-time Data"
    }
  ];

  const stats = [
    { value: "500+", label: "Institutes" },
    { value: "50K+", label: "Students" },
    { value: "98%", label: "Satisfaction" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-['Inter']">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-400/20 rounded-full filter blur-[80px] animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full filter blur-[100px] animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3'
        : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:rotate-6 transition-transform">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                WorkZen
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#solutions" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Solutions</a>
              <a href="#stats" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Impact</a>
              <button
                onClick={() => navigate("/login")}
                className="bg-accent text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Portal Login</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-xl bg-white/5 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-44 pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/5 rounded-full px-5 py-2.5 mb-10 border border-white/10 shadow-glass animate-bounce-active">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">🚀 Introducing WorkZen EMS 2.0</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[1] text-white">
              Empowering <span className="text-accent underline decoration-accent/10">IT Training</span>
              <br />
              Excellence Today.
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-xl text-slate-400 mb-14 leading-relaxed font-medium">
              WorkZen EMS helps IT training institutes streamline operations,
              manage professionals, batches, and students in one secure,
              powerful platform. Reduce manual work by up to 80%.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate("/login")}
                className="group bg-white text-[#020617] px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-500 flex items-center space-x-3 w-full sm:w-auto justify-center shadow-2xl shadow-accent/20"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center shadow-glass"
              >
                <span>Explore Features</span>
                <ChevronDownIcon className="h-5 w-5 animate-bounce" />
              </button>
            </div>

            {/* Floating Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-glass hover:bg-white/10 transition-all duration-500 group">
                  <div className="text-3xl font-black text-white mb-1 group-hover:text-accent transition-colors">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-32 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-20 text-left">
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-white">
              State of the Art Features
            </h2>
            <p className="text-slate-500 font-bold max-w-2xl text-sm uppercase tracking-widest">
              Everything you need to manage your training institute efficiently
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Card */}
                <div className="relative bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-glass hover:bg-white/[0.08] transition-all duration-500 hover:transform hover:-translate-y-4 h-full overflow-hidden text-left">
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500"></div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-accent transition-all duration-500 group-hover:rotate-6`}>
                    <feature.icon className="h-8 w-8 text-slate-500 group-hover:text-white transition-colors" />
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-10 right-10 p-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {feature.stats}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black mb-4 text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="relative py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#020617] rounded-[4rem] p-20 border border-white/5 shadow-glass relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/50 via-transparent to-transparent"></div>
            <div className="grid md:grid-cols-4 gap-12 text-center relative z-10">
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">500+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Institutes</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">50K+</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Students Managed</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">98%</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">24/7</div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 tracking-tighter text-white">
            Ready to Transform Your Institute?
          </h2>
          <p className="text-slate-400 text-xl font-medium mb-12 italic">
            "WorkZen has fundamentally changed how we handle our training operations."
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group bg-accent text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-accent/50 active:scale-95 transition-all duration-300 flex items-center space-x-4 mx-auto shadow-2xl shadow-accent/20"
          >
            <span>Start Your Journey</span>
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-8">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16 px-6 lg:px-10 bg-[#020617]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400">
          <div className="mb-8 md:mb-0 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-4 w-4 text-slate-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">© 2024 WorkZen EMS. Operations Optimized.</span>
          </div>
          <div className="flex space-x-10">
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-accent transition-colors">Terms</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] shadow-glass hover:bg-white/10 hover:-translate-y-1 transition-all duration-500 z-50 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <ChevronDownIcon className="h-5 w-5 text-white transform rotate-180" />
      </button>
    </div>
  );
}