const fs = require('fs');
let c = fs.readFileSync('src/components/DailyDashboardView.tsx', 'utf8');

c = c.replace(
  '       <div className="flex flex-col justify-end items-start w-full z-10 pointer-events-none mt-auto pb-1">',
  '       <div className="flex flex-col justify-end items-start w-full z-30 pointer-events-none mt-auto pb-1 relative">'
);

fs.writeFileSync('src/components/DailyDashboardView.tsx', c);
