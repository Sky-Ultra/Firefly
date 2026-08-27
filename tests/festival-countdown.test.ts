import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath: string): string {
	return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const config = source("src/config/visitorWidgetsConfig.ts");
const widget = source("src/components/widget/FestivalCountdown.astro");

test("the countdown includes Sky's annual birthday", () => {
	assert.match(config, /birthday:\s*\{\s*month:\s*4,\s*day:\s*27,/s);
	assert.match(widget, /data-birthday-days/);
	assert.match(widget, /getDaysUntilBirthday/);
	assert.match(widget, /距离我的生日还剩/);
	assert.match(widget, /My birthday is in/);
});
