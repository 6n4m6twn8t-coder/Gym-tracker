// Static full-body Push anatomy cards. Each exercise has its own clean WebP asset.
(()=>{
const FILES={
  'Incline Dumbbell Press':'assets/push-anatomy/incline-dumbbell-press.b64',
  'Flat Dumbbell Press':'assets/push-anatomy/flat-dumbbell-press.b64',
  'Cable Fly':'assets/push-anatomy/cable-fly.b64',
  'Cable Lateral Raise':'assets/push-anatomy/cable-lateral-raise.b64',
  'Rope Triceps Pushdown':'assets/push-anatomy/rope-triceps-pushdown.b64',
  'Overhead Cable Extension':'assets/push-anatomy/overhead-cable-extension.b64',
  'Cable Crunch':'assets/push-anatomy/cable-crunch.b64'
};
const ART={};

const style=document.createElement('style');
style.id='pushAnatomyStyles';
style.textContent=`
.muscleFocus{margin:12px 0 2px;border:1px solid #272c36;border-radius:14px;overflow:hidden;background:#050607;display:grid;place-items:center;box-shadow:0 1px 0 rgba(255,255,255,.025) inset}
.muscleFocusImg{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
`;
document.getElementById('pushAnatomyStyles')?.remove();
document.head.appendChild(style);

function decoratePushAnatomy(){
  if(!active||active.name!=='Push'||!Array.isArray(active.exercises))return;
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
  decoratePushAnatomy();
  return out;
};

Promise.all(Object.entries(FILES).map(async([name,path])=>{
  try{
    const r=await fetch(`${path}?v=6`,{cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status}`);
    const encoded=(await r.text()).trim();
    if(!encoded.startsWith('UklGR'))throw new Error('invalid WebP base64');
    ART[name]=`data:image/webp;base64,${encoded}`;
  }catch(err){
    console.warn(`Push anatomy failed: ${name}`,err);
  }
})).then(()=>decoratePushAnatomy());
})();