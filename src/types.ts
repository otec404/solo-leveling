export type TrackingMode = 'counter' | 'checkbox';

export interface Skill {
  id: string;
  name: string;
  shortForm: string;
  mode: TrackingMode;
  category: string;
  icon?: string;
  unit?: string;
  createdAt: number;
}

export interface SkillLog {
  skillId: string;
  date: string; // YYYY-MM-DD
  count: number;
  checked: boolean;
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
}
