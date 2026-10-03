import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const article = readFileSync(
	new URL("../src/content/posts/why-the-poor-stay-poor.md", import.meta.url),
	"utf8",
);
const translation = readFileSync(
	new URL(
		"../src/content/translations/why-the-poor-stay-poor.en.md",
		import.meta.url,
	),
	"utf8",
);
const styles = readFileSync(
	new URL("../src/styles/markdown.css", import.meta.url),
	"utf8",
);

test("publishes the poverty essay with the requested date and description", () => {
	assert.match(article, /^title: 为何穷人会一直保持他们的贫穷？$/m);
	assert.match(article, /^published: 2026-10-03$/m);
	assert.match(article, /^description: 一些简单浅薄的思考$/m);
	assert.match(article, /^category: 随笔$/m);
	assert.match(article, /^image: random$/m);
	assert.match(article, /^comment: true$/m);
	assert.match(article, /^draft: false$/m);
});

test("highlights all paragraphs of the two requested statements", () => {
	const highlights = Array.from(
		article.matchAll(/<mark class="theme-highlight">([^<]+)<\/mark>/g),
		(match) => match[1],
	);
	assert.deepEqual(highlights, [
		"我自己是个男生，有喜欢的女孩，也深刻明白女性结婚的风险",
		"其次文章仅代表观点以及一些浅薄的思考。我自身定不在此列且会引以为戒",
		"这意味着我不代表任何立场，不代表男女也不制造对立。我仅作为我自己以及网站xiaoxiaoboluo.cn 进行",
	]);
	assert.equal(
		(translation.match(/<mark class="theme-highlight">/g) ?? []).length,
		3,
	);
});

test("uses a theme-aware highlighter that stays readable and wraps with each line", () => {
	const highlighter = styles.match(/mark\.theme-highlight\s*\{([^}]+)\}/)?.[1];
	assert.ok(highlighter);
	assert.match(highlighter, /background-color:\s*var\(--selection-bg\)/);
	assert.match(highlighter, /color:\s*inherit/);
	assert.match(highlighter, /box-decoration-break:\s*clone/);
});

test("preserves the Word document's one, two and three empty paragraphs", () => {
	const emptyParagraphs = (content: string): number[] =>
		Array.from(content.matchAll(/data-empty-paragraphs="(\d+)"/g), (match) =>
			Number(match[1]),
		);
	assert.deepEqual(emptyParagraphs(article), [1, 1, 2, 2, 3]);
	assert.deepEqual(emptyParagraphs(translation), [1, 1, 2, 2, 3]);
	assert.match(styles, /\.word-paragraph-gap\s*\{/);
	assert.match(
		styles,
		/height:\s*calc\(var\(--empty-paragraphs\)\s*\*\s*1lh\)/,
	);
});

test("groups the disclaimer in the site's left-bordered quote style", () => {
	assert.match(article, /^> \*\*免责声明：\*\*$/m);
	assert.match(translation, /^> \*\*Disclaimer:\*\*$/m);
	for (const content of [article, translation]) {
		assert.equal(
			(content.match(/^> <mark class="theme-highlight">/gm) ?? []).length,
			3,
		);
	}
});

test("updates the opening and links to About Me immediately after the highlighted personal statement", () => {
	assert.match(article, /^> 首先我个人性格比较随和且情绪很稳定。/m);
	assert.doesNotMatch(article, /首先我个人性格很随和也没啥脾气/);
	assert.match(
		article,
		/我自己是个男生，有喜欢的女孩，也深刻明白女性结婚的风险<\/mark> \[关于我\]\(\/about\/\)/,
	);
	assert.match(
		translation,
		/^> First of all, I am fairly easygoing and emotionally very stable\./m,
	);
	assert.match(translation, /marriage\.<\/mark> \[About Me\]\(\/about\/\)/);
});

test("keeps the paired English translation current", () => {
	const sourceHash = createHash("sha256").update(article, "utf8").digest("hex");
	assert.match(translation, /^translationOf: why-the-poor-stay-poor\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: sha256:${sourceHash}$`, "m"),
	);
});
