import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const animation = readFileSync(new URL("../public/love/js/animation.js", import.meta.url), "utf8");
const main = readFileSync(new URL("../public/love/js/main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

test("the full-screen petal field starts only after the opening interaction", () => {
	assert.match(html, /id="heart-petal-field" aria-hidden="true"/);
	const opening = main.indexOf("await animateOpening(button, seed, staticCanvas)");
	const petals = main.indexOf("startAmbientHeartPetals()");
	assert.ok(opening >= 0 && petals > opening);
});

test("heart petals vary their path, size, color, rotation, and density", () => {
	assert.match(animation, /const maxPetals = 16/);
	assert.doesNotMatch(animation, /isMobile/);
	assert.match(animation, /--petal-size/);
	assert.match(animation, /--petal-color/);
	assert.match(animation, /--mid-x/);
	assert.match(animation, /--end-rotate/);
	assert.match(styles, /@keyframes heart-petal-drift/);
});

test("ambient petals stop for reduced motion and while the page is hidden", () => {
	assert.match(animation, /document\.hidden \|\| prefersReducedMotion\(\)/);
	assert.match(animation, /field\.replaceChildren\(\)/);
	assert.match(styles, /prefers-reduced-motion: reduce[\s\S]*#heart-petal-field \{ display: none/);
});
