import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Plus, Minus, Check } from 'lucide-react';
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

// --- Inline Skill Item Component ---
interface InlineSkillItemProps {
  skill: Skill;
  log: SkillLog;
  date: string;
  isLast: boolean;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
}

function InlineSkillItem({ skill, log, date, isLast, onUpdateLog }: InlineSkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(log.count.toString());
  const [isScrollerOpen, setIsScrollerOpen] = useState(false);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const lastTick = React.useRef(log.count);
  const ITEM_HEIGHT = 40;

  const isLogged = skill.mode === 'counter' ? log.count > 0 : log.checked;
  const showControls = (isHovered || isEditing || isScrollerOpen) && skill.mode === 'counter';

  const handleIncrement = () => onUpdateLog(skill.id, date, { count: log.count + 1 });
  const handleDecrement = () => onUpdateLog(skill.id, date, { count: Math.max(0, log.count - 1) });
  const handleCheckToggle = () => onUpdateLog(skill.id, date, { checked: !log.checked });

  const handleInputSubmit = () => {
    setIsEditing(false);
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateLog(skill.id, date, { count: val });
    } else {
      setEditValue(log.count.toString());
    }
  };

  const handleOpenScroller = () => {
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {}
    setIsScrollerOpen(true);
  };

  // Set initial scroll position when opening
  React.useEffect(() => {
    if (isScrollerOpen && scrollRef.current) {
      scrollRef.current.scrollTop = log.count * ITEM_HEIGHT;
      lastTick.current = log.count;
    }
  }, [isScrollerOpen, log.count]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    if (index !== lastTick.current && index >= 0 && index < 100) {
      playTick();
      lastTick.current = index;
      onUpdateLog(skill.id, date, { count: index });
    }
  };

  return (
    <div 
      className="relative inline-flex items-center group font-mono text-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center transition-colors ${isLogged ? 'text-cyan-400' : 'text-zinc-500'}`}>
        
        {/* Short Form (Click to open scroller or toggle checkbox) */}
        <span 
          className="cursor-pointer hover:text-cyan-300 transition-colors"
          onClick={() => {
            if (skill.mode === 'counter') {
              handleOpenScroller();
            } else {
              handleCheckToggle();
            }
          }}
        >
          {skill.shortForm}
        </span>

        {/* Counter Value Area */}
        {skill.mode === 'counter' && (
          <span className="flex items-center ml-1">
            {/* Decrement Button */}
            {showControls && (
              <button 
                onClick={handleDecrement}
                className="px-1 text-zinc-600 hover:text-cyan-400 outline-none"
              >-</button>
            )}

            {/* Input / Display */}
            {isEditing ? (
              <input
                autoFocus
                type="number"
                className="w-[3ch] bg-zinc-900 border-b border-cyan-500/50 text-center text-cyan-400 outline-none p-0 hide-arrows"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleInputSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
              />
            ) : (
              (log.count > 0 || showControls) && (
                <span 
                  className={`cursor-pointer hover:text-white min-w-[1ch] text-center ${log.count === 0 ? 'opacity-30' : ''}`}
                  onClick={() => {
                    setEditValue(log.count.toString());
                    setIsEditing(true);
                  }}
                >
                  {log.count}
                </span>
              )
            )}

            {/* Increment Button */}
            {showControls && (
              <button 
                onClick={handleIncrement}
                className="px-1 text-zinc-600 hover:text-cyan-400 outline-none"
              >+</button>
            )}
          </span>
        )}

        {/* Checkbox Value Area */}
        {skill.mode === 'checkbox' && (
          <span className="ml-1 cursor-pointer" onClick={handleCheckToggle}>
            {log.checked ? '✓' : ''}
          </span>
        )}
      </div>

      {!isLast && <span className="text-zinc-600 mr-3">,</span>}

      {/* Hover Details Card */}
      <AnimatePresence>
        {isHovered && !isScrollerOpen && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, delay: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 bg-zinc-950 border border-zinc-800/80 p-5 rounded-2xl shadow-2xl min-w-[240px] pointer-events-none"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg shadow-inner">
                {skill.shortForm}
              </div>
              <div>
                <h4 className="text-white font-semibold leading-tight">{skill.name}</h4>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">
                  {skill.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-500">Mode:</span> {skill.mode === 'counter' ? 'Counter' : 'Checkbox'}
              </p>
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-500">Created:</span> {new Date(skill.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cool Scroller Popover */}
      <AnimatePresence>
        {isScrollerOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={(e) => { e.stopPropagation(); setIsScrollerOpen(false); }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden z-50 w-16 h-[120px] shadow-2xl"
            >
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar"
              >
                <div style={{ height: ITEM_HEIGHT }} /> {/* Top padding */}
                {Array.from({ length: 100 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-[40px] flex items-center justify-center snap-center text-xl font-bold transition-colors ${i === log.count ? 'text-cyan-400' : 'text-zinc-600'}`}
                  >
                    {i}
                  </div>
                ))}
                <div style={{ height: ITEM_HEIGHT }} /> {/* Bottom padding */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DailyDashboardView({ skills, logs, onUpdateLog }: DailyDashboardViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [shortDateFormat, setShortDateFormat] = useState(true);

  const getLog = (skillId: string, date: string) => {
    return logs.find(l => l.skillId === skillId && l.date === date) || { skillId, date, count: 0, checked: false };
  };

  const changeDate = (days: number) => {
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setCurrentDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  const formattedDate = () => {
    const d = new Date(currentDate + 'T12:00:00');
    if (shortDateFormat) {
      return new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }).format(d);
    } else {
      return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    }
  };

  // Group skills by category
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 w-full h-full overflow-y-auto relative pb-24 md:pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Daily Log</h1>
          <p className="text-zinc-500">Track your daily progress and interact with your skills.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
          <button onClick={() => changeDate(-1)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={setToday} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Today
          </button>
          <button onClick={() => changeDate(1)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl border-dashed">
          <p className="text-zinc-500">No skills available. Go to Manage Skills to create some.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <p className="text-zinc-500 text-sm mb-2 italic">
            Tip: Left-click a skill to track or increment it. Right-click to reduce. Hover for details.
          </p>
          {categories.map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="flex flex-wrap items-baseline gap-2 text-lg font-mono">
                <span className="text-white capitalize">{category}</span>
                <button 
                  onClick={() => setShortDateFormat(!shortDateFormat)}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {formattedDate()}
                </button>
                <span className="text-zinc-500 mr-2">:</span>
                
                {categorySkills.map((skill, index) => {
                  const log = getLog(skill.id, currentDate);
                  return (
                    <InlineSkillItem 
                      key={skill.id}
                      skill={skill}
                      log={log}
                      date={currentDate}
                      isLast={index === categorySkills.length - 1}
                      onUpdateLog={onUpdateLog}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
