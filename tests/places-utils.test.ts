import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { placesConfig } from "../src/config/placesConfig";
import type { PlaceItem } from "../src/types/placesConfig";
import {
	clusterPlaces,
	filterPlaces,
	formatPlaceDates,
	getPlacesYears,
	latestVisit,
	sortPlaces,
	sortVisits,
	summarizePlaces,
	validatePlaces,
	visitInYear,
} from "../src/utils/places-utils";

function place(id: string, start: string, end?: string): PlaceItem {
	return {
		id,
		name: id,
		country: "中国",
		region: "浙江",
		city: "杭州",
		coordinates: [30, 120],
		tags: [{ name: "旅游" }],
		visits: [{ start, end }],
	};
}

test("真实足迹全部录入，示例不再展示或下发", () => {
	assert.equal(placesConfig.places.length, 17);
	assert.equal(placesConfig.examples.length, 0);
	assert.equal(placesConfig.previewWithExamples, false);
	assert.doesNotThrow(() => validatePlaces(placesConfig.places));
	assert.doesNotThrow(() => validatePlaces(placesConfig.examples));
	assert.deepEqual(summarizePlaces(placesConfig.places, {}, 2026), {
		places: 17,
		visits: 17,
		thisYear: 7,
		regions: 12,
	});
	assert.deepEqual(getPlacesYears(placesConfig.places), [
		"2026",
		"2025",
		"2023",
	]);
	assert.equal(
		summarizePlaces(placesConfig.places, { year: "2025" }, 2026).visits,
		9,
	);
	assert.equal(
		summarizePlaces(placesConfig.places, { year: "2023" }, 2026).visits,
		1,
	);
	assert.deepEqual(
		placesConfig.places.find((p) => p.id === "chengdu")?.visits,
		[{ start: "2026-04-10" }, { start: "2025-05", period: "early" }],
	);
});

test("按月和旬保留原始时间精度，年筛选与同月排序正确", () => {
	const january = place("january", "2026-01");
	assert.doesNotThrow(() => validatePlaces([january]));
	assert.equal(visitInYear(january.visits[0], "2026"), true);
	assert.equal(visitInYear(january.visits[0], "2025"), false);
	assert.equal(formatPlaceDates({ start: "2026-05" }), "2026.05");
	assert.equal(
		formatPlaceDates({ start: "2026-03", period: "mid" }),
		"2026.03 · 中旬",
	);
	assert.equal(
		formatPlaceDates({ start: "2026-03", period: "mid" }, true),
		"2026.03 · mid-month",
	);
	assert.deepEqual(
		sortVisits([
			{ start: "2026-03", period: "early" },
			{ start: "2026-03", period: "late" },
			{ start: "2026-03-15" },
		]).map((v) => v.period ?? v.start),
		["late", "2026-03-15", "early"],
	);
	assert.throws(() => validatePlaces([place("bad", "2026-13")]), /日期/);
	const badPeriod = place("bad-period", "2026-03-15");
	badPeriod.visits[0].period = "early";
	assert.throws(() => validatePlaces([badPeriod]), /日期/);
});

test("肯辛顿只记录社区级现居点，不虚构旅行日期；九江替代江西省级点", () => {
	const home = placesConfig.places.find((p) => p.id === "kensington");
	assert.ok(home?.currentLocation);
	assert.deepEqual(home.visits, []);
	assert.ok((home.mapZoom ?? 12) <= 13);
	assert.equal(latestVisit(home), undefined);
	assert.equal(summarizePlaces([home], {}, 2026).visits, 0);
	assert.equal(filterPlaces([home], { year: "2026" }).length, 0);
	assert.ok(
		placesConfig.places.some((p) => p.id === "jiujiang" && p.city === "九江"),
	);
	assert.ok(!placesConfig.places.some((p) => p.id.startsWith("demo-")));
});

test("足迹封面托管在本地，逐张保留作者、来源与许可", () => {
	for (const entry of placesConfig.places) {
		assert.ok(entry.photos?.length, entry.id);
		for (const photo of entry.photos) {
			assert.ok(
				existsSync(new URL(`../public${photo.src}`, import.meta.url)),
				photo.src,
			);
			assert.ok(photo.credit?.author, entry.id);
			assert.match(
				photo.credit?.sourceUrl ?? "",
				/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
			);
			assert.match(
				photo.credit?.license ?? "",
				/^(CC BY(?:-SA)? [234]\.0|CC0)$/,
			);
			assert.match(
				photo.credit?.licenseUrl ?? "",
				/^https:\/\/creativecommons\.org\//,
			);
		}
	}
});

test("地点数、到访数与地区按独立记录统计，不把重复到访算成新地点", () => {
	const a = place("a", "2026-09-13");
	a.visits.push({ start: "2025-01-01" });
	const b = place("b", "2026-01-05");
	b.country = "澳大利亚";
	b.region = "维多利亚";
	assert.deepEqual(summarizePlaces([a, b], {}, 2026), {
		places: 2,
		visits: 3,
		thisYear: 2,
		regions: 2,
	});
	assert.deepEqual(summarizePlaces([a, b], { year: "2025" }, 2026), {
		places: 1,
		visits: 1,
		thisYear: 0,
		regions: 1,
	});
});

test("年份与分类组合筛选，跨年行程归入覆盖到的每一年", () => {
	const a = place("a", "2025-12-30", "2026-01-02");
	const b = place("b", "2026-05-01");
	b.tags = [{ name: "爬山" }];
	assert.equal(visitInYear(a.visits[0], "2026"), true);
	assert.deepEqual(getPlacesYears([a, b]), ["2026", "2025"]);
	assert.deepEqual(
		filterPlaces([a, b], { year: "2026", tag: "旅游" }).map((item) => item.id),
		["a"],
	);
	assert.deepEqual(filterPlaces([a, b], { year: "2024" }), []);
});

test("最近行程依日期排序而不是录入顺序，不改动原数组", () => {
	const a = place("a", "2025-01-01");
	a.visits.push({ start: "2026-09-20" });
	const b = place("b", "2026-09-10");
	const records = [b, a];
	assert.deepEqual(
		sortPlaces(records).map((item) => item.id),
		["a", "b"],
	);
	assert.equal(records[0], b);
	assert.equal(
		formatPlaceDates({ start: "2026-09-12", end: "2026-09-14" }),
		"2026.09.12 — 2026.09.14",
	);
});

test("错误日期、重复 ID 和不合法坐标在构建时直接报告", () => {
	assert.throws(() => validatePlaces([place("a", "2026-02-30")]), /日期/);
	assert.throws(
		() => validatePlaces([place("a", "2026-10-01", "2026-09-01")]),
		/日期/,
	);
	assert.throws(
		() => validatePlaces([place("a", "2026-01-01"), place("a", "2026-02-01")]),
		/ID/,
	);
	const a = place("a", "2026-01-01");
	a.coordinates = [120, 30];
	assert.throws(() => validatePlaces([a]), /坐标/);
});

test("相邻标记按当前屏幕像素聚合，放大后能自动拆开", () => {
	const a = place("a", "2026-01-01");
	const b = place("b", "2026-01-01");
	const c = place("c", "2026-01-01");
	const nearby = [
		{ place: a, x: 10, y: 10 },
		{ place: b, x: 30, y: 15 },
		{ place: c, x: 500, y: 500 },
	];
	assert.deepEqual(
		clusterPlaces(nearby).map((group) => group.length),
		[2, 1],
	);
	assert.deepEqual(
		clusterPlaces(
			nearby.map((point) => ({ ...point, x: point.x * 10, y: point.y * 10 })),
		).map((group) => group.length),
		[1, 1, 1],
	);
});

test("当前每篇随笔都显式开启评论，其他分类不自动改动", () => {
	const posts = new URL("../src/content/posts/", import.meta.url);
	const entries = readdirSync(posts, { recursive: true, withFileTypes: true });
	let essays = 0;
	for (const entry of entries) {
		if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;
		const frontmatter =
			readFileSync(join(entry.parentPath, entry.name), "utf8").split(
				/^---\s*$/m,
			)[1] ?? "";
		if (/^category:\s*["']?随笔["']?\s*$/m.test(frontmatter)) {
			essays++;
			assert.match(frontmatter, /^comment:\s*true\s*$/m, entry.name);
		}
	}
	assert.ok(essays >= 4);
});
