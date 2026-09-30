import React, { useState } from 'react';
import { Smartphone, Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { triggerHaptic } from '../lib/haptics';
import AndroidAppModal from './AndroidAppModal';

interface PWAInstallButtonProps {
  variant?: 'badge' | 'button' | 'compact' | 'sidebar';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'button',
  className = '' 
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setIsModalOpen(true);
  };

  return (
    <>
      {variant === 'badge' && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] ${className}`}
          title="Android Mobile App Ready"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isInstalled ? 'Android App' : 'Get Android App'}</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={handleClick}
          className={`p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] ${className}`}
          title="Android App Info & Install"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 rounded-xl transition-all border border-emerald-500/30 shadow-sm group ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Android App</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {isInstalled ? 'ACTIVE' : 'INSTALL'}
          </span>
        </button>
      )}

      {variant === 'button' && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{isInstalled ? 'Android App Settings' : 'Install Android App'}</span>
        </button>
      )}

      <AndroidAppModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default PWAInstallButton;
