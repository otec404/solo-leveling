const fs = require('fs');
let c = fs.readFileSync('src/components/DailyDashboardView.tsx', 'utf8');

c = c.replace(
  "             {log.count}",
  "             {log.count}\n             {skill.unit && <span className=\"text-xl sm:text-2xl opacity-60 font-bold ml-1 tracking-normal\">{skill.unit}</span>}"
);

fs.writeFileSync('src/components/DailyDashboardView.tsx', c);
