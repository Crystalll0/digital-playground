/* Pure game rules, kept separate from p5 rendering for coursework and checks. */
(function(root){
  'use strict';
  const PRESETS={
    easy:{speed:1.55,rate:.8,hazards:.07,bombShare:0,duration:60,ramp:.35,description:'A gentle warm-up. A few burnt bites, no chili bombs. Take your time and find your crunch.'},
    medium:{speed:2.4,rate:1.3,hazards:.15,bombShare:.3,duration:60,ramp:.45,description:'A balanced rush, with a few burnt bites and the occasional chili bomb.'},
    hard:{speed:3.25,rate:1.9,hazards:.23,bombShare:.4,duration:60,ramp:.5,description:'Faster falls, more bad bites. Keep your basket moving and your eyes on the golden ones.'},
    hell:{speed:4.4,rate:2.6,hazards:.32,bombShare:.5,duration:60,ramp:.5,description:'The fryer has gone rogue. Fast, crowded, spicy. You have been deliciously warned.'}
  };
  function config(level,custom){return {...(level==='custom'?{speed:2.4,rate:1.3,hazards:.15,bombShare:.4,duration:60,ramp:.4,...custom}:PRESETS[level]||PRESETS.medium)};}
  function chooseType(cfg,rng=Math.random){if(rng()>=cfg.hazards)return 'golden';return rng()<cfg.bombShare?'bomb':'burnt';}
  function newState(cfg){return {remaining:cfg.duration,elapsed:0,score:0,caught:0,missed:0,hazards:0,streak:0,bestStreak:0,coins:0,coinMultiplier:1,dogCaught:false,slowRemaining:0,shield:0,clockBonus:0,done:false};}
  function resolve(state,type,caught){
    let delta=0;
    if(type==='golden'){
      if(caught){delta=10;state.caught++;state.coins+=2*state.coinMultiplier;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);}
      else{delta=-2;state.missed++;state.streak=0;}
    }else if(type==='dog'){
      if(caught&&!state.dogCaught){state.dogCaught=true;state.coinMultiplier=2;state.coins*=2;}
    }else if(type==='clock'){
      if(caught&&state.clockBonus<15){state.remaining+=5;state.clockBonus+=5;}
    }else if(type==='coffee'){
      if(caught)state.slowRemaining=4;
    }else if(type==='cola'){
      if(caught)state.shield=1;
    }else if(caught){
      if(state.shield)state.shield=0;
      else{delta=type==='bomb'?-20:-10;state.hazards++;state.streak=0;}
    }
    state.score=Math.max(0,state.score+delta);return delta;
  }
  function tick(state,dt){if(state.done)return;state.remaining=Math.max(0,state.remaining-dt);state.elapsed+=dt;state.slowRemaining=Math.max(0,state.slowRemaining-dt);if(state.remaining<=0)state.done=true;}
  function bonusPlan(duration,rng=Math.random){return {willVisit:rng()<.12,at:duration*(.2+rng()*.5),variant:Math.floor(rng()*3)};}
  function bonusType(state,plan,spawned,rng=Math.random){if(plan.willVisit&&!spawned&&state.elapsed>=plan.at)return 'dog';if(rng()<.045)return ['clock','coffee','cola'][Math.min(2,Math.floor(rng()*3))];return null;}
  function difficultyAt(cfg,elapsed){const progress=Math.min(1,elapsed/cfg.duration);return {speed:cfg.speed*(1+cfg.ramp*progress),rate:cfg.rate*(1+cfg.ramp*.55*progress)};}
  function overlaps(item,basket,previousY){return item.x+item.w*.35>basket.x-basket.w/2&&item.x-item.w*.35<basket.x+basket.w/2&&previousY+item.h/2<=basket.y+12&&item.y+item.h/2>=basket.y;}
  function recordKey(level,cfg){return 'crunch-course-stage-04-best:'+level+(level==='custom'?':'+[cfg.speed,cfg.rate,cfg.hazards,cfg.duration].join(','):'');}
  const api={PRESETS,config,chooseType,newState,resolve,tick,difficultyAt,bonusPlan,bonusType,overlaps,recordKey};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CrunchRules=api;
})(typeof window!=='undefined'?window:globalThis);
