import { Search, BookOpen, Edit2, Trash2, Clock, Users, Calendar, XCircle, CheckCircle } from "lucide-react";

export default function BatchList({
    batches,
    trainers,
    onEdit,
    onDelete,
    onToggleStatus
}) {
    return (
        <div className="bg-slate-950/40 border-8 border-white/5 rounded-[5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] italic">
            <div className="p-16 border-b-8 border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black/40 backdrop-blur-3xl">
                <div className="relative w-full md:w-[45rem] group/search">
                    <Search size={36} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-vibrant-emerald transition-all" />
                    <input
                        type="text"
                        placeholder="Search Batch Registry..."
                        className="w-full pl-28 py-8 bg-black/60 border-4 border-white/5 rounded-[3rem] text-white outline-none focus:border-vibrant-emerald/40 transition-all italic text-xl"
                    />
                </div>
                <div className="flex gap-6">
                    <div className="px-12 py-6 bg-vibrant-emerald/5 text-vibrant-emerald border-4 border-vibrant-emerald/10 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.6em] shadow-2xl italic flex items-center gap-4">
                        <Activity size={24} className="animate-pulse" />
                        <span>Nodes Online: <span className="text-white ml-2">{batches.length}</span></span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-0 divide-x-8 divide-y-8 divide-white/5">
                {batches.map((batch) => {
                    const trainer = trainers.find(t => String(t.id) === String(batch.trainerId));
                    return (
                        <div key={batch.id} className="p-16 hover:bg-slate-950/80 transition-all duration-1000 group text-left relative overflow-hidden italic uppercase">
                            <div className={`absolute -top-16 -right-16 w-80 h-80 bg-vibrant-emerald/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>

                            <div className="relative z-10 flex justify-between items-start mb-16">
                                <div className="flex gap-10 items-center">
                                    <div className={`w-28 h-28 rounded-[3rem] border-4 border-white/10 transition-all duration-1000 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center ${batch.status === 'Active' ? 'bg-black/80 text-vibrant-emerald' : 'bg-black/80 text-slate-700'} group-hover:rotate-12 group-hover:scale-110`}>
                                        <BookOpen size={48} />
                                    </div>
                                    <div>
                                        <span className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.6em] border-4 shadow-2xl transition-all duration-500 block w-fit ${batch.status === 'Active' ? 'bg-vibrant-emerald/10 text-vibrant-emerald border-vibrant-emerald/20 shadow-[0_10px_30px_rgba(16,185,129,0.2)]' :
                                            batch.status === 'Completed' ? 'bg-vibrant-blue/10 text-vibrant-blue border-vibrant-blue/20' :
                                                'bg-slate-900/40 text-slate-800 border-white/5'
                                            }`}>
                                            {batch.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onEdit(batch); }}
                                        className="p-6 text-slate-700 hover:text-white hover:bg-slate-800 rounded-[2rem] transition-all border-4 border-transparent hover:border-white/10 shadow-2xl active:scale-90 bg-black/40 group/btn"
                                    >
                                        <Edit2 size={24} className="group-hover/btn:rotate-12 transition-transform" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(batch.id); }}
                                        className="p-6 text-slate-700 hover:text-vibrant-orange hover:bg-slate-800 rounded-[2rem] transition-all border-4 border-transparent hover:border-white/10 shadow-2xl active:scale-90 bg-black/40 group/btn"
                                    >
                                        <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-12">
                                <div className="space-y-4">
                                    <h4 className="text-5xl font-black text-white group-hover:text-vibrant-emerald transition-colors leading-[0.9] tracking-tighter italic uppercase">
                                        {batch.name}
                                    </h4>
                                    <p className="inline-flex px-8 py-3 bg-black/60 rounded-2xl border-4 border-white/5 text-slate-700 text-[12px] font-black uppercase tracking-[0.6em] italic">
                                        {batch.course}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border-4 border-white/5 shadow-2xl group-hover:border-vibrant-blue/20 transition-all duration-700 group/item">
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">Protocol_Time</p>
                                        <div className="flex items-center gap-6 text-white font-black text-2xl italic">
                                            <div className="w-14 h-14 bg-vibrant-blue/5 text-vibrant-blue rounded-2xl shadow-2xl border-2 border-vibrant-blue/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                                <Clock size={28} />
                                            </div>
                                            {batch.startTime}
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border-4 border-white/5 shadow-2xl group-hover:border-vibrant-orange/20 transition-all duration-700 group/item">
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] italic leading-none">Density_Metrics</p>
                                        <div className="flex items-center gap-6 text-white font-black text-2xl italic">
                                            <div className="w-14 h-14 bg-vibrant-orange/5 text-vibrant-orange rounded-2xl shadow-2xl border-2 border-vibrant-orange/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                                <Users size={28} />
                                            </div>
                                            {batch.capacity}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] italic leading-none ml-4">Execution_Schedule</p>
                                    <div className="flex items-center gap-6 text-white font-black text-xl p-8 bg-black/60 rounded-[2.5rem] border-4 border-white/5 group-hover:border-vibrant-emerald/40 transition-all duration-700 italic uppercase">
                                        <Calendar size={32} className="text-vibrant-emerald animate-pulse" />
                                        {batch.days}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-16 pt-16 border-t-8 border-white/5 italic">
                                <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-3xl font-black text-slate-700 shadow-2xl transition-all duration-1000 group-hover:scale-110 group-hover:bg-vibrant-emerald group-hover:text-slate-950 border-4 border-white/5 group-hover:rotate-6">
                                        {trainer?.name.charAt(0) || '?'}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] leading-none italic">Faculty_Lead</p>
                                        <p className="text-3xl font-black text-white group-hover:text-vibrant-emerald transition-colors leading-none italic tracking-tighter uppercase">
                                            {trainer?.name || 'Unassigned'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggleStatus(batch)}
                                    className={`w-28 h-28 rounded-[2.5rem] border-4 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black/80 active:scale-90 flex items-center justify-center ${batch.status === 'Active'
                                        ? 'text-vibrant-orange border-white/10 hover:bg-vibrant-orange hover:text-slate-950 hover:shadow-[0_15px_40px_rgba(249,115,22,0.3)]'
                                        : 'text-vibrant-emerald border-white/10 hover:bg-vibrant-emerald hover:text-slate-950 hover:shadow-[0_15px_40px_rgba(16,185,129,0.3)]'
                                        }`}
                                    title={batch.status === 'Active' ? "Deactivate" : "Activate"}
                                >
                                    {batch.status === 'Active' ? <XCircle size={40} /> : <CheckCircle size={40} />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
