# Hash Brown Catch 接住薯饼！

An 8-bit breakfast mini-game for the browser, built with **p5.js**. Slide a fry basket left and right to catch falling hash browns. Catch one and it crunches into the basket; miss one and it turns into a sad little mash with a ghost floating out of it.


## Idea and audience

- **Who it is for:** students and office workers who want a 1-minute break, and casual players on phones or laptops. No account, no install.
- **What they do:** move the mouse, drag a finger or use the arrow keys to slide the basket under falling hash browns.
- **How it responds:** every catch gives a golden flash, a crunch sound and points; every miss gives a squelch, a mashed potato and a little ghost. Things fall faster as the 60-second round runs out.
- **Multimedia:** pixel-art sprites drawn in code, a diner background illustration, frame animation and synthesised sound effects.


## Status (week 1)

First working interaction: basket follows the pointer, hash browns fall, catch / miss with score, sound and a 60-second timer.
Planned next: start / pause / results screens, difficulty levels, hazards to avoid and power-ups.


## Run it

**Prerequisites:** a modern browser (Chrome, Edge, Firefox or Safari) and an internet connection (p5.js loads from cdnjs). Python 3 if you want to run a local server.


1. Clone the repository.
2. In the project folder run `python3 -m http.server 8000` and open <http://localhost:8000>. VS Code's *Live Server* extension also works.


Shortcut: double-click `start.command` (macOS) or `start.bat` (Windows); it starts the server and opens the game.

Double-clicking `index.html` also works, but sound is switched off because p5.sound cannot start on a page opened as a local file. A yellow note on the page says so.

## Team and process

| Member | Role | Owns |
|---|---|---|
| CHEN Yueru | Gameplay & integration lead | `js/sketch.js` (input, collision, scoring, difficulty, game states), GitHub Pages deployment, repository settings |
| MA Qianran | Art & character (IP) lead | `js/sprites.js` (Crispy, expressions, flavours, the Evil Potato Dog), scenes, concept art, character page, demo reel |
| LI Jiarui | UX, sound & QA lead | `js/ui.js` and screens (start, pause, results, shop UI), sound effects, playtests, README / credits / progress notes |

Everyone reviews at least one pull request from another member each week.

- Planning board: https://github.com/orgs/sd5913/projects/6
- Weekly progress notes: [docs/progress](docs/progress/)
- Changelog (what changed each week and why): [docs/changelog.md](docs/changelog.md)


## Credits (draft)

- p5.js and p5.sound (loaded from cdnjs).
- Diner background and early concept art: generated with ChatGPT image generation from our prompts.
- AI assistance: we used Claude (Anthropic) to help draft code. Details will be listed here as the project grows.


## Secrets

None. The game needs no API keys, passwords or accounts.
