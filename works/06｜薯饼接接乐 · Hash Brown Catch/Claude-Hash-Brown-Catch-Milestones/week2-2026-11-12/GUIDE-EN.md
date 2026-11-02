# Week 2 · 12 Nov | Tutor review: integrated core experience

**Iteration:** Week 10 | 12 Nov · **Delivery date:** Nov 12, 2026 · **Board:** https://github.com/orgs/sd5913/projects/6

## What the tutor asks for, and how we meet it

| Requirement | What we show | Where |
|---|---|---|
| Integrated core experience | A complete 60-second round: start screen with 5 difficulty levels (incl. custom sliders), hazards to dodge, power-ups, combo, pause, results with best score, all sounds, phone layout. | `preview-builds/week2-2026-11-12/` → `start.command` |
| Bring a usable increment | The build above runs on a laptop and a phone | `preview.png` in this folder shows the expected screen |
| Relevant test / playtest evidence | `docs/test-log.md` with one real test per member (device, result, bug, fix). | repository `docs/` |
| Main blocker or question | Who should we invite to the UX test next week, and what should we measure? | `docs/progress/2026-11-12-week2.md` |
| Record tutor feedback and next goal with owners | Filled in right after the meeting | `docs/progress/2026-11-12-week2.md` and the board card |
| Iteration since last week | See below; same text goes into `docs/changelog.md` | `docs/changelog.md` |

## What changed since last week

- Prototype became a full game loop with screens (start / ready / pause / results).
- Added difficulty levels Easy–Hell and Custom; hazards (burnt hash brown, hot sauce bomb), golden hash brown, coffee and clock power-ups, combo bonus.
- Responsive canvas and stacked HUD for phones; sound set and a script to regenerate it.
- Internal test notes raised: no reason to replay; misses vanish too fast; idea of an 'evil potato dog'. These become week 3 cards.

## Files to upload this week

Only new or changed files are in `upload/`. Put them in the repository at the same paths; leave older files as they are. Full list: `UPLOAD-LIST-EN.txt`.

| File(s) | Committed by | What changed |
|---|---|---|
| `js/sketch.js` | CHEN Yueru | game states, difficulty, hazards, power-ups, combo, responsive canvas |
| `js/sprites.js` | MA Qianran | burnt, bomb, golden, coffee, clock, more expressions |
| `index.html, js/ui.js, css/style.css` | LI Jiarui | start / pause / results screens, difficulty picker, menu board, level table |
| `assets/sfx/* (9 new), assets/fonts/, tools/` | LI Jiarui | full sound set and generator scripts, pixel font |
| `README.md, docs/test-log.md, docs/changelog.md, docs/progress/2026-11-12-week2.md` | LI Jiarui | rules, platforms, limitations, tests, changelog |

## Suggested commits (each person from their own GitHub account)

1. **CHEN Yueru** — `refactor: game state machine (ready/play/pause/over)`
2. **MA Qianran** — `feat(art): burnt hash brown, hot sauce bomb, golden, coffee and clock sprites`
3. **CHEN Yueru** — `feat: hazards, golden bonus, power-ups and combo scoring`
4. **CHEN Yueru** — `feat: Easy/Normal/Hard/Hell and custom difficulty`
5. **LI Jiarui** — `feat(ui): start screen with difficulty picker and custom sliders`
6. **LI Jiarui** — `feat(ui): pause and results screens with best score`
7. **LI Jiarui** — `feat(sound): full sound set + tools/make_sfx.py`
8. **CHEN Yueru** — `fix: responsive canvas and stacked HUD on phones`
9. **LI Jiarui** — `docs: README rules, platforms, limitations; test log; changelog; week 2 note`

Open a pull request for each feature; another member reviews it before merging.

## Demo for the tutor (2–3 minutes)

1. Start screen: switch difficulty, open Custom and move the sliders.
2. Play 30 s on Normal: catch, miss, dodge a burnt one, grab coffee for slow-mo.
3. Press P to pause, then let the round end to show the results screen and best score.
4. Phone: portrait layout and touch control.
5. Show `docs/test-log.md` and the changelog entry: what changed since week 1.

You can say:

> "Last week it was one interaction. Now it's a full round: start screen, five difficulty levels including custom, hazards to dodge, power-ups, pause and a results screen, and it works on phones. Our own testing showed players had no reason to play again, so that's what we'll tackle next, and we want to test with people outside the team."

## Bring
- The running build (live link or `preview-builds/week2-2026-11-12/`)
- The evidence listed above
- Your question: Who should we invite to the UX test next week, and what should we measure?

## After the meeting
Fill in tutor feedback, blockers and next goals with owners in `docs/progress/2026-11-12-week2.md`, update the board card "12 Nov | Tutor review: integrated core experience", and commit.
