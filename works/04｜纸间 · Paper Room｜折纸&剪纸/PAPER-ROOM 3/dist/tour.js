'use strict';
if(!PRACTICE)(()=>{
 const dialog=$('tourDialog'),frame=$('practiceFrame'),seenKey='paper-room-introduction-v2';
 const words={
 welcome:['欢迎来到纸间','歡迎來到紙間','Welcome to Paper Room'],
 intro:['一张纸，从你的第一个动作开始。先选语言，再用真实工具完成几次小练习。','一張紙，從你的第一個動作開始。先選語言，再用真實工具完成幾次小練習。','One sheet, your first move. Choose a language, then try the real tools in a few short activities.'],
 privacy:['练习使用独立作品，不会改变你的作品。可以随时跳过，之后从“教程 / 帮助”重新查看。','練習使用獨立作品，不會改變你的作品。可以隨時跳過，之後從「教學 / 說明」重新查看。','Practice uses a separate project. Your work stays untouched. Skip at any time and return through Tutorial / Help.'],
 language:['选择语言','選擇語言','Choose your language'],help:['教程 / 帮助','教學 / 說明','Tutorial / Help'],
 start:['开始练习','開始練習','Start practice'],next:['下一项','下一項','Next activity'],back:['上一项','上一項','Back'],skip:['跳过教程','跳過教學','Skip tutorial'],finish:['完成，开始创作','完成，開始創作','Finish and create'],
 ready:['✓ 已完成，可以继续','✓ 已完成，可以繼續','✓ Complete — ready to continue'],waiting:['完成当前操作后继续','完成目前操作後繼續','Complete this action to continue'],
 titles:[['新建纸张','新增紙張','Add paper'],['折叠','摺疊','Fold'],['移动','移動','Move'],['裁剪','裁剪','Cut'],['胶水','膠水','Glue'],['翻面','翻面','Flip'],['展开','展開','Unfold']],
 tasks:[
 ['在左侧选择纸张尺寸，点击“添加一张纸”。','在左側選擇紙張尺寸，點擊「新增一張紙」。','Choose a paper size on the left, then click Add a sheet.'],
 ['把右侧纸角拖到左侧纸角。松开后，在纸张旁点击“确认”或按空格；“取消”可重新尝试。','把右側紙角拖到左側紙角。放開後，在紙張旁點擊「確認」或按空格；「取消」可重新嘗試。','Drag a right corner to a left corner. Release, then click Confirm beside the paper or press Space. Cancel lets you try again.'],
 ['点击“移动”，将纸张向左或向右拖动一段距离。','點擊「移動」，將紙張向左或向右拖動一段距離。','Choose Move and drag the paper left or right.'],
 ['选择剪刀，沿纸张中间的折痕从上到下拖动。点击旁边的确认，或按空格完成裁剪。','選擇剪刀，沿紙張中間的摺痕從上到下拖動。點擊旁邊的確認，或按空格完成裁剪。','Choose Scissors. Drag along the centre crease from top to bottom, then Confirm or press Space to cut.'],
 ['选择胶水，在左边纸张上涂一点。再选择移动，将右边纸张拖到涂胶处，确认粘贴。','選擇膠水，在左邊紙張上塗一點。再選擇移動，將右邊紙張拖到塗膠處，確認貼合。','Paint glue on the left sheet. Choose Move, drag the right sheet onto the painted area and confirm the bond.'],
 ['选择纸张，点击“翻面”，观察正反面的变化。','選擇紙張，點擊「翻面」，觀察正反面的變化。','Select the paper and click Flip over to inspect its other side.'],
 ['点击“展开”，查看保留的折痕。你也可以撤销操作、旋转视角，并打开半透明观察重叠。','點擊「展開」，查看保留的摺痕。你也可以復原操作、旋轉視角，並開啟半透明觀察重疊。','Click Unfold to see the retained crease. You can also undo, orbit the view and use See layers to inspect overlaps.']]
 };
 let page=-1,done=false,timer=null,headingIndex=0;
 const t2=k=>words[k][lang];
 function send(){if(page>=0)frame.contentWindow?.postMessage({kind:'paper-practice-step',step:page,lang},location.origin)}
 function stop(){if(timer)clearInterval(timer);timer=null}
 function renderTour(){
  $('learn').textContent=t2('help');$('tourLanguage').value=lang;
  $('tourTitle').textContent=page<0?t2('welcome'):words.titles[page][lang];
  $('tourWelcomeText').textContent=t2('intro');$('tourLanguageLabel').textContent='选择语言 / 選擇語言 / Select Language';$('tourPrivacy').textContent=t2('privacy');
  $('tourWelcome').hidden=page>=0;$('tourLesson').hidden=page<0;dialog.classList.toggle('lesson-open',page>=0);
  $('tourBack').hidden=page<0;$('tourBack').textContent=t2('back');$('tourSkip').textContent=t2('skip');
  $('tourNext').textContent=t2(page<0?'start':page===6?'finish':'next');$('tourNext').disabled=page>=0&&!done;
  $('tourClose').setAttribute('aria-label',t2('skip'));
  if(page>=0){$('tourProgress').textContent=`${page+1} / 7 · ${t2(done?'ready':'waiting')}`;$('tourInstruction').textContent=words.tasks[page][lang]}
 }
 function showPage(n){stop();page=n;done=false;renderTour();if(page>=0){if(!frame.getAttribute('src'))frame.setAttribute('src','index.html?practice=1');else send()}else{
   headingIndex=lang;if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>{headingIndex=(headingIndex+1)%3;$('tourTitle').textContent=words.welcome[headingIndex]},2600);
  }}
 function close(){stop();dialog.close();try{localStorage.setItem(seenKey,'true')}catch{}$('learn').focus()}
 function open(){showPage(-1);dialog.showModal();$('tourLanguage').focus()}
 $('tourLanguage').onchange=()=>{lang=+$('tourLanguage').value;applyLanguage();preferences();renderTour()};
 $('tourNext').onclick=()=>{if(page===6){close();return}if(page<0||done)showPage(page+1)};
 $('tourBack').onclick=()=>showPage(page-1);$('tourSkip').onclick=close;$('tourClose').onclick=close;
 dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
 window.addEventListener('message',event=>{if(event.source!==frame.contentWindow||event.origin!==location.origin)return;
  if(event.data?.kind==='paper-practice-ready')send();
  if(event.data?.kind==='paper-practice-done'&&event.data.step===page){done=true;renderTour()}
 });
 $('learn').onclick=open;$('language').addEventListener('change',renderTour);
 renderTour();let seen=false;try{seen=localStorage.getItem(seenKey)==='true'}catch{}if(!seen)open();
})();
