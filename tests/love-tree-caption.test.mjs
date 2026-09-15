import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const configSource = readFileSync(new URL("../public/love/config.js", import.meta.url), "utf8");
const config = vm.runInNewContext(`${configSource};CONFIG`);
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const main = readFileSync(new URL("../public/love/js/main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

test("the tree caption has its own exact phrase pool and a dedicated region", () => {
	assert.deepEqual(Array.from(config.treeCaptions), [
		"陪你看日升月潜，陪你看沧海变迁~",
		"我愿将心向明月",
		"此时相望不相闻，愿逐月华流照君",
		"南风知我意，吹梦到西洲",
		"海上月是天上月，眼前人是心上人",
		"白茶清欢无别事，我在等风也等你",
		"我喜欢你",
	]);
	assert.deepEqual(Array.from(config.letter.closing), [
		"晓看天色暮看云，行也思君，坐也思君❤",
		"我喜欢你",
	]);
	assert.equal(config.treeCaptionInterval, 10000);
	assert.match(html, /id="tree-caption" aria-label="树下寄语" hidden/);
});

test("the tree caption carousel starts after the tree finishes moving", () => {
	const move = main.indexOf("await animateTreeMove(staticCanvas)");
	const show = main.indexOf("treeCaption.hidden = false");
	const carousel = main.indexOf("startTreeCaptionCarousel(treeCaption, CONFIG.treeCaptions, CONFIG.treeCaptionInterval)");
	assert.ok(move >= 0 && show > move && carousel > show);
});

test("the caption uses fixed pale pink with accessible fallbacks", () => {
	assert.match(styles, /#tree-caption p \{[\s\S]*color: #ee9eb8/);
	assert.doesNotMatch(styles, /leaf-color-flow/);
	assert.match(styles, /forced-colors: active/);
});
