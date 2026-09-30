import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Type, 
  Moon, 
  Sun, 
  Check, 
  Star, 
  Sparkles, 
  Eye, 
  CheckCircle2,
  Layers,
  Flame,
  Clock
} from 'lucide-react';
import { 
  DARK_THEMES, 
  LIGHT_THEMES, 
  APP_FONTS, 
  ThemeBackground, 
  AppFont 
} from '../lib/themeManager';
import { triggerHaptic } from '../lib/haptics';

interface ThemeAndFontCustomizerProps {
  currentThemeId: string;
  currentFontId: string;
  onSelectTheme: (themeId: string) => void;
  onSelectFont: (fontId: string) => void;
}

export default function ThemeAndFontCustomizer({
  currentThemeId,
  currentFontId,
  onSelectTheme,
  onSelectFont
}: ThemeAndFontCustomizerProps) {
  const [themeModeTab, setThemeModeTab] = useState<'DARK' | 'LIGHT'>('DARK');
  const [sectionTab, setSectionTab] = useState<'background' | 'font'>('background');

  const activeThemes = themeModeTab === 'DARK' ? DARK_THEMES : LIGHT_THEMES;
  const currentTheme = [...DARK_THEMES, ...LIGHT_THEMES].find(t => t.id === currentThemeId) || DARK_THEMES[0];
  const currentFont = APP_FONTS.find(f => f.id === currentFontId) || APP_FONTS[0];

  return (
    <div className="space-y-6">
      {/* Navigation Pod: Backgrounds vs Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-zinc-900/70 border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSectionTab('background');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              sectionTab === 'background'
                ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme Backgrounds</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 ml-1">16</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSectionTab('font');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              sectionTab === 'font'
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>App Typography</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 ml-1">8</span>
          </button>
        </div>

        {/* Dark / Light Filter when on Backgrounds */}
        {sectionTab === 'background' && (
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setThemeModeTab('DARK');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                themeModeTab === 'DARK'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/15'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>DARK (8)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setThemeModeTab('LIGHT');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                themeModeTab === 'LIGHT'
                  ? 'bg-zinc-200 text-zinc-900 shadow-sm border border-black/10'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>LIGHT (8)</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: THEME BACKGROUNDS */}
      {/* ========================================================= */}
      {sectionTab === 'background' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{themeModeTab === 'DARK' ? '🌙 Dark Background Palettes' : '☀️ Light Background Palettes'}</span>
                <span className="text-xs text-zinc-400 font-normal">({activeThemes.length} Curated Themes)</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Applies instant backdrop tint, high-contrast surfaces, and status bar coloring.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {activeThemes.map((th) => {
              const isSelected = currentThemeId === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onSelectTheme(th.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between h-28 select-none ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : 'border-white/10 hover:border-white/25 bg-zinc-950/60'
                  }`}
                  style={{
                    backgroundColor: th.hex,
                  }}
                >
                  {/* Internal preview card mockup */}
                  <div 
                    className="w-full h-9 rounded-xl p-2 flex items-center justify-between border mb-2 shadow-inner"
                    style={{
                      backgroundColor: th.surfaceHex,
                      borderColor: th.borderRgba,
                      color: th.isDark ? '#F4F4F5' : '#18181B'
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: th.accentHint }}
                      />
                      <span className="text-[10px] font-mono font-bold truncate max-w-[90px]">
                        {th.name}
                      </span>
                    </div>
                    <span 
                      className="text-[9px] font-mono px-1 py-0.2 rounded"
                      style={{
                        backgroundColor: th.cardHex,
                        color: th.isDark ? '#94A3B8' : '#475569'
                      }}
                    >
                      {th.hex}
                    </span>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${th.isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {th.name}
                      </span>
                      {th.starred && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center">⭐</span>
                      )}
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-black shadow-sm font-mono">
                        <Check className="w-3 h-3 stroke-[3]" /> ACTIVE
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity ${th.isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Select
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: APP TYPOGRAPHY */}
      {/* ========================================================= */}
      {sectionTab === 'font' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <span>System & Display Typography (8 Options)</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select your preferred typeface for headings, habit cards, readouts, and navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {APP_FONTS.map((font) => {
              const isSelected = currentFontId === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onSelectFont(font.id)}
                  style={{ fontFamily: font.family }}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 select-none group ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-950/60 to-zinc-950 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                      : 'bg-zinc-900/50 hover:bg-zinc-900 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {font.name}
                        </span>
                        {font.starred && (
                          <span className="text-[11px] text-amber-400">⭐</span>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      )}
                    </div>

                    {/* Feel & Best For Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                        {font.feel}
                      </span>
                    </div>

                    {/* Typography Sample Preview */}
                    <div className="text-base text-zinc-200 tracking-tight leading-none font-semibold">
                      {font.sampleText}
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                    <span>Best for: <strong className="text-zinc-200">{font.bestFor}</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LIVE INTERACTIVE THEME & FONT PREVIEW BAR */}
      {/* ========================================================= */}
      <div 
        className="p-4 sm:p-5 rounded-3xl border shadow-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: currentTheme.surfaceHex,
          borderColor: currentTheme.borderRgba,
          fontFamily: currentFont.family,
          color: currentTheme.isDark ? '#F4F4F5' : '#18181B'
        }}
      >
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md flex-shrink-0"
            style={{
              backgroundColor: currentTheme.cardHex,
              borderColor: currentTheme.borderRgba,
              color: currentTheme.accentHint
            }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold tracking-tight">
                Live Preview: {currentTheme.name} + {currentFont.name}
              </h5>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                style={{
                  backgroundColor: currentTheme.cardHex,
                  color: currentTheme.accentHint,
                  border: `1px solid ${currentTheme.borderRgba}`
                }}
              >
                {currentTheme.category} • {currentTheme.hex}
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5">
              "{currentFont.feel}" typography active across tactical dashboard, charts, and counters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <div 
            className="px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: currentTheme.cardHex,
              borderColor: currentTheme.borderRgba
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: currentTheme.accentHint }} />
            <span>00:45:12</span>
          </div>

          <div 
            className="px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: currentTheme.cardHex,
              borderColor: currentTheme.borderRgba
            }}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>14 Day Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
