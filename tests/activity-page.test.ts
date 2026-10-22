import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { sidebarLayoutConfig } from "../src/config/sidebarConfig";
import { getSidebarDecoration } from "../src/utils/sidebar-decoration";

function source(path: string): string {
	const file = new URL(`../${path}`, import.meta.url);
	return existsSync(file) ? readFileSync(file, "utf8") : "";
}

test("homepage entrance follows the countdown on desktop and mobile", () => {
	for (const widgets of [
		sidebarLayoutConfig.rightComponents,
		sidebarLayoutConfig.mobileBottomComponents,
	]) {
		const countdownIndex = widgets.findIndex(
			(item) => item.type === "festivalCountdown",
		);
		const entrance = widgets[countdownIndex + 1];
		assert.equal(entrance.type, "recentActivity");
		assert.equal(entrance.homeOnly, true);
		assert.equal(entrance.showOnPostPage, false);
	}
});

test("homepage widget opens the independent timeline in a safe new tab with the site motif", () => {
	const widget = source("src/components/widget/RecentActivity.astro");
	assert.match(widget, /WidgetLayout/);
	assert.match(widget, /最近发生的事/);
	assert.match(widget, /LocalizedText/);
	assert.match(widget, /href=\{url\("\/activity\/"\)\}/);
	assert.match(widget, /target="_blank"/);
	assert.match(widget, /rel="noopener noreferrer"/);
	assert.equal(getSidebarDecoration("recent-activity"), "clock");
});

test("homepage-only visibility is handled on first render and existing route transitions", () => {
	const sidebar = source("src/components/layout/SideBar.astro");
	const layout = source("src/layouts/Layout.astro");
	assert.match(sidebar, /recentActivity:\s*RecentActivity/);
	assert.match(sidebar, /isHomePage\(Astro.url.pathname\)/);
	assert.match(sidebar, /config\.homeOnly/);
	assert.match(sidebar, /widget-home-only/);
	assert.match(layout, /querySelectorAll\("\.widget-home-only"\)/);
	assert.match(layout, /classList\.toggle\("hidden",\s*!isHome\)/);
});

test("timeline uses public metadata and semantic localized content without article body rendering", () => {
	const page = source("src/pages/activity.astro");
	assert.match(page, /MainGridLayout/);
	assert.match(page, /buildActivityFeed/);
	assert.match(page, /getSortedPosts\(\)/);
	assert.match(page, /personalPagesConfig\.moments\.items/);
	assert.match(page, /getPostUrlBySlug/);
	assert.match(page, /\/moments\/#/);
	assert.match(page, /<ol\b/);
	assert.match(page, /<time\b/);
	assert.match(page, /发布了/);
	assert.match(page, /ImageWrapper/);
	assert.match(page, /profileConfig\.avatar/);
	assert.match(page, /item\.contentEn/);
	assert.match(page, /item\.titleEn/);
	assert.doesNotMatch(
		page,
		/render\(|\.body\b|set:html|updated|git\b|slice\(0,\s*\d+\)\.map/,
	);
});
