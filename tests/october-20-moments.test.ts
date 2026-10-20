import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { personalPagesConfig } from "../src/config/personalPagesConfig";

const expected = [
	{
		id: "winter-snow-and-old-years",
		day: "2026-10-18",
		content: "纵有千般眷恋，终随暮雪入旧年...",
	},
	{
		id: "empty-set-and-dreams",
		day: "2026-10-18",
		content:
			"空集是任何集合的子集，于是我的每个梦里都有你\n你是我的补集：现实里没有你，我就把梦当成全集...",
	},
	{
		id: "question-the-stars",
		day: "2026-10-19",
		content: "我，将诘问群星！",
	},
	{
		id: "unchanged-moonlight",
		day: "2026-10-19",
		content: "奈何月色如初，空照满庭落叶成秋...",
	},
	{
		id: "randomness-and-eternity",
		day: "2026-10-20",
		content:
			"世间的每一次相遇，都不过是无数随机变量的一次取值。可偏偏只有你，让我在一场偶然里，生出了对⌈永恒⌋的妄想......\n宇宙不曾为任何一颗恒星停下膨胀，我也不该为某一个人停下脚步。只是偶尔回头，仍觉得那一小片星空，比整个宇宙都明亮......",
	},
];
const previousIds = [
	"the-years-are-finite",
	"cold-at-the-heights",
	"swords-and-melodies",
	"hello-thanks-goodbye",
	"vow-to-the-dawn",
	"time-and-all-things",
	"you-in-my-memory",
	"unbound-by-things",
	"she-loves-her-dream",
	"brief-utopia",
	"thank-you-for-leaving",
	"stars-upon-the-river",
	"golden-memory",
	"love-and-domain",
	"ten-thousand-winters-and-springs",
	"autumn-moon-poem",
	"love-leaves-regret",
	"firefly-glow",
	"welcome",
];
const items = personalPagesConfig.moments.items;

test("adds the five requested October 18–20 updates with exact wording and no duplicates", () => {
	for (const entry of expected) {
		const matches = items.filter((item) => item.id === entry.id);
		assert.equal(matches.length, 1, entry.id);
		assert.equal(matches[0].content, entry.content, entry.id);
		assert.equal(matches[0].date.slice(0, 10), entry.day, entry.id);
		assert.ok(matches[0].contentEn?.trim(), entry.id);
	}
	assert.equal(new Set(items.map((item) => item.id)).size, items.length);
	const previous = items.filter((item) => previousIds.includes(item.id));
	assert.equal(previous.length, 19);
	assert.equal(
		createHash("sha256").update(JSON.stringify(previous)).digest("hex"),
		"861fbfa3b68a22bc4f425d7f4d43425e5f2620228a2edb562ec233d08e90325c",
	);
});

test("stores fixed randomized times between 17:00 and 23:00 on each requested Sydney date", () => {
	const formatter = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Australia/Sydney",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
	let previousTimestamp = 0;
	for (const entry of expected) {
		const item = items.find((value) => value.id === entry.id);
		assert.ok(item, entry.id);
		const timestamp = new Date(item.date).getTime();
		assert.ok(Number.isFinite(timestamp));
		assert.ok(timestamp > previousTimestamp);
		previousTimestamp = timestamp;
		const parts = formatter.formatToParts(new Date(timestamp));
		const part = (type: string) =>
			parts.find((value) => value.type === type)?.value;
		assert.equal(`${part("year")}-${part("month")}-${part("day")}`, entry.day);
		const minutes = Number(part("hour")) * 60 + Number(part("minute"));
		assert.ok(minutes >= 17 * 60 && minutes <= 23 * 60, item.id);
		assert.equal(`${part("hour")}:${part("minute")}`, item.date.slice(11, 16));
	}
});

test("keeps each two-line entry as one post in both languages", () => {
	for (const id of ["empty-set-and-dreams", "randomness-and-eternity"]) {
		const item = items.find((value) => value.id === id);
		assert.ok(item);
		assert.equal(item.content.split("\n").length, 2);
		assert.equal(item.contentEn?.split("\n").length, 2);
	}
});
