'use client';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight,Pause,Play,Flower2,Leaf} from 'lucide-react';
const slides=[
 {src:'/images/tutu-prince.webp',name:'森林斗篷与皇冠',kind:'小猫',outfit:'森林绿斗篷，搭配精致小皇冠。',label:'森林斗篷 · 小皇冠',alt:'AI 写实穿搭示例：圆脸蓝眼暹罗猫穿森林绿斗篷戴小皇冠'},
 {src:'/images/dog-bandana.webp',name:'草木格纹围巾',kind:'小狗',outfit:'系上小围巾，去收集今天的风。',label:'草木格纹围巾',alt:'写实 AI 穿搭示例：奶油色小狗佩戴绿色格纹围巾'},
 {src:'/images/bird-hat.webp',name:'迷你草编帽',kind:'小鸟',outfit:'戴一顶小帽子，把晴天留在头顶。',label:'迷你草编帽',alt:'写实 AI 穿搭示例：浅黄色虎皮鹦鹉戴小草帽站在树枝上'},
 {src:'/images/snake-bow.webp',name:'暖杏色小领结',kind:'小蛇',outfit:'一点蝴蝶结，也有自己的可爱。',label:'暖杏色小领结',alt:'写实 AI 穿搭示例：奶咖色玉米蛇盘卧，身体上松搭暖杏色蝴蝶结'},
 {src:'/images/hamster.webp',name:'牛仔背带裤',kind:'仓鼠',outfit:'把今天的好心情，装进口袋里。',label:'牛仔背带裤',alt:'AI 写实穿搭：金色圆脸仓鼠穿蓝色牛仔背带裤'},
 {src:'/images/rabbit.webp',name:'丁香紫针织衫',kind:'兔子',outfit:'软软的耳朵，配软软的针织衫。',label:'丁香紫针织衫',alt:'AI 写实穿搭：灰色垂耳兔穿淡紫色针织开衫'},
 {src:'/images/hedgehog.webp',name:'探险马甲与挎包',kind:'刺猬',outfit:'穿好小马甲，出发探险。',label:'探险马甲 · 小挎包',alt:'AI 写实穿搭：小刺猬穿铁锈色探险马甲配帆布小包'},
 {src:'/images/guinea.webp',name:'海军蓝水手领',kind:'豚鼠',outfit:'今天的航线，是去找一片生菜。',label:'海军蓝水手领',alt:'AI 写实穿搭：三色豚鼠佩戴海军蓝白水手领'},
];
export default function PetShowcase(){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false),[focused,setFocused]=useState(false),[hidden,setHidden]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');setReduced(m.matches);const change=()=>setReduced(m.matches);const visibility=()=>setHidden(document.hidden);m.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);return()=>{m.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility)}},[]);
 useEffect(()=>{if(paused||hover||focused||hidden||reduced)return;const id=setInterval(()=>setIndex(i=>(i+1)%slides.length),5500);return()=>clearInterval(id)},[paused,hover,focused,hidden,reduced,index]);
 const move=(step:number)=>setIndex(i=>(i+step+slides.length)%slides.length);
 const s=slides[index];
 return <section className="pet-showcase" aria-roledescription="轮播" aria-label="宠物穿搭灵感照片" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}}>
  <span className="fitting-sign">FITTING ROOM · 01</span><Flower2 className="showcase-flower" size={44} aria-hidden="true"/><Leaf className="showcase-leaf" size={42} aria-hidden="true"/>
  <div className="mirror-stage"><div className="curtain curtain-left" aria-hidden="true"/><div className="curtain curtain-right" aria-hidden="true"/><div className="photo-mat"><div className="pet-photo">{slides.map((p,i)=><img key={p.src} src={p.src} alt={p.alt} aria-hidden={i!==index} className={i===index?'current':''} loading={i===0?'eager':'lazy'}/>)}<span className="photo-category">{s.kind}</span><span className="photo-number">0{index+1} / 08</span></div><div className="photo-caption"><div><strong>{s.name}</strong><p>{s.outfit}</p></div><span className="caption-flower">✳</span></div></div></div>
  <div className="carousel-controls"><button aria-label="上一张宠物照片" onClick={()=>move(-1)}><ChevronLeft size={17}/></button><div className="carousel-dots" role="group" aria-label="选择宠物">{slides.map((p,i)=><button key={p.name} className={index===i?'active':''} aria-label={`查看${p.kind}：${p.name}`} aria-pressed={index===i} onClick={()=>setIndex(i)}/>)}</div><button aria-label="下一张宠物照片" onClick={()=>move(1)}><ChevronRight size={17}/></button><button className="pause-button" aria-label={paused?'播放轮播':'暂停轮播'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={13}/>:<Pause size={13}/>}</button></div>
  <div className="outfit-rail" role="group" aria-label="八位宠物的衣橱">{slides.map((p,i)=><button key={p.src} className={i===index?'chosen':''} aria-label={`选择${p.kind}造型：${p.label}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={p.src} alt="" loading="lazy"/><span>{p.kind}</span></button>)}</div><p className="showcase-disclosure">AI 穿搭示例 · 发现更多穿搭灵感</p>
 </section>
}
