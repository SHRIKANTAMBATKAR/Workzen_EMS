import { Type, GraduationCap, UserCheck, Clock, Calendar, Users, Activity, MoreVertical, Loader2, CheckCircle, Plus } from "lucide-react";

export default function BatchForm({
    form,
    setForm,
    onSubmit,
    resetForm,
    trainers,
    submitting,
    editingBatch
}) {
    return (
        <div className="bg-slate-950/40 p-20 border-8 border-white/5 rounded-[5rem] relative overflow-hidden italic shadow-[0_40px_100px_rgba(0,0,0,0.5)] group/form">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-vibrant-emerald/5 rounded-full blur-[100px] group-hover/form:bg-vibrant-emerald/10 transition-colors duration-1000"></div>

            <h3 className="text-5xl font-black mb-24 text-white tracking-tighter flex items-center gap-10 leading-none italic uppercase">
                <div className={`p-10 rounded-[3rem] border-4 border-white/5 shadow-2xl transition-all duration-700 ${editingBatch ? 'bg-black/80 text-vibrant-emerald shadow-[0_20px_50px_rgba(16,185,129,0.3)]' : 'bg-black/80 text-vibrant-emerald'} group-hover/form:rotate-12`}>
                    {editingBatch ? <Activity size={48} /> : <Plus size={48} />}
                </div>
                <div className="space-y-2">
                    <p>{editingBatch ? "Update Configuration" : "Initialize New Batch"}</p>
                    <p className="text-[12px] text-slate-800 uppercase font-black tracking-[0.6em] italic leading-none">Cohort System Provisioning</p>
                </div>
            </h3>

            <form onSubmit={onSubmit} className="space-y-16 relative z-10">
                {/* Section 1: Core Configuration */}
                <div className="space-y-12">
                    <div className="flex items-center gap-8 pb-8 border-b-4 border-white/5">
                        <div className="w-4 h-12 bg-vibrant-emerald rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)]"></div>
                        <h4 className="text-[13px] font-black text-slate-700 uppercase tracking-[0.6em] italic">Core Configuration</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Batch Identity</label>
                            <div className="relative group/input">
                                <Type size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-emerald transition-all duration-500" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white placeholder-slate-800 outline-none focus:border-vibrant-emerald/40 transition-all italic text-xl"
                                    placeholder="e.g. FullStack Elite B1"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Course Program</label>
                            <div className="relative group/input">
                                <GraduationCap size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-emerald transition-all duration-500" />
                                <input
                                    type="text"
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white placeholder-slate-800 outline-none focus:border-vibrant-emerald/40 transition-all italic text-xl"
                                    placeholder="e.g. Advanced System Design"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Logistics & Faculty */}
                <div className="space-y-12">
                    <div className="flex items-center gap-8 pb-8 border-b-4 border-white/5">
                        <div className="w-4 h-12 bg-vibrant-blue rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
                        <h4 className="text-[13px] font-black text-slate-700 uppercase tracking-[0.6em] italic">Logistics & Faculty</h4>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Faculty Lead</label>
                            <div className="relative group/input">
                                <UserCheck size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-blue transition-all duration-500" />
                                <select
                                    value={form.trainerId}
                                    onChange={e => setForm({ ...form, trainerId: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white appearance-none cursor-pointer outline-none focus:border-vibrant-blue/40 transition-all italic text-xl"
                                >
                                    <option value="" className="bg-slate-900 border-0">SELECT_TRAINER</option>
                                    {trainers.map(t => (
                                        <option key={t.id} value={t.id} className="bg-slate-900 border-0">{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Execution Time</label>
                            <div className="relative group/input">
                                <Clock size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-blue transition-all duration-500" />
                                <input
                                    type="time"
                                    value={form.startTime}
                                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white [color-scheme:dark] outline-none focus:border-vibrant-blue/40 transition-all italic text-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Operational Days</label>
                            <div className="relative group/input">
                                <Calendar size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-blue transition-all duration-500" />
                                <input
                                    type="text"
                                    value={form.days}
                                    onChange={e => setForm({ ...form, days: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white placeholder-slate-800 outline-none focus:border-vibrant-blue/40 transition-all italic text-xl"
                                    placeholder="Mon, Wed, Fri"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Student Density</label>
                            <div className="relative group/input">
                                <Users size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant-blue transition-all duration-500" />
                                <input
                                    type="number"
                                    value={form.capacity}
                                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white placeholder-slate-800 outline-none focus:border-vibrant-blue/40 transition-all italic text-xl"
                                    placeholder="e.g. 30"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Operational Status */}
                <div className="space-y-12">
                    <div className="flex items-center gap-8 pb-8 border-b-4 border-white/5">
                        <div className="w-4 h-12 bg-vibrant rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                        <h4 className="text-[13px] font-black text-slate-700 uppercase tracking-[0.6em] italic">Operational Status</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <label className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em] ml-4 italic">Execution State</label>
                            <div className="relative group/input">
                                <Activity size={28} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-vibrant transition-all duration-500" />
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full pl-24 py-8 bg-black/60 border-4 border-white/5 rounded-[2.5rem] text-white appearance-none cursor-pointer outline-none focus:border-vibrant/40 transition-all italic text-xl"
                                >
                                    <option value="Active" className="bg-slate-900 border-0 uppercase">Operational / Active</option>
                                    <option value="Inactive" className="bg-slate-900 border-0 uppercase">Paused / Inactive</option>
                                    <option value="Completed" className="bg-slate-900 border-0 uppercase">Finalized / Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-10 pt-16 mt-16 border-t-8 border-white/5 italic">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:w-auto text-[12px] font-black text-slate-700 uppercase tracking-[0.6em] hover:text-white transition-all px-16 py-8 bg-slate-950/40 rounded-[2.5rem] border-4 border-white/5 shadow-2xl hover:bg-slate-800"
                    >
                        Discard Configuration
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full sm:w-auto flex items-center justify-center gap-8 px-20 py-10 rounded-[3.5rem] font-black text-[12px] uppercase tracking-[0.6em] transition-all shadow-[0_20px_60px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 ${editingBatch ? 'bg-white text-slate-950 shadow-white/10' : 'bg-vibrant-emerald text-slate-950 shadow-vibrant-emerald/30'}`}
                    >
                        {submitting ? <Loader2 size={36} className="animate-spin" /> : editingBatch ? <CheckCircle size={36} /> : <Plus size={36} />}
                        <span>
                            {editingBatch ? "Update Orchestration" : "Initialize Protocol"}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
