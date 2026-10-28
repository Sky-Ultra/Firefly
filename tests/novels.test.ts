import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";
import { navBarConfig } from "../src/config/navBarConfig";
import { novels } from "../src/config/novelsConfig";
import {
	assertUniqueNovels,
	normalizeNovelTitle,
} from "../src/utils/novel-utils";
import { matchesNovelFilters } from "../src/utils/novel-wall";

test("all 60 requested works are present once, with collections kept distinct from named stories", () => {
	assert.equal(novels.length, 60);
	assertUniqueNovels(novels);
	for (const title of [
		"红楼梦",
		"三国演义",
		"西游记",
		"水浒传",
		"儒林外史",
		"聊斋志异",
		"镜花缘",
		"老残游记",
		"呐喊",
		"彷徨",
		"故事新编",
		"阿Q正传",
		"狂人日记",
		"祝福",
		"孔乙己",
		"子夜",
		"林家铺子",
		"春蚕",
		"蚀（三部曲）",
		"骆驼祥子",
		"四世同堂",
		"茶馆",
		"月牙儿",
		"封神演义",
		"隋唐演义",
		"围城",
		"呼兰河传",
		"春风沉醉的晚上",
		"雷雨",
		"平凡的世界",
		"活着",
		"白鹿原",
		"三体",
		"撒哈拉的故事",
		"球状闪电",
		"流浪地球",
		"战争与和平",
		"追风筝的人",
		"安娜·卡列尼娜",
		"复活",
		"变色龙",
		"童年",
		"在人间",
		"我的大学",
		"悲惨世界",
		"巴黎圣母院",
		"九三年",
		"红与黑",
		"鼠疫",
		"西西弗神话",
		"百年孤独",
		"哈姆雷特",
		"罗密欧与朱丽叶",
		"傲慢与偏见",
		"老人与海",
		"海底两万里",
		"双城记",
		"雾都孤儿",
		"挪威的森林",
		"人间失格",
	]) {
		assert.equal(novels.filter((b) => b.title === title).length, 1, title);
	}
	assert.ok(
		novels.every((book) => !("score" in book)),
		"do not invent the owner's ratings",
	);
});
test("new additions reject duplicate ids, quoted/fullwidth titles and established aliases", () => {
	assert.equal(
		normalizeNovelTitle("《阿Ｑ正传》"),
		normalizeNovelTitle("阿q正传"),
	);
	assert.throws(
		() =>
			assertUniqueNovels([
				...novels,
				{ ...novels[0], id: "duplicate", title: "《紅樓夢》" },
			]),
		/Duplicate novel title/,
	);
	assert.throws(
		() => assertUniqueNovels([...novels, { ...novels[15] }]),
		/Duplicate novel id/,
	);
	assert.throws(
		() =>
			assertUniqueNovels([
				...novels,
				{ ...novels[0], id: "duplicate", title: "蚀" },
			]),
		/Duplicate novel title/,
	);
});
test("every book has a locally cached cover and explicit reading access/language metadata", () => {
	const hosts = new Set([
		"zh.wikisource.org",
		"ru.wikisource.org",
		"www.aozora.gr.jp",
		"www.fadedpage.com",
		"weread.qq.com",
		"www.gutenberg.org",
		"item.xhsd.com",
		"www.qimao.com",
	]);
	for (const book of novels) {
		const path = new URL(`../public${book.cover}`, import.meta.url);
		assert.ok(existsSync(path), book.title);
		const bytes = readFileSync(path);
		assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
		assert.ok(bytes.length < 180000);
		assert.ok(book.sources.length > 0);
		assert.ok(book.categories.length > 0);
		for (const source of book.sources) {
			const url = new URL(source.url);
			assert.equal(url.protocol, "https:");
			assert.ok(hosts.has(url.hostname));
			if (source.site === "weread" || source.site === "xinhua")
				assert.equal(source.access, "preview");
			if (source.site === "gutenberg") assert.equal(source.language, "en");
		}
	}
	assert.equal(
		novels.filter((b) => b.sources.some((s) => s.access === "open")).length,
		51,
	);
});
test("same-name works link to the requested authors rather than unrelated or adapted books", () => {
	assert.equal(
		novels
			.find((b) => b.title === "三体")
			?.sources.find((s) => s.site === "weread")?.url,
		"https://weread.qq.com/web/reader/16b327b052b9f516bffa427",
	);
	assert.equal(
		novels
			.find((b) => b.title === "球状闪电")
			?.sources.find((s) => s.site === "weread")?.url,
		"https://weread.qq.com/web/reader/6b832220718529276b89a0a",
	);
	assert.equal(novels.find((b) => b.title === "雷雨")?.author, "曹禺");
	assert.ok(
		novels
			.find((b) => b.title === "雷雨")
			?.sources.some((s) => s.url.includes("1010000100961515")),
	);
	assert.ok(
		novels
			.find((b) => b.title === "林家铺子")
			?.sources.some((s) => s.url.includes("f28328a0813ab9ca9g010225")),
	);
});
test("source and overlapping literary categories combine by intersection without duplicate results", () => {
	const records = novels.map((book) => ({
		...book,
		sources: book.sources.map((s) => s.site),
		search: [
			book.title,
			book.author,
			book.description,
			...(book.aliases || []),
		].join(" "),
	}));
	const matches = records.filter((book) =>
		matchesNovelFilters(book, {
			source: "gutenberg",
			category: "drama",
			query: "",
		}),
	);
	assert.deepEqual(
		matches.map((b) => b.title),
		["哈姆雷特", "罗密欧与朱丽叶"],
	);
	assert.ok(
		records.find((b) => b.title === "哈姆雷特")?.categories.includes("world"),
	);
	assert.equal(
		records.filter((b) =>
			matchesNovelFilters(b, {
				source: "gutenberg",
				category: "classics",
				query: "",
			}),
		).length,
		0,
	);
});
test("navigation, about entry, quotation and synchronized major-update changelog point to the new wall", () => {
	const mine = navBarConfig.links.find((link) => link.name === "我的");
	assert.ok(
		mine?.children?.some(
			(link) => link.name === "小说" && link.url === "/novels/",
		),
	);
	const about = readFileSync(
		new URL("../src/pages/about.astro", import.meta.url),
		"utf8",
	);
	assert.ok(
		about.indexOf('zh="喜欢的书："') > about.indexOf('zh="喜欢游戏："'),
	);
	assert.ok(about.includes('href="/novels/"'));
	const page = readFileSync(
		new URL("../src/pages/novels.astro", import.meta.url),
		"utf8",
	);
	assert.ok(page.includes("我的征途，是星辰大海！！"));
	assert.ok(page.includes("——《银河英雄传说》"));
	const log = readFileSync(
		new URL(
			"../src/content/posts/personal-website-changelog.md",
			import.meta.url,
		),
		"utf8",
	);
	assert.ok(
		log.includes(
			'<mark class="theme-highlight">重要更新</mark>：全新增加[我的-小说](/novels/)板块，这里面记录了我曾经阅读过和推荐阅读的书籍，欢迎查阅',
		),
	);
	const en = readFileSync(
		new URL(
			"../src/content/translations/personal-website-changelog.en.md",
			import.meta.url,
		),
		"utf8",
	);
	assert.ok(en.includes(computeSourceHash(log)));
});

test("free Chinese reading is prioritized and partial collections are labeled without overstating access", () => {
	const freeChinese = novels.filter((book) =>
		book.sources.some(
			(source) => source.site === "qimao" && source.access === "open",
		),
	);
	assert.equal(freeChinese.length, 51);
	for (const book of freeChinese) assert.equal(book.sources[0].site, "qimao");
	const eclipse = novels.find((book) => book.title === "蚀（三部曲）");
	assert.ok(eclipse);
	assert.equal(
		eclipse.sources.find((source) => source.site === "qimao")?.access,
		"partial",
	);
	assert.match(
		eclipse.sources.find((source) => source.site === "qimao")?.note || "",
		/并非完整三部曲/,
	);
	const spring = novels.find((book) => book.title === "春蚕");
	assert.ok(spring);
	assert.ok(
		!spring.sources.some(
			(source) =>
				source.url.includes("春蠶") ||
				source.url.includes("%E6%98%A5%E8%A0%B6"),
		),
	);
	assert.equal(
		spring.sources[0].url,
		"https://www.qimao.com/shuku/1832252-30/",
	);
});

test("cover art has sufficient native resolution for clear retina-sized cards", async () => {
	for (const book of novels) {
		const bytes = readFileSync(
			new URL(`../public${book.cover}`, import.meta.url),
		);
		const info = await sharp(bytes).metadata();
		assert.ok(
			(info.width || 0) >= 240,
			`${book.title} should not use a tiny thumbnail`,
		);
	}
});
