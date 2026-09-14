/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, ShieldCheck, ChevronRight, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ReloadPrompt from './components/ReloadPrompt';

export default function App() {
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
    } else if (id === 'hunter' && pass === 'hunter') {
      setIsLoggedIn(true);
      setError(false);
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
          // If it was just a single or double click, trigger the normal login logic manually
          if ((id === 'skk' && pass === 'skk') || (id === 'hunter' && pass === 'hunter')) {
            setIsLoggedIn(true);
            setError(false);
          } else {
            setError(true);
          }
        }
        clickCount.current = 0;
      }, 300);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setId('');
    setPass('');
    setError(false);
  };

  return (
    <div className={`bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 ${!isLoggedIn ? 'min-h-screen flex items-center justify-center p-4' : 'h-screen overflow-hidden'}`}>
      <ReloadPrompt />
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-sm sm:max-w-md"
          >
            <div className="relative">
              {/* Decorative background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-[2rem] blur opacity-20 sm:opacity-30" />
              
              <div className="relative bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/60 p-6 sm:p-8 rounded-[2rem] shadow-2xl">
                <div className="flex justify-center mb-8">
                  <div className="p-3 bg-zinc-900 rounded-2xl shadow-inner border border-zinc-800/80">
                    <ShieldCheck className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight text-white">System Access</h1>
                <p className="text-zinc-400 text-center mb-8 text-sm">Please authenticate to continue.</p>

                <form onSubmit={handleLogin} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                      Identification
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={id}
                        onChange={(e) => { setId(e.target.value); setError(false); }}
                        className="block w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all sm:text-sm"
                        placeholder="Enter ID"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                      Passcode
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={pass}
                        onChange={(e) => { setPass(e.target.value); setError(false); }}
                        className="block w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all sm:text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-red-400 text-xs sm:text-sm text-center bg-red-500/10 py-2.5 rounded-lg border border-red-500/20">
                          Access Denied. Invalid credentials.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                     <p className="text-amber-400/90 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Guest Access</p>
                     <p className="text-amber-200/70 text-[10px] sm:text-xs leading-relaxed">Available credentials: <br/><strong>hunter/hunter</strong></p>
                  </div>
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSecretClick}
                      className="relative group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-black select-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-colors duration-300" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                      <span className="relative flex items-center gap-2 pointer-events-none">
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
            key="hunter-dead-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-950"
          >
            <div className="p-4 bg-zinc-900 rounded-full mb-6 border border-zinc-800">
              <ShieldCheck className="w-12 h-12 text-zinc-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">App still in progress, leveling up soon</h1>
            <p className="text-zinc-500 max-w-sm mb-10 text-sm">You are currently on a guest path. We are actively building the next generation of features.</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-medium"
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
