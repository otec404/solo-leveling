import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  Flame, 
  Target, 
  Sparkles, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  X,
  Layers,
  Globe,
  Play,
  Pause,
  Flag,
  RotateCw,
  Maximize2,
  Clock, 
  FastForward,
  Scale,
  Sliders
} from 'lucide-react';
import QuickLogSheet from './QuickLogSheet';
import { Skill, SkillLog, TimerLap } from '../types';
import HistorySidebar from './HistorySidebar';
import { getSkillIcon } from './icons';
import { triggerHaptic } from '../lib/haptics';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardIconStudioModal from './CardIconStudioModal';
import TimelapsePlayerModal from './TimelapsePlayerModal';
import { getSkillImage } from '../utils/skillImages';
import WeightRulerScroller from './WeightRulerScroller';

interface DailyDashboardViewProps {
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
  onReorderSkills?: (skills: Skill[]) => void;
  onUpdateSkill?: (skillId: string, updates: Partial<Skill>) => void;
  searchQuery?: string;
  onOpenTimerModal?: (skill: Skill, dateStr: string) => void;
  selectedDate?: string;
  onSelectDate?: (dateStr: string) => void;
}

// --- High-End Futuristic Color Themes with Rich Inset Lighting ---
export const THEMES: Record<string, any> = {
  emerald: {
    name: 'emerald',
    cardBorder: 'border border-emerald-500/30 hover:border-emerald-400/60',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    bgActive: 'bg-gradient-to-br from-emerald-950/70 via-zinc-900/90 to-zinc-950 border-emerald-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(16,185,129,0.18)]',
    bgGradient: 'from-emerald-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-emerald-400',
    textLight: 'text-emerald-200',
    textMuted: 'text-emerald-300/70',
    badgeBg: 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300',
    giantNumber: 'text-emerald-300 group-hover:text-emerald-200',
    tabActive: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    textCategory: 'text-emerald-400',
    accentColorHex: '#10b981'
  },
  rose: {
    name: 'rose',
    cardBorder: 'border border-rose-500/30 hover:border-rose-400/60',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    bgActive: 'bg-gradient-to-br from-rose-950/70 via-zinc-900/90 to-zinc-950 border-rose-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(244,63,94,0.18)]',
    bgGradient: 'from-rose-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-rose-400',
    textLight: 'text-rose-200',
    textMuted: 'text-rose-300/70',
    badgeBg: 'bg-rose-500/20 border border-rose-400/40 text-rose-300',
    giantNumber: 'text-rose-300 group-hover:text-rose-200',
    tabActive: 'bg-rose-500/25 text-rose-300 border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    textCategory: 'text-rose-400',
    accentColorHex: '#f43f5e'
  },
  violet: {
    name: 'violet',
    cardBorder: 'border border-violet-500/30 hover:border-violet-400/60',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
    bgActive: 'bg-gradient-to-br from-violet-950/70 via-zinc-900/90 to-zinc-950 border-violet-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(139,92,246,0.18)]',
    bgGradient: 'from-violet-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-violet-400',
    textLight: 'text-violet-200',
    textMuted: 'text-violet-300/70',
    badgeBg: 'bg-violet-500/20 border border-violet-400/40 text-violet-300',
    giantNumber: 'text-violet-300 group-hover:text-violet-200',
    tabActive: 'bg-violet-500/25 text-violet-300 border-violet-400/60 shadow-[0_0_15px_rgba(139,92,246,0.25)]',
    textCategory: 'text-violet-400',
    accentColorHex: '#8b5cf6'
  },
  amber: {
    name: 'amber',
    cardBorder: 'border border-amber-500/30 hover:border-amber-400/60',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    bgActive: 'bg-gradient-to-br from-amber-950/70 via-zinc-900/90 to-zinc-950 border-amber-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(245,158,11,0.18)]',
    bgGradient: 'from-amber-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-amber-400',
    textLight: 'text-amber-200',
    textMuted: 'text-amber-300/70',
    badgeBg: 'bg-amber-500/20 border border-amber-400/40 text-amber-300',
    giantNumber: 'text-amber-300 group-hover:text-amber-200',
    tabActive: 'bg-amber-500/25 text-amber-300 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    textCategory: 'text-amber-400',
    accentColorHex: '#f59e0b'
  },
  cyan: {
    name: 'cyan',
    cardBorder: 'border border-cyan-500/30 hover:border-cyan-400/60',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    bgActive: 'bg-gradient-to-br from-cyan-950/70 via-zinc-900/90 to-zinc-950 border-cyan-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(6,182,212,0.18)]',
    bgGradient: 'from-cyan-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-cyan-400',
    textLight: 'text-cyan-200',
    textMuted: 'text-cyan-300/70',
    badgeBg: 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300',
    giantNumber: 'text-cyan-300 group-hover:text-cyan-200',
    tabActive: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    textCategory: 'text-cyan-400',
    accentColorHex: '#06b6d4'
  },
  indigo: {
    name: 'indigo',
    cardBorder: 'border border-indigo-500/30 hover:border-indigo-400/60',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    bgActive: 'bg-gradient-to-br from-indigo-950/70 via-zinc-900/90 to-zinc-950 border-indigo-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(99,102,241,0.18)]',
    bgGradient: 'from-indigo-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-indigo-400',
    textLight: 'text-indigo-200',
    textMuted: 'text-indigo-300/70',
    badgeBg: 'bg-indigo-500/20 border border-indigo-400/40 text-indigo-300',
    giantNumber: 'text-indigo-300 group-hover:text-indigo-200',
    tabActive: 'bg-indigo-500/25 text-indigo-300 border-indigo-400/60 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    textCategory: 'text-indigo-400',
    accentColorHex: '#6366f1'
  },
  fuchsia: {
    name: 'fuchsia',
    cardBorder: 'border border-fuchsia-500/30 hover:border-fuchsia-400/60',
    iconColor: 'text-fuchsia-400',
    iconBg: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300',
    bgActive: 'bg-gradient-to-br from-fuchsia-950/70 via-zinc-900/90 to-zinc-950 border-fuchsia-400/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(217,70,239,0.18)]',
    bgGradient: 'from-fuchsia-950/30 via-zinc-900/80 to-zinc-950/95',
    textMain: 'text-fuchsia-400',
    textLight: 'text-fuchsia-200',
    textMuted: 'text-fuchsia-300/70',
    badgeBg: 'bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-300',
    giantNumber: 'text-fuchsia-300 group-hover:text-fuchsia-200',
    tabActive: 'bg-fuchsia-500/25 text-fuchsia-300 border-fuchsia-400/60 shadow-[0_0_15px_rgba(217,70,239,0.25)]',
    textCategory: 'text-fuchsia-400',
    accentColorHex: '#d946ef'
  },
  black: {
    name: 'black',
    cardBorder: 'border border-white/20 hover:border-white/40',
    iconColor: 'text-white',
    iconBg: 'bg-white/10 border-white/20 text-white',
    bgActive: 'bg-gradient-to-br from-zinc-850 via-zinc-900 to-zinc-950 border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_inset_0_0_35px_rgba(255,255,255,0.08)]',
    bgGradient: 'from-zinc-900/60 via-zinc-900/90 to-zinc-950',
    textMain: 'text-white',
    textLight: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    badgeBg: 'bg-white/20 border border-white/30 text-white',
    giantNumber: 'text-white group-hover:text-zinc-100',
    tabActive: 'bg-white/20 text-white border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)]',
    textCategory: 'text-white',
    accentColorHex: '#ffffff'
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
};

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
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (e) {}
};

const dateToYMD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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

  useEffect(() => {
    if (scrollRef.current) {
      const expected = value * 52;
      if (Math.abs(scrollRef.current.scrollTop - expected) > 2) {
         scrollRef.current.scrollTo({ top: expected, behavior: 'smooth' });
      }
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const v = Math.round(e.currentTarget.scrollTop / 52);
    if (v !== lastVal.current && v >= 0 && v <= 1000) {
      playTick();
      lastVal.current = v;
      onChange(v);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onPointerDown={(e) => { e.stopPropagation(); onClose(); }} onClick={(e) => { e.stopPropagation(); onClose(); }} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.9 }}
         transition={{ duration: 0.15 }}
         onPointerDown={(e) => e.stopPropagation()}
         onClick={(e) => e.stopPropagation()}
         className="relative w-36 h-[260px] bg-zinc-950/95 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl z-10 overflow-hidden flex justify-center touch-pan-y"
      >
        <div className={`absolute top-1/2 left-2 right-2 h-[52px] -translate-y-1/2 rounded-2xl border pointer-events-none z-10 transition-colors ${theme.bgActive}`} />
        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-0"
          style={{ scrollPaddingTop: 104 }}
        >
          <div style={{ height: 104, flexShrink: 0 }} />
          {Array.from({ length: 1001 }).map((_, i) => (
            <div key={i} className={`flex items-center justify-center snap-start text-4xl font-mono font-black transition-colors ${value === i ? theme.textMain : 'text-zinc-600'}`} style={{ height: 52, flexShrink: 0 }}>
              {i}
            </div>
          ))}
          <div style={{ height: 104, flexShrink: 0 }} />
        </div>
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />
      </motion.div>
    </div>,
    document.body
  );
};

const formatMsDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
};

// =========================================================================
// --- BIG, HIGH-IMPACT BENTO CARD (NO BACKFLIP, CLEAN EXPANDABLE CONTROLS) ---
// =========================================================================
const BigBentoCard: React.FC<{ 
  skill: Skill; 
  log: SkillLog; 
  date: Date; 
  onUpdateLog: any; 
  theme: any;
  streak?: number;
  allLogs?: SkillLog[];
  onOpenIconStudio?: (skillId: string) => void;
  onOpenTimerModal?: (skill: Skill, dateStr: string) => void;
}> = ({ skill, log, date, onUpdateLog, theme, streak = 0, allLogs = [], onOpenIconStudio, onOpenTimerModal }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [isWeightScrollerOpen, setIsWeightScrollerOpen] = useState(false);
  
  // Live Timer State for In-Card Stopwatch
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(log.timerDuration || 0);
  const [laps, setLaps] = useState<TimerLap[]>(log.timerLaps || []);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(log.timerDuration || 0);
  const intervalRef = useRef<any>(null);

  const Icon = getSkillIcon(skill);
  
  // Sync state when log prop changes externally
  useEffect(() => {
    if (!isRunning) {
      const dur = log.timerDuration || 0;
      setElapsedMs(dur);
      accumulatedRef.current = dur;
      setLaps(log.timerLaps || []);
    }
  }, [log.timerDuration, log.timerLaps, isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStartStop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isRunning) {
      // STOP / PAUSE
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      const finalElapsed = accumulatedRef.current + (Date.now() - startTimeRef.current);
      accumulatedRef.current = finalElapsed;
      setElapsedMs(finalElapsed);
      setIsRunning(false);
      triggerHaptic('medium');
      playTick();
      onUpdateLog(skill.id, dateToYMD(date), {
        timerDuration: finalElapsed,
        timerLaps: laps,
        count: laps.length || (finalElapsed > 0 ? 1 : 0),
        checked: finalElapsed > 0,
        timestamp: Date.now()
      });
    } else {
      // START
      triggerHaptic('success');
      playTick();
      startTimeRef.current = Date.now();
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedMs(accumulatedRef.current + (Date.now() - startTimeRef.current));
      }, 35);
    }
  };

  const handleAddLap = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic('light');
    playTick();
    
    if (!isRunning && elapsedMs === 0) {
      handleDirectLapCount(laps.length + 1);
      return;
    }
    
    const currentTotal = isRunning ? accumulatedRef.current + (Date.now() - startTimeRef.current) : elapsedMs;
    const prevLapsTotal = laps.reduce((acc, l) => acc + l.duration, 0);
    const lapDuration = Math.max(1000, currentTotal - prevLapsTotal);
    
    const newLap: TimerLap = {
      lapNumber: laps.length + 1,
      duration: lapDuration,
      formatted: formatMsDuration(lapDuration),
      timestamp: Date.now(),
      note: `Lap ${laps.length + 1}`
    };
    
    const newLaps = [...laps, newLap];
    setLaps(newLaps);
    onUpdateLog(skill.id, dateToYMD(date), {
      timerDuration: currentTotal,
      timerLaps: newLaps,
      count: newLaps.length,
      checked: true,
      timestamp: Date.now()
    });
  };

  const handleDirectLapCount = (targetCount: number) => {
    const validCount = Math.max(0, Math.min(999, targetCount));
    triggerHaptic('light');
    playTick();
    
    if (validCount === 0) {
      setLaps([]);
      setElapsedMs(0);
      accumulatedRef.current = 0;
      onUpdateLog(skill.id, dateToYMD(date), {
        timerDuration: 0,
        timerLaps: [],
        count: 0,
        checked: false,
        timestamp: Date.now()
      });
      return;
    }

    let updatedLaps: TimerLap[] = [...laps];
    if (validCount > laps.length) {
      const needed = validCount - laps.length;
      for (let i = 0; i < needed; i++) {
        const num = updatedLaps.length + 1;
        const dur = 60000;
        updatedLaps.push({
          lapNumber: num,
          duration: dur,
          formatted: formatMsDuration(dur),
          timestamp: Date.now(),
          note: `Lap ${num}`
        });
      }
    } else if (validCount < laps.length) {
      updatedLaps = updatedLaps.slice(0, validCount);
    }

    const totalDuration = updatedLaps.reduce((acc, l) => acc + l.duration, 0);
    setLaps(updatedLaps);
    if (!isRunning) {
      setElapsedMs(totalDuration);
      accumulatedRef.current = totalDuration;
    }
    onUpdateLog(skill.id, dateToYMD(date), {
      timerDuration: totalDuration,
      timerLaps: updatedLaps,
      count: validCount,
      checked: true,
      timestamp: Date.now()
    });
  };

  const handleResetTimer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic('warning');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setElapsedMs(0);
    accumulatedRef.current = 0;
    setLaps([]);
    onUpdateLog(skill.id, dateToYMD(date), {
      timerDuration: 0,
      timerLaps: [],
      count: 0,
      checked: false,
      timestamp: Date.now()
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isCompleted = skill.mode === 'checkbox' 
    ? log.checked 
    : (skill.mode === 'timer' 
        ? (Boolean(log.timerDuration) || Boolean(log.timerLaps?.length)) 
        : (skill.mode === 'measurement' 
            ? ((log.value !== undefined && log.value > 0) || log.count > 0) 
            : log.count > 0));

  const measurementVal = log.value !== undefined ? log.value : (log.count > 0 ? log.count : 0);

  // Calculate trend line from recent logs for this skill
  const recentMeasurementLogs = useMemo(() => {
    if (skill.mode !== 'measurement') return [];
    return allLogs
      .filter(l => l.skillId === skill.id && ((l.value !== undefined && l.value > 0) || l.count > 0))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map(l => (l.value !== undefined ? l.value : l.count));
  }, [allLogs, skill.id, skill.mode]);

  const sparklinePoints = useMemo(() => {
    if (recentMeasurementLogs.length < 2) return null;
    const min = Math.min(...recentMeasurementLogs);
    const max = Math.max(...recentMeasurementLogs);
    const range = max === min ? 1 : max - min;
    const w = 110;
    const h = 24;
    return recentMeasurementLogs.map((val, idx) => {
      const x = (idx / (recentMeasurementLogs.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 6) - 3;
      return `${x},${y}`;
    }).join(' ');
  }, [recentMeasurementLogs]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (skill.mode === 'checkbox') {
      triggerHaptic('success');
      if (!log.checked) playTick();
      onUpdateLog(skill.id, dateToYMD(date), { checked: !log.checked });
    } else if (skill.mode === 'timer') {
      handleStartStop();
    } else if (skill.mode === 'measurement') {
      setIsWeightScrollerOpen(true);
    } else {
      setIsCounterOpen(true);
    }
  };

  const skillImage = getSkillImage(skill);

  // ----------------------------------------------------
  // RENDER PURE SOLID CARD (NO 3D FLIP / NO BACKFLIP)
  // ----------------------------------------------------
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`relative min-h-[185px] sm:min-h-[200px] select-none group ${
        isDragging ? 'scale-105 opacity-90 cursor-grabbing ring-2 ring-white/40 z-50 shadow-2xl' : 'cursor-grab'
      }`}
    >
      <div 
        onClick={handleToggle}
        className={`relative w-full h-full flex flex-col justify-between p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-2xl shadow-xl ${
          isCompleted 
            ? `${theme.bgActive}` 
            : `bg-gradient-to-b ${theme.bgGradient} ${theme.cardBorder} hover:border-white/30`
        } hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99]`}
      >
        {/* Ambient Thematic Backdrop Image with Multi-Stop Contrast Scrim */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <img 
            src={skillImage} 
            alt={skill.name} 
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 group-hover:opacity-35 transition-all duration-700 scale-100 group-hover:scale-105 filter saturate-150 brightness-90" 
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            isCompleted 
              ? 'bg-gradient-to-t from-black/95 via-black/80 to-black/60' 
              : 'bg-gradient-to-t from-[#050508]/95 via-[#08080f]/85 to-[#0c0c16]/70 group-hover:from-[#050508]/90'
          }`} />
        </div>

        {/* Large Background Transparent Symbol Watermark */}
        <div className="absolute -right-3 -bottom-3 sm:-right-2 sm:-bottom-2 pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity duration-500 text-white select-none z-0">
          <Icon size={118} strokeWidth={1.2} />
        </div>

        {/* Top Delicate Specular Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />

        {/* Header Row: NAME + EXPANSION ACTION */}
        <div className="flex items-center justify-between w-full min-w-0 z-10 gap-2">
          <h3 className={`text-base sm:text-[17px] font-bold tracking-tight truncate leading-tight transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${
            isCompleted ? 'text-white' : 'text-zinc-100 group-hover:text-white'
          }`}>
            {skill.name}
          </h3>

          {skill.mode === 'timer' && (
            <button
              type="button"
              title="Open Lap Manager & Full Stopwatch"
              onClick={(e) => {
                e.stopPropagation();
                onOpenTimerModal?.(skill, dateToYMD(date));
                triggerHaptic('light');
              }}
              className="w-7 h-7 rounded-xl bg-black/40 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center transition-all backdrop-blur-md active:scale-95 shrink-0"
            >
              <Maximize2 size={12} />
            </button>
          )}

          {skill.mode === 'measurement' && (
            <button
              type="button"
              title="Open Weight Ruler Scroller"
              onClick={(e) => {
                e.stopPropagation();
                setIsWeightScrollerOpen(true);
                triggerHaptic('light');
              }}
              className="w-7 h-7 rounded-xl bg-black/40 hover:bg-white/20 border border-white/15 text-cyan-300 hover:text-white flex items-center justify-center transition-all backdrop-blur-md active:scale-95 shrink-0"
            >
              <Scale size={13} />
            </button>
          )}
        </div>

        {/* Center & Bottom: Dedicated Action */}
        {skill.mode === 'timer' && (
          <>
            {/* Main Live Clock Display */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onOpenTimerModal?.(skill, dateToYMD(date));
              }}
              className="flex-1 flex flex-col items-center justify-center w-full min-w-0 z-10 py-0.5 cursor-pointer group/timer"
              title="Tap to open full Lap Manager"
            >
              <div className={`text-3xl sm:text-4xl font-mono font-black tracking-tight transition-all tabular-nums leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
                isRunning ? 'text-emerald-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]' : (elapsedMs > 0 ? 'text-cyan-300' : 'text-zinc-100 group-hover/timer:text-white')
              }`}>
                {elapsedMs > 0 ? formatMsDuration(elapsedMs) : '00:00.0'}
              </div>

              {/* Direct Lap Adjuster Pill */}
              <div 
                className="flex items-center gap-1.5 mt-1.5 bg-black/50 px-2 py-0.5 rounded-full border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleDirectLapCount(Math.max(0, laps.length - 1))}
                  className="w-4 h-4 rounded-full text-zinc-400 hover:text-white flex items-center justify-center text-[11px] font-mono active:scale-75 transition-all"
                  title="Subtract 1 Lap"
                >
                  -
                </button>
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
                <span 
                  onClick={() => onOpenTimerModal?.(skill, dateToYMD(date))}
                  className="text-[10px] font-mono text-cyan-300 hover:text-white font-bold uppercase tracking-wider cursor-pointer"
                >
                  {laps.length > 0 ? `${laps.length} ${laps.length === 1 ? 'Lap' : 'Laps'}` : (isRunning ? 'Running' : '0 Laps')}
                </span>
                <button
                  type="button"
                  onClick={() => handleDirectLapCount(laps.length + 1)}
                  className="w-4 h-4 rounded-full text-cyan-300 hover:text-white flex items-center justify-center text-[11px] font-mono active:scale-75 transition-all"
                  title="Direct +1 Lap"
                >
                  +
                </button>
              </div>
            </div>

            {/* Symmetrical Tactical Controls: Start/Stop, + Lap, Reset */}
            <div className="grid grid-cols-3 gap-1.5 w-full shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleStartStop}
                className={`py-2 px-2 rounded-xl font-mono font-black text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md backdrop-blur-md ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black border border-amber-400 shadow-amber-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-500/30'
                }`}
              >
                {isRunning ? <Pause size={12} className="fill-black" /> : <Play size={12} className="fill-white" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddLap}
                className="py-2 px-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md backdrop-blur-md"
                title="Log lap (or increment manual lap if stopped)"
              >
                <Flag size={12} />
                <span>+ Lap</span>
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                className="py-2 px-2 rounded-xl bg-black/60 hover:bg-zinc-850 border border-white/15 hover:border-red-500/40 text-zinc-300 hover:text-red-400 font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 backdrop-blur-md"
                title="Reset timer to 0"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </>
        )}

        {skill.mode === 'counter' && (
          <>
            <div className="flex-1 flex flex-col items-center justify-center w-full min-w-0 z-10 py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCounterOpen(true);
                }}
                className={`text-4xl sm:text-5xl font-mono font-black tracking-tight transition-all tabular-nums leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 ${
                  isCompleted ? theme.giantNumber : 'text-zinc-100 group-hover:text-white'
                }`}
              >
                {log.count}
              </button>
              {skill.unit && (
                <span className="text-[10px] font-mono font-semibold tracking-widest uppercase text-zinc-400 mt-1 truncate">
                  {skill.unit}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between w-full shrink-0 z-10 gap-2" onClick={(e) => e.stopPropagation()}>
               <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (log.count > 0) onUpdateLog(skill.id, dateToYMD(date), { count: log.count - 1 }); 
                    triggerHaptic('light'); 
                  }}
                  aria-label={`Decrease ${skill.name}`}
                  className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border backdrop-blur-md shadow-sm ${
                    isCompleted 
                      ? 'bg-black/70 text-white/90 border-white/25 hover:bg-black/90 hover:text-white' 
                      : 'bg-black/50 text-zinc-300 border-white/15 hover:text-white hover:bg-black/80'
                  }`}
               >
                  <Minus size={16} strokeWidth={2.8} />
               </button>

               <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onUpdateLog(skill.id, dateToYMD(date), { count: log.count + 1 }); 
                    playTick(); 
                    triggerHaptic('medium');
                  }}
                  aria-label={`Increase ${skill.name}`}
                  className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border shadow-md backdrop-blur-md ${
                    isCompleted 
                      ? 'bg-white text-black border-white hover:bg-zinc-200' 
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  }`}
               >
                  <Plus size={16} strokeWidth={2.8} />
               </button>
            </div>
          </>
        )}

        {skill.mode === 'measurement' && (
          <>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsWeightScrollerOpen(true);
                triggerHaptic('light');
              }}
              className="flex-1 flex flex-col items-center justify-center w-full min-w-0 z-10 py-1 relative cursor-pointer group/measure"
              title="Click to open Weight Ruler Scroller"
            >
              {/* Trend line sparkline */}
              {sparklinePoints && (
                <div className="absolute inset-x-2 bottom-0 h-6 flex items-center justify-center pointer-events-none opacity-40 group-hover/measure:opacity-75 transition-opacity">
                  <svg viewBox="0 0 110 24" className="w-full h-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke={theme.accentColorHex || '#10b981'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparklinePoints}
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-center justify-center gap-1 z-10">
                <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight transition-all tabular-nums text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover/measure:text-cyan-300">
                  {measurementVal.toFixed(1)}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  {skill.unit || 'kg'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 z-10">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  <Scale size={11} className="text-cyan-400" />
                  <span>Tap Ruler Scroller</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full shrink-0 z-10 gap-2" onClick={(e) => e.stopPropagation()}>
               <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const current = measurementVal;
                    const next = Math.max(0, parseFloat((current - (skill.unit === 'kg' || skill.unit === 'lbs' ? 0.5 : 1)).toFixed(2)));
                    onUpdateLog(skill.id, dateToYMD(date), { value: next, count: next > 0 ? 1 : 0, checked: next > 0 });
                    triggerHaptic('light'); 
                  }}
                  aria-label={`Decrease ${skill.name}`}
                  className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border backdrop-blur-md shadow-sm ${
                    isCompleted 
                      ? 'bg-black/70 text-white/90 border-white/25 hover:bg-black/90 hover:text-white' 
                      : 'bg-black/50 text-zinc-300 border-white/15 hover:text-white hover:bg-black/80'
                  }`}
               >
                  <Minus size={16} strokeWidth={2.8} />
               </button>

               <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWeightScrollerOpen(true);
                    triggerHaptic('light');
                  }}
                  className="px-2.5 h-9 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 backdrop-blur-md"
                  title="Open Weight Ruler Wheel"
               >
                  <Scale size={13} />
                  <span>Ruler</span>
               </button>

               <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const current = measurementVal;
                    const next = parseFloat((current + (skill.unit === 'kg' || skill.unit === 'lbs' ? 0.5 : 1)).toFixed(2));
                    onUpdateLog(skill.id, dateToYMD(date), { value: next, count: 1, checked: true }); 
                    playTick(); 
                    triggerHaptic('medium');
                  }}
                  aria-label={`Increase ${skill.name}`}
                  className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border shadow-md backdrop-blur-md ${
                    isCompleted 
                      ? 'bg-white text-black border-white hover:bg-zinc-200' 
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  }`}
               >
                  <Plus size={16} strokeWidth={2.8} />
               </button>
            </div>
          </>
        )}

        {skill.mode === 'checkbox' && (
          <div className="flex-1 flex items-center justify-center my-auto z-10 py-2">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md shadow-xl ${
              isCompleted 
                ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-105' 
                : 'bg-black/40 border-white/20 group-hover:bg-white/10 group-hover:border-white/40 group-hover:scale-105'
            }`}>
              {isCompleted ? (
                <Check size={28} strokeWidth={3.5} className="text-black" />
              ) : (
                <Check size={28} strokeWidth={3} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Counter Roller Modal */}
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

      {/* Weight Ruler Scroller Modal */}
      <AnimatePresence>
        {isWeightScrollerOpen && (
          <WeightRulerScroller
            value={measurementVal}
            unit={skill.unit || 'kg'}
            title={`${skill.name} Weight Scroller`}
            onChange={(val) => {
              onUpdateLog(skill.id, dateToYMD(date), {
                value: val,
                count: val > 0 ? 1 : 0,
                checked: val > 0
              });
            }}
            onClose={() => setIsWeightScrollerOpen(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// --- EXTENDED BENTO ROW IN LIST VIEW TO DIRECTLY START / STOP LOG ---
// =========================================================================
const BigSkillListItem: React.FC<{
  skill: Skill;
  log: SkillLog;
  date: Date;
  onUpdateLog: any;
  theme: any;
  streak?: number;
  onOpenIconStudio?: (skillId: string) => void;
  onOpenTimerModal?: (skill: Skill, dateStr: string) => void;
}> = ({ skill, log, date, onUpdateLog, theme, streak = 0, onOpenIconStudio, onOpenTimerModal }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [isWeightScrollerOpen, setIsWeightScrollerOpen] = useState(false);
  
  // Live Timer State for List View Integrated Stopwatch Toolbar
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(log.timerDuration || 0);
  const [laps, setLaps] = useState<TimerLap[]>(log.timerLaps || []);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(log.timerDuration || 0);
  const intervalRef = useRef<any>(null);

  const Icon = getSkillIcon(skill);

  useEffect(() => {
    if (!isRunning) {
      const dur = log.timerDuration || 0;
      setElapsedMs(dur);
      accumulatedRef.current = dur;
      setLaps(log.timerLaps || []);
    }
  }, [log.timerDuration, log.timerLaps, isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStartStop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      const finalElapsed = accumulatedRef.current + (Date.now() - startTimeRef.current);
      accumulatedRef.current = finalElapsed;
      setElapsedMs(finalElapsed);
      setIsRunning(false);
      triggerHaptic('medium');
      playTick();
      onUpdateLog(skill.id, dateToYMD(date), {
        timerDuration: finalElapsed,
        timerLaps: laps,
        count: laps.length || (finalElapsed > 0 ? 1 : 0),
        checked: finalElapsed > 0,
        timestamp: Date.now()
      });
    } else {
      triggerHaptic('success');
      playTick();
      startTimeRef.current = Date.now();
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedMs(accumulatedRef.current + (Date.now() - startTimeRef.current));
      }, 40);
    }
  };

  const handleAddLap = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isRunning && elapsedMs === 0) return;
    triggerHaptic('light');
    playTick();
    
    const currentTotal = isRunning ? accumulatedRef.current + (Date.now() - startTimeRef.current) : elapsedMs;
    const prevLapsTotal = laps.reduce((acc, l) => acc + l.duration, 0);
    const lapDuration = Math.max(0, currentTotal - prevLapsTotal);
    
    const newLap: TimerLap = {
      lapNumber: laps.length + 1,
      duration: lapDuration,
      formatted: formatMsDuration(lapDuration),
      timestamp: Date.now()
    };
    
    const newLaps = [...laps, newLap];
    setLaps(newLaps);
    onUpdateLog(skill.id, dateToYMD(date), {
      timerDuration: currentTotal,
      timerLaps: newLaps,
      count: newLaps.length,
      checked: true,
      timestamp: Date.now()
    });
  };

  const handleResetTimer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic('warning');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setElapsedMs(0);
    accumulatedRef.current = 0;
    setLaps([]);
    onUpdateLog(skill.id, dateToYMD(date), {
      timerDuration: 0,
      timerLaps: [],
      count: 0,
      checked: false,
      timestamp: Date.now()
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const isCompleted = skill.mode === 'checkbox' 
    ? log.checked 
    : (skill.mode === 'timer' 
        ? (Boolean(log.timerDuration) || Boolean(log.timerLaps?.length)) 
        : (skill.mode === 'measurement' 
            ? ((log.value !== undefined && log.value > 0) || log.count > 0) 
            : log.count > 0));

  const handleToggle = () => {
    if (skill.mode === 'checkbox') {
      triggerHaptic('success');
      if (!log.checked) playTick();
      onUpdateLog(skill.id, dateToYMD(date), { checked: !log.checked });
    } else if (skill.mode === 'timer') {
      handleStartStop();
    } else if (skill.mode === 'measurement') {
      // measurement mode
    } else {
      setIsCounterOpen(true);
    }
  };

  const iconCustomClass = skill.iconColor 
    ? skill.iconColor 
    : (isCompleted ? 'text-white' : theme.iconColor);

  const displayShortForm = skill.shortForm || skill.name.slice(0, 3).toUpperCase();
  const skillImage = getSkillImage(skill);

  // ----------------------------------------------------
  // EXTENDED BENTO ROW FOR TIMER SKILLS
  // ----------------------------------------------------
  if (skill.mode === 'timer') {
    const isTimerActiveOrLogged = elapsedMs > 0 || laps.length > 0;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl border transition-all cursor-default select-none group gap-3.5 overflow-hidden backdrop-blur-2xl ${
          isTimerActiveOrLogged
            ? `${theme.bgActive}`
            : `bg-gradient-to-r ${theme.bgGradient} ${theme.cardBorder} hover:border-white/30`
        } ${isDragging ? 'scale-[1.02] opacity-90 shadow-2xl ring-2 ring-white/40 z-50' : 'hover:-translate-y-0.5 shadow-md'}`}
      >
        {/* Subtle Ambient Background Image Strip */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            src={skillImage} 
            alt={skill.name} 
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-all duration-500 scale-100 group-hover:scale-105 filter saturate-150" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/90" />
        </div>

        {/* Large Background Transparent Symbol Watermark */}
        <div className="absolute right-40 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-white select-none z-0">
          <Icon size={90} strokeWidth={1.2} />
        </div>

        {/* Top delicate specular highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-10" />

        {/* Left Side: ONLY NAME */}
        <div className="flex items-center min-w-0 flex-1 z-10">
          <h3 className={`text-base sm:text-[17px] font-bold tracking-tight truncate drop-shadow-sm ${isTimerActiveOrLogged ? 'text-white' : 'text-zinc-100'}`}>
            {skill.name}
          </h3>
        </div>

        {/* Right Side: Direct Timer Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 z-10" onClick={(e) => e.stopPropagation()}>
          {/* Big Live Digital Clock Display */}
          <div 
            onClick={() => onOpenTimerModal?.(skill, dateToYMD(date))}
            className={`px-3.5 py-2 rounded-xl border bg-black/80 font-mono font-black text-sm sm:text-base tabular-nums flex items-center gap-2 shadow-inner cursor-pointer hover:border-cyan-400/40 transition-colors ${
            isRunning 
              ? 'text-emerald-300 border-emerald-500/40 shadow-emerald-500/20' 
              : (elapsedMs > 0 ? 'text-cyan-300 border-cyan-500/30' : 'text-zinc-400 border-white/10')
          }`} title="Click to open Lap Manager">
            <Clock size={14} className={isRunning ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'} />
            <span>{elapsedMs > 0 ? formatMsDuration(elapsedMs) : '00:00.0'}</span>
            {laps.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {laps.length}L
              </span>
            )}
          </div>

          {/* 1-Tap Start / Stop Button */}
          <button
            type="button"
            onClick={handleStartStop}
            className={`px-4 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-black border border-amber-400 shadow-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause size={13} className="fill-black" /> : <Play size={13} className="fill-white" />}
            <span>{isRunning ? 'Stop' : 'Start'}</span>
          </button>

          {/* + Lap Button */}
          <button
            type="button"
            disabled={!isRunning && elapsedMs === 0}
            onClick={handleAddLap}
            className="px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Flag size={12} />
            <span className="hidden sm:inline">Lap</span>
          </button>

          {/* Open Full Lap Manager Modal */}
          <button
            type="button"
            onClick={() => onOpenTimerModal?.(skill, dateToYMD(date))}
            title="Open Full Lap Manager (CRUD)"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/40 text-zinc-300 hover:text-cyan-300 transition-all active:scale-95"
          >
            <Maximize2 size={13} />
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetTimer}
            title="Reset timer to 0"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-all active:scale-95"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // EXTENDED BENTO ROW FOR COUNTER & CHECKBOX SKILLS
  // ----------------------------------------------------
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleToggle}
        className={`relative flex items-center justify-between p-4 rounded-3xl border transition-all cursor-pointer select-none group overflow-hidden backdrop-blur-2xl ${
          isCompleted
            ? `${theme.bgActive}`
            : `bg-gradient-to-r ${theme.bgGradient} ${theme.cardBorder} hover:border-white/30`
        } ${isDragging ? 'scale-[1.02] opacity-90 shadow-2xl ring-2 ring-white/40 z-50' : 'hover:-translate-y-0.5 shadow-md'}`}
      >
        {/* Subtle Ambient Background Image Strip */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img 
            src={skillImage} 
            alt={skill.name} 
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-all duration-500 scale-100 group-hover:scale-105 filter saturate-150" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/90" />
        </div>

        {/* Large Background Transparent Symbol Watermark */}
        <div className="absolute right-36 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-white select-none z-0">
          <Icon size={90} strokeWidth={1.2} />
        </div>

        {/* Top delicate specular line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-10" />

        {/* Left Side: ONLY NAME */}
        <div className="flex items-center min-w-0 flex-1 mr-3 z-10">
          <h3 className={`text-base sm:text-[17px] font-bold tracking-tight truncate drop-shadow-sm ${isCompleted ? 'text-white' : 'text-zinc-100'}`}>
            {skill.name}
          </h3>
        </div>

        {/* Right Side: Interactive Stepper / Checkbox Action */}
        <div className="flex items-center gap-2.5 shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
          {skill.mode === 'counter' ? (
            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  if (log.count > 0) onUpdateLog(skill.id, dateToYMD(date), { count: log.count - 1 });
                  triggerHaptic('light');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90"
              >
                <Minus size={15} strokeWidth={2.6} />
              </button>

              <button
                type="button"
                onClick={() => setIsCounterOpen(true)}
                className={`min-w-[40px] text-center font-mono font-black text-base sm:text-lg tabular-nums ${isCompleted ? theme.textMain : 'text-zinc-100'}`}
              >
                {log.count}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateLog(skill.id, dateToYMD(date), { count: log.count + 1 });
                  playTick();
                  triggerHaptic('medium');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white bg-white/15 hover:bg-white/25 transition-all active:scale-90"
              >
                <Plus size={15} strokeWidth={2.6} />
              </button>
            </div>
          ) : skill.mode === 'measurement' ? (
            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  const current = log.value !== undefined ? log.value : (log.count > 0 ? log.count : 0);
                  const next = Math.max(0, parseFloat((current - (skill.unit === 'kg' || skill.unit === 'lbs' ? 0.5 : 1)).toFixed(2)));
                  onUpdateLog(skill.id, dateToYMD(date), { value: next, count: next > 0 ? 1 : 0, checked: next > 0 });
                  triggerHaptic('light');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90"
              >
                <Minus size={15} strokeWidth={2.6} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWeightScrollerOpen(true);
                  triggerHaptic('light');
                }}
                className="px-2 font-mono font-black text-base sm:text-lg tabular-nums text-white hover:text-cyan-300 transition-colors cursor-pointer"
                title="Open Weight Ruler Scroller"
              >
                {(log.value !== undefined ? log.value : (log.count > 0 ? log.count : 0)).toFixed(1)}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWeightScrollerOpen(true);
                  triggerHaptic('light');
                }}
                className="p-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 active:scale-90 transition-all"
                title="Open Ruler Scroller"
              >
                <Scale size={13} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const current = log.value !== undefined ? log.value : (log.count > 0 ? log.count : 0);
                  const next = parseFloat((current + (skill.unit === 'kg' || skill.unit === 'lbs' ? 0.5 : 1)).toFixed(2));
                  onUpdateLog(skill.id, dateToYMD(date), { value: next, count: 1, checked: true });
                  playTick();
                  triggerHaptic('medium');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white bg-white/15 hover:bg-white/25 transition-all active:scale-90"
              >
                <Plus size={15} strokeWidth={2.6} />
              </button>
            </div>
          ) : skill.mode === 'timer' ? (
            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => {
                  const currentLaps = log.timerLaps || [];
                  const newCount = Math.max(0, currentLaps.length - 1);
                  const newLaps = currentLaps.slice(0, newCount);
                  const totalDur = newLaps.reduce((acc, l) => acc + l.duration, 0);
                  onUpdateLog(skill.id, dateToYMD(date), {
                    timerLaps: newLaps,
                    timerDuration: totalDur,
                    count: newCount,
                    checked: newCount > 0,
                    timestamp: Date.now()
                  });
                  triggerHaptic('light');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90"
                title="Decrease 1 Lap"
              >
                <Minus size={15} strokeWidth={2.6} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenTimerModal?.(skill, dateToYMD(date));
                  triggerHaptic('light');
                }}
                className="min-w-[36px] px-1 text-center font-mono font-black text-sm sm:text-base tabular-nums flex items-center justify-center gap-0.5 text-cyan-300 hover:text-cyan-200 cursor-pointer"
                title="Open Lap Manager"
              >
                <span>{log.timerLaps?.length || (log.timerDuration ? 1 : 0)}</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">L</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenTimerModal?.(skill, dateToYMD(date));
                  triggerHaptic('light');
                }}
                className="p-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 active:scale-90 transition-all"
                title="Open Stopwatch / Lap Timer"
              >
                <Clock size={13} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentLaps = log.timerLaps || [];
                  const newNum = currentLaps.length + 1;
                  const newLap: TimerLap = {
                    lapNumber: newNum,
                    duration: 60000,
                    formatted: formatMsDuration(60000),
                    timestamp: Date.now(),
                    note: `Lap ${newNum}`
                  };
                  const newLaps = [...currentLaps, newLap];
                  const totalDur = newLaps.reduce((acc, l) => acc + l.duration, 0);
                  onUpdateLog(skill.id, dateToYMD(date), {
                    timerLaps: newLaps,
                    timerDuration: totalDur,
                    count: newLaps.length,
                    checked: true,
                    timestamp: Date.now()
                  });
                  playTick();
                  triggerHaptic('medium');
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/40 transition-all active:scale-90"
                title="Direct +1 Lap"
              >
                <Plus size={15} strokeWidth={2.6} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggle}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${
                isCompleted
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-zinc-900 text-zinc-500 border-white/15 hover:border-white/30 hover:text-white'
              }`}
            >
              <Check size={20} strokeWidth={3.5} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
            </button>
          )}
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

      {/* Weight Ruler Scroller Modal */}
      <AnimatePresence>
        {isWeightScrollerOpen && (
          <WeightRulerScroller
            value={log.value !== undefined ? log.value : (log.count > 0 ? log.count : 0)}
            unit={skill.unit || 'kg'}
            title={`${skill.name} Weight Scroller`}
            onChange={(val) => {
              onUpdateLog(skill.id, dateToYMD(date), {
                value: val,
                count: val > 0 ? 1 : 0,
                checked: val > 0
              });
            }}
            onClose={() => setIsWeightScrollerOpen(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default function DailyDashboardView({ 
  skills, 
  logs, 
  categoryColors, 
  onUpdateLog, 
  onReorderSkills, 
  onUpdateSkill,
  searchQuery = '',
  onOpenTimerModal,
  selectedDate,
  onSelectDate
}: DailyDashboardViewProps) {
  const [currentDate, setCurrentDate] = useState<string>(() => selectedDate || dateToYMD(new Date()));
  
  useEffect(() => {
    if (selectedDate && selectedDate !== currentDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [swipeDirection, setSwipeDirection] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [isQuickLogSheetOpen, setIsQuickLogSheetOpen] = useState(false);
  const [isTimelapseOpen, setIsTimelapseOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIconStudioOpen, setIsIconStudioOpen] = useState(false);
  const [iconStudioSkillId, setIconStudioSkillId] = useState<string | undefined>(undefined);

  const categoryTabContainerRef = useRef<HTMLDivElement>(null);
  const categoryBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleOpenIconStudio = (skillId?: string) => {
    setIconStudioSkillId(skillId);
    setIsIconStudioOpen(true);
  };

  // Filter skills by search query first
  const searchedSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    const q = searchQuery.toLowerCase().trim();
    return skills.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.shortForm && s.shortForm.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q)
    );
  }, [skills, searchQuery]);

  const allCategories = useMemo(() => Array.from(new Set(skills.map(s => s.category))), [skills]);
  const activeCategories = activeCategory === 'All' ? allCategories : allCategories.filter(c => c === activeCategory);

  // Auto-scroll the active category button into view in the tabs bar
  useEffect(() => {
    const btn = categoryBtnRefs.current[activeCategory];
    if (btn && categoryTabContainerRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  // --- Calculate individual skill streaks ---
  const skillStreaks = useMemo(() => {
    const streaks: Record<string, number> = {};
    const today = new Date();
    const todayStr = dateToYMD(today);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = dateToYMD(yesterday);

    const skillDatesMap = new Map<string, Set<string>>();
    logs.forEach(l => {
      if (l.checked || l.count > 0) {
        if (!skillDatesMap.has(l.skillId)) {
          skillDatesMap.set(l.skillId, new Set());
        }
        skillDatesMap.get(l.skillId)!.add(l.date);
      }
    });

    skills.forEach(skill => {
      const dates = skillDatesMap.get(skill.id);
      if (!dates || dates.size === 0) {
        streaks[skill.id] = 0;
        return;
      }

      let streak = 0;
      let checkDate = new Date(today);

      if (!dates.has(todayStr)) {
        if (dates.has(yesterdayStr)) {
          checkDate = new Date(yesterday);
        } else {
          streaks[skill.id] = 0;
          return;
        }
      }

      while (dates.has(dateToYMD(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      streaks[skill.id] = streak;
    });

    return streaks;
  }, [skills, logs]);

  // --- Calculate overall stats ---
  const globalAnalytics = useMemo(() => {
    let totalCompletions = 0;
    const activeDateSet = new Set<string>();

    logs.forEach(l => {
      if (l.count > 0 || l.checked) {
        totalCompletions += (l.count > 0 ? l.count : 1);
        activeDateSet.add(l.date);
      }
    });

    let streak = 0;
    const now = new Date();
    const todayStr = dateToYMD(now);
    
    let checkDate = new Date(now);
    if (!activeDateSet.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (activeDateSet.has(dateToYMD(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { totalCompletions, globalStreak: streak, activeDaysCount: activeDateSet.size };
  }, [logs]);

  const formattedDate = () => new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const isActuallyToday = () => {
    const today = new Date();
    const cd = new Date(currentDate + 'T12:00:00'); 
    return cd.getDate() === today.getDate() && cd.getMonth() === today.getMonth() && cd.getFullYear() === today.getFullYear();
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

  const changeDate = (days: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev + 'T12:00:00');
      d.setDate(d.getDate() + days);
      return dateToYMD(d);
    });
  };

  const handleResetDay = () => {
    skills.forEach(skill => {
      const currentLog = getLog(logs, skill.id, currentDate);
      if (currentLog.checked || currentLog.count > 0) {
        onUpdateLog(skill.id, currentDate, { count: 0, checked: false });
      }
    });
    triggerHaptic('success');
    setShowResetConfirm(false);
  };

  // --- Category Navigation Helpers ---
  const categoryList = useMemo(() => ['All', ...allCategories], [allCategories]);

  const goToNextCategory = () => {
    const currentIndex = categoryList.indexOf(activeCategory);
    const nextIndex = (currentIndex + 1) % categoryList.length;
    setSwipeDirection(1);
    setActiveCategory(categoryList[nextIndex]);
    triggerHaptic('light');
  };

  const goToPrevCategory = () => {
    const currentIndex = categoryList.indexOf(activeCategory);
    const prevIndex = (currentIndex - 1 + categoryList.length) % categoryList.length;
    setSwipeDirection(-1);
    setActiveCategory(categoryList[prevIndex]);
    triggerHaptic('light');
  };

  const selectCategory = (cat: string) => {
    const currentIndex = categoryList.indexOf(activeCategory);
    const newIndex = categoryList.indexOf(cat);
    setSwipeDirection(newIndex >= currentIndex ? 1 : -1);
    setActiveCategory(cat);
    triggerHaptic('light');
  };

  // --- Reliable Touch Swipe Detection ---
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartRef.current.x;
    const deltaY = endY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    // Must be a horizontal swipe: deltaX > 45px, horizontal movement at least 1.3x vertical, duration < 500ms
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && duration < 500) {
      if (deltaX < 0) {
        goToNextCategory();
      } else {
        goToPrevCategory();
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 lg:p-10 w-full h-full overflow-y-auto relative bg-[var(--app-bg,#0B0B0D)] pb-28 md:pb-12 hide-scrollbar transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex flex-col gap-5 sm:gap-6">
        
        {/* Sleek Minimal Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-white/10">
           <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white">Daily Logs</h1>
                <p className="text-zinc-400 text-xs sm:text-sm font-medium">Daily habit tracking & matrix</p>
              </div>

              {/* View Mode Toggle for Mobile */}
              <div className="flex sm:hidden items-center bg-zinc-900/90 border border-white/15 rounded-2xl p-1 shadow-inner">
                <button
                  type="button"
                  title="Bento Cards View"
                  onClick={() => { setViewMode('cards'); triggerHaptic('light'); }}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'cards' 
                      ? 'bg-white text-black shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  title="List View"
                  onClick={() => { setViewMode('list'); triggerHaptic('light'); }}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-black shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <List size={15} />
                </button>
              </div>
           </div>
           
           <div className="flex items-center gap-3 self-end sm:self-auto">
             {/* View Mode Toggle (Desktop) */}
             <div className="hidden sm:flex items-center bg-zinc-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-inner h-[84px]">
               <button
                 type="button"
                 title="Bento Cards View"
                 onClick={() => { setViewMode('cards'); triggerHaptic('light'); }}
                 className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all font-mono text-xs font-bold h-full ${
                   viewMode === 'cards' 
                     ? 'bg-white text-black shadow-md' 
                     : 'text-zinc-400 hover:text-white'
                 }`}
               >
                 <LayoutGrid size={16} />
                 <span>Cards</span>
               </button>
               <button
                 type="button"
                 title="List View"
                 onClick={() => { setViewMode('list'); triggerHaptic('light'); }}
                 className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all font-mono text-xs font-bold h-full ${
                   viewMode === 'list' 
                     ? 'bg-white text-black shadow-md' 
                     : 'text-zinc-400 hover:text-white'
                 }`}
               >
                 <List size={16} />
                 <span>List</span>
               </button>
             </div>

             {/* ========================================================= */}
             {/* GLASS BENTO BOX: Action Controls Cluster */}
             {/* ========================================================= */}
             <div className="bg-zinc-900/70 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl shadow-black/80 flex items-center gap-1.5 sm:gap-2">
               
               {/* Left Column in Bento: Instant Log (Top) & Time-Lapse (Bottom) */}
               <div className="flex flex-col gap-1.5 sm:gap-2">
                 {/* Instant 3D Sphere Log Trigger */}
                 <button
                    type="button"
                    title="Instant 3D Log Sphere"
                    aria-label="Open Instant 3D Log Sphere"
                    onClick={() => { setIsQuickLogSheetOpen(true); triggerHaptic('medium'); }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-950/90 to-blue-950/90 hover:from-cyan-900 hover:to-blue-900 active:scale-90 border border-cyan-500/40 hover:border-cyan-400/80 text-cyan-300 hover:text-white flex items-center justify-center transition-all shadow-md shadow-cyan-950/50 group"
                 >
                    <Globe size={18} className="text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
                 </button>

                 {/* Time-Lapse Evolution Replay Trigger */}
                 <button
                    type="button"
                    title="Time-Lapse Evolution Replay"
                    aria-label="Open Time-Lapse Evolution Replay"
                    onClick={() => { setIsTimelapseOpen(true); triggerHaptic('medium'); }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-950/90 to-indigo-950/90 hover:from-purple-900 hover:to-indigo-900 active:scale-90 border border-purple-500/40 hover:border-purple-400/80 text-purple-300 hover:text-white flex items-center justify-center transition-all shadow-md shadow-purple-950/50 group"
                 >
                    <FastForward size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                 </button>
               </div>

               {/* Right Column in Bento: + Up & Reset Down */}
               <div className="flex flex-col gap-1.5 sm:gap-2">
                 {/* Quick Log Sheet Trigger (+ Up) */}
                 <button
                    type="button"
                    title="Quick Log Sheet"
                    aria-label="Open Quick Log Sheet"
                    onClick={() => setIsQuickLogSheetOpen(true)}
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white hover:bg-zinc-200 border border-white rounded-xl sm:rounded-2xl text-black transition-all hover:scale-105 active:scale-90 shadow-lg shadow-white/20"
                 >
                    <Plus size={20} strokeWidth={3} />
                 </button>

                 {/* Minimal Reset Day Button (Reset Down) */}
                 <button
                    type="button"
                    title="Reset Day Logs to Zero"
                    aria-label="Reset Day Logs to Zero"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-zinc-800/90 hover:bg-zinc-750 active:bg-zinc-700 border border-white/15 hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
                 >
                    <RotateCcw size={17} />
                 </button>
               </div>

             </div>
           </div>
        </header>

        {/* Date Selector & Swipeable Category Navigation */}
        <div className="flex flex-col gap-3.5 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/15 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-white/15 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    <span className="text-xs font-mono font-black text-cyan-300 tracking-wider">
                      {new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-mono font-black text-base sm:text-lg tracking-tight">{formattedDate()}</span>
                    <span className="text-zinc-400 text-[10px] font-mono tracking-wider uppercase">{isActuallyToday() ? 'Today' : 'Selected Date'}</span>
                  </div>
                </div>
                {!isActuallyToday() && (
                  <button 
                    type="button"
                    aria-label="Go to Today"
                    onClick={setToday} 
                    className="px-3.5 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all border border-cyan-500/30 active:scale-95 shadow-sm"
                  >
                    Go to Today
                  </button>
                )}
            </div>
            
            {/* Week Date Strip */}
            <div className="flex items-center justify-between gap-1.5">
                <button 
                  type="button"
                  onClick={() => changeDate(-7)} 
                  aria-label="Previous week"
                  className="w-9 h-12 sm:w-10 sm:h-14 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900/90 rounded-2xl transition-all shrink-0 border border-white/10 hover:border-white/20 active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={16}/>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar w-full justify-between sm:justify-center px-1 py-1">
                  {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
                      const d = new Date(currentDate + 'T12:00:00');
                      d.setDate(d.getDate() + offset);
                      const dStr = dateToYMD(d);
                      const isSelected = offset === 0;
                      const todayStr = dateToYMD(new Date());
                      const isThisDayToday = dStr === todayStr;
                      const hasLogsForDate = logs.some(l => l.date === dStr && (l.checked || l.count > 0));

                      return (
                        <button 
                            key={dStr}
                            type="button"
                            onClick={() => setCurrentDate(dStr)}
                            className={`flex flex-col items-center justify-center w-11 h-13 sm:w-13 sm:h-15 rounded-2xl border transition-all shrink-0 active:scale-95 relative ${
                              isSelected 
                                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50' 
                                : isThisDayToday
                                    ? 'bg-zinc-850 border-white/30 text-white shadow-sm'
                                    : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                            }`}
                        >
                            <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-wider opacity-80">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-sm sm:text-base font-mono font-black mt-0.5 tabular-nums">{d.getDate()}</span>
                            {hasLogsForDate && (
                              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,1)]" />
                            )}
                        </button>
                      );
                  })}
                </div>

                <button 
                  type="button"
                  onClick={() => changeDate(7)} 
                  aria-label="Next week"
                  className="w-9 h-12 sm:w-10 sm:h-14 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900/90 rounded-2xl transition-all shrink-0 border border-white/10 hover:border-white/20 active:scale-95 shadow-sm"
                >
                  <ChevronRight size={16}/>
                </button>
            </div>

            {/* Horizontally Scrollable & Clickable Category Tabs Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
              <div 
                ref={categoryTabContainerRef}
                className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full py-1 snap-x snap-mandatory touch-pan-x"
              >
                  <button
                    type="button"
                    ref={(el) => { categoryBtnRefs.current['All'] = el; }}
                    onClick={() => selectCategory('All')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap snap-start border shrink-0 active:scale-95 ${
                      activeCategory === 'All' 
                        ? 'bg-white text-black border-white shadow-md' 
                        : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    All Categories ({skills.length})
                  </button>
                  {allCategories.map(cat => {
                    const catTheme = getCategoryTheme(cat, categoryColors);
                    const isCatActive = activeCategory === cat;
                    const count = skills.filter(s => s.category === cat).length;
                    return (
                      <button
                        key={cat}
                        ref={(el) => { categoryBtnRefs.current[cat] = el; }}
                        onClick={() => selectCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap snap-start border shrink-0 active:scale-95 flex items-center gap-1.5 ${
                          isCatActive 
                            ? catTheme.tabActive 
                            : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-[10px] opacity-75 font-normal">({count})</span>
                      </button>
                    );
                  })}
              </div>

              {/* Quick Category Chevron Steppers for fast category cycling */}
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="Previous Category"
                  onClick={goToPrevCategory}
                  className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  title="Next Category"
                  onClick={goToNextCategory}
                  className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
        </div>

        {/* Category Swipe Hint */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-zinc-500">
           <span className="flex items-center gap-1.5">
             <Layers size={13} className="text-zinc-400" />
             Showing: <strong className="text-white">{activeCategory === 'All' ? 'All Skills' : activeCategory}</strong>
           </span>
           <span className="hidden sm:inline text-zinc-500">
             Swipe left/right to switch category
           </span>
        </div>

        {/* Skills View Area with Seamless Directional Transition */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex flex-col gap-6 min-h-[300px]"
        >
          {searchedSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-950 border border-zinc-800 rounded-3xl border-dashed text-center">
              <p className="text-zinc-400 text-sm font-medium">No skills found matching your criteria.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + '_' + viewMode}
                initial={{ opacity: 0, x: swipeDirection * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -swipeDirection * 20 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex flex-col gap-6"
              >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  {activeCategories.map(cat => {
                    const catSkills = searchedSkills.filter(s => s.category === cat);
                    const catTheme = getCategoryTheme(cat, categoryColors);
                    if (!catSkills.length) return null;

                    return (
                      <div key={cat} className="flex flex-col gap-3">
                        {/* Category Header with Pill */}
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${catTheme.badgeBg}`} />
                            <span className={`text-xs sm:text-sm font-mono font-black uppercase tracking-wider ${catTheme.textCategory}`}>
                              {cat}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {catSkills.length} {catSkills.length === 1 ? 'skill' : 'skills'}
                          </span>
                        </div>

                        {viewMode === 'cards' ? (
                          <SortableContext items={catSkills.map(s => s.id)} strategy={rectSortingStrategy}>
                            {/* High-impact responsive grid: 2 cols on mobile, 3 on tablet, 4-5 on desktop for big, clear text */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                              {catSkills.map(skill => (
                                <BigBentoCard 
                                  key={skill.id} 
                                  skill={skill} 
                                  log={getLog(logs, skill.id, currentDate)} 
                                  date={new Date(currentDate + 'T12:00:00')} 
                                  onUpdateLog={onUpdateLog} 
                                  theme={catTheme}
                                  streak={skillStreaks[skill.id] || 0}
                                  allLogs={logs}
                                  onOpenIconStudio={handleOpenIconStudio}
                                  onOpenTimerModal={onOpenTimerModal}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        ) : (
                          <SortableContext items={catSkills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-2">
                              {catSkills.map(skill => (
                                <BigSkillListItem
                                  key={skill.id} 
                                  skill={skill} 
                                  log={getLog(logs, skill.id, currentDate)} 
                                  date={new Date(currentDate + 'T12:00:00')} 
                                  onUpdateLog={onUpdateLog} 
                                  theme={catTheme}
                                  streak={skillStreaks[skill.id] || 0}
                                  allLogs={logs}
                                  onOpenIconStudio={handleOpenIconStudio}
                                  onOpenTimerModal={onOpenTimerModal}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        )}
                      </div>
                    );
                  })}
                </DndContext>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Sleek Minimal Reset Day Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                    <RotateCcw size={18} />
                  </div>
                  <h3 className="font-mono font-bold text-white text-base">Reset Day to Zero</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm font-mono leading-relaxed">
                Set all checks and counters back to 0 for <span className="text-white font-bold">{formattedDate()}</span>?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-white/15 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetDay}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Reset All to 0
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Log Sheet Modal */}
      <AnimatePresence>
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
        {isIconStudioOpen && onUpdateSkill && (
          <CardIconStudioModal
            isOpen={isIconStudioOpen}
            onClose={() => setIsIconStudioOpen(false)}
            skills={skills}
            initialSkillId={iconStudioSkillId}
            onUpdateSkill={onUpdateSkill}
            categoryColors={categoryColors}
          />
        )}
        {isTimelapseOpen && (
          <TimelapsePlayerModal
            isOpen={isTimelapseOpen}
            onClose={() => setIsTimelapseOpen(false)}
            skills={skills}
            logs={logs}
            categoryColors={categoryColors}
            initialDate={currentDate}
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
