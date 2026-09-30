import React, { useState, useMemo, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Check, ArrowLeft, Download, Upload, Copy, 
  RotateCcw, Sparkles, Layers, Paintbrush, HelpCircle, CheckCircle2
} from 'lucide-react';
import { Skill } from '../types';
import { 
  SYSTEM_ICON_CATEGORIES, 
  SYSTEM_TONES, 
  SystemTone,
  AVAILABLE_ICONS, 
  getSkillIcon, 
  getRespectiveIconName 
} from './icons';
import { triggerHaptic } from '../lib/haptics';

interface IconStudioViewProps {
  skills: Skill[];
  onUpdateSkill?: (skillId: string, updates: Partial<Skill>) => void;
  onBack: () => void;
  onOpenExport?: () => void;
  onOpenImport?: () => void;
  categoryColors?: Record<string, string>;
}

export default function IconStudioView({
  skills,
  onUpdateSkill,
  onBack,
  onOpenExport,
  onOpenImport,
  categoryColors
}: IconStudioViewProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTone, setSelectedTone] = useState<SystemTone>(SYSTEM_TONES[0]); // Default Emerald
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [, startTransition] = useTransition();

  // Selected Target Skill
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const selectedSkill = useMemo(() => {
    return skills.find(s => s.id === selectedSkillId) || skills[0];
  }, [skills, selectedSkillId]);

  // Active Selected Icon for Preview / Inspector
  const [inspectingIcon, setInspectingIcon] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [attachedNotice, setAttachedNotice] = useState<string | null>(null);

  // Grouped icons filtered by search & category
  const filteredCategoryData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return SYSTEM_ICON_CATEGORIES.map(cat => {
      let icons = cat.iconNames;
      if (q) {
        icons = icons.filter(name => name.toLowerCase().includes(q));
      }
      return {
        ...cat,
        matchingIcons: icons
      };
    }).filter(cat => {
      if (activeCategory !== 'All' && cat.name !== activeCategory) {
        return false;
      }
      return cat.matchingIcons.length > 0;
    });
  }, [searchQuery, activeCategory]);

  const totalMatchingCount = useMemo(() => {
    return filteredCategoryData.reduce((acc, cat) => acc + cat.matchingIcons.length, 0);
  }, [filteredCategoryData]);

  const handleSelectIcon = (iconName: string) => {
    setInspectingIcon(iconName);
    triggerHaptic('light');
  };

  const handleAttachIcon = (iconName: string) => {
    if (!selectedSkill || !onUpdateSkill) return;
    triggerHaptic('success');

    onUpdateSkill(selectedSkill.id, {
      icon: iconName,
      iconColor: selectedTone.textClass,
      iconStroke: strokeWidth
    });

    setAttachedNotice(`Attached "${iconName}" to ${selectedSkill.name}!`);
    setTimeout(() => setAttachedNotice(null), 2400);
  };

  const handleCopyIconName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedNotice(`Copied "${name}" to clipboard`);
    triggerHaptic('medium');
    setTimeout(() => setCopiedNotice(null), 2000);
  };

  const handleResetDefaults = () => {
    if (!onUpdateSkill) return;
    triggerHaptic('warning');
    skills.forEach(s => {
      const def = getRespectiveIconName({ id: s.id, name: s.name, shortForm: s.shortForm });
      onUpdateSkill(s.id, {
        icon: def,
        iconColor: undefined,
        iconStroke: 2
      });
    });
    setAttachedNotice(`Reset all ${skills.length} skills to default icons`);
    setTimeout(() => setAttachedNotice(null), 2400);
  };

  const ActiveInspectorIconComp = inspectingIcon 
    ? (AVAILABLE_ICONS[inspectingIcon] || AVAILABLE_ICONS.Target) 
    : null;

  return (
    <div className="flex flex-col h-full w-full bg-[#07070a] text-zinc-100 overflow-hidden relative font-sans select-none">
      
      {/* ========================================================= */}
      {/* 1. TOP MINIMAL NAVIGATION HEADER */}
      {/* ========================================================= */}
      <header className="px-4 sm:px-6 py-3 border-b border-white/10 bg-black/60 backdrop-blur-2xl flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Brand Logo & Back Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-8 sm:h-9 px-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={14} className="text-cyan-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            <h1 className="text-sm sm:text-base font-mono font-black tracking-tight text-white flex items-center gap-1.5">
              Icon Studio <span className="text-[10px] font-mono text-zinc-400 font-normal">184 vector icons</span>
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/10 text-xs font-mono font-semibold hidden md:flex items-center gap-1.5 transition-colors"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          )}

          {onOpenImport && (
            <button
              type="button"
              onClick={onOpenImport}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/10 text-xs font-mono font-semibold hidden md:flex items-center gap-1.5 transition-colors"
            >
              <Upload size={13} />
              <span>Import</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-rose-300 border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset all skills to default icon mappings"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MINIMAL TARGET SKILL SELECTOR STRIP */}
      {/* ========================================================= */}
      {skills.length > 0 && (
        <div className="px-4 sm:px-6 py-2.5 border-b border-white/10 bg-[#09090e]/95 backdrop-blur-xl flex items-center gap-3 shrink-0 z-25 overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 shrink-0">
            <Layers size={13} className="text-cyan-400" />
            <span className="text-[11px] uppercase tracking-wider text-zinc-400">Target Skill:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5 touch-pan-x flex-1">
            {skills.map(skill => {
              const isSelected = skill.id === selectedSkillId;
              const SkillIcon = getSkillIcon(skill);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => {
                    setSelectedSkillId(skill.id);
                    triggerHaptic('light');
                  }}
                  className={`h-8 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20 font-black'
                      : 'bg-zinc-900/90 text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <SkillIcon size={14} className={isSelected ? 'text-black' : 'text-zinc-400'} />
                  <span className="truncate max-w-[120px]">{skill.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {skill.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MINIMAL FILTER, SEARCH, CATEGORIES & TONES BAR */}
      {/* ========================================================= */}
      <div className="px-4 sm:px-6 pt-3 pb-3 border-b border-white/10 bg-gradient-to-b from-[#09090e] to-[#07070a] shrink-0 z-20 space-y-3">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              startTransition(() => {
                setSearchQuery(val);
              });
            }}
            placeholder="Search all 184 system icons (e.g. gym, code, book, coffee, run, water)..."
            className="w-full h-10 sm:h-11 bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="w-8 h-8 absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white flex items-center justify-center rounded-lg"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 touch-pan-x -mx-1 px-1">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`min-h-[30px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
              activeCategory === 'All'
                ? 'bg-white text-black border-white shadow-sm font-black'
                : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            All (184)
          </button>
          {SYSTEM_ICON_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={`min-h-[30px] px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-white text-black border-white shadow-sm font-black'
                    : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Minimal Tones & Stroke Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
          {/* Tones Selection */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Paintbrush size={11} className="text-zinc-400" /> Tint:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
              {SYSTEM_TONES.map(t => {
                const isSelected = selectedTone.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTone(t);
                      triggerHaptic('light');
                    }}
                    title={`${t.name} tone`}
                    className={`w-5 h-5 rounded-full transition-all shrink-0 flex items-center justify-center ${t.bgClass} border ${t.borderClass} ${
                      isSelected 
                        ? `ring-2 ${t.ringClass} ring-offset-2 ring-offset-black scale-115 shadow-md` 
                        : 'opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: t.hex }} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stroke Weight */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Stroke:
            </span>
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-white/10">
              {[1.5, 2.0, 2.5, 3.0].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setStrokeWidth(val);
                    triggerHaptic('light');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all min-w-[26px] text-center ${
                    strokeWidth === val
                      ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {val.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. NOTICES / TOASTS */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(attachedNotice || copiedNotice) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-mono font-black shadow-2xl flex items-center gap-2 border border-emerald-300"
          >
            <Check size={15} strokeWidth={3.5} />
            <span>{attachedNotice || copiedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 5. MAIN SCROLLABLE ICONS GRID */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-7 bg-[#07070a]">
        {filteredCategoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center text-zinc-500">
            <HelpCircle size={36} className="mb-3 opacity-30 text-zinc-400" />
            <p className="text-sm font-bold text-zinc-300">No icons found matching "{searchQuery}"</p>
            <p className="text-xs text-zinc-500 mt-1">Try searching another keyword or clearing filters</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 rounded-xl text-xs font-bold border border-white/10"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredCategoryData.map(category => (
            <div key={category.name} className="space-y-2.5">
              {/* Category Section Header with Count */}
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-mono font-black text-white uppercase tracking-wider">
                    {category.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    ({category.matchingIcons.length})
                  </span>
                </div>
              </div>

              {/* Grid of Icon Tiles */}
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-2.5">
                {category.matchingIcons.map(iconName => {
                  const IconComponent = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Target;
                  const isInspected = inspectingIcon === iconName;
                  const isCurrentlyAttachedToSelectedSkill = selectedSkill?.icon === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelectIcon(iconName)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-150 aspect-square group relative select-none ${
                        isInspected
                          ? `bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400 scale-105 z-10`
                          : isCurrentlyAttachedToSelectedSkill
                          ? 'bg-zinc-900 border-cyan-500/60 shadow-inner'
                          : 'bg-zinc-900/60 border-white/5 hover:bg-zinc-850 hover:border-white/20 hover:shadow-md'
                      }`}
                      aria-label={`Select icon ${iconName}`}
                    >
                      {/* Icon Rendering */}
                      <div className="flex-1 flex items-center justify-center">
                        <IconComponent
                          size={22}
                          strokeWidth={strokeWidth}
                          className={`transition-transform duration-200 group-hover:scale-110 ${
                            isInspected ? selectedTone.textClass : (selectedTone.textClass || 'text-zinc-300')
                          }`}
                        />
                      </div>

                      {/* Icon Name Label */}
                      <span className="text-[8px] sm:text-[9px] font-mono font-medium text-zinc-400 group-hover:text-zinc-200 truncate w-full text-center leading-none mt-1">
                        {iconName}
                      </span>

                      {/* Indicator dot if active */}
                      {isCurrentlyAttachedToSelectedSkill && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,1)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* 6. FLOATING BOTTOM INSPECTOR / ATTACH BAR */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inspectingIcon && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl p-3 sm:px-6 sm:py-3 shrink-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-2xl"
          >
            {/* Left: Icon Preview Details */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center shadow-inner shrink-0">
                {ActiveInspectorIconComp && (
                  <ActiveInspectorIconComp
                    size={24}
                    strokeWidth={strokeWidth}
                    className={selectedTone.textClass}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-mono font-black text-white">{inspectingIcon}</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {selectedTone.name} • {strokeWidth.toFixed(1)}px
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Target: <span className="text-white font-bold">{selectedSkill?.name}</span>
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyIconName(inspectingIcon)}
                className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold border border-white/10 transition-colors flex items-center gap-1.5"
                title="Copy icon name"
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>

              {selectedSkill && onUpdateSkill && (
                <button
                  type="button"
                  onClick={() => handleAttachIcon(inspectingIcon)}
                  className="h-9 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-black transition-all shadow-md shadow-cyan-500/30 active:scale-95 flex items-center gap-1.5"
                >
                  <Check size={14} strokeWidth={3.5} />
                  <span>Attach to {selectedSkill.shortForm || selectedSkill.name}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setInspectingIcon(null)}
                className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Close inspector"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
