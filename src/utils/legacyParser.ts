import { Skill, SkillLog, Metric, MetricLog } from '../types';
import { APPENDIX_B_SHORT_FORMS } from '../data/appendixReference';

export interface ParseWarning {
  type: 'date' | 'assumed_mapping' | 'unmapped_token';
  message: string;
  date?: string;
  token?: string;
}

export interface ParsedLegacyData {
  skills: Skill[];
  logs: SkillLog[];
  metrics: Metric[];
  metricLogs: MetricLog[];
  warnings: ParseWarning[];
}

export function parseRawAppendixC(fitnessText: string, dietText: string, blackText: string): ParsedLegacyData {
  const skillsMap = new Map<string, Skill>();
  const logsMap = new Map<string, SkillLog>();
  const metricLogsMap = new Map<string, MetricLog>();
  const warnings: ParseWarning[] = [];

  // Register standard skills from Appendix B
  APPENDIX_B_SHORT_FORMS.forEach(item => {
    const id = `${item.category.toLowerCase()}_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    skillsMap.set(id, {
      id,
      name: item.name,
      shortForm: item.shortForm,
      category: item.category,
      mode: item.mode,
      unit: item.unit,
      icon: item.icon,
      createdAt: 1789355297401
    });
  });

  const weightMetric: Metric = {
    id: 'metric_weight',
    name: 'Body Weight',
    unit: 'kg',
    category: 'Fitness',
    createdAt: 1789355297401
  };

  // Helper to normalize date string DD/MM/YY or DD/MM/YYYY into YYYY-MM-DD
  function parseDate(rawDateStr: string): string | null {
    const clean = rawDateStr.trim().replace(/^0+/, '');
    const parts = clean.split('/');
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    if (year < 100) {
      // 25 -> 2025, 26 -> 2026, 30 -> 2025 (e.g. 29/6/30 typo in notes)
      year = year === 30 ? 2025 : (2000 + year);
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Weight extraction regex
  function extractWeight(line: string, isoDate: string) {
    const weightPatterns = [
      /(?:>|\(+|\b)([\d]{2,3}(?:\.[\d]{1,2})?)\s*(?:kg|\)+|\b)/i,
      /(?:<<<|<<|\(\(\(|\(\()(?:\s*)([\d]{2,3}(?:\.[\d]{1,2})?)(?:\s*)(?:>>>|>>|\)\)\)|\)\))/i,
      /([\d]{2,3}\.[\d]{1,2})\s*(?:kg|am|pm|\))/i
    ];

    for (const pat of weightPatterns) {
      const match = line.match(pat);
      if (match && match[1]) {
        const val = parseFloat(match[1]);
        if (val >= 60 && val <= 130) {
          const key = `metric_weight_${isoDate}`;
          metricLogsMap.set(key, {
            metricId: 'metric_weight',
            date: isoDate,
            value: val
          });
          break;
        }
      }
    }
  }

  // 1. Parse Fitness Section
  const fitnessLines = fitnessText.split('\n');
  for (const line of fitnessLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('Legend') || trimmed.startsWith('Phase') || trimmed.startsWith('COLLEGE') || trimmed.startsWith('END') || trimmed.startsWith('Winter ARC') || trimmed.startsWith('Diwali') || trimmed.startsWith('Cut to') || trimmed.startsWith('Good bye') || trimmed.startsWith('Back to') || trimmed.startsWith('Glitch') || trimmed.startsWith('Fitness')) {
      continue;
    }

    // Match leading date: e.g. "5/6/25 b3, c10km", "24/8/25--H,B2,E1hr", "1/7/26 - B5"
    const dateMatch = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})[\s\-—:]*(.*)$/);
    if (!dateMatch) continue;

    const isoDate = parseDate(dateMatch[1]);
    if (!isoDate) continue;

    const content = dateMatch[2] || '';
    extractWeight(trimmed, isoDate);

    // Skip max / REST days
    if (content.toLowerCase().includes('skip') && !content.toLowerCase().includes('b') && !content.toLowerCase().includes('s') && !content.toLowerCase().includes('c') && !content.toLowerCase().includes('e')) {
      continue;
    }

    // Parse tokens in content
    const tokens = content.split(/[,;\-]+|\s+(?=[A-Za-z])/).map(t => t.trim()).filter(Boolean);
    for (const rawToken of tokens) {
      const token = rawToken.toLowerCase();

      // Boat club: e.g. b3, b2, b5, b1+b3, b4, b6, b5hr
      if (/^b(\d+)(?:\+b(\d+))?/i.test(rawToken)) {
        const m = rawToken.match(/^b(\d+)(?:\+b(\d+))?/i);
        if (m) {
          const count = parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) : 0);
          const skillId = 'fitness_boat_club';
          const key = `${skillId}_${isoDate}`;
          const current = logsMap.get(key)?.count || 0;
          logsMap.set(key, { skillId, date: isoDate, count: current + count, checked: true });
        }
      } 
      // Cycle: c10km, c12km, c15km, c20km, c10
      else if (/^c(\d+)k?m?/i.test(rawToken)) {
        const m = rawToken.match(/^c(\d+)/i);
        if (m) {
          const count = parseInt(m[1], 10);
          const skillId = 'fitness_cycle';
          const key = `${skillId}_${isoDate}`;
          const current = logsMap.get(key)?.count || 0;
          logsMap.set(key, { skillId, date: isoDate, count: current + count, checked: true });
        }
      }
      // Exercise: e1hr, e2hr, e1/2hr, e1/2, e1, e
      else if (/^e(?:xercise)?(?:(\d+(?:\/2)?|\d+\.\d+)?(?:hr)?)?$/i.test(rawToken) || rawToken.toLowerCase() === 'e') {
        let hrs = 1;
        if (rawToken.includes('1/2')) hrs = 0.5;
        else if (rawToken.includes('2')) hrs = 2;
        else if (rawToken.includes('1')) hrs = 1;
        const skillId = 'fitness_exercise';
        const key = `${skillId}_${isoDate}`;
        const current = logsMap.get(key)?.count || 0;
        logsMap.set(key, { skillId, date: isoDate, count: current + hrs, checked: true });
      }
      // Shuttle: s1hr, s2hr, s1_1/2hr, s(1/2hr), s, s1
      else if (/^s(?:huttle)?(?:(\d+(?:[_\/]1\/2)?|\d+\.\d+)?(?:hr)?)?$/i.test(rawToken) || rawToken.toLowerCase() === 's') {
        let hrs = 1;
        if (rawToken.includes('1/2') || rawToken.includes('1_1/2')) hrs = rawToken.includes('1_') ? 1.5 : 0.5;
        else if (rawToken.includes('2')) hrs = 2;
        else if (rawToken.includes('1')) hrs = 1;
        const skillId = 'fitness_shuttle';
        const key = `${skillId}_${isoDate}`;
        const current = logsMap.get(key)?.count || 0;
        logsMap.set(key, { skillId, date: isoDate, count: current + hrs, checked: true });
      }
      // Kulai: k1, k5, k3
      else if (/^k(\d+)/i.test(rawToken)) {
        const m = rawToken.match(/^k(\d+)/i);
        if (m) {
          const count = parseInt(m[1], 10);
          const skillId = 'fitness_kulai_cheruvu_walking_track';
          const key = `${skillId}_${isoDate}`;
          const current = logsMap.get(key)?.count || 0;
          logsMap.set(key, { skillId, date: isoDate, count: current + count, checked: true });
        }
      }
      // Gandhi Park: g3
      else if (/^g(\d+)/i.test(rawToken)) {
        const m = rawToken.match(/^g(\d+)/i);
        if (m) {
          const count = parseInt(m[1], 10);
          const skillId = 'fitness_gandhi_park_walking_track';
          const key = `${skillId}_${isoDate}`;
          const current = logsMap.get(key)?.count || 0;
          logsMap.set(key, { skillId, date: isoDate, count: current + count, checked: true });
        }
      }
      // Gym: gym 1hr, gym
      else if (token.includes('gym')) {
        const hrs = token.includes('2') ? 2 : 1;
        const skillId = 'fitness_gym';
        const key = `${skillId}_${isoDate}`;
        const current = logsMap.get(key)?.count || 0;
        logsMap.set(key, { skillId, date: isoDate, count: current + hrs, checked: true });
      }
      // Cricket: crix1, crix 2hr, crick
      else if (token.includes('crix') || token.includes('crick')) {
        const hrs = token.includes('2') ? 2 : 1;
        const skillId = 'fitness_cricket';
        const key = `${skillId}_${isoDate}`;
        const current = logsMap.get(key)?.count || 0;
        logsMap.set(key, { skillId, date: isoDate, count: current + hrs, checked: true });
      }
      // Pickleball: pickb2hr
      else if (token.includes('pickb')) {
        const hrs = token.includes('2') ? 2 : 1;
        const skillId = 'fitness_pickleball';
        const key = `${skillId}_${isoDate}`;
        const current = logsMap.get(key)?.count || 0;
        logsMap.set(key, { skillId, date: isoDate, count: current + hrs, checked: true });
      }
      // Trekking
      else if (token.includes('trekking')) {
        const skillId = 'fitness_trekking';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: 1, checked: true });
      }
    }
  }

  // 2. Parse Diet Section ("Project K")
  const dietLines = dietText.split('\n');
  for (const line of dietLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('9.2') || trimmed.startsWith('2025') || trimmed.startsWith('2026') || trimmed.startsWith('Cut to') || trimmed.startsWith('Glitch') || trimmed.startsWith('Skip') || trimmed.startsWith('Start again')) {
      continue;
    }

    const dateMatch = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})[\s\-—:]*(.*)$/);
    if (!dateMatch) continue;

    const isoDate = parseDate(dateMatch[1]);
    if (!isoDate) continue;

    const content = dateMatch[2] || '';
    const tokens = content.split(/[,;\/]+|\s+(?=[A-Za-z0-9])/).map(t => t.trim()).filter(Boolean);

    for (const rawToken of tokens) {
      const t = rawToken.toLowerCase();

      // Powerhouse
      if (t === 'ph' || t === 'powerhouse') {
        const skillId = 'diet_powerhouse';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Carrot: 1ca, 2ca, 3ca, ca
      else if (t.includes('ca')) {
        const m = t.match(/(\d+)\s*ca/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_carrot';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Orange: 1or, 1org, or
      else if (t.includes('or') || t.includes('org')) {
        const m = t.match(/(\d+)\s*(?:or|org)/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_orange';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Apple: 1apl, apl
      else if (t.includes('apl') || t.includes('apple')) {
        const m = t.match(/(\d+)\s*apl/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_apple';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Guava: 1gu, 2gu, 1guv, gu
      else if (t.includes('gu') || t.includes('guv')) {
        const m = t.match(/(\d+)\s*(?:gu|guv)/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_guava';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Banana: 1ban, 2ban, 2ba, ban
      else if (t.includes('ban') || t.includes('ba')) {
        const m = t.match(/(\d+)\s*(?:ban|ba)/);
        const count = m ? parseInt(m[1], 10) : (t === '2ba' ? 2 : 1);
        const skillId = 'diet_banana';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Amla: 4am, 6am, am
      else if (t.includes('am') && !t.includes('pomo')) {
        const m = t.match(/(\d+)\s*am/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_amla';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Curry leaves: 10kp, 1kp, 10gp, kp
      else if (t.includes('kp') || t.includes('gp')) {
        const m = t.match(/(\d+)\s*(?:kp|gp)/);
        const count = m ? parseInt(m[1], 10) : 10;
        const skillId = 'diet_curry_leaves';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Havintha shampoo: hvin, hivn
      else if (t.includes('hvin') || t.includes('hivn')) {
        const skillId = 'diet_havintha_shampoo';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Pomegranate: 1pomo, pomo
      else if (t.includes('pomo')) {
        const m = t.match(/(\d+)\s*pomo/);
        const count = m ? parseInt(m[1], 10) : 1;
        const skillId = 'diet_pomegranate';
        const key = `${skillId}_${isoDate}`;
        logsMap.set(key, { skillId, date: isoDate, count: (logsMap.get(key)?.count || 0) + count, checked: true });
      }
      // Natural face pack: spf, sprw, sp+rw
      else if (t.includes('spf') || t.includes('sprw') || t.includes('sp+rw')) {
        const skillId = 'diet_natural_face_pack';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Multani mitti: mm, mm+rw
      else if (t.includes('mm')) {
        const skillId = 'diet_multani_mitti';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Lemon tea: lt
      else if (t.includes('lt')) {
        const skillId = 'diet_lemon_tea';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Dragon fruit: 1drg, drg
      else if (t.includes('drg')) {
        const skillId = 'diet_dragon_fruit';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Mop
      else if (t.includes('mop')) {
        const skillId = 'diet_mop';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
      // Eggs: 2eggs
      else if (t.includes('egg')) {
        const m = t.match(/(\d+)\s*egg/);
        const count = m ? parseInt(m[1], 10) : 2;
        const skillId = 'diet_eggs';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count, checked: true });
      }
      // Fish
      else if (t.includes('fish')) {
        const skillId = 'diet_fish';
        logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
      }
    }
  }

  // 3. Parse Black Section ("Project Solo Levelling")
  const blackLines = blackText.split('\n');
  for (const line of blackLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('9.3') || trimmed.startsWith('Categories') || trimmed.startsWith('Cut to') || trimmed.startsWith('Skip') || trimmed.startsWith('Note:')) {
      continue;
    }

    const dateMatch = trimmed.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4})[\s\-—:]*(.*)$/);
    if (!dateMatch) continue;

    const isoDate = parseDate(dateMatch[1]);
    if (!isoDate) continue;

    const content = dateMatch[2] || '';
    const upper = content.toUpperCase();

    // No Sugar
    if (upper.includes('NSR')) {
      const skillId = 'black_no_sugar';
      logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
    }
    // Clean Diet
    if (upper.includes('CD') && !upper.includes('SID CHEPA')) {
      const skillId = 'black_clean_diet';
      logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
    }
    // Personal (black)
    if (upper.includes('NPR')) {
      const skillId = 'black_personal__black_';
      logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
    }
    // Home Diet
    if (upper.includes('HD')) {
      const skillId = 'black_home_diet';
      logsMap.set(`${skillId}_${isoDate}`, { skillId, date: isoDate, count: 1, checked: true });
    }
  }

  return {
    skills: Array.from(skillsMap.values()),
    logs: Array.from(logsMap.values()),
    metrics: [weightMetric],
    metricLogs: Array.from(metricLogsMap.values()),
    warnings
  };
}

export function parseLegacyData(
  dietText: string,
  blackText: string,
  fitnessText: string,
  reviewNotesText: string
): ParsedLegacyData {
  return parseRawAppendixC(fitnessText, dietText, blackText);
}
