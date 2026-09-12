import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
	new URL("../src/config/sidebarConfig.ts", import.meta.url),
	"utf8",
);

test("the mobile relationship timer appears immediately after music", () => {
	const mobileSection = source.slice(source.indexOf("mobileBottomComponents:"));
	const musicIndex = mobileSection.indexOf('type: "music"');
	const relationshipIndex = mobileSection.indexOf('type: "relationship"');
	const categoriesIndex = mobileSection.indexOf('type: "categories"');

	assert.ok(musicIndex >= 0);
	assert.ok(relationshipIndex > musicIndex);
	assert.ok(categoriesIndex > relationshipIndex);

	const betweenMusicAndRelationship = mobileSection.slice(
		musicIndex + 'type: "music"'.length,
		relationshipIndex,
	);
	assert.doesNotMatch(betweenMusicAndRelationship, /type: "/);
});

test("the desktop sidebar order remains unchanged", () => {
	const leftStart = source.indexOf("leftComponents:");
	const rightStart = source.indexOf("rightComponents:");
	const leftSection = source.slice(leftStart, rightStart);

	assert.ok(leftSection.indexOf('type: "music"') >= 0);
	assert.ok(
		leftSection.indexOf('type: "relationship"') >
			leftSection.indexOf('type: "umamiStats"'),
	);
});
