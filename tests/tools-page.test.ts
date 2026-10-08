import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { navBarConfig } from "../src/config/navBarConfig";
import { personalTools, thirdPartyTools } from "../src/config/toolsConfig";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "src/pages/tools.astro"), "utf8");

test("Tools is listed under the personal navigation menu", () => {
	const menu = navBarConfig.links.find((link) => link.name === "我的");
	const toolLink = menu?.children?.find((link) => link.url === "/tools/");
	assert.equal(toolLink?.name, "工具");
	assert.equal(toolLink?.nameEn, "Tools");
	assert.ok(
		!navBarConfig.links
			.find((link) => link.name === "文章")
			?.children?.some((link) => link.url === "/tools/"),
	);
});

test("the sole personal tool links to the deployed Rhine Genshin app and its real icon", () => {
	assert.equal(personalTools.length, 1);
	const tool = personalTools[0];
	assert.equal(tool.name, "Rhine Genshin");
	assert.equal(tool.href, "/RhineGenshin/");
	assert.ok(
		existsSync(resolve(root, "public", tool.href.slice(1), "index.html")),
	);
	assert.ok(
		tool.image && existsSync(resolve(root, "public", tool.image.slice(1))),
	);
	const manifest = JSON.parse(
		readFileSync(
			resolve(root, "public/RhineGenshin/manifest.webmanifest"),
			"utf8",
		),
	);
	assert.match(manifest.description, /原神旅途档案/);
	assert.match(tool.description.zh, /原神任务、人物、典籍/);
	assert.equal(tool.spotlight, true);
});

test("third-party tools remain separately attributed and use category labels", () => {
	assert.equal(thirdPartyTools.length, 12);
	assert.equal(new Set(thirdPartyTools.map((tool) => tool.href)).size, 12);
	for (const tool of thirdPartyTools) {
		assert.equal(new URL(tool.href).protocol, "https:");
		assert.equal(tool.spotlight, undefined);
		assert.doesNotMatch(tool.category.zh, /本人|免费|开源|付费/);
		assert.ok(tool.category.en && tool.description.zh && tool.description.en);
		assert.ok(tool.tags.every((tag) => tag.zh && tag.en));
	}
});

test("the tools page has the approved heading, localized content and accessible decoration", () => {
	assert.match(page, /zh="神器库" en="Toolkit"/);
	assert.doesNotMatch(page, /小众神器库|推荐工具|backdrop-filter/);
	assert.match(page, /tool-starfield" aria-hidden="true"/);
	assert.match(page, /prefers-reduced-motion: reduce/);
	assert.match(page, /\.tool-meteor \{ display: none; \}/);
	assert.match(page, /noopener noreferrer/);
	assert.match(page, /\.tool-card:focus-visible/);
	assert.match(page, /background: var\(--card-bg\)/);
});
