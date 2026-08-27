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

const ROTATION=['Push','Pull','Legs','Upper / Chest'];
const HOME_META={
  Push:{muscles:'Chest · Shoulders · Triceps',time:'55–60 min',mark:'P'},
  Pull:{muscles:'Back · Biceps · Rear delts',time:'55–60 min',mark:'P'},
  Legs:{muscles:'Quads · Hamstrings · Glutes',time:'55–60 min',mark:'L'},
  'Upper / Chest':{muscles:'Chest priority · Upper body',time:'55–60 min',mark:'U'}
};

function lastRotationWorkout(){
  return history.find(h=>ROTATION.includes(h.name))||null;
}

function nextSessionName(){
  const last=lastRotationWorkout();
  if(!last)return ROTATION[0];
  const i=ROTATION.indexOf(last.name);
  return ROTATION[(i+1)%ROTATION.length];
}

function startOfWeek(){
  const d=new Date();
  d.setHours(0,0,0,0);
  const daysSinceMonday=(d.getDay()+6)%7;
  d.setDate(d.getDate()-daysSinceMonday);
  return d.getTime();
}

function workoutsThisWeek(){
  const since=startOfWeek();
  return history.filter(h=>ROTATION.includes(h.name)&&Number(h.started)>=since).length;
}

function relativeDay(ts){
  if(!ts)return '';
  const now=new Date();
  const then=new Date(ts);
  now.setHours(0,0,0,0);
  then.setHours(0,0,0,0);
  const days=Math.max(0,Math.round((now-then)/86400000));
  if(days===0)return 'Today';
  if(days===1)return 'Yesterday';
  return `${days} days ago`;
}

function rotationAbbr(name){
  return name==='Upper / Chest'?'U/C':name.slice(0,1).toUpperCase();
}

function homeHTML(){
  const next=nextSessionName();
  const meta=HOME_META[next];
  const last=lastRotationWorkout();
  const week=workoutsThisWeek();
  return `
    <section class="homeIntro">
      <span class="homeEyebrow">TODAY'S TRAINING</span>
      <p>Do the work in front of you.</p>
    </section>

    <section class="homeHero">
      <div class="homeHeroMark">${escapeHtml(meta.mark)}</div>
      <span class="homeHeroLabel">NEXT SESSION</span>
      <div class="homeHeroTitle">${escapeHtml(next)}</div>
      <div class="homeHeroMuscles">${escapeHtml(meta.muscles)}</div>
      <div class="homeHeroTime">${escapeHtml(meta.time)}</div>
      <button class="primary homeStart" data-home-start="${escapeAttr(next)}">Start ${escapeHtml(next)}</button>
    </section>

    <section class="rotationStrip" aria-label="Training rotation">
      ${ROTATION.map(name=>`<div class="rotationItem ${name===next?'active':''}"><span class="rotationDot">${rotationAbbr(name)}</span><span class="rotationLabel">${escapeHtml(name)}</span></div>`).join('')}
    </section>

    <section class="homeStats">
      <div class="homeStat">
        <small>LAST WORKOUT</small>
        ${last?`<strong>${escapeHtml(last.name)}</strong><span>${relativeDay(last.started)}</span>`:`<strong>No sessions yet</strong><span>Start with ${escapeHtml(next)}</span>`}
      </div>
      <div class="homeStat">
        <small>THIS WEEK</small>
        <strong>${week}</strong>
        <span>${week===1?'session':'sessions'}</span>
      </div>
    </section>

    <div class="homeSectionLabel">TRAINING ROTATION</div>
    ${ROTATION.map(name=>{
      const m=HOME_META[name];
      return `<button class="homeSession ${name===next?'next':''}" data-home-start="${escapeAttr(name)}">
        <span class="homeSessionIcon">${rotationAbbr(name)}</span>
        <span><span class="homeSessionTitle">${escapeHtml(name)}</span><span class="homeSessionSub">${escapeHtml(m.muscles)}</span></span>
        <span class="homeSessionTime">${escapeHtml(m.time)}</span>
      </button>`;
    }).join('')}`;
}

function renderHome(){
  stopRest();
  app.innerHTML=homeHTML();
  document.querySelectorAll('[data-home-start]').forEach(b=>b.onclick=()=>start(b.dataset.homeStart));
}

render=function(page='today'){
  clearInterval(sessionTick);
  sessionTick=null;
  similarOpen.clear();
  noteOpen.clear();
  if(page!=='today')stopRest();
  if(active&&page==='today')return workout();
  if(page==='history')return historyPage();
  renderHome();
};

// Re-render with the updated four-day rotation, calm cue layer and polished home screen.
render();
