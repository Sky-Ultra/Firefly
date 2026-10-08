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

test("preserves every source line's wording and order while adjusting Markdown formatting", () => {
	const body = bodyOf(
		readArticle("posts/from-matrilineal-society-to-patriarchy.md"),
	);
	const canonical = body
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
		"143cb08a52b703668144da2c3bb9bad0862748a47bdac971fd70d10118fdba07",
	);
});

test("formats the opening as three quote paragraphs and nests headings below the page title", () => {
	const body = bodyOf(
		readArticle("posts/from-matrilineal-society-to-patriarchy.md"),
	);
	assert.match(body.trimStart(), /^> 最近网络上的声音很大/);
	assert.match(body, /^> 再次叠甲，/m);
	assert.match(body, /^> 再次声明，/m);
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
