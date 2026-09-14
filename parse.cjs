const fs = require('fs');

const skills = [
  { id: 'f_b', name: 'Boat Club', shortForm: 'Bt', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },
  { id: 'f_c', name: 'Cycle', shortForm: 'Cy', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },
  { id: 'f_e', name: 'Exercise', shortForm: 'Ex', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },
  { id: 'f_s', name: 'Shuttle', shortForm: 'Sh', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },
  { id: 'f_k', name: 'Kulai', shortForm: 'Ku', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },
  { id: 'f_g', name: 'Gym', shortForm: 'Gy', mode: 'counter', category: 'Fitness', icon: 'Activity', createdAt: Date.now() },

  { id: 'd_ph', name: 'Powerhouse', shortForm: 'Ph', mode: 'checkbox', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_4am', name: '4 AM Wakeup', shortForm: '4a', mode: 'checkbox', category: 'Diet', icon: 'Activity', createdAt: Date.now() },
  { id: 'd_ca', name: 'Carrot', shortForm: 'Ca', mode: 'counter', category: 'Diet', icon: 'Carrot', createdAt: Date.now() },
  { id: 'd_or', name: 'Orange', shortForm: 'Or', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_apl', name: 'Apple', shortForm: 'Ap', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_gu', name: 'Guava', shortForm: 'Gu', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_ban', name: 'Banana', shortForm: 'Ba', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_pomo', name: 'Pomegranate', shortForm: 'Po', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_am', name: 'Amla', shortForm: 'Am', mode: 'counter', category: 'Diet', icon: 'Apple', createdAt: Date.now() },
  { id: 'd_kp', name: '10KP', shortForm: 'KP', mode: 'counter', category: 'Diet', icon: 'Activity', createdAt: Date.now() },
  { id: 'd_mop', name: 'Mop', shortForm: 'Mp', mode: 'checkbox', category: 'Diet', icon: 'Activity', createdAt: Date.now() },
  { id: 'd_hvin', name: 'Hvin', shortForm: 'Hv', mode: 'checkbox', category: 'Diet', icon: 'Activity', createdAt: Date.now() },
  { id: 'd_spf', name: 'SpF', shortForm: 'Sf', mode: 'checkbox', category: 'Diet', icon: 'Activity', createdAt: Date.now() },
  { id: 'd_lt', name: 'Lt', shortForm: 'Lt', mode: 'checkbox', category: 'Diet', icon: 'Activity', createdAt: Date.now() },

  { id: 'b_cd', name: 'Clean Diet', shortForm: 'Cd', mode: 'checkbox', category: 'Black', icon: 'Ghost', createdAt: Date.now() },
  { id: 'b_nsr', name: 'No Sugar', shortForm: 'NSR', mode: 'checkbox', category: 'Black', icon: 'Ghost', createdAt: Date.now() },
  { id: 'b_npr', name: 'NPR', shortForm: 'NPR', mode: 'checkbox', category: 'Black', icon: 'Ghost', createdAt: Date.now() },
  { id: 'b_hd', name: 'Hd', shortForm: 'Hd', mode: 'checkbox', category: 'Black', icon: 'Ghost', createdAt: Date.now() }
];

let logs = [];

function addLog(date, skillId, count, checked) {
    let existing = logs.find(l => l.date === date && l.skillId === skillId);
    if (existing) {
        existing.count += (count || 0);
        existing.checked = existing.checked || checked;
    } else {
        logs.push({ skillId, date, count: count || 0, checked: checked || false });
    }
}

function parseLine(line, parserFunc) {
    let match = line.match(/(\d{1,2})[\/!](\d{1,2})\/(\d{2,4})[-]*\s*(.*)/i);
    if (!match) return;

    let d = parseInt(match[1]);
    let m = parseInt(match[2]);
    let y = parseInt(match[3]);
    if (y < 100) y += 2000;

    let dateStr = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    let text = match[4].toLowerCase();
    
    parserFunc(dateStr, text);
}

function evalFraction(str) {
    if (!str) return 1;
    if (str.includes('/')) {
       const parts = str.split('/');
       if (parts.length === 2) return parseInt(parts[0]) / parseInt(parts[1]);
    }
    let parsed = parseFloat(str);
    return isNaN(parsed) ? 1 : parsed;
}

const d1 = fs.readFileSync('data1.txt', 'utf8').split('\n');
d1.forEach(l => parseLine(l, (date, str) => {
    let bMatch = str.match(/\bb\s*(\d+)/);
    if (bMatch) addLog(date, 'f_b', parseInt(bMatch[1]), true);
    else if (str.match(/(?:^|[, ])b(?:$|[, ])/)) addLog(date, 'f_b', 1, true);

    let cMatch = str.match(/\bc\s*(\d+)/);
    if (cMatch) addLog(date, 'f_c', parseInt(cMatch[1]), true);
    
    let eMatch = str.match(/\be\s*(\d*(?:\.\d+|\/\d+)?)/);
    if (eMatch) addLog(date, 'f_e', Math.ceil(evalFraction(eMatch[1])), true);
    else if (str.match(/(?:^|[, ])e(?:$|[, ])/)) addLog(date, 'f_e', 1, true);

    let sMatch = str.match(/\bs\s*(\d+)/);
    if (sMatch) addLog(date, 'f_s', parseInt(sMatch[1]), true);
    else if (str.match(/\bs(?:$|[, ])/)) addLog(date, 'f_s', 1, true);

    let kMatch = str.match(/\bk\s*(\d+)/);
    if (kMatch) addLog(date, 'f_k', parseInt(kMatch[1]), true);

    let gymMatch = str.match(/gym\s*(\d+)?/);
    if (gymMatch) addLog(date, 'f_g', gymMatch[1] ? parseInt(gymMatch[1]) : 1, true);
}));

const d2 = fs.readFileSync('data2.txt', 'utf8').split('\n');
d2.forEach(l => parseLine(l, (date, str) => {
    if (str.includes('ph')) addLog(date, 'd_ph', 0, true);
    if (str.includes('4am')) addLog(date, 'd_4am', 0, true);
    if (str.includes('mop')) addLog(date, 'd_mop', 0, true);
    if (str.match(/hvin|hivn/)) addLog(date, 'd_hvin', 0, true);
    if (str.includes('spf')) addLog(date, 'd_spf', 0, true);
    if (str.includes('lt')) addLog(date, 'd_lt', 0, true);

    let parseFruit = (regex, id) => {
        let match = str.match(regex);
        if (match) {
            addLog(date, id, match[1] ? parseInt(match[1]) : 1, true);
        }
    }
    parseFruit(/(\d+)?\s*ca\b/, 'd_ca');
    parseFruit(/(\d+)?\s*or\b/, 'd_or');
    parseFruit(/(\d+)?\s*apl\b/, 'd_apl');
    parseFruit(/(\d+)?\s*gu\b/, 'd_gu');
    parseFruit(/(\d+)?\s*(?:ban|ba)\b/, 'd_ban');
    parseFruit(/(\d+)?\s*pomo\b/, 'd_pomo');
    parseFruit(/(\d+)?\s*kp\b/, 'd_kp');
    
    let m = str.match(/(?<!4)\b(\d+)?am\b/);
    if (m) addLog(date, 'd_am', m[1] ? parseInt(m[1]) : 1, true);
}));

const d3 = fs.readFileSync('data3.txt', 'utf8').split('\n');
d3.forEach(l => parseLine(l, (date, str) => {
    if (str.includes('cd')) addLog(date, 'b_cd', 0, true);
    if (str.includes('nsr')) addLog(date, 'b_nsr', 0, true);
    if (str.includes('npr')) addLog(date, 'b_npr', 0, true);
    if (str.match(/\bhd\b/)) addLog(date, 'b_hd', 0, true);
}));

const output = `import { Skill, SkillLog } from '../types';

export const initialSkills: Skill[] = ${JSON.stringify(skills, null, 2)};
export const initialLogs: SkillLog[] = ${JSON.stringify(logs, null, 2)};
`;

fs.writeFileSync('src/data/historicalData.ts', output.trim());
console.log("Parsed logs length: " + logs.length);
