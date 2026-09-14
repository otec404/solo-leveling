const fs = require('fs');
let c = fs.readFileSync('src/components/ExportModal.tsx', 'utf8');

const newFunc = `  const handleExportText = () => {
    let text = \`====================================================\\n\`;
    text += \`               FOCUSFLOW OPERATIVE REPORT\\n\`;
    text += \`====================================================\\n\\n\`;
    text += \`Operative ID: \${userId}\\n\`;
    text += \`Report Date: \${new Date().toISOString().split('T')[0]}\\n\`;
    text += \`Date Range: \${getDateRange()}\\n\\n\`;

    const dates = Array.from(new Set(logs.map(l => l.date))).sort();
    
    text += \`--- DAILY BREAKDOWN ---\\n\\n\`;
    if (dates.length === 0) {
      text += \`No activity logged.\\n\\n\`;
    } else {
      dates.forEach(date => {
        text += \`Date: \${date}\\n\`;
        const logsForDate = logs.filter(l => l.date === date && (l.count > 0 || l.checked));
        if (logsForDate.length === 0) {
          text += \`  No progress logged.\\n\`;
        } else {
          logsForDate.forEach(log => {
             const skill = skills.find(s => s.id === log.skillId);
             if (skill) {
                const value = skill.mode === 'counter' ? \`Count: \${log.count}\` : \`[x] Checked\`;
                text += \`  - \${skill.name} (\${skill.shortForm}): \${value}\\n\`;
             }
          });
        }
        text += \`\\n\`;
      });
    }

    text += \`--- OVERALL TOTALS ---\\n\\n\`;
    if (skills.length === 0) {
      text += \`No skills documented.\\n\`;
    } else {
      skills.forEach((skill, index) => {
        const skillLogs = logs.filter(l => l.skillId === skill.id && (l.count > 0 || l.checked));
        const total = skillLogs.reduce((acc, l) => acc + (skill.mode === 'counter' ? l.count : 1), 0);
        
        text += \`\${index + 1}. \${skill.name} [\${skill.shortForm}]\\n\`;
        text += \`   Category: \${skill.category}\\n\`;
        text += \`   Tracking Mode: \${skill.mode}\\n\`;
        text += \`   Total Progress: \${total} \${skill.mode === 'counter' ? 'count' : 'checkboxes'}\\n\\n\`;
      });
    }

    text += \`====================================================\\n\`;
    text += \`END OF TRANSMISSION\\n\`;
    text += \`====================================================\\n\`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`focusflow-report-\${new Date().toISOString().split('T')[0]}.txt\`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };\`;
`;

c = c.replace(/const handleExportText = \(\) => \{[\s\S]*?onClose\(\);\n  \};/, newFunc.trim());

fs.writeFileSync('src/components/ExportModal.tsx', c);
