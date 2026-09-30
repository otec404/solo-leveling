import { Skill } from '../types';

/**
 * Curated high-aesthetic images tailored specifically for tactical habit tracking.
 * Uses high-performance CDN URLs with dark/moody photography and crisp lighting.
 */
export const SKILL_PRESET_IMAGES: Record<string, string> = {
  // Fitness
  'f_b': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', // Boat Club / Rowing at dawn
  'f_c': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80', // Cycling road bike
  'f_e': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', // Calisthenics & Exercise
  'f_s': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80', // Badminton / Shuttle court
  'f_k': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', // Kulai / Mountain alpine trek
  'f_g': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80', // Modern Gym & Dumbbells
  
  // Diet & Nutrition
  'd_ph': 'https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=600&q=80', // Powerhouse nutrition
  'd_4am': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80', // 4 AM Sunrise horizon
  'd_ca': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80', // Fresh vibrant Carrots
  'd_or': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80', // Sliced fresh Orange
  'd_apl': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', // Crisp Red Apple
  'd_gu': 'https://images.unsplash.com/photo-1536511135898-7578848d56b4?auto=format&fit=crop&w=600&q=80', // Fresh tropical Guava
  'd_ban': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', // Fresh organic Banana
  'd_pomo': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // Ruby Pomegranate seeds
  'd_am': 'https://images.unsplash.com/photo-1615485290176-a070104764b8?auto=format&fit=crop&w=600&q=80', // Fresh Amla / Superfoods
  'd_kp': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80', // 10KP / Steps Running Trail
  'd_mop': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', // Pristine Zen Clean
  'd_hvin': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80', // Crystal Clear Hydration Water
  'd_spf': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', // Golden Sun exposure
  'd_lt': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', // Green Tea / Matcha
  
  // Black Protocol
  'b_cd': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', // Clean Diet Bowl
  'b_nsr': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // Zero Sugar / Pure Focus
  'b_npr': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80', // NPR Tactical Protocol
  'b_hd': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', // High Discipline Fire & Focus
};

/**
 * Keyword-based smart fallback for custom habits added by user
 */
export function getSkillImage(skill: Skill): string {
  // If explicitly assigned in preset ID map
  if (skill.id && SKILL_PRESET_IMAGES[skill.id]) {
    return SKILL_PRESET_IMAGES[skill.id];
  }

  const name = (skill.name || '').toLowerCase();
  const cat = (skill.category || '').toLowerCase();

  // Smart Keyword Search
  if (name.includes('boat') || name.includes('row') || name.includes('kayak') || name.includes('sail')) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('cycle') || name.includes('bike') || name.includes('ride') || name.includes('spin')) {
    return 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('gym') || name.includes('lift') || name.includes('dumbbell') || name.includes('barbell') || name.includes('weight')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('run') || name.includes('step') || name.includes('walk') || name.includes('jog') || name.includes('10k')) {
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('shuttle') || name.includes('badminton') || name.includes('tennis') || name.includes('squash')) {
    return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('mountain') || name.includes('hike') || name.includes('trek') || name.includes('climb') || name.includes('kulai')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('exercise') || name.includes('pushup') || name.includes('pullup') || name.includes('workout') || name.includes('abs')) {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('wake') || name.includes('morning') || name.includes('4am') || name.includes('5am') || name.includes('sunrise')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('water') || name.includes('hydrat') || name.includes('drink') || name.includes('hvin')) {
    return 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('carrot')) {
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('orange') || name.includes('citrus') || name.includes('lemon')) {
    return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('apple')) {
    return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('guava')) {
    return 'https://images.unsplash.com/photo-1536511135898-7578848d56b4?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('banana')) {
    return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('pomegranate') || name.includes('berry')) {
    return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('diet') || name.includes('salad') || name.includes('food') || name.includes('meal') || name.includes('eat')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('sugar') || name.includes('fast') || name.includes('npr') || name.includes('protocol')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('read') || name.includes('book') || name.includes('study') || name.includes('learn')) {
    return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('code') || name.includes('dev') || name.includes('program') || name.includes('tech') || name.includes('build')) {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('meditat') || name.includes('mind') || name.includes('breathe') || name.includes('zen') || name.includes('peace')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('sleep') || name.includes('bed') || name.includes('rest') || name.includes('night')) {
    return 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('sun') || name.includes('light') || name.includes('spf')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('tea') || name.includes('coffee') || name.includes('espresso') || name.includes('matcha')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('clean') || name.includes('mop') || name.includes('organize')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80';
  }
  if (skill.mode === 'timer') {
    return 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80';
  }

  // Category based defaults
  if (cat.includes('fitness') || cat.includes('gym')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('diet') || cat.includes('nutri') || cat.includes('food')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80';
  }
  
  // Tactical default
  return 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80';
}
