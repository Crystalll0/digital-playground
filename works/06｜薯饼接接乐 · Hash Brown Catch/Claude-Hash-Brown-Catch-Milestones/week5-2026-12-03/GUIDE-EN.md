# Week 5 · 03 Dec | Tutor review: final deployment and polish

**Iteration:** Week 13 | 03 Dec · **Delivery date:** Dec 3, 2026 · **Board:** https://github.com/orgs/sd5913/projects/6

## What the tutor asks for, and how we meet it

| Requirement | What we show | Where |
|---|---|---|
| Final deployment and polish | Final version: 43-second demo reel on the site, presentation mode (test coins) for demos, last fixes from a final check with new players. | Live: https://sd5913.github.io/Hash-Brown-Catch/ · local backup: `preview-builds/week5-2026-12-03/` → `start.command` · video: `assets/demo-reel.mp4` |
| Bring a usable increment | The build above runs on a laptop and a phone | `preview.png` in this folder shows the expected screen |
| Relevant test / playtest evidence | Final UX check in the week 5 note, `docs/retrospective.md` (how the plan changed over 5 weeks), v1.0 release. | repository `docs/` |
| Main blocker or question | Anything to tighten before the 6 December submission? | `docs/progress/2026-12-03-week5.md` |
| Record tutor feedback and next goal with owners | Filled in right after the meeting | `docs/progress/2026-12-03-week5.md` and the board card |
| Iteration since last week | See below; same text goes into `docs/changelog.md` | `docs/changelog.md` |

## What changed since last week

- Demo reel page and video (MP4 + GIF).
- Presentation mode: add 1,000 test coins so the shop can be shown live.
- Fixes from the final check with two new players.
- Retrospective and final README; v1.0 release.

## Files to upload this week

Only new or changed files are in `upload/`. Put them in the repository at the same paths; leave older files as they are. Full list: `UPLOAD-LIST-EN.txt`.

| File(s) | Committed by | What changed |
|---|---|---|
| `reel.html, assets/demo-reel.mp4, demo-reel.gif, reel-poster.jpg` | MA Qianran | demo reel |
| `index.html` | MA Qianran, CHEN Yueru | reel section; presentation-mode button |
| `README.md, docs/assessment-map.md, docs/changelog.md` | LI Jiarui | final pass |
| `docs/retrospective.md, docs/progress/2026-12-03-week5.md` | CHEN Yueru, MA Qianran, LI Jiarui | retrospective and week 5 note |

## Suggested commits (each person from their own GitHub account)

1. **MA Qianran** — `media: demo reel page and video`
2. **CHEN Yueru** — `feat: presentation mode with test coins`
3. **owners** — `fix: <final check finding>`
4. **LI Jiarui** — `docs: final README, assessment map and changelog`
5. **CHEN Yueru, MA Qianran, LI Jiarui** — `docs: retrospective`
6. **CHEN Yueru** — `release: v1.0 (GitHub Releases)`

Open a pull request for each feature; another member reviews it before merging.

## Demo for the tutor (2–3 minutes)

1. Play the 43-second demo reel first.
2. Open the live link, add test coins, buy and equip a scene, show the Dog-Dex.
3. Tour the repository: README, board, five progress notes, changelog, UX test results, retrospective.

You can say:

> "Here's our final version. The reel shows the whole experience in 43 seconds. Over five weeks we went from one interaction to a full game, changed direction because of feedback, and tested with people outside the team. Everything is documented in the repository."

## Bring
- The running build (live link or `preview-builds/week5-2026-12-03/`)
- The evidence listed above
- Your question: Anything to tighten before the 6 December submission?

## After the meeting
Fill in tutor feedback, blockers and next goals with owners in `docs/progress/2026-12-03-week5.md`, update the board card "03 Dec | Tutor review: final deployment and polish", and commit.
