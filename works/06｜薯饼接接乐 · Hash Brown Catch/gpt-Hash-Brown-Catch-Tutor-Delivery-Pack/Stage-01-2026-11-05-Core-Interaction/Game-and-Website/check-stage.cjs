const assert=require('node:assert/strict');
const R=require('./game-core.js'), E=require('./economy.js');
const stage=1;
let s=R.newState(R.config('medium'));R.resolve(s,'golden',true);assert.equal(s.score,10);assert.equal(s.coins,stage>=3?2:0);R.resolve(s,'golden',false);assert.equal(s.score,8);
for(let i=0;i<10;i++)R.resolve(s,'golden',false);assert.equal(s.score,0);
let cfg=R.config('medium');assert.equal(cfg.duration,stage===1?30:60);assert.equal(cfg.hazards===0,stage===1);
if(stage===1){for(let i=0;i<100;i++)assert.equal(R.chooseType(cfg),'golden');assert.equal(R.difficultyAt(cfg,20).speed,cfg.speed);}
if(stage<4){assert.equal(R.bonusPlan(60).willVisit,false);assert.equal(R.bonusType(s,R.bonusPlan(60),false,()=>0),null);}
if(stage>=2){assert.ok(R.config('hell').speed>R.config('easy').speed);s=R.newState(cfg);s.score=100;R.resolve(s,'bomb',true);assert.equal(s.score,80);}
assert.equal(R.overlaps({x:100,y:110,w:40,h:50},{x:100,y:100,w:100},20),true);
if(stage<3){E.bank('test',100);assert.equal(E.load().wallet,0);}
if(stage===3){assert.deepEqual(E.CATALOG.map(a=>a.id),['classic','strawberry','original','ketchup','vanilla','mint','chili']);}
if(stage>=3){let p=E.fresh();assert.equal(E.credit(p,'one',120).ok,true);assert.equal(E.credit(p,'one',120).ok,false);assert.equal(p.wallet,120);assert.equal(E.purchase(p,'ketchup').ok,true);assert.equal(p.wallet,60);assert.equal(p.equipped.flavour,'ketchup');assert.equal(E.purchase(p,'ketchup').ok,false);assert.equal(E.sanitize(JSON.parse(JSON.stringify(p))).wallet,60);}
if(stage>=4){s=R.newState(cfg);R.resolve(s,'golden',true);R.resolve(s,'dog',true);assert.equal(s.coins,4);R.resolve(s,'golden',true);assert.equal(s.coins,8);for(let i=0;i<5;i++)R.resolve(s,'clock',true);assert.equal(s.clockBonus,15);R.resolve(s,'coffee',true);assert.equal(s.slowRemaining,4);R.resolve(s,'cola',true);let score=s.score;R.resolve(s,'bomb',true);assert.equal(s.score,score);assert.equal(s.shield,0);}
console.log('PASS Stage '+stage+': scoring, scope gates, collision and applicable progression rules.');
