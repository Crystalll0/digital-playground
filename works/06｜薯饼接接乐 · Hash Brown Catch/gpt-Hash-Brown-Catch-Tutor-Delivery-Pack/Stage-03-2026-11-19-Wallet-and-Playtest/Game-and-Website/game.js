/* Hash Brown Catch — p5.js sketch.
 * Week 4: pointer, touch and keyboard input.
 * Week 5: generated pixel sprites and four-frame sprite animation.
 * Week 6: original synthesized feedback sounds, started by user interaction.
 */
(function(){
  'use strict';
  const $=id=>document.getElementById(id), R=window.CrunchRules, E=window.CrunchEconomy;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let level='medium', cfg=R.config(level), state=R.newState(cfg), mode='menu';
  let muted=read('crunch-stage-03-muted')==='true', audio=null, sketch=null, lastBest=0;
  let basket={x:480,y:485,w:162}, items=[], particles=[], splats=[], ghosts=[], labels=[], catches=[];
  let spawnTimer=.55, shake=0, flash=0, comboTime=0, pointer=null, dragging=false, lastHUD=-1;
  let W=960,H=600, keyboard=new Set(), bg=null, sprites={};
  let profile=E.load(),roundId='',dogPlan=null,dogSpawned=false,shopPaused=false,sceneVersion=0,changeScene=null;
  const pad=n=>String(Math.max(0,Math.floor(n))).padStart(3,'0');
  function read(key){try{return localStorage.getItem(key);}catch{return null;}}
  function write(key,val){try{localStorage.setItem(key,String(val));}catch{}}
  function best(){return Number(read(R.recordKey(level,cfg)))||0;}
  function announce(s){$('announcer').textContent=s;}
  function formatTime(n){n=Math.max(0,Math.ceil(n));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}

  // Original pixel sprites: toasted edges, broad oil highlights and a quiet face area.
  function makePotato(frame=0,burnt=false,limbs=false,flavour='original'){
    const c=document.createElement('canvas');c.width=40;c.height=52;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    const outline=burnt?'#65442f':'#9b531c',edge=burnt?'#80593a':'#df8a22';
    const base=burnt?'#a17850':'#ffc24b',light=burnt?'#ba9365':'#ffdd78';
    const ranges=[[2,13,25],[3,10,28],[4,8,30],[6,6,32],[9,5,33],[13,4,34],[32,5,33],[37,6,32],[41,8,30],[43,11,27],[44,14,24]];
    const shape=new Map();for(let y=2;y<45;y++){let v=ranges[0];for(const r of ranges)if(y>=r[0])v=r;shape.set(y,[v[1],v[2]]);}
    if(limbs){g.fillStyle=outline;g.fillRect(1,29,5,3);g.fillRect(1,27,3,3);g.fillRect(33,29,5,3);g.fillRect(35,27,3,3);g.fillRect(12,43,3,5);g.fillRect(10,46,5,2);g.fillRect(25,43,3,5);g.fillRect(25,46,5,2);}
    for(const [y,[l,r]] of shape){
      g.fillStyle=outline;g.fillRect(l,y,r-l,1);
      if(y>3&&y<43){g.fillStyle=edge;g.fillRect(l+1,y,r-l-2,1);}
      if(y>5&&y<41){g.fillStyle=burnt?base:y<16?'#ffd15a':y<31?base:'#f7b23c';g.fillRect(l+2,y,r-l-5,1);}
    }
    // One connected highlight and a few broad edge accents, never clustered flecks.
    g.fillStyle=light;g.fillRect(12,7,12,3);g.fillRect(9,10,6,3);g.fillRect(8,13,4,7);g.fillRect(7,20,3,3);
    g.fillStyle=burnt?'#d2ae7b':'#fff0b1';g.fillRect(13,7,8,2);g.fillRect(9,12,2,5);
    g.fillStyle=burnt?'#8b623e':'#eda029';g.fillRect(28,14,3,8);g.fillRect(28,34,2,5);g.fillRect(13,40,12,2);
    if(!burnt){
      // Five low-contrast potato flakes, spaced out and kept away from the face.
      g.fillStyle='#efb13c';g.fillRect(17,12,4,2);g.fillRect(23,17,3,2);g.fillRect(11,21,3,1);g.fillRect(12,36,4,2);g.fillRect(23,38,3,1);
      // Tiny irregular crust steps give the rim a fried, rather than glossy-plastic, finish.
      g.fillStyle='#d98922';g.fillRect(4,17,2,4);g.fillRect(32,23,2,3);g.fillRect(8,39,3,2);
      g.fillStyle='#ffe290';g.fillRect(12,16,2,3);g.fillRect(25,10,2,2);g.fillRect(8,33,2,2);
    }
    if(!burnt&&flavour!=='original'){
      g.fillStyle={ketchup:'#cf4a31',cream:'#fff7dc',maple:'#b8772b'}[flavour]||'#ffc24b';
      g.fillRect(12,11,13,2);g.fillRect(22,13,3,2);g.fillRect(11,15,14,2);g.fillRect(11,17,3,2);
      g.fillStyle=flavour==='ketchup'?'#ec7a4e':flavour==='cream'?'#fffdf2':'#edbe6a';g.fillRect(13,11,8,1);
    }
    // Keep the entire cheek and expression area free of surface texture.
    if(!burnt){g.fillStyle='#f59673';g.fillRect(8,29,5,2);g.fillRect(26,29,5,2);}
    g.fillStyle=burnt?'#523825':'#60391e';
    if(burnt){for(const x of [12,24]){g.fillRect(x,24,2,2);g.fillRect(x+2,26,2,2);g.fillRect(x+2,24,2,2);g.fillRect(x,26,2,2);}g.fillRect(18,33,5,1);}
    else if(frame===2){g.fillRect(11,26,2,2);g.fillRect(13,24,2,2);g.fillRect(15,26,2,2);g.fillRect(24,26,2,2);g.fillRect(26,24,2,2);g.fillRect(28,26,2,2);}
    else if(frame===3){g.fillRect(12,26,4,1);g.fillRect(25,26,4,1);}
    else{g.fillRect(12,24,3,4);g.fillRect(25,24,3,4);g.fillStyle='#fff8dd';g.fillRect(12,24,1,1);g.fillRect(25,24,1,1);}
    if(!burnt){g.fillStyle='#754121';if(frame===1||frame===2){g.fillRect(18,31,6,3);g.fillRect(19,34,4,1);g.fillStyle='#f29279';g.fillRect(19,33,4,1);}else{g.fillRect(18,31,1,2);g.fillRect(19,33,4,1);g.fillRect(23,31,1,2);}}
    return c;
  }
  function makeBomb(frame=0,kind='chili'){
    const c=document.createElement('canvas');c.width=36;c.height=42;const g=c.getContext('2d');
    const block=(color,x,y,w,h)=>{const map=kind==='pepper'?{'#743027':'#463b32','#a92424':'#665343','#e24a2b':'#887057','#fb7550':'#b39870','#f9a06a':'#d4ba8a'}:{};g.fillStyle=map[color]||color;g.fillRect(x,y,w,h);};
    block('#60311f',16,7,7,7);block('#56813f',17,4,4,9);block('#80a04b',20,2,7,4);block('#743027',8,14,21,20);block('#743027',5,18,26,12);block('#a92424',8,16,20,17);block('#e24a2b',8,18,16,12);block('#fb7550',9,18,5,8);block('#f9a06a',10,17,4,4);block('#522921',12,25,3,3);block('#522921',23,25,3,3);block('#522921',17,30,5,2);block('#fcbb36',28,7,3,3);block('#ffe894',30,4+(frame%2)*2,3,3);block('#b85c25',26,10,2,5);block('#60311f',11,34,15,3);
    if(kind==='tomato'){g.clearRect(0,0,36,42);block('#8b2f23',8,13,22,21);block('#8b2f23',5,17,28,13);block('#e85735',8,16,22,16);block('#ff9d65',10,18,5,6);block('#668348',13,10,14,4);block('#79994f',17,6,4,12);block('#522921',13,23,3,3);block('#522921',24,23,3,3);block('#fff0b3',20,28,2,5);block('#f3b035',29,7,3,3);block('#fff0b3',31,4+frame%2,3,3);}
    return c;
  }
  function makePowerup(kind){
    const c=document.createElement('canvas');c.width=40;c.height=48;const g=c.getContext('2d');const b=(co,x,y,w,h)=>{g.fillStyle=co;g.fillRect(x,y,w,h);};
    if(kind==='clock'){b('#8a4932',7,12,26,24);b('#8a4932',4,17,32,14);b('#fff0bd',9,14,22,20);b('#f8d981',7,18,26,12);b('#fff6d7',10,16,20,15);b('#d34d35',6,7,10,6);b('#d34d35',25,7,10,6);b('#75492f',12,36,4,4);b('#75492f',26,36,4,4);b('#75492f',19,18,2,9);b('#75492f',20,25,8,2);}
    else if(kind==='coffee'){b('#71442b',6,18,25,19);b('#71442b',29,20,8,12);b('#fff4d9',8,20,21,15);b('#fff4d9',31,22,4,8);b('#7b4429',9,18,20,4);b('#e6bc7e',11,19,12,1);b('#d34d35',9,26,20,5);b('#a88660',4,38,31,3);b('#d8c2a2',12,5,2,8);b('#d8c2a2',22,7,2,8);}
    else{b('#65422e',15,4,12,5);b('#875b34',13,9,16,7);b('#65422e',10,16,22,25);b('#b86b38',12,17,18,22);b('#dc4e36',11,24,20,11);b('#fff0d1',13,27,16,5);b('#fff0d1',16,9,2,9);b('#e3a05d',13,18,3,6);}
    return c;
  }
  function makeDog(variant=0,frame=0){
    const c=document.createElement('canvas');c.width=56;c.height=58;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(makePotato(frame,false,false),8,3);const b=(co,x,y,w,h)=>{g.fillStyle=co;g.fillRect(x,y,w,h);};
    b('#8d4f2b',1,17,10,18);b('#8d4f2b',43,17,10,18);b('#b7753a',3,19,5,12);b('#b7753a',46,19,5,12);b('#8d4f2b',17,45,5,8);b('#8d4f2b',33,45,5,8);b('#e9a140',14,46,8,4);b('#e9a140',33,46,8,4);
    const accent=['#66519b','#c94e32','#4b9594'][variant%3];
    if(variant===0){b(accent,17,24,23,7);b('#fff3d0',20,26,4,2);b('#fff3d0',32,26,4,2);}
    else if(variant===1){b(accent,17,6,5,8);b(accent,34,6,5,8);b('#754121',20,26,5,2);b('#754121',31,26,5,2);}
    else{b(accent,12,11,34,5);b(accent,9,16,4,10);b(accent,43,16,4,10);b('#b8ece0',17,11,16,2);}
    b('#eec479',20,32,16,8);b('#573a26',25,32,6,3);b('#754121',23,38,11,2);b('#fff3d7',31,38,2,3);b(accent,22,44,12,3);return c;
  }
  function makeMash(){const c=document.createElement('canvas');c.width=50;c.height=23;const g=c.getContext('2d');const r=(co,x,y,w,h)=>{g.fillStyle=co;g.fillRect(x,y,w,h);};r('#88745c',4,14,42,5);r('#88745c',9,10,31,8);r('#88745c',15,6,22,10);r('#88745c',19,4,11,9);r('#c9b898',5,15,40,3);r('#dbcbab',10,12,29,5);r('#dbcbab',16,8,20,6);r('#dbcbab',20,6,9,6);r('#efe0bc',17,9,8,2);r('#5d4431',18,13,3,3);r('#5d4431',31,13,3,3);r('#5d4431',25,17,3,2);r('#5d4431',23,18,2,2);r('#5d4431',28,18,2,2);r('#cb9b86',13,16,4,2);r('#cb9b86',35,16,4,2);return c;}
  function makeGhost(frame=0,color='#fff8e7'){const c=document.createElement('canvas');c.width=16;c.height=24;const g=c.getContext('2d');const r=(co,x,y,w,h)=>{g.fillStyle=co==='#fff8e7'?color:co;g.fillRect(x,y,w,h);};r('#c9c0ac',5,1,7,2);r('#c9c0ac',2,3,12,11);r('#c9c0ac',4,13,8,4);r('#c9c0ac',6,17,5,4);r('#c9c0ac',4+frame%2,20,5,2);r('#fff8e7',4,4,8,9);r('#fff8e7',5,12,5,4);r('#fff8e7',7,16,3,3);r('#938576',5,6,2,3);r('#938576',10,6,2,3);r('#b0a18c',8,11,2,2);return c;}
  function drawAsset(canvas,type){const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,canvas.width,canvas.height);let sprite=type==='bomb'?sprites.bomb[0]:type==='burnt'?sprites.burnt:sprites.golden[0];const scale=Math.min(canvas.width/(sprite.width+8),canvas.height/(sprite.height+4));g.drawImage(sprite,(canvas.width-sprite.width*scale)/2,(canvas.height-sprite.height*scale)/2,sprite.width*scale,sprite.height*scale);}
  function refreshArt(){
    profile=E.load();
    const flavour=profile.equipped.flavour,ghostColor=profile.equipped.ghost==='custom'?profile.ghostColor:E.CATALOG.find(a=>a.id===profile.equipped.ghost).color;
    sprites={golden:[0,1,2,3].map(f=>makePotato(f,false,false,flavour)),mascot:[0,1,2,3].map(f=>makePotato(f,false,true,flavour)),burnt:makePotato(0,true),bomb:[0,1].map(f=>makeBomb(f,profile.equipped.bomb)),mash:makeMash(),ghost:[0,1].map(f=>makeGhost(f,ghostColor)),dog:[0,1,2].map(v=>[0,1].map(f=>makeDog(v,f))),clock:makePowerup('clock'),coffee:makePowerup('coffee'),cola:makePowerup('cola')};
    for(const c of document.querySelectorAll('[data-item]'))drawAsset(c,c.dataset.item);
    for(const c of document.querySelectorAll('.mascot-art')){const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.drawImage(sprites.mascot[1],20,4,140,182);}
    if(changeScene)changeScene();
  }
  window.CrunchArt={draw(canvas,category,id){const g=canvas.getContext('2d');g.clearRect(0,0,canvas.width,canvas.height);g.imageSmoothingEnabled=false;let c;
    if(category==='flavour')c=makePotato(1,false,true,id);
    else if(category==='ghost')c=makeGhost(0,id==='custom'?E.load().ghostColor:E.CATALOG.find(a=>a.id===id).color);
    else if(category==='bomb')c=makeBomb(0,id);
    else if(category==='dog')c=makeDog(Number(id),1);
    else c=makePowerup(id);
    const scale=Math.min(canvas.width/(c.width+10),canvas.height/(c.height+8));g.drawImage(c,(canvas.width-c.width*scale)/2,(canvas.height-c.height*scale)/2,c.width*scale,c.height*scale);
  }};
  window.addEventListener('crunch-profile-change',e=>{if(e.detail?.reason!=='credit')refreshArt();});
  refreshArt();

  // No remote sound library: all sound effects are original Web Audio synthesis.
  function initAudio(){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
  function tone(freq,time,duration,volume=.04,type='square',endFreq){if(!audio||muted)return;const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+time;o.type=type;o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);}
  function noise(duration,cutoff=3500,volume=.08){if(!audio||muted)return;const n=Math.ceil(audio.sampleRate*duration),b=audio.createBuffer(1,n,audio.sampleRate),data=b.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*(1-i/n)**2;const s=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=cutoff;g.gain.value=volume;s.connect(f);f.connect(g);g.connect(audio.destination);s.start();}
  function sound(kind){if(muted)return;if(kind==='catch'){noise(.12,6500,.17);tone(1100,0,.06,.02,'triangle');tone(1500,.035,.06,.018,'triangle');}else if(kind==='miss'){noise(.18,280,.16);tone(170,0,.22,.045,'sine',65);}else if(kind==='bomb'){noise(.24,900,.17);tone(90,0,.25,.06,'triangle',35);}else if(kind==='burnt'){tone(180,0,.1,.035,'sawtooth',90);tone(110,.09,.13,.025,'triangle',70);}else if(kind==='start'){[523,659,784,1046].forEach((f,i)=>tone(f,i*.07,.13,.035,'triangle'));}else if(kind==='end'){[784,659,523,1046].forEach((f,i)=>tone(f,i*.13,.2,.035,'triangle'));}else tone(700,0,.045,.025,'triangle');}
  function refreshSound(){const b=$('sound-button');b.textContent=muted?'♫̸':'♪';b.setAttribute('aria-label',muted?'Enable sound':'Mute sound');b.setAttribute('aria-pressed',String(muted));b.title=muted?'Enable sound':'Mute sound';}
  $('sound-button').addEventListener('click',()=>{initAudio();muted=!muted;write('crunch-stage-03-muted',muted);refreshSound();if(!muted)sound('click');});refreshSound();

  function getCustom(){return {speed:Number($('speed-setting').value),rate:Number($('rate-setting').value),hazards:Number($('hazards-setting').value)/100,duration:Number($('duration-setting').value)};}
  function updateConfig(){cfg=R.config(level,getCustom());$('custom-settings').hidden=level!=='custom';$('round-summary').textContent=cfg.duration+' SEC';$('speed-summary').textContent=cfg.speed.toFixed(1)+'×';$('hazard-summary').textContent=Math.round(cfg.hazards*100)+'%';$('difficulty-description').textContent=level==='custom'?'Your recipe, your rush. Drops gradually speed up during the round.':cfg.description;$('start-note').textContent=cfg.duration+' SEC · '+level.toUpperCase()+' · +10 PER CATCH';$('timer').textContent=formatTime(cfg.duration);$('best').textContent=pad(best());$('speed-value').textContent=getCustom().speed.toFixed(1)+'×';$('rate-value').textContent=getCustom().rate.toFixed(1);$('hazards-value').textContent=Math.round(getCustom().hazards*100)+'%';for(const b of document.querySelectorAll('.difficulty')){const selected=b.dataset.level===level;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}}
  for(const b of document.querySelectorAll('.difficulty'))b.addEventListener('click',()=>{if(mode==='playing'||mode==='paused')return;level=b.dataset.level;updateConfig();if(mode==='results'){mode='menu';show('menu');$('score').textContent='000';}sound('click');});
  for(const id of ['speed-setting','rate-setting','hazards-setting','duration-setting'])$(id).addEventListener('input',()=>{if(mode==='playing'||mode==='paused')return;updateConfig();});
  function lockSettings(locked){for(const e of document.querySelectorAll('.difficulty,.custom-settings input,.custom-settings select'))e.disabled=locked;$('locked-note').hidden=!locked;}
  function show(next){$('start-screen').hidden=next!=='menu';$('pause-screen').hidden=next!=='paused';$('results-screen').hidden=next!=='results';$('live-badge').hidden=next!=='playing';$('pause-button').disabled=next==='menu'||next==='results';$('pause-button').textContent=next==='paused'?'▶':'Ⅱ';$('pause-button').setAttribute('aria-label',next==='paused'?'Resume game':'Pause game');$('pause-button').title=next==='paused'?'Resume game':'Pause game';$('game-status').textContent={menu:'YOUR BASKET IS READY',playing:'BREAKFAST RUSH IN PROGRESS',paused:'COFFEE BREAK — TIMER PAUSED',results:'ANOTHER DAY, ANOTHER CRUNCH'}[next];}
  function begin(){if(!sketch)return;initAudio();cfg=R.config(level,getCustom());state=R.newState(cfg);roundId=window.crypto?.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2);dogPlan=R.bonusPlan(cfg.duration);dogSpawned=false;items=[];particles=[];splats=[];ghosts=[];labels=[];catches=[];spawnTimer=.35;shake=flash=comboTime=0;lastHUD=-1;lastBest=best();basket.x=W/2;pointer=null;keyboard.clear();dragging=false;mode='playing';$('score').textContent='000';$('run-coins').textContent='000';$('power-status').textContent='';$('best').textContent=pad(lastBest);$('timer').textContent=formatTime(cfg.duration);$('combo-badge').hidden=true;$('live-badge').textContent=level.toUpperCase()+' RUSH';lockSettings(true);show(mode);sound('start');announce(level+' rush started. Catch golden hash browns and dodge burnt bites and chili bombs.');$('canvas-host').focus({preventScroll:true});}
  function pause(){if(mode==='playing'){mode='paused';keyboard.clear();dragging=false;show(mode);announce('Game paused. The timer is stopped.');$('resume-button').focus({preventScroll:true});}else if(mode==='paused'){mode='playing';show(mode);$('canvas-host').focus({preventScroll:true});initAudio();}}
  function finish(early=false){if(mode!=='playing'&&mode!=='paused')return;mode='results';keyboard.clear();dragging=false;state.done=true;$('round-earnings').textContent='+'+state.coins+' COINS BANKED';$('round-boost').textContent=state.dogCaught?'SPUD IMP BONUS ×2 · ALL ROUND COINS':'';$('result-wallet').textContent='WALLET '+E.load().wallet+' COINS';$('timer').textContent=formatTime(state.remaining);$('score').textContent=pad(state.score);const isRecord=state.score>lastBest;if(isRecord)write(R.recordKey(level,cfg),state.score);$('final-score').textContent=pad(state.score);$('final-caught').textContent=state.caught;$('final-missed').textContent=state.missed;$('final-hazards').textContent=state.hazards;$('final-streak').textContent=state.bestStreak;$('result-eyebrow').textContent=early?'ORDER CLOSED EARLY':"TIME'S UP. ORDER UP!";$('result-heading').textContent=state.caught===0?'WELL, THAT HAPPENED.':state.missed>state.caught?'A LITTLE MASHED.':'STAY GOLDEN.';$('result-message').textContent=state.caught===0?'The potatoes will be here when you are ready.':state.missed>state.caught?'A few dramatic potatoes. Still a delicious effort.':'Small potato. Big achievement. Freshly served.';$('record-message').textContent=isRecord?'✦ NEW PERSONAL BEST — '+level.toUpperCase()+' ✦':'PERSONAL BEST · '+pad(Math.max(lastBest,state.score));$('best').textContent=pad(best());$('combo-badge').hidden=true;lockSettings(false);show(mode);sound('end');announce('Run finished. Score '+state.score+'. '+state.caught+' caught. '+state.missed+' missed.');$('replay-button').focus({preventScroll:true});}
  for(const id of ['start-button','replay-button'])$(id).addEventListener('click',begin);
  $('pause-button').addEventListener('click',pause);$('resume-button').addEventListener('click',pause);$('quit-button').addEventListener('click',()=>finish(true));
  $('menu-button').addEventListener('click',()=>{mode='menu';items=[];splats=[];ghosts=[];labels=[];particles=[];catches=[];basket.x=W/2;show(mode);updateConfig();$('score').textContent='000';$('run-coins').textContent='000';$('power-status').textContent='';$('start-button').focus({preventScroll:true});});
  $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.game-shell').requestFullscreen();}catch{announce('Fullscreen is not available in this browser.');}});
  document.addEventListener('fullscreenchange',()=>{$('fullscreen-button').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');});
  window.addEventListener('crunch-shop-open',()=>{shopPaused=mode==='playing';if(shopPaused)pause();});
  window.addEventListener('crunch-shop-close',()=>{if(shopPaused&&mode==='paused')pause();shopPaused=false;});
  let helpPaused=false;
  $('how-button').addEventListener('click',()=>{helpPaused=mode==='playing';if(helpPaused)pause();$('help-dialog').showModal();});
  const closeHelp=()=>$('help-dialog').close();$('close-help').addEventListener('click',closeHelp);$('help-got-it').addEventListener('click',closeHelp);
  $('help-dialog').addEventListener('close',()=>{if(helpPaused&&mode==='paused')pause();helpPaused=false;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pause();});
  window.addEventListener('blur',()=>{keyboard.clear();dragging=false;if(mode==='playing')pause();});
  window.addEventListener('keydown',e=>{if($('help-dialog').open||$('shop-dialog').open||['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;if(['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)&&(mode==='playing')){e.preventDefault();keyboard.add(e.key.toLowerCase());pointer=null;}if((e.code==='Space'||e.key.toLowerCase()==='p')&&(mode==='playing'||mode==='paused')){e.preventDefault();if(!e.repeat)pause();}});
  window.addEventListener('keyup',e=>keyboard.delete(e.key.toLowerCase()));

  function hit(item,caught){
    const previousCoins=state.coins,previousClock=state.clockBonus,hadShield=state.shield,delta=R.resolve(state,item.type,caught);
    const earned=state.coins-previousCoins;
    if(earned>0)E.bank(roundId+':'+(item.type==='dog'?'double':'catch-'+state.caught),earned);
    $('run-coins').textContent=pad(state.coins)+(state.coinMultiplier===2?' ×2':'');
    if(item.type==='dog'){
      if(caught){sound('start');comboTime=3;$('combo-badge').hidden=false;$('combo-badge').textContent='SPUD IMP! ALL ROUND COINS ×2';labels.push({x:item.x,y:basket.y-45,text:'COINS ×2!',color:'#82599b',life:1.8});burst(item.x,basket.y,22,['#ffd96b','#bb9be4','#fff0bb']);announce('Spud Imp caught! All coins earned this round are doubled, including earlier catches.');}
      else labels.push({x:item.x,y:H-90,text:'NEXT TIME, PUP!',color:'#977053',life:1});
    }else if(['clock','coffee','cola'].includes(item.type)){
      if(caught){sound('click');const text=item.type==='clock'?(previousClock>=15?'CLOCK LIMIT':'TIME +5s'):item.type==='coffee'?'SLOW FALL · 4s':'SHIELD READY';labels.push({x:item.x,y:basket.y-45,text,color:'#52866b',life:1.4});burst(item.x,basket.y,9,['#c4ead8','#fff0bb']);}
    }else if(item.type==='golden'&&caught){sound('catch');flash=.12;catches.push({x:(Math.random()-.5)*basket.w*.65,life:.6,frame:1});burst(item.x,basket.y,12,['#ffe68d','#ffbc3d','#ed9822']);labels.push({x:item.x,y:basket.y-35,text:'+10 / +'+(2*state.coinMultiplier)+'c',color:'#9e5319',life:.8});if(state.streak%5===0){comboTime=1.8;$('combo-badge').hidden=false;$('combo-badge').textContent=state.streak+' IN A ROW!';}}
    else if(item.type==='golden'){sound('miss');splats.push({x:item.x,y:H-48,age:0});ghosts.push({x:item.x+7,y:H-65,phase:Math.random()*6});labels.push({x:item.x,y:H-100,text:'−2',color:'#8c7460',life:.9});burst(item.x,H-40,6,['#c9b28b','#ddc7a0']);}
    else if(caught){if(hadShield){sound('click');labels.push({x:item.x,y:basket.y-40,text:'BLOCKED!',color:'#528b95',life:1});}else{sound(item.type==='bomb'?'bomb':'burnt');shake=item.type==='bomb'?.38:.17;burst(item.x,basket.y,item.type==='bomb'?20:10,item.type==='bomb'?['#d63c2c','#ffc160','#ff7651']:['#70513a','#ae7944']);labels.push({x:item.x,y:basket.y-40,text:String(delta),color:'#bf3528',life:1});}}
    lastHUD=-1;
  }
  function burst(x,y,n,colors){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*160,vy:-40-Math.random()*140,life:.35+Math.random()*.4,size:3+Math.random()*3,color:colors[i%colors.length]});}
  function spawn(difficulty){
    let type=R.bonusType(state,dogPlan,dogSpawned)||R.chooseType(cfg);if(type==='dog')dogSpawned=true;
    const mobileScale=H>700?1.6:1,w=(type==='dog'?65:type==='bomb'?48:46)*mobileScale,h=(type==='dog'?70:type==='bomb'?56:64)*mobileScale;
    let x=45+Math.random()*(W-90);if(items.length&&Math.abs(items[items.length-1].x-x)<60)x=Math.max(40,Math.min(W-40,x+120));
    items.push({x,y:-h,w,h,type,variant:dogPlan.variant,speed:difficulty.speed*56*(H/600)*(.88+Math.random()*.24),spin:(Math.random()-.5)*.26,phase:Math.random()*Math.PI*2});
  }
  function advance(dt,clockDt){
    const diff=R.difficultyAt(cfg,state.elapsed);R.tick(state,clockDt);if(state.done){finish();return;}
    if(keyboard.has('arrowleft')||keyboard.has('a'))basket.x-=W*1.1*dt;
    if(keyboard.has('arrowright')||keyboard.has('d'))basket.x+=W*1.1*dt;
    if(pointer!==null)basket.x+=(pointer-basket.x)*Math.min(1,dt*22);
    basket.x=Math.max(basket.w/2+12,Math.min(W-basket.w/2-12,basket.x));
    spawnTimer-=dt;let spawned=0;while(spawnTimer<=0&&spawned++<8){spawn(diff);spawnTimer+=1/diff.rate*(.82+Math.random()*.36);}
    for(let i=items.length-1;i>=0;i--){const item=items[i],prev=item.y;item.y+=item.speed*dt*(state.slowRemaining>0?.5:1);if(R.overlaps(item,basket,prev)){hit(item,true);items.splice(i,1);}else if(item.y+item.h/2>H-43){hit(item,false);items.splice(i,1);}}
    for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=280*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);
    // Every missed bite is counted in a compact persistent pile.
    for(const s of splats)s.age+=dt;
    for(const g of ghosts){g.y-=H/6*dt;g.x+=Math.sin(g.y*.03+g.phase)*14*dt;}ghosts=ghosts.filter(g=>g.y>-65);
    for(const l of labels){l.y-=34*dt;l.life-=dt;}labels=labels.filter(l=>l.life>0);
    // Collected golden bites stay for the full round. Older ones move to the serving plate.
    for(const c of catches)c.life=Math.max(0,c.life-dt);catches=catches.slice(-3);
    flash=Math.max(0,flash-dt);shake=Math.max(0,shake-dt);comboTime=Math.max(0,comboTime-dt);if(comboTime===0)$('combo-badge').hidden=true;
    $('power-status').textContent=[state.dogCaught?'COINS ×2':'',state.slowRemaining>0?'SLOW '+Math.ceil(state.slowRemaining)+'s':'',state.shield?'SHIELD READY':''].filter(Boolean).join(' · ');
    const sec=Math.ceil(state.remaining);if(sec!==lastHUD){$('score').textContent=pad(state.score);$('timer').textContent=formatTime(state.remaining);$('timer').parentElement.classList.toggle('low',state.remaining<=10);lastHUD=sec;}
  }
  updateConfig();show('menu');
  function boot(){if(typeof window.p5==='undefined'){$('loading-error').hidden=false;return;}
    sketch=new p5(p=>{
      p.setup=()=>{const host=$('canvas-host'),rect=host.getBoundingClientRect();W=960;H=rect.width<500?1128:600;basket={x:W/2,y:H-100,w:H>700?200:162};const c=p.createCanvas(W,H);c.parent(host);p.pixelDensity(1);p.noSmooth();p.frameRate(60);const sceneCache={};changeScene=()=>{const asset=E.CATALOG.find(a=>a.id===profile.equipped.scene).asset;const version=++sceneVersion;$('playfield').style.backgroundImage='url('+asset+')';if(sceneCache[asset]){bg=sceneCache[asset];return;}p.loadImage(asset,im=>{sceneCache[asset]=im;if(version===sceneVersion)bg=im;},()=>{});};changeScene();
        const position=e=>{const r=c.elt.getBoundingClientRect();return (e.clientX-r.left)/r.width*W;};
        c.elt.addEventListener('pointerdown',e=>{if(mode!=='playing')return;e.preventDefault();dragging=true;pointer=position(e);keyboard.clear();c.elt.setPointerCapture(e.pointerId);host.focus({preventScroll:true});initAudio();});
        c.elt.addEventListener('pointermove',e=>{if(mode!=='playing')return;if(dragging||e.pointerType==='mouse')pointer=position(e);});
        c.elt.addEventListener('pointerup',()=>{dragging=false;});c.elt.addEventListener('pointercancel',()=>{dragging=false;});
        const resize=new ResizeObserver(()=>{const r=host.getBoundingClientRect(),height=r.width<500?1128:600;if(height!==H){const oldH=H;H=height;p.resizeCanvas(W,H);basket.y=H-100;basket.w=H>700?200:162;for(const i of items){i.y*=H/oldH;i.speed*=H/oldH;}}});resize.observe(host);
      };
      function img(c,x,y,w,h){p.drawingContext.drawImage(c,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
      function plateDraw(){
        if(mode==='menu'||state.caught===0)return;
        const plated=Math.max(0,state.caught-Math.min(catches.length,3));
        if(plated===0)return;
        const scale=H>700?1.3:1,px=W-117*scale,py=H-112;
        p.push();p.translate(Math.round(px),Math.round(py));p.scale(scale);p.noStroke();
        p.fill(98,61,34,30);p.ellipse(0,6,185,20);
        p.fill('#ad9980');p.rect(-84,-5,168,11);p.rect(-73,6,146,4);
        p.fill('#fff8df');p.rect(-89,-9,178,9);p.rect(-80,0,160,5);
        p.fill('#e2d5ba');p.rect(-70,-6,140,3);p.fill('#f7ecd2');p.rect(-67,-9,134,3);
        // Compact stacks show up to 24 distinct bites; the counter represents every serving.
        const visible=Math.min(plated,24),columns=4,rows=Math.ceil(visible/columns);
        for(let i=0;i<visible;i++){
          const row=Math.floor(i/columns),col=i%columns;
          p.push();p.translate(-58+col*38+(row%2)*3,-17-row*13);p.rotate(-Math.PI/2+(col%2?.06:-.06));
          img(sprites.golden[0],-20,-28,40,54);p.pop();
        }
        p.fill('#fff8e7');p.rect(-78,-52-rows*13,156,22);p.fill('#875024');p.textFont('monospace');p.textStyle(p.BOLD);p.textSize(12);p.textAlign(p.CENTER);p.text('SERVED '+String(plated).padStart(3,'0'),0,-37-rows*13);
        p.pop();
      }
      function basketDraw(time){const x=basket.x,y=basket.y,w=basket.w;const dx=shake>0&&!reducedMotion?Math.sin(time*65)*6:0;
        p.push();p.translate(Math.round(x+dx),Math.round(y));p.noStroke();p.fill(101,60,28,34);p.ellipse(0,70,w+30,17);
        for(let i=0;i<catches.length;i++){
          const c=catches[i],count=catches.length,slot=(i-(count-1)/2)*w*.23;
          const size=H>700?1.25:1,bounce=c.life>0&&!reducedMotion?Math.sin(c.life/.6*Math.PI)*7:0;
          const frame=sprites.golden[c.life>.35?1:0];
          p.push();p.translate(slot,-10-bounce);p.rotate((i%2?1:-1)*.09);img(frame,-23*size,-31*size,46*size,61*size);p.pop();
        }
        p.stroke('#52473a');p.strokeWeight(6);p.noFill();p.beginShape();p.vertex(-w/2,-4);p.vertex(-w/2+19,54);p.vertex(w/2-19,54);p.vertex(w/2,-4);p.endShape();
        p.stroke('#b4b1a2');p.strokeWeight(3);for(let i=-w/2+13;i<w/2-9;i+=13){const t=(i+w/2)/w;p.line(i,3,i+(t<.5?9:-9),51);}for(let j=10;j<52;j+=11){const inset=j*.32;p.line(-w/2+inset,j,w/2-inset,j);}
        p.stroke('#4e443a');p.strokeWeight(7);p.line(-w/2,-1,w/2,-1);p.stroke('#dfded0');p.strokeWeight(3);p.line(-w/2,-3,w/2,-3);
        for(const dir of [-1,1]){p.stroke('#594a38');p.strokeWeight(7);p.line(dir*w/2,-2,dir*(w/2+12),-19);p.line(dir*(w/2+12),-19,dir*(w/2+31),-19);p.stroke('#d5c7a6');p.strokeWeight(3);p.line(dir*w/2,-4,dir*(w/2+12),-22);p.noStroke();p.fill('#ae6034');p.rect(dir<0?-w/2-37:w/2+12,-27,26,12);p.fill('#e0a15f');p.rect(dir<0?-w/2-35:w/2+14,-26,22,4);}
        if(flash>0){p.noStroke();p.fill('#ffe593');for(let i=0;i<5;i++){const xx=Math.sin(i*7)*w*.5,yy=-22-Math.cos(i*5)*22;p.rect(xx-2,yy-7,4,14);p.rect(xx-7,yy-2,14,4);}}
        if(state.shield){p.noFill();p.stroke('#9cdbda');p.strokeWeight(3);p.ellipse(0,12,w+40,105);}
        p.pop();
      }
      p.draw=()=>{const clockDt=p.deltaTime/1000,dt=Math.min(clockDt,1),time=p.millis()/1000;if(mode==='playing')advance(dt,clockDt);
        p.background('#f9e5b7');if(bg&&bg.width>1)p.image(bg,0,0,W,H);else{p.stroke('#e9cd98');p.strokeWeight(2);for(let i=0;i<W;i+=90)p.line(i,0,i,H);for(let j=0;j<H;j+=85)p.line(0,j,W,j);p.noStroke();p.fill('#e7b773');p.rect(0,H-120,W,120);}
        p.noStroke();p.fill(255,249,227,mode==='menu'?10:23);p.rect(0,0,W,H);
        plateDraw();
        if(splats.length){p.drawingContext.globalAlpha=.82;for(let i=0;i<Math.min(3,splats.length);i++)img(sprites.mash,46+i*33,H-48+(i%2)*5,65,30);p.drawingContext.globalAlpha=1;p.noStroke();p.fill('#fff0d1');p.textFont('monospace');p.textStyle(p.BOLD);p.textSize(H>700?15:11);p.textAlign(p.LEFT);p.text('MASHED '+String(splats.length).padStart(3,'0'),48,H-8);}
        for(const s of splats.slice(-3)){if(s.age<.65){p.drawingContext.globalAlpha=(.65-s.age)*.8;img(sprites.mash,s.x-29,s.y-7,58,27);p.drawingContext.globalAlpha=1;}}
        for(const g of ghosts){p.drawingContext.globalAlpha=.6;img(sprites.ghost[Math.floor(time*4)%2],g.x-14,g.y-32,28,42);p.drawingContext.globalAlpha=1;}
        if(mode==='menu'){for(let i=0;i<3;i++){p.push();p.translate(100+i*(W-200)/2,110+Math.sin(time*.8+i*2)*25+(i%2)*70);p.rotate(Math.sin(time+i)*.12);p.drawingContext.globalAlpha=.9;img(sprites.golden[0],-22,-30,44,60);p.drawingContext.globalAlpha=1;p.pop();}}
        for(const item of items){p.push();p.translate(Math.round(item.x),Math.round(item.y));p.rotate(item.spin+Math.sin(time*3+item.phase)*.04);const c=item.type==='golden'?sprites.golden[Math.floor(time*3+item.phase)%4]:item.type==='burnt'?sprites.burnt:item.type==='bomb'?sprites.bomb[Math.floor(time*6)%2]:item.type==='dog'?sprites.dog[item.variant][Math.floor(time*4)%2]:sprites[item.type];if(item.type==='dog'){p.noStroke();p.fill('#ffe69a');p.rect(-item.w/2-5,-item.h/2-8,item.w+10,4);}img(c,-item.w/2,-item.h/2,item.w,item.h);p.pop();}
        basketDraw(time);
        for(const pt of particles){p.noStroke();p.fill(pt.color);p.rect(Math.round(pt.x),Math.round(pt.y),pt.size,pt.size);}
        for(const l of labels){p.push();p.drawingContext.globalAlpha=Math.min(1,l.life*2);p.textAlign(p.CENTER);p.textStyle(p.BOLD);p.textFont('monospace');p.textSize(H>700?29:23);p.stroke('#fff5db');p.strokeWeight(4);p.fill(l.color);p.text(l.text,l.x,l.y);p.pop();}
        // A stable, low-contrast floor hint keeps the interactive zone clear.
        if(mode==='playing'&&state.elapsed<4){p.fill('#795035');p.textFont('monospace');p.textStyle(p.BOLD);p.textSize(H>700?19:13);p.textAlign(p.CENTER);p.text(H>700?'DRAG LEFT / RIGHT TO MOVE':'← DRAG TO MOVE YOUR BASKET →',W/2,H-19);}
      };
    });
  }
  boot();
})();
