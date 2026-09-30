import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  FolderTree, 
  Layers, 
  Search, 
  Plus, 
  Check, 
  Trash2, 
  X, 
  MessageSquare, 
  CornerDownRight, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  ArrowRight,
  Clock,
  SlidersHorizontal,
  FileText,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  Timer,
  Filter,
  Sparkles,
  StickyNote
} from 'lucide-react';
import { Skill, SkillLog, BlankNote } from '../types';
import { getSkillImage } from '../utils/skillImages';
import { triggerHaptic } from '../lib/haptics';
import TimerSkillModal from './TimerSkillModal';

const THEME_COLORS: Record<string, string> = {
  emerald: '#10b981',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  fuchsia: '#d946ef',
  purple: '#a855f7',
  black: '#ffffff',
  default: '#818cf8'
};

interface ListViewProps {
  skills: Skill[];
  logs: SkillLog[];
  categories: string[];
  categoryColors: Record<string, string>;
  blankNotes: BlankNote[];
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
  onAddBlankNote: (note: Omit<BlankNote, 'id' | 'timestamp'>) => void;
  onUpdateBlankNote: (id: string, text: string, category?: string, date?: string) => void;
  onDeleteBlankNote: (id: string) => void;
  onJumpToDate?: (dateStr: string) => void;
}

type ListMode = 'date' | 'category' | 'overall';
type FilterOption = 'all' | 'notes_only' | 'completed_only';

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayStr() {
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  return `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;
}

function formatFullDateDisplay(dateStr: string) {
  const dateObj = new Date(dateStr + 'T12:00:00');
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = dateObj.getDate();
  const yearNum = dateObj.getFullYear();
  return `${monthName} ${dayNum}, ${yearNum}`;
}

function formatNoteTime(timestamp?: number) {
  if (!timestamp) return '12:00 PM';
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function ListView({
  skills,
  logs,
  categories,
  categoryColors,
  blankNotes,
  onUpdateLog,
  onAddBlankNote,
  onUpdateBlankNote,
  onDeleteBlankNote,
  onJumpToDate
}: ListViewProps) {
  // Navigation & Primary Modes: DATE / CATEGORY / OVERALL
  const [listMode, setListMode] = useState<ListMode>('date');
  
  // Category filter: 'all' or specific category name
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // Search & Secondary Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
  // Date filter state: 'all' or specific date string 'YYYY-MM-DD'
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Accordion collapsed state for category blocks: key is `${dateStr}_${cat}`
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({});

  // Interactive Calendar Navigation Month/Year
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => new Date());

  // Target date for new blank note
  const [targetDateForNote, setTargetDateForNote] = useState<string>(() => getTodayStr());

  // Inline subnote editing states (Skill Log notes)
  const [editingLogKey, setEditingLogKey] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Inline blank note editing states (Free-text asides)
  const [editingBlankNoteId, setEditingBlankNoteId] = useState<string | null>(null);
  const [editingBlankText, setEditingBlankText] = useState('');
  const [editingBlankCategory, setEditingBlankCategory] = useState<string>('');
  
  // Modal / Drawer composer state for creating blank notes
  const [isAddingBlankNote, setIsAddingBlankNote] = useState(false);
  const [newBlankText, setNewBlankText] = useState('');
  const [newBlankCategory, setNewBlankCategory] = useState(categories[0] || 'Black');

  // Quick skill subnote picker modal (allows attaching a subnote to any skill on a given day)
  const [subnotePickerDate, setSubnotePickerDate] = useState<string | null>(null);
  const [selectedSkillForSubnote, setSelectedSkillForSubnote] = useState<string>('');
  const [skillSubnoteInputText, setSkillSubnoteInputText] = useState('');

  // Dedicated Lap & Stopwatch Manager Modal
  const [timerModalSkill, setTimerModalSkill] = useState<Skill | null>(null);
  const [timerModalDate, setTimerModalDate] = useState<string>('');

  const dateStripRef = useRef<HTMLDivElement>(null);

  const toggleBlockCollapse = (blockKey: string) => {
    setCollapsedBlocks(prev => ({ ...prev, [blockKey]: !prev[blockKey] }));
    triggerHaptic('light');
  };

  const skillsMap = useMemo(() => {
    return new Map(skills.map(s => [s.id, s]));
  }, [skills]);

  // Group logs by date
  const logsByDate = useMemo(() => {
    const map: Record<string, SkillLog[]> = {};
    logs.forEach(log => {
      if (log.count === 0 && !log.checked && !log.notes && (!log.timerLaps || log.timerLaps.length === 0)) return;
      if (!map[log.date]) map[log.date] = [];
      map[log.date].push(log);
    });
    return map;
  }, [logs]);

  // All active dates sorted newest to oldest
  const sortedDates = useMemo(() => {
    const dates = new Set<string>([...Object.keys(logsByDate), ...blankNotes.map(b => b.date)]);
    if (dates.size === 0) {
      dates.add(getTodayStr());
    }
    dates.add(getTodayStr());
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [logsByDate, blankNotes]);

  // Dates with activity for calendar indicator
  const activeDatesSet = useMemo(() => {
    return new Set<string>([...Object.keys(logsByDate), ...blankNotes.map(b => b.date)]);
  }, [logsByDate, blankNotes]);

  // Dates with notes (either subnotes or blank notes)
  const datesWithNotesSet = useMemo(() => {
    const s = new Set<string>();
    blankNotes.forEach(b => {
      if (b.text && b.text.trim()) s.add(b.date);
    });
    logs.forEach(l => {
      if (l.notes && l.notes.trim()) s.add(l.date);
    });
    return s;
  }, [blankNotes, logs]);

  // Filtered dates based on date picker, note filter, search, and category filter
  const displayedDates = useMemo(() => {
    let result = sortedDates;
    if (selectedDateFilter !== 'all') {
      result = result.filter(d => d === selectedDateFilter);
    }
    if (filterOption === 'notes_only') {
      result = result.filter(d => datesWithNotesSet.has(d));
    }
    if (selectedCategoryFilter !== 'all') {
      result = result.filter(d => {
        const dLogs = logsByDate[d] || [];
        const hasSkillInCat = dLogs.some(l => {
          const s = skillsMap.get(l.skillId);
          return s && s.category === selectedCategoryFilter;
        });
        const hasBlankInCat = blankNotes.some(b => b.date === d && b.category === selectedCategoryFilter);
        return hasSkillInCat || hasBlankInCat;
      });
    }
    return result;
  }, [sortedDates, selectedDateFilter, filterOption, datesWithNotesSet, selectedCategoryFilter, logsByDate, skillsMap, blankNotes]);

  // Timeline Ribbon days (covers past 14 days and next 2 days)
  const timelineRibbonDays = useMemo(() => {
    const days: Array<{
      dateStr: string;
      dayOfWeek: string;
      dayNum: number;
      monthName: string;
      isToday: boolean;
      hasLogs: boolean;
      hasNotes: boolean;
    }> = [];
    const today = new Date();
    
    // 14 days back to 2 days forward
    for (let i = 14; i >= -2; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      const isToday = dStr === getTodayStr();

      days.push({
        dateStr: dStr,
        dayOfWeek,
        dayNum,
        monthName,
        isToday,
        hasLogs: Boolean(logsByDate[dStr]?.length),
        hasNotes: datesWithNotesSet.has(dStr)
      });
    }
    return days;
  }, [logsByDate, datesWithNotesSet]);

  // Scroll active day into view in timeline ribbon
  useEffect(() => {
    if (dateStripRef.current) {
      const activeEl = dateStripRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDateFilter]);

  // CRUD Handler: Skill Log subnote save / update
  const handleSaveLogNote = (skillId: string, date: string) => {
    const cleanNote = editingNoteText.trim();
    onUpdateLog(skillId, date, { notes: cleanNote || undefined });
    setEditingLogKey(null);
    setEditingNoteText('');
    triggerHaptic('success');
  };

  // CRUD Handler: Skill Log subnote delete
  const handleDeleteLogNote = (skillId: string, date: string) => {
    onUpdateLog(skillId, date, { notes: undefined });
    setEditingLogKey(null);
    setEditingNoteText('');
    triggerHaptic('light');
  };

  // CRUD Handler: Toggle skill checkbox directly from row
  const handleToggleSkillCheck = (skill: Skill, dateStr: string, currentLog?: SkillLog) => {
    if (skill.mode === 'checkbox') {
      const nextChecked = !currentLog?.checked;
      onUpdateLog(skill.id, dateStr, { checked: nextChecked, count: nextChecked ? 1 : 0 });
    } else if (skill.mode === 'counter') {
      const nextCount = (currentLog?.count || 0) > 0 ? 0 : 1;
      onUpdateLog(skill.id, dateStr, { count: nextCount, checked: nextCount > 0 });
    } else {
      const nextChecked = !currentLog?.checked;
      onUpdateLog(skill.id, dateStr, { checked: nextChecked });
    }
    triggerHaptic('medium');
  };

  // CRUD Handler: Add new subnote to any skill on a date
  const handleCreateSkillSubnote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subnotePickerDate || !selectedSkillForSubnote || !skillSubnoteInputText.trim()) return;
    
    onUpdateLog(selectedSkillForSubnote, subnotePickerDate, {
      notes: skillSubnoteInputText.trim()
    });
    setSubnotePickerDate(null);
    setSelectedSkillForSubnote('');
    setSkillSubnoteInputText('');
    triggerHaptic('success');
  };

  // CRUD Handler: Free-text aside edit / save
  const handleSaveBlankNoteEdit = (id: string) => {
    if (!editingBlankText.trim()) {
      onDeleteBlankNote(id);
    } else {
      onUpdateBlankNote(id, editingBlankText.trim(), editingBlankCategory || undefined);
    }
    setEditingBlankNoteId(null);
    setEditingBlankText('');
    setEditingBlankCategory('');
    triggerHaptic('success');
  };

  // CRUD Handler: Create free-text aside
  const handleCreateBlankNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlankText.trim()) return;
    onAddBlankNote({
      date: targetDateForNote,
      text: newBlankText.trim(),
      category: newBlankCategory
    });
    setNewBlankText('');
    setIsAddingBlankNote(false);
    triggerHaptic('success');
  };

  // Copy note text to clipboard
  const handleCopyNote = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedToast(`Copied note to clipboard`);
    triggerHaptic('light');
    setTimeout(() => setCopiedToast(null), 2000);
  };

  // Step active date filter forward / backward by 1 day
  const handleStepDay = (direction: 'prev' | 'next') => {
    const baseDateStr = selectedDateFilter === 'all' ? getTodayStr() : selectedDateFilter;
    const current = new Date(baseDateStr + 'T12:00:00');
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    const nextDateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    setSelectedDateFilter(nextDateStr);
    triggerHaptic('light');
  };

  // Calendar calculation helpers
  const calendarDays = useMemo(() => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: Array<{ 
      dayNum: number; 
      dateStr: string; 
      isCurrentMonth: boolean; 
      hasActivity: boolean;
      hasNotes: boolean;
    }> = [];
    
    // Previous month padding
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const dStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
      days.push({ 
        dayNum: dNum, 
        dateStr: dStr, 
        isCurrentMonth: false, 
        hasActivity: activeDatesSet.has(dStr),
        hasNotes: datesWithNotesSet.has(dStr)
      });
    }
    
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ 
        dayNum: d, 
        dateStr: dStr, 
        isCurrentMonth: true, 
        hasActivity: activeDatesSet.has(dStr),
        hasNotes: datesWithNotesSet.has(dStr)
      });
    }
    
    // Next month padding to fill grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({ 
        dayNum: n, 
        dateStr: dStr, 
        isCurrentMonth: false, 
        hasActivity: activeDatesSet.has(dStr),
        hasNotes: datesWithNotesSet.has(dStr)
      });
    }
    
    return days;
  }, [calendarViewDate, activeDatesSet, datesWithNotesSet]);

  const monthName = calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full w-full bg-[var(--app-bg,#0B0B0D)] text-zinc-100 overflow-hidden select-none relative transition-colors duration-300">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[120] px-4 py-2 bg-zinc-900/90 border border-white/20 rounded-2xl text-xs sm:text-sm font-mono text-cyan-300 shadow-2xl backdrop-blur-2xl flex items-center gap-2"
          >
            <Check size={16} className="text-emerald-400" />
            <span className="font-bold">{copiedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 1. SIMPLE TOP HEADER: DATE / CATEGORY / OVERALL + CALENDAR ICON + CATEGORY FILTER */}
      {/* ========================================================= */}
      <div className="shrink-0 px-3.5 sm:px-5 pt-3.5 pb-3 border-b border-white/10 bg-[#07070a]/90 backdrop-blur-3xl flex flex-col gap-2.5 z-20">
        
        {/* Top Control Bar: Mode Tabs + Calendar Icon + Category Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Main Mode Switcher: DATE / CATEGORY / OVERALL */}
          <div className="flex-1 grid grid-cols-3 p-1 bg-zinc-900/80 border border-white/12 rounded-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => { setListMode('date'); triggerHaptic('light'); }}
              className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all ${
                listMode === 'date' 
                  ? 'bg-white text-black font-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white font-bold'
              }`}
            >
              <Calendar size={15} />
              <span>Date</span>
            </button>

            <button
              type="button"
              onClick={() => { setListMode('category'); triggerHaptic('light'); }}
              className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all ${
                listMode === 'category' 
                  ? 'bg-white text-black font-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white font-bold'
              }`}
            >
              <FolderTree size={15} />
              <span>Category</span>
            </button>

            <button
              type="button"
              onClick={() => { setListMode('overall'); triggerHaptic('light'); }}
              className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all ${
                listMode === 'overall' 
                  ? 'bg-white text-black font-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white font-bold'
              }`}
            >
              <Layers size={15} />
              <span>Overall</span>
            </button>
          </div>

          {/* Dedicated Calendar Icon Button */}
          <button
            type="button"
            onClick={() => { setIsDatePickerOpen(true); triggerHaptic('medium'); }}
            className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-cyan-400 border border-white/15 flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md backdrop-blur-xl group"
            title="Open Interactive Calendar Date Picker"
          >
            <CalendarDays size={19} className="group-hover:scale-110 transition-transform text-cyan-400" />
          </button>

          {/* Category Filter Selector Dropdown */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 rounded-2xl text-xs sm:text-sm font-mono text-zinc-200 backdrop-blur-xl shadow-md cursor-pointer transition-all">
              <Filter size={14} className={selectedCategoryFilter !== 'all' ? 'text-cyan-400' : 'text-zinc-400'} />
              <select
                value={selectedCategoryFilter}
                onChange={e => {
                  setSelectedCategoryFilter(e.target.value);
                  triggerHaptic('light');
                }}
                className="bg-transparent text-xs sm:text-sm font-mono font-bold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-zinc-950 text-white font-mono">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-zinc-950 text-white font-mono">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Mode Timeline Ribbon & Quick Filter Controls */}
        {listMode === 'date' && (
          <div className="flex items-center gap-2 pt-0.5">
            {/* Step Previous Day Button */}
            <button
              type="button"
              onClick={() => handleStepDay('prev')}
              aria-label="Previous Day"
              title="Previous Day"
              className="w-10 h-13 sm:h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/12 flex items-center justify-center shrink-0 active:scale-90 transition-all backdrop-blur-xl"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Horizontal Timeline Strip */}
            <div 
              ref={dateStripRef}
              className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5 flex-1 scroll-smooth"
            >
              {/* All (N) Pill */}
              <button
                type="button"
                data-active={selectedDateFilter === 'all'}
                onClick={() => { setSelectedDateFilter('all'); triggerHaptic('light'); }}
                className={`h-13 sm:h-14 px-3.5 rounded-2xl font-mono text-xs sm:text-sm font-black transition-all shrink-0 border flex items-center gap-1.5 backdrop-blur-xl ${
                  selectedDateFilter === 'all'
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-zinc-900/80 text-zinc-300 border-white/12 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>All</span>
                <span className="text-[10px] sm:text-xs opacity-75 font-normal">({sortedDates.length})</span>
              </button>

              {/* Stacked Day of Week + Day Number Pills */}
              {timelineRibbonDays.map(item => {
                const isSelected = selectedDateFilter === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    data-active={isSelected}
                    onClick={() => {
                      setSelectedDateFilter(item.dateStr);
                      triggerHaptic('light');
                    }}
                    className={`h-13 sm:h-14 min-w-[48px] sm:min-w-[52px] px-2.5 rounded-2xl font-mono transition-all shrink-0 border flex flex-col items-center justify-center active:scale-95 backdrop-blur-xl ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xl font-black'
                        : item.isToday
                        ? 'bg-zinc-900/90 text-white border-cyan-400/60 hover:bg-zinc-800'
                        : 'bg-zinc-900/80 text-zinc-300 border-white/12 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black leading-none ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {item.dayOfWeek}
                    </span>
                    <span className="text-sm sm:text-base font-black leading-tight mt-0.5 sm:mt-1">
                      {item.dayNum}
                    </span>
                    {item.hasNotes && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 -mb-1 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step Next Day Button */}
            <button
              type="button"
              onClick={() => handleStepDay('next')}
              aria-label="Next Day"
              title="Next Day"
              className="w-10 h-13 sm:h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/12 flex items-center justify-center shrink-0 active:scale-90 transition-all backdrop-blur-xl"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Search & Free Note Action Row */}
        <div className="flex items-center gap-2 pt-0.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="feed-search-input"
              type="text"
              placeholder="Search notes, subnotes, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-zinc-900/80 backdrop-blur-xl border border-white/12 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white flex items-center justify-center"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Notes Filter Toggle */}
          <button
            type="button"
            onClick={() => {
              setFilterOption(prev => prev === 'notes_only' ? 'all' : 'notes_only');
              triggerHaptic('light');
            }}
            className={`h-9 px-3 rounded-2xl border flex items-center gap-1.5 text-xs font-mono font-bold shrink-0 active:scale-95 transition-all backdrop-blur-xl ${
              filterOption === 'notes_only' 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md' 
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border-white/12'
            }`}
            title="Toggle Notes Only Filter"
          >
            <StickyNote size={14} className={filterOption === 'notes_only' ? 'text-amber-400' : 'text-zinc-400'} />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Golden Free Note Button */}
          <button
            type="button"
            onClick={() => { 
              setIsAddingBlankNote(true); 
              setTargetDateForNote(selectedDateFilter !== 'all' ? selectedDateFilter : getTodayStr());
              triggerHaptic('light'); 
            }}
            className="h-9 px-3.5 sm:px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-mono font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-lg backdrop-blur-xl shrink-0"
          >
            <Plus size={15} strokeWidth={3} />
            <span>Note</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE CALENDAR MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isDatePickerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-zinc-950/95 border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-zinc-100 backdrop-blur-3xl"
            >
              {/* Header with Month / Year Navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
                    triggerHaptic('light');
                  }}
                  className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-white/10 active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="font-mono font-black text-base text-white uppercase tracking-wider">
                  {monthName}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
                    triggerHaptic('light');
                  }}
                  className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-white/10 active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Direct Jump Native Input */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-zinc-900/70 rounded-2xl border border-white/10">
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Clock size={14} className="text-cyan-400" /> Direct Date:
                </span>
                <input
                  type="date"
                  value={selectedDateFilter === 'all' ? getTodayStr() : selectedDateFilter}
                  onChange={e => {
                    if (e.target.value) {
                      setSelectedDateFilter(e.target.value);
                      const [y, m, d] = e.target.value.split('-').map(Number);
                      setCalendarViewDate(new Date(y, m - 1, d || 1));
                      setIsDatePickerOpen(false);
                      triggerHaptic('success');
                    }
                  }}
                  className="bg-zinc-900 border border-white/10 text-white rounded-xl px-2.5 py-1 text-xs font-mono cursor-pointer focus:outline-none"
                />
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 text-center text-xs font-mono font-bold text-zinc-500 uppercase">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dw, i) => (
                  <div key={i} className="py-1">{dw}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {calendarDays.map((item, idx) => {
                  const isSelected = selectedDateFilter === item.dateStr;
                  const isToday = item.dateStr === getTodayStr();

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDateFilter(item.dateStr);
                        setIsDatePickerOpen(false);
                        triggerHaptic('success');
                      }}
                      className={`h-10 rounded-xl font-mono text-xs sm:text-sm flex flex-col items-center justify-center relative transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-cyan-500 text-black font-black shadow-lg'
                          : isToday
                          ? 'bg-zinc-900 text-white font-bold border border-cyan-400/60'
                          : item.isCurrentMonth
                          ? 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                          : 'text-zinc-600 hover:bg-zinc-900/50'
                      }`}
                    >
                      <span className="leading-none">{item.dayNum}</span>
                      
                      {item.hasNotes ? (
                        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-black' : 'bg-amber-400'}`} />
                      ) : item.hasActivity ? (
                        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-black' : 'bg-cyan-400'}`} />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Quick Presets & Actions Footer */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDateFilter('all');
                      setIsDatePickerOpen(false);
                      triggerHaptic('light');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-zinc-400 hover:text-white border border-white/10"
                  >
                    All Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDateFilter(getYesterdayStr());
                      setIsDatePickerOpen(false);
                      triggerHaptic('light');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-zinc-300 border border-white/10"
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDateFilter(getTodayStr());
                      setIsDatePickerOpen(false);
                      triggerHaptic('light');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono font-bold text-cyan-400 border border-cyan-500/30"
                  >
                    Today
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3. INLINE ASIDE NOTE COMPOSER MODAL (CREATE NOTE) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddingBlankNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 sm:p-5 bg-zinc-950/90 border-b border-white/10 shrink-0 backdrop-blur-2xl"
          >
            <form onSubmit={handleCreateBlankNote} className="max-w-3xl mx-auto space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-amber-400">
                    Add Free-Text Note / Aside
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingBlankNote(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={newBlankText}
                onChange={e => setNewBlankText(e.target.value)}
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    handleCreateBlankNote(e);
                  }
                }}
                placeholder="Type note or aside (e.g. '(Dharmavaram biryani)', '(bad diet)', 'Bhimas - chapati/veg frd ric')..."
                rows={2}
                className="w-full p-3 bg-zinc-900/90 border border-white/15 rounded-2xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                autoFocus
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                    <Calendar size={15} className="text-zinc-500" />
                    <input
                      type="date"
                      value={targetDateForNote}
                      onChange={e => setTargetDateForNote(e.target.value)}
                      className="bg-zinc-900 border border-white/10 text-white rounded-xl px-2.5 py-1 text-xs sm:text-sm font-mono cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
                    <Tag size={15} className="text-zinc-500" />
                    <select
                      value={newBlankCategory}
                      onChange={e => setNewBlankCategory(e.target.value)}
                      className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl px-2.5 py-1 text-xs sm:text-sm font-mono cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingBlankNote(false)}
                    className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-mono font-bold rounded-xl border border-white/10 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-mono font-bold rounded-xl active:scale-95 flex items-center gap-1.5 shadow-lg"
                  >
                    <Check size={15} strokeWidth={3} />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 4. QUICK SKILL SUBNOTE PICKER / COMPOSER MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {subnotePickerDate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950/95 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-zinc-100 backdrop-blur-3xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <CornerDownRight size={20} className="text-amber-400" />
                  <div>
                    <h2 className="text-base font-mono font-bold text-white">Add Subnote to Skill</h2>
                    <p className="text-xs font-mono text-zinc-400">Target Date: {subnotePickerDate}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubnotePickerDate(null)}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSkillSubnote} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Select Target Skill / Habit
                  </label>
                  <select
                    value={selectedSkillForSubnote}
                    onChange={e => setSelectedSkillForSubnote(e.target.value)}
                    required
                    className="w-full p-2.5 bg-zinc-900 border border-white/15 rounded-2xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Choose a skill --</option>
                    {skills.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.shortForm}] {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Subnote Text (e.g. food notes, reps, sets, focus detail)
                  </label>
                  <textarea
                    value={skillSubnoteInputText}
                    onChange={e => setSkillSubnoteInputText(e.target.value)}
                    placeholder="Type subnote detail (e.g. '50kg incline bench', '40min meditation focus')..."
                    rows={2}
                    required
                    className="w-full p-3 bg-zinc-900 border border-white/15 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSubnotePickerDate(null)}
                    className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs sm:text-sm font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs sm:text-sm font-mono flex items-center gap-1.5 active:scale-95 shadow-lg"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>Save Subnote</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 5. MAIN FEED CONTENT (30 : 70 MOBILE DISTRIBUTION BETWEEN NOTES AND THESE) */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar space-y-5 pb-32">
        
        {/* ==================================================== */}
        {/* MODE 1: DATE VIEW (WITH 30:70 NOTES & SKILLS SPLIT) */}
        {/* ==================================================== */}
        {listMode === 'date' && (
          <div className="max-w-4xl mx-auto space-y-5">
            {displayedDates.length === 0 ? (
              <div className="p-10 text-center text-zinc-400 font-mono text-sm rounded-3xl bg-zinc-900/60 border border-white/12 backdrop-blur-2xl shadow-xl">
                <p className="text-base font-bold text-white mb-1">No log or note entries found</p>
                <p className="text-xs text-zinc-400 mb-4">Try selecting "All Dates" or changing your category filter.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setSelectedDateFilter('all'); setSelectedCategoryFilter('all'); setFilterOption('all'); }}
                    className="px-4 py-2 bg-zinc-900 text-cyan-400 rounded-xl border border-white/10 text-xs sm:text-sm font-mono font-bold shadow-md hover:bg-zinc-800"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBlankNote(true);
                      setTargetDateForNote(selectedDateFilter !== 'all' ? selectedDateFilter : getTodayStr());
                    }}
                    className="px-4 py-2 bg-amber-400 text-black rounded-xl text-xs sm:text-sm font-mono font-bold shadow-md hover:bg-amber-300"
                  >
                    + Add Note for this Day
                  </button>
                </div>
              </div>
            ) : (
              displayedDates.map(dateStr => {
                const dayLogs = logsByDate[dateStr] || [];
                const dayBlanks = blankNotes.filter(b => {
                  if (b.date !== dateStr) return false;
                  if (selectedCategoryFilter !== 'all') {
                    return b.category === selectedCategoryFilter;
                  }
                  return true;
                });
                
                // Group by category for this date
                const catGroups: Record<string, SkillLog[]> = {};
                dayLogs.forEach(log => {
                  const s = skillsMap.get(log.skillId);
                  if (!s) return;
                  if (selectedCategoryFilter !== 'all' && s.category !== selectedCategoryFilter) return;
                  if (!catGroups[s.category]) catGroups[s.category] = [];
                  catGroups[s.category].push(log);
                });

                // All logs with subnotes on this day
                const logsWithNotesOnThisDay = dayLogs.filter(l => {
                  const s = skillsMap.get(l.skillId);
                  if (selectedCategoryFilter !== 'all' && s?.category !== selectedCategoryFilter) return false;
                  return Boolean(l.notes && l.notes.trim());
                });

                // Search Filter check
                const hasMatchingLogs = searchQuery 
                  ? dayLogs.some(l => {
                      const s = skillsMap.get(l.skillId);
                      return s?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s?.shortForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase()));
                    }) || dayBlanks.some(b => b.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  : true;

                if (!hasMatchingLogs && searchQuery) return null;

                const dateObj = new Date(dateStr + 'T12:00:00');
                const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                const dayNum = dateObj.getDate();
                const fullDateTitle = formatFullDateDisplay(dateStr);

                // Categories present on this day
                const activeCats = categories.filter(c => {
                  if (selectedCategoryFilter !== 'all' && c !== selectedCategoryFilter) return false;
                  return catGroups[c] && catGroups[c].length > 0;
                });

                const totalNotesCount = dayBlanks.length + logsWithNotesOnThisDay.length;

                return (
                  <div 
                    key={dateStr}
                    className="rounded-3xl bg-zinc-900/60 border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden"
                  >
                    {/* Date Header Bar */}
                    <div className="px-4 sm:px-5 py-3 bg-zinc-900/85 border-b border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Stacked Day Badge */}
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-zinc-950/90 border border-white/15 flex flex-col items-center justify-center shrink-0 shadow-md">
                          <span className="text-[10px] font-mono font-black text-cyan-400 tracking-wider leading-none">
                            {dayOfWeek}
                          </span>
                          <span className="text-base sm:text-lg font-mono font-black text-white leading-tight mt-0.5">
                            {dayNum}
                          </span>
                        </div>

                        {/* Full Formatted Date Title */}
                        <div className="min-w-0">
                          <span className="text-sm sm:text-lg font-bold tracking-tight text-white font-sans truncate block">
                            {fullDateTitle}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                            <span>{dayLogs.length} activity items</span>
                            {totalNotesCount > 0 && (
                              <span className="text-amber-400 font-bold">• {totalNotesCount} notes</span>
                            )}
                          </span>
                        </div>

                        {/* Jump to Day Dashboard */}
                        {onJumpToDate && (
                          <button
                            type="button"
                            onClick={() => onJumpToDate(dateStr)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                            title="Open Daily Dashboard"
                          >
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>

                      {/* Header Actions: + Subnote & + Note */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSubnotePickerDate(dateStr);
                            triggerHaptic('light');
                          }}
                          className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md backdrop-blur-md"
                          title="Attach subnote to a skill on this day"
                        >
                          <CornerDownRight size={13} className="text-amber-400" />
                          <span>+ Subnote</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTargetDateForNote(dateStr);
                            setIsAddingBlankNote(true);
                            triggerHaptic('light');
                          }}
                          className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/15 text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md backdrop-blur-md"
                          title="Add free-text note for this day"
                        >
                          <Plus size={14} />
                          <span>Note</span>
                        </button>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* 30:70 MOBILE/DESKTOP SPLIT: 70% THESE (SKILLS) & 30% NOTES */}
                    {/* ========================================================= */}
                    <div className="p-3 sm:p-4 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch">
                      
                      {/* ----------------------------------------------------- */}
                      {/* 70% COLUMN: THESE (SKILLS / HABIT EXECUTIONS / LAPS) */}
                      {/* ----------------------------------------------------- */}
                      <div className="w-full md:w-[70%] space-y-3 shrink-0 order-1 md:order-1">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Layers size={13} className="text-cyan-400" />
                            <span>Habits & Logs (70%)</span>
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {dayLogs.length} logged
                          </span>
                        </div>

                        {activeCats.length === 0 ? (
                          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/10 text-center text-xs font-mono text-zinc-400">
                            No skill activities recorded for this date.
                          </div>
                        ) : (
                          activeCats.map(cat => {
                            const items = catGroups[cat] || [];
                            if (items.length === 0) return null;

                            const isSpecialBlack = cat.toLowerCase() === 'black';
                            const themeKey = categoryColors[cat] || 'cyan';
                            const colorHex = isSpecialBlack ? '#ffffff' : THEME_COLORS[themeKey] || '#06b6d4';
                            const blockKey = `${dateStr}_${cat}`;
                            const isCollapsed = Boolean(collapsedBlocks[blockKey]);

                            return (
                              <div 
                                key={cat}
                                className="rounded-2xl bg-zinc-950/70 border border-white/10 overflow-hidden shadow-md"
                              >
                                {/* Category Header */}
                                <button
                                  type="button"
                                  onClick={() => toggleBlockCollapse(blockKey)}
                                  className="w-full px-3.5 py-2 bg-zinc-900/60 flex items-center justify-between hover:bg-zinc-900/80 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorHex }} />
                                    <span 
                                      className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider"
                                      style={{ color: colorHex }}
                                    >
                                      {cat}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono text-zinc-400">
                                      {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                    {isCollapsed ? (
                                      <ChevronDown size={14} className="text-zinc-400" />
                                    ) : (
                                      <ChevronUp size={14} className="text-zinc-400" />
                                    )}
                                  </div>
                                </button>

                                {/* Skill Rows */}
                                {!isCollapsed && (
                                  <div className="divide-y divide-white/5">
                                    {items.map(l => {
                                      const s = skillsMap.get(l.skillId);
                                      if (!s) return null;
                                      const editKey = `${l.skillId}_${l.date}`;
                                      const isEditing = editingLogKey === editKey;
                                      const imgUrl = getSkillImage(s);

                                      let valueBadge = s.shortForm;
                                      if (s.mode === 'counter') valueBadge = `${l.count || 1}`;
                                      else if (s.mode === 'measurement') valueBadge = `${l.value !== undefined ? l.value : l.count}`;
                                      else if (s.mode === 'timer') valueBadge = `${l.timerLaps?.length || (l.timerDuration ? 1 : 0)}L`;

                                      const hasTimerLaps = s.mode === 'timer' && Boolean(l.timerLaps && l.timerLaps.length > 0);

                                      return (
                                        <div key={l.skillId} className="px-3.5 py-2.5 flex flex-col gap-1.5 hover:bg-white/[0.02] transition-colors">
                                          <div className="flex items-center justify-between gap-2.5">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              {/* Square Skill Thumbnail */}
                                              <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                                                <img src={imgUrl} alt={s.name} className="w-full h-full object-cover" />
                                              </div>

                                              {/* Cyan Value Number & Skill Name with Big Clear Text */}
                                              <div className="flex items-center gap-2 truncate">
                                                <span 
                                                  onClick={() => {
                                                    if (s.mode === 'timer') {
                                                      setTimerModalSkill(s);
                                                      setTimerModalDate(dateStr);
                                                      triggerHaptic('light');
                                                    }
                                                  }}
                                                  className={`text-xs sm:text-sm font-mono font-black text-cyan-400 shrink-0 ${s.mode === 'timer' ? 'cursor-pointer hover:underline' : ''}`}
                                                >
                                                  {valueBadge}
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold text-white truncate font-sans">
                                                  {s.name}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Right Controls: Checkbox & Option Button */}
                                            <div className="flex items-center gap-2 shrink-0">
                                              {s.mode === 'timer' ? (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setTimerModalSkill(s);
                                                    setTimerModalDate(dateStr);
                                                    triggerHaptic('medium');
                                                  }}
                                                  className={`h-6 sm:h-7 px-2 rounded-lg border flex items-center gap-1.5 transition-all text-[11px] font-mono font-bold ${
                                                    hasTimerLaps || (l.timerDuration && l.timerDuration > 0)
                                                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                                                      : 'bg-zinc-900 border-white/15 text-zinc-400 hover:text-white'
                                                  }`}
                                                  title="Open Lap Manager"
                                                >
                                                  <Timer size={12} className="text-cyan-400" />
                                                  <span>{l.timerLaps?.length ? `${l.timerLaps.length}L` : 'Timer'}</span>
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleSkillCheck(s, dateStr, l)}
                                                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                                    (l.checked || (s.mode === 'counter' && l.count > 0))
                                                      ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                                                      : 'bg-zinc-900 border-white/20 text-transparent hover:border-white/40'
                                                  }`}
                                                >
                                                  <Check size={13} strokeWidth={3} />
                                                </button>
                                              )}

                                              {/* Attached note icon */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setEditingLogKey(isEditing ? null : editKey);
                                                  setEditingNoteText(l.notes || '');
                                                  triggerHaptic('light');
                                                }}
                                                className={`p-1 rounded-lg transition-colors ${
                                                  l.notes ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                                                }`}
                                                title="Add / Edit subnote"
                                              >
                                                <MoreVertical size={15} />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Timer Laps Breakdown Ribbon */}
                                          {hasTimerLaps && (
                                            <div 
                                              onClick={() => {
                                                setTimerModalSkill(s);
                                                setTimerModalDate(dateStr);
                                                triggerHaptic('light');
                                              }}
                                              className="flex items-center gap-1.5 pl-2 py-0.5 overflow-x-auto no-scrollbar cursor-pointer group"
                                            >
                                              <Timer size={12} className="text-cyan-400 shrink-0" />
                                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
                                                {l.timerLaps!.map((lap) => (
                                                  <span 
                                                    key={lap.lapNumber}
                                                    className="px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 font-bold shrink-0 flex items-center gap-1"
                                                  >
                                                    <span>L{lap.lapNumber}:</span>
                                                    <span className="text-white">{lap.formatted}</span>
                                                    {lap.note && <span className="text-amber-300">({lap.note})</span>}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Attached Subnote (Inline Editor) */}
                                          {isEditing && (
                                            <div className="flex items-center gap-2 pl-2 py-1">
                                              <input
                                                type="text"
                                                value={editingNoteText}
                                                onChange={e => setEditingNoteText(e.target.value)}
                                                onKeyDown={e => {
                                                  if (e.key === 'Enter') handleSaveLogNote(l.skillId, l.date);
                                                  if (e.key === 'Escape') setEditingLogKey(null);
                                                }}
                                                placeholder="Enter subnote detail..."
                                                className="flex-1 text-xs px-2.5 py-1 bg-zinc-900 border border-amber-400/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none font-mono"
                                                autoFocus
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleSaveLogNote(l.skillId, l.date)}
                                                className="px-2.5 py-1 bg-amber-400 text-black rounded-lg font-bold text-xs hover:bg-amber-300"
                                              >
                                                <Check size={13} strokeWidth={3} />
                                              </button>
                                              {l.notes && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteLogNote(l.skillId, l.date)}
                                                  className="p-1 text-zinc-500 hover:text-rose-400"
                                                >
                                                  <Trash2 size={13} />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => setEditingLogKey(null)}
                                                className="p-1 text-zinc-400 hover:text-white"
                                              >
                                                <X size={13} />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* ----------------------------------------------------- */}
                      {/* 30% COLUMN: NOTES STREAM (SUBNOTES & ASIDES) */}
                      {/* ----------------------------------------------------- */}
                      <div className="w-full md:w-[30%] flex flex-col gap-2.5 shrink-0 order-2 md:order-2 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <StickyNote size={13} className="text-amber-400" />
                            <span>Notes (30%)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetDateForNote(dateStr);
                              setIsAddingBlankNote(true);
                              triggerHaptic('light');
                            }}
                            className="text-[10px] font-mono text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} />
                            <span>Add</span>
                          </button>
                        </div>

                        {/* If no notes exist on this day */}
                        {dayBlanks.length === 0 && logsWithNotesOnThisDay.length === 0 ? (
                          <div 
                            onClick={() => {
                              setTargetDateForNote(dateStr);
                              setIsAddingBlankNote(true);
                            }}
                            className="p-4 rounded-2xl bg-amber-500/5 border border-dashed border-amber-500/20 text-center text-xs font-mono text-zinc-400 hover:bg-amber-500/10 cursor-pointer transition-colors"
                          >
                            <span className="block text-amber-300/80 mb-1">+ Add Note</span>
                            <span className="text-[10px] text-zinc-400">Diet, thoughts, reps & focus</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* Skill Subnotes Stream */}
                            {logsWithNotesOnThisDay.map(l => {
                              const s = skillsMap.get(l.skillId);
                              if (!s) return null;
                              const editKey = `${l.skillId}_${l.date}`;

                              return (
                                <div 
                                  key={`subnote_${l.skillId}`}
                                  onClick={() => {
                                    setEditingLogKey(editKey);
                                    setEditingNoteText(l.notes || '');
                                    triggerHaptic('light');
                                  }}
                                  className="group p-2.5 rounded-2xl bg-zinc-950/80 border border-amber-500/30 hover:border-amber-400/60 transition-all cursor-pointer shadow-sm"
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-mono font-black uppercase text-cyan-400 truncate">
                                      [{s.shortForm}] {s.name}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteLogNote(l.skillId, l.date);
                                        }}
                                        className="text-zinc-500 hover:text-rose-400 p-0.5"
                                        title="Delete subnote"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs font-mono text-amber-200 break-words leading-tight">
                                    "{l.notes}"
                                  </p>
                                </div>
                              );
                            })}

                            {/* Free-text Asides Stream */}
                            {dayBlanks.map(b => {
                              const isEditingThisAside = editingBlankNoteId === b.id;

                              if (isEditingThisAside) {
                                return (
                                  <div key={b.id} className="p-2.5 rounded-2xl bg-zinc-900 border border-amber-400/50 space-y-2">
                                    <input
                                      type="text"
                                      value={editingBlankText}
                                      onChange={e => setEditingBlankText(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') handleSaveBlankNoteEdit(b.id);
                                        if (e.key === 'Escape') setEditingBlankNoteId(null);
                                      }}
                                      className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                                      autoFocus
                                    />
                                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveBlankNoteEdit(b.id)}
                                        className="px-2 py-0.5 bg-amber-400 text-black text-[11px] font-mono font-bold rounded"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingBlankNoteId(null)}
                                        className="text-[11px] font-mono text-zinc-400 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div 
                                  key={b.id}
                                  className="group p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 border-l-3 border-l-amber-400 hover:bg-amber-500/15 transition-all shadow-sm"
                                >
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      {formatNoteTime(b.timestamp)}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={() => handleCopyNote(b.text)}
                                        className="text-zinc-400 hover:text-white p-0.5"
                                        title="Copy note text"
                                      >
                                        <Copy size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingBlankNoteId(b.id);
                                          setEditingBlankText(b.text);
                                          setEditingBlankCategory(b.category || '');
                                        }}
                                        className="text-zinc-400 hover:text-amber-300 p-0.5"
                                        title="Edit note"
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => onDeleteBlankNote(b.id)}
                                        className="text-zinc-400 hover:text-rose-400 p-0.5"
                                        title="Delete note"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs font-mono text-amber-100 break-words leading-tight">
                                    "{b.text}"
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* MODE 2: CATEGORY-WISE VIEW (GLASS BENTO ARCHIVE CARDS) */}
        {/* ==================================================== */}
        {listMode === 'category' && (
          <div className="max-w-4xl mx-auto space-y-5">
            {categories
              .filter(cat => selectedCategoryFilter === 'all' || cat === selectedCategoryFilter)
              .map(cat => {
                const isSpecialBlack = cat.toLowerCase() === 'black';
                const themeKey = categoryColors[cat] || 'cyan';
                const colorHex = isSpecialBlack ? '#ffffff' : THEME_COLORS[themeKey] || '#06b6d4';

                // Get all logs belonging to this category
                const catLogs = logs.filter(l => {
                  const s = skillsMap.get(l.skillId);
                  return s?.category === cat && (l.count > 0 || l.checked || l.notes || (l.timerLaps && l.timerLaps.length > 0));
                });

                if (catLogs.length === 0) return null;

                // Group by date
                const dateMap: Record<string, SkillLog[]> = {};
                catLogs.forEach(l => {
                  if (!dateMap[l.date]) dateMap[l.date] = [];
                  dateMap[l.date].push(l);
                });

                const catDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a));

                return (
                  <div 
                    key={cat}
                    className="rounded-3xl bg-zinc-900/60 border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden"
                  >
                    <div className="px-5 py-3.5 bg-zinc-900/80 border-b border-white/10 flex items-center justify-between">
                      <h2 
                        className="text-sm sm:text-base font-mono font-black uppercase tracking-wider flex items-center gap-2"
                        style={{ color: colorHex }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorHex }} />
                        {cat} ARCHIVE
                      </h2>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-zinc-950/80 text-zinc-300 border border-white/10">
                        {catLogs.length} entries
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      {catDates.map(dStr => {
                        const dayItems = dateMap[dStr];
                        const summary = dayItems.map(l => {
                          const s = skillsMap.get(l.skillId);
                          if (!s) return '';
                          if (s.mode === 'counter') return `${s.shortForm} ${l.count}`;
                          if (s.mode === 'timer' && l.timerLaps?.length) return `${s.shortForm} (${l.timerLaps.length}L)`;
                          return s.shortForm;
                        }).filter(Boolean).join(', ');

                        return (
                          <div 
                            key={dStr}
                            className="flex flex-col gap-2 p-3.5 rounded-2xl bg-zinc-950/70 border border-white/10 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDateFilter(dStr);
                                  setListMode('date');
                                  triggerHaptic('light');
                                }}
                                className="text-sm sm:text-base font-mono font-bold text-cyan-400 hover:underline text-left shrink-0"
                                title="Filter to this date in Date view"
                              >
                                {dStr}
                              </button>
                              <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wide truncate text-right">
                                {summary}
                              </span>
                            </div>

                            {/* Subnotes if any */}
                            {dayItems.some(i => i.notes) && (
                              <div className="text-xs sm:text-sm text-amber-300 font-mono pl-3 pt-1 border-t border-white/5 flex items-center gap-2">
                                <CornerDownRight size={13} className="text-amber-400 shrink-0" />
                                <span className="truncate">"{dayItems.find(i => i.notes)?.notes}"</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ==================================================== */}
        {/* MODE 3: OVERALL CHRONOLOGICAL STREAM (GLASS BENTO) */}
        {/* ==================================================== */}
        {listMode === 'overall' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/60 border border-white/12 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <h2 className="text-sm sm:text-base font-mono font-black uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2.5">
                <Layers size={18} className="text-cyan-400" /> CHRONOLOGICAL MASTER STREAM
              </h2>

              <div className="space-y-3">
                {sortedDates.map(dStr => {
                  let dayLogs = logsByDate[dStr] || [];
                  let dayBlanks = blankNotes.filter(b => b.date === dStr);

                  if (selectedCategoryFilter !== 'all') {
                    dayLogs = dayLogs.filter(l => {
                      const s = skillsMap.get(l.skillId);
                      return s?.category === selectedCategoryFilter;
                    });
                    dayBlanks = dayBlanks.filter(b => b.category === selectedCategoryFilter);
                  }

                  if (dayLogs.length === 0 && dayBlanks.length === 0) return null;

                  return (
                    <div key={dStr} className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col gap-2.5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDateFilter(dStr);
                            setListMode('date');
                            triggerHaptic('light');
                          }}
                          className="font-mono text-sm sm:text-base text-cyan-400 hover:underline font-bold text-left shrink-0"
                          title="View this day in Date view"
                        >
                          {dStr}
                        </button>

                        <div className="flex flex-wrap gap-2">
                          {dayLogs.map(l => {
                            const s = skillsMap.get(l.skillId);
                            if (!s) return null;
                            const isSpecialBlack = s.category.toLowerCase() === 'black';
                            const colorHex = isSpecialBlack ? '#ffffff' : THEME_COLORS[categoryColors[s.category] || 'cyan'] || '#06b6d4';

                            let label = s.shortForm;
                            if (s.mode === 'counter' && l.count > 0) label += ` ${l.count}`;
                            if (s.mode === 'timer' && l.timerLaps?.length) label += ` (${l.timerLaps.length}L)`;

                            return (
                              <span 
                                key={l.skillId}
                                className="px-2.5 py-1 rounded-xl font-mono text-xs sm:text-sm font-black bg-zinc-900 border border-white/10 shadow-sm"
                                style={{ color: colorHex }}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Any subnotes / asides for this date */}
                      {(dayLogs.some(l => l.notes) || dayBlanks.length > 0) && (
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                          {dayLogs.filter(l => l.notes).map(l => (
                            <div key={l.skillId} className="flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-300 pl-2">
                              <CornerDownRight size={13} className="text-amber-400 shrink-0" />
                              <span className="truncate">"{l.notes}"</span>
                            </div>
                          ))}
                          {dayBlanks.map(b => (
                            <div key={b.id} className="flex items-center gap-2 text-xs sm:text-sm font-mono text-zinc-300 pl-2">
                              <FileText size={13} className="text-zinc-500 shrink-0" />
                              <span className="truncate">aside: "{b.text}"</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Lap & Stopwatch Manager Modal (CRUD) */}
      {timerModalSkill && timerModalDate && (
        <TimerSkillModal
          isOpen={true}
          onClose={() => {
            setTimerModalSkill(null);
            setTimerModalDate('');
          }}
          skill={timerModalSkill}
          dateStr={timerModalDate}
          existingLog={logs.find(l => l.skillId === timerModalSkill.id && l.date === timerModalDate)}
          onSaveTimerLog={(skillId, date, laps, totalDuration) => {
            onUpdateLog(skillId, date, {
              timerLaps: laps,
              timerDuration: totalDuration,
              checked: laps.length > 0 || totalDuration > 0
            });
          }}
        />
      )}
    </div>
  );
}
