import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Trash2, Mail, Shield, User, ArrowLeft, Search, Filter, MoreVertical, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "TRAINER",
        password: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load staff directory");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        const newUser = {
            id: String(Date.now()),
            ...form,
            active: true
        };

        try {
            const response = await api.post("/users", newUser);

            if (response.status === 201) {
                toast.success("Staff profile initialized in database");
                setForm({ name: "", email: "", role: "TRAINER", password: "" });
                fetchUsers();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Failed to persist user data");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);

            if (response.status === 200) {
                toast.success("Staff profile purged from database");
                fetchUsers();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Failed to remove staff profile");
        }
    };

    const roleStyles = {
        ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
        TRAINER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        ANALYST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        COUNSELOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">Staff Directory</h2>
                        <p className="text-slate-400 text-xl font-medium text-left">Provision and manage institute access.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin")}
                        className="group bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Add User Form Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-10 h-fit lg:sticky lg:top-32 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>

                            <div className="flex items-center gap-4 mb-10 relative z-10">
                                <div className="p-4 bg-accent/10 text-accent rounded-2xl border border-accent/20">
                                    <UserPlus size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Provision Member</h3>
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Access Control</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-8 relative z-10 text-left">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Member Name</label>
                                    <div className="relative group">
                                        <User size={20} className="input-icon group-focus-within:text-accent transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="input-premium-with-icon focus:border-accent/40 focus:ring-accent/5 placeholder:text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Endpoint</label>
                                    <div className="relative group">
                                        <Mail size={20} className="input-icon group-focus-within:text-accent transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="member@workzen.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="input-premium-with-icon focus:border-accent/40 focus:ring-accent/5 placeholder:text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
                                    <div className="relative group">
                                        <Key size={20} className="input-icon group-focus-within:text-accent transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Set secure password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="input-premium-with-icon focus:border-accent/40 focus:ring-accent/5 placeholder:text-slate-700 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">System Privilege</label>
                                    <div className="relative group">
                                        <Shield size={20} className="input-icon group-focus-within:text-accent transition-colors" />
                                        <select
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            className="input-premium-with-icon appearance-none cursor-pointer focus:border-accent/40 focus:ring-accent/5 font-medium"
                                        >
                                            <option value="ADMIN" className="bg-slate-900">Administrator</option>
                                            <option value="TRAINER" className="bg-slate-900">Training Faculty</option>
                                            <option value="ANALYST" className="bg-slate-900">Systems Analyst</option>
                                            <option value="COUNSELOR" className="bg-slate-900">Admissions Counselor</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <MoreVertical size={14} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-gradient-to-r from-accent to-blue-600 hover:from-blue-600 hover:to-accent text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                                    Initialize Account
                                    <UserPlus size={18} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Staff List Table Section */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Table Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative group w-full sm:w-80">
                                <Search size={18} className="input-icon group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search directory..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-premium-with-icon py-3.5 focus:border-accent/40 transition-all text-sm placeholder:text-slate-700 font-medium shadow-sm"
                                />
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                    <Filter size={16} />
                                    Filter
                                </button>
                                <button className="flex-1 sm:flex-none px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5 text-left">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Member Endpoint</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Privilege Level</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-accent transition-all font-black text-sm border border-white/10">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-lg text-white group-hover:text-accent transition-colors">{u.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium tracking-wide">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current flex items-center gap-2 w-fit ${roleStyles[u.role] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 text-indigo-200/40 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-32 text-center">
                                                <div className="flex flex-col items-center gap-4 text-indigo-200/20">
                                                    <User size={64} strokeWidth={1} className="opacity-20" />
                                                    <div>
                                                        <p className="text-xl font-bold text-white/40">Zero Results Found</p>
                                                        <p className="text-sm font-medium mt-1">Try adjusting your search criteria.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2">
                            <span>Showing {filteredUsers.length} of {users.length} Records</span>
                            <span>Secure Endpoint: 0x482..f2</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
