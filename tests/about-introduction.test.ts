import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const aboutPage = readFileSync(
	new URL("../src/pages/about.astro", import.meta.url),
	"utf8",
);
const addedParagraphs = [
	"目前最喜欢使用的Agent产品是ChatGPT Codex以及DeepSeek Harness。我已经在Codex上使用超过90亿Token。",
	"感觉我还是非常情绪稳定的喵！",
	"嘻嘻，我还是白纸一张喵~",
	"喜欢和朋友一起玩，游戏，旅行，上课，聊天",
];

test("the new introduction paragraphs follow the AI sentence in the requested order", () => {
	const chineseTexts = Array.from(
		aboutPage.matchAll(/\bzh="([^"]*)"/g),
		(match) => match[1],
	);
	const introIndex = chineseTexts.findIndex((text) =>
		text.startsWith("Hi，你好呀！"),
	);
	assert.notEqual(introIndex, -1);
	assert.ok(chineseTexts[introIndex].endsWith("拥抱 Agent。"));
	assert.deepEqual(
		chineseTexts.slice(introIndex + 1, introIndex + 1 + addedParagraphs.length),
		addedParagraphs,
	);
	assert.equal(
		chineseTexts[introIndex + 1 + addedParagraphs.length],
		"目前坐标悉尼，在上学哦……",
	);
});

test("each new paragraph has its own line and an English counterpart", () => {
	const blocks = Array.from(
		aboutPage.matchAll(/<LocalizedText\b([\s\S]*?)\/>(\s*<br\s*\/>|)/g),
	);
	for (const paragraph of addedParagraphs) {
		const block = blocks.find((match) =>
			match[1].includes(`zh="${paragraph}"`),
		);
		assert.ok(block, `Missing paragraph: ${paragraph}`);
		assert.match(block[1], /\ben="[^"]+"/);
		assert.match(block[2], /<br\s*\/>/);
	}
	assert.match(aboutPage, /over 9 billion tokens in Codex/);
});

test("the quoted wish follows the contact sentence on its own line", () => {
	assert.match(
		aboutPage,
		/zh="欢迎通过 GitHub、邮箱、微信、QQ 与我交流。"[\s\S]*?\/>\s*<br\s*\/>\s*<LocalizedText zh="“我\.\.\.我也想找到那个⌈她⌋。我的⌈纯美⌋\.\.\.\.\.\.”" en="[^"]+"/,
	);
});

test("the edited blank-paper and quoted wish lines have matching English copy", () => {
	assert.match(aboutPage, /en="Hehe, I'm still a blank sheet of paper, meow~"/);
	assert.ok(
		aboutPage.includes(
			'en="I like spending time with friends, playing games, travelling, going to class, and chatting together."',
		),
	);
	assert.match(
		aboutPage,
		/en="“I\.\.\. I also hope to find ⌈her⌋\. My ⌈Pure Beauty⌋\.\.\.\.\.\.”"/,
	);
});
