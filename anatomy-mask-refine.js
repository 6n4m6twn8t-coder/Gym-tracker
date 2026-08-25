(()=>{
const NS='http://www.w3.org/2000/svg';
function n(el,a){return parseFloat(el.getAttribute(a)||0)}
function pathFor(cx,cy,rx,ry){
  // Anatomical silhouettes rather than geometric circles/ovals.
  // Shoulder caps
  if(cy<80){
    return `M ${cx-rx*.9} ${cy+ry*.15} Q ${cx-rx*.75} ${cy-ry*.75} ${cx-rx*.15} ${cy-ry} Q ${cx+rx*.55} ${cy-ry*.85} ${cx+rx*.9} ${cy-ry*.15} Q ${cx+rx*.72} ${cy+ry*.72} ${cx} ${cy+ry} Q ${cx-rx*.7} ${cy+ry*.7} ${cx-rx*.9} ${cy+ry*.15} Z`;
  }
  // Glute mass
  if(cy>145&&cy<190&&cx>120){
    return `M ${cx-rx*.85} ${cy-ry*.15} Q ${cx-rx*.65} ${cy-ry*.8} ${cx} ${cy-ry} Q ${cx+rx*.7} ${cy-ry*.72} ${cx+rx*.9} ${cy-ry*.05} Q ${cx+rx*.75} ${cy+ry*.72} ${cx+rx*.12} ${cy+ry} Q ${cx-rx*.65} ${cy+ry*.82} ${cx-rx*.85} ${cy-ry*.15} Z`;
  }
  // Calves
  if(cy>210){
    return `M ${cx-rx*.25} ${cy-ry} Q ${cx+rx*.72} ${cy-ry*.55} ${cx+rx*.72} ${cy-ry*.05} Q ${cx+rx*.52} ${cy+ry*.48} ${cx+rx*.1} ${cy+ry} Q ${cx-rx*.38} ${cy+ry*.55} ${cx-rx*.65} ${cy+ry*.05} Q ${cx-rx*.75} ${cy-ry*.5} ${cx-rx*.25} ${cy-ry} Z`;
  }
  // Upper-arm muscles: tapered spindle following the limb instead of an oval
  return `M ${cx-rx*.2} ${cy-ry} Q ${cx+rx*.65} ${cy-ry*.55} ${cx+rx*.72} ${cy} Q ${cx+rx*.5} ${cy+ry*.72} ${cx} ${cy+ry} Q ${cx-rx*.55} ${cy+ry*.7} ${cx-rx*.72} ${cy} Q ${cx-rx*.62} ${cy-ry*.55} ${cx-rx*.2} ${cy-ry} Z`;
}
function segmentedCore(svg,rect){
  const x=n(rect,'x'),y=n(rect,'y'),w=n(rect,'width'),h=n(rect,'height');
  const fill=rect.getAttribute('fill'),fo=rect.getAttribute('fill-opacity'),stroke=rect.getAttribute('stroke'),sw=rect.getAttribute('stroke-width');
  const g=document.createElementNS(NS,'g');
  const gap=1.5,row=(h-gap*5)/6;
  for(let i=0;i<6;i++){
    const yy=y+i*(row+gap), inset=(i===0||i===5)?2:0;
    const p=document.createElementNS(NS,'path');
    p.setAttribute('d',`M ${x+inset} ${yy+row*.1} Q ${x+w/2} ${yy-1} ${x+w-inset} ${yy+row*.1} L ${x+w-inset-1} ${yy+row*.9} Q ${x+w/2} ${yy+row+1} ${x+inset+1} ${yy+row*.9} Z`);
    p.setAttribute('fill',fill);p.setAttribute('fill-opacity',fo||'.72');p.setAttribute('stroke',stroke||'rgba(10,10,12,.72)');p.setAttribute('stroke-width',sw||'1');g.appendChild(p);
  }
  rect.replaceWith(g);
}
function refine(root=document){
  root.querySelectorAll('svg.real-anatomy-overlay').forEach(svg=>{
    if(svg.dataset.refined==='1')return;
    svg.querySelectorAll('ellipse').forEach(el=>{
      const p=document.createElementNS(NS,'path');
      p.setAttribute('d',pathFor(n(el,'cx'),n(el,'cy'),n(el,'rx'),n(el,'ry')));
      for(const a of ['fill','fill-opacity','stroke','stroke-width']){if(el.hasAttribute(a))p.setAttribute(a,el.getAttribute(a))}
      el.replaceWith(p);
    });
    svg.querySelectorAll('rect').forEach(r=>segmentedCore(svg,r));
    svg.dataset.refined='1';
  });
}
new MutationObserver(()=>refine()).observe(document.body,{childList:true,subtree:true});
addEventListener('pageshow',()=>setTimeout(refine,40));
setInterval(refine,500);setTimeout(refine,0);
})();