# Week 4 · 26 Nov | Tutor review: delivery candidate

**Iteration:** Week 12 | 26 Nov · **Delivery date:** Nov 26, 2026 · **Board:** https://github.com/orgs/sd5913/projects/6

## What the tutor asks for, and how we meet it

| Requirement | What we show | Where |
|---|---|---|
| Delivery candidate: build, deployment or installation setup | Anyone can open it from a link: deployed on GitHub Pages, README covers setup / platforms / limitations / credits, character page added, UX test issues fixed. | Live: https://sd5913.github.io/Hash-Brown-Catch/ (after enabling Pages) · local backup: `preview-builds/week4-2026-11-26/` → `start.command` |
| Bring a usable increment | The build above runs on a laptop and a phone | `preview.png` in this folder shows the expected screen |
| Relevant test / playtest evidence | Fix table in the week 4 progress note (finding → fix → owner), release check in `docs/deploy.md`, `docs/assessment-map.md`. | repository `docs/` |
| Main blocker or question | Is anything missing from the README or repository before final assessment? | `docs/progress/2026-11-26-week4.md` |
| Record tutor feedback and next goal with owners | Filled in right after the meeting | `docs/progress/2026-11-26-week4.md` and the board card |
| Iteration since last week | See below; same text goes into `docs/changelog.md` | `docs/changelog.md` |

## What changed since last week

- Deployed to GitHub Pages; live link at the top of the README.
- Fixed the UX test findings (each fix is its own commit and listed in the progress note).
- Character page 'Meet Crispy': bio, moods, expressions, palette, UI icons.
- README completed: prerequisites, run options, platforms, limitations, credits and AI use; added an assessment map.

## Files to upload this week

Only new or changed files are in `upload/`. Put them in the repository at the same paths; leave older files as they are. Full list: `UPLOAD-LIST-EN.txt`.

| File(s) | Committed by | What changed |
|---|---|---|
| `index.html` | MA Qianran | Meet Crispy character page |
| `README.md, docs/assessment-map.md` | LI Jiarui | live link, run options, credits, AI use, requirement map |
| `docs/deploy.md, docs/progress/2026-11-26-week4.md, docs/changelog.md` | CHEN Yueru, LI Jiarui | deployment steps, release check, fixes |
| `docs/media/gameplay.png` | LI Jiarui | README screenshot |
| `(your UX fixes)` | owners | real fixes from week 3 results |

## Suggested commits (each person from their own GitHub account)

1. **owners** — `fix: <UX finding> (one commit per finding)`
2. **MA Qianran** — `feat: Meet Crispy character page`
3. **CHEN Yueru** — `chore: enable GitHub Pages deployment`
4. **LI Jiarui** — `docs: README run options, platforms, limitations`
5. **LI Jiarui** — `docs: credits, AI-use statement and assessment map`
6. **LI Jiarui** — `docs: week 4 progress note and changelog`

Open a pull request for each feature; another member reviews it before merging.

## Demo for the tutor (2–3 minutes)

1. Let the tutor open the live link on their own phone.
2. Show the fix table: UX finding → fix → owner, with commit links.
3. Walk through the README: run options, platforms, limitations, credits and AI use; then `docs/assessment-map.md`.
4. Show the Meet Crispy page.

You can say:

> "This is our delivery candidate. It's live on GitHub Pages, so you can open it on your phone right now. We fixed the issues from last week's UX test, and the README now covers setup, platforms, limitations and credits, including how we used AI."

## Bring
- The running build (live link or `preview-builds/week4-2026-11-26/`)
- The evidence listed above
- Your question: Is anything missing from the README or repository before final assessment?

## After the meeting
Fill in tutor feedback, blockers and next goals with owners in `docs/progress/2026-11-26-week4.md`, update the board card "26 Nov | Tutor review: delivery candidate", and commit.
