import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync(
	new URL("../src/components/widget/RelationshipTimer.astro", import.meta.url),
	"utf8",
);

test("the relationship heart is an accessible repeatable interaction", () => {
	assert.match(
		component,
		/<button[\s\S]*?data-heart-trigger[\s\S]*?aria-label="点击爱心"/,
	);
	assert.match(component, /data-i18n-en="Tap the heart"/);
	assert.match(
		component,
		/addEventListener\("click", this\.handleHeartClick\)/,
	);
	assert.match(component, /MAX_FLOATING_HEARTS = 28/);
});

test("clicked hearts float with varied motion and respect reduced motion", () => {
	assert.match(component, /data-heart-burst-layer/);
	assert.match(component, /floatingHeart\.animate/);
	assert.match(component, /Math\.random\(\).*56/);
	assert.match(component, /prefers-reduced-motion: reduce/);
	assert.match(component, /heartButtonAnimation = trigger\.animate/);
});
