import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { getCategoryTheme } from './DailyDashboardView';
import { AVAILABLE_ICONS, getSkillIcon } from './icons';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  logs: SkillLog[];
  categories: string[];
  categoryColors: Record<string, string>;
}

const getLocalYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseDateStr = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatShort = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)}/${parseInt(m)}`; 
};

const formatLong = (dateStr: string) => {
  const date = parseDateStr(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); 
};

const getDotClass = (themeColorName: string) => {
  const map: Record<string, string> = {
    'emerald': 'bg-emerald-500',
    'rose': 'bg-rose-500',
    'violet': 'bg-violet-500',
    'amber': 'bg-amber-500',
    'cyan': 'bg-cyan-500',
    'indigo': 'bg-indigo-500',
    'fuchsia': 'bg-fuchsia-500',
  };
  return map[themeColorName] || 'bg-cyan-500';
};

export default function HistorySidebar({ isOpen, onClose, skills, logs, categories, categoryColors }: HistorySidebarProps) {
  const [longDate, setLongDate] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  

  const todayStr = getLocalYMD(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);
    
    return { year, month, days };
  }, [calendarMonth]);
  const getDotsForDate = (dateStr: string) => {
    const catsLogged = new Set<string>();
    skills.forEach(skill => {
      const log = logs.find(l => l.skillId === skill.id && l.date === dateStr);
      if (log && (log.count > 0 || log.checked || (log.value !== undefined && log.value > 0))) {
        catsLogged.add(skill.category);
      }
    });
    return Array.from(catsLogged).map(c => getCategoryTheme(c, categoryColors).name);
  };
  const renderAgenda = () => {
    if (!selectedDate) return <div className="text-center text-zinc-500 py-12">Select a date to view logs</div>;
    
    const logsForDay = categories.map(cat => {
      const catSkills = skills.filter(s => s.category === cat);
      const activeLogs = catSkills.map(skill => {
        const log = logs.find(l => l.skillId === skill.id && l.date === selectedDate);
        if (log && (log.count > 0 || log.checked || (log.value !== undefined && log.value > 0))) return { skill, log };
        return null;
      }).filter(Boolean) as { skill: Skill, log: SkillLog }[];
      
      if (!activeLogs.length) return null;
      return { cat, logs: activeLogs };
    }).filter(Boolean) as { cat: string, logs: { skill: Skill, log: SkillLog }[] }[];

    if (!logsForDay.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <CalendarDays className="w-10 h-10 mb-4 opacity-30" />
          <p className="text-sm font-medium">No activity on this date.</p>
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col mt-2 pb-8 px-2 sm:px-4"
        >
          <h4 className="font-bold text-white text-xl px-1 border-b border-white/5 pb-3 mb-4">{formatLong(selectedDate)}</h4>
          {logsForDay.map(({cat, logs}) => {
            const theme = getCategoryTheme(cat, categoryColors);
            return (
              <div key={cat} className="flex flex-col mb-6">
                <h5 className={`text-[11px] font-bold uppercase tracking-widest ${theme.textCategory} mb-2 px-1`}>{cat}</h5>
                <div className="flex flex-col">
                  {logs.map(({skill, log}, idx) => (
                    <div key={skill.id} className="flex justify-between items-center py-2.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${getDotClass(theme.name)} shadow-sm`} />
                        <span className="text-zinc-200 font-medium text-sm sm:text-base flex items-center gap-2">
                          {(() => {
                             const IconComp = getSkillIcon(skill);
                             return <IconComp size={16} className={theme.textCategory} />;
                          })()}
                          {skill.name}
                        </span>
                      </div>
                      <div className="text-white font-semibold text-base">
                        {skill.mode === 'counter' ? (
                          skill.unit ? `${log.count} ${skill.unit}` : log.count
                        ) : skill.mode === 'measurement' ? (
                          `${log.value !== undefined ? log.value : log.count} ${skill.unit || ''}`
                        ) : skill.mode === 'timer' ? (
                          log.timerDuration ? `${Math.round(log.timerDuration / 1000)}s` : `${log.count} laps`
                        ) : (
                          <Check className="w-5 h-5 text-zinc-400" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    );
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-zinc-950/90 backdrop-blur-xl z-10 sticky top-0">
              <h2 className="text-xl font-semibold text-white tracking-tight">History</h2>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors ml-1 outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              <div className="flex flex-col">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6 px-4">
                     <button onClick={prevMonth} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors outline-none">
                        <ChevronLeft className="w-5 h-5" />
                     </button>
                     <h3 className="text-sm font-black text-white tracking-widest uppercase">
                        {calendarMonth.toLocaleDateString('en-US', { month: 'short' })} '{String(calendarMonth.getFullYear()).slice(2)}
                     </h3>
                     <button onClick={nextMonth} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors outline-none">
                        <ChevronRight className="w-5 h-5" />
                     </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="mb-8 px-2 sm:px-4">
                     <div className="grid grid-cols-7 gap-y-4 gap-x-2 sm:gap-x-3">
                        {['M','T','W','T','F','S','S'].map((d, i) => (
                           <div key={i} className="text-center text-[10px] font-bold text-zinc-500 mb-2">{d}</div>
                        ))}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={calendarMonth.toString()}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="col-span-7 grid grid-cols-7 gap-y-3 gap-x-1 sm:gap-x-2"
                          >
                          {calendarData.days.map((d, i) => {
                             if (!d) return <div key={`empty-${i}`} className="aspect-square" />;
                             const dateStr = `${calendarData.year}-${String(calendarData.month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                             const isSelected = selectedDate === dateStr;
                             const isToday = todayStr === dateStr;
                             const dots = getDotsForDate(dateStr);
                             
                             return (
                                <div key={i} className="flex justify-center">
                                   <button 
                                      onClick={() => setSelectedDate(dateStr)} 
                                      className={`w-11 h-11 sm:w-12 sm:h-12 flex flex-col items-center justify-center rounded-full relative transition-all outline-none
                                         ${isSelected 
                                            ? 'bg-white text-black shadow-md z-10 font-black scale-110' 
                                            : isToday 
                                               ? 'bg-zinc-800 text-white font-bold border border-zinc-700' 
                                               : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white font-medium'
                                         }
                                      `}
                                   >
                                      <span className="text-[14px] sm:text-base leading-none mb-0.5">{d}</span>
                                      {dots.length > 0 && (
                                         <div className="flex gap-0.5 absolute bottom-1.5 sm:bottom-2">
                                            {dots.slice(0, 3).map((colorName, idx) => (
                                               <div key={idx} className={`w-1 h-1 rounded-full ${getDotClass(colorName)}`} />
                                            ))}
                                         </div>
                                      )}
                                   </button>
                                </div>
                             )
                          })}
                          </motion.div>
                        </AnimatePresence>
                     </div>
                  </div>
                  
                  {/* Agenda View */}
                  {renderAgenda()}
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
