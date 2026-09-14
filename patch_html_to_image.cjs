const fs = require('fs');
let c = fs.readFileSync('src/components/ExportModal.tsx', 'utf8');

c = c.replace(
  /import html2canvas from 'html2canvas';/,
  "import { toPng } from 'html-to-image';"
);

c = c.replace(
  /\/\/ We render html2canvas\n\s*const canvas = await html2canvas\([^;]+;\n\n\s*const url = canvas\.toDataURL\('image\/png'\);/,
  `// We render using html-to-image
      const url = await toPng(cardRef.current, {
        backgroundColor: '#000000',
        pixelRatio: 2,
      });`
);

fs.writeFileSync('src/components/ExportModal.tsx', c);
