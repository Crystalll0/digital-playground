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
    burnt:  { base: "#5B3519", light: "#7D4D26", dark: "#3E2210", rim: "#2C170A", line: "#1A0D05", shine: "#9C6A3E" },
    // shop flavours
    cheesy:  { base: "#F5A623", light: "#FFD978", dark: "#DB8418", rim: "#B65F16", line: "#7A3A0E", shine: "#FFF4C9" },
    seaweed: { base: "#EFA83A", light: "#FFD98A", dark: "#C98A2A", rim: "#9C6418", line: "#5E3A0E", shine: "#FFF4C9" },
    ube:     { base: "#A86BD1", light: "#D3A8F0", dark: "#7B3FA8", rim: "#5E2C85", line: "#3A1657", shine: "#F6EAFF" },
    cajun:   { base: "#EE8A35", light: "#FFC07A", dark: "#C8561E", rim: "#9C3A14", line: "#5E1F08", shine: "#FFE6C9" },
    truffle: { base: "#E2B04F", light: "#F7D88C", dark: "#B9862E", rim: "#8A5E1A", line: "#4A300A", shine: "#FFFFFF" }
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
    // flavour toppings (shop skins)
    decorate(s, opts.skin, skin, cx, rx);
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

  // ---- Hot sauce bomb -----------------------------------------------------
  function bomb() {
    var W = 22, H = 24;
    var s = blank(W, H);
    var cx = 10.5, cy = 14.5, r = 8.6;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var d = Math.hypot(x - cx, y - cy);
      if (d > r) continue;
      var c = d > r - 1.1 ? "#5C0F0A" : (d > r - 2.4 ? PAL.tomatoDark : PAL.tomato);
      if (x - cx < -2 && y - cy < -2 && d < r - 2) c = "#FF6B5E";
      set(s, x, y, c);
    }
    plot(s, [[6, 10], [7, 9], [6, 9]], "#FFC2BA");
    // cream label band with a little flame
    for (var lx = 4; lx <= 16; lx++) for (var ly = 17; ly <= 19; ly++) {
      if (Math.hypot(lx - cx, ly - cy) < r - 1.2) set(s, lx, ly, PAL.cream);
    }
    plot(s, [[8, 18], [9, 18], [11, 18], [12, 18], [13, 18], [10, 17], [10, 18], [10, 19], [7, 18]], "#FF8A1F");
    plot(s, [[10, 18]], "#FFD24A");
    // angry eyes + brows
    plot(s, [[6, 11], [7, 12], [8, 12], [13, 12], [14, 12], [15, 11]], "#3B0906");
    plot(s, [[7, 13], [8, 13], [7, 14], [8, 14], [13, 13], [14, 13], [13, 14], [14, 14]], "#3B0906");
    plot(s, [[7, 13], [13, 13]], "#FFFFFF");
    // cap + fuse
    plot(s, [[9, 5], [10, 5], [11, 5], [12, 5], [9, 6], [10, 6], [11, 6], [12, 6]], "#3A3A3A");
    plot(s, [[10, 4], [11, 4]], "#5A5A5A");
    plot(s, [[11, 3], [12, 2], [13, 2], [14, 1]], "#8A6A3A");
    return s;
  }

  // ---- Coffee (slow motion) ---------------------------------------------
  function coffee() {
    var rows = [
      "..s..s..s.......",
      ".s..s..s........",
      "..s..s..s.......",
      "................",
      "lwwwwwwwwwwl....",
      "lccccccccccl....",
      "lwwwwwwwwwwlll..",
      "lwwwwwwwwwwl.l..",
      "lrrrrrrrrrrl..l.",
      "lrrrrrrrrrrl..l.",
      "lwwwwwwwwwwl.l..",
      "lwwwwwwwwwwlll..",
      "lwwwwwwwwwwl....",
      ".lwwwwwwwwl.....",
      "..llllllll......"
    ];
    return fromRows(rows, { l: "#7A5C48", w: "#FFFFFF", c: "#5A2F17", r: PAL.tomato, s: "#E9DCCB" });
  }

  // ---- Alarm clock (+5 seconds) ------------------------------------------
  function clock() {
    var rows = [
      ".rr.......rr.",
      "rrr.......rrr",
      "rr..kkkkk..rr",
      "...krrrrrk...",
      "..krwwwwwrk..",
      ".krwwwkwwwrk.",
      ".krwwwkwwwrk.",
      ".krwwwkkkwrk.",
      ".krwwwwwwwrk.",
      ".krwwwwwwwrk.",
      "..krwwwwwrk..",
      "...krrrrrk...",
      "..k.kkkkk.k.."
    ];
    return fromRows(rows, { r: PAL.tomato, k: "#4A2412", w: PAL.cream });
  }

  // ---- Sparkle (4-point star) --------------------------------------------
  function sparkle(color) {
    var rows = ["..x..", "..x..", "xxwxx", "..x..", "..x.."];
    return fromRows(rows, { x: color || "#FFD24A", w: "#FFFFFF" });
  }


  // ---- flavour toppings ----------------------------------------------------
  function decorate(s, flavor, skin, cx, rx) {
    if (!flavor || flavor === "normal" || flavor === "golden" || flavor === "burnt" || flavor === "ube") return;
    for (var y = 0; y < s.h; y++) for (var x = 0; x < s.w; x++) {
      var c = get(s, x, y);
      if (!c || c === skin.line) continue;
      var face = Math.abs(x - cx) < 7 && y >= 10 && y <= 18;
      var r = hash(x, y, 31);
      if (flavor === "cheesy") {
        // melted cheese cap with drips
        var dripTo = { 7: 9, 8: 10, 12: 9, 13: 11, 17: 8, 18: 10 }[x] || 7;
        if (y >= 3 && y <= dripTo) set(s, x, y, y === dripTo ? "#F2A900" : (r < 0.15 ? "#FFF0A0" : "#FFD23F"));
      } else if (!face) {
        if (flavor === "seaweed") { if (r < 0.08) set(s, x, y, "#2E5A2B"); else if (r > 0.96) set(s, x, y, "#FFFFFF"); }
        if (flavor === "cajun") { if (r < 0.08) set(s, x, y, "#C8321E"); else if (r > 0.95) set(s, x, y, "#7A1A0A"); }
        if (flavor === "truffle") { if (r < 0.07) set(s, x, y, "#2B1D12"); else if (r > 0.97) set(s, x, y, "#FFFFFF"); }
      }
    }
  }

  function shade(hex, k) { // k < 0 darker, k > 0 lighter
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(v) { return Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); }
    return "#" + [f(r), f(g), f(b)].map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join("");
  }

  // ---- ghost in any colour ------------------------------------------------
  function ghostColor(fill, eye) {
    fill = fill || "#FFFFFF";
    var rows = [
      "..xxxxx..",
      ".xwwwwwx.",
      "xwhwwwwwx",
      "xwkwwwkwx",
      "xwkwwwkwx",
      "xwwwwwwwx",
      "xwwwowwwx",
      "xwwwwwwwx",
      "xwwwwwwwx",
      "xwxwxwxwx",
      "x.x.x.x.x"
    ];
    var dark = isDark(fill);
    return fromRows(rows, { x: shade(fill, dark ? 0.35 : -0.22), w: fill, h: shade(fill, 0.6),
      k: eye || (dark ? "#FFE066" : "#4A3A2A"), o: shade(fill, dark ? 0.5 : -0.4) });
  }
  function isDark(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) < 110;
  }

  // ---- bomb styles -----------------------------------------------------------
  function bombStyle(style) {
    if (!style || style === "hotsauce") return bomb();
    var W = 22, H = 24, s = blank(W, H), x, y, d;
    var eye = "#FFFFFF", pupil = "#1A0A06";
    if (style === "cherry") { // classic round black bomb
      var cx = 10.5, cy = 14.5, r = 8.6;
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        d = Math.hypot(x - cx, y - cy); if (d > r) continue;
        set(s, x, y, d > r - 1.1 ? "#0E0E14" : (x - cx < -2 && y - cy < -2 ? "#4A4A5E" : "#24242E"));
      }
      plot(s, [[6, 10], [7, 9], [6, 9], [7, 10]], "#8A8AA8");
      plot(s, [[8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [8, 6], [12, 6]], "#3A3A48");
      plot(s, [[11, 3], [12, 2], [13, 2], [14, 1]], "#8A6A3A");
    } else if (style === "chili") { // grumpy chili pepper
      var rows = [
        "..............ff......",
        ".............f........",
        "..........gggg........",
        ".........gGGGgg.......",
        "........lrrrrrrl......",
        ".......lrRrrrrrrl.....",
        "......lrRrrrrrrrrl....",
        "......lrRrrrrrrrrl....",
        "......lrrrrrrrrrrl....",
        "......lrrrrrrrrrrl....",
        "......lrrrrrrrrrrl....",
        "......lrrrrrrrrrrl....",
        "......lrrrrrrrrrrl....",
        ".......lrrrrrrrrl.....",
        ".......lrrrrrrrrl.....",
        "........lrrrrrrl......",
        "........lrrrrrrl......",
        ".........lrrrrl.......",
        ".........lrrrrl.......",
        "..........lrrl........",
        "...........lrl........",
        "............l.........",
        "......................",
        "......................"
      ];
      s = fromRows(rows, { l: "#5C0F0A", r: "#E63B2E", R: "#FF8A80", g: "#3E8E3A", G: "#7CC86A", f: "#8A6A3A" });
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (get(s, x, y) === "#E63B2E" && hash(x, y, 41) < 0.12) set(s, x, y, "#C8261C");
    } else if (style === "wasabi") { // angry wasabi blob
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var nx = (x - 10.5) / 9, ny = (y - 15) / 8;
        var wob = Math.sin(x * 1.3) * 0.08;
        d = nx * nx + ny * ny + (ny < 0 ? wob : 0);
        if (d > 1) continue;
        set(s, x, y, d > 0.8 ? "#2F6A1E" : (hash(x, y, 51) < 0.12 ? "#B6E07A" : "#7FBF3F"));
      }
      plot(s, [[5, 22], [5, 23], [15, 22], [15, 23], [16, 23]], "#7FBF3F");
      plot(s, [[10, 6], [10, 5], [11, 4], [12, 3], [13, 3]], "#2F6A1E");
      plot(s, [[14, 2]], "#8A6A3A"); plot(s, [[15, 1]], "#8A6A3A");
      pupil = "#1E3A10";
    }
    // shared angry face
    plot(s, [[6, 11], [7, 12], [8, 12], [13, 12], [14, 12], [15, 11]], pupil);
    plot(s, [[7, 13], [8, 13], [7, 14], [8, 14], [13, 13], [14, 13], [13, 14], [14, 14]], style === "cherry" ? "#FFFFFF" : pupil);
    if (style === "cherry") plot(s, [[8, 14], [13, 14]], "#E63B2E"); else plot(s, [[7, 13], [13, 13]], eye);
    plot(s, [[9, 17], [10, 16], [11, 16], [12, 17]], style === "cherry" ? "#FFFFFF" : pupil);
    return s;
  }

  // ---- THE EVIL POTATO DOG (easter egg) ------------------------------------
  // An original potato-bodied pup: droopy peel ears, deadpan half-lidded
  // eyes with tired eye-bags, and a smug little smirk.
  var DOG_SKINS = {
    couch:  { base: "#DDB57A", light: "#EECB91", dark: "#C29A60", ear: "#A87B45", spot: "#A47A45", line: "#6E4A24" },
    boss:   { base: "#D6AE72", light: "#E9C48A", dark: "#B98F56", ear: "#9C703C", spot: "#9C703C", line: "#5E3E1C" },
    waiter: { base: "#E2BC84", light: "#F2D29E", dark: "#C7A068", ear: "#B0834C", spot: "#A47A45", line: "#6E4A24" },
    devil:  { base: "#D9A270", light: "#EBBC8E", dark: "#BD8452", ear: "#9A5E34", spot: "#9A5E34", line: "#5A2A12" },
    golden: { base: "#FFD24A", light: "#FFF1A6", dark: "#F0A500", ear: "#E09000", spot: "#C98700", line: "#8A5A00" }
  };
  function potatoDog(variant, pose) {
    variant = variant || "couch"; pose = pose || "stand";
    var k = DOG_SKINS[variant] || DOG_SKINS.couch;
    var W = 30, H = 28, s = blank(W, H), x, y;
    var ink = "#2B1A10";
    var mask = [];
    for (y = 0; y < H; y++) { mask[y] = []; for (x = 0; x < W; x++) mask[y][x] = 0; }
    // 1 = head, 2 = body, 3 = legs/tail
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var hx = Math.abs((x - 14.5) / 11.2), hy = Math.abs((y - 11) / 9.2);
      if (Math.pow(hx, 2.3) + Math.pow(hy, 2.3) <= 1 + (hash(x, y, 61) - 0.5) * 0.12) mask[y][x] = 1;
      else if (Math.pow((x - 14.5) / 6.6, 2) + Math.pow((y - 21) / 4.6, 2) <= 1) mask[y][x] = 2;
    }
    var legs = pose === "fall"
      ? [[8, 21], [7, 22], [6, 23], [21, 21], [22, 22], [23, 23], [11, 25], [11, 26], [18, 25], [18, 26]]
      : [[10, 24], [10, 25], [11, 25], [11, 26], [10, 26], [18, 24], [18, 25], [19, 25], [18, 26], [19, 26], [13, 25], [13, 26], [16, 25], [16, 26]];
    for (var i = 0; i < legs.length; i++) mask[legs[i][1]][legs[i][0]] = 3;
    [[21, 20], [22, 19], [23, 18], [23, 17], [22, 16]].forEach(function (p) { if (!mask[p[1]][p[0]]) mask[p[1]][p[0]] = 3; }); // curly tail
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var m = mask[y][x]; if (!m) continue;
      var edge = !mask[y - 1] || !mask[y - 1][x] || !mask[y + 1] || !mask[y + 1][x] || !mask[y][x - 1] || !mask[y][x + 1];
      var c = k.base;
      if (edge) c = k.line;
      else if (m === 3) c = k.dark;
      else {
        var r = hash(x, y, 71);
        var faceZone = m === 1 && x > 7 && x < 22 && y > 6 && y < 19;
        if (r < (faceZone ? 0.04 : 0.1)) c = k.light; else if (r > (faceZone ? 0.97 : 0.9)) c = k.dark;
      }
      set(s, x, y, c);
    }
    // potato "eyes" (little dark dimples)
    plot(s, [[6, 6], [7, 6], [22, 5], [23, 5], [20, 18], [9, 21], [10, 21]], k.spot);
    // droopy peel ears
    var earL = [[5, 3], [6, 3], [4, 4], [5, 4], [6, 4], [3, 5], [4, 5], [5, 5], [2, 6], [3, 6], [4, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7],
      [1, 8], [2, 8], [3, 8], [4, 8], [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [0, 10], [1, 10], [2, 10], [3, 10], [0, 11], [1, 11], [2, 11], [3, 11],
      [0, 12], [1, 12], [2, 12], [3, 12], [1, 13], [2, 13], [3, 13], [1, 14], [2, 14], [2, 15]];
    function drawEar(list, mirror) {
      var set2 = {};
      list.forEach(function (p) { set2[(mirror ? W - 1 - p[0] : p[0]) + "," + p[1]] = 1; });
      Object.keys(set2).forEach(function (key) {
        var a = key.split(","), ex = +a[0], ey = +a[1];
        var e = !set2[(ex - 1) + "," + ey] || !set2[(ex + 1) + "," + ey] || !set2[ex + "," + (ey - 1)] || !set2[ex + "," + (ey + 1)];
        set(s, ex, ey, e ? k.line : (hash(ex, ey, 81) < 0.15 ? k.dark : k.ear));
      });
    }
    drawEar(earL, false); drawEar(earL, true);
    if (variant === "golden") { plot(s, [[2, 7], [27, 7]], "#FFF1A6"); }

    // deadpan half-lidded eyes + eye bags
    var lidL = [[9, 10], [10, 10], [11, 10], [12, 10]], lidR = [[17, 10], [18, 10], [19, 10], [20, 10]];
    if (variant === "boss") {
      plot(s, [[8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [8, 10], [9, 10], [10, 10], [11, 10], [12, 10], [13, 10], [9, 11], [10, 11], [11, 11], [12, 11],
        [16, 9], [17, 9], [18, 9], [19, 9], [20, 9], [21, 9], [16, 10], [17, 10], [18, 10], [19, 10], [20, 10], [21, 10], [17, 11], [18, 11], [19, 11], [20, 11],
        [14, 9], [15, 9]], "#15151C");
      plot(s, [[9, 9], [10, 9], [17, 9], [18, 9]], "#6A6A88");
    } else {
      plot(s, lidL.concat(lidR), ink);
      plot(s, [[9, 11], [12, 11], [17, 11], [20, 11]], "#FFF6E3");
      var pc = variant === "devil" ? "#E63B2E" : ink;
      plot(s, [[10, 11], [11, 11], [18, 11], [19, 11]], pc);
      plot(s, [[10, 12], [11, 12], [18, 12], [19, 12]], variant === "golden" ? "#E0A040" : "#B98868"); // tired eye bags
      // evil slanted brows
      plot(s, [[9, 7], [10, 7], [11, 8], [12, 8], [17, 8], [18, 8], [19, 7], [20, 7]], ink);
    }
    // nose
    plot(s, [[13, 13], [14, 13], [15, 13], [16, 13], [14, 14], [15, 14]], ink);
    set(s, 14, 13, "#7A5C48");
    // smug smirk (lopsided "w")
    plot(s, [[15, 15], [12, 16], [13, 17], [14, 17], [15, 16], [16, 17], [17, 17], [18, 16], [19, 15]], ink);
    plot(s, [[7, 14], [8, 14], [21, 14], [22, 14]], variant === "devil" ? "#F07A5A" : "#E8A08A");

    // costumes
    if (variant === "couch") plot(s, [[14, 1], [15, 0], [16, 1], [15, 1]], k.line);
    if (variant === "boss") plot(s, [[11, 19], [13, 20], [15, 20], [17, 20], [19, 19], [12, 20], [14, 20], [16, 20], [18, 20]], "#FFC400");
    if (variant === "waiter") {
      for (y = 20; y <= 24; y++) for (x = 11; x <= 18; x++) if (get(s, x, y) && get(s, x, y) !== k.line) set(s, x, y, y === 22 ? "#E63B2E" : "#FFF6E3");
      plot(s, [[13, 18], [13, 19], [13, 20], [14, 19], [15, 19], [16, 19], [17, 18], [17, 19], [17, 20]], "#E63B2E");
      set(s, 15, 19, "#A9231A");
    }
    if (variant === "devil") {
      plot(s, [[7, 1], [8, 2], [8, 3], [9, 3], [9, 4], [10, 4], [22, 1], [21, 2], [21, 3], [20, 3], [20, 4], [19, 4]], "#E63B2E");
      plot(s, [[7, 1], [22, 1]], "#A9231A");
      plot(s, [[24, 17], [25, 16], [26, 15], [27, 14], [26, 14], [27, 15], [25, 13], [28, 13]], "#E63B2E");
    }
    if (variant === "golden") {
      plot(s, [[11, 2], [12, 2], [13, 2], [14, 2], [15, 2], [16, 2], [17, 2], [18, 2], [11, 1], [15, 0], [15, 1], [18, 1], [11, 0], [18, 0]], "#FFC400");
      plot(s, [[11, 3], [12, 3], [13, 3], [14, 3], [15, 3], [16, 3], [17, 3], [18, 3]], "#C98700");
      set(s, 15, 2, "#E63B2E");
    }
    return s;
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
    ghostColor: ghostColor,
    bomb: bomb,
    bombStyle: bombStyle,
    potatoDog: potatoDog,
    DOG_VARIANTS: Object.keys(DOG_SKINS),
    shade: shade,
    coffee: coffee,
    clock: clock,
    sparkle: sparkle,
    toCanvas: toCanvas,
    get: get
  };
})(typeof window !== "undefined" ? window : this);
