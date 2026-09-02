export type TrackingMode = 'counter' | 'checkbox';

export interface Skill {
  id: string;
  name: string;
  shortForm: string;
  mode: TrackingMode;
  category: string;
  createdAt: number;
}

export interface SkillLog {
  skillId: string;
  date: string; // YYYY-MM-DD
  count: number;
  checked: boolean;
}
