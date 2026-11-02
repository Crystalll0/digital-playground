/* =========================================================
   Hash Brown Catch — pixel sprite factory
   Every sprite is generated in code as a grid of colours
   (no image files, no copyright risk).
   A sprite = { w, h, px: Array(w*h) of "#rrggbb" | null }
   sketch.js turns them into p5.Graphics frames (Week 5:
   images & frame animation); site.js draws them on plain
   <canvas> elements for the character sheet.
   ========================================================= */
(function (root) {
  "use strict";

  // ---- Brand palette ---------------------------------------------------
  var PAL = {
    cream: "#FFF6E3",
    butter: "#FFD978",
    gold: "#F5A623",
    deep: "#DB8418",
    crust: "#B65F16",
    edge: "#7A3A0E",
    cocoa: "#4A2412",
    tomato: "#E63B2E",
    tomatoDark: "#A9231A",
    blush: "#FF6F7A",
    white: "#FFFFFF",
    shine: "#FFF4C9",
    tear: "#7CC8FF",
    tearDark: "#3E95D6"
  };

  // deterministic hash noise so every sprite looks the same every load
  function hash(x, y, seed) {
    var h = (x * 374761393 + y * 668265263 + (seed || 0) * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    h = h ^ (h >>> 16);
    return ((h >>> 0) % 10000) / 10000;
  }

  function blank(w, h) {
    return { w: w, h: h, px: new Array(w * h).fill(null) };
  }
  function set(s, x, y, c) {
    if (x < 0 || y < 0 || x >= s.w || y >= s.h) return;
    s.px[y * s.w + x] = c;
  }
  function get(s, x, y) {
    if (x < 0 || y < 0 || x >= s.w || y >= s.h) return null;
    return s.px[y * s.w + x];
  }
  function plot(s, list, c) {
    for (var i = 0; i < list.length; i++) set(s, list[i][0], list[i][1], c);
  }
  function mirrorX(s, x) { return s.w - 1 - x; }

  // ---- Hash brown body --------------------------------------------------
  var SKINS = {
    normal: { base: PAL.gold, light: PAL.butter, dark: PAL.deep, rim: PAL.crust, line: PAL.edge, shine: PAL.shine },
    golden: { base: "#FFC93C", light: "#FFF1A6", dark: "#F0A500", rim: "#D98E00", line: "#9A5A00", shine: "#FFFFFF" },
    burnt:  { base: "#5B3519", light: "#7D4D26", dark: "#3E2210", rim: "#2C170A", line: "#1A0D05", shine: "#9C6A3E" }
  };

  /**
   * Crispy, the hash brown.
   * opts.expr  : happy | open | joy | worried | smug | sad | dizzy | grumpy | wink
   * opts.limbs : none | down | up | wave
   * opts.skin  : normal | golden | burnt
   */
  function hashBrown(opts) {
    opts = opts || {};
    var expr = opts.expr || "happy";
    var limbs = opts.limbs || "none";
    var skin = SKINS[opts.skin || "normal"];
    var W = 26, H = 30;
    var s = blank(W, H);
    var cx = 12.5, cy = 14.5, rx = 8.6, ry = 12.2, p = 2.5;

    // 1) fill the long rounded oval with a crispy, slightly ragged edge
    var inside = [];
    for (var y = 0; y < H; y++) {
      inside[y] = [];
      for (var x = 0; x < W; x++) {
        var dx = Math.abs((x - cx) / rx), dy = Math.abs((y - cy) / ry);
        var d = Math.pow(dx, p) + Math.pow(dy, p);
        var jag = 1 + (hash(x, y, 7) - 0.5) * 0.16;
        inside[y][x] = d <= jag ? d : -1;
      }
    }
    for (y = 0; y < H; y++) {
      for (x = 0; x < W; x++) {
        var dv = inside[y][x];
        if (dv < 0) continue;
        var border =
          (inside[y - 1] && inside[y - 1][x] < 0) || !inside[y - 1] ||
          (inside[y + 1] && inside[y + 1][x] < 0) || !inside[y + 1] ||
          inside[y][x - 1] < 0 || inside[y][x + 1] < 0 ||
          inside[y][x - 1] === undefined || inside[y][x + 1] === undefined;
        var c;
        if (border) c = skin.line;
        else if (dv > 0.72) c = (hash(x, y, 3) > 0.45) ? skin.rim : skin.dark;
        else {
          // shredded potato texture: little diagonal flecks
          var r = hash(x, y, 11);
          var diag = hash(x + y, x - y, 5);
          var face = Math.abs(x - cx) < 7 && y >= 10 && y <= 18;
          var lt = face ? 0.05 : 0.14, dk = face ? 0.97 : 0.86, dg = face ? 0.0 : 0.08;
          if (r < lt || diag < dg) c = skin.light;
          else if (r > dk) c = skin.dark;
          else c = skin.base;
          // top-left warm highlight
          if ((x - cx) / rx < -0.15 && (y - cy) / ry < -0.35 && hash(x, y, 9) > 0.55) c = skin.light;
          // bottom-right toasted
          if ((x - cx) / rx > 0.35 && (y - cy) / ry > 0.45 && hash(x, y, 13) > 0.45) c = skin.dark;
        }
        set(s, x, y, c);
      }
    }
    // oil shine sparkle
    plot(s, [[7, 5], [8, 5], [7, 6], [6, 7]], skin.shine);

    // 2) limbs (cocoa sticks with round hands / feet)
    var arm = PAL.cocoa;
    if (opts.skin === "burnt") arm = "#1A0D05";
    if (limbs !== "none") {
      // legs
      plot(s, [[9, 27], [9, 28], [8, 28], [16, 27], [16, 28], [17, 28]], arm);
      var down = [[3, 16], [2, 17], [2, 18], [1, 18], [1, 19], [2, 19]];
      var up = [[3, 12], [2, 11], [2, 10], [1, 9], [1, 8], [2, 8], [0, 9]];
      var left = limbs === "up" ? up : down;
      var right = (limbs === "up" || limbs === "wave") ? up : down;
      plot(s, left, arm);
      for (var i = 0; i < right.length; i++) set(s, mirrorX(s, right[i][0]), right[i][1], arm);
    }

    // 3) face
    var ink = opts.skin === "burnt" ? "#FFE9C7" : PAL.cocoa;
    var eyeHi = opts.skin === "burnt" ? "#2C170A" : PAL.white;
    var blush = opts.skin === "burnt" ? "#A0522D" : PAL.blush;
    var LX = 9, RX = 15, EY = 11; // eye top-left corners (2x2 eyes)

    function eyes2x2() { // tall 2x3 shiny eyes
      plot(s, [[LX, EY], [LX + 1, EY], [LX, EY + 1], [LX + 1, EY + 1], [LX, EY + 2], [LX + 1, EY + 2]], ink);
      plot(s, [[RX, EY], [RX + 1, EY], [RX, EY + 1], [RX + 1, EY + 1], [RX, EY + 2], [RX + 1, EY + 2]], ink);
      set(s, LX, EY, eyeHi); set(s, RX, EY, eyeHi);
    }
    function happyArcs() { // ^ ^
      plot(s, [[LX - 1, EY + 1], [LX, EY], [LX + 1, EY], [LX + 2, EY + 1]], ink);
      plot(s, [[RX - 1, EY + 1], [RX, EY], [RX + 1, EY], [RX + 2, EY + 1]], ink);
    }
    function blushes() {
      plot(s, [[6, 14], [7, 14], [6, 15], [7, 15], [18, 14], [19, 14], [18, 15], [19, 15]], blush);
    }
    var smile = [[11, 15], [12, 16], [13, 16], [14, 15]];
    EY = EY; // eyes rows 11-13, mouth rows 15-17
    var open = function () {
      plot(s, [[11, 15], [12, 15], [13, 15], [14, 15], [11, 16], [14, 16], [12, 17], [13, 17]], ink);
      plot(s, [[12, 16], [13, 16]], PAL.tomato);
    };

    switch (expr) {
      case "happy":
        eyes2x2(); blushes(); plot(s, smile, ink); break;
      case "open":
        eyes2x2(); blushes(); open(); break;
      case "joy":
        happyArcs(); blushes(); open(); break;
      case "wink":
        plot(s, [[LX, EY], [LX + 1, EY], [LX, EY + 1], [LX + 1, EY + 1]], ink); set(s, LX, EY, eyeHi);
        plot(s, [[RX - 1, EY + 1], [RX, EY], [RX + 1, EY], [RX + 2, EY + 1]], ink);
        blushes(); open(); break;
      case "worried":
        eyes2x2(); blushes();
        plot(s, [[LX - 1, EY - 2], [LX, EY - 2], [RX + 1, EY - 2], [RX + 2, EY - 2]], ink); // brows
        plot(s, [[11, 16], [12, 15], [13, 15], [14, 16]], ink);
        plot(s, [[20, 8], [20, 9], [21, 9], [20, 10]], PAL.tear); set(s, 21, 10, PAL.tearDark);
        break;
      case "smug":
        plot(s, [[LX, EY - 1], [LX + 1, EY], [LX, EY + 1]], ink);       // >
        plot(s, [[RX + 1, EY - 1], [RX, EY], [RX + 1, EY + 1]], ink);   // <
        blushes(); open(); break;
      case "sad":
        eyes2x2(); blushes();
        plot(s, [[11, 17], [12, 16], [13, 16], [14, 17]], ink);
        plot(s, [[LX, EY + 3], [LX, EY + 4], [RX + 1, EY + 3], [RX + 1, EY + 4]], PAL.tear);
        break;
      case "dizzy":
        plot(s, [[LX - 1, EY - 1], [LX + 1, EY - 1], [LX, EY], [LX - 1, EY + 1], [LX + 1, EY + 1]], ink);
        plot(s, [[RX, EY - 1], [RX + 2, EY - 1], [RX + 1, EY], [RX, EY + 1], [RX + 2, EY + 1]], ink);
        plot(s, [[12, 15], [13, 15], [11, 16], [14, 16], [12, 17], [13, 17]], ink);
        blushes(); break;
      case "grumpy":
        plot(s, [[LX - 1, EY - 1], [LX, EY], [LX + 1, EY], [RX, EY], [RX + 1, EY], [RX + 2, EY - 1]], ink);
        plot(s, [[LX, EY + 1], [RX + 1, EY + 1]], ink);
        plot(s, [[11, 16], [12, 15], [13, 16], [14, 15]], ink);
        break;
    }
    return s;
  }

  // ---- Sad mashed potato --------------------------------------------------
  function mash(opts) {
    opts = opts || {};
    var W = 30, H = 13;
    var s = blank(W, H);
    var base = opts.golden ? "#E9CF86" : "#D9CBA9",
        light = opts.golden ? "#F7E7B4" : "#EFE5CB",
        dark = opts.golden ? "#C8A453" : "#B9A683",
        line = opts.golden ? "#8C6A2A" : "#857353";
    var fill = [];
    for (var y = 0; y < H; y++) {
      fill[y] = [];
      for (var x = 0; x < W; x++) {
        var nx = (x - 14.5) / 14.5;
        var top = 12 - 9.5 * Math.pow(Math.max(0, 1 - nx * nx), 0.8) - (hash(x, 1, 4) > 0.6 ? 1 : 0);
        fill[y][x] = y >= top && y <= 12;
      }
    }
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (!fill[y][x]) continue;
      var border = !fill[y - 1] || !fill[y - 1][x] || !fill[y][x - 1] || !fill[y][x + 1] || y === 12;
      var c = base;
      if (border) c = line;
      else if (hash(x, y, 21) < 0.18) c = light;
      else if (hash(x, y, 22) > 0.84 || y > 10) c = dark;
      set(s, x, y, c);
    }
    var ink = "#5C4A33";
    // droopy ghost-ish face
    plot(s, [[11, 6], [12, 6], [11, 7], [12, 7], [17, 6], [18, 6], [17, 7], [18, 7]], ink);
    plot(s, [[10, 4], [11, 4], [18, 4], [19, 4]], ink); // droopy brows
    plot(s, [[13, 10], [14, 9], [15, 9], [16, 10]], ink);
    plot(s, [[11, 8], [11, 9]], "#9CCBEB");
    return s;
  }

  // ---- Little ghost that floats out of the mash -------------------------
  function ghost() {
    var rows = [
      "..xxxxx..",
      ".xwwwwwx.",
      "xwwwwwwwx",
      "xwkwwwkwx",
      "xwkwwwkwx",
      "xwwwwwwwx",
      "xwwwowwwx",
      "xwwwwwwwx",
      "xwwwwwwwx",
      "xwxwxwxwx",
      "x.x.x.x.x"
    ];
    return fromRows(rows, { x: "#CFC3B2", w: "#FFFFFF", k: "#4A3A2A", o: "#9C8A74" });
  }

  // ---- Sparkle (4-point star) --------------------------------------------
  function sparkle(color) {
    var rows = ["..x..", "..x..", "xxwxx", "..x..", "..x.."];
    return fromRows(rows, { x: color || "#FFD24A", w: "#FFFFFF" });
  }


  function fromRows(rows, map) {
    var s = blank(rows[0].length, rows.length);
    for (var y = 0; y < rows.length; y++)
      for (var x = 0; x < rows[y].length; x++) {
        var ch = rows[y][x];
        if (map[ch]) set(s, x, y, map[ch]);
      }
    return s;
  }

  // ---- helpers for plain <canvas> use -----------------------------------
  function toCanvas(spr, scale) {
    scale = scale || 1;
    var c = document.createElement("canvas");
    c.width = spr.w * scale; c.height = spr.h * scale;
    var g = c.getContext("2d");
    for (var y = 0; y < spr.h; y++) for (var x = 0; x < spr.w; x++) {
      var col = spr.px[y * spr.w + x];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(x * scale, y * scale, scale, scale);
    }
    return c;
  }

  root.HBSprites = {
    PAL: PAL,
    hashBrown: hashBrown,
    mash: mash,
    ghost: ghost,
    sparkle: sparkle,
    toCanvas: toCanvas,
    get: get
  };
})(typeof window !== "undefined" ? window : this);
