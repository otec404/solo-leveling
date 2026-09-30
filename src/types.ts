export type TrackingMode = 'counter' | 'checkbox' | 'timer' | 'measurement';

export interface TimerLap {
  lapNumber: number;
  duration: number; // milliseconds
  formatted: string; // MM:SS:ms or HH:MM:SS
  timestamp: number;
  note?: string; // Optional label/note for the lap
}

export interface Skill {
  id: string;
  name: string;
  shortForm: string;
  mode: TrackingMode;
  category: string;
  icon?: string;
  iconColor?: string;
  iconStroke?: number;
  unit?: string;
  description?: string;
  fillColor?: string;
  borderColor?: string;
  createdAt: number;
}

export interface SkillLog {
  skillId: string;
  date: string; // YYYY-MM-DD
  count: number;
  checked: boolean;
  value?: number;
  notes?: string;
  timestamp?: number;
  timerDuration?: number;
  timerLaps?: TimerLap[];
}

export interface BlankNote {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  category?: string;
  timestamp: number;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  category: string;
  createdAt: number;
}

export interface MetricLog {
  metricId: string;
  date: string; // YYYY-MM-DD
  value: number;
  notes?: string;
}

export type AvatarPreset = 'wolf' | 'man' | 'hunter' | 'fox' | 'raven' | 'custom';

export interface UserProfile {
  displayName: string;
  userId: string;
  avatarPreset: AvatarPreset;
  customAvatarUrl?: string;
  theme: string;
  streakFreezesMax: number;
}
