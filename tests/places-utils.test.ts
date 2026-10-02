import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { placesConfig } from "../src/config/placesConfig";
import type { PlaceItem } from "../src/types/placesConfig";
import {
	clusterPlaces,
	filterPlaces,
	formatPlaceDates,
	getPlacesYears,
	sortPlaces,
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

test("真实足迹不冒用示例数据，示例和未来真实数据均接受校验", () => {
	assert.equal(placesConfig.places.length, 0);
	assert.doesNotThrow(() => validatePlaces(placesConfig.places));
	assert.doesNotThrow(() => validatePlaces(placesConfig.examples));
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
