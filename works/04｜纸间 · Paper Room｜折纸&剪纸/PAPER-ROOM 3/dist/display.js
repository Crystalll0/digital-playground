'use strict';
Object.assign(WORDS, {
 displaySettings:['显示设置','顯示設定','Display settings'],
 textSize:['界面字号','介面字級','Interface text size'],
 pointerSize:['工作区指针大小','工作區游標大小','Workspace pointer size'],
 systemPointer:['系统默认','系統預設','System default'],
 guideWidth:['辅助虚线粗细','輔助虛線粗細','Dashed guide thickness'],
 guideColor:['辅助虚线颜色','輔助虛線顏色','Dashed guide colour'],
 layerView:['半透明纸层','半透明紙層','Translucent paper layers'],
 layerNote:['半透明仅帮助查看重叠，不会改变纸张或自动对齐。此模型仍不能单独翻开一层纸。','半透明僅幫助查看重疊，不會改變紙張或自動對齊。此模型仍不能單獨翻開一層紙。','Transparency reveals overlap; it does not change the paper or align it automatically. Individual layers still cannot be opened separately.'],
 resetDisplay:['恢复默认显示','還原預設顯示','Reset display settings']
});
(() => {
 const defaults={textSize:1,pointerSize:0,guideWidth:1,guideColor:'#987142',layerView:false};
 for(const [key,allowed] of Object.entries({textSize:[1,1.2,1.4],pointerSize:[0,24,40,56],guideWidth:[1,2,3]}))if(!allowed.includes(+prefs[key]))prefs[key]=defaults[key];
 if(!/^#[0-9a-f]{6}$/i.test(prefs.guideColor||''))prefs.guideColor=defaults.guideColor;
 prefs.layerView=prefs.layerView===true;
 const ring=$('workspacePointer');
 function apply(){
   document.documentElement.style.setProperty('--text-scale',prefs.textSize);
   document.body.classList.toggle('large-text',prefs.textSize>1);
   for(const key of ['textSize','pointerSize','guideWidth','guideColor'])$(key).value=prefs[key];
   $('layerView').checked=prefs.layerView;
   ring.style.width=ring.style.height=prefs.pointerSize+'px';ring.hidden=true;
   render();
 }
 $('displaySettings').onclick=()=>{$('displayDialog').showModal()};
 for(const key of ['textSize','pointerSize','guideWidth','guideColor','layerView'])$(key).onchange=()=>{
   prefs[key]=key==='layerView'?$(key).checked:key==='guideColor'?$(key).value:+$(key).value;
   apply();preferences();
 };
 $('resetDisplay').onclick=()=>{Object.assign(prefs,defaults);apply();preferences()};
 canvas.addEventListener('pointermove',event=>{
   ring.hidden=!prefs.pointerSize;
   ring.style.left=event.clientX+'px';ring.style.top=event.clientY+'px';
 });
 canvas.addEventListener('pointerleave',()=>{ring.hidden=true});
 canvas.addEventListener('pointercancel',()=>{ring.hidden=true});
 apply();applyLanguage();
})();
