import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const article = readFileSync(
	new URL("../src/content/posts/summer-is-still-there.md", import.meta.url),
	"utf8",
);
const translation = readFileSync(
	new URL(
		"../src/content/translations/summer-is-still-there.en.md",
		import.meta.url,
	),
	"utf8",
);

test("publishes the summer essay with the requested metadata", () => {
	assert.match(article, /^title: 夏天还在那里$/m);
	assert.match(article, /^published: 2026-09-16$/m);
	assert.match(article, /^image: random$/m);
	assert.match(
		article,
		/description: \|-\n {2}我讨厌夏天\n {2}明年，夏天依旧如期而至/,
	);
});

test("preserves the source essay from its opening to its closing", () => {
	assert.match(article, /我讨厌夏天。/);
	assert.match(
		article,
		/此时相望不相闻，愿逐月华流照君。鸿雁长飞光不度，鱼龙潜跃水成文。/,
	);
	assert.match(article, /明年，夏天依旧会如期而至\s*$/);
});

test("keeps the paired English translation current", () => {
	const sourceHash = createHash("sha256").update(article, "utf8").digest("hex");
	assert.match(translation, /^translationOf: summer-is-still-there\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: sha256:${sourceHash}$`, "m"),
	);
});
