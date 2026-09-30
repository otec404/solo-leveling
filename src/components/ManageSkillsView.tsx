import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Activity, X, Search, Filter, LayoutGrid, List, Sparkles, BookOpen } from 'lucide-react';
import { Skill, TrackingMode } from '../types';
import { getCategoryTheme, THEMES } from './DailyDashboardView';
import { triggerHaptic } from '../lib/haptics';
import { AVAILABLE_ICONS, ALL_LUCIDE_ICON_NAMES, getSkillIcon, getRespectiveIconName } from './icons';
import MiniIconsSection from './MiniIconsSection';
import CardIconStudioModal from './CardIconStudioModal';

interface ManageSkillsViewProps {
  skills: Skill[];
  categories: string[];
  categoryColors: Record<string, string>;
  onAddSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  onUpdateSkill: (id: string, skill: Partial<Skill>) => void;
  onDeleteSkill: (id: string) => void;
  onAddCategory: (category: string) => void;
  onUpdateCategoryColor: (category: string, color: string) => void;
  onOpenAppendix?: () => void;
  onOpenStudio?: (skillId?: string) => void;
}

export default function ManageSkillsView({
  skills, categories, categoryColors, onAddSkill, onUpdateSkill, onDeleteSkill, onAddCategory, onUpdateCategoryColor, onOpenAppendix, onOpenStudio
}: ManageSkillsViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAppView, setIsAppView] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isIconStudioOpen, setIsIconStudioOpen] = useState(false);
  const [iconStudioSkillId, setIconStudioSkillId] = useState<string | undefined>(undefined);

  const handleOpenIconStudio = (skillId?: string) => {
    if (onOpenStudio) {
      onOpenStudio(skillId);
    } else {
      setIconStudioSkillId(skillId);
      setIsIconStudioOpen(true);
    }
  };
  
  // Form State
  const [name, setName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [mode, setMode] = useState<TrackingMode>('counter');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Diet');
  const [customCategory, setCustomCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [iconSearch, setIconSearch] = useState('');
  const [iconPage, setIconPage] = useState(1);

  const filteredFormIcons = useMemo(() => {
    if (!iconSearch.trim()) return ALL_LUCIDE_ICON_NAMES;
    const q = iconSearch.toLowerCase().trim();
    return ALL_LUCIDE_ICON_NAMES.filter(name => name.toLowerCase().includes(q));
  }, [iconSearch]);

  const displayedFormIcons = useMemo(() => {
    return filteredFormIcons.slice(0, iconPage * 72);
  }, [filteredFormIcons, iconPage]);

  const openForm = (skill?: Skill) => {
    triggerHaptic('light');
    setIconSearch('');
    setIconPage(1);
    if (skill) {
      setIsEditing(skill.id);
      setName(skill.name);
      setShortForm(skill.shortForm);
      setMode(skill.mode);
      setUnit(skill.unit || '');
      setDescription(skill.description || '');
      if (categories.includes(skill.category)) {
        setCategory(skill.category);
        setCustomCategory('');
        setCategoryColor(categoryColors[skill.category] || '');
        setIcon(skill.icon || getRespectiveIconName(skill));
      } else {
        setCategory('Custom');
        setCustomCategory(skill.category);
        setCategoryColor(categoryColors[skill.category] || '');
        setIcon(skill.icon || getRespectiveIconName(skill));
      }
    } else {
      setIsEditing(null);
      setIcon('Target');
      setName('');
      setShortForm('');
      setMode('counter');
      setUnit('');
      setDescription('');
      setCategory(categories[0] || 'Diet');
      setCustomCategory('');
      setCategoryColor(categoryColors[categories[0] || 'Diet'] || '');
    }
    setIsFormOpen(true);
  };

  const handlePreloadWeightPreset = () => {
    setName('Body Weight');
    setShortForm('Wt');
    setMode('measurement');
    setUnit('kg');
    setDescription('Daily morning / evening body weight scale reading');
    setCategory('Fitness');
    setIcon('Scale');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    if (val !== 'Custom') {
       setCategoryColor(categoryColors[val] || '');
    } else {
       setCategoryColor('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = category;
    if (category === 'Custom') {
      finalCategory = customCategory.trim() || 'Uncategorized';
      onAddCategory(finalCategory);
    }
    
    if (categoryColor) {
       onUpdateCategoryColor(finalCategory, categoryColor);
    }

    const skillData = { 
      name, 
      shortForm, 
      mode, 
      category: finalCategory, 
      icon, 
      unit: unit.trim() || undefined,
      description: description.trim() || undefined
    };
    if (isEditing) {
      onUpdateSkill(isEditing, skillData);
    } else {
      onAddSkill(skillData);
    }
    closeForm();
  };

  
  const COLOR_CLASSES: Record<string, { card: string, border: string }> = {
    emerald: { card: 'bg-gradient-to-b from-emerald-400 to-emerald-600', border: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] bg-emerald-500/20' },
    rose: { card: 'bg-gradient-to-b from-rose-400 to-rose-600', border: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] bg-rose-500/20' },
    violet: { card: 'bg-gradient-to-b from-violet-400 to-violet-600', border: 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] bg-violet-500/20' },
    amber: { card: 'bg-gradient-to-b from-amber-400 to-amber-600', border: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] bg-amber-500/20' },
    cyan: { card: 'bg-gradient-to-b from-cyan-400 to-cyan-600', border: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-500/20' },
    indigo: { card: 'bg-gradient-to-b from-indigo-400 to-indigo-600', border: 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] bg-indigo-500/20' },
    fuchsia: { card: 'bg-gradient-to-b from-fuchsia-400 to-fuchsia-600', border: 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.4)] bg-fuchsia-500/20' },
    black: { card: 'bg-black border border-white', border: 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-white/20' }
  };

  const AVAILABLE_COLORS = ['emerald', 'rose', 'violet', 'amber', 'cyan', 'indigo', 'fuchsia', 'black'];



  return (
    <div className="p-3.5 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-4 sm:gap-8 w-full h-full overflow-y-auto pb-36 md:pb-12 touch-scroll">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 border-b border-zinc-800/80 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white mb-1 sm:mb-2">Manage Skills</h1>
          <p className="text-xs sm:text-base text-zinc-500">Create, edit, or remove the skills you want to track.</p>
        </div>
        
        {!isFormOpen && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/80 shrink-0">
              <button
                onClick={() => setIsAppView(false)}
                className={`p-2 sm:py-1.5 sm:px-3 rounded-lg transition-all flex items-center gap-2 ${!isAppView ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only text-xs font-semibold">List</span>
              </button>
              <button
                onClick={() => setIsAppView(true)}
                className={`p-2 sm:py-1.5 sm:px-3 rounded-lg transition-all flex items-center gap-2 ${isAppView ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                aria-label="App View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only text-xs font-semibold">App</span>
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => handleOpenIconStudio()}
              className="sm:hidden flex items-center justify-center p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 active:scale-95 shrink-0 transition-colors shadow-sm"
              title="Open Mini Icons Studio"
              aria-label="Open Mini Icons Studio"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </button>

            {onOpenAppendix && (
              <button
                type="button"
                onClick={onOpenAppendix}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
                title="Open Short Forms Reference & Historical Archive"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Appendix Reference (B & C)</span>
                <span className="sm:hidden">Appendix</span>
              </button>
            )}

            <button 
              onClick={() => openForm()}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors focus:outline-none shadow-lg shadow-cyan-900/20 flex-1 sm:flex-initial shrink-0"
            >
              <Plus className="w-4 h-4" /> 
              <span>Create New Skill</span>
            </button>
          </div>
        )}
      </header>

      {!isFormOpen && (
        <MiniIconsSection
          skills={skills}
          onUpdateSkill={onUpdateSkill}
          onOpenStudio={handleOpenIconStudio}
          categoryColors={categoryColors}
        />
      )}

      {/* Edit / Create Skill Modal Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none font-sans">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closeForm}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              key="form-modal"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#09090e] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 z-10"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-2 sm:hidden shrink-0" />

              {/* Modal Header */}
              <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <h2 className="text-base sm:text-lg font-mono font-black text-white tracking-tight">
                    {isEditing ? 'Edit Skill' : 'Create New Skill'}
                  </h2>
                </div>
                <button 
                  type="button"
                  onClick={closeForm}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 active:scale-95"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                <form id="skill-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                      <input 
                        required value={name} 
                        onChange={e => {
                          const val = e.target.value;
                          setName(val);
                          if (!isEditing) {
                            const suggested = getRespectiveIconName({ name: val });
                            if (suggested && suggested !== 'Target') {
                              setIcon(suggested);
                            }
                          }
                        }} 
                        placeholder="e.g. Carrot, Bench Press, Code, Meditate" 
                        className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Short Form (Max 4 chars)</label>
                      <input 
                        required value={shortForm} onChange={e => setShortForm(e.target.value)} maxLength={4} placeholder="e.g. Ca, BP, CD" 
                        className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-sm font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Description (Optional)</label>
                      <input 
                        value={description} onChange={e => setDescription(e.target.value)} placeholder="Short target / notes" 
                        className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                      <select value={category} onChange={handleCategoryChange} className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all text-sm">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Custom">Custom...</option>
                      </select>
                    </div>
                    
                    <AnimatePresence>
                      {category === 'Custom' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <div className="pt-1">
                            <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Custom Category</label>
                            <input required value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="New category name" className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none text-sm" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Tracker Mode</label>
                        <button
                          type="button"
                          onClick={handlePreloadWeightPreset}
                          className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
                        >
                          + Weight Preset
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-zinc-950/80 border border-white/10 rounded-xl gap-1">
                        <button type="button" onClick={() => setMode('counter')} className={`min-h-[38px] py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${mode === 'counter' ? 'bg-cyan-500 text-black shadow-sm font-black' : 'text-zinc-400 hover:text-white'}`}>Counter</button>
                        <button type="button" onClick={() => setMode('checkbox')} className={`min-h-[38px] py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${mode === 'checkbox' ? 'bg-cyan-500 text-black shadow-sm font-black' : 'text-zinc-400 hover:text-white'}`}>Checkbox</button>
                        <button type="button" onClick={() => setMode('timer')} className={`min-h-[38px] py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${mode === 'timer' ? 'bg-cyan-500 text-black shadow-sm font-black' : 'text-zinc-400 hover:text-white'}`}>Timer</button>
                        <button type="button" onClick={() => setMode('measurement')} className={`min-h-[38px] py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${mode === 'measurement' ? 'bg-cyan-500 text-black shadow-sm font-black' : 'text-zinc-400 hover:text-white'}`}>Measure</button>
                      </div>
                    </div>
                    
                    {(mode === 'counter' || mode === 'measurement') && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div>
                          <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                            {mode === 'measurement' ? 'Unit (e.g. kg, lbs, cm, %)' : 'Unit (Optional, e.g. reps, mins, cups)'}
                          </label>
                          <input value={unit} onChange={e => setUnit(e.target.value)} placeholder={mode === 'measurement' ? "e.g. kg, lbs, cm" : "e.g. reps, km, mins"} className="block w-full px-4 py-2.5 sm:py-3 bg-zinc-950/80 border border-white/10 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none text-sm" />
                        </div>
                      </motion.div>
                    )}

                    {mode === 'timer' && (
                      <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 font-mono">
                        ⏱ <strong>Timer Mode</strong>: Logs sessions and lap splits.
                      </div>
                    )}
                    
                    {/* Mini Icon Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                          Mini Icon
                        </label>
                        {icon && (
                          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                            <span className="text-zinc-500">Selected:</span>
                            <strong className="text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-white/10">{icon}</strong>
                          </div>
                        )}
                      </div>

                      <div className="relative mb-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                          type="text"
                          value={iconSearch}
                          onChange={(e) => { setIconSearch(e.target.value); setIconPage(1); }}
                          placeholder="Search icons (e.g. gym, bike, code)..."
                          className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        {iconSearch && (
                          <button 
                            type="button" 
                            onClick={() => { setIconSearch(''); setIconPage(1); }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-[140px] overflow-y-auto p-2 bg-zinc-950/60 border border-white/10 rounded-xl custom-scrollbar">
                        {displayedFormIcons.map(iconName => {
                          const IconComponent = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Target;
                          const isSelected = icon === iconName;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              title={iconName}
                              onClick={() => { setIcon(iconName); triggerHaptic('light'); }}
                              className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center transition-all p-1 group ${
                                isSelected 
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm' 
                                  : 'bg-zinc-900/80 text-zinc-400 border border-transparent hover:bg-zinc-800 hover:text-white'
                              }`}
                            >
                              <IconComponent size={16} className="group-hover:scale-110 transition-transform" />
                              <span className="text-[7.5px] truncate w-full text-center mt-0.5 opacity-60 leading-none">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Theme Color Selection */}
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Theme Accent</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {AVAILABLE_COLORS.map(c => {
                          const theme = COLOR_CLASSES[c] || COLOR_CLASSES['cyan'];
                          const isActive = categoryColor === c || (!categoryColor && c === 'cyan');
                          return (
                            <button
                              key={c}
                              type="button"
                              aria-label={`Select theme ${c}`}
                              aria-pressed={isActive}
                              onClick={() => setCategoryColor(c)}
                              className={`h-9 rounded-xl border-2 p-0.5 transition-all ${
                                isActive 
                                  ? `${theme.border} scale-105`
                                  : `border-transparent bg-zinc-900 hover:bg-zinc-800 opacity-60 hover:opacity-100`
                              }`}
                            >
                              <div className={`w-full h-full rounded-lg ${theme.card} flex items-center justify-center shadow-inner`}>
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 bg-black/60 flex items-center justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={closeForm} 
                  className="px-4 py-2 min-h-[38px] flex items-center justify-center rounded-xl font-mono text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="skill-form"
                  className="px-5 py-2 min-h-[38px] flex items-center justify-center rounded-xl font-mono text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-md shadow-cyan-500/25 active:scale-95"
                >
                  {isEditing ? 'Save Changes' : 'Create Skill'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={isAppView ? "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4" : "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4 mt-4"}>
        <AnimatePresence>
          {skills.map(skill => {
            const theme = getCategoryTheme(skill.category, categoryColors);

            if (isAppView) {
              const IconComp = getSkillIcon(skill);
              return (
                <motion.div 
                  key={skill.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2 relative group"
                >
                  <button
                     onClick={() => openForm(skill)}
                     className={`relative flex flex-col items-center justify-between p-3.5 w-full aspect-square rounded-2xl sm:rounded-3xl border transition-all duration-200 active:scale-95 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_inset_0_0_20px_rgba(255,255,255,0.03)] backdrop-blur-xl bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border-white/10 hover:border-white/25 hover:-translate-y-1`}
                  >
                     {/* Specular hairline */}
                     <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                     {/* Top row with short form */}
                     <div className="flex items-center justify-between w-full min-w-0 z-10">
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-tighter">
                          {skill.shortForm || skill.name.slice(0, 3)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        </div>
                     </div>

                     {/* Center Icon */}
                     <div className="relative my-auto flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/25 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                       <IconComp size={24} strokeWidth={skill.iconStroke || 2.2} className={skill.iconColor || theme.iconColor} />
                     </div>

                     {/* Skill Name */}
                     <span className="text-[10px] sm:text-[11px] font-bold text-zinc-300 group-hover:text-white tracking-tight w-full text-center px-1 truncate z-10">
                        {skill.name}
                     </span>
                     
                     {/* Action floating buttons on hover */}
                     <div className="absolute top-2 left-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                        <div 
                          role="button"
                          tabIndex={0}
                          title="Customize Icon"
                          onClick={(e) => { e.stopPropagation(); handleOpenIconStudio(skill.id); }}
                          className="w-7 h-7 rounded-xl bg-zinc-900 border border-white/20 text-cyan-400 hover:text-white hover:bg-cyan-500 flex items-center justify-center backdrop-blur-md transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-90"
                        >
                          <Sparkles size={12} />
                        </div>
                     </div>

                     <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                        <div 
                          role="button"
                          tabIndex={0}
                          title="Delete Skill"
                          onClick={(e) => { e.stopPropagation(); onDeleteSkill(skill.id); }}
                          className="w-7 h-7 rounded-xl bg-zinc-900 border border-white/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-90"
                        >
                          <Trash2 size={12} />
                        </div>
                     </div>
                  </button>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-400 tracking-wide w-full text-center px-1 truncate">
                     {skill.name}
                  </span>
                </motion.div>
              );
            }

            const IconComp = getSkillIcon(skill);

            return (
            <motion.div 
              key={skill.id} 
              layout 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.2 }} 
              className={`bg-gradient-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-950/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/25 relative group flex items-center justify-between gap-4 transition-all hover:bg-zinc-850/60 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),_inset_0_0_20px_rgba(255,255,255,0.03)]`}
            >
              {/* Top specular highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 z-10 relative">
                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center font-black text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${theme.textCategory}`}>
                  <IconComp size={22} strokeWidth={skill.iconStroke || 2.2} className={skill.iconColor || ''} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-bold text-white tracking-tight truncate">{skill.name}</h3>
                    {skill.shortForm && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase">
                        {skill.shortForm}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs text-zinc-500 font-mono">
                    <span>{skill.category}</span>
                    <span>·</span>
                    <span className="capitalize">{skill.mode}</span>
                    {skill.unit && (
                      <>
                        <span>·</span>
                        <span>{skill.unit}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0 z-10">
                <button 
                  title="Customize Mini Icon"
                  aria-label={`Customize icon for ${skill.name}`}
                  onClick={() => handleOpenIconStudio(skill.id)}
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all active:scale-95 shrink-0"
                >
                  <Sparkles size={15} />
                </button>
                <button aria-label={`Edit ${skill.name}`} onClick={() => openForm(skill)} className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shrink-0"><Edit2 size={15} /></button>
                <button aria-label={`Delete ${skill.name}`} onClick={() => onDeleteSkill(skill.id)} className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 shrink-0"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          )})}
          
          {skills.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
              <Activity className="w-8 h-8 text-zinc-600 mb-4" />
              <p className="text-zinc-500 text-sm sm:text-base">No skills defined yet.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isIconStudioOpen && (
          <CardIconStudioModal
            isOpen={isIconStudioOpen}
            onClose={() => setIsIconStudioOpen(false)}
            skills={skills}
            initialSkillId={iconStudioSkillId}
            onUpdateSkill={onUpdateSkill}
            categoryColors={categoryColors}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
