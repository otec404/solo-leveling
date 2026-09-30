import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Search, Plus, Minus, Calculator, Delete, SlidersHorizontal, Globe, ListFilter, Sparkles } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { playTick } from './DailyDashboardView';
import { getSkillIcon } from './icons';
import { triggerHaptic } from '../lib/haptics';
import InstantSphereLog from './InstantSphereLog';

export const THEMES: Record<string, any> = {
  rose: { bgActive: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]', textMain: 'text-rose-400', badgeBg: 'bg-rose-500' },
  emerald: { bgActive: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]', textMain: 'text-emerald-400', badgeBg: 'bg-emerald-500' },
  violet: { bgActive: 'bg-violet-500/15 text-violet-400 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]', textMain: 'text-violet-400', badgeBg: 'bg-violet-500' },
  amber: { bgActive: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]', textMain: 'text-amber-400', badgeBg: 'bg-amber-500' },
  cyan: { bgActive: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]', textMain: 'text-cyan-400', badgeBg: 'bg-cyan-500' },
  indigo: { bgActive: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]', textMain: 'text-indigo-400', badgeBg: 'bg-indigo-500' },
  fuchsia: { bgActive: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30 shadow-[0_0_12px_rgba(217,70,239,0.15)]', textMain: 'text-fuchsia-400', badgeBg: 'bg-fuchsia-500' },
  zinc: { bgActive: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30 shadow-[0_0_12px_rgba(113,113,122,0.15)]', textMain: 'text-zinc-300', badgeBg: 'bg-zinc-500' },
  white: { bgActive: 'bg-white/10 text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]', textMain: 'text-white', badgeBg: 'bg-white' }
};

function HighlightedText({ text, query }: { text: string, query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((p, i) => 
        p.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="text-zinc-950 bg-white/90 rounded-[2px] px-[2px] font-bold">{p}</span> 
          : p
      )}
    </>
  );
}

// --- INLINE EDITOR COMPONENTS ---

function DrumScroller({ value, onChange, theme }: { value: number, onChange: (v: number) => void, theme: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastVal = useRef(value);

  useEffect(() => {
    if (containerRef.current) {
      const expected = value * 48;
      if (Math.abs(containerRef.current.scrollTop - expected) > 2) {
         containerRef.current.scrollTo({ top: expected, behavior: 'smooth' });
      }
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const v = Math.round(e.currentTarget.scrollTop / 48);
    if (v !== lastVal.current && v >= 0 && v <= 1000) {
      triggerHaptic('light');
      lastVal.current = v;
      onChange(v);
    }
  };

  return (
    <div className="relative h-[144px] w-full flex justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/5 touch-pan-y shadow-inner">
      <div className={`absolute top-1/2 left-4 right-4 h-[48px] -translate-y-1/2 rounded-xl border pointer-events-none z-10 transition-colors ${theme.bgActive}`} />
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className="h-full w-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-0"
        style={{ scrollPaddingTop: 48 }}
      >
        <div style={{ height: 48, flexShrink: 0 }} />
        {Array.from({ length: 1001 }).map((_, i) => (
          <div key={i} className={`flex items-center justify-center snap-start text-3xl font-black transition-colors ${value === i ? theme.textMain : 'text-zinc-500'}`} style={{ height: 48, flexShrink: 0 }}>
            {i}
          </div>
        ))}
        <div style={{ height: 48, flexShrink: 0 }} />
      </div>
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-zinc-900 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-20" />
    </div>
  );
}

function QuantItem({ skill, val, onUpdate, theme, isExpanded, onToggleExpand }: any) {
  const [mode, setMode] = useState<'scroller'|'stepper'|'keypad'>('scroller');
  const Icon = getSkillIcon(skill);

  const commitVal = (v: number) => {
    if (v < 0) v = 0;
    if (v > 9999) v = 9999;
    onUpdate(skill.id, v);
  };

  const appendDigit = (n: number) => {
    const nextStr = val === 0 ? `${n}` : `${val}${n}`;
    commitVal(parseInt(nextStr.slice(0, 4), 10));
  };

  return (
    <div className={`w-full flex flex-col p-3 sm:p-4 rounded-2xl transition-all border outline-none ${isExpanded ? theme.bgActive.split(' ')[0] + ' border-white/20 shadow-lg ring-1 ring-white/10' : val > 0 ? 'bg-zinc-900/60 border-white/5 hover:border-white/10' : 'bg-zinc-900/40 border-transparent hover:bg-zinc-800/80 hover:border-white/10'}`}>
      
      {/* Header Row (Always Visible) */}
      <div 
        className="flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform" 
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isExpanded || val > 0 ? theme.textMain + ' bg-white/10' : 'bg-zinc-800 text-zinc-500'}`}>
            <Icon size={20} />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className={`font-bold truncate text-base ${isExpanded || val > 0 ? 'text-white' : 'text-zinc-300'}`}>
              {skill.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate">{skill.category}</span>
              {skill.unit && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate">{skill.unit}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className={`font-black text-xl ${isExpanded || val > 0 ? theme.textMain : 'text-zinc-500'}`}>{val}</span>
          {!isExpanded && <SlidersHorizontal size={16} className={val > 0 ? theme.textMain : 'text-zinc-600'} />}
        </div>
      </div>

      {/* Expanded Inline Editor */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Edit Quantity</span>
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={(e) => { e.stopPropagation(); setMode('scroller'); triggerHaptic('light'); }} 
                  className={`p-1.5 rounded-lg transition-all ${mode==='scroller' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                ><SlidersHorizontal size={14}/></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMode('stepper'); triggerHaptic('light'); }} 
                  className={`p-1.5 rounded-lg transition-all ${mode==='stepper' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                ><Minus size={14}/></button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMode('keypad'); triggerHaptic('light'); }} 
                  className={`p-1.5 rounded-lg transition-all ${mode==='keypad' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                ><Calculator size={14}/></button>
              </div>
            </div>

            {mode === 'scroller' && <DrumScroller value={val} onChange={commitVal} theme={theme} />}

            {mode === 'stepper' && (
              <div className="flex items-center justify-between bg-black/20 rounded-2xl p-2 border border-white/5">
                <button 
                  onClick={(e) => { e.stopPropagation(); commitVal(val - 1); triggerHaptic('light'); }} 
                  className="w-16 h-16 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white active:scale-95 transition-all"
                ><Minus size={24}/></button>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter">{val}</span>
                  {skill.unit && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{skill.unit}</span>}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); commitVal(val + 1); playTick(); }} 
                  className="w-16 h-16 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white active:scale-95 transition-all"
                ><Plus size={24}/></button>
              </div>
            )}

            {mode === 'keypad' && (
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <button 
                    key={n} 
                    onClick={(e) => { e.stopPropagation(); appendDigit(n); playTick(); }} 
                    className="h-12 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xl font-bold text-white active:scale-95 transition-all"
                  >{n}</button>
                ))}
                <button 
                  onClick={(e) => { e.stopPropagation(); commitVal(0); triggerHaptic('light'); }} 
                  className="h-12 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                >Clear</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); appendDigit(0); playTick(); }} 
                  className="h-12 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xl font-bold text-white active:scale-95 transition-all"
                >0</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); commitVal(Math.floor(val / 10)); triggerHaptic('light'); }} 
                  className="h-12 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-400 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                ><Delete size={20}/></button>
              </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }} 
              className="w-full py-3 bg-white text-black font-black rounded-xl mt-2 active:scale-95 hover:bg-zinc-200 transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN SHEET COMPONENT ---

interface QuickLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  logs: SkillLog[];
  dateLogs: SkillLog[];
  currentDateStr: string;
  categoryColors: Record<string, string>;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
  defaultMode?: 'sphere' | 'list';
}

export default function QuickLogSheet({
  isOpen, 
  onClose, 
  skills, 
  logs,
  dateLogs, 
  currentDateStr, 
  categoryColors, 
  onUpdateLog,
  defaultMode = 'sphere'
}: QuickLogSheetProps) {
  
  const [logMode, setLogMode] = useState<'sphere' | 'list'>(defaultMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedQuantSkill, setExpandedQuantSkill] = useState<string | null>(null);
  
  // Local optimistic state
  const [tempLogs, setTempLogs] = useState<Record<string, any>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced auto-save refs
  const updateLogRef = useRef(onUpdateLog);
  updateLogRef.current = onUpdateLog;
  const saveTimeouts = useRef<Record<string, any>>({});
  const pendingSaves = useRef<Record<string, any>>({});

  const flushPending = () => {
    Object.entries(pendingSaves.current).forEach(([id, val]) => {
      if (typeof val === 'number') updateLogRef.current(id, currentDateStr, { count: val });
      else updateLogRef.current(id, currentDateStr, { checked: val as boolean });
    });
    pendingSaves.current = {};
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setActiveCategory('All');
      setExpandedQuantSkill(null);
      setTempLogs({});
    }
    return () => flushPending();
  }, [isOpen]);

  const handleClose = () => {
    flushPending();
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
         if (e.key === 'Escape' && e.target === searchInputRef.current) {
            setSearchQuery('');
            searchInputRef.current.blur();
         }
         return;
      }

      if (e.key === 'Escape') {
        if (expandedQuantSkill) setExpandedQuantSkill(null);
        else if (searchQuery) setSearchQuery('');
        else handleClose();
        return;
      }

      if (e.key === 'Backspace' && logMode === 'list') {
        setSearchQuery(prev => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ' && logMode === 'list') {
        setSearchQuery(prev => prev + e.key);
        searchInputRef.current?.focus();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery, expandedQuantSkill, logMode]);

  const updateValue = (skillId: string, val: number) => {
    setTempLogs(prev => ({ ...prev, [skillId]: val }));
    pendingSaves.current[skillId] = val;
    
    if (saveTimeouts.current[skillId]) clearTimeout(saveTimeouts.current[skillId]);
    saveTimeouts.current[skillId] = setTimeout(() => {
       updateLogRef.current(skillId, currentDateStr, { count: val });
       delete pendingSaves.current[skillId];
    }, 400);
  };

  const toggleBinary = (skillId: string, currentChecked: boolean) => {
    setExpandedQuantSkill(null);
    triggerHaptic('success');
    if (!currentChecked) playTick();
    
    const newVal = !currentChecked;
    setTempLogs(prev => ({ ...prev, [skillId]: newVal }));
    pendingSaves.current[skillId] = newVal;
    
    if (saveTimeouts.current[skillId]) clearTimeout(saveTimeouts.current[skillId]);
    saveTimeouts.current[skillId] = setTimeout(() => {
       updateLogRef.current(skillId, currentDateStr, { checked: newVal });
       delete pendingSaves.current[skillId];
    }, 400);
  };

  const categories = useMemo(() => Array.from(new Set(skills.map(s => s.category))).sort(), [skills]);
  const allCategoryTabs = ['All', ...categories];

  // Optional swipe handling for categories
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
       const currentIndex = allCategoryTabs.indexOf(activeCategory);
       if (diff > 0 && currentIndex < allCategoryTabs.length - 1) {
          setActiveCategory(allCategoryTabs[currentIndex + 1]);
          setExpandedQuantSkill(null);
          triggerHaptic('light');
       } else if (diff < 0 && currentIndex > 0) {
          setActiveCategory(allCategoryTabs[currentIndex - 1]);
          setExpandedQuantSkill(null);
          triggerHaptic('light');
       }
    }
  };

  const displayedSkills = useMemo(() => {
    let list = skills;
    if (searchQuery.trim()) {
       const q = searchQuery.toLowerCase();
       list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    } else if (activeCategory !== 'All') {
       list = list.filter(s => s.category === activeCategory);
    }
    return list;
  }, [skills, searchQuery, activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[760px] sm:h-[720px] sm:max-h-[92vh] bg-zinc-950 sm:border border-white/15 rounded-t-3xl sm:rounded-[2.5rem] shadow-2xl z-[101] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Top Modal Header with Mode Switch */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-zinc-950/90 backdrop-blur-md z-30 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-mono font-black text-white tracking-tight">Instant Logs</h3>
                  <p className="text-[10px] font-mono text-zinc-400">Tactical spherical & fast batch logging</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode Selector: 3D Sphere vs Batch List */}
                <div className="flex items-center bg-zinc-900 border border-white/15 rounded-xl p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => { setLogMode('sphere'); triggerHaptic('light'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      logMode === 'sphere'
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Globe size={13} />
                    <span className="hidden sm:inline">3D Sphere</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLogMode('list'); triggerHaptic('light'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      logMode === 'list'
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ListFilter size={13} />
                    <span className="hidden sm:inline">Batch List</span>
                  </button>
                </div>

                <button 
                  aria-label="Close Instant Log Sheet" 
                  onClick={handleClose} 
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all border border-white/10 active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Layout Body: Either 3D InfiniteMenu Sphere OR Batch List */}
            {logMode === 'sphere' ? (
              <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-zinc-950 flex flex-col justify-center">
                <InstantSphereLog 
                  skills={skills}
                  logs={logs}
                  currentDateStr={currentDateStr}
                  categoryColors={categoryColors}
                  onUpdateLog={onUpdateLog}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-zinc-950 relative">
                
                {/* Category Filter Rail (Desktop Only) */}
                <div className="hidden sm:flex sm:flex-col overflow-y-auto p-3 gap-2 border-r border-white/5 shrink-0 sm:w-48 hide-scrollbar bg-zinc-950 z-10">
                   <button 
                     onClick={() => { setActiveCategory('All'); setExpandedQuantSkill(null); triggerHaptic('light'); }} 
                     className={`px-4 py-3 sm:py-4 rounded-xl font-bold text-sm text-left transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${activeCategory === 'All' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
                   >
                     All Habits
                   </button>
                   {categories.map(cat => {
                     const t = THEMES[categoryColors[cat] || 'cyan'] || THEMES['cyan'];
                     return (
                       <button 
                         key={cat}
                         onClick={() => { setActiveCategory(cat); setExpandedQuantSkill(null); triggerHaptic('light'); }}
                         className={`px-4 py-3 sm:py-4 rounded-xl font-bold text-sm text-left transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${activeCategory === cat ? t.bgActive.split(' ')[0] + ' text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
                       >
                         {cat}
                       </button>
                     );
                   })}
                </div>

                {/* Skills List */}
                <div 
                  className="flex-1 overflow-y-auto p-3 sm:p-5 hide-scrollbar flex flex-col gap-2 bg-zinc-950"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {displayedSkills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 pb-20">
                       <Search size={32} className="opacity-20" />
                       <p className="font-medium text-sm">No habits found.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 pb-10">
                      {displayedSkills.map(skill => {
                        const theme = THEMES[categoryColors[skill.category] || 'cyan'] || THEMES['cyan'];
                        const Icon = getSkillIcon(skill);
                        const log = dateLogs.find(l => l.skillId === skill.id);
                        
                        // Binary Skill Render
                        if (skill.mode === 'checkbox') {
                           const isChecked = tempLogs[skill.id] !== undefined ? !!tempLogs[skill.id] : !!log?.checked;
                           return (
                             <button 
                               key={skill.id}
                               onClick={() => toggleBinary(skill.id, isChecked)}
                               className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98] border ${isChecked ? theme.bgActive + ' border-white/20' : 'bg-zinc-900/40 border-transparent hover:bg-zinc-800/80 hover:border-white/10'}`}
                             >
                                <div className="flex items-center gap-4 min-w-0">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isChecked ? theme.textMain + ' bg-white/10' : 'bg-zinc-800 text-zinc-500'}`}>
                                      <Icon size={20} />
                                   </div>
                                   <div className="flex flex-col min-w-0 text-left">
                                      <span className={`font-bold truncate text-base ${isChecked ? 'text-white' : 'text-zinc-300'}`}>
                                         <HighlightedText text={skill.name} query={searchQuery} />
                                      </span>
                                      {searchQuery && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate mt-0.5">{skill.category}</span>}
                                   </div>
                                </div>
                                <div className={`shrink-0 ml-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isChecked ? 'border-transparent ' + theme.badgeBg : 'border-zinc-700'}`}>
                                   {isChecked && <Check size={14} className="text-zinc-950" strokeWidth={4} />}
                                </div>
                             </button>
                           );
                        }

                        // Quantitative Skill Render (Inline Expansion)
                        const val = tempLogs[skill.id] ?? (log?.count || 0);
                        const isExpanded = expandedQuantSkill === skill.id;

                        return (
                           <QuantItem
                             key={skill.id}
                             skill={skill}
                             val={val}
                             theme={theme}
                             isExpanded={isExpanded}
                             onUpdate={updateValue}
                             onToggleExpand={() => {
                                triggerHaptic('light');
                                setExpandedQuantSkill(isExpanded ? null : skill.id);
                             }}
                           />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Header & Search (Active in list mode) */}
            {logMode === 'list' && (
              <div className="p-4 sm:p-5 pb-5 border-t border-white/10 bg-zinc-950 z-20 shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search habits..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-11 pr-16 text-white font-medium outline-none focus:border-zinc-500 focus-visible:ring-1 focus-visible:ring-white/20 transition-all placeholder:text-zinc-600"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white bg-zinc-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest transition-colors">
                      Esc
                    </button>
                  )}
                </div>

                {/* Persistent Category Indicator Dots */}
                {!searchQuery && (
                  <div className="flex flex-col items-center justify-center mt-4">
                     <div className="flex items-center justify-center gap-2">
                       <button 
                          onClick={() => { setActiveCategory('All'); setExpandedQuantSkill(null); triggerHaptic('light'); }}
                          className="p-1 active:scale-95 transition-transform"
                       >
                          <div className={`h-2 rounded-full transition-all duration-300 ${activeCategory === 'All' ? 'w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'w-2 bg-zinc-800 hover:bg-zinc-700'}`} />
                       </button>
                       {categories.map(cat => {
                         const t = THEMES[categoryColors[cat] || 'cyan'] || THEMES['cyan'];
                         return (
                           <button
                             key={cat}
                             onClick={() => { setActiveCategory(cat); setExpandedQuantSkill(null); triggerHaptic('light'); }}
                             className="p-1 active:scale-95 transition-transform"
                             title={cat}
                           >
                             <div className={`h-2 rounded-full transition-all duration-300 ${activeCategory === cat ? `w-8 ${t.badgeBg} ${t.bgActive.match(/shadow-\[[^\]]+\]/)?.[0] || ''}` : 'w-2 bg-zinc-800 hover:bg-zinc-700'}`} />
                           </button>
                         );
                       })}
                     </div>
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
                       {activeCategory === 'All' ? 'All Habits' : activeCategory}
                     </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
