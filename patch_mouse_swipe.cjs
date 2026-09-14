const fs = require('fs');
let c = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const mouseLogic = `
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (touchStartRef.current === null) return;
    
    const touchEndX = e.clientX;
    const touchEndY = e.clientY;
    
    const distanceX = touchStartRef.current.x - touchEndX;
    const distanceY = touchStartRef.current.y - touchEndY;
    
    const minSwipeDistance = 50;
    
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
  };

  const fileInputRef`;

c = c.replace('  const fileInputRef', mouseLogic);

c = c.replace(
  '              onTouchStart={handleTouchStart}\n              onTouchEnd={handleTouchEnd}',
  '              onTouchStart={handleTouchStart}\n              onTouchEnd={handleTouchEnd}\n              onMouseDown={handleMouseDown}\n              onMouseUp={handleMouseUp}\n              onMouseLeave={() => { touchStartRef.current = null; }}'
);

fs.writeFileSync('src/components/Dashboard.tsx', c);
