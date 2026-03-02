import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { CheckCircle2, XCircle, Search, ArrowLeft, Save, Users, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function Attendance() {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchBatchAndStudents();
    }, [batchId]);

    const fetchBatchAndStudents = async () => {
        setLoading(true);
        try {
            const [batchRes, studentRes] = await Promise.all([
                api.get(`/batches/${batchId}`),
                api.get(`/students?batchId=${batchId}`)
            ]);
            setBatch(batchRes.data);
            setStudents(studentRes.data);

            // Default everyone to present if not already marked for today
            const initial = {};
            studentRes.data.forEach(s => initial[s.id] = true);
            setAttendance(initial);
        } catch (error) {
            toast.error("Failed to retrieve batch intelligence");
            navigate("/trainer");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = (id) => {
        setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            const payload = {
                batchId,
                date: new Date().toISOString().split('T')[0],
                records: attendance,
                timestamp: new Date().toISOString()
            };
            await api.post("/attendance", payload);
            toast.success("Attendance intelligence synchronized successfully");
            setTimeout(() => navigate("/trainer"), 1000);
        } catch (error) {
            toast.error("Failed to persist attendance data");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout allowedRoles={["TRAINER"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 bg-gradient-to-br from-slate-50 to-white min-h-screen p-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2">
                            <button onClick={() => navigate("/trainer")} className="hover:underline flex items-center gap-1 group">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Console
                            </button>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800 italic uppercase">Section Roll Call</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            {batch ? `${batch.name} • ${batch.course}` : "Retrieving Node Data..."} • {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={submitting || loading}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Synchronize Registry
                    </button>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                    <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{students.length} Learners Identified</p>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                    {Object.values(attendance).filter(v => v).length} Verified Present
                                </p>
                            </div>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter identifier..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 italic"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 italic">
                                <Loader2 className="animate-spin text-indigo-600" size={48} />
                                <p className="font-bold uppercase tracking-widest text-xs">Querying Student Matrix...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="p-20 text-center text-slate-400 italic">
                                <Search size={48} className="mx-auto mb-4 opacity-10" />
                                <p>No matching identifiers found in this node.</p>
                            </div>
                        ) : filteredStudents.map((student) => {
                            const isPresent = attendance[student.id];
                            return (
                                <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 group-hover:scale-110 transition-transform">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase italic">{student.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleStatus(student.id)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${isPresent
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                : "bg-red-50 border-red-200 text-red-600"
                                                }`}
                                        >
                                            {isPresent ? (
                                                <>
                                                    <CheckCircle2 size={16} /> Verified
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
