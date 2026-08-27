const HOME_ICONS={
  Push:`<svg viewBox="0 0 64 64" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round">
    <path d="M10 46c3-8 7-14 13-18 2-1 4-2 6-2-2-3-2-7 0-10 2-4 6-6 10-4 4 2 5 7 2 11l-4 5c5-2 11-2 16 1 5 3 8 8 8 14H38c-6 0-11-1-15-4-3-2-5-5-6-8"/>
    <path d="M23 28c4 1 7 4 9 8M36 28c-2 2-3 5-3 8M39 34c4-2 8-2 12 0" style="stroke-opacity:.6"/>
  </svg>`,
  Pull:`<svg viewBox="0 0 64 64" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round">
    <circle cx="32" cy="10" r="4"/>
    <path d="M24 17c-5 2-9 5-12 10l-4 7 6 4 6-8 2 20h20l2-20 6 8 6-4-4-7c-3-5-7-8-12-10-3 2-5 3-8 3s-5-1-8-3Z"/>
    <path d="M22 22c2 6 5 10 10 13 5-3 8-7 10-13M24 36c2 3 5 5 8 6 3-1 6-3 8-6M32 20v27" style="stroke-opacity:.58"/>
  </svg>`,
  Legs:`<svg viewBox="0 0 64 64" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round">
    <path d="M23 9c0 8-1 15-4 21l-3 8 5 16h8l2-17 1-12M41 9c0 8 1 15 4 21l3 8-5 16h-8l-2-17-1-12"/>
    <path d="M23 9h18M20 26c4 1 8 4 12 9 4-5 8-8 12-9M21 38h8M35 38h8" style="stroke-opacity:.62"/>
    <path d="M26 14c1 5 3 9 6 12 3-3 5-7 6-12" style="stroke-opacity:.42"/>
  </svg>`,
  'Upper / Chest':`<svg viewBox="0 0 64 64" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round">
    <path d="M22 12c3 4 6 6 10 6s7-2 10-6l9 7-5 10-3 23H21l-3-23-5-10 9-7Z"/>
    <path d="M20 27c3-4 7-6 12-6s9 2 12 6M22 29c2 5 5 7 10 7s8-2 10-7M32 21v25M25 42c2 2 4 3 7 3s5-1 7-3" style="stroke-opacity:.58"/>
    <path d="M24 34c2 1 5 2 8 2s6-1 8-2" style="stroke-opacity:.38"/>
  </svg>`,
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><rect x="9" y="12" width="30" height="27" rx="5"/><path d="M16 8v8M32 8v8M9 20h30"/><path d="M16 27h4M24 27h4M16 33h4M24 33h4"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M25 7c2 6 0 10-3 13-3 3-5 6-4 10 1 4 4 7 8 8-1-4 1-7 4-10 0 4 4 6 4 10 0 4-4 7-10 7-8 0-13-5-13-12 0-6 4-11 9-16 0 5 2 8 5 10 1-5 1-10 0-20Z"/></svg>`
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
