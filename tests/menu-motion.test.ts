import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { getCardHoverTarget } from "../src/utils/card-hover-motion";

const source = (path: string) => {
	const file = new URL(`../src/${path}`, import.meta.url);
	assert.ok(existsSync(file), `${path} exists`);
	return readFileSync(file, "utf8");
};

test("menu magnetic hover shares the card spring with a smaller bounded strength", () => {
	assert.deepEqual(
		getCardHoverTarget(
			200,
			40,
			{ left: 0, top: 0, width: 200, height: 40 },
			0.45,
		),
		{ x: 2.7, y: 2.25 },
	);
	assert.deepEqual(
		getCardHoverTarget(200, 40, { left: 0, top: 0, width: 200, height: 40 }),
		{ x: 6, y: 5 },
	);
});

test("only expanded navigation children share the magnetic wrapper in desktop and mobile menus", () => {
	for (const path of [
		"components/layout/DropdownMenu.astro",
		"components/layout/Navbar.astro",
		"components/layout/NavMenuPanel.astro",
	]) {
		const content = source(path);
		assert.match(content, /MagneticMenuItem/);
		assert.equal((content.match(/<MagneticMenuItem>/g) ?? []).length, 1);
		assert.doesNotMatch(content, /<MagneticMenuItem[^>]*enabled/);
		assert.match(
			content,
			/children\??\.map\([\s\S]*?<MagneticMenuItem>\s*<(?:DropdownItem|a)\b/,
		);
	}
	const component = source("components/common/MagneticMenuItem.astro");
	assert.match(component, /data-hover-strength="0\.45"/);
	assert.match(component, /<slot\s*\/>/);
	const runtime = source("utils/magnetic-post-card.ts");
	assert.match(runtime, /customElements\.define\(\s*"magnetic-menu-item"/);
	assert.match(
		source("styles/menu-motion.css"),
		/prefers-reduced-motion: reduce/,
	);
});
