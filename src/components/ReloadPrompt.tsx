import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReloadPrompt() {
  // Check for offline status. Don't prompt to update if offline.
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  if (isOffline) {
    return null;
  }

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-full bg-zinc-800/95 border border-cyan-500/30 px-4 py-2 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 cursor-pointer group" onClick={handleUpdate}>
            <RefreshCw size={14} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-200 group-hover:text-white transition-colors">
              Update Available - Tap to Refresh
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="ml-2 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
