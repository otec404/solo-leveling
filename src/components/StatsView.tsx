import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { THEMES } from './DailyDashboardView';
import MasterCalendarView from './MasterCalendarView';

import { CalendarDays, FastForward } from 'lucide-react';
import { AVAILABLE_ICONS, getSkillIcon } from './icons';
import TimelapsePlayerModal from './TimelapsePlayerModal';

interface StatsViewProps {
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  userId: string;
}

export const THEME_COLORS: Record<string, string> = {
  emerald: '#10b981',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  fuchsia: '#d946ef',
  black: '#ffffff',
};

const getLogValue = (log: SkillLog | undefined, skill: Skill) => {
  if (!log) return 0;
  if (skill.mode === 'measurement') {
    return log.value !== undefined ? log.value : log.count;
  }
  return skill.mode === 'counter' ? log.count : (log.checked ? 1 : 0);
};

const dateToYMD = (d: Date) => 
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function useSwipeDirection(onSwipe: (dir: 'next' | 'prev') => void) {
  const startRef = useRef<{ x: number, y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const endX = e.clientX;
    const endY = e.clientY;
    
    const dx = startRef.current.x - endX;
    const dy = startRef.current.y - endY;
    
    // Horizontal swipe must be deliberate
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 2) {
      onSwipe(dx > 0 ? 'next' : 'prev');
    }
    startRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const dx = startRef.current.x - endX;
    const dy = startRef.current.y - endY;
    
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 2) {
      onSwipe(dx > 0 ? 'next' : 'prev');
    }
    startRef.current = null;
  };

  return { handleTouchStart, handleTouchEnd, handlePointerDown, handlePointerUp };
}

export default function StatsView({ skills, logs, categoryColors, userId }: StatsViewProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showMasterCalendar, setShowMasterCalendar] = useState(false);
  const [showTimelapse, setShowTimelapse] = useState(false);

  if (showMasterCalendar) {
    return (
      <MasterCalendarView
        skills={skills}
        logs={logs}
        categoryColors={categoryColors}
        onBack={() => setShowMasterCalendar(false)}
        onJumpToSkill={(s) => { setShowMasterCalendar(false); setSelectedSkill(s); }}
      />
    );
  }

  if (selectedSkill) {
    return (
      <ContinuousSkillCalendar 
        skill={selectedSkill} 
        logs={logs} 
        categoryColors={categoryColors} 
        onBack={() => setSelectedSkill(null)} 
      />
    );
  }

  return (
    <>
      <AnalyticsHome 
        skills={skills} 
        logs={logs} 
        categoryColors={categoryColors} 
        onSelect={setSelectedSkill} 
        onOpenMaster={() => setShowMasterCalendar(true)}
        onOpenTimelapse={() => setShowTimelapse(true)}
      />

      {showTimelapse && (
        <TimelapsePlayerModal
          isOpen={showTimelapse}
          onClose={() => setShowTimelapse(false)}
          skills={skills}
          logs={logs}
          categoryColors={categoryColors}
        />
      )}
    </>
  );
}

function AnalyticsHome({ skills, logs, categoryColors, onSelect, onOpenMaster, onOpenTimelapse }: any) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = useMemo(() => Array.from(new Set(skills.map((s: Skill) => s.category))), [skills]);
  const visibleCategories = activeCategory === 'All' ? categories : categories.filter(c => c === activeCategory);

  return (
    <div className="flex-1 h-full flex flex-col bg-[var(--app-bg,#0B0B0D)] overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">Analytics</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col gap-16">
          {/* Master Calendar & Timelapse Entries */}
          {(activeCategory === 'All') && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Global Visualizations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={onOpenMaster}
                  className="flex flex-col items-start p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 border border-white/10 hover:border-white/20 rounded-3xl hover:bg-zinc-900 transition-all text-left group overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_inset_0_0_20px_rgba(255,255,255,0.03)]"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <CalendarDays className="text-purple-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">Master Calendar</h3>
                  <p className="text-sm text-zinc-400 font-semibold mt-1 uppercase tracking-widest">Combined Overview</p>
                </button>

                <button
                  onClick={onOpenTimelapse}
                  className="flex flex-col items-start p-6 bg-gradient-to-br from-indigo-950/40 via-zinc-900/90 to-zinc-950/95 border border-purple-500/20 hover:border-purple-500/40 rounded-3xl hover:bg-zinc-900 transition-all text-left group overflow-hidden relative shadow-[inset_0_1px_1px_rgba(168,85,247,0.2),_inset_0_0_20px_rgba(168,85,247,0.05)]"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <FastForward className="text-purple-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">Time-Lapse Replay</h3>
                  <p className="text-sm text-zinc-400 font-semibold mt-1 uppercase tracking-widest">Dynamic Habit Evolution</p>
                </button>
              </div>
            </div>
          )}
          {visibleCategories.map((cat: any) => {
            const catSkills = skills.filter((s: Skill) => s.category === cat);
            const themeName = categoryColors[cat] || 'cyan';
            const theme = THEMES[themeName] || THEMES['cyan'];
            
            return (
              <div key={cat} className="flex flex-col gap-6">
                <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme.textCategory}`}>{cat}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catSkills.map((skill: Skill, i: number) => {
                    const skillLogs = logs.filter((l: SkillLog) => l.skillId === skill.id && (l.count > 0 || l.checked || (l.value !== undefined && l.value > 0)));
                    const sortedLogs = [...skillLogs].sort((a, b) => a.date.localeCompare(b.date));
                    const total = skill.mode === 'measurement'
                      ? (sortedLogs.length > 0 ? (sortedLogs[sortedLogs.length - 1].value ?? sortedLogs[sortedLogs.length - 1].count) : 0)
                      : skillLogs.reduce((acc: number, l: SkillLog) => acc + (skill.mode === 'counter' ? l.count : 1), 0);
                    
                    const sortedDates = [...skillLogs.map((l: SkillLog) => l.date)].sort((a,b)=>a.localeCompare(b));
                    let maxStreak = 0;
                    let currentStreak = 0;
                    let prevDate: Date | null = null;
                    
                    sortedDates.forEach(dStr => {
                      const d = new Date(dStr + 'T12:00:00');
                      if (!prevDate) {
                        currentStreak = 1;
                      } else {
                        const diffTime = Math.abs(d.getTime() - prevDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                          currentStreak++;
                        } else if (diffDays > 1) {
                          currentStreak = 1;
                        }
                      }
                      if (currentStreak > maxStreak) maxStreak = currentStreak;
                      prevDate = d;
                    });

                    const Icon = getSkillIcon(skill);

                    return (
                      <motion.div 
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.2) }}
                        onClick={() => onSelect(skill)}
                        className="bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden backdrop-blur-xl cursor-pointer hover:bg-zinc-850/80 transition-all active:scale-[0.98] group shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_inset_0_0_20px_rgba(255,255,255,0.03)]"
                      >
                        {/* Top specular highlight */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        <div className="absolute -right-3 -bottom-3 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                          <Icon size={80} strokeWidth={2} className="text-white" />
                        </div>
                        <div className="flex flex-col min-w-0 z-10">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-bold text-white truncate group-hover:text-zinc-200 transition-colors">{skill.name}</h3>
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                              <Icon size={16} className={theme.textCategory} />
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{skill.mode === 'measurement' ? 'latest value' : 'total'}</p>
                            <p className="text-3xl font-black text-white">{total} <span className="text-xs text-zinc-500 font-bold">{skill.unit || ''}</span></p>
                          </div>
                          {maxStreak > 0 && skill.mode !== 'measurement' && (
                            <div className="mt-3">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">best streak</p>
                              <p className="text-sm font-bold text-zinc-300">{maxStreak} d</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContinuousSkillCalendar({ skill, logs, categoryColors, onBack }: any) {
  const [zoomLevel, setZoomLevel] = useState(0); // 0=Day, 1=Week, 2=Month, 3=Year
  const [focusedDateStr, setFocusedDateStr] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  const themeName = categoryColors[skill.category] || 'cyan';
  const colorHex = THEME_COLORS[themeName] || THEME_COLORS['cyan'];
  
  const skillLogs = useMemo(() => logs.filter((l: SkillLog) => l.skillId === skill.id), [logs, skill.id]);

  const maxBaseline = useMemo(() => {
    const vals = skillLogs.filter((l: SkillLog) => l.count > 0 || l.checked).map((l: SkillLog) => getLogValue(l, skill)).sort((a: number, b: number) => a - b);
    let max = 1;
    if (vals.length > 0) {
      max = vals[Math.floor(vals.length * 0.9)] || vals[vals.length - 1];
    }
    return Math.max(max, 1);
  }, [skillLogs, skill]);

  const handleSwipeTime = (direction: 'next' | 'prev') => {
    const d = new Date(focusedDateStr + 'T12:00:00');
    const sign = direction === 'next' ? 1 : -1;
    if (zoomLevel === 0) d.setDate(d.getDate() + sign * 1);
    else if (zoomLevel === 1) d.setDate(d.getDate() + sign * 7);
    else if (zoomLevel === 2) d.setMonth(d.getMonth() + sign * 1);
    else if (zoomLevel === 3) d.setFullYear(d.getFullYear() + sign * 1);
    setFocusedDateStr(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  };

  // Basic swipe handling removed in favor of explicit buttons for better UX,
  // but keeping wrapper in case we want to re-add gesture listeners easily.

  const { handleTouchStart, handleTouchEnd, handlePointerDown, handlePointerUp } = useSwipeDirection(handleSwipeTime);

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col h-full overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-col pt-safe-top bg-zinc-950/80 backdrop-blur-2xl z-20 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <button onClick={onBack} className="p-2 -ml-2 bg-transparent hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="text-zinc-400 hover:text-white" size={28} />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
            <div className="flex items-center justify-center gap-2 max-w-full">
              {(() => {
                const Icon = getSkillIcon(skill);
                return <Icon size={18} className="text-zinc-300 shrink-0" />;
              })()}
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">{skill.name}</h2>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-0.5 text-zinc-500">{skill.category}</p>
          </div>
          <button 
            onClick={() => {
              const d = new Date();
              setFocusedDateStr(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]);
            }}
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 active:bg-zinc-800 transition-colors"
          >
            Today
          </button>
        </div>

        </div>
      
      {/* Views Container */}
      <div className="flex-1 relative flex overflow-hidden bg-zinc-950 pb-20 md:pb-0">
        <div 
          className="flex-1 relative overflow-hidden pr-14 sm:pr-20 md:pr-24"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
        <AnimatePresence mode="wait">
          {zoomLevel === 0 && <DayZoomView key={`day-${focusedDateStr}`} focusedDateStr={focusedDateStr} skill={skill} skillLogs={skillLogs} colorHex={colorHex} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
          {zoomLevel === 1 && <WeekZoomView key={`week-${focusedDateStr}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} setZoomLevel={setZoomLevel} skill={skill} skillLogs={skillLogs} colorHex={colorHex} maxBaseline={maxBaseline} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
          {zoomLevel === 2 && <MonthZoomView key={`month-${focusedDateStr.substring(0,7)}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} setZoomLevel={setZoomLevel} skill={skill} skillLogs={skillLogs} colorHex={colorHex} maxBaseline={maxBaseline} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
          {zoomLevel === 3 && <YearZoomView key={`year-${focusedDateStr.substring(0,4)}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} setZoomLevel={setZoomLevel} skill={skill} skillLogs={skillLogs} colorHex={colorHex} maxBaseline={maxBaseline} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
        </AnimatePresence>
        </div>
        <ZoomScroller zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      </div>
    </div>
  );
}

// ---- DAY VIEW ---- //
function DayZoomView({ focusedDateStr, skill, skillLogs, colorHex, onPrev, onNext }: any) {
  const dObj = new Date(focusedDateStr + 'T12:00:00');
  const dayName = dObj.toLocaleDateString('default', { weekday: 'long' });
  const dateFormatted = dObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const log = skillLogs.find((l: SkillLog) => l.date === focusedDateStr);
  const val = log ? getLogValue(log, skill) : 0;
  const isDone = val > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col items-center justify-between p-4 sm:p-8 w-full overflow-y-auto custom-scrollbar"
    >
      <div className="flex flex-col items-center text-center w-full max-w-md mt-4 sm:mt-6 z-20 shrink-0">
        <div className="flex items-center justify-between w-full mb-2">
          <button onClick={() => { onPrev(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">{dayName}</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{dateFormatted}</p>
          </div>
          <button onClick={() => { onNext(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Stylish Daily Count Display Card */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center my-6 z-10 relative">
        <div className="relative w-full rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),_0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden">
          {/* Top specular highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
          
          {/* Ambient Glow */}
          {isDone && (
            <div 
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
              style={{ backgroundColor: colorHex }}
            />
          )}

          {/* Status Capsule */}
          <div className="mb-4 z-10">
            <span 
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isDone ? 'bg-white/15 text-white border border-white/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50'}`}
              style={isDone ? { boxShadow: `0 0 15px ${colorHex}40` } : {}}
            >
              {isDone ? (skill.mode === 'counter' ? 'Daily Log Active' : 'Completed') : 'No Log Recorded'}
            </span>
          </div>

          {/* Sculpted Giant Count */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className={`text-7xl sm:text-9xl leading-none font-black tracking-tighter text-center select-none ${isDone ? 'text-white' : 'text-zinc-700'}`}
            style={{ 
              textShadow: isDone ? `0 0 40px ${colorHex}80, 0 0 80px ${colorHex}30` : 'none' 
            }}
          >
            {val}
          </motion.div>

          {/* Unit / Descriptor */}
          <div className="mt-2 text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-400 z-10">
            {skill.mode === 'counter' ? (skill.unit || 'Count') : (isDone ? 'Status: Done' : 'Status: Incomplete')}
          </div>

          {log?.notes && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 text-center max-w-xs z-10">
              "{log.notes}"
            </div>
          )}
        </div>
      </div>

      <div className="h-6" />
    </motion.div>
  );
}

// ---- WEEK VIEW ---- //
function WeekZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const weekDays = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const day = dObj.getDay();
    const diff = dObj.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(dObj.setDate(diff));
    
    const days = [];
    let total = 0;
    let activeDaysCount = 0;
    for(let i=0; i<7; i++) {
      const cur = new Date(monday);
      cur.setDate(cur.getDate() + i);
      const curStr = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
      const log = skillLogs.find((l: SkillLog) => l.date === curStr);
      const val = log ? getLogValue(log, skill) : 0;
      total += val;
      if (val > 0) activeDaysCount++;
      days.push({
        dateStr: curStr,
        dayNum: cur.getDate(),
        dayName: cur.toLocaleDateString('default', { weekday: 'short' }),
        val,
        intensity: val / maxBaseline
      });
    }
    const avg = total > 0 ? (total / 7).toFixed(1) : '0';

    // Calculate previous week total for period-over-period comparison
    let prevWeekTotal = 0;
    for(let i=0; i<7; i++) {
      const prevCur = new Date(monday);
      prevCur.setDate(prevCur.getDate() - 7 + i);
      const prevStr = `${prevCur.getFullYear()}-${String(prevCur.getMonth()+1).padStart(2,'0')}-${String(prevCur.getDate()).padStart(2,'0')}`;
      const log = skillLogs.find((l: SkillLog) => l.date === prevStr);
      const val = log ? getLogValue(log, skill) : 0;
      prevWeekTotal += val;
    }

    let comparisonText = '';
    let comparisonPositive = true;
    if (prevWeekTotal === 0) {
      comparisonText = total > 0 ? '+100% vs last week' : '0% vs last week';
      comparisonPositive = total > 0;
    } else {
      const pct = Math.round(((total - prevWeekTotal) / prevWeekTotal) * 100);
      comparisonText = `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
      comparisonPositive = pct >= 0;
    }

    return { days, total, activeDaysCount, avg, comparisonText, comparisonPositive };
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  const monthLabel = new Date(focusedDateStr + 'T12:00:00').toLocaleDateString('default', { month: 'long', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col justify-between px-3 sm:px-8 py-6 max-w-2xl mx-auto w-full overflow-y-auto custom-scrollbar"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">{monthLabel}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-xs">
              ⚡ {weekDays.total} Total {skill.unit || 'Logs'}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-semibold">
              Avg {weekDays.avg}/day
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className={`text-xs font-mono font-bold ${weekDays.comparisonPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {weekDays.comparisonText}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { onPrev(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2.5 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button onClick={() => { onNext(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2.5 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Week Bars Chart with Clear Numeric Headings */}
      <div className="h-64 sm:h-80 w-full flex items-end justify-between gap-1.5 sm:gap-3 pb-2 mt-auto">
        {weekDays.days.map((d, i) => {
          const isFocused = d.dateStr === focusedDateStr;
          return (
            <div 
              key={d.dateStr} 
              className="flex-1 flex flex-col h-full items-center justify-end gap-2 group relative cursor-pointer" 
              onClick={() => { setFocusedDateStr(d.dateStr); setZoomLevel(0); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }}
            >
              {/* Distinct Count Badge Above Bar */}
              <div className={`px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs font-black transition-all ${d.val > 0 ? 'bg-white/15 text-white border border-white/20' : 'text-zinc-600'}`}>
                {d.val}
              </div>

              {/* Bar Fill */}
              <div className={`w-full relative rounded-2xl bg-zinc-900/80 overflow-hidden flex-1 flex flex-col justify-end transition-all border ${isFocused ? 'border-white/40 ring-1 ring-white/30' : 'border-zinc-800/50'}`}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(d.val > 0 ? 8 : 0, Math.min(100, d.intensity * 100))}%` }}
                  transition={{ delay: i * 0.04, type: 'spring', bounce: 0.2, duration: 0.7 }}
                  className="w-full rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.25)]"
                  style={{ backgroundColor: colorHex }}
                />
              </div>

              {/* Day Initial + Date Number */}
              <div className="flex flex-col items-center">
                <span className={`text-[10px] sm:text-xs font-black uppercase ${isFocused ? 'text-white' : 'text-zinc-400'}`}>
                  {d.dayName}
                </span>
                <span className={`text-[10px] font-bold ${isFocused ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {d.dayNum}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </motion.div>
  );
}

// ---- MONTH VIEW ---- //
function MonthZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const monthData = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const y = dObj.getFullYear();
    const m = dObj.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-Sun
    
    let monthTotal = 0;
    let activeDaysCount = 0;
    const days = [];
    for(let i=0; i<startOffset; i++) days.push(null);
    for(let d=1; d<=daysInMonth; d++) {
      const curStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = skillLogs.find((l: SkillLog) => l.date === curStr);
      const val = log ? getLogValue(log, skill) : 0;
      monthTotal += val;
      if (val > 0) activeDaysCount++;
      days.push({
        dateStr: curStr,
        dayNum: d,
        val,
        intensity: val / maxBaseline
      });
    }
    // Pad to 42 for a perfect 6x7 grid
    while(days.length < 42) days.push(null);

    // Calculate previous month total for period-over-period comparison
    const prevY = m === 0 ? y - 1 : y;
    const prevM = m === 0 ? 11 : m - 1;
    const prevDaysInMonth = new Date(prevY, prevM + 1, 0).getDate();
    let prevMonthTotal = 0;
    for(let d=1; d<=prevDaysInMonth; d++) {
      const prevStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = skillLogs.find((l: SkillLog) => l.date === prevStr);
      const val = log ? getLogValue(log, skill) : 0;
      prevMonthTotal += val;
    }

    let comparisonText = '';
    let comparisonPositive = true;
    if (prevMonthTotal === 0) {
      comparisonText = monthTotal > 0 ? '+100% vs last month' : '0% vs last month';
      comparisonPositive = monthTotal > 0;
    } else {
      const pct = Math.round(((monthTotal - prevMonthTotal) / prevMonthTotal) * 100);
      comparisonText = `${pct >= 0 ? '+' : ''}${pct}% vs last month`;
      comparisonPositive = pct >= 0;
    }

    return {
      label: dObj.toLocaleDateString('default', { month: 'long', year: 'numeric' }),
      monthTotal,
      activeDaysCount,
      days,
      comparisonText,
      comparisonPositive
    };
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col px-3 sm:px-8 max-w-md mx-auto py-6 sm:py-8 w-full overflow-y-auto custom-scrollbar"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{monthData.label}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[11px]">
              {monthData.monthTotal} Total {skill.unit || 'Logs'}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-[11px] text-zinc-400 font-semibold">
              {monthData.activeDaysCount} Active Days
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className={`text-[11px] font-mono font-bold ${monthData.comparisonPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {monthData.comparisonText}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { onPrev(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button onClick={() => { onNext(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="w-full flex-1">
        <div className="grid grid-cols-7 mb-2">
          {['M','T','W','T','F','S','S'].map((h, i) => (
            <div key={i} className="text-center text-[10px] sm:text-xs font-bold text-zinc-500 uppercase">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1.5 sm:gap-y-2.5 gap-x-1 sm:gap-x-2">
          {monthData.days.map((d: any, i: number) => {
            if (!d) return <div key={i} className="aspect-square" />;
            const isToday = d.dateStr === focusedDateStr;
            const hasCount = d.val > 0;
            return (
              <div 
                key={d.dateStr} 
                className={`aspect-square flex flex-col items-center justify-between p-1 rounded-xl sm:rounded-2xl cursor-pointer group relative border transition-all ${hasCount ? 'bg-zinc-900/60 border-white/15' : 'bg-zinc-900/30 border-zinc-800/40 hover:bg-zinc-800/60'}`}
                onClick={() => { setFocusedDateStr(d.dateStr); setZoomLevel(0); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }}
              >
                <motion.div 
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-all duration-300 pointer-events-none ${isToday ? 'ring-2 ring-white' : ''}`}
                  style={{ 
                    backgroundColor: hasCount ? colorHex : 'transparent',
                    opacity: hasCount ? Math.max(0.15, Math.min(0.85, (d.intensity * 0.7) + 0.15)) : 0,
                  }}
                />
                
                <span className={`relative z-10 text-[10px] sm:text-xs font-bold ${hasCount ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {d.dayNum}
                </span>

                {/* Clear Daily Count Indicator on Monthly Map */}
                {hasCount && (
                  <span className="relative z-10 text-[9px] sm:text-[10px] font-black px-1 py-0.2 rounded bg-black/50 text-white border border-white/10 shadow-sm">
                    {d.val}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ---- YEAR VIEW ---- //
function YearZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const [inspectedDay, setInspectedDay] = useState<{ dateStr: string, val: number } | null>(null);

  const { year, months, yearTotal, activeDays } = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const y = dObj.getFullYear();
    const res = [];
    let yTotal = 0;
    let yActiveDays = 0;
    
    for(let m=0; m<12; m++) {
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const firstDay = new Date(y, m, 1).getDay();
      const startOffset = firstDay === 0 ? 6 : firstDay - 1; 
      
      const days = [];
      let mTotal = 0;
      
      for(let i=0; i<startOffset; i++) days.push(null);
      for(let d=1; d<=daysInMonth; d++) {
        const curStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const log = skillLogs.find((l: SkillLog) => l.date === curStr);
        const val = log ? getLogValue(log, skill) : 0;
        mTotal += val;
        yTotal += val;
        if (val > 0) yActiveDays++;
        days.push({
          dateStr: curStr,
          dayNum: d,
          val,
          intensity: val / maxBaseline
        });
      }
      while(days.length < 42) days.push(null);
      
      res.push({
        name: new Date(y, m, 1).toLocaleDateString('default', { month: 'short' }),
        monthStr: String(m + 1).padStart(2, '0'),
        total: mTotal,
        days
      });
    }
    return { year: y, months: res, yearTotal: yTotal, activeDays: yActiveDays };
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex flex-col pt-4 pb-16 px-3 sm:px-8 max-w-5xl mx-auto w-full overflow-y-auto custom-scrollbar"
    >
      {/* Year View Header with Overall Year Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0 px-1">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => { onPrev(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{year}</h3>
            <button onClick={() => { onNext(); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-xs">
              ⚡ {yearTotal} Total {skill.unit || 'Logs'} in {year}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-semibold">
              {activeDays} Active Days
            </span>
          </div>
        </div>

        {/* Daily Count Interactive Hover/Tap Inspector */}
        {inspectedDay && (
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="font-bold uppercase text-zinc-300">{new Date(inspectedDay.dateStr + 'T12:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric' })}:</span>
            <span className="font-black text-white" style={{ color: colorHex }}>{inspectedDay.val} {skill.unit || 'Logs'}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pb-24">
        {months.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
            key={m.name} 
            className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-white/10 cursor-pointer transition-all group" 
            onClick={() => { setFocusedDateStr(`${year}-${m.monthStr}-01`); setZoomLevel(2); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]); }}
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors uppercase tracking-widest">{m.name}</span>
              {m.total > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-white/10 text-white">
                  {m.total}
                </span>
              )}
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {m.days.map((d: any, j: number) => {
                if (!d) return <div key={j} className="aspect-square rounded-[2px]" />;
                const isSelected = inspectedDay?.dateStr === d.dateStr;
                return (
                  <div 
                    key={j}
                    onMouseEnter={() => setInspectedDay({ dateStr: d.dateStr, val: d.val })}
                    onClick={(e) => { e.stopPropagation(); setInspectedDay({ dateStr: d.dateStr, val: d.val }); }}
                    title={`${d.dateStr}: ${d.val} logs`}
                    className={`aspect-square rounded-[2px] sm:rounded-sm transition-all cursor-pointer ${isSelected ? 'ring-1 ring-white scale-125 z-10' : ''}`}
                    style={{ 
                      backgroundColor: d.val > 0 ? colorHex : '#27272a',
                      opacity: d.val > 0 ? Math.max(0.35, Math.min(1, (d.intensity * 0.65) + 0.35)) : 0.3
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}



function ZoomScroller({ zoomLevel, setZoomLevel }: any) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [isActive, setIsActive] = useState(false);

  const updateZoom = (clientY: number) => {
    if (!scrollerRef.current) return;
    const rect = scrollerRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    const progress = y / rect.height; 
    
    let index = Math.floor(progress * 4);
    if (index === 4) index = 3;
    
    const levels = [3, 2, 1, 0];
    const newZoom = levels[index];
    
    if (newZoom !== zoomLevel) setZoomLevel(newZoom);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsActive(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateZoom(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      updateZoom(e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    setIsActive(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const thumbTop = zoomLevel === 3 ? '12.5%' : zoomLevel === 2 ? '37.5%' : zoomLevel === 1 ? '62.5%' : '87.5%';
  const levels = ['Y', 'M', 'W', 'D'];

  return (
    <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20">
      <motion.div 
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        animate={{ scale: isActive ? 1.05 : 1 }}
        className="w-10 sm:w-12 h-[260px] sm:h-[300px] bg-zinc-900/40 rounded-full flex flex-col items-center justify-between py-6 relative cursor-ns-resize select-none touch-none border border-white/5 backdrop-blur-xl shadow-2xl transition-colors hover:bg-zinc-900/60"
      >
        <motion.div 
          className="absolute w-8 sm:w-10 h-[22%] bg-white/10 rounded-full left-1 -translate-y-1/2 pointer-events-none border border-white/20 shadow-md backdrop-blur-2xl flex flex-col items-center justify-center gap-1"
          animate={{ 
            top: thumbTop,
            backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="w-3 h-[2px] bg-white/30 rounded-full" />
          <div className="w-3 h-[2px] bg-white/30 rounded-full" />
        </motion.div>
        
        {levels.map((lbl, i) => {
          const isSelected = 
            (i === 0 && zoomLevel === 3) || 
            (i === 1 && zoomLevel === 2) || 
            (i === 2 && zoomLevel === 1) || 
            (i === 3 && zoomLevel === 0);
            
          return (
            <div key={lbl} className="flex-1 flex items-center justify-center z-10 pointer-events-none">
              <span className={`text-[10px] sm:text-xs font-black transition-colors duration-300 ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                {lbl}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  );
}
