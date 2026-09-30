import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Flame, 
  Shield, 
  Palette, 
  Download, 
  Upload, 
  Edit3, 
  Check, 
  X, 
  Snowflake, 
  Sparkles, 
  CheckCircle2,
  HardDrive,
  LogOut,
  ChevronRight,
  Smartphone,
  Zap
} from 'lucide-react';
import { Skill, SkillLog, UserProfile, AvatarPreset } from '../types';
import { THEME_COLORS } from './icons';
import AndroidAppModal from './AndroidAppModal';
import ThemeAndFontCustomizer from './ThemeAndFontCustomizer';
import { useThemeSettings } from '../hooks/useThemeSettings';

interface ProfileViewProps {
  userId: string;
  skills: Skill[];
  logs: SkillLog[];
  categoryColors: Record<string, string>;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onLogout: () => void;
}

const AVATAR_PRESETS: { id: AvatarPreset; label: string; emoji: string; bg: string }[] = [
  { id: 'hunter', label: 'Hunter', emoji: '🏹', bg: 'from-purple-900 to-indigo-900' },
  { id: 'wolf', label: 'Shadow Wolf', emoji: '🐺', bg: 'from-blue-900 to-zinc-900' },
  { id: 'man', label: 'Monarch', emoji: '👑', bg: 'from-amber-900 to-zinc-900' },
  { id: 'fox', label: 'Kitsune', emoji: '🦊', bg: 'from-orange-900 to-rose-900' },
  { id: 'raven', label: 'Night Raven', emoji: '🦅', bg: 'from-cyan-900 to-zinc-900' },
];

const THEME_OPTIONS = [
  { id: 'cyberpunk-dark', name: 'Cyberpunk Dark (Solo Leveling)', bgHex: '#0A0A0F', accent: '#6C5CE7' },
  { id: 'void-obsidian', name: 'Void Obsidian', bgHex: '#050508', accent: '#3DDDD6' },
  { id: 'emerald-matrix', name: 'Emerald Matrix', bgHex: '#06120E', accent: '#10B981' },
  { id: 'amber-sol', name: 'Amber Sol', bgHex: '#140E05', accent: '#F59E0B' },
  { id: 'monochrome-black', name: 'Black Protocol', bgHex: '#000000', accent: '#FFFFFF' }
];

export default function ProfileView({
  userId,
  skills,
  logs,
  categoryColors,
  onOpenExport,
  onOpenImport,
  onLogout
}: ProfileViewProps) {
  // Load / Save Profile state
  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem('focusflow_display_name') || 'Polisetty Sai Krishna Karthik';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  const [avatarPreset, setAvatarPreset] = useState<AvatarPreset>(() => {
    return (localStorage.getItem('focusflow_avatar_preset') as AvatarPreset) || 'hunter';
  });
  const [customAvatarUrl, setCustomAvatarUrl] = useState(() => {
    return localStorage.getItem('focusflow_custom_avatar') || '';
  });

  const {
    currentThemeId,
    currentFontId,
    setTheme,
    setFont
  } = useThemeSettings();

  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setDisplayName(tempName.trim());
      localStorage.setItem('focusflow_display_name', tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleSelectPreset = (preset: AvatarPreset) => {
    setAvatarPreset(preset);
    localStorage.setItem('focusflow_avatar_preset', preset);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCustomAvatarUrl(url);
        setAvatarPreset('custom');
        localStorage.setItem('focusflow_custom_avatar', url);
        localStorage.setItem('focusflow_avatar_preset', 'custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // STREAK ENGINE (FR-PROF-4 & FR-PROF-5: Tolerates up to 5 streak freezes)
  // ==========================================
  const streakData = useMemo(() => {
    const MAX_FREEZES = 5;
    
    // Group active dates across all logs
    const activeDatesSet = new Set<string>();
    const skillActiveDates: Record<string, Set<string>> = {};
    
    logs.forEach(l => {
      if (l.count > 0 || l.checked || (l.timerLaps && l.timerLaps.length > 0)) {
        activeDatesSet.add(l.date);
        if (!skillActiveDates[l.skillId]) skillActiveDates[l.skillId] = new Set();
        skillActiveDates[l.skillId].add(l.date);
      }
    });

    const calculateStreakWithFreezes = (datesSet: Set<string>) => {
      const today = new Date();
      let streak = 0;
      let freezesUsed = 0;
      let cursor = new Date(today);

      for (let i = 0; i < 365; i++) {
        const dStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
        
        if (datesSet.has(dStr)) {
          streak++;
        } else {
          // Check if within skip freeze tolerance
          if (freezesUsed < MAX_FREEZES) {
            freezesUsed++;
          } else {
            break;
          }
        }
        cursor.setDate(cursor.getDate() - 1);
      }
      return { streak, freezesRemaining: Math.max(0, MAX_FREEZES - freezesUsed) };
    };

    const overall = calculateStreakWithFreezes(activeDatesSet);

    const perSkill = skills.map(s => {
      const dates = skillActiveDates[s.id] || new Set();
      const res = calculateStreakWithFreezes(dates);
      return {
        skill: s,
        streak: res.streak,
        freezesRemaining: res.freezesRemaining,
        totalLogs: dates.size
      };
    }).sort((a, b) => b.streak - a.streak);

    return { overall, perSkill };
  }, [logs, skills]);

  const currentPresetObj = AVATAR_PRESETS.find(p => p.id === avatarPreset) || AVATAR_PRESETS[0];

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-zinc-100 overflow-y-auto custom-scrollbar p-4 sm:p-8 space-y-8 pb-32">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* ==================================================== */}
        {/* 1. IDENTITY & PROFILE HEADER (FR-PROF-1, 2, 3) */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Round Avatar with Presets or Custom Upload */}
            <div className="relative group">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${currentPresetObj.bg} p-1 shadow-xl flex items-center justify-center border-2 border-white/20 overflow-hidden`}>
                {avatarPreset === 'custom' && customAvatarUrl ? (
                  <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-4xl sm:text-5xl select-none">{currentPresetObj.emoji}</span>
                )}
              </div>
            </div>

            {/* User Info & Editable Name */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      className="px-3 py-1 bg-zinc-900 border border-cyan-400 rounded-xl text-lg font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="p-1.5 bg-cyan-600 rounded-lg text-white">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="p-1.5 bg-zinc-800 rounded-lg text-zinc-400">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{displayName}</h2>
                    <button 
                      onClick={() => { setTempName(displayName); setIsEditingName(true); }}
                      className="p-1.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-cyan-400 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                  ID: {userId || 'skk'}
                </span>
                <span className="text-xs text-zinc-500 font-semibold">•</span>
                <span className="text-xs font-bold text-zinc-400">Solo Leveling Status Protocol</span>
              </div>
            </div>

            {/* Quick Logout */}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-zinc-900/80 hover:bg-red-500/10 hover:border-red-500/30 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:text-red-400 transition-all flex items-center gap-2"
            >
              <LogOut size={14} /> Terminate
            </button>
          </div>

          {/* Avatar Presets Selector Row */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mb-3">
              Avatar Archetype Presets (FR-PROF-1)
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {AVATAR_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    avatarPreset === preset.id 
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg' 
                      : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.label}</span>
                </button>
              ))}

              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-white/20 bg-zinc-900/30 text-xs font-bold text-zinc-400 hover:text-white hover:border-white/40 transition-colors cursor-pointer">
                <span>📁 Upload Custom</span>
                <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. STREAKS & FREEZES (FR-PROF-4, FR-PROF-5) */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Discipline Streaks & Freezes
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">Overall continuity with 5-day streak freeze grace tolerance</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Snowflake size={14} />
              <span>{streakData.overall.freezesRemaining} Freezes Remaining</span>
            </div>
          </div>

          {/* Overall Streak Big Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Master Level Streak</span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                <span>{streakData.overall.streak}</span>
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Days Continuous</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                    i < streakData.overall.freezesRemaining 
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                  title={`Freeze Slot ${i + 1}`}
                >
                  <Snowflake size={12} />
                </div>
              ))}
            </div>
          </div>

          {/* Per-Skill Streaks Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Individual Skill Consistency</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {streakData.perSkill.map(({ skill, streak, freezesRemaining, totalLogs }) => {
                const isSpecialBlack = skill.category.toLowerCase() === 'black';
                const colorHex = isSpecialBlack ? '#ffffff' : THEME_COLORS[categoryColors[skill.category] || 'purple'] || '#818cf8';

                return (
                  <div
                    key={skill.id}
                    className="p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-mono text-xs font-black"
                          style={{ color: colorHex }}
                        >
                          {skill.shortForm}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-white">{skill.name}</h5>
                          <span className="text-[10px] font-semibold text-zinc-500">{skill.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-white">{streak}</span>
                        <span className="text-[10px] font-bold text-zinc-500 block">days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 pt-2 border-t border-white/5">
                      <span>{totalLogs} lifetime logs</span>
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Snowflake size={10} /> {freezesRemaining}/5 freeze
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. THEME & TYPOGRAPHY SETTINGS */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                Theme Background & Typography Control
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Customize between 8 Dark OLED/Midnight backdrops, 8 Light aesthetics, and 8 System Typefaces.
              </p>
            </div>
          </div>

          <ThemeAndFontCustomizer 
            currentThemeId={currentThemeId}
            currentFontId={currentFontId}
            onSelectTheme={setTheme}
            onSelectFont={setFont}
          />
        </div>

        {/* ==================================================== */}
        {/* 4. BACKUP & RESTORE SECTION (FR-PROF-6) */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
          <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            Backup & Data Integrity (FR-PROF-6)
          </h3>
          <p className="text-xs text-zinc-400 font-medium">
            Export a neat, human-readable text/JSON backup file. Restore merges with existing data without overwriting.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={onOpenExport}
              className="p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-4 text-left group"
            >
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Download size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Export Backup File</h4>
                <p className="text-xs text-zinc-400">Generate formatted .json / .txt archive</p>
              </div>
            </button>

            <button
              onClick={onOpenImport}
              className="p-5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-white/10 hover:border-purple-400/50 transition-all flex items-center gap-4 text-left group"
            >
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Upload size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Import & Merge Data</h4>
                <p className="text-xs text-zinc-400">Non-destructive merge restore</p>
              </div>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 5. ANDROID MOBILE APP & PWA DEPLOYMENT */}
        {/* ==================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-zinc-950/80 to-zinc-950/80 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                  Android Mobile Application
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Standalone WebAPK, Google Play packaging, 100% offline sync, and native haptic feedback.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <Zap size={14} className="fill-black" /> Open Manager
            </button>
          </div>
        </div>

        {/* Android App Modal */}
        <AndroidAppModal 
          isOpen={isAndroidModalOpen}
          onClose={() => setIsAndroidModalOpen(false)}
        />

      </div>
    </div>
  );
}
