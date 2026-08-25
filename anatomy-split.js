(()=>{
  function split(root=document){
    root.querySelectorAll('.anatomy-thumb > img.ref-anatomy, .anatomy-hero-figure > img.ref-anatomy').forEach(img=>{
      if(img.dataset.split==='1') return;
      const wrap=document.createElement('div');
      wrap.className='ref-anatomy-split';
      const front=document.createElement('div');
      const back=document.createElement('div');
      front.className='ref-anatomy-half front';
      back.className='ref-anatomy-half back';
      front.style.backgroundImage=`url("${img.src}")`;
      back.style.backgroundImage=`url("${img.src}")`;
      wrap.append(front,back);
      img.replaceWith(wrap);
    });
  }
  new MutationObserver(()=>split()).observe(document.body,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(split,30));
  setInterval(split,500);
  split();
})();