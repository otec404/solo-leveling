import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileJson, FileText, Image as ImageIcon, Download, Loader2, Table, CheckCircle2 } from 'lucide-react';
import { Skill, SkillLog, BlankNote } from '../types';
import { GamifiedReportCard } from './GamifiedReportCard';
import { toPng } from 'html-to-image';
import { triggerHaptic } from '../lib/haptics';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  skills: Skill[];
  logs: SkillLog[];
  categories: string[];
  categoryColors: Record<string, string>;
  blankNotes?: BlankNote[];
  onExported?: (size: number) => void;
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  userId, 
  skills, 
  logs, 
  categories, 
  categoryColors, 
  blankNotes = [],
  onExported 
}: ExportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const getDateRange = () => {
    const allDates = logs.map(l => l.date).sort();
    const today = new Date().toISOString().split('T')[0];
    if (allDates.length === 0) return today;
    if (allDates.length === 1) return allDates[0];
    return `${allDates[0]} - ${allDates[allDates.length - 1]}`;
  };

  const handleExportJSON = () => {
    try {
      const exportData = {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        userId,
        skills,
        logs,
        categories,
        categoryColors,
        blankNotes
      };
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      triggerHaptic('success');
      if (onExported) onExported(blob.size);
      setExportSuccess(`Exported ${skills.length} skills & ${logs.length} logs as JSON`);
      setTimeout(() => {
        onClose();
        setExportSuccess(null);
      }, 1000);
    } catch (err) {
      console.error('JSON export error:', err);
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Skill Name', 'Short Form', 'Category', 'Mode', 'Count/Value', 'Unit', 'Checked', 'Timer Duration (sec)', 'Notes'];
      const rows = logs.map(l => {
        const s = skills.find(sk => sk.id === l.skillId);
        const skillName = s ? s.name : l.skillId;
        const shortForm = s ? s.shortForm : '';
        const category = s ? s.category : '';
        const mode = s ? s.mode : 'counter';
        const val = l.value !== undefined ? l.value : l.count;
        const unit = s?.unit || '';
        const isChecked = l.checked ? 'TRUE' : 'FALSE';
        const timerSec = l.timerDuration ? (l.timerDuration / 1000).toFixed(1) : '0';
        const safeNotes = (l.notes || '').replace(/"/g, '""');
        return [l.date, `"${skillName}"`, `"${shortForm}"`, `"${category}"`, mode, val, `"${unit}"`, isChecked, timerSec, `"${safeNotes}"`].join(',');
      });
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      triggerHaptic('success');
      if (onExported) onExported(blob.size);
      setExportSuccess(`Exported CSV with ${logs.length} log rows`);
      setTimeout(() => {
        onClose();
        setExportSuccess(null);
      }, 1000);
    } catch (err) {
      console.error('CSV export error:', err);
    }
  };

  const handleExportText = () => {
    try {
      let text = `====================================================\n`;
      text += `               FOCUSFLOW OPERATIVE REPORT\n`;
      text += `====================================================\n\n`;
      text += `Operative ID: ${userId}\n`;
      text += `Report Date: ${new Date().toISOString().split('T')[0]}\n`;
      text += `Date Range: ${getDateRange()}\n\n`;

      const dates = Array.from(new Set(logs.map(l => l.date))).sort();
      
      text += `--- DAILY BREAKDOWN ---\n\n`;
      if (dates.length === 0) {
        text += `No activity logged.\n\n`;
      } else {
        dates.forEach(date => {
          text += `Date: ${date}\n`;
          const logsForDate = logs.filter(l => l.date === date && (l.count > 0 || l.checked));
          if (logsForDate.length === 0) {
            text += `  No progress logged.\n`;
          } else {
            logsForDate.forEach(log => {
               const skill = skills.find(s => s.id === log.skillId);
               if (skill) {
                  const value = skill.mode === 'counter' 
                    ? `${log.count} ${skill.unit || ''}`.trim() 
                    : (skill.mode === 'measurement' ? `${log.value || log.count} ${skill.unit || ''}`.trim() : `[x] Checked`);
                  text += `  - ${skill.name} (${skill.shortForm}): ${value}\n`;
               }
            });
          }
          text += `\n`;
        });
      }

      text += `--- OVERALL TOTALS ---\n\n`;
      if (skills.length === 0) {
        text += `No skills documented.\n`;
      } else {
        skills.forEach((skill, index) => {
          const skillLogs = logs.filter(l => l.skillId === skill.id && (l.count > 0 || l.checked));
          const total = skillLogs.reduce((acc, l) => acc + (skill.mode === 'counter' ? l.count : 1), 0);
          
          text += `${index + 1}. ${skill.name} [${skill.shortForm}]\n`;
          text += `   Category: ${skill.category}\n`;
          text += `   Tracking Mode: ${skill.mode}\n`;
          text += `   Total Progress: ${total} ${skill.mode === 'counter' ? (skill.unit || 'count') : 'checkboxes'}\n\n`;
        });
      }

      text += `====================================================\n`;
      text += `END OF TRANSMISSION\n`;
      text += `====================================================\n`;

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      triggerHaptic('success');
      onClose();
    } catch (err) {
      console.error('Text export error:', err);
    }
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      triggerHaptic('light');
      
      const url = await toPng(cardRef.current, {
        backgroundColor: '#000000',
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-card-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
      triggerHaptic('success');
      onClose();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl"
      >
        <div 
          className="absolute inset-0" 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.18 }}
          className="bg-zinc-950 border border-white/20 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl relative z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top specular glow */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white mb-1">Export Data & Reports</h2>
            <p className="text-xs sm:text-sm font-mono text-zinc-400">Save full JSON backups, Excel CSVs, or visual reports.</p>
          </div>

          {exportSuccess ? (
            <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 font-mono text-sm">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {/* Raw JSON Backup */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-cyan-500/30 hover:border-cyan-400/60 transition-all group active:scale-98 text-left shadow-md"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-cyan-400">
                  <FileJson size={22} />
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm flex items-center gap-2">
                    <span>Full JSON Backup</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Recommended</span>
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">Complete backup of skills, logs, notes & colors</p>
                </div>
              </button>

              {/* CSV Spreadsheet */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/12 hover:border-emerald-500/40 transition-all group active:scale-98 text-left shadow-md"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-emerald-400">
                  <Table size={22} />
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm">Spreadsheet Table (.CSV)</h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">Compatible with Excel, Google Sheets, & Numbers</p>
                </div>
              </button>

              {/* Text Summary */}
              <button
                type="button"
                onClick={handleExportText}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/12 hover:border-purple-500/40 transition-all group active:scale-98 text-left shadow-md"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-purple-400">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm">Plaintext Log Summary (.TXT)</h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">Human-readable chronological logs breakdown</p>
                </div>
              </button>

              {/* Gamified Poster */}
              <button
                type="button"
                onClick={handleExportImage}
                disabled={isExporting}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/12 hover:border-rose-500/40 transition-all group active:scale-98 text-left shadow-md disabled:opacity-50"
              >
                <div className="w-11 h-11 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-rose-400">
                  {isExporting ? <Loader2 size={22} className="animate-spin" /> : <ImageIcon size={22} />}
                </div>
                <div>
                  <h3 className="text-white font-mono font-bold text-sm">Visual Card Poster (.PNG)</h3>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">Gamified milestone card image</p>
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hidden container for rendering the image poster */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <GamifiedReportCard 
           ref={cardRef} 
           userId={userId} 
           skills={skills} 
           logs={logs} 
           dateRange={getDateRange()} 
        />
      </div>
    </>,
    document.body
  );
}
