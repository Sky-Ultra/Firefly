import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const configSource = readFileSync(new URL("../public/love/config.js", import.meta.url), "utf8");
const config = vm.runInNewContext(`${configSource};CONFIG`);
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const main = readFileSync(new URL("../public/love/js/main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

test("the tree caption has the exact requested copy and a dedicated region", () => {
	assert.equal(config.treeCaption, "陪你看日升月潜，陪你看沧海变迁~");
	assert.match(html, /id="tree-caption" aria-label="树下寄语" hidden/);
});

test("the tree caption types after the tree finishes moving", () => {
	const move = main.indexOf("await animateTreeMove(staticCanvas)");
	const show = main.indexOf("treeCaption.hidden = false");
	const type = main.indexOf("typewriter(treeCaption, 115)");
	assert.ok(move >= 0 && show > move && type > show);
});

test("the caption uses a leaf-colored flowing gradient with accessible fallbacks", () => {
	assert.match(styles, /#tree-caption p \{[\s\S]*linear-gradient\(90deg,[\s\S]*#ff3f8e[\s\S]*#ffd33d/);
	assert.match(styles, /animation: leaf-color-flow 5\.5s linear infinite/);
	assert.match(styles, /prefers-reduced-motion: reduce[\s\S]*#tree-caption p \{ animation: none/);
	assert.match(styles, /forced-colors: active/);
});
