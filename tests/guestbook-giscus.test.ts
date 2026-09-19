import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { commentConfig } from "../src/config/commentConfig";

test("guestbook and opted-in posts use the deployed Twikoo service", () => {
	assert.equal(commentConfig.type, "twikoo");
	assert.deepEqual(commentConfig.enabledOn, {
		guestbook: true,
		posts: true,
		friends: false,
	});
	assert.equal(
		commentConfig.twikoo?.envId,
		"https://firefly-twikoo.netlify.app/.netlify/functions/twikoo",
	);
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

test("articles opt in individually while friends comments remain disabled", () => {
	const posts = readFileSync(
		new URL("../src/pages/posts/[...slug].astro", import.meta.url),
		"utf8",
	);
	const schema = readFileSync(
		new URL("../src/content.config.ts", import.meta.url),
		"utf8",
	);
	const summerArticle = readFileSync(
		new URL("../src/content/posts/summer-is-still-there.md", import.meta.url),
		"utf8",
	);
	const friends = readFileSync(
		new URL("../src/pages/friends.astro", import.meta.url),
		"utf8",
	);

	assert.match(posts, /commentConfig\.enabledOn\?\.posts !== false/);
	assert.match(posts, /entry\.data\.comment/);
	assert.match(
		schema,
		/comment: z\.boolean\(\)\.optional\(\)\.default\(false\)/,
	);
	assert.match(summerArticle, /^comment: true$/m);
	assert.match(friends, /commentConfig\.enabledOn\?\.friends !== false/);
});
