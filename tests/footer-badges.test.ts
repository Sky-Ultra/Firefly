import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getFooterBadges } from "../src/utils/footer-badges";

const license = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

test("footer badges describe the site's actual technology and services", () => {
	const badges = getFooterBadges({
		commentService: "twikoo",
		umamiEnabled: false,
		license,
	});
	assert.deepEqual(
		badges.map(({ label, value }) => [label, value]),
		[
			["Build", "Astro"],
			["Style", "Tailwind CSS"],
			["Comments", "Twikoo"],
			["Search", "Pagefind"],
			["CDN", "Cloudflare"],
			["Copyright", "CC BY-NC-SA 4.0"],
		],
	);
	assert.equal(badges.at(-1)?.href, license.url);
});

test("optional badges follow enabled services and the configured license", () => {
	const badges = getFooterBadges({
		commentService: "giscus",
		umamiEnabled: true,
		license: {
			...license,
			name: "CC BY 4.0",
			url: "https://example.com/license",
		},
	});
	assert.equal(
		badges.find(({ label }) => label === "Comments")?.value,
		"Giscus",
	);
	assert.equal(badges.find(({ label }) => label === "Count")?.value, "Umami");
	assert.equal(badges.at(-1)?.value, "CC BY 4.0");
	assert.equal(badges.at(-1)?.href, "https://example.com/license");
});

test("disabled comments, analytics and copyright do not advertise active services", () => {
	const badges = getFooterBadges({
		commentService: "none",
		umamiEnabled: false,
		license: { ...license, enable: false },
	});
	assert.deepEqual(
		badges.map(({ label }) => label),
		["Build", "Style", "Search", "CDN"],
	);
});

test("local responsive badges sit between the attribution and uptime", () => {
	const footer = readFileSync(
		new URL("../src/components/layout/Footer.astro", import.meta.url),
		"utf8",
	);
	const component = readFileSync(
		new URL("../src/components/layout/FooterBadges.astro", import.meta.url),
		"utf8",
	);
	assert.ok(
		footer.indexOf("<FooterBadges />") >
			footer.indexOf("Power by xiaoxiaoboluo"),
	);
	assert.ok(
		footer.indexOf("<SiteUptime />") > footer.indexOf("<FooterBadges />"),
	);
	assert.match(component, /analyticsConfig\.umamiAnalytics\?\.websiteId/);
	assert.match(component, /commentService: commentConfig\.type/);
	assert.match(component, /flex-wrap:\s*wrap/);
	assert.match(component, /justify-content:\s*center/);
	assert.match(component, /data-i18n-en="Site technology and services"/);
	assert.match(component, /data-i18n-skip/);
	assert.match(component, /data-pagefind-ignore/);
	assert.match(component, /<Icon\s/);
	assert.doesNotMatch(component, /<img\b|<script\b|shields\.io/);
});
