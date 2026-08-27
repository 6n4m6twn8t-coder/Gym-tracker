const HOME_ART={
  Push:window.HOME_ART_PUSH,
  Pull:window.HOME_ART_PULL,
  Legs:window.HOME_ART_LEGS,
  'Upper / Chest':window.HOME_ART_UPPER_CHEST
};

const HOME_UI_ICONS={
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><rect x="9" y="12" width="30" height="27" rx="5"/><path d="M16 8v8M32 8v8M9 20h30"/><path d="M16 27h4M24 27h4M16 33h4M24 33h4"/></svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M25 7c2 6 0 10-3 13-3 3-5 6-4 10 1 4 4 7 8 8-1-4 1-7 4-10 0 4 4 6 4 10 0 4-4 7-10 7-8 0-13-5-13-12 0-6 4-11 9-16 0 5 2 8 5 10 1-5 1-10 0-20Z"/></svg>`
};

function homeIcon(name){
  const art=HOME_ART[name];
  if(art){
    return `<span class="homeIcon homeArtIcon" aria-hidden="true"><img src="${art}" alt="" draggable="false"></span>`;
  }
  return `<span class="homeIcon" aria-hidden="true">${HOME_UI_ICONS[name]||''}</span>`;
}

function decorateHomeIcons(){
  const hero=document.querySelector('.homeHeroMark');
  if(hero){
    const title=document.querySelector('.homeHeroTitle')?.textContent?.trim();
    hero.innerHTML=homeIcon(title);
    hero.classList.add('iconArt','assetArt');
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
