import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readContent = (path: string): string => {
	const file = new URL(`../src/content/${path}`, import.meta.url);
	assert.ok(existsSync(file), `Published article exists: ${path}`);
	return readFileSync(file, "utf8").replaceAll("\r\n", "\n");
};
const sourcePath = "posts/marriage-risks-and-costs.md";
const translationPath = "translations/marriage-risks-and-costs.en.md";
const predecessor = "/posts/why-the-poor-stay-poor/";
const predecessorTitle = "为何部分“穷人”会一直保持他们的贫穷？";
const disclaimerPattern =
	/<!-- reused-disclaimer:start -->\n\n([\s\S]*?)\n\n<!-- reused-disclaimer:end -->/;
const bodyOf = (content: string) =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const rawParagraphsOf = (content: string) =>
	bodyOf(content)
		.replace(disclaimerPattern, "[[DISCLAIMER]]")
		.trim()
		.split("\n\n");
const plainParagraphsOf = (content: string) =>
	rawParagraphsOf(content).map((paragraph) =>
		paragraph.startsWith('<div class="word-paragraph-gap"')
			? ""
			: paragraph
					.replace(/<mark\b[^>]*>|<\/mark>/g, "")
					.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
					.replaceAll("&amp;", "&")
					.replaceAll("&lt;", "<")
					.replaceAll("&gt;", ">"),
	);
const highlightsOf = (content: string) =>
	[...content.matchAll(/<mark\b[^>]*>([\s\S]*?)<\/mark>/g)].map(
		(match) => match[1],
	);
const reusedDisclaimerOf = (path: string) => {
	const content = readContent(path);
	const start = content.indexOf("> **");
	const end = content.indexOf('\n\n<div class="word-paragraph-gap"', start);
	assert.ok(start >= 0 && end > start);
	return content.slice(start, end);
};
const highlightTexts = [
	"我不对此有任何歧视、冒犯、对立，我只是客观的整理现状，引入自己的浅薄思考",
	"但是，如果有可能，我希望你可以尽量看完全文！！",
	"多读书，少刷短视频",
	"如果你我并非“底层”行列，但是在此经济环境下，婚姻仍需三思而后行",
	"我第一次接触到这个概念时，第一反应就是：这不就是跟有钱人结婚吗？",
	"但被做空的不是有钱人，而是你。",
	"当然，不管是男女，这都是说说而已…我们都知道，对于这样的感情，这种东西是不可能的。即使是我，也绝对不会对任何人随意承诺…",
	"也就是说，你从某教授、某经理，变成某某的先生、某某的太太。等你生了孩子，还会成为某某某的妈妈、某某的爸爸。",
	"这就是那句“结婚了，得收收心”的真实写照。",
	"之前承诺的广告费用非但没有落地，对方还在生活中不断打压你，让你退居二线，相夫教子，反正你赚的也没有对方多。",
	"同时减少你方产品排产。要牺牲做家务时间的升学跟升迁，通通不允许，拿家庭责任来压你。",
	"对方不回家、不爱你、性格不合、冷暴力，这都不是会呈现在纸面上的东西，但确实是你实实在在会遭受的东西。",
	"然后你就等着被吸干、被绞杀、被饿死，眼睁睁地看着对方在自己的尸体上开出新的花。",
	"等你想离婚时，你什么也拿不到。",
	"之前你们积攒的人脉，他尽数拿走。对应的就是你已婚已育后，在市场上找不到对口工作，因为你已经错失了职业的最佳奋斗期。",
	"这个时候，你只能把自己托管给朋友，在朋友的小公司里谋一个不对口、又无足轻重的小职位。",
	"日后的后半生，你直接在打官司中度过。就算是能拿回一些东西，那跟你灿烂的青春相比，并不是合理的等价交换。",
	"身在局中，似乎路有千万条；身在结局，路只有既定的一条。",
	"只是你要想好，命运就是第八号当铺。为了那个你期待的未来，你真的能下定决心典当你的灵魂吗？",
	"关于这点疑惑，其实我从一开始就想到了。我的观点是，只要伴侣双方是正常人，就很难出现这种东西……还是提一句，至少我不会…!",
	"本身就是在所谓大结果时代，双方不对等的一个最基本的玩意。而且，我不喜欢这个词，有着阶层对立的感觉。",
	"虽然我还很年轻，我对这方面也没有什么很多的想法，我单纯的渴望只想找到我心底最喜欢的人纯爱一生…但是无论如何，我可以肯定的是，我绝对无法接受一个“目的”就是向上社交的“人”",
	"我认为它就不应该叫做向上社交了，这只能算是找到一个更好的朋友，或者更好的人。",
	"因为我本身就非常不喜欢向上社交这个词，感觉听上去很难受。",
	"当然，如果你本身就确实自己无能为力，只能向上社交，那么，我只能祝你能找到一个很好的人，否则的话，真的有很大很大的概率会成为我文章里的主角。只不过我相信这类人群大概率看不到这里",
	"但我更相信从好朋友发展到恋人的纯爱，也能从初恋走到最后。",
	"这里面也有我的私心吧。我不希望现今社会的快餐式恋爱，以及相亲市场上那套令人作呕的相亲法则，以及对于物质的极端要求，可以在感情里生根发芽。",
	"你要说这是我的恋爱观吗？好吧，也许算是。我这个人就是对一些东西有点执念，不管是对事还是对人……",
	"少刷短视频",
	"有这个功夫，不如去多读点书吧…",
];
const highlightCounts = [
	0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
	0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2,
	1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
];
const gapIndices = [4, 9, 10, 69, 70, 72, 79, 84, 92];

test("publishes the marriage follow-up with the exact supplied title and two-line introduction", () => {
	const source = readContent(sourcePath);
	for (const field of [
		"title: 婚姻的的风险与代价：对文章“穷人会保持贫穷”的深入思考",
		"published: 2026-10-21",
		"author: Sky",
		"category: 随笔",
		"tags: [随笔]",
		"comment: true",
		"draft: false",
	])
		assert.ok(source.split("\n").includes(field), field);
	assert.match(
		source,
		/description: \|-\n {2}本文是对之前文章的更深入思考，补充了对底层婚姻风险代价的进一步理解。\n {2}感兴趣的话欢迎阅读。这篇文章花了不少精力喵\.\.\.\n/,
	);
});

test("preserves all original text paragraphs and gaps while replacing the image slot", () => {
	const paragraphs = plainParagraphsOf(readContent(sourcePath));
	assert.equal(paragraphs.length, 95);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.equal(paragraphs[7], "[[DISCLAIMER]]");
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"92b97ae4585ee797ee8038e5667f0c16bad560beb31d1c17a845e41db3444e52",
	);
});

test("reuses the existing text disclaimer at the screenshot's original location without body images", () => {
	const source = readContent(sourcePath);
	const body = bodyOf(source);
	const disclaimer = body.match(disclaimerPattern);
	assert.ok(disclaimer);
	assert.equal(
		disclaimer[1],
		reusedDisclaimerOf("posts/why-the-poor-stay-poor.md"),
	);
	assert.doesNotMatch(body, /!\[[^\]]*\]\(|<img\b|word\/media|image1\.png/i);
	assert.ok(
		body.indexOf("还请你见谅！") <
			body.indexOf("<!-- reused-disclaimer:start -->"),
	);
	assert.ok(
		body.indexOf("<!-- reused-disclaimer:end -->") <
			body.indexOf("再次叠甲一下。"),
	);
});

test("keeps exactly the original theme-highlight ranges and links both predecessor references", () => {
	const source = readContent(sourcePath);
	const withoutDisclaimer = bodyOf(source).replace(
		disclaimerPattern,
		"[[DISCLAIMER]]",
	);
	assert.deepEqual(highlightsOf(withoutDisclaimer), highlightTexts);
	assert.equal(highlightTexts.length, 30);
	assert.deepEqual(
		rawParagraphsOf(source).map((paragraph) => highlightsOf(paragraph).length),
		highlightCounts,
	);
	const paragraphs = rawParagraphsOf(source);
	const link = `[${predecessorTitle}](${predecessor})`;
	assert.ok(paragraphs[1].includes(link));
	assert.ok(paragraphs[82].includes(link));
	assert.equal(bodyOf(source).split(`](${predecessor})`).length - 1, 2);
});

test("pairs the complete English follow-up, disclaimer, links and corresponding highlight positions", () => {
	const source = readContent(sourcePath);
	const translation = readContent(translationPath);
	assert.match(translation, /^translationOf: marriage-risks-and-costs\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const paragraphs = plainParagraphsOf(translation);
	assert.equal(paragraphs.length, 95);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.equal(paragraphs[7], "[[DISCLAIMER]]");
	assert.deepEqual(
		rawParagraphsOf(translation).map(
			(paragraph) => highlightsOf(paragraph).length,
		),
		highlightCounts,
	);
	assert.equal(
		bodyOf(translation).match(disclaimerPattern)?.[1],
		reusedDisclaimerOf("translations/why-the-poor-stay-poor.en.md"),
	);
	assert.equal(bodyOf(translation).split(`](${predecessor})`).length - 1, 2);
	assert.ok(rawParagraphsOf(translation)[1].includes(`](${predecessor})`));
	assert.ok(rawParagraphsOf(translation)[82].includes(`](${predecessor})`));
	assert.doesNotMatch(bodyOf(translation), /!\[[^\]]*\]\(|<img\b/i);
});
