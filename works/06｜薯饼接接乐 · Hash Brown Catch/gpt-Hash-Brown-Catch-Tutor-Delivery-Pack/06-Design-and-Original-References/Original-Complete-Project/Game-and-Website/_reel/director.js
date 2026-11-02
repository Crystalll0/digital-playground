(async function(){
 'use strict';
 const canvas=document.getElementById('reel-canvas'),ctx=canvas.getContext('2d',{alpha:false}),status=document.getElementById('reel-status'),button=document.getElementById('render-reel');
 const FPS=30,DURATION=36,FRAMES=FPS*DURATION,SCALE=1.5;
 const C={cream:'#fff5df',paper:'#fbf1dc',cocoa:'#60331f',red:'#cf382b',gold:'#efb83e',muted:'#9a7858',purple:'#8a639a'};
 const loadImage=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
 await document.fonts.ready;
 const [diner,shop,strawberry,midnight]=await Promise.all(['assets/diner.png','_reel/shop-scenes.jpg','assets/strawberry-diner.png','assets/midnight-diner.png'].map(loadImage));
 while(!window.ReelGame?.ready())await new Promise(r=>setTimeout(r,100));
 const engine=window.ReelGame;
 let sprites=engine.sprites(),webCodec=false;
 try{webCodec=!!window.VideoEncoder&&(await VideoEncoder.isConfigSupported({codec:'vp8',width:1920,height:1080,bitrate:8500000,framerate:FPS})).supported;}catch{}
 status.textContent='Ready · 36s · 1920 × 1080 · '+(webCodec?'frame-accurate export':'real-time capture');
 function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
 function text(s,x,y,size=20,color=C.cocoa,font='Pixel',align='left'){ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`${size}px ${font==='Pixel'?'Pixel,monospace':font}`;ctx.fillText(s,x,y);}
 function lines(arr,x,y,size,color,font='Pixel',spacing=1.6){arr.forEach((v,i)=>text(v,x,y+i*size*spacing,size,color,font));}
 function sprite(s,x,y,w,h){ctx.imageSmoothingEnabled=false;ctx.drawImage(s,Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
 function checker(y,height=12){for(let i=0;i<1280;i+=16)rect(i,y,16,height,(i/16)%2?C.cream:C.red);}
 function sparkle(x,y,r=9,color=C.gold){rect(x-2,y-r,4,r*2,color);rect(x-r,y-2,r*2,4,color);}
 function ease(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3);}
 function miniTag(s,x,y,width=210,bg='#f4d994',fg=C.cocoa){rect(x,y,width,32,bg);text(s,x+width/2,y+21,9,fg,'Pixel','center');}
 function hud(state){rect(48,77,900,53,'#642e27');text('SCORE',66,96,7,'#e1bf98');text(String(state.score).padStart(3,'0'),66,120,15,'#ffce65');text('RUN COINS',255,96,7,'#e1bf98');text(String(state.coins).padStart(3,'0')+(state.coinMultiplier===2?' x2':''),255,120,15,'#ffce65');text('TIME LEFT',771,96,7,'#e1bf98');const t=Math.ceil(state.remaining);text(`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`,771,120,15,C.cream);}
 function gameplay(t){
  const state=engine.state();rect(0,0,1280,720,C.paper);checker(0,8);text('CRUNCH CLUB / THE BREAKFAST ARCADE',48,43,9,C.red);text('HASH BROWN CATCH',1230,43,12,C.cocoa,'Pixel','right');
  rect(44,73,908,623,C.cocoa);hud(state);sprite(engine.canvas(),48,130,900,562);rect(48,686,900,7,C.gold);
  let heading,copy,kind,tag;
  if(t<10){heading=['CATCH','THE','CRUNCH.'];copy=['One basket.','A golden little rush.'];kind='golden';tag='DRAG LEFT / RIGHT';}
  else if(t<14){heading=['A LITTLE','MASHED.'];copy=['Miss a bite?','Meet its tiny ghost.'];kind='ghost';tag='BIG POTATO FEELINGS';}
  else if(t<16){heading=['A LITTLE','EXTRA','TIME.'];copy=['Catch the clock.','Add 5 seconds.'];kind='clock';tag='CLOCK +5 SEC';}
  else if(t<18){heading=['SLOW','YOUR','MORNING.'];copy=['Coffee slows falls','for 4 seconds.'];kind='coffee';tag='COFFEE / SLOW FALL';}
  else if(t<20){heading=['A SIP.','A LITTLE','SHIELD.'];copy=['Cola blocks one','burnt bite or bomb.'];kind='cola';tag='COLA / ONE SHIELD';}
  else{heading=['DOUBLE','TROUBLE.'];copy=['Catch Spud Imp.','All round coins x2.'];kind='dog';tag='RARE PUP / 12% VISIT';}
  miniTag(tag,985,105,245,t>=20?'#e5d0ed':'#f4d994');
  lines(heading,986,207,23,t>=20?C.purple:C.cocoa,'Pixel',1.55);
  const baseY=heading.length===3?365:330;lines(copy,986,baseY,20,C.muted,'Arial',1.55);
  const bob=Math.sin(t*3)*5;
  if(kind==='golden')sprite(sprites.mascot[Math.floor(t*3)%3],1032,440+bob,146,190);
  else if(kind==='ghost'){sprite(sprites.mash,1000,582,205,94);sprite(sprites.ghost[Math.floor(t*4)%2],1090,430+bob,64,96);}
  else if(kind==='dog'){sprite(sprites.dog[0][Math.floor(t*4)%2],1005,425+bob,192,199);sparkle(1000,445,9);sparkle(1221,530,7);}
  else sprite(sprites[kind],1045,435+bob,125,150);
  text('FEATURE DEMO / STAGED CAPTURE',986,681,6,'#b39a7b');
 }
 function intro(t){
  ctx.drawImage(diner,0,0,1280,720);rect(0,0,1280,720,'#fff3d5dc');checker(0,14);checker(706,14);
  const e=ease(t/.6);ctx.save();ctx.translate(-40*(1-e),0);ctx.globalAlpha=e;
  text('CRUNCH CLUB PRESENTS',87,130,13,C.red);lines(['HASH','BROWN'],82,236,61,C.cocoa,'Pixel',1.4);text('CATCH!',82,425,69,C.red);
  text('A little crunch. A lot of joy.',87,509,28,C.cocoa,'Georgia');miniTag('A COZY PIXEL BREAKFAST GAME',87,549,435);
  ctx.restore();sprite(sprites.mascot[1],890,165+Math.sin(t*3)*7,240,312);sparkle(860,220,18);sparkle(1170,405,14);sparkle(940,525,10);
  text('PLAY. COLLECT. CUSTOMIZE.',640,659,12,C.cocoa,'Pixel','center');
 }
 function shopScene(t){
  rect(0,0,1280,720,C.paper);checker(0,10);text('THE LITTLE TREAT SHOP',48,48,16,C.cocoa);miniTag('EARNED COINS. PERMANENT UNLOCKS.',804,25,430);
  ctx.save();ctx.beginPath();ctx.rect(47,77,692,617);ctx.clip();const z=1+Math.max(0,t-24)*.004;ctx.drawImage(shop,47-(z-1)*346,77-(z-1)*308,692*z,617*z);ctx.restore();
  rect(47,77,692,3,C.cocoa);rect(47,691,692,3,C.cocoa);
  lines(['MAKE','IT YOURS.'],792,169,33,C.red,'Pixel',1.6);
  lines(['Keep the coins.','Unlock a little joy.'],792,289,24,C.cocoa,'Georgia',1.6);
  lines(['New diner scenes','Saucy little skins','Ghost colors + more'],792,380,18,C.muted,'Arial',1.75);
  const flavour=t<28?'ketchup':'cream';const small=document.createElement('canvas');small.width=140;small.height=155;window.CrunchArt.draw(small,'flavour',flavour);sprite(small,790,476,140,155);
  sprite(sprites.dog[(Math.floor(t)-24)%3][0],957,499,110,114);sprite(sprites.ghost[0],1138,516+Math.sin(t*3)*4,52,78);
  text('60 / 120 / 240 COIN TREATS',794,670,9,C.cocoa);
 }
 function outro(t){
  const v=ease((t-31)/.7);rect(0,0,1280,720,C.paper);checker(0,13);checker(707,13);text('SMALL POTATO.',640,138,33,C.cocoa,'Pixel','center');text('BIG FEELINGS.',640,206,39,C.red,'Pixel','center');
  const chars=[sprites.mascot[1],sprites.dog[1][0],sprites.mascot[2]];for(let i=0;i<3;i++){const w=i===1?150:125,h=i===1?155:163;const x=410+i*160;const y=288+Math.sin(t*3+i)*5+30*(1-v);sprite(chars[i],x-w/2,y,w,h);}
  miniTag('HASH BROWN CATCH',411,510,458,C.red,C.cream);text('PLAY / COLLECT / CUSTOMIZE',640,603,13,C.cocoa,'Pixel','center');text('DESIGNED BY CRYSTAL CHEN',640,654,9,C.muted,'Pixel','center');
 }
 function draw(t){ctx.save();ctx.scale(SCALE,SCALE);ctx.imageSmoothingEnabled=false;if(t<3)intro(t);else if(t<24)gameplay(t);else if(t<31)shopScene(t);else outro(t);
  // Brief tiled wipes bridge the four main chapters without obscuring their content.
  for(const cut of [3,10,14,20,24,31]){const d=t-cut;if(d>=0&&d<.20){const amount=1-d/.2;for(let y=0;y<720;y+=40){const width=1280*amount+((y/40)%2?70:0);rect(0,y,width,40,(y/40)%2?C.red:C.cream);}}}
  if(t>35.3){rect(0,0,1280,720,`rgba(251,241,220,${Math.max(0,(t-35.3)/.7)})`);}ctx.restore();}
 const schedule=[
  {at:3.6,type:'golden',x:260,y:-40,target:5.3},{at:4.5,type:'golden',x:470,y:-40,target:6.2},{at:5.4,type:'golden',x:690,y:-40,target:7.1},{at:6.3,type:'golden',x:420,y:-40,target:8},{at:7.2,type:'golden',x:650,y:-40,target:8.9},{at:8,type:'golden',x:300,y:-40,target:9.7},
  {at:8.9,type:'golden',x:90,y:-40,miss:true,target:10.6},{at:9.9,type:'golden',x:680,y:-40,target:11.6},
  {at:14.2,type:'clock',x:480,y:280,speed:320,target:14.8},{at:16,type:'coffee',x:400,y:280,speed:320,target:16.6},{at:18.1,type:'cola',x:620,y:400,speed:320,target:18.6},
  {at:20.9,type:'dog',x:480,y:310,speed:200,target:21.7},{at:21.3,type:'golden',x:480,y:-40,target:23}
 ];
 async function simulate(t,index){
   if(t>=3&&t<24){for(const event of schedule){if(!event.sent&&t>=event.at){engine.inject(event.type,event.x,event.y,event.speed||300);event.sent=true;}}
    const upcoming=schedule.filter(e=>!e.miss&&e.target>=t-.10).sort((a,b)=>a.target-b.target)[0];engine.aim(upcoming&&upcoming.target-t<.9?upcoming.x:480);await engine.step(1/FPS,t-3);
   }
   draw(t);
 }
 function download(bytes,name,type){const blob=new Blob([bytes],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.id='download-reel';a.textContent='DOWNLOAD CAPTURE';a.className='primary-button';a.style='display:block;width:max-content;margin:20px auto';document.getElementById('download-reel')?.remove();document.body.append(a);}
 function ivf(chunks){const parts=[],header=new ArrayBuffer(32),v=new DataView(header);new Uint8Array(header).set([68,75,73,70,0,0,32,0,86,80,56,48]);v.setUint16(12,1920,true);v.setUint16(14,1080,true);v.setUint32(16,FPS,true);v.setUint32(20,1,true);v.setUint32(24,chunks.length,true);parts.push(header);chunks.sort((a,b)=>a.timestamp-b.timestamp);for(const c of chunks){const h=new ArrayBuffer(12),d=new DataView(h);d.setUint32(0,c.bytes.byteLength,true);d.setBigUint64(4,BigInt(Math.round(c.timestamp*FPS/1e6)),true);parts.push(h,c.bytes);}return new Blob(parts,{type:'video/x-ivf'});}
 async function render(){
  button.disabled=true;engine.init();sprites=engine.sprites();schedule.forEach(e=>e.sent=false);let started=performance.now();
  try{
   if(webCodec){const chunks=[];let error=null;const encoder=new VideoEncoder({output(chunk){const bytes=new Uint8Array(chunk.byteLength);chunk.copyTo(bytes);chunks.push({timestamp:chunk.timestamp,bytes});},error(e){error=e;}});encoder.configure({codec:'vp8',width:1920,height:1080,bitrate:8500000,framerate:FPS,latencyMode:'realtime'});
    for(let i=0;i<FRAMES;i++){if(error)throw error;await simulate(i/FPS,i);const frame=new VideoFrame(canvas,{timestamp:Math.round(i*1e6/FPS),duration:Math.round(1e6/FPS)});encoder.encode(frame,{keyFrame:i%60===0});frame.close();if(i%15===0){status.textContent=`Rendering ${Math.round(i/FRAMES*100)}% · frame ${i}/${FRAMES}`;await new Promise(r=>setTimeout(r,0));}while(encoder.encodeQueueSize>10)await new Promise(r=>setTimeout(r,4));}await encoder.flush();encoder.close();download(await ivf(chunks).arrayBuffer(),'Hash-Brown-Catch-Capture.ivf','video/x-ivf');
   }else{
    const mime='video/webm;codecs=vp8';const stream=canvas.captureStream(FPS),parts=[];const rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:10000000});rec.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};const stopped=new Promise(r=>rec.onstop=r);rec.start();started=performance.now();
    for(let i=0;i<FRAMES;i++){await simulate(i/FPS,i);if(i%15===0)status.textContent=`Recording ${Math.round(i/FRAMES*100)}% · frame ${i}/${FRAMES}`;const delay=started+(i+1)*1000/FPS-performance.now();if(delay>0)await new Promise(r=>setTimeout(r,delay));}rec.stop();await stopped;stream.getTracks().forEach(t=>t.stop());download(await new Blob(parts,{type:mime}).arrayBuffer(),'Hash-Brown-Catch-Capture.webm',mime);
   }
   status.textContent=`DONE · ${DURATION}s · rendered in ${((performance.now()-started)/1000).toFixed(1)}s · download ready`;
  }catch(e){status.textContent='ERROR: '+e.message;console.error(e);}finally{button.disabled=false;}
 }
 button.addEventListener('click',()=>{button.disabled=true;setTimeout(()=>render(),50);});draw(1);
})();
