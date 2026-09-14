const fs = require('fs');
let c = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const swipeLogic = `  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartRef.current - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      const catList = ['All', ...categories];
      const currentIndex = catList.indexOf(globalCategory);
      
      if (distance > minSwipeDistance) {
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
  };

  const handleImportClick`;

c = c.replace('  const handleImportClick', swipeLogic);

// Add handlers to the dashboard view container
c = c.replace(
  '<motion.div\n              key="dashboard"',
  '<motion.div\n              key="dashboard"\n              onTouchStart={handleTouchStart}\n              onTouchEnd={handleTouchEnd}'
);

fs.writeFileSync('src/components/Dashboard.tsx', c);
