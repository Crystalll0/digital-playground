# Stage 04 Tutor Demonstration

Repository: https://github.com/sd5913/Hash-Brown-Catch

Team board: https://github.com/orgs/sd5913/projects/6

Run Launch-Game.py from this folder or follow START_HERE_EN.md. This is a prepared scope build for this review; update changes, tests and tutor comments from actual later activity.

## Stage 04  2026-11-26  Delivery candidate

### Local build scope

Adds clocks (+5 seconds each, capped at +15 per round), coffee (half-speed falls for 4 active seconds; repeat catches refresh duration) and cola (one non-stacking hazard shield). A pup visit is planned in about 12% of rounds, at most once; catching it doubles earlier and later coins from that round only, never the pre-existing wallet or score. Opens the complete cosmetic catalog.

Separate file: Stage-04-2026-11-26-Delivery-Candidate.zip.

### Files to upload or update

- game/: this stage’s source, required assets and check-stage.cjs.
- README.md: complete or merge the relevant stage content.
- docs/game-rules.md: complete or merge the relevant stage content.
- docs/credits.md: complete or merge the relevant stage content.
- docs/progress/2026-11-26.md: complete or merge the relevant stage content.
- docs/tests/release-checklist.md: complete or merge the relevant stage content.
- docs/known-issues.md: complete or merge the relevant stage content.

- docs/evidence/: actual screenshots, short recordings or anonymized test records, linked from the documentation.

### Member tasks

- CHEN Yueru: unify cosmetic and power-up presentation and ensure feedback does not obscure interaction.
- MA Qianran: verify power-up timing, shields and rare-pup edge cases; run applicable rule checks.
- LI Jiarui: verify shop, saving, package and access; ask someone who did not write the instructions to launch the project independently.

### Tutor demonstration

Follow the README from extraction to independent launch. Demonstrate the features retained after testing, persistence and access checks. Rare features may be shown in a clearly labeled demonstration environment; normal play keeps its original odds. Discuss remaining blockers and scope cuts.

### Validation and next actions

Check the +15-second clock cap, 4-second coffee and pause behavior, one-use shield, once-per-round pup doubling only current-round coins, wallet independence, persistence, setup instructions and phone layout. Automated checks do not replace user testing.

After the meeting, record the tutor’s words or an accurate summary and agree what to retain, change or remove, with owners. The next package is a prepared candidate scope and should be adapted to actual feedback, not treated as a requirement to add every feature.

## Actions before and after the review

- Before: check this build runs, add actual test evidence, and put links, owners and one main question in the matching review card on your team Project.
- After: record actual tutor feedback, tradeoffs and owned next actions; leave feedback pending until received.
- Choose upload documents from weekly-upload/EN or CN in this folder and merge earlier real records.
- See the complete guide in 00-Guides-and-Project-Board for fields, seven preset cards and views.
