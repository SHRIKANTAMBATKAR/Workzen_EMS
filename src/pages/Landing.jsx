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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-lg shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                WorkZen EMS
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-indigo-100 hover:text-white transition-colors">Features</a>
              <a href="#solutions" className="text-indigo-100 hover:text-white transition-colors">Solutions</a>
              <a href="#stats" className="text-indigo-100 hover:text-white transition-colors">Impact</a>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span>Login</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <span className="text-sm font-medium text-indigo-200">🚀 Introducing WorkZen EMS 2.0</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Smart Employee
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
              WorkZen EMS helps IT training institutes streamline operations, 
              manage trainers, analysts, counselors, batches, and students in one secure, 
              powerful platform. Reduce manual work by up to 80%.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/login")}
                className="group bg-white text-indigo-600 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <span>Explore Features</span>
                <ChevronDownIcon className="h-5 w-5 animate-bounce" />
              </button>
            </div>

            {/* Floating Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-indigo-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Everything you need to manage your training institute efficiently in one place
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
                
                {/* Card */}
                <div className="relative bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:-translate-y-2 h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                    {feature.stats}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className={`absolute bottom-4 left-6 right-6 h-0.5 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">500+</div>
                <div className="text-indigo-200">Active Institutes</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">50K+</div>
                <div className="text-indigo-200">Students Managed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">98%</div>
                <div className="text-indigo-200">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">24/7</div>
                <div className="text-indigo-200">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Ready to Transform Your Institute?
            </span>
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join 500+ training institutes already using WorkZen EMS to streamline their operations
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <span>Start Free Trial</span>
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-indigo-300 text-sm mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-indigo-200 text-sm">
          <div className="mb-4 md:mb-0">
            © 2024 WorkZen EMS. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-white/10 backdrop-blur-lg p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronDownIcon className="h-6 w-6 text-white transform rotate-180" />
      </button>
    </div>
  );
}