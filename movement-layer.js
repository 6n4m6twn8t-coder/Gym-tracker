(()=>{
const DEMOS={
  'Incline Dumbbell Press':{src:'assets/demo/incline-db-press.svg?v=1'},
  'Leg Press':{grid:'assets/demo/leg-press-grid.jpg?v=1',frameCount:12,cols:4,rows:3,duration:3600},
  'Romanian Deadlift':{src:'assets/demo/romanian-deadlift.svg?v=1'},
  'Leg Extension':{src:'assets/demo/leg-extension.svg?v=1'},
  'Seated Leg Curl':{src:'assets/demo/seated-leg-curl.svg?v=1'},
  'Standing Calf Raise':{src:'assets/demo/standing-calf-raise.svg?v=1'},
  'Hanging Knee Raise':{src:'assets/demo/hanging-knee-raise.svg?v=1'}
};

const activePlayers=new WeakMap();
const reduceMotion=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

function movementHeader(){
  return `<div class="movement-head"><div><h3>Movement</h3><p>Fixed camera · controlled rep</p></div><span class="movement-loop">LOOP</span></div>`;
}

function stopPlayer(section){
  const stop=activePlayers.get(section);
  if(stop){stop();activePlayers.delete(section)}
}

function renderStatic(section,name,cfg){
  stopPlayer(section);
  section.innerHTML=`${movementHeader()}<div class="movement-stage"><img class="movement-demo" src="${cfg.src}" alt="Animated ${name} demonstration" loading="eager" decoding="async"></div>`;
}

function renderSequence(section,name,cfg){
  stopPlayer(section);
  const frames=cfg.frames||[];
  if(!frames.length){renderStatic(section,name,cfg);return}
  frames.forEach(src=>{const i=new Image();i.decoding='async';i.src=src});
  section.innerHTML=`${movementHeader()}<div class="movement-stage movement-sequence" role="img" aria-label="Animated ${name} demonstration"><img class="movement-demo movement-sequence-frame" alt=""><div class="movement-progress" aria-hidden="true">${frames.map(()=>'<i></i>').join('')}</div></div>`;
  const img=section.querySelector('.movement-sequence-frame');
  const dots=[...section.querySelectorAll('.movement-progress i')];
  let raf=0,start=performance.now(),paused=false,last=-1;
  const total=cfg.duration||3000;
  const draw=now=>{
    if(!paused){
      const idx=reduceMotion?0:Math.floor(((now-start)%total)/(total/frames.length));
      if(idx!==last){img.src=frames[idx];dots.forEach((d,i)=>d.classList.toggle('active',i===idx));last=idx}
    }
    raf=requestAnimationFrame(draw);
  };
  raf=requestAnimationFrame(draw);
  const toggle=()=>{paused=!paused;section.classList.toggle('movement-paused',paused);if(!paused)start=performance.now()-(Math.max(last,0)*(total/frames.length))};
  section.querySelector('.movement-sequence')?.addEventListener('click',toggle);
  activePlayers.set(section,()=>cancelAnimationFrame(raf));
}

function renderGrid(section,name,cfg){
  stopPlayer(section);
  const count=cfg.frameCount||12,cols=cfg.cols||4,rows=cfg.rows||3,total=cfg.duration||3600;
  const preload=new Image();preload.decoding='async';preload.src=cfg.grid;
  section.innerHTML=`${movementHeader()}<div class="movement-stage movement-sequence" role="img" aria-label="Animated ${name} demonstration"><div class="movement-sprite" style="background-image:url('${cfg.grid}');background-size:${cols*100}% ${rows*100}%"></div><div class="movement-progress" aria-hidden="true">${Array.from({length:count},()=>'<i></i>').join('')}</div></div>`;
  const sprite=section.querySelector('.movement-sprite');
  const dots=[...section.querySelectorAll('.movement-progress i')];
  let raf=0,start=performance.now(),paused=false,last=-1;
  const show=idx=>{
    const col=idx%cols,row=Math.floor(idx/cols);
    const x=cols===1?0:(col/(cols-1))*100;
    const y=rows===1?0:(row/(rows-1))*100;
    sprite.style.backgroundPosition=`${x}% ${y}%`;
    dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
    last=idx;
  };
  const draw=now=>{
    if(!paused){
      const idx=reduceMotion?0:Math.floor(((now-start)%total)/(total/count));
      if(idx!==last)show(idx);
    }
    raf=requestAnimationFrame(draw);
  };
  show(0);
  raf=requestAnimationFrame(draw);
  const toggle=()=>{paused=!paused;section.classList.toggle('movement-paused',paused);if(!paused)start=performance.now()-(Math.max(last,0)*(total/count))};
  section.querySelector('.movement-sequence')?.addEventListener('click',toggle);
  activePlayers.set(section,()=>cancelAnimationFrame(raf));
}

function render(section,name,cfg){
  section.classList.add('movement-section');
  section.dataset.movementReady=cfg.grid||cfg.frames?.join('|')||cfg.src;
  if(cfg.grid)renderGrid(section,name,cfg);else if(cfg.frames?.length)renderSequence(section,name,cfg);else renderStatic(section,name,cfg);
}

function apply(){
  const sheet=document.querySelector('.anatomy-sheet');
  if(!sheet)return;
  const name=sheet.querySelector('h2')?.textContent?.trim();
  const cfg=DEMOS[name];
  if(!cfg)return;
  const section=[...sheet.querySelectorAll('.anatomy-section')].find(x=>x.querySelector('h3')?.textContent?.trim()==='Movement');
  if(!section)return;
  const key=cfg.grid||cfg.frames?.join('|')||cfg.src;
  if(section.dataset.movementReady===key)return;
  render(section,name,cfg);
}

Object.values(DEMOS).forEach(cfg=>{
  if(cfg.src){const i=new Image();i.decoding='async';i.src=cfg.src}
  if(cfg.grid){const i=new Image();i.decoding='async';i.src=cfg.grid}
  (cfg.frames||[]).forEach(src=>{const i=new Image();i.decoding='async';i.src=src});
});

new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
addEventListener('pageshow',()=>setTimeout(apply,60));
addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(apply,40)});
setInterval(apply,900);
setTimeout(apply,0);

window.AthleteMovementDemos=DEMOS;
})();