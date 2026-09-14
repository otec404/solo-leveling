import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { THEMES } from './DailyDashboardView';
import { AVAILABLE_ICONS } from './icons';

interface StatsViewProps {
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
}

const THEME_COLORS: Record<string, string> = {
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

export default function StatsView({ skills, logs, categoryColors }: StatsViewProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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
    <AnalyticsHome 
      skills={skills} 
      logs={logs} 
      categoryColors={categoryColors} 
      onSelect={setSelectedSkill} 
    />
  );
}

function AnalyticsHome({ skills, logs, categoryColors, onSelect }: any) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = useMemo(() => Array.from(new Set(skills.map((s: Skill) => s.category))), [skills]);
  const visibleCategories = activeCategory === 'All' ? categories : categories.filter(c => c === activeCategory);

  return (
    <div className="flex-1 h-full flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-8">Analytics</h1>
        
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
          {visibleCategories.map((cat: any) => {
            const catSkills = skills.filter((s: Skill) => s.category === cat);
            const themeName = categoryColors[cat] || 'cyan';
            const theme = THEMES[themeName] || THEMES['cyan'];
            
            return (
              <div key={cat} className="flex flex-col gap-6">
                <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme.textCategory}`}>{cat}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catSkills.map((skill: Skill, i: number) => {
                    const skillLogs = logs.filter((l: SkillLog) => l.skillId === skill.id && (l.count > 0 || l.checked));
                    const total = skillLogs.reduce((acc: number, l: SkillLog) => acc + (skill.mode === 'counter' ? l.count : 1), 0);
                    
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

                    return (
                      <motion.div 
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.2) }}
                        onClick={() => onSelect(skill)}
                        className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm cursor-pointer hover:bg-zinc-800/80 transition-all active:scale-[0.98] group"
                      >
                        <div className="flex flex-col min-w-0 z-10">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-zinc-200 transition-colors">{skill.name}</h3>
                          <div className="mt-4 flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">total</p>
                            <p className="text-3xl font-black text-white">{total} <span className="text-xs text-zinc-500 font-bold">{skill.mode === 'counter' ? (skill.unit || '') : ''}</span></p>
                          </div>
                          {maxStreak > 0 && (
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
  const [focusedDateStr, setFocusedDateStr] = useState(() => dateToYMD(new Date()));

  const themeName = categoryColors[skill.category] || 'cyan';
  const colorHex = THEME_COLORS[themeName] || THEME_COLORS['cyan'];
  
  const skillLogs = useMemo(() => logs.filter((l: SkillLog) => l.skillId === skill.id), [logs, skill.id]);

  // Calculate 90th percentile for intensity scaling
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
    setFocusedDateStr(dateToYMD(d));
  };

  const { handleTouchStart, handleTouchEnd, handlePointerDown, handlePointerUp } = useSwipeDirection(handleSwipeTime);

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-zinc-950/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="text-white" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-white truncate leading-none">{skill.name}</h2>
            <p className="text-xs font-bold uppercase tracking-widest mt-1 text-zinc-500">{skill.category}</p>
          </div>
        </div>
        <button 
          onClick={() => setFocusedDateStr(dateToYMD(new Date()))}
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5"
        >
          Today
        </button>
      </div>
      
      <div className="flex-1 relative flex overflow-hidden">
        <div 
          className="flex-1 relative overflow-hidden pr-12 sm:pr-16"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <AnimatePresence mode="popLayout">
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
          );
        })}
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ZOOM VIEWS
// Using shared layoutId="day-YYYY-MM-DD" for perfect morphing
// ----------------------------------------------------------------------

function DayZoomView({ focusedDateStr, skill, skillLogs, colorHex, onPrev, onNext }: any) {
  const dObj = new Date(focusedDateStr + 'T12:00:00');
  const dayName = dObj.toLocaleDateString('default', { weekday: 'long' });
  const dateFormatted = dObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const log = skillLogs.find((l: SkillLog) => l.date === focusedDateStr);
  const val = log ? getLogValue(log, skill) : 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-3xl font-black text-white">{dayName}</h2>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{dateFormatted}</p>
      </div>

      <motion.div 
        layoutId={`day-${focusedDateStr}`}
        className="w-full max-w-[240px] sm:max-w-sm aspect-square rounded-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden shrink-0"
        style={{ 
          backgroundColor: val > 0 ? colorHex : '#18181b',
          boxShadow: val > 0 ? `0 20px 50px -10px ${colorHex}40` : 'none'
        }}
      >
        <div className={`text-6xl sm:text-[8rem] leading-none font-black truncate max-w-[90%] ${val > 0 ? 'text-black/80' : 'text-zinc-700'}`}>
          {val}
        </div>
        {skill.mode === 'counter' && (
          <div className={`text-xl font-bold mt-2 ${val > 0 ? 'text-black/60' : 'text-zinc-600'}`}>
            {skill.unit}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function WeekZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const weekDays = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const day = dObj.getDay();
    const diff = dObj.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(dObj.setDate(diff));
    
    const days = [];
    for(let i=0; i<7; i++) {
      const cur = new Date(monday);
      cur.setDate(cur.getDate() + i);
      const curStr = dateToYMD(cur);
      const log = skillLogs.find((l: SkillLog) => l.date === curStr);
      const val = log ? getLogValue(log, skill) : 0;
      days.push({
        dateStr: curStr,
        dayName: cur.toLocaleDateString('default', { weekday: 'short' }),
        val,
        intensity: val / maxBaseline
      });
    }
    return days;
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  const monthLabel = new Date(focusedDateStr + 'T12:00:00').toLocaleDateString('default', { month: 'long', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12"
    >
      <div className="mb-4 sm:mb-8 shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white">Week of</h3>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{monthLabel}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 sm:gap-2 w-full flex-1 min-h-0 pb-16">
        {weekDays.map(d => (
          <div key={d.dateStr} className="flex-1 flex flex-col h-full items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => { setFocusedDateStr(d.dateStr); setZoomLevel(0); }}>
            <span className={`text-xs font-bold ${d.dateStr === focusedDateStr ? 'text-white' : 'text-zinc-600'}`}>
              {d.dayName.charAt(0)}
            </span>
            <motion.div 
              layoutId={`day-${d.dateStr}`}
              className={`w-full h-full rounded-xl sm:rounded-2xl flex flex-col items-center justify-end pb-4 sm:pb-8 ${d.dateStr === focusedDateStr ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 z-10' : ''}`}
              style={{ 
                backgroundColor: d.val > 0 ? colorHex : '#18181b',
                opacity: d.dateStr === focusedDateStr ? 1 : (d.val > 0 ? Math.max(0.4, Math.min(1, d.intensity + 0.2)) : 1)
              }}
            >
              {d.val > 0 && (
                <span className={`text-lg sm:text-2xl font-black ${d.dateStr === focusedDateStr ? 'text-black/80' : 'text-black/60'}`}>
                  {d.val}
                </span>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MonthZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const monthData = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const firstDay = new Date(dObj.getFullYear(), dObj.getMonth(), 1).getDay();
    const daysInMonth = new Date(dObj.getFullYear(), dObj.getMonth() + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-Sun
    
    const days = [];
    // Padding start
    for(let i=0; i<startOffset; i++) days.push(null);
    // Real days
    for(let d=1; d<=daysInMonth; d++) {
      const curStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = skillLogs.find((l: SkillLog) => l.date === curStr);
      const val = log ? getLogValue(log, skill) : 0;
      days.push({
        dateStr: curStr,
        dayNum: d,
        val,
        intensity: val / maxBaseline
      });
    }
    // Padding end to 42
    while(days.length < 42) days.push(null);

    return {
      label: dObj.toLocaleDateString('default', { month: 'long', year: 'numeric' }),
      days
    };
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col px-4 sm:px-8 max-w-4xl mx-auto py-8 sm:py-12"
    >
      <div className="mb-4 sm:mb-8 shrink-0 flex items-center justify-between min-h-[60px]">
        <h3 className="text-2xl sm:text-3xl font-black text-white truncate">{monthData.label}</h3>
        <div className="flex gap-2">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col flex-1 min-h-0 pb-16">
        <div className="grid grid-cols-7 mb-2 shrink-0">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((h, i) => (
            <div key={i} className="text-center text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 min-h-0 auto-rows-fr bg-zinc-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          {monthData.days.map((d: any, i: number) => {
            if (!d) return <div key={i} className="h-full w-full border border-white/5 bg-zinc-950/50" />;
            return (
              <div key={d.dateStr} className="h-full w-full relative cursor-pointer border border-white/5 hover:bg-white/5 transition-colors group" onClick={() => { setFocusedDateStr(d.dateStr); setZoomLevel(1); }}>
                <motion.div 
                  layoutId={`day-${d.dateStr}`}
                  className={`absolute inset-0 z-0 ${d.dateStr === focusedDateStr ? 'ring-2 ring-white ring-inset' : ''}`}
                  style={{ 
                    backgroundColor: d.val > 0 ? colorHex : 'transparent',
                    opacity: d.dateStr === focusedDateStr ? 1 : (d.val > 0 ? Math.max(0.15, Math.min(1, d.intensity + 0.1)) : 1)
                  }}
                />
                <div className="absolute top-1 right-2 z-10 text-[10px] sm:text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {d.dayNum}
                </div>
                {d.val > 0 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <span className="text-sm sm:text-lg font-black text-white mix-blend-overlay">
                      {d.val}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
}

function YearZoomView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skill, skillLogs, colorHex, maxBaseline, onPrev, onNext }: any) {
  const { year, months } = useMemo(() => {
    const dObj = new Date(focusedDateStr + 'T12:00:00');
    const y = dObj.getFullYear();
    const res = [];
    
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
    return { year: y, months: res };
  }, [focusedDateStr, skillLogs, skill, maxBaseline]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col pt-4 sm:pt-8 pb-16 px-4 sm:px-8 max-w-4xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-8 shrink-0">
        <h3 className="text-3xl sm:text-4xl font-black text-white">{year}</h3>
        <div className="flex gap-2">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-8 lg:gap-12 min-h-0 flex-1 w-full pb-4 sm:pb-8">
        <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 min-h-0 auto-rows-fr">
          {months.map(m => (
            <div key={m.name} className="flex flex-col gap-1 sm:gap-2 cursor-pointer group" onClick={() => { setFocusedDateStr(`${year}-${m.monthStr}-01`); setZoomLevel(2); }}>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">{m.name}</span>
              <div className="grid grid-cols-7 gap-px flex-1 min-h-0 auto-rows-fr bg-zinc-800/50 rounded overflow-hidden">
                {m.days.map((d: any, i: number) => {
                  if (d === null && i < 28) return <div key={i} className="h-full w-full bg-zinc-950" />;
                  if (d === null) return null; // Drop extra tail padding
                  return (
                    <div key={d.dateStr} className="h-full w-full relative flex items-center justify-center bg-zinc-950">
                      <motion.div
                        layoutId={`day-${d.dateStr}`}
                        className={`absolute inset-0 ${d.dateStr === focusedDateStr ? 'ring-[1px] ring-white ring-inset z-10' : ''}`}
                        style={{ 
                          backgroundColor: d.val > 0 ? colorHex : 'transparent',
                          opacity: d.dateStr === focusedDateStr ? 1 : (d.val > 0 ? Math.max(0.2, Math.min(1, d.intensity + 0.1)) : 1)
                        }}
                      />
                      <span className={`relative z-10 text-[6px] sm:text-[8px] font-bold ${d.val > 0 ? 'text-black/80 mix-blend-overlay' : 'text-zinc-600'}`}>{d.dayNum}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Monthly Breakdown List (Hidden on mobile if needed, but we can make it scroll if it doesn't fit, or use flex-shrink) */}
        <div className="hidden md:flex w-full xl:w-48 shrink-0 flex-col gap-2 pb-12 xl:pb-0 min-h-0 overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2 shrink-0">Monthly Total</h4>
          {months.map(m => (
            <div key={m.name} className="flex justify-between items-end border-b border-white/5 pb-1">
              <span className="text-sm font-bold text-zinc-400">{m.name}</span>
              <span className="text-base font-black text-white" style={{ color: m.total > 0 ? colorHex : '#52525b' }}>{m.total}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
