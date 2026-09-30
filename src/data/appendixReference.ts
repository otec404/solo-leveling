import { Skill, SkillLog, Metric, MetricLog } from '../types';

export interface ShortFormItem {
  shortForm: string;
  name: string;
  category: string;
  mode: 'counter' | 'checkbox';
  unit?: string;
  notes?: string;
  icon?: string;
}

export const APPENDIX_B_SHORT_FORMS: ShortFormItem[] = [
  // Diet
  { shortForm: 'Ph', name: 'Powerhouse', category: 'Diet', mode: 'checkbox', icon: 'Zap', notes: 'Core energy / Powerhouse intake' },
  { shortForm: 'Ca', name: 'Carrot', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Carrot' },
  { shortForm: 'Or', name: 'Orange', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Citrus' },
  { shortForm: 'Apl', name: 'Apple', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Apple' },
  { shortForm: 'Gu', name: 'Guava', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Leaf' },
  { shortForm: 'Ban', name: 'Banana', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Banana' },
  { shortForm: 'Am', name: 'Amla', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Sparkles' },
  { shortForm: 'Kp', name: 'Curry leaves', category: 'Diet', mode: 'counter', unit: 'leaves', icon: 'Flame' },
  { shortForm: 'Hvin', name: 'Havintha shampoo', category: 'Diet', mode: 'checkbox', icon: 'Droplet', notes: 'Haircare routine' },
  { shortForm: 'Pomo', name: 'Pomegranate', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Cherry' },
  { shortForm: 'SpF', name: 'Natural face pack', category: 'Diet', mode: 'checkbox', icon: 'Sun', notes: 'Skincare pack' },
  { shortForm: 'MM', name: 'Multani mitti', category: 'Diet', mode: 'checkbox', icon: 'Brush', notes: 'Face mud pack' },
  { shortForm: 'LT', name: 'Lemon tea', category: 'Diet', mode: 'checkbox', icon: 'CupSoda' },
  { shortForm: 'Drg', name: 'Dragon fruit', category: 'Diet', mode: 'counter', unit: 'pcs', icon: 'Apple' },
  { shortForm: 'Mop', name: 'Mop', category: 'Diet', mode: 'checkbox', icon: 'CheckCircle2' },
  { shortForm: 'Eggs', name: 'Eggs', category: 'Diet', mode: 'counter', unit: 'eggs', icon: 'Egg' },
  { shortForm: 'Fish', name: 'Fish', category: 'Diet', mode: 'checkbox', icon: 'Fish' },
  
  // Fitness
  { shortForm: 'B', name: 'Boat club', category: 'Fitness', mode: 'counter', unit: 'rounds', icon: 'Sailboat', notes: 'Boat club laps / track' },
  { shortForm: 'C', name: 'Cycle', category: 'Fitness', mode: 'counter', unit: 'km', icon: 'Bike', notes: 'Cycling distance' },
  { shortForm: 'E', name: 'Exercise', category: 'Fitness', mode: 'counter', unit: 'hrs', icon: 'BicepsFlexed', notes: 'Workout / resistance training' },
  { shortForm: 'S', name: 'Shuttle', category: 'Fitness', mode: 'counter', unit: 'hrs', icon: 'Trophy', notes: 'Badminton / Shuttle' },
  { shortForm: 'K', name: 'Kulai Cheruvu walking track', category: 'Fitness', mode: 'counter', unit: 'rounds', icon: 'Footprints' },
  { shortForm: 'G', name: 'Gandhi Park walking track', category: 'Fitness', mode: 'counter', unit: 'rounds', icon: 'Mountain' },
  { shortForm: 'GYM', name: 'Gym', category: 'Fitness', mode: 'counter', unit: 'hrs', icon: 'Dumbbell', notes: 'Gym session' },
  { shortForm: 'Crix', name: 'Cricket', category: 'Fitness', mode: 'counter', unit: 'hrs', icon: 'Medal', notes: 'Cricket match / practice' },
  { shortForm: 'PickB', name: 'Pickleball', category: 'Fitness', mode: 'counter', unit: 'hrs', icon: 'Trophy' },
  { shortForm: 'Trekking', name: 'Trekking', category: 'Fitness', mode: 'checkbox', icon: 'Mountain' },

  // Black (Special category)
  { shortForm: 'NSR', name: 'No Sugar', category: 'Black', mode: 'checkbox', icon: 'Ban', notes: 'Zero refined sugar discipline' },
  { shortForm: 'Cd', name: 'Clean Diet', category: 'Black', mode: 'checkbox', icon: 'Salad', notes: 'Strict clean eating' },
  { shortForm: 'NPR', name: 'Personal (black)', category: 'Black', mode: 'checkbox', icon: 'Shield', notes: 'Personal discipline checkpoint' },
  { shortForm: 'Hd', name: 'Home diet', category: 'Black', mode: 'checkbox', icon: 'Home', notes: 'Home-cooked meals only' }
];

export const RAW_APPENDIX_C_TEXT = {
  fitness: `9.1 Fitness — Phase 1 (110 → 96, then 96.5 → ~86, "Solo Levelling")
Phase 1 Begins ((( 110 )))
Legend: Boat club(B), Cycle(C), exercise(E), june, shuttle(S), Holiday(H), Work(W), Kulai(k)

Fitness
5/6/25 b3, c10km, E1hr, S
6/6/25 b3, c10km, E1hr, S
7/5/25 b3, c10km, E1hr, S
8/5/25 b2, c10km, E1/2hr, no Sunday s
9/6/25 REST - - - - - >100.11kg
10/6/25 SKIP
11/6/25 SKIPmax------>102kg
12/6/25 S(1/2hr), B2, E1/2
13/6/25 B2, E1hr, C10km---------->99kg
14/6/25 SKIP
15/6/25  am E2hr, pm B3, S1hr----->98kg
16/6/25 B2, C10km, S1hr, E1hr
17/6/25 B2, C10km, S1hr, E1hr
18/6/25 B2, S1hr
19/6/25 B3, C10km, TREKKING
20/6/25 Rain, E2hr
21/6/25 am-B2
22/6/25 am-B2, pm-B2 C10, E1hr----------———---->97.5kg No S Sunday
23/6/25 C10km, B3, E1hr
24/6/25 am-B3, C10km, E1/2,  pm-B5, C10km, E1hr
25/6/25 S1hr Skipmax
26/6/25 B1, E1hr, C10km
27/6/25 B2, C10km, B2
28/6/25 B1, E2hr SKIPMAX--food
29/6/30 C10km, E1hr
End with 110---->96

COLLEGE 4_1 START-------->Working(W), holiday(H) ((((96.5)))))
30/6/25 W,C10km,B2
1/7/25 H, B2
2/7/25 H, SKIP
3/7/25 H, B2
4/7/25 W, B1, C10km, E2hr
5/7/25 H, B2, C10km, E1hr
6/7/25 Sunday, C10km(((96)))
7/7/25 W(first class) B1, C12km
8/7/25 W,C15km
9/7/25 W, C10km, B1
10/7/25 W, C10km
11/7/25 W,
12/7/25 W, C10km, B2, E1/2hr
13/7/25 H(Sunday) Skip x Rest
14/7/25 H, B1, E1hr, C10km
15/7/25 W, B1, C10km
16/7/25 W, E, C10km, E1/2 hr
17/7/25 W, C10km
18/7/25 H, Birthday 93.80-7am
19/7/25 H, S1hr
20/7/25 SKIPmax+B3
21/7/25 W, C10km
22/7/25 W, C10km,E1hr
23/7/25 W, C10km
24/7/25 W, C10km, B2, E1hr
25/7/25 W,E1hr
26/7/25 W
27/7/25 H, Skip
28/7/25 W, B1, C10km
29/7/25 H, B1, C10km, E1hr
30/7/25 H, B2, C10km, E1hr
31/7/25 H, B1
1/8/25 H, Skip
2/8/25 W, B2, C10km, E1hr
3/8/25 H, B3, C10km, E1hr 93.50kg
4/8/25 W, B2, C10km, E1hr
5/8/25 W, B1, C10km, E1hr
6/8/25 W, B2, C10km, E1hr
7/8/25 H, B2, E1hr, Skipmax
8/8/25 H, B2, E1hr, C10km
9/8/25 W, B1, E1hr, C10km
10/8/25 W, B1, E1hr, C10km
11/8/25 W, B1, E1hr, C10km
12/8/25 H, B2, E1hr, C10km
13/8/25 W, C10km, E1hr, Rain, Skip
14/8/25 H,C10km, E1hr, B1
15/8/25 H, C10km, E1hr
16/8/25 H, C10km,
17/8/25 H, C10km, B2, E1hr
18/8/25 H, C15km, E1hr, S1hr
19/8/25 W,B2,C10km, E1hr, 91kg
20/8/25 W, C10km
21/8/25 W, C10km, B2, E1hr
22/8/25 H, C10km, E1hr, B2
23/8/25 W, B2, C10km, E1hr--- 90.70kg
24/8/25--H,B2,E1hr(New Phase)
25/8/25--H,B3
26/8/25--W, Rest--MID(2)
27/8/25--H, B2
28/8/25--W, Skip
29/8/25--W, Skip
30/8/25--W, Skip
1/9/25----W, Skip(89.90 end of day)
2/9/25----W,B1,C10km, E1hr
3/9/25----W,B3,C10km,E1
4/9/25----W, B2, C10km
5/9/25----W, B2, C10km, E1hr
6/9/25-----H,B3,E1hr
7/9/25---H,B3, E1hr
8/9/25---H,B2
9/9/25---H,B2,E1hr(am)--89.55
10/9/25-H,B2(am), B3, C10km, E1hr
11/9/25--W,B3,C10km
12/9/25--H,B2,C10km,E1hr
13/9/25--H,B2,C10km,E1hr
14/9/25--H,B2,C10km,E1hr
15/9/25--W,B2,C10km,E1hr
16/9/25--W,B2,C10km,E1hr
17/9/25--W,B3
18/9/25--H,B5,C10km,E1hr
19/9/25--B1+B3,Skip
20/9/25--S1hr, B4, C10km
21/9/25--  SkipMax       87.50am
22/9/25--B3,C10km
23/9/25--B3,C10km,E1hr
Winter ARC
24/9/25--B4,C10km,E1hr
25/9/25--B5,C10km,E1hr
26/9/25--B3
27/9/25--B3
28/9/25--B4,C10km,E1hr 87.80pm
29/9/25--S1hr, B4, C10km, E1hr
30/9/25--B3, C10km, E1hr
1/10/25--(((((87.35))))))skip
2/10/25--Skip
3/10/25--S1hr,B5
4/10/25--S1hr,B3
5/10/25--((((85.65))))B5
6/10/25--S1hr
7/10/25--(((87.25 pm)) B3, C10km, E1hr
8/10/25--S2hr,B2,E1hr
9/10/25--Skip
10/10/25--W,S2
11/10/25--Skip
12/10/25--((((((85.75 am)))))))) projectW+Skip
13/10/25--W,S1hr
14/10/25--W,S1hr
15/10/25--W,S1hr
16/10/25--W,S1hr
17/10/25--H,S2hr
18/10/25--H,S1hrji
19/10/25--H,B4(84.15)))
20/10/25--H,Skip
Diwali
21/10/25--W, C10km
22/10/25--W, B2
23/10/25--W, E1hr
24/10/25--W, B2
25/10/25--H, S1hr, B3, C10km, E1hr
25/10/25--H(84.95),S1hr, B3,C10km, E1
26/10/25--H,S1hr,E1hr
27/10/25--H,E1hr
28/10/25--H,E1hr
29/10/25--H,S1hr,E1hr
30/10/25--W, S1hr, E1hr
31/10/25--H, B2, C10km, E1hr
1/11/25--H,S2hr,E1hr
2/11/25--H,((((85.40)) S k i p,<MId exam
3/11/25--W,Skip
4/11/25--W,Skip(((82.35)))
5/11/25--W,B2
6/11/25--W,Skip
7/11/25--W,Skip
8/11/25--W,Skip
9/11/25--H,(((((83.65))))), B2
10/11/25--W,B5>mid end
11/11/25--H,Skip
12/11/25--H,B5
13/11/25--Skip(long ride,rplm)
14/11/25--B3
15/11/25--Skip
16/11/25--B3
17/11/25--S2hr
18/11/25--B5
19/11/25--S2hr
20/11/25--B3
21/11/25--S2hr
22/11/25--S1hr
23/11/25--(((81.50))B3
24/11/25--B5
25/11/25--B3
26/11/25--B4
27/11/25--B2
28/11/25--B2
29/11/25--((82.05)))E1hr
30/11/25--E1hr
1/12/25----S2hr
2/12/25---Skip
3/12/25---S2hr
4/12/25---S2hr
5/12/25---S2hr
6/12/25---S1hr
7/12/25---S1hr, E1hr(82.35))
8/12/25---S2hr,
9/12/25---Skip
10/12/25-S2hr, E1hr
11/12/25-2hr, E1hr
12/12/25-S1hr, K5
13/12/25-S1hr
14/12/25-(81.75))))))))))skip
15/12/25-S2hr
16/12/25-S2hr
17/12/25-B5hr
18/12/25-S2hr
19/12/25-S1hr,K1
20/12/25-B5+Skip
21/12/25-(((80.70)))-B4
22/12/25-B1
23/12/25-S1hr
24/12/25-S1hr
25/12/25-S1hr
26/12/25-B3
27/12/25-B4
28/12/25-(((((81.30)))))+B2, E1hr
29/12/25-B3, E1hr
30/12/25-Skip
31/12/25-B3
END Phase 1

Phase 2 — On to the next Target -((( 81))) at the start of New Year — 2026
1/1/26-  \\v/, E1hr
2/1/26- E1hr, S1hr
3/1/26- E1hr, S1hr
4/1/26- E1hr, B4, (( 80.25))
5/1/26- E1hr, S1hr
6/1/26- S1hr, Mared
7/1/26- B1
8/1/26- E1hr
9/1/26- E1hr
10/1/26- S1_1/2hr
11/1/26- S1_1/2hr(( 81.60))
12/1/26- B4
13/1/26- S1hr
14/1/26- S1hr
15/1/26- B1
16/1/26- B3
17/1/26- B2
18/1/26- B3((80.85))
19/1/26- B2
20/1/26- B1
21/1/26- B3
22/1/26- B2
23/1/26- B2
24/1/26- (( 79.25 ))
25/1/26-B2
26/1/26-B2
27/1/26-B1
28/1/26-B1 + Skip
29/1/26-B3
30/1/26- B5, C10km, E1hr
31/1/26- B2, C10km, E1hr
1/2/26--- B5, C10km, E1hr
2/2/26--- B3, C10km, E1hr((78.55)))
3/2/26--- B2, C10km, E1hr
4/2/26--- B2, C10km, E1hr
5/2/26--- B2, C10km, E1hr
6/2/26--- B2, C10km, E1hr
7/2/26--- B3, C10km, E1hr
8/2/26--- B3, C10km, E1hr((( 78.80.))
9/2/26--- B1
10/2/26- B1
11/2/26- Skip M a x Food Parties
12/2/26- K1, B2, S2hr
13/2/26- K1, S1hr
14/2/26- B1
15/2/26- 80.35 S2hr
16/2/26- B2,  S1 ( ( 7 9.))
17/2/26- B1
18/2/26- B1
19/2/26- B2
20/2/26- B2, C10km
21/2/26- B1
22/2/26- B1
23/2/26- B1f( 79.30.)
24/2/26- B2 (am), B5 (pm), E1hr
25/2/26- B1 (am)
26/2/26- B3
27/2/26- B1
28/2/26- B1
1/3/26--- B1 x ((79))
2/3/26--- B1
3/3/26--- B1
4/3/26--- B4
5/3/26--- B1
6/3/26--- B4
7/3/26--- K1
8/3/26--- B2 - (((78.20))
9/3/26--- B1
10/3/26- B1
11/3/26- B1
12/3/26- B3
13/3/26- B3
14/3/26- B2
Cut to 16/3/26
Good bye Dad

Back to:
27/3/26 - B2 (am) <<<77. 20>>>
30/3/26 - B3, E1hr (am), B3 ( pm)
31/3/26 - B5, E1hr (am), S1hr
1/4/26.  - B5 (pm)
2/4/26 -   E1hr (am)
Glitch
9/4/26 - B2
10/4/26-B2
Glitch
12/4/26 - E1hr, B2
13/4/26 - B3
14/4/26 - B5, S1hr
15/4/26 - B5, S1hr
16/4/26 - B5, S1hr
17/4/26 - B5, S1hr
18/4/26 - B2, S1hr, G3, K3
19/4/26 - (( 76.80 )) B3
20/4/26 - B3, S1hr
21/4/26 - B6
22/4/26 - B1
23/4/26 - E1
24/4/26 - B1
25/4/26 - B1
26/4/26 - B1 (((76.35))) B5
27/4/26 - B5
28/4/26 - B5
29/4/26 - B5
30/4/26 - B1
31/4/26 - B1
1/5/26 - - B1
2/5/26 - - B1
3/5/26 - - B2
4/5/26 - - B3
5/5/26 - - B2
6/5/26 - - B2
7/5/26 - - B5
8/5/26 - - B5
9/5/26 - - B1, S1hr
10/5/26 - Crix1(75. 50)
11/5/26 - Crix1
12/5/26 - Crix1, B2
13/5/26 - Crix 2hr
14/5/26 - Crix 2hr, B5
15/5/26 - B2
16/5/26 - B2
17/5/26 - Crix 2hr, B5, C10km
18/5/26 - Crix 2hr, B3,
19/5/26 - B3
20/5/26 - B3
21/5/26 - B3
22/5/26 - B3, c10km, E1hr
23/5/26 - B3, E1hr
24/5/26 - C20km (beach) ((((( 75.90)))))
25/5/26 - B1
26/5/26 - B1
27/5/26 - B1
28/5/26 - B1
29/5/26 - B1
30/5/26 - B1
31/5/26 - B1
1/6/26 - - B1
2/6/26 - - B1
3/6/26 - - B5, E1hr
4/6/26 - - B5, E1hr, C10km
5/6/26 - - B1
6/6/26 - - B1
7/6/26 - - B1
8/6/26 - - B1
9/6/26 - - B1
10/6/26 - B1
11/6/26 - B1
12/6/26 - B2 (( 78.45.))
13/6/26 - B1
14/6/26 - B5, K1
15/6/26 - B2
16/6/26 - B3
17/6/26 - B3
18/6/26 - B2
19/6/26 - B2
20/6/26 - B2
21/6/26 - B2 ((77.05))
22/6/26 - B2
23/6/26 - B5
Skip
1/7/26 - B5
2/7/26 - B3
3/7/26 - B2, E1hr
4/7/26 - B3, E1hr
5/7/26 - B3, E1hr
6/7/26 - S1hr
7/7/26 - B5, S1hr
8/7/26 - B2
9/7/26 - B3, S1hr
10/7/26 - B1
11/7/26 - B2, S1hr
12/7/26 - B2
13/7/26 - C10km, B1, S1hr, E1hr
14/7/26 - C10km, B1, S1hr
15/7/26 - Skip
16/7/26 - B2
17/7/26 - B1
18/7/26 - B1(( 78.85))
19/7/26 - B1
20/7/26 - S1hr
21/7/26 - B3, C10km, S1hr, E1hr
22/7/26 - B1, C10km, S1hr, E1hr
23/7/26 - B1, C10km, E1hr
24/7/26 - B3, C10km, E1hr
25/7/26 - B1, C10km, E1hr
26/7/26 - B1, C10km, E1hr, S1hr
27/7/2026 - E1hr, B1, C10km
28/7/2026 - E1hr, B1, C10km, S1hr
29/7/2026 - E1hr, B1, C10km, PickB2hr
30/7/2026 - E1hr, B1, C10km
31/7/2026 - E1hr, B1, C10km, S1hr
1/8/2026 - - E1hr, B1, C10km
2/8/2026 - - B1
3/8/2026 - - B1
4/8/2026 - - B3
5/8/2026 - - GYM 1hr
6/8/2026 - - GYM 1hr
7/8/2026 - - - -GYM 1hr
8/8/2026 - - - -GYM 1hr
9/8/2026 - - - -GYM 1hr
10/8/2026 - - - -GYM 1hr
11/8/2026 - - - -GYM 1hr
12/8/2026 - - - - GYM 1hr
13/8/2026 - - - - - GYM 1hr
14/8/2026 - - - - - GYM 1hr, B5
15/8/2026 - - - - -GYM 1hr
16/8/2026 - - - - - GYM 1hr
17/8/2026 - - - - - GYM 1hr
18/8/2026 - - - - - -GYM 1hr`,

  diet: `9.2 Diet — "Project K"
2025
14/11/25--Al,Sp,Ca,Am
23/11/25--Powerhouse
24/11/25--Ph
25/11/25--Ph, 4am, 1ca
26/11/25--Ph, 4am, 1ca
27/11/25--Ph, 4am, 1ca
28/11/25--Ph, 4am, 1ca
29/11/25--Ph, 4am, 1ca, Hvin
30/11/25--Ph, 4am, 1ca
1/12/25----Ph, 4am, 1ca
2/12/25----Ph, 4am, 1ca
3/12/25----Ph, 4am, 1ca
4/12/25----Ph, 4am, 1ca
5/12/25----Ph, 4am, 1ca, Hvin
6/12/25----Ph, 4am, 1ca, 1or, 1apl, 1cus
7/12/25----Ph, 4am, 1ca
8/12/25----Ph, 4am, 1ca
9/12/25----Ph
10/12/25--Ph, 4am, 1ca, 1or, 1cus, Hvin
11/12/25--Ph, 4am, 1ca
12/12/25--Ph, 4am, 1ca
13/12/25--Ph, 4am, 1ca
14/12/25--Ph, 4am, 1ca, Hvin
15/12/25--Ph, 4am, 1ca
16/12/25--Ph, 4am, 1ca
17/12/25--Ph, 4am, 1ca, MM
18/12/25--Ph, 4am, 1ca
19/12/25--Ph, 4am, 1ca, SpRw
20/12/25--Ph, 4am, 1ca
21/12/25--Ph, 4am, 1ca
22/12/25-Ph, 4am, 1ca, Sp+RW
23/12/25-Ph, 4am, 1ca, MM+RW
24/12/25-Ph, 4am, 1ca
25/12/25-Ph, 4am, 1ca
26/12/25-Ph, 4am, 1ca, Hvin
27/12/25-Ph, 4am, 1ca
28/12/25-Ph, 4am, 1ca, MM+RW
29/12/25-Ph, 4am, 1ca
30/12/25-Ph, 4am, 1ca, 10kp, Hvin
31/12/25-Ph, 4am, 1ca, 10kp, Mop

2026 — Let's go
1/1/26 - Ph, 4am, 1ca, 10kp, Mop
2/1/26 - Ph, 4am, 1ca, 10kp, Mop
3/1/26 - Ph, 4am, 1ca, 10kp, Mop, Hvin, Pomo
4/1/26 - Ph, 4am, 1ca, 10kp, Mop
5/1/26 - Ph, 4am, 1ca, 10kp, Mop
6/1/26 - Ph, 4am, 1ca, 10kp, Mop
7/1/26 - Ph, 4am, 1ca, 10kp, Mop
8/1/26 - Ph, 4am, 1ca, 10kp, Mop
9/1/26 - Ph, 4am, 1ca, 10kp, Mop
10/1/26-Ph, 4am, 1ca, 10kp, Mop+Hvin
11/1/26-Ph, 4am, 1ca, 10kp, Mop
12/1/26-Ph, 4am, 1ca, 10kp, Mop
13/1/26-Ph, 4am, 1ca, 10kp, Mop, SpF
14/1/26-Ph, 4am, 1ca, 10kp, Mop, Hvin
15/1/26-Ph, 4am, 1ca, 10kp, Mop
16/1/26-Ph, 4am, 1ca, 10kp, Mop
17/1/26-Ph, 4am, 1ca, 10kp, Mop
18/1/26-Ph, 4am, 1ca, 10kp, Mop
19/1/26-Ph, 4am, 1ca, 10kp, Mop
20/1/26-Ph, 4am, 1ca, 10kp, Mop
21/1/26-Ph, 4am, 1ca, 10kp, Mop
22/1/26-Ph, 4am, 1ca, 10kp, Mop
23/1/26-Ph, 4am, 1ca, 10kp, Mop
24/1/26-Ph, 6am, 1ca, 10kp, Mop
25/1/26- no am la. Sun ARC — Ph, no am, 1ca, 10kp, Mop, Hivn
26/1/26- Ph, 4am, 10kp, Mop, 1ca
27/1/26- Ph, 4am, 10kp, Mop, 1ca
28/1/26- Ph, 4am, 10kp, Mop, 1ca, Hvin
29/1/26- Ph, 4am, 10kp, Mop, 1ca
30/1/26- Ph, 4am, 10kp, Mop, 1ca
31/1/26- Ph, 4am, 10kp, Mop, 1ca
1/2/26  - Ph, 4am, 10kp, Mop, 1ca, Hvin, 1apl, 1org, 2ban
2/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, 2ban
3/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, 2ban
4/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, 2ban
5/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, Hvin
6/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org
7/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, 1ban, 1guv
8/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1apl, 1org, 1guv
9/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1org
10/2/26 - Ph, 4am, 10kp, Mop, 1ca, 1guv
11/2/26 - Ph, 4am, 10kp, 1ca, 1Pomo, 1apl, 1or
12/2/26 - Ph
13/2/26 - Ph, 4am, 1ca, 10kp
14/2/26 - Ph
15/2/26 - Ph
16/2/26 - Ph
17/2/26 - Ph
18/2/26 - Ph
19/2/26 - Ph
20/2/26 - Ph
21/2/26 - Ph, Hvin
22/2/26 - Ph
23/2/26 - Ph, Spf
24/2/26 - Ph, Spf
25/2/26 - Ph
26/2/26 - Ph
27/2/26 - Ph, Hvin
28/2/26 - Ph, 10Gp, 2Gu,
1/3/26 - - Ph, 4am, 1or, 1ca, 1Gu, Hvin
2/3/26 - - Ph,1Gu, 1apl, 4am,1or
3/3/26---- Ph
4/3/26---- Ph, 1Gu, 1apl, 4am, 1or, 1ca, Hvin
5/3/26--- Ph, 1Gu, 1apl, 4am, 1or, 2ca
6/3/26--- Ph, 1Pomo, 1apl, 1or,  2ca, 4am, Spf
7/3/26--- Ph, 1Pomo, 1apl, 1or, 2ca, 4am, Hvin
8/3/26 -  Ph, 1Pomo, 1apl, 1or, 2Ca, 4am
9/3/26 -   Ph
10/3/26-  Ph
11/3/26 - Ph
12/3/26 - Ph
13/3/26 - Ph, 4am, 1ca, 1or, 1Pomo,
Cut to
1/4/26 - Ph
2/4/26 - Ph
Glitch
12/4/26 - Start again
13/4/26 - Ph
14/4/26 - Fish
15/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
16/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
17/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
18/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
19/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
20/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
21/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
22/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
23/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
24/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
25/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
26/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
27/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
28/4/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, LT
29/4/26 - Ph, Lt
30/4/26 - Ph, Lt
1/5/26 - - Ph, Lt
2/5/26 - - Ph, Lt
3/5/26 - - Ph, Lt
3/5/26 - - Ph, Lt
4/5/26 - - Ph, Lt
5/5/26 - - Ph, Lt
6/5/26 - - Ph, Lt
7/5/26 - - Ph, Spf, 2Ba, 1Or, 1Gu, 1apl, 10kp, 1ca, Lt
8/5/26 - - Ph, 1Or, 1Gu, 1apl, 10kp, 2Ca, Lt
9/5/26 - - Ph, Hvin, 1Or, 1Gu, 1apl, 10kp, 3Ca, Lt
10/5/26 - Ph, 1Or, 1Gu, 1apl, 10kp, 2Ca, Lt
11/5/26 - Ph, 1Or, 1Gu, 1apl, 10kp, 2Ca, Lt
12/5/26 - Ph, 1Or, 1Gu, 1apl, 10kp, 2Ca, Lt
13/5/26 - Ph
14/5/26 - Ph
15/5/26 - Ph
16/5/26 - Ph
17/5/26 - Ph
18/5/26 - Ph,1Or, 1Gu, 1apl, 10kp, 1Ca,
19/5/26 - Ph
20/5/26 - Ph
21/5/26 - Ph
22/5/26 - Ph, 1Or, 1Gu, 1apl, 10kp, Lt
23/5/26 - Ph, 1Or
24/5/26 - Ph
25/5/26 - Ph
26/5/26 - Ph
26/5/26 - Ph
27/5/26 - Ph
28/5/26 - Ph
29/5/26 - Ph
30/5/26 - Ph
31/5/26 - Ph
1/6/26 - - Ph
2/6/26 - - Ph
3/6/26 - - Ph
4/6/26 - - Ph
5/6/26 - - Ph
6/6/26 - - Ph
7/6/26 - - Ph
8/6/26 - - Ph
9/6/26 - - Ph
10/6/26 - Ph
11/6/26 - Ph
12/6/26 - Ph
13/6/26 - Ph
14/6/26 - Ph
15/6/26 - Ph
16/6/26 - Ph, Hvin
17/6/26 - Ph, Spf
18/6/26 - Ph, Hvin
19/6/26 - Ph, Spf
20/6/26 - Ph, Hvin
21/6/26 - Ph, Spf
22/6/2026 - Ph, Hvin
23/6/2026 - Ph, Spf
Skip
1/7/2026 - Ph, 2eggs, <150g> protein
2/7/2026 - Ph, 2eggs
3/7/2026 - Ph
4/7/2026 - Ph
5/7/2026 - Ph
6/7/2026 - Ph
7/7/2026 - Ph
8/7/2026 - Ph
9/7/2026 - Ph
10/7/2026 - Ph
11/7/2026 - Ph
12/7/2026 - Ph
13/7/2026 - Ph
14/7/2026 - Ph
15/7/2026 - Ph
16/7/2026 - Ph
17/7/2026 - Ph
18/7/2026 - Ph
19/7/2026 - Ph
20/7/26 -  Ph, 2Ca, 1Or, 1Gu, 1apl, 10kp,Mop
21/7/26 -  Ph, 2Ca, 1Or, 1Gu, 1apl, 10kp,Mop
22/7/26 - Ph, 3Ca, 1Or, 1Gu, 1apl, 10kp,Mop
23/7/26 -  Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp,Mop
24/7/26 - Ph, 2Ca, 1Or, 1Gu, 1apl, 10kp
25/7/26 - Ph, 3Ca, 1Or, 2Gu, 1apl, 10kp, Mop
26/7/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, Lt
27/7/26 -  Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp
28/7/26 -  Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp
29/7/26 -  Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp
30/7/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp
31/7/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp
01/8/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, MOP, Hvin
02/8/26 - Ph, 3Ca, 1Or, 2Gu, 1apl, 10kp, 1Pomo, Spf
3/8/26 - Ph, 1Ca, 1Or, 1Gu, 1apl, 10kp, Lt, Hvin
4/8/26 - Ph, 1Ca, 1Or, 1Gu, 10kp, 1Pomo
5/8/26 - Ph, 1CA, 1Or, 1Gu, 10kp, 1Pomo, 1apl, 1ban
6/8/26 - Ph, 1Ca, 1Or, 1Gu, 10kp, 1Pomo, 1apl
7/8/26 - Ph, 1Or, 2Gu, 1Drg, 10kp, 1apl, 1Pomo
8/8/26 - Ph
9/8/26 - Ph
10/8/26 - Ph
11/8/26 - Ph
12/8/2026 - Ph
13/8/2026 - Ph
14/8/2026 - Ph, 2Ban
15/8/2026 - 1kp
16/8/2026 - 1kp
17/8/2026 - 1kp.
18/8/2026 - 1kp`,

  black: `9.3 Black — "Project Solo Levelling"
Categories: Cd (Clean Diet), NSR (No Sugar), NPR (Personal black)

20/4/26 - NSR, NPR
Cut to
27/5/26 - NSR, NPR
3/6/26 - NSR NPR
4/5/26
Skip
1/7/2026 - NSR, NPR
19/7/2026 - NSR, NPR, Hd
20/7/2026 - NSR, NPR, Hd
21/7/2026 - NSR, NPR, Hd
22/7/2026 - NSR, NPR, (dum e2)
23/7/2026 - NSR, NPR, Hd
24/7/2026 - NSR, NPR, (Subhai hotel)
25/7/2026 - NSR, NPR, Hd
26/7/2026 - NSR, NPR, (Dharmavaram biryani)
27/7/2026 - NSR, NPR, (SID CHEPA P)
28/7/2026 - NSR, NPR, HD
29/7/2026 - NSR, NPR, Hd / Pani Puri
30/7/2026 - NSR, NPR, Hd
31/7/2026 - NSR, NPR, Bhimas - chapati/veg frd ric
1/8/2026 - NSR, NPR, Bayata food
2/8/2026 - NSR, NPR, Hd
3/8/2026 - NSR, NPR, Dhaba
4/8/2026 - NSR, NPR, Savran
5/8/2026 - NSR, NPR, Hd
6/8/2026 - NSR, NPR, Hd
7/8/2026 - NSR, NPR, subhai + Biryani
8/8/2026 - NSR, NPR
9/8/2026 - NSR, NPR
10/8/2026 - NSR, NPR
11/8/2026 - NSR, NPR
12/8/2026 - NSR, NPR
13/8/2026 - NPR (bad diet)
14/8/2026 - NSR, NPR, cd
15/8/2026 - NSR
16/8/2026 - NPR
17/8/2026 - NSR
18/8/2026 - NPR`
};
