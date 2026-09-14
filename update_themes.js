const fs = require('fs');

let c = fs.readFileSync('src/components/DailyDashboardView.tsx', 'utf8');

c = c.replace(/bgActive: 'bg-(.*?)-500\/20/g, "cardBorder: 'border-$1-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]',\n    bgActive: 'bg-$1-500/20");

fs.writeFileSync('src/components/DailyDashboardView.tsx', c);
