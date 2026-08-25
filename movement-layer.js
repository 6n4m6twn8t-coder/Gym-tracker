(()=>{
const DEMOS={
  'Incline Dumbbell Press':{src:'assets/demo/incline-db-press.svg?v=1'},
  'Leg Press':{src:'assets/demo/leg-press.svg?v=3',benchmark:true},
  'Romanian Deadlift':{src:'assets/demo/romanian-deadlift.svg?v=1'},
  'Leg Extension':{src:'assets/demo/leg-extension.svg?v=1'},
  'Seated Leg Curl':{src:'assets/demo/seated-leg-curl.svg?v=1'},
  'Standing Calf Raise':{src:'assets/demo/standing-calf-raise.svg?v=1'},
  'Hanging Knee Raise':{src:'assets/demo/hanging-knee-raise.svg?v=1'}
};
const activePlayers=new WeakMap();
function movementHeader(){return `<div class="movement-head"><div><h3>Movement</h3><p>Fixed camera · controlled rep</p></div><span class="movement-loop">LOOP</span></div>`}
function stopPlayer(section){const stop=activePlayers.get(section);if(stop){stop();activePlayers.delete(section)}}
function renderStatic(section,name,cfg){stopPlayer(section);section.innerHTML=`${movementHeader()}<div class="movement-stage"><img class="movement-demo" src="${cfg.src}" alt="Animated ${name} demonstration" loading="eager" decoding="async"></div>`}
function apply(){const sheet=document.querySelector('.anatomy-sheet');if(!sheet)return;const name=sheet.querySelector('h2')?.textContent?.trim();const cfg=DEMOS[name];if(!cfg)return;const section=[...sheet.querySelectorAll('.anatomy-section')].find(x=>x.querySelector('h3')?.textContent?.trim()==='Movement');if(!section)return;if(section.dataset.movementReady===cfg.src)return;section.classList.add('movement-section');section.dataset.movementReady=cfg.src;renderStatic(section,name,cfg)}
Object.values(DEMOS).forEach(cfg=>{if(cfg.src){const i=new Image();i.decoding='async';i.src=cfg.src}});
new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});addEventListener('pageshow',()=>setTimeout(apply,60));addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(apply,40)});setInterval(apply,900);setTimeout(apply,0);window.AthleteMovementDemos=DEMOS;
})();