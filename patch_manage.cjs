const fs = require('fs');
let c = fs.readFileSync('src/components/ManageSkillsView.tsx', 'utf8');

c = c.replace(
  "  const [mode, setMode] = useState<TrackingMode>('counter');",
  "  const [mode, setMode] = useState<TrackingMode>('counter');\n  const [unit, setUnit] = useState('');"
);

c = c.replace(
  "      setMode(skill.mode);",
  "      setMode(skill.mode);\n      setUnit(skill.unit || '');"
);

c = c.replace(
  "      setMode('counter');",
  "      setMode('counter');\n      setUnit('');"
);

c = c.replace(
  "const skillData = { name, shortForm, mode, category: finalCategory, icon };",
  "const skillData = { name, shortForm, mode, category: finalCategory, icon, unit: unit.trim() || undefined };"
);

const unitInput = `                  {mode === 'counter' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="pt-2">
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Unit (Optional)</label>
                        <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. km, hr, mins, kg" className="block w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-100 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none text-sm" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>`;

c = c.replace(
  /                  <div>\n                    <label className="block text-\[11px\] font-medium text-zinc-500 uppercase tracking-widest mb-1\.5 ml-1">Category<\/label>/,
  unitInput
);

fs.writeFileSync('src/components/ManageSkillsView.tsx', c);
