// Static full-body Pull anatomy cards. Uses the locked Push card treatment with exercise-specific equipment.
(()=>{
const FILES={
  'Lat Pulldown':'assets/pull-anatomy/lat-pulldown.b64',
  'Chest-Supported Row':'assets/pull-anatomy/chest-supported-row.b64',
  'Single-Arm Cable Row':'assets/pull-anatomy/single-arm-cable-row.b64',
  'Reverse Pec Deck':'assets/pull-anatomy/reverse-pec-deck.b64',
  'Dumbbell Curl':'assets/pull-anatomy/dumbbell-curl.b64',
  'Hammer Curl':'assets/pull-anatomy/hammer-curl.b64',
  '45° Back Extension':'assets/pull-anatomy/45-back-extension.b64'
};
const ART={};

// Push normally installs these shared card styles first. Keep a fallback so Pull remains self-contained.
if(!document.getElementById('pushAnatomyStyles')){
  const style=document.createElement('style');
  style.id='pushAnatomyStyles';
  style.textContent=`
.muscleFocus{margin:12px 0 2px;border:1px solid #272c36;border-radius:14px;overflow:hidden;background:#050607;display:grid;place-items:center;box-shadow:0 1px 0 rgba(255,255,255,.025) inset}
.muscleFocusImg{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
`;
  document.head.appendChild(style);
}

function decoratePullAnatomy(){
  if(!active||active.name!=='Pull'||!Array.isArray(active.exercises))return;
  document.querySelectorAll('.exercise').forEach((node,i)=>{
    if(node.querySelector('.muscleFocus'))return;
    const ex=active.exercises[i];
    const src=ART[ex?.name];
    if(!src)return;
    const head=node.querySelector('.exerciseHead');
    if(!head)return;
    const panel=document.createElement('div');
    panel.className='muscleFocus';
    const img=document.createElement('img');
    img.className='muscleFocusImg';
    img.src=src;
    img.alt=`${ex.name} muscle focus`;
    img.decoding='async';
    panel.appendChild(img);
    head.insertAdjacentElement('afterend',panel);
  });
}

const baseWorkout=workout;
workout=function(){
  const out=baseWorkout.apply(this,arguments);
  decoratePullAnatomy();
  return out;
};

Promise.all(Object.entries(FILES).map(async([name,path])=>{
  try{
    const r=await fetch(`${path}?v=1`,{cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status}`);
    const encoded=(await r.text()).trim();
    if(!encoded.startsWith('UklGR'))throw new Error('invalid WebP base64');
    ART[name]=`data:image/webp;base64,${encoded}`;
  }catch(err){
    console.warn(`Pull anatomy failed: ${name}`,err);
  }
})).then(()=>decoratePullAnatomy());
})();