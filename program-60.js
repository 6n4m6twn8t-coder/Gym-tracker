// Optimized 4-day rolling hypertrophy plan: Push → Pull → Legs → Upper / Chest
// Loaded after app.js so the tracker, history, PRs, notes and progression logic stay unchanged.

PROGRAM.Push=[
  {name:'Incline Dumbbell Press',sets:3,reps:'8–12',rest:90},
  {name:'Flat Dumbbell Press',sets:3,reps:'8–12',rest:90},
  {name:'Cable Fly',sets:3,reps:'10–15',rest:60},
  {name:'Cable Lateral Raise',sets:3,reps:'12–15',rest:60},
  {name:'Rope Triceps Pushdown',sets:3,reps:'10–15',rest:60},
  {name:'Overhead Cable Extension',sets:2,reps:'10–15',rest:60},
  {name:'Cable Crunch',sets:3,reps:'10–15',rest:45}
];

PROGRAM.Pull=[
  {name:'Lat Pulldown',sets:3,reps:'8–12',rest:90},
  {name:'Chest-Supported Row',sets:3,reps:'8–12',rest:90},
  {name:'Single-Arm Cable Row',sets:3,reps:'10–12',rest:75},
  {name:'Reverse Pec Deck',sets:3,reps:'12–15',rest:60},
  {name:'Dumbbell Curl',sets:3,reps:'8–12',rest:60},
  {name:'Hammer Curl',sets:3,reps:'10–12',rest:60},
  {name:'45° Back Extension',sets:2,reps:'10–15',rest:60}
];

PROGRAM.Legs=[
  {name:'Leg Press',sets:3,reps:'8–12',rest:90},
  {name:'Romanian Deadlift',sets:3,reps:'8–12',rest:90},
  {name:'Leg Extension',sets:3,reps:'10–15',rest:60},
  {name:'Seated Leg Curl',sets:3,reps:'10–15',rest:60},
  {name:'Bulgarian Split Squat',sets:2,reps:'8–12 / leg',rest:75},
  {name:'Standing Calf Raise',sets:3,reps:'10–15',rest:60},
  {name:'Hanging Knee Raise',sets:3,reps:'10–15',rest:45}
];

PROGRAM['Upper / Chest']=[
  {name:'Incline Machine Press',sets:3,reps:'8–12',rest:90},
  {name:'Chest-Supported Row',sets:3,reps:'8–12',rest:90},
  {name:'Pec Deck',sets:3,reps:'10–15',rest:60},
  {name:'Neutral-Grip Pulldown',sets:3,reps:'8–12',rest:90},
  {name:'Cable Lateral Raise',sets:3,reps:'12–15',rest:60},
  {name:'Overhead Cable Extension',sets:2,reps:'10–15',rest:60},
  {name:'Cable Curl',sets:2,reps:'10–15',rest:60},
  {name:'Cable Crunch',sets:3,reps:'10–15',rest:45}
];

Object.assign(SIMILAR,{
  'Bulgarian Split Squat':['Walking Lunge','Reverse Lunge','Smith Split Squat'],
  'Walking Lunge':['Bulgarian Split Squat','Reverse Lunge','Smith Split Squat'],
  '45° Back Extension':['Romanian Deadlift','Dumbbell Romanian Deadlift','Good Morning']
});

// Re-render the session picker with the updated four-day rotation.
render();
