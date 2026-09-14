export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'medium') => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(30);
        break;
      case 'heavy':
        navigator.vibrate([40, 40, 40]); // pronounced
        break;
      case 'success':
        navigator.vibrate([20, 50, 30, 50, 20]); // success flourish
        break;
      case 'warning':
        navigator.vibrate([30, 80, 30]);
        break;
    }
  } catch (e) {
    // Ignore context errors
  }
};
