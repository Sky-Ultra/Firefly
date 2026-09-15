import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ui = readFileSync(new URL("../public/love/js/ui.js", import.meta.url), "utf8");

test("the love letter renders every closing line in order", () => {
	assert.match(ui, /closing\.className = "closing"/);
	assert.match(ui, /for \(const text of config\.letter\.closing\) addLine\(closing, text\)/);
	assert.match(ui, /letter\.appendChild\(closing\)/);
});
