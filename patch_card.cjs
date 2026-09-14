const fs = require('fs');
let c = fs.readFileSync('src/components/GamifiedReportCard.tsx', 'utf8');

const dailyBreakdown = `           {/* Daily Breakdown */}
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
                                        <span className="text-emerald-400 font-bold text-sm">{val} {skill.mode === 'counter' ? 'count' : 'checked'}</span>
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
           <div className="grid grid-cols-3 gap-6 relative z-10">`;

c = c.replace(/\{\/\* Stats Grid \*\/\}\s*<div className="grid grid-cols-3 gap-6 relative z-10">/, dailyBreakdown);

fs.writeFileSync('src/components/GamifiedReportCard.tsx', c);
