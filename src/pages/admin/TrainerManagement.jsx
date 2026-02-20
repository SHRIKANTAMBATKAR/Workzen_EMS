import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Trash2, Mail, Shield, User, ArrowLeft, Search, Filter, MoreVertical, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:3001";

export default function TrainerManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "TRAINER",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/users?role=TRAINER`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load trainer directory");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            if (editingUser) {
                const response = await fetch(`${BASE_URL}/users/${editingUser.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });

                if (response.ok) {
                    toast.success("Trainer profile updated successfully");
                    setEditingUser(null);
                    setForm({ name: "", email: "", role: "TRAINER" });
                    fetchUsers();
                } else {
                    throw new Error();
                }
            } else {
                const newUser = {
                    id: String(Date.now()),
                    ...form,
                    password: "staff123",
                    active: true
                };

                const response = await fetch(`${BASE_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                });

                if (response.ok) {
                    toast.success("Trainer account initialized");
                    setForm({ name: "", email: "", role: "TRAINER" });
                    fetchUsers();
                } else {
                    throw new Error();
                }
            }
        } catch (error) {
            toast.error(editingUser ? "Failed to update profile" : "Failed to create trainer account");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trainer?")) return;
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Trainer removed from system");
                fetchUsers();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Failed to delete trainer");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">Trainer Management</h2>
                        <p className="text-indigo-200/60 text-xl font-medium">Manage your teaching faculty here.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin")}
                        className="group bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all shadow-xl"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Add/Edit Form Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card-dark p-10 h-fit lg:sticky lg:top-32 relative overflow-hidden bg-black/30 border-white/5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>

                            <div className="flex items-center gap-4 mb-10 relative z-10">
                                <div className="p-4 bg-accent/10 text-accent rounded-2xl border border-accent/20">
                                    <UserPlus size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">
                                        {editingUser ? "Update Trainer" : "Add Trainer"}
                                    </h3>
                                    <p className="text-xs text-indigo-300/40 uppercase font-black tracking-widest mt-1">Faculty Access</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10 text-left">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-indigo-200/40 uppercase tracking-widest ml-1">Trainer Name</label>
                                    <div className="relative group">
                                        <User size={20} className="absolute left-5 top-4.5 text-indigo-300/30 group-focus-within:text-accent transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-white font-medium placeholder:text-indigo-300/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-indigo-200/40 uppercase tracking-widest ml-1">Email Endpoint</label>
                                    <div className="relative group">
                                        <Mail size={20} className="absolute left-5 top-4.5 text-indigo-300/30 group-focus-within:text-accent transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="trainer@workzen.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-white font-medium placeholder:text-indigo-300/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-gradient-to-r from-accent to-blue-600 hover:from-blue-600 hover:to-accent text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                                        {editingUser ? "Update Profile" : "Initialize Account"}
                                        <UserPlus size={18} />
                                    </button>
                                    {editingUser && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingUser(null);
                                                setForm({ name: "", email: "", role: "TRAINER" });
                                            }}
                                            className="px-6 bg-white/5 text-white rounded-2xl border border-white/10 font-bold hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Trainers List Section */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative group w-full sm:w-80">
                                <Search size={18} className="absolute left-5 top-4 text-indigo-200/30 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search trainers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:bg-white/10 focus:border-white/20 transition-all text-sm text-white placeholder:text-indigo-200/20 font-medium"
                                />
                            </div>
                        </div>

                        <div className="glass-card-dark overflow-hidden border-white/5 shadow-2xl bg-black/10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200/40">Trainer Info</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200/40 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="2" className="px-8 py-10 text-center text-indigo-200/40">Loading faculty data...</td></tr>
                                    ) : filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-100 group-hover:bg-accent/20 group-hover:text-white transition-all font-black text-sm border border-white/10">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg text-white group-hover:text-accent transition-colors">{u.name}</p>
                                                        <p className="text-xs text-indigo-200/40 font-medium tracking-wide">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="p-3 text-indigo-200/40 hover:text-accent hover:bg-white/5 rounded-xl transition-all"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-3 text-indigo-200/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
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
        </DashboardLayout>
    );
}
