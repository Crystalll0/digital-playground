/* Persistent cosmetics and wallet. All prices are earned in-game coins. */
(function(root){
  'use strict';
  const KEY='crunch-course-stage-05-profile';
  const CATALOG=[
    {id:'classic',category:'scene',name:'The Original Diner',price:0,description:'Red booths. Golden mornings.',asset:'assets/diner.png'},
    {id:'strawberry',category:'scene',name:'Strawberry Social',price:120,description:'A pink milkshake kind of morning.',asset:'assets/strawberry-diner.png'},
    {id:'midnight',category:'scene',name:'Midnight Munchies',price:240,description:'Moonlight, warm lamps, late-night crunch.',asset:'assets/midnight-diner.png'},
    {id:'original',category:'flavour',name:'Golden Original',price:0,description:'The classic crispy little friend.'},
    {id:'ketchup',category:'flavour',name:'Ketchup Cutie',price:60,description:'A sweet red sauce swirl.'},
    {id:'cream',category:'flavour',name:'Sour Cream Dream',price:60,description:'Creamy drizzle, maximum comfort.'},
    {id:'maple',category:'flavour',name:'Maple Morning',price:120,description:'A glossy maple zigzag.'},
    {id:'vanilla',category:'ghost',name:'Vanilla Spirit',price:0,description:'The original dramatic little soul.',color:'#fff8e7'},
    {id:'mint',category:'ghost',name:'Minty Phantom',price:60,description:'A fresh mint cloud of feelings.',color:'#b7eed6'},
    {id:'lavender',category:'ghost',name:'Lavender Boo',price:120,description:'Soft purple, big potato feelings.',color:'#d9c3fc'},
    {id:'custom',category:'ghost',name:'Your Very Own Boo',price:240,description:'Unlock the ghost color picker.',color:'#ffbdce'},
    {id:'chili',category:'bomb',name:'Chili Trouble',price:0,description:'The original spicy little menace.'},
    {id:'pepper',category:'bomb',name:'Pepper Pop',price:60,description:'A smoky cocoa-colored pepper bomb.'},
    {id:'tomato',category:'bomb',name:'Tomato Tantrum',price:120,description:'Round, red, and ready to misbehave.'}
  ];
  const DEFAULTS={scene:'classic',flavour:'original',ghost:'vanilla',bomb:'chili'};
  function fresh(){return {version:2,wallet:0,lifetimeEarned:0,owned:Object.values(DEFAULTS),equipped:{...DEFAULTS},ghostColor:'#ffbdce',transactions:[]};}
  function sanitize(raw){const p=fresh();if(!raw||typeof raw!=='object')return p;const integer=n=>Number.isSafeInteger(n)&&n>=0?n:0;p.wallet=integer(raw.wallet);p.lifetimeEarned=integer(raw.lifetimeEarned);p.owned=[...new Set([...p.owned,...(Array.isArray(raw.owned)?raw.owned:[]).filter(id=>CATALOG.some(a=>a.id===id))])];for(const c of Object.keys(DEFAULTS)){const id=raw.equipped?.[c];if(p.owned.includes(id)&&CATALOG.some(a=>a.id===id&&a.category===c))p.equipped[c]=id;}if(/^#[a-f0-9]{6}$/i.test(raw.ghostColor||''))p.ghostColor=raw.ghostColor;p.transactions=(Array.isArray(raw.transactions)?raw.transactions:[]).filter(x=>typeof x==='string').slice(-1024);return p;}
  function purchase(p,id){const a=CATALOG.find(a=>a.id===id);if(!a)return {ok:false,message:'That treat is not on the menu.'};if(p.owned.includes(id))return {ok:false,message:'Already yours. No extra coins spent.'};if(p.wallet<a.price)return {ok:false,message:`Save ${a.price-p.wallet} more coins for this treat.`};p.wallet-=a.price;p.owned.push(id);p.equipped[a.category]=id;return {ok:true,message:`${a.name} unlocked and equipped!`};}
  function equip(p,id){const a=CATALOG.find(a=>a.id===id);if(!a||!p.owned.includes(id))return {ok:false,message:'Unlock this treat first.'};p.equipped[a.category]=id;return {ok:true,message:`${a.name} equipped.`};}
  function credit(p,id,amount){if(!Number.isSafeInteger(amount)||amount<0||typeof id!=='string')return {ok:false};if(p.transactions.includes(id))return {ok:false,duplicate:true};p.wallet+=amount;p.lifetimeEarned+=amount;p.transactions.push(id);p.transactions=p.transactions.slice(-1024);return {ok:true};}
  let memory=fresh(),persistent=true;
  function load(){try{const s=root.localStorage?.getItem(KEY);if(s)memory=sanitize(JSON.parse(s));}catch{persistent=false;}return sanitize(memory);}
  function change(fn,reason){const p=load(),result=fn(p);if(result.ok){memory=p;try{root.localStorage?.setItem(KEY,JSON.stringify(p));}catch{persistent=false;}root.dispatchEvent?.(new CustomEvent('crunch-profile-change',{detail:{reason}}));}return result;}
  const api={CATALOG,DEFAULTS,fresh,sanitize,purchase,equip,credit,load,KEY,get persistent(){return persistent;},buy:id=>change(p=>purchase(p,id),'equip'),wear:id=>change(p=>equip(p,id),'equip'),bank:(id,amount)=>change(p=>credit(p,id,amount),'credit'),setGhostColor:color=>change(p=>{if(!p.owned.includes('custom')||!/^#[a-f0-9]{6}$/i.test(color))return {ok:false};p.ghostColor=color;p.equipped.ghost='custom';return {ok:true,message:'Your ghost color is saved.'};},'equip')};
  root.addEventListener?.('storage',e=>{if(e.key===KEY)root.dispatchEvent(new CustomEvent('crunch-profile-change',{detail:{reason:'storage'}}));});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CrunchEconomy=api;
})(typeof window!=='undefined'?window:globalThis);
