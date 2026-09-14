const d = new Date();
d.setDate(d.getDate() - d.getDay() + 1); // Monday
console.log(d);
