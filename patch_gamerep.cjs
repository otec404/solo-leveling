const fs = require('fs');
let c = fs.readFileSync('src/components/GamifiedReportCard.tsx', 'utf8');

c = c.replace(
  "{skill.mode === 'counter' ? 'count' : 'checked'}",
  "{skill.mode === 'counter' ? (skill.unit || 'count') : 'checked'}"
);

c = c.replace(
  '<p className="text-4xl font-black text-white">{total}</p>',
  '<p className="text-4xl font-black text-white">{total} <span className="text-xl text-zinc-500 ml-1">{skill.unit || \'\'}</span></p>'
);

fs.writeFileSync('src/components/GamifiedReportCard.tsx', c);
