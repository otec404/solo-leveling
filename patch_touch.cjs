const fs = require('fs');
let c = fs.readFileSync('src/components/StatsView.tsx', 'utf8');

c = c.replace(/const handleTouchStart = \(e: React\.TouchEvent\) => \{ touchStartRef\.current = e\.targetTouches\[0\]\.clientX; \};/g, 
  'const handleTouchStart = (e: React.TouchEvent) => { e.stopPropagation(); touchStartRef.current = e.targetTouches[0].clientX; };');

c = c.replace(/const handleTouchEnd = \(e: React\.TouchEvent\) => \{\n    if \(touchStartRef\.current === null\) return;/g, 
  `const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchStartRef.current === null) return;`);

fs.writeFileSync('src/components/StatsView.tsx', c);
