import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { sidebarLayoutConfig } from "../src/config/sidebarConfig";
import { getSidebarDecoration } from "../src/utils/sidebar-decoration";

function source(path: string): string {
	const file = new URL(`../${path}`, import.meta.url);
	return existsSync(file) ? readFileSync(file, "utf8") : "";
}

test("homepage entrance precedes the daily quote on desktop and mobile", () => {
	for (const widgets of [
		sidebarLayoutConfig.rightComponents,
		sidebarLayoutConfig.mobileBottomComponents,
	]) {
		const quoteIndex = widgets.findIndex((item) => item.type === "dailyQuote");
		const entrance = widgets[quoteIndex - 1];
		assert.equal(entrance.type, "recentActivity");
		assert.equal(entrance.homeOnly, true);
		assert.equal(entrance.showOnPostPage, false);
	}
});

test("homepage widget opens the timeline in the current tab with the site motif", () => {
	const widget = source("src/components/widget/RecentActivity.astro");
	assert.match(widget, /WidgetLayout/);
	assert.match(widget, /最近发生的事/);
	assert.match(widget, /LocalizedText/);
	assert.match(widget, /href=\{url\("\/activity\/"\)\}/);
	assert.doesNotMatch(widget, /target="_blank"|在新标签页打开|open-in-new/);
	assert.match(widget, /arrow-forward-rounded/);
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
	const feed = source("src/utils/site-timeline.ts");
	assert.match(page, /getSiteTimeline\(\)/);
	assert.match(feed, /buildActivityFeed/);
	assert.match(feed, /getSortedPostsList\(\)/);
	assert.match(feed, /momentsConfig\.items/);
	assert.match(feed, /getPostUrlBySlug/);
	assert.match(feed, /\/moments\/#/);
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
