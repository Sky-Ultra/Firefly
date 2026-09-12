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

test("the relationship card has extra vertical space and themed verses", () => {
	assert.match(component, /px-2 pb-5 pt-3/);
	assert.match(component, /晓看天色暮看云，行也思君，坐也思君/);
	assert.match(component, /愿我如星君如月，夜夜流光相皎洁/);
	assert.match(component, /mt-5 space-y-1\.5 text-center text-xs leading-5 text-\(--primary\)/);
});
