import * as LucideIcons from 'lucide-react';
import { Target, Activity } from 'lucide-react';

export const THEME_COLORS: Record<string, string> = {
  emerald: '#10b981',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  fuchsia: '#d946ef',
  purple: '#a855f7',
  black: '#ffffff',
  default: '#818cf8'
};

// Get clean, sorted icon names from Lucide (thousands of icons)
export const ALL_LUCIDE_ICON_NAMES: string[] = Object.keys(LucideIcons)
  .filter(key => 
    /^[A-Z]/.test(key) && 
    !key.endsWith('Icon') && 
    key !== 'Lucide' && 
    key !== 'Icon' && 
    key !== 'createLucideIcon' &&
    ((typeof (LucideIcons as any)[key] === 'object' && (LucideIcons as any)[key] !== null) || typeof (LucideIcons as any)[key] === 'function')
  )
  .sort();

// Provide direct access or proxy fallback
export const AVAILABLE_ICONS: Record<string, any> = new Proxy(LucideIcons as any, {
  get(target, prop: string) {
    if (prop in target && target[prop]) return target[prop];
    return target.Target || Target || Activity;
  }
});

// Respective icon definitions for skills by ID and short forms
export const SKILL_ID_ICON_MAP: Record<string, string> = {
  // Fitness
  'f_b': 'Sailboat',       // Boat Club
  'f_c': 'Bike',           // Cycle
  'f_e': 'BicepsFlexed',   // Exercise
  'f_s': 'Trophy',         // Shuttle
  'f_k': 'Footprints',     // Kulai Cheruvu walking track
  'f_g': 'Mountain',       // Gandhi Park walking track
  'f_gym': 'Dumbbell',     // Gym
  'f_crix': 'Target',      // Cricket
  'f_pickb': 'Trophy',     // Pickleball
  'f_trek': 'Mountain',    // Trekking
  'f_rain': 'CloudRain',   // Rain

  // Diet
  'd_ph': 'Zap',           // Powerhouse
  'd_4am': 'Sunrise',      // 4 AM Wakeup
  'd_ca': 'Carrot',        // Carrot
  'd_or': 'Citrus',        // Orange
  'd_apl': 'Apple',        // Apple
  'd_gu': 'Leaf',          // Guava
  'd_ban': 'Banana',       // Banana
  'd_pomo': 'Cherry',      // Pomegranate
  'd_am': 'Sparkles',      // Amla
  'd_kp': 'Flame',         // Curry leaves / 10KP
  'd_mop': 'CheckCircle2', // Mop
  'd_hvin': 'Droplet',     // Havintha shampoo
  'd_spf': 'Sun',          // SpF Natural face pack
  'd_mm': 'Brush',         // Multani mitti
  'd_lt': 'CupSoda',       // Lemon tea
  'd_drg': 'Apple',        // Dragon fruit
  'd_eggs': 'Egg',         // Eggs
  'd_fish': 'Fish',        // Fish

  // Black / Discipline
  'b_cd': 'Salad',         // Clean Diet
  'b_nsr': 'Ban',          // No Sugar
  'b_npr': 'Shield',       // NPR (Personal)
  'b_hd': 'Home',          // Home Diet
};

// Respective icon definitions by exact short form
export const SHORTFORM_ICON_MAP: Record<string, string> = {
  // Diet
  'ph': 'Zap',
  'ca': 'Carrot',
  'or': 'Citrus',
  'apl': 'Apple',
  'ap': 'Apple',
  'gu': 'Leaf',
  'ban': 'Banana',
  'ba': 'Banana',
  'am': 'Sparkles',
  'kp': 'Flame',
  'hvin': 'Droplet',
  'hv': 'Droplet',
  'pomo': 'Cherry',
  'po': 'Cherry',
  'spf': 'Sun',
  'sf': 'Sun',
  'mm': 'Brush',
  'lt': 'CupSoda',
  'drg': 'Apple',
  'mop': 'CheckCircle2',
  'mp': 'CheckCircle2',
  'eggs': 'Egg',
  'fish': 'Fish',
  '4a': 'Sunrise',
  '4am': 'Sunrise',

  // Fitness
  'b': 'Sailboat',
  'bt': 'Sailboat',
  'c': 'Bike',
  'cy': 'Bike',
  'e': 'BicepsFlexed',
  'ex': 'BicepsFlexed',
  's': 'Trophy',
  'sh': 'Trophy',
  'k': 'Footprints',
  'ku': 'Footprints',
  'g': 'Mountain',
  'gym': 'Dumbbell',
  'gy': 'Dumbbell',
  'crix': 'Target',
  'crick': 'Target',
  'pickb': 'Trophy',
  'trek': 'Mountain',
  'rain': 'CloudRain',

  // Black / Discipline
  'nsr': 'Ban',
  'cd': 'Salad',
  'npr': 'Shield',
  'hd': 'Home'
};

// 11 Core Categories for the Complete 184 System Icons Collection
export interface IconCategoryDef {
  name: string;
  count: number;
  iconNames: string[];
}

export const SYSTEM_ICON_CATEGORIES: IconCategoryDef[] = [
  {
    name: 'Habits & Daily',
    count: 25,
    iconNames: [
      'AlarmClock', 'Bed', 'Coffee', 'Utensils', 'Pill',
      'Sunrise', 'Sunset', 'Bath', 'Sparkles', 'Moon',
      'Sun', 'Flame', 'Droplet', 'Heart', 'Smile',
      'CheckCircle2', 'Apple', 'Carrot', 'Salad', 'CupSoda',
      'GlassWater', 'Brush', 'Shirt', 'DoorOpen', 'Home'
    ]
  },
  {
    name: 'Fitness & Body',
    count: 22,
    iconNames: [
      'Dumbbell', 'Bike', 'Footprints', 'BicepsFlexed', 'Activity',
      'Trophy', 'Timer', 'HeartPulse', 'Scale', 'Swords',
      'Target', 'Crosshair', 'Gauge', 'Award', 'Medal',
      'Zap', 'Mountain', 'Sailboat', 'Waves', 'Compass',
      'TrendingUp', 'ZapOff'
    ]
  },
  {
    name: 'Mind & Wellness',
    count: 18,
    iconNames: [
      'Brain', 'Shield', 'ShieldCheck', 'Eye', 'SmilePlus',
      'Sparkle', 'Flower2', 'TreePine', 'Wind', 'CloudRain',
      'Feather', 'Leaf', 'Lock', 'Unlock', 'Key',
      'HeartHandshake', 'FlameKindling', 'Smile'
    ]
  },
  {
    name: 'Productivity',
    count: 20,
    iconNames: [
      'CheckSquare', 'ListTodo', 'Calendar', 'Clock', 'Hourglass',
      'Briefcase', 'Laptop', 'Terminal', 'FileText', 'Folder',
      'Rocket', 'Cpu', 'Database', 'Search', 'PenTool',
      'Inbox', 'Archive', 'Paperclip', 'Kanban', 'LayoutList'
    ]
  },
  {
    name: 'Learning',
    count: 16,
    iconNames: [
      'BookOpen', 'Book', 'GraduationCap', 'Library', 'Bookmark',
      'Languages', 'Binary', 'Code', 'GitBranch', 'Microscope',
      'Atom', 'Lightbulb', 'FileCode', 'Glasses', 'Newspaper',
      'Scroll'
    ]
  },
  {
    name: 'Creativity',
    count: 14,
    iconNames: [
      'Palette', 'PaintBucket', 'Music', 'Headphones', 'Mic',
      'Camera', 'Video', 'Film', 'Wand2', 'Scissors',
      'Layers', 'Spline', 'Shapes', 'Brush'
    ]
  },
  {
    name: 'Social',
    count: 12,
    iconNames: [
      'Users', 'UserPlus', 'MessageSquare', 'MessageCircle', 'Phone',
      'Mail', 'Share2', 'PartyPopper', 'Gift', 'Send',
      'Megaphone', 'Smile'
    ]
  },
  {
    name: 'Lifestyle',
    count: 15,
    iconNames: [
      'Plane', 'Car', 'Bus', 'Train', 'MapPin',
      'Luggage', 'Trees', 'Tent', 'ShoppingBag', 'CreditCard',
      'Wallet', 'Coins', 'Store', 'Ship', 'Compass'
    ]
  },
  {
    name: 'Interface & System',
    count: 24,
    iconNames: [
      'Settings', 'Sliders', 'SlidersHorizontal', 'Filter', 'Wrench',
      'Power', 'Maximize2', 'Minimize2', 'Plus', 'Minus',
      'X', 'Check', 'ChevronRight', 'ChevronLeft', 'ChevronDown',
      'ChevronUp', 'RefreshCw', 'RotateCcw', 'Download', 'Upload',
      'Trash2', 'Edit3', 'EyeOff', 'Volume2'
    ]
  },
  {
    name: 'Status & Emotes',
    count: 18,
    iconNames: [
      'Meh', 'Frown', 'ThumbsUp', 'ThumbsDown', 'Star',
      'BadgeAlert', 'BadgeCheck', 'CheckCircle', 'AlertCircle', 'HelpCircle',
      'Info', 'Bell', 'BellOff', 'Crown', 'Flame',
      'Zap', 'Sparkles', 'Heart'
    ]
  }
];

// All 184 system icon names flattened
export const SYSTEM_184_ICON_NAMES = Array.from(
  new Set(SYSTEM_ICON_CATEGORIES.flatMap(c => c.iconNames))
);

export interface SystemTone {
  id: string;
  name: string;
  hex: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  ringClass: string;
}

export const SYSTEM_TONES: SystemTone[] = [
  { id: 'emerald', name: 'Emerald', hex: '#10b981', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/20', borderClass: 'border-emerald-500/40', ringClass: 'ring-emerald-400' },
  { id: 'violet', name: 'Violet', hex: '#8b5cf6', textClass: 'text-violet-400', bgClass: 'bg-violet-500/20', borderClass: 'border-violet-500/40', ringClass: 'ring-violet-400' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', textClass: 'text-rose-400', bgClass: 'bg-rose-500/20', borderClass: 'border-rose-500/40', ringClass: 'ring-rose-400' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', textClass: 'text-amber-400', bgClass: 'bg-amber-500/20', borderClass: 'border-amber-500/40', ringClass: 'ring-amber-400' },
  { id: 'sky', name: 'Sky', hex: '#0ea5e9', textClass: 'text-sky-400', bgClass: 'bg-sky-500/20', borderClass: 'border-sky-500/40', ringClass: 'ring-sky-400' },
  { id: 'neutral', name: 'Neutral', hex: '#71717a', textClass: 'text-zinc-300', bgClass: 'bg-zinc-700/30', borderClass: 'border-zinc-500/40', ringClass: 'ring-zinc-400' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', textClass: 'text-indigo-400', bgClass: 'bg-indigo-500/20', borderClass: 'border-indigo-500/40', ringClass: 'ring-indigo-400' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#d946ef', textClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-500/20', borderClass: 'border-fuchsia-500/40', ringClass: 'ring-fuchsia-400' },
  { id: 'coral', name: 'Coral', hex: '#f97316', textClass: 'text-orange-400', bgClass: 'bg-orange-500/20', borderClass: 'border-orange-500/40', ringClass: 'ring-orange-400' },
  { id: 'lime', name: 'Lime', hex: '#84cc16', textClass: 'text-lime-400', bgClass: 'bg-lime-500/20', borderClass: 'border-lime-500/40', ringClass: 'ring-lime-400' },
  { id: 'slate', name: 'Slate', hex: '#64748b', textClass: 'text-slate-400', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-500/40', ringClass: 'ring-slate-400' }
];

// Backwards-compatible ICON_CATEGORIES for legacy references
export const ICON_CATEGORIES: { name: string; query: string; iconNames?: string[] }[] = [
  { name: 'All (184)', query: '', iconNames: SYSTEM_184_ICON_NAMES },
  ...SYSTEM_ICON_CATEGORIES.map(c => ({
    name: `${c.name} (${c.count})`,
    query: c.name.toLowerCase(),
    iconNames: c.iconNames
  }))
];

/**
 * Returns the exact respective Lucide icon name for any skill based on:
 * 1. Explicit user custom icon (if set and valid in Lucide)
 * 2. Explicit skill ID matching
 * 3. Short form lookup
 * 4. Semantic name / category keywords
 */
export function getRespectiveIconName(skill?: { id?: string; name?: string; shortForm?: string; icon?: string }): string {
  if (!skill) return 'Target';

  // 1. If user set an explicit custom icon that exists in Lucide, use it
  if (skill.icon && (LucideIcons as any)[skill.icon]) {
    return skill.icon;
  }

  // 2. Direct ID lookup for predefined skills
  if (skill.id && SKILL_ID_ICON_MAP[skill.id]) {
    return SKILL_ID_ICON_MAP[skill.id];
  }

  // 3. Short form lookup
  if (skill.shortForm) {
    const sf = skill.shortForm.toLowerCase().trim();
    if (SHORTFORM_ICON_MAP[sf]) {
      return SHORTFORM_ICON_MAP[sf];
    }
  }

  // 4. Semantic keyword matching by name
  const n = (skill.name || '').toLowerCase().trim();
  if (n.includes('boat') || n.includes('rowing') || n.includes('sailing')) return 'Sailboat';
  if (n.includes('cycle') || n.includes('bike') || n.includes('cycling') || n.includes('ride')) return 'Bike';
  if (n.includes('gym') || n.includes('workout') || n.includes('weight') || n.includes('lift')) return 'Dumbbell';
  if (n.includes('exercise') || n.includes('pushup') || n.includes('pullup') || n.includes('bicep') || n.includes('arm')) return 'BicepsFlexed';
  if (n.includes('shuttle') || n.includes('badminton') || n.includes('tennis') || n.includes('pickleball')) return 'Trophy';
  if (n.includes('cricket') || n.includes('crix')) return 'Target';
  if (n.includes('kulai') || n.includes('gandhi') || n.includes('step') || n.includes('walk') || n.includes('pace') || n.includes('track')) return 'Footprints';
  if (n.includes('mountain') || n.includes('trek') || n.includes('climb') || n.includes('hike')) return 'Mountain';
  if (n.includes('rain') || n.includes('storm')) return 'CloudRain';
  if (n.includes('powerhouse') || n.includes('power') || n.includes('energy') || n.includes('zap')) return 'Zap';
  if (n.includes('4 am') || n.includes('4am') || n.includes('wake') || n.includes('morning') || n.includes('early') || n.includes('sunrise')) return 'Sunrise';
  if (n.includes('carrot')) return 'Carrot';
  if (n.includes('orange') || n.includes('citrus') || n.includes('lemon')) return 'Citrus';
  if (n.includes('apple')) return 'Apple';
  if (n.includes('banana')) return 'Banana';
  if (n.includes('pomegranate') || n.includes('berry') || n.includes('cherry')) return 'Cherry';
  if (n.includes('grape')) return 'Grape';
  if (n.includes('guava') || n.includes('leaf') || n.includes('curry')) return 'Leaf';
  if (n.includes('amla') || n.includes('sparkle') || n.includes('shine')) return 'Sparkles';
  if (n.includes('10kp') || n.includes('kp')) return 'Flame';
  if (n.includes('mop') || n.includes('sweep') || n.includes('tidy')) return 'CheckCircle2';
  if (n.includes('hvin') || n.includes('shampoo') || n.includes('hair') || n.includes('water') || n.includes('hydrate') || n.includes('drink')) return 'Droplet';
  if (n.includes('spf') || n.includes('face pack') || n.includes('sun')) return 'Sun';
  if (n.includes('multani') || n.includes('mitti') || n.includes('brush') || n.includes('mud')) return 'Brush';
  if (n.includes('lemon tea') || n.includes('tea') || n.includes('coffee') || n.includes('lt')) return 'CupSoda';
  if (n.includes('dragon') || n.includes('dragon fruit')) return 'Apple';
  if (n.includes('egg')) return 'Egg';
  if (n.includes('fish')) return 'Fish';
  if (n.includes('clean diet') || n.includes('salad') || n.includes('diet') || n.includes('meal') || n.includes('food')) return 'Salad';
  if (n.includes('no sugar') || n.includes('sugar') || n.includes('fasting') || n.includes('no sweet') || n.includes('ban')) return 'Ban';
  if (n.includes('npr') || n.includes('personal') || n.includes('nofap') || n.includes('discipline') || n.includes('protect')) return 'Shield';
  if (n.includes('home diet') || n.includes('home') || n.includes('hd')) return 'Home';
  if (n.includes('sleep') || n.includes('bed') || n.includes('rest') || n.includes('night')) return 'Moon';
  if (n.includes('book') || n.includes('read') || n.includes('study')) return 'BookOpen';
  if (n.includes('code') || n.includes('program') || n.includes('dev') || n.includes('terminal')) return 'Code';
  if (n.includes('music') || n.includes('podcast') || n.includes('audio') || n.includes('song')) return 'Headphones';
  if (n.includes('meditat') || n.includes('mind') || n.includes('brain') || n.includes('focus')) return 'Brain';

  return 'Target';
}

/**
 * Returns the React component for the skill's respective icon
 */
export function getSkillIcon(skill?: { id?: string; name?: string; icon?: string }) {
  const iconName = getRespectiveIconName(skill);
  return (LucideIcons as any)[iconName] || AVAILABLE_ICONS[iconName] || Target;
}

