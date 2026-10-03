import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getSiteStartTimestamp, getSiteUptime } from "../src/utils/site-uptime";

test("prefers the configured start date and falls back to July 9 only if absent or invalid", () => {
	assert.equal(getSiteStartTimestamp("2026-07-10"), Date.parse("2026-07-10"));
	assert.equal(getSiteStartTimestamp(), Date.parse("2026-07-09"));
	assert.equal(getSiteStartTimestamp("invalid"), Date.parse("2026-07-09"));
});

test("splits elapsed time into complete days, hours, minutes and seconds", () => {
	const start = Date.parse("2026-07-10");
	const elapsed = ((85 * 24 + 8) * 60 * 60 + 16 * 60 + 41) * 1000;
	assert.deepEqual(getSiteUptime(start, start + elapsed), {
		days: 85,
		hours: 8,
		minutes: 16,
		seconds: 41,
	});
	assert.deepEqual(getSiteUptime(start, start + 86_400_000), {
		days: 1,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
});

test("does not show negative or invalid elapsed time", () => {
	const empty = { days: 0, hours: 0, minutes: 0, seconds: 0 };
	assert.deepEqual(getSiteUptime(1000, 0), empty);
	assert.deepEqual(getSiteUptime(Number.NaN, 1000), empty);
});

test("places a lifecycle-safe realtime timer below the footer attribution", () => {
	const footer = readFileSync(
		new URL("../src/components/layout/Footer.astro", import.meta.url),
		"utf8",
	);
	const timer = readFileSync(
		new URL("../src/components/layout/SiteUptime.astro", import.meta.url),
		"utf8",
	);
	assert.ok(
		footer.indexOf("<SiteUptime />") > footer.indexOf("Power by xiaoxiaoboluo"),
	);
	assert.match(timer, /siteConfig\.siteStartDate/);
	assert.match(timer, /小破站已运行/);
	assert.match(timer, /aria-live="off"/);
	assert.match(timer, /disconnectedCallback/);
	assert.match(timer, /window\.clearTimeout/);
});
