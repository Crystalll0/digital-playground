const assert=require('node:assert/strict'),E=require('../dist/engine.js'),A=require('../dist/advanced.js');
const area=p=>p.faces.reduce((s,f)=>s+E.area(E.material(f)),0);
for(const points of [
 [{x:-110,y:0},{x:110,y:0}],
 [{x:-40,y:-40},{x:40,y:-40},{x:40,y:40},{x:-40,y:40},{x:-40,y:-40}],
 [{x:-110,y:-70},{x:-30,y:-30},{x:10,y:30},{x:110,y:60}],
 Array.from({length:33},(_,i)=>({x:55*Math.cos(i*Math.PI/16),y:55*Math.sin(i*Math.PI/16)}))
]){let p=E.makePiece('square'),before=JSON.stringify(p),parts=A.cutPath(p,points);assert.equal(parts.length,2);assert.ok(Math.abs(parts.reduce((s,p)=>s+area(p),0)-area(p))<1e-3);assert.equal(JSON.stringify(p),before);assert.ok(E.validate({version:2,pieces:parts,trash:[]}));}
let p=E.makePiece('square');assert.equal(A.cutPath(p,[{x:0,y:0},{x:10,y:0}]).length,1);assert.equal(A.cutPath(p,[{x:200,y:0},{x:210,y:0}]),null);
E.fold(p,E.foldPlan(p,{x:105,y:0},{x:-105,y:0}));const before=JSON.stringify(p);const h=A.hinges(p).at(-1),raised=A.openLayer(p,h.index,70);assert.ok(raised.faces[h.index].p.some(v=>v.z>10));assert.deepEqual(raised.faces[0],p.faces[0]);assert.ok(Math.abs(area(p)-area(raised))<1e-5);assert.deepEqual(A.openLayer(raised,h.index,0).faces,p.faces);assert.equal(JSON.stringify(p),before);assert.ok(E.validate({version:2,pieces:[raised],trash:[]}));E.unfold(raised);assert.equal(raised.openLayer,undefined);
const strip=E.makePiece('strip'),k=A.knot(strip,.5);assert.ok(k.faces.length>20);assert.ok(Math.abs(area(k)-area(strip))<1e-3);assert.ok(E.validate({version:2,pieces:[k],trash:[]}));E.translate(k,20,30);E.unfold(k);assert.equal(k.knot,undefined);assert.equal(k.folded,false);assert.equal(k.faces[0].p[0].x,strip.faces[0].p[0].x+20);
assert.equal(A.knot(E.makePiece('square')),null);
let malicious=E.makePiece();malicious.openLayer={base:[],index:0,degrees:90};assert.equal(E.validate({version:2,pieces:[malicious],trash:[]}),false);
console.log('PASS: curved/open/closed paths, area preservation, partial paths, single hinged panel, guided knot restore and import validation.');

// A hole cut through two folded layers produces two separate scraps on unfolding.
let folded=E.makePiece('square');E.fold(folded,E.foldPlan(folded,{x:105,y:0},{x:-105,y:0}));
const hole=[{x:-80,y:-20},{x:-40,y:-20},{x:-40,y:20},{x:-80,y:20},{x:-80,y:-20}];
let cut=A.cutPath(folded,hole);assert.equal(cut.length,3);assert.ok(Math.abs(cut.reduce((s,p)=>s+area(p),0)-44100)<1e-5);
cut.forEach(p=>E.unfold(p));const body=cut.sort((a,b)=>area(b)-area(a))[0];
for(const x of [-60,60])assert.equal(body.faces.some(f=>E.inside({x,y:0},f.p)),false,'both mirrored holes remain after unfold');
assert.equal(A.cutPath(folded,[{x:-70,y:0},{x:-60,y:0}]).length,1,'partial slit must not split material');
E.fold(folded,E.foldPlan(folded,{x:-50,y:105},{x:-50,y:-105}));
cut=A.cutPath(folded,[{x:-80,y:-80},{x:-40,y:-80},{x:-40,y:-40},{x:-80,y:-40},{x:-80,y:-80}]);
assert.equal(cut.length,5,'four-layer cut produces four scraps');assert.ok(Math.abs(cut.reduce((s,p)=>s+area(p),0)-44100)<1e-5);
assert.ok(E.validate({version:2,pieces:cut,trash:[]}));
console.log('PASS: two/four-layer cuts, mirrored holes after unfolding, material connectivity and area.');
