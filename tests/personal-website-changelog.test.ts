import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const changelog = readFileSync(
	new URL("../src/content/posts/personal-website-changelog.md", import.meta.url),
	"utf8",
);
const changelogTranslation = readFileSync(
	new URL(
		"../src/content/translations/personal-website-changelog.en.md",
		import.meta.url,
	),
	"utf8",
);
const contentUtils = readFileSync(
	new URL("../src/utils/content-utils.ts", import.meta.url),
	"utf8",
);
const postCard = readFileSync(
	new URL("../src/components/layout/PostCard.astro", import.meta.url),
	"utf8",
);
const postPage = readFileSync(
	new URL("../src/pages/posts/[...slug].astro", import.meta.url),
	"utf8",
);

test("the personal website changelog is published and pinned", () => {
	assert.match(changelog, /^title: 个人网站更新日志$/m);
	assert.match(changelog, /^published: 2026-09-12T18:00:00\+10:00$/m);
	assert.match(changelog, /^pinned: true$/m);
	assert.match(changelog, /^## 2026\.9\.12$/m);
	assert.match(changelog, /新增音乐模块播放记忆功能，数据形式为浏览器缓存/);
});

test("the changelog has a current English translation", () => {
	const sourceHash = createHash("sha256").update(changelog, "utf8").digest("hex");
	assert.match(
		changelogTranslation,
		/^translationOf: personal-website-changelog\.md$/m,
	);
	assert.match(changelogTranslation, new RegExp(`^sourceHash: sha256:${sourceHash}$`, "m"));
	assert.match(changelogTranslation, /^## September 12, 2026$/m);
});

test("the introduction remains first and the changelog is pinned second", () => {
	const introduction = contentUtils.indexOf('"personal-website-introduction"');
	const updateLog = contentUtils.indexOf('"personal-website-changelog"');
	assert.ok(introduction >= 0);
	assert.ok(updateLog > introduction);
	assert.match(contentUtils, /getPinnedPostOrder\(a\.id\) - getPinnedPostOrder\(b\.id\)/);
});

test("the changelog title uses the same primary color as the introduction", () => {
	for (const source of [postCard, postPage]) {
		assert.match(source, /entry\.id === "personal-website-introduction"/);
		assert.match(source, /entry\.id === "personal-website-changelog"/);
		assert.match(source, /usesPrimaryTitleColor \? "color: var\(--primary\);"/);
	}
});
