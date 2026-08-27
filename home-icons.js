const HOME_ICONS={
  Push:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M10 13h7M31 13h7M17 9v8M31 9v8M17 13h14"/><path d="M15 35h18"/><path d="M18 35v4M30 35v4"/><circle cx="24" cy="28" r="3.2" style="fill:currentColor;fill-opacity:.09"/><path d="M18.5 27.5c1.6-3 3.4-4.5 5.5-4.5s3.9 1.5 5.5 4.5M20 23l-2.5-5M28 23l2.5-5M17.5 18h3M27.5 18h3"/></svg>`,
  Pull:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M10 10h28M14 10l4 4M34 10l-4 4"/><circle cx="24" cy="19" r="3" style="fill:currentColor;fill-opacity:.09"/><path d="M17 16l4 4M31 16l-4 4M20 23c1.2-1.4 2.5-2 4-2s2.8.6 4 2v7c0 3-1.2 5.5-4 8-2.8-2.5-4-5-4-8v-7Z"/><path d="M16 39h16M19 39v3M29 39v3"/></svg>`,
  Legs:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M18 8c0 5.5-.8 10-2.5 14.5L13 29l6 11M30 8c0 5.5.8 10 2.5 14.5L35 29l-6 11"/><path d="M18 8h12M16 23c2.5 1.5 5.2 4 8 7.5 2.8-3.5 5.5-6 8-7.5"/><path d="M13 29h7M28 29h7"/><path d="M16.5 18c1.8 1 3.8 1.5 5.8 1.5M31.5 18c-1.8 1-3.8 1.5-5.8 1.5"/><path d="M16.5 18c.4 3.7-.3 6.7-2.1 9.2M31.5 18c-.4 3.7.3 6.7 2.1 9.2" style="fill:currentColor;fill-opacity:.07"/></svg>`,
  'Upper / Chest':`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M16 10c2 2.8 4.7 4.5 8 4.5s6-1.7 8-4.5l5 5-3 7v16H14V22l-3-7 5-5Z"/><path d="M17.5 20.5c1.8-1.8 4-2.7 6.5-2.7s4.7.9 6.5 2.7"/><path d="M18.5 21.5c1.4 3 3.2 4.5 5.5 4.5s4.1-1.5 5.5-4.5" style="fill:currentColor;fill-opacity:.08"/><path d="M19 29c1.6 1.7 3.3 2.5 5 2.5s3.4-.8 5-2.5M24 18v14"/></svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><rect x="9" y="12" width="30" height="27" rx="5"/><path d="M16 8v8M32 8v8M9 20h30"/><path d="M16 27h4M24 27h4M16 33h4M24 33h4"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M25 7c2 6 0 10-3 13-3 3-5 6-4 10 1 4 4 7 8 8-1-4 1-7 4-10 0 4 4 6 4 10 0 4-4 7-10 7-8 0-13-5-13-12 0-6 4-11 9-16 0 5 2 8 5 10 1-5 1-10 0-20Z" style="fill:currentColor;fill-opacity:.06"/></svg>`
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
