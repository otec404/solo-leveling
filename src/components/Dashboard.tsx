import { initialSkills, initialLogs } from '../data/historicalData';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, LogOut, LayoutDashboard, Wrench, WifiOff } from 'lucide-react';
import { Skill, SkillLog, TrackingMode } from '../types';
import ManageSkillsView from './ManageSkillsView';
import DailyDashboardView from './DailyDashboardView';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import StatsView from './StatsView';
import { BarChart2, Search, Filter, Download, Upload } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

export default function Dashboard({ userId, onLogout }: DashboardProps) {
  const isOnline = useOnlineStatus();
  const [activeView, setActiveView] = useState<'dashboard' | 'stats' | 'manage'>('dashboard');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [lastBackupInfo, setLastBackupInfo] = useState<{date: string, size: number} | null>(() => {
    try {
      const stored = localStorage.getItem('focusflow_last_backup');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return null;
  });
  
  // Global Search & Filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalCategory, setGlobalCategory] = useState('All');


  // Shared State
  const {
    isLoaded,
    skills, setSkills,
    logs, setLogs,
    categories, setCategories,
    categoryColors, setCategoryColors
  } = useDataStore();
  
  // Seed some initial logs to match the prompt's example
  const todayStr = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  })();

    
    
  
  

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (touchStartRef.current === null) return;
    
    const touchEndX = e.clientX;
    const touchEndY = e.clientY;
    
    const distanceX = touchStartRef.current.x - touchEndX;
    const distanceY = touchStartRef.current.y - touchEndY;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      const catList = ['All', ...categories];
      const currentIndex = catList.indexOf(globalCategory);
      
      if (distanceX > minSwipeDistance) {
        // Swiped left -> next category
        const nextIndex = (currentIndex + 1) % catList.length;
        setGlobalCategory(catList[nextIndex]);
      } else {
        // Swiped right -> prev category
        const prevIndex = (currentIndex - 1 + catList.length) % catList.length;
        setGlobalCategory(catList[prevIndex]);
      }
    }
    touchStartRef.current = null;
  };



  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const distanceX = touchStartRef.current.x - touchEndX;
    const distanceY = touchStartRef.current.y - touchEndY;
    
    const minSwipeDistance = 50;
    
    // Only trigger if horizontal swipe is significantly larger than vertical movement
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      const catList = ['All', ...categories];
      const currentIndex = catList.indexOf(globalCategory);
      
      if (distanceX > minSwipeDistance) {
        // Swiped left -> next category
        const nextIndex = (currentIndex + 1) % catList.length;
        setGlobalCategory(catList[nextIndex]);
      } else {
        // Swiped right -> prev category
        const prevIndex = (currentIndex - 1 + catList.length) % catList.length;
        setGlobalCategory(catList[prevIndex]);
      }
    }
    touchStartRef.current = null;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.skills && Array.isArray(parsed.skills)) {
          setSkills(parsed.skills);
        }
        if (parsed.logs && Array.isArray(parsed.logs)) {
          setLogs(parsed.logs);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error("Failed to parse import data", err);
      }
    };
    reader.readAsText(file);
  };

  const handleExportData = () => { setIsExportModalOpen(true); };
  
  // Update last backup info when modal closes if they exported? We can't know for sure unless we hook it, but let's assume if they open the modal they might export.
  // Actually, we can hook into ExportModal but let's just do it here for now.

  // Skill Handlers
  const handleAddSkill = (skillData: Omit<Skill, 'id' | 'createdAt'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setSkills([...skills, newSkill]);
  };

  const handleUpdateSkill = (id: string, skillData: Omit<Skill, 'id' | 'createdAt'>) => {
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
        newLogs[existingIndex] = { ...newLogs[existingIndex], ...updates };
        return newLogs;
      }
      return [...prev, { skillId, date, count: 0, checked: false, ...updates }];
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
          <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
          <p className="text-sm uppercase tracking-widest font-bold">Loading Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-black text-zinc-100 overflow-hidden relative">
      {!isOnline && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-800/90 border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-300 shadow-xl backdrop-blur-md">
          <WifiOff size={14} className="text-amber-500" />
          Offline Mode
        </div>
      )}
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800/60 bg-zinc-950 flex-col flex-shrink-0">
        <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-inner">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="font-semibold tracking-tight text-lg text-white">FocusFlow</h2>
          </div>
        </div>
        
        
        <nav className="flex-1 p-4 flex flex-col gap-2">

          <button
            aria-label="View Daily Log"
            aria-current={activeView === 'dashboard' ? 'page' : undefined}
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Daily Log
          </button>
          
          <button
            aria-label="View Analytics"
            aria-current={activeView === 'stats' ? 'page' : undefined}
            onClick={() => setActiveView('stats')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeView === 'stats'
                ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <BarChart2 className="w-5 h-5" /> Analytics
          </button>
          
          <button
            aria-label="Manage Skills"
            aria-current={activeView === 'manage' ? 'page' : undefined}
            onClick={() => setActiveView('manage')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeView === 'manage'
                ? 'bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Wrench className="w-5 h-5" /> Manage Skills
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800/60">
          <div className="px-4 py-3 mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Logged in as</p>
              <p className="text-sm text-cyan-400 font-semibold truncate mt-1">Operative {userId}</p>
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors border border-zinc-800/80 hover:border-zinc-700 shadow-sm"
          >
            <Download className="w-5 h-5 text-cyan-400" /> Download Report
          </button>
          <button
            onClick={handleImportClick}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors border border-zinc-800/80 hover:border-zinc-700 shadow-sm"
          >
            <Upload className="w-5 h-5 text-purple-400" /> Restore Report
          </button>
          

          {lastBackupInfo && (
            <div className="px-4 py-3 mb-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Last Backup</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300">{new Date(lastBackupInfo.date).toLocaleDateString()}</span>
                <span className="text-[10px] text-zinc-500">{(lastBackupInfo.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" /> Terminate Session
          </button>
        </div>
      </aside>
      
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl flex-shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-inner">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="font-semibold tracking-tight text-white">FocusFlow</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImportClick} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-zinc-300 hover:text-white bg-zinc-900 active:bg-zinc-800 rounded-lg transition-colors border border-zinc-800/80"
          >
            <Upload size={14} className="text-purple-400" /> 
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button 
            onClick={handleExportData} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase text-zinc-300 hover:text-white bg-zinc-900 active:bg-zinc-800 rounded-lg transition-colors border border-zinc-800/80"
          >
            <Download size={14} className="text-cyan-400" /> 
            <span>Report</span>
          </button>
          <div className="text-xs text-zinc-500 font-medium">
            <span className="text-cyan-400">{userId}</span>
          </div>
        </div>
      </header>

      
      {/* Main Content Area */}
      <main className="flex-1 relative h-full bg-black flex flex-col overflow-hidden">
        {/* Sticky Glassmorphic Search Bar */}
        <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              aria-label="Search skills"
              type="text" 
              placeholder="Search skills by name or symbol..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 shadow-inner transition-all hover:bg-zinc-800/50 text-sm sm:text-base font-medium"
            />
          </div>
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
            <select 
              aria-label="Filter by category"
              value={globalCategory} 
              onChange={e => setGlobalCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl text-white focus:outline-none appearance-none shadow-inner transition-all hover:bg-zinc-800/50 text-sm sm:text-base font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { touchStartRef.current = null; }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-full"
            >
              <DailyDashboardView 
                skills={filteredSkills} logs={logs} onUpdateLog={handleUpdateLog} categoryColors={categoryColors} onReorderSkills={handleReorderSkills}
              />
            </motion.div>
          )}
          
          {activeView === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-full"
            >
              <StatsView 
                 skills={filteredSkills} 
                 logs={logs} 
                 
                 categoryColors={categoryColors}
              />
            </motion.div>
          )}
          
          {activeView === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Glassmorphic */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-around p-2 pb-safe z-50">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
            activeView === 'dashboard' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Log</span>
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
            activeView === 'stats' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Stats</span>
        </button>
        <button
          onClick={() => setActiveView('manage')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
            activeView === 'manage' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Skills</span>
        </button>
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl text-zinc-500 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Logout</span>
        </button>
            </nav>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        userId={userId}
        skills={skills}
        logs={logs}
      />
    </div>
  );
}
