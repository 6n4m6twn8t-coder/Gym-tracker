const PROGRAM={
  Push:[
    {name:'Incline Dumbbell Press',sets:3,reps:'8–12',rest:90},
    {name:'Flat Dumbbell Press',sets:3,reps:'8–12',rest:90},
    {name:'Dumbbell Lateral Raise',sets:3,reps:'12–15',rest:60},
    {name:'Rope Triceps Pushdown',sets:3,reps:'10–15',rest:60},
    {name:'Cable Fly',sets:3,reps:'10–15',rest:60},
    {name:'Cable Crunch',sets:3,reps:'10–15',rest:45}
  ],
  Pull:[
    {name:'Lat Pulldown',sets:3,reps:'8–12',rest:90},
    {name:'Chest-Supported Row',sets:3,reps:'8–12',rest:90},
    {name:'Single-Arm Cable Row',sets:3,reps:'10–12',rest:75},
    {name:'Face Pull',sets:3,reps:'12–15',rest:60},
    {name:'Dumbbell Curl',sets:3,reps:'8–12',rest:60},
    {name:'Hammer Curl',sets:3,reps:'10–12',rest:60}
  ],
  Legs:[
    {name:'Leg Press',sets:3,reps:'8–12',rest:90},
    {name:'Romanian Deadlift',sets:3,reps:'8–12',rest:90},
    {name:'Leg Extension',sets:3,reps:'10–15',rest:60},
    {name:'Seated Leg Curl',sets:3,reps:'10–15',rest:60},
    {name:'Standing Calf Raise',sets:3,reps:'10–15',rest:60},
    {name:'Hanging Knee Raise',sets:3,reps:'10–15',rest:45}
  ]
};

const SIMILAR={
  'Incline Dumbbell Press':['Incline Machine Press','Incline Smith Press','Low-to-High Cable Press'],
  'Flat Dumbbell Press':['Chest Press Machine','Smith Bench Press','Push-Up'],
  'Dumbbell Lateral Raise':['Cable Lateral Raise','Lateral Raise Machine'],
  'Rope Triceps Pushdown':['Straight-Bar Pushdown','Single-Arm Cable Pushdown','Overhead Cable Extension'],
  'Cable Fly':['Pec Deck','Dumbbell Fly','Machine Fly'],
  'Cable Crunch':['Machine Crunch','Weighted Crunch','Decline Crunch'],
  'Lat Pulldown':['Neutral-Grip Pulldown','Assisted Pull-Up','Single-Arm Pulldown'],
  'Chest-Supported Row':['Seated Cable Row','Machine Row','Chest-Supported Dumbbell Row'],
  'Single-Arm Cable Row':['Single-Arm Dumbbell Row','Single-Arm Machine Row','Meadows Row'],
  'Face Pull':['Reverse Pec Deck','Rear-Delt Cable Fly','Rear-Delt Machine Fly'],
  'Dumbbell Curl':['Cable Curl','Machine Curl','EZ-Bar Curl'],
  'Hammer Curl':['Rope Hammer Curl','Cross-Body Hammer Curl','Machine Hammer Curl'],
  'Leg Press':['Hack Squat','Goblet Squat','Smith Squat'],
  'Romanian Deadlift':['45° Back Extension','Dumbbell Romanian Deadlift','Good Morning'],
  'Leg Extension':['Sissy Squat','Reverse Nordic','Single-Leg Extension'],
  'Seated Leg Curl':['Lying Leg Curl','Standing Leg Curl','Single-Leg Curl'],
  'Standing Calf Raise':['Seated Calf Raise','Leg Press Calf Raise','Single-Leg Calf Raise'],
  'Hanging Knee Raise':['Captain’s Chair Raise','Reverse Crunch','Lying Leg Raise']
};

const TEMPO='3-1-1';
const $=s=>document.querySelector(s);
const app=$('#app');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let active=load('pa_active',null);
let history=load('pa_history',[]);
let sessionTick=null,restTick=null,restEnd=0;
const similarOpen=new Set();

const lookupExercise=name=>Object.values(PROGRAM).flat().find(e=>e.name===name);

function similarFor(name){
  if(SIMILAR[name])return SIMILAR[name];
  for(const [base,alts] of Object.entries(SIMILAR)){
    if(alts.includes(name))return [base,...alts.filter(x=>x!==name)];
  }
  return [];
}

function normalizeActive(){
  if(!active?.exercises)return;
  active.exercises=active.exercises.map(e=>{
    const preset=lookupExercise(e.name)||{};
    return {
      ...e,
      reps:e.reps||preset.reps||'8–12',
      rest:e.rest||preset.rest||90,
      tempo:e.tempo||TEMPO,
      sets:Array.isArray(e.sets)&&e.sets.length?e.sets:Array.from({length:preset.sets||3},()=>({w:'',r:'',done:false}))
    };
  });
  save('pa_active',active);
}
normalizeActive();

document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>render(b.dataset.nav));

function render(page='today'){
  clearInterval(sessionTick);
  sessionTick=null;
  similarOpen.clear();
  if(page!=='today')stopRest();
  if(active&&page==='today')return workout();
  if(page==='history')return historyPage();

  app.innerHTML=`
    <div class="card">
      <h2>Today</h2>
      <p class="muted">Choose a session and train. Nothing else.</p>
    </div>
    ${Object.entries(PROGRAM).map(([name,exercises])=>`
      <button class="card workout" data-start="${name}">
        <h2>${name}</h2>
        <span class="muted">${exercises.length} exercises · 3-1-1 tempo</span>
      </button>`).join('')}`;

  document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(b.dataset.start));
}

function start(name){
  similarOpen.clear();
  active={
    id:Date.now(),
    name,
    started:Date.now(),
    notes:'',
    exercises:PROGRAM[name].map(e=>({
      name:e.name,
      reps:e.reps,
      rest:e.rest,
      tempo:TEMPO,
      sets:Array.from({length:e.sets},()=>({w:'',r:'',done:false}))
    }))
  };
  save('pa_active',active);
  workout();
}

function workout(){
  clearInterval(sessionTick);
  app.innerHTML=`
    <div class="sessionBar"><b>${active.name}</b><span id="clock">00:00</span></div>
    <div class="card">
      <span class="tiny">ACTIVE SESSION</span>
      <h2>${active.name}</h2>
      ${active.exercises.map((e,i)=>exerciseHTML(e,i)).join('')}
    </div>
    <div class="card">
      <h3>Notes</h3>
      <textarea id="note" placeholder="Anything worth remembering…">${escapeHtml(active.notes||'')}</textarea>
    </div>
    <div class="actions">
      <button class="primary" id="finish">Finish & save</button>
      <button class="danger" id="cancel">Cancel</button>
    </div>`;

  $('#note').oninput=e=>{active.notes=e.target.value;persist()};
  document.querySelectorAll('[data-set]').forEach(el=>el.oninput=setChange);
  document.querySelectorAll('[data-done]').forEach(b=>b.onclick=doneSet);
  document.querySelectorAll('[data-similar]').forEach(b=>b.onclick=toggleSimilar);
  document.querySelectorAll('[data-swap]').forEach(b=>b.onclick=swapExercise);
  $('#finish').onclick=finish;
  $('#cancel').onclick=()=>{
    if(confirm('Cancel this workout?')){
      active=null;
      localStorage.removeItem('pa_active');
      similarOpen.clear();
      stopRest();
      render();
    }
  };
  clock();
  sessionTick=setInterval(clock,1000);
}

function exerciseHTML(e,i){
  const last=findLast(e.name);
  const similar=similarFor(e.name);
  const open=similarOpen.has(i);
  return `<div class="exercise">
    <div class="exerciseHead">
      <div>
        <b>${escapeHtml(e.name)}</b>
        <div class="prescription">${e.sets.length} × ${e.reps} · Tempo ${e.tempo||TEMPO} · ${e.rest}s rest</div>
        ${last?`<div class="previous">Previous · ${last}</div>`:''}
      </div>
      ${similar.length?`<button class="similarToggle" data-similar="${i}">${open?'Close':'Similar'}</button>`:''}
    </div>
    ${open?`<div class="similarPanel"><span class="tiny">SIMILAR EXERCISES</span>${similar.map(x=>`<button class="similarChoice" data-swap="${i}" data-name="${escapeAttr(x)}">${escapeHtml(x)}</button>`).join('')}</div>`:''}
    <div class="sets">
      <span class="head">SET</span><span class="head">KG</span><span class="head">REPS</span><span class="head">DONE</span>
      ${e.sets.map((s,j)=>`
        <span>${j+1}</span>
        <input aria-label="${escapeAttr(e.name)} set ${j+1} weight" inputmode="decimal" data-set="${i},${j},w" value="${escapeAttr(s.w??'')}">
        <input aria-label="${escapeAttr(e.name)} set ${j+1} reps" inputmode="numeric" data-set="${i},${j},r" value="${escapeAttr(s.r??'')}">
        <button class="done ${s.done?'on':''}" data-done="${i},${j}" aria-label="Mark set ${j+1} ${s.done?'not done':'done'}">${s.done?'✓':'○'}</button>`).join('')}
    </div>
  </div>`;
}

function toggleSimilar(ev){
  const i=+ev.currentTarget.dataset.similar;
  if(similarOpen.has(i))similarOpen.delete(i);else similarOpen.add(i);
  workout();
}

function swapExercise(ev){
  const i=+ev.currentTarget.dataset.swap;
  const name=ev.currentTarget.dataset.name;
  const e=active.exercises[i];
  const hasData=e.sets.some(s=>s.w!==''||s.r!==''||s.done);
  if(hasData&&!confirm(`Switch ${e.name} to ${name}? Current sets for this exercise will be cleared.`))return;
  e.name=name;
  if(hasData)e.sets=e.sets.map(()=>({w:'',r:'',done:false}));
  similarOpen.delete(i);
  persist();
  workout();
}

function setChange(ev){
  const [i,j,k]=ev.target.dataset.set.split(',');
  active.exercises[+i].sets[+j][k]=ev.target.value;
  persist();
}

function doneSet(ev){
  const [i,j]=ev.currentTarget.dataset.done.split(',').map(Number);
  const set=active.exercises[i].sets[j];
  set.done=!set.done;
  persist();
  const rest=active.exercises[i].rest||90;
  workout();
  if(set.done)startRest(rest);
}

function persist(){save('pa_active',active)}

function startRest(sec){
  clearInterval(restTick);
  restEnd=Date.now()+sec*1000;
  const box=$('#restTimer');
  box.hidden=false;
  box.className='rest';
  box.innerHTML=`<div class="grow"><span class="tiny">REST</span><strong id="restOut">${format(sec)}</strong></div><button id="addRest">+30</button><button id="skipRest">Skip</button>`;
  $('#addRest').onclick=()=>restEnd+=30000;
  $('#skipRest').onclick=stopRest;
  const run=()=>{
    const left=Math.max(0,Math.ceil((restEnd-Date.now())/1000));
    const out=$('#restOut');
    if(out)out.textContent=left?format(left):'GO';
    if(left<=0){
      clearInterval(restTick);
      restTick=null;
      setTimeout(stopRest,2500);
    }
  };
  run();
  restTick=setInterval(run,250);
}

function stopRest(){
  clearInterval(restTick);
  restTick=null;
  const box=$('#restTimer');
  if(box){box.hidden=true;box.innerHTML=''}
}

function format(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}

function clock(){
  const out=$('#clock');
  if(!out||!active)return;
  const s=Math.floor((Date.now()-active.started)/1000);
  const m=Math.floor(s/60);
  out.textContent=`${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

function finish(){
  active.finished=Date.now();
  history.unshift(active);
  save('pa_history',history);
  localStorage.removeItem('pa_active');
  active=null;
  similarOpen.clear();
  stopRest();
  historyPage();
}

function findLast(name){
  for(const h of history){
    const e=h.exercises?.find(x=>x.name===name);
    if(!e)continue;
    const sets=e.sets?.filter(s=>s.w!==''&&s.r!=='').map(s=>`${s.w}×${s.r}`)||[];
    if(sets.length)return sets.join(' · ');
  }
  return '';
}

function historyPage(){
  clearInterval(sessionTick);
  const rows=history.map((h,i)=>{
    const mins=h.finished&&h.started?Math.max(1,Math.round((h.finished-h.started)/60000)):null;
    return `<button class="card workout" data-history="${i}"><div class="historyRow"><div><h3>${h.name}</h3><span class="muted">${new Date(h.started).toLocaleDateString()}</span></div><div class="right tiny">${mins?mins+' min':''}</div></div></button>`;
  }).join('');
  app.innerHTML=`<div class="card"><h2>History</h2><p class="muted">${history.length?history.length+' saved workout'+(history.length===1?'':'s'):'Your completed workouts will appear here.'}</p></div>${rows||'<div class="empty">No workouts saved yet.</div>'}`;
  document.querySelectorAll('[data-history]').forEach(b=>b.onclick=()=>detail(+b.dataset.history));
}

function detail(i){
  const h=history[i];
  const mins=h.finished&&h.started?Math.max(1,Math.round((h.finished-h.started)/60000)):null;
  app.innerHTML=`<div class="card">
    <h2>${h.name}</h2>
    <p class="muted">${new Date(h.started).toLocaleString()}${mins?' · '+mins+' min':''}</p>
    ${h.exercises.map(e=>`<div class="exercise"><b>${escapeHtml(e.name)}</b><div class="prescription">${e.reps?`${e.sets.length} × ${e.reps} · `:''}Tempo ${e.tempo||TEMPO}</div><div>${(e.sets||[]).filter(s=>s.w!==''&&s.r!=='').map(s=>`${s.w} kg × ${s.r}`).join('<br>')||'<span class="muted">No logged sets</span>'}</div></div>`).join('')}
    ${h.notes?`<p>${escapeHtml(h.notes)}</p>`:''}
  </div>
  <div class="actions"><button id="back">Back</button><button id="delete" class="danger">Delete</button></div>`;
  $('#back').onclick=historyPage;
  $('#delete').onclick=()=>{
    if(confirm('Delete this workout?')){
      history.splice(i,1);
      save('pa_history',history);
      historyPage();
    }
  };
}

function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(value){return escapeHtml(value)}

if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
render();
