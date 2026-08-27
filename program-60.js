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

const CALM_MESSAGES={
  default:[
    'One set at a time.',
    'Stay controlled.',
    'Keep moving forward.',
    'Focus on this set.',
    'No rush. Just work.',
    'Do the work in front of you.',
    'Small steps still count.'
  ],
  Push:[
    'Control the rep. Let the chest work.',
    'Smooth reps. Strong positions.',
    'Stay patient through every rep.',
    'Quality first. The load follows.'
  ],
  Pull:[
    'Set the position. Then pull.',
    'Stay controlled through the full range.',
    'Smooth reps. No wasted movement.',
    'Focus on the muscle doing the work.'
  ],
  Legs:[
    'Breathe. Settle. Do the next set.',
    'Strong position. Controlled reps.',
    'No rush through the hard work.',
    'One clean set at a time.'
  ],
  'Upper / Chest':[
    'Stay patient. Make every rep count.',
    'Chest first. Quality throughout.',
    'Control the stretch. Own the rep.',
    'Keep the work clean and steady.'
  ]
};

const FINISH_MESSAGES=[
  'Session complete.',
  'Work done.',
  'Another step forward.',
  'Progress logged.',
  'Good session. Keep going.'
];

function pickMessage(list){
  return list[Math.floor(Math.random()*list.length)];
}

function sessionMessage(name){
  const specific=CALM_MESSAGES[name]||[];
  const pool=[...specific,...CALM_MESSAGES.default];
  return pickMessage(pool);
}

function ensureSessionMessage(){
  if(!active)return;
  if(!active.motivation){
    active.motivation=sessionMessage(active.name);
    persist();
  }
}

function showSessionMessage(){
  if(!active?.motivation)return;
  const bar=document.querySelector('.sessionBar');
  if(!bar||document.querySelector('.calmCue'))return;
  bar.insertAdjacentHTML('afterend',`<div class="calmCue">${escapeHtml(active.motivation)}</div>`);
}

function showFinishMessage(message){
  if(!app||!message)return;
  app.insertAdjacentHTML('afterbegin',`<div class="finishCue"><small>SESSION COMPLETE</small><strong>${escapeHtml(message)}</strong></div>`);
}

const trackerWorkout=workout;
workout=function(){
  ensureSessionMessage();
  trackerWorkout();
  showSessionMessage();
};

const trackerFinish=finish;
finish=function(){
  const message=pickMessage(FINISH_MESSAGES);
  trackerFinish();
  showFinishMessage(message);
};

// Re-render the session picker or current workout with the updated four-day rotation and calm cue layer.
render();
