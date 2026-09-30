import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Zap, 
  WifiOff, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Sliders,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { triggerHaptic } from '../lib/haptics';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AndroidAppModal({ isOpen, onClose }: AndroidAppModalProps) {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'troubleshoot' | 'apk'>('install');
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top);
    } catch (e) {
      setIsIframe(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    triggerHaptic('medium');
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        triggerHaptic('success');
      }
    }
  };

  const handleCopyUrl = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const modalContent = (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-zinc-950/95 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-3xl text-zinc-100 flex flex-col gap-4 relative overflow-hidden my-auto"
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Smartphone className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">Android Mobile App</h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isInstalled ? 'Installed' : 'Ready'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Install as standalone app or build an APK</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-2xl">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('install');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'install'
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Install Guide
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('troubleshoot');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'troubleshoot'
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Fix Install Error
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('apk');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'apk'
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            APK / Play Store
          </button>
        </div>

        {/* Tab 1: Install Tab */}
        {activeTab === 'install' && (
          <div className="space-y-3.5">
            {isIframe && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-amber-200">Inside Preview Frame:</strong>
                  <p className="text-zinc-300">
                    Android blocks app installation inside iframe previews. Open the direct URL in Chrome to install.
                  </p>
                </div>
              </div>
            )}

            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Running as Installed App!</h4>
                <p className="text-xs text-zinc-300">
                  FocusFlow is active in Standalone mode with full offline caching and hardware acceleration.
                </p>
              </div>
            ) : isInstallable ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-zinc-900 to-zinc-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Instant Android WebAPK</h4>
                    <p className="text-xs text-zinc-400">Chrome will create an official Android WebAPK package.</p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" /> Install App Now
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  How to Install on Android:
                </h4>
                <ol className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <span>Open in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <span>Tap the <strong>three dots (⋮)</strong> browser menu in the top-right.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                    <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </li>
                </ol>
              </div>
            )}

            {/* Quick Share URL */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
              <span className="text-zinc-400 truncate max-w-[240px] sm:max-w-xs">{window.location.href}</span>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors flex-shrink-0 ml-2"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUrl ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Troubleshoot / Fix Install Error */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <Info className="w-4 h-4" /> Why did it say "App cannot be installed"?
              </div>

              <div className="space-y-2 text-zinc-300 leading-relaxed">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <strong className="text-white block">1. Embedded Preview / Iframe restriction</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Android Chrome forbids installing web apps if they are running inside an iframe or preview sandbox.
                  </p>
                  <p className="text-emerald-300 text-[11px]">
                    <strong>Fix:</strong> Copy the app URL and open it directly in a new tab in Chrome on your phone.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <strong className="text-white block">2. Incognito / Private Browsing</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Chrome disables PWA installation and service workers while in Incognito Mode.
                  </p>
                  <p className="text-emerald-300 text-[11px]">
                    <strong>Fix:</strong> Switch to a standard (non-incognito) Chrome tab.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <strong className="text-white block">3. PNG Icon Decode Error (Now Fixed!)</strong>
                  <p className="text-zinc-400 text-[11px]">
                    Previous placeholder SVG icons were failing Android's binary PNG validation. Real 192x192 & 512x512 PNG binaries and manifest are now fully generated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: APK / Store Export Tab */}
        {activeTab === 'apk' && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Packaging for Android (.APK / .AAB)
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Because this app is fully PWA & WebAPK compliant, you can generate a signed <strong>Android APK</strong> or <strong>Google Play Store AAB</strong>:
              </p>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Method 1: PWABuilder (No Code, Free)</span>
                    <span className="text-[10px] font-mono text-cyan-400">Recommended</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Go to <strong>pwabuilder.com</strong>, paste the app URL, and click "Package for Android" to download an APK.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Method 2: Google Bubblewrap / TWA</span>
                    <span className="text-[10px] font-mono text-emerald-400">Google Official</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    npx @bubblewrap/cli init --manifest={window.location.origin}/manifest.webmanifest
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">Android PWA v2.4 • Standalone Target</span>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
