import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";
import { siteConfig } from "../src/config/siteConfig";
import { remarkReadingTime } from "../src/plugins/remark-reading-time.mjs";

const post = readFileSync(
	new URL("../src/content/posts/long-night-love-letter.md", import.meta.url),
	"utf8",
);
const translation = readFileSync(
	new URL(
		"../src/content/translations/long-night-love-letter.en.md",
		import.meta.url,
	),
	"utf8",
);

test("the new letter has the requested public metadata while its source contains only a sealed body", () => {
	assert.match(post, /^title: ⌈长夜⌋的情书$/m);
	assert.match(post, /^published: 2026-10-28$/m);
	assert.match(post, /^author: Sky$/m);
	assert.match(
		post,
		/description: \|-\n {2}唔，这真的是一封情书哦\.\.\.\n {2}但是，是给谁的呢\.\.\.？/,
	);
	assert.match(post, /^password: sealed$/m);
	assert.match(
		post,
		/passwordHint: \|-\n {2}⌈她⌋的诞日\.\.\.\n {2}例：20070427/,
	);
	assert.match(
		post,
		/sealedContent:\n {2}passwordLength: 8\n {2}payload: [A-Za-z0-9+/]+=*/,
	);
	const body = post.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
	assert.equal(body, "本篇文章已加密，请在页面中输入密码阅读。");
	assert.ok(translation.includes(computeSourceHash(post)));
});

test("sealed reading statistics describe the actual body rather than the short locked-page notice", () => {
	const plugin = remarkReadingTime();
	const stats = { words: 3805, minutes: 19 };
	const file = {
		data: { astro: { frontmatter: { sealedReadingStats: stats } } },
	};
	plugin({ type: "root", children: [] }, file);
	assert.equal(file.data.astro.frontmatter.words, stats.words);
	assert.equal(file.data.astro.frontmatter.minutes, stats.minutes);
});

test("word counts are enabled for every article card while reading time stays hidden", () => {
	assert.equal(siteConfig.postListLayout.meta?.showWords, true);
	assert.equal(siteConfig.postListLayout.meta?.showReadingTime, false);
	const meta = readFileSync(
		new URL("../src/components/layout/PostMeta.astro", import.meta.url),
		"utf8",
	);
	assert.ok(meta.includes("data-post-word-count"));
	assert.ok(meta.includes("whitespace-nowrap"));
});

test("the changelog records only the article publication under October 28", () => {
	const changelog = readFileSync(
		new URL(
			"../src/content/posts/personal-website-changelog.md",
			import.meta.url,
		),
		"utf8",
	);
	const section = changelog.split("## 2026.10.28\n")[1]?.trim();
	assert.equal(
		section,
		"- 更新了文章：[⌈长夜⌋的情书](/posts/long-night-love-letter/)",
	);
});
