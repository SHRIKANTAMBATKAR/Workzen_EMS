import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Search, GraduationCap, Mail, Phone, Trash2, Filter, MoreVertical, Calendar, UserCheck, Loader2, CheckCircle, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        course: "Fullstack React",
        status: "Lead",
        enrolmentDate: new Date().toISOString().split('T')[0],
        batchId: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentRes, batchRes] = await Promise.all([
                api.get("/students"),
                api.get("/batches")
            ]);
            setStudents(studentRes.data);
            setBatches(batchRes.data);
        } catch (error) {
            toast.error("Failed to fetch data from server");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.enrolmentDate) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post("/students", {
                ...form,
                id: String(Date.now())
            });
            if (response.status === 201) {
                toast.success("Student registered successfully");
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    course: "Fullstack React",
                    status: "Lead",
                    enrolmentDate: new Date().toISOString().split('T')[0],
                    batchId: null
                });
                setShowAdd(false);
                fetchData();
            }
        } catch (error) {
            toast.error("Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteStudent = async (id) => {
        try {
            await api.delete(`/students/${id}`);
            toast.success("Student profile removed");
            fetchData();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleAssignBatch = async (studentId, batchId) => {
        try {
            await api.patch(`/students/${studentId}`, { batchId });
            toast.success("Batch assigned successfully");
            fetchData();
        } catch (error) {
            toast.error("Batch assignment failed");
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
    );

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white italic">Student Directory</h2>
                        <p className="text-slate-400 mt-1 font-medium italic">Manage student profiles, enrolment, and batch assignments.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="btn-premium-primary flex items-center gap-2"
                    >
                        {showAdd ? <CheckCircle size={18} /> : <UserPlus size={18} />}
                        {showAdd ? "Close Form" : "New Registration"}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-card p-8 animate-in zoom-in-95 duration-300 text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]"></div>
                            <h3 className="text-xl font-bold text-white">Register New Student</h3>
                        </div>
                        <form onSubmit={handleAddStudent} className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-premium underline-none"
                                    placeholder="Student Name"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input-premium"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="input-premium"
                                    placeholder="+91 ..."
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Inquiry Course</label>
                                <select
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    className="input-premium appearance-none cursor-pointer bg-slate-900/50"
                                >
                                    <option>Fullstack React</option>
                                    <option>Data Science</option>
                                    <option>Cybersecurity</option>
                                    <option>UI/UX Design</option>
                                </select>
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Enrolment Date</label>
                                <input
                                    type="date"
                                    value={form.enrolmentDate}
                                    onChange={e => setForm({ ...form, enrolmentDate: e.target.value })}
                                    className="input-premium [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Initial Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="input-premium appearance-none cursor-pointer bg-slate-900/50"
                                >
                                    <option>Lead</option>
                                    <option>Pending</option>
                                    <option>Enrolled</option>
                                </select>
                            </div>
                            <div className="md:col-span-3 flex justify-end mt-4">
                                <button type="submit" disabled={submitting} className="btn-premium-primary px-10 h-[54px] flex items-center gap-2">
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                                    Register Student
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.02]">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email or phone..."
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-accent transition-all text-white placeholder:text-slate-600"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] border-b border-white/5 uppercase text-[10px] font-bold tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-8 py-5">Student Information</th>
                                    <th className="px-8 py-5">Contact & Enrolment</th>
                                    <th className="px-8 py-5">Course / Batch</th>
                                    <th className="px-8 py-5 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                                <Loader2 size={48} className="animate-spin text-accent" />
                                                <p className="font-semibold italic">Synchronizing with server...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredStudents.map((s) => (
                                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-accent/10 group-hover:text-accent transition-all border border-white/5">
                                                    <GraduationCap size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-accent transition-colors">{s.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">ID: ST-{new Date(parseInt(s.id) || Date.now()).getFullYear()}-{s.id.toString().slice(-4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                    <Mail size={14} className="text-slate-600" /> {s.email}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Phone size={14} className="text-slate-600" /> {s.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar size={14} className="text-slate-600" /> {s.enrolmentDate || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-300">{s.course}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${s.status === "Enrolled" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                        s.status === "Lead" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                            "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                                        }`}>
                                                        {s.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 group/batch">
                                                    <div className="relative flex-1 max-w-[180px]">
                                                        <UserCheck size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                        <select
                                                            value={s.batchId || ""}
                                                            onChange={(e) => handleAssignBatch(s.id, e.target.value)}
                                                            className="w-full pl-8 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold text-slate-400 appearance-none cursor-pointer focus:border-accent outline-none"
                                                        >
                                                            <option value="" className="bg-slate-900">Assign Batch</option>
                                                            {batches.map(b => (
                                                                <option key={b.id} value={b.id} className="bg-slate-900">{b.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {s.batchId && (
                                                        <div className="p-1 px-2 bg-accent/10 border border-accent/20 rounded text-[10px] font-bold text-accent">
                                                            {batches.find(b => String(b.id) === String(s.batchId))?.name || "Ref: " + s.batchId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => deleteStudent(s.id)}
                                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/10">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-600">
                                                <Tag size={48} strokeWidth={1} className="opacity-20" />
                                                <p className="font-semibold italic">No matching students found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
