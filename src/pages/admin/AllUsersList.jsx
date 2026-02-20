import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { User, ArrowLeft, Search, Shield, Mail, Trash2, Phone, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:3001";

export default function AllUsersList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load user directory");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("User removed from system");
                fetchUsers();
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const roleStyles = {
        ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
        TRAINER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        ANALYST: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        COUNSELOR: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.mobile && u.mobile.includes(searchTerm))
    );

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">All Users</h2>
                        <p className="text-slate-400 text-xl font-medium text-left">Complete directory of all system members.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin")}
                        className="group bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Search Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative group w-full sm:w-96">
                            <Search size={18} className="absolute left-5 top-4 text-slate-500 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent/40 transition-all text-sm text-white placeholder:text-slate-600 font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5 text-left">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">User Profile</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Role</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Credentials</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-500 font-medium">Fetching directory...</td></tr>
                                ) : filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] border-b border-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-accent transition-all font-black text-sm border border-white/10">
                                                    {u.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-lg text-white group-hover:text-accent transition-colors">{u.name}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Mail size={12} /> {u.email}</p>
                                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Phone size={12} /> {u.mobile || 'No Mobile'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current flex items-center gap-2 w-fit ${roleStyles[u.role] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1 text-left">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access Key</p>
                                                <p className="text-sm font-mono text-blue-400 flex items-center gap-2">
                                                    <Key size={14} className="text-blue-500" />
                                                    {u.password}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
