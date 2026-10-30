/* Optional geometry operations. Inputs are copied; callers decide when to commit. */
(function(root){
'use strict';
const E=root.PaperEngine||(typeof require==='function'?require('./engine.js'):null);
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:(a.z||0)-(b.z||0)});
// Overlap interval on AB, for collinear segments only.
function overlap(a,b,c,d){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<1e-6)return null;
 if([c,d].some(p=>Math.abs((p.x-a.x)*dy-(p.y-a.y)*dx)/L>1e-5))return null;
 const t=p=>((p.x-a.x)*dx+(p.y-a.y)*dy)/(L*L),lo=Math.max(0,Math.min(t(c),t(d))),hi=Math.min(1,Math.max(t(c),t(d)));
 return hi-lo>1e-6?[lo,hi]:null;
}
function uncutConnection(a,b,lo,hi,barriers){let end=lo;const ranges=barriers.map(s=>overlap(a,b,s.a,s.b)).filter(Boolean).sort((u,v)=>u[0]-v[0]);for(const [l,h]of ranges){if(h<end)continue;if(l>end+1e-5)return true;end=Math.max(end,h);if(end>=hi-1e-5)return false}return end<hi-1e-5}
function connected(a,b,barriers){for(let i=0;i<a.p.length;i++)for(let j=0;j<b.p.length;j++){
 const A=a.p[i],B=a.p[(i+1)%a.p.length],C=b.p[j],D=b.p[(j+1)%b.p.length],r=overlap(A,B,C,D);
 if(r&&uncutConnection(A,B,r[0],r[1],barriers))return true;
 }return false}
function simplify(points,tolerance=1.2){if(points.length<3)return points;let max=0,index=0;for(let i=1;i<points.length-1;i++){const d=E.nearest(points[i],points[0],points.at(-1)).d;if(d>max){max=d;index=i}}
 if(max<=tolerance)return [points[0],points.at(-1)];return [...simplify(points.slice(0,index+1),tolerance).slice(0,-1),...simplify(points.slice(index),tolerance)];}
function cutPath(piece,points){
 if(piece.openLayer||piece.knot||points.length<2||points.length>80)return null;
 // Cut every overlapping flat layer in workspace coordinates, but determine
 // connectivity in unfolded material coordinates so stacked faces never fuse.
 let fs=[],barriers=E.copy(piece.cuts),touched=false;
 const pathSegments=points.slice(1).map((b,i)=>({a:points[i],b})).filter(s=>E.dist(s.a,s.b)>.01);
 for(const original of piece.faces){
  let local=[E.copy(original)];
  const old=piece.cuts.flatMap(s=>{const c=E.clipSegment(s.a,s.b,E.material(original));return c?[{a:E.mapPoint(c[0],original),b:E.mapPoint(c[1],original)}]:[]});
  for(const s of pathSegments){const c=E.clipSegment(s.a,s.b,original.p);if(c&&E.dist(...c)>1e-5){touched=true;barriers.push({a:E.mapPoint(c[0],original,true),b:E.mapPoint(c[1],original,true)})}}
  for(const s of [...old,...pathSegments]){let next=[];const n={x:-(s.b.y-s.a.y),y:s.b.x-s.a.x};
   for(const f of local){const c=E.clipSegment(s.a,s.b,f.p);if(!c||E.dist(...c)<1e-5){next.push(f);continue}const parts=E.split(f.p,s.a,n);for(const poly of [parts.pos,parts.neg])if(E.valid(poly))next.push({...E.copy(f),p:poly});}
   local=next;if(local.length+fs.length>700)return null;
  }fs.push(...local);
 }
 if(!touched)return null;
 const materialFaces=fs.map(f=>({p:E.material(f)}));
 const unseen=new Set(fs.map((_,i)=>i)),sets=[];
 while(unseen.size){const first=unseen.values().next().value;unseen.delete(first);const todo=[first],set=[];
 while(todo.length){const i=todo.pop();set.push(fs[i]);for(const j of unseen)if(connected(materialFaces[i],materialFaces[j],barriers)){unseen.delete(j);todo.push(j)}}sets.push(set)}
 return sets.map((faces,i)=>{const p=E.copy(piece);p.id=i?E.id():piece.id;p.faces=faces;p.paths=(piece.paths||[]).filter(g=>!(g.points.length===points.length&&g.points.every((v,j)=>E.dist(v,points[j])<1e-6))&&g.points.slice(1).some((v,j)=>faces.some(f=>E.clipSegment(g.points[j],v,f.p))));
 p.creases=E.clippedMarks(piece.creases,faces);p.cuts=E.clippedMarks(barriers,faces);p.glue=p.glue.filter(g=>faces.some(f=>E.inside(g,E.material(f))));return p});
}
// A selectable panel must have one straight material hinge, not multiple fixed edges.
function hinges(piece){if(!piece.folded||piece.lockedFold||piece.knot)return [];const result=[];
 for(let i=0;i<piece.faces.length;i++){const f=piece.faces[i],shared=[];
 for(let j=0;j<piece.faces.length;j++){if(i===j)continue;const g=piece.faces[j];
 for(let k=0;k<f.p.length;k++)for(let l=0;l<g.p.length;l++){const a=f.p[k],b=f.p[(k+1)%f.p.length],c=g.p[l],d=g.p[(l+1)%g.p.length];const r=overlap({x:a.u,y:a.v},{x:b.u,y:b.v},{x:c.u,y:c.v},{x:d.u,y:d.v});if(r)shared.push({a:E.mix(a,b,r[0]),b:E.mix(a,b,r[1])});}}
 if(!shared.length)continue;const h=shared[0],v=sub(h.b,h.a),L=Math.hypot(v.x,v.y,v.z);if(L<.1)continue;
 if(shared.some(s=>[s.a,s.b].some(p=>{const c=cross(sub(p,h.a),v);return Math.hypot(c.x,c.y,c.z)/L>.01})))continue;
 result.push({index:i,a:h.a,b:h.b});
 }return result;
}
function openLayer(piece,index,degrees){const base=piece.openLayer?.base||piece.faces,copy=E.copy(piece);copy.faces=E.copy(base);delete copy.openLayer;
 const hinge=hinges(copy).find(h=>h.index===index);if(!hinge||!Number.isFinite(degrees)||degrees<0||degrees>180)return null;
 if(degrees===0)return copy;
 const axis=sub(hinge.b,hinge.a),L=Math.hypot(axis.x,axis.y,axis.z);for(const k of ['x','y','z'])axis[k]/=L;
 const centroid=base[index].p.reduce((s,p)=>({x:s.x+p.x/base[index].p.length,y:s.y+p.y/base[index].p.length,z:s.z+p.z/base[index].p.length}),{x:0,y:0,z:0});
 const sign=cross(axis,sub(centroid,hinge.a)).z>=0?1:-1,angle=degrees*Math.PI/180*sign;
 copy.faces[index].p=base[index].p.map(p=>{const v=sub(p,hinge.a),c=cross(axis,v),d=dot(axis,v),r={...p};for(const k of ['x','y','z'])r[k]=hinge.a[k]+v[k]*Math.cos(angle)+c[k]*Math.sin(angle)+axis[k]*d*(1-Math.cos(angle));return r});
 copy.faces[index].back=degrees>90?!base[index].back:base[index].back;
 copy.openLayer={base:E.copy(base),index,degrees};return copy;
}
// A guided overhand-knot shape for a narrow ribbon, not a collision/force simulation.
function knot(piece,tightness=0){if(piece.key!=='strip'||piece.lockedFold||!Number.isFinite(tightness))return null;
 if(!piece.knot&&(piece.folded||piece.faces.length!==1||piece.cuts.length||piece.glue.length))return null;
 const source=piece.knot?.source||E.copy(piece),p=E.copy(source),vs=source.faces[0].p,cx=vs.reduce((s,v)=>s+v.x,0)/vs.length,cy=vs.reduce((s,v)=>s+v.y,0)/vs.length;
 const N=96,points=[];tightness=Math.max(0,Math.min(1,tightness));
 // Open trefoil arc with two tails: the height separates crossings of the ribbon.
 for(let i=0;i<=N;i++){const t=.25+(Math.PI*2-.5)*i/N;points.push({x:(Math.sin(t)+2*Math.sin(2*t)),y:(Math.cos(t)-2*Math.cos(2*t)),z:-Math.sin(3*t)*(1-.35*tightness)});}
 const tailA={...points[0],y:points[0].y-2.7},tailB={...points.at(-1),y:points.at(-1).y-2.7};points.unshift(tailA);points.push(tailB);
 let length=0;for(let i=1;i<points.length;i++){const v=sub(points[i],points[i-1]);length+=Math.hypot(v.x,v.y,v.z)}
 const factor=source.h/length;points.forEach(v=>{v.x=v.x*factor+cx;v.y=v.y*factor+cy;v.z=v.z*factor+25});
 const left=[],right=[];let materialY=cy-source.h/2;
 for(let i=0;i<points.length;i++){const prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)],v=sub(next,prev),L=Math.hypot(v.x,v.y)||1,normal={x:-v.y/L,y:v.x/L};if(i){const d=sub(points[i],points[i-1]);materialY+=Math.hypot(d.x,d.y,d.z)}
 for(const [side,list]of [[-1,left],[1,right]])list.push({x:points[i].x+side*normal.x*source.w/2,y:points[i].y+side*normal.y*source.w/2,z:points[i].z,u:cx+side*source.w/2,v:materialY});}
 p.faces=[];for(let i=0;i<points.length-1;i++)p.faces.push({back:false,p:[left[i],right[i],right[i+1],left[i+1]]});p.folded=true;p.knot={source,tightness};return p;
}
const api={cutPath,simplify,hinges,openLayer,knot};root.PaperAdvanced=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
