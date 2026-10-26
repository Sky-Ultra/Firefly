import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const contentRoot = new URL("../src/content/", import.meta.url);
const read = (file: string) =>
	readFileSync(new URL(file, contentRoot), "utf8").replaceAll("\r\n", "\n");
const changelog = read("posts/personal-website-changelog.md");
const english = read("translations/personal-website-changelog.en.md");
const sections = new Map(
	Array.from(
		changelog.matchAll(
			/^## (2026\.\d+\.\d+)\n\n([\s\S]*?)(?=\n## |(?![\s\S]))/gm,
		),
		(match) => [match[1], match[2]],
	),
);
const articles = [
	["2026.10.10", "liking", "⌈喜欢⌋"],
	["2026.10.12", "love-tree-guide", "告白树/恋爱树的实现方式和原理"],
	["2026.10.14", "rhine-lab-archives-guide", "莱茵生命档案的代码实现和细节"],
	["2026.10.16", "the-risk-of-forming-bonds", "制造羁绊，就要承受落泪的风险"],
	["2026.10.17", "daylights-last-letter", "白昼的遗书"],
	[
		"2026.10.18",
		"between-bases-dna-website-guide",
		"碱基之间：脱氧核糖核酸展示网站的技术实现与知识库展示",
	],
	[
		"2026.10.19",
		"what-are-liking-and-love",
		"所以，究竟何为⌈喜欢⌋，何为⌈爱⌋...？",
	],
	[
		"2026.10.21",
		"growth-and-the-whole-self",
		"“成长不是成为更好的自己，而是拼凑完整的自己”",
	],
	[
		"2026.10.21",
		"marriage-risks-and-costs",
		"对婚姻的的风险与代价的思考：对文章“穷人为何保持贫穷”的深入理解",
	],
	["2026.10.22", "summer-passes-and-we-grow-up", "夏天总会过去，而人总要长大"],
	[
		"2026.10.23",
		"human-transformer",
		"人类就是一个Transformer：在注意力机制的尽头...",
	],
	["2026.10.24", "with-myself-through-joy-and-sorrow", "“我与自己 悲喜同舟”"],
] as const;

test("backfills the twelve missing articles once under their actual publication dates", () => {
	for (const [date, slug, title] of articles) {
		assert.ok(
			sections.get(date)?.includes(`- 更新了文章：[${title}](/posts/${slug}/)`),
			`${date}: ${title}`,
		);
		assert.ok(english.includes(`](/posts/${slug}/)`), `English link: ${slug}`);
		assert.equal(
			changelog.split(`- 更新了文章：[${title}](/posts/${slug}/)`).length - 1,
			1,
		);
	}
	assert.equal((changelog.match(/^## 2026\.10\.21$/gm) ?? []).length, 1);
	const october18 = sections.get("2026.10.18");
	assert.ok(october18);
	assert.ok(
		october18.indexOf("Image API Error") < october18.indexOf("更新了文章"),
	);
});

test("adds screenshot updates in order with real feature links and label-only highlights", () => {
	for (const [date, phrases] of [
		[
			"2026.10.11",
			[
				"更新了[恋爱计时模块](/)的部分信息",
				"更新了[关于我？](/about/) 标签页下的部分信息",
			],
		],
		[
			"2026.10.15",
			["[最近发生的事](/activity/)", "[风向标](/#footer-windsock-title)"],
		],
		[
			"2026.10.18",
			[
				'<mark class="theme-highlight">重要更新</mark>：',
				"果冻效果",
				"仅在电脑端生效",
				"新增部分图片素材资源",
				"Image API Error",
			],
		],
		[
			"2026.10.20",
			[
				'<mark class="theme-highlight">重要更新</mark>：',
				"[全新的分享方式](/posts/homepage-welcome-messages/)",
				"Astro",
				"文字长图",
				"我们优化了[评论区](/guestbook/#post-comments)功能",
			],
		],
		[
			"2026.10.25",
			[
				"我们为[评论区](/guestbook/#post-comments)全新增加了匿名评论功能，在该功能下，你的评论不会被其他人看见",
			],
		],
	] as const) {
		const section = sections.get(date);
		assert.ok(section, date);
		let previous = -1;
		for (const phrase of phrases) {
			const position = section.indexOf(phrase);
			assert.ok(position >= previous && position >= 0, phrase);
			previous = position;
		}
	}
	assert.equal((changelog.match(/^## /gm) ?? []).length, sections.size);
	const chineseHighlights = (
		changelog.match(/<mark class="theme-highlight">重要更新<\/mark>：/g) ?? []
	).length;
	// Preserve the backfilled labels while allowing later major updates.
	assert.ok(chineseHighlights >= 9);
	assert.equal(
		(
			english.match(/<mark class="theme-highlight">Major update<\/mark>:/g) ??
			[]
		).length,
		chineseHighlights,
	);
});

test("all public articles since the changelog began are linked in their publication-date section", () => {
	const root = new URL("posts/", contentRoot);
	const visit = (directory: URL) => {
		for (const item of readdirSync(directory, { withFileTypes: true })) {
			const location = new URL(
				item.name + (item.isDirectory() ? "/" : ""),
				directory,
			);
			if (item.isDirectory()) {
				visit(location);
				continue;
			}
			if (!/\.mdx?$/.test(item.name)) continue;
			const raw = readFileSync(location, "utf8").replaceAll("\r\n", "\n");
			const header = raw.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || "";
			if (/^draft:\s*true(?:\s|$)/im.test(header)) continue;
			const password = header
				.match(/^password:\s*(.*)$/m)?.[1]
				?.trim()
				.replace(/^['"]|['"]$/g, "");
			if (password) continue;
			const published = header
				.match(/^published:\s*(.*)$/m)?.[1]
				?.replace(/^['"]|['"]$/g, "")
				.slice(0, 10);
			if (!published || published < "2026-09-12") continue;
			const relative = path.posix.relative(
				decodeURIComponent(root.pathname),
				decodeURIComponent(location.pathname),
			);
			const slug = relative
				.replace(/\/index\.mdx?$/, "")
				.replace(/\.mdx?$/, "");
			if (slug === "personal-website-changelog") continue;
			const date = published.split("-").map(Number).join(".");
			assert.ok(
				sections.get(date)?.includes(`](/posts/${slug}/)`),
				`Missing public article ${slug} in ${date}`,
			);
		}
	};
	visit(root);
});

test("pins the welcome showcase while retaining its original publication and no password", () => {
	const welcome = read("posts/homepage-welcome-messages.md");
	assert.match(welcome, /^pinned: true$/m);
	assert.match(welcome, /^published: 2026-09-30$/m);
	assert.doesNotMatch(welcome, /^password:/m);
});
