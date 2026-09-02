import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, LogOut, LayoutDashboard, Wrench } from 'lucide-react';
import { Skill, SkillLog, TrackingMode } from '../types';
import ManageSkillsView from './ManageSkillsView';
import DailyDashboardView from './DailyDashboardView';

interface DashboardProps {
  userId: string;
  onLogout: () => void;
}

export default function Dashboard({ userId, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'manage'>('dashboard');

  // Shared State
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Carrot', shortForm: 'Ca', mode: 'counter', category: 'Diet', createdAt: Date.now() },
    { id: '2', name: 'Plank', shortForm: 'Ph', mode: 'checkbox', category: 'Fitness', createdAt: Date.now() },
    { id: '3', name: 'Banana', shortForm: 'Ban', mode: 'counter', category: 'Diet', createdAt: Date.now() },
    { id: '4', name: 'Orange', shortForm: 'Or', mode: 'counter', category: 'Diet', createdAt: Date.now() },
  ]);
  
  // Seed some initial logs to match the prompt's example
  const todayStr = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  })();

  const [logs, setLogs] = useState<SkillLog[]>([
    { skillId: '1', date: todayStr, count: 1, checked: false },
    { skillId: '2', date: todayStr, count: 0, checked: true },
    { skillId: '3', date: todayStr, count: 2, checked: false },
    { skillId: '4', date: todayStr, count: 2, checked: false },
  ]);
  
  const [categories, setCategories] = useState<string[]>(['Diet', 'Fitness']);

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

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
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

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-black text-zinc-100 overflow-hidden">
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
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Logged in as</p>
            <p className="text-sm text-cyan-400 font-semibold truncate mt-1">Operative {userId}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" /> Terminate Session
          </button>
        </div>
      </aside>
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800/60 bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-inner">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="font-semibold tracking-tight text-white">FocusFlow</h2>
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          Operative <span className="text-cyan-400">{userId}</span>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 relative h-full bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-full"
            >
              <DailyDashboardView 
                skills={skills} 
                logs={logs} 
                onUpdateLog={handleUpdateLog} 
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
                skills={skills} 
                categories={categories}
                onAddSkill={handleAddSkill}
                onUpdateSkill={handleUpdateSkill}
                onDeleteSkill={handleDeleteSkill}
                onAddCategory={handleAddCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden border-t border-zinc-800/60 bg-zinc-950 flex items-center justify-around p-3 pb-safe z-50">
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
    </div>
  );
}
