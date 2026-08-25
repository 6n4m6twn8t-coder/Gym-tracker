(()=>{const DEMOS={
'Incline Dumbbell Press':'assets/demo/incline-db-press.svg',
'Leg Press':'assets/demo/leg-press.svg',
'Romanian Deadlift':'assets/demo/romanian-deadlift.svg'
};
function upgrade(){const sheet=document.querySelector('.anatomy-sheet');if(!sheet)return;const name=sheet.querySelector('h2')?.textContent?.trim(),src=DEMOS[name];if(!src)return;const sec=[...sheet.querySelectorAll('.anatomy-section')].find(x=>x.querySelector('h3')?.textContent.trim()==='Movement');if(!sec||sec.dataset.demoWired==='1')return;sec.dataset.demoWired='1';sec.innerHTML=`<div class="movement-head"><div><h3>Movement</h3><p>Fixed camera · controlled rep</p></div><span class="movement-loop">LOOP</span></div><img class="movement-demo" src="${src}" alt="Animated ${name} demonstration">`}
new MutationObserver(upgrade).observe(document.body,{childList:true,subtree:true});addEventListener('pageshow',()=>setTimeout(upgrade,60));setInterval(upgrade,700);setTimeout(upgrade,0)})();