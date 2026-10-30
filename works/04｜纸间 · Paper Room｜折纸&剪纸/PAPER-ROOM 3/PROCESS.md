# Development process

## Starting idea

I wanted to create a virtual paper workspace where beginners could explore folding and paper crafts. My initial idea included different paper sizes, dragging to fold, cutting along creases and a learning section.

I proposed using the left mouse button to drag paper, Space to confirm a fold and the right mouse button to rotate the view. Separating preview from confirmation was important to me: an exploratory drag should not leave an unwanted crease.

## Development timeline

The project is organised into the following development stages. v4 and v5 are my working labels for these stages, rather than GitHub release tags. Later stages are updated as observations and changes are recorded; version labels are not a claim that every proposed feature is implemented.

| Dates (2026) | Development stage | Status |
| --- | --- | --- |
| 15–20 October | Decide on the concept and explore the interaction through early prototypes. | Completed |
| 20–23 October | Develop the initial website prototype through repeated testing, debugging and feature revisions, reaching v4. | Completed |
| 24–26 October | Refine v4 and adjust its features, producing the v5 working version. | Completed |
| 27–28 October | Let four participants explore first, then give small tasks and collect feedback. | Completed |
| 29–30 October | Add a replayable introduction and clearer confirmation cues; document folding and cutting limitations. | Introduction implemented on 29 October; folded cutting added on 30 October |
| 30 October | Prepare the English submission documentation, screenshots and repository. | Completed |

## Scope decision

The initial discussion included fully free folding and tutorials for objects such as a paper crane. I accepted Codex's recommendation to start with constrained straight-fold geometry instead of attempting a complete flexible-paper physics simulation. This made a working interaction more achievable and explainable.

The current implementation uses polygon splitting and flat folding. More complex physical behaviours remain limitations, rather than being presented as completed features.

## Changes made during development

### Preview before confirmation

Dragging shows the proposed shape. Releasing the mouse retains the preview; Space commits it and Esc cancels it. This gives users an opportunity to inspect the response and choose their next action.

### Cut marks that remained in empty space

While using the first version, I noticed that lines remained suspended in the workspace after paper was cut and moved. I provided a screenshot and requested a correction.

The implementation was changed so that each piece owns its marks. Marks are clipped to that piece's material, and severed cut/crease markers are removed. Internal mesh edges are also suppressed to reduce harsh lines.

### Recycle-bin management

The first recycle-bin action immediately restored the most recent piece. I asked for a separate window so that users could choose a specific piece, restore all pieces or delete unwanted pieces. This made the outcome of opening the bin clearer.

### Outward folds on narrow strips

A later version required the dragged point to contact the remaining paper before a fold could be confirmed. When I tried the narrow star-strip paper, I found that this prevented ordinary outward and diagonal folds.

I rejected that restriction and requested that snapping assist alignment without controlling whether a fold is permitted. The revised version allows outward folds when the fold line actually crosses the material. The preview shows the same flat-fold geometry that confirmation produces.

The narrow strip exposed a problem I had not noticed with A4 paper: the contact rule made a plausible fold impossible. I kept snapping as an alignment aid, but removed it as a condition for confirming a fold.

### Additional workspace features

I requested saved projects and folders so that users could retain their work. I also requested adjustable glue painting, flipping, circular cutting, themes and language choices. My priority for the initial trial was whether someone could understand and complete a fold, rather than whether they discovered every tool.

## Trial with four participants

I invited four people to try Paper Room: two classmates, one participant around 50 and one around 16. The sessions took place on 27–28 October 2026. I first let participants explore freely, before giving small tasks such as folding a triangle, cutting, gluing, adding a sheet and changing colours. I reported the observations on 29 October.

All four could locate the relevant buttons and complete basic operations, although they needed some time to explore and become familiar with the interaction rules. Younger participants noticed the confirmation prompt more quickly. The participant around 50 had more difficulty noticing that clicking Confirm or pressing Space was required before continuing. This is an observation from this small group, not a general conclusion about age or ability.

### Decision: make confirmation something users practise

The feedback suggested an interactive introduction on first opening, with a way to replay it through Tutorial / Help, or a short demonstration video. I chose a hands-on introduction because the difficulty concerned a decision the user needs to make during an action: a visible preview still needs confirmation.

The first introduction asked users to cancel a preview before confirming a fold. On reviewing it, I found the sequence and wording confusing. I requested a welcome screen with language selection, followed by separate activities for adding paper, folding, moving, cutting, gluing, flipping and unfolding. The revised introduction uses the actual controls in an isolated workspace. Confirmation and cancellation appear beside the paper, and users can skip or replay the introduction without changing their artwork.

These revisions were implemented on 29 October with Codex assistance. Automated checks cover the seven completion conditions and isolation from saved artwork. Browser checks exercised adding paper, dragging and confirming a fold. These checks verify operation; they do not establish a measured improvement in usability.

### Decision: offer adjustable display settings

The older participant also asked for clear controls for text size, pointer size and dashed-line thickness and colour. I added a labelled Display settings button with three text sizes, optional larger workspace pointer rings, adjustable dashed guides and a reset button. These preferences are saved in the browser.

Some folds were difficult to align, and a small overhang was not always visible from one side. I added an optional translucent-layer view so that users can inspect overlaps without making the default view visually busy. This is a viewing aid, not a correction to the geometry or a claim that alignment problems have been solved. The reported alignment difficulty still needs a reproducible example and further investigation.

### Folding limitations exposed by the trial

Trying to make recognisable objects highlighted a gap between the three-dimensional view and the folding model. A crane requires opening individual layers, and a strip star starts with a knot. At the time of the trial, the model moved layers together in flat folds; rotating the view alone did not enable layer selection or knotting.

I requested further experiments after reviewing these limitations. The Layers tool now rotates an individual polygon panel about an available straight hinge. This allows inspection of a simple opened layer, but does not provide arbitrary layer separation or the pocket and reverse folds required for a complete crane. A separate Strip knot tool provides an adjustable guided ribbon shape. It is a preset visualisation, not a simulation of freely tying a paper strip. Both operations require confirmation and can be undone.

### Request for more expressive cutting

Participants wanted freer cutting for paper-cut patterns, complex outlines and curves, while retaining cuts along creases. I requested a tool for drawing a dashed guide, selecting it with Scissors and confirming the cut.

The revised prototype first implemented this sequence on unfolded paper. Drawn paths are simplified into line segments. Closed paths can separate an interior shape; a partial slit keeps the sheet connected. The geometry has complexity limits, and curves are approximated rather than represented as exact smooth cuts. Automated checks cover open paths, closed shapes, partial slits and material-area preservation. Browser inspection exercised a drawn guide and its confirmed cut. This has not yet been evaluated by the four participants.

### Fold, cut and unfold

On 29 October I pointed out that requiring unfolded paper prevented the basic workflow for folded-paper cut-outs. The update completed on 30 October allows a drawn guide to cut through the selected piece's overlapping flat layers. Each new cut is mapped back to the original material coordinates. Connectivity is checked there, so overlapping layers do not become incorrectly joined, and unfolding reveals mirrored holes.

Checks cover two- and four-layer cuts, separate scraps, partial slits and area preservation. A browser check folded an A4 sheet, cut a circle through both layers, moved scraps aside and unfolded the remaining sheet to reveal two holes. Raised panels and guided knots must still be closed or unfolded before cutting. This implementation check is not a new participant trial.

## AI use

I used OpenAI Codex to discuss scope, generate and revise HTML/CSS/JavaScript, work on geometry, create checks, prepare documentation and publish the website.

I supplied the concept and interaction requirements, tried the prototype, provided screenshots and requested revisions. Codex generated and revised much of the code. My work centred on defining the interaction, trying the results and deciding what needed to change. Codex also helped organise and edit these English project notes from our conversation.

- **Suggestion kept:** start with constrained straight-fold geometry rather than a full flexible-paper simulation.
- **Suggestion or implementation changed:** the paper-contact requirement for confirming folds was too restrictive, especially for narrow strips. I requested outward folding while keeping snapping optional.
- **Design requirement originating from me:** Space confirms a preview so that exploratory dragging does not immediately leave creases.

## A piece of the program to explain

The folding interaction connects three parts of the code:

1. Pointer events in `dist/app.js` record a drag's start and target positions.
2. `foldPlan` in `dist/engine.js` places a fold line halfway between them, perpendicular to the drag direction. It checks whether the line divides material and prepares a preview.
3. Confirming calls `fold`, which divides the affected polygons, reflects the moving side across the line and records the crease. Cancelling discards the preview without changing the paper.

The important distinction is between previewing and committing: dragging prepares a possible change, while confirmation changes the stored paper geometry. This is how the code implements my requirement that trying a fold should not immediately leave a crease.

## Verification and limits

Geometry checks cover folding, area conservation, partial and complete cuts, circular holes, separate scraps, glue and input validation. Additional checks cover outward folding on all five paper sizes and agreement between the preview and confirmed geometry.

Application-state checks cover saved projects, timestamps, folders, recycle-bin actions, undo, themes, languages, persistence and storage-failure protection. They use a minimal DOM substitute, not a real browser.

Earlier browser inspection confirmed the workspace layout and paper rendering. These technical checks complement the four-participant trial recorded above; they are not additional participant sessions.

## Development history

This repository carries forward three existing development commits from the local Sites source repository, followed by preparation of the English submission files. The earlier commit messages are generic, but their diffs record the initial prototype, the expanded workspace and outward-fold correction.

The original development snapshots and dates are retained. Commit contact information was replaced with the repository owner's GitHub no-reply address before public upload. Historical snapshots may contain the earlier Chinese documentation; the current submission documentation is in English. The documentation was assembled on 26 October from the earlier work, rather than written alongside every development step.

## Local execution and public access

The public repository ZIP was downloaded without authentication and returned HTTP 200. A downloaded copy was extracted to a separate directory and served with the README command in a new terminal session. Browser checks confirmed folding and cancellation of an accidental preview. The folded-cutting update was also checked in a local browser, including cutting through two layers and unfolding the result.
