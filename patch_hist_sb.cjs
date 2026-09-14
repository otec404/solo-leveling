const fs = require('fs');
let c = fs.readFileSync('src/components/HistorySidebar.tsx', 'utf8');

c = c.replace(
  "{skill.mode === 'counter' ? log.count : <Check",
  "{skill.mode === 'counter' ? (skill.unit ? `${log.count} ${skill.unit}` : log.count) : <Check"
);

fs.writeFileSync('src/components/HistorySidebar.tsx', c);
