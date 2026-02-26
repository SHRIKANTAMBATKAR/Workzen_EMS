import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Trash2, Mail, Shield, User, ArrowLeft, Search, Filter, Edit2, Phone, Key, Calendar, Code, Briefcase, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import api from "../../services/api";

export default function AnalystManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "ANALYST",
        password: "",
        specialization: "",
        experience_years: "",
        qualification: "",
        joinDate: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/users?role=ANALYST");
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load analyst directory");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.mobile || !form.password || !form.specialization || !form.experience_years || !form.qualification || !form.joinDate) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            if (editingUser) {
                const response = await api.patch(`/users/${editingUser.id}`, form);

                if (response.status === 200) {
                    toast.success("Analyst profile updated successfully");
                    setEditingUser(null);
                    setForm({
                        name: "",
                        email: "",
                        mobile: "",
                        role: "ANALYST",
                        password: "",
                        specialization: "",
                        experience_years: "",
                        qualification: "",
                        joinDate: "",
                    });
                    fetchUsers();
                } else {
                    throw new Error();
                }
            } else {
                const newUser = {
                    id: String(Date.now()),
                    ...form,
                    active: true
                };

                const response = await api.post("/users", newUser);

                if (response.status === 201) {
                    toast.success("Analyst account initialized");
                    setForm({
                        name: "",
                        email: "",
                        mobile: "",
                        role: "ANALYST",
                        password: "",
                        specialization: "",
                        experience_years: "",
                        qualification: "",
                        joinDate: "",
                    });
                    fetchUsers();
                } else {
                    throw new Error();
                }
            }
        } catch (error) {
            toast.error(editingUser ? "Failed to update profile" : "Failed to create analyst account");
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            const response = await api.delete(`/users/${userToDelete}`);

            if (response.status === 200) {
                toast.success("Analyst removed from system");
                fetchUsers();
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Failed to delete analyst");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            mobile: user.mobile || "",
            role: user.role,
            password: user.password || "",
            specialization: user.specialization || "",
            experience_years: user.experience_years || "",
            qualification: user.qualification || "",
            joinDate: user.joinDate || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.mobile && u.mobile.includes(searchTerm))
    );

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">Analyst Management</h2>
                        <p className="text-slate-400 text-xl font-medium text-left">Manage your systems analysts here.</p>
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
                    {/* Add/Edit Form Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-10 h-fit lg:sticky lg:top-32 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

                            <div className="flex items-center gap-4 mb-10 relative z-10">
                                <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/20">
                                    <UserPlus size={26} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">
                                        {editingUser ? "Update Analyst" : "Add Analyst"}
                                    </h3>
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Systems Control</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Analyst Name</label>
                                    <div className="relative group">
                                        <User size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Endpoint</label>
                                    <div className="relative group">
                                        <Mail size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="analyst@workzen.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <Phone size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="tel"
                                            placeholder="Enter 10-digit number"
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Access Password</label>
                                    <div className="relative group">
                                        <Key size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Set secure password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Join Date</label>
                                        <div className="relative group">
                                            <Calendar size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="date"
                                                value={form.joinDate}
                                                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                                                className="w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Experience (Years)</label>
                                        <div className="relative group">
                                            <Briefcase size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={form.experience_years}
                                                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                                                className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
                                    <div className="relative group">
                                        <Code size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Java Full Stack , Python Full Stack"
                                            value={form.specialization}
                                            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Qualification</label>
                                    <div className="relative group">
                                        <GraduationCap size={20} className="absolute left-5 top-4.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. MCA, B.E. IT"
                                            value={form.qualification}
                                            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                                        {editingUser ? "Update Profile" : "Initialize Account"}
                                        <UserPlus size={18} />
                                    </button>
                                    {editingUser && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingUser(null);
                                                setForm({ name: "", email: "", mobile: "", role: "ANALYST", password: "" });
                                            }}
                                            className="px-6 bg-white/5 text-slate-400 rounded-2xl border border-white/10 font-bold hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Analyst List Section */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative group w-full sm:w-80">
                                <Search size={18} className="absolute left-5 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search analysts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/40 transition-all text-sm text-white placeholder:text-slate-600 font-medium shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5 text-left">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Analyst Info</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertise & Experience</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Credentials</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500">Loading systems data...</td></tr>
                                    ) : filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-emerald-500 transition-all font-black text-sm border border-white/10">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{u.name}</p>
                                                        <div className="flex flex-col gap-1 mt-1">
                                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Mail size={12} /> {u.email}</p>
                                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Phone size={12} /> {u.mobile || 'No Mobile'}</p>
                                                            <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1"><Calendar size={10} /> Joined: {u.joinDate || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-2 text-left">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Specialization</p>
                                                        <p className="text-sm text-white font-medium">{u.specialization || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Experience</p>
                                                            <p className="text-xs text-slate-400">{u.experience_years ? `${u.experience_years} Years` : 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Qualification</p>
                                                            <p className="text-xs text-slate-400">{u.qualification || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1 text-left">
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Password</p>
                                                    <p className="text-sm font-mono text-emerald-400 flex items-center gap-2">
                                                        <Key size={14} className="text-emerald-500" />
                                                        {u.password}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="p-3 text-slate-500 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={18} />
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Remove Analyst"
                message="Are you sure you want to permanently remove this analyst from the system directory? This action cannot be undone."
            />
        </DashboardLayout>
    );
}
