const fs = require('fs');
let code = fs.readFileSync('src/components/StatsView.tsx', 'utf-8');

code = code.replace(/const handleTouchStart = \(e: React\.TouchEvent\) => \{[\s\S]*?y: e\.targetTouches\[0\]\.clientY\n    \};\n  \};/, `const handleTouchStart = (e: React.TouchEvent) => {
    startRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };`);

code = code.replace(/const handleTouchEnd = \(e: React\.TouchEvent\) => \{[\s\S]*?if \(!startRef\.current\) return;/, `const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startRef.current) return;`);

fs.writeFileSync('src/components/StatsView.tsx', code);
