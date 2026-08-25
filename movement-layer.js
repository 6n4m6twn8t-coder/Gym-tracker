(()=>{const DEMOS={
'Incline Dumbbell Press':'assets/demo/incline-db-press.svg',
'Leg Press':'assets/demo/leg-press.svg',
'Romanian Deadlift':'assets/demo/romanian-deadlift.svg',
'Leg Extension':'assets/demo/leg-extension.svg',
'Seated Leg Curl':'assets/demo/seated-leg-curl.svg',
'Standing Calf Raise':'assets/demo/standing-calf-raise.svg',
'Hanging Knee Raise':'assets/demo/hanging-knee-raise.svg'
};function apply(){const sheet=document.querySelector('.anatomy-sheet');if(!sheet)return;const name=sheet.querySelector('h2')?.textContent?.trim(),src=DEMOS[name];if(!src)return;let section=[...sheet.querySelectorAll('.anatomy-section')].find(x=>x.querySelector('h3')?.textContent?.trim()==='Movement');if(!section)return;if(section.dataset.movementReady===src)return;section.dataset.movementReady=src;section.classList.add('movement-section');section.innerHTML=`<div class="movement-head"><div><h3>Movement</h3><p>Fixed camera · controlled rep</p></div><span class="movement-loop">LOOP</span></div><img class="movement-demo" src="${src}" alt="Animated ${name} demonstration">`;}new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});addEventListener('pageshow',()=>setTimeout(apply,80));setInterval(apply,600);})();