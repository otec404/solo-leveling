const fs = require('fs');
let c = fs.readFileSync('src/types.ts', 'utf8');
c = c.replace('  icon?: string;', '  icon?: string;\n  unit?: string;');
fs.writeFileSync('src/types.ts', c);
