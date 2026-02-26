import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { User, ArrowLeft, Search, Shield, Mail, Trash2, Phone, Key, Eye, X, Briefcase, GraduationCap, Calendar, MapPin, Star, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:3001";

export default function AllUsersList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

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

    const handleView = (user) => {
        setSelectedUser(user);
        setIsViewOpen(true);
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
                                        <td className="px-8 py-6 text-left">
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
                                        <td className="px-8 py-6 text-left">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current flex items-center gap-2 w-fit ${roleStyles[u.role] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-left">
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
                                                <button
                                                    onClick={() => handleView(u)}
                                                    className="p-3 text-slate-500 hover:text-accent hover:bg-white/5 rounded-xl transition-all"
                                                    title="View profile"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        title="Delete profile"
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

            {/* User Detail Modal */}
            {isViewOpen && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#020617]/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 group">
                        {/* Modal Header Decorative BG */}
                        <div className={`absolute top-0 inset-x-0 h-48 opacity-20 blur-3xl -z-10 bg-gradient-to-b ${selectedUser.role === 'ADMIN' ? 'from-red-600' :
                                selectedUser.role === 'TRAINER' ? 'from-blue-600' :
                                    selectedUser.role === 'ANALYST' ? 'from-emerald-600' :
                                        'from-purple-600'
                            } to-transparent`}></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsViewOpen(false)}
                            className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all z-20 group-hover:scale-110 active:scale-95"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 sm:p-12 space-y-10 relative z-10 text-left">
                            {/* User Identity Section */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black border-4 border-white/5 shadow-2xl ${selectedUser.role === 'ADMIN' ? 'bg-red-500 shadow-red-500/20' :
                                        selectedUser.role === 'TRAINER' ? 'bg-blue-500 shadow-blue-500/20' :
                                            selectedUser.role === 'ANALYST' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                'bg-purple-500 shadow-purple-500/20'
                                    }`}>
                                    {selectedUser.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="text-center sm:text-left space-y-3">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleStyles[selectedUser.role]}`}>
                                        <Shield size={10} />
                                        {selectedUser.role} Profile
                                    </span>
                                    <h3 className="text-4xl font-extrabold text-white tracking-tight">{selectedUser.name}</h3>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                        <p className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <Mail size={16} className="text-slate-500" />
                                            {selectedUser.email}
                                        </p>
                                        <p className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <Phone size={16} className="text-slate-500" />
                                            {selectedUser.mobile || 'No mobile listed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Credentials Card */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">System Credentials</h4>
                                <div className="flex items-center justify-between bg-black/20 p-5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                                            <Key size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access Key</p>
                                            <p className="text-xl font-mono text-white font-bold tracking-wider">{selectedUser.password}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                        <UserCheck size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {selectedUser.role === 'ANALYST' && (
                                    <>
                                        <DetailItem icon={<Briefcase size={16} />} label="Specialization" value={selectedUser.specialization} />
                                        <DetailItem icon={<Star size={16} />} label="Experience" value={`${selectedUser.experience_years} Years`} />
                                        <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} />
                                        <DetailItem icon={<Calendar size={16} />} label="Member Since" value={selectedUser.joinDate} />
                                    </>
                                )}
                                {selectedUser.role === 'TRAINER' && (
                                    <>
                                        <DetailItem icon={<Star size={16} />} label="Primary Skills" value={selectedUser.primarySkills} />
                                        <DetailItem icon={<Briefcase size={16} />} label="Experience" value={`${selectedUser.experienceYears} Years`} />
                                        <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} />
                                        <DetailItem icon={<Calendar size={16} />} label="Joined Date" value={selectedUser.joiningDate} />
                                    </>
                                )}
                                {selectedUser.role === 'COUNSELOR' && (
                                    <>
                                        <DetailItem icon={<MapPin size={16} />} label="Assigned Region" value={selectedUser.assignedRegion} />
                                        <DetailItem icon={<Star size={16} />} label="Lead Expertise" value={selectedUser.leadExpertise} />
                                        <DetailItem icon={<Briefcase size={16} />} label="Experience" value={`${selectedUser.experienceYears} Years`} />
                                        <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} />
                                    </>
                                )}
                                {selectedUser.role === 'ADMIN' && (
                                    <div className="col-span-2 text-center p-10 bg-white/5 rounded-3xl border border-white/5">
                                        <Shield size={32} className="mx-auto mb-4 text-red-400/50" />
                                        <p className="text-slate-500 text-sm font-medium italic">Administrative profiles have full system clearance and do not maintain secondary professional metrics.</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => setIsViewOpen(false)}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all active:scale-95"
                                >
                                    Dismiss Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// Helper component for detail items
function DetailItem({ icon, label, value }) {
    return (
        <div className="space-y-2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-white font-bold tracking-tight pl-6">{value || 'Not Specified'}</p>
        </div>
    );
}
