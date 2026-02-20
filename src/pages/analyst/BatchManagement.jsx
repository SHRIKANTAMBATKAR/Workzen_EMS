import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Plus, BookOpen, Clock, Calendar, Search, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BatchManagement() {
    const [batches, setBatches] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        name: "",
        trainer: "",
        startTime: "",
        days: "",
    });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("batches")) || [
            { id: 1, name: "React Batch-01", trainer: "John Doe", startTime: "10:00 AM", days: "Mon, Wed, Fri" },
            { id: 2, name: "NodeJS Batch-05", trainer: "Mike Ross", startTime: "02:00 PM", days: "Tue, Thu, Sat" },
        ];
        setBatches(stored);
    }, []);

    const handleAddBatch = (e) => {
        e.preventDefault();
        if (!form.name || !form.trainer) {
            toast.error("Please fill required fields");
            return;
        }

        const newBatch = { id: Date.now(), ...form };
        const updated = [...batches, newBatch];
        setBatches(updated);
        localStorage.setItem("batches", JSON.stringify(updated));
        setForm({ name: "", trainer: "", startTime: "", days: "" });
        setShowAdd(false);
        toast.success("Batch created successfully");
    };

    const deleteBatch = (id) => {
        const updated = batches.filter(b => b.id !== id);
        setBatches(updated);
        localStorage.setItem("batches", JSON.stringify(updated));
        toast.success("Batch deleted");
    };

    return (
        <DashboardLayout allowedRoles={["ANALYST"]}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Batch Management</h2>
                        <p className="text-slate-500 mt-1">Design and schedule training batches.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd(!showAdd)}
                        className="btn-premium-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        {showAdd ? "Cancel" : "New Batch"}
                    </button>
                </div>

                {showAdd && (
                    <div className="glass-card p-8 animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-bold mb-6">Create New Batch</h3>
                        <form onSubmit={handleAddBatch} className="grid md:grid-cols-4 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Batch Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-premium"
                                    placeholder="e.g. Python B-01"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Assign Trainer</label>
                                <input
                                    type="text"
                                    value={form.trainer}
                                    onChange={e => setForm({ ...form, trainer: e.target.value })}
                                    className="input-premium"
                                    placeholder="Trainer Name"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Start Time</label>
                                <input
                                    type="time"
                                    value={form.startTime}
                                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                                    className="input-premium"
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-semibold text-slate-600">Days</label>
                                <input
                                    type="text"
                                    value={form.days}
                                    onChange={e => setForm({ ...form, days: e.target.value })}
                                    className="input-premium"
                                    placeholder="MWF, TTS..."
                                />
                            </div>
                            <div className="md:col-span-4 flex justify-end">
                                <button type="submit" className="btn-premium-primary px-10">Save Batch</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div className="relative w-72">
                            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search batches..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-accent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">Active: {batches.length}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-100">
                        {batches.map((batch) => (
                            <div key={batch.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-all cursor-default shadow-sm">
                                        <BookOpen size={24} />
                                    </div>
                                    <button
                                        onClick={() => deleteBatch(batch.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <h4 className="text-lg font-bold mb-1">{batch.name}</h4>
                                <p className="text-sm font-medium text-slate-400 mb-6 flex items-center gap-2">
                                    <Clock size={14} /> {batch.startTime} • {batch.days}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                            {batch.trainer.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">{batch.trainer}</span>
                                    </div>
                                    <button className="text-accent underline text-xs font-bold hover:text-accent-hover transition-colors">
                                        Manage Students
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
