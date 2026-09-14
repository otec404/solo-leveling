const fs = require('fs');
let c = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const newLogic = `  const touchStartRef = useRef<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const distanceX = touchStartRef.current.x - touchEndX;
    const distanceY = touchStartRef.current.y - touchEndY;
    
    const minSwipeDistance = 50;
    
    // Only trigger if horizontal swipe is significantly larger than vertical movement
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      const catList = ['All', ...categories];
      const currentIndex = catList.indexOf(globalCategory);
      
      if (distanceX > minSwipeDistance) {
        // Swiped left -> next category
        const nextIndex = (currentIndex + 1) % catList.length;
        setGlobalCategory(catList[nextIndex]);
      } else {
        // Swiped right -> prev category
        const prevIndex = (currentIndex - 1 + catList.length) % catList.length;
        setGlobalCategory(catList[prevIndex]);
      }
    }
    touchStartRef.current = null;
  };`;

c = c.replace(/  const touchStartRef = useRef[\s\S]*?touchStartRef\.current = null;\n  \};/, newLogic);

fs.writeFileSync('src/components/Dashboard.tsx', c);
