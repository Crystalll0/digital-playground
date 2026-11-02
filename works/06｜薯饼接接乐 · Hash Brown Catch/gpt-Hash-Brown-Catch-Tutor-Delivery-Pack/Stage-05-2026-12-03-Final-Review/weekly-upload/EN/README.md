# Hash Brown Catch Stage 05 Final review build

A short-session pixel browser game for casual players. Players move a basket to catch hash browns, receiving scoring, animated and audio feedback.

## Current scope

Retains Stage 04 and adds a concise visible rules and score/coin guide, a separate Delivery Guide, and R-to-replay with a visible results-screen hint. This is a prepared final-review build, subject to future testing and tutor feedback, rather than a claim of final acceptance.

## Setup and controls

Use a modern desktop or phone browser. Local hosting requires Python 3. With source in game/, run python3 -m http.server 8000 from the repository root and open http://localhost:8000/game/ . Windows can use py -3 -m http.server 8000. In the extracted local package, run Launch-Game.py instead. Mouse, touch, arrows or A/D move the basket; Space/P pauses. Audio starts after user interaction. No API key or other secret configuration is needed.

## Suggested ownership Subject to actual confirmation

- CHEN Yueru: check visual consistency, prepare the video and presentation, and ensure the reel matches the final game.
- MA Qianran: finish fixes, run rule regression checks and prepare a core-code explanation.
- LI Jiarui: verify the README, packages, board and permissions; compile evidence of all three members’ actual contributions.

## Project and evidence links

- Repository: https://github.com/sd5913/Hash-Brown-Catch
- Board: https://github.com/orgs/sd5913/projects/6
- Playable result / download: [INSERT accessible URL; use local package until published]
- Weekly progress: docs/progress/2026-12-03.md
- Test records: docs/tests/
- Credits and AI: docs/credits.md

## Platforms and limitations

Local saves do not sync across devices, browsers, ports or stages. If browser storage is blocked, progress may be session-only. There is no account system, cloud save or global leaderboard. Launchers require Python 3; phones need an accessible HTTP host. No hosted URL is assumed accessible to the tutor. Actual compatibility, playtests and tutor comments remain to be documented.

## Checks

Node.js is optional and used only for checks: enter game/ and run node check-stage.cjs. Generation-time checks appear in docs/BUILD_CHECKS.txt. The team must additionally record its own tests.
