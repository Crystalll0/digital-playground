# Week 1 · 05 Nov | Tutor review: first working interaction

**Iteration:** Week 9 | 05 Nov · **Delivery date:** Nov 5, 2026 · **Board:** https://github.com/orgs/sd5913/projects/6

## What the tutor asks for, and how we meet it

| Requirement | What we show | Where |
|---|---|---|
| First working interaction | Prototype: the basket follows mouse / finger, hash browns fall, catch +10 with a crunch, miss −2 and it becomes mash, 60-second timer. | `preview-builds/week1-2026-11-05/` → double-click `start.command` (Windows: `start.bat`) |
| Bring a usable increment | The build above runs on a laptop and a phone | `preview.png` in this folder shows the expected screen |
| Relevant test / playtest evidence | Quick team test checklist in the week 1 progress note; the 'Loading...' bug found when opening the file locally and its fix (changelog). | repository `docs/` |
| Main blocker or question | Is this scope right for a 3-person team, and can we host on GitHub Pages under sd5913? | `docs/progress/2026-11-05-week1.md` |
| Record tutor feedback and next goal with owners | Filled in right after the meeting | `docs/progress/2026-11-05-week1.md` and the board card |
| Iteration since last week | See below; same text goes into `docs/changelog.md` | `docs/changelog.md` |

## What changed since last week

- First version of the game: basket, falling hash browns, catch / miss, score, timer, three sounds.
- Fixed during our own test: page stuck on 'Loading...' when `index.html` was double-clicked; sound now loads only when served, and a note explains it.
- Added `start.command` / `start.bat` so anyone can run it with sound.

## Files to upload this week

Only new or changed files are in `upload/`. Put them in the repository at the same paths; leave older files as they are. Full list: `UPLOAD-LIST-EN.txt`.

| File(s) | Committed by | What changed |
|---|---|---|
| `README.md, docs/proposal.md, docs/team.md, docs/changelog.md` | LI Jiarui | first README, proposal, roles, changelog |
| `docs/progress/2026-11-05-week1.md` | LI Jiarui | week 1 note (add tutor feedback after the meeting) |
| `index.html, js/sketch.js, start.command, start.bat` | CHEN Yueru | prototype page, game loop, launch scripts |
| `js/sprites.js, assets/diner-bg.jpg` | MA Qianran | pixel sprites, diner background |
| `assets/sfx/crunch.wav, squelch.wav, ding.wav` | LI Jiarui | first three sounds |

## Suggested commits (each person from their own GitHub account)

1. **LI Jiarui** — `docs: add README, proposal and team roles`
2. **CHEN Yueru** — `feat: p5 canvas and basket that follows mouse/touch`
3. **MA Qianran** — `feat: pixel sprite generator for Crispy, mash and ghost`
4. **MA Qianran** — `assets: add diner background (ChatGPT-generated, see credits)`
5. **CHEN Yueru** — `feat: falling hash browns with catch/miss collision and score`
6. **LI Jiarui** — `assets: add crunch, squelch and start sounds`
7. **CHEN Yueru** — `feat: 60-second timer and click to restart`
8. **CHEN Yueru** — `fix: load p5.sound only over http(s) so local files don't hang on Loading`
9. **LI Jiarui** — `docs: week 1 progress note and changelog`

Open a pull request for each feature; another member reviews it before merging.

## Demo for the tutor (2–3 minutes)

1. Double-click `start.command`, click the canvas, move the basket: one catch (crunch, +10) and one miss (mash, −2).
2. Open the same address on a phone on the same Wi-Fi (or show the phone screenshot) to show touch control.
3. Show `docs/proposal.md`: audience, interaction table, MVP vs stretch scope. Ask the scope question.
4. Show the board: first goal / Definition of Done card done, week 2 cards assigned.

You can say:

> "This is our first working interaction. The basket follows the mouse or your finger. Catch a hash brown and you get points and a crunch; miss one and it turns into mashed potato. Next week we'll build the full game loop: start and results screens, difficulty levels, hazards and power-ups. Is this scope right for our team?"

## Bring
- The running build (live link or `preview-builds/week1-2026-11-05/`)
- The evidence listed above
- Your question: Is this scope right for a 3-person team, and can we host on GitHub Pages under sd5913?

## After the meeting
Fill in tutor feedback, blockers and next goals with owners in `docs/progress/2026-11-05-week1.md`, update the board card "05 Nov | Tutor review: first working interaction", and commit.
