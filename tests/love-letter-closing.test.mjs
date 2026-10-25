import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ui = readFileSync(new URL("../public/love/js/ui.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");

test("the love letter renders every closing line in order", () => {
	assert.match(ui, /closing\.className = "closing"/);
	assert.match(ui, /for \(const text of config\.letter\.closing\) addLine\(closing, text\)/);
	assert.match(ui, /letter\.appendChild\(closing\)/);
});

test("the entire quoted second-page passage and its empty wrapper are removed", () => {
	assert.doesNotMatch(html, /class="afterword-stanza afterword-vow"/);
	for (const line of ["哪怕你将我的双眼戳瞎", "我也会看着你", "哪怕你将我的耳朵刺破", "我也会倾听你", "哪怕我失去了双腿", "我也会朝向你前进", "哪怕我没有了嘴巴", "我也会呼唤你的名字", "哪怕双手被折断", "我也会抓到你", "我的心会如同手一般抓住你", "就算你压碎我的心脏 我的大脑大概也会像心脏一样鼓动的吧"]) {
		assert(!html.includes(line), line);
	}
});
