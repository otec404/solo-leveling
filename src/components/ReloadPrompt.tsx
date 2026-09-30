import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    triggerHaptic('light');
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-[9999] max-w-sm bg-zinc-950/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-zinc-100 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              {offlineReady ? 'App Ready Offline' : 'New Update Available'}
            </h4>
            <p className="text-[11px] text-zinc-400">
              {offlineReady
                ? 'FocusFlow is now cached for offline Android use.'
                : 'A newer version of FocusFlow is ready.'}
            </p>
          </div>
        </div>
        <button
          onClick={close}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {needRefresh && (
        <button
          onClick={() => {
            triggerHaptic('success');
            updateServiceWorker(true);
          }}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload & Update
        </button>
      )}
    </div>
  );
}
