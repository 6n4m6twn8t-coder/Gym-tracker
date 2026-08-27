const HOME_ICONS={
  Push:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 29c4-1 7-4 9-8l3-7 5 2-2 6c4-1 8 0 11 3 3 2 5 6 5 10H27c-6 0-11-1-15-4l-3-2Z"/><path d="M19 21c-2 5-5 8-10 10M27 35c-3-3-4-7-3-13"/></svg>`,
  Pull:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 10h24M16 10v8M32 10v8M14 18l5 3M34 18l-5 3"/><path d="M19 21v6c0 5 2 9 5 12 3-3 5-7 5-12v-6M14 39h20"/><circle cx="24" cy="18" r="4"/></svg>`,
  Legs:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 9c0 8-1 14-3 20l-2 10M30 9c0 8 1 14 3 20l2 10"/><path d="M18 9h12M17 24c3 2 5 5 7 10 2-5 4-8 7-10M13 39h8M27 39h8"/></svg>`,
  'Upper / Chest':`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 10c2 3 5 5 8 5s6-2 8-5l6 5-4 7v16H14V22l-4-7 6-5Z"/><path d="M18 18c2 2 4 3 6 3s4-1 6-3M24 21v13M17 28h14"/></svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="11" width="32" height="29" rx="5"/><path d="M15 7v8M33 7v8M8 19h32M15 25h5M24 25h5M15 32h5M24 32h5"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 6c2 7-1 11-4 14-3 3-5 5-4 9 1 3 3 5 6 6-1-4 1-7 4-10 1 4 5 6 5 11 0 5-4 8-10 8-8 0-13-5-13-12 0-7 5-12 10-17 0 5 2 8 6 10 0-6 1-11 0-19Z"/></svg>`
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
