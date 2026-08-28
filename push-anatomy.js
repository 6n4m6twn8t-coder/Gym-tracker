// Push exercise muscle-focus images. Uses one sprite image so the workout cards stay simple.
(()=>{
const ART={
  'Incline Dumbbell Press':0,
  'Flat Dumbbell Press':1,
  'Cable Fly':2,
  'Cable Lateral Raise':3,
  'Rope Triceps Pushdown':4,
  'Overhead Cable Extension':5,
  'Cable Crunch':6
};
const style=document.createElement('style');
style.id='pushAnatomyStyles';
style.textContent=`
.muscleFocus{margin:12px 0 2px;height:190px;border:1px solid #272c36;border-radius:14px;overflow:hidden;background-color:#090b0f;background-image:url('assets/push-anatomy-sprite.webp?v=1');background-size:700% 100%;background-repeat:no-repeat;box-shadow:0 1px 0 rgba(255,255,255,.025) inset}
@media(max-width:390px){.muscleFocus{height:176px;margin-top:10px}}
`;
document.head.appendChild(style);
function decoratePushAnatomy(){
  if(!window.active||!Array.isArray(active.exercises))return;
  document.querySelectorAll('.exercise').forEach((node,i)=>{
    if(node.querySelector('.muscleFocus'))return;
    const ex=active.exercises[i];
    const pos=ART[ex?.name];
    if(pos===undefined)return;
    const head=node.querySelector('.exerciseHead');
    if(!head)return;
    const panel=document.createElement('div');
    panel.className='muscleFocus';
    panel.setAttribute('role','img');
    panel.setAttribute('aria-label',`${ex.name} muscle focus`);
    panel.style.backgroundPosition=`${pos===0?0:(pos/(6))*100}% 0%`;
    head.insertAdjacentElement('afterend',panel);
  });
}
const baseWorkout=window.workout;
if(typeof baseWorkout==='function'){
  window.workout=function(){const out=baseWorkout.apply(this,arguments);decoratePushAnatomy();return out};
}
if(typeof window.render==='function')window.render();
})();
