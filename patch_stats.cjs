const fs = require('fs');
let c = fs.readFileSync('src/components/StatsView.tsx', 'utf8');

c = c.replace(
  '<div className="text-2xl font-black text-white">{dStats.weeklyCount}</div>',
  '<div className="text-2xl font-black text-white">{dStats.weeklyCount} <span className="text-lg text-zinc-500 font-bold">{skill.unit || \'\'}</span></div>'
);

c = c.replace(
  '<div className="text-2xl font-black text-white">{dStats.monthlyCount}</div>',
  '<div className="text-2xl font-black text-white">{dStats.monthlyCount} <span className="text-lg text-zinc-500 font-bold">{skill.unit || \'\'}</span></div>'
);

fs.writeFileSync('src/components/StatsView.tsx', c);
