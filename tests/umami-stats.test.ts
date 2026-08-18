import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath: string): string {
	return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const analyticsConfig = source("src/config/analyticsConfig.ts");
const layout = source("src/layouts/Layout.astro");
const statsCard = source("src/components/widget/UmamiStats.astro");

test("Umami collection and public stats use deploy-time configuration", () => {
	assert.match(analyticsConfig, /PUBLIC_UMAMI_WEBSITE_ID/);
	assert.match(analyticsConfig, /PUBLIC_UMAMI_SCRIPT_URL/);
	assert.match(analyticsConfig, /PUBLIC_UMAMI_SHARE_URL/);
	assert.match(layout, /analyticsConfig\.umamiAnalytics\.websiteId/);
});

test("the analytics card provides Chinese and English interface copy", () => {
	assert.match(statsCard, /nameEn=\{config\?\.titleEn \|\| "Analytics"\}/);
	assert.match(statsCard, /<LocalizedText zh="总浏览量" en="Total views" \/>/);
	assert.match(statsCard, /<LocalizedText zh="访问数" en="Visits" \/>/);
	assert.match(statsCard, /<LocalizedText zh="游客数" en="Visitors" \/>/);
	assert.match(statsCard, /firefly:language-change/);
});

test("the analytics card keeps Umami share credentials out of source", () => {
	assert.match(statsCard, /x-umami-share-context/);
	assert.match(statsCard, /x-umami-share-token/);
	assert.doesNotMatch(analyticsConfig, /x-umami-api-key/i);
});
