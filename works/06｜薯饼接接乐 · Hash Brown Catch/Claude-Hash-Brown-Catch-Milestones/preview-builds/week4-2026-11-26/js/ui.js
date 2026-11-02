/* =========================================================
   Hash Brown Catch — page UI (menus, character sheet, tables)
   Talks to the p5 sketch only through window.HBC.
   ========================================================= */
(function () {
  "use strict";
  var SP = window.HBSprites;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- draw a sprite into an existing <canvas> ----------
  function paint(canvas, spr) {
    if (!canvas) return;          // section not on this page
    canvas.width = spr.w; canvas.height = spr.h;
    var g = canvas.getContext("2d");
    g.clearRect(0, 0, spr.w, spr.h);
    for (var y = 0; y < spr.h; y++) for (var x = 0; x < spr.w; x++) {
      var c = spr.px[y * spr.w + x];
      if (c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
    }
  }

  var DESCS = {
    easy: "Slow drops, a wide basket and only a few burnt decoys. Good for a first breakfast.",
    normal: "The standard rush. Burnt hash browns and hot sauce bombs start showing up.",
    hard: "Faster drops, a smaller basket and hash browns that wobble on the way down.",
    hell: "Everything falls fast and swerves. One in three drops wants to hurt you.",
    custom: "Set fall speed, drop rate, hazards, basket size and round length yourself."
  };

  var state = { diff: "normal", custom: { speed: 4, rate: 4, hazards: 4, basket: "M", time: 60 } };
  try {
    var saved = JSON.parse(localStorage.getItem("hbc_prefs") || "null");
    if (saved && saved.diff) { state.diff = saved.diff; if (saved.custom) state.custom = saved.custom; }
  } catch (e) { /* no storage */ }
  function savePrefs() { try { localStorage.setItem("hbc_prefs", JSON.stringify(state)); } catch (e) {} }

  // ---------- static canvases ----------
  paint($("brand-icon"), SP.hashBrown({ expr: "happy" }));
  paint($("portrait"), SP.hashBrown({ expr: "open", limbs: "up" }));

  document.querySelectorAll("canvas[data-expr]").forEach(function (c) {
    var e = c.dataset.expr;
    var limbs = e === "joy" ? "up" : e === "wink" ? "wave" : "down";
    paint(c, SP.hashBrown({ expr: e, limbs: limbs }));
  });
  document.querySelectorAll("canvas[data-spr]").forEach(function (c) {
    var k = c.dataset.spr;
    if (k === "fall") paint(c, SP.hashBrown({ expr: "open" }));
    if (k === "caught") paint(c, SP.hashBrown({ expr: "joy", limbs: "up" }));
    if (k === "mash") paint(c, SP.mash());
  });
  document.querySelectorAll("canvas[data-item]").forEach(function (c) {
    var k = c.dataset.item, s;
    switch (k) {
      case "hash": s = SP.hashBrown({ expr: "happy" }); break;
      case "golden": s = SP.hashBrown({ expr: "wink", skin: "golden" }); break;
      case "combo": s = SP.hashBrown({ expr: "joy", limbs: "up" }); break;
      case "burnt": s = SP.hashBrown({ expr: "grumpy", skin: "burnt" }); break;
      case "bomb": s = SP.bomb(); break;
      case "mash": s = SP.mash(); break;
      case "coffee": s = SP.coffee(); break;
      case "clock": s = SP.clock(); break;
      case "dog": s = SP.potatoDog("couch"); break;
    }
    paint(c, s);
  });

  // portrait cycles through moods (frame animation for the IP sheet)
  var portraitFrames = [
    SP.hashBrown({ expr: "open", limbs: "up" }),
    SP.hashBrown({ expr: "happy", limbs: "wave" }),
    SP.hashBrown({ expr: "wink", limbs: "wave" }),
    SP.hashBrown({ expr: "joy", limbs: "up" })
  ];
  var titleFrames = [SP.hashBrown({ expr: "happy", limbs: "wave" }), SP.hashBrown({ expr: "open", limbs: "up" })];
  var pf = 0;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    setInterval(function () {
      pf++;
      paint($("portrait"), portraitFrames[pf % portraitFrames.length]);
      paint($("title-mascot"), titleFrames[pf % 2]);
    }, 700);
  }
  paint($("title-mascot"), titleFrames[0]);

  // ---------- levels table ----------
  function meter(n) {
    var h = '<span class="meter" aria-label="' + n + ' of 5">';
    for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return h + "</span>";
  }
  var rows = [
    ["EASY", 1, 1, 1, "Wide · 175px", "Burnt only", ""],
    ["NORMAL", 2, 2, 2, "Medium · 145px", "Burnt + bombs", ""],
    ["HARD", 3, 3, 3, "Narrow · 125px", "Wobbly falls", ""],
    ["HELL", 5, 5, 5, "Tiny · 110px", "Big swerves, 1 in 3 hazards", "hell"],
    ["CUSTOM", "—", "—", "—", "S / M / L", "30, 60 or 90 s rounds", ""]
  ];
  if ($("levels-body")) $("levels-body").innerHTML = rows.map(function (r) {
    return '<tr class="' + r[6] + '"><td>' + r[0] + "</td><td>" + (typeof r[1] === "number" ? meter(r[1]) : r[1]) +
      "</td><td>" + (typeof r[2] === "number" ? meter(r[2]) : r[2]) + "</td><td>" + (typeof r[3] === "number" ? meter(r[3]) : r[3]) +
      "</td><td>" + r[4] + "</td><td>" + r[5] + "</td></tr>";
  }).join("");

  // ---------- title screen controls ----------
  var chips = document.querySelectorAll(".chip");
  function selectDiff(d, focus) {
    state.diff = d;
    chips.forEach(function (c) {
      var on = c.dataset.d === d;
      c.setAttribute("aria-checked", on ? "true" : "false");
      c.tabIndex = on ? 0 : -1;
      if (on && focus) c.focus();
    });
    $("diff-desc").textContent = DESCS[d];
    $("custom-panel").hidden = d !== "custom";
    updateBest();
    savePrefs();
  }
  chips.forEach(function (c, i) {
    c.addEventListener("click", function () { selectDiff(c.dataset.d); click(); });
    c.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var n = (i + dir + chips.length) % chips.length;
      selectDiff(chips[n].dataset.d, true);
    });
  });

  ["speed", "rate", "hazards"].forEach(function (k) {
    var input = $("c-" + k), out = $("o-" + k);
    input.value = state.custom[k];
    out.textContent = state.custom[k];
    input.addEventListener("input", function () {
      state.custom[k] = parseInt(input.value, 10);
      out.textContent = input.value;
      savePrefs();
    });
  });
  function segment(id, key, parse) {
    var btns = $(id).querySelectorAll("button");
    function sync() { btns.forEach(function (b) { b.setAttribute("aria-pressed", String(parse(b.dataset.v) === state.custom[key])); }); }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { state.custom[key] = parse(b.dataset.v); sync(); savePrefs(); click(); });
    });
    sync();
  }
  segment("c-basket", "basket", function (v) { return v; });
  segment("c-time", "time", function (v) { return parseInt(v, 10); });

  function updateBest() {
    var b = window.HBC ? window.HBC.best(state.diff) : 0;
    $("best-line").textContent = "BEST ON " + state.diff.toUpperCase() + " · " + String(b).padStart(3, "0");
  }

  function click() { if (window.HBC) window.HBC.click(); }

  function show(id) {
    ["screen-title", "screen-pause", "screen-over"].forEach(function (s) { $(s).hidden = s !== id; });
  }
  function start() {
    show(null);
    $("hud-btns").hidden = false;
    window.HBC.start(state.diff, state.custom);
  }

  $("btn-start").addEventListener("click", start);
  $("btn-again").addEventListener("click", start);
  $("btn-restart").addEventListener("click", start);
  $("btn-change").addEventListener("click", function () { click(); window.HBC.quitToTitle(); });
  $("btn-quit").addEventListener("click", function () { click(); window.HBC.quitToTitle(); });
  $("btn-resume").addEventListener("click", function () { window.HBC.togglePause(); });
  $("btn-pause").addEventListener("click", function () { window.HBC.togglePause(); });
  $("btn-mute").addEventListener("click", function () { window.HBC.setMuted(!window.HBC.isMuted()); });

  function rankFor(score) {
    if (score >= 600) return "BREAKFAST LEGEND";
    if (score >= 400) return "HASH BROWN HERO";
    if (score >= 250) return "GOLDEN HANDS";
    if (score >= 120) return "LINE COOK";
    return "CRISPY ROOKIE";
  }

  // ---------- react to the game ----------
  window.HBC.on(function (type, d) {
    switch (type) {
      case "ready": updateBest(); break;
      case "pause": show("screen-pause"); break;
      case "resume": show(null); break;
      case "title":
        show("screen-title"); $("hud-btns").hidden = true; updateBest(); break;
      case "over":
        $("hud-btns").hidden = true;
        $("over-title").textContent = d.score >= 120 ? "BREAKFAST COMPLETE!" : "TIME'S UP!";
        $("over-score").textContent = String(d.score).padStart(3, "0");
        $("over-diff").textContent = d.diff;
        $("over-newbest").hidden = !d.isBest;
        $("over-rank").textContent = rankFor(d.score);
        $("st-caught").textContent = d.caught;
        $("st-missed").textContent = d.missed;
        $("st-combo").textContent = d.bestCombo;
        $("st-haz").textContent = d.hazards;
        $("st-gold").textContent = d.goldens;
        $("st-best").textContent = d.best;
        paint($("over-mascot"), SP.hashBrown(d.score >= 120 ? { expr: "joy", limbs: "up" } : { expr: "sad", limbs: "down" }));
        $("over-coins").textContent = d.coinsEarned.toLocaleString("en-US");
        $("over-wallet").textContent = (d.wallet == null ? HBShop.wallet().coins : d.wallet).toLocaleString("en-US");
        $("over-dog").hidden = !d.dogs;
        $("over-dog").textContent = d.dogs ? "EVIL POTATO DOG CAUGHT x" + d.dogs + "!" : "";
        setTimeout(function () { show("screen-over"); $("btn-again").focus({ preventScroll: true }); }, 450);
        break;
      case "mute":
        $("btn-mute").setAttribute("aria-pressed", String(d.muted));
        $("btn-mute").setAttribute("aria-label", d.muted ? "Unmute sound (M)" : "Mute sound (M)");
        document.querySelector("#mute-icon .waves").style.opacity = d.muted ? 0 : 1;
        document.querySelector("#mute-icon .cross").style.opacity = d.muted ? 1 : 0;
        break;
    }
  });

  // =========================================================
  // SHOP + WALLET
  // =========================================================
  var SH = window.HBShop;
  var COIN = '<svg class="coin" viewBox="0 0 8 8" aria-hidden="true"><path d="M2 0h4v1H2zM1 1h1v1H1zM6 1h1v1H6zM0 2h1v4H0zM7 2h1v4H7zM1 6h1v1H1zM6 6h1v1H6zM2 7h4v1H2z" fill="#8A5A00"/><path d="M2 1h4v1H2zM1 2h6v4H1zM2 6h4v1H2z" fill="#FFC93C"/><path d="M3 2h2v1H3zM3 5h2v1H3zM3 3h1v2H3z" fill="#FFF1A6"/></svg>';
  function setText(id, t) { var el = $(id); if (el) el.textContent = t; }
  var fmt = function (n) { return Number(n).toLocaleString("en-US"); };
  var shopCat = "scene", sceneThumbs = {}, pending = null, pendingTimer = 0;

  function walletUI(bump) {
    var w = SH.wallet();
    setText("coin-pill", fmt(w.coins));
    setText("title-coins", fmt(w.coins));
    setText("wallet-num", fmt(w.coins));
    setText("wallet-earned", fmt(w.earned));
    if (bump && $("coin-pill")) { var pill = $("coin-pill").parentNode; pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump"); }
  }

  function preview(it) {
    var box = document.createElement("div");
    box.className = "pv";
    if (it.cat === "scene") {
      if (sceneThumbs[it.id]) { var img = new Image(); img.src = sceneThumbs[it.id]; img.alt = it.name + " scene"; box.appendChild(img); }
      else { var ph = document.createElement("span"); ph.className = "label"; ph.textContent = it.name; box.appendChild(ph); }
      return box;
    }
    var c = document.createElement("canvas");
    if (it.cat === "flavor") paint(c, SP.hashBrown({ expr: "happy", limbs: "wave", skin: it.id === "classic" ? "normal" : it.id }));
    if (it.cat === "ghost") {
      var col = it.id === "custom" ? SH.wallet().customGhost : it.color;
      if (it.id === "rainbow") {
        var cols = ["#FF8A80", "#FFD978", "#A8F0D0", "#7CC8FF", "#C9B6FF"], w = 0;
        c.width = 9 * 5 + 8; c.height = 11;
        var g = c.getContext("2d");
        cols.forEach(function (cc, i) { var t = document.createElement("canvas"); paint(t, SP.ghostColor(cc)); g.drawImage(t, i * 10.5, 0); });
      } else paint(c, SP.ghostColor(col));
      if (it.id === "midnight") box.classList.add("dark");
    }
    if (it.cat === "bomb") paint(c, SP.bombStyle(it.id === "chilibomb" ? "chili" : it.id));
    if (it.cat === "sauce") sauceCanvas(c, it.color);
    box.appendChild(c);
    return box;
  }

  // hash brown with a drizzle + the dip cup beside it
  function sauceCanvas(c, color) {
    var hb = document.createElement("canvas"); paint(hb, SP.hashBrown({ expr: "happy" }));
    c.width = 44; c.height = 30;
    var g = c.getContext("2d");
    g.drawImage(hb, 0, 0);
    g.fillStyle = color;
    for (var k = 0; k < 5; k++) g.fillRect(6 + k * 3, 6 + (k % 2), 3, 1);
    g.fillRect(7, 7, 1, 2); g.fillRect(16, 7, 1, 3);
    g.fillStyle = "#4A2412"; g.fillRect(29, 15, 13, 12);
    g.fillStyle = "#FFF6E3"; g.fillRect(30, 16, 11, 10);
    g.fillStyle = color; g.fillRect(30, 16, 11, 4);
    g.fillStyle = "#E63B2E"; g.fillRect(30, 22, 11, 1);
  }

  function renderShop() {
    var grid = $("shop-grid"), w = SH.wallet();
    if (!grid) return;
    grid.innerHTML = "";
    SH.CATALOG.filter(function (it) { return it.cat === shopCat; }).forEach(function (it) {
      var owned = SH.owns(it.id), on = w.equip[it.cat] === it.id;
      var card = document.createElement("article");
      card.className = "item" + (on ? " equipped" : "");
      card.appendChild(preview(it));
      if (on) { var tag = document.createElement("span"); tag.className = "tag"; tag.textContent = "EQUIPPED"; card.appendChild(tag); }
      var h = document.createElement("h4"); h.textContent = it.name; card.appendChild(h);
      var d = document.createElement("p"); d.textContent = it.desc; card.appendChild(d);
      if (it.id === "custom" && owned) {
        var lab = document.createElement("label"); lab.className = "picker"; lab.htmlFor = "ghost-color";
        lab.innerHTML = '<input type="color" id="ghost-color" value="' + w.customGhost + '"> Ghost colour';
        lab.querySelector("input").addEventListener("change", function (e) {
          SH.setCustomGhost(e.target.value); HBC.applyLoadout(); renderShop(); msg("Custom ghost colour saved.");
        });
        card.appendChild(lab);
      }
      var b = document.createElement("button");
      b.type = "button"; b.className = "buy"; b.dataset.id = it.id;
      if (on) { b.className += " on"; b.textContent = "EQUIPPED"; b.disabled = true; }
      else if (owned) { b.className += " equip"; b.textContent = "EQUIP"; }
      else if (pending === it.id) { b.className += " confirm"; b.innerHTML = "CONFIRM " + COIN + fmt(it.price) + "?"; }
      else if (w.coins >= it.price) { b.innerHTML = "BUY " + COIN + fmt(it.price); }
      else { b.innerHTML = COIN + fmt(it.price) + " · NEED " + fmt(it.price - w.coins); b.disabled = true; }
      b.addEventListener("click", function () { onBuy(it); });
      card.appendChild(b);
      grid.appendChild(card);
    });
  }

  function msg(t) { setText("shop-msg", t); }

  function onBuy(it) {
    if (SH.owns(it.id)) {
      SH.equip(it.id); HBC.applyLoadout(); HBC.sfx("equip", 0.6);
      msg(it.name + " equipped. You'll see it next round.");
    } else if (pending !== it.id) {
      pending = it.id; clearTimeout(pendingTimer);
      pendingTimer = setTimeout(function () { pending = null; renderShop(); }, 3500);
      click();
      msg("Tap again to spend " + fmt(it.price) + " coins on " + it.name + ".");
    } else {
      pending = null;
      if (SH.buy(it.id)) {
        HBC.applyLoadout(); HBC.sfx("buy", 0.7);
        msg("Bought and equipped " + it.name + "!");
      }
    }
    renderShop();
    var again = document.querySelector('.buy[data-id="' + it.id + '"]');
    if (again) again.focus({ preventScroll: true });
  }

  var tabs = document.querySelectorAll("#shop-tabs [role=tab]");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t.dataset.cat); });
    t.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var n = tabs[(i + dir + tabs.length) % tabs.length];
      selectTab(n.dataset.cat); n.focus();
    });
  });
  function selectTab(cat) {
    shopCat = cat; pending = null;
    tabs.forEach(function (t) { var on = t.dataset.cat === cat; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    renderShop();
  }

  if ($("test-coins")) $("test-coins").addEventListener("click", function () {
    SH.addCoins(1000); HBC.sfx("buy", 0.5); msg("Added 1,000 test coins.");
  });
  SH.onChange(function () { walletUI(true); renderShop(); renderDex(); });

  // scene thumbnails are rendered by the p5 sketch once the art has loaded
  HBC.on(function (type) {
    if (type !== "assets") return;
    setTimeout(function () {
      SH.CATALOG.forEach(function (it) { if (it.cat === "scene") sceneThumbs[it.id] = HBC.snapshotScene(it.id, 360); });
      if (shopCat === "scene") renderShop();
    }, 400);
  });

  // =========================================================
  // EVIL POTATO DOG
  // =========================================================
  paint($("morph-a"), SP.hashBrown({ expr: "open" }));
  (function () {
    var c = $("morph-b"); if (!c) return; c.width = 30; c.height = 28;
    var g = c.getContext("2d"), cols = ["#FFFFFF", "#E9DCCB", "#CFC3B2", "#FFD24A"];
    [[15, 14, 9], [8, 10, 6], [22, 9, 6], [9, 20, 6], [21, 20, 6], [15, 5, 4]].forEach(function (p, i) {
      g.fillStyle = cols[i % 3]; g.beginPath(); g.arc(p[0], p[1], p[2], 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = "#FFD24A"; g.fillRect(3, 3, 1, 3); g.fillRect(2, 4, 3, 1); g.fillRect(26, 22, 1, 3); g.fillRect(25, 23, 3, 1);
  })();
  paint($("morph-c"), SP.potatoDog("couch"));

  function renderDex() {
    var w = SH.wallet(), box = $("dogdex");
    if (!box) return;
    box.innerHTML = "";
    SH.DOGS.forEach(function (d) {
      var n = w.dogs[d.id] || 0;
      var card = document.createElement("article");
      card.className = "dogcard" + (n ? "" : " locked");
      var c = document.createElement("canvas"); paint(c, SP.potatoDog(d.id)); card.appendChild(c);
      card.insertAdjacentHTML("beforeend",
        '<span class="rarity ' + d.rarity + '">' + d.rarity + "</span><h4>" + d.name + "</h4><p>" + d.line + "</p>" +
        '<span class="caught' + (n ? "" : " none") + '">' + (n ? "CAUGHT x" + n : "NOT CAUGHT YET") + "</span>");
      box.appendChild(card);
    });
  }

  walletUI(false);
  renderShop();
  renderDex();
  selectDiff(state.diff);
})();
