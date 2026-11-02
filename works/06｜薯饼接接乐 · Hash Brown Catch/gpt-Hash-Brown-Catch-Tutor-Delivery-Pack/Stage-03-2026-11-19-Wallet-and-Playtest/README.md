# Hash Brown Catch Stage 03 Wallet shop and playtest

A short-session pixel browser game for casual players. Players move a basket to catch hash browns, receiving scoring, animated and audio feedback.

## Current scope

Adds a permanent local wallet: each golden catch earns 2 coins; misses and hazards affect only the round score. The small shop offers Strawberry Social (120), Ketchup Cutie (60) and Minty Phantom (60), with the default bomb retained. Purchases equip automatically and survive reloads. No power-ups or rare pup.

## Setup and controls

Use a modern desktop or phone browser. Local hosting requires Python 3. With source in game/, run python3 -m http.server 8000 from the repository root and open http://localhost:8000/game/ . Windows can use py -3 -m http.server 8000. In the extracted local package, run Launch-Game.py instead. Mouse, touch, arrows or A/D move the basket; Space/P pauses. Audio starts after user interaction. No API key or other secret configuration is needed.

## Suggested ownership Subject to actual confirmation

- CHEN Yueru: improve UI, feedback and shop explanations in response to playtests; preserve before-and-after examples.
- MA Qianran: investigate difficulty, collision and scoring problems and run regression checks.
- LI Jiarui: review or modify the wallet and small shop, organize 3–5 non-team playtesters, and anonymize observations. This sample size is a recommendation, not a course requirement.

## Project and evidence links

- Repository: https://github.com/sd5913/Hash-Brown-Catch
- Board: https://github.com/orgs/sd5913/projects/6
- Playable result / download: [INSERT accessible URL; use local package until published]
- Weekly progress: docs/progress/2026-11-19.md
- Test records: docs/tests/
- Credits and AI: docs/credits.md

## Platforms and limitations

Local saves do not sync across devices, browsers, ports or stages. If browser storage is blocked, progress may be session-only. There is no account system, cloud save or global leaderboard. Launchers require Python 3; phones need an accessible HTTP host. No hosted URL is assumed accessible to the tutor. Actual compatibility, playtests and tutor comments remain to be documented.

## Checks

Node.js is optional and used only for checks: enter game/ and run node check-stage.cjs. Generation-time checks appear in docs/BUILD_CHECKS.txt. The team must additionally record its own tests.
