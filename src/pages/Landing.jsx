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
  SparklesIcon,
  StarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

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
      gradient: "from-blue-500 to-indigo-600",
      lightGradient: "from-blue-50 to-indigo-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      stats: "4+ Roles",
      badgeColor: "bg-blue-500"
    },
    {
      icon: AcademicCapIcon,
      title: "Batch Management",
      description: "Create, assign and track batches efficiently with real-time progress monitoring",
      gradient: "from-purple-500 to-pink-600",
      lightGradient: "from-purple-50 to-pink-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      stats: "Unlimited Batches",
      badgeColor: "bg-purple-500"
    },
    {
      icon: UserGroupIcon,
      title: "Attendance Tracking",
      description: "Monitor student attendance with automated tracking and instant insights",
      gradient: "from-green-500 to-emerald-600",
      lightGradient: "from-green-50 to-emerald-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      stats: "98% Accuracy",
      badgeColor: "bg-green-500"
    },
    {
      icon: ChartBarIcon,
      title: "Analytics Dashboard",
      description: "Comprehensive reports and analytics for data-driven decision making",
      gradient: "from-orange-500 to-red-600",
      lightGradient: "from-orange-50 to-red-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      stats: "Real-time Data",
      badgeColor: "bg-orange-500"
    }
  ];

  const stats = [
    { value: "500+", label: "Institutes", gradient: "from-blue-600 to-indigo-600" },
    { value: "50K+", label: "Students", gradient: "from-purple-600 to-pink-600" },
    { value: "98%", label: "Satisfaction", gradient: "from-green-600 to-emerald-600" },
    { value: "24/7", label: "Support", gradient: "from-orange-600 to-red-600" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Director, Tech Academy",
      quote: "WorkZen has fundamentally changed how we handle our training operations. 80% less paperwork, 100% more efficiency.",
      rating: 5,
      image: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Head Trainer, Code Institute",
      quote: "The batch management and attendance tracking are absolute game-changers for our daily operations.",
      rating: 5,
      image: "MC"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-900 overflow-hidden relative font-['Inter']">

      {/* Animated Colorful Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30 rounded-full filter blur-[100px] animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-300/30 via-cyan-300/30 to-teal-300/30 rounded-full filter blur-[80px] animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tl from-amber-300/30 via-orange-300/30 to-red-300/30 rounded-full filter blur-[100px] animate-float animation-delay-4000"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-indigo-100/50 shadow-lg py-3'
        : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter">
                WorkZen
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#solutions" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                Solutions
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#stats" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                Impact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Portal Login</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-xl bg-indigo-100 text-indigo-600">
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
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-5 py-2.5 mb-10 border border-indigo-200/50 shadow-sm animate-bounce-active">
              <SparklesIcon className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-xs font-black text-indigo-700 uppercase tracking-[0.2em]">🚀 Introducing WorkZen EMS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[1]">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Empowering
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                IT Training Excellence
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-14 leading-relaxed font-medium">
              WorkZen EMS helps IT training institutes streamline operations,
              manage professionals, batches, and students in one secure,
              powerful platform. <span className="text-indigo-600 font-bold">Reduce manual work by up to 80%.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate("/login")}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-500 flex items-center space-x-3 w-full sm:w-auto justify-center"
              >
                <span>Get Started Free</span>
                <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white border-2 border-indigo-200 text-indigo-700 px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center shadow-lg"
              >
                <span>Explore Features</span>
                <ChevronDownIcon className="h-5 w-5 animate-bounce" />
              </button>
            </div>

            {/* Floating Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-[2.5rem] border border-indigo-100/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl"></div>
                  <div className={`text-4xl font-black mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-32 px-6 lg:px-10 bg-white/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-20 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
              <StarIconSolid className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Powerful Features</span>
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                State of the Art
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Features
              </span>
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
              >
                {/* Card */}
                <div className="relative bg-white p-8 rounded-[3rem] border border-indigo-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 h-full overflow-hidden text-left">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  {/* Decorative elements */}
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl group-hover:scale-150 transition-all duration-500"></div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <span className={`px-3 py-1.5 ${feature.badgeColor} text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                      {feature.stats}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className={`text-2xl font-black mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRightIcon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-10 rounded-[3rem] border border-indigo-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{testimonial.name}</h4>
                    <p className="text-xs text-indigo-600 font-bold">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-lg italic mb-4">"{testimonial.quote}"</p>

                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIconSolid key={i} className="h-5 w-5 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="relative py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[4rem] p-20 border border-indigo-400/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
            <div className="grid md:grid-cols-4 gap-12 text-center relative z-10">
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">500+</div>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Active Institutes</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">50K+</div>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Students Managed</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">98%</div>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 text-white tracking-tighter">24/7</div>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 tracking-tighter">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Institute?
            </span>
          </h2>
          <p className="text-slate-600 text-xl font-medium mb-12 italic">
            Join 500+ institutes already using WorkZen to transform their training operations.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center space-x-4 mx-auto"
          >
            <span>Start Your Journey</span>
            <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-8">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-indigo-100/50 py-16 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              © 2024 WorkZen EMS. Operations Optimized.
            </span>
          </div>
          <div className="flex space-x-10">
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 bg-white border-2 border-indigo-200 p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 z-50 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <ChevronDownIcon className="h-5 w-5 text-indigo-600 transform rotate-180" />
      </button>

      {/* Add animation keyframes to your global CSS */}
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div >
  );
}