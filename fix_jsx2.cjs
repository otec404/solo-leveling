const fs = require('fs');
let c = fs.readFileSync('src/components/StatsView.tsx', 'utf8');

c = c.replace(
  `        })}
      </div>
    </div>
  );
}

function YearView`,
  `        })}
        </div>
      </div>
    </div>
  );
}

function YearView`
);

fs.writeFileSync('src/components/StatsView.tsx', c);
