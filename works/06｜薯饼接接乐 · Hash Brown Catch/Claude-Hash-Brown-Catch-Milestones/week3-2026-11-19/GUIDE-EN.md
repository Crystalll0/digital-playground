# Week 3 · 19 Nov | Tutor review: UX test and feedback

**Iteration:** Week 11 | 19 Nov · **Delivery date:** Nov 19, 2026 · **Board:** https://github.com/orgs/sd5913/projects/6

## What the tutor asks for, and how we meet it

| Requirement | What we show | Where |
|---|---|---|
| UX test and feedback | Changes driven by week 2 feedback: permanent coins and the Counter Shop, the Evil Potato Dog easter egg with a Dog-Dex, caught hash browns stacking up, mash staying on the counter and ghosts floating to the ceiling. | `preview-builds/week3-2026-11-19/` → `start.command` |
| Bring a usable increment | The build above runs on a laptop and a phone | `preview.png` in this folder shows the expected screen |
| Relevant test / playtest evidence | `docs/playtest/plan.md`, filled forms, `docs/playtest/results.md` (3+ people outside the team), changelog feedback → change table. | repository `docs/` |
| Main blocker or question | Does the sd5913 organisation allow GitHub Pages? If not, which host should we use? | `docs/progress/2026-11-19-week3.md` |
| Record tutor feedback and next goal with owners | Filled in right after the meeting | `docs/progress/2026-11-19-week3.md` and the board card |
| Iteration since last week | See below; same text goes into `docs/changelog.md` | `docs/changelog.md` |

## What changed since last week

- 'No reason to replay' → round score is banked as permanent coins; Counter Shop with scenes, flavours, sauces, ghost colours and bombs.
- 'Evil potato dog' idea (MA Qianran) → rare mid-air transformation, ×2 points, 5 collectible variants, Dog-Dex.
- 'Misses vanish too fast' → mash piles up on the counter, ghosts stay at the ceiling, catches stack in the basket.
- UX test run with people outside the team; findings opened as week 4 cards.

## Files to upload this week

Only new or changed files are in `upload/`. Put them in the repository at the same paths; leave older files as they are. Full list: `UPLOAD-LIST-EN.txt`.

| File(s) | Committed by | What changed |
|---|---|---|
| `js/shop.js (new)` | CHEN Yueru | coin wallet, shop catalogue, Dog-Dex storage |
| `js/sketch.js` | CHEN Yueru | stacking, persistent mash, ghosts, dog transformation, loadout, new scenes |
| `js/sprites.js` | MA Qianran | 5 potato dogs, flavours, ghost colours, bomb styles |
| `index.html, js/ui.js` | LI Jiarui | shop, Dog-Dex, coin display, results payout |
| `assets/sfx/dog, poof, buy, equip; tools/make_sfx.py` | LI Jiarui | new sounds and their generator code |
| `README.md, docs/changelog.md, docs/playtest/*, docs/progress/2026-11-19-week3.md` | LI Jiarui | feedback → change table, UX test kit and results |

## Suggested commits (each person from their own GitHub account)

1. **CHEN Yueru** — `feat: permanent coin wallet (score banked after each round)`
2. **MA Qianran** — `feat(art): flavours, ghost colours and bomb styles`
3. **LI Jiarui** — `feat(ui): Counter Shop with tabs, buy/equip and custom ghost colour`
4. **CHEN Yueru** — `feat: caught hash browns stack up; mash stays; ghosts float to the ceiling`
5. **MA Qianran** — `feat(art): Evil Potato Dog, 5 variants`
6. **CHEN Yueru** — `feat: rare dog transformation, x2 score, escape animation`
7. **LI Jiarui** — `feat(ui): Dog-Dex collection page`
8. **MA Qianran** — `feat: Midnight Diner, Sunday Picnic and Orbit Brunch scenes`
9. **LI Jiarui** — `docs: UX test plan and form; changelog`
10. **LI Jiarui** — `docs: UX test results`
11. **CHEN Yueru / MA Qianran / LI Jiarui** — `open one card per UX finding in your own area`

Open a pull request for each feature; another member reviews it before merging.

## Demo for the tutor (2–3 minutes)

1. Open `docs/changelog.md`: three pieces of feedback → three changes (this is the iteration evidence).
2. Play one round: stacking, mash staying, ghosts rising; a potato dog may appear.
3. Results screen banks coins → buy a scene in the shop → start a new round in that scene.
4. Show `docs/playtest/results.md` and the new week 4 cards created from it.

You can say:

> "After week 2 our own testing showed people had no reason to play again, so we added permanent coins and a shop. Qianran suggested an evil potato dog as a rare surprise, so we built that too. Then we tested with people outside the team. Here's what they told us, and here are the cards for what we'll change next."

## Bring
- The running build (live link or `preview-builds/week3-2026-11-19/`)
- The evidence listed above
- Your question: Does the sd5913 organisation allow GitHub Pages? If not, which host should we use?

## After the meeting
Fill in tutor feedback, blockers and next goals with owners in `docs/progress/2026-11-19-week3.md`, update the board card "19 Nov | Tutor review: UX test and feedback", and commit.
