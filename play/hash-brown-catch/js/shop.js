/* =========================================================
   Hash Brown Catch — wallet, shop catalogue, collection
   Coins = score from every finished round, saved forever
   in this browser (localStorage).
   ========================================================= */
(function (root) {
  "use strict";

  var CATALOG = [
    // scenes
    { id: "crunch",  cat: "scene", name: "Crunch Club",     price: 0,    desc: "The red-and-white diner where it all started." },
    { id: "night",   cat: "scene", name: "Midnight Diner",  price: 800,  desc: "Neon sign on, moon in the window, coffee still hot." },
    { id: "picnic",  cat: "scene", name: "Sunday Picnic",   price: 1500, desc: "Gingham blanket, lemonade, clouds that look like hash browns." },
    { id: "space",   cat: "scene", name: "Orbit Brunch",    price: 3000, desc: "Zero-gravity breakfast on a space station counter." },
    // hash brown flavours
    { id: "classic", cat: "flavor", name: "Classic Golden", price: 0,    desc: "Salted, shredded, perfect." },
    { id: "cheesy",  cat: "flavor", name: "Cheese Melt",    price: 300,  desc: "A cap of melted cheese with drips." },
    { id: "seaweed", cat: "flavor", name: "Seaweed Salt",   price: 800,  desc: "Nori flakes and sea-salt crystals." },
    { id: "ube",     cat: "flavor", name: "Ube Sweet Potato", price: 800, desc: "Purple, sweet and a little extra." },
    { id: "cajun",   cat: "flavor", name: "Cajun Fire",     price: 1500, desc: "Paprika red with chili flecks." },
    { id: "truffle", cat: "flavor", name: "Black Truffle",  price: 3000, desc: "Fancy flecks. Sparkles when caught." },
    // sauces (dip cup on the basket + drizzle on the pile)
    { id: "ketchup", cat: "sauce", name: "Ketchup",         price: 0,    color: "#E63B2E", desc: "The classic red." },
    { id: "mayo",    cat: "sauce", name: "Mayo",            price: 300,  color: "#FFF3C4", desc: "Creamy and pale." },
    { id: "bbq",     cat: "sauce", name: "Smoky BBQ",       price: 300,  color: "#6B2A12", desc: "Dark, sticky, smoky." },
    { id: "mustard", cat: "sauce", name: "Honey Mustard",   price: 800,  color: "#F2B705", desc: "Sweet and sharp." },
    { id: "chili",   cat: "sauce", name: "Sweet Chili",     price: 800,  color: "#FF6A3D", desc: "Glossy orange with flakes." },
    // mash ghosts
    { id: "white",    cat: "ghost", name: "Classic Ghost",  price: 0,    color: "#FFFFFF", desc: "Plain, polite, a little sad." },
    { id: "mint",     cat: "ghost", name: "Mint Ghost",     price: 300,  color: "#A8F0D0", desc: "Cool as toothpaste." },
    { id: "peach",    cat: "ghost", name: "Peach Ghost",    price: 300,  color: "#FFB8C8", desc: "Blushing on the way up." },
    { id: "lavender", cat: "ghost", name: "Lavender Ghost", price: 800,  color: "#C9B6FF", desc: "Smells faintly of soap." },
    { id: "midnight", cat: "ghost", name: "Midnight Ghost", price: 800,  color: "#2A2F5A", desc: "Dark body, glowing yellow eyes." },
    { id: "custom",   cat: "ghost", name: "Paint-Your-Own", price: 1500, color: "#7CC8FF", desc: "Pick any colour you like." },
    { id: "rainbow",  cat: "ghost", name: "Rainbow Ghosts", price: 3000, color: "#FF6AD5", desc: "Every ghost gets a different colour." },
    // bombs
    { id: "hotsauce", cat: "bomb", name: "Hot Sauce Bomb",  price: 0,    desc: "The original angry sauce." },
    { id: "cherry",   cat: "bomb", name: "Cherry Bomb",     price: 300,  desc: "Old-school black bomb, red eyes." },
    { id: "chilibomb", cat: "bomb", name: "Ghost Pepper",   price: 800,  desc: "A grumpy chili with a fuse." },
    { id: "wasabi",   cat: "bomb", name: "Wasabi Blob",     price: 1500, desc: "Green, wobbly, clears your sinuses." }
  ];
  var DEFAULTS = { scene: "crunch", flavor: "classic", sauce: "ketchup", ghost: "white", bomb: "hotsauce" };

  var DOGS = [
    { id: "couch",  name: "Couch Potato Dog",   rarity: "COMMON",    weight: 38, line: "Couldn't be bothered to fall faster." },
    { id: "boss",   name: "Boss Spud",          rarity: "UNCOMMON",  weight: 20, line: "Doesn't do meetings. Does do sunglasses." },
    { id: "waiter", name: "Night-Shift Waiter", rarity: "UNCOMMON",  weight: 20, line: "Your order is ready. Eventually." },
    { id: "devil",  name: "Lil' Deviled Spud",  rarity: "RARE",      weight: 15, line: "Deviled, like the eggs. Worse, like the attitude." },
    { id: "golden", name: "Golden Russet King", rarity: "LEGENDARY", weight: 7,  line: "The crown is real. Probably." }
  ];

  var KEY = "hbc_wallet_v1";
  var listeners = [];

  function fresh() {
    var owned = {};
    CATALOG.forEach(function (it) { if (it.price === 0) owned[it.id] = true; });
    return { coins: 0, earned: 0, owned: owned, equip: Object.assign({}, DEFAULTS), customGhost: "#7CC8FF", dogs: {} };
  }
  function load() {
    var w = fresh();
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw) {
        w.coins = raw.coins | 0; w.earned = raw.earned | 0;
        w.owned = Object.assign(w.owned, raw.owned || {});
        w.equip = Object.assign(w.equip, raw.equip || {});
        w.customGhost = raw.customGhost || w.customGhost;
        w.dogs = raw.dogs || {};
      }
    } catch (e) { /* storage blocked: play with a fresh wallet */ }
    return w;
  }
  var wallet = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(wallet)); } catch (e) {}
    listeners.forEach(function (fn) { try { fn(wallet); } catch (e) { console.error(e); } });
  }

  function item(id) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i]; return null; }

  root.HBShop = {
    CATALOG: CATALOG, DOGS: DOGS, DEFAULTS: DEFAULTS,
    wallet: function () { return wallet; },
    item: item,
    equipped: function (cat) { return item(wallet.equip[cat]) || item(DEFAULTS[cat]); },
    owns: function (id) { return !!wallet.owned[id]; },
    addCoins: function (n) { n = Math.max(0, n | 0); wallet.coins += n; wallet.earned += n; save(); return wallet.coins; },
    buy: function (id) {
      var it = item(id);
      if (!it || wallet.owned[id] || wallet.coins < it.price) return false;
      wallet.coins -= it.price; wallet.owned[id] = true; wallet.equip[it.cat] = id; save(); return true;
    },
    equip: function (id) {
      var it = item(id);
      if (!it || !wallet.owned[id]) return false;
      wallet.equip[it.cat] = id; save(); return true;
    },
    setCustomGhost: function (hex) { wallet.customGhost = hex; save(); },
    recordDog: function (v) { wallet.dogs[v] = (wallet.dogs[v] || 0) + 1; save(); },
    pickDog: function (rnd) {
      var total = DOGS.reduce(function (a, d) { return a + d.weight; }, 0), r = rnd * total;
      for (var i = 0; i < DOGS.length; i++) { r -= DOGS[i].weight; if (r <= 0) return DOGS[i].id; }
      return DOGS[0].id;
    },
    onChange: function (fn) { listeners.push(fn); },
    _reset: function () { wallet = fresh(); save(); }
  };
})(window);
