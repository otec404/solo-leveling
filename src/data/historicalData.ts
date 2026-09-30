import { Skill, SkillLog } from '../types';

export const initialSkills: Skill[] = [
  {
    "id": "f_b",
    "name": "Boat Club",
    "shortForm": "Bt",
    "mode": "counter",
    "category": "Fitness",
    "icon": "Sailboat",
    "createdAt": 1789355297401
  },
  {
    "id": "f_c",
    "name": "Cycle",
    "shortForm": "Cy",
    "mode": "counter",
    "category": "Fitness",
    "icon": "Bike",
    "createdAt": 1789355297401
  },
  {
    "id": "f_e",
    "name": "Exercise",
    "shortForm": "Ex",
    "mode": "counter",
    "category": "Fitness",
    "icon": "BicepsFlexed",
    "createdAt": 1789355297401
  },
  {
    "id": "f_s",
    "name": "Shuttle",
    "shortForm": "Sh",
    "mode": "counter",
    "category": "Fitness",
    "icon": "Trophy",
    "createdAt": 1789355297401
  },
  {
    "id": "f_k",
    "name": "Kulai",
    "shortForm": "Ku",
    "mode": "counter",
    "category": "Fitness",
    "icon": "Mountain",
    "createdAt": 1789355297401
  },
  {
    "id": "f_g",
    "name": "Gym",
    "shortForm": "Gy",
    "mode": "counter",
    "category": "Fitness",
    "icon": "Dumbbell",
    "createdAt": 1789355297401
  },
  {
    "id": "d_ph",
    "name": "Powerhouse",
    "shortForm": "Ph",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "Zap",
    "createdAt": 1789355297401
  },
  {
    "id": "d_4am",
    "name": "4 AM Wakeup",
    "shortForm": "4a",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "Sunrise",
    "createdAt": 1789355297401
  },
  {
    "id": "d_ca",
    "name": "Carrot",
    "shortForm": "Ca",
    "mode": "counter",
    "category": "Diet",
    "icon": "Carrot",
    "createdAt": 1789355297401
  },
  {
    "id": "d_or",
    "name": "Orange",
    "shortForm": "Or",
    "mode": "counter",
    "category": "Diet",
    "icon": "Citrus",
    "createdAt": 1789355297401
  },
  {
    "id": "d_apl",
    "name": "Apple",
    "shortForm": "Ap",
    "mode": "counter",
    "category": "Diet",
    "icon": "Apple",
    "createdAt": 1789355297401
  },
  {
    "id": "d_gu",
    "name": "Guava",
    "shortForm": "Gu",
    "mode": "counter",
    "category": "Diet",
    "icon": "LeafyGreen",
    "createdAt": 1789355297401
  },
  {
    "id": "d_ban",
    "name": "Banana",
    "shortForm": "Ba",
    "mode": "counter",
    "category": "Diet",
    "icon": "Banana",
    "createdAt": 1789355297401
  },
  {
    "id": "d_pomo",
    "name": "Pomegranate",
    "shortForm": "Po",
    "mode": "counter",
    "category": "Diet",
    "icon": "Cherry",
    "createdAt": 1789355297401
  },
  {
    "id": "d_am",
    "name": "Amla",
    "shortForm": "Am",
    "mode": "counter",
    "category": "Diet",
    "icon": "Sparkles",
    "createdAt": 1789355297401
  },
  {
    "id": "d_kp",
    "name": "10KP",
    "shortForm": "KP",
    "mode": "counter",
    "category": "Diet",
    "icon": "Footprints",
    "createdAt": 1789355297401
  },
  {
    "id": "d_mop",
    "name": "Mop",
    "shortForm": "Mp",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "Brush",
    "createdAt": 1789355297401
  },
  {
    "id": "d_hvin",
    "name": "Hvin",
    "shortForm": "Hv",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "GlassWater",
    "createdAt": 1789355297401
  },
  {
    "id": "d_spf",
    "name": "SpF",
    "shortForm": "Sf",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "Sun",
    "createdAt": 1789355297401
  },
  {
    "id": "d_lt",
    "name": "Lt",
    "shortForm": "Lt",
    "mode": "checkbox",
    "category": "Diet",
    "icon": "CupSoda",
    "createdAt": 1789355297401
  },
  {
    "id": "b_cd",
    "name": "Clean Diet",
    "shortForm": "Cd",
    "mode": "checkbox",
    "category": "Black",
    "icon": "Salad",
    "createdAt": 1789355297401
  },
  {
    "id": "b_nsr",
    "name": "No Sugar",
    "shortForm": "NSR",
    "mode": "checkbox",
    "category": "Black",
    "icon": "Ban",
    "createdAt": 1789355297401
  },
  {
    "id": "b_npr",
    "name": "NPR",
    "shortForm": "NPR",
    "mode": "checkbox",
    "category": "Black",
    "icon": "ShieldCheck",
    "createdAt": 1789355297401
  },
  {
    "id": "b_hd",
    "name": "Hd",
    "shortForm": "Hd",
    "mode": "checkbox",
    "category": "Black",
    "icon": "Flame",
    "createdAt": 1789355297401
  }
];
export const initialLogs: SkillLog[] = [
  {
    "skillId": "f_b",
    "date": "2025-06-05",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-06",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-05-07",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-05-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-05-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-05-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-05-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-05-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-13",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-15",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-17",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-18",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-19",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-19",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-20",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-21",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-22",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-23",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-24",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-06-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-26",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-27",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-27",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-06-28",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2030-06-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2030-06-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-06-30",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-06-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-01",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-07",
    "count": 12,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-08",
    "count": 15,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-09",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-12",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-14",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-15",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-07-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-20",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-24",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-30",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-07-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-02",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-03",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-06",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-07",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-09",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-11",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-12",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-14",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-15",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-17",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-18",
    "count": 15,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-08-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-19",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-19",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-21",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-22",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-23",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-08-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-24",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-08-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-25",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-08-27",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-03",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-06",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-07",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-09",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-10",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-11",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-11",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-12",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-13",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-14",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-14",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-15",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-17",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-18",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-18",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-20",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-09-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-22",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-23",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-24",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-25",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-26",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-27",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-28",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-29",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-09-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-09-30",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-09-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-09-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-03",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-04",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-05",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-07",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-10-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-10",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-17",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-19",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-10-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-22",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-24",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-25",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-10-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-10-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-10-31",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2025-10-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-10-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-11-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-01",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-11-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-09",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-10",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-11-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-12",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-14",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-16",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-17",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-18",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-19",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-20",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-21",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-11-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-23",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-24",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-25",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-26",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-27",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-11-28",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-11-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-11-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-01",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-12-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-12-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-10",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-12-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2025-12-12",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-17",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-18",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2025-12-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-20",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-21",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2025-12-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-26",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-27",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-28",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-12-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-29",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2025-12-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2025-12-31",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-12",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-01-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-16",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-17",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-18",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-19",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-21",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-22",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-23",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-25",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-26",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-29",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-30",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-01-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-01-31",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-01-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-01-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-01",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-01",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-02",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-06",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-07",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-08",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-02-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2026-02-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-02-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2026-02-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-02-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-02-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-19",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-20",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-02-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-24",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-02-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-26",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-02-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-06",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2026-03-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-12",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-13",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-14",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-27",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-30",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-03-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-03-31",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-03-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-03-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-01",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-04-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-09",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-10",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-04-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-13",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-14",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-15",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-16",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-17",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-18",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2026-04-18",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-19",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-20",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-04-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-21",
    "count": 6,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-04-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-27",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-28",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-29",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-04-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-04",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-06",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-07",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-08",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-05-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-14",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-17",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-05-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-18",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-19",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-20",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-21",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-22",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-05-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-05-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-23",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-05-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-05-24",
    "count": 20,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-05-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-03",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-06-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-04",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-06-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-06-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-14",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_k",
    "date": "2026-06-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-15",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-16",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-17",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-18",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-19",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-20",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-21",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-22",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-06-23",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-01",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-02",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-04",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-05",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-07",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-09",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-11",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-14",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-16",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-21",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-24",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-26",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-27",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-07-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_s",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_c",
    "date": "2026-08-01",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "f_e",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-08-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-08-04",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_b",
    "date": "2026-08-14",
    "count": 5,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "f_g",
    "date": "2026-08-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-25",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-26",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-27",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-28",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-11-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-29",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-11-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-11-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-11-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-11-30",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-01",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-02",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-03",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-12-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-05",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2025-12-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2025-12-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-06",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-07",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-08",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-12-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2025-12-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-10",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-11",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-12",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-13",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-12-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-14",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-15",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-16",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-17",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-18",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-19",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-20",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-21",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-22",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-23",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-24",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-25",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-12-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-26",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-27",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-28",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-29",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2025-12-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2025-12-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-30",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2025-12-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2025-12-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2025-12-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2025-12-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2025-12-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2025-12-31",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-01",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-01",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-02",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-01-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-01-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-03",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-05",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-06",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-07",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-08",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-09",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-09",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-01-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-10",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-11",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-11",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-12",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-12",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-01-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-13",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-01-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-14",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-14",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-14",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-15",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-15",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-16",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-17",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-18",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-18",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-19",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-19",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-20",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-21",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-22",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-23",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-24",
    "count": 6,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-01-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-26",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-26",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-27",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-27",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-01-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-28",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-29",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-30",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-01-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-01-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-01-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-01-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-01-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-01-31",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-02-01",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-01",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-01",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-02-02",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-02",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-02-03",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-03",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-02-04",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-02-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-05",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-06",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-02-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-07",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-08",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-09",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-09",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-02-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-10",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-02-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-02-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-02-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-11",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-11",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-02-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-02-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-02-13",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-02-13",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-02-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-02-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-02-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-02-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-02-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-02-28",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-03-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-03-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-01",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-03-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-02",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-03-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-03-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-04",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-05",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-03-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-05",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-03-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-06",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-03-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-06",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-03-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-07",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-03-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-07",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-03-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-03-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-08",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-03-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_4am",
    "date": "2026-03-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-03-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-03-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-03-13",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_am",
    "date": "2026-03-13",
    "count": 4,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-15",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-16",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-17",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-18",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-19",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-19",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-26",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-27",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-04-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-04-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-04-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-04-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-04-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-04-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-04-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-05-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-05-07",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-08",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-08",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-08",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-05-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-09",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-09",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-09",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-10",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-10",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-10",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-11",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-11",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-11",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-12",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-12",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-12",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-05-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-18",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-05-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-05-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-05-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-05-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-05-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-05-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-06-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-06-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-06-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-06-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-06-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-06-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-06-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-06-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-06-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-18",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-19",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-07-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-20",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-20",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-20",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-07-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-21",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-21",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-21",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-07-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-22",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-22",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-22",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-07-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-23",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-23",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-24",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-24",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-24",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-07-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-25",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-25",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-25",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-25",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-07-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-26",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-26",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-27",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-27",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-28",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-28",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-29",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-29",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-29",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-30",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-30",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-07-31",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-07-31",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-07-31",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_mop",
    "date": "2026-08-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-08-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-01",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-01",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_spf",
    "date": "2026-08-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-02",
    "count": 3,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-02",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-08-02",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-02",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_hvin",
    "date": "2026-08-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_lt",
    "date": "2026-08-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-03",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-03",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-08-04",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-04",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-08-05",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-05",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ca",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-08-06",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-06",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_or",
    "date": "2026-08-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_apl",
    "date": "2026-08-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_gu",
    "date": "2026-08-07",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_pomo",
    "date": "2026-08-07",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-07",
    "count": 10,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ph",
    "date": "2026-08-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "d_ban",
    "date": "2026-08-14",
    "count": 2,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-15",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-16",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-17",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "d_kp",
    "date": "2026-08-18",
    "count": 1,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-04-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-04-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-05-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-05-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-06-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-06-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-20",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-21",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-22",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-23",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-24",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-25",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-26",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-27",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-28",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-07-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-07-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-07-30",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-02-01",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-08-02",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-03",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-04",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-08-05",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_hd",
    "date": "2026-08-06",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-07",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-08",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-09",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-10",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2025-08-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2025-08-11",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-12",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-13",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_cd",
    "date": "2026-08-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-14",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-15",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-16",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_nsr",
    "date": "2026-08-17",
    "count": 0,
    "checked": true
  },
  {
    "skillId": "b_npr",
    "date": "2026-08-18",
    "count": 0,
    "checked": true
  }
];