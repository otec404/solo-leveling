import { useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { Skill, SkillLog } from '../types';

const THEME_COLORS: Record<string, string> = {
  emerald: '#10b981',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  fuchsia: '#d946ef',
  zinc: '#71717a'
};

const DEFAULT_ACCENT = '#06b6d4'; // cyan

export function useDynamicAccent(logs: SkillLog[], skills: Skill[], categoryColors: Record<string, string>) {
  const currentHex = useRef(DEFAULT_ACCENT);

  useEffect(() => {
    // 1. Calculate 7-day window
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const cutoffStr = sevenDaysAgo.toISOString().split('T')[0];

    // Filter logs in the last 7 days that represent "activity"
    const recentLogs = logs.filter(l => l.date >= cutoffStr && (l.count > 0 || l.checked));

    // 2. Count logs per category
    const categoryCounts: Record<string, number> = {};
    recentLogs.forEach(log => {
      const skill = skills.find(s => s.id === log.skillId);
      if (skill) {
        categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1;
      }
    });

    // 3. Find dominant category
    let maxCount = 0;
    let dominantCategory = '';
    let totalCount = 0;

    for (const [cat, count] of Object.entries(categoryCounts)) {
      totalCount += count;
      if (count > maxCount) {
        maxCount = count;
        dominantCategory = cat;
      }
    }

    let targetHex = DEFAULT_ACCENT;

    if (totalCount > 0) {
      const dominanceRatio = maxCount / totalCount;
      // Dominant if at least 30% of total
      if (dominanceRatio >= 0.3 && dominantCategory) {
        const themeName = categoryColors[dominantCategory] || 'cyan';
        targetHex = THEME_COLORS[themeName] || DEFAULT_ACCENT;
      }
    }

    if (targetHex !== currentHex.current) {
      animate(currentHex.current, targetHex, {
        duration: 2,
        ease: "easeInOut",
        onUpdate: (color) => {
          document.documentElement.style.setProperty('--app-accent', color);
          const match = color.match(/#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
          if (match) {
            const r = parseInt(match[1], 16);
            const g = parseInt(match[2], 16);
            const b = parseInt(match[3], 16);
            document.documentElement.style.setProperty('--app-accent-rgb', `${r} ${g} ${b}`);
          }
        }
      });
      currentHex.current = targetHex;
    }
  }, [logs, skills, categoryColors]);
}
