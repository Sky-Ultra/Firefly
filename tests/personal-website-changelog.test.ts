import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const changelog = readFileSync(
	new URL(
		"../src/content/posts/personal-website-changelog.md",
		import.meta.url,
	),
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

const bodyOf = (content: string): string =>
	content.replaceAll("\r\n", "\n").replace(/^---\n[\s\S]*?\n---\n/, "");

const withoutHighlights = (content: string): string =>
	content.replace(/<mark class="theme-highlight">([^<]+)<\/mark>/g, "$1");

const newDocumentEntries = [
	{
		date: "2026.9.30",
		items: ["更新文章：欢迎词文案展示"],
	},
	{
		date: "2026.10.2",
		items: [
			"更新文章：陈情赋-念",
			"新增全新图片内容",
			"更新“关于我”标签页内容",
			"修复偶发的IP获取问题",
			"修复偶发的音乐模块加载问题",
		],
	},
	{
		date: "2026.10.3",
		items: [
			"更新文章：为何部分“穷人”会一直保持他们的贫穷？",
			"重要更新：新增我的-足迹页面。展示目前部分我所记得的去过的地点。后续会持续更新未来以及过去我去过的地点",
			"在我的-游戏页面新增了更多玩过的游戏",
			"新增了用户协议与免责声明",
		],
	},
	{
		date: "2026.10.8",
		items: [
			"今天的更新较多且比较重大。大幅度美化和优化了整体页面",
			"更新文章：从母系社会到父权制度：亲缘、私有制与现代性别关系的演变(浅谈男女对立)",
			"重要更新：为侧边组件增加原创设计的线条淡色图案，并增加轻微的悬停动画",
			"重要更新：为文章标签增加原创设计的线条淡色图案，并增加轻微的悬停动画",
			"重要更新：新增我的-工具页面。神器库。在这里可以找到我做的部分项目以及我喜欢或者推荐使用的开源项目",
			"重要更新：更新美化了网页底部，新增二次元趴趴玩偶，且改善底部UI效果显示，增加一体性设计。新增网页标签信息展示",
			"新增大量新的图片。新增主页欢迎词。",
			"新增资料贴纸，可以进行拖动交互。",
			"更新“关于我”标签页的部分信息",
			"重要更新：大幅度改善部署在个人网站其他的我自己制作的 网站/网页/页面 的访问流畅度以及体验。欢迎重新访问这些标签以获得更好的体验！",
		],
	},
];

test("the personal website changelog is published and pinned", () => {
	assert.match(changelog, /^title: 个人网站更新日志$/m);
	assert.match(changelog, /^published: 2026-09-12T18:00:00\+10:00$/m);
	assert.match(changelog, /^pinned: true$/m);
	assert.match(changelog, /^## 2026\.9\.12$/m);
	assert.match(changelog, /新增音乐模块播放记忆功能，数据形式为浏览器缓存/);
	assert.match(changelog, /^## 2026\.9\.16$/m);
	assert.match(changelog, /^## 2026\.9\.18$/m);
	assert.match(changelog, /^## 2026\.9\.20$/m);
	assert.match(changelog, /^## 2026\.9\.22$/m);
	assert.match(changelog, /^## 2026\.9\.24$/m);
	assert.match(changelog, /\[我们终将重逢\]\(\/posts\/we-will-meet-again\/\)/);
	assert.match(changelog, /^## 2026\.9\.25$/m);
	assert.match(
		changelog,
		/\[⌈致以无瑕之人⌋\]\(\/posts\/to-the-flawless-one\/\)/,
	);
	assert.match(
		changelog,
		/\[《安装并激活 Microsoft Office》\]\(\/posts\/install-and-activate-microsoft-office\/\)/,
	);
});

test("the changelog has a current English translation", () => {
	const sourceHash = computeSourceHash(changelog);
	assert.match(
		changelogTranslation,
		/^translationOf: personal-website-changelog\.md$/m,
	);
	assert.match(
		changelogTranslation,
		new RegExp(`^sourceHash: ${sourceHash}$`, "m"),
	);
	assert.match(changelogTranslation, /^## September 12, 2026$/m);
	assert.match(changelogTranslation, /^## September 22, 2026$/m);
	assert.match(changelogTranslation, /^## September 24, 2026$/m);
	assert.match(changelogTranslation, /^## September 25, 2026$/m);
});

test("preserves the existing history wording apart from the removed login suffix", () => {
	const oldHistory = withoutHighlights(bodyOf(changelog))
		.split("\n## 2026.9.30")[0]
		.trim();
	assert.equal(
		createHash("sha256").update(oldHistory, "utf8").digest("hex"),
		"774c2553c0aa057c56333498e2f96f6d27f7684ca2b610fa3fb6eabd9d9bbff7",
	);
	assert.ok(changelog.includes("- 开放许可动态留言功能\n"));
	assert.ok(!changelog.includes("，目前仅支持 GitHub 账号登录"));
});

test("appends every September 30 onward Word entry in its original date and order", () => {
	const sections = new Map(
		Array.from(
			bodyOf(changelog).matchAll(
				/^## (2026\.\d+\.\d+)\n\n([\s\S]*?)(?=\n## |(?![\s\S]))/gm,
			),
			(match) => [match[1], match[2]],
		),
	);
	const newDates = Array.from(sections.keys()).filter((date) =>
		newDocumentEntries.some((entry) => entry.date === date),
	);
	assert.deepEqual(
		newDates,
		newDocumentEntries.map((entry) => entry.date),
	);
	for (const entry of newDocumentEntries) {
		const section = sections.get(entry.date);
		assert.ok(section, `Missing date: ${entry.date}`);
		const items = section
			.split("\n")
			.filter((line) => line.startsWith("- "))
			.map((line) =>
				withoutHighlights(line.slice(2)).replace(
					/\[([^\]]+)\]\([^)]*\)/g,
					"$1",
				),
			);
		assert.deepEqual(items, entry.items, entry.date);
	}
	assert.ok(changelog.includes("updated: 2026-10-10"));
});

test("every major-update label uses the existing theme highlighter without highlighting punctuation", () => {
	const chineseLabels = (changelog.match(/重要更新/g) ?? []).length;
	assert.ok(chineseLabels >= 7);
	assert.equal(
		(changelog.match(/<mark class="theme-highlight">重要更新<\/mark>：/g) ?? [])
			.length,
		chineseLabels,
	);
	const englishLabels = (changelogTranslation.match(/Major update/g) ?? [])
		.length;
	assert.equal(englishLabels, chineseLabels);
	assert.equal(
		(
			changelogTranslation.match(
				/<mark class="theme-highlight">Major update<\/mark>:/g,
			) ?? []
		).length,
		englishLabels,
	);
});

test("keeps new article links usable and synchronizes the English changelog", () => {
	for (const slug of [
		"homepage-welcome-messages",
		"chenqing-fu-nian",
		"why-the-poor-stay-poor",
		"from-matrilineal-society-to-patriarchy",
	]) {
		assert.ok(changelog.includes(`](/posts/${slug}/)`), slug);
		assert.ok(changelogTranslation.includes(`](/posts/${slug}/)`), slug);
	}
	for (const date of ["September 30", "October 2", "October 3", "October 8"]) {
		assert.ok(changelogTranslation.includes(`## ${date}, 2026`), date);
	}
	assert.ok(
		!changelogTranslation.includes(
			"sign-in currently supports GitHub accounts only",
		),
	);
});

test("links newly mentioned site pages, including every About Me update", () => {
	for (const target of [
		"/about/",
		"/tools/",
		"/places/",
		"/games/",
		"/privacy/",
		"/music/",
		"/archive/",
	]) {
		assert.ok(changelog.includes(`](${target})`), target);
		assert.ok(changelogTranslation.includes(`](${target})`), target);
	}
	const newHistory = changelog.split("## 2026.9.30")[1];
	assert.equal((newHistory.match(/\[关于我\]\(\/about\/\)/g) ?? []).length, 2);
	assert.ok(!changelogTranslation.includes("](/en/about/)"));
});

test("the introduction remains first and the changelog is pinned second", () => {
	const introduction = contentUtils.indexOf('"personal-website-introduction"');
	const updateLog = contentUtils.indexOf('"personal-website-changelog"');
	assert.ok(introduction >= 0);
	assert.ok(updateLog > introduction);
	assert.match(
		contentUtils,
		/getPinnedPostOrder\(a\.id\) - getPinnedPostOrder\(b\.id\)/,
	);
});

test("the changelog title uses the same primary color as the introduction", () => {
	for (const source of [postCard, postPage]) {
		assert.match(source, /entry\.id === "personal-website-introduction"/);
		assert.match(source, /entry\.id === "personal-website-changelog"/);
		assert.match(source, /usesPrimaryTitleColor \? "color: var\(--primary\);"/);
	}
});
