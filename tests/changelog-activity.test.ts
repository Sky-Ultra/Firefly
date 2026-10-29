import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildActivityFeed } from "../src/utils/activity-feed";
import {
	buildChangelogActivities,
	parseChangelogSections,
} from "../src/utils/changelog-activity";

const source = (file: string) =>
	readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("dated changelog sections pair by date, ignoring frontmatter and code headings", () => {
	const input =
		"---\nupdated: 2030-01-01\n---\nIntroduction\n## 2026.10.29\n- First\n```md\n## 2030.1.1\n```\n## 2026.10.28\n- Second\n## 2026.2.30\n- Invalid";
	const sections = parseChangelogSections(input);
	assert.deepEqual(
		sections.map((section) => section.date),
		["2026-10-29", "2026-10-28"],
	);
	assert.match(sections[0].markdown, /2030.1.1/);
	assert.equal(
		parseChangelogSections("## October 29, 2026\n- Hello")[0].date,
		"2026-10-29",
	);
});

test("all existing changelog days render their full content, links, highlights and paired English", async () => {
	const entries = await buildChangelogActivities(
		source("src/content/posts/personal-website-changelog.md"),
		source("src/content/translations/personal-website-changelog.en.md"),
		"/posts/personal-website-changelog/",
	);
	assert.equal(entries.length, 30);
	assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
	const latest = entries.find((entry) => entry.date === "2026-10-29");
	assert.ok(latest);
	assert.match(latest.html, /<a href="\/novels\/">我的-小说<\/a>/);
	assert.match(latest.html, /<mark class="theme-highlight">重要更新<\/mark>/);
	assert.match(latest.html, /沉浸式播放/);
	assert.match(latest.htmlEn, /immersive playback/);
	assert.equal(latest.href, "/posts/personal-website-changelog/#20261029");
	assert.equal(
		latest.hrefEn,
		"/posts/personal-website-changelog/#october-29-2026",
	);
	const feed = buildActivityFeed(
		[],
		[{ id: "test", date: "2026-10-28T17:00:00+11:00", content: "Moment" }],
		{ post: (id) => id, moment: (id) => id },
		entries,
	);
	assert.equal(feed.length, 31);
	assert.equal(feed[0].id, "changelog:2026-10-29");
	assert.equal(
		entries[0].date,
		"2026-09-12",
		"sorting must not mutate source entries",
	);
});

test("timeline log rendering keeps formatting while stripping scripts and unsafe links", async () => {
	const entries = await buildChangelogActivities(
		'## 2026.10.29\n- <mark class="theme-highlight">重要更新</mark> [link](javascript:alert(1))\n<script>alert(1)</script>',
		"",
		"/log/",
	);
	assert.doesNotMatch(entries[0].html, /script|javascript:|onclick/);
	assert.match(entries[0].html, /theme-highlight/);
});
