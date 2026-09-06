import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Minus, Check, LayoutGrid, List } from 'lucide-react';
import { Skill, SkillLog } from '../types';

interface DailyDashboardViewProps {
  skills: Skill[];
  logs: SkillLog[];
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
}

// --- Audio Context & Sound Effect ---
let audioCtx: AudioContext | null = null;
const playTick = () => {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (audioCtx) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

const getLog = (logs: SkillLog[], skillId: string, date: string) => {
  return logs.find(l => l.skillId === skillId && l.date === date) || { skillId, date, count: 0, checked: false };
};

// --- Vertical Roller Overlay ---
const VerticalRoller = ({ value, onChange, onClose }: { value: number, onChange: (v: number) => void, onClose: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<any>(null);
  const lastTick = useRef(value);
  const ITEM_HEIGHT = 48; // Taller for the centered modal

  useEffect(() => {
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch(e) {}

    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = value * ITEM_HEIGHT;
    }, 10);
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    if (index !== lastTick.current && index >= 0 && index < 100) {
      playTick();
      lastTick.current = index;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollRef.current) {
        const snappedIndex = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        if (snappedIndex !== value) {
          onChange(snappedIndex);
        }
        scrollRef.current.scrollTo({ top: snappedIndex * ITEM_HEIGHT, behavior: 'smooth' });
      }
    }, 150);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onPointerDown={(e) => { e.stopPropagation(); onClose(); }} onClick={(e) => { e.stopPropagation(); onClose(); }} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <motion.div 
         initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
         animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
         exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
         transition={{ duration: 0.2 }}
         onPointerDown={(e) => e.stopPropagation()}
         onClick={(e) => e.stopPropagation()}
         className="relative w-24 h-64 bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col"
      >
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 left-0 w-full border-y border-cyan-500/30 top-1/2 -translate-y-1/2 h-[48px] pointer-events-none bg-cyan-500/10 z-10 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]" />
        <div ref={scrollRef} onScroll={handleScroll} className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-0">
           <div style={{ height: `calc(50% - 24px)` }} />
           {Array.from({ length: 100 }).map((_, i) => (
              <div 
                 key={i} 
                 onClick={(e) => {
                    e.stopPropagation();
                    if (i !== value) onChange(i);
                    onClose();
                 }}
                 className={`h-[48px] flex items-center justify-center cursor-pointer snap-center font-mono text-3xl font-black transition-all ${i === value ? 'text-cyan-300 scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-zinc-600 scale-75'}`}
              >
                 {i}
              </div>
           ))}
           <div style={{ height: `calc(50% - 24px)` }} />
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// --- Compact Bento Card ---
const CompactBentoCard = ({ skill, log, date, onUpdateLog }: any) => {
  const [rollerOpen, setRollerOpen] = useState(false);
  const isLogged = skill.mode === 'counter' ? log.count > 0 : log.checked;

  const handleTap = () => {
    if (skill.mode === 'checkbox') {
      onUpdateLog(skill.id, date, { checked: !log.checked });
    } else {
      onUpdateLog(skill.id, date, { count: log.count + 1 });
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (log.count > 0) onUpdateLog(skill.id, date, { count: log.count - 1 });
  };

  const handleOpenRoller = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRollerOpen(true);
  };

  return (
    <div 
       onClick={handleTap}
       className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer active:scale-95 select-none overflow-hidden aspect-square ${
          isLogged 
             ? 'bg-cyan-500/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
             : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-800 hover:border-white/10'
       }`}
    >
       {/* Background Glow */}
       {isLogged && <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />}

       {/* Quick Decrement Button (Counter only) */}
       {skill.mode === 'counter' && isLogged && (
         <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 z-20">
           <button onClick={handleDecrement} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/40 flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 backdrop-blur-md">
             <Minus size={12} strokeWidth={3} />
           </button>
         </div>
       )}

       {/* Icon / ShortForm */}
       <div className="flex-1 flex flex-col items-center justify-center z-10 w-full pointer-events-none">
          <span className={`text-3xl sm:text-4xl font-black tracking-tighter drop-shadow-md transition-all ${isLogged ? 'text-cyan-200 scale-110' : 'text-zinc-600'}`}>
             {skill.shortForm}
          </span>
       </div>

       {/* Label */}
       <div className="w-full text-center mt-auto z-10 pointer-events-none">
         <span className={`text-[9px] sm:text-[11px] font-bold tracking-wide truncate block px-1 transition-colors ${isLogged ? 'text-cyan-100' : 'text-zinc-500'}`}>
            {skill.name}
         </span>
       </div>

       {/* Status Badges */}
       {skill.mode === 'counter' && isLogged && (
          <div 
             onClick={handleOpenRoller}
             className="absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-2 pointer-events-auto font-black text-[4.5rem] sm:text-[5.5rem] leading-none tracking-tighter text-cyan-400/80 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] mix-blend-screen hover:text-cyan-300 hover:scale-105 transition-all z-20"
          >
             {log.count}
          </div>
       )}
       {skill.mode === 'checkbox' && isLogged && (
          <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500 text-zinc-950 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)] border border-cyan-300">
             <Check size={14} strokeWidth={4} />
          </div>
       )}

       <AnimatePresence>
         {rollerOpen && <VerticalRoller value={log.count} onChange={(v) => onUpdateLog(skill.id, date, { count: v })} onClose={() => setRollerOpen(false)} />}
       </AnimatePresence>
    </div>
  )
}

// --- Matrix Mode Cell ---
const MatrixCell = ({ skill, log, date, isToday, onUpdateLog }: any) => {
  const [rollerOpen, setRollerOpen] = useState(false);
  const isLogged = skill.mode === 'counter' ? log.count > 0 : log.checked;
  
  const handleTap = () => {
    if (skill.mode === 'checkbox') onUpdateLog(skill.id, date, { checked: !log.checked });
    else {
      onUpdateLog(skill.id, date, { count: log.count + 1 });
      setRollerOpen(true);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (skill.mode === 'counter' && log.count > 0) {
       onUpdateLog(skill.id, date, { count: log.count - 1 });
    }
  };

  return (
    <div className="w-14 shrink-0 flex justify-center items-center relative py-1">
       <button 
          onClick={handleTap} 
          onContextMenu={handleRightClick}
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 outline-none ${
             isLogged ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)] scale-110' 
                      : `bg-zinc-900/50 border border-white/5 text-zinc-600 hover:bg-zinc-800 ${isToday ? 'border-zinc-700/50' : ''}`
          }`}
       >
          {skill.mode === 'counter' ? (log.count > 0 ? log.count : '') : (isLogged ? <Check size={14} strokeWidth={4} /> : '')}
       </button>
       <AnimatePresence>
         {rollerOpen && <VerticalRoller value={log.count} onChange={(v) => onUpdateLog(skill.id, date, { count: v })} onClose={() => setRollerOpen(false)} />}
       </AnimatePresence>
    </div>
  )
}

export default function DailyDashboardView({ skills, logs, onUpdateLog }: DailyDashboardViewProps) {
  const [viewMode, setViewMode] = useState<'focus' | 'matrix'>('focus');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const changeDate = (days: number) => {
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setCurrentDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  const categories = Array.from(new Set(skills.map(s => s.category)));

  // Setup Matrix Dates (Last 14 days)
  const matrixDates = Array.from({length: 14}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 13 + i);
    return {
      dateStr: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      isToday: i === 13
    };
  });

  const formattedDate = () => {
    const d = new Date(currentDate + 'T12:00:00');
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(d);
  };

  const isActuallyToday = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    return currentDate === todayStr;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full h-full overflow-y-auto relative bg-zinc-950 pb-24 md:pb-12 hide-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
           <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Logs</h1>
              <p className="text-zinc-500 font-medium">Track your daily progress</p>
           </div>
           <div className="flex items-center bg-zinc-900/40 p-1 rounded-2xl border border-white/5">
              <button onClick={() => setViewMode('focus')} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode==='focus' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-white'}`}>
                 <List size={16} /> Focus
              </button>
              <button onClick={() => setViewMode('matrix')} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${viewMode==='matrix' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-white'}`}>
                 <LayoutGrid size={16} /> Matrix
              </button>
           </div>
        </header>

        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl border-dashed">
            <p className="text-zinc-500">No skills available. Go to Manage Skills to create some.</p>
          </div>
        ) : (
          <>
            {viewMode === 'focus' && (
              <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
                 <div className="flex flex-col gap-4 bg-zinc-900/20 p-4 sm:p-5 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-white font-bold text-lg">{formattedDate()}</span>
                          <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">{isActuallyToday() ? 'Today' : 'Selected Date'}</span>
                       </div>
                       {!isActuallyToday() && (
                          <button onClick={setToday} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10">
                            Go to Today
                          </button>
                       )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                       <button onClick={() => changeDate(-7)} className="p-2 sm:p-3 text-zinc-500 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all shrink-0"><ChevronLeft size={18}/></button>
                       <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar w-full justify-between sm:justify-center px-1 py-2">
                          {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                             const d = new Date(currentDate + 'T12:00:00');
                             d.setDate(d.getDate() + offset);
                             const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                             const isSelected = offset === 0;
                             const todayStr = (() => { const td = new Date(); return `${td.getFullYear()}-${String(td.getMonth()+1).padStart(2,'0')}-${String(td.getDate()).padStart(2,'0')}`; })();
                             const isThisDayToday = dStr === todayStr;

                             return (
                                <button 
                                   key={dStr}
                                   onClick={() => setCurrentDate(dStr)}
                                   className={`flex flex-col items-center justify-center w-11 h-14 sm:w-14 sm:h-16 rounded-2xl border transition-all shrink-0 ${
                                      isSelected 
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-110 z-10'
                                        : isThisDayToday
                                           ? 'bg-zinc-800/80 border-white/10 text-white'
                                           : 'bg-black/20 border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-white'
                                   }`}
                                >
                                   <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest opacity-80">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                   <span className="text-base sm:text-lg font-black mt-0.5">{d.getDate()}</span>
                                </button>
                             );
                          })}
                       </div>
                       <button onClick={() => changeDate(7)} className="p-2 sm:p-3 text-zinc-500 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all shrink-0"><ChevronRight size={18}/></button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-4 mt-1 border-t border-white/5 snap-x">
                       <button
                          onClick={() => setActiveCategory('All')}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-start border shrink-0 ${activeCategory === 'All' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-transparent text-zinc-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                       >
                         All Categories
                       </button>
                       {categories.map(cat => (
                         <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-start border shrink-0 ${activeCategory === cat ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-transparent text-zinc-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 {(activeCategory === 'All' ? categories : categories.filter(c => c === activeCategory)).map(cat => {
                    const catSkills = skills.filter(s => s.category === cat);
                    if (!catSkills.length) return null;
                    return (
                       <div key={cat} className="flex flex-col gap-3">
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">{cat}</div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                             {catSkills.map(skill => (
                                <CompactBentoCard key={skill.id} skill={skill} log={getLog(logs, skill.id, currentDate)} date={currentDate} onUpdateLog={onUpdateLog} />
                             ))}
                          </div>
                       </div>
                    )
                 })}
              </div>
            )}

            {viewMode === 'matrix' && (
              <div className="w-full overflow-x-auto hide-scrollbar pb-8 relative">
                <div className="flex min-w-max border-b border-white/5 pb-4 mb-4">
                   <div className="w-48 sm:w-56 shrink-0 sticky left-0 z-20 bg-zinc-950/80 backdrop-blur" />
                   {matrixDates.map(d => (
                      <div key={d.dateStr} className={`w-14 shrink-0 flex flex-col items-center justify-end font-mono text-[10px] uppercase tracking-wider ${d.isToday ? 'text-cyan-400 font-bold' : 'text-zinc-500'}`}>
                         <span>{d.label.split(' ')[0]}</span>
                         <span className="text-sm mt-1">{d.label.split(' ')[1]}</span>
                      </div>
                   ))}
                </div>
                
                {categories.map(cat => {
                   const catSkills = skills.filter(s => s.category === cat);
                   if (!catSkills.length) return null;
                   return (
                      <div key={cat} className="mb-6">
                         <div className="sticky left-0 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3 ml-2 z-20">{cat}</div>
                         <div className="flex flex-col gap-1">
                            {catSkills.map(skill => (
                               <div key={skill.id} className="flex min-w-max items-center group hover:bg-zinc-900/20 rounded-xl transition-colors">
                                  <div className="w-48 sm:w-56 shrink-0 sticky left-0 z-20 bg-zinc-950/90 backdrop-blur flex items-center gap-3 pr-4 py-1">
                                     <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-black text-xs text-zinc-500 border border-white/5">{skill.shortForm}</div>
                                     <span className="text-zinc-300 text-sm font-medium truncate">{skill.name}</span>
                                  </div>
                                  {matrixDates.map(d => (
                                     <MatrixCell key={d.dateStr} skill={skill} log={getLog(logs, skill.id, d.dateStr)} date={d.dateStr} isToday={d.isToday} onUpdateLog={onUpdateLog} />
                                  ))}
                               </div>
                            ))}
                         </div>
                      </div>
                   );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
