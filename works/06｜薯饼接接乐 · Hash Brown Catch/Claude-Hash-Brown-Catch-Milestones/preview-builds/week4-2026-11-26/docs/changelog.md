# Changelog

Newest first. Each entry links back to that week's progress note.

## Week 4 · 26 Nov · delivery candidate

- Deployed to GitHub Pages; live link at the top of the README.
- Fixed the UX test findings (each fix is its own commit and listed in the progress note).
- Character page 'Meet Crispy': bio, moods, expressions, palette, UI icons.
- README completed: prerequisites, run options, platforms, limitations, credits and AI use; added an assessment map.

| UX finding | Fix | Owner | Commit |
|---|---|---|---|
| (fill in) | | | |

Progress note: [2026-11-26-week4.md](progress/2026-11-26-week4.md)

## Week 3 · 19 Nov · UX test and feedback

| Feedback | Source | Change | Owner |
|---|---|---|---|
| "Coins only count inside one round, so there's no reason to play again." | Internal test (CHEN Yueru) | Score is banked as permanent coins; new Counter Shop | CHEN (wallet), LI (shop UI), MA (items) |
| "Some hash browns could turn into an evil potato dog." | Team idea (MA Qianran) | Rare mid-air transformation, ×2 points, 5 variants, Dog-Dex | MA (design), CHEN (logic), LI (Dog-Dex) |
| "Misses vanish too fast; you can't see how you did." | Internal test | Mash piles up on the counter, ghosts stay at the ceiling, catches stack in the basket | CHEN |

Also fixed: shop scene thumbnails failed when the page was opened as a local file (now shows the scene name).
UX test with people outside the team: see [playtest results](playtest/results.md); findings became week 4 cards.

Progress note: [2026-11-19-week3.md](progress/2026-11-19-week3.md)

## Week 2 · 12 Nov · integrated core experience

- Prototype became a full game loop with screens (start / ready / pause / results).
- Added difficulty levels Easy–Hell and Custom; hazards (burnt hash brown, hot sauce bomb), golden hash brown, coffee and clock power-ups, combo bonus.
- Responsive canvas and stacked HUD for phones; sound set and a script to regenerate it.
- Internal test notes raised: no reason to replay; misses vanish too fast; idea of an 'evil potato dog'. These become week 3 cards.

Bugs found in testing this week: see [test log](test-log.md).

Progress note: [2026-11-12-week2.md](progress/2026-11-12-week2.md)

## Week 1 · 5 Nov · first working interaction

- First version of the game: basket, falling hash browns, catch / miss, score, timer, three sounds.
- Fixed during our own test: page stuck on 'Loading...' when `index.html` was double-clicked; sound now loads only when served, and a note explains it.
- Added `start.command` / `start.bat` so anyone can run it with sound.

Progress note: [2026-11-05-week1.md](progress/2026-11-05-week1.md)
