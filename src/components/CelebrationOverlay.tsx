import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award } from 'lucide-react';
import { THEMES } from './DailyDashboardView';

interface CelebrationOverlayProps {
  skillName: string;
  milestoneValue: number;
  milestoneType: 'streak' | 'total';
  categoryThemeName: string;
  onDismiss: () => void;
}

export default function CelebrationOverlay({ 
  skillName, 
  milestoneValue, 
  milestoneType,
  categoryThemeName, 
  onDismiss 
}: CelebrationOverlayProps) {
  const theme = THEMES[categoryThemeName] || THEMES['cyan'];

  useEffect(() => {
    // Auto-dismiss after 3.5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);

    // Haptic vibration burst
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50, 100, 150]);
    }

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const label = milestoneType === 'streak' ? 'Day Streak' : 'Total Progress';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onClick={onDismiss}
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Minimal particle/glow burst */}
         <motion.div 
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${theme.bgActive} blur-3xl`}
         />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className={`w-20 h-20 rounded-3xl ${theme.bgActive} ${theme.cardBorder} flex items-center justify-center mb-6 shadow-2xl`}>
           <Award className={`w-10 h-10 ${theme.iconColor}`} />
        </div>
        
        <h2 className="text-zinc-400 font-bold tracking-widest uppercase text-sm mb-2">Milestone Unlocked</h2>
        <motion.div 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
          className={`text-8xl sm:text-9xl font-black mb-4 ${theme.giantNumber}`}
        >
          {milestoneValue}
        </motion.div>
        
        <div className={`px-4 py-2 rounded-xl ${theme.badgeBg} text-white font-bold tracking-widest uppercase text-xs sm:text-sm shadow-xl`}>
          {label} • {skillName}
        </div>
      </motion.div>
    </motion.div>
  );
}
