const fs = require('fs');
let c = fs.readFileSync('src/components/StatsView.tsx', 'utf8');

const oldGrid = `<div className="grid grid-cols-7 gap-1.5 mt-auto">
        {['M','T','W','T','F','S','S'].map((day, i) => (
          <div key={i} className="text-center text-[9px] font-bold text-zinc-600 mb-1">{day}</div>
        ))}
        {calendarData.map((d: any, i: number) => {`;

const newGrid = `<div className="grid grid-cols-[auto_1fr] gap-2 mt-auto items-end">
        <div className="flex flex-col gap-1.5 justify-between h-full pb-1">
           {['M','T','W','T','F','S','S'].map((day, i) => (
             <div key={i} className="text-[9px] font-bold text-zinc-600 h-[10%] flex items-center justify-end pr-1">{day}</div>
           ))}
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
        {calendarData.map((d: any, i: number) => {`;

c = c.replace(oldGrid, newGrid);

// Don't forget to close the div properly since we added an extra wrapper
c = c.replace(
  `}
      </div>
    </div>
  );
}
function YearView`,
  `}
        </div>
      </div>
    </div>
  );
}
function YearView`
);

fs.writeFileSync('src/components/StatsView.tsx', c);
