import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Square, 
  Flag, 
  RotateCcw, 
  X, 
  Clock, 
  Check,
  Flame,
  Activity,
  Plus,
  Trash2,
  Edit3,
  Zap,
  Timer,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Maximize2,
  Minimize2,
  BarChart2,
  Sliders,
  Bell
} from 'lucide-react';
import { Skill, SkillLog, TimerLap } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface TimerSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  dateStr: string;
  existingLog?: SkillLog;
  onSaveTimerLog: (skillId: string, date: string, laps: TimerLap[], totalDuration: number) => void;
}

export const formatMsTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${tenths}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${tenths}`;
};

export default function TimerSkillModal({
  isOpen,
  onClose,
  skill,
  dateStr,
  existingLog,
  onSaveTimerLog
}: TimerSkillModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in ms
  const [laps, setLaps] = useState<TimerLap[]>([]);
  
  // Expansion Modes
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(false);

  // State for editing a specific lap (CRUD: Update)
  const [editingLapIndex, setEditingLapIndex] = useState<number | null>(null);
  const [editingMinutes, setEditingMinutes] = useState('0');
  const [editingSeconds, setEditingSeconds] = useState('0');
  const [editingTenths, setEditingTenths] = useState('0');
  const [editingNote, setEditingNote] = useState('');

  // State for manually adding a lap (CRUD: Create)
  const [isAddingManualLap, setIsAddingManualLap] = useState(false);
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualSeconds, setManualSeconds] = useState('');
  const [manualNote, setManualNote] = useState('');
  
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when modal opens or existingLog changes
  useEffect(() => {
    if (existingLog?.timerLaps && existingLog.timerLaps.length > 0) {
      setLaps(existingLog.timerLaps);
      setElapsedTime(existingLog.timerDuration || existingLog.timerLaps.reduce((acc, l) => acc + l.duration, 0));
    } else if (existingLog?.timerDuration) {
      setElapsedTime(existingLog.timerDuration);
      setLaps([]);
    } else {
      setLaps([]);
      setElapsedTime(0);
    }
    setIsRunning(false);
    setEditingLapIndex(null);
    setIsAddingManualLap(false);
  }, [existingLog, isOpen]);

  // Live Timer Interval
  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - elapsedTime;
      startTimeRef.current = start;
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - start);
      }, 35);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning]);

  // Telemetry Calculations
  const fastestLapDuration = useMemo(() => {
    if (laps.length === 0) return null;
    return Math.min(...laps.map(l => l.duration));
  }, [laps]);

  const slowestLapDuration = useMemo(() => {
    if (laps.length === 0) return null;
    return Math.max(...laps.map(l => l.duration));
  }, [laps]);

  const averageLapDuration = useMemo(() => {
    if (laps.length === 0) return null;
    const total = laps.reduce((acc, l) => acc + l.duration, 0);
    return Math.round(total / laps.length);
  }, [laps]);

  // Calculate cumulative lap times
  const cumulativeLaps = useMemo(() => {
    let runningTotal = 0;
    return laps.map((lap, index) => {
      runningTotal += lap.duration;
      return {
        ...lap,
        lapNumber: index + 1,
        cumulativeTotal: runningTotal,
        isFastest: laps.length > 1 && lap.duration === fastestLapDuration,
        isSlowest: laps.length > 1 && lap.duration === slowestLapDuration
      };
    });
  }, [laps, fastestLapDuration, slowestLapDuration]);

  if (!isOpen || !skill) return null;

  // ----------------------------------------------------
  // CRUD Actions: Stopwatch & Live Lap Capture
  // ----------------------------------------------------
  const handleStartPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      triggerHaptic('success');
    } else {
      setIsRunning(false);
      triggerHaptic('medium');
    }
  };

  const handleCaptureLiveLap = () => {
    if (!isRunning && elapsedTime === 0) return;
    triggerHaptic('light');

    const totalRecorded = laps.reduce((acc, l) => acc + l.duration, 0);
    const lapDuration = Math.max(0, elapsedTime - totalRecorded);
    const nextLapNum = laps.length + 1;

    const newLap: TimerLap = {
      lapNumber: nextLapNum,
      duration: lapDuration,
      formatted: formatMsTime(lapDuration),
      timestamp: Date.now(),
      note: ''
    };

    setLaps(prev => [...prev, newLap]);
  };

  // ----------------------------------------------------
  // CRUD Action: Create Manual Lap
  // ----------------------------------------------------
  const handleAddManualLap = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(manualMinutes || '0', 10);
    const secs = parseInt(manualSeconds || '0', 10);
    const durationMs = (mins * 60 + secs) * 1000;

    if (durationMs <= 0) return;

    const newLap: TimerLap = {
      lapNumber: laps.length + 1,
      duration: durationMs,
      formatted: formatMsTime(durationMs),
      timestamp: Date.now(),
      note: manualNote.trim() || undefined
    };

    const newLaps = [...laps, newLap];
    setLaps(newLaps);
    setElapsedTime(newLaps.reduce((acc, l) => acc + l.duration, 0));
    setManualMinutes('');
    setManualSeconds('');
    setManualNote('');
    setIsAddingManualLap(false);
    triggerHaptic('success');
  };

  // ----------------------------------------------------
  // CRUD Action: Update / Edit Existing Lap
  // ----------------------------------------------------
  const handleStartEditLap = (index: number) => {
    const target = laps[index];
    if (!target) return;
    const totalSecs = Math.floor(target.duration / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((target.duration % 1000) / 100);

    setEditingLapIndex(index);
    setEditingMinutes(String(mins));
    setEditingSeconds(String(secs));
    setEditingTenths(String(tenths));
    setEditingNote(target.note || '');
    triggerHaptic('light');
  };

  const handleSaveEditLap = () => {
    if (editingLapIndex === null) return;
    const mins = parseInt(editingMinutes || '0', 10);
    const secs = parseInt(editingSeconds || '0', 10);
    const tenths = parseInt(editingTenths || '0', 10);
    const durationMs = (mins * 60 + secs) * 1000 + tenths * 100;

    if (durationMs <= 0) return;

    const updatedLaps = laps.map((lap, idx) => {
      if (idx === editingLapIndex) {
        return {
          ...lap,
          duration: durationMs,
          formatted: formatMsTime(durationMs),
          note: editingNote.trim() || undefined
        };
      }
      return lap;
    });

    setLaps(updatedLaps);
    setElapsedTime(updatedLaps.reduce((acc, l) => acc + l.duration, 0));
    setEditingLapIndex(null);
    triggerHaptic('success');
  };

  // ----------------------------------------------------
  // CRUD Action: Delete Single Lap
  // ----------------------------------------------------
  const handleDeleteLap = (indexToDelete: number) => {
    triggerHaptic('warning');
    const filtered = laps.filter((_, idx) => idx !== indexToDelete);
    const renumbered = filtered.map((lap, idx) => ({
      ...lap,
      lapNumber: idx + 1
    }));

    setLaps(renumbered);
    setElapsedTime(renumbered.reduce((acc, l) => acc + l.duration, 0));
    if (editingLapIndex === indexToDelete) setEditingLapIndex(null);
  };

  // ----------------------------------------------------
  // CRUD Action: Clear All Laps
  // ----------------------------------------------------
  const handleResetAll = () => {
    triggerHaptic('warning');
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    setEditingLapIndex(null);
    setIsAddingManualLap(false);
  };

  // ----------------------------------------------------
  // Quick Duration Preset Increment
  // ----------------------------------------------------
  const handleAddPresetTime = (secondsToAdd: number) => {
    const newMs = elapsedTime + secondsToAdd * 1000;
    setElapsedTime(newMs);
    triggerHaptic('light');
  };

  // ----------------------------------------------------
  // Direct Manual Lap Number Entry
  // ----------------------------------------------------
  const handleSetDirectLapCount = (targetCount: number) => {
    const validCount = Math.max(0, Math.min(999, targetCount));
    triggerHaptic('medium');

    if (validCount === 0) {
      setLaps([]);
      setElapsedTime(0);
      return;
    }

    if (validCount > laps.length) {
      const additionalLaps: TimerLap[] = [];
      const currentCount = laps.length;
      const defaultDurationPerLap = 60000; // 1 min default split

      for (let i = currentCount + 1; i <= validCount; i++) {
        additionalLaps.push({
          lapNumber: i,
          duration: defaultDurationPerLap,
          formatted: formatMsTime(defaultDurationPerLap),
          timestamp: Date.now()
        });
      }

      const newLaps = [...laps, ...additionalLaps];
      setLaps(newLaps);
      setElapsedTime(newLaps.reduce((acc, l) => acc + l.duration, 0));
    } else if (validCount < laps.length) {
      const trimmed = laps.slice(0, validCount);
      setLaps(trimmed);
      setElapsedTime(trimmed.reduce((acc, l) => acc + l.duration, 0));
    }
  };

  // ----------------------------------------------------
  // Save & Apply Final Log
  // ----------------------------------------------------
  const handleSaveAndClose = () => {
    setIsRunning(false);
    let finalLaps = [...laps];
    const recordedTotal = finalLaps.reduce((acc, l) => acc + l.duration, 0);

    // If running timer has remaining uncaptured split, record it
    if (elapsedTime > recordedTotal + 500) {
      finalLaps.push({
        lapNumber: finalLaps.length + 1,
        duration: elapsedTime - recordedTotal,
        formatted: formatMsTime(elapsedTime - recordedTotal),
        timestamp: Date.now()
      });
    }

    const finalDuration = Math.max(elapsedTime, finalLaps.reduce((acc, l) => acc + l.duration, 0));

    onSaveTimerLog(skill.id, dateStr, finalLaps, finalDuration);
    triggerHaptic('success');
    onClose();
  };

  return createPortal(
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full ${
          isExpandedFull ? 'max-w-4xl min-h-[85vh]' : 'max-w-xl'
        } bg-zinc-950/95 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col gap-4 text-zinc-100 backdrop-blur-3xl overflow-hidden my-auto transition-all duration-300`}
      >
        {/* Top Decorative Glow Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        {/* ========================================================= */}
        {/* 1. MODAL HEADER WITH EXPANSION TOGGLE */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md text-cyan-300 font-mono font-black text-sm">
              {skill.shortForm}
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-mono font-black text-white truncate tracking-tight">
                {skill.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>{dateStr}</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">Lap Manager & Stopwatch</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Expansion Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setIsExpandedFull(prev => !prev);
                triggerHaptic('light');
              }}
              className="w-9 h-9 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all active:scale-95"
              title={isExpandedFull ? "Collapse to Standard View" : "Expand to Full Focus View"}
            >
              {isExpandedFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-all active:scale-95"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. GIANT DIGITAL STOPWATCH DISPLAY (CLEAN, GLOWING POD) */}
        {/* ========================================================= */}
        <div className={`relative ${
          isExpandedFull ? 'py-8 sm:py-12' : 'py-5 sm:py-7'
        } px-4 rounded-3xl bg-zinc-900/60 border border-white/12 flex flex-col items-center justify-center overflow-hidden shadow-inner backdrop-blur-xl transition-all`}>
          {isRunning && (
            <div className="absolute inset-0 bg-cyan-500/10 animate-pulse pointer-events-none" />
          )}

          {/* Digital Timer Value */}
          <span className={`${
            isExpandedFull ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-4xl sm:text-6xl'
          } font-black font-mono tracking-wider text-white select-none tabular-nums drop-shadow-[0_2px_18px_rgba(6,182,212,0.4)]`}>
            {formatMsTime(elapsedTime)}
          </span>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
              {isRunning ? 'Timer Active • Tracking Laps' : (elapsedTime > 0 ? 'Timer Paused' : 'Ready to Start')}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PRIMARY CONTROLS: START / PAUSE / LAP / RESET */}
        {/* ========================================================= */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Start / Pause */}
          <button
            type="button"
            onClick={handleStartPause}
            className={`min-h-[48px] py-3 rounded-2xl font-mono font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-black border border-amber-400 shadow-amber-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause size={16} className="fill-black" /> : <Play size={16} className="fill-white" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          {/* Record Lap */}
          <button
            type="button"
            onClick={handleCaptureLiveLap}
            disabled={!isRunning && elapsedTime === 0}
            className="min-h-[48px] py-3 rounded-2xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg backdrop-blur-xl"
          >
            <Flag size={16} />
            <span>+ Lap</span>
          </button>

          {/* Reset Timer */}
          <button
            type="button"
            onClick={handleResetAll}
            className="min-h-[48px] py-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/12 text-zinc-300 hover:text-red-400 font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-xl"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 4. EXPANDABLE PRESETS & TELEMETRY STATS TRAY */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-2">
          {/* Quick Presets Toggle */}
          <button
            type="button"
            onClick={() => setIsPresetsExpanded(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isPresetsExpanded 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' 
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <Sliders size={13} />
            <span>Presets</span>
            {isPresetsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* Telemetry Stats Toggle */}
          <button
            type="button"
            onClick={() => setIsStatsExpanded(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isStatsExpanded 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
                : 'bg-zinc-900/70 text-zinc-400 hover:text-white border-white/10'
            }`}
          >
            <BarChart2 size={13} />
            <span>Stats ({laps.length} Laps)</span>
            {isStatsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Expandable Presets Drawer */}
        <AnimatePresence>
          {isPresetsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-2xl bg-zinc-900/70 border border-cyan-500/20 flex flex-wrap items-center justify-center gap-1.5 overflow-hidden"
            >
              <span className="text-[10px] font-mono text-zinc-400 uppercase mr-1">Add Quick Time:</span>
              {[30, 60, 120, 300, 600, 900, 1800].map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleAddPresetTime(sec)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-white/10 text-xs font-mono font-bold active:scale-95 transition-all"
                >
                  +{sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Telemetry Stats Pod */}
        <AnimatePresence>
          {isStatsExpanded && laps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-900/60 border border-white/10 text-center overflow-hidden backdrop-blur-md"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Fastest Lap</span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 tabular-nums">
                  {fastestLapDuration ? formatMsTime(fastestLapDuration) : '--'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Average Lap</span>
                <span className="text-xs sm:text-sm font-mono font-black text-cyan-300 tabular-nums">
                  {averageLapDuration ? formatMsTime(averageLapDuration) : '--'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Laps</span>
                <span className="text-xs sm:text-sm font-mono font-black text-white tabular-nums">
                  {laps.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* 5. DIRECT MANUAL LAP NUMBER ENTRY & LAPS BREAKDOWN */}
        {/* ========================================================= */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <div>
              <span className="text-xs font-mono font-bold uppercase text-white block">Direct Lap Count Entry</span>
              <span className="text-[10px] font-mono text-zinc-400">Directly log or adjust lap quantity</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleSetDirectLapCount(Math.max(0, laps.length - 1))}
              className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center font-mono font-bold text-sm active:scale-90 transition-all"
              title="Decrease 1 Lap"
            >
              -1
            </button>

            <div className="flex items-center bg-black/60 px-2.5 py-1 rounded-xl border border-cyan-500/30">
              <input
                type="number"
                min="0"
                max="999"
                value={laps.length}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) handleSetDirectLapCount(val);
                }}
                className="w-10 text-center bg-transparent font-mono font-black text-sm text-cyan-300 focus:outline-none"
              />
              <span className="text-[11px] font-mono font-bold uppercase text-zinc-400">Laps</span>
            </div>

            <button
              type="button"
              onClick={() => handleSetDirectLapCount(laps.length + 1)}
              className="w-8 h-8 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-sm active:scale-90 transition-all"
              title="Increase 1 Lap"
            >
              +1
            </button>

            <button
              type="button"
              onClick={() => handleSetDirectLapCount(laps.length + 5)}
              className="px-2 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10 flex items-center justify-center font-mono font-bold text-xs active:scale-90 transition-all"
              title="Add 5 Laps"
            >
              +5
            </button>
          </div>
        </div>

        {/* Laps Breakdown Header & + Manual Lap Trigger */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white">
              Recorded Laps Breakdown ({laps.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAddingManualLap(prev => !prev);
              setEditingLapIndex(null);
              triggerHaptic('light');
            }}
            className="h-8 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus size={14} />
            <span>Add Detailed Split</span>
          </button>
        </div>

        {/* Manual Lap Add Form (CRUD: Create) */}
        <AnimatePresence>
          {isAddingManualLap && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddManualLap}
              className="p-3.5 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                <span>Create New Lap Entry</span>
                <button
                  type="button"
                  onClick={() => setIsAddingManualLap(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={manualMinutes}
                    onChange={e => setManualMinutes(e.target.value)}
                    placeholder="0"
                    className="w-full p-2 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={manualSeconds}
                    onChange={e => setManualSeconds(e.target.value)}
                    placeholder="0"
                    className="w-full p-2 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Note (Optional)</label>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={e => setManualNote(e.target.value)}
                    placeholder="e.g. Set 1, Sprint"
                    className="w-full p-2 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingManualLap(false)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-md"
                >
                  <Check size={14} strokeWidth={3} />
                  <span>Add Lap</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* 6. LAPS LIST CONTAINER (SPACIOUS, READABLE, CRUD) */}
        {/* ========================================================= */}
        <div className={`${
          isExpandedFull ? 'max-h-96' : 'max-h-56 sm:max-h-64'
        } overflow-y-auto custom-scrollbar space-y-2 pr-1 transition-all`}>
          {cumulativeLaps.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-zinc-900/40 border border-white/5 text-zinc-400 font-mono text-xs sm:text-sm space-y-1">
              <p className="font-bold text-zinc-300">No laps recorded yet</p>
              <p className="text-xs text-zinc-500">Tap <span className="text-cyan-400">+ Lap</span> during live stopwatch or tap <span className="text-cyan-400">Add Manual Lap</span>.</p>
            </div>
          ) : (
            cumulativeLaps.map((lap, index) => {
              const isEditingThis = editingLapIndex === index;

              if (isEditingThis) {
                return (
                  <div key={lap.lapNumber} className="p-3 rounded-2xl bg-zinc-900 border border-amber-400/50 space-y-2 shadow-lg">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                      <span>Editing Lap {lap.lapNumber}</span>
                      <button
                        type="button"
                        onClick={() => setEditingLapIndex(null)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-0.5">Min</label>
                        <input
                          type="number"
                          min="0"
                          value={editingMinutes}
                          onChange={e => setEditingMinutes(e.target.value)}
                          className="w-full p-1.5 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-0.5">Sec</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={editingSeconds}
                          onChange={e => setEditingSeconds(e.target.value)}
                          className="w-full p-1.5 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-0.5">Tenths (.s)</label>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          value={editingTenths}
                          onChange={e => setEditingTenths(e.target.value)}
                          className="w-full p-1.5 bg-black/60 border border-white/15 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-0.5">Lap Note / Tag</label>
                      <input
                        type="text"
                        value={editingNote}
                        onChange={e => setEditingNote(e.target.value)}
                        placeholder="e.g. Set 1, Incline, Sprint"
                        className="w-full p-1.5 bg-black/60 border border-white/15 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingLapIndex(null)}
                        className="px-3 py-1 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEditLap}
                        className="px-4 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono flex items-center gap-1"
                      >
                        <Check size={13} strokeWidth={3} />
                        <span>Save Lap</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={lap.lapNumber}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 shadow-sm ${
                    lap.isFastest 
                      ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-zinc-900/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                      lap.isFastest 
                        ? 'bg-emerald-500 text-black shadow-sm' 
                        : 'bg-zinc-800 text-zinc-300 border border-white/10'
                    }`}>
                      {lap.lapNumber}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm sm:text-base text-white tabular-nums tracking-wide">
                          {lap.formatted}
                        </span>
                        {lap.isFastest && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono font-bold text-emerald-300">
                            FASTEST
                          </span>
                        )}
                      </div>
                      {lap.note && (
                        <span className="text-[11px] font-mono text-amber-300 block truncate">
                          "{lap.note}"
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditLap(index)}
                      className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-amber-300 border border-white/5 transition-colors"
                      title="Edit lap time and note"
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLap(index)}
                      className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 border border-white/5 transition-colors"
                      title="Delete lap"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================= */}
        {/* 7. FOOTER SAVE & APPLY ACTION */}
        {/* ========================================================= */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs sm:text-sm font-mono border border-white/10 transition-all active:scale-95"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex-1 py-2.5 px-5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Check size={16} strokeWidth={3} />
            <span>Save & Apply Laps</span>
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
