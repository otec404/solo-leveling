import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, BookOpen, Database, Search, Check, Copy, ArrowDownToLine, 
  Sparkles, Layers, Dumbbell, Apple, Shield, Calendar, Flame, ChevronRight
} from 'lucide-react';
import { APPENDIX_B_SHORT_FORMS, RAW_APPENDIX_C_TEXT, ShortFormItem } from '../data/appendixReference';
import { parseRawAppendixC, ParsedLegacyData } from '../utils/legacyParser';
import { triggerHaptic } from '../lib/haptics';
import { AVAILABLE_ICONS } from './icons';

interface AppendixReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportHistoricalData?: (data: ParsedLegacyData) => void;
}

export default function AppendixReferenceModal({
  isOpen,
  onClose,
  onImportHistoricalData
}: AppendixReferenceModalProps) {
  const [activeTab, setActiveTab] = useState<'appendix_b' | 'appendix_c'>('appendix_b');
  const [bCategory, setBCategory] = useState<string>('All');
  const [bSearch, setBSearch] = useState<string>('');
  
  const [cSection, setCSection] = useState<'fitness' | 'diet' | 'black'>('fitness');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Filter Appendix B items
  const filteredShortForms = useMemo(() => {
    let list = APPENDIX_B_SHORT_FORMS;
    if (bCategory !== 'All') {
      list = list.filter(item => item.category === bCategory);
    }
    if (bSearch.trim()) {
      const q = bSearch.toLowerCase().trim();
      list = list.filter(item => 
        item.shortForm.toLowerCase().includes(q) || 
        item.name.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
    return list;
  }, [bCategory, bSearch]);

  const handleCopyRaw = (sectionKey: 'fitness' | 'diet' | 'black') => {
    triggerHaptic('light');
    const text = RAW_APPENDIX_C_TEXT[sectionKey];
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSeedAllData = () => {
    if (!onImportHistoricalData) return;
    triggerHaptic('success');
    const parsed = parseRawAppendixC(
      RAW_APPENDIX_C_TEXT.fitness,
      RAW_APPENDIX_C_TEXT.diet,
      RAW_APPENDIX_C_TEXT.black
    );
    onImportHistoricalData(parsed);
    setImportNotice(`Successfully imported ${parsed.logs.length} historical logs & ${parsed.skills.length} skills!`);
    setTimeout(() => setImportNotice(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        exit={{ opacity: 0, y: 30, scale: 0.98 }} 
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-5xl h-[94vh] sm:h-[88vh] bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mt-2 sm:hidden shrink-0" />

        {/* 1. Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 bg-zinc-950">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">Reference & Historical Archive</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold whitespace-nowrap">
                  Appendices B & C
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Skill short forms dictionary & complete pre-app raw logs archive
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-800 active:scale-95 shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Top View Mode Tabs */}
        <div className="px-4 py-2 sm:px-6 sm:py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('appendix_b'); triggerHaptic('light'); }}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border active:scale-95 ${
                activeTab === 'appendix_b'
                  ? 'bg-purple-500 text-black border-purple-400 shadow-md font-extrabold shadow-purple-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <Layers size={14} />
              <span>Appendix B: Short Forms</span>
            </button>

            <button
              onClick={() => { setActiveTab('appendix_c'); triggerHaptic('light'); }}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border active:scale-95 ${
                activeTab === 'appendix_c'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md font-extrabold shadow-cyan-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <Database size={14} />
              <span>Appendix C: Complete Logs</span>
            </button>
          </div>

          {onImportHistoricalData && (
            <button
              onClick={handleSeedAllData}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
              title="Parse and import all historical entries into your live dashboard"
            >
              <ArrowDownToLine size={14} strokeWidth={2.5} />
              <span className="hidden sm:inline">Import All Historical Data</span>
              <span className="sm:hidden">Import All</span>
            </button>
          )}
        </div>

        {/* Notice Toast */}
        <AnimatePresence>
          {importNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 py-2.5 text-emerald-300 text-xs font-bold flex items-center justify-between gap-2 shrink-0"
            >
              <span className="flex items-center gap-2 truncate">
                <Check size={15} className="text-emerald-400 shrink-0" />
                <span className="truncate">{importNotice}</span>
              </span>
              <button onClick={() => setImportNotice(null)} className="hover:text-white p-1">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: APPENDIX B (Short Forms Reference) */}
        {activeTab === 'appendix_b' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
            {/* Search & Category Filter */}
            <div className="p-3 sm:p-4 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                <input
                  type="text"
                  value={bSearch}
                  onChange={e => setBSearch(e.target.value)}
                  placeholder="Search shortform or skill..."
                  className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                {bSearch && (
                  <button onClick={() => setBSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                {['All', 'Diet', 'Fitness', 'Black'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setBCategory(cat); triggerHaptic('light'); }}
                    className={`h-8 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                      bCategory === cat 
                        ? 'bg-purple-500 text-black border-purple-400 font-extrabold shadow-sm' 
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Appendix B Tables */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar">
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {['Diet', 'Fitness', 'Black'].map(cat => {
                  if (bCategory !== 'All' && bCategory !== cat) return null;
                  const catItems = filteredShortForms.filter(item => item.category === cat);
                  if (catItems.length === 0) return null;

                  const catColor = cat === 'Diet' ? 'text-emerald-400' : cat === 'Fitness' ? 'text-cyan-400' : 'text-zinc-200';
                  const catBadgeBg = cat === 'Diet' ? 'bg-emerald-500/10 border-emerald-500/30' : cat === 'Fitness' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-zinc-800 border-zinc-700';

                  return (
                    <div key={cat} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                      <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black uppercase tracking-wider ${catColor}`}>{cat}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${catBadgeBg} ${catColor}`}>
                            {catItems.length} skills
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-zinc-400 uppercase tracking-widest text-[10px]">
                              <th className="py-2.5 px-4 font-bold">Short Form</th>
                              <th className="py-2.5 px-4 font-bold">Meaning</th>
                              <th className="py-2.5 px-4 font-bold">Mode</th>
                              <th className="py-2.5 px-4 font-bold">Unit / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50 font-medium">
                            {catItems.map(item => {
                              const IconComp = item.icon && AVAILABLE_ICONS[item.icon] ? AVAILABLE_ICONS[item.icon] : Sparkles;
                              return (
                                <tr key={item.shortForm} className="hover:bg-zinc-900/50 transition-colors">
                                  <td className="py-2.5 px-4 font-mono font-black text-purple-300">
                                    <span className="bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                                      {item.shortForm}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                      <IconComp size={13} className={catColor} />
                                    </div>
                                    <span>{item.name}</span>
                                  </td>
                                  <td className="py-2.5 px-4 text-zinc-400 capitalize">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      item.mode === 'counter' 
                                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                    }`}>
                                      {item.mode}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-zinc-400">
                                    {item.unit && <span className="font-mono text-zinc-300 font-semibold mr-1.5">[{item.unit}]</span>}
                                    {item.notes || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPENDIX C (Complete Historical Data) */}
        {activeTab === 'appendix_c' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-black/40">
            {/* Sub Tabs for Sections */}
            <div className="p-3 sm:p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-2.5 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => { setCSection('fitness'); triggerHaptic('light'); }}
                  className={`h-8 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    cSection === 'fitness'
                      ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
                  }`}
                >
                  <Dumbbell size={13} />
                  <span>9.1 Fitness (Phase 1 & 2)</span>
                </button>

                <button
                  onClick={() => { setCSection('diet'); triggerHaptic('light'); }}
                  className={`h-8 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    cSection === 'diet'
                      ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
                  }`}
                >
                  <Apple size={13} />
                  <span>9.2 Diet (Project K)</span>
                </button>

                <button
                  onClick={() => { setCSection('black'); triggerHaptic('light'); }}
                  className={`h-8 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    cSection === 'black'
                      ? 'bg-zinc-200 text-black border-white font-black shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-850'
                  }`}
                >
                  <Shield size={13} />
                  <span>9.3 Black (Solo Levelling)</span>
                </button>
              </div>

              {/* Copy Section Button */}
              <button
                onClick={() => handleCopyRaw(cSection)}
                className="h-8 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95 shrink-0"
              >
                {copiedSection === cSection ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Raw Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block / Raw Log Content Viewer */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar font-mono text-xs text-zinc-300 bg-zinc-950/70">
              <div className="max-w-4xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-inner whitespace-pre-wrap leading-relaxed select-text">
                {RAW_APPENDIX_C_TEXT[cSection]}
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0 text-xs text-zinc-500">
          <span>FocusFlow Historical Archive (2025 – 2026)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
