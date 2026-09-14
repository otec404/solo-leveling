import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileJson, FileText, Image as ImageIcon, Download, Loader2 } from 'lucide-react';
import { Skill, SkillLog } from '../types';
import { GamifiedReportCard } from './GamifiedReportCard';
import { toPng } from 'html-to-image';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  skills: Skill[];
  logs: SkillLog[];
  categories: string[];
  categoryColors: Record<string, string>;
  onExported?: (size: number) => void;
}

export default function ExportModal({ isOpen, onClose, userId, skills, logs, categories, categoryColors, onExported }: ExportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const getDateRange = () => {
    const allDates = logs.map(l => l.date).sort();
    const today = new Date().toISOString().split('T')[0];
    if (allDates.length === 0) return today;
    if (allDates.length === 1) return allDates[0];
    return `${allDates[0]} - ${allDates[allDates.length - 1]}`;
  };

  const handleExportJSON = () => {
    const exportData = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      userId,
      skills,
      logs,
      categories,
      categoryColors
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onExported) onExported(blob.size);
    onClose();
  };

  const handleExportText = () => {
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
                const value = skill.mode === 'counter' ? `${log.count} ${skill.unit || ''}`.trim() : `[x] Checked`;
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
    onClose();
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      
      // We render using html-to-image
      const url = await toPng(cardRef.current, {
        backgroundColor: '#000000',
        pixelRatio: 2,
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusflow-card-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <>
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
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Download Report</h2>
                <p className="text-sm text-zinc-400">Choose a format to export your operative data.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleExportText}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Text Summary</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Clean, detailed overview of progress</p>
                  </div>
                </button>

                <button
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {isExporting ? <Loader2 className="w-6 h-6 text-rose-400 animate-spin" /> : <ImageIcon className="w-6 h-6 text-rose-400" />}
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Gamified Card (Image)</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Visually stunning PNG poster</p>
                  </div>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileJson className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Raw Data (JSON)</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Best for backing up & restoring</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden container for rendering the image */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        <GamifiedReportCard 
           ref={cardRef} 
           userId={userId} 
           skills={skills} 
           logs={logs} 
           dateRange={getDateRange()} 
        />
      </div>
    </>
  );
}
