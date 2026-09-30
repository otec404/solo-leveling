export interface ThemeBackground {
  id: string;
  name: string;
  hex: string;
  surfaceHex: string;
  cardHex: string;
  borderRgba: string;
  isDark: boolean;
  category: 'DARK' | 'LIGHT';
  accentHint: string;
  starred?: boolean;
}

export interface AppFont {
  id: string;
  name: string;
  family: string;
  feel: string;
  bestFor: string;
  starred?: boolean;
  sampleText?: string;
}

export const DARK_THEMES: ThemeBackground[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    hex: '#0B0B0D',
    surfaceHex: '#121217',
    cardHex: '#16161D',
    borderRgba: 'rgba(255, 255, 255, 0.10)',
    isDark: true,
    category: 'DARK',
    accentHint: '#06B6D4',
    starred: true
  },
  {
    id: 'graphite',
    name: 'Graphite',
    hex: '#111214',
    surfaceHex: '#18191D',
    cardHex: '#1F2025',
    borderRgba: 'rgba(255, 255, 255, 0.10)',
    isDark: true,
    category: 'DARK',
    accentHint: '#94A3B8'
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    hex: '#121212',
    surfaceHex: '#1A1A1A',
    cardHex: '#222222',
    borderRgba: 'rgba(255, 255, 255, 0.09)',
    isDark: true,
    category: 'DARK',
    accentHint: '#E2E8F0'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    hex: '#0A0F14',
    surfaceHex: '#101822',
    cardHex: '#162230',
    borderRgba: 'rgba(6, 182, 212, 0.16)',
    isDark: true,
    category: 'DARK',
    accentHint: '#38BDF8'
  },
  {
    id: 'deep-navy',
    name: 'Deep Navy',
    hex: '#080C14',
    surfaceHex: '#0E1726',
    cardHex: '#142136',
    borderRgba: 'rgba(59, 130, 246, 0.18)',
    isDark: true,
    category: 'DARK',
    accentHint: '#60A5FA'
  },
  {
    id: 'dark-titanium',
    name: 'Dark Titanium',
    hex: '#101112',
    surfaceHex: '#17191B',
    cardHex: '#1E2024',
    borderRgba: 'rgba(255, 255, 255, 0.11)',
    isDark: true,
    category: 'DARK',
    accentHint: '#CBD5E1'
  },
  {
    id: 'warm-black',
    name: 'Warm Black',
    hex: '#0D0C0B',
    surfaceHex: '#171513',
    cardHex: '#221F1B',
    borderRgba: 'rgba(245, 158, 11, 0.14)',
    isDark: true,
    category: 'DARK',
    accentHint: '#F59E0B'
  },
  {
    id: 'dark-emerald',
    name: 'Dark Emerald',
    hex: '#07110D',
    surfaceHex: '#0D1E17',
    cardHex: '#122A20',
    borderRgba: 'rgba(16, 185, 129, 0.18)',
    isDark: true,
    category: 'DARK',
    accentHint: '#10B981'
  }
];

export const LIGHT_THEMES: ThemeBackground[] = [
  {
    id: 'ivory-white',
    name: 'Ivory White',
    hex: '#FFFFFF',
    surfaceHex: '#F8FAFC',
    cardHex: '#F1F5F9',
    borderRgba: 'rgba(0, 0, 0, 0.10)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#0284C7',
    starred: true
  },
  {
    id: 'pearl-gray',
    name: 'Pearl Gray',
    hex: '#F5F7FA',
    surfaceHex: '#FFFFFF',
    cardHex: '#EAEFF5',
    borderRgba: 'rgba(0, 0, 0, 0.08)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#475569'
  },
  {
    id: 'warm-white',
    name: 'Warm White',
    hex: '#FFFBF5',
    surfaceHex: '#FFFFFF',
    cardHex: '#FBF3E7',
    borderRgba: 'rgba(180, 83, 9, 0.12)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#D97706'
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    hex: '#F0F9FF',
    surfaceHex: '#FFFFFF',
    cardHex: '#E0F2FE',
    borderRgba: 'rgba(2, 132, 199, 0.16)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#0284C7'
  },
  {
    id: 'mint',
    name: 'Mint',
    hex: '#F6FFFA',
    surfaceHex: '#FFFFFF',
    cardHex: '#DCFCE7',
    borderRgba: 'rgba(16, 185, 129, 0.16)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#059669'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    hex: '#FAF5FF',
    surfaceHex: '#FFFFFF',
    cardHex: '#F3E8FF',
    borderRgba: 'rgba(147, 51, 234, 0.16)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#7E22CE'
  },
  {
    id: 'rose',
    name: 'Rose',
    hex: '#FFF7F7',
    surfaceHex: '#FFFFFF',
    cardHex: '#FFE4E6',
    borderRgba: 'rgba(225, 29, 72, 0.16)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#E11D48'
  },
  {
    id: 'sand-beige',
    name: 'Sand Beige',
    hex: '#FAF9F6',
    surfaceHex: '#FFFFFF',
    cardHex: '#F5F2EB',
    borderRgba: 'rgba(120, 113, 108, 0.14)',
    isDark: false,
    category: 'LIGHT',
    accentHint: '#78716C'
  }
];

export const ALL_THEMES: ThemeBackground[] = [...DARK_THEMES, ...LIGHT_THEMES];

export const APP_FONTS: AppFont[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    feel: 'Clean, modern, premium',
    bestFor: 'Entire app',
    starred: true,
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'sf-pro',
    name: 'SF Pro',
    family: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'SF Pro', 'Helvetica Neue', sans-serif",
    feel: 'Apple-like, refined',
    bestFor: 'iOS-style UI',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'manrope',
    name: 'Manrope',
    family: "'Manrope', sans-serif",
    feel: 'Soft, elegant',
    bestFor: 'Modern dashboards',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', sans-serif",
    feel: 'Premium, friendly',
    bestFor: 'SaaS / trackers',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: "'DM Sans', sans-serif",
    feel: 'Minimal, readable',
    bestFor: 'Simple interfaces',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'geist',
    name: 'Geist',
    family: "'Geist', sans-serif",
    feel: 'Sharp, modern',
    bestFor: 'Tech products',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'satoshi',
    name: 'Satoshi',
    family: "'Satoshi', sans-serif",
    feel: 'Stylish, premium',
    bestFor: 'High-end UI',
    sampleText: 'Ag 123 FocusFlow'
  },
  {
    id: 'avenir-next',
    name: 'Avenir Next',
    family: "'Avenir Next', 'Avenir', 'Nunito Sans', sans-serif",
    feel: 'Elegant, sophisticated',
    bestFor: 'Luxury/minimal UI',
    sampleText: 'Ag 123 FocusFlow'
  }
];

export function applyThemeAndFont(themeId: string, fontId: string) {
  const theme = ALL_THEMES.find(t => t.id === themeId) || DARK_THEMES[0];
  const font = APP_FONTS.find(f => f.id === fontId) || APP_FONTS[0];

  const root = document.documentElement;
  const body = document.body;

  // Apply Background Variables
  root.style.setProperty('--app-bg', theme.hex);
  root.style.setProperty('--app-surface', theme.surfaceHex);
  root.style.setProperty('--app-card', theme.cardHex);
  root.style.setProperty('--app-border', theme.borderRgba);
  root.style.setProperty('--app-font-family', font.family);
  root.style.setProperty('--font-sans', font.family);

  // Set Theme Mode attribute for CSS
  root.setAttribute('data-theme-id', theme.id);
  root.setAttribute('data-theme-mode', theme.isDark ? 'dark' : 'light');
  root.setAttribute('data-font-id', font.id);

  if (body) {
    body.style.backgroundColor = theme.hex;
    body.style.fontFamily = font.family;
    if (theme.isDark) {
      body.classList.add('dark');
      body.classList.remove('light-theme');
    } else {
      body.classList.remove('dark');
      body.classList.add('light-theme');
    }
  }

  // Update theme-color meta tag for Android / Mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.hex);
  }

  // Persist
  localStorage.setItem('focusflow_bg_theme', theme.id);
  localStorage.setItem('focusflow_font', font.id);
}

export function getInitialThemeAndFont(): { themeId: string; fontId: string } {
  const savedTheme = localStorage.getItem('focusflow_bg_theme') || 'obsidian';
  const savedFont = localStorage.getItem('focusflow_font') || 'inter';
  return {
    themeId: ALL_THEMES.some(t => t.id === savedTheme) ? savedTheme : 'obsidian',
    fontId: APP_FONTS.some(f => f.id === savedFont) ? savedFont : 'inter'
  };
}
