import { initialSkills, initialLogs } from '../data/historicalData';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  LogOut, 
  LayoutDashboard, 
  Wrench, 
  WifiOff, 
  FileText, 
  BarChart2, 
  User, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Skill, SkillLog, BlankNote } from '../types';
import ManageSkillsView from './ManageSkillsView';
import DailyDashboardView from './DailyDashboardView';
import ListView from './ListView';
import ProfileView from './ProfileView';
import StatsView from './StatsView';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import LegacyImportWizard from './LegacyImportWizard';
import AppendixReferenceModal from './AppendixReferenceModal';
import TimerSkillModal from './TimerSkillModal';
import IconStudioView from './IconStudioView';
import PWAInstallButton from './PWAInstallButton';
import { useDataStore } from '../hooks/useDataStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useDynamicAccent } from '../hooks/useDynamicAccent';
import { useMilestoneCelebration } from '../hooks/useMilestoneCelebration';
import CelebrationOverlay from './CelebrationOverlay';

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

export type ActiveTab = 'list' | 'logs' | 'analytics' | 'skills' | 'icons' | 'profile';

export default function Dashboard({ userId, onLogout }: DashboardProps) {
  const isOnline = useOnlineStatus();
  const [activeView, setActiveView] = useState<ActiveTab>('logs');
  const [selectedDashboardDate, setSelectedDashboardDate] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLegacyImportOpen, setIsLegacyImportOpen] = useState(false);
  const [isAppendixModalOpen, setIsAppendixModalOpen] = useState(false);
  const [lastBackupInfo, setLastBackupInfo] = useState<{date: string, size: number} | null>(() => {
    try {
      const stored = localStorage.getItem('focusflow_last_backup');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return null;
  });

  // Blank notes / asides state
  const [blankNotes, setBlankNotes] = useState<BlankNote[]>(() => {
    try {
      const stored = localStorage.getItem('focusflow_blank_notes');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      { id: 'bn_1', date: '2026-07-26', text: '(Dharmavaram biryani)', category: 'Black', timestamp: 1785000000000 },
      { id: 'bn_2', date: '2026-08-13', text: '(bad diet)', category: 'Black', timestamp: 1786500000000 },
      { id: 'bn_3', date: '2026-07-31', text: 'Bhimas - chapati/veg frd ric', category: 'Black', timestamp: 1785500000000 }
    ];
  });

  const handleAddBlankNote = (note: Omit<BlankNote, 'id' | 'timestamp'>) => {
    const newNote: BlankNote = {
      ...note,
      id: `bn_${Date.now()}`,
      timestamp: Date.now()
    };
    const updated = [newNote, ...blankNotes];
    setBlankNotes(updated);
    localStorage.setItem('focusflow_blank_notes', JSON.stringify(updated));
  };

  const handleUpdateBlankNote = (id: string, text: string, category?: string, date?: string) => {
    const updated = blankNotes.map(b => b.id === id ? { 
      ...b, 
      text, 
      ...(category !== undefined ? { category } : {}),
      ...(date !== undefined ? { date } : {})
    } : b);
    setBlankNotes(updated);
    localStorage.setItem('focusflow_blank_notes', JSON.stringify(updated));
  };

  const handleDeleteBlankNote = (id: string) => {
    const updated = blankNotes.filter(b => b.id !== id);
    setBlankNotes(updated);
    localStorage.setItem('focusflow_blank_notes', JSON.stringify(updated));
  };
  
  // Global Search & Filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalCategory, setGlobalCategory] = useState('All');

  // Shared State
  const {
    isLoaded,
    skills, setSkills,
    logs, setLogs,
    categories, setCategories,
    categoryColors, setCategoryColors,
    metrics, setMetrics,
    metricLogs, setMetricLogs
  } = useDataStore();
  
  useDynamicAccent(logs, skills, categoryColors);
  const { activeCelebration, clearCelebration } = useMilestoneCelebration(logs, skills);

  // Timer skill modal
  const [activeTimerSkill, setActiveTimerSkill] = useState<Skill | null>(null);
  const [activeTimerDate, setActiveTimerDate] = useState<string>('');

  const handleOpenTimerModal = (skill: Skill, dateStr: string) => {
    setActiveTimerSkill(skill);
    setActiveTimerDate(dateStr);
  };

  const handleSaveTimerLog = (skillId: string, date: string, laps: any[], duration: number) => {
    handleUpdateLog(skillId, date, {
      timerLaps: laps,
      timerDuration: duration,
      count: laps.length,
      checked: laps.length > 0,
      timestamp: Date.now()
    });
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleLegacyImport = (data: any, strategy: string) => {
     if (strategy === 'merge') {
       if (data.skills?.length > 0) {
         setSkills(prev => {
            const map = new Map(prev.map(s => [s.name + s.category, s]));
            data.skills.forEach((s: Skill) => {
               if (!map.has(s.name + s.category)) map.set(s.name + s.category, s);
            });
            return Array.from(map.values());
         });
       }
       if (data.logs?.length > 0) {
         setLogs(prev => {
            const map = new Map(prev.map(l => [l.skillId + "_" + l.date, l]));
            data.logs.forEach((l: SkillLog) => {
               map.set(l.skillId + "_" + l.date, l);
            });
            return Array.from(map.values());
         });
       }
       if (data.metrics?.length > 0) {
         setMetrics(prev => {
            const map = new Map((prev || []).map(m => [m.id, m]));
            data.metrics.forEach((m: any) => map.set(m.id, m));
            return Array.from(map.values());
         });
       }
       if (data.metricLogs?.length > 0) {
         setMetricLogs(prev => {
            const map = new Map((prev || []).map(l => [l.metricId + "_" + l.date, l]));
            data.metricLogs.forEach((l: any) => map.set(l.metricId + "_" + l.date, l));
            return Array.from(map.values());
         });
       }
     }
  };

  const handleImportHistoricalData = (data: { skills: Skill[]; logs: SkillLog[]; metrics?: any[]; metricLogs?: any[] }) => {
    if (data.skills && data.skills.length > 0) {
      setSkills(prev => {
        const map = new Map(prev.map(s => [s.id, s]));
        data.skills.forEach(s => {
          if (!map.has(s.id)) map.set(s.id, s);
        });
        return Array.from(map.values());
      });
    }

    if (data.logs && data.logs.length > 0) {
      setLogs(prev => {
        const map = new Map(prev.map(l => [`${l.skillId}_${l.date}`, l]));
        data.logs.forEach(l => {
          map.set(`${l.skillId}_${l.date}`, l);
        });
        return Array.from(map.values());
      });
    }

    if (data.metrics && data.metrics.length > 0) {
      setMetrics(prev => {
        const map = new Map((prev || []).map(m => [m.id, m]));
        data.metrics.forEach(m => map.set(m.id, m));
        return Array.from(map.values());
      });
    }

    if (data.metricLogs && data.metricLogs.length > 0) {
      setMetricLogs(prev => {
        const map = new Map((prev || []).map(l => [`${l.metricId}_${l.date}`, l]));
        data.metricLogs.forEach(l => map.set(`${l.metricId}_${l.date}`, l));
        return Array.from(map.values());
      });
    }
  };

  const handleImportProcess = (data: any, strategy: 'replace' | 'merge') => {
    // 1. Sanitize skills
    const rawSkills = Array.isArray(data.skills) ? data.skills : [];
    const validSkills: Skill[] = rawSkills
      .filter((s: any) => s && typeof s.id === 'string' && s.name)
      .map((s: any) => ({
        id: String(s.id),
        name: String(s.name),
        shortForm: String(s.shortForm || s.name.slice(0, 3).toUpperCase()),
        mode: (['counter', 'checkbox', 'timer', 'measurement'].includes(s.mode) ? s.mode : 'counter'),
        category: String(s.category || 'General'),
        icon: s.icon ? String(s.icon) : undefined,
        iconColor: s.iconColor ? String(s.iconColor) : undefined,
        iconStroke: typeof s.iconStroke === 'number' ? s.iconStroke : undefined,
        unit: s.unit ? String(s.unit) : undefined,
        description: s.description ? String(s.description) : undefined,
        fillColor: s.fillColor ? String(s.fillColor) : undefined,
        borderColor: s.borderColor ? String(s.borderColor) : undefined,
        createdAt: typeof s.createdAt === 'number' ? s.createdAt : Date.now(),
      }));

    // 2. Sanitize logs
    const rawLogs = Array.isArray(data.logs) ? data.logs : [];
    const validLogs: SkillLog[] = rawLogs
      .filter((l: any) => l && typeof l.skillId === 'string' && typeof l.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(l.date))
      .map((l: any) => ({
        skillId: String(l.skillId),
        date: String(l.date),
        count: typeof l.count === 'number' && !isNaN(l.count) ? l.count : 0,
        checked: Boolean(l.checked),
        value: typeof l.value === 'number' && !isNaN(l.value) ? l.value : undefined,
        notes: l.notes ? String(l.notes) : undefined,
        timestamp: typeof l.timestamp === 'number' ? l.timestamp : Date.now(),
        timerDuration: typeof l.timerDuration === 'number' ? l.timerDuration : undefined,
        timerLaps: Array.isArray(l.timerLaps) ? l.timerLaps.map((lap: any, idx: number) => ({
          lapNumber: typeof lap.lapNumber === 'number' ? lap.lapNumber : idx + 1,
          duration: typeof lap.duration === 'number' ? lap.duration : 0,
          formatted: String(lap.formatted || '00:00.0'),
          timestamp: typeof lap.timestamp === 'number' ? lap.timestamp : Date.now(),
          note: lap.note || lap.notes ? String(lap.note || lap.notes) : undefined
        })) : undefined
      }));

    // 3. Sanitize categories
    const validCategories: string[] = Array.isArray(data.categories) 
      ? Array.from(new Set(data.categories.map((c: any) => String(c).trim()).filter(Boolean)))
      : [];

    // 4. Sanitize category colors
    const validCategoryColors: Record<string, string> = (data.categoryColors && typeof data.categoryColors === 'object')
      ? data.categoryColors
      : {};

    // 5. Sanitize blank notes
    const rawBlankNotes = Array.isArray(data.blankNotes) ? data.blankNotes : [];
    const validBlankNotes: BlankNote[] = rawBlankNotes
      .filter((b: any) => b && typeof b.id === 'string' && typeof b.date === 'string' && typeof b.text === 'string')
      .map((b: any) => ({
        id: String(b.id),
        date: String(b.date),
        text: String(b.text),
        category: b.category ? String(b.category) : undefined,
        timestamp: typeof b.timestamp === 'number' ? b.timestamp : Date.now()
      }));

    if (strategy === 'replace') {
      setSkills(validSkills);
      setLogs(validLogs);
      if (validCategories.length > 0) setCategories(validCategories);
      if (Object.keys(validCategoryColors).length > 0) setCategoryColors(validCategoryColors);
      if (validBlankNotes.length > 0) {
        setBlankNotes(validBlankNotes);
        localStorage.setItem('focusflow_blank_notes', JSON.stringify(validBlankNotes));
      }
    } else {
      // High-speed O(N) merge using HashMaps (0ms lag even with 50,000 records)
      setSkills(prev => {
        const map = new Map(prev.map(s => [s.id, s]));
        validSkills.forEach(s => map.set(s.id, s));
        return Array.from(map.values());
      });

      setLogs(prev => {
        const map = new Map(prev.map(l => [`${l.skillId}_${l.date}`, l]));
        validLogs.forEach(l => map.set(`${l.skillId}_${l.date}`, l));
        return Array.from(map.values());
      });

      if (validCategories.length > 0) {
        setCategories(prev => Array.from(new Set([...prev, ...validCategories])));
      }

      if (Object.keys(validCategoryColors).length > 0) {
        setCategoryColors(prev => ({ ...prev, ...validCategoryColors }));
      }

      if (validBlankNotes.length > 0) {
        setBlankNotes(prev => {
          const map = new Map(prev.map(b => [b.id, b]));
          validBlankNotes.forEach(b => map.set(b.id, b));
          const merged = Array.from(map.values());
          localStorage.setItem('focusflow_blank_notes', JSON.stringify(merged));
          return merged;
        });
      }
    }
  };

  const handleExportData = () => { setIsExportModalOpen(true); };

  // Skill Handlers
  const handleAddSkill = (skillData: Omit<Skill, 'id' | 'createdAt'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setSkills([...skills, newSkill]);
  };

  const handleUpdateSkill = (id: string, skillData: Partial<Skill>) => {
    setSkills(skills.map(s => s.id === id ? { ...s, ...skillData } : s));
  };

  const handleReorderSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const handleUpdateCategoryColor = (category: string, color: string) => {
    setCategoryColors(prev => ({ ...prev, [category]: color }));
  };

  // Log Handlers
  const handleUpdateLog = (skillId: string, date: string, updates: Partial<SkillLog>) => {
    setLogs(prev => {
      const existingIndex = prev.findIndex(l => l.skillId === skillId && l.date === date);
      if (existingIndex >= 0) {
        const newLogs = [...prev];
        newLogs[existingIndex] = { ...newLogs[existingIndex], ...updates, timestamp: Date.now() };
        return newLogs;
      }
      return [...prev, { skillId, date, count: 0, checked: false, ...updates, timestamp: Date.now() }];
    });
  };

  // Filtered skills for child views
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(globalSearch.toLowerCase()) || skill.shortForm.toLowerCase().includes(globalSearch.toLowerCase()) || (skill.icon && skill.icon.toLowerCase().includes(globalSearch.toLowerCase()));
    const matchesCategory = globalCategory === 'All' || skill.category === globalCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-zinc-100">
        <div className="text-zinc-500 flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-app-accent animate-pulse" />
          <p className="text-sm uppercase tracking-widest font-bold">Loading Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[var(--app-bg,#0B0B0D)] text-zinc-100 overflow-hidden relative transition-colors duration-300">
      {!isOnline && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-800/90 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 shadow-xl backdrop-blur-md">
          <WifiOff className="w-4 h-4 text-amber-400" />
          <span>Offline Mode Active</span>
        </div>
      )}
      
      {/* Dynamic Theme Injector or Milestone Popups */}
      {activeCelebration && (
        <CelebrationOverlay 
          skillName={activeCelebration.skillName}
          milestoneValue={activeCelebration.milestoneValue}
          milestoneType={activeCelebration.milestoneType}
          categoryThemeName={categoryColors[activeCelebration.category] || 'cyan'}
          onDismiss={clearCelebration} 
        />
      )}

      {/* ==================================================== */}
      {/* DESKTOP & TABLET-LANDSCAPE / TV LEFT-SIDE RAIL NAV */}
      {/* ==================================================== */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-white/[0.08] bg-[#07070a]/90 backdrop-blur-2xl flex-shrink-0 z-40 select-none relative">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-black tracking-tight text-white text-base flex items-center gap-1.5">
                FocusFlow <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">PRO</span>
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono font-semibold tracking-wider">TACTICAL HABIT OS</span>
            </div>
          </div>
        </div>

        {/* Navigation Destination Items (5 Tabs - Section 4 PRD) */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button
            aria-label="View History List"
            aria-current={activeView === 'list' ? 'page' : undefined}
            onClick={() => setActiveView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'list'
                ? 'bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent text-white shadow-lg border border-purple-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'list' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/[0.05] text-purple-400'}`}>
              <FileText className="w-4 h-4" /> 
            </div>
            <span>List History</span>
            {activeView === 'list' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            )}
          </button>

          <button
            aria-label="View Daily Logs"
            aria-current={activeView === 'logs' ? 'page' : undefined}
            onClick={() => setActiveView('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'logs'
                ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-white shadow-lg border border-cyan-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'logs' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] text-cyan-400'}`}>
              <LayoutDashboard className="w-4 h-4" /> 
            </div>
            <span>Daily Logs</span>
            {activeView === 'logs' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>
          
          <button
            aria-label="View Analytics"
            aria-current={activeView === 'analytics' ? 'page' : undefined}
            onClick={() => setActiveView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'analytics'
                ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-white shadow-lg border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'analytics' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-emerald-400'}`}>
              <BarChart2 className="w-4 h-4" /> 
            </div>
            <span>Analytics</span>
            {activeView === 'analytics' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            )}
          </button>
          
          <button
            aria-label="Manage Skills"
            aria-current={activeView === 'skills' ? 'page' : undefined}
            onClick={() => setActiveView('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'skills'
                ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-white shadow-lg border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'skills' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.05] text-amber-400'}`}>
              <Wrench className="w-4 h-4" /> 
            </div>
            <span>Skills</span>
            {activeView === 'skills' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            )}
          </button>

          <button
            aria-label="Icon Studio"
            aria-current={activeView === 'icons' ? 'page' : undefined}
            onClick={() => setActiveView('icons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'icons'
                ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-white shadow-lg border border-cyan-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'icons' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.05] text-cyan-400'}`}>
              <Sparkles className="w-4 h-4" /> 
            </div>
            <span>Icon Studio</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 ml-1">184</span>
            {activeView === 'icons' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          <button
            aria-label="Profile and Identity"
            aria-current={activeView === 'profile' ? 'page' : undefined}
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative ${
              activeView === 'profile'
                ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent text-white shadow-lg border border-rose-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeView === 'profile' ? 'bg-rose-500/20 text-rose-300' : 'bg-white/[0.05] text-rose-400'}`}>
              <User className="w-4 h-4" /> 
            </div>
            <span>Profile</span>
            {activeView === 'profile' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <PWAInstallButton variant="sidebar" />

          <button
            onClick={() => setIsAppendixModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 rounded-xl transition-all border border-purple-500/30 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-purple-400" /> Appendix Reference
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* MAIN VIEW CONTENT CONTAINER */}
      {/* ==================================================== */}
      <main className="flex-1 relative min-h-0 bg-[var(--app-bg,#0B0B0D)] flex flex-col overflow-hidden transition-colors duration-300">
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'list' && (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <ListView 
                  skills={skills} 
                  logs={logs} 
                  categories={categories} 
                  categoryColors={categoryColors} 
                  blankNotes={blankNotes}
                  onUpdateLog={handleUpdateLog}
                  onAddBlankNote={handleAddBlankNote}
                  onUpdateBlankNote={handleUpdateBlankNote}
                  onDeleteBlankNote={handleDeleteBlankNote}
                  onJumpToDate={(dateStr) => {
                    setSelectedDashboardDate(dateStr);
                    setActiveView('logs');
                  }}
                />
              </motion.div>
            )}

            {activeView === 'logs' && (
              <motion.div
                key="logs-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <DailyDashboardView 
                  skills={skills} 
                  logs={logs} 
                  onUpdateLog={handleUpdateLog} 
                  categoryColors={categoryColors} 
                  onReorderSkills={handleReorderSkills}
                  onUpdateSkill={handleUpdateSkill}
                  searchQuery={globalSearch}
                  onOpenTimerModal={handleOpenTimerModal}
                  selectedDate={selectedDashboardDate}
                  onSelectDate={(d) => setSelectedDashboardDate(d)}
                />
              </motion.div>
            )}
            
            {activeView === 'analytics' && (
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <StatsView skills={filteredSkills} logs={logs} categoryColors={categoryColors} userId={userId} />
              </motion.div>
            )}
            
            {activeView === 'skills' && (
              <motion.div
                key="skills-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <ManageSkillsView 
                  skills={filteredSkills} 
                  categories={categories}
                  categoryColors={categoryColors}
                  onAddSkill={handleAddSkill}
                  onUpdateSkill={handleUpdateSkill}
                  onDeleteSkill={handleDeleteSkill}
                  onAddCategory={handleAddCategory}
                  onUpdateCategoryColor={handleUpdateCategoryColor}
                  onOpenAppendix={() => setIsAppendixModalOpen(true)}
                  onOpenStudio={(skillId) => setActiveView('icons')}
                />
              </motion.div>
            )}

            {activeView === 'icons' && (
              <motion.div
                key="icons-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <IconStudioView
                  skills={skills}
                  onUpdateSkill={handleUpdateSkill}
                  onBack={() => setActiveView('logs')}
                  onOpenExport={handleExportData}
                  onOpenImport={handleImportClick}
                  categoryColors={categoryColors}
                />
              </motion.div>
            )}

            {activeView === 'profile' && (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <ProfileView
                  userId={userId}
                  skills={skills}
                  logs={logs}
                  categoryColors={categoryColors}
                  onOpenExport={handleExportData}
                  onOpenImport={handleImportClick}
                  onLogout={onLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ==================================================== */}
      {/* MOBILE 5-DESTINATION BOTTOM NAVIGATION BAR (PRD Section 4) */}
      {/* ==================================================== */}
      <nav className="md:hidden fixed bottom-2 left-2 right-2 border border-white/10 bg-[#0c0c12]/90 backdrop-blur-2xl rounded-2xl flex items-center justify-around p-1.5 pb-safe z-50 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => setActiveView('list')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
            activeView === 'list' 
              ? 'text-purple-300 font-bold bg-purple-500/15 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-wider uppercase">List</span>
        </button>

        <button
          onClick={() => setActiveView('logs')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
            activeView === 'logs' 
              ? 'text-cyan-300 font-bold bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-wider uppercase">Logs</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
            activeView === 'analytics' 
              ? 'text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-wider uppercase">Stats</span>
        </button>

        <button
          onClick={() => setActiveView('skills')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
            activeView === 'skills' 
              ? 'text-amber-300 font-bold bg-amber-500/15 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-wider uppercase">Skills</span>
        </button>

        <button
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
            activeView === 'profile' 
              ? 'text-rose-300 font-bold bg-rose-500/15 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-wider uppercase">Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        userId={userId}
        skills={skills}
        logs={logs}
        categories={categories}
        categoryColors={categoryColors}
        blankNotes={blankNotes}
        onExported={(size) => {
           const info = { date: new Date().toISOString(), size };
           setLastBackupInfo(info);
           localStorage.setItem('focusflow_last_backup', JSON.stringify(info));
        }}
      />
      <LegacyImportWizard isOpen={isLegacyImportOpen} onClose={() => setIsLegacyImportOpen(false)} onImport={handleLegacyImport} existingSkills={skills} />
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImportProcess} />
      <AppendixReferenceModal 
        isOpen={isAppendixModalOpen} 
        onClose={() => setIsAppendixModalOpen(false)} 
        onImportHistoricalData={handleImportHistoricalData} 
      />
      <TimerSkillModal
        isOpen={!!activeTimerSkill}
        onClose={() => setActiveTimerSkill(null)}
        skill={activeTimerSkill}
        dateStr={activeTimerDate}
        existingLog={activeTimerSkill ? logs.find(l => l.skillId === activeTimerSkill.id && l.date === activeTimerDate) : undefined}
        onSaveTimerLog={handleSaveTimerLog}
      />
    </div>
  );
}
