const fs = require('fs');
let c = fs.readFileSync('src/data/historicalData.ts', 'utf8');

c = c.replace(/"id": "f_c",[\s\S]*?"createdAt": \d+/g, '$&\n  ,\n  "unit": "km"');
c = c.replace(/"id": "f_e",[\s\S]*?"createdAt": \d+/g, '$&\n  ,\n  "unit": "hr"');
c = c.replace(/"id": "f_s",[\s\S]*?"createdAt": \d+/g, '$&\n  ,\n  "unit": "hr"');
c = c.replace(/"id": "f_g",[\s\S]*?"createdAt": \d+/g, '$&\n  ,\n  "unit": "hr"');
c = c.replace(/"id": "d_kp",[\s\S]*?"createdAt": \d+/g, '$&\n  ,\n  "unit": "k steps"');

fs.writeFileSync('src/data/historicalData.ts', c);
