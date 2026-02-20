import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { User, ArrowLeft, Search, Shield, Mail, Trash2 } from "lucide-react";
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
        ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
        TRAINER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        ANALYST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        COUNSELOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <h2 className="text-5xl font-extrabold tracking-tight text-white mb-3">All Users</h2>
                        <p className="text-indigo-200/60 text-xl font-medium">Complete directory of all system members.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin")}
                        className="group bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all shadow-xl"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Search Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative group w-full sm:w-96">
                            <Search size={18} className="absolute left-5 top-4 text-indigo-200/30 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
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
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200/40">User Profile</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200/40">Role</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200/40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="3" className="px-8 py-10 text-center text-indigo-200/40">Fetching directory...</td></tr>
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
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current flex items-center gap-2 w-fit ${roleStyles[u.role] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-3 text-indigo-200/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
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
