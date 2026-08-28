// Push muscle-focus cards. The source art is cleaned at load time so the body sits on a flat dark field.
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
.muscleFocus{margin:12px 0 2px;height:190px;border:1px solid #272c36;border-radius:14px;overflow:hidden;background:#07090c;display:grid;place-items:center;box-shadow:0 1px 0 rgba(255,255,255,.025) inset}
.muscleFocusImg{display:block;width:100%;height:100%;object-fit:contain;object-position:center}
@media(max-width:390px){.muscleFocus{height:176px;margin-top:10px}}
`;
document.getElementById('pushAnatomyStyles')?.remove();
document.head.appendChild(style);

function cleanAnatomy(src){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{
      try{
        const w=image.naturalWidth||image.width;
        const h=image.naturalHeight||image.height;
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(image,0,0,w,h);
        const frame=ctx.getImageData(0,0,w,h);
        const px=frame.data;
        const n=w*h;
        const lum=new Float32Array(n);

        for(let i=0,p=0;i<n;i++,p+=4){
          lum[i]=px[p]*.2126+px[p+1]*.7152+px[p+2]*.0722;
        }

        // Build a thin edge barrier around the anatomical figure. The old glow is
        // deliberately smooth, so a flood from the image edges passes through it
        // while stopping at the sharper body outline and muscle detail.
        let barrier=new Uint8Array(n);
        const EDGE=9;
        for(let y=1;y<h-1;y++){
          const row=y*w;
          for(let x=1;x<w-1;x++){
            const i=row+x;
            const gx=(lum[i+1]-lum[i-1])*.5;
            const gy=(lum[i+w]-lum[i-w])*.5;
            if(Math.hypot(gx,gy)>EDGE)barrier[i]=1;
          }
        }

        const passes=Math.max(2,Math.min(4,Math.round(Math.min(w,h)/90)));
        for(let pass=0;pass<passes;pass++){
          const next=barrier.slice();
          for(let y=1;y<h-1;y++){
            const row=y*w;
            for(let x=1;x<w-1;x++){
              const i=row+x;
              if(barrier[i])continue;
              if(barrier[i-1]||barrier[i+1]||barrier[i-w]||barrier[i+w]||
                 barrier[i-w-1]||barrier[i-w+1]||barrier[i+w-1]||barrier[i+w+1]) next[i]=1;
            }
          }
          barrier=next;
        }

        const bg=new Uint8Array(n);
        const queue=new Int32Array(n);
        let head=0,tail=0;
        const seed=i=>{if(!barrier[i]&&!bg[i]){bg[i]=1;queue[tail++]=i;}};
        for(let x=0;x<w;x++){seed(x);seed((h-1)*w+x);}
        for(let y=0;y<h;y++){seed(y*w);seed(y*w+w-1);}

        while(head<tail){
          const i=queue[head++];
          const x=i%w;
          const y=(i-x)/w;
          if(x>0)seed(i-1);
          if(x<w-1)seed(i+1);
          if(y>0)seed(i-w);
          if(y<h-1)seed(i+w);
        }

        // Remove tiny dark remnants left on the outside of the body barrier.
        const trimmed=bg.slice();
        for(let y=1;y<h-1;y++){
          const row=y*w;
          for(let x=1;x<w-1;x++){
            const i=row+x;
            if(bg[i]||lum[i]>=85)continue;
            let neighbours=0;
            for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
              if(!dx&&!dy)continue;
              if(bg[i+dy*w+dx])neighbours++;
            }
            if(neighbours>=6)trimmed[i]=1;
          }
        }

        const BR=5,BG=7,BB=10;
        for(let i=0,p=0;i<n;i++,p+=4){
          if(trimmed[i]){
            px[p]=BR;px[p+1]=BG;px[p+2]=BB;px[p+3]=255;
            continue;
          }

          // Muted brass: about 25% less saturation and a touch darker, with
          // original fibre contrast retained because the operation is per pixel.
          const r=px[p],g=px[p+1],b=px[p+2];
          const warm=r>g*1.01&&g>b*1.03&&(r-b)>5;
          if(warm&&lum[i]>42){
            const l=lum[i];
            px[p]=Math.max(0,Math.min(255,(r*.75+l*.25)*.92));
            px[p+1]=Math.max(0,Math.min(255,(g*.75+l*.25)*.92));
            px[p+2]=Math.max(0,Math.min(255,(b*.75+l*.25)*.92));
          }
        }

        ctx.putImageData(frame,0,0);
        resolve(canvas.toDataURL('image/webp',.92));
      }catch(err){reject(err);}
    };
    image.onerror=()=>reject(new Error('anatomy decode failed'));
    image.src=src;
  });
}

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
    const r=await fetch(`${path}?v=3`,{cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status}`);
    const encoded=(await r.text()).trim();
    if(!encoded.startsWith('UklGR'))throw new Error('invalid WebP base64');
    const raw=`data:image/webp;base64,${encoded}`;
    ART[name]=await cleanAnatomy(raw);
  }catch(err){
    console.warn(`Push anatomy failed: ${name}`,err);
  }
})).then(()=>decoratePushAnatomy());
})();
