---
translationOf: rhine-lab-archives-guide.md
sourceHash: sha256:20b8cd2fd2438e26104bf21760e88632623a214353031a584da3696aad0c8492
---

This page is adapted from LBEILC's RhineLabUI. It retains the original project's opening sequence, 3D models, and interactions. The following notes describe how these effects connect in the current version of the code. I will leave the story itself aside and focus on the relationship between the content and its presentation.

## Matching the page to its files

The project uses TypeScript, Three.js, and Vite, without React or Vue. The HTML entry point is short, with only a stage container in the main body:

```html
<main id="viewport"><div id="stage"></div></main>
<script type="module" src="/src/main.ts"></script>
```

`main.ts` builds the interface, and the Three.js canvas sits inside `three-scene`. The opening text, search window, and reading content are DOM elements; the archive array, glass materials, lighting, and camera belong to the WebGL scene.

When reading the source, start by matching the visible features to their files:

| File or directory | Corresponding page content |
| --- | --- |
| `src/main.ts` | Page structure, mode switching, archive selection, details, search, and settings entry points |
| `content/archives.json`, `src/data.ts` | Archive text, categories, identifiers, and the data entry point |
| `src/boot.ts`, `src/boot-motion.ts`, `src/boot-*-tracks.ts` | Opening text, logo, scanning rings, and timeline |
| `src/startup.ts` | Resource preparation, click-to-enter, retrying failed audio, and entry without sound |
| `src/scene.ts` | The 3D array, selected model, extraction, return, and camera |
| `src/archive-layout.ts`, `src/archive-loop.ts`, `src/archive-drag.ts` | Content positions, wrapping, dragging, and momentum |
| `src/motion.ts` | Array waves, idle movement, extraction height, and motion damping |
| `src/decryption.ts`, `src/glass-reveal.ts`, `src/document-decryption.ts` | Decryption lines, glass clarity, and text masks |
| `src/model-viewer.ts`, `src/viewer-camera.ts` | The standalone model viewer, disassembly, and view reset |
| `src/viewport-layout.ts`, `src/responsive.css` | Desktop, compact-window, and mobile portrait layouts |
| `src/render-quality.ts`, `src/motion-preferences.ts` | Rendering quality parameters and individual motion controls |
| `src/audio.ts`, `src/pwa.ts` | Music, interaction sounds, offline resources, and the update entry point |
| `public/assets/`, `art/` | GLB assets used by the page, Blender projects, and modeling scripts |
| `scripts/archive-content.mjs`, `scripts/export-records.mjs` | Content validation, downloadable TXT files, and archive catalog generation |

The directory also retains a Wallpaper Engine workbench, music-reactive effects, and some comparison experiments. They have their own entry points and build conditions. The ordinary web page mainly follows the opening, array, and detail path. Finding a module in the directory does not mean it is always enabled; check `main.ts` for its activation conditions.

## All the content lives in one JSON file

The current `archives.json` contains 169 archives, numbered from `X-001` to `X-169`. Counting the actual data gives the following totals:

| Category | Count |
| --- | ---: |
| Archon Quests | 50 |
| Story Quest section | 79 |
| World Quests | 16 |
| Books and texts | 16 |
| Journey excerpts | 8 |

Here, “Story Quests” is an interface section containing 61 formal Story Quests and 18 Tribal Chronicles. The section name and each entry's actual type are recorded separately, so the 79 entries should not all be counted as formal Story Quests. This table only describes the material currently included in this project.

Alongside Chinese and English titles, each archive contains a region, chapter information, related characters, an overview, a sectioned narrative, reading notes, and sources. The fields map to the interface as follows:

| Field | Where it appears |
| --- | --- |
| `id` | Archive number, saved records, and the TXT filename |
| `title`, `en` | Chinese title and English catalog title |
| `category` | Category labels, search filters, and membership in a 3D column |
| `department` | The “Region” field in the details; the original project's field name is retained |
| `date` | “Chapter / Source”; this version records quest type, chapters and acts, or the selected reading range |
| `taskParts` | Parts and official titles within World Quest series |
| `lead` | Related characters, author, or narrator |
| `abstract` | The first tab, “Overview” |
| `narrative` | The second tab, “Detailed narrative,” with a heading and text for each section |
| `findings` | The third tab, “Reading notes” |
| `source` | Sources at the bottom of the details and in the exported text |

The data enters the page through `src/data.ts`:

```ts
export const records: ArchiveRecord[] = content.records;
export const categories = ["全部档案", ...content.categories];
export const archiveColumns = content.columns;
```

Search categories and 3D columns use the same names, but their order can differ. From left to right, the array contains World Quests, Story Quests, Archon Quests, books and texts, and journey excerpts, placing Archon Quests in the center.

The interface's `JOURNEY DATABASE` refers to this static dataset. The content ships with the project, and both reading and searching happen in the browser.

## The opening follows one timeline

With sound enabled by default, the page prepares the models and fonts, then waits for a click or key press to enter. `StartupGate` manages this entrance: the button is disabled while resources are not ready, and “Click to enter” appears only after preparation. Clicking also unlocks browser audio playback. If sound is not ready, the user can retry or enter without sound.

Once the opening begins, `BootSequence` updates the text, SVG logo, and rings according to the current time. The logo's strokes use `strokeDasharray` and `strokeDashoffset` to control their visible length. Ring paths are recalculated from their radius, starting angle, and arc length; the small circles and orange points have separate trajectories.

`bootMotion()` retains the reference clip's time coordinates:

```ts
const t = appTime + 5;
const f = Math.floor(t * 25 + 0.00001);
```

`t` corresponds to seconds in the original reference clip, and `f` is the frame number at 25 frames per second. The current opening starts from the white-background section, with the normal startup point corresponding to approximately 6.76 seconds in the original clip. These times must be interpreted alongside their coordinate origin, rather than all being treated as seconds elapsed after clicking.

Text appearances, scanning, the welcome screen, and the subsequent array entrance all derive their state from the current playback time. Continuous position changes interpolate sampled trajectories; brief flashes are determined by frame number. The browser renders the DOM, SVG, and 3D scene frame by frame. The original reference video is used only for measurement and comparison.

There are only three main page modes:

```ts
type Mode = "boot" | "archive" | "detail";
```

`setMode()` updates the stage state, interface operability, audio scene, and 3D targets together. When moving from the opening to the array, or from the array to the details, the text and models therefore switch to the same mode.

The opening can be skipped or replayed from the footer. A full playback continues with demonstrations of the array entrance, archive selection, and extraction, before entering the details.

## Where the glass archives come from

The 3D archive comes from `public/assets/archive-cassette.glb`. `art/` retains the corresponding Blender project and scripts for producing the shell, internal structure, and disassembled model. At runtime, the web page only needs to load the exported GLB.

`ArchiveScene.load()` reads the model, traverses its meshes, and processes the glass, ceramic interior, frame, and fasteners according to material names. The selected model's base glass parameters include:

```ts
mat.color.set("#fffdfa");
mat.transmission = 0.9;
mat.thickness = 0.12;
mat.roughness = 0.21;
mat.ior = 1.46;
mat.attenuationColor = new THREE.Color("#eee6df");
mat.attenuationDistance = 2;
```

`transmission` controls light transmission, `thickness` and `ior` contribute to refraction, and `roughness` determines surface roughness. These are the base settings applied during loading; selection and decryption continue to adjust the material afterward.

The warm gray background, soft shadows, distant fog, and depth of field together establish the archives' depth relationships.

The background array uses `InstancedMesh`:

```ts
const inst = new THREE.InstancedMesh(geom, arrayMat, count);
```

Parts of the same type share geometry and materials, with each archive's position controlled by its instance matrix. The shells, frames, and fasteners can be drawn in batches. The selected archive uses a separate model with more complete internal detail for extraction and close inspection.

Labels also update when the selection changes. `drawLabel()` writes `TEYVAT LOG`, the identifier, and markings onto a Canvas, then applies it to the model as a texture. This avoids preparing a separate image for every identifier.

## Why the archive row has no end

Three things need to be distinguished: the content in the JSON, the column to which it belongs, and the archive positions currently being drawn on screen.

`createArchiveLayout()` first creates category indices, then records a `lane`, `row`, and `slot` for each item. Categories can have different numbers of items; content slots extend to match the longest column. The current longest column contains 79 items. With the code retaining a 12-row leading offset, `slotRows` is 91.

These content slots are separate from the opening's fixed array. The original-clip comparison retains 160 physical positions, while normal interaction calculates the positions to display from the actual camera and viewport. Adding a text entry does not require changing the opening's model count or movements.

Wrapping uses a short modulo function:

```ts
export function wrap(value: number, count: number) {
  return ((value % count) + count) % count;
}
```

It also handles negative numbers, so moving backward past the first item still produces the index of the last item. The five categories wrap across five columns, and the items in each column wrap according to that column's own count:

```ts
export function fileAtCell({ lane, row }: ArchiveCell, origin: ArchiveCell = { lane: 0, row: 0 }) {
  const files = columnFiles(wrap(lane + origin.lane, archiveColumns.length));
  return files[wrap(row + origin.row - 12, files.length)];
}
```

The visual position can keep advancing while content identifiers cycle within the column. `nearestOccurrence()` finds the occurrence of the same item nearest to the current view. Arrow-key navigation crossing either end also moves to the neighboring position, rather than suddenly sliding backward to the beginning.

When switching categories, `columnMemory` retains the most recently selected item in each column. After reading a World Quest, switching to books, and returning, the user can still reach the previous position. This selection memory is maintained within the current page session.

The bottom displays at most eight ticks. `fileTickWindow()` takes a window of items near the current selection, while the counter displays the column's actual total. A column with 79 items therefore still has only eight visible ticks, and the window moves as the user browses.

Identifier and title scrolling comes from `@kitlangton/rolling-number`. Numbers retain two- or three-digit formatting, titles use `createRollingText()`, and the duration is consistently 460 milliseconds. With rapid selection changes, the displayed content keeps rolling toward the latest target. Entering the details ends the scrolling and leaves the final title directly visible.

## Dragging, momentum, and selection waves

The array is tilted under a perspective camera, so both horizontal and vertical screen movement can affect its columns and rows. `ArchiveDrag` first calculates the screen projections of these two 3D directions, then inverts that mapping to convert pointer displacement into movement along the two tracks.

Dragging can follow a diagonal or change direction partway through. The code retains approximately the latest 120 milliseconds of motion samples to estimate the actual release velocity. If the pointer has already stopped before release, it does not add a noticeable extra glide.

The deceleration in `ArchiveMomentum` is:

```ts
const decay = Math.exp(-this.friction * dt);
this.value += (this.velocity * (1 - decay)) / this.friction;
this.velocity *= decay;
```

The friction coefficient here is `2.4`. Glide distance depends on release velocity. Once the speed drops, spring motion snaps the position to a nearby whole cell. Columns and rows share the free-gliding phase, so a diagonal drag continues slowing in the same direction after release.

Selecting an archive slightly raises the current model and sends a wave through nearby archives. The main calculation is in `baselineSelectionWave()`:

```ts
export function baselineSelectionWave(distance: number, age: number) {
  if (age < 0 || age > 3.2) return 0;
  return (
    0.8 *
    smooth(age / 0.2) *
    Math.exp(-age * 1.15) *
    Math.cos((distance - age * 8) * 0.58) *
    bell(distance - age * 8, 3.4)
  );
}
```

`distance` is the distance from this selection's position, and `age` is the time since it was triggered. `age * 8` propagates the crest outward; exponential decay gradually settles it, and the cosine preserves the trough behind the crest. Each archive samples a height for its own position, and the neighboring archives together form a wave.

The selected model's preview lift target is `0.4` scene units. After a period without interaction, the array can also use `idleWave()` for subtle movement. Selection waves, idle movement, and drag momentum each have independent motion controls.

## Opening an archive: the model and camera have separate jobs

Clicking `ACCESS FILE` or pressing Enter puts the page into `detail` mode. The selected archive rises vertically. Its target lift height in interactive detail mode is:

```ts
export const INSPECTION_LIFT = 4.05;
```

In the model position update, the lift is added only to the vertical coordinate:

```ts
this.model.position.set(
  chosen.x - trackX,
  chosen.y + field(selectedRow, selectedLane) + this.lift.value + hoverLift(this.selectedCell) - this.presentationDrop(this.selectedCell),
  chosen.z + entryZ + this.rail.value,
);
```

The camera then adjusts its direction, distance, and target to reframe the scene from the whole array to one archive's details. On desktop, the model stays on the left while text appears on the right. Extraction still happens at the archive's original array position; the camera handles the close-up.

Rotation inspection waits until the archive has clearance. The code calculates the tops of nearby archives and allows drag rotation only after the current model has risen sufficiently.

When returning to the array, the archive first straightens at its current height, then descends. During rapid selection changes, the previous archive temporarily retains its own model and return state. If selected again, it continues from its current lift and rotation position. This lets movements connect during consecutive interactions.

## The glass clears as the text is revealed

Decryption has several stages: waiting, connecting from both ends, holding the connection, converging toward the center, revealing the glass, and finally becoming fully clear. `DecryptionController` organizes these into a `DecryptionFrame`, which is read by the model, the overlaid lines, and the text.

Decryption-line endpoints are defined in model coordinates. `InspectionOverlay` projects them onto the screen through the current model and camera, so the lines remain attached to the same archive surface when the camera moves.

The glass's clear region advances from top to bottom. `glass-reveal.ts` calculates clarity from progress and height on the cover plate. Roughness is `0.42` at the frosted end and `0.025` at the clear end. A short softened transition region follows the moving edge: the upper half becomes clear first, followed gradually by the lower half.

The text masks use the same decryption progress. They begin to move away only after the glass starts clearing:

```ts
if (this.started === null && frame.clarity > 0) this.started = now;
if (this.started !== null)
  this.progress = Math.min(1, Math.max(0, (now - this.started) / 0.95));
```

`DocumentDecryption.refresh()` traverses actual text nodes and measures each line with `Range.getClientRects()`, then adds decorative masks for those lines. Wrapping titles and longer text can therefore generate masks from the real layout, while the original text nodes remain in the document.

Font-subset loading can change text widths. The code remeasures the masks while retaining the reveal progress already reached. This needs to follow actual layout; a fixed set of black bars is difficult to align with content of different lengths.

## The four reading tabs

The detail view provides “Overview,” “Detailed narrative,” “Reading notes,” and “Reading history” in that order. The title, region, chapter, and related characters sit above the tabs, with saving and export controls below the reading area.

`renderNarrative()` generates the detailed narrative. Quest entries first show chapter and quest titles; World Quests also list their series parts. It then outputs headings and text section by section:

```ts
record.narrative.map((section) => `<section class="narrative-section"><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.text)}</p></section>`).join("")
```

Data is treated as plain text and passed through `escapeHtml()` before being inserted into the template. Markdown markers inside the JSON do not automatically become rich text. The hierarchy comes from `heading`, `text`, and the array structure.

Quests, books, and excerpts use different explanatory text, and the detailed narrative clearly warns that it contains plot information. Summaries and notes are editorial content; sources are retained separately at the bottom of the details.

Reading history records only the current session. Opening the details makes `recordAccess()` place the identifier and time in an in-memory array. The tab displays at most the four most recent accesses to the current archive. This is separate from persistent saved items and does not survive a page refresh.

Changing tabs briefly fades in the text and moves the underline to the new button. Saving updates only the button, count, and feedback, without rebuilding the entire detail view, preserving the current tab and reading position.

## Inspecting and disassembling the model separately

“View archive model in 360°” opens a separate scene from the detail view. It has its own camera, controller, and model instance. The main array pauses rendering while retaining the current archive selection.

This scene loads `archive-assembly.glb`. Meshes are assigned through `userData.assemblyPart` to six groups: fasteners, transparent cover, refraction rings, optical core, information substrate, and backplate with frame.

A shared `spread` progress controls disassembly:

```ts
for (const part of PARTS) {
  this.groups.get(part.id)!.position.z = part.depth * this.spread.value;
}
```

Each group has a different `depth`. As progress goes from 0 to 1, the layers separate along the local Z axis; reassembly returns it to 0. They share one progress value, so changing to reassembly midway through disassembly continues from the current position.

`OrbitControls` receives rotation, pan, and zoom input; `ViewerCameraMotion` then smoothly updates the actual camera. Desktop supports dragging, the wheel, and arrow keys. Mobile supports single-finger rotation and two-finger zooming and panning. Switching between clear and frosted glass is independent of disassembly and does not reset the current viewing angle.

Closing the viewer releases this model's geometry, materials, and label textures, then restores focus to the button that opened it. Closing while loading also cancels the integration of that request, preventing late resources from reappearing in an already closed window.

## Search, saving, and export

The search window combines the identifier, Chinese title, English title, region, and characters into a searchable string, then filters it by category and saved status:

```ts
(modal !== "saved" || saved.has(r.id)) &&
(filter === "全部档案" || r.category === filter) &&
`${r.id} ${r.title} ${r.en} ${r.department} ${r.lead}`
  .toLowerCase()
  .includes(searchQuery.toLowerCase())
```

This is browser-side substring matching, unaffected by English letter case. Search currently covers only the listed fields; the detailed narrative is not included in this string. Clicking a result first completes the window's exit, then selects and opens the corresponding archive.

Saved items use stable identifiers and are stored in the current browser:

```ts
const saved = new Set<string>(readLocal<string[]>("teyvat-saved", []));
```

Settings are stored under the separate key `teyvat-settings`. The Teyvat adaptation therefore has its own namespace for saved items and preferences. New content should continue with additional identifiers while existing identifiers stay unchanged, so saved items still point to the same records.

`EXPORT` downloads a pregenerated UTF-8 TXT file named in the form `TEYVAT-X-001.txt`. The page, downloadable text, and Markdown archive catalog are all generated from `archives.json`, avoiding a separately maintained text copy that might miss updates. The TXT contains the overview, detailed narrative, notes, and sources. Current-session reading history is not included in the download.

When a dialog opens, the background interface becomes `inert` and focus stays inside the window. Nodes are removed and focus restored only after the exit finishes. Search input, tab arrow keys, and array navigation are handled separately, so typing does not also change the selected archive.

## Models and reading areas on mobile

The page uses the aspect ratio to detect portrait orientation, with additional handling for narrow windows and touch-device landscape layouts:

```ts
const portrait = width / height < 1.05;
const compact = portrait || width < 1100 || (coarse && height < 600);
const scale = compact ? 1 : height / 1080;
```

Desktop scales the interface against a baseline height of 1080, while compact layouts use actual pixel dimensions. `archiveFraming()` calculates the camera's visible area and model framing.

Portrait details place the model above a separately scrollable text area:

```css
[data-layout="portrait"] .detail-content { left: var(--edge); right: var(--edge); width: auto; top: 54%; bottom: 40px; padding-top: 12px; border-top: 1px solid #aaa496; }
```

Longer text can continue scrolling inside the reading area while the model remains above it. Compact layouts also adjust font sizes, button heights, and search-result columns. Model gestures and text scrolling are handled separately.

When a mobile software keyboard appears, `fit()` reads `visualViewport` to update the dialog's available top position and height. This primarily adjusts the window rather than rearranging the entire 3D array for the keyboard.

The opening has another layout that fills the actual viewport. Only the explicit frame-by-frame comparison fixes the stage at `1920 × 1080`. Adaptation checks need to distinguish the opening stage from the layout used after entering the reading interface.

## Rendering quality and motion are configured separately

Quality presets include Performance, Original, High, and Ultra, with custom settings also available. Parameters cover render scale, pixel density, shadows, ambient occlusion, depth of field, antialiasing, transmission resolution, and texture filtering.

`renderDimensions()` first calculates the requested pixel ratio, then limits it by the pixel budget and the device's texture size:

```ts
const ratio = Math.min(
  requested,
  Math.sqrt(pixelBudget / Math.max(1, width * height)),
  maxTextureSize / Math.max(1, width, height),
);
```

The default budget in ordinary mode is `8_294_400` pixels; Super Performance mode uses `921_600`. These limits apply to the 3D canvas and related render targets, while DOM text continues to display at its normal font size.

Super Performance mode also disables some lighting and post-processing, simplifies background materials, and retains the selected archive's structure. It reads an effective quality configuration, leaving previously saved custom settings intact so they can be restored when the mode is turned off.

Motion has separate Full, Reduced, and Custom options. The opening, waves, momentum, extraction, model decryption, text reveal, rolling titles, and viewer movements can be controlled individually. The first visit consults the system's reduced-motion preference; saved page settings take priority.

Light/dark switching has its own transition. `ThemeWave` starts from the current selection and schedules delays for archives according to their row and column distance. The glass array changes color archive by archive, with background and text changing alongside it. Reversing the transition partway through continues calculating from the colors already displayed.

Rendering also avoids some repeated work. The array calculates visibility from the camera, clips off-screen instances, and submits the remaining ones compactly. Parts moving together share instance matrices. When the scene is still, it compares camera, material, texture, and model state, reusing the already rendered canvas when the inputs match.

The page's update loop can therefore continue maintaining selection and input state while skipping repeated 3D rendering. Shadows and some depth data are also reused within the same frame. Actual costs still vary with quality settings and the device.

## Sound and offline resources

Background music has three tracks, `atmosphere`, `motif`, and `pulse`, which loop in sync through Web Audio. The opening, array, details, and viewer adjust their relative volumes separately. Transitions use fades while preserving playback position.

Interaction sounds are handled separately: selecting, extracting, returning, and disassembling use glass sounds; window operations and startup feedback use electronic tones. Character-by-character typing uses short samples recorded from the original reference clip. During rapid interactions, the code limits the trigger interval and simultaneous count of sounds of the same type.

Sound effects and music have independent switches and volume controls. Audio for the full opening reads the same timeline. Large time skips stop current effects instead of playing all missed cues at once.

The project also retains PWA functionality. Development mode does not register a Service Worker. Production mode prepares an offline copy only when conditions such as a secure context are satisfied.

`scripts/pwa-worker.js` caches the page, scripts, models, fonts, and downloadable text by build version. A version finishes installation only after the complete resource set has been saved. If installation fails partway through, that incomplete cache is deleted and the existing version remains available.

An update entry point appears when a new version is ready. The page being read is not forcibly reloaded. Clicking the update control notifies the waiting Service Worker to take over and restart the page.

Production model resource names also contain content hashes generated by `vite.config.ts`. Stable filenames exported from Blender remain, while production URLs identify the specific file content.

## Where to make future changes

For day-to-day maintenance, start by separating content, visuals, and interaction:

| What to change | Main location |
| --- | --- |
| Add entries or revise text and sources | `content/archives.json` |
| Category and 3D-column order | JSON `categories` and `columns` |
| Detail fields, tabs, and search scope | `src/main.ts`, `src/archive-narrative.ts` |
| Opening text, trajectories, and timing | `src/boot-motion.ts`, the `boot-*-tracks.ts` files, `src/boot.ts` |
| Extraction, return, waves, and camera | `src/motion.ts`, `src/scene.ts` |
| Glass reveal and text masks | `src/glass-reveal.ts`, `src/decryption.ts`, `src/document-decryption.ts` |
| Viewer parts and disassembly distances | `PARTS` in `src/model-viewer.ts`, and part markers in the disassembly GLB |
| Colors and reading typography | `src/style.css`, `src/theme.css`, `src/responsive.css` |
| Quality and motion presets | `src/render-quality.ts`, `src/motion-preferences.ts` |
| Music and interaction sounds | `src/audio.ts`, `public/audio/`, and audio-generation scripts |
| The model itself | Blender projects and scripts in `art/`, exported to `public/assets/` |

Append new content to the end of the array using the next consecutive identifier. Keep all five categories nonempty, and fill in the series parts for World Quests. Field rules are documented in `content/README.md`.

`scripts/archive-content.mjs` validates identifiers, fields, categories, sectioned text, and source-link formatting. Export scripts then synchronize the TXT files and catalog. Field validation checks data structure; plot details, official quest types, and sources still need separate verification.

After modifying content, the project provides these synchronization and checking commands:

```powershell
npm run export:archives
npm run check:content
npm run check:viewport
npm run build
```

Export updates `public/archives/` and `docs/GENSHIN-CATALOG.md`. The pre-development and pre-build scripts also run this process.
