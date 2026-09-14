import { Skill, SkillLog } from '../types';

export interface ParseWarning {
  type: 'date' | 'assumed_mapping' | 'unmapped_token';
  message: string;
  date?: string;
  token?: string;
}

export interface ParsedLegacyData {
  skills: Skill[];
  logs: SkillLog[];
  metrics?: any[];
  metricLogs?: any[];
  warnings: Array<{ type: string; message: string; token?: string }>;
}

export function parseLegacyData(
  dietText: string,
  blackText: string,
  fitnessText: string,
  reviewNotesText: string
): ParsedLegacyData {
  const skillsMap = new Map<string, Skill>();
  const logs: SkillLog[] = [];
  const metricsMap = new Map<string, any>();
  const metricLogs: any[] = [];
  const warnings: ParseWarning[] = [];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const legend = new Map<string, { name: string, isAssumed: boolean, category: string }>();

  // 1. Extract Legends from Review Notes Table
  const tableRegex = /\|\s*([^\|]+?)\s*\|\s*\d+\s*\|\s*([^\|]*)\s*\|/g;
  let match;
  while ((match = tableRegex.exec(reviewNotesText)) !== null) {
    const token = match[1].trim();
    if (token === 'Token' || token.startsWith('---')) continue;
    const meaningStr = match[2].trim();
    const isAssumed = meaningStr.includes('(ASSUMED)');
    let name = meaningStr.replace(/\(ASSUMED\)/g, '').replace(/\(confirmed.*?\)/g, '').trim();
    if (!name) name = token;
    legend.set(token.toLowerCase(), { name, isAssumed, category: 'Diet' });
  }

  // 2. Extract from explicit lists (Fitness/Black headers)
  const listRegex = /-\s*\*\*(.*?)\*\*\s*=\s*(.*)/g;
  const combinedHeaders = blackText + '\n' + fitnessText;
  while ((match = listRegex.exec(combinedHeaders)) !== null) {
    const token = match[1].trim();
    const meaningStr = match[2].trim();
    const isAssumed = meaningStr.includes('(ASSUMED)');
    let name = meaningStr.replace(/\(ASSUMED\)/g, '').replace(/\(confirmed.*?\)/g, '').trim();
    legend.set(token.toLowerCase(), { name, isAssumed, category: 'Fitness' });
  }

  // Hardcoded known legends just in case
  legend.set('nsr', { name: 'No Sugar', isAssumed: false, category: 'Black' });
  legend.set('cd', { name: 'Clean Diet', isAssumed: false, category: 'Black' });
  legend.set('npr', { name: 'No Processed food/rice', isAssumed: true, category: 'Black' });
  legend.set('hd', { name: 'Ate out / hotel-restaurant food', isAssumed: true, category: 'Black' });

  function parseList(text: string, category: string) {
    if (!text) return;
    const lineRegex = /-\s*\*\*(.*?)\*\*\s*(?:\((.*?)\))?\s*[—-]\s*(.*)/g;
    let match;
    while ((match = lineRegex.exec(text)) !== null) {
      const dateStr = match[1].trim();
      const notes = match[2]?.trim() || '';
      const tokensStr = match[3].trim();

      if (tokensStr === '' || tokensStr.toLowerCase().includes('[skipped')) continue;

      const [dd, mm, yyyy] = dateStr.split('/');
      if (!dd || !mm || !yyyy) continue;
      const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;

      if (notes.toLowerCase().includes('assumed')) {
        warnings.push({ type: 'date', message: `Provisional date used: ${dateStr} (${notes})`, date: isoDate });
      }

      const tokens = tokensStr.split(',').map(t => t.trim()).filter(Boolean);
      for (let rawToken of tokens) {
        if (category === 'Fitness' && rawToken.includes('(')) continue; // skip inline weight

        let tokenKey = rawToken.toLowerCase();
        let count = 1;
        let mapped = legend.get(tokenKey);

        if (!mapped && category === 'Fitness') {
          const parseMatch = rawToken.match(/^([a-zA-Z]+)(.*)$/);
          if (parseMatch) {
            const baseKey = parseMatch[1].toLowerCase();
            mapped = legend.get(baseKey);
            if (mapped) {
              tokenKey = baseKey;
              const valStr = parseMatch[2];
              if (valStr.includes('1/2')) count = 0.5;
              else {
                const numMatch = valStr.match(/([\d\.]+)/);
                if (numMatch) count = parseFloat(numMatch[1]);
              }
            }
          }
        }

        if (!mapped) {
          mapped = { name: rawToken, isAssumed: true, category };
          legend.set(tokenKey, mapped);
          warnings.push({ type: 'unmapped_token', message: `Unmapped token found: "${rawToken}"`, token: rawToken, date: isoDate });
        } else if (mapped.isAssumed) {
            const existingWarning = warnings.find(w => w.type === 'assumed_mapping' && w.token === rawToken);
            if (!existingWarning) {
              warnings.push({ type: 'assumed_mapping', message: `Assumed mapping used for "${rawToken}" -> "${mapped.name}"`, token: rawToken });
            }
        }

        const skillId = `legacy_${category}_${mapped.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
        if (!skillsMap.has(skillId)) {
          skillsMap.set(skillId, {
            id: skillId,
            name: mapped.name,
            shortForm: mapped.name.slice(0, 3).toUpperCase(),
            category: mapped.category || category,
            mode: count !== 1 ? 'counter' : 'checkbox',
            createdAt: Date.now()
          });
        } else if (count !== 1) {
          skillsMap.get(skillId)!.mode = 'counter';
        }

        logs.push({
          skillId,
          date: isoDate,
          count: count,
          checked: true
        });
      }
    }
  }

  parseList(blackText, 'Black');
  parseList(dietText, 'Diet');
  parseList(fitnessText, 'Fitness');

    function parseWeights(text: string) {
    if (!text) return;
    const tableRegex = /\|\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*\|\s*([\d\.]+)\s*\|/g;
    let match;
    const weightMetricId = 'legacy_metric_weight';
    let hasWeights = false;

    while ((match = tableRegex.exec(text)) !== null) {
      hasWeights = true;
      const dateStr = match[1].trim();
      const valStr = match[2].trim();
      const [dd, mm, yyyy] = dateStr.split('/');
      const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const weightVal = parseFloat(valStr);
      
      metricLogs.push({
        metricId: weightMetricId,
        date: isoDate,
        value: weightVal
      });
    }

    if (hasWeights) {
      metricsMap.set(weightMetricId, {
        id: weightMetricId,
        name: 'Weight',
        category: 'Health',
        unit: 'kg',
        createdAt: Date.now()
      });
    }
  }

  parseWeights(reviewNotesText);

  return { skills: Array.from(skillsMap.values()), logs, metrics: Array.from(metricsMap.values()), metricLogs, warnings };
}
