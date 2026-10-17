import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { personalPagesConfig } from "../src/config/personalPagesConfig";

const expected = [
	{
		id: "golden-memory",
		day: "2026-10-01",
		content: "假使有一日不得不同你相别，你在我的记忆中也会如黄金般闪耀。",
	},
	{
		id: "stars-upon-the-river",
		day: "2026-10-03",
		content: "观尘寰兮焜煌，如星落兮满江。",
	},
	{
		id: "thank-you-for-leaving",
		day: "2026-10-06",
		content: "“我无法挽留任何从我生命中离开的人，但是感谢你们”",
	},
	{
		id: "brief-utopia",
		day: "2026-10-10",
		content: "你的存在是我在这个世界短暂的乌托邦...",
	},
	{
		id: "she-loves-her-dream",
		day: "2026-10-11",
		content: "她只爱她的梦。她不爱任何人。",
	},
	{
		id: "unbound-by-things",
		day: "2026-10-11",
		content: "物物而不物于物，念念而不念于念",
	},
	{
		id: "you-in-my-memory",
		day: "2026-10-12",
		content: "没人能比得上我记忆中的你，即使现在的你也不行...",
	},
	{
		id: "time-and-all-things",
		day: "2026-10-13",
		content: "时间本身就是万物的参照，所以万物都是时间的参照",
	},
	{
		id: "vow-to-the-dawn",
		day: "2026-10-13",
		content:
			"「以晨露未晞的鲜花为誓，献与你金穗遍野的繁荣。」\n「以长夜不熄的灯火为誓，捍卫你极光映雪的山川。」\n「以追逐黎明的羽翼为誓，迎接你身披风霜的归途。」\n「群星为证，誓予破晓。」",
	},
	{
		id: "hello-thanks-goodbye",
		day: "2026-10-14",
		content: "「你好」、「谢谢」；最后是「再见」",
	},
	{
		id: "swords-and-melodies",
		day: "2026-10-14",
		content: "观千剑而后识器，操千曲而后晓声",
	},
	{
		id: "cold-at-the-heights",
		day: "2026-10-16",
		content: "高处不胜寒。",
	},
	{
		id: "the-years-are-finite",
		day: "2026-10-17",
		content: "至此间 我知觉 流年应有限...",
	},
];
const items = personalPagesConfig.moments.items;

test("adds exactly the thirteen requested October moments while keeping the six existing updates", () => {
	assert.equal(items.length, 19);
	assert.equal(new Set(items.map((item) => item.id)).size, items.length);
	for (const entry of expected) {
		const matches = items.filter((item) => item.id === entry.id);
		assert.equal(matches.length, 1, entry.id);
		assert.equal(matches[0].content, entry.content, entry.id);
		assert.equal(matches[0].date.slice(0, 10), entry.day, entry.id);
		assert.ok(matches[0].contentEn?.trim(), entry.id);
	}
	assert.deepEqual(
		items
			.filter((item) => !expected.some((entry) => entry.id === item.id))
			.map((item) => item.id),
		[
			"love-and-domain",
			"ten-thousand-winters-and-springs",
			"autumn-moon-poem",
			"love-leaves-regret",
			"firefly-glow",
			"welcome",
		],
	);
});

test("uses fixed randomized evening times on the requested Sydney dates, including daylight saving", () => {
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
		const item = items.find((candidate) => candidate.id === entry.id);
		assert.ok(item);
		const timestamp = new Date(item.date).getTime();
		assert.ok(Number.isFinite(timestamp), item.id);
		assert.ok(timestamp > previousTimestamp, item.id);
		previousTimestamp = timestamp;
		const parts = formatter.formatToParts(new Date(timestamp));
		const part = (type: string) =>
			parts.find((value) => value.type === type)?.value;
		assert.equal(
			`${part("year")}-${part("month")}-${part("day")}`,
			entry.day,
			item.id,
		);
		const minutes = Number(part("hour")) * 60 + Number(part("minute"));
		assert.ok(minutes >= 17 * 60 && minutes <= 23 * 60 + 30, item.id);
		assert.equal(
			`${part("hour")}:${part("minute")}`,
			item.date.slice(11, 16),
			item.id,
		);
	}
});

test("preserves the four-line dawn oath and the feed's literal line-break rendering", () => {
	const oath = items.find((item) => item.id === "vow-to-the-dawn");
	assert.ok(oath);
	assert.equal(oath.content.split("\n").length, 4);
	assert.equal(oath.contentEn?.split("\n").length, 4);
	const card = readFileSync(
		new URL(
			"../src/components/pages/personal/SocialFeedCard.astro",
			import.meta.url,
		),
		"utf8",
	);
	assert.match(card, /whitespace-pre-line/);
});
