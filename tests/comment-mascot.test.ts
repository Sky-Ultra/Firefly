import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import manifest from "../public/assets/images/comment-mascots/manifest.json";
import { chooseCommentMascot } from "../src/utils/comment-mascot";

test("mascot pool preserves originals, contains no repeated content, and reaches both ends of the pool", () => {
	assert.ok(manifest.items.length > 0);
	assert.equal(
		new Set(manifest.items.map((item) => item.sha256)).size,
		manifest.items.length,
	);
	assert.equal(chooseCommentMascot(() => 0)?.sha256, manifest.items[0].sha256);
	assert.equal(
		chooseCommentMascot(() => 0.999999)?.sha256,
		manifest.items.at(-1)?.sha256,
	);
	for (const item of manifest.items) {
		const bytes = readFileSync(
			new URL(`../public${item.src}`, import.meta.url),
		);
		assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
		assert.equal(
			readFileSync(new URL(`../public${item.still}`, import.meta.url)).toString(
				"hex",
				0,
				8,
			),
			"89504e470d0a1a0a",
		);
	}
});

test("book wall only exposes literary filters, keeps honest reading links and marks all books read", () => {
	const page = readFileSync(
		new URL("../src/pages/novels.astro", import.meta.url),
		"utf8",
	);
	assert.doesNotMatch(page, /data-novel-source=|novel-access-status/);
	assert.match(page, /data-novel-category=/);
	assert.match(page, /zh="看过" en="Read"/);
	assert.match(page, /novelAccessLabel\(source\)/);
});
