import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Activity, X } from 'lucide-react';
import { Skill, TrackingMode } from '../types';

interface ManageSkillsViewProps {
  skills: Skill[];
  categories: string[];
  onAddSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  onUpdateSkill: (id: string, skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  onDeleteSkill: (id: string) => void;
  onAddCategory: (category: string) => void;
}

export default function ManageSkillsView({
  skills, categories, onAddSkill, onUpdateSkill, onDeleteSkill, onAddCategory
}: ManageSkillsViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [mode, setMode] = useState<TrackingMode>('counter');
  const [category, setCategory] = useState('Diet');
  const [customCategory, setCustomCategory] = useState('');

  const openForm = (skill?: Skill) => {
    if (skill) {
      setIsEditing(skill.id);
      setName(skill.name);
      setShortForm(skill.shortForm);
      setMode(skill.mode);
      if (categories.includes(skill.category)) {
        setCategory(skill.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(skill.category);
      }
    } else {
      setIsEditing(null);
      setName('');
      setShortForm('');
      setMode('counter');
      setCategory(categories[0] || 'Diet');
      setCustomCategory('');
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = category;
    if (category === 'Custom') {
      finalCategory = customCategory.trim() || 'Uncategorized';
      onAddCategory(finalCategory);
    }

    const skillData = { name, shortForm, mode, category: finalCategory };
    if (isEditing) {
      onUpdateSkill(isEditing, skillData);
    } else {
      onAddSkill(skillData);
    }
    closeForm();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 w-full h-full overflow-y-auto pb-24 md:pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">Manage Skills</h1>
          <p className="text-sm sm:text-base text-zinc-500">Create, edit, or remove the skills you want to track.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => openForm()}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors focus:outline-none shadow-lg shadow-cyan-900/20 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> 
            Create New Skill
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
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
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors"
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
                      <button type="button" onClick={() => setMode('counter')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'counter' ? 'bg-zinc-800 border border-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Counter</button>
                      <button type="button" onClick={() => setMode('checkbox')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'checkbox' ? 'bg-zinc-800 border border-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>Checkbox</button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all text-sm appearance-none">
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
                </div>

                <div className="lg:col-span-2 flex justify-end mt-2">
                  <button type="submit" className="w-full lg:w-auto px-8 py-3.5 lg:py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-cyan-900/20">
                    {isEditing ? 'Save Changes' : 'Create Skill'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {skills.map(skill => (
              <div key={skill.id} className="group bg-zinc-900/30 backdrop-blur-md border border-zinc-800/60 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 flex flex-col hover:bg-zinc-900/50 hover:border-zinc-700/60 transition-all shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 flex items-center justify-center font-bold text-base sm:text-lg tracking-tight">
                    {skill.shortForm}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                    {skill.category}
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-1">{skill.name}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-5 sm:mb-6">Mode: {skill.mode}</p>
                
                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-zinc-800/50">
                  <button onClick={() => openForm(skill)} className="flex-1 flex justify-center items-center gap-2 py-2.5 sm:py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => onDeleteSkill(skill.id)} className="flex-1 flex justify-center items-center gap-2 py-2.5 sm:py-2 text-sm text-red-500/70 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {skills.length === 0 && (
               <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
                 <Activity className="w-8 h-8 text-zinc-600 mb-4" />
                 <p className="text-zinc-500 text-sm sm:text-base">No skills defined yet.</p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
