import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { sidebarLayoutConfig } from "../src/config/sidebarConfig";
import { siteConfig } from "../src/config/siteConfig";
import { getPostListPageSize } from "../src/utils/pagination-utils";

test("pagination is disabled and all posts fit on the homepage", () => {
	assert.equal(siteConfig.pagination.enable, false);
	assert.equal(getPostListPageSize(24, siteConfig.pagination), 24);
	assert.equal(getPostListPageSize(1, siteConfig.pagination), 1);
	assert.equal(getPostListPageSize(0, siteConfig.pagination), 1);
	const homepage = readFileSync(
		new URL("../src/pages/[...page].astro", import.meta.url),
		"utf8",
	);
	assert.match(
		homepage,
		/getPostListPageSize\(allBlogPosts\.length, siteConfig\.pagination\)/,
	);
});

test("pagination can be restored without losing the original page size", () => {
	assert.equal(siteConfig.pagination.postsPerPage, 15);
	assert.equal(getPostListPageSize(24, { enable: true, postsPerPage: 15 }), 15);
	assert.equal(getPostListPageSize(24, { postsPerPage: 15 }), 15);
});

test("article pages show the desktop relationship timer without duplicating the mobile bottom timer", () => {
	const desktop = sidebarLayoutConfig.leftComponents.find(
		(widget) => widget.type === "relationship",
	);
	const mobileBottom = sidebarLayoutConfig.mobileBottomComponents.find(
		(widget) => widget.type === "relationship",
	);
	assert.equal(desktop?.showOnPostPage, true);
	assert.equal(mobileBottom?.showOnPostPage, false);
});

test("comments precede recommendations on both devices with the mobile timer between them", () => {
	const article = readFileSync(
		new URL("../src/pages/posts/[...slug].astro", import.meta.url),
		"utf8",
	);
	assert.match(article, /data-post-comments class="order-1"/);
	assert.match(
		article,
		/data-mobile-post-relationship class="order-2 mb-4 md:hidden"/,
	);
	assert.match(article, /data-post-recommendations class="order-3"/);
	assert.equal(article.match(/<Comment post=\{entry\}/g)?.length, 1);
	assert.match(article, /<RelationshipTimer class="block"/);
	assert.match(article, /mobileRelationshipConfig\?\.enable/);
	const recommendations = readFileSync(
		new URL("../src/components/misc/RecommendedPost.astro", import.meta.url),
		"utf8",
	);
	assert.ok(
		recommendations.indexOf("I18nKey.relatedPosts") <
			recommendations.indexOf("I18nKey.randomPosts"),
	);
});

test("shared comments render the requested hint as two localized lines", () => {
	const comment = readFileSync(
		new URL("../src/components/comment/index.astro", import.meta.url),
		"utf8",
	);
	const chinese = readFileSync(
		new URL("../src/i18n/languages/zh_CN.ts", import.meta.url),
		"utf8",
	);
	assert.match(
		chinese,
		/无需注册，只需填写邮箱\\n若使用QQ邮箱可以自动拉取QQ头像/,
	);
	assert.match(comment, /whitespace-pre-line/);
	assert.match(comment, /localizedI18n\(Key.commentSubtitle\)/);
});
