import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { UserPlus, Search, GraduationCap, Mail, Phone, MapPin, Trash2, Filter, MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        course: "Fullstack React",
        status: "Lead",
    });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("students")) || [
            { id: 1, name: "Alice Thompson", email: "alice@example.com", phone: "+91 9876543210", course: "Data Science", status: "Enrolled" },
            { id: 2, name: "Bob Wilson", email: "bob@example.com", phone: "+91 8888877777", course: "Cybersecurity", status: "Lead" },
        ];
        setStudents(stored);
    }, []);

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone) {
            toast.error("Please fill all contact details");
            return;
        }

        const newStudent = { id: Date.now(), ...form };
        const updated = [...students, newStudent];
        setStudents(updated);
        localStorage.setItem("students", JSON.stringify(updated));
        setForm({ name: "", email: "", phone: "", course: "Fullstack React", status: "Lead" });
        setShowAdd(false);
        toast.success("Student registered successfully");
    };

    const deleteStudent = (id) => {
        const updated = students.filter(s => s.id !== id);
        setStudents(updated);
        localStorage.setItem("students", JSON.stringify(updated));
        toast.success("Student profile removed");
    };

    return (
        <DashboardLayout allowedRoles={["COUNSELOR"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Student Directory</h2>
                        <p className="text-slate-500 mt-1">Manage student profiles and enrollment status.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="btn-premium-primary flex items-center gap-2"
                    >
                        <UserPlus size={18} />
                        {showAdd ? "Close Form" : "New Registration"}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-card p-8 animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-bold mb-6">Register New Student</h3>
                        <form onSubmit={handleAddStudent} className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-premium underline-none"
                                    placeholder="Student Name"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="input-premium"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Phone Number</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="input-premium"
                                    placeholder="+91 ..."
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Inquiry Course</label>
                                <select
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    className="input-premium appearance-none cursor-pointer"
                                >
                                    <option>Fullstack React</option>
                                    <option>Data Science</option>
                                    <option>Cybersecurity</option>
                                    <option>UI/UX Design</option>
                                </select>
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Initial Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="input-premium appearance-none cursor-pointer"
                                >
                                    <option>Lead</option>
                                    <option>Pending</option>
                                    <option>Enrolled</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="btn-premium-primary w-full h-[54px]">Register Student</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-accent transition-all"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-bold tracking-widest text-slate-400">
                                <tr>
                                    <th className="px-8 py-5">Student Information</th>
                                    <th className="px-8 py-5">Contact</th>
                                    <th className="px-8 py-5">Course / Status</th>
                                    <th className="px-8 py-5 text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                    <GraduationCap size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{s.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">ID: ST-2026-{s.id.toString().slice(-4)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <Mail size={14} className="text-slate-400" /> {s.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Phone size={14} className="text-slate-400" /> {s.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-slate-700">{s.course}</p>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.status === "Enrolled" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    s.status === "Lead" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        "bg-orange-50 text-orange-600 border-orange-100"
                                                    }`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => deleteStudent(s.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-300">
                                                <Users size={48} strokeWidth={1} />
                                                <p className="font-semibold">No students registered yet.</p>
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
