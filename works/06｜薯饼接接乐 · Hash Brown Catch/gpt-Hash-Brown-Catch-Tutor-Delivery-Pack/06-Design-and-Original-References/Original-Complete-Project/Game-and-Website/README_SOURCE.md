# Hash Brown Catch — Crunch Club

A cozy pixel browser game designed for Crystal Chen. A red-and-cream American breakfast diner, golden oblong hash browns, tiny faces, and very dramatic mashed potatoes.

## Run locally

Python 3 is enough; Node and package installation are not required.

```sh
python3 -m http.server 8000 
```

Open http://localhost:8000 in a browser. In the downloadable source bundle, `index.html` is at the top level, so run `python3 -m http.server 8000` instead. Use a local server rather than opening the HTML file directly, because the p5 background image loader needs HTTP. All runtime files are included; the game makes no third-party runtime requests and does not require an API key.

## Controls

- Mouse: move over the playfield or click and drag.
- Touch: drag anywhere on the playfield.
- Keyboard: Left / Right arrows or A / D. Space pauses and resumes. The pause button works with keyboard or touch too.
- Click the music note for sound on/off. Audio begins after a user gesture.
- Leaving the tab or opening help during a round automatically pauses the game.

## Rules

Golden catch: +10. The latest three golden catches stay in the basket; earlier catches collect on a background serving plate. The plate shows up to 24 distinct bites and a counter for the full plated total. All collected bites are represented for the rest of the round; hazards never enter the collection. A new round clears both basket and plate. Golden miss: −2 and a sad mash/ghost animation. Burnt catch: −10. Chili bomb catch: −20 and a brief basket shake. Avoiding hazards costs nothing. The score never goes below zero. Catch streaks are visual only and do not multiply the score.

The default is Medium, 60 seconds. Every difficulty gradually ramps in speed and drop rate. The settings lock during a round. Best scores are stored locally by difficulty; Custom best scores also match the chosen recipe. No account, backend or global leaderboard is used.

| Difficulty | Initial speed | Initial drops/sec | Hazard chance | Bomb share of hazards |
| --- | --- | --- | --- | --- |
| Easy | 1.55× | 0.8 | 7% | 0% |
| Medium | 2.4× | 1.3 | 15% | 30% |
| Hard | 3.25× | 1.9 | 23% | 40% |
| Hell | 4.4× | 2.6 | 32% | 50% |
| Custom | 0.7–6× | 0.5–4 | 0–45% | 40% |

Custom durations: 30, 60, 90 or 120 seconds. The speed multiplier corresponds to 56 design pixels/second on a 600-pixel-high stage, with a small variation per drop. Tall phone stages scale item sizes and fall speeds to keep the timing similar.

## Coursework map

- **Week 4 — input:** `game.js`, pointer handlers, keyboard set and basket movement in `advance()`.
- **Week 5 — image and frame animation:** four original `makePotato()` frames, catch highlights, `makeMash()` and drifting `makeGhost()` frames. The p5 draw loop selects sprite frames over time.
- **Week 6 — sound:** `initAudio()`, `tone()`, `noise()` and `sound()`. Original Web Audio effects provide crunch, squish, danger, start and finish feedback. No licensed sound-effect pack is needed.
- **Collision:** `game-core.js` uses a swept crossing of the basket rim and horizontal rectangle overlap so a fast drop is still detected.

The implementation uses p5.js 1.11.11 with plain JavaScript and Web Audio; p5.play is not required. p5 is bundled locally. `game-core.js` contains rules that can be read independently from drawing code.

## Files

- `index.html`: accessible English UI, start/pause/results and instructions.
- `style.css`: diner theme, responsive layout and local font.
- `game.js`: p5 sketch, procedural original pixel sprites, input and sounds.
- `game-core.js`: presets, scoring, countdown, collision and best-score keys.
- `assets/diner.png`: generated diner background, without logos or text.
- `assets/p5.min.js`: p5.js 1.11.11 (LGPL-2.1; see its license file).
- `assets/pixel.ttf`: Press Start 2P by CodeMan38 (SIL OFL-1.1; see its license file).
- `check-rules.cjs`: run `node check-rules.cjs` in this repository to check scoring, hazards, collision and difficulty behavior.

## Process / AI disclosure

The game concept and visual direction were supplied and refined by Crystal Chen. ChatGPT assisted with implementation, pixel-sprite drawing code, sound synthesis and QA. The diner backdrop was generated with OpenAI image generation. The visual brief combines a red-and-white retro American diner with a golden, elongated hash-brown mascot. No restaurant logos or branded packaging are used. This note records the production process for coursework; it is not part of the player's flow.


## Treat Shop, permanent coins and bonus drops (v2)

The run score is separate from the permanent wallet. Each normal hash brown gives **10 score and 2 coins**. Coins are saved immediately after each catch, so a reload or early exit does not lose coins already earned. Misses and hazards reduce only the run score. Purchases use earned game coins, debit once, and automatically equip the unlocked cosmetic; owned items can be re-equipped for free.

The wallet, owned cosmetics, chosen scene, flavour, bomb and ghost color are stored together under `crunch-club-profile-v2` in browser localStorage. Saves are specific to this browser and site origin; they are not an account-synced cloud save. If browser storage is unavailable, the shop reports session-only progress. Existing per-difficulty best-score records are kept.

- **Scenes:** Classic (free), Strawberry Social (120), Midnight Munchies (240).
- **Flavours:** Original (free), Ketchup (60), Sour Cream (60), Maple (120).
- **Ghosts:** Vanilla (free), Mint (60), Lavender (120), Your Own Boo custom color picker (240).
- **Bombs:** Chili (free), Pepper Pop (60), Tomato Tantrum (120).
- All purchased items are cosmetic; they do not alter scoring, collision or drop odds.

**Spud Imp** is an original mischievous potato-dog bonus character with floppy toasted ears, a little fang, and three randomized outfits (bandit mask, chili horns, space visor). The brief draws on the idea of a cheeky potato pup; the supplied character's costumes, tie, bag and silhouette were not reproduced. At the start of a round, there is a **12% chance** of a single planned visit at a random point between 20% and 70% of the original duration. Catching the pup doubles all coins earned in this round, including earlier catches and future catches, once only. It never doubles the existing wallet or the score. Missing it is harmless.

Other bonus drops have a combined 4.5% chance per drop, split evenly:

- **Clock:** +5 seconds, capped at +15 seconds per round.
- **Coffee:** half-speed falls for 4 active seconds; a second coffee refreshes rather than stacks the duration. The countdown continues normally.
- **Cola:** a single-use shield blocks the next burnt/bomb penalty and preserves the streak; shields do not stack. It does not protect against missed golden bites.

Pause freezes all timers and powers. Entering the shop during play pauses the round. Missed potatoes remain represented in a compact tabletop pile with a full count; every missed potato releases a ghost that travels off the top of the stage. A new round resets the basket, serving plate, mash pile and active powers, while the permanent wallet and shop unlocks remain.

New source files: `economy.js` (catalog and persistence), `shop.js` (shop interface), `shop.css` (shop styling), and `check-progression.cjs` (wallet, rewards and power-up checks). Run `node check-rules.cjs` and `node check-progression.cjs` from the repository. The two new diner backgrounds were generated with OpenAI image generation. All item, ghost and pup variants are drawn as original code-native pixel sprites.
