import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { CheckCircle2, XCircle, Search, ArrowLeft, Save, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Attendance() {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        // Mock students for this batch
        const studentData = [
            { id: 101, name: "Alice Thompson", email: "alice@example.com" },
            { id: 102, name: "Bob Wilson", email: "bob@example.com" },
            { id: 103, name: "Charlie Davis", email: "charlie@example.com" },
            { id: 104, name: "Daisy Miller", email: "daisy@example.com" },
            { id: 105, name: "Ethan Hunt", email: "ethan@example.com" },
        ];
        setStudents(studentData);

        // Default everyone to present
        const initial = {};
        studentData.forEach(s => initial[s.id] = true);
        setAttendance(initial);
    }, [batchId]);

    const toggleStatus = (id) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        toast.success("Attendance saved for today!");
        setTimeout(() => navigate("/trainer"), 1000);
    };

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <div className="flex items-center gap-2 text-accent font-bold text-sm mb-2">
                            <button onClick={() => navigate("/trainer")} className="hover:underline flex items-center gap-1">
                                <ArrowLeft size={14} /> Back to Dashboard
                            </button>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Session Attendance</h2>
                        <p className="text-slate-500 mt-1 italic">Batch ID: {batchId} • 20 Feb 2026</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="btn-premium-primary flex items-center gap-2 px-8"
                    >
                        <Save size={18} />
                        Submit Attendance
                    </button>
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{students.length} Students Total</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                    {Object.values(attendance).filter(v => v).length} Present
                                </p>
                            </div>
                        </div>
                        <div className="relative w-64">
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter name..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {students.map((student) => {
                            const isPresent = attendance[student.id];
                            return (
                                <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{student.name}</p>
                                            <p className="text-xs text-slate-500">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleStatus(student.id)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all border-2 ${isPresent
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                : "bg-red-50 border-red-100 text-red-600"
                                                }`}
                                        >
                                            {isPresent ? (
                                                <>
                                                    <CheckCircle2 size={16} /> Present
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={16} /> Absent
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
