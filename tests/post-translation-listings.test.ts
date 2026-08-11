import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath: string): string {
	return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const postCard = source("src/components/layout/PostCard.astro");
const postPage = source("src/components/layout/PostPage.astro");
const schema = source("src/content.config.ts");
const contentUtils = source("src/utils/content-utils.ts");
const api = source("src/pages/api/allPostMeta.json.ts");
const article = source("src/pages/posts/[...slug].astro");
const recommended = source("src/components/misc/RecommendedPost.astro");
const calendar = source("src/components/widget/Calendar.astro");
const ogImage = source("src/pages/og/[...slug].ts");

test("post cards receive and render all English discovery metadata", () => {
	for (const field of ["titleEn", "descriptionEn", "tagsEn", "categoryEn"]) {
		assert.match(
			postPage,
			new RegExp(`${field}=\\{entry\\.data\\.${field}\\}`),
		);
		assert.match(postCard, new RegExp(`${field}[:?]`));
	}
	assert.match(postCard, /tagsEn=\{tagsEn\}/);
	assert.match(postCard, /categoryEn=\{categoryEn/);
	assert.match(postCard, /<LocalizedText\s+zh=\{tag\.trim\(\)\}\s+en=/);
});

test("previous and next article metadata includes English titles", () => {
	assert.match(schema, /prevTitleEn: z\.string\(\)\.default\(""\)/);
	assert.match(schema, /nextTitleEn: z\.string\(\)\.default\(""\)/);
	assert.match(
		contentUtils,
		/data\.nextTitleEn = sorted\[i - 1\]\.data\.titleEn/,
	);
	assert.match(
		contentUtils,
		/data\.prevTitleEn = sorted\[i \+ 1\]\.data\.titleEn/,
	);
	assert.match(article, /entry\.data\.nextTitleEn/);
	assert.match(article, /entry\.data\.prevTitleEn/);
});

test("shared post metadata endpoint exposes both languages", () => {
	for (const field of ["titleEn", "descriptionEn", "categoryEn"]) {
		assert.match(api, new RegExp(`${field}: post\\.data\\.${field}`));
	}
});

test("recommendations update from the current language without refetching", () => {
	assert.match(recommended, /<LocalizedText\s+zh=\{post\.data\.title\}/);
	assert.match(recommended, /window\.fireflyLanguage\?\.get\(\)/);
	assert.match(recommended, /firefly:language-change/);
	assert.match(recommended, /title\.textContent = .*titleEn/);
	assert.match(
		recommended,
		/var description = isEnglish \? post\.descriptionEn : post\.description/,
	);
	assert.match(recommended, /desc\.textContent = description/);
	assert.doesNotMatch(
		recommended,
		/innerHTML\s*=\s*`[^`]*\$\{post\.(?:title|titleEn|description|descriptionEn|category|categoryEn)\}/s,
	);
});

test("calendar titles update from the current language and escape HTML templates", () => {
	assert.match(calendar, /window\.fireflyLanguage\?\.get\(\)/);
	assert.match(calendar, /firefly:language-change/);
	assert.match(calendar, /function escapeHtml/);
	assert.match(calendar, /escapeHtml\(getPostTitle\(post\)\)/);
	assert.match(calendar, /titleEn: post\.titleEn/);
});

test("Pagefind keeps one article result while indexing both bodies", () => {
	assert.match(article, /data-language-only="zh-CN"\s+data-pagefind-body/);
	assert.match(article, /data-language-only="en"\s+data-pagefind-body/);
	assert.equal((article.match(/data-pagefind-meta="title"/g) || []).length, 1);
});

test("OG images remain on the shared route with Chinese metadata", () => {
	assert.match(ogImage, /children: post\.data\.title/);
	assert.match(ogImage, /const description = post\.data\.description/);
	assert.doesNotMatch(ogImage, /translations|titleEn|descriptionEn|\.en\./);
});
