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

  selectDiff(state.diff);
})();
