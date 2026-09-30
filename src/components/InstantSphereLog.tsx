import React, { useMemo, useCallback, useState, useEffect } from 'react';
import InfiniteMenu, { MenuItem } from './InfiniteMenu';
import { Skill, SkillLog } from '../types';
import { getCategoryTheme, playTick } from './DailyDashboardView';
import { triggerHaptic } from '../lib/haptics';
import { Plus, Minus, Check, Sparkles, ChevronLeft, ChevronRight, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstantSphereLogProps {
  skills: Skill[];
  logs: SkillLog[];
  currentDateStr: string;
  categoryColors: Record<string, string>;
  onUpdateLog: (skillId: string, date: string, updates: Partial<SkillLog>) => void;
}

// Generate high-resolution 512x512 Canvas texture for each tactical skill disc
function createSkillDiscTexture(
  skill: Skill, 
  isCompleted: boolean, 
  count: number, 
  isChecked: boolean, 
  theme: any
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 256;
  const cy = 256;
  const r = 244;
  const accentColor = theme.accentColorHex || '#06b6d4';

  // 1. Base Circular Disc Clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // 2. Deep Carbon Gradient Background
  const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r);
  if (isCompleted) {
    bgGrad.addColorStop(0, '#1c1917');
    bgGrad.addColorStop(0.5, '#0c0a09');
    bgGrad.addColorStop(1, '#000000');
  } else {
    bgGrad.addColorStop(0, '#18181b');
    bgGrad.addColorStop(0.6, '#09090b');
    bgGrad.addColorStop(1, '#000000');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 3. Tactical Reticle / Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 20);
  ctx.lineTo(cx, 492);
  ctx.moveTo(20, cy);
  ctx.lineTo(492, cy);
  ctx.stroke();

  // 4. Ambient Accent Radial Glow
  const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
  glowGrad.addColorStop(0, isCompleted ? `${accentColor}66` : `${accentColor}20`);
  glowGrad.addColorStop(0.7, isCompleted ? `${accentColor}22` : 'transparent');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 512, 512);

  // 5. Concentric Precision Rings
  ctx.strokeStyle = isCompleted ? `${accentColor}99` : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = isCompleted ? 3 : 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = isCompleted ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 130, 0, Math.PI * 2);
  ctx.stroke();

  // 6. Category Header Banner
  ctx.fillStyle = isCompleted ? '#ffffff' : accentColor;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(skill.category.toUpperCase(), cx, 105);

  // 7. Central Short Form / Acronym
  const shortForm = (skill.shortForm || skill.name.slice(0, 3)).toUpperCase();
  ctx.fillStyle = isCompleted ? '#ffffff' : '#f4f4f5';
  ctx.font = '900 84px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(shortForm, cx, cy - 8);

  // 8. Skill Name Full Subtitle
  ctx.fillStyle = isCompleted ? '#e4e4e7' : '#a1a1aa';
  ctx.font = '600 22px system-ui, sans-serif';
  ctx.fillText(skill.name.length > 20 ? skill.name.slice(0, 18) + '…' : skill.name, cx, cy + 56);

  // 9. Status / Count Indicator Badge at Bottom
  if (skill.mode === 'counter') {
    ctx.fillStyle = isCompleted ? accentColor : '#71717a';
    ctx.font = 'bold 34px monospace';
    ctx.fillText(`${count} ${skill.unit || 'HITS'}`, cx, 375);
  } else {
    ctx.fillStyle = isChecked ? '#10b981' : '#71717a';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(isChecked ? '✓ LOGGED' : '○ TAP TO LOG', cx, 375);
  }

  // 10. Outer Glowing Tactical Border Ring
  ctx.strokeStyle = isCompleted ? '#ffffff' : `${accentColor}aa`;
  ctx.lineWidth = isCompleted ? 7 : 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.stroke();

  // 11. Specular Highlights on Rim
  const specGrad = ctx.createLinearGradient(cx - 160, 15, cx + 160, 15);
  specGrad.addColorStop(0, 'transparent');
  specGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
  specGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = specGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, Math.PI * 1.25, Math.PI * 1.75);
  ctx.stroke();

  ctx.restore();
  return canvas.toDataURL('image/png');
}

export default function InstantSphereLog({
  skills,
  logs,
  currentDateStr,
  categoryColors,
  onUpdateLog
}: InstantSphereLogProps) {
  const [activeSkillId, setActiveSkillId] = useState<string>(skills[0]?.id || '');
  const [justLogged, setJustLogged] = useState(false);

  // Synchronize active skill if skills list changes
  useEffect(() => {
    if (!skills.some(s => s.id === activeSkillId) && skills.length > 0) {
      setActiveSkillId(skills[0].id);
    }
  }, [skills, activeSkillId]);

  // Find active log for each skill
  const getSkillState = useCallback((skillId: string) => {
    const log = logs.find(l => l.skillId === skillId && l.date === currentDateStr);
    return {
      count: log?.count || 0,
      checked: !!log?.checked,
      isCompleted: log ? (log.checked || log.count > 0) : false
    };
  }, [logs, currentDateStr]);

  // Convert skills into 3D InfiniteMenu items
  const menuItems: (MenuItem & { skill: Skill })[] = useMemo(() => {
    return skills.map(skill => {
      const theme = getCategoryTheme(skill.category, categoryColors);
      const state = getSkillState(skill.id);
      const textureUrl = createSkillDiscTexture(
        skill,
        state.isCompleted,
        state.count,
        state.checked,
        theme
      );

      const desc = skill.mode === 'counter'
        ? `${state.count} ${skill.unit || 'done'}`
        : (state.checked ? 'Completed' : 'Tap to log');

      return {
        image: textureUrl,
        title: skill.name,
        description: desc,
        actionIcon: skill.mode === 'counter' ? '+' : '✓',
        skill
      };
    });
  }, [skills, getSkillState, categoryColors]);

  const activeSkill = useMemo(() => {
    return skills.find(s => s.id === activeSkillId) || skills[0];
  }, [skills, activeSkillId]);

  const activeIndex = useMemo(() => {
    return skills.findIndex(s => s.id === activeSkillId);
  }, [skills, activeSkillId]);

  const activeState = activeSkill ? getSkillState(activeSkill.id) : { count: 0, checked: false, isCompleted: false };
  const activeTheme = activeSkill ? getCategoryTheme(activeSkill.category, categoryColors) : null;

  // Handle instant log action on active item
  const handleItemAction = (item?: any) => {
    const skill: Skill = item?.skill || activeSkill;
    if (!skill) return;

    if (skill.mode === 'counter') {
      const currentCount = getSkillState(skill.id).count;
      onUpdateLog(skill.id, currentDateStr, { count: currentCount + 1 });
      playTick();
      triggerHaptic('medium');
    } else {
      const currentChecked = getSkillState(skill.id).checked;
      onUpdateLog(skill.id, currentDateStr, { checked: !currentChecked });
      triggerHaptic('success');
      if (!currentChecked) playTick();
    }

    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 800);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSkill || activeSkill.mode !== 'counter') return;
    if (activeState.count > 0) {
      onUpdateLog(activeSkill.id, currentDateStr, { count: activeState.count - 1 });
      triggerHaptic('light');
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSkill || activeSkill.mode !== 'counter') return;
    onUpdateLog(activeSkill.id, currentDateStr, { count: activeState.count + 1 });
    playTick();
    triggerHaptic('medium');
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 800);
  };

  const handleStepSkill = (direction: -1 | 1) => {
    if (skills.length === 0) return;
    const nextIdx = (activeIndex + direction + skills.length) % skills.length;
    setActiveSkillId(skills[nextIdx].id);
    triggerHaptic('light');
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col select-none">
      
      {/* Top Ambient Guidance Bar */}
      <div className="absolute top-3.5 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/15 text-xs font-mono text-zinc-300 shadow-lg">
          <Sparkles size={13} className="text-cyan-400 animate-pulse" />
          <span className="font-semibold tracking-tight">Tactical Sphere • Drag & Tap</span>
        </div>

        {activeSkill && activeTheme && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/15 text-xs font-mono shadow-lg">
            <span className={`w-2 h-2 rounded-full ${activeTheme.bgActive?.split(' ')[0] || 'bg-cyan-400'}`} />
            <span className={`font-bold ${activeTheme.textMain}`}>{activeSkill.category}</span>
          </div>
        )}
      </div>

      {/* 3D InfiniteMenu Canvas View */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <InfiniteMenu 
          items={menuItems} 
          scale={0.94} 
          backgroundColor="#000000"
          onItemAction={handleItemAction}
          onActiveItemChange={(item) => {
            if (item && item.skill) {
              setActiveSkillId(item.skill.id);
            }
          }}
        />
      </div>

      {/* Side Quick Stepper Arrows */}
      <button
        type="button"
        onClick={() => handleStepSkill(-1)}
        aria-label="Previous skill"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-zinc-950/70 hover:bg-zinc-900 border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-xl"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => handleStepSkill(1)}
        aria-label="Next skill"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-zinc-950/70 hover:bg-zinc-900 border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-xl"
      >
        <ChevronRight size={18} />
      </button>

      {/* Interactive HUD Controls Bar at the Bottom */}
      {activeSkill && activeTheme && (
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 z-30 flex items-center justify-between bg-zinc-950/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 sm:p-3.5 shadow-2xl">
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white truncate">{activeSkill.name}</span>
              {activeState.isCompleted && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono font-black text-emerald-400">
                  LOGGED
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                {activeSkill.category}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] font-mono font-medium text-zinc-300">
                {activeSkill.mode === 'counter' 
                  ? `${activeState.count} ${activeSkill.unit || 'units'}` 
                  : (activeState.checked ? 'Completed today' : 'Pending')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeSkill.mode === 'counter' ? (
              <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={activeState.count <= 0}
                  aria-label="Decrement count"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 active:scale-90 transition-all"
                >
                  <Minus size={15} strokeWidth={2.5} />
                </button>
                <span className="min-w-[36px] text-center font-mono font-black text-sm sm:text-base text-white tabular-nums">
                  {activeState.count}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increment count"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-black bg-cyan-400 hover:bg-cyan-300 active:scale-90 transition-all shadow-md shadow-cyan-400/20"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleItemAction()}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-black transition-all flex items-center gap-2 active:scale-95 border ${
                  activeState.checked
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-white text-black border-white hover:bg-zinc-200 shadow-md'
                }`}
              >
                <Check size={16} strokeWidth={3.5} />
                <span>{activeState.checked ? 'Done' : 'Mark Done'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
