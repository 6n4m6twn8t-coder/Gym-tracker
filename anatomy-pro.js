(()=>{
const ASSETS={
  'Incline Dumbbell Press':'assets/anatomy/incline-db-press.jpg',
  'Flat Dumbbell Press':'assets/anatomy/barbell-bench.jpg',
  'Dumbbell Lateral Raise':'assets/anatomy/lateral-raise.jpg',
  'Rope Triceps Pushdown':'assets/anatomy/triceps-pushdown.jpg',
  'Cable Fly':'assets/anatomy/cable-fly.jpg',
  'Leg Press':'assets/anatomy/leg-press.jpg',
  'Romanian Deadlift':'assets/anatomy/rdl.jpg',
  'Leg Extension':'assets/anatomy/leg-extension.jpg',
  'Seated Leg Curl':'assets/anatomy/leg-curl.jpg',
  'Standing Calf Raise':'assets/anatomy/calf-raise.jpg'
};
function imageFor(name){
  const src=ASSETS[name]; if(!src) return null;
  const img=document.createElement('img');
  img.src=src+'?v=1';
  img.alt=`${name} muscles worked`;
  img.loading='eager';
  img.decoding='async';
  img.className='real-anatomy-image';
  return img;
}
function upgrade(){
  document.querySelectorAll('.exercise').forEach(ex=>{
    const name=(ex.dataset.exerciseName||ex.querySelector('b')?.textContent||'').trim();
    const thumb=ex.querySelector(':scope > .anatomy-strip .anatomy-thumb');
    const img=imageFor(name);
    if(!thumb||!img||thumb.dataset.real==='1') return;
    thumb.replaceChildren(img); thumb.dataset.real='1';
  });
  const sheet=document.querySelector('.anatomy-sheet');
  if(sheet){
    const name=sheet.querySelector('h2')?.textContent?.trim();
    const hero=sheet.querySelector('.anatomy-hero-figure');
    const img=imageFor(name);
    if(hero&&img&&hero.dataset.real!=='1'){hero.replaceChildren(img.cloneNode(true));hero.dataset.real='1'}
  }
}
new MutationObserver(upgrade).observe(document.body,{childList:true,subtree:true});
addEventListener('pageshow',()=>setTimeout(upgrade,80));
setInterval(upgrade,900);setTimeout(upgrade,0);
})();