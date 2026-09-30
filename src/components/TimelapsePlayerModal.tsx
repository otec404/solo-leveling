import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  FastForward, 
  Flame, 
  Calendar, 
  Check, 
  Sparkles, 
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { getSkillIcon, THEME_COLORS } from './icons';

interface TimelapsePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  initialDate?: string;
}

export default function TimelapsePlayerModal({
  isOpen,
  onClose,
  skills,
  logs,
  categoryColors,
  initialDate
}: TimelapsePlayerModalProps) {
  // Extract all distinct dates or build chronological range
  const allDates = useMemo(() => {
    const logDateSet = new Set<string>();
    logs.forEach(l => {
      if (l.date && /^\d{4}-\d{2}-\d{2}$/.test(l.date)) {
        logDateSet.add(l.date);
      }
    });

    // Default range if few logs: from 30 days before today to today
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    logDateSet.add(todayStr);

    const sorted = Array.from(logDateSet).sort();
    if (sorted.length < 2) {
      // Generate last 14 days
      const days: string[] = [];
      for (let i = 14; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      }
      return days;
    }

    // Fill gaps between min date and max date so timelapse plays continuously
    const minDate = new Date(sorted[0]);
    const maxDate = new Date(sorted[sorted.length - 1]);
    const continuous: string[] = [];
    const cur = new Date(minDate);

    while (cur <= maxDate) {
      const ymd = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
      continuous.push(ymd);
      cur.setDate(cur.getDate() + 1);
    }
    return continuous;
  }, [logs]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialDate) {
      const idx = allDates.indexOf(initialDate);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x, 10x
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(skills.map(s => s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter(s => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  const currentDateStr = allDates[currentIndex] || allDates[0] || '';

  // Calculate current date logs
  const currentDateLogsMap = useMemo(() => {
    const map = new Map<string, SkillLog>();
    logs.forEach(l => {
      if (l.date === currentDateStr) {
        map.set(l.skillId, l);
      }
    });
    return map;
  }, [logs, currentDateStr]);

  // Overall statistics for current frame
  const frameStats = useMemo(() => {
    let completedCount = 0;
    filteredSkills.forEach(s => {
      const l = currentDateLogsMap.get(s.id);
      if (!l) return;
      if (s.mode === 'counter' && l.count > 0) completedCount++;
      else if (s.mode === 'checkbox' && l.checked) completedCount++;
      else if (s.mode === 'timer' && (l.timerDuration || (l.timerLaps && l.timerLaps.length > 0))) completedCount++;
    });

    const total = filteredSkills.length;
    const rate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { completedCount, total, rate };
  }, [filteredSkills, currentDateLogsMap]);

  // Playback engine
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(80, Math.floor(400 / playbackSpeed));
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= allDates.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, allDates.length]);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (currentIndex >= allDates.length - 1 && !isPlaying) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(allDates.length - 1, prev + 1));
  };

  const formattedDateHeader = () => {
    if (!currentDateStr) return '';
    try {
      const parts = currentDateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return currentDateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950/95 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Time-Lapse Replay</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Watch your habits, consistency & progress evolve day-by-day</p>
            </div>
          </div>

          <button 
            onClick={() => { setIsPlaying(false); onClose(); }} 
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
          {/* Central Date HUD Display */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Calendar size={13} /> {currentDateStr}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {formattedDateHeader()}
              </h3>
              <span className="text-xs text-zinc-400 font-medium mt-1">
                Frame {currentIndex + 1} of {allDates.length} days
              </span>
            </div>

            {/* Score HUD */}
            <div className="flex items-center gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl px-5 py-3">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                  {frameStats.completedCount}/{frameStats.total}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Skills Done</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
                  {frameStats.rate}%
                </div>
                <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Completion</div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Habits Grid at Current Frame */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSkills.map(skill => {
              const log = currentDateLogsMap.get(skill.id);
              const Icon = getSkillIcon(skill);
              let isDone = false;
              let detailText = '';

              if (log) {
                if (skill.mode === 'counter' && log.count > 0) {
                  isDone = true;
                  detailText = `${log.count} ${skill.unit || ''}`.trim();
                } else if (skill.mode === 'checkbox' && log.checked) {
                  isDone = true;
                  detailText = 'Completed';
                } else if (skill.mode === 'timer' && (log.timerDuration || (log.timerLaps && log.timerLaps.length > 0))) {
                  isDone = true;
                  detailText = log.timerLaps?.length ? `${log.timerLaps.length} Laps` : 'Logged';
                }
              }

              const catColor = categoryColors[skill.category] || 'cyan';
              const colorHex = THEME_COLORS[catColor] || THEME_COLORS['cyan'];

              return (
                <div
                  key={skill.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between min-h-[96px] ${
                    isDone 
                      ? 'bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-black border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                      : 'bg-zinc-950/60 border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                      {skill.shortForm}
                    </span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isDone ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-white/5 text-zinc-500'
                    }`}>
                      {isDone ? <Check size={14} strokeWidth={3} /> : <Icon size={12} />}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className={`text-xs font-bold truncate ${isDone ? 'text-white' : 'text-zinc-400'}`}>
                      {skill.name}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold text-cyan-300">
                      {isDone ? detailText : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Time-Lapse Player Controls Bar */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-zinc-950/90 flex flex-col gap-4">
          {/* Progress Scrubber Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-zinc-500">
              {allDates[0]}
            </span>
            <input 
              type="range"
              min={0}
              max={allDates.length - 1}
              value={currentIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentIndex(Number(e.target.value));
              }}
              className="flex-1 accent-cyan-400 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono font-bold text-zinc-500">
              {allDates[allDates.length - 1]}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Playback Transport Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Restart Time-Lapse"
                className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={handleStepBack}
                title="Previous Day"
                className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handlePlayPause}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play Time-Lapse'}</span>
              </button>

              <button
                onClick={handleStepForward}
                title="Next Day"
                className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 rounded-xl p-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1">
                <FastForward size={12} /> Speed:
              </span>
              {[0.5, 1, 2, 5, 10].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
