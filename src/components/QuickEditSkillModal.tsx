import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trash2, Check, Hash, CheckSquare, Layers, Tag } from 'lucide-react';
import { Skill } from '../types';
import { getSkillIcon, getRespectiveIconName } from './icons';
import { triggerHaptic } from '../lib/haptics';

interface QuickEditSkillModalProps {
  isOpen: boolean;
  skill: Skill | null; // null means creating a new skill
  categories: string[];
  categoryColors: Record<string, string>;
  onClose: () => void;
  onSave: (skillData: {
    name: string;
    shortForm: string;
    mode: 'counter' | 'checkbox';
    category: string;
    icon?: string;
    unit?: string;
  }) => void;
  onDelete?: (skillId: string) => void;
  onOpenIconStudio?: (skillId?: string) => void;
  onAddCategory?: (category: string) => void;
}

export default function QuickEditSkillModal({
  isOpen,
  skill,
  categories,
  categoryColors,
  onClose,
  onSave,
  onDelete,
  onOpenIconStudio,
  onAddCategory
}: QuickEditSkillModalProps) {
  const isEditing = Boolean(skill);

  const [name, setName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [mode, setMode] = useState<'counter' | 'checkbox'>('counter');
  const [category, setCategory] = useState(categories[0] || 'Fitness');
  const [customCategory, setCustomCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [icon, setIcon] = useState('Target');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setShortForm(skill.shortForm || skill.name.slice(0, 3).toUpperCase());
      setMode(skill.mode);
      setUnit(skill.unit || '');
      if (categories.includes(skill.category)) {
        setCategory(skill.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(skill.category);
      }
      setIcon(skill.icon || getRespectiveIconName(skill));
    } else {
      setName('');
      setShortForm('');
      setMode('counter');
      setCategory(categories[0] || 'Fitness');
      setCustomCategory('');
      setUnit('');
      setIcon('Target');
    }
    setIsConfirmingDelete(false);
  }, [skill, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalCategory = category;
    if (category === 'Custom') {
      finalCategory = customCategory.trim() || 'Custom';
      onAddCategory?.(finalCategory);
    }

    triggerHaptic('success');
    onSave({
      name: name.trim(),
      shortForm: (shortForm.trim() || name.trim().slice(0, 3)).toUpperCase(),
      mode,
      category: finalCategory,
      icon,
      unit: unit.trim() || undefined
    });
    onClose();
  };

  const IconComp = getSkillIcon({ name, icon } as Skill);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal / Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Grab handle for mobile */}
          <div className="sm:hidden w-full flex items-center justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-zinc-700/60" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <IconComp size={20} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isEditing ? 'Edit Skill on Spot' : 'Create New Skill'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {isEditing ? `Instant adjustments for ${skill?.name}` : 'Add a new objective to your arsenal'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Skill Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Cold Plunge, Pushups, Deep Work"
                value={name}
                onChange={e => {
                  const newName = e.target.value;
                  setName(newName);
                  if (!isEditing) {
                    setIcon(getRespectiveIconName({ name: newName } as Skill));
                  }
                }}
                className="w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Tracking Mode & Short Form */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Tracking Mode
                </label>
                <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('counter');
                      triggerHaptic('light');
                    }}
                    className={`flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'counter'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Hash size={13} />
                    Count
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('checkbox');
                      triggerHaptic('light');
                    }}
                    className={`flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'checkbox'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CheckSquare size={13} />
                    Check
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Short Tag / Badge
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g., PSH"
                  value={shortForm}
                  onChange={e => setShortForm(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm font-mono uppercase focus:outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Category and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-3 py-3 text-white text-sm font-medium focus:outline-none focus:border-cyan-500 transition-all"
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">
                      {c}
                    </option>
                  ))}
                  <option value="Custom" className="bg-zinc-900 text-white">+ Custom Category</option>
                </select>
              </div>

              {category === 'Custom' ? (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter category name"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Unit (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., mins, reps, km, L"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
              )}
            </div>

            {/* Icon Customizer Banner */}
            <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner">
                  <IconComp size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Active Icon: {icon}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Launch icon studio for colors & stroke</div>
                </div>
              </div>

              {onOpenIconStudio && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenIconStudio(skill?.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-cyan-500/30 active:scale-95 transition-all shrink-0"
                >
                  <Sparkles size={13} />
                  Icon Studio
                </button>
              )}
            </div>

            {/* Delete Confirmation or Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              {isEditing && onDelete ? (
                isConfirmingDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('warning');
                        if (skill) onDelete(skill.id);
                        onClose();
                      }}
                      className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-bold text-xs hover:bg-red-500/30 transition-all"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2.5 py-2 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                )
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg shadow-white/10 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check size={15} strokeWidth={2.5} />
                  <span>{isEditing ? 'Save Changes' : 'Create Skill'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
