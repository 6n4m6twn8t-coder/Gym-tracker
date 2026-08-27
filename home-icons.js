const HOME_ART={
  Push:window.HOME_ART_PUSH,
  Pull:window.HOME_ART_PULL,
  Legs:window.HOME_ART_LEGS,
  'Upper / Chest':window.HOME_ART_UPPER_CHEST
};

const HOME_UI_ICONS={
  calendar:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round">
    <rect x="7.5" y="10.5" width="29" height="28" rx="4.5"/>
    <path d="M14 7v7M30 7v7M7.5 18h29"/>
    <path d="M13 24h5M22 24h4M13 30h5M22 30h3" style="stroke-opacity:.7"/>
    <circle cx="35" cy="34" r="7"/>
    <path d="m31.8 34 2.2 2.2 4.5-4.8"/>
  </svg>`,
  week:`<svg viewBox="0 0 48 48" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round">
    <circle cx="24" cy="24" r="17"/>
    <path d="M14 33h4v-7h-4zM22 33h4V21h-4zM30 33h4V16h-4z"/>
    <path d="M13.5 24.5c5-1.6 9.2-4.1 12.8-7.6 2.2-2.1 4.2-4.7 6.2-7.4"/>
    <path d="m28.5 10 4.6-.8-.5 4.6"/>
  </svg>`
};

function homeIcon(name){
  const workoutArt=HOME_ART[name];
  if(workoutArt){
    return `<span class="homeIcon homeArtIcon" aria-hidden="true"><img src="${workoutArt}" alt="" draggable="false"></span>`;
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
