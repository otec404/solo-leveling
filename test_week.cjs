const offset = 0;
const today = new Date();
const currentDay = today.getDay(); // 0 is Sun, 1 is Mon
const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
const startOfWeek = new Date(today.setDate(diff));
startOfWeek.setDate(startOfWeek.getDate() + offset * 7);

const dates = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(startOfWeek);
  d.setDate(d.getDate() + i);
  dates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
}
console.log(dates);
