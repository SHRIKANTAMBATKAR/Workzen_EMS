import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    UserPlus,
    Trash2,
    Mail,
    Shield,
    User,
    ArrowLeft,
    Search,
    Filter,
    Edit2,
    Phone,
    Key,
    Calendar,
    Code,
    Briefcase,
    GraduationCap,
    Sparkles,
    Download,
    Eye
} from "lucide-react";
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
        experienceYears: "",
        qualification: "",
        joinDate: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admins/analysts");
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load analyst directory");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.mobile || !form.password || !form.specialization || !form.experienceYears || !form.qualification || !form.joinDate) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            if (editingUser) {
                const response = await api.put(`/admins/analysts/${editingUser.id}`, form);

                if (response.status === 200 || response.status === 204) {
                    toast.success("Analyst profile updated successfully");
                    setEditingUser(null);
                    setForm({
                        name: "",
                        email: "",
                        mobile: "",
                        role: "ANALYST",
                        password: "",
                        specialization: "",
                        experienceYears: "",
                        qualification: "",
                        joinDate: "",
                    });
                    fetchUsers();
                } else {
                    throw new Error();
                }
            } else {
                const response = await api.post("/admins/analysts", { ...form, active: true });

                if (response.status === 200 || response.status === 201) {
                    toast.success("Analyst account initialized");
                    setForm({
                        name: "",
                        email: "",
                        mobile: "",
                        role: "ANALYST",
                        password: "",
                        specialization: "",
                        experienceYears: "",
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
            const response = await api.delete(`/admins/analysts/${userToDelete}`);

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
            role: user.role || "ANALYST",
            password: user.password || "",
            specialization: user.specialization || "",
            experienceYears: user.experienceYears || "",
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

    // Role-specific styling
    const analystStyle = {
        gradient: "from-emerald-600 to-teal-600",
        lightGradient: "from-emerald-50 to-teal-100",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        lightBg: "bg-emerald-50",
        icon: "text-emerald-600",
        badge: "bg-emerald-500"
    };

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 min-h-screen p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4 border border-emerald-200">
                            <Sparkles size={16} className="text-emerald-600" />
                            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Analyst Management</span>
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tight mb-3">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Analyst Management
                            </span>
                        </h2>
                        <p className="text-slate-500 text-xl font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Manage your systems analysts here
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/admin")}
                            className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:shadow-xl hover:shadow-emerald-500/30 transition-all"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Dashboard
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Add/Edit Form Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 h-fit lg:sticky lg:top-32 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-50"></div>

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className={`p-4 bg-gradient-to-br ${analystStyle.gradient} rounded-xl text-white shadow-lg`}>
                                    <UserPlus size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                        {editingUser ? "Update Analyst" : "Add Analyst"}
                                    </h3>
                                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Systems Control</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Analyst Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="analyst@workzen.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="tel"
                                            placeholder="Enter 10-digit number"
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative group">
                                        <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Set secure password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Join Date</label>
                                        <div className="relative group">
                                            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                type="date"
                                                value={form.joinDate}
                                                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Experience (Years)</label>
                                        <div className="relative group">
                                            <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={form.experienceYears}
                                                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
                                    <div className="relative group">
                                        <Code size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Java Full Stack , Python Full Stack"
                                            value={form.specialization}
                                            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Qualification</label>
                                    <div className="relative group">
                                        <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. MCA, B.E. IT"
                                            value={form.qualification}
                                            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {editingUser ? "Update Profile" : "Initialize Account"}
                                        <UserPlus size={16} />
                                    </button>
                                    {editingUser && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingUser(null);
                                                setForm({ name: "", email: "", mobile: "", role: "ANALYST", password: "", specialization: "", experienceYears: "", qualification: "", joinDate: "" });
                                            }}
                                            className="px-6 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Analyst List Section */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative group w-full sm:w-80">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search analysts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-sm text-slate-800 placeholder:text-slate-400 font-medium shadow-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                                    <Filter size={18} />
                                </button>
                                <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center gap-2">
                                    <Eye size={18} />
                                    View All
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-emerald-700">Analyst Info</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-emerald-700">Expertise & Experience</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-emerald-700">Credentials</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-emerald-700 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-slate-400">
                                                    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                                    <p className="font-medium">Loading systems data...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-emerald-50/30 transition-colors group border-b border-slate-200">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-black text-sm border-2 border-white shadow-md group-hover:scale-110 transition-transform`}>
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">{u.name}</p>
                                                        <div className="flex flex-col gap-1 mt-1">
                                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                                <Mail size={12} className="text-slate-400" /> {u.email}
                                                            </p>
                                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                                <Phone size={12} className="text-slate-400" /> {u.mobile || 'No Mobile'}
                                                            </p>
                                                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1.5 mt-1">
                                                                <Calendar size={10} /> Joined: {u.joinDate || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-2 text-left">
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Specialization</p>
                                                        <p className="text-sm text-slate-800 font-medium">{u.specialization || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Experience</p>
                                                            <p className="text-xs text-slate-600">{u.experienceYears ? `${u.experienceYears} Years` : 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Qualification</p>
                                                            <p className="text-xs text-slate-600">{u.qualification || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1 text-left">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Password</p>
                                                    <p className="text-sm font-mono text-emerald-600 flex items-center gap-2">
                                                        <Key size={14} className="text-emerald-400" />
                                                        <span className="bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                                            {u.password}
                                                        </span>
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all border border-transparent hover:border-emerald-200"
                                                        title="Edit analyst"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all border border-transparent hover:border-rose-200"
                                                        title="Delete analyst"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Table Footer */}
                            {!loading && filteredUsers.length > 0 && (
                                <div className="px-8 py-4 bg-emerald-50/50 border-t border-emerald-200 flex justify-between items-center text-sm">
                                    <span className="text-slate-600">
                                        Showing <span className="font-bold text-emerald-600">{filteredUsers.length}</span> of <span className="font-bold text-slate-800">{users.length}</span> analysts
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-white border border-emerald-200 rounded-lg text-xs text-emerald-600 hover:bg-emerald-50 transition-colors">Previous</button>
                                        <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-colors">Next</button>
                                    </div>
                                </div>
                            )}
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