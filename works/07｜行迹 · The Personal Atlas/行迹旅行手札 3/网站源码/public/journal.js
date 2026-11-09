(() => {
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=null;
 function openJournal(manual=false){
  if(active||reduced())return;
  if(!manual){try{if(sessionStorage.getItem('atlas-journal-opened'))return;sessionStorage.setItem('atlas-journal-opened','1')}catch{}}
  const previous=document.activeElement;
  const box=document.createElement('dialog');box.className='book-intro';box.setAttribute('aria-label','翻开旅行手札');
  box.innerHTML='<div class="book-caption" aria-hidden="true">EVERY JOURNEY DESERVES A PAGE</div><div class="book-stage" aria-hidden="true"><div class="book-paper"></div><div class="book-leaf"></div><div class="book-cover"><span class="book-ribbon"></span><span class="book-label">THE PERSONAL ATLAS</span><h2>行迹</h2><span class="book-subtitle">私人旅行手札</span><div class="book-seal">⌖</div></div></div><button class="book-skip" type="button">跳过 · 进入手札</button>';
  document.body.appendChild(box);active=box;let endTimer,removeTimer,cleaned=false;
  const cleanup=()=>{if(cleaned)return;cleaned=true;clearTimeout(endTimer);clearTimeout(removeTimer);box.remove();active=null;if(previous?.isConnected)previous.focus({preventScroll:true})};
  const finish=()=>{if(!box.isConnected)return;box.classList.add('leaving');clearTimeout(endTimer);removeTimer=setTimeout(()=>{box.close();cleanup()},550)};
  box.querySelector('button').onclick=()=>{box.close();cleanup()};box.addEventListener('cancel',()=>{cleanup()});box.addEventListener('close',cleanup,{once:true});
  try{box.showModal();requestAnimationFrame(()=>box.classList.add('opening'));endTimer=setTimeout(finish,2400)}catch{cleanup()}
 }
 openJournal();
 const addReplay=()=>{const footer=document.querySelector('.quote');if(!footer||document.getElementById('replayJournal'))return;const replay=document.createElement('button');replay.id='replayJournal';replay.className='replay-journal';replay.textContent='↶ 重新翻开手札';replay.hidden=reduced();replay.onclick=()=>openJournal(true);footer.after(replay)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addReplay,{once:true});else addReplay();
})();
