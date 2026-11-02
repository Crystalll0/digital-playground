/* =========================================================
   HASH BROWN CATCH — p5.js sketch (global mode)
   Course mapping
     Week 4  input & response : mouse / touch drag, keyboard
     Week 5  images & frames  : pixel sprites -> p5.Graphics,
                                frame swapping (fall / caught / mash)
     Week 6  sound            : p5.sound loadSound() + play()
   Collision: simple rectangle overlap between hash brown and basket.
   ========================================================= */

// ------------------------------------------------------------------
// 1. CONFIG
// ------------------------------------------------------------------
const VIEW_H = 640;            // logical height; width adapts to screen
const SPRITE_SCALE = 2.2;      // pixel-art upscale for falling items
const RIM_Y = 522;             // basket rim (top) in logical px
const BASKET_H = 46;
const GROUND_Y = 590;          // counter-top where missed items land

const POINTS = { catch: 10, golden: 30, miss: -2, burnt: -5, bomb: -15, comboEvery: 10, comboBonus: 20 };
const DOG_CHANCE = 0.025;      // ~1 in 40 hash browns turns into the Evil Potato Dog
const DOG_POINTS = POINTS.catch * 2;

const DIFFICULTIES = {
  easy:   { label: "EASY",   speed: 150, ramp: 0.7, spawn: [1.05, 0.65], hazard: 0.07, bombShare: 0.0, golden: 0.05, power: 0.10, basket: 175, sway: 0,  time: 60 },
  normal: { label: "NORMAL", speed: 200, ramp: 0.8, spawn: [0.88, 0.50], hazard: 0.14, bombShare: 0.4, golden: 0.05, power: 0.08, basket: 145, sway: 0,  time: 60 },
  hard:   { label: "HARD",   speed: 265, ramp: 0.9, spawn: [0.72, 0.38], hazard: 0.22, bombShare: 0.5, golden: 0.06, power: 0.06, basket: 125, sway: 16, time: 60 },
  hell:   { label: "HELL",   speed: 335, ramp: 1.0, spawn: [0.56, 0.27], hazard: 0.32, bombShare: 0.55, golden: 0.07, power: 0.05, basket: 110, sway: 42, time: 60 }
};

// Custom difficulty: sliders 1-10 mapped to real numbers
function customDifficulty(c) {
  const speed = 120 + (c.speed - 1) * 28;
  const s0 = 1.15 - (c.rate - 1) * 0.085;
  return {
    label: "CUSTOM", speed, ramp: 0.85, spawn: [s0, s0 * 0.6],
    hazard: c.hazards * 0.035, bombShare: 0.45, golden: 0.06, power: 0.08,
    basket: { S: 110, M: 145, L: 175 }[c.basket] || 145,
    sway: c.speed >= 8 ? 30 : 0, time: c.time || 60
  };
}

// ------------------------------------------------------------------
// 2. STATE
// ------------------------------------------------------------------
let W = 960;            // logical width (changes with screen)
let S = 1;              // css px per logical px
let bgImg = null;       // the Crunch Club diner background
let SPR = {};           // p5.Graphics frames
let SFX = {};           // p5.SoundFile objects
let muted = false;
let decor = [];         // dust motes + oil dots

const G = {
  state: "title",       // title | ready | play | paused | over
  diffKey: "normal", diff: DIFFICULTIES.normal,
  score: 0, timeLeft: 60, timeTotal: 60, elapsed: 0,
  combo: 0, bestCombo: 0, caught: 0, missed: 0, hazardsHit: 0, goldens: 0,
  items: [], particles: [], popups: [], mashes: [], ghosts: [], pile: [], pops: [], runners: [],
  dogsCaught: 0, loadout: null,
  spawnTimer: 0.6, lastSpawnX: -999,
  basket: { x: 480, target: 480, w: 145, flash: 0, stun: 0, tilt: 0 },
  slow: 0, shake: 0, readyT: 0, lastTick: -1,
  pointerSeen: 0, demo: false, listeners: [], titleT: 0
};

// ------------------------------------------------------------------
// 3. p5 LIFECYCLE
// ------------------------------------------------------------------
function setup() {
  const size = stageSize();
  const cnv = createCanvas(size.w, size.h);
  cnv.parent("game-canvas-wrap");
  cnv.id("game-canvas");
  noSmooth();                         // crisp pixels
  frameRate(60);
  applyScale();

  applyLoadout();
  // load the background without blocking start-up (falls back to code drawing)
  loadImage(assetPath("assets/diner-bg.jpg"), img => { bgImg = img; emit("assets"); }, () => { bgImg = null; emit("assets"); });
  loadSounds();
  makeDecor();

  G.basket.x = G.basket.target = W / 2;
  emit("ready");
}

function draw() {
  const dt = Math.min(deltaTime, 50) / 1000;
  G.titleT += dt;

  if (G.state === "ready") updateReady(dt);
  if (G.state === "play") update(dt);
  if (G.state === "title" || G.state === "over") updateAmbient(dt);

  push();
  scale(S);
  if (G.shake > 0) translate(random(-1, 1) * G.shake * 10, random(-1, 1) * G.shake * 6);
  drawBackground();
  drawMashes();
  drawItems();
  drawBasketAndPile();
  drawParticles();
  drawPopups();
  if (G.slow > 0) drawSlowTint();
  if (G.state !== "title") drawHUD();
  if (G.state === "ready") drawReady();
  pop();
}

function windowResized() {
  const size = stageSize();
  resizeCanvas(size.w, size.h);
  applyScale();
  G.basket.x = constrain(G.basket.x, G.basket.w / 2, W - G.basket.w / 2);
}

// ------------------------------------------------------------------
// 4. INPUT (Week 4)
// ------------------------------------------------------------------
function mouseMoved() { if (insideCanvas()) G.pointerSeen = millis(); }
function mouseDragged() { if (insideCanvas()) G.pointerSeen = millis(); }
function touchStarted() { if (insideCanvas()) G.pointerSeen = millis(); }
function touchMoved() { if (insideCanvas()) G.pointerSeen = millis(); }

function keyPressed() {
  if (G.state === "play" || G.state === "paused") {
    if (key === "p" || key === "P" || keyCode === ESCAPE) { togglePause(); return false; }
  }
  if (key === "m" || key === "M") { if (document.activeElement && document.activeElement.tagName === "INPUT") return; setMuted(!muted); }
  if (G.state === "play" && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) return false;
}

function insideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function updateBasketInput(dt) {
  const b = G.basket;
  if (b.stun > 0) { b.stun -= dt; return; }
  if (G.demo) { b.target = demoTarget(); }
  else {
    const usingPointer = mouseIsPressed || millis() - G.pointerSeen < 1500;
    if (usingPointer && insideCanvas()) b.target = mouseX / S;
    const k = 720 * dt;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { b.target = b.x - k * 3; G.pointerSeen = 0; }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { b.target = b.x + k * 3; G.pointerSeen = 0; }
  }
  b.target = constrain(b.target, b.w / 2 + 6, W - b.w / 2 - 6);
  const prev = b.x;
  b.x += (b.target - b.x) * Math.min(1, dt * (G.demo ? 9 : 18));
  b.tilt = lerp(b.tilt, constrain((b.x - prev) * 0.02, -0.12, 0.12), 0.3);
}

// ------------------------------------------------------------------
// 5. GAME FLOW (called by ui.js through window.HBC)
// ------------------------------------------------------------------
function startGame(diffKey, custom, opts) {
  opts = opts || {};
  G.diffKey = diffKey;
  G.diff = diffKey === "custom" ? customDifficulty(custom) : DIFFICULTIES[diffKey];
  G.timeTotal = opts.duration || G.diff.time;
  G.timeLeft = G.timeTotal; G.elapsed = 0;
  G.score = 0; G.combo = 0; G.bestCombo = 0; G.caught = 0; G.missed = 0; G.hazardsHit = 0; G.goldens = 0;
  G.items = []; G.particles = []; G.popups = []; G.mashes = []; G.ghosts = []; G.pile = []; G.pops = []; G.runners = [];
  G.dogsCaught = 0;
  applyLoadout();
  G.spawnTimer = 0.2; G.slow = 0; G.shake = 0; G.lastTick = -1;
  G.basket.w = G.diff.basket; G.basket.x = G.basket.target = W / 2; G.basket.stun = 0;
  G.demo = !!opts.demo;
  G.demoMiss = opts.demoMiss || 0;
  G.state = "ready"; G.readyT = 0;
  play("ding");
  emit("start");
}

function togglePause() {
  if (G.state === "play") { G.state = "paused"; emit("pause"); }
  else if (G.state === "paused") { G.state = "play"; emit("resume"); }
}

function quitToTitle() {
  G.state = "title"; G.items = []; G.pile = []; G.pops = []; G.mashes = []; G.ghosts = []; G.runners = [];
  emit("title");
}

function endGame() {
  G.state = "over";
  G.items = [];
  play("timesup");
  const best = readBest(G.diffKey);
  const isBest = !G.demo && G.score > best;
  if (isBest) writeBest(G.diffKey, G.score);
  let wallet = null;
  if (!G.demo && window.HBShop) wallet = window.HBShop.addCoins(G.score);
  emit("over", {
    coinsEarned: G.demo ? 0 : G.score, wallet, dogs: G.dogsCaught,
    score: G.score, best: Math.max(best, G.demo ? best : G.score), isBest,
    caught: G.caught, missed: G.missed, bestCombo: G.bestCombo, hazards: G.hazardsHit,
    goldens: G.goldens, diff: G.diff.label
  });
}

function updateReady(dt) {
  G.readyT += dt;
  updateBasketInput(dt);
  updateEffects(dt);
  if (G.readyT >= 1.5) { G.state = "play"; emit("go"); }
}

// ------------------------------------------------------------------
// 6. UPDATE
// ------------------------------------------------------------------
function update(dt) {
  G.elapsed += dt;
  G.timeLeft -= dt;
  const secs = Math.ceil(G.timeLeft);
  if (secs <= 5 && secs >= 1 && secs !== G.lastTick) { G.lastTick = secs; play("tick", 0.5); }
  if (G.timeLeft <= 0) { G.timeLeft = 0; endGame(); return; }

  if (G.slow > 0) G.slow -= dt;
  const itemDt = dt * (G.slow > 0 ? 0.45 : 1);

  updateBasketInput(dt);

  // spawn
  G.spawnTimer -= itemDt;
  if (G.spawnTimer <= 0) {
    spawnItem();
    const p = progress();
    G.spawnTimer = lerp(G.diff.spawn[0], G.diff.spawn[1], p) * random(0.8, 1.2);
  }

  // move items + collisions
  const b = G.basket;
  for (let i = G.items.length - 1; i >= 0; i--) {
    const it = G.items[i];
    it.t += itemDt;
    const prevBottom = it.y + it.hh;
    it.y += it.vy * itemDt;
    if (it.sway) it.x = constrain(it.baseX + Math.sin(it.t * it.swayF + it.swayPh) * it.sway, 30, W - 30);
    it.rot += it.rotV * itemDt;
    if (it.dogAt && it.type === "hash" && it.y >= it.dogAt) transformToDog(it);
    const bottom = it.y + it.hh;

    // rectangle collision with the basket opening
    const overlapX = Math.abs(it.x - b.x) <= b.w / 2 - 6 + it.hw * 0.5;
    if (prevBottom <= RIM_Y + 10 && bottom >= RIM_Y && overlapX) {
      onCatch(it);
      G.items.splice(i, 1);
      continue;
    }
    if (bottom >= GROUND_Y) {
      onLand(it);
      G.items.splice(i, 1);
    }
  }
  updateEffects(dt);
}

function progress() { return constrain(G.elapsed / G.timeTotal, 0, 1); }

function spawnItem(forceType, forceX, extra) {
  const d = G.diff;
  let type = "hash";
  const r = random();
  if (r < d.hazard) type = random() < d.bombShare ? "bomb" : "burnt";
  else if (r < d.hazard + d.golden) type = "golden";
  else if (r < d.hazard + d.golden + d.power) type = (random() < 0.5 && G.timeLeft < G.timeTotal - 8) ? "clock" : "coffee";
  if (forceType) type = forceType;

  let x = random(40, W - 40);
  for (let k = 0; k < 6 && Math.abs(x - G.lastSpawnX) < 90; k++) x = random(40, W - 40);
  if (forceX != null) x = forceX;
  G.lastSpawnX = x;

  const p = progress();
  let vy = d.speed * (1 + d.ramp * p) * random(0.88, 1.12);
  if (type === "golden") vy *= 1.25;
  if (type === "coffee" || type === "clock") vy *= 0.9;

  const dims = {
    hash: [17, 24], golden: [17, 24], burnt: [17, 24],
    bomb: [17, 18], coffee: [13, 11], clock: [13, 12], dog: [24, 24]
  }[type];
  G.items.push({
    type, x, baseX: x, y: -40, vy, t: 0,
    rot: random(-0.3, 0.3), rotV: random(-0.8, 0.8),
    hw: dims[0] * SPRITE_SCALE / 2, hh: dims[1] * SPRITE_SCALE / 2,
    sway: d.sway && type !== "golden" ? random(0.4, 1) * d.sway : 0,
    swayF: random(2, 3.5), swayPh: random(TWO_PI),
    ignore: G.demo && random() < (G.demoMiss || 0),
    bait: !!(extra && extra.bait)
  });
  if (extra && extra.sway === 0) G.items[G.items.length - 1].sway = 0;
  if (extra && extra.ignore) G.items[G.items.length - 1].ignore = true;
  // easter egg: some hash browns turn into the Evil Potato Dog mid-air
  const last = G.items[G.items.length - 1];
  if (type === "hash" && ((extra && extra.dog) || (!window.HBC_NO_RANDOM_DOG && random() < DOG_CHANCE))) {
    last.dogAt = random(120, 230);
    last.dogVariant = (extra && extra.dogVariant) || (window.HBShop ? window.HBShop.pickDog(random()) : "couch");
  }
}

function transformToDog(it) {
  it.type = "dog"; it.dogAt = 0;
  it.hw = 24 * SPRITE_SCALE / 2; it.hh = 22 * SPRITE_SCALE / 2;
  it.vy *= 0.9; it.rotV *= 0.3; it.sway = 0;
  burst(it.x, it.y, 16, ["#FFFFFF", "#E9DCCB", "#CFC3B2"], "smoke");
  burst(it.x, it.y, 8, ["#FFD24A", "#FFFFFF"], "spark");
  popup("?!", it.x + 30, it.y - 30, "#4A2412", 20);
  play("poof", 0.8);
  setTimeout(() => play("dog", 0.7), 160);
}

function onCatch(it) {
  const b = G.basket;
  const off = constrain(it.x - b.x, -b.w * 0.3, b.w * 0.3);
  switch (it.type) {
    case "hash":
    case "golden": {
      const golden = it.type === "golden";
      const pts = golden ? POINTS.golden : POINTS.catch;
      addScore(pts);
      G.caught++; if (golden) G.goldens++;
      G.combo++; G.bestCombo = Math.max(G.bestCombo, G.combo);
      play(golden ? "golden" : "crunch", golden ? 0.8 : 0.9, random(0.92, 1.1));
      popup((golden ? "+" + pts + " GOLDEN!" : "+" + pts), it.x, RIM_Y - 50, golden ? "#FFB800" : "#E63B2E", golden ? 22 : 20);
      burst(it.x, RIM_Y - 10, golden ? 22 : 10, golden ? ["#FFF1A6", "#FFD24A", "#FFFFFF"] : ["#FFD24A", "#FFF4C9"], "spark");
      b.flash = 0.6;
      G.pops.push({ off, t: 0, skin: golden ? "golden" : "normal" });
      addToPile({ off, skin: golden ? "golden" : "normal" });
      if (G.combo > 0 && G.combo % POINTS.comboEvery === 0) {
        addScore(POINTS.comboBonus);
        play("combo", 0.6);
        popup("COMBO x" + G.combo + "  +" + POINTS.comboBonus, b.x, RIM_Y - 92, "#4A2412", 18);
      }
      emit("catch", { type: it.type });
      break;
    }
    case "dog": {
      addScore(DOG_POINTS);
      G.caught++; G.dogsCaught++;
      G.combo++; G.bestCombo = Math.max(G.bestCombo, G.combo);
      play("dog", 0.9); play("golden", 0.5);
      popup("EVIL POTATO DOG!", b.x, RIM_Y - 112, "#4A2412", 18);
      popup("x2  +" + DOG_POINTS, it.x, RIM_Y - 60, "#E63B2E", 24);
      burst(it.x, RIM_Y - 10, 24, ["#FFD24A", "#FFFFFF", "#DDB57A"], "spark");
      b.flash = 0.8; G.shake = 0.15;
      addToPile({ off, dog: it.dogVariant });
      if (!G.demo && window.HBShop) window.HBShop.recordDog(it.dogVariant);
      emit("dog", { variant: it.dogVariant });
      break;
    }
    case "burnt":
      addScore(POINTS.burnt);
      G.combo = 0; G.hazardsHit++;
      play("bonk", 0.8);
      popup(POINTS.burnt + " BURNT!", it.x, RIM_Y - 50, "#5B3519", 18);
      burst(it.x, RIM_Y - 10, 12, ["#6E6259", "#9C9088", "#4A3A2A"], "smoke");
      break;
    case "bomb":
      addScore(POINTS.bomb);
      G.combo = 0; G.hazardsHit++;
      play("boom", 0.9);
      popup(POINTS.bomb + " TOO HOT!", it.x, RIM_Y - 60, "#E63B2E", 22);
      burst(it.x, RIM_Y - 10, 26, ["#E63B2E", "#FF8A1F", "#FFD24A", "#FFFFFF"], "fire");
      burst(it.x, RIM_Y - 10, 10, ["#6E6259", "#9C9088"], "smoke");
      G.shake = 0.5; b.stun = 0.9;
      G.pile.splice(Math.max(0, G.pile.length - 3), 3);   // blows the top off the stack
      break;
    case "coffee":
      G.slow = 4;
      play("slow", 0.8);
      popup("SLOW-MO!", it.x, RIM_Y - 50, "#7A5C48", 20);
      burst(it.x, RIM_Y - 10, 10, ["#FFFFFF", "#E9DCCB"], "spark");
      break;
    case "clock":
      G.timeLeft += 5;
      play("clock", 0.8);
      popup("+5s", it.x, RIM_Y - 50, "#E63B2E", 22);
      burst(it.x, RIM_Y - 10, 10, ["#FFFFFF", "#FFD24A"], "spark");
      break;
  }
}

function onLand(it) {
  switch (it.type) {
    case "hash":
    case "golden":
      addScore(POINTS.miss);
      G.missed++; G.combo = 0;
      play("squelch", 0.85);
      addMash(it.x, it.type === "golden");
      addGhost(it.x);
      popup(String(POINTS.miss), it.x + 28, GROUND_Y - 44, "#857353", 18);
      burst(it.x, GROUND_Y - 4, 8, ["#F5A623", "#FFD978", "#D9CBA9"], "crumb");
      emit("miss");
      break;
    case "dog":
      G.runners.push({ x: it.x, dir: it.x < W / 2 ? -1 : 1, t: 0, variant: it.dogVariant });
      popup("IT GOT AWAY...", it.x, GROUND_Y - 60, "#4A2412", 14);
      play("dog", 0.5, 1.2);
      break;
    case "burnt":
      burst(it.x, GROUND_Y - 4, 6, ["#5B3519", "#3E2210"], "crumb");
      popup("DODGED!", it.x, GROUND_Y - 40, "#2F7D6D", 14);
      break;
    case "bomb":
      play("bonk", 0.35, 0.6);
      burst(it.x, GROUND_Y - 6, 12, ["#E63B2E", "#A9231A", "#FF8A1F"], "crumb");
      burst(it.x, GROUND_Y - 6, 5, ["#9C9088"], "smoke");
      popup("DODGED!", it.x, GROUND_Y - 40, "#2F7D6D", 14);
      break;
    default:
      burst(it.x, GROUND_Y - 4, 5, ["#FFFFFF", "#E9DCCB"], "crumb");
  }
}

// caught hash browns stack up in the basket, layer by layer
function addToPile(p) {
  G.pile.push({ off: p.off, skin: p.skin, dog: p.dog, rot: random(-0.3, 0.3), jx: random(-5, 5), t: 0 });
  if (G.pile.length > 80) G.pile.splice(0, G.pile.length - 80);
}
function pileSlot(i, bw) {
  const per = Math.max(3, Math.floor(bw / 26));
  const layer = Math.floor(i / per), col = i % per;
  const span = bw * 0.78;
  const x = (col - (per - 1) / 2) * (span / per) + (layer % 2 ? span / per / 2 : 0);
  return { x: constrain(x, -bw * 0.4, bw * 0.4), y: -6 - layer * 15, layer };
}
// missed hash browns stay on the counter and pile up where they land
function addMash(x, golden) {
  let level = 0;
  for (const m of G.mashes) if (Math.abs(m.x - x) < 34) level = Math.max(level, m.level + 1);
  G.mashes.push({ x, t: 0, golden, level: Math.min(level, 7) });
}
function addGhost(x) {
  G.ghosts.push({ x, y: GROUND_Y - 30, t: 0, ph: random(TWO_PI), top: random(34, 120), drift: random(-14, 14), hue: Math.floor(random(7)) });
  if (G.ghosts.length > 40) G.ghosts.shift();
}

function addScore(n) { G.score = Math.max(0, G.score + n); emit("score", { score: G.score }); }

// ------------------------------------------------------------------
// 7. EFFECTS
// ------------------------------------------------------------------
function burst(x, y, n, colors, kind) {
  for (let i = 0; i < n; i++) {
    const a = random(TWO_PI), sp = random(60, kind === "fire" ? 340 : 200);
    G.particles.push({
      kind, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (kind === "smoke" ? 60 : 120),
      life: 0, max: random(0.45, kind === "smoke" ? 1.1 : 0.8),
      size: kind === "smoke" ? random(10, 22) : random(3, 7),
      color: random(colors)
    });
  }
}

function popup(text, x, y, color, size) {
  G.popups.push({ text, x: constrain(x, 70, W - 70), y, color, size: size || 18, life: 0 });
}

function updateEffects(dt) {
  const b = G.basket;
  if (b.flash > 0) b.flash -= dt;
  if (G.shake > 0) G.shake = Math.max(0, G.shake - dt);
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const p = G.particles[i];
    p.life += dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.kind === "smoke") { p.vx *= 0.94; p.vy = p.vy * 0.94 - 20 * dt; p.size += 14 * dt; }
    else p.vy += 520 * dt;
    if (p.kind === "crumb" && p.y > GROUND_Y) { p.y = GROUND_Y; p.vy *= -0.3; p.vx *= 0.6; }
    if (p.life > p.max) G.particles.splice(i, 1);
  }
  for (let i = G.popups.length - 1; i >= 0; i--) {
    const p = G.popups[i];
    p.life += dt; p.y -= 34 * dt;
    if (p.life > 1.1) G.popups.splice(i, 1);
  }
  for (const m of G.mashes) m.t += dt;
  for (const g of G.ghosts) {
    g.t += dt;
    if (g.y > g.top) { g.y -= 140 * dt; g.x += g.drift * dt; }   // float up to the ceiling...
  }
  for (let i = G.runners.length - 1; i >= 0; i--) {             // ...and escaped dogs run off-screen
    const r = G.runners[i];
    r.t += dt; r.x += r.dir * 260 * dt;
    if (r.x < -80 || r.x > W + 80) G.runners.splice(i, 1);
  }
  for (let i = G.pops.length - 1; i >= 0; i--) {
    G.pops[i].t += dt;
    if (G.pops[i].t > 0.55) G.pops.splice(i, 1);
  }
  for (const p of G.pile) p.t += dt;
}

function updateAmbient(dt) { updateEffects(dt); }

// ------------------------------------------------------------------
// 8. DRAWING
// ------------------------------------------------------------------
function drawBackground() {
  drawScene(G.loadout ? G.loadout.scene : "crunch", G.titleT);
}

// Each scene is drawn in logical units (W x 640). Counter top sits near y=470-490.
function drawScene(key, t) {
  if (key === "picnic") return drawPicnic(t);
  if (key === "space") return drawSpace(t);
  drawDiner(t, key === "night");
}

function drawDiner(t, night) {
  if (bgImg) {
    // "cover" fit, anchored to the bottom so the counter stays put
    const sc = Math.max(W / bgImg.width, VIEW_H / bgImg.height);
    const dw = bgImg.width * sc, dh = bgImg.height * sc;
    const dx = (W - dw) / 2, dy = VIEW_H - dh;
    image(bgImg, dx, dy, dw, dh);
    noStroke();
    if (night) {
      fill(16, 20, 58, 150); rect(0, 0, W, VIEW_H);
      // night sky in both windows
      for (const wx of [[0, 82], [1452, 1536]]) {
        const x0 = dx + wx[0] * sc, x1 = dx + wx[1] * sc, y0 = dy + 125 * sc, y1 = dy + 425 * sc;
        fill("#141A44"); rect(x0, y0, x1 - x0, y1 - y0);
        fill(255, 255, 220, 200);
        for (let i = 0; i < 9; i++) rect(x0 + ((i * 37) % Math.max(8, x1 - x0 - 6)), y0 + ((i * 53) % (y1 - y0 - 8)), 2, 2);
      }
      fill("#FFF3B0"); ellipse(dx + 1500 * sc, dy + 190 * sc, 26, 26);
      fill("#141A44"); ellipse(dx + 1508 * sc, dy + 184 * sc, 22, 22);
      // neon sign
      const flick = (Math.floor(t * 3) % 23 === 0) ? 90 : 255;
      textFont("Press Start 2P"); textAlign(CENTER, CENTER); textSize(Math.min(26, W / 22));
      fill(255, 80, 160, flick * 0.35); for (const o of [[-3, 0], [3, 0], [0, -3], [0, 3]]) text("OPEN 24/7", W / 2 + o[0], 230 + o[1]);
      fill(255, 140, 200, flick); text("OPEN 24/7", W / 2, 230);
      textSize(Math.min(12, W / 48)); fill(120, 230, 255, flick); text("HASH BROWNS ALL NIGHT", W / 2, 268);
    }
    // breathing lamp light (warmer and stronger at night)
    const glow = (night ? 46 : 26) + Math.sin(t * 2.1) * 8;
    for (const lx of [190, 1342]) {
      const x = dx + lx * sc, y = dy + 175 * sc;
      for (let r = 0; r < 4; r++) {
        fill(255, 226, 150, glow / (r + 1.2));
        ellipse(x, y + 60 + r * 30, 140 + r * 70, 110 + r * 60);
      }
    }
  } else {
    drawFallbackBackground();
    if (night) { noStroke(); fill(16, 20, 58, 150); rect(0, 0, W, VIEW_H); }
  }
  drawDecor(t, night);
}

function drawDecor(t, night) {
  noStroke();
  for (const d of decor) {
    if (d.kind === "dust") {
      const y = (d.y + t * d.v) % 470;
      fill(255, 245, 210, (night ? 50 : 90) + 60 * Math.sin(t * 2 + d.ph));
      rect(Math.round((d.x * W + Math.sin(t + d.ph) * 12) / 2) * 2, Math.round(y / 2) * 2 + 40, 3, 3);
    } else {
      fill(255, 214, 120, 70);
      ellipse(d.x * W, d.y, d.s * 2, d.s);
    }
  }
}

function drawPicnic(t) {
  noStroke();
  const sky = ["#8FD3FF", "#A3DBFF", "#B7E3FF", "#CBEBFF", "#DDF2FF"];
  for (let i = 0; i < 5; i++) { fill(sky[i]); rect(0, i * 70, W, 70); }
  fill("#FFE27A"); ellipse(W * 0.82, 90, 70, 70); fill("#FFF3B0"); ellipse(W * 0.82, 90, 46, 46);
  // drifting hash-brown-shaped clouds
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 260 + t * (8 + i * 3)) % (W + 200)) - 100, cy = 70 + (i % 2) * 70;
    fill(255, 255, 255, 235);
    ellipse(cx, cy, 120, 44); ellipse(cx - 34, cy + 6, 70, 34); ellipse(cx + 38, cy + 8, 70, 30);
  }
  // hills + trees
  fill("#9BD66A"); ellipse(W * 0.2, 400, W * 0.9, 220); fill("#7CC24E"); ellipse(W * 0.8, 410, W * 0.9, 200);
  for (const tx of [0.08, 0.3, 0.7, 0.93]) {
    const x = tx * W;
    fill("#8A5A2A"); rect(x - 5, 300, 10, 70);
    fill("#3E8E3A"); ellipse(x, 290, 70, 70); fill("#58A84A"); ellipse(x - 10, 280, 40, 36);
  }
  fill("#6DB544"); rect(0, 360, W, 110);
  for (let x = 0; x < W; x += 14) { fill("#5AA23A"); rect(x, 360 + ((x * 7) % 9), 3, 6); }
  // gingham blanket = the counter
  fill("#FFF6E3"); rect(0, 470, W, 170);
  for (let x = 0; x < W; x += 28) { fill(230, 59, 46, 110); rect(x, 470, 14, 170); }
  for (let y = 470; y < 640; y += 28) { fill(230, 59, 46, 110); rect(0, y, W, 14); }
  fill("#C8321E"); rect(0, 466, W, 6);
  // picnic basket + lemonade jar
  fill("#B97A3A"); rect(18, 412, 86, 58, 6); fill("#8A5222"); for (let x = 22; x < 100; x += 10) rect(x, 418, 4, 48);
  stroke("#8A5222"); strokeWeight(5); noFill(); ellipse(61, 414, 70, 50); noStroke();
  fill(255, 255, 255, 170); rect(W - 86, 398, 46, 72, 6); fill("#FFE066"); rect(W - 82, 420, 38, 46, 4);
  fill("#FFFFFF"); rect(W - 74, 428, 8, 8);
  drawDecor(t, false);
}

function drawSpace(t) {
  noStroke();
  const bands = ["#0B0B26", "#11113A", "#17194A", "#1E215A"];
  for (let i = 0; i < 4; i++) { fill(bands[i]); rect(0, i * 120, W, 120); }
  for (const d of decor) {
    if (d.kind !== "dust") continue;
    fill(255, 255, 255, 150 + 100 * Math.sin(t * 3 + d.ph));
    rect(d.x * W, d.y * 0.9, 2, 2); rect((d.x * 1.7 % 1) * W, (d.y * 1.3) % 420, 2, 2);
  }
  // ringed planet + tiny moon
  fill("#FF8A5B"); ellipse(W * 0.78, 150, 120, 120); fill("#FFB38A"); ellipse(W * 0.76, 140, 80, 70);
  noFill(); stroke(255, 214, 120, 200); strokeWeight(6); ellipse(W * 0.78, 150, 210, 44); noStroke();
  fill("#C9D1D9"); ellipse(W * 0.2, 110 + Math.sin(t * 0.6) * 8, 36, 36); fill("#9AA3AD"); ellipse(W * 0.2 - 6, 106 + Math.sin(t * 0.6) * 8, 8, 8);
  // porthole frame
  fill("#3A3F55"); rect(0, 0, W, 18); rect(0, 410, W, 14);
  // station counter
  fill("#5E6670"); rect(0, 424, W, 46);
  fill("#7FE0FF"); rect(0, 440, W, 4);
  fill("#9AA3AD"); rect(0, 470, W, 170);
  fill("#B8C0C8"); rect(0, 470, W, 10);
  fill("#7A828C"); for (let x = 16; x < W; x += 64) { rect(x, 500, 6, 6); rect(x, 600, 6, 6); }
  fill(127, 224, 255, 60 + 40 * Math.sin(t * 2)); rect(0, 548, W, 3);
}

function drawFallbackBackground() {
  // cream tile wall
  background("#FBEFCF");
  stroke("#EED9AB"); strokeWeight(2);
  for (let x = 0; x < W; x += 58) line(x, 0, x, 420);
  for (let y = 0; y < 420; y += 58) line(0, y, W, y);
  noStroke();
  fill("#D93A2C"); rect(0, 0, W, 16); rect(0, 22, W, 6);
  // steel counter + red/white checker band
  fill("#C9CDD2"); rect(0, 412, W, 12);
  for (let x = 0, i = 0; x < W; x += 26, i++) {
    fill(i % 2 ? "#FFF6E3" : "#D93A2C"); rect(x, 424, 26, 26);
    fill(i % 2 ? "#D93A2C" : "#FFF6E3"); rect(x, 450, 26, 26);
  }
  // wooden counter top
  fill("#E7B46A"); rect(0, 486, W, 120);
  fill("#D9A055"); for (let y = 500; y < 606; y += 18) rect(0, y, W, 3);
  fill("#B85A2A"); rect(0, 606, W, 34);
}

function drawMashes() {
  imageMode(CENTER);
  for (const m of G.mashes) {
    const squash = m.t < 0.15 ? map(m.t, 0, 0.15, 0.4, 1) : 1;
    const g = m.golden ? SPR.mashGold : SPR.mash;
    const h = g.height * 2.4 * squash;
    image(g, m.x, GROUND_Y - h / 2 - m.level * 13, g.width * 2.4 * (2 - squash) * (1 - m.level * 0.05), h);
  }
  for (const r of G.runners) {
    push();
    translate(r.x, GROUND_Y - 26 - Math.abs(Math.sin(r.t * 18)) * 6);
    scale(-r.dir, 1);
    const g = SPR.dog[r.variant] || SPR.dog.couch;
    image(g, 0, 0, g.width * 2.2, g.height * 2.2);
    pop();
  }
  for (const gh of G.ghosts) {
    const a = gh.t < 0.25 ? map(gh.t, 0, 0.25, 0, 230) : 200 + 30 * Math.sin(gh.t * 2 + gh.ph);
    tint(255, a);
    const g = ghostSprite(gh);
    const bob = gh.y <= gh.top ? Math.sin(gh.t * 2.4 + gh.ph) * 5 : 0;
    image(g, gh.x + Math.sin(gh.t * 3 + gh.ph) * 6, gh.y + bob, g.width * 2.6, g.height * 2.6);
  }
  noTint();
  imageMode(CORNER);
}

function ghostSprite(gh) {
  if (Array.isArray(SPR.ghost)) return SPR.ghost[gh.hue % SPR.ghost.length];
  return SPR.ghost;
}

function itemFrame(it) {
  const flip = Math.floor(it.t / 0.28) % 2 === 0;    // 2-frame bounce animation
  switch (it.type) {
    case "hash": {
      const overBasket = Math.abs(it.x - G.basket.x) < G.basket.w / 2;
      if (it.y > 380 && !overBasket) return SPR.worried;   // panics near the floor
      return flip ? SPR.fallA : SPR.fallB;
    }
    case "golden": return flip ? SPR.goldA : SPR.goldB;
    case "burnt": return SPR.burnt;
    case "bomb": return SPR.bomb;
    case "dog": { const d = SPR.dog[it.dogVariant] || SPR.dog.couch; return flip ? d : (SPR.dogFall[it.dogVariant] || d); }
    case "coffee": return SPR.coffee;
    case "clock": return SPR.clock;
  }
}

function drawItems() {
  imageMode(CENTER);
  for (const it of G.items) {
    const g = itemFrame(it);
    const w = g.width * SPRITE_SCALE, h = g.height * SPRITE_SCALE;
    // speed lines
    if (it.type === "hash" || it.type === "golden" || it.type === "burnt" || it.type === "dog") {
      stroke(74, 36, 18, 110); strokeWeight(2);
      for (let k = -1; k <= 1; k++) line(it.x + k * 8, it.y - it.hh - 22 + Math.abs(k) * 6, it.x + k * 8, it.y - it.hh - 10 + Math.abs(k) * 6);
      noStroke();
    }
    push();
    translate(it.x, it.y);
    rotate(it.type === "coffee" || it.type === "clock" ? Math.sin(it.t * 4) * 0.15 : it.rot);
    if (it.type === "golden" || it.type === "dog") { fill(255, 220, 90, 70 + 40 * Math.sin(it.t * 12)); noStroke(); ellipse(0, 0, w * 1.15, h * 1.0); }
    if (it.type === "coffee" || it.type === "clock") { fill(255, 255, 255, 120); noStroke(); ellipse(0, 0, w * 1.5, h * 1.5); }
    image(g, 0, 0, w, h);
    pop();
    // bomb fuse spark
    if (it.type === "bomb") {
      const fx = it.x + Math.cos(it.rot - 1.0) * 26, fy = it.y + Math.sin(it.rot - 1.0) * 26 - 4;
      if (frameCount % 4 < 2) { fill("#FFD24A"); noStroke(); rect(fx - 3, fy - 3, 6, 6); fill("#FFFFFF"); rect(fx - 1, fy - 1, 2, 2); }
      else { fill("#FF8A1F"); noStroke(); rect(fx - 4, fy - 1, 8, 2); rect(fx - 1, fy - 4, 2, 8); }
    }
    if (it.type === "golden" && frameCount % 10 < 5) {
      image(SPR.sparkle, it.x + it.hw + 6, it.y - it.hh + 4, 12, 12);
      image(SPR.sparkle, it.x - it.hw - 4, it.y + 6, 10, 10);
    }
  }
  imageMode(CORNER);
}

function drawBasketAndPile() {
  if (G.state === "title") return;
  const b = G.basket;
  const x = b.x + (b.stun > 0 ? random(-3, 3) : 0), y = RIM_Y, bw = b.w, bh = BASKET_H;
  const bot = bw * 0.84;

  // shadow on the counter
  noStroke(); fill(90, 50, 20, 55);
  ellipse(x, y + bh + 6, bw * 1.0, 12);

  // handles with tomato-red grips
  stroke("#6B737D"); strokeWeight(4);
  line(x - bw / 2 - 2, y + 2, x - bw / 2 - 22, y - 10);
  line(x + bw / 2 + 2, y + 2, x + bw / 2 + 22, y - 10);
  noStroke();
  fill("#E63B2E"); rect(x - bw / 2 - 44, y - 16, 26, 10); rect(x + bw / 2 + 18, y - 16, 26, 10);
  fill("#A9231A"); rect(x - bw / 2 - 44, y - 8, 26, 3); rect(x + bw / 2 + 18, y - 8, 26, 3);
  fill("#FF8A80"); rect(x - bw / 2 - 42, y - 14, 8, 2); rect(x + bw / 2 + 20, y - 14, 8, 2);

  // back of basket (dark inside)
  fill(70, 76, 84, 210);
  quad(x - bw / 2, y, x + bw / 2, y, x + bot / 2, y + bh, x - bot / 2, y + bh);

  // pile of caught hash browns peeking out
  imageMode(CENTER);
  const sauce = G.loadout ? G.loadout.sauce : "#E63B2E";
  for (let i = 0; i < G.pile.length; i++) {
    const p = G.pile[i], slot = pileSlot(i, bw);
    push();
    translate(x + slot.x + p.jx, y + slot.y);
    rotate(p.rot);
    const g = p.dog ? (SPR.dog[p.dog] || SPR.dog.couch) : (p.skin === "golden" ? SPR.pileGold : SPR.pile);
    const sc = p.dog ? 1.5 : 1.8;
    image(g, 0, 0, g.width * sc, g.height * sc);
    if (!p.dog) {           // sauce drizzle zig-zag
      noStroke(); fill(sauce);
      for (let k = -2; k <= 2; k++) rect(k * 6 - 3, -10 + (k % 2 ? 3 : 0), 6, 3);
    }
    pop();
  }
  // golden flash behind the pop-up hash brown
  for (const p of G.pops) {
    const k = p.t / 0.55;
    const yy = y - 26 - Math.sin(k * PI) * 34;
    noStroke(); fill(255, 214, 80, 160 * (1 - k));
    ellipse(x + p.off, yy, 90, 90);
    const g = p.skin === "golden" ? SPR.caughtGold : SPR.caught;
    image(g, x + p.off, yy, g.width * 2.2, g.height * 2.2);
    if (frameCount % 6 < 3) {
      image(SPR.sparkle, x + p.off - 34, yy - 20, 14, 14);
      image(SPR.sparkle, x + p.off + 34, yy - 30, 12, 12);
      image(SPR.sparkle, x + p.off + 28, yy + 16, 10, 10);
    }
  }
  imageMode(CORNER);

  // front mesh
  stroke("#C9D1D9"); strokeWeight(2);
  const n = Math.round(bw / 12);
  for (let i = 1; i < n; i++) {
    const u = i / n;
    line(x - bw / 2 + u * bw, y + 4, x - bot / 2 + u * bot, y + bh);
  }
  for (let r = 10; r < bh; r += 9) {
    const wr = lerp(bw, bot, r / bh);
    line(x - wr / 2, y + r, x + wr / 2, y + r);
  }
  // frame
  stroke("#4F5660"); strokeWeight(4); noFill();
  quad(x - bw / 2, y, x + bw / 2, y, x + bot / 2, y + bh, x - bot / 2, y + bh);
  // shiny rim
  noStroke(); fill("#E7ECF1"); rect(x - bw / 2 - 2, y - 4, bw + 4, 7);
  fill("#FFFFFF"); rect(x - bw / 2 + 6, y - 3, bw * 0.35, 2);
  // dip cup hooked on the front of the basket
  const cx0 = x + bw / 2 - 4, cy0 = y + bh - 20;
  fill("#4A2412"); rect(cx0 - 11, cy0 - 2, 22, 20, 3);
  fill("#FFF6E3"); rect(cx0 - 9, cy0, 18, 16, 2);
  fill(sauce); rect(cx0 - 9, cy0, 18, 6);
  fill(255, 255, 255, 160); rect(cx0 - 7, cy0 + 1, 5, 2);
  fill("#E63B2E"); rect(cx0 - 9, cy0 + 10, 18, 2);

  // golden highlight blink after a catch
  if (b.flash > 0 && Math.floor(b.flash * 14) % 2 === 0) {
    noFill(); stroke(255, 205, 60, 230); strokeWeight(4);
    quad(x - bw / 2 - 6, y - 8, x + bw / 2 + 6, y - 8, x + bot / 2 + 6, y + bh + 4, x - bot / 2 - 6, y + bh + 4);
    noStroke();
  }
  if (b.stun > 0) {
    // dizzy stars above a stunned basket
    for (let k = 0; k < 3; k++) {
      const a = G.elapsed * 6 + k * TWO_PI / 3;
      imageMode(CENTER);
      image(SPR.sparkleRed, x + Math.cos(a) * 40, y - 30 + Math.sin(a) * 8, 14, 14);
      imageMode(CORNER);
    }
  }
}

function drawParticles() {
  noStroke();
  for (const p of G.particles) {
    const a = 255 * (1 - p.life / p.max);
    const c = hexRGB(p.color);
    if (p.kind === "smoke") { fill(c[0], c[1], c[2], a * 0.7); ellipse(p.x, p.y, p.size, p.size); }
    else if (p.kind === "spark") {
      fill(c[0], c[1], c[2], a);
      const s = p.size;
      rect(p.x - s / 2, p.y - 1, s, 2); rect(p.x - 1, p.y - s / 2, 2, s);
    } else { fill(c[0], c[1], c[2], a); rect(Math.round(p.x), Math.round(p.y), p.size, p.size); }
  }
}

function drawPopups() {
  textFont("Press Start 2P");
  textAlign(CENTER, CENTER);
  for (const p of G.popups) {
    const a = p.life < 0.8 ? 255 : map(p.life, 0.8, 1.1, 255, 0);
    const pop = p.life < 0.12 ? map(p.life, 0, 0.12, 0.6, 1.15) : (p.life < 0.2 ? map(p.life, 0.12, 0.2, 1.15, 1) : 1);
    textSize(p.size * pop);
    fill(255, 246, 227, a); // cream outline
    for (const o of [[-2, 0], [2, 0], [0, -2], [0, 2], [2, 2]]) text(p.text, p.x + o[0], p.y + o[1]);
    const c = hexRGB(p.color);
    fill(c[0], c[1], c[2], a);
    text(p.text, p.x, p.y);
  }
}

function drawSlowTint() {
  noStroke();
  fill(122, 92, 72, 40 * Math.min(1, G.slow));
  rect(0, 0, W, VIEW_H);
}

function drawHUD() {
  // red/white checker strip at the very top (Crunch Club diner trim)
  noStroke();
  for (let x = 0, i = 0; x < W; x += 12, i++) {
    fill(i % 2 ? "#FFF6E3" : "#E63B2E"); rect(x, 0, 12, 6);
    fill(i % 2 ? "#E63B2E" : "#FFF6E3"); rect(x, 6, 12, 6);
  }
  const compact = W < 560;
  textFont("Press Start 2P");

  // SCORE panel (top-left)
  hudBox(14, 22, compact ? 150 : 196, compact ? 40 : 46);
  textAlign(LEFT, CENTER);
  fill("#4A2412"); textSize(compact ? 10 : 12);
  text("SCORE", 26, compact ? 43 : 46);
  fill("#E63B2E"); textSize(compact ? 18 : 22);
  text(nf(G.score, 3), compact ? 80 : 102, compact ? 44 : 47);

  // TIME panel: top-right on wide screens (leaving room for the HTML
  // pause/mute buttons), stacked under SCORE on phones
  const btnRoom = 104 / S;
  const tw = compact ? 150 : 176;
  const tx = compact ? 14 : W - tw - 14 - btnRoom;
  const ty = compact ? 76 : 22;
  const low = G.timeLeft <= 10 && G.state === "play";
  hudBox(tx, ty, tw, compact ? 40 : 46, low && frameCount % 30 < 15);
  fill("#4A2412"); textSize(compact ? 10 : 12);
  text("TIME", tx + 12, ty + (compact ? 21 : 24));
  const t = Math.ceil(G.timeLeft);
  fill("#E63B2E"); textSize(compact ? 16 : 20);
  text(nf(Math.floor(t / 60), 2) + ":" + nf(t % 60, 2), tx + (compact ? 64 : 70), ty + (compact ? 22 : 25));

  // combo + power-ups row
  let rowY = compact ? 136 : 84;
  if (G.combo >= 3) {
    textAlign(LEFT, CENTER); textSize(compact ? 9 : 11);
    fill(255, 246, 227); text("COMBO x" + G.combo, 17, rowY + 2);
    fill("#4A2412"); text("COMBO x" + G.combo, 16, rowY);
    rowY += 22;
  }
  if (G.slow > 0) {
    imageMode(CORNER);
    image(SPR.coffee, 14, rowY - 10, 28, 26);
    fill("#4A2412"); rect(48, rowY - 2, 80, 8);
    fill("#FFD24A"); rect(50, rowY, 76 * (G.slow / 4), 4);
  }
  if (G.diff && !compact && G.state !== "over") {
    textAlign(CENTER, CENTER); textSize(10);
    fill(74, 36, 18, 160);
    text(G.diff.label + (G.demo ? "  ·  DEMO" : ""), W / 2, 46);
  }
}

function hudBox(x, y, w, h, alert) {
  noStroke();
  fill("#4A2412"); rect(x - 3, y - 3, w + 6, h + 6, 4);
  fill(alert ? "#FFE1D9" : "#FFF6E3"); rect(x, y, w, h, 2);
  fill(alert ? "#FFC7BA" : "#FFE9B0"); rect(x, y + h - 6, w, 6);
}

function drawReady() {
  textFont("Press Start 2P");
  textAlign(CENTER, CENTER);
  const go = G.readyT > 1.0;
  const label = go ? "GO!" : "READY?";
  const k = go ? map(G.readyT, 1.0, 1.5, 1.4, 1) : 1 + Math.sin(G.readyT * 8) * 0.04;
  textSize(Math.min(56, W / 9) * k);
  fill("#4A2412"); text(label, W / 2 + 4, 300 + 4);
  fill(go ? "#E63B2E" : "#F5A623"); text(label, W / 2, 300);
  textSize(Math.min(12, W / 45));
  fill("#4A2412");
  if (!go) text(isTouch() ? "DRAG LEFT / RIGHT" : "MOVE MOUSE OR ← → KEYS", W / 2, 360);
}

// ------------------------------------------------------------------
// 9. DEMO AUTOPILOT (used for the demo reel)
// ------------------------------------------------------------------
function demoTarget() {
  const b = G.basket;
  // priority: bait (reel only) > golden & power-ups > plain hash browns
  const rank = it => it.bait ? 0 : (it.type === "hash" && !it.dogAt ? 2 : 1);
  let best = null, bestKey = 1e9;
  for (const it of G.items) {
    const good = it.bait || it.type === "hash" || it.type === "dog" || it.type === "golden" || it.type === "coffee" || it.type === "clock";
    if (!good || it.ignore) continue;
    const tHit = (RIM_Y - (it.y + it.hh)) / it.vy;
    if (tHit < 0) continue;
    if (Math.abs(it.x - b.x) / 520 > tHit + 0.25) continue; // can't make it
    const key = rank(it) * 100 + tHit;
    if (key < bestKey) { bestKey = key; best = it; }
  }
  let target = best ? best.x : b.target;
  for (const it of G.items) {
    if ((it.type !== "burnt" && it.type !== "bomb") || it.bait) continue;
    const tHit = (RIM_Y - (it.y + it.hh)) / it.vy;
    if (tHit < 0 || tHit > 0.7) continue;
    if (Math.abs(it.x - target) < b.w / 2 + it.hw + 6) target = it.x + (target >= it.x ? 1 : -1) * (b.w / 2 + it.hw + 14);
  }
  return target;
}

// ------------------------------------------------------------------
// 10. ASSETS
// ------------------------------------------------------------------
function spriteToGraphics(spr) {
  const g = createGraphics(spr.w, spr.h);
  g.pixelDensity(1);
  g.noStroke();
  g.clear();
  for (let y = 0; y < spr.h; y++) for (let x = 0; x < spr.w; x++) {
    const c = spr.px[y * spr.w + x];
    if (!c) continue;
    g.fill(c);
    g.rect(x, y, 1, 1);
  }
  return g;
}

function currentLoadout() {
  const S = window.HBShop;
  if (!S) return { scene: "crunch", flavor: "classic", sauce: "#E63B2E", ghost: "#FFFFFF", ghostId: "white", bomb: "hotsauce" };
  const w = S.wallet();
  const ghost = S.equipped("ghost");
  return {
    scene: S.equipped("scene").id,
    flavor: S.equipped("flavor").id,
    sauce: S.equipped("sauce").color,
    ghostId: ghost.id,
    ghost: ghost.id === "custom" ? w.customGhost : ghost.color,
    bomb: S.equipped("bomb").id
  };
}

function applyLoadout() {
  const L = currentLoadout();
  const key = JSON.stringify(L);
  if (G.loadoutKey === key) return;
  G.loadoutKey = key; G.loadout = L;
  buildSprites();
}

function freeSprites() {
  for (const k in SPR) {
    if (k === "dog" || k === "dogFall") continue;
    const v = SPR[k];
    for (const g of (Array.isArray(v) ? v : [v])) if (g && g.remove) g.remove();
  }
}

function buildSprites() {
  const H = window.HBSprites;
  freeSprites();
  const L = G.loadout || currentLoadout();
  G.loadout = L;
  const flavor = L.flavor === "classic" ? "normal" : L.flavor;
  SPR.fallA = spriteToGraphics(H.hashBrown({ expr: "happy", skin: flavor }));
  SPR.fallB = spriteToGraphics(H.hashBrown({ expr: "open", skin: flavor }));
  SPR.worried = spriteToGraphics(H.hashBrown({ expr: "worried", skin: flavor }));
  SPR.goldA = spriteToGraphics(H.hashBrown({ expr: "happy", skin: "golden" }));
  SPR.goldB = spriteToGraphics(H.hashBrown({ expr: "wink", skin: "golden" }));
  SPR.burnt = spriteToGraphics(H.hashBrown({ expr: "grumpy", skin: "burnt" }));
  SPR.caught = spriteToGraphics(H.hashBrown({ expr: "joy", limbs: "up", skin: flavor }));
  SPR.caughtGold = spriteToGraphics(H.hashBrown({ expr: "joy", limbs: "up", skin: "golden" }));
  SPR.pile = spriteToGraphics(H.hashBrown({ expr: "happy", skin: flavor }));
  SPR.pileGold = spriteToGraphics(H.hashBrown({ expr: "wink", skin: "golden" }));
  SPR.mash = spriteToGraphics(H.mash());
  SPR.mashGold = spriteToGraphics(H.mash({ golden: true }));
  if (L.ghostId === "rainbow") {
    SPR.ghost = ["#FF8A80", "#FFD978", "#A8F0D0", "#7CC8FF", "#C9B6FF", "#FFB8C8", "#B6F27A"].map(c => spriteToGraphics(H.ghostColor(c)));
  } else {
    SPR.ghost = spriteToGraphics(H.ghostColor(L.ghost));
  }
  SPR.bomb = spriteToGraphics(H.bombStyle(L.bomb === "chilibomb" ? "chili" : L.bomb));
  SPR.coffee = spriteToGraphics(H.coffee());
  SPR.clock = spriteToGraphics(H.clock());
  SPR.sparkle = spriteToGraphics(H.sparkle());
  SPR.sparkleRed = spriteToGraphics(H.sparkle("#E63B2E"));
  if (!SPR.dog) {
    SPR.dog = {}; SPR.dogFall = {};
    for (const v of H.DOG_VARIANTS) {
      SPR.dog[v] = spriteToGraphics(H.potatoDog(v, "stand"));
      SPR.dogFall[v] = spriteToGraphics(H.potatoDog(v, "fall"));
    }
  }
}

function loadSounds() {
  if (typeof loadSound !== "function") return;           // p5.sound missing -> silent game
  const names = ["crunch", "squelch", "ding", "bonk", "boom", "golden", "slow", "clock", "tick", "combo", "timesup", "click", "dog", "poof", "buy", "equip"];
  for (const n of names) {
    loadSound(assetPath("assets/sfx/" + n + ".wav"), s => { SFX[n] = s; }, () => {});
  }
}

function play(name, vol, rate) {
  if (window.HBC_SFX_LOG) window.HBC_SFX_LOG.push({ name, t: performance.now(), vol: vol == null ? 0.8 : vol, rate: rate || 1 });
  const s = SFX[name];
  if (!s || muted) return;
  try {
    s.setVolume(vol == null ? 0.8 : vol);
    s.rate(rate || 1);
    s.play();
  } catch (e) { /* audio not ready yet */ }
}

function setMuted(m) {
  muted = m;
  if (typeof outputVolume === "function") outputVolume(m ? 0 : 1);
  emit("mute", { muted });
}

function makeDecor() {
  decor = [];
  randomSeed(4);
  for (let i = 0; i < 18; i++) decor.push({ kind: "dust", x: random(), y: random(470), v: random(4, 12), ph: random(TWO_PI) });
  for (let i = 0; i < 9; i++) decor.push({ kind: "oil", x: random(), y: random(500, 600), s: random(4, 9) });
  randomSeed(Date.now() % 100000);
}

// ------------------------------------------------------------------
// 11. HELPERS
// ------------------------------------------------------------------
function stageSize() {
  if (window.HBC_SIZE) return window.HBC_SIZE;   // fixed size (demo reel recorder)
  const wrap = document.getElementById("game-canvas-wrap");
  const outer = document.querySelector("#play .wrap");
  let cw = windowWidth - 40;
  if (outer) {
    const cs = getComputedStyle(outer);
    cw = outer.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 8;
  }
  cw = Math.max(260, Math.min(cw, 1100));
  const vh = window.innerHeight || 800;
  let h = Math.min(vh * 0.84, cw / 0.62, 760);
  h = Math.max(h, 380);
  const w = Math.floor(Math.min(cw, h * 1.5));
  if (wrap) wrap.style.width = w + "px";
  return { w, h: Math.floor(h) };
}

function applyScale() {
  S = height / VIEW_H;
  W = width / S;
}

function assetPath(p) { return (window.HBC_BASE || "") + p; }
function isTouch() { return "ontouchstart" in window || navigator.maxTouchPoints > 0; }

function hexRGB(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readBest(k) {
  try { return parseInt(localStorage.getItem("hbc_best_" + k) || "0", 10) || 0; } catch (e) { return 0; }
}
function writeBest(k, v) {
  try { localStorage.setItem("hbc_best_" + k, String(v)); } catch (e) { /* storage blocked */ }
}

function emit(type, data) {
  for (const fn of G.listeners) { try { fn(type, data || {}); } catch (e) { console.error(e); } }
}

// auto-pause when the tab is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden && G.state === "play" && !G.demo) togglePause();
});

// Public API for ui.js / the demo reel
window.HBC = {
  start: (diffKey, custom, opts) => {
    if (typeof userStartAudio === "function") { try { userStartAudio(); } catch (e) {} }
    startGame(diffKey, custom, opts);
  },
  togglePause, quitToTitle,
  spawn: (type, xFrac, extra) => spawnItem(type, xFrac == null ? null : xFrac * W, extra),
  end: () => { if (G.state === "play") endGame(); },
  setMuted, isMuted: () => muted,
  on: fn => G.listeners.push(fn),
  state: () => G.state,
  best: readBest,
  click: () => play("click", 0.5),
  sfx: (n, v) => play(n, v),
  applyLoadout: () => { applyLoadout(); },
  // draws a scene on the main canvas for a moment and returns a thumbnail
  snapshotScene: (key, w) => {
    push(); scale(S); drawScene(key, 3); pop();
    const src = drawingContext.canvas, c = document.createElement("canvas");
    c.width = w || 320; c.height = Math.round(c.width * src.height / src.width);
    c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
    try { return c.toDataURL("image/jpeg", 0.85); }
    catch (e) { return null; }   // opened as a local file: the background image taints the canvas
  },
  difficulties: DIFFICULTIES,
  _G: G
};
