import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, FileJson, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill, SkillLog } from '../types';
import { parseLegacyData, ParsedLegacyData } from '../utils/legacyParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (parsedData: { skills: Skill[], logs: SkillLog[] }, strategy: 'merge' | 'replace') => void;
  existingSkills: Skill[];
}

export default function LegacyImportWizard({ isOpen, onClose, onImport, existingSkills }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dietText, setDietText] = useState('');
  const [blackText, setBlackText] = useState('');
  const [fitnessText, setFitnessText] = useState('');
  const [reviewNotesText, setReviewNotesText] = useState('');
  
  const [parsedData, setParsedData] = useState<ParsedLegacyData | null>(null);

  const resetAndClose = () => {
    setStep(1);
    setDietText('');
    setBlackText('');
    setFitnessText('');
    setReviewNotesText('');
    setParsedData(null);
    onClose();
  };

  const handleParse = () => {
    const parsed = parseLegacyData(dietText, blackText, fitnessText, reviewNotesText);
    setParsedData(parsed);
    setStep(2);
  };

  const handleCommit = () => {
    if (!parsedData) return;
    // For legacy import, we almost always want 'merge'
    onImport({ skills: parsedData.skills, logs: parsedData.logs }, 'merge');
    setStep(3);
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto"
    >
      <div 
        className="absolute inset-0" 
        onClick={(e) => { e.stopPropagation(); resetAndClose(); }} 
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.18 }}
        className="bg-zinc-950 border border-white/20 rounded-3xl p-5 sm:p-8 max-w-4xl w-full shadow-2xl relative my-8 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Legacy Data Import</h2>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className={step >= 1 ? 'text-white' : 'text-zinc-600'}>1. Input</span>
                <ChevronRight size={16} className="text-zinc-700" />
                <span className={step >= 2 ? 'text-white' : 'text-zinc-600'}>2. Preview & Verify</span>
                <ChevronRight size={16} className="text-zinc-700" />
                <span className={step >= 3 ? 'text-emerald-400' : 'text-zinc-600'}>3. Done</span>
              </div>
            </div>

            {step === 1 && (
              <div className="flex flex-col gap-6">
                <p className="text-zinc-400 text-sm">Paste the contents of your organized markdown files below.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-300">Review Notes (review_notes.md)</label>
                    <textarea 
                      value={reviewNotesText} onChange={e => setReviewNotesText(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 min-h-[120px] focus:outline-none focus:border-purple-500 custom-scrollbar"
                      placeholder="Paste review_notes.md here (contains legends & weight table)..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-300">Fitness Log (fitness_organized.md)</label>
                    <textarea 
                      value={fitnessText} onChange={e => setFitnessText(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 min-h-[120px] focus:outline-none focus:border-cyan-500 custom-scrollbar"
                      placeholder="- **DD/MM/YYYY** — b3, c10km, E1hr..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-300">Black Log (black_organized.md)</label>
                    <textarea 
                      value={blackText} onChange={e => setBlackText(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 min-h-[120px] focus:outline-none focus:border-zinc-500 custom-scrollbar"
                      placeholder="- **DD/MM/YYYY** — NSR, NPR..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-300">Diet Log (diet_organized.md)</label>
                    <textarea 
                      value={dietText} onChange={e => setDietText(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 min-h-[120px] focus:outline-none focus:border-emerald-500 custom-scrollbar"
                      placeholder="- **DD/MM/YYYY** — Ph, 4am, 1ca..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleParse}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    Parse Data <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && parsedData && (
              <div className="flex flex-col gap-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{parsedData.skills.length}</span>
                    <span className="text-sm text-zinc-400">Skills/Metrics to Create</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{parsedData.logs.length}</span>
                    <span className="text-sm text-zinc-400">Total Log Entries</span>
                  </div>
                </div>

                {parsedData.warnings.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                      <AlertTriangle size={16} /> Attention Required ({parsedData.warnings.length})
                    </h3>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                      {parsedData.warnings.map((w, i) => (
                        <div key={i} className="px-3 py-2 border-b border-amber-500/10 last:border-0 flex items-start gap-2">
                          {w.type === 'date' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase mt-0.5 shrink-0">Provisional Date</span>}
                          {w.type === 'assumed_mapping' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 uppercase mt-0.5 shrink-0">Assumed Mapping</span>}
                          {w.type === 'unmapped_token' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 uppercase mt-0.5 shrink-0">Unmapped</span>}
                          <p className="text-sm text-amber-200/80 leading-snug">{w.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                   <h3 className="text-sm font-semibold text-zinc-300">Skills & Metrics Preview</h3>
                   <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                     {parsedData.skills.map(s => (
                       <div key={s.id} className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm flex items-center gap-2">
                          <span className="text-white font-medium">{s.name}</span>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase px-1.5 bg-zinc-800 rounded">{s.mode}</span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCommit}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    Commit Import <Check size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                 <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                   <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Legacy Data Imported</h3>
                 <p className="text-zinc-400 mb-8 max-w-sm">Successfully merged {parsedData?.skills.length} skills and {parsedData?.logs.length} logs into your database.</p>
                 <button onClick={resetAndClose} className="px-8 py-3 bg-white text-black font-semibold rounded-xl w-full max-w-xs">Return to Dashboard</button>
              </div>
            )}
          </motion.div>
        </div>,
        document.body
      );
}
