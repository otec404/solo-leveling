import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Activity, X, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Skill, TrackingMode } from '../types';
import { getCategoryTheme, THEMES } from './DailyDashboardView';
import { triggerHaptic } from '../lib/haptics';
import { AVAILABLE_ICONS } from './icons';

interface ManageSkillsViewProps {
  skills: Skill[];
  categories: string[];
  categoryColors: Record<string, string>;
  onAddSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  onUpdateSkill: (id: string, skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  onDeleteSkill: (id: string) => void;
  onAddCategory: (category: string) => void;
  onUpdateCategoryColor: (category: string, color: string) => void;
}

export default function ManageSkillsView({
  skills, categories, categoryColors, onAddSkill, onUpdateSkill, onDeleteSkill, onAddCategory, onUpdateCategoryColor
}: ManageSkillsViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAppView, setIsAppView] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [mode, setMode] = useState<TrackingMode>('counter');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('Diet');
  const [customCategory, setCustomCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [icon, setIcon] = useState('Activity');


  const openForm = (skill?: Skill) => {
    triggerHaptic('light');
    if (skill) {
      setIsEditing(skill.id);
      setName(skill.name);
      setShortForm(skill.shortForm);
      setMode(skill.mode);
      setUnit(skill.unit || '');
      if (categories.includes(skill.category)) {
        setCategory(skill.category);
        setCustomCategory('');
        setCategoryColor(categoryColors[skill.category] || '');
        setIcon(skill.icon || 'Activity');
      } else {
        setCategory('Custom');
        setCustomCategory(skill.category);
        setCategoryColor(categoryColors[skill.category] || '');
      }
    } else {
      setIsEditing(null);
    setIcon('Activity');
      setName('');
      setShortForm('');
      setMode('counter');
      setUnit('');
      setCategory(categories[0] || 'Diet');
      setCustomCategory('');
      setCategoryColor(categoryColors[categories[0] || 'Diet'] || '');
    }
    setIsFormOpen(true);
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

    const skillData = { name, shortForm, mode, category: finalCategory, icon, unit: unit.trim() || undefined };
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
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 w-full h-full overflow-y-auto pb-24 md:pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">Manage Skills</h1>
          <p className="text-sm sm:text-base text-zinc-500">Create, edit, or remove the skills you want to track.</p>
        </div>
        
        {!isFormOpen && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/80">
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
              onClick={() => openForm()}
              className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors focus:outline-none shadow-lg shadow-cyan-900/20 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> 
              Create New Skill
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isFormOpen && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 sm:p-8 relative backdrop-blur-sm">
              <button 
                onClick={closeForm}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-lg sm:text-xl font-medium text-white mb-6">
                {isEditing ? 'Edit Skill' : 'Create New Skill'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                    <input 
                      required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Carrot" 
                      className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Short Form</label>
                    <input 
                      required value={shortForm} onChange={e => setShortForm(e.target.value)} maxLength={4} placeholder="e.g. Ca" 
                      className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Tracker Mode</label>
                    <div className="flex p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl shadow-inner">
                      <button type="button" onClick={() => setMode('counter')} className={`flex-1 min-h-[44px] py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'counter' ? 'bg-zinc-800 border border-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Counter</button>
                      <button type="button" onClick={() => setMode('checkbox')} className={`flex-1 min-h-[44px] py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'checkbox' ? 'bg-zinc-800 border border-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Checkbox</button>
                    </div>
                  </div>
                  
                  {mode === 'counter' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="pt-2">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Unit (Optional)</label>
                        <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. km, hr, mins, kg" className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none text-sm" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <select value={category} onChange={handleCategoryChange} className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all text-sm appearance-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Custom">Custom...</option>
                    </select>
                  </div>
                  
                  <AnimatePresence>
                    {category === 'Custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="pt-1">
                          <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Custom Category</label>
                          <input required value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="New category name" className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none text-sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                                      <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Symbol / Icon</label>
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[180px] overflow-y-auto p-2 bg-zinc-950/50 border border-zinc-800 rounded-xl custom-scrollbar">
                      {Object.keys(AVAILABLE_ICONS).map(iconName => {
                        const IconComponent = AVAILABLE_ICONS[iconName];
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setIcon(iconName)}
                            className={`w-full aspect-square min-h-[44px] rounded-lg flex items-center justify-center transition-all ${
                              icon === iconName 
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                                : 'bg-zinc-900 text-zinc-500 border border-transparent hover:bg-zinc-800 hover:text-zinc-300'
                            }`}
                          >
                            <IconComponent size={20} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
<label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category Theme</label>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
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
                          className={`w-full h-16 rounded-xl border-2 p-1 transition-all ${
                            isActive 
                              ? `${theme.border} -translate-y-1`
                              : `border-transparent bg-zinc-900 hover:bg-zinc-800 hover:-translate-y-0.5 opacity-70 hover:opacity-100`
                          }`}
                        >
                           <div className={`w-full h-full rounded-lg ${theme.card} flex items-end justify-center pb-1.5 opacity-90 shadow-inner`}>
                              <div className={`w-3 h-1 rounded-full transition-all duration-300 ${isActive ? (c === 'black' ? 'bg-white' : 'bg-white/90') : 'bg-transparent'}`} />
                           </div>
                        </button>
                      )})}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 mt-4">
                  <button type="button" onClick={closeForm} className="px-5 py-2.5 min-h-[44px] flex items-center justify-center rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 min-h-[44px] flex items-center justify-center rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
                    {isEditing ? 'Save Changes' : 'Create Skill'}
                  </button>
                </div>
              </form></div></motion.div>
          )}
        </AnimatePresence>

      <div className={isAppView ? "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4" : "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4 mt-4"}>
        <AnimatePresence>
          {skills.map(skill => {
            const theme = getCategoryTheme(skill.category, categoryColors);

            if (isAppView) {
              const IconComp = AVAILABLE_ICONS[skill.icon as keyof typeof AVAILABLE_ICONS] || AVAILABLE_ICONS.Activity;
              return (
                <motion.div 
                  key={skill.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.8 }} 
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2 relative group"
                >
                  <button
                     onClick={() => openForm(skill)}
                     className={`relative flex items-center justify-center w-full aspect-square rounded-[2rem] sm:rounded-[2.5rem] border transition-all active:scale-[0.95] overflow-hidden shadow-xl ${theme.cardBorder} bg-zinc-900/50 hover:bg-zinc-800/60`}
                  >
                     {/* Drawn Background Symbol */}
                     <div className="absolute -right-4 -bottom-4 flex items-center justify-center pointer-events-none transition-all duration-700 z-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transform">
                        <IconComp size={100} strokeWidth={2} fill="none" className={theme.iconColor} />
                     </div>

                     <div className={`p-4 rounded-3xl bg-zinc-900/30 group-hover:scale-110 transition-transform duration-300 ${theme.textCategory}`}>
                       <IconComp size={32} strokeWidth={2} />
                     </div>
                     
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div 
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); onDeleteSkill(skill.id); }}
                          className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center backdrop-blur-md"
                        >
                          <Trash2 size={14} />
                        </div>
                     </div>
                  </button>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-400 tracking-wide w-full text-center px-1 truncate">
                     {skill.name}
                  </span>
                </motion.div>
              );
            }

            return (
            <motion.div key={skill.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} className={`bg-zinc-900/50 backdrop-blur-md rounded-2xl p-4 sm:p-5 border relative group flex items-center justify-between gap-4 transition-all hover:bg-zinc-800/60 overflow-hidden ${theme.cardBorder}`}>
              {/* Drawn Background Symbol */}
              {skill.icon && AVAILABLE_ICONS[skill.icon] && (() => {
                 const IconComp = AVAILABLE_ICONS[skill.icon];
                 return (
                   <div className="absolute -right-4 -bottom-4 flex items-center justify-center pointer-events-none transition-all duration-700 z-0 opacity-10 group-hover:opacity-20 group-hover:scale-110 transform">
                      <IconComp size={100} strokeWidth={2} fill="none" className={theme.iconColor} />
                   </div>
                 );
              })()}

              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 z-10 relative">
                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-zinc-900 flex items-center justify-center font-black text-xl border border-white/5 shadow-inner ${theme.textCategory}`}>
                  {skill.icon && AVAILABLE_ICONS[skill.icon] ? (() => { const Icon = AVAILABLE_ICONS[skill.icon]; return <Icon size={24} />; })() : skill.shortForm}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 truncate">{skill.name}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 truncate">{skill.category}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 truncate">{skill.mode}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                <button aria-label={`Edit ${skill.name}`} onClick={() => openForm(skill)} className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"><Edit2 size={16} className="sm:w-3.5 sm:h-3.5" /></button>
                <button aria-label={`Delete ${skill.name}`} onClick={() => onDeleteSkill(skill.id)} className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0"><Trash2 size={16} className="sm:w-3.5 sm:h-3.5" /></button>
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
    </div>
  );
}
