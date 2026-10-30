# Paper Room

An interactive website for exploring basic paper folding, cutting and composition.

**[Try the live website](https://paper-room-crystal.wry-toast-5992.chatgpt.site/)** · [Development process](PROCESS.md) · [Credits](CREDITS.md)

## Idea and intended user

Paper Room is designed for beginners who want to experiment with digital origami and paper crafts. Users choose a paper size and fold, cut or combine pieces in a workspace with a three-dimensional view.

The main intention is to make experimentation recoverable. A drag previews a change before the user commits to it. Cancel, undo and the recycle bin help the user recover and decide what to try next.

## Main interaction

1. Select **Fold** and drag from a point on the paper to a target position.
2. The program calculates a fold line and previews the resulting shape.
3. Press **Space** or click **Confirm** to create the fold, or press **Esc** to cancel.
4. The paper changes shape and retains a crease. Continue folding, flip it or unfold it.

Releasing the mouse does not commit a fold. Targets can be outside the original outline. Snapping assists alignment near corners and edges; it is not required for confirmation.

**Input → calculation → visible preview → user decision → updated paper.**

## Screenshot

![Paper Room workspace](docs/workspace.png)

### More screenshots

[Welcome and languages](docs/welcome.png) · [Hands-on tutorial](docs/tutorial.png) · [Display settings](docs/display-settings.png) · [Fold, cut and unfold](docs/folded-cut.png)

## Folded-paper cutting

1. Fold a sheet and confirm the fold. Top view makes drawing precise paths easier.
2. Use Draw cut or Compass to draw a new guide on the folded paper, then confirm the guide.
3. Select Scissors, click the guide and confirm. The cut passes through all overlapping flat layers of that piece.
4. Move the separated scraps aside or into the recycle bin.
5. Select the remaining paper and click Unfold to reveal the repeated pattern.

A slit that does not separate the material remains connected. This does not simulate bending around a partial slit. Unused freehand guides are cleared when folding or unfolding changes the workspace geometry; confirmed cuts remain in the material.

## Run locally

The application is static HTML, CSS and JavaScript. It has no third-party JavaScript runtime dependencies and requires no API key, AI model or paid account. Use a modern desktop browser with a mouse and keyboard.

To download without Git: open the repository's main page, click the green **Code** button, choose **Download ZIP**, then unzip `PAPER-ROOM-main.zip`. On macOS, open Terminal, type `cd ` (including the space), drag the extracted `PAPER-ROOM-main` folder into Terminal and press Return.

Alternatively, clone it:

```sh
git clone https://github.com/Crystalll0/PAPER-ROOM.git
cd PAPER-ROOM
```

From the directory containing `dist`, start a static server with Python 3:

```sh
python3 -m http.server 8765 --directory dist
```

Open **http://localhost:8765**. Stop the server with **Ctrl+C** in the terminal. Python is only used as a static server, not as the application runtime; another static server can serve `dist` instead. The hosted website is not needed for local use.

The repository version defaults to English. Simplified Chinese and Traditional Chinese remain available as optional interface languages. A previous language choice is retained by the browser.

## First-visit practice

On first opening, a welcome screen offers language selection. Seven hands-on activities introduce adding paper, folding and confirming, moving, cutting, gluing, flipping and unfolding. Each activity uses the real workspace controls in a separate practice area; confirmation appears beside the paper. Skip at any time or replay from **Tutorial / Help**. Practice does not modify saved artwork. The browser remembers dismissal when local storage is available.

## Controls and features

| Action | Control |
| --- | --- |
| Preview a fold | Select Fold and drag with the left mouse button |
| Commit or cancel a preview | Space / Confirm, or Esc / Cancel |
| Rotate and zoom | Right-drag, or scroll the mouse wheel |
| Flip or unfold | Select a piece and choose Flip over or Unfold |
| Cut along a crease | Select Scissors, drag along a visible crease and confirm; flat-folded layers are cut together |
| Cut a circle | Draw and confirm a circle with Compass, then select its guide with Scissors and confirm |
| Draw a cutting path | Select Draw cut on flat or flat-folded paper, drag a path and confirm the guide; select it with Scissors and confirm the cut |
| Open one panel | Select Layers on a folded piece, choose an available hinged panel and adjust its angle, then confirm |
| Preview a strip knot | Add a fresh strip, select Strip knot, adjust the guided shape and confirm; Unfold restores the strip |
| Glue pieces | Paint glue, move another piece into contact and confirm |
| Recover an action | Undo or Redo |
| Recycle a piece | Use Move to drag it into the bin |
| Restore a piece | Open the bin and choose Restore |
| Save or back up | Save project or Export file |

Paper sizes include A4, A3, square, rectangular and narrow star-strip paper. The workspace also includes adjustable paper/background colours, light/dark themes, folders, project renaming and JSON import/export.

## Display settings

Use **Text / Display** above the workspace or **Display settings** in the sidebar to enlarge interface text, add a larger workspace pointer ring, or adjust dashed-guide thickness and colour. The **See layers** shortcut toggles transparency. **Translucent paper layers** is an optional viewing aid for checking overlaps. It does not change the geometry, automatically align edges or enable individual-layer folding. Settings are stored in the browser and can be reset.

## Error handling

- Cancelling an exploratory drag leaves no new crease.
- A proposed fold line that does not pass through the material is not accepted.
- Partial cuts do not prematurely separate a sheet. Crease and cut marks stay within their owning pieces.
- Invalid imported files produce an error message.
- If browser storage fails, the workspace is retained and an export option remains available. Creating a new project does not clear the current work after a failed save.
- Recycled pieces can be restored individually or together.

## Saving and privacy

Projects and drafts use this browser's local storage. They are not automatically uploaded or synchronised across devices. Clearing site data can remove saved projects; export a JSON backup to keep a separate copy.

The hosted website and a locally served copy use separate storage. Export and import files to move projects between them.

## Known limitations

This is a polygon-based folding prototype with three-dimensional projection, not a complete physical simulation of flexible paper. It supports straight, flat folds and moves the layers on one side together. The Layers tool can open a polygon panel about one straight hinge, but it does not implement arbitrary layer separation, pocket folds, realistic collisions or the full sequence for a crane. Close the panel before further flat folding.

Strip knot is a guided three-dimensional ribbon shape with an adjustable parameter, not a freely tied or physically simulated knot. It requires a fresh strip and does not constitute a star-making tutorial.

Cutting supports flat and flat-folded paper; it cuts through all overlapping layers of the selected piece. Close a raised panel before cutting. Painting glue still requires unfolded paper. Partial cuts do not simulate local bending. Circular cuts use a polygonal approximation (96 sides on unfolded paper; 64 sides for new folded-paper guides). Freehand guides are simplified to polygonal segments, with limits on path and mesh complexity; they are not exact smooth curves. Open partial cuts remain connected until the cut separates the material. Glued pieces move as a group; a self-glued fold must be undone before unfolding. Many successive operations can increase the computational workload.

The learning section currently introduces basic controls; it does not yet include tutorials for making specific origami models. Future iterations may add detailed, step-by-step guides for shapes such as hearts, cranes, stars and Christmas trees. Desktop mouse and keyboard use is the primary target.

## Source and checks

```text
dist/
  index.html       Page structure
  style.css        Interface styles
  app.js           Input, interface and browser storage
  engine.js        Folding, cutting and gluing geometry
  i18n.js          Interface language strings
  tour.js          Welcome and seven-stage tutorial
  practice.js      Isolated workspace for tutorial activities
  advanced.js      Path cuts, hinged panels and guided ribbon geometry
  advanced-ui.js   Advanced-tool controls and previews
  display.js       Text, pointer, guide and layer display preferences
tests/
  geometry.cjs     Geometry regression checks
  workspace.cjs    Application-state checks
  advanced.cjs     Path, panel and ribbon geometry checks
docs/
  workspace.png    Screenshot
```

With Node.js installed, run:

```sh
node tests/geometry.cjs
node tests/workspace.cjs
node tests/advanced.cjs
```

No test packages need installing. The workspace tests use a minimal DOM substitute; they are not full browser automation or a substitute for a trial with another person.

## Authorship and evaluation

OpenAI Codex assisted with implementation, debugging, testing and documentation. The author's design decisions and AI-use disclosure are in [PROCESS.md](PROCESS.md). Tool and material credits are in [CREDITS.md](CREDITS.md).

Feedback from four participants and the resulting changes are recorded in [PROCESS.md](PROCESS.md). The sessions took place on 27–28 October, with free exploration before task prompts. The revised features have undergone automated and browser checks.
