// Application-state tests with a minimal DOM, no browser or external dependency required.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');const E=require('../dist/engine');
function boot(store=new Map(),practice=false){
 const all=[],byId={},events={},noop=()=>{},drawing=new Proxy({},{get:()=>noop,set:()=>true});
 class Element{constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.style={};this.value='';this.hidden=false;this.open=false;this.classList={toggle:noop,add:noop,remove:noop,contains:()=>false};this.textContent='';all.push(this)}append(...c){this.children.push(...c)}replaceChildren(...c){this.children=c}after(){}setAttribute(k,v){this[k]=v}addEventListener(k,v){this[k]=v}getContext(){return drawing}getBoundingClientRect(){return {left:0,top:0,width:1100,height:800}}setPointerCapture(){}click(){this.onclick?.()}showModal(){this.open=true}close(){this.open=false}focus(){}select(){}}
 const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');for(let m of html.matchAll(/<([a-z]+)([^>]*?)(?:>|\/\>)/g)){let e=new Element(m[1]);for(let a of m[2].matchAll(/([\w-]+)="([^"]*)"/g)){if(a[1]==='id'){e.id=a[2];byId[e.id]=e}else if(a[1].startsWith('data-'))e.dataset[a[1].slice(5)]=a[2];else e[a[1]]=a[2]}}
 byId.paper.value='a4';byId.language.value='0';const document={getElementById:id=>byId[id],createElement:tag=>new Element(tag),activeElement:{tagName:'BODY'},documentElement:{},body:new Element(),querySelectorAll:s=>{let match=/\[data-([^\]]+)\]/.exec(s);return match?all.filter(e=>match[1] in e.dataset):[]},querySelector:s=>s==='dialog[open]'?all.find(e=>e.tagName==='DIALOG'&&e.open):null};
 let c={console,PaperEngine:E,PaperAdvanced:require('../dist/advanced.js'),URLSearchParams,location:{search:practice?'?practice=1':'',origin:'http://localhost'},parent:{postMessage(){}},document,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:f=>{f();return 1},clearTimeout:noop,ResizeObserver:class{constructor(f){this.f=f}observe(){this.f()}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:noop},alert:noop,confirm:()=>true,devicePixelRatio:1,addEventListener:(k,v)=>events[k]=v};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(require.resolve('../dist/i18n.js'),'utf8'),c);vm.runInContext(fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),c);return {c,run:s=>vm.runInContext(s,c),store,el:byId,events}}
let b=boot(),{run}=b;
run("saveRecord('First project','')");assert.equal(JSON.parse(b.store.get('paper-room-v2')).projects[0].name,'First project');let created=run('library.projects[0].created');run("meta.name='Renamed';saveRecord()");assert.equal(run('library.projects.length'),1);assert.equal(run('library.projects[0].created'),created);
run("library.folders.push({id:'folder1',name:'Animals'});persistLibrary();saveRecord('Bird','folder1')");assert.equal(run('library.projects[0].folder'),'folder1');
run("$('newProject').click()");assert.equal(run('library.projects.length'),1);assert.equal(run('meta.name'),'');assert.equal(run('state.pieces.length'),1);
run("let p=state.pieces[0];state.trash.push({id:'trash1',piece:p,deleted:new Date().toISOString()});state.pieces=[];changed();$('bin').click()");assert.equal(run('state.trash.length'),1,'opening bin must not restore');run("trashAction(['trash1'],true)");assert.equal(run('state.pieces.length'),1);assert.equal(run('state.trash.length'),0);run("$('undo').click()");assert.equal(run('state.trash.length'),1);run("trashAction(['trash1'],false)");assert.equal(run('state.trash.length'),0);run("$('undo').click()");assert.equal(run('state.trash.length'),1);run("$('restoreAll').click()");assert.equal(run('state.pieces.length'),1);
run("$('trashDialog').close();selected=state.pieces[0].id;tool='fold';let a=project({x:105,y:0,z:0}),z=project({x:-105,y:0,z:0});canvas.pointerdown({button:0,clientX:a.x-1,clientY:a.y,pointerId:1,preventDefault(){}});canvas.pointermove({clientX:z.x,clientY:z.y});canvas.pointerup({clientX:z.x,clientY:z.y});");assert.equal(run('pending.contact'),true);assert.equal(run('state.pieces[0].creases.length'),0);run('commit()');assert.equal(run('state.pieces[0].folded'),true);run("$('flip').click();$('unfold').click()");assert.equal(run('state.pieces[0].flipped'),true);assert.equal(run('state.pieces[0].folded'),false);
for(let lang of [0,1,2]){run(`lang=${lang};applyLanguage();renderLibrary();renderTrash()`);assert.notEqual(b.el.guideText.textContent,'foldHint')}
run("$('theme').click();saveRecord('Persisted','folder1')");let c=boot(b.store);assert.equal(c.run('getName()'),'Persisted');assert.equal(c.run('state.pieces[0].flipped'),true);assert.equal(c.run('prefs.dark'),true);assert.equal(c.run('lang'),2);assert.equal(c.run('meta.folder'),'folder1');
// Failed storage must leave the current project available, not clear it on New.
c.c.localStorage.setItem=()=>{throw Error('quota')};let before=c.run('JSON.stringify(state)');c.run("$('newProject').click()");assert.equal(c.run('JSON.stringify(state)'),before);assert.equal(c.run('storageFailed'),true);
console.log('PASS: project save/rename/timestamps/folders; automatic save before New; bin opening/restore/delete/all/undo; pointer-to-contact fold; flip/unfold; all languages; theme; persistence after reload; storage-failure protection.');

let outward=boot();outward.run("state=E.state();state.pieces=[E.makePiece('strip')];selected=state.pieces[0].id;fit();let start=project({x:10,y:-140,z:0}),end=project({x:80,y:-60,z:0});canvas.pointerdown({button:0,clientX:start.x-.1,clientY:start.y+.1,pointerId:1,preventDefault(){}});canvas.pointermove({clientX:end.x,clientY:end.y});canvas.pointerup({clientX:end.x,clientY:end.y})");assert.equal(outward.run('pending.contact'),false);assert.equal(outward.el.confirm.disabled,false);assert.equal(outward.run('state.pieces[0].creases.length'),0);outward.run('commit()');assert.equal(outward.run('state.pieces[0].folded'),true);outward.run("$('undo').click()");assert.equal(outward.run('state.pieces[0].creases.length'),0);console.log('PASS: paper-strip outward pointer drag, enabled confirm, commit and undo.');

let display=boot();display.c.document.documentElement.style={setProperty(){}};
function loadDisplay(b){vm.runInContext(fs.readFileSync(require.resolve('../dist/display.js'),'utf8'),b.c)}
loadDisplay(display);const unchanged=display.run('JSON.stringify(state)');
for(const [id,value] of [['textSize','1.4'],['pointerSize','40'],['guideWidth','3'],['guideColor','#112233']]){display.el[id].value=value;display.el[id].onchange()}
display.el.layerView.checked=true;display.el.layerView.onchange();
assert.equal(display.run('prefs.textSize'),1.4);assert.equal(display.run('prefs.layerView'),true);
assert.equal(display.run('JSON.stringify(state)'),unchanged,'display changes must not alter geometry');
let restoredDisplay=boot(display.store);restoredDisplay.c.document.documentElement.style={setProperty(){}};loadDisplay(restoredDisplay);
assert.equal(restoredDisplay.el.guideColor.value,'#112233');assert.equal(restoredDisplay.el.layerView.checked,true);
restoredDisplay.el.resetDisplay.click();assert.equal(restoredDisplay.run('prefs.textSize'),1);assert.equal(restoredDisplay.run('prefs.layerView'),false);
console.log('PASS: display preferences, persistent settings, reset and geometry isolation.');

// Practice uses the real handlers but never reads or writes the artwork store.
let practiceStore=new Map([['paper-room-draft-v2','{"private":"untouched"}']]);
let practice=boot(practiceStore,true),messages=[];practice.c.parent.postMessage=m=>messages.push(m);
vm.runInContext(fs.readFileSync(require.resolve('../dist/practice.js'),'utf8'),practice.c);
function stage(n){practice.events.message({source:practice.c.parent,origin:'http://localhost',data:{kind:'paper-practice-step',step:n,lang:2}})}
// Supply the cache used by the advanced layer UI.
practice.run('let lastLayerFaces=null');
stage(0);assert.equal(practice.run('state.pieces.length'),0);practice.el.addPaper.click();assert.equal(messages.at(-1).step,0);
stage(1);practice.run("pending=E.foldPlan(state.pieces[0],{x:105,y:0},{x:-105,y:0});commit()");assert.equal(messages.at(-1).step,1);
stage(2);practice.run('E.translate(state.pieces[0],30,0);changed()');assert.equal(messages.at(-1).step,2);
stage(3);practice.run("pending={type:'cut',piece:state.pieces[0].id,a:{x:0,y:-105},b:{x:0,y:105}};commit()");assert.equal(messages.at(-1).step,3);
stage(4);practice.run('E.glue(state.pieces[0],state.pieces[1]);state.pieces.pop();changed()');assert.equal(messages.at(-1).step,4);
stage(5);practice.el.flip.click();assert.equal(messages.at(-1).step,5);
stage(6);practice.el.unfold.click();assert.equal(messages.at(-1).step,6);
assert.equal(practiceStore.get('paper-room-draft-v2'),'{'+'"private":"untouched"}');assert.equal(practiceStore.size,1);
console.log('PASS: seven practice-stage completion gates and storage isolation.');

// Exercise preview/confirmation through the advanced UI integration.
let advancedUI=boot();
vm.runInContext(fs.readFileSync(require.resolve('../dist/advanced-ui.js'),'utf8'),advancedUI.c);
advancedUI.run("tool='path';startCutPath(project({x:-110,y:0,z:0}));moveCutPath({x:110,y:0});drag=null;finishCutPath();commit()");
assert.equal(advancedUI.run('state.pieces[0].paths.length'),1);
advancedUI.run('selectCutPath(state.pieces[0],{x:0,y:0});commit()');
assert.equal(advancedUI.run('state.pieces.length'),2);
advancedUI.el.undo.click();assert.equal(advancedUI.run('state.pieces.length'),1);
assert.equal(advancedUI.run('state.pieces[0].paths.length'),1);
advancedUI.run("pending=E.foldPlan(state.pieces[0],{x:105,y:0},{x:-105,y:0});commit();tool='layer';sync();$('layerChoice').value=1;$('layerAngle').value=60;previewLayer();commit()");
assert.equal(advancedUI.run('state.pieces[0].openLayer.degrees'),60);
advancedUI.el.unfold.click();assert.equal(advancedUI.run('!!state.pieces[0].openLayer'),false);
advancedUI.run("state.pieces=[E.makePiece('strip')];selected=state.pieces[0].id;$('knotTightness').value=20;previewKnot();commit()");
assert.equal(advancedUI.run('state.pieces[0].knot.tightness'),.2);
advancedUI.el.undo.click();assert.equal(advancedUI.run('!!state.pieces[0].knot'),false);
console.log('PASS: advanced-tool preview, confirmation and undo integration.');
