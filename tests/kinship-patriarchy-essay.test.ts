import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readArticle = (relativePath: string): string => {
	const location = new URL(`../src/content/${relativePath}`, import.meta.url);
	assert.ok(existsSync(location), `The essay file exists: ${relativePath}`);
	return readFileSync(location, "utf8");
};
const bodyOf = (content: string): string =>
	content.replaceAll("\r\n", "\n").replace(/^---\n[\s\S]*?\n---\n/, "");

test("publishes the kinship essay with the requested metadata and Sky as author", () => {
	const article = readArticle(
		"posts/from-matrilineal-society-to-patriarchy.md",
	);
	assert.match(
		article,
		/^title: 从母系社会到父权制度：亲缘、私有制与现代性别关系的演变\(浅谈男女对立\)$/m,
	);
	assert.match(
		article,
		/^description: 从亲缘确认、私有制和生产方式出发，浅谈母系亲缘结构、父权制度与现代男女对立背后的历史逻辑。$/m,
	);
	for (const field of [
		"published: 2026-10-08",
		"author: Sky",
		"category: 随笔",
		"categoryEn: Essay",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(article.split("\n").includes(field), field);
	}
});

test("preserves the main essay's wording and order after the user revised its opening", () => {
	const body = bodyOf(
		readArticle("posts/from-matrilineal-society-to-patriarchy.md"),
	);
	const canonical = body
		.slice(body.indexOf("## 引言："))
		.trim()
		.split("\n")
		.map((line) =>
			line
				.replace(/^#{1,6}\s+/, "")
				.replace(/^>\s?/, "")
				.replace(/^[-*]\s+/, "")
				.trim(),
		)
		.filter((line) => line && line !== "---")
		.join("\n");
	assert.equal(
		createHash("sha256").update(canonical, "utf8").digest("hex"),
		"4042d1e53427716834d359c5cb512c024314cbc1b6f31ec889f8e436c5555984",
	);
});

test("reuses the full existing disclaimer before the remaining clarification", () => {
	const body = bodyOf(
		readArticle("posts/from-matrilineal-society-to-patriarchy.md"),
	);
	const existingDisclaimer = bodyOf(
		readArticle("posts/why-the-poor-stay-poor.md"),
	)
		.trimStart()
		.split('\n\n<div class="word-paragraph-gap"')[0];
	assert.ok(body.trimStart().startsWith(`${existingDisclaimer}\n\n`));
	assert.equal((body.match(/\*\*免责声明：\*\*/g) ?? []).length, 1);
	assert.equal((body.match(/<mark class="theme-highlight">/g) ?? []).length, 3);
	assert.match(body, /\[关于我\]\(\/about\/\)/);
	assert.ok(body.indexOf("**免责声明：**") < body.indexOf("> 再次叠甲，"));
	assert.doesNotMatch(body, /最近网络上的声音很大|再次声明，本站文章/);
});

test("keeps the clarification separate and nests headings below the page title", () => {
	const body = bodyOf(
		readArticle("posts/from-matrilineal-society-to-patriarchy.md"),
	);
	assert.match(
		body,
		/<div class="word-paragraph-gap"[^\n]*><\/div>\n\n> 再次叠甲，/,
	);
	assert.match(body, /^> 再次叠甲，/m);
	assert.doesNotMatch(body, /^# /m);
	assert.equal((body.match(/^## /gm) ?? []).length, 12);
	assert.equal((body.match(/^### /gm) ?? []).length, 13);
	assert.equal((body.match(/^```text$/gm) ?? []).length, 4);
});

test("pairs the complete English article with the current Chinese revision", () => {
	const article = readArticle(
		"posts/from-matrilineal-society-to-patriarchy.md",
	);
	const translation = readArticle(
		"translations/from-matrilineal-society-to-patriarchy.en.md",
	);
	assert.match(
		translation,
		/^translationOf: from-matrilineal-society-to-patriarchy\.md$/m,
	);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(article)}$`, "m"),
	);
	const body = bodyOf(translation);
	assert.ok(
		body.length > 6000,
		"The complete article is translated, not a placeholder",
	);
	assert.equal((body.match(/^#{2,3} /gm) ?? []).length, 25);
	assert.equal((body.match(/^```text$/gm) ?? []).length, 4);
	assert.match(body, /It will continue searching for a new balance\.\s*$/);
});

test("synchronizes the English disclaimer and the user's opening removals", () => {
	const translation = bodyOf(
		readArticle("translations/from-matrilineal-society-to-patriarchy.en.md"),
	);
	const existingDisclaimer = bodyOf(
		readArticle("translations/why-the-poor-stay-poor.en.md"),
	)
		.trimStart()
		.split('\n\n<div class="word-paragraph-gap"')[0];
	assert.ok(translation.trimStart().startsWith(`${existingDisclaimer}\n\n`));
	assert.ok(
		translation.indexOf("**Disclaimer:**") <
			translation.indexOf("> Another clarification:"),
	);
	assert.doesNotMatch(
		translation,
		/There has been a great deal of noise online recently|Once again, articles on this site/,
	);
});
