import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { commentConfig } from "../src/config/commentConfig";

test("guestbook uses the site repository's Giscus configuration", () => {
	assert.equal(commentConfig.type, "giscus");
	assert.deepEqual(commentConfig.enabledOn, {
		guestbook: true,
		posts: false,
		friends: false,
	});
	assert.deepEqual(commentConfig.giscus, {
		repo: "Sky-Ultra/Firefly",
		repoId: "R_kgDOTTmvEA",
		category: "Announcements",
		categoryId: "DIC_kwDOTTmvEM4DFbqx",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		lang: "zh-CN",
		loading: "lazy",
	});
});

test("guestbook shows the Giscus credit without the coming-soon mask", () => {
	const guestbook = readFileSync(
		new URL("../src/pages/guestbook.astro", import.meta.url),
		"utf8",
	);

	assert.match(guestbook, /commentConfig\.enabledOn\?\.guestbook !== false/);
	assert.match(guestbook, /特别鸣谢Giscus技术支持/);
	assert.doesNotMatch(guestbook, /guestbook-comment-mask/);
});

test("article and friends comments remain outside the enabled scope", () => {
	const posts = readFileSync(
		new URL("../src/pages/posts/[...slug].astro", import.meta.url),
		"utf8",
	);
	const friends = readFileSync(
		new URL("../src/pages/friends.astro", import.meta.url),
		"utf8",
	);

	assert.match(posts, /commentConfig\.enabledOn\?\.posts !== false/);
	assert.match(friends, /commentConfig\.enabledOn\?\.friends !== false/);
});
