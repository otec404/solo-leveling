import React, { forwardRef } from 'react';
import { Skill, SkillLog } from '../types';
import { AVAILABLE_ICONS, getSkillIcon } from './icons';

interface GamifiedReportCardProps {
  userId: string;
  skills: Skill[];
  logs: SkillLog[];
  dateRange: string;
}

export const GamifiedReportCard = forwardRef<HTMLDivElement, GamifiedReportCardProps>(
  ({ userId, skills, logs, dateRange }, ref) => {
    return (
      <div 
        ref={ref}
        className="w-[900px] p-10 bg-black text-white font-sans flex flex-col gap-6"
        style={{ backgroundImage: 'linear-gradient(to bottom right, #000000, #18181b)' }}
      >
        <div className="relative border border-zinc-800 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl bg-zinc-950/50">
           <div className="absolute top-0 right-0 p-24 bg-cyan-500/10 blur-[100px] rounded-full" />
           <div className="absolute bottom-0 left-0 p-24 bg-purple-500/10 blur-[100px] rounded-full" />
           
           {/* Header */}
           <div className="flex justify-between items-end border-b border-zinc-800/80 pb-8 mb-8 relative z-10">
             <div>
                <h2 className="text-cyan-400 font-black tracking-widest uppercase text-sm mb-2">FocusFlow // Operative Report</h2>
                <h1 className="text-5xl font-black tracking-tighter">ID: <span className="text-white">{userId}</span></h1>
             </div>
             <div className="text-right">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Mission Timeline</p>
                <p className="text-xl font-bold text-zinc-300">{dateRange}</p>
             </div>
           </div>

                      {/* Daily Breakdown */}
           <div className="mb-12 relative z-10">
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800/80 pb-3">Daily Breakdown</h3>
              <div className="flex flex-col gap-4">
                 {(() => {
                    const dates = Array.from(new Set(logs.map(l => l.date))).sort();
                    if (dates.length === 0) {
                      return <p className="text-zinc-600 text-sm font-medium italic">No daily activity logged in this period.</p>;
                    }
                    return dates.map(date => {
                      const logsForDate = logs.filter(l => l.date === date && (l.count > 0 || l.checked));
                      if (logsForDate.length === 0) return null;
                      return (
                         <div key={date} className="flex flex-col gap-2 bg-black/40 rounded-xl p-4 border border-zinc-800/50">
                            <p className="text-cyan-400 font-bold text-sm">{date}</p>
                            <div className="flex flex-wrap gap-3 mt-1">
                               {logsForDate.map(log => {
                                  const skill = skills.find(s => s.id === log.skillId);
                                  if (!skill) return null;
                                  const val = skill.mode === 'counter' ? log.count : '✓';
                                  return (
                                     <div key={log.skillId} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                                        <span className="text-zinc-300 font-medium text-sm">{skill.name}</span>
                                        <span className="text-zinc-500 text-xs">|</span>
                                        <span className="text-emerald-400 font-bold text-sm">{val} {skill.mode === 'counter' ? (skill.unit || 'count') : 'checked'}</span>
                                     </div>
                                  )
                               })}
                            </div>
                         </div>
                      );
                    });
                 })()}
              </div>
           </div>

           {/* Stats Grid */}
           <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800/80 pb-3 relative z-10">Overall Totals</h3>
           <div className="grid grid-cols-3 gap-6 relative z-10">
              {skills.map(skill => {
                 const Icon = getSkillIcon(skill);
                 const skillLogs = logs.filter(l => l.skillId === skill.id && (l.count > 0 || l.checked));
                 const total = skillLogs.reduce((acc, l) => acc + (skill.mode === 'counter' ? l.count : 1), 0);
                 
                 return (
                   <div key={skill.id} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm">
                     <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                           <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                           <h3 className="text-xl font-bold text-white truncate">{skill.name}</h3>
                           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{skill.category}</p>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-white/5 mt-auto">
                        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Total Progress</p>
                        <p className="text-4xl font-black text-white">{total} <span className="text-xl text-zinc-500 ml-1">{skill.unit || ''}</span></p>
                     </div>
                   </div>
                 );
              })}
              
              {skills.length === 0 && (
                <div className="col-span-3 py-20 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
                   <p className="text-zinc-500 font-medium tracking-wide">No skills documented in this report.</p>
                </div>
              )}
           </div>
           
           {/* Footer */}
           <div className="mt-12 text-center relative z-10">
             <p className="text-zinc-600 font-bold tracking-[0.3em] text-[10px] uppercase">
               Generated by FocusFlow // {new Date().toISOString().split('T')[0]} // Secure Transmission
             </p>
           </div>
        </div>
      </div>
    );
  }
);
GamifiedReportCard.displayName = 'GamifiedReportCard';
