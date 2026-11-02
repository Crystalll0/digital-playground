(function(){
  'use strict';
  const $=id=>document.getElementById(id),E=window.CrunchEconomy,art=window.CrunchArt;
  let category='scene';
  function refreshWallet(){const p=E.load();$('wallet-coins').textContent=p.wallet.toLocaleString('en');$('shop-wallet').textContent=p.wallet.toLocaleString('en');$('result-wallet').textContent='WALLET '+p.wallet+' COINS';if(!E.persistent)$('save-note').textContent='Browser storage is unavailable. Your progress will last for this open session only.';}
  function previewAll(){for(const c of document.querySelectorAll('[data-dog]'))art.draw(c,'dog',c.dataset.dog);for(const c of document.querySelectorAll('[data-bonus]'))art.draw(c,'power',c.dataset.bonus);}
  function render(){
    refreshWallet();const p=E.load(),grid=$('shop-grid');grid.replaceChildren();
    for(const item of E.CATALOG.filter(a=>a.category===category)){
      const owned=p.owned.includes(item.id),equipped=p.equipped[category]===item.id;
      const card=document.createElement('article');card.className='shop-card'+(equipped?' equipped':'');
      const visual=document.createElement('div');visual.className='shop-item-art';
      if(category==='scene'){const image=document.createElement('img');image.src=item.asset;image.alt=item.name+' diner scene';visual.append(image);}else{const c=document.createElement('canvas');c.width=120;c.height=115;c.setAttribute('aria-label',item.name);art.draw(c,category,item.id);visual.append(c);}
      const title=document.createElement('h3');title.textContent=item.name;const desc=document.createElement('p');desc.textContent=item.description;
      const price=document.createElement('span');price.className='item-price';price.textContent=owned?'OWNED':'◈ '+item.price+' COINS';
      const button=document.createElement('button');button.className='small-button';button.dataset.item=item.id;button.disabled=equipped;button.textContent=equipped?'✓ EQUIPPED':owned?'EQUIP':p.wallet>=item.price?'UNLOCK & EQUIP':'SAVE '+(item.price-p.wallet)+' MORE';button.setAttribute('aria-label',(equipped?'Equipped ':owned?'Equip ':'Unlock ')+item.name);
      button.addEventListener('click',()=>{const result=owned?E.wear(item.id):E.buy(item.id);$('shop-message').textContent=result.message;render();});
      card.append(visual,title,desc,price,button);grid.append(card);
    }
    for(const b of document.querySelectorAll('[data-category]')){b.setAttribute('aria-selected',String(b.dataset.category===category));b.tabIndex=b.dataset.category===category?0:-1;}
    $('custom-color-panel').hidden=category!=='ghost'||!p.owned.includes('custom');$('ghost-color').value=p.ghostColor;art.draw($('custom-ghost-preview'),'ghost','custom');
  }
  function openShop(){window.dispatchEvent(new Event('crunch-shop-open'));render();previewAll();$('shop-dialog').showModal();}
  for(const id of ['shop-button','results-shop-button'])$(id).addEventListener('click',openShop);
  for(const id of ['close-shop','shop-done'])$(id).addEventListener('click',()=>$('shop-dialog').close());
  $('shop-dialog').addEventListener('close',()=>window.dispatchEvent(new Event('crunch-shop-close')));
  for(const button of document.querySelectorAll('[data-category]')){
    button.addEventListener('click',()=>{category=button.dataset.category;render();});
    button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-category]')],i=tabs.indexOf(button),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();tabs[next].focus();});
  }
  $('save-ghost-color').addEventListener('click',()=>{const r=E.setGhostColor($('ghost-color').value);$('shop-message').textContent=r.message||'Unlock your own ghost first.';render();});
  window.addEventListener('crunch-profile-change',()=>{refreshWallet();if($('shop-dialog').open)render();});
  refreshWallet();previewAll();
})();
