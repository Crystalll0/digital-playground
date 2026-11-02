/* =========================================================
   HASH BROWN CATCH — week 1 prototype
   First working interaction: drag the fry basket, catch
   falling hash browns, miss them and they turn into mash.
   ========================================================= */

const VIEW_H = 640;          // logical height; width follows the screen
const RIM_Y = 522;           // top of the basket
const GROUND_Y = 590;        // counter top
const SPRITE_SCALE = 2.2;
const ROUND_SECONDS = 60;

let W = 960, S = 1;
let bgImg = null;
let SPR = {}, SFX = {};

let state = "title";         // title | play | over
let score = 0, timeLeft = ROUND_SECONDS, spawnTimer = 0;
let items = [], mashes = [], popups = [];
let basket = { x: 480, w: 145 };

function setup() {
  const cnv = createCanvas(960, 640);
  cnv.parent("game-canvas-wrap");
  fitToScreen();
  noSmooth();
  // sprites are drawn pixel by pixel in sprites.js
  SPR.fallA = toGraphics(HBSprites.hashBrown({ expr: "happy" }));
  SPR.fallB = toGraphics(HBSprites.hashBrown({ expr: "open" }));
  SPR.mash = toGraphics(HBSprites.mash());
  SPR.ghost = toGraphics(HBSprites.ghost());
  loadImage("assets/diner-bg.jpg", img => (bgImg = img), () => {});
  if (typeof loadSound === "function") {
    for (const n of ["crunch", "squelch", "ding"]) loadSound("assets/sfx/" + n + ".wav", s => (SFX[n] = s));
  }
}

function draw() {
  const dt = Math.min(deltaTime, 50) / 1000;
  if (state === "play") update(dt);

  push();
  scale(S);
  if (bgImg) {
    const sc = Math.max(W / bgImg.width, VIEW_H / bgImg.height);
    image(bgImg, (W - bgImg.width * sc) / 2, VIEW_H - bgImg.height * sc, bgImg.width * sc, bgImg.height * sc);
  } else background("#FBEFCF");
  drawMashes();
  drawItems();
  drawBasket();
  drawPopups();
  drawHUD();
  if (state !== "play") drawMessage();
  pop();
}

// ---------- input: mouse / touch moves the basket ----------
function mousePressed() {
  if (!insideCanvas()) return;
  if (state !== "play") startRound();
}

function startRound() {
  if (typeof userStartAudio === "function") userStartAudio();
  state = "play"; score = 0; timeLeft = ROUND_SECONDS; items = []; mashes = []; popups = []; spawnTimer = 0.3;
  play("ding");
}

function update(dt) {
  timeLeft -= dt;
  if (timeLeft <= 0) { timeLeft = 0; state = "over"; return; }

  if (insideCanvas()) basket.x = constrain(mouseX / S, basket.w / 2, W - basket.w / 2);

  // spawn faster as the round goes on
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    const t = 1 - timeLeft / ROUND_SECONDS;
    items.push({ x: random(40, W - 40), y: -40, vy: 200 * (1 + 0.8 * t) * random(0.9, 1.1), t: 0, rot: random(-0.3, 0.3) });
    spawnTimer = lerp(0.9, 0.5, t);
  }

  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    const prevBottom = it.y + 26;
    it.y += it.vy * dt; it.t += dt;
    const bottom = it.y + 26;
    // rectangle collision with the basket opening
    if (prevBottom <= RIM_Y + 10 && bottom >= RIM_Y && abs(it.x - basket.x) < basket.w / 2) {
      score += 10;
      play("crunch");
      popups.push({ text: "+10", x: it.x, y: RIM_Y - 40, life: 0, color: "#E63B2E" });
      items.splice(i, 1);
    } else if (bottom >= GROUND_Y) {
      score = max(0, score - 2);
      play("squelch");
      mashes.push({ x: it.x, t: 0 });
      popups.push({ text: "-2", x: it.x + 24, y: GROUND_Y - 40, life: 0, color: "#857353" });
      items.splice(i, 1);
    }
  }
  for (let i = mashes.length - 1; i >= 0; i--) if ((mashes[i].t += dt) > 2) mashes.splice(i, 1);
  for (let i = popups.length - 1; i >= 0; i--) { popups[i].life += dt; popups[i].y -= 30 * dt; if (popups[i].life > 1) popups.splice(i, 1); }
}

// ---------- drawing ----------
function drawItems() {
  imageMode(CENTER);
  for (const it of items) {
    const g = floor(it.t / 0.28) % 2 ? SPR.fallB : SPR.fallA;   // 2-frame animation
    push(); translate(it.x, it.y); rotate(it.rot);
    image(g, 0, 0, g.width * SPRITE_SCALE, g.height * SPRITE_SCALE);
    pop();
  }
  imageMode(CORNER);
}

function drawMashes() {
  imageMode(CENTER);
  for (const m of mashes) {
    image(SPR.mash, m.x, GROUND_Y - 14, SPR.mash.width * 2.4, SPR.mash.height * 2.4);
    tint(255, map(m.t, 0, 2, 230, 0));
    image(SPR.ghost, m.x, GROUND_Y - 40 - m.t * 30, SPR.ghost.width * 2.6, SPR.ghost.height * 2.6);
    noTint();
  }
  imageMode(CORNER);
}

function drawBasket() {
  const x = basket.x, y = RIM_Y, bw = basket.w, bh = 46, bot = bw * 0.84;
  noStroke(); fill(70, 76, 84, 210);
  quad(x - bw / 2, y, x + bw / 2, y, x + bot / 2, y + bh, x - bot / 2, y + bh);
  stroke("#C9D1D9"); strokeWeight(2);
  for (let i = 1; i < 12; i++) line(x - bw / 2 + i * bw / 12, y + 4, x - bot / 2 + i * bot / 12, y + bh);
  for (let r = 10; r < bh; r += 9) line(x - lerp(bw, bot, r / bh) / 2, y + r, x + lerp(bw, bot, r / bh) / 2, y + r);
  stroke("#4F5660"); strokeWeight(4); noFill();
  quad(x - bw / 2, y, x + bw / 2, y, x + bot / 2, y + bh, x - bot / 2, y + bh);
  noStroke(); fill("#E63B2E"); rect(x - bw / 2 - 30, y - 10, 24, 9); rect(x + bw / 2 + 6, y - 10, 24, 9);
}

function drawPopups() {
  textAlign(CENTER, CENTER); textSize(20); textFont("monospace");
  for (const p of popups) { fill(p.color); text(p.text, p.x, p.y); }
}

function drawHUD() {
  noStroke(); fill("#FFF6E3"); rect(14, 14, 190, 40, 4);
  fill("#4A2412"); textSize(18); textAlign(LEFT, CENTER); textFont("monospace");
  text("SCORE " + nf(score, 3), 26, 34);
  fill("#FFF6E3"); rect(W - 184, 14, 170, 40, 4);
  fill("#4A2412"); text("TIME " + ceil(timeLeft), W - 172, 34);
}

function drawMessage() {
  fill(255, 246, 227, 200); rect(0, 0, W, VIEW_H);
  fill("#4A2412"); textAlign(CENTER, CENTER); textFont("monospace");
  textSize(40); text(state === "title" ? "HASH BROWN CATCH" : "TIME'S UP!  " + score, W / 2, 260);
  textSize(18); text("click / tap to " + (state === "title" ? "start" : "play again") + " · move to slide the basket", W / 2, 320);
}

// ---------- helpers ----------
function toGraphics(spr) {
  const g = createGraphics(spr.w, spr.h);
  g.pixelDensity(1); g.noStroke();
  for (let y = 0; y < spr.h; y++) for (let x = 0; x < spr.w; x++) {
    const c = spr.px[y * spr.w + x];
    if (c) { g.fill(c); g.rect(x, y, 1, 1); }
  }
  return g;
}

function play(n) { if (SFX[n]) SFX[n].play(); }
function insideCanvas() { return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height; }

function fitToScreen() {
  const w = min(windowWidth - 32, 1000);
  const h = min(w / 1.5, windowHeight * 0.8);
  resizeCanvas(floor(h * 1.5 > w ? w : h * 1.5), floor(h));
  S = height / VIEW_H; W = width / S;
}
function windowResized() { fitToScreen(); }
