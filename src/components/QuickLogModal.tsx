import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, Coffee, Dumbbell, Sun, Moon } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  dateLogs: SkillLog[]; // Logs for the specific date
  onUpdateLog: (skillId: string, updates: Partial<SkillLog>) => void;
}

export default function QuickLogModal({ isOpen, onClose, skills, dateLogs, onUpdateLog }: QuickLogModalProps) {
  const getLog = (skillId: string) => dateLogs.find(l => l.skillId === skillId) || { count: 0, checked: false };

  const handleTemplateSelect = (template: string) => {
    triggerHaptic('success');
    if (template === 'morning') {
      skills.forEach(s => {
        if (s.category === 'Fitness' || s.mode === 'checkbox') {
          onUpdateLog(s.id, { checked: true });
        }
      });
    } else if (template === 'healthy_meal') {
      skills.forEach(s => {
        if (s.category === 'Diet' && s.mode === 'counter') {
          const log = getLog(s.id);
          onUpdateLog(s.id, { count: log.count + 1 });
        }
      });
    } else if (template === 'reset_all') {
      skills.forEach(s => {
        onUpdateLog(s.id, { count: 0, checked: false });
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400">
                  <Zap size={18} strokeWidth={3} />
                </div>
                <h3 className="font-bold text-white">Quick Log</h3>
              </div>
              <button aria-label="Close Quick Log" onClick={onClose} className="w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm text-zinc-400 mb-2">Select a template to log multiple activities instantly.</p>
              
              <button 
                aria-label="Apply Morning Routine Template"
                onClick={() => handleTemplateSelect('morning')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800/80 hover:border-white/10 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-[inset_0_0_15px_rgba(249,115,22,0.1)] border border-orange-500/20">
                  <Sun size={20} />
                </div>
                <div>
                  <div className="font-bold text-zinc-100">Morning Routine</div>
                  <div className="text-xs text-zinc-500">Completes all Fitness & Checkbox tasks</div>
                </div>
              </button>

              <button 
                aria-label="Apply Healthy Meal Template"
                onClick={() => handleTemplateSelect('healthy_meal')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800/80 hover:border-white/10 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:-rotate-12 transition-transform shadow-[inset_0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20">
                  <Coffee size={20} />
                </div>
                <div>
                  <div className="font-bold text-zinc-100">Healthy Meal</div>
                  <div className="text-xs text-zinc-500">Adds +1 to all Diet counters</div>
                </div>
              </button>

              <button 
                aria-label="Apply Reset Day Template"
                onClick={() => handleTemplateSelect('reset_all')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-red-950/40 hover:border-red-500/30 transition-all text-left group mt-2"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform shadow-[inset_0_0_15px_rgba(239,68,68,0.1)] border border-red-500/20">
                  <Moon size={20} />
                </div>
                <div>
                  <div className="font-bold text-red-200">Reset Day</div>
                  <div className="text-xs text-red-400/60">Clears all logs for this date</div>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
