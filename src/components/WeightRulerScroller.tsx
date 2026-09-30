import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Minus, Plus, Check, Scale, X } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface WeightRulerScrollerProps {
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  onClose?: () => void;
  theme?: any;
  title?: string;
}

export default function WeightRulerScroller({
  value,
  unit = 'kg',
  min = 0,
  max = 500,
  step = 0.5,
  onChange,
  onClose,
  title = 'Adjust Weight'
}: WeightRulerScrollerProps) {
  const [currentVal, setCurrentVal] = useState<number>(value || 0);
  const [isEditingDirect, setIsEditingDirect] = useState(false);
  const [directInput, setDirectInput] = useState(String(value || '0'));
  const [halfWidth, setHalfWidth] = useState<number>(180);

  const rulerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const lastHapticValRef = useRef(value || 0);
  const isProgrammaticScrollRef = useRef(false);

  // Sync internal state when external value changes
  useEffect(() => {
    setCurrentVal(value || 0);
    setDirectInput(String(value || '0'));
  }, [value]);

  const tickWidth = 14; // pixels per step unit (e.g. 0.5kg)

  // Measure half-width of container for exact needle centering
  useEffect(() => {
    if (rulerRef.current) {
      const w = rulerRef.current.clientWidth;
      if (w > 0) setHalfWidth(w / 2);
    }
  }, []);

  // Center ruler on current value
  const centerRulerOnValue = useCallback((val: number, smooth = false) => {
    if (!rulerRef.current) return;
    const stepsCount = (val - min) / step;
    const targetScroll = stepsCount * tickWidth;
    isProgrammaticScrollRef.current = true;
    if (smooth) {
      rulerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    } else {
      rulerRef.current.scrollLeft = targetScroll;
    }
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 100);
  }, [min, step, tickWidth]);

  useEffect(() => {
    // Initial centering once mounted
    const timer = setTimeout(() => {
      centerRulerOnValue(currentVal, false);
    }, 50);
    return () => clearTimeout(timer);
  }, [halfWidth]);

  const handleRulerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isEditingDirect) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const calculatedSteps = Math.round(scrollLeft / tickWidth);
    const rawVal = min + calculatedSteps * step;
    const clamped = Math.max(min, Math.min(max, parseFloat(rawVal.toFixed(1))));

    if (clamped !== currentVal) {
      setCurrentVal(clamped);
      setDirectInput(String(clamped));
      onChange(clamped);

      // Trigger subtle haptic on whole number crossing
      if (Math.abs(clamped - lastHapticValRef.current) >= 1) {
        triggerHaptic('light');
        lastHapticValRef.current = clamped;
      }
    }
  };

  // --- MOUSE & TOUCH DIRECT DRAG PANNING ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!rulerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = rulerRef.current.scrollLeft;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDraggingRef.current || !rulerRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    rulerRef.current.scrollLeft = startScrollRef.current - deltaX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!rulerRef.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    rulerRef.current.scrollLeft += delta;
  };

  const handleStepDelta = (delta: number) => {
    const nextVal = Math.max(min, Math.min(max, parseFloat((currentVal + delta).toFixed(1))));
    setCurrentVal(nextVal);
    setDirectInput(String(nextVal));
    onChange(nextVal);
    centerRulerOnValue(nextVal, true);
    triggerHaptic('medium');
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(directInput);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setCurrentVal(clamped);
      onChange(clamped);
      centerRulerOnValue(clamped, true);
    }
    setIsEditingDirect(false);
    triggerHaptic('success');
  };

  // Generate tick markers
  const totalTicks = Math.floor((max - min) / step) + 1;
  const quickDeltas = [-10, -5, -2.5, -1, +1, +2.5, +5, +10];

  const cardContent = (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="w-full flex flex-col gap-3.5 bg-zinc-950/95 border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-3xl select-none relative overflow-hidden"
    >
      {/* Top Specular Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

      {/* Header with Title and Close Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-sm">
            <Scale size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">{title}</h4>
            <span className="text-[10px] font-mono text-zinc-400">Drag or scroll ruler below</span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-all active:scale-95"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Big Digital Readout */}
      <div className="flex items-center justify-center gap-3 py-1">
        <button
          type="button"
          onClick={() => handleStepDelta(-step)}
          className="w-10 h-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/12 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-md shrink-0"
        >
          <Minus size={18} strokeWidth={2.8} />
        </button>

        {isEditingDirect ? (
          <form onSubmit={handleDirectSubmit} className="flex items-center gap-2">
            <input
              type="number"
              step={step}
              value={directInput}
              onChange={e => setDirectInput(e.target.value)}
              autoFocus
              onBlur={handleDirectSubmit}
              className="w-28 text-center bg-zinc-900 border-2 border-cyan-400 rounded-2xl py-1 text-3xl sm:text-4xl font-mono font-black text-white focus:outline-none shadow-lg"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-bold shadow-md"
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </form>
        ) : (
          <div 
            onClick={() => setIsEditingDirect(true)}
            className="flex items-baseline gap-1.5 px-4 py-1.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-all shadow-inner group"
            title="Click to type exact weight"
          >
            <span className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-white tabular-nums drop-shadow-[0_2px_12px_rgba(6,182,212,0.4)] group-hover:text-cyan-300 transition-colors">
              {currentVal.toFixed(1)}
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-cyan-400 uppercase">
              {unit}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => handleStepDelta(step)}
          className="w-10 h-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/12 text-zinc-300 hover:text-white flex items-center justify-center active:scale-90 transition-all shadow-md shrink-0"
        >
          <Plus size={18} strokeWidth={2.8} />
        </button>
      </div>

      {/* Tactical Horizontal Ruler Scroller */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative h-20 w-full bg-zinc-900/90 rounded-2xl border border-white/15 overflow-hidden shadow-inner flex flex-col justify-end touch-none cursor-grab active:cursor-grabbing select-none"
      >
        {/* Left & Right Edge Fades */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-20" />

        {/* Center Target Indicator Needle (Cyan Glowing Needle) */}
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-1 z-30 flex flex-col items-center justify-between pointer-events-none">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
          <div className="w-[2px] h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
        </div>

        {/* Scrollable Ruler Track */}
        <div
          ref={rulerRef}
          onScroll={handleRulerScroll}
          className="w-full h-full overflow-x-scroll flex items-end hide-scrollbar relative z-10 select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Half-width spacer to center the 0th tick under the needle */}
          <div style={{ width: halfWidth, flexShrink: 0, pointerEvents: 'none' }} />

          {Array.from({ length: totalTicks }).map((_, i) => {
            const tickVal = min + i * step;
            const isMajor = tickVal % 5 === 0;
            const isMedium = tickVal % 1 === 0 && !isMajor;

            return (
              <div
                key={i}
                className="flex flex-col items-center justify-end shrink-0 select-none pointer-events-none"
                style={{ width: tickWidth }}
              >
                {/* Number Label for Major Ticks */}
                {isMajor && (
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-1 leading-none select-none">
                    {tickVal}
                  </span>
                )}

                {/* Tick Bar */}
                <div
                  className={`rounded-full transition-colors ${
                    isMajor
                      ? 'w-[2px] h-7 bg-zinc-300'
                      : isMedium
                      ? 'w-[1.5px] h-4 bg-zinc-500'
                      : 'w-[1px] h-2.5 bg-zinc-700'
                  }`}
                />
              </div>
            );
          })}

          {/* Half-width spacer to center the max tick under the needle */}
          <div style={{ width: halfWidth, flexShrink: 0, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Quick Delta Preset Buttons */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
        {quickDeltas.map(d => (
          <button
            key={d}
            type="button"
            onClick={() => handleStepDelta(d)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all active:scale-90 shrink-0 ${
              d > 0
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>
    </div>
  );

  if (onClose) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center p-3 sm:p-4"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="absolute inset-0 bg-black/85 backdrop-blur-2xl" 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          onPointerDown={(e) => { e.stopPropagation(); onClose(); }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18 }}
          className="relative z-10 w-full max-w-md"
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {cardContent}
        </motion.div>
      </div>,
      document.body
    );
  }

  return cardContent;
}
