const fs = require('fs');
let c = fs.readFileSync('src/components/ExportModal.tsx', 'utf8');

c = c.replace(
  "const value = skill.mode === 'counter' ? `Count: ${log.count}` : `[x] Checked`;",
  "const value = skill.mode === 'counter' ? `${log.count} ${skill.unit || ''}`.trim() : `[x] Checked`;"
);

c = c.replace(
  "text += `   Total Progress: ${total} ${skill.mode === 'counter' ? 'count' : 'checkboxes'}\\n\\n`;",
  "text += `   Total Progress: ${total} ${skill.mode === 'counter' ? (skill.unit || 'count') : 'checkboxes'}\\n\\n`;"
);

fs.writeFileSync('src/components/ExportModal.tsx', c);
