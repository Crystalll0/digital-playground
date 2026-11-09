/* Durable recycle-bin transitions; all functions return new state. */
const TrashModel = (() => {
 const copy=s=>structuredClone({...s,trash:s.trash||[]});
 const tripContext=(s,id)=>s.trips.find(t=>t.id===id)||null;
 const entry=(kind,name,payload)=>({id:crypto.randomUUID(),kind,name,deletedAt:new Date().toISOString(),...payload});
 function removeTrip(s,id){const n=copy(s),t=n.trips.find(t=>t.id===id);if(!t)return n;n.trash.push(entry('trip',t.name,{trip:t,tripIndex:n.trips.indexOf(t),places:n.places.flatMap((p,index)=>p.trip===id?[{place:p,index}]:[])}));n.trips=n.trips.filter(t=>t.id!==id);n.places=n.places.filter(p=>p.trip!==id);return n}
 function removePlaces(s,ids){const n=copy(s);n.places.forEach((p,index)=>{if(ids.includes(p.id))n.trash.push(entry('place',p.name,{place:p,index,trip:tripContext(n,p.trip),tripIndex:n.trips.findIndex(t=>t.id===p.trip)}))});n.places=n.places.filter(p=>!ids.includes(p.id));return n}
 function removeMedia(s,placeId,mediaId){const n=copy(s),p=n.places.find(p=>p.id===placeId),m=p?.media.find(m=>m.id===mediaId);if(!m)return n;n.trash.push(entry('media',m.name,{media:m,mediaIndex:p.media.indexOf(m),place:{...p,media:[]},index:n.places.indexOf(p),trip:tripContext(n,p.trip),tripIndex:n.trips.findIndex(t=>t.id===p.trip)}));p.media=p.media.filter(m=>m.id!==mediaId);return n}
 function insert(a,x,i){a.splice(Math.max(0,Math.min(Number.isInteger(i)&&i>=0?i:a.length,a.length)),0,structuredClone(x))}
 function restore(s,ids){const n=copy(s),entries=n.trash.filter(e=>ids.includes(e.id));function ensureTrip(e){if(e.trip&&!n.trips.some(t=>t.id===e.trip.id))insert(n.trips,e.trip,e.tripIndex)}function ensurePlace(p,index){const existing=n.places.find(x=>x.id===p.id);if(existing){for(const m of p.media)if(!existing.media.some(x=>x.id===m.id))existing.media.push(structuredClone(m));return existing}const restored=structuredClone(p);if(restored.trip&&!n.trips.some(t=>t.id===restored.trip))restored.trip='';insert(n.places,restored,index);return n.places.find(x=>x.id===p.id)}
 entries.sort((a,b)=>({trip:0,place:1,media:2}[a.kind]-{trip:0,place:1,media:2}[b.kind])||(a.index??a.tripIndex??0)-(b.index??b.tripIndex??0));for(const e of entries){ensureTrip(e);if(e.kind==='trip'){for(const item of [...e.places].sort((a,b)=>a.index-b.index))ensurePlace(item.place,item.index)}else if(e.kind==='place')ensurePlace(e.place,e.index);else if(e.kind==='media'){const p=ensurePlace(e.place,e.index);if(!p.media.some(m=>m.id===e.media.id))insert(p.media,e.media,e.mediaIndex)}}n.trash=n.trash.filter(e=>!ids.includes(e.id));return n}
 function purge(s,ids){const n=copy(s);n.trash=n.trash.filter(e=>!ids.includes(e.id));return n}
 return{removeTrip,removePlaces,removeMedia,restore,purge};
})();
if(typeof module!=='undefined')module.exports=TrashModel;
