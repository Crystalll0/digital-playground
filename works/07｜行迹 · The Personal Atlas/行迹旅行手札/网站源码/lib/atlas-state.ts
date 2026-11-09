export function validateAtlas(input:any){
 const str=(x:any,n=10000)=>{if(typeof x!=='string'||x.length>n)throw Error('invalid_state');return x};
 const id=(x:any)=>{if(typeof x!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(x))throw Error('invalid_state');return x};
 const asset=(x:any)=>{if(typeof x!=='string'||!/^asset:[a-f0-9]{64}$/.test(x))throw Error('invalid_state');return x};
 const list=(x:any)=>{if(!Array.isArray(x)||x.length>10000)throw Error('invalid_state');return x};
 const marker=(m:any)=>({label:typeof m?.label==='string'?str(m.label,64):'',frame:['circle','rounded','none'].includes(m?.frame)?m.frame:'circle',shape:['circle','square','diamond','star','image','emoji','text'].includes(m?.shape)?m.shape:'circle',color:/^#[a-f0-9]{6}$/i.test(m?.color)?m.color:'#a45f43',image:m?.image?asset(m.image):''});
 const media=(m:any)=>({id:id(m.id),name:str(m.name,500),kind:m.kind==='stamp'?'stamp':'photo',data:asset(m.data),capturedAt:typeof m.capturedAt==='string'?str(m.capturedAt,60):''});
 const trip=(t:any)=>({id:id(t.id),name:str(t.name,160),marker:marker(t.marker)});
 const place=(p:any)=>{if(!((p.lat===null&&p.lng===null)||(Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=85&&Math.abs(p.lng)<=180)))throw Error('invalid_state');return{id:id(p.id),name:str(p.name,300),country:str(p.country||'',100),visitPlace:str(p.visitPlace||'',160),lat:p.lat,lng:p.lng,trip:p.trip?id(p.trip):'',date:str(p.date||'',30),note:str(p.note||'',20000),media:list(p.media).map(media)}};
 const index=(i:any)=>Number.isInteger(i)&&i>=0?i:0;
 const trash=(e:any)=>{const base={id:id(e.id),name:str(e.name,500),kind:e.kind,deletedAt:str(e.deletedAt,100),trip:e.trip?trip(e.trip):null,tripIndex:index(e.tripIndex)};if(e.kind==='trip')return{...base,places:list(e.places).map((x:any)=>({place:place(x.place),index:index(x.index)}))};if(e.kind==='place')return{...base,place:place(e.place),index:index(e.index)};if(e.kind==='media')return{...base,place:place(e.place),index:index(e.index),media:media(e.media),mediaIndex:index(e.mediaIndex)};throw Error('invalid_state')};
 return{visitCounts:Object.fromEntries(Object.entries(input.visitCounts||{}).filter(([k,v])=>k.length<300&&/^(place|country):/.test(k)&&Number.isInteger(v)&&Number(v)>0&&Number(v)<=9999)),trips:list(input.trips).map(trip),places:list(input.places).map(place),trash:list(input.trash).map(trash)};
}
