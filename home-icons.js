const HOME_ICONS={
  Push:`<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M12 46c2-7 5-13 10-17 4-3 8-3 12 0l4-5c3-4 4-8 3-13 5-1 9 2 9 7 0 4-2 8-5 12l-4 5c5-1 10 0 14 3 3 2 5 5 5 9H36c-9 0-17 0-24-1Z" style="fill:currentColor;fill-opacity:.82;stroke:none"/>
    <path d="M22 31c4 1 7 4 9 9M38 24c1 4 0 8-3 12M41 35c-4 1-7 4-9 8" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.9"/>
  </svg>`,
  Pull:`<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="11" r="5" style="fill:currentColor;fill-opacity:.78;stroke:none"/>
    <path d="M23 19c3-2 6-3 9-3s6 1 9 3c5 2 9 6 12 11l4 7-6 4-6-8-2 19H21l-2-19-6 8-6-4 4-7c3-5 7-9 12-11Z" style="fill:currentColor;fill-opacity:.76;stroke:none"/>
    <path d="M22 22c2 5 5 8 10 10 5-2 8-5 10-10M24 34c2 3 5 5 8 6 3-1 6-3 8-6M32 18v28" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.9"/>
  </svg>`,
  Legs:`<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M20 11h24l-2 13-6 12-1 19h-9l2-20-6-11-2-13Z" style="fill:currentColor;fill-opacity:.77;stroke:none"/>
    <path d="M44 11c0 7-1 13-3 19l5 10-2 15h-9l1-19-4-12 3-13h9Z" style="fill:currentColor;fill-opacity:.77;stroke:none"/>
    <path d="M23 23c3 1 6 3 9 6 3-3 6-5 9-6M28 35c-1 6-2 11-2 16M36 35c1 6 1 11 0 16" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.9"/>
  </svg>`,
  'Upper / Chest':`<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M20 15c4 4 8 6 12 6s8-2 12-6l8 7-5 9-3 21H20l-3-21-5-9 8-7Z" style="fill:currentColor;fill-opacity:.76;stroke:none"/>
    <path d="M19 27c4-4 8-6 13-6s9 2 13 6M21 29c2 5 6 7 11 7s9-2 11-7M32 22v23M24 42c2 2 5 3 8 3s6-1 8-3" style="fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.92"/>
  </svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><rect x="9" y="12" width="30" height="27" rx="5"/><path d="M16 8v8M32 8v8M9 20h30"/><path d="M16 27h4M24 27h4M16 33h4M24 33h4"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="stroke-width:1.6"><path d="M25 7c2 6 0 10-3 13-3 3-5 6-4 10 1 4 4 7 8 8-1-4 1-7 4-10 0 4 4 6 4 10 0 4-4 7-10 7-8 0-13-5-13-12 0-6 4-11 9-16 0 5 2 8 5 10 1-5 1-10 0-20Z" style="fill:currentColor;fill-opacity:.12"/></svg>`
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
