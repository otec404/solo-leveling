/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, ShieldCheck, ChevronRight, LogOut, Sparkles, KeyRound, Smartphone } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ReloadPrompt from './components/ReloadPrompt';
import PWAInstallButton from './components/PWAInstallButton';
import { useThemeSettings } from './hooks/useThemeSettings';

export default function App() {
  const { currentTheme, currentFont } = useThemeSettings();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'skk' && pass === 'skk') {
      setIsLoggedIn(true);
      setError(false);
    } else if (id === 'hunter' && pass === 'hunter123') {
      setIsLoggedIn(true);
      setError(false);
    } else if (!id && !pass) {
      setError(true);
    } else {
      setError(true);
    }
  };

  const handleSecretClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    
    if (clickCount.current >= 3) {
      setId('skk');
      setPass('skk');
      setIsLoggedIn(true);
      setError(false);
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => {
        if (clickCount.current > 0 && clickCount.current < 3) {
          if (id === 'skk' && pass === 'skk') {
            setIsLoggedIn(true);
            setError(false);
          } else if (id === 'hunter' && pass === 'hunter123') {
            setIsLoggedIn(true);
            setError(false);
          } else {
            setError(true);
          }
        }
        clickCount.current = 0;
      }, 350);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setId('');
    setPass('');
    setError(false);
  };

  return (
    <div 
      style={{ backgroundColor: currentTheme.hex, fontFamily: currentFont.family }}
      className={`text-zinc-100 selection:bg-cyan-500/30 transition-colors duration-300 ${!isLoggedIn ? 'min-h-screen flex items-center justify-center p-4 relative overflow-hidden' : 'h-[100dvh] h-screen overflow-hidden'}`}
    >
      <ReloadPrompt />

      {!isLoggedIn && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] opacity-30" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm sm:max-w-md relative z-10"
          >
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
              <div className="bg-zinc-950/85 backdrop-blur-3xl p-6 sm:p-8 rounded-[23px] relative overflow-hidden">
                {/* Specular top sheen line */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                {/* Header Pod */}
                <div className="flex flex-col items-center mb-6 text-center">
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SECURE PORTAL</span>
                    <PWAInstallButton variant="badge" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/15 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-3 relative group">
                    <ShieldCheck className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                    FocusFlow <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">OS</span>
                  </h1>
                  <p className="text-zinc-400 text-xs mt-1">Tactical Habit & Skill Operations Center</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">
                      Identification
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={id}
                        onChange={(e) => { setId(e.target.value); setError(false); }}
                        className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500/60 focus:bg-zinc-900/90 focus:outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="Enter Operator ID"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">
                      Passcode
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        value={pass}
                        onChange={(e) => { setPass(e.target.value); setError(false); }}
                        className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-white/10 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500/60 focus:bg-zinc-900/90 focus:outline-none transition-all text-xs sm:text-sm font-medium"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-rose-400 text-xs font-mono font-bold text-center bg-rose-500/10 py-2 rounded-xl border border-rose-500/25 flex items-center justify-center gap-1.5 shadow-sm">
                          <span>⚠️ ACCESS DENIED: Invalid Passcode</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* System Credentials Micro-Tile */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left">
                     <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                       <span className="flex items-center gap-1"><KeyRound size={11} className="text-cyan-400" /> ID: <strong className="text-white">hunter</strong></span>
                       <span>PASS: <strong className="text-cyan-300">hunter123</strong></span>
                     </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSecretClick}
                      className="relative group w-full flex items-center justify-center py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white overflow-hidden transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] focus:outline-none select-none border border-cyan-400/40"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                      <span className="relative flex items-center gap-2 pointer-events-none font-mono tracking-wider uppercase">
                        Authenticate <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : id === 'hunter' ? (
          <motion.div
            key="decoy-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#050508]"
          >
            <div className="p-5 bg-zinc-900/70 border border-white/10 rounded-3xl mb-6 shadow-2xl backdrop-blur-xl">
              <ShieldCheck className="w-12 h-12 text-zinc-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">App in progress.</h1>
            <p className="text-zinc-400 max-w-sm mb-8 text-sm">Please come back later.</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900/90 border border-white/10 hover:border-white/20 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-semibold text-sm shadow-lg"
            >
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Dashboard userId={id} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

