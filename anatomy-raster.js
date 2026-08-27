import { MALE_FRONT } from 'https://esm.sh/@musclemap/assets@1.0.1?bundle';

const canvas=document.getElementById('anatomy');
const ctx=canvas.getContext('2d',{alpha:true});
const toggle=document.getElementById('toggle');
const W=1024,H=1536,CX=MALE_FRONT.centerX;
let chestOn=true;

function hashString(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function sideOf(m,mirrored){const id=String(m.id||'');if(id.includes('RIGHT'))return 1;if(id.includes('LEFT'))return-1;return mirrored?1:-1}
function isChest(m){return m.group==='CHEST'||String(m.id||'').startsWith('CHEST_')}
function orient(m,mirrored){const g=String(m.group||'').toUpperCase(),id=String(m.id||'').toUpperCase(),s=sideOf(m,mirrored);if(g==='CHEST'||id.includes('CHEST'))return s*14;if(g.includes('SHOULDER_FRONT'))return s*58;if(g.includes('SHOULDER_SIDE'))return s*78;if(g.includes('SHOULDER')||id.includes('DELTOID'))return s*68;if(g.includes('TRAPEZIUS'))return s*42;if(g.includes('LATS')||id.includes('LATISSIMUS'))return s*56;if(g.includes('SERRATUS'))return s*48;if(g.includes('OBLIQUE'))return s*55;if(g==='ABS'||id.includes('RECTUS'))return 90;if(g.includes('BICEPS')||g.includes('TRICEPS')||g.includes('FOREARM'))return 86;if(g.includes('QUAD')||id.includes('QUADRICEPS'))return 88;if(g.includes('HAMSTRING'))return 92;if(g.includes('CALF')||id.includes('GASTROC'))return 92;if(g.includes('GLUTE'))return s*82;return 88}
function density(m){const g=String(m.group||'').toUpperCase();if(g==='CHEST')return 3.1;if(g.includes('SHOULDER'))return 2.7;if(g.includes('BICEPS')||g.includes('TRICEPS'))return 2.5;if(g.includes('FOREARM'))return 2.0;if(g.includes('QUAD')||g.includes('HAMSTRING')||g.includes('CALF'))return 2.6;return 3.0}
function curvature(m){const g=String(m.group||'').toUpperCase();if(g==='CHEST')return 14;if(g.includes('SHOULDER'))return 18;if(g.includes('BICEPS')||g.includes('TRICEPS'))return 10;if(g.includes('FOREARM'))return 7;if(g.includes('LAT')||g.includes('TRAPEZIUS'))return 16;return 9}
function clipPath(m,mirrored){const p=new Path2D(m.d);ctx.save();if(mirrored){ctx.translate(2*CX,0);ctx.scale(-1,1)}ctx.clip(p);return p}
function restore(){ctx.restore()}

const noise=document.createElement('canvas');noise.width=256;noise.height=384;const nctx=noise.getContext('2d');const img=nctx.createImageData(noise.width,noise.height);const nr=rng(991);for(let i=0;i<img.data.length;i+=4){const v=105+Math.floor(nr()*70);img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=55}nctx.putImageData(img,0,0);

function paintMuscle(m,mirrored=false){
  const p=clipPath(m,mirrored);
  const g=String(m.group||'').toUpperCase();

  // Sculpted graphite base: a soft body-scale light with darker peripheral falloff.
  const grad=ctx.createRadialGradient(W*.43,H*.30,30,W*.5,H*.45,720);
  grad.addColorStop(0,'rgba(178,183,184,.94)');grad.addColorStop(.36,'rgba(108,114,118,.95)');grad.addColorStop(.72,'rgba(59,64,69,.98)');grad.addColorStop(1,'rgba(27,31,35,1)');
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);

  // Fine tonal grain so the surface does not read as a flat vector fill.
  ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.22;ctx.imageSmoothingEnabled=true;ctx.drawImage(noise,0,0,W,H);ctx.restore();

  // Dense raster-painted fibre bundles. Nothing here is SVG styling: the path is only the clip.
  const angle=orient(m,mirrored)*Math.PI/180,d=[Math.cos(angle),Math.sin(angle)],n=[-d[1],d[0]];
  const step=density(m),bend=curvature(m),R=rng(hashString(`${m.id||m.group}:${mirrored}`));
  const diag=1900,L=1450,midX=W/2,midY=H/2;
  for(let t=-diag;t<=diag;t+=step){
    const jitter=(R()-.5)*step*1.15;
    const phase=R()*Math.PI*2;
    const localBend=bend*(.35+R()*.9)*(Math.sin(t*.011+phase));
    const sx=midX-d[0]*L+n[0]*(t+jitter), sy=midY-d[1]*L+n[1]*(t+jitter);
    const ex=midX+d[0]*L+n[0]*(t+jitter), ey=midY+d[1]*L+n[1]*(t+jitter);
    const cx=midX+n[0]*(t+jitter+localBend), cy=midY+n[1]*(t+jitter+localBend);
    const w=.42+R()*.75;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,ex,ey);ctx.strokeStyle=`rgba(8,10,12,${.10+R()*.16})`;ctx.lineWidth=w+1.05;ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+n[0]*.7,sy+n[1]*.7);ctx.quadraticCurveTo(cx+n[0]*.7,cy+n[1]*.7,ex+n[0]*.7,ey+n[1]*.7);ctx.strokeStyle=`rgba(232,235,232,${.08+R()*.16})`;ctx.lineWidth=w;ctx.stroke();
  }

  // A second, irregular micro-fibre pass creates bundle breakup rather than repeated stripes.
  const microStep=6.5;for(let t=-diag;t<=diag;t+=microStep){const q=(R()-.5)*4.5,seg=.48+R()*.4;const sx=midX-d[0]*(L*seg)+n[0]*(t+q),sy=midY-d[1]*(L*seg)+n[1]*(t+q),ex=midX+d[0]*(L*seg)+n[0]*(t+q),ey=midY+d[1]*(L*seg)+n[1]*(t+q);ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo((sx+midX)*.5+n[0]*(R()-.5)*10,(sy+midY)*.5+n[1]*(R()-.5)*10,(ex+midX)*.5+n[0]*(R()-.5)*10,(ey+midY)*.5+n[1]*(R()-.5)*10,ex,ey);ctx.strokeStyle=`rgba(245,245,240,${.025+R()*.055})`;ctx.lineWidth=.35+R()*.45;ctx.stroke()}

  // Inward edge shading gives each muscle volume without a black vector outline.
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.strokeStyle='rgba(0,0,0,.20)';ctx.lineWidth=15;ctx.stroke(p);ctx.strokeStyle='rgba(0,0,0,.23)';ctx.lineWidth=7;ctx.stroke(p);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='screen';ctx.strokeStyle='rgba(235,238,236,.055)';ctx.lineWidth=2;ctx.stroke(p);ctx.restore();

  // Chest active state: colourise the already-detailed raster muscle, never replace its texture.
  if(isChest(m)&&chestOn){ctx.save();ctx.globalCompositeOperation='color';ctx.fillStyle='rgba(215,183,93,.94)';ctx.fillRect(0,0,W,H);ctx.restore();ctx.save();ctx.globalCompositeOperation='screen';const gg=ctx.createRadialGradient(W*.5,H*.26,10,W*.5,H*.34,280);gg.addColorStop(0,'rgba(255,229,137,.24)');gg.addColorStop(1,'rgba(255,210,90,0)');ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);ctx.restore()}
  restore();
}

function drawOutlineClippedPhoto(img){
  // Draw the original mapped body only through the exact outline geometry, removing its white background.
  ctx.save();ctx.beginPath();for(const o of MALE_FRONT.outline){const p=new Path2D(o.d);ctx.save();ctx.clip(p);ctx.globalAlpha=.34;ctx.filter='grayscale(1) brightness(.55) contrast(1.45)';ctx.drawImage(img,0,0,W,H);ctx.restore();if(o.side==='LEFT'){ctx.save();ctx.translate(2*CX,0);ctx.scale(-1,1);ctx.clip(p);ctx.globalAlpha=.34;ctx.filter='grayscale(1) brightness(.55) contrast(1.45)';ctx.drawImage(img,0,0,W,H);ctx.restore()}}ctx.restore();ctx.filter='none';ctx.globalAlpha=1;
}

async function render(){
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createRadialGradient(W*.5,H*.34,40,W*.5,H*.48,850);bg.addColorStop(0,'#1a1f24');bg.addColorStop(.52,'#0d1014');bg.addColorStop(1,'#050608');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  if(!render.bodyImg){render.bodyImg=new Image();render.bodyImg.crossOrigin='anonymous';render.bodyImg.src='https://unpkg.com/@musclemap/assets@1.0.1/bodies/male-front.webp';await render.bodyImg.decode()}
  drawOutlineClippedPhoto(render.bodyImg);
  for(const m of MALE_FRONT.muscles){paintMuscle(m,false);if(m.side==='LEFT')paintMuscle(m,true)}
  toggle.textContent=chestOn?'Chest highlight ON':'Chest highlight OFF';toggle.classList.toggle('active',chestOn);
}

toggle.addEventListener('click',async()=>{chestOn=!chestOn;toggle.disabled=true;await render();toggle.disabled=false});
render();