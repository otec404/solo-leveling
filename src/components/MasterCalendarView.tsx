import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home, CalendarDays, ArrowLeft, Check, Award, FastForward } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { THEME_COLORS } from './StatsView';
import { getSkillIcon } from './icons';
import { useRef } from 'react';
import TimelapsePlayerModal from './TimelapsePlayerModal';

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
    
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 2) {
      if (dx > 0) onSwipe('next');
      else onSwipe('prev');
    }
    startRef.current = null;
  };

  return {
    onTouchStart: (e: React.TouchEvent) => {
      startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!startRef.current) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = startRef.current.x - endX;
      const dy = startRef.current.y - endY;
      
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx > 0) onSwipe('next');
        else onSwipe('prev');
      }
      startRef.current = null;
    },
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp
  };
}



interface MasterCalendarProps {
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  onBack: () => void;
  onJumpToSkill: (skill: Skill) => void;
}

export default function MasterCalendarView({ skills, logs, categoryColors, onBack, onJumpToSkill }: MasterCalendarProps) {
  // zoomLevel: 3 = Year, 2 = Month, 0 = Day
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [showTimelapse, setShowTimelapse] = useState<boolean>(false);
  const [focusedDateStr, setFocusedDateStr] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });

  const jumpToToday = () => {
    const d = new Date();
    setFocusedDateStr(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
    setZoomLevel(3);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]);
  };

  const jumpToZoom = (level: number) => {
    setZoomLevel(level);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]);
  };

  const handleSwipeTime = (direction: 'next' | 'prev') => {
    const d = new Date(focusedDateStr + 'T12:00:00');
    const sign = direction === 'next' ? 1 : -1;
    if (zoomLevel === 0) d.setDate(d.getDate() + sign * 1);
    else if (zoomLevel === 2) d.setMonth(d.getMonth() + sign * 1);
    else if (zoomLevel === 3) d.setFullYear(d.getFullYear() + sign * 1);
    
    setFocusedDateStr(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  };

  const yearNum = focusedDateStr.substring(0,4);
  const monthNum = focusedDateStr.substring(5,7);
  const dayNum = focusedDateStr.substring(8,10);
  
  const dObj = new Date(focusedDateStr + 'T12:00:00');
  const monthName = dObj.toLocaleDateString('default', { month: 'short' });
  const dayNameShort = dObj.toLocaleDateString('default', { weekday: 'short' });

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden font-sans">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col pt-safe-top bg-zinc-950/80 backdrop-blur-2xl z-20 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <button onClick={onBack} className="p-2 -ml-2 bg-transparent hover:bg-white/10 rounded-full transition-colors flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-1 flex flex-row items-center justify-center gap-1.5 px-4 font-bold tracking-tight text-white/80 uppercase text-xs sm:text-sm">
            <button onClick={() => jumpToZoom(3)} className={`hover:text-white transition-colors ${zoomLevel === 3 ? 'text-white underline decoration-2 underline-offset-4 decoration-purple-500' : ''}`}>
              {yearNum}
            </button>
            {(zoomLevel <= 2) && (
              <>
                <span className="text-zinc-600">/</span>
                <button onClick={() => jumpToZoom(2)} className={`hover:text-white transition-colors ${zoomLevel === 2 ? 'text-white underline decoration-2 underline-offset-4 decoration-purple-500' : ''}`}>
                  {monthName}
                </button>
              </>
            )}
            {zoomLevel === 0 && (
              <>
                <span className="text-zinc-600">/</span>
                <button onClick={() => jumpToZoom(0)} className="text-white underline decoration-2 underline-offset-4 decoration-purple-500">
                  {dayNum} {dayNameShort}
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTimelapse(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 hover:border-purple-400/60 rounded-full text-purple-300 hover:text-white text-xs font-mono font-bold transition-all shadow-sm"
              title="Time-Lapse Replay"
            >
              <FastForward size={14} className="text-purple-400" />
              <span className="hidden sm:inline">Time-Lapse</span>
            </button>
            
            <button 
              onClick={jumpToToday}
              className="p-2 -mr-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              title="Jump to Today"
            >
              <Home size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Views Container */}
      <div 
        className="flex-1 relative overflow-hidden bg-zinc-950 pb-20 md:pb-0"
        {...useSwipeDirection(handleSwipeTime)}
      >
        <AnimatePresence mode="wait">
          {zoomLevel === 3 && <MasterYearView key={`year-${yearNum}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} setZoomLevel={setZoomLevel} skills={skills} logs={logs} categoryColors={categoryColors} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
          {zoomLevel === 2 && <MasterMonthView key={`month-${yearNum}-${monthNum}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} setZoomLevel={setZoomLevel} skills={skills} logs={logs} categoryColors={categoryColors} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
          {zoomLevel === 0 && <MasterDayView key={`day-${focusedDateStr}`} focusedDateStr={focusedDateStr} setFocusedDateStr={setFocusedDateStr} skills={skills} logs={logs} categoryColors={categoryColors} onJumpToSkill={onJumpToSkill} onPrev={() => handleSwipeTime('prev')} onNext={() => handleSwipeTime('next')} />}
        </AnimatePresence>
      </div>

      {showTimelapse && (
        <TimelapsePlayerModal
          isOpen={showTimelapse}
          onClose={() => setShowTimelapse(false)}
          skills={skills}
          logs={logs}
          categoryColors={categoryColors}
          initialDate={focusedDateStr}
        />
      )}
    </div>
  );
}

// Master Year View
function MasterYearView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skills, logs, categoryColors, onPrev, onNext }: any) {
  const year = parseInt(focusedDateStr.substring(0, 4));
  const [inspectedDate, setInspectedDate] = useState<string | null>(null);
  
  // Aggregate data across all skills for the year
  const yearData = useMemo(() => {
    const data: Record<string, { total: number, cats: Set<string> }> = {};
    let globalMax = 0;
    let totalYearCount = 0;
    let activeDaysCount = 0;
    
    logs.forEach(l => {
      if (!l.date.startsWith(year.toString())) return;
      const skill = skills.find((s: Skill) => s.id === l.skillId);
      if (!skill) return;
      if (l.count === 0 && !l.checked) return;
      
      if (!data[l.date]) {
        data[l.date] = { total: 0, cats: new Set<string>() };
        activeDaysCount++;
      }
      
      // Normalize counts
      const val = skill.mode === 'counter' ? l.count : 1;
      data[l.date].total += val;
      totalYearCount += val;
      data[l.date].cats.add(skill.category);
      
      if (data[l.date].total > globalMax) globalMax = data[l.date].total;
    });
    
    // Find best day
    let bestDay = null;
    let maxVal = 0;
    for (const [date, info] of Object.entries(data)) {
      if (info.total > maxVal) {
        maxVal = info.total;
        bestDay = date;
      }
    }
    
    return { data, globalMax: Math.max(globalMax, 1), bestDay, totalYearCount, activeDaysCount };
  }, [logs, skills, year]);
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(year, i, 1);
    const mStr = String(i + 1).padStart(2, '0');
    let monthTotal = 0;
    Object.entries(yearData.data).forEach(([date, info]: [string, any]) => {
      if (date.startsWith(`${year}-${mStr}`)) {
        monthTotal += info.total;
      }
    });

    return {
      monthIdx: i,
      monthStr: mStr,
      name: d.toLocaleDateString('default', { month: 'short' }),
      dateStr: `${year}-${mStr}-01`,
      total: monthTotal
    };
  });

  const inspectedInfo = inspectedDate && yearData.data[inspectedDate] ? {
    date: inspectedDate,
    total: yearData.data[inspectedDate].total,
    cats: Array.from(yearData.data[inspectedDate].cats)
  } : null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-4 sm:p-8 w-full max-w-4xl mx-auto overflow-y-auto custom-scrollbar"
    >
      {/* Year View Header with Overall Year Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onPrev} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">{year}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                {yearData.totalYearCount} Overall Logs
              </span>
              <span className="text-xs font-semibold text-zinc-500">•</span>
              <span className="text-xs font-semibold text-zinc-400">
                {yearData.activeDaysCount} Active Days
              </span>
            </div>
          </div>
        </div>
        <button onClick={onNext} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors self-start sm:self-center"><ChevronRight size={24} /></button>
      </div>

      {/* Daily Count Interactive Inspector Bar */}
      {inspectedInfo && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-zinc-900/90 border border-white/15 flex items-center justify-between text-xs backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase">{new Date(inspectedInfo.date + 'T12:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-zinc-600">|</span>
            <span className="font-black text-purple-300">Daily Count: {inspectedInfo.total} logs</span>
          </div>
          <button 
            onClick={() => {
              setFocusedDateStr(inspectedInfo.date);
              setZoomLevel(0);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors"
          >
            View Day →
          </button>
        </motion.div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-24">
        {months.map(m => (
          <div 
            key={m.monthIdx} 
            className="flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 cursor-pointer hover:bg-zinc-800/60 transition-colors group relative overflow-hidden"
            onClick={() => {
              setFocusedDateStr(m.dateStr);
              setZoomLevel(2);
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{m.name}</h3>
              {m.total > 0 && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                  {m.total}
                </span>
              )}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1 relative z-10">
              {(() => {
                const firstDay = new Date(year, m.monthIdx, 1).getDay();
                const daysInMonth = new Date(year, m.monthIdx + 1, 0).getDate();
                const blanks = Array(firstDay).fill(null);
                const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                
                return [...blanks, ...days].map((day, idx) => {
                  if (!day) return <div key={`blank-${idx}`} className="aspect-square rounded-sm" />;
                  
                  const dStr = `${year}-${String(m.monthIdx+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const dayData = yearData.data[dStr];
                  const isBest = yearData.bestDay === dStr;
                  const isSelected = inspectedDate === dStr;
                  
                  if (!dayData) {
                    return (
                      <div 
                        key={day} 
                        className="aspect-square bg-zinc-800/30 rounded-sm hover:bg-zinc-800 transition-colors" 
                        onMouseEnter={() => setInspectedDate(dStr)}
                        onClick={(e) => { e.stopPropagation(); setInspectedDate(dStr); }}
                      />
                    );
                  }
                  
                  const intensity = Math.min(dayData.total / yearData.globalMax, 1);
                  const catsArray = Array.from(dayData.cats) as string[];
                  const firstCat = catsArray[0] as string;
                  const colorHex = catsArray.length > 1 ? '#818cf8' : THEME_COLORS[categoryColors[firstCat] || 'cyan'];
                  
                  return (
                    <div 
                      key={day} 
                      onMouseEnter={() => setInspectedDate(dStr)}
                      onClick={(e) => { e.stopPropagation(); setInspectedDate(dStr); }}
                      title={`${dStr}: ${dayData.total} logs`}
                      className={`aspect-square rounded-[3px] sm:rounded-sm relative cursor-pointer ${isBest ? 'ring-1 ring-white z-10 scale-125' : ''} ${isSelected ? 'ring-2 ring-purple-400 z-20 scale-125' : ''}`}
                      style={{ 
                        backgroundColor: colorHex, 
                        opacity: 0.35 + (intensity * 0.65) 
                      }}
                    />
                  );
                });
              })()}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Master Month View
function MasterMonthView({ focusedDateStr, setFocusedDateStr, setZoomLevel, skills, logs, categoryColors, onPrev, onNext }: any) {
  const dObj = new Date(focusedDateStr + 'T12:00:00');
  const year = dObj.getFullYear();
  const month = dObj.getMonth();
  
  const monthLabel = dObj.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  
  const monthData = useMemo(() => {
    const data: Record<string, { total: number, cats: Set<string> }> = {};
    let globalMax = 0;
    let totalMonthLogs = 0;
    let activeDaysCount = 0;
    
    logs.forEach(l => {
      if (!l.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)) return;
      const skill = skills.find((s: Skill) => s.id === l.skillId);
      if (!skill) return;
      if (l.count === 0 && !l.checked) return;
      
      if (!data[l.date]) {
        data[l.date] = { total: 0, cats: new Set<string>() };
        activeDaysCount++;
      }
      
      const val = skill.mode === 'counter' ? l.count : 1;
      data[l.date].total += val;
      totalMonthLogs += val;
      data[l.date].cats.add(skill.category);
      
      if (data[l.date].total > globalMax) globalMax = data[l.date].total;
    });
    
    let bestDay = null;
    let maxVal = 0;
    for (const [date, info] of Object.entries(data)) {
      if (info.total > maxVal) {
        maxVal = info.total;
        bestDay = date;
      }
    }
    
    return { data, globalMax: Math.max(globalMax, 1), bestDay, totalMonthLogs, activeDaysCount };
  }, [logs, skills, year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-4 sm:p-8 w-full max-w-3xl mx-auto overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrev} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-white uppercase">{monthLabel}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-xs">
              {monthData.totalMonthLogs} Total Logs
            </span>
            <span className="text-xs text-zinc-500 font-semibold">•</span>
            <span className="text-xs text-zinc-400 font-semibold">
              {monthData.activeDaysCount} Active Days
            </span>
          </div>
        </div>
        <button onClick={onNext} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronRight size={24} /></button>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 flex-1 pb-24">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`h-${i}`} className="text-center text-xs font-bold text-zinc-500 uppercase">{d}</div>
        ))}
        
        {blanks.map((_, i) => <div key={`b-${i}`} className="aspect-square" />)}
        
        {days.map(day => {
          const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const dayData = monthData.data[dStr];
          const isBest = monthData.bestDay === dStr;
          
          return (
            <div 
              key={day}
              onClick={() => {
                setFocusedDateStr(dStr);
                setZoomLevel(0);
              }}
              className={`relative flex flex-col items-center justify-between p-1.5 sm:p-2.5 bg-zinc-900/40 hover:bg-zinc-800/80 border ${dayData ? 'border-white/15' : 'border-zinc-800/40'} rounded-xl sm:rounded-2xl cursor-pointer transition-all aspect-square overflow-hidden group ${isBest ? 'ring-2 ring-purple-400/80 bg-zinc-800/70 shadow-[0_0_15px_rgba(168,85,247,0.25)]' : ''}`}
            >
              <div className="w-full flex items-center justify-between z-10">
                <span className={`text-xs sm:text-sm font-bold ${dayData ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {day}
                </span>
                {dayData && (
                  <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded-md bg-white/15 text-white shadow-sm">
                    {dayData.total}
                  </span>
                )}
              </div>
              
              {dayData ? (
                <div className="flex flex-wrap justify-center gap-1 mt-auto z-10 pb-0.5">
                  {Array.from(dayData.cats).slice(0, 3).map((cat: any, idx: number) => {
                    const cHex = THEME_COLORS[categoryColors[cat] || 'cyan'];
                    return (
                      <div key={idx} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: cHex, boxShadow: `0 0 4px ${cHex}40` }} />
                    );
                  })}
                  {dayData.cats.size > 3 && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-400" />}
                </div>
              ) : (
                <div className="h-2" />
              )}
              
              {isBest && (
                <div className="absolute inset-0 bg-purple-500/10 blur-md pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Master Day View
function MasterDayView({ focusedDateStr, skills, logs, categoryColors, onJumpToSkill, onPrev, onNext }: any) {
  const dObj = new Date(focusedDateStr + 'T12:00:00');
  const dayName = dObj.toLocaleDateString('default', { weekday: 'long' });
  const dateFormatted = dObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });

  const dayLogs = useMemo(() => {
    return logs.filter((l: SkillLog) => l.date === focusedDateStr && (l.count > 0 || l.checked));
  }, [logs, focusedDateStr]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, { skill: Skill, log: SkillLog }[]> = {};
    dayLogs.forEach((l: SkillLog) => {
      const skill = skills.find((s: Skill) => s.id === l.skillId);
      if (!skill) return;
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push({ skill, log: l });
    });
    return groups;
  }, [dayLogs, skills]);

  const catCount = Object.keys(grouped).length;
  const totalItems = dayLogs.length;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-4 sm:p-8 w-full max-w-2xl mx-auto overflow-y-auto custom-scrollbar"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrev} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1 uppercase">{dayName}</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{dateFormatted}</p>
        </div>
        <button onClick={onNext} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><ChevronRight size={24} /></button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 sm:p-6 mb-8 flex items-center justify-around">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-white">{totalItems}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logs</span>
        </div>
        <div className="w-px h-10 bg-zinc-800" />
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-white">{catCount}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categories</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-24">
        {totalItems === 0 && (
          <div className="text-center text-zinc-600 font-medium py-12">
            No activity logged on this date.
          </div>
        )}
        
        {Object.entries(grouped).map(([cat, items]: [string, any]) => {
          const cHex = THEME_COLORS[categoryColors[cat] || 'cyan'];
          return (
            <div key={cat} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cHex }} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{cat}</h3>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                {items.map(({ skill, log }: any, idx: number) => {
                  const Icon = getSkillIcon(skill);
                  return (
                  <div 
                    key={skill.id} 
                    className={`flex items-center justify-between p-4 ${idx !== items.length - 1 ? 'border-b border-zinc-800/50' : ''} hover:bg-zinc-800/40 transition-colors cursor-pointer`}
                    onClick={() => onJumpToSkill(skill)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-zinc-300" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-semibold text-white truncate">{skill.name}</span>
                        {log.notes && <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{log.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {skill.mode === 'counter' ? (
                        <span className="text-xl font-black text-white">{log.count} <span className="text-xs text-zinc-500 ml-1">{skill.unit}</span></span>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: cHex }}>
                           <Check size={14} className="text-zinc-950" strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
