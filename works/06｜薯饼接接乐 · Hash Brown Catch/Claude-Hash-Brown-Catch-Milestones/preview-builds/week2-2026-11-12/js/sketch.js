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
  items: [], particles: [], popups: [], mashes: [], ghosts: [], pile: [], pops: [],
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

  buildSprites();
  // load the background without blocking start-up (falls back to code drawing)
  loadImage("assets/diner-bg.jpg", img => { bgImg = img; }, () => { bgImg = null; });
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
  if (G.state === "title" || G.state === "over") updateEffects(dt);

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
  G.items = []; G.particles = []; G.popups = []; G.mashes = []; G.ghosts = []; G.pile = []; G.pops = [];
  G.spawnTimer = 0.2; G.slow = 0; G.shake = 0; G.lastTick = -1;
  G.basket.w = G.diff.basket; G.basket.x = G.basket.target = W / 2; G.basket.stun = 0;
  G.demo = !!opts.demo;
  G.state = "ready"; G.readyT = 0;
  play("ding");
  emit("start");
}

function togglePause() {
  if (G.state === "play") { G.state = "paused"; emit("pause"); }
  else if (G.state === "paused") { G.state = "play"; emit("resume"); }
}

function quitToTitle() {
  G.state = "title"; G.items = []; G.pile = []; G.pops = []; G.mashes = []; G.ghosts = [];
  emit("title");
}

function endGame() {
  G.state = "over";
  G.items = [];
  play("timesup");
  const best = readBest(G.diffKey);
  const isBest = !G.demo && G.score > best;
  if (isBest) writeBest(G.diffKey, G.score);
  emit("over", {
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

function spawnItem(forceType, forceX) {
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
    bomb: [17, 18], coffee: [13, 11], clock: [13, 12]
  }[type];
  G.items.push({
    type, x, baseX: x, y: -40, vy, t: 0,
    rot: random(-0.3, 0.3), rotV: random(-0.8, 0.8),
    hw: dims[0] * SPRITE_SCALE / 2, hh: dims[1] * SPRITE_SCALE / 2,
    sway: d.sway && type !== "golden" ? random(0.4, 1) * d.sway : 0,
    swayF: random(2, 3.5), swayPh: random(TWO_PI)
  });
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
      G.pile.push({ off: off + random(-8, 8), skin: golden ? "golden" : "normal", rot: random(-0.35, 0.35), t: 0 });
      if (G.pile.length > 5) G.pile.shift();
      if (G.combo > 0 && G.combo % POINTS.comboEvery === 0) {
        addScore(POINTS.comboBonus);
        play("combo", 0.6);
        popup("COMBO x" + G.combo + "  +" + POINTS.comboBonus, b.x, RIM_Y - 92, "#4A2412", 18);
      }
      emit("catch", { type: it.type });
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
      G.pile.splice(0, Math.min(2, G.pile.length));
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
      G.mashes.push({ x: it.x, t: 0, golden: it.type === "golden" });
      G.ghosts.push({ x: it.x, y: GROUND_Y - 30, t: 0, ph: random(TWO_PI) });
      popup(String(POINTS.miss), it.x + 28, GROUND_Y - 44, "#857353", 18);
      burst(it.x, GROUND_Y - 4, 8, ["#F5A623", "#FFD978", "#D9CBA9"], "crumb");
      emit("miss");
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
  for (let i = G.mashes.length - 1; i >= 0; i--) {
    G.mashes[i].t += dt;
    if (G.mashes[i].t > 2.6) G.mashes.splice(i, 1);
  }
  for (let i = G.ghosts.length - 1; i >= 0; i--) {
    const g = G.ghosts[i];
    g.t += dt; g.y -= 28 * dt;
    if (g.t > 1.8) G.ghosts.splice(i, 1);
  }
  for (let i = G.pops.length - 1; i >= 0; i--) {
    G.pops[i].t += dt;
    if (G.pops[i].t > 0.55) G.pops.splice(i, 1);
  }
}

// ------------------------------------------------------------------
// 8. DRAWING
// ------------------------------------------------------------------
function drawBackground() {
  if (bgImg) {
    // "cover" fit, anchored to the bottom so the counter stays put
    const sc = Math.max(W / bgImg.width, VIEW_H / bgImg.height);
    const dw = bgImg.width * sc, dh = bgImg.height * sc;
    const dx = (W - dw) / 2, dy = VIEW_H - dh;
    image(bgImg, dx, dy, dw, dh);
    // code-drawn layer on top of the art: breathing lamp light
    const glow = 26 + Math.sin(G.titleT * 2.1) * 8;
    noStroke();
    for (const lx of [190, 1342]) {
      const x = dx + lx * sc, y = dy + 175 * sc;
      for (let r = 0; r < 4; r++) {
        fill(255, 226, 150, glow / (r + 1.2));
        ellipse(x, y + 60 + r * 30, 140 + r * 70, 110 + r * 60);
      }
    }
  } else {
    drawFallbackBackground();
  }
  // floating dust + oil dots on the counter
  noStroke();
  for (const d of decor) {
    if (d.kind === "dust") {
      const y = (d.y + G.titleT * d.v) % 470;
      fill(255, 245, 210, 90 + 60 * Math.sin(G.titleT * 2 + d.ph));
      rect(Math.round((d.x * W + Math.sin(G.titleT + d.ph) * 12) / 2) * 2, Math.round(y / 2) * 2 + 40, 3, 3);
    } else {
      fill(255, 214, 120, 70);
      ellipse(d.x * W, d.y, d.s * 2, d.s);
    }
  }
}

function drawFallbackBackground() {
  background("#FBEFCF");
  stroke("#EED9AB"); strokeWeight(2);
  for (let x = 0; x < W; x += 58) line(x, 0, x, 420);
  for (let y = 0; y < 420; y += 58) line(0, y, W, y);
  noStroke();
  fill("#D93A2C"); rect(0, 0, W, 16); rect(0, 22, W, 6);
  fill("#C9CDD2"); rect(0, 412, W, 12);
  for (let x = 0, i = 0; x < W; x += 26, i++) {
    fill(i % 2 ? "#FFF6E3" : "#D93A2C"); rect(x, 424, 26, 26);
    fill(i % 2 ? "#D93A2C" : "#FFF6E3"); rect(x, 450, 26, 26);
  }
  fill("#E7B46A"); rect(0, 486, W, 120);
  fill("#D9A055"); for (let y = 500; y < 606; y += 18) rect(0, y, W, 3);
  fill("#B85A2A"); rect(0, 606, W, 34);
}

function drawMashes() {
  imageMode(CENTER);
  for (const m of G.mashes) {
    const a = m.t > 2.1 ? map(m.t, 2.1, 2.6, 255, 0) : 255;
    const squash = m.t < 0.15 ? map(m.t, 0, 0.15, 0.4, 1) : 1;
    const g = m.golden ? SPR.mashGold : SPR.mash;
    tint(255, a);
    image(g, m.x, GROUND_Y - (g.height * 2.4 * squash) / 2, g.width * 2.4 * (2 - squash), g.height * 2.4 * squash);
  }
  for (const gh of G.ghosts) {
    const a = gh.t < 0.2 ? map(gh.t, 0, 0.2, 0, 220) : map(gh.t, 0.2, 1.8, 220, 0);
    tint(255, a);
    image(SPR.ghost, gh.x + Math.sin(gh.t * 5 + gh.ph) * 8, gh.y, SPR.ghost.width * 2.6, SPR.ghost.height * 2.6);
  }
  noTint();
  imageMode(CORNER);
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
    if (it.type === "hash" || it.type === "golden" || it.type === "burnt") {
      stroke(74, 36, 18, 110); strokeWeight(2);
      for (let k = -1; k <= 1; k++) line(it.x + k * 8, it.y - it.hh - 22 + Math.abs(k) * 6, it.x + k * 8, it.y - it.hh - 10 + Math.abs(k) * 6);
      noStroke();
    }
    push();
    translate(it.x, it.y);
    rotate(it.type === "coffee" || it.type === "clock" ? Math.sin(it.t * 4) * 0.15 : it.rot);
    if (it.type === "golden") { fill(255, 220, 90, 70 + 40 * Math.sin(it.t * 12)); noStroke(); ellipse(0, 0, w * 1.15, h * 1.0); }
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

  // the last few caught hash browns peek out of the basket
  imageMode(CENTER);
  for (const p of G.pile) {
    push();
    translate(x + p.off, y - 4);
    rotate(p.rot);
    const g = p.skin === "golden" ? SPR.pileGold : SPR.pile;
    image(g, 0, 0, g.width * 1.8, g.height * 1.8);
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
  stroke("#4F5660"); strokeWeight(4); noFill();
  quad(x - bw / 2, y, x + bw / 2, y, x + bot / 2, y + bh, x - bot / 2, y + bh);
  noStroke(); fill("#E7ECF1"); rect(x - bw / 2 - 2, y - 4, bw + 4, 7);
  fill("#FFFFFF"); rect(x - bw / 2 + 6, y - 3, bw * 0.35, 2);

  // golden highlight blink after a catch
  if (b.flash > 0 && Math.floor(b.flash * 14) % 2 === 0) {
    noFill(); stroke(255, 205, 60, 230); strokeWeight(4);
    quad(x - bw / 2 - 6, y - 8, x + bw / 2 + 6, y - 8, x + bot / 2 + 6, y + bh + 4, x - bot / 2 - 6, y + bh + 4);
    noStroke();
  }
  if (b.stun > 0) {
    imageMode(CENTER);
    for (let k = 0; k < 3; k++) {
      const a = G.elapsed * 6 + k * TWO_PI / 3;
      image(SPR.sparkleRed, x + Math.cos(a) * 40, y - 30 + Math.sin(a) * 8, 14, 14);
    }
    imageMode(CORNER);
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
    fill(255, 246, 227, a);
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
  noStroke();
  for (let x = 0, i = 0; x < W; x += 12, i++) {
    fill(i % 2 ? "#FFF6E3" : "#E63B2E"); rect(x, 0, 12, 6);
    fill(i % 2 ? "#E63B2E" : "#FFF6E3"); rect(x, 6, 12, 6);
  }
  const compact = W < 560;
  textFont("Press Start 2P");

  hudBox(14, 22, compact ? 150 : 196, compact ? 40 : 46);
  textAlign(LEFT, CENTER);
  fill("#4A2412"); textSize(compact ? 10 : 12);
  text("SCORE", 26, compact ? 43 : 46);
  fill("#E63B2E"); textSize(compact ? 18 : 22);
  text(nf(G.score, 3), compact ? 80 : 102, compact ? 44 : 47);

  // TIME panel: top-right on wide screens, stacked under SCORE on phones
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
    text(G.diff.label, W / 2, 46);
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
// 9. DEMO AUTOPILOT (for testing and screen recording)
// ------------------------------------------------------------------
function demoTarget() {
  const b = G.basket;
  let best = null, bestKey = 1e9;
  for (const it of G.items) {
    const good = it.type === "hash" || it.type === "golden" || it.type === "coffee" || it.type === "clock";
    if (!good) continue;
    const tHit = (RIM_Y - (it.y + it.hh)) / it.vy;
    if (tHit < 0) continue;
    if (Math.abs(it.x - b.x) / 520 > tHit + 0.25) continue;
    const key = (it.type === "hash" ? 2 : 1) * 100 + tHit;
    if (key < bestKey) { bestKey = key; best = it; }
  }
  let target = best ? best.x : b.target;
  for (const it of G.items) {
    if (it.type !== "burnt" && it.type !== "bomb") continue;
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

function buildSprites() {
  const H = window.HBSprites;
  SPR.fallA = spriteToGraphics(H.hashBrown({ expr: "happy" }));
  SPR.fallB = spriteToGraphics(H.hashBrown({ expr: "open" }));
  SPR.worried = spriteToGraphics(H.hashBrown({ expr: "worried" }));
  SPR.goldA = spriteToGraphics(H.hashBrown({ expr: "happy", skin: "golden" }));
  SPR.goldB = spriteToGraphics(H.hashBrown({ expr: "wink", skin: "golden" }));
  SPR.burnt = spriteToGraphics(H.hashBrown({ expr: "grumpy", skin: "burnt" }));
  SPR.caught = spriteToGraphics(H.hashBrown({ expr: "joy", limbs: "up" }));
  SPR.caughtGold = spriteToGraphics(H.hashBrown({ expr: "joy", limbs: "up", skin: "golden" }));
  SPR.pile = spriteToGraphics(H.hashBrown({ expr: "happy" }));
  SPR.pileGold = spriteToGraphics(H.hashBrown({ expr: "wink", skin: "golden" }));
  SPR.mash = spriteToGraphics(H.mash());
  SPR.mashGold = spriteToGraphics(H.mash({ golden: true }));
  SPR.ghost = spriteToGraphics(H.ghost());
  SPR.bomb = spriteToGraphics(H.bomb());
  SPR.coffee = spriteToGraphics(H.coffee());
  SPR.clock = spriteToGraphics(H.clock());
  SPR.sparkle = spriteToGraphics(H.sparkle());
  SPR.sparkleRed = spriteToGraphics(H.sparkle("#E63B2E"));
}

function loadSounds() {
  if (typeof loadSound !== "function") return;           // p5.sound missing -> silent game
  const names = ["crunch", "squelch", "ding", "bonk", "boom", "golden", "slow", "clock", "tick", "combo", "timesup", "click"];
  for (const n of names) {
    loadSound("assets/sfx/" + n + ".wav", s => { SFX[n] = s; }, () => {});
  }
}

function play(name, vol, rate) {
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

// Public API for ui.js
window.HBC = {
  start: (diffKey, custom, opts) => {
    if (typeof userStartAudio === "function") { try { userStartAudio(); } catch (e) {} }
    startGame(diffKey, custom, opts);
  },
  togglePause, quitToTitle,
  end: () => { if (G.state === "play") endGame(); },
  setMuted, isMuted: () => muted,
  on: fn => G.listeners.push(fn),
  state: () => G.state,
  best: readBest,
  click: () => play("click", 0.5),
  _G: G
};
