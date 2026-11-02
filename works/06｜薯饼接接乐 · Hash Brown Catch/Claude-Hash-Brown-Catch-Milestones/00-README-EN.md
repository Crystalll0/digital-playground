# Hash Brown Catch · weekly delivery package

Repository: https://github.com/sd5913/Hash-Brown-Catch · Board: https://github.com/orgs/sd5913/projects/6 · Live (from week 4): https://sd5913.github.io/Hash-Brown-Catch/

The finished game is split into five increments, one per tutor review, so the repository grows week by week and every step can be shown.

## Folders

| Path | Use |
|---|---|
| `weekN-date/upload/` | Files to add to the repository that week (new or changed only; same paths) |
| `weekN-date/GUIDE-EN.md` | Requirement table, what changed, files and owners, commits, demo script, questions |
| `weekN-date/BOARD-CARDS-EN.md` | Cards for the Group Project 2026 board |
| `weekN-date/UPLOAD-LIST-EN.txt` | Every file in `upload/` |
| `weekN-date/preview.png` | What the page looks like at the end of that week |
| `preview-builds/weekN-date/` | The complete repository as it should be after that week: double-click `start.command` (Windows: `start.bat`) to run it. For checking only; don't upload this folder. |
| `final-2026-12-06/` | Submission checklist |

Chinese versions sit next to each file (`指南-中文.md`, `看板卡片-中文.md`, `上传清单-中文.txt`). Everything that goes into the repository is in English.

## Timeline

| Tutor review | Focus | Increment we show | Evidence |
|---|---|---|---|
| Nov 5, 2026 | Tutor review: first working interaction | Prototype: the basket follows mouse / finger, hash browns fall, catch +10 with a crunch, miss −2 and it becomes mash, 60-second timer. | Quick team test checklist in the week 1 progress note; the 'Loading...' bug found when opening the file locally and its fix (changelog). |
| Nov 12, 2026 | Tutor review: integrated core experience | A complete 60-second round: start screen with 5 difficulty levels (incl. custom sliders), hazards to dodge, power-ups, combo, pause, results with best score, all sounds, phone layout. | `docs/test-log.md` with one real test per member (device, result, bug, fix). |
| Nov 19, 2026 | Tutor review: UX test and feedback | Changes driven by week 2 feedback: permanent coins and the Counter Shop, the Evil Potato Dog easter egg with a Dog-Dex, caught hash browns stacking up, mash staying on the counter and ghosts floating to the ceiling. | `docs/playtest/plan.md`, filled forms, `docs/playtest/results.md` (3+ people outside the team), changelog feedback → change table. |
| Nov 26, 2026 | Tutor review: delivery candidate | Anyone can open it from a link: deployed on GitHub Pages, README covers setup / platforms / limitations / credits, character page added, UX test issues fixed. | Fix table in the week 4 progress note (finding → fix → owner), release check in `docs/deploy.md`, `docs/assessment-map.md`. |
| Dec 3, 2026 | Tutor review: final deployment and polish | Final version: 43-second demo reel on the site, presentation mode (test coins) for demos, last fixes from a final check with new players. | Final UX check in the week 5 note, `docs/retrospective.md` (how the plan changed over 5 weeks), v1.0 release. |
| Dec 6, 2026 | Canvas submission | Repository URL | `final-2026-12-06/SUBMISSION-CHECKLIST-EN.md` |

## How iteration shows up in the repository
- `docs/changelog.md` grows every week (newest first), and from week 3 it maps each piece of feedback to the change it caused.
- `docs/progress/` has one note per tutor meeting with tutor feedback and next goals with owners.
- Test evidence: `docs/test-log.md` (week 2), `docs/playtest/` (week 3), fix table (week 4), final check (week 5).
- `docs/assessment-map.md` (week 4) points the assessor to each requirement.

## Roles

| Member | Role | Owns |
|---|---|---|
| CHEN Yueru | Gameplay & integration | `js/sketch.js`, deployment, repository settings |
| MA Qianran | Art & character (IP) | `js/sprites.js`, scenes, concept art, character page, demo reel |
| LI Jiarui | UX, sound & QA | `js/ui.js` and screens, sounds, UX tests, README / credits / progress notes |

## Every week
1. Before the meeting: upload `upload/` with small commits from each member's account; move cards on the board.
2. At the meeting: run the 2–3 minute demo from the guide; ask the prepared question.
3. After: fill in tutor feedback, blockers and next goals in the progress note; comment on the tutor review card; commit.

## Keep it honest
- Tutor feedback, test logs and UX results must be real. The templates leave those fields empty on purpose.
- Credits state that Claude helped write the code and ChatGPT generated the background and concept images. Each owner should be able to explain their files.
- Week 4 needs real fixes from the week 3 UX test. Send the results if you want help with the code.
