import { useState, useEffect, useCallback } from 'react';
import { 
  DARK_THEMES, 
  LIGHT_THEMES, 
  ALL_THEMES, 
  APP_FONTS, 
  ThemeBackground, 
  AppFont, 
  applyThemeAndFont, 
  getInitialThemeAndFont 
} from '../lib/themeManager';
import { triggerHaptic } from '../lib/haptics';

export function useThemeSettings() {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return getInitialThemeAndFont().themeId;
  });

  const [currentFontId, setCurrentFontId] = useState<string>(() => {
    return getInitialThemeAndFont().fontId;
  });

  // Apply on mount and changes
  useEffect(() => {
    applyThemeAndFont(currentThemeId, currentFontId);
  }, [currentThemeId, currentFontId]);

  const setTheme = useCallback((themeId: string) => {
    setCurrentThemeId(themeId);
    applyThemeAndFont(themeId, currentFontId);
    triggerHaptic('light');
  }, [currentFontId]);

  const setFont = useCallback((fontId: string) => {
    setCurrentFontId(fontId);
    applyThemeAndFont(currentThemeId, fontId);
    triggerHaptic('light');
  }, [currentThemeId]);

  const currentTheme = ALL_THEMES.find(t => t.id === currentThemeId) || DARK_THEMES[0];
  const currentFont = APP_FONTS.find(f => f.id === currentFontId) || APP_FONTS[0];

  return {
    currentTheme,
    currentFont,
    currentThemeId,
    currentFontId,
    darkThemes: DARK_THEMES,
    lightThemes: LIGHT_THEMES,
    allThemes: ALL_THEMES,
    fonts: APP_FONTS,
    setTheme,
    setFont
  };
}
