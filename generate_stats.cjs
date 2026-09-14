const fs = require('fs');

const content = `import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, ChevronLeft } from 'lucide-react';
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

function useSwipe(offset: number, setOffset: (v: number) => void) {
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => { 
    e.stopPropagation();
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }; 
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchStartRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const distanceX = touchStartRef.current.x - endX;
    const distanceY = touchStartRef.current.y - endY;
    
    if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      if (distanceX > 50) setOffset(offset + 1);
      else setOffset(offset - 1);
    }
    touchStartRef.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}

export default function StatsView({ skills, logs, categoryColors }: StatsViewProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  if (selectedSkill) {
    return (
      <SkillAnalytics 
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
  const categories = useMemo(() => Array.from(new Set(skills.map((s: Skill) => s.category))), [skills]);

  return (
    <div className="flex-1 h-full flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-12">Analytics</h1>
        
        <div className="flex flex-col gap-16">
          {categories.map((cat: any) => {
            const catSkills = skills.filter((s: Skill) => s.category === cat);
            const themeName = categoryColors[cat] || 'cyan';
            const theme = THEMES[themeName] || THEMES['cyan'];
            
            return (
              <div key={cat} className="flex flex-col gap-6">
                <h2 className={\`text-2xl font-black uppercase tracking-tighter \${theme.textCategory}\`}>{cat}</h2>
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

function SkillAnalytics({ skill, logs, categoryColors, onBack }: any) {
  const [zoomLevel, setZoomLevel] = useState(0); // 0=Day, 1=Week, 2=Month, 3=Year
  const [offset, setOffset] = useState(0);

  // Reset offset when zooming
  useEffect(() => { setOffset(0); }, [zoomLevel]);

  const themeName = categoryColors[skill.category] || 'cyan';
  const theme = THEMES[themeName] || THEMES['cyan'];
  const colorHex = THEME_COLORS[themeName] || THEME_COLORS['cyan'];
  const skillLogs = logs.filter((l: SkillLog) => l.skillId === skill.id);

  return (
    <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-white/5 shrink-0 bg-zinc-950/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white truncate leading-none">{skill.name}</h2>
          <p className={\`text-xs font-bold uppercase tracking-widest mt-1 \${theme.textCategory}\`}>{skill.category}</p>
        </div>
      </div>
      
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 overflow-hidden relative pr-14 sm:pr-16">
          <AnimatePresence mode="wait">
            {zoomLevel === 0 && <DayZoomView key="day" skill={skill} logs={skillLogs} colorHex={colorHex} theme={theme} />}
            {zoomLevel === 1 && <WeekZoomView key="week" skill={skill} logs={skillLogs} offset={offset} setOffset={setOffset} colorHex={colorHex} theme={theme} />}
            {zoomLevel === 2 && <MonthZoomView key="month" skill={skill} logs={skillLogs} offset={offset} setOffset={setOffset} colorHex={colorHex} theme={theme} />}
            {zoomLevel === 3 && <YearZoomView key="year" skill={skill} logs={skillLogs} offset={offset} setOffset={setOffset} colorHex={colorHex} theme={theme} />}
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
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const thumbTop = zoomLevel === 3 ? '12.5%' : zoomLevel === 2 ? '37.5%' : zoomLevel === 1 ? '62.5%' : '87.5%';

  return (
    <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20">
      <div 
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-10 sm:w-12 h-[280px] sm:h-[320px] bg-zinc-900/80 rounded-full flex flex-col items-center justify-between py-6 relative cursor-ns-resize select-none touch-none border border-white/10 backdrop-blur-md shadow-2xl"
      >
        <motion.div 
          className="absolute w-8 sm:w-10 h-16 bg-white/10 rounded-full left-1 -translate-y-1/2 pointer-events-none border border-white/20 shadow-sm"
          animate={{ top: thumbTop }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
        {['Y', 'M', 'W', 'D'].map((lbl) => (
          <div key={lbl} className="flex-1 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-[10px] sm:text-xs font-black text-zinc-400">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayZoomView({ skill, logs, colorHex }: any) {
  const todayStr = useMemo(() => { const t = new Date(); return \`\${t.getFullYear()}-\${String(t.getMonth() + 1).padStart(2, '0')}-\${String(t.getDate()).padStart(2, '0')}\`; }, []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const months = useMemo(() => {
    const res = [];
    const today = new Date();
    const maxBArr: number[] = [];
    
    // Find max baseline for intensity
    logs.forEach((l: SkillLog) => {
      if (l.count > 0 || l.checked) {
        maxBArr.push(getLogValue(l, skill));
      }
    });
    maxBArr.sort((a,b)=>a-b);
    let maxB = 1;
    if (maxBArr.length > 0) {
      maxB = maxBArr[Math.floor(maxBArr.length * 0.9)] || maxBArr[maxBArr.length - 1];
    }
    maxB = Math.max(maxB, 1);

    for(let i=0; i<12; i++) {
      const mDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const daysInMonth = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0).getDate();
      const firstDay = mDate.getDay();
      const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-Sun
      
      const days = Array(42).fill(null);
      for(let d=0; d<daysInMonth; d++) {
        const dStr = \`\${mDate.getFullYear()}-\${String(mDate.getMonth() + 1).padStart(2, '0')}-\${String(d+1).padStart(2, '0')}\`;
        const log = logs.find((l: SkillLog) => l.date === dStr);
        const val = log ? getLogValue(log, skill) : 0;
        
        days[startOffset + d] = { 
          date: dStr, 
          day: d + 1, 
          value: val,
          intensity: val / maxB,
          isFuture: new Date(dStr + 'T12:00:00') > today
        };
      }
      
      res.push({
        name: mDate.toLocaleString('default', { month: 'long' }),
        year: mDate.getFullYear(),
        days
      });
    }
    return res;
  }, [logs, skill]);

  const selectedLog = logs.find((l: SkillLog) => l.date === selectedDate);
  const selectedValue = selectedLog ? getLogValue(selectedLog, skill) : 0;

  const dateObj = new Date(selectedDate + 'T12:00:00');
  const dateLabel = dateObj.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full p-4 sm:p-6"
    >
      <div className="shrink-0 mb-6">
         <p className="text-sm font-bold text-zinc-500 mb-1 lowercase">{dateLabel}</p>
         <div className="text-[4rem] sm:text-[5rem] leading-none font-black text-white tracking-tighter -ml-1">
           {selectedValue} <span className="text-2xl text-zinc-500 font-bold">{skill.mode === 'counter' ? (skill.unit || '') : ''}</span>
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-24">
        {months.map((m, mIdx) => (
          <div key={mIdx} className="mb-8">
            <h3 className="text-sm font-bold text-white mb-4 lowercase">{m.name} {m.year}</h3>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['m','t','w','t','f','s','s'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-zinc-600">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {m.days.map((d: any, i: number) => {
                if (!d) return <div key={i} className="aspect-square" />;
                const isSelected = selectedDate === d.date;
                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedDate(d.date)}
                    className={\`aspect-square rounded-md sm:rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 \${d.isFuture ? 'opacity-20 pointer-events-none' : ''} \${isSelected ? 'border-2 border-white scale-110 shadow-lg z-10' : 'border border-transparent'}\`}
                    style={{
                      backgroundColor: d.value > 0 ? colorHex : 'rgba(255,255,255,0.03)',
                      opacity: isSelected ? 1 : (d.value > 0 ? Math.max(0.3, Math.min(1, d.intensity)) : 1),
                      boxShadow: d.value > 0 && !isSelected ? \`0 0 \${Math.min(d.intensity, 1) * 10}px \${colorHex}\` : 'none'
                    }}
                  >
                    <span className={\`text-xs font-bold \${d.value > 0 ? 'text-black/80' : 'text-zinc-500'}\`}>{d.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WeekView({ skill, logs, offset, setOffset, theme, colorHex }: any) {
  const { thisWeekTotal, lastWeekTotal, thisWeekDays } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); 
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
    
    const startOfTargetWeek = new Date(today);
    startOfTargetWeek.setDate(diff + offset * 7);
    
    const startOfPrevWeek = new Date(startOfTargetWeek);
    startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);

    const calcTotal = (startDate: Date) => {
      let total = 0;
      const days = [];
      const todayStr = (() => { const t = new Date(); return \`\${t.getFullYear()}-\${String(t.getMonth() + 1).padStart(2, '0')}-\${String(t.getDate()).padStart(2, '0')}\`; })();

      for (let i=0; i<7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dStr = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
        
        const log = logs.find((l: SkillLog) => l.date === dStr);
        const dayTotal = getLogValue(log, skill);
        
        days.push({ date: dStr, value: dayTotal, isToday: dStr === todayStr, isFuture: d > today });
        total += dayTotal;
      }
      return { total, days };
    };

    const target = calcTotal(startOfTargetWeek);
    const prev = calcTotal(startOfPrevWeek);
    return { thisWeekTotal: target.total, lastWeekTotal: prev.total, thisWeekDays: target.days };
  }, [skill, logs, offset]);

  const delta = thisWeekTotal - lastWeekTotal;
  const deltaPct = lastWeekTotal ? Math.round((Math.abs(delta) / lastWeekTotal) * 100) : (thisWeekTotal > 0 ? 100 : 0);
  let deltaText = '';
  if (delta > 0) deltaText = \`up \${deltaPct}% from last week\`;
  else if (delta < 0) deltaText = \`down \${deltaPct}% from last week\`;
  else deltaText = 'flat from last week';

  const { handleTouchStart, handleTouchEnd } = useSwipe(offset, setOffset);
  const maxVal = Math.max(...thisWeekDays.map((d: any) => d.value), 1);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full gap-8 p-4 sm:p-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={offset}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
           <p className="text-sm font-bold text-zinc-500 mb-1 lowercase">
             {offset === 0 ? 'this week' : offset === -1 ? 'last week' : 'selected week'}
           </p>
           <div className="text-[5rem] sm:text-[6rem] leading-none font-black text-white tracking-tighter -ml-1">
             {thisWeekTotal} <span className="text-3xl text-zinc-500 font-bold">{skill.mode === 'counter' ? (skill.unit || '') : ''}</span>
           </div>
           <p className={\`text-base font-bold mt-2 lowercase \${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-zinc-500'}\`}>
             {deltaText}
           </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-end justify-between gap-3 flex-1 min-h-[200px] mb-8">
        {thisWeekDays.map((day: any, i: number) => {
           const height = Math.max((day.value / maxVal) * 100, 2); 
           const isComplete = day.value > 0;
           return (
             <div key={i} className="flex-1 flex flex-col justify-end items-center h-full gap-3 relative group">
               <motion.div 
                 initial={false}
                 animate={{ 
                   height: \`\${height}%\`,
                   backgroundColor: isComplete ? colorHex : 'rgba(255,255,255,0.02)',
                   opacity: day.isFuture ? 0 : 1
                 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
                 className={\`w-full rounded-sm \${day.isToday && !isComplete ? 'border-2 border-dashed ' + theme.cardBorder : ''}\`}
               />
               <span className="text-xs font-bold text-zinc-600">
                 {['M','T','W','T','F','S','S'][i]}
               </span>
             </div>
           )
        })}
      </div>
    </motion.div>
  );
}

function MonthView({ skill, logs, offset, setOffset, theme, colorHex }: any) {
  const { thisMonthTotal, lastMonthTotal, chartData, calendarData, maxBaseline } = useMemo(() => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const prevMonth = new Date(today.getFullYear(), today.getMonth() + offset - 1, 1);

    const getMonthData = (mDate: Date) => {
      let total = 0;
      const daysInMonth = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0).getDate();
      const chart = [];

      for(let i=1; i<=daysInMonth; i++) {
        const dStr = \`\${mDate.getFullYear()}-\${String(mDate.getMonth() + 1).padStart(2, '0')}-\${String(i).padStart(2, '0')}\`;
        const log = logs.find((l: SkillLog) => l.date === dStr);
        const dayTotal = getLogValue(log, skill);
        
        chart.push({ date: String(i).padStart(2, '0'), count: dayTotal });
        total += dayTotal;
      }
      return { total, chart };
    };

    const target = getMonthData(targetMonth);
    const prev = getMonthData(prevMonth);

    // Heatmap (5 weeks)
    let firstDayOfWeek = targetMonth.getDay();
    let diff = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const startOfHeatmap = new Date(targetMonth);
    startOfHeatmap.setDate(startOfHeatmap.getDate() - diff);

    const calendar = [];
    const valuesForBaseline: number[] = [];
    for(let i=0; i<35; i++) {
      const d = new Date(startOfHeatmap);
      d.setDate(d.getDate() + i);
      const dStr = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
      const log = logs.find((l: SkillLog) => l.date === dStr);
      const dayTotal = getLogValue(log, skill);
      
      calendar.push({
        dateStr: dStr,
        dayOfMonth: d.getDate(),
        value: dayTotal,
        isFuture: d > today
      });
      if (dayTotal > 0) valuesForBaseline.push(dayTotal);
    }
    
    valuesForBaseline.sort((a,b) => a-b);
    let maxB = 1;
    if (valuesForBaseline.length > 0) {
       maxB = valuesForBaseline[Math.floor(valuesForBaseline.length * 0.9)] || valuesForBaseline[valuesForBaseline.length - 1];
    }
    maxB = Math.max(maxB, 1);

    return { thisMonthTotal: target.total, lastMonthTotal: prev.total, chartData: target.chart, calendarData: calendar, maxBaseline: maxB };
  }, [skill, logs, offset]);

  const delta = thisMonthTotal - lastMonthTotal;
  const deltaPct = lastMonthTotal ? Math.round((Math.abs(delta) / lastMonthTotal) * 100) : (thisMonthTotal > 0 ? 100 : 0);
  let deltaText = '';
  if (delta > 0) deltaText = \`up \${deltaPct}% from last month\`;
  else if (delta < 0) deltaText = \`down \${deltaPct}% from last month\`;
  else deltaText = 'flat from last month';

  const { handleTouchStart, handleTouchEnd } = useSwipe(offset, setOffset);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full gap-8 select-none p-4 sm:p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={offset}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
           <p className="text-sm font-bold text-zinc-500 mb-1 lowercase">
             {offset === 0 ? 'this month' : offset === -1 ? 'last month' : 'selected month'}
           </p>
           <div className="text-[5rem] sm:text-[6rem] leading-none font-black text-white tracking-tighter -ml-1">
             {thisMonthTotal} <span className="text-3xl text-zinc-500 font-bold">{skill.mode === 'counter' ? (skill.unit || '') : ''}</span>
           </div>
           <p className={\`text-base font-bold mt-2 lowercase \${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-zinc-500'}\`}>
             {deltaText}
           </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          key={offset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-1"
        >
          <div className="h-[120px] w-full mt-4 -ml-2 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: 'none', borderRadius: '0.5rem', fontWeight: '900', fontSize: '1.25rem', color: '#fff', padding: '0.5rem 1rem' }}
                  itemStyle={{ color: colorHex, padding: 0 }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value) => [value, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={colorHex} 
                  strokeWidth={4}
                  dot={false}
                  activeDot={{ r: 6, fill: colorHex, stroke: '#09090b', strokeWidth: 4 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3 mt-auto items-end pb-8">
            <div className="flex flex-col gap-2 justify-between h-full pb-1">
               {['m','t','w','t','f','s','s'].map((day, i) => (
                 <div key={i} className="text-xs font-bold text-zinc-600 h-[10%] flex items-center justify-end pr-2">{day}</div>
               ))}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-2">
            {calendarData.map((d: any, i: number) => {
              const intensity = d.value / maxBaseline;
              return (
                <motion.div 
                  key={i}
                  initial={false}
                  animate={{
                    backgroundColor: d.value > 0 ? colorHex : 'rgba(255,255,255,0.03)',
                    opacity: d.value > 0 ? Math.max(0.2, Math.min(1, intensity)) : (d.isFuture ? 0 : 1)
                  }}
                  transition={{ duration: 0.3 }}
                  className={\`aspect-square rounded-sm flex items-center justify-center\`}
                />
              )
            })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function YearView({ skill, logs, offset, setOffset, theme, colorHex }: any) {
  const { thisYearTotal, lastYearTotal, monthTiles, bestMonthStr, bestMonthTotal } = useMemo(() => {
    const today = new Date();
    const targetYear = today.getFullYear() + offset;
    const prevYear = targetYear - 1;

    let targetTotal = 0;
    let prevTotal = 0;

    const tiles = [];
    const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    
    let bestMonthT = 0;
    let bestMonth = '';

    // Calculate max baseline across the year for intensity
    const maxBArr: number[] = [];
    logs.forEach((l: SkillLog) => {
      if (l.date.startsWith(\`\${targetYear}-\`)) {
        if (l.count > 0 || l.checked) {
          maxBArr.push(getLogValue(l, skill));
        }
      }
    });
    maxBArr.sort((a,b)=>a-b);
    let maxB = 1;
    if (maxBArr.length > 0) {
      maxB = maxBArr[Math.floor(maxBArr.length * 0.9)] || maxBArr[maxBArr.length - 1];
    }
    maxB = Math.max(maxB, 1);

    for(let m=0; m<12; m++) {
      let mTotal = 0;
      let pTotal = 0;
      
      const mStr = \`\${targetYear}-\${String(m + 1).padStart(2, '0')}\`;
      const pStr = \`\${prevYear}-\${String(m + 1).padStart(2, '0')}\`;
      
      const daysInMonth = new Date(targetYear, m + 1, 0).getDate();
      const firstDay = new Date(targetYear, m, 1).getDay();
      const startOffset = firstDay === 0 ? 6 : firstDay - 1; 
      
      const days = Array(42).fill(null);
      
      logs.forEach((l: SkillLog) => {
        if (l.skillId === skill.id) {
          if (l.date.startsWith(mStr)) {
            const val = getLogValue(l, skill);
            mTotal += val;
            
            // Map to calendar day
            const dayNum = parseInt(l.date.split('-')[2], 10);
            days[startOffset + dayNum - 1] = { value: val, intensity: val / maxB };
          }
          if (l.date.startsWith(pStr)) {
            pTotal += getLogValue(l, skill);
          }
        }
      });
      
      tiles.push({ 
        name: monthNames[m], 
        total: mTotal, 
        days, 
        isFuture: (targetYear === today.getFullYear() && m > today.getMonth()) || targetYear > today.getFullYear() 
      });
      
      targetTotal += mTotal;
      prevTotal += pTotal;

      if (mTotal > bestMonthT) {
        bestMonthT = mTotal;
        bestMonth = monthNames[m];
      }
    }

    return { thisYearTotal: targetTotal, lastYearTotal: prevTotal, monthTiles: tiles, bestMonthStr: bestMonth, bestMonthTotal: bestMonthT };
  }, [skill, logs, offset]);

  const delta = thisYearTotal - lastYearTotal;
  const deltaPct = lastYearTotal ? Math.round((Math.abs(delta) / lastYearTotal) * 100) : (thisYearTotal > 0 ? 100 : 0);
  let deltaText = '';
  if (delta > 0) deltaText = \`up \${deltaPct}% from last year\`;
  else if (delta < 0) deltaText = \`down \${deltaPct}% from last year\`;
  else deltaText = 'flat from last year';

  const { handleTouchStart, handleTouchEnd } = useSwipe(offset, setOffset);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full gap-8 select-none p-4 sm:p-6 overflow-y-auto custom-scrollbar"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={offset}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
           <p className="text-sm font-bold text-zinc-500 mb-1 lowercase">
             {offset === 0 ? 'this year' : offset === -1 ? 'last year' : 'selected year'}
           </p>
           <div className="text-[5rem] sm:text-[6rem] leading-none font-black text-white tracking-tighter -ml-1">
             {thisYearTotal} <span className="text-3xl text-zinc-500 font-bold">{skill.mode === 'counter' ? (skill.unit || '') : ''}</span>
           </div>
           <p className={\`text-base font-bold mt-2 lowercase \${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-zinc-500'}\`}>
             {deltaText}
           </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          key={offset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col lg:flex-row gap-8 pb-16"
        >
          {/* Monthly Breakdown List */}
          <div className="w-full lg:w-48 shrink-0 flex flex-col gap-3 order-2 lg:order-1">
             <h3 className="text-xs font-bold text-zinc-500 lowercase tracking-widest mb-2 border-b border-white/5 pb-2">monthly breakdown</h3>
             {monthTiles.map((m: any, i: number) => (
                <div key={i} className={\`flex justify-between items-end border-b border-white/5 pb-2 \${m.isFuture ? 'opacity-30' : ''}\`}>
                   <span className="text-sm font-bold text-zinc-400">{m.name}</span>
                   <span className="text-lg font-black" style={{ color: m.total > 0 ? colorHex : '#52525b' }}>{m.total}</span>
                </div>
             ))}
          </div>
          
          {/* Calendar Heatmap Grid */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-6 order-1 lg:order-2">
            {monthTiles.map((m: any, i: number) => {
              return (
                <div key={i} className={\`flex flex-col gap-2 \${m.isFuture ? 'opacity-20' : ''}\`}>
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{m.name}</span>
                   <div className="grid grid-cols-7 gap-[2px]">
                      {m.days.map((d: any, di: number) => {
                         if (d === null && di < 28) return <div key={di} className="aspect-square" />; // Empty padding only needed at start
                         if (d === null) return null; // Drop extra tail padding
                         return (
                            <div 
                              key={di} 
                              className="aspect-square rounded-[2px]"
                              style={{
                                backgroundColor: d.value > 0 ? colorHex : 'rgba(255,255,255,0.03)',
                                opacity: d.value > 0 ? Math.max(0.3, Math.min(1, d.intensity)) : 1
                              }}
                            />
                         )
                      })}
                   </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
`
fs.writeFileSync('src/components/StatsView.tsx', content);
