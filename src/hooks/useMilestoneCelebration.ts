import { useEffect, useState, useRef } from 'react';
import { Skill, SkillLog } from '../types';

export interface MilestoneEvent {
  skillId: string;
  skillName: string;
  category: string;
  milestoneType: 'streak' | 'total';
  milestoneValue: number;
}

const STREAK_MILESTONES = [7, 30, 100, 365];
const TOTAL_MILESTONES = [50, 100, 500, 1000];

export function useMilestoneCelebration(logs: SkillLog[], skills: Skill[]) {
  const [activeCelebration, setActiveCelebration] = useState<MilestoneEvent | null>(null);
  const previousLogsLength = useRef(logs.length);

  useEffect(() => {
    // Only check when logs change (e.g. user just logged something)
    // We do a naive check: if logs length changes, or a log count changes.
    // To keep it performant and simple, we check every time logs update.
    
    // Group logs by skill
    const logsBySkill = new Map<string, SkillLog[]>();
    logs.forEach(log => {
       if (!logsBySkill.has(log.skillId)) logsBySkill.set(log.skillId, []);
       logsBySkill.get(log.skillId)!.push(log);
    });

    for (const skill of skills) {
       const skillLogs = logsBySkill.get(skill.id) || [];
       if (skillLogs.length === 0) continue;

       // Sort logs by date ascending
       skillLogs.sort((a, b) => a.date.localeCompare(b.date));

       // Calculate Total
       let total = 0;
       skillLogs.forEach(l => {
          if (skill.mode === 'counter') total += l.count;
          else if (skill.mode === 'checkbox' && l.checked) total += 1;
       });

       // Calculate Current Streak
       let currentStreak = 0;
       let lastDate: Date | null = null;
       
       for (const l of skillLogs) {
         if ((skill.mode === 'counter' && l.count > 0) || (skill.mode === 'checkbox' && l.checked)) {
            const date = new Date(l.date);
            if (!lastDate) {
              currentStreak = 1;
            } else {
              const diffTime = Math.abs(date.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1; // reset
              }
            }
            lastDate = date;
         }
       }

       // Check Total Milestones
       for (const m of TOTAL_MILESTONES) {
         if (total >= m) {
           const key = `focusflow_milestone_${skill.id}_total_${m}`;
           if (!localStorage.getItem(key)) {
             localStorage.setItem(key, 'true');
             if (!activeCelebration) { // Show one at a time
                setActiveCelebration({
                  skillId: skill.id,
                  skillName: skill.name,
                  category: skill.category,
                  milestoneType: 'total',
                  milestoneValue: m
                });
                return; // Exit early to avoid celebrating multiple at exact same time
             }
           }
         }
       }

       // Check Streak Milestones
       for (const m of STREAK_MILESTONES) {
         if (currentStreak >= m) {
           const key = `focusflow_milestone_${skill.id}_streak_${m}`;
           if (!localStorage.getItem(key)) {
             localStorage.setItem(key, 'true');
             if (!activeCelebration) {
                setActiveCelebration({
                  skillId: skill.id,
                  skillName: skill.name,
                  category: skill.category,
                  milestoneType: 'streak',
                  milestoneValue: m
                });
                return;
             }
           }
         }
       }
    }
  }, [logs, skills, activeCelebration]);

  const clearCelebration = () => setActiveCelebration(null);

  return { activeCelebration, clearCelebration };
}
