import assert from "node:assert/strict";
import test from "node:test";
import { sidebarLayoutConfig } from "../src/config/sidebarConfig";

test("only exchanges the desktop relationship and visitor-statistics slots", () => {
	assert.deepEqual(
		sidebarLayoutConfig.leftComponents.map((item) => item.type),
		[
			"profile",
			"announcement",
			"music",
			"categories",
			"tags",
			"relationship",
			"umamiStats",
		],
	);
	assert.deepEqual(
		sidebarLayoutConfig.rightComponents.map((item) => item.type),
		[
			"timeGreeting",
			"weather",
			"dailyQuote",
			"festivalCountdown",
			"recentActivity",
			"stats",
			"siteInfo",
			"calendar",
			"sidebarToc",
		],
	);
});

test("exchanges the mobile visitor-statistics and relationship slots without reordering other widgets", () => {
	assert.deepEqual(
		sidebarLayoutConfig.mobileBottomComponents.map((item) => item.type),
		[
			"profile",
			"announcement",
			"music",
			"umamiStats",
			"categories",
			"tags",
			"relationship",
			"timeGreeting",
			"weather",
			"dailyQuote",
			"festivalCountdown",
			"recentActivity",
			"stats",
			"siteInfo",
		],
	);
});

test("preserves widget visibility and keeps the article's separate mobile timer from being duplicated", () => {
	const left = sidebarLayoutConfig.leftComponents;
	const mobile = sidebarLayoutConfig.mobileBottomComponents;
	assert.equal(
		left.find((item) => item.type === "relationship")?.showOnPostPage,
		true,
	);
	assert.equal(
		left.find((item) => item.type === "umamiStats")?.showOnPostPage,
		false,
	);
	assert.equal(
		left.find((item) => item.type === "relationship")?.position,
		"sticky",
	);
	assert.equal(
		left.find((item) => item.type === "umamiStats")?.position,
		"sticky",
	);
	assert.equal(
		mobile.find((item) => item.type === "relationship")?.showOnPostPage,
		false,
	);
	assert.equal(
		mobile.find((item) => item.type === "umamiStats")?.showOnPostPage,
		false,
	);
	for (const widgets of [left, mobile, sidebarLayoutConfig.rightComponents]) {
		assert.equal(
			new Set(widgets.map((item) => item.type)).size,
			widgets.length,
		);
	}
});
