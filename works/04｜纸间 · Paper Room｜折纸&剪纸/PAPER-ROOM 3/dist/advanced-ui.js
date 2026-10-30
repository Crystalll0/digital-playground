'use strict';
const A=PaperAdvanced;
Object.assign(WORDS,{
 pathTool:['画裁剪线','畫裁剪線','Draw cut'],layerTool:['纸层','紙層','Layers'],knotTool:['纸条结','紙條結','Strip knot'],
 pathHint:['按住拖动画裁剪线；靠近起点会闭合。确认线条后，用剪刀点击虚线，再确认裁剪。','按住拖動畫裁剪線；靠近起點會閉合。確認線條後，用剪刀點擊虛線，再確認裁剪。','Drag to draw a cut guide; return near its start to close it. Confirm the guide, select it with Scissors, then confirm the cut.'],
 layerHint:['选择纸张，再选择可沿折痕翻开的纸面，调节角度并确认。','選擇紙張，再選擇可沿摺痕翻開的紙面，調節角度並確認。','Select folded paper, choose a hinged panel, adjust its angle and confirm.'],
 knotHint:['选择未裁剪的星星纸，在左侧创建引导式结形。','選擇未裁剪的星星紙，在左側建立引導式結形。','Select an uncut star strip, then create a guided knot on the left.'],
 layerChoice:['选择纸面','選擇紙面','Choose panel'],layerAngle:['翻开角度','翻開角度','Opening angle'],
 layerLimit:['仅支持沿一条直线折痕连接的纸面。0° 合回；展开恢复整张纸。尚不支持复杂袋折或碰撞。','僅支援沿一條直線摺痕連接的紙面。0° 合回；展開還原整張紙。尚不支援複雜袋摺或碰撞。','Only panels connected along one straight hinge are supported. 0° closes the panel; Unfold resets the sheet. No pocket folds or collision simulation.'],
 noHinge:['请先折叠；此纸张暂无可单独翻开的纸面。','請先摺疊；此紙張暫無可單獨翻開的紙面。','Fold first; no independently hinged panel is available.'],
 makeKnot:['预览引导式纸条结','預覽引導式紙條結','Preview guided strip knot'],knotTightness:['结形调整','結形調整','Knot shape'],
 knotLimit:['预设的三维纸条结形，可旋转查看。并非任意拉扯打结或物理模拟；展开可还原。','預設的三維紙條結形，可旋轉查看。並非任意拉扯打結或物理模擬；展開可還原。','A guided 3D ribbon-knot shape, not free dragging or a physical simulation. Orbit to inspect; Unfold restores the strip.'],
 knotOnly:['请添加一张新的星星纸，再使用纸条结。','請新增一張星星紙，再使用紙條結。','Add a fresh star strip before making a knot.'],
 closeLayerFirst:['请先合回纸层（0°）或展开，再进行此操作。','請先合回紙層（0°）或展開，再進行此操作。','Close the layer (0°) or Unfold before this operation.'],
 pathGuidePreview:['裁剪线已画好 · 确认保存线条','裁剪線已畫好 · 確認儲存線條','Cut guide ready · confirm to keep it'],pathCutPreview:['裁剪待确认','裁剪待確認','Cut ready to confirm'],layerPreview:['纸层角度待确认','紙層角度待確認','Layer angle ready to confirm'],knotPreview:['引导式结形待确认','引導式結形待確認','Guided knot ready to confirm'],
 pathReady:['已保存裁剪线。选择剪刀，点击虚线。','已儲存裁剪線。選擇剪刀，點擊虛線。','Guide saved. Choose Scissors and click the dashed guide.'],
 pathTooComplex:['线条太复杂或未经过纸张。请画短一点，或先展开纸张。','線條太複雜或未經過紙張。請畫短一點，或先展開紙張。','The path is too complex or misses the sheet. Draw a shorter path, or unfold first.'],
 quickDisplay:['⚙ 字号 / 显示','⚙ 字級 / 顯示','⚙ Text / Display'],quickLayers:['◫ 半透明','◫ 半透明','◫ See layers']
});
WORDS.path=WORDS.pathTool;WORDS.layer=WORDS.layerTool;WORDS.knot=WORDS.knotTool;
WORDS.cutHint=['可在平折后画线或选择辅助线，确认剪穿所有重叠纸层，再展开查看图案。','可在平摺後畫線或選擇輔助線，確認剪穿所有重疊紙層，再展開查看圖案。','Draw or select a guide and confirm to cut through all flat layers. Unfold afterwards to reveal the pattern.'];
WORDS.compassHint=['在平面或平折纸张上，从圆心拖动设定半径，空格确认。','在平面或平摺紙張上，從圓心拖動設定半徑，空格確認。','On flat or flat-folded paper, drag from the centre to set a radius. Space confirms.'];
WORDS.needLine=['请沿折痕拖动，或先用画裁剪线 / 圆规建立虚线。','請沿摺痕拖動，或先用畫裁剪線 / 圓規建立虛線。','Drag on a crease, or create a guide with Draw cut / Compass first.'];
WORDS.layerNote=['半透明帮助观察重叠，不会自动对齐。纸层工具可沿单一直线折痕翻开纸面。','半透明幫助觀察重疊，不會自動對齊。紙層工具可沿單一直線摺痕翻開紙面。','Transparency reveals overlap without automatic alignment. Layers can open a panel along one straight hinge.'];
WORDS.limitsText=['支持直线平折、单一直线铰接纸面和引导式纸条结形。并非柔性物理模拟，不支持复杂袋折或碰撞。平折纸张可叠层裁剪；涂胶前需展开。','支援直線平摺、單一直線鉸接紙面和引導式紙條結形。並非柔性物理模擬，不支援複雜袋摺或碰撞。平摺紙張可疊層裁剪；塗膠前需展開。','Straight folds, single-hinge panels and guided ribbon-knot shapes. No flexible-paper physics, pocket folds or collision simulation. Flat folded layers can be cut together. Unfold before painting glue.'];
let lastLayerFaces=null;
window.syncAdvanced=()=>{
 const p=piece();$('layerPanel').hidden=tool!=='layer';$('knotPanel').hidden=tool!=='knot';
 $('quickLayers').setAttribute('aria-pressed',String(!!prefs.layerView));
 if(tool==='layer'&&p&&lastLayerFaces!==p.faces){
  lastLayerFaces=p.faces;const base={...p,faces:p.openLayer?.base||p.faces};delete base.openLayer;
  const hs=A.hinges(base);$('layerChoice').replaceChildren();
  for(const h of hs){const o=el('option',null,`${t('layerTool')} ${h.index+1}`);o.value=h.index;$('layerChoice').append(o)}
  $('layerChoice').disabled=!hs.length;$('layerAngle').disabled=!hs.length;
  if(p.openLayer)$('layerChoice').value=p.openLayer.index;
  $('layerAngle').value=p.openLayer?.degrees||0;$('layerDegrees').textContent=$('layerAngle').value+'°';
 }
 if(pending&&['pathGuide','pathCut','layer','knot'].includes(pending.type))$('pendingLabel').textContent=t(pending.type+'Preview');
};
window.renderAdvanced=()=>{
 for(const p of state.pieces)for(const guide of p.paths||[])for(let i=1;i<guide.points.length;i++)for(const f of p.faces){const seg=E.clipSegment(guide.points[i-1],guide.points[i],f.p);if(seg)line(...seg,'#987142',1.2,[5,4])}
 if(pending?.points)for(let i=1;i<pending.points.length;i++)line(pending.points[i-1],pending.points[i],'#987142',1.4,[5,4]);
};
window.startCutPath=q=>{
 const p=piece();if(!p){notify('needSelect');return}if(p.openLayer||p.knot){notify('closeLayerFirst');return}
 const world=unproject(q);drag={type:'path',piece:p.id,start:world};pending={type:'pathGuide',piece:p.id,points:[world]};sync();
};
window.moveCutPath=q=>{if(pending.points.length<1200&&E.dist(q,pending.points.at(-1))*scale>3)pending.points.push({x:q.x,y:q.y});sync()};
window.finishCutPath=()=>{
 let points=A.simplify(pending.points,1.2);if(points.length>2&&E.dist(points[0],points.at(-1))*scale<18)points[points.length-1]={...points[0]};
 if(points.length<2||points.length>80||E.dist(points[0],points[1])<.5){pending=null;notify('pathTooComplex')}else pending.points=points;sync();
};
window.selectCutPath=(p,q)=>{
 const guide=(p.paths||[]).find(g=>g.points.slice(1).some((b,i)=>E.nearest(q,g.points[i],b).d*scale<12));if(!guide)return false;
 const parts=A.cutPath(p,guide.points);if(!parts){notify('pathTooComplex');return true}pending={type:'pathCut',piece:p.id,points:guide.points,parts};sync();return true;
};
window.chooseLayer=(p,index)=>{lastLayerFaces=null;sync();const hs=A.hinges({...p,faces:p.openLayer?.base||p.faces});if(hs.some(h=>h.index===index))$('layerChoice').value=index;if(!hs.length)notify('noHinge')};
function previewLayer(){const p=piece();if(!p)return;if(pending&&pending.type!=='layer'){notify('saveFirst');return}const angle=+$('layerAngle').value,result=A.openLayer(p,+$('layerChoice').value,angle);if(!result){notify('noHinge');return}pending={type:'layer',piece:p.id,result};$('layerDegrees').textContent=angle+'°';pitch=.6;sync()}
$('layerAngle').oninput=previewLayer;$('layerChoice').onchange=()=>{$('layerAngle').value=0;previewLayer()};
window.previewKnot=()=>{const p=piece();if(!p)return;if(pending&&pending.type!=='knot'){notify('saveFirst');return}const result=A.knot(p,+$('knotTightness').value/100);if(!result){notify('knotOnly');return}pending={type:'knot',piece:p.id,result};pitch=.65;sync()};
$('makeKnot').onclick=window.previewKnot;$('knotTightness').oninput=window.previewKnot;
window.commitAdvanced=(p,op)=>{
 if(p.folded&&op.type==='circle'){p.paths=p.paths||[];p.paths.push({id:E.id(),points:Array.from({length:65},(_,i)=>({x:op.x+Math.cos(i*Math.PI/32)*op.r,y:op.y+Math.sin(i*Math.PI/32)*op.r}))});notify('pathReady');return true}
 if(p.folded&&['cut','circleCut'].includes(op.type)){const points=op.type==='cut'?[op.a,op.b]:Array.from({length:65},(_,i)=>({x:op.circle.x+Math.cos(i*Math.PI/32)*op.circle.r,y:op.circle.y+Math.sin(i*Math.PI/32)*op.circle.r}));const parts=A.cutPath(p,points);if(parts){for(const part of parts)part.circles=part.circles.filter(c=>c.id!==op.circle?.id);state.pieces.splice(state.pieces.indexOf(p),1,...parts);notify(parts.length>1?'cutDone':'cutPartial')}else notify('circleNoCut');return true}
 if(op.type==='pathGuide'){p.paths=p.paths||[];p.paths.push({id:E.id(),points:op.points});notify('pathReady');return true}
 if(op.type==='pathCut'){state.pieces.splice(state.pieces.indexOf(p),1,...op.parts);notify(op.parts.length>1?'cutDone':'cutPartial');return true}
 if(op.type==='layer'||op.type==='knot'){state.pieces[state.pieces.indexOf(p)]=op.result;notify('foldDone');return true}return false;
};
$('quickDisplay').onclick=()=>$('displayDialog').showModal();
$('quickLayers').onclick=()=>{prefs.layerView=!prefs.layerView;$('layerView').checked=prefs.layerView;preferences();sync()};
applyLanguage();
