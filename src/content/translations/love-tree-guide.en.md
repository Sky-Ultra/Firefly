---
translationOf: love-tree-guide.md
sourceHash: sha256:6a302668ef2d6242947a63a1ed18912c5a9bd5bc0d139cc10440fb8414a7034f
---

Seven hundred petals of love come together to form a tree of love...  

The page is currently shared only with selected people, but I have now open-sourced the project.

The earlier [relationship timer component](https://xiaoxiaoboluo.cn/posts/relationship-timer-guide/) article covered a sidebar card. This time, I wanted to take a look at the love tree page too: how the tree is drawn, how the animations connect, and when the text appears. This mainly records how the page is implemented.

## First, a look at the files

The page uses plain HTML, CSS, and JavaScript. The code in this directory does not introduce a frontend framework or request a backend API; the browser draws the tree and its flowers.

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure, the heart button, three canvas layers, the text on the second page, and control buttons |
| `styles.css` | Colors, desktop and mobile layouts, the heartbeat, drifting petals, and text transitions |
| `config.js` | Intro text, the first letter, the rotating sentences beneath the tree, and the rotation interval |
| `js/geometry.js` | Coordinates, Bézier curves, heart-region testing, and the heart drawing path |
| `js/tree.js` | Tree parameters and drawing the seed, ground line, branches, and flowers |
| `js/animation.js` | Animations from the opening through flowering, tree movement, typing, sentence rotation, and falling hearts |
| `js/ui.js` | Generating letter paragraphs, scaling the scene, initializing canvases, and the music button |
| `js/afterword.js` | Paragraph animations on the second page and the prompt to keep reading below |
| `js/main.js` | Initializing the page and arranging the execution order of each stage |
| `bgm.mp3`, `favicon.svg` | Background music and the browser-tab icon |
| `LICENSE` | The retained MIT license and copyright attribution |

`index.html` loads these files through script tags with `defer`, in this order: configuration, geometry helpers, animation, tree, UI, the second page, and finally the entry script. They are ordinary scripts, so later files can directly use functions and classes defined earlier. This loading order needs to be preserved.

## Three canvas layers

The tree area stacks three canvases:

```html
<canvas id="ground-canvas" aria-hidden="true"></canvas>
<canvas id="static-canvas" aria-hidden="true"></canvas>
<canvas id="canvas" aria-hidden="true"></canvas>
```

The bottom layer draws the ground line, the middle layer draws the seed, branches, and blooming flowers, and the top layer draws the continuously falling petals. The letter and the text beneath the tree are HTML elements placed above the canvases.

With these separate layers, each petal animation frame only needs to clear the top canvas. The fully grown tree can remain on the middle layer, and the ground line can stay where it is. When the tree moves to the right later, CSS moves `static-canvas`; the ground line does not move with it.

Drawing uses a fixed `1100 × 680` coordinate space. The enclosing `scene` reserves space based on a height of `760px`, with the extra room accommodating the sentences beneath the tree. When the window narrows, `scaleContent()` calculates a scale from the available width:

```js
const scale = Math.min(viewport.clientWidth / StageConfig.width, 1);
viewport.style.setProperty("--scene-scale", String(scale));
```

CSS then applies this scale to the scene. The tree coordinates never change, so shrinking the page does not require recalculating every branch. A `ResizeObserver` updates the scale when the container width changes.

`initCanvas()` also handles screen pixel density:

```js
function initCanvas(id) {
	const canvas = document.getElementById(id);
	const { width, height } = StageConfig;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	canvas.getContext("2d").scale(dpr, dpr);
	return canvas;
}
```

The canvas pixel dimensions are increased by at most a factor of two, and the drawing context is scaled accordingly. The code can therefore keep drawing with the original coordinates while retaining clearer edges on high-density screens.

The page background is `#ffffee`, the letter uses `#228567`, and the text beneath the tree leans toward pink. The font stack prefers the system's PingFang or Microsoft YaHei; this directory does not contain additional font files.

## After clicking the heart

The entry point is a real `<button>` containing an SVG heart. It can be clicked with a mouse or focused and activated with a keyboard. Its gentle heartbeat comes from the `heartbeat` keyframes: a 2.4-second cycle contains two enlargements of different sizes.

After the click, the button is disabled, and the listener runs only once. `animateOpening()` reads the actual positions of the SVG heart and canvas, then moves the heart to the canvas seed's position. The text fades out over 220 milliseconds, and the heart moves over 420 milliseconds. The button then hides, and the canvas heart takes over the animation.

This section of `main.js` makes the playback order clear:

```js
seed.drawHeart();
await animateSeedShrink(seed);
await animateSeedMove(seed, footer);
await animateTreeGrow(tree);
await animateFlowerBloom(tree);

tree.resetFallingBlooms();
footer.draw();
await animateTreeMove(staticCanvas);
document.body.classList.add("letter-open");
const letter = document.getElementById("letter");
letter.hidden = false;
typewriter(letter);
```

Each `await` waits for the preceding stage to finish. The branches do not start growing before the seed lands, and the tree does not move aside before its flowers have finished blooming.

During the shrinking stage, each step multiplies the heart's scale by `0.94` until it falls below `0.2`. The falling stage displays a red dot and moves it down by `2.4` drawing units per step. Meanwhile, `Footer.draw()` extends the ground line in both directions from the seed's position.

These finite animations all use `runUntil()`:

```js
async function runUntil(isDone, step, interval = 16) {
  let last = 0;
  while (!isDone()) {
    if (prefersReducedMotion()) {
      step();
      continue;
    }
    const now = await nextFrame();
    if (now - last >= interval) {
      step();
      last = now;
    }
  }
}
```

`nextFrame()` waits for `requestAnimationFrame`. The seed, tree-growth, and flowering animations pass an interval of 10 milliseconds, but updates still follow the browser's refresh frames. That number should not be read as drawing one hundred times per second.

Two things start immediately when the heart is clicked: the background music and the text area on the second page. Neither has to wait for the tree to finish growing. The little hearts drifting across the whole screen begin appearing after the SVG opening finishes and the button hides.

## Drawing branches with curves

The tree's outline is defined in `TreeShape` in `tree.js`. These are the trunk parameters:

```js
from: [535, 680],
control: [570, 250],
to: [500, 200],
radius: 30,
steps: 100,
```

`from` is the starting point, `to` is the endpoint, and `control` determines the bend. Canvas y-coordinates increase downward, so moving from `y = 680` to `y = 200` appears as growth upward from the ground.

The geometry helper calculates positions along a quadratic Bézier curve:

```js
function bezier(points, t) {
  const p0 = points[0];
  const p1 = points[1];
  const p2 = points[2];
  const s = 1 - t;
  return new Point(
    p0.x * s * s + 2 * p1.x * s * t + p2.x * t * t,
    p0.y * s * s + 2 * p1.y * s * t + p2.y * t * t
  );
}
```

As `t` goes from 0 to 1, the resulting point moves along the whole curve. Each call to `Branch.grow()` takes only two neighboring positions and draws the short segment between them:

```js
const t0 = this.step / this.steps;
const t1 = (this.step + 1) / this.steps;
const start = bezier(this.curve, t0);
const end = bezier(this.curve, t1);
```

Branch thickness also changes. The current radius is calculated as `initialRadius × 0.97^step`, becoming thinner toward the tip. Drawing uses twice the radius as the line width, round line caps and joins, and a little shadow in the same color to make the segments connect more smoothly.

Child branches are defined in the parent's `children`. They are added to the growth list only after their parent finishes; a batch of child branches can grow together. The tree's skeleton is predefined and follows the same curves each time the page opens. Most of the random variation comes from the flowers afterward.

## Arranging seven hundred flowers into a heart

Each flower is itself a small heart. The `Heart` class in `geometry.js` first samples points from these parametric equations:

```js
const x = 16 * Math.sin(t) ** 3;
const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
```

The points are connected into a `Path2D`. Drawing negates the y-coordinate to orient the heart for the canvas coordinate system. The seed and flowers share this path; each flower then receives its own position, rotation, and scale.

The entire canopy is also heart-shaped, but testing its boundary uses a different formula:

```js
function inHeart(x, y, r) {
  const nx = x / r;
  const ny = y / r;
  return (nx ** 2 + ny ** 2 - 1) ** 3 - nx ** 2 * ny ** 3 < 0;
}
```

`Tree.createBloom()` first picks a random point inside a rectangle, then uses `inHeart()` to check whether it falls within the heart. A flower is created only if the point is inside; otherwise, it tries again.

These are two distinct shapes: `Heart` determines how a single flower is drawn, while `inHeart()` determines where that flower can be placed. Flowers are not arranged individually along branches. They fill the heart-shaped region above the branches and together form the canopy.

The current configuration prepares 700 flowers in advance. Their distribution uses a `1080 × 650` region, and the heart test receives a size parameter of `240`. Each random point gets at most one thousand attempts. If none succeeds, it falls back to the center of the region to avoid looping indefinitely.

During flowering, each step brings out two new flowers. Each one begins at a scale of `0.1` and gradually grows:

```js
flower() {
  this.drawOn(this.tree.ctx);
  this.scale += 0.1;
  return this.scale <= 1;
}
```

Color, opacity, and angle also have random values, so the distribution and colors vary each time the page opens. Once a flower finishes enlarging, it leaves the active list, but it has already been drawn on the static canvas and remains in the canopy.

## The tree moves aside, and the letter starts typing

On desktop, adding the `shifted` class to the static canvas moves the tree to the right:

```css
#static-canvas { z-index: 1; transition: transform 1.5s ease-in-out; }
#static-canvas.shifted { transform: translateX(var(--tree-shift-x)); }
```

`--tree-shift-x` defaults to `260px`. The CSS movement lasts 1.5 seconds, and JavaScript waits 1600 milliseconds before displaying the letter. In normal playback, the tree therefore moves to the right before the text appears. When the scene is scaled, the movement distance on screen scales with it.

The first letter is stored in `letter` in `config.js`. `salutation` is the greeting, `paragraphs` is the body divided into stanzas, and `closing` is the ending. Each stanza is itself an array of lines. `initContent()` creates a `<p>` for every line and uses a `stanza` container to group lines from the same stanza.

Text is inserted with `textContent`:

```js
function addLine(parent, text, className = "") {
	const p = document.createElement("p");
	p.className = className;
	p.textContent = text;
	parent.appendChild(p);
}
```

The configuration content is displayed as plain text. Add another array item for a new line, or another nested array for a new stanza.

Before typing starts, `typewriter()` saves each paragraph's full text and then clears the paragraphs. It appends characters to text nodes one by one, with the same underscore cursor moving along the current line.

The typing intervals are not all identical:

```js
function charDelay(char, base) {
  if ("…".includes(char)) return base * 12;
  if ("。！？.!?".includes(char)) return base * 10;
  if ("，、；：,;:".includes(char)) return base * 5;
  return base + Math.random() * base * 0.5;
}
```

The default `base` is 100 milliseconds. Ordinary characters pause for about 100–150 milliseconds, commas for half a second, periods for one second, and ellipses for longer. Line breaks add an 800-millisecond pause. I find these pauses at punctuation and line endings more useful than simply making characters appear one at a time: longer sentences get some room to be read too.

`main.js` does not `await` the call to `typewriter(letter)`. The caption rotation beneath the tree and the continuous falling flowers therefore begin while the letter is still being typed; they do not need to wait for the entire letter.

## Mobile optimizations

At screen widths of `700px` or less, the page switches to a vertical layout: the letter comes first, the tree follows, and the tree's horizontal offset becomes zero. These are the relevant styles:

```css
@media (max-width: 700px) {
	:root { --tree-shift-x: 0px; }
	#viewport { display: flex; flex-direction: column; }
	#scene { order: 2; flex-shrink: 0; transform-origin: top left; }
	#letter {
		order: 1;
		position: relative;
		width: calc(100% - 3rem);
		min-height: var(--mobile-letter-height, 0px);
		font-size: 16px;
		line-height: 1.85;
	}
}
```

This excerpt keeps only the layout and sizing rules. On phones, the tree still scales proportionally, while the letter has its own fixed 16-pixel font size so that its text does not become too small along with the canvas.

When switching layouts, `animateMobileTreeMove()` first measures the tree's position, then allows the complete letter to participate in layout. The letter has the `mobile-letter-staging` class at this point: it takes up space but is not yet visible. The code saves its measured height:

```js
letter.style.setProperty("--mobile-letter-height", `${letter.getBoundingClientRect().height}px`);
```

When typing begins, the paragraphs are cleared, but the letter area retains the height needed for the full text. The tree does not keep jumping downward as each new line appears.

The tree's movement connects the old and new positions through their differences. These are the two keyframes:

```js
{ transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width})` },
{ transform: "translate(0, 0) scale(1)" }
```

The new layout is applied first. Translation and scaling temporarily restore the old position, then animate toward the new one. The tree therefore moves continuously as the mobile page transitions from its opening to the reading layout.

## Sentences beneath the tree and two kinds of falling flowers

`startTreeCaptionCarousel()` controls the text beneath the tree. It shows the first sentence in `treeCaptions` first, shuffles the remaining sentences, and takes them from the queue in turn. When the queue is exhausted, it shuffles again and tries to avoid repeating the same sentence consecutively.

Each sentence is typed character by character, held for a while, then deleted character by character from the end. Typing takes 100 milliseconds per character, and deletion takes 50 milliseconds. `treeCaptionInterval` defaults to 10000 milliseconds; the code subtracts the typing and deletion time to calculate the pause in between. A sufficiently long sentence can make a cycle exceed that interval.

This function prefers `Intl.Segmenter` to split text into graphemes, so combined emoji can be treated as a single unit. The first letter's typewriter uses ordinary character iteration instead; the two places do not split characters in exactly the same way.

The screen also has two implementations of falling flowers:

| Visible effect | Implementation |
| --- | --- |
| Little hearts falling near the canopy | Canvas `Bloom` objects; the dynamic canvas is cleared and redrawn each frame |
| Colorful little hearts crossing the whole screen | HTML `span` elements in `heart-petal-field`, moved by CSS keyframes |

The canopy's falling flowers retain the function name `startHeartJumpAnimation()`, but it actually runs `Bloom.fall()`. Petals have horizontal and vertical velocities, gradually descending while swaying sideways, rotating, and fading. Position updates use `dt / 16` to account for elapsed time, and each time delta is capped at 50 milliseconds to reduce sudden large jumps after a long pause.

At most 6 petals fall near the canopy at once. Their spawn positions read the CSS `--tree-shift-x`, so on desktop they appear near the shifted canopy; on mobile they also work with the offset set to zero.

The full-screen little hearts use the text character `♥`. The script randomly assigns colors, sizes, starting and ending positions, and rotation angles, then lets the `heart-petal-drift` keyframes animate them. Each drifts for about 16–25 seconds, with at most 16 present at once. Its node is removed when the animation finishes.

Initially, 9 are inserted with random negative delays, making them look as though they have already been drifting for a while. The effect covers the entire viewport and remains visible when scrolling to the second page. The decorative layer has `pointer-events: none`, so it does not block buttons or scrolling.

## An extra “easter egg” page below

The second page's text is written directly in the `afterword` area of `index.html`. Separate from the first letter's configuration, it uses ordinary article typography: a centered content area with a maximum width of `47rem`, and a background that transitions from the first screen's pale yellow to a slightly warmer shade.

`revealAfterword()` removes this area's `hidden` state when the opening heart is clicked. Once the page has been started, it is therefore possible to scroll down and read without waiting for the first letter to finish typing. The bottom arrow also appears at that point.

The “Scroll down” prompt appears a little later. The script observes the second line in the first stanza of the letter body:

```js
const secondLine = document.querySelector("#letter .stanza p:nth-child(2)");
```

A `MutationObserver` checks that line's text node and shows the prompt when its first character starts appearing. The salutation is not part of this stanza. This directly follows the typewriter's actual progress, so changing the earlier animations' duration does not require adjusting a separate fixed timer.

Clicking the arrow scrolls to the second page. Once the page has been scrolled down more than 100 pixels, both arrow and prompt fade out so they no longer occupy the reading area.

The second page's text also animates, but faster than the first screen's typewriter. An `IntersectionObserver` observes each paragraph and triggers it only once after it enters the observation area:

```js
const observer = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		observer.unobserve(entry.target);
		showParagraph(entry.target);
	}
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
```

`showParagraph()` splits text into groups of 3, 5, 4, and 6 characters in a repeating sequence, wraps each group in a `span`, and adds another 28 milliseconds of delay for each successive group. The styles bring them from a slightly lowered, transparent, blurred state back to normal text:

```css
.afterword-token {
	position: relative;
	top: 0.4em;
	opacity: 0;
	filter: blur(2px);
	transition: top 0.32s ease, opacity 0.32s ease, filter 0.32s ease;
	transition-delay: var(--token-delay);
}
.afterword-token.is-visible { top: 0; opacity: 1; filter: none; }
```

While reading, small groups of text become clear in succession. After a paragraph triggers, observation is removed and it is recorded as shown, so scrolling back up does not replay it. If the browser lacks `IntersectionObserver`, the code processes all paragraphs directly.

## Music and reduced-motion settings

Background music uses an ordinary `<audio>` element:

```html
<audio loop id="bgm" preload="none" src="/love/bgm.mp3"></audio>
```

Page initialization sets the volume to `0.45`, but `play()` is not called until the heart is clicked, when the music button in the bottom-right also appears. The button switches between “Play background music” and “Pause background music” according to the actual playback state, with `aria-pressed` kept in sync. If playback fails, the page can still run, and the button state follows the audio's actual state.

The animations also read the system's `prefers-reduced-motion` preference. With reduced motion enabled, the finite tree-growth and flowering stages execute directly to completion, the tree movement transition is skipped, and the entire letter is shown immediately. Continuous falling flowers, the opening heartbeat, the blinking cursor, and the arrow's vertical movement are also disabled; the second page's text remains normally visible.

When switching to another browser tab, canopy petals stop requesting animation frames, and full-screen little hearts are cleared and stop spawning. Both resume when the page becomes visible again. These two visibility handlers apply to the continuous falling flowers; the letter typewriter and the caption rotation do not have the same page-visibility handling.

The canvases and decorative layers use `aria-hidden`, while readable content remains in HTML. Buttons have keyboard focus styles, and controls fixed to screen edges take `safe-area-inset` into account to avoid sitting against a phone's unsafe edges.

## Where to look when changing things later

The first letter and the sentences beneath the tree are in the configuration, the second page's text is in HTML, and the tree shape and animation speeds have their own parameters. This table lists common places to look:

| What to change | Where to find it |
| --- | --- |
| The entry text `Falling for you` | `seedText` in `config.js` |
| The first letter's salutation, body, and closing | `letter` in `config.js` |
| Rotating sentences beneath the tree and their interval | `treeCaptions` and `treeCaptionInterval` in `config.js` |
| Text on the second page | The `afterword` area in `index.html` |
| The update time beneath the entry | The `intro-updated` and `time` elements in `index.html` |
| Background, text colors, and typography | `styles.css` |
| Branch positions, curvature, and thickness | `TreeShape.branches` in `js/tree.js` |
| Canopy flower count and distribution | `TreeShape.bloom` in `js/tree.js` |
| Seed speed, flowering speed, and continuous petal count | `AnimationConfig` in `js/animation.js` |
| The tree's horizontal movement distance on desktop | `--tree-shift-x` in `styles.css`, also read by the petal script |
| Background music and initial volume | `bgm.mp3` and `initMusic()` in `js/ui.js` |

A few details are easy to miss. `seedText` updates the text beside the entry, but the browser tab's `<title>` and the button's `aria-label` are still written in HTML. The entry's “Last updated” time is also entered manually; it does not read the file modification date.

The `Seed` class retains `drawText()` and `hover()`, but the current entry uses an HTML button. `main.js` calls `seed.drawHeart()` and does not use that canvas text-drawing and pixel-hit-testing implementation. When looking for the entry text or click behavior, `initContent()` and the button event are the more direct places to find the code actually in use.

Resource paths all begin with `/love/`. If the access path changes later, the style, script, icon, and music paths in HTML need to change together. The code still uses global references between ordinary scripts, so copying an individual JavaScript file will not reproduce the complete effect.

The page also specifies `noindex, nofollow, noarchive` and uses `data-pagefind-ignore="all"` to exclude it from site search. These markers control indexing; the page itself does not have an access password. One will be added later.
