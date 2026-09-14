import { useState, useEffect } from 'react';
import { set, del, get, entries } from 'idb-keyval';
import { Skill, SkillLog } from '../types';
import { initialSkills, initialLogs } from '../data/historicalData';

export function useDataStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [skills, setSkillsState] = useState<Skill[]>(initialSkills);
  const [logs, setLogsState] = useState<SkillLog[]>(initialLogs);
  const [categories, setCategoriesState] = useState<string[]>(['Diet', 'Fitness', 'Black']);
  const [categoryColors, setCategoryColorsState] = useState<Record<string, string>>({
    'Diet': 'rose',
    'Fitness': 'emerald',
    'Black': 'zinc'
  });

  useEffect(() => {
    async function loadAndMigrate() {
      try {
        const migrated = await get('migrated_to_idb_v1');
        
        if (!migrated) {
          const lsSkills = JSON.parse(localStorage.getItem('focusflow_skills') || 'null');
          const lsLogs = JSON.parse(localStorage.getItem('focusflow_logs') || 'null');
          const lsCategories = JSON.parse(localStorage.getItem('focusflow_categories') || 'null');
          const lsColors = JSON.parse(localStorage.getItem('focusflow_colors') || 'null');

          if (lsSkills) {
            for (const skill of lsSkills) await set(`skill_${skill.id}`, skill);
            await set('skill_order', lsSkills.map(s => s.id));
          }
          if (lsLogs) {
            for (const log of lsLogs) await set(`log_${log.id}`, log);
          }
          if (lsCategories) await set('categories', lsCategories);
          if (lsColors) await set('categoryColors', lsColors);

          await set('migrated_to_idb_v1', true);
        }

        const allEntries = await entries();
        const loadedSkills: Skill[] = [];
        const loadedLogs: SkillLog[] = [];
        let loadedCategories: string[] | null = null;
        let loadedColors: Record<string, string> | null = null;
        let loadedSkillOrder: string[] | null = null;

        let hasAnyData = false;

        for (const [key, value] of allEntries) {
          if (typeof key === 'string') {
            if (key === 'skill_order') {
              loadedSkillOrder = value as string[];
              hasAnyData = true;
            } else if (key.startsWith('skill_')) {
              loadedSkills.push(value as Skill);
              hasAnyData = true;
            } else if (key.startsWith('log_')) {
              loadedLogs.push(value as SkillLog);
              hasAnyData = true;
            } else if (key === 'categories') {
              loadedCategories = value as string[];
              hasAnyData = true;
            } else if (key === 'categoryColors') {
              loadedColors = value as Record<string, string>;
              hasAnyData = true;
            }
          }
        }

        if (hasAnyData) {
           if (loadedSkillOrder) {
             const orderMap = new Map(loadedSkillOrder.map((id, index) => [id, index]));
             loadedSkills.sort((a, b) => {
               const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
               const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
               if (indexA !== indexB) return indexA - indexB;
               return a.createdAt - b.createdAt;
             });
           } else {
             loadedSkills.sort((a, b) => a.createdAt - b.createdAt);
           }
           setSkillsState(loadedSkills);
           setLogsState(loadedLogs);
           if (loadedCategories) setCategoriesState(loadedCategories);
           if (loadedColors) setCategoryColorsState(loadedColors);
        } else {
           for (const skill of initialSkills) await set(`skill_${skill.id}`, skill);
           await set('skill_order', initialSkills.map(s => s.id));
           for (const log of initialLogs) await set(`log_${log.id}`, log);
           await set('categories', ['Diet', 'Fitness', 'Black']);
           await set('categoryColors', {
             'Diet': 'rose',
             'Fitness': 'emerald',
             'Black': 'zinc'
           });
           await set('migrated_to_idb_v1', true);
        }
      } catch (err) {
        console.error("Migration/Loading error:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadAndMigrate();
  }, []);

  const setSkills = (newValAction: React.SetStateAction<Skill[]>) => {
    setSkillsState(prev => {
      const newVal = typeof newValAction === 'function' ? newValAction(prev) : newValAction;
      const prevMap = new Map(prev.map(s => [s.id, s]));
      const newMap = new Map(newVal.map(s => [s.id, s]));

      let orderChanged = false;
      if (newVal.length !== prev.length) orderChanged = true;
      else {
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].id !== prev[i].id) {
            orderChanged = true;
            break;
          }
        }
      }

      if (orderChanged) {
        set('skill_order', newVal.map(s => s.id)).catch(console.error);
      }

      newVal.forEach(item => {
        if (prevMap.get(item.id) !== item) set(`skill_${item.id}`, item).catch(console.error);
      });
      prev.forEach(item => {
        if (!newMap.has(item.id)) del(`skill_${item.id}`).catch(console.error);
      });
      return newVal;
    });
  };

  const setLogs = (newValAction: React.SetStateAction<SkillLog[]>) => {
    setLogsState(prev => {
      const newVal = typeof newValAction === 'function' ? newValAction(prev) : newValAction;
      const prevMap = new Map(prev.map(s => [s.id, s]));
      const newMap = new Map(newVal.map(s => [s.id, s]));

      newVal.forEach(item => {
        if (prevMap.get(item.id) !== item) set(`log_${item.id}`, item).catch(console.error);
      });
      prev.forEach(item => {
        if (!newMap.has(item.id)) del(`log_${item.id}`).catch(console.error);
      });
      return newVal;
    });
  };

  const setCategories = (newValAction: React.SetStateAction<string[]>) => {
    setCategoriesState(prev => {
      const newVal = typeof newValAction === 'function' ? newValAction(prev) : newValAction;
      set('categories', newVal).catch(console.error);
      return newVal;
    });
  };

  const setCategoryColors = (newValAction: React.SetStateAction<Record<string, string>>) => {
    setCategoryColorsState(prev => {
      const newVal = typeof newValAction === 'function' ? newValAction(prev) : newValAction;
      set('categoryColors', newVal).catch(console.error);
      return newVal;
    });
  };

  return {
    isLoaded,
    skills, setSkills,
    logs, setLogs,
    categories, setCategories,
    categoryColors, setCategoryColors
  };
}
