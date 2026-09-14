import React, { useState } from 'react';
import { X, Upload, AlertTriangle, FileJson, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill, SkillLog } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any, strategy: 'replace' | 'merge') => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [fileContent, setFileContent] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [strategy, setStrategy] = useState<'replace' | 'merge'>('replace');
  const [success, setSuccess] = useState<{ skills: number, logs: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess(null);
    setFileContent(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Validation
        if (!parsed.skills || !Array.isArray(parsed.skills)) {
          throw new Error('Invalid file format: Missing or invalid "skills" array.');
        }
        if (!parsed.logs || !Array.isArray(parsed.logs)) {
          throw new Error('Invalid file format: Missing or invalid "logs" array.');
        }
        
        // Optional schema check
        if (parsed.schemaVersion && parsed.schemaVersion > 1) {
           throw new Error(`Incompatible schema version: ${parsed.schemaVersion}. Please update the app.`);
        }

        setFileContent(parsed);
      } catch (err: any) {
        setError(err.message || "Failed to parse import data.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (!fileContent) return;
    try {
      onImport(fileContent, strategy);
      setSuccess({
        skills: fileContent.skills?.length || 0,
        logs: fileContent.logs?.length || 0
      });
      // We do not auto-close here so the user can read the success message.
    } catch(err: any) {
       setError("Import failed: " + err.message);
    }
  };

  const resetAndClose = () => {
    setFileContent(null);
    setError('');
    setSuccess(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Restore Backup</h2>
              <p className="text-sm text-zinc-400">Import your previously exported JSON backup file.</p>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                   <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Import Successful</h3>
                 <p className="text-zinc-400 mb-6">Imported {success.skills} skills and {success.logs} log entries.</p>
                 <button onClick={resetAndClose} className="px-6 py-3 bg-white text-black font-semibold rounded-xl w-full">Done</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {!fileContent && (
                  <div>
                    <label className="w-full flex flex-col items-center gap-3 p-8 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-dashed border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileJson className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-white font-semibold">Select Backup File</h3>
                        <p className="text-xs text-zinc-500 mt-1">.json format</p>
                      </div>
                      <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {fileContent && !error && (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <p className="text-sm text-zinc-300 font-medium mb-1">File Validated</p>
                      <p className="text-xs text-zinc-500">
                        Found {fileContent.skills?.length || 0} skills and {fileContent.logs?.length || 0} logs.
                        {fileContent.exportedAt && ` (Exported: ${new Date(fileContent.exportedAt).toLocaleDateString()})`}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                       <p className="text-sm font-semibold text-zinc-300 mb-1">Conflict Strategy</p>
                       <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${strategy === 'replace' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                         <input type="radio" checked={strategy === 'replace'} onChange={() => setStrategy('replace')} className="hidden" />
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${strategy === 'replace' ? 'border-amber-400' : 'border-zinc-600'}`}>
                            {strategy === 'replace' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                         </div>
                         <div>
                           <p className={`text-sm font-medium ${strategy === 'replace' ? 'text-amber-400' : 'text-zinc-300'}`}>Replace All Data</p>
                           <p className="text-xs text-zinc-500 mt-0.5">Destructive. Erases current data and restores from backup.</p>
                         </div>
                       </label>
                       
                       <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${strategy === 'merge' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                         <input type="radio" checked={strategy === 'merge'} onChange={() => setStrategy('merge')} className="hidden" />
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${strategy === 'merge' ? 'border-cyan-400' : 'border-zinc-600'}`}>
                            {strategy === 'merge' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                         </div>
                         <div>
                           <p className={`text-sm font-medium ${strategy === 'merge' ? 'text-cyan-400' : 'text-zinc-300'}`}>Merge Safely</p>
                           <p className="text-xs text-zinc-500 mt-0.5">Appends new skills. Overwrites overlapping logs. Keeps existing un-overlapping data.</p>
                         </div>
                       </label>
                    </div>

                    <button
                      onClick={handleConfirm}
                      className={`w-full py-3 rounded-xl font-semibold transition-colors mt-2 ${
                         strategy === 'replace' 
                           ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                           : 'bg-white hover:bg-zinc-200 text-black'
                      }`}
                    >
                      {strategy === 'replace' ? 'Confirm Replace' : 'Confirm Merge'}
                    </button>
                    
                    <button onClick={() => setFileContent(null)} className="text-xs text-zinc-500 hover:text-white py-2">
                       Select different file
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
