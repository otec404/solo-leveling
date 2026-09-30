import React, { useState, useMemo, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Check, RotateCcw,
  HelpCircle, Layers, Paintbrush, Copy
} from 'lucide-react';
import { Skill } from '../types';
import { 
  ALL_LUCIDE_ICON_NAMES, 
  AVAILABLE_ICONS, 
  ICON_CATEGORIES, 
  SYSTEM_TONES, 
  getSkillIcon, 
  getRespectiveIconName 
} from './icons';
import { triggerHaptic } from '../lib/haptics';

interface CardIconStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  initialSkillId?: string;
  onUpdateSkill: (skillId: string, updates: Partial<Skill>) => void;
  categoryColors?: Record<string, string>;
}

const COLOR_OPTIONS = [
  { name: 'Default', value: '', dotColor: 'bg-zinc-400', ringColor: 'ring-zinc-400' },
  ...SYSTEM_TONES.map(t => ({
    name: t.name,
    value: t.textClass,
    dotColor: t.bgClass,
    ringColor: t.ringClass,
    hex: t.hex
  }))
];

const STROKE_OPTIONS = [
  { label: '1.5', value: 1.5 },
  { label: '2.0', value: 2.0 },
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3.0 },
];

const PAGE_SIZE = 140;

export default function CardIconStudioModal({
  isOpen,
  onClose,
  skills,
  initialSkillId,
  onUpdateSkill,
  categoryColors
}: CardIconStudioModalProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    initialSkillId || (skills[0]?.id || '')
  );
  
  // Keep selected target skill synchronized
  useEffect(() => {
    if (initialSkillId && skills.some(s => s.id === initialSkillId)) {
      setSelectedSkillId(initialSkillId);
    } else if (!skills.some(s => s.id === selectedSkillId) && skills.length > 0) {
      setSelectedSkillId(skills[0].id);
    }
  }, [initialSkillId, skills, selectedSkillId]);

  const targetSkill = useMemo(() => {
    return skills.find(s => s.id === selectedSkillId) || skills[0];
  }, [skills, selectedSkillId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All (184)');
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  // Selected icon and styling properties
  const [selectedIconName, setSelectedIconName] = useState<string>(
    targetSkill ? (targetSkill.icon || getRespectiveIconName(targetSkill)) : 'Target'
  );
  const [selectedColor, setSelectedColor] = useState<string>(targetSkill?.iconColor || '');
  const [selectedStroke, setSelectedStroke] = useState<number>(targetSkill?.iconStroke || 2);
  const [attachedNotice, setAttachedNotice] = useState<string | null>(null);

  // When target skill changes, initialize current configuration from it
  useEffect(() => {
    if (targetSkill) {
      setSelectedIconName(targetSkill.icon || getRespectiveIconName(targetSkill));
      setSelectedColor(targetSkill.iconColor || '');
      setSelectedStroke(targetSkill.iconStroke || 2);
    }
  }, [targetSkill?.id]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const cat = ICON_CATEGORIES.find(c => c.name === selectedCategory);

    let list = ALL_LUCIDE_ICON_NAMES;

    if (cat && cat.iconNames && cat.iconNames.length > 0) {
      list = cat.iconNames;
    }

    if (!q) return list;

    return list.filter(name => name.toLowerCase().includes(q));
  }, [searchQuery, selectedCategory]);

  const paginatedIcons = useMemo(() => {
    return filteredIcons.slice(0, page * PAGE_SIZE);
  }, [filteredIcons, page]);

  const handleSelectIcon = (iconName: string) => {
    setSelectedIconName(iconName);
    triggerHaptic('light');
  };

  const handleAttachToCard = () => {
    if (!targetSkill) return;
    triggerHaptic('success');
    
    onUpdateSkill(targetSkill.id, {
      icon: selectedIconName,
      iconColor: selectedColor || undefined,
      iconStroke: selectedStroke
    });

    setAttachedNotice(`Attached "${selectedIconName}" to ${targetSkill.name}!`);
    setTimeout(() => {
      setAttachedNotice(null);
    }, 2200);
  };

  const handleResetToDefault = () => {
    if (!targetSkill) return;
    triggerHaptic('medium');
    const defaultIcon = getRespectiveIconName({ id: targetSkill.id, name: targetSkill.name });
    setSelectedIconName(defaultIcon);
    setSelectedColor('');
    setSelectedStroke(2);

    onUpdateSkill(targetSkill.id, {
      icon: defaultIcon,
      iconColor: undefined,
      iconStroke: 2
    });

    setAttachedNotice(`Reset ${targetSkill.name} to default icon`);
    setTimeout(() => setAttachedNotice(null), 2200);
  };

  if (!isOpen) return null;

  const ActiveIconComp = AVAILABLE_ICONS[selectedIconName] || AVAILABLE_ICONS.Target;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none font-sans">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 30, scale: 0.98 }} 
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-5xl h-[92vh] sm:h-[86vh] bg-[#07070a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-2 sm:hidden shrink-0" />

        {/* 1. Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            <h2 className="text-sm sm:text-base font-mono font-black text-white tracking-tight truncate">
              Icon Studio
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
              Select card & choose icon
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] font-mono text-zinc-400 hover:text-rose-300 flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 transition-colors"
              title="Reset to default icon"
            >
              <RotateCcw size={11} />
              <span className="hidden xs:inline">Reset</span>
            </button>

            <button 
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 active:scale-95"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Target Card Selection Strip */}
        <div className="px-4 py-2 sm:px-6 sm:py-2 bg-zinc-900/60 border-b border-white/10 flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 shrink-0">
            <Layers size={12} className="text-cyan-400" /> Skill:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 touch-pan-x flex-1">
            {skills.map(s => {
              const isTarget = s.id === selectedSkillId;
              const SkillIcon = getSkillIcon(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSkillId(s.id);
                    triggerHaptic('light');
                  }}
                  className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border active:scale-95 ${
                    isTarget 
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm shadow-cyan-500/20 font-black' 
                      : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <SkillIcon size={12} className={isTarget ? 'text-black' : 'text-zinc-400'} />
                  <span className="truncate max-w-[110px]">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Live Preview & Customization Controls Bar */}
        <div className="px-4 py-2 sm:px-6 sm:py-2.5 bg-zinc-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Live Icon Preview Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center shrink-0 shadow-inner">
              <ActiveIconComp 
                size={18} 
                strokeWidth={selectedStroke} 
                className={selectedColor || 'text-cyan-400'} 
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-mono font-black text-white truncate max-w-[130px]">{selectedIconName}</span>
              <span className="text-[9px] text-zinc-400 font-mono">Selected Icon</span>
            </div>
          </div>

          {/* Controls: Stroke Weight & Tint Colors */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Tint Color Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Paintbrush size={11} /> Tint:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-0.5">
                {COLOR_OPTIONS.map(c => {
                  const isSelected = selectedColor === c.value;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.value);
                        triggerHaptic('light');
                      }}
                      title={c.name}
                      className={`w-4 h-4 rounded-full transition-all shrink-0 flex items-center justify-center ${c.dotColor} ${
                        isSelected 
                          ? `ring-2 ${c.ringColor} ring-offset-2 ring-offset-zinc-950 scale-120 shadow-md` 
                          : 'opacity-50 hover:opacity-100 hover:scale-110'
                      }`}
                    >
                      {isSelected && <span className="w-1 h-1 rounded-full bg-black/90" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stroke Weight */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Stroke:</span>
              <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-white/10">
                {STROKE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedStroke(opt.value);
                      triggerHaptic('light');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all min-w-[24px] text-center ${
                      selectedStroke === opt.value
                        ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notice Toast Banner */}
        <AnimatePresence>
          {attachedNotice && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-1.5 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between gap-2 shrink-0"
            >
              <span className="flex items-center gap-2 truncate">
                <Check size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{attachedNotice}</span>
              </span>
              <button onClick={() => setAttachedNotice(null)} className="hover:text-white p-1">
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Search Bar & Categories */}
        <div className="p-3 bg-zinc-950 border-b border-white/10 flex flex-col gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => {
                const val = e.target.value;
                startTransition(() => {
                  setSearchQuery(val);
                  setPage(1);
                });
              }}
              placeholder={`Search ${ALL_LUCIDE_ICON_NAMES.length.toLocaleString()} vector icons...`}
              className="w-full h-9 sm:h-10 bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setPage(1); }}
                className="w-8 h-8 absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5 touch-pan-x -mx-1 px-1">
            {ICON_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setPage(1);
                  }}
                  className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border active:scale-95 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-sm font-black'
                      : 'bg-zinc-900 text-zinc-400 border-white/10 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Icons Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar bg-black/40">
          {paginatedIcons.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
              <HelpCircle size={32} className="mb-2 opacity-30 text-zinc-400" />
              <p className="text-xs font-bold text-zinc-300">No icons found matching "{searchQuery}"</p>
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 rounded-lg text-xs font-mono font-bold border border-white/10"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2">
              {paginatedIcons.map(iconName => {
                const IconComp = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Target;
                const isSelected = selectedIconName === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleSelectIcon(iconName)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all aspect-square group relative active:scale-95 min-h-[52px] sm:min-h-[58px] ${
                      isSelected 
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105 z-10 ring-1 ring-cyan-400' 
                        : 'bg-zinc-900/70 border-white/5 hover:bg-zinc-850 hover:border-white/20'
                    }`}
                    aria-label={`Select ${iconName}`}
                  >
                    <IconComp 
                      size={20} 
                      strokeWidth={isSelected ? selectedStroke : 2} 
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        isSelected 
                          ? (selectedColor || 'text-cyan-400') 
                          : 'text-zinc-400 group-hover:text-white'
                      }`} 
                    />
                    <span className="text-[8px] font-mono font-medium text-zinc-400 group-hover:text-zinc-200 truncate w-full text-center mt-1 leading-none">
                      {iconName}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,1)]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {paginatedIcons.length < filteredIcons.length && (
            <div className="flex justify-center mt-4 pb-2">
              <button
                type="button"
                onClick={() => setPage(p => p + 1)}
                className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-mono font-bold border border-white/10 transition-all active:scale-95"
              >
                <span>Load More ({filteredIcons.length - paginatedIcons.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* 6. Footer Actions Bar */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-white/10 bg-zinc-950 flex items-center justify-between gap-3 shrink-0 pb-safe">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-mono text-zinc-400 truncate">
              Target: <strong className="text-white font-bold">{targetSkill?.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold border border-white/10 transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAttachToCard}
              className="h-9 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-black transition-all shadow-md shadow-cyan-500/25 active:scale-95 flex items-center gap-1.5"
            >
              <Check size={14} strokeWidth={3.5} />
              <span>Attach to {targetSkill?.shortForm || targetSkill?.name || 'Card'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
