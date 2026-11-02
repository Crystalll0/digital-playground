# Hash Brown Catch Stage 02 Complete round

A short-session pixel browser game for casual players. Players move a basket to catch hash browns, receiving scoring, animated and audio feedback.

## Current scope

Adds a complete default 60-second round, burnt bites (−10), bombs (−20), Easy / Medium / Hard / Hell / Custom, gradual acceleration and local best scores by difficulty. Custom rounds offer 30 / 60 / 90 / 120 seconds. No permanent coins, shop, power-ups or rare pup.

## Setup and controls

Use a modern desktop or phone browser. Local hosting requires Python 3. With source in game/, run python3 -m http.server 8000 from the repository root and open http://localhost:8000/game/ . Windows can use py -3 -m http.server 8000. In the extracted local package, run Launch-Game.py instead. Mouse, touch, arrows or A/D move the basket; Space/P pauses. Audio starts after user interaction. No API key or other secret configuration is needed.

## Suggested ownership Subject to actual confirmation

- CHEN Yueru: refine hazard recognition, difficulty instructions and results UI; check that displayed rules match behavior.
- MA Qianran: verify difficulty, hazards, timing, pause and fast collision; fix observed problems.
- LI Jiarui: test complete rounds, replay, local records and phone interaction; document actual results.

## Project and evidence links

- Repository: https://github.com/sd5913/Hash-Brown-Catch
- Board: https://github.com/orgs/sd5913/projects/6
- Playable result / download: [INSERT accessible URL; use local package until published]
- Weekly progress: docs/progress/2026-11-12.md
- Test records: docs/tests/
- Credits and AI: docs/credits.md

## Platforms and limitations

Local saves do not sync across devices, browsers, ports or stages. If browser storage is blocked, progress may be session-only. There is no account system, cloud save or global leaderboard. Launchers require Python 3; phones need an accessible HTTP host. No hosted URL is assumed accessible to the tutor. Actual compatibility, playtests and tutor comments remain to be documented.

## Checks

Node.js is optional and used only for checks: enter game/ and run node check-stage.cjs. Generation-time checks appear in docs/BUILD_CHECKS.txt. The team must additionally record its own tests.
