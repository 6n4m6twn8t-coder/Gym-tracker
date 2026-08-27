const HOME_ICONS={
  Push:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><path d="M9 12h6M33 12h6M15 8v8M33 8v8M15 12h18"/><path d="M24 32V18M20 22l4-4 4 4"/><path d="M14 36h20M18 36v4M30 36v4"/></svg>`,
  Pull:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><path d="M11 10h26M14 10l5 5M34 10l-5 5"/><path d="M24 15v14M20 25l4 4 4-4"/><circle cx="24" cy="34" r="3.5"/><path d="M17 41c2-3 4-4 7-4s5 1 7 4"/></svg>`,
  Legs:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><path d="M18 8c0 7-1 12-3 17l-2 7 6 8M30 8c0 7 1 12 3 17l2 7-6 8"/><path d="M18 8h12M16 24c2 1 5 3 8 7 3-4 6-6 8-7M13 32h8M27 32h8"/></svg>`,
  'Upper / Chest':`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><path d="M16 10c2 3 5 5 8 5s6-2 8-5l5 5-3 7v16H14V22l-3-7 5-5Z"/><path d="M17 21c2-2 4-3 7-3s5 1 7 3M24 18v15M18 29c2 2 4 3 6 3s4-1 6-3"/></svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><rect x="9" y="12" width="30" height="27" rx="5"/><path d="M16 8v8M32 8v8M9 20h30"/><path d="M16 27h4M24 27h4M16 33h4M24 33h4"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.75"><path d="M25 7c2 6 0 10-3 13-3 3-5 6-4 10 1 4 4 7 8 8-1-4 1-7 4-10 0 4 4 6 4 10 0 4-4 7-10 7-8 0-13-5-13-12 0-6 4-11 9-16 0 5 2 8 5 10 1-5 1-10 0-20Z"/></svg>`
};

function homeIcon(name){
  return `<span class="homeIcon" aria-hidden="true">${HOME_ICONS[name]||''}</span>`;
}

function decorateHomeIcons(){
  const hero=document.querySelector('.homeHeroMark');
  if(hero){
    const title=document.querySelector('.homeHeroTitle')?.textContent?.trim();
    hero.innerHTML=homeIcon(title);
    hero.classList.add('iconArt');
  }

  document.querySelectorAll('.rotationItem').forEach((item,i)=>{
    const name=typeof ROTATION!=='undefined'?ROTATION[i]:null;
    const dot=item.querySelector('.rotationDot');
    if(name&&dot)dot.innerHTML=homeIcon(name);
  });

  document.querySelectorAll('.homeSession').forEach(button=>{
    const name=button.dataset.homeStart;
    const icon=button.querySelector('.homeSessionIcon');
    if(name&&icon)icon.innerHTML=homeIcon(name);
  });

  const stats=document.querySelectorAll('.homeStat');
  if(stats[0]&&!stats[0].querySelector('.homeStatIcon'))stats[0].insertAdjacentHTML('afterbegin',`<span class="homeStatIcon">${homeIcon('calendar')}</span>`);
  if(stats[1]&&!stats[1].querySelector('.homeStatIcon'))stats[1].insertAdjacentHTML('afterbegin',`<span class="homeStatIcon">${homeIcon('week')}</span>`);
}

if(typeof renderHome==='function'){
  const renderHomeWithIcons=renderHome;
  renderHome=function(){
    renderHomeWithIcons();
    decorateHomeIcons();
  };
}

decorateHomeIcons();
