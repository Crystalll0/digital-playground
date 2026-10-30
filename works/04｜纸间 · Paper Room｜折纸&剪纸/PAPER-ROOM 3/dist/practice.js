'use strict';
// Same workspace and tools, but no draft/library reads or writes in practice mode.
if(PRACTICE){
 document.body.classList.add('practice-mode');
 let currentStep=-1,baseline=null,completed=false;
 const send=()=>parent.postMessage({kind:'paper-practice-done',step:currentStep},location.origin);
 window.lessonUpdate=()=>{
  if(completed||currentStep<0)return;
  const p=state.pieces[0];let done=false;
  if(currentStep===0)done=state.pieces.length>0;
  if(currentStep===1)done=!!p?.folded;
  if(currentStep===2)done=!!p&&Math.abs(p.faces[0].p[0].x-baseline)>15;
  if(currentStep===3)done=state.pieces.length>1;
  if(currentStep===4)done=state.pieces.length===1;
  if(currentStep===5)done=!!p?.flipped;
  if(currentStep===6)done=!!p&&!p.folded;
  if(done){completed=true;send()}
 };
 window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==location.origin||event.data?.kind!=='paper-practice-step')return;
  const n=event.data.step;if(!Number.isInteger(n)||n<0||n>6)return;
  lang=[0,1,2].includes(event.data.lang)?event.data.lang:2;
  currentStep=n;completed=false;pending=null;drag=null;history=[];future=[];state=E.state();
  state.pieces=[E.makePiece('square')];let p=state.pieces[0];
  if(n===0)state.pieces=[];
  if(n===3)p.creases=[{a:{x:0,y:-105},b:{x:0,y:105}}];
  if(n===4){p=E.makePiece('square','#fff9ed','#dac4ae',-115);const q=E.makePiece('square','#e8cdb5','#a38972',115);state.pieces=[p,q]}
  if(n===5||n===6)E.fold(p,E.foldPlan(p,{x:105,y:0},{x:-105,y:0}));
  selected=state.pieces[0]?.id;baseline=p.faces[0].p[0].x;
  tool=['fold','fold','move','cut','glue','fold','fold'][n];
  yaw=0;pitch=n===5?.45:0;zoom=1;lastLayerFaces=null;
  applyLanguage();fit();notify(tool+'Hint');
 });
 parent.postMessage({kind:'paper-practice-ready'},location.origin);
}
