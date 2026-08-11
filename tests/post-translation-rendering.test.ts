import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(relativePath: string): string {
	return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const postPage = source("src/pages/posts/[...slug].astro");
const mainGrid = source("src/layouts/MainGridLayout.astro");
const postMeta = source("src/components/layout/PostMeta.astro");
const sideBar = source("src/components/layout/SideBar.astro");
const sidebarToc = source("src/components/widget/SidebarTOC.astro");
const floatingControls = source(
	"src/components/controls/FloatingControls.astro",
);
const floatingToc = source("src/components/controls/FloatingTOC.astro");
const tocUtils = source("src/utils/toc-utils.ts");
const encryptedContent = source(
	"src/components/features/EncryptedContent.astro",
);
const license = source("src/components/misc/License.astro");
const sharePoster = source("src/components/misc/SharePoster.svelte");

test("post page loads every paired translation without a one-post special case", () => {
	assert.match(postPage, /getPostTranslation\(entry\.id\)/);
	assert.doesNotMatch(postPage, /personal-website-introduction-en\.md/);
	assert.match(postPage, /const EnglishContent = translation\.Content/);
});

test("article title, metrics, metadata, and body have English values", () => {
	assert.match(postPage, /data-document-title-en/);
	assert.match(postPage, /translation\.words/);
	assert.match(postPage, /translation\.minutes/);
	assert.match(postPage, /tagsEn=\{entry\.data\.tagsEn\}/);
	assert.match(postPage, /categoryEn=\{entry\.data\.categoryEn\}/);
	assert.match(
		postPage,
		/<div data-language-only="zh-CN"[^>]*>[\s\S]*?<Content \/>[\s\S]*?<div data-language-only="en"[^>]*>[\s\S]*?<EnglishContent \/>/,
	);
	assert.match(postMeta, /tagsEn\?: string\[\]/);
	assert.match(postMeta, /categoryEn\?: string/);
	assert.match(postMeta, /<LocalizedText\s+zh=\{category/);
});

test("both translated bodies remain inside the encrypted payload", () => {
	assert.match(
		postPage,
		/<EncryptedPost[\s\S]*?data-language-only="zh-CN"[\s\S]*?<Content \/>[\s\S]*?data-language-only="en"[\s\S]*?<EnglishContent \/>[\s\S]*?<\/EncryptedPost>/,
	);
	assert.match(
		encryptedContent,
		/window\.fireflyLanguage\?\.apply\(contentEl\)/,
	);
});

test("banner and both TOC control chains receive English headings and metrics", () => {
	for (const componentSource of [
		mainGrid,
		sideBar,
		sidebarToc,
		floatingControls,
		floatingToc,
	]) {
		assert.match(componentSource, /headingsEn/);
	}
	assert.match(mainGrid, /titleEn/);
	assert.match(mainGrid, /wordsEn/);
	assert.match(mainGrid, /minutesEn/);
	assert.match(mainGrid, /<LocalizedText zh=\{bannerPostMeta\.title\}/);
	assert.match(
		tocUtils,
		/\[data-language-only\]:not\(\[hidden\]\).*\.markdown-content/,
	);
	assert.match(sidebarToc, /LANGUAGE_CHANGE_EVENT/);
	assert.match(floatingToc, /LANGUAGE_CHANGE_EVENT/);
});

test("license and generated share poster use the active article language", () => {
	assert.match(license, /titleEn\?: string/);
	assert.match(license, /<LocalizedText zh=\{title\} en=\{titleEn/);
	assert.match(sharePoster, /export let titleEn/);
	assert.match(sharePoster, /export let descriptionEn/);
	assert.match(sharePoster, /LANGUAGE_CHANGE_EVENT/);
	assert.match(sharePoster, /activeTitle/);
	assert.match(sharePoster, /activeDescription/);
});
