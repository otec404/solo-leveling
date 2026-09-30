import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ChevronRight, ChevronDown, Check, Search, X, Layers } from 'lucide-react';
import { Skill } from '../types';
import { AVAILABLE_ICONS, ALL_LUCIDE_ICON_NAMES, getSkillIcon, getRespectiveIconName } from './icons';
import { triggerHaptic } from '../lib/haptics';

interface MiniIconsSectionProps {
  skills: Skill[];
  onUpdateSkill?: (skillId: string, updates: Partial<Skill>) => void;
  onOpenStudio: (skillId?: string) => void;
  categoryColors?: Record<string, string>;
}

// Popular curated mini icons for rapid 1-tap attachment
const QUICK_ATTACH_ICONS = [
  'Dumbbell', 'Bike', 'Sailboat', 'BicepsFlexed', 'Trophy', 'Mountain',
  'Zap', 'Sunrise', 'Carrot', 'Apple', 'Citrus', 'Banana', 'Cherry', 'Salad',
  'Flame', 'Shield', 'Ban', 'Droplet', 'Sun', 'Brush', 'Footprints', 'CupSoda',
  'Brain', 'Bed', 'BookOpen', 'Code', 'Heart', 'Activity', 'Award', 'Sparkles',
  'Moon', 'Coffee', 'Target', 'CheckCircle2', 'Timer', 'Scale', 'Medal', 'Compass'
];

export default function MiniIconsSection({
  skills,
  onUpdateSkill,
  onOpenStudio,
  categoryColors
}: MiniIconsSectionProps) {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(skills[0]?.id || '');
  const [quickSearch, setQuickSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [justAttached, setJustAttached] = useState<{ icon: string; skillName: string } | null>(null);

  // Keep selectedSkillId valid when skills list changes
  useEffect(() => {
    if (!skills.some(s => s.id === selectedSkillId) && skills.length > 0) {
      setSelectedSkillId(skills[0].id);
    }
  }, [skills, selectedSkillId]);

  const currentSkill = skills.find(s => s.id === selectedSkillId) || skills[0];

  const handleQuickAttach = (iconName: string) => {
    if (!currentSkill || !onUpdateSkill) return;
    triggerHaptic('success');
    
    onUpdateSkill(currentSkill.id, {
      icon: iconName
    });

    setJustAttached({ icon: iconName, skillName: currentSkill.name });
    setTimeout(() => {
      setJustAttached(null);
    }, 2200);
  };

  const filteredQuickIcons = quickSearch
    ? ALL_LUCIDE_ICON_NAMES.filter(name => name.toLowerCase().includes(quickSearch.toLowerCase().trim())).slice(0, 36)
    : QUICK_ATTACH_ICONS;

  const CurrentSkillIcon = currentSkill ? getSkillIcon(currentSkill) : Sparkles;

  if (skills.length === 0) return null;

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl relative overflow-hidden transition-all hover:border-zinc-700">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/80 via-blue-500/40 to-transparent pointer-events-none" />

      {/* Decorative watermark icon */}
      <div className="absolute -right-3 -bottom-3 opacity-[0.03] pointer-events-none text-white">
        <Sparkles size={120} />
      </div>

      {/* Header: Title, Badge, Open Studio Button & Collapse */}
      <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-zinc-800/60 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Mini Icons Studio</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold whitespace-nowrap">
                {ALL_LUCIDE_ICON_NAMES.length.toLocaleString()}+ Icons
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate hidden xs:block">
              Quickly customize card icons, stroke weight, and tints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenStudio(currentSkill?.id)}
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
            aria-label="Open Full Icon Studio"
          >
            <SlidersHorizontal size={13} strokeWidth={2.5} />
            <span>Open Studio</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>

          {/* Expand / Collapse toggle */}
          <button
            type="button"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              triggerHaptic('light');
            }}
            className="h-8 w-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 active:scale-95 transition-colors shrink-0"
            aria-label={isCollapsed ? "Expand Mini Icons" : "Collapse Mini Icons"}
            title={isCollapsed ? "Expand Mini Icons" : "Collapse Mini Icons"}
          >
            <ChevronDown size={14} className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Collapsed State Summary */}
      {isCollapsed ? (
        <div 
          onClick={() => {
            setIsCollapsed(false);
            triggerHaptic('light');
          }}
          className="pt-3 flex items-center justify-between gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Target Card:</span>
            {currentSkill && (
              <div className="flex items-center gap-1.5 text-zinc-100 font-semibold bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                <CurrentSkillIcon size={14} className="text-cyan-400" />
                <span className="truncate max-w-[150px]">{currentSkill.name}</span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-cyan-400 font-medium shrink-0 flex items-center gap-1">
            Tap to expand quick-attach <ChevronDown size={12} />
          </span>
        </div>
      ) : (
        <div className="pt-3 flex flex-col gap-3 relative z-10">
          {/* Target Card Selection Row */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Layers size={12} className="text-cyan-400" />
                Target Skill Card:
                {currentSkill && (
                  <span className="text-cyan-300 font-bold normal-case tracking-normal ml-1 truncate">
                    {currentSkill.name}
                  </span>
                )}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono hidden sm:inline">
                Click a card below to target
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 touch-pan-x -mx-1 px-1">
              {skills.map(s => {
                const isSelected = s.id === (currentSkill?.id || '');
                const IconComp = getSkillIcon(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSkillId(s.id);
                      triggerHaptic('light');
                    }}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all border active:scale-95 ${
                      isSelected 
                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50' 
                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`}>
                      <IconComp size={15} strokeWidth={s.iconStroke || 2} className={s.iconColor || ''} />
                    </div>
                    <span className="truncate max-w-[120px] font-bold">{s.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)] ml-0.5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-Attach Icons Row */}
          <div className="pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Instant Attach:
                </span>
                {justAttached && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse truncate">
                    <Check size={12} className="shrink-0" /> Attached {justAttached.icon}!
                  </span>
                )}
              </div>

              {/* Quick filter toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowSearch(prev => !prev);
                  if (showSearch) setQuickSearch('');
                }}
                className="text-[11px] text-zinc-400 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <Search size={11} />
                <span>{showSearch ? 'Close' : 'Filter Icons'}</span>
              </button>
            </div>

            {showSearch && (
              <div className="relative mb-2.5">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={e => setQuickSearch(e.target.value)}
                  placeholder="Type icon keyword (e.g. barbell, flame, shield, food)..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  autoFocus
                />
                {quickSearch && (
                  <button
                    type="button"
                    onClick={() => setQuickSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 touch-pan-x -mx-1 px-1">
              {filteredQuickIcons.map(iconName => {
                const Icon = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS.Target;
                const isCurrentIcon = currentSkill?.icon === iconName || getRespectiveIconName(currentSkill) === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleQuickAttach(iconName)}
                    title={`Attach ${iconName} to ${currentSkill?.name || 'Card'}`}
                    className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex flex-col items-center justify-center shrink-0 transition-all border group relative active:scale-95 ${
                      isCurrentIcon
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                        : 'bg-zinc-900 border-zinc-800/90 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                    aria-label={`Attach ${iconName} icon`}
                  >
                    <Icon size={18} strokeWidth={isCurrentIcon ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
                    {isCurrentIcon && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,1)]" />
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onOpenStudio(currentSkill?.id)}
                className="h-11 min-h-[44px] px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-white text-xs font-bold shrink-0 flex items-center gap-1.5 border border-zinc-800 hover:border-cyan-500/50 transition-all active:scale-95 shadow-sm"
              >
                <span>+3,700 more</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
