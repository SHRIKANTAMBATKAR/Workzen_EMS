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
    const [showEdit, setShowEdit] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
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
        if (!window.confirm("Are you sure you want to delete this student profile?")) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success("Student profile removed");
            fetchData();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleEditStudent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.patch(`/students/${editingStudent.id}`, editingStudent);
            toast.success("Student record updated");
            setShowEdit(false);
            setEditingStudent(null);
            fetchData();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setSubmitting(false);
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
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 italic">Student Directory</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">Manage student profiles, enrolment, and batch assignments.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                        {showAdd ? <CheckCircle size={18} /> : <UserPlus size={18} />}
                        {showAdd ? "Close Form" : "New Registration"}
                    </button>
                </div>

                {showAdd && (
                    <div className="bg-white rounded-2xl p-8 animate-in zoom-in-95 duration-300 text-left border border-slate-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-800">Register New Student</h3>
                        </div>
                        <form onSubmit={handleAddStudent} className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                                    placeholder="Student Name"
                                    required
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                                    placeholder="+91 ..."
                                    required
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Inquiry Course</label>
                                <select
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
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
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px] ml-1">Initial Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
                                >
                                    <option>Lead</option>
                                    <option>Pending</option>
                                    <option>Enrolled</option>
                                </select>
                            </div>
                            <div className="md:col-span-3 flex justify-end mt-4">
                                <button type="submit" disabled={submitting} className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                                    Register Student
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showEdit && editingStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 animate-in zoom-in-95 duration-300 text-left relative overflow-hidden border border-slate-200 shadow-2xl">
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl"></div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                    <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">Edit Student Record</h3>
                                </div>
                                <button
                                    onClick={() => { setShowEdit(false); setEditingStudent(null); }}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <CheckCircle size={24} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleEditStudent} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Entity Name</label>
                                    <input
                                        type="text"
                                        value={editingStudent.name}
                                        onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Communication Lead</label>
                                    <input
                                        type="email"
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mobile Access</label>
                                    <input
                                        type="tel"
                                        value={editingStudent.phone}
                                        onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Academic Stream</label>
                                    <select
                                        value={editingStudent.course}
                                        onChange={e => setEditingStudent({ ...editingStudent, course: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                                    >
                                        <option>Fullstack React</option>
                                        <option>Data Science</option>
                                        <option>Cybersecurity</option>
                                        <option>UI/UX Design</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operational Status</label>
                                    <select
                                        value={editingStudent.status}
                                        onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
                                    >
                                        <option>Lead</option>
                                        <option>Pending</option>
                                        <option>Enrolled</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Enrolment Timestamp</label>
                                    <input
                                        type="date"
                                        value={editingStudent.enrolmentDate}
                                        onChange={e => setEditingStudent({ ...editingStudent, enrolmentDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => { setShowEdit(false); setEditingStudent(null); }}
                                        className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} className="rotate-90" />}
                                        Initialize Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                    <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email or phone..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all bg-white">
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-8 py-5">Student Information</th>
                                    <th className="px-8 py-5">Contact & Enrolment</th>
                                    <th className="px-8 py-5">Course / Batch</th>
                                    <th className="px-8 py-5 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                                <Loader2 size={48} className="animate-spin text-indigo-600" />
                                                <p className="font-semibold italic">Synchronizing with server...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredStudents.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-all border border-indigo-200">
                                                    <GraduationCap size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">ID: ST-{new Date(parseInt(s.id) || Date.now()).getFullYear()}-{s.id.toString().slice(-4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <Mail size={14} className="text-slate-400" /> {s.email}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Phone size={14} className="text-slate-400" /> {s.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar size={14} className="text-slate-400" /> {s.enrolmentDate || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{s.course}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${s.status === "Enrolled" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                            s.status === "Lead" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                                "bg-amber-100 text-amber-700 border-amber-200"
                                                        }`}>
                                                        {s.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 group/batch">
                                                    <div className="relative flex-1 max-w-[180px]">
                                                        <UserCheck size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <select
                                                            value={s.batchId || ""}
                                                            onChange={(e) => handleAssignBatch(s.id, e.target.value)}
                                                            className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 appearance-none cursor-pointer focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                                                        >
                                                            <option value="" className="bg-white">Assign Batch</option>
                                                            {batches.map(b => (
                                                                <option key={b.id} value={b.id} className="bg-white">{b.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {s.batchId && (
                                                        <div className="p-1 px-2 bg-indigo-100 border border-indigo-200 rounded text-[10px] font-bold text-indigo-700">
                                                            {batches.find(b => String(b.id) === String(s.batchId))?.name || "Ref: " + s.batchId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingStudent(s); setShowEdit(true); }}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all border border-transparent hover:border-indigo-200"
                                                    title="Edit Student"
                                                >
                                                    <UserCheck size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteStudent(s.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all border border-transparent hover:border-red-200"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <Tag size={48} strokeWidth={1} className="opacity-20" />
                                                <p className="font-semibold italic text-slate-500">No matching students found.</p>
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