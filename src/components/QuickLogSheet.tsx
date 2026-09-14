import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Check, X } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { THEMES, playTick } from './DailyDashboardView';
import { AVAILABLE_ICONS } from './icons';
import { triggerHaptic } from '../lib/haptics';

interface QuickLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  logs: SkillLog[];
  dateLogs: SkillLog[];
  currentDateStr: string;
  categoryColors: Record<string, string>;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
}

export default function QuickLogSheet({
  isOpen, onClose, skills, logs, dateLogs, currentDateStr, categoryColors, onUpdateLog
}: QuickLogSheetProps) {
  // Determine most recently used category
  const defaultCategory = useMemo(() => {
    if (logs.length > 0) {
      const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
      for (const log of sortedLogs) {
        if (log.count > 0 || log.checked) {
          const skill = skills.find(s => s.id === log.skillId);
          if (skill) return skill.category;
        }
      }
    }
    return skills.length > 0 ? skills[0].category : '';
  }, [logs, skills, isOpen]);

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const categoryContainerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => Array.from(new Set(skills.map(s => s.category))), [skills]);

  useEffect(() => {
    if (isOpen && categoryContainerRef.current) {
      const activeBtn = categoryContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveCategory(defaultCategory);
      setSearchQuery('');
      setFocusedIndex(-1);
    }
  }, [isOpen, defaultCategory]);

  const displayedSkills = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return skills.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return skills.filter(s => s.category === activeCategory);
  }, [activeCategory, searchQuery, skills]);

  useEffect(() => {
    setFocusedIndex(prev => prev >= displayedSkills.length ? Math.max(0, displayedSkills.length - 1) : prev);
  }, [displayedSkills.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an actual input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        if (searchQuery) setSearchQuery('');
        else onClose();
        return;
      }

      if (e.key === 'Backspace') {
        setSearchQuery(prev => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setSearchQuery(prev => prev + e.key);
        setFocusedIndex(0);
        return;
      }

      if (displayedSkills.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex(prev => (prev < displayedSkills.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < displayedSkills.length) {
        e.preventDefault();
        const skill = displayedSkills[focusedIndex];
        const log = dateLogs.find(l => l.skillId === skill.id) || { count: 0, checked: false };
        if (skill.mode === 'counter') {
          triggerHaptic('light');
          playTick();
          onUpdateLog(skill.id, currentDateStr, { count: log.count + 1 });
        } else {
          triggerHaptic('success');
          if (!log.checked) playTick();
          onUpdateLog(skill.id, currentDateStr, { checked: !log.checked });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayedSkills, focusedIndex, searchQuery, onClose, dateLogs, currentDateStr, onUpdateLog]);

  const handleSwipe = (dir: 'next' | 'prev') => {
    if (searchQuery) return; // Don't swipe while searching
    const currentIndex = categories.indexOf(activeCategory);
    if (currentIndex === -1) return;
    
    if (dir === 'next' && currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1]);
      triggerHaptic('light');
    } else if (dir === 'prev' && currentIndex > 0) {
      setActiveCategory(categories[currentIndex - 1]);
      triggerHaptic('light');
    }
  };

  const startRef = useRef<{ x: number, y: number } | null>(null);

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
    
    // Horizontal swipe must be deliberate
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 2) {
      handleSwipe(dx > 0 ? 'next' : 'prev');
    }
    startRef.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[800px] sm:h-[600px] sm:max-h-[85vh] bg-zinc-950 sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl z-[101] flex flex-col sm:flex-row overflow-hidden max-h-[85vh]"
          >
            {/* Mobile Category Header (Horizontal) */}
            <div className="sm:hidden flex items-center p-4 border-b border-white/5 bg-zinc-900/50">
              <div ref={categoryContainerRef} className="flex-1 overflow-x-auto custom-scrollbar flex gap-2 pb-2 -mb-2 scroll-smooth">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                    tabIndex={0}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors focus:ring-2 focus:ring-white focus:outline-none ${activeCategory === cat && !searchQuery ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="ml-4 p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors shrink-0 focus:ring-2 focus:ring-white focus:outline-none">
                <X size={20} />
              </button>
            </div>

            {/* Tablet/Desktop Category Sidebar (Vertical) */}
            <div className="hidden sm:flex flex-col w-64 border-r border-white/5 bg-zinc-900/30 p-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white tracking-tight">Quick Log</h3>
                <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors focus:ring-2 focus:ring-white focus:outline-none">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {categories.map(cat => {
                  const themeName = categoryColors[cat] || 'cyan';
                  const theme = THEMES[themeName] || THEMES['cyan'];
                  const isActive = activeCategory === cat && !searchQuery;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                      tabIndex={0}
                      className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all focus:ring-2 focus:ring-white focus:outline-none ${isActive ? 'bg-zinc-800/80 text-white shadow-md border-l-2 border-white' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border-l-2 border-transparent'}`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-3 ${theme.bgActive.split(' ')[0]} ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div 
              className="flex-1 flex flex-col min-h-0 bg-zinc-950"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {searchQuery && (
                <div className="p-4 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between">
                  <div className="text-sm font-medium text-zinc-400">
                    Searching: <span className="text-white font-bold">{searchQuery}</span>
                  </div>
                  <button onClick={() => setSearchQuery('')} className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest font-bold focus:ring-2 focus:ring-white focus:outline-none rounded px-2 py-1 bg-zinc-900 border border-white/10">Clear</button>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col gap-3">
                {displayedSkills.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                    No skills found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 content-start">
                    {displayedSkills.map((skill, index) => {
                      const log = dateLogs.find(l => l.skillId === skill.id) || { count: 0, checked: false };
                      const themeName = categoryColors[skill.category] || 'cyan';
                      const theme = THEMES[themeName] || THEMES['cyan'];
                      const Icon = AVAILABLE_ICONS[skill.icon || 'Activity'] || AVAILABLE_ICONS['Activity'];
                      const isActive = skill.mode === 'counter' ? log.count > 0 : log.checked;
                      const isFocused = focusedIndex === index;

                      return (
                        <div 
                          key={skill.id}
                          tabIndex={0}
                          onFocus={() => setFocusedIndex(index)}
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all focus:ring-2 focus:ring-white focus:outline-none ${isActive ? theme.bgActive : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-800/50'} ${isFocused ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : ''}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${isActive ? theme.iconColor : 'bg-zinc-800 text-zinc-400'}`}>
                              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="sm:hidden" />
                              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="hidden sm:block" />
                            </div>
                            <div className="min-w-0">
                              <div className={`font-bold truncate text-base sm:text-lg ${isActive ? 'text-white' : 'text-zinc-200'}`}>{skill.name}</div>
                              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate mt-0.5">{skill.category}</div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center ml-2 sm:ml-4">
                            {skill.mode === 'counter' ? (
                              <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5">
                                <button 
                                  tabIndex={-1}
                                  onClick={() => {
                                    if (log.count > 0) {
                                      triggerHaptic('light');
                                      onUpdateLog(skill.id, currentDateStr, { count: log.count - 1 });
                                    }
                                  }}
                                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className={`w-8 sm:w-10 text-center font-bold text-base sm:text-lg ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                  {log.count}
                                </span>
                                <button 
                                  tabIndex={-1}
                                  onClick={() => {
                                    triggerHaptic('light');
                                    playTick();
                                    onUpdateLog(skill.id, currentDateStr, { count: log.count + 1 });
                                  }}
                                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                tabIndex={-1}
                                onClick={() => {
                                  triggerHaptic('success');
                                  if (!log.checked) playTick();
                                  onUpdateLog(skill.id, currentDateStr, { checked: !log.checked });
                                }}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-white text-black scale-105' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white'}`}
                              >
                                <Check size={20} strokeWidth={isActive ? 4 : 2} className="sm:hidden" />
                                <Check size={24} strokeWidth={isActive ? 4 : 2} className="hidden sm:block" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
