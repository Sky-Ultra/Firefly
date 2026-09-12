import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { musicPlayerConfig } from "../src/config/musicConfig";

const expectedInsertedSongs = [
	"纳塔 Natlan",
	"故风吟游之地",
	"愿戴荣光坠入天渊",
	"Against the Tide（逆潮）",
	"春涧",
	"第57次取消发送",
	"九万字",
	"做自己的光，不需要太亮",
	"远航星的告别",
	"The King",
	"Lightning Moment feat.fox capture plan",
	"星降る海（繁星坠海）",
	"Everflow（中文版）",
	"西楼别序",
	"雨爱",
	"堕（合唱版）",
	"离开我的依赖",
	"昔涟",
	"寄明月",
	"Lifeline（生命线）",
	"唯一的星光（Polaris）",
	"白月光与朱砂痣",
	"潮汐（Natural）",
	"权御天下",
];

const expectedBaseHeadSongs = [
	"希望有羽毛和翅膀",
	"使一颗心免于哀伤",
	"在银河中孤独摇摆",
	"若我不曾见过太阳",
];

test("the screenshot songs keep their requested playlist order", () => {
	const order = musicPlayerConfig.meting?.playlistOrder;
	assert.ok(order);
	assert.equal(order.baseHeadCount, 4);
	assert.deepEqual(order.baseHeadOrder, expectedBaseHeadSongs);
	assert.deepEqual(
		order.pinnedSongs?.map((song) => song.name),
		["星炬不熄"],
	);
	assert.deepEqual(
		order.insertedSongs?.map((song) => song.name),
		expectedInsertedSongs,
	);
});

test("the player composes pinned, original head, inserted, and original tail songs", () => {
	const manager = readFileSync(
		new URL("../src/components/features/MusicManager.astro", import.meta.url),
		"utf8",
	);

	assert.match(
		manager,
		/var baseHead = applyBaseHeadOrder\(\s*basePlaylist\.slice\(0, headCount\),\s*order\.baseHeadOrder\s*\)/s,
	);
	assert.match(
		manager,
		/return pinned\s*\.concat\(baseHead\)\s*\.concat\(inserted\)\s*\.concat\(basePlaylist\.slice\(headCount\)\)/s,
	);
});

test("the player times out stalled APIs and starts with a responsive source", () => {
	const meting = musicPlayerConfig.meting;
	assert.ok(meting);
	assert.equal(meting.requestTimeoutMs, 8000);
	assert.match(meting.api ?? "", /api\.injahow\.cn/);
	assert.match(meting.fallbackApis?.[0] ?? "", /api\.moeyao\.cn/);

	const manager = readFileSync(
		new URL("../src/components/features/MusicManager.astro", import.meta.url),
		"utf8",
	);
	assert.match(manager, /new AbortController\(\)/);
	assert.match(manager, /controller\.abort\(\)/);
	assert.match(manager, /fetch\(fetchUrl, \{ signal: controller\.signal \}\)/);
	assert.match(manager, /clearTimeout\(timeoutId\)/);
});
