const fs = require('fs');
let c = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

c = c.replace(/const \[skills, setSkills\] = useState<Skill\[\]>\(\[[\s\S]*?\]\);/, 'const [skills, setSkills] = useState<Skill[]>(initialSkills);');

c = c.replace(/const \[logs, setLogs\] = useState<SkillLog\[\]>\(\[[\s\S]*?\]\);/, 'const [logs, setLogs] = useState<SkillLog[]>(initialLogs);');

fs.writeFileSync('src/components/Dashboard.tsx', c);
