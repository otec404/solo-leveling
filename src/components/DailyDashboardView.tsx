import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Minus, Check, CalendarDays, Search, Zap, Flame, Target } from 'lucide-react';
import QuickLogModal from './QuickLogModal';
import QuickLogSheet from './QuickLogSheet';
import { Skill, SkillLog } from '../types';
import HistorySidebar from './HistorySidebar';
import { AVAILABLE_ICONS } from './icons';
import { triggerHaptic } from '../lib/haptics';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DailyDashboardViewProps {
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
  onReorderSkills?: (skills: Skill[]) => void;
}

// --- Color Schema ---
export const THEMES: Record<string, any> = {
  emerald: {
    name: 'emerald',
    cardBorder: 'border-emerald-500/20 shadow-[-4px_0_10px_-5px_emerald-500/10]',
    iconColor: 'text-emerald-500',
    bgActive: 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    bgGradient: 'from-emerald-500/10',
    textMain: 'text-emerald-400',
    textLight: 'text-emerald-200',
    textMuted: 'text-emerald-100',
    badgeBg: 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
    giantNumber: 'text-emerald-400/80 hover:text-emerald-300 drop-shadow-[0_10px_10px_rgba(16,185,129,0.2)]',
    matrixActive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    tabActive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    textCategory: 'text-emerald-500',
    rollerLine: 'border-emerald-500/30 bg-emerald-500/10 shadow-[inset_0_0_15px_rgba(16,185,129,0.15)]',
    rollerText: 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]'
  },
  rose: {
    name: 'rose',
    cardBorder: 'border-rose-500/20 shadow-[-4px_0_10px_-5px_rose-500/10]',
    iconColor: 'text-rose-500',
    bgActive: 'bg-rose-500/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    bgGradient: 'from-rose-500/10',
    textMain: 'text-rose-400',
    textLight: 'text-rose-200',
    textMuted: 'text-rose-100',
    badgeBg: 'bg-rose-500 border-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    giantNumber: 'text-rose-400/80 hover:text-rose-300 drop-shadow-[0_10px_10px_rgba(244,63,94,0.2)]',
    matrixActive: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    tabActive: 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    textCategory: 'text-rose-500',
    rollerLine: 'border-rose-500/30 bg-rose-500/10 shadow-[inset_0_0_15px_rgba(244,63,94,0.15)]',
    rollerText: 'text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]'
  },
  violet: {
    name: 'violet',
    cardBorder: 'border-violet-500/20 shadow-[-4px_0_10px_-5px_violet-500/10]',
    iconColor: 'text-violet-500',
    bgActive: 'bg-violet-500/20 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    bgGradient: 'from-violet-500/10',
    textMain: 'text-violet-400',
    textLight: 'text-violet-200',
    textMuted: 'text-violet-100',
    badgeBg: 'bg-violet-500 border-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.4)]',
    giantNumber: 'text-violet-400/80 hover:text-violet-300 drop-shadow-[0_10px_10px_rgba(139,92,246,0.2)]',
    matrixActive: 'bg-violet-500/20 text-violet-400 border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]',
    tabActive: 'bg-violet-500/20 text-violet-400 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    textCategory: 'text-violet-500',
    rollerLine: 'border-violet-500/30 bg-violet-500/10 shadow-[inset_0_0_15px_rgba(139,92,246,0.15)]',
    rollerText: 'text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]'
  },
  amber: {
    name: 'amber',
    cardBorder: 'border-amber-500/20 shadow-[-4px_0_10px_-5px_amber-500/10]',
    iconColor: 'text-amber-500',
    bgActive: 'bg-amber-500/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    bgGradient: 'from-amber-500/10',
    textMain: 'text-amber-400',
    textLight: 'text-amber-200',
    textMuted: 'text-amber-100',
    badgeBg: 'bg-amber-500 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    giantNumber: 'text-amber-400/80 hover:text-amber-300 drop-shadow-[0_10px_10px_rgba(245,158,11,0.2)]',
    matrixActive: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    tabActive: 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textCategory: 'text-amber-500',
    rollerLine: 'border-amber-500/30 bg-amber-500/10 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)]',
    rollerText: 'text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'
  },
  cyan: {
    name: 'cyan',
    cardBorder: 'border-cyan-500/20 shadow-[-4px_0_10px_-5px_cyan-500/10]',
    iconColor: 'text-cyan-500',
    bgActive: 'bg-cyan-500/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    bgGradient: 'from-cyan-500/10',
    textMain: 'text-cyan-400',
    textLight: 'text-cyan-200',
    textMuted: 'text-cyan-100',
    badgeBg: 'bg-cyan-500 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]',
    giantNumber: 'text-cyan-400/80 hover:text-cyan-300 drop-shadow-[0_10px_10px_rgba(6,182,212,0.2)]',
    matrixActive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    tabActive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    textCategory: 'text-cyan-500',
    rollerLine: 'border-cyan-500/30 bg-cyan-500/10 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)]',
    rollerText: 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'
  },
  indigo: {
    name: 'indigo',
    cardBorder: 'border-indigo-500/20 shadow-[-4px_0_10px_-5px_indigo-500/10]',
    iconColor: 'text-indigo-500',
    bgActive: 'bg-indigo-500/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    bgGradient: 'from-indigo-500/10',
    textMain: 'text-indigo-400',
    textLight: 'text-indigo-200',
    textMuted: 'text-indigo-100',
    badgeBg: 'bg-indigo-500 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.4)]',
    giantNumber: 'text-indigo-400/80 hover:text-indigo-300 drop-shadow-[0_10px_10px_rgba(99,102,241,0.2)]',
    matrixActive: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
    tabActive: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    textCategory: 'text-indigo-500',
    rollerLine: 'border-indigo-500/30 bg-indigo-500/10 shadow-[inset_0_0_15px_rgba(99,102,241,0.15)]',
    rollerText: 'text-indigo-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]'
  },
  fuchsia: {
    name: 'fuchsia',
    cardBorder: 'border-fuchsia-500/20 shadow-[-4px_0_10px_-5px_fuchsia-500/10]',
    iconColor: 'text-fuchsia-500',
    bgActive: 'bg-fuchsia-500/20 border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)]',
    bgGradient: 'from-fuchsia-500/10',
    textMain: 'text-fuchsia-400',
    textLight: 'text-fuchsia-200',
    textMuted: 'text-fuchsia-100',
    badgeBg: 'bg-fuchsia-500 border-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.4)]',
    giantNumber: 'text-fuchsia-400/80 hover:text-fuchsia-300 drop-shadow-[0_10px_10px_rgba(217,70,239,0.2)]',
    matrixActive: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.2)]',
    tabActive: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.15)]',
    textCategory: 'text-fuchsia-500',
    rollerLine: 'border-fuchsia-500/30 bg-fuchsia-500/10 shadow-[inset_0_0_15px_rgba(217,70,239,0.15)]',
    rollerText: 'text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]'
  },
  black: {
    name: 'black',
    cardBorder: 'border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]',
    iconColor: 'text-white',
    bgActive: 'bg-black border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)]',
    bgGradient: 'from-white/10',
    textMain: 'text-white',
    textLight: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    badgeBg: 'bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]',
    giantNumber: 'text-white hover:text-zinc-200 drop-shadow-[0_10px_10px_rgba(255,255,255,0.2)]',
    matrixActive: 'bg-black text-white border-white/40 shadow-[inset_0_0_12px_rgba(255,255,255,0.2)]',
    tabActive: 'bg-black text-white border-white/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]',
    textCategory: 'text-white',
    rollerLine: 'border-white/40 bg-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]',
    rollerText: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
  }
};

export const COLORS = ['emerald', 'rose', 'violet', 'amber', 'cyan', 'indigo', 'fuchsia', 'black'];

export const getCategoryTheme = (category: string, userOverrides: Record<string, string> = {}) => {
  if (userOverrides[category] && THEMES[userOverrides[category]]) {
    return THEMES[userOverrides[category]];
  }

  const predefined: Record<string, string> = {
    'fitness': 'emerald',
    'diet': 'rose',
    'nutrition': 'rose',
    'health': 'emerald',
    'productivity': 'violet',
    'work': 'violet',
    'learning': 'amber',
    'study': 'amber',
    'mindfulness': 'indigo',
    'spirituality': 'indigo',
    'social': 'fuchsia',
    'relationships': 'fuchsia',
    'finance': 'emerald',
  };
  
  const normalized = category.toLowerCase().trim();
  if (predefined[normalized]) return THEMES[predefined[normalized]];
  
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  return THEMES[COLORS[Math.abs(hash) % COLORS.length]];
}


// --- Audio Context & Sound Effect ---
let audioCtx: AudioContext | null = null;
export const playTick = () => {
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
const VerticalRoller = ({ value, onChange, onClose, theme }: { value: number, onChange: (v: number) => void, onClose: () => void, theme: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastVal = useRef(value);

  useEffect(() => {
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch(e) {}
  }, []);

  // Sync scroll position if value changes externally
  useEffect(() => {
    if (scrollRef.current) {
      const expected = value * 48;
      if (Math.abs(scrollRef.current.scrollTop - expected) > 2) {
         scrollRef.current.scrollTo({ top: expected, behavior: 'smooth' });
      }
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const v = Math.round(e.currentTarget.scrollTop / 48);
    if (v !== lastVal.current && v >= 0 && v <= 1000) {
      playTick();
      lastVal.current = v;
      onChange(v);
    }
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
         className="relative w-32 h-[240px] bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl z-10 overflow-hidden flex justify-center touch-pan-y"
      >
        <div className={`absolute top-1/2 left-2 right-2 h-[48px] -translate-y-1/2 rounded-xl border pointer-events-none z-10 transition-colors ${theme.bgActive}`} />
        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-0"
          style={{ scrollPaddingTop: 96 }}
        >
          <div style={{ height: 96, flexShrink: 0 }} />
          {Array.from({ length: 1001 }).map((_, i) => (
            <div key={i} className={`flex items-center justify-center snap-start text-4xl font-black transition-colors ${value === i ? theme.textMain : 'text-zinc-500'}`} style={{ height: 48, flexShrink: 0 }}>
              {i}
            </div>
          ))}
          <div style={{ height: 96, flexShrink: 0 }} />
        </div>
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />
      </motion.div>
    </div>,
    document.body
  );
}


const CompactBentoCard: React.FC<{ skill: Skill, log: SkillLog, date: Date, onUpdateLog: any, theme: any }> = ({ skill, log, date, onUpdateLog, theme }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const Icon = AVAILABLE_ICONS[skill.icon || 'Target'] || Target;
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isCompleted = skill.mode === 'checkbox' ? log.checked : log.count > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (skill.mode === 'checkbox') {
      triggerHaptic('success');
      if (!log.checked) playTick();
      onUpdateLog(skill.id, dateToYMD(date), { checked: !log.checked });
    } else {
      setIsCounterOpen(true);
    }
  };

  if (skill.mode === 'counter') {
    return (
      <>
        <div 
          ref={setNodeRef} 
          style={style} 
          {...attributes} 
          {...listeners}
          onClick={handleToggle}
          className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border transition-all cursor-pointer select-none group aspect-square ${isCompleted ? theme.bgActive : 'bg-black/20 border-white/5 hover:bg-white/5'} ${isDragging ? 'shadow-2xl scale-105 opacity-90 cursor-grabbing' : 'cursor-grab'}`}
        >
          <span className={`text-[10px] font-bold tracking-wide uppercase text-center line-clamp-1 leading-tight w-full px-1 transition-colors ${isCompleted ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
            {skill.name}
          </span>
          
          <div className={`text-4xl sm:text-5xl font-black transition-all flex-1 flex items-center justify-center w-full truncate ${isCompleted ? theme.giantNumber : 'text-zinc-600 group-hover:text-zinc-500'}`}>
            {log.count}
          </div>
          
          <div className="flex items-center justify-between w-full shrink-0">
             <button 
                onPointerDown={(e) => { e.stopPropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (log.count > 0) onUpdateLog(skill.id, dateToYMD(date), { count: log.count - 1 }); triggerHaptic('light'); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
             >
                <Minus size={16} />
             </button>
             <button 
                onPointerDown={(e) => { e.stopPropagation(); }}
                onClick={(e) => { e.stopPropagation(); onUpdateLog(skill.id, dateToYMD(date), { count: log.count + 1 }); playTick(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-black/20 text-white hover:bg-black/40' : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'}`}
             >
                <Plus size={16} />
             </button>
          </div>
        </div>
        <AnimatePresence>
          {isCounterOpen && (
            <VerticalRoller
              value={log.count}
              onChange={(val) => onUpdateLog(skill.id, dateToYMD(date), { count: val })}
              onClose={() => setIsCounterOpen(false)}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners}
        onClick={handleToggle}
        className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl border transition-all cursor-pointer select-none group aspect-square ${isCompleted ? theme.bgActive : 'bg-black/20 border-white/5 hover:bg-white/5'} ${isDragging ? 'shadow-2xl scale-105 opacity-90 cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-2 transition-all ${isCompleted ? 'bg-white/20 shadow-inner' : 'bg-white/5 group-hover:bg-white/10'}`}>
          <Icon size={20} className={`sm:w-6 sm:h-6 transition-all ${isCompleted ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : theme.iconColor}`} />
        </div>
        <span className={`text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-center line-clamp-2 leading-tight transition-colors px-1 ${isCompleted ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
          {skill.name}
        </span>
      </div>
    </>
  );
};

const dateToYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function DailyDashboardView({ skills, logs, categoryColors, onUpdateLog, onReorderSkills }: DailyDashboardViewProps) {
  const [currentDate, setCurrentDate] = useState<string>(dateToYMD(new Date()));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isQuickLogSheetOpen, setIsQuickLogSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allCategories = useMemo(() => Array.from(new Set(skills.map(s => s.category))), [skills]);
  const activeCategories = activeCategory === 'All' ? allCategories : allCategories.filter(c => c === activeCategory);

  const globalAnalytics = useMemo(() => {
    let totalCompletions = 0;
    logs.forEach(l => {
       if (l.count > 0 || l.checked) totalCompletions++;
    });
    return { totalCompletions, globalStreak: 0 };
  }, [logs]);

  const formattedDate = () => new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isActuallyToday = () => {
    const today = new Date();
    const cd = new Date(currentDate + 'T12:00:00'); return cd.getDate() === today.getDate() && cd.getMonth() === today.getMonth() && cd.getFullYear() === today.getFullYear();
  };
  const setToday = () => setCurrentDate(dateToYMD(new Date()));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderSkills) {
      const oldIndex = skills.findIndex(s => s.id === active.id);
      const newIndex = skills.findIndex(s => s.id === over.id);
      onReorderSkills(arrayMove(skills, oldIndex, newIndex));
    }
  };

  const currentDateStr = currentDate;

  const changeDate = (days: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev + 'T12:00:00');
      d.setDate(d.getDate() + days);
      return dateToYMD(d);
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full h-full overflow-y-auto relative bg-zinc-950 pb-24 md:pb-12 hide-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/5">
           <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Logs</h1>
              <p className="text-zinc-500 font-medium">Track your daily progress</p>
           </div>
           <div className="flex items-center gap-3">
             <button
                aria-label="Open Quick Log"
                onClick={() => setIsQuickLogOpen(true)}
                className="w-12 h-12 flex items-center justify-center bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-2xl text-yellow-500 hover:text-yellow-400 transition-all shadow-lg shadow-yellow-500/10"
             >
                <Zap size={20} strokeWidth={2.5} />
             </button>
             <button
                aria-label="Open Date Navigation Sidebar"
                onClick={() => setIsSidebarOpen(true)}
                className="w-12 h-12 flex items-center justify-center bg-zinc-900/40 hover:bg-zinc-800 border border-white/5 hover:border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all shadow-lg"
             >
                <CalendarDays size={20} />
             </button>
             <button
                aria-label="Quick Log Mode"
                onClick={() => setIsQuickLogSheetOpen(true)}
                className="w-12 h-12 flex items-center justify-center bg-white hover:bg-zinc-200 border border-white rounded-2xl text-black transition-all shadow-lg hover:scale-105 active:scale-95"
             >
                <Plus size={24} strokeWidth={2.5} />
             </button>
           </div>
        </header>

        {/* Weapon Stats Bento Card */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden group mb-4">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
               <Target size={120} strokeWidth={1} />
            </div>
            
            <div className="flex items-center gap-2 mb-6">
               <Target className="w-5 h-5 text-red-500" />
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Weapon Stats</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-center">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                     <Check size={14} className="text-emerald-500" /> Total Hits
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                     {globalAnalytics.totalCompletions}
                  </div>
               </div>
               
               <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-center">
                  <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                     <Flame size={14} className="text-orange-500" /> Current Streak
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter flex items-baseline gap-1">
                     {globalAnalytics.globalStreak} <span className="text-sm font-medium text-zinc-500 tracking-normal">days</span>
                  </div>
               </div>
            </div>
        </div>


        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl border-dashed">
            <p className="text-zinc-500">No skills available. Go to Manage Skills to create some.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
             <div className="flex flex-col gap-4 bg-zinc-900/20 p-4 sm:p-5 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">{formattedDate()}</span>
                      <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">{isActuallyToday() ? 'Today' : 'Selected Date'}</span>
                   </div>
                   {!isActuallyToday() && (
                      <button aria-label="Go to Today"
                      onClick={setToday} className="px-4 py-2 min-h-[44px] flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10">
                        Go to Today
                      </button>
                   )}
                </div>
                
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                   <button onClick={() => changeDate(-7)} className="w-11 h-11 flex items-center justify-center sm:w-12 sm:h-12 sm:p-3 text-zinc-500 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all shrink-0"><ChevronLeft size={18}/></button>
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
                   <button onClick={() => changeDate(7)} className="w-11 h-11 flex items-center justify-center sm:w-12 sm:h-12 sm:p-3 text-zinc-500 hover:text-white bg-black/20 hover:bg-black/40 rounded-xl transition-all shrink-0"><ChevronRight size={18}/></button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-4 mt-1 border-t border-white/5 snap-x">
                   <button
                      onClick={() => setActiveCategory('All')}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-start border shrink-0 ${activeCategory === 'All' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-transparent text-zinc-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                   >
                     All Categories
                   </button>
                   {activeCategories.map(cat => {
                     const catTheme = getCategoryTheme(cat, categoryColors);
                     return (
                       <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-start border shrink-0 ${activeCategory === cat ? catTheme.tabActive : 'bg-transparent text-zinc-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                       >
                         {cat}
                       </button>
                     )
                   })}
                </div>
             </div>

             <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
             {(activeCategory === 'All' ? activeCategories : activeCategories.filter(c => c === activeCategory)).map(cat => {
                const catSkills = skills.filter(s => s.category === cat);
                const catTheme = getCategoryTheme(cat, categoryColors);
                if (!catSkills.length) return null;
                return (
                   <div key={cat} className="flex flex-col gap-3">
                      <div className={`text-[10px] font-black uppercase tracking-widest ml-2 ${catTheme.textCategory}`}>{cat}</div>
                      <SortableContext items={catSkills.map(s => s.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                         {catSkills.map(skill => (
                            <CompactBentoCard key={skill.id} skill={skill} log={getLog(logs, skill.id, currentDate)} date={new Date(currentDate + 'T12:00:00')} onUpdateLog={onUpdateLog} theme={catTheme} />
                         ))}
                      </div>
                      </SortableContext>
                   </div>
                )
             })}
             </DndContext>
          </div>
        )}
      </div>

            <AnimatePresence>
        {isQuickLogOpen && (
          <QuickLogModal
            isOpen={isQuickLogOpen}
            onClose={() => setIsQuickLogOpen(false)}
            skills={skills}
            dateLogs={logs.filter(l => l.date === currentDate)}
            onUpdateLog={(skillId, updates) => onUpdateLog(skillId, currentDate, updates)}
          />
        )}
        {isQuickLogSheetOpen && (
          <QuickLogSheet
            isOpen={isQuickLogSheetOpen}
            onClose={() => setIsQuickLogSheetOpen(false)}
            skills={skills}
            logs={logs}
            dateLogs={logs.filter(l => l.date === currentDate)}
            currentDateStr={currentDate}
            categoryColors={categoryColors}
            onUpdateLog={onUpdateLog}
          />
        )}
      </AnimatePresence>
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        skills={skills}
        logs={logs}
        categories={allCategories}
        categoryColors={categoryColors}
      />

      
    </div>
  );
}
