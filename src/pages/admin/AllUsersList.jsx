import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    User,
    ArrowLeft,
    Search,
    Shield,
    Mail,
    Trash2,
    Phone,
    Key,
    Eye,
    X,
    Briefcase,
    GraduationCap,
    Calendar,
    MapPin,
    Star,
    UserCheck,
    Sparkles,
    Filter,
    Download,
    ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import api from "../../services/api";

export default function AllUsersList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [roleFilter, setRoleFilter] = useState("ALL");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load user directory");
        } finally {
            setLoading(false);
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
                toast.success("User removed from system");
                fetchUsers();
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
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

    // Role-based styling
    const roleStyles = {
        ADMIN: {
            bg: "bg-red-100",
            text: "text-red-700",
            border: "border-red-200",
            lightBg: "bg-red-50",
            gradient: "from-red-600 to-rose-600",
            icon: "text-red-600",
            badge: "bg-red-500"
        },
        TRAINER: {
            bg: "bg-blue-100",
            text: "text-blue-700",
            border: "border-blue-200",
            lightBg: "bg-blue-50",
            gradient: "from-blue-600 to-indigo-600",
            icon: "text-blue-600",
            badge: "bg-blue-500"
        },
        ANALYST: {
            bg: "bg-emerald-100",
            text: "text-emerald-700",
            border: "border-emerald-200",
            lightBg: "bg-emerald-50",
            gradient: "from-emerald-600 to-teal-600",
            icon: "text-emerald-600",
            badge: "bg-emerald-500"
        },
        COUNSELOR: {
            bg: "bg-purple-100",
            text: "text-purple-700",
            border: "border-purple-200",
            lightBg: "bg-purple-50",
            gradient: "from-purple-600 to-pink-600",
            icon: "text-purple-600",
            badge: "bg-purple-500"
        },
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.mobile && u.mobile.includes(searchTerm));

        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Get counts by role
    const counts = {
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
        TRAINER: users.filter(u => u.role === 'TRAINER').length,
        ANALYST: users.filter(u => u.role === 'ANALYST').length,
        COUNSELOR: users.filter(u => u.role === 'COUNSELOR').length,
    };

    return (
        <DashboardLayout allowedRoles={["ADMIN"]}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-screen p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4 border border-indigo-200">
                            <Sparkles size={16} className="text-indigo-600" />
                            <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">User Directory</span>
                        </div>
                        <h2 className="text-5xl font-extrabold tracking-tight mb-3">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                All Users
                            </span>
                        </h2>
                        <p className="text-slate-500 text-xl font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            Complete directory of all system members
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/admin")}
                            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Dashboard
                        </button>
                    </div>
                </div>

                {/* Stats Summary */}

                <div className="space-y-4">
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative group w-full sm:w-96">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-indigo-100/50 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-800 placeholder:text-slate-400 font-medium shadow-sm"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-indigo-100/50 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                <Filter size={18} />
                            </button>
                            <select
                                className="px-4 py-3 bg-white border border-indigo-100/50 rounded-xl text-slate-600 font-medium outline-none focus:border-indigo-400"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="TRAINER">Trainer</option>
                                <option value="ANALYST">Analyst</option>
                                <option value="COUNSELOR">Counselor</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl overflow-hidden border border-indigo-100/50 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">User Profile</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Credentials</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                                <p className="font-medium">Fetching directory...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group border-b border-indigo-100">
                                        <td className="px-8 py-5 text-left">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 ${roleStyles[u.role].bg} rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md group-hover:scale-110 transition-transform`}>
                                                    <span className={roleStyles[u.role].text}>{u.name.substring(0, 2).toUpperCase()}</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{u.name}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                            <Mail size={12} className="text-slate-400" /> {u.email}
                                                        </p>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                            <Phone size={12} className="text-slate-400" /> {u.mobile || 'No Mobile'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-left">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleStyles[u.role].border} ${roleStyles[u.role].bg} ${roleStyles[u.role].text} flex items-center gap-2 w-fit`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${roleStyles[u.role].text}`}></span>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-left">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Access Key</p>
                                                <p className="text-sm font-mono text-indigo-600 flex items-center gap-2">
                                                    <Key size={14} className="text-indigo-400" />
                                                    <span className="bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                                                        {u.password}
                                                    </span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(u)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all border border-transparent hover:border-indigo-200"
                                                    title="View profile"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all border border-transparent hover:border-rose-200"
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

                        {/* Table Footer */}
                        {!loading && filteredUsers.length > 0 && (
                            <div className="px-8 py-4 bg-indigo-50/50 border-t border-indigo-200 flex justify-between items-center text-sm">
                                <span className="text-slate-600">
                                    Showing <span className="font-bold text-indigo-600">{filteredUsers.length}</span> of <span className="font-bold text-slate-800">{users.length}</span> users
                                </span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-600 hover:bg-indigo-50 transition-colors">Previous</button>
                                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors">Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {
                isViewOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/20 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="relative w-full max-w-2xl bg-white border-2 border-indigo-100 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 group">
                            {/* Modal Header Decorative BG */}
                            <div className={`absolute top-0 inset-x-0 h-48 opacity-10 blur-3xl -z-10 bg-gradient-to-b ${roleStyles[selectedUser.role].gradient}`}></div>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsViewOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl border border-indigo-200 transition-all z-20 hover:scale-110 active:scale-95"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8 sm:p-10 space-y-8 relative z-10 text-left">
                                {/* User Identity Section */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${roleStyles[selectedUser.role].gradient} flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-xl`}>
                                        {selectedUser.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="text-center sm:text-left space-y-3">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleStyles[selectedUser.role].border} ${roleStyles[selectedUser.role].lightBg} ${roleStyles[selectedUser.role].text}`}>
                                            <Shield size={12} />
                                            {selectedUser.role} Profile
                                        </span>
                                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{selectedUser.name}</h3>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                            <p className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                <Mail size={14} className="text-indigo-400" />
                                                {selectedUser.email}
                                            </p>
                                            <p className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                <Phone size={14} className="text-indigo-400" />
                                                {selectedUser.mobile || 'No mobile listed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Credentials Card */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 space-y-4">
                                    <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em] ml-1">System Credentials</h4>
                                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-indigo-100">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                                <Key size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Access Key</p>
                                                <p className="text-lg font-mono text-slate-800 font-bold tracking-wider">{selectedUser.password}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                                            <UserCheck size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedUser.role === 'ANALYST' && (
                                        <>
                                            <DetailItem icon={<Briefcase size={16} />} label="Specialization" value={selectedUser.specialization} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Star size={16} />} label="Experience" value={`${selectedUser.experience_years} Years`} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Calendar size={16} />} label="Member Since" value={selectedUser.joinDate} roleColor={roleStyles[selectedUser.role]} />
                                        </>
                                    )}
                                    {selectedUser.role === 'TRAINER' && (
                                        <>
                                            <DetailItem icon={<Star size={16} />} label="Primary Skills" value={selectedUser.primarySkills} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Briefcase size={16} />} label="Experience" value={`${selectedUser.experienceYears} Years`} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Calendar size={16} />} label="Joined Date" value={selectedUser.joiningDate} roleColor={roleStyles[selectedUser.role]} />
                                        </>
                                    )}
                                    {selectedUser.role === 'COUNSELOR' && (
                                        <>
                                            <DetailItem icon={<MapPin size={16} />} label="Assigned Region" value={selectedUser.assignedRegion} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Star size={16} />} label="Lead Expertise" value={selectedUser.leadExpertise} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<Briefcase size={16} />} label="Experience" value={`${selectedUser.experienceYears} Years`} roleColor={roleStyles[selectedUser.role]} />
                                            <DetailItem icon={<GraduationCap size={16} />} label="Qualification" value={selectedUser.qualification} roleColor={roleStyles[selectedUser.role]} />
                                        </>
                                    )}
                                    {selectedUser.role === 'ADMIN' && (
                                        <div className="col-span-2 text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-200">
                                            <Shield size={32} className="mx-auto mb-3 text-indigo-400" />
                                            <p className="text-slate-600 text-sm font-medium italic">Administrative profiles have full system clearance and do not maintain secondary professional metrics.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer Actions */}
                                <div className="pt-4 border-t border-indigo-200 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsViewOpen(false)}
                                        className="px-6 py-3 bg-white hover:bg-indigo-50 text-slate-700 rounded-xl font-bold border-2 border-indigo-200 transition-all active:scale-95"
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Remove System Member"
                message="Are you sure you want to permanently remove this user from the system directory? This action cannot be undone."
            />
        </DashboardLayout >
    );
}

// Helper component for detail items
function DetailItem({ icon, label, value, roleColor }) {
    return (
        <div className={`space-y-1 p-4 ${roleColor?.lightBg} border ${roleColor?.border} rounded-xl hover:shadow-md transition-all`}>
            <div className="flex items-center gap-2 text-slate-500">
                <span className={roleColor?.text}>{icon}</span>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</p>
            </div>
            <p className={`font-bold tracking-tight pl-6 ${roleColor?.text}`}>{value || 'Not Specified'}</p>
        </div>
    );
}