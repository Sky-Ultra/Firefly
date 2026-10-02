import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { navBarConfig } from "../src/config/navBarConfig";

const read = (path: string): string =>
	readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("用户协议只作为文章子菜单的独立页面入口，不生成博客文章", () => {
	const posts = navBarConfig.links.find((link) => link.name === "文章");
	assert.ok(posts?.children);
	const policy = posts.children.find((link) => link.url === "/privacy/");
	assert.equal(policy?.name, "用户协议");
	assert.equal(policy?.nameEn, "Terms & Privacy");
	assert.equal(
		navBarConfig.links.some((link) => link.url === "/privacy/"),
		false,
	);
});

test("协议双语正文保留本站身份、评论数据说明、资源和联系信息", () => {
	for (const filename of ["privacy.md", "privacy-en.md"]) {
		const content = read(`src/content/spec/${filename}`);
		for (const text of [
			"Sky",
			"https://xiaoxiaoboluo.cn",
			"mailto:xiaoxiaoboluo@outlook.com",
			"Twikoo",
			"Netlify",
			"GitHub Pages",
			"ipwho.is",
			"Open-Meteo",
			"OpenStreetMap",
			"Umami",
			"QQ",
			"Gravatar",
			"Local Storage",
			"CC BY-NC-SA 4.0",
		]) {
			assert.ok(content.includes(text), `${filename} missing ${text}`);
		}
		assert.equal((content.match(/^## /gm) ?? []).length, 2);
		assert.ok(content.includes("/about/"));
	}
});

test("协议复用现有语言及布局机制，统计状态来自配置且不添加采集或评论脚本", () => {
	const page = read("src/pages/privacy.astro");
	assert.ok(page.includes('data-language-only="zh-CN"'));
	assert.ok(page.includes('data-language-only="en"'));
	assert.ok(page.includes("analyticsConfig.umamiAnalytics?.websiteId"));
	assert.ok(page.includes("analyticsConfig.umamiAnalytics?.replays?.enabled"));
	assert.ok(page.includes('const updated = "2026-10-03"'));
	assert.ok(page.includes("headingsEn={headingsEn}"));
	assert.equal(page.includes("<script"), false);
	assert.equal(page.includes("<Comment"), false);
});
