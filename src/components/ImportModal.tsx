import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, AlertTriangle, FileJson, CheckCircle2, Layers, Calendar, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any, strategy: 'replace' | 'merge') => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [fileContent, setFileContent] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [strategy, setStrategy] = useState<'replace' | 'merge'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<{ skills: number; logs: number; notes: number } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setError('');
    setSuccess(null);
    setFileContent(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          throw new Error('Selected file is empty.');
        }

        const parsed = JSON.parse(text);
        
        // Flexible validation: support standard backup JSON or legacy arrays
        let skills = Array.isArray(parsed.skills) ? parsed.skills : (Array.isArray(parsed) ? parsed : []);
        let logs = Array.isArray(parsed.logs) ? parsed.logs : [];
        let blankNotes = Array.isArray(parsed.blankNotes) ? parsed.blankNotes : [];
        let categories = Array.isArray(parsed.categories) ? parsed.categories : [];
        let categoryColors = (parsed.categoryColors && typeof parsed.categoryColors === 'object') ? parsed.categoryColors : {};

        if (skills.length === 0 && logs.length === 0) {
          throw new Error('Invalid backup file: No valid skills or logs found.');
        }

        setFileContent({
          skills,
          logs,
          blankNotes,
          categories,
          categoryColors,
          exportedAt: parsed.exportedAt,
          schemaVersion: parsed.schemaVersion
        });
        triggerHaptic('success');
      } catch (err: any) {
        setError(err.message || 'Failed to parse JSON file.');
        triggerHaptic('warning');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file from disk.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirm = () => {
    if (!fileContent) return;
    try {
      setIsProcessing(true);
      triggerHaptic('medium');

      // Schedule asynchronously to allow UI to render smoothly
      setTimeout(() => {
        onImport(fileContent, strategy);
        setSuccess({
          skills: fileContent.skills?.length || 0,
          logs: fileContent.logs?.length || 0,
          notes: fileContent.blankNotes?.length || 0
        });
        setIsProcessing(false);
        triggerHaptic('success');
      }, 50);
    } catch (err: any) {
      setError('Import failed: ' + (err.message || 'Unknown error'));
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setFileContent(null);
    setError('');
    setSuccess(null);
    setIsProcessing(false);
    onClose();
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
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.18 }}
        className="bg-zinc-950 border border-white/20 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative z-10 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top specular glow */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/10 transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-mono font-black text-white mb-1">Restore & Import Data</h2>
          <p className="text-xs sm:text-sm font-mono text-zinc-400">Import backup JSON with instant zero-lag reconciliation.</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
             <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
               <CheckCircle2 size={32} />
             </div>
             <h3 className="text-lg sm:text-xl font-mono font-black text-white mb-1">Import Completed Successfully</h3>
             <p className="text-xs sm:text-sm font-mono text-zinc-400 mb-6 max-w-sm">
               Reconciled <span className="text-cyan-300 font-bold">{success.skills}</span> skills, <span className="text-emerald-300 font-bold">{success.logs}</span> log records, and <span className="text-amber-300 font-bold">{success.notes}</span> notes.
             </p>
             <button 
               type="button"
               onClick={resetAndClose} 
               className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-mono font-black rounded-xl text-sm w-full active:scale-95 transition-all shadow-md"
             >
               Done
             </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {!fileContent && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center ${
                  isDraggingFile 
                    ? 'bg-cyan-500/10 border-cyan-400 scale-[1.01]' 
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-white/15 hover:border-cyan-500/40'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-md">
                  {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <FileJson size={26} />}
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm sm:text-base">
                    {isDraggingFile ? 'Drop Backup File Here' : 'Select or Drop Backup JSON'}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Accepts standard .json backups & historical data</p>
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono">
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {fileContent && !error && (
              <div className="flex flex-col gap-3.5">
                {/* File summary telemetry */}
                <div className="p-3.5 bg-zinc-900/90 border border-white/12 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Backup Validated</span>
                    </span>
                    {fileContent.exportedAt && (
                      <span className="text-[10px] font-mono text-zinc-400">
                        {new Date(fileContent.exportedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Skills</span>
                      <span className="text-sm font-mono font-black text-cyan-300">{fileContent.skills?.length || 0}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Logs</span>
                      <span className="text-sm font-mono font-black text-emerald-300">{fileContent.logs?.length || 0}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Notes</span>
                      <span className="text-sm font-mono font-black text-amber-300">{fileContent.blankNotes?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Conflict Strategy Selector */}
                <div className="flex flex-col gap-2">
                   <p className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">Reconciliation Strategy</p>
                   
                   {/* Option 1: Merge (Recommended) */}
                   <label 
                     onClick={() => setStrategy('merge')}
                     className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                       strategy === 'merge' 
                         ? 'bg-cyan-500/15 border-cyan-400/50 text-white' 
                         : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                     }`}
                   >
                     <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                       strategy === 'merge' ? 'border-cyan-400 bg-cyan-400' : 'border-zinc-600'
                     }`}>
                       {strategy === 'merge' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                     </div>
                     <div>
                       <div className="flex items-center gap-1.5">
                         <span className="font-mono font-bold text-xs">Merge & Sync</span>
                         <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Safe</span>
                       </div>
                       <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Combines imported skills & logs with existing data without deleting anything.</p>
                     </div>
                   </label>

                   {/* Option 2: Full Replace */}
                   <label 
                     onClick={() => setStrategy('replace')}
                     className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                       strategy === 'replace' 
                         ? 'bg-amber-500/15 border-amber-400/50 text-white' 
                         : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                     }`}
                   >
                     <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                       strategy === 'replace' ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'
                     }`}>
                       {strategy === 'replace' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                     </div>
                     <div>
                       <span className="font-mono font-bold text-xs text-amber-300">Clean Replace / Overwrite</span>
                       <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Clears current workspace and restores exact state from the backup file.</p>
                     </div>
                   </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => { setFileContent(null); setError(''); }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-white/10 transition-all active:scale-95"
                  >
                    Change File
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Reconciling...</span>
                      </>
                    ) : (
                      <>
                        <span>Apply & Restore</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
