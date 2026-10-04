import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";

const root = resolve(import.meta.dirname, "..");
const sites = [
	{ directory: "RhineGenshin", title: "提瓦特旅途档案", prefix: "TEYVAT" },
	{ directory: "RhineStarRail", title: "星穹", prefix: "ASTRAL-EXPRESS" },
];

test("prebuilt Rhine releases retain exact bytes when uploaded through Git", () => {
	const attributes = readFileSync(resolve(root, ".gitattributes"), "utf8");
	for (const site of sites) {
		assert.ok(
			attributes.split(/\r?\n/).includes(`/public/${site.directory}/** -text`),
			`${site.directory} must bypass text normalization`,
		);
	}
});

for (const site of sites) {
	const base = `/${site.directory}/`;
	const directory = resolve(root, "public", site.directory);
	const read = (file: string) => readFileSync(resolve(directory, file), "utf8");

	test(`${site.directory} is an independent page, not a main-site layout`, () => {
		assert.ok(
			existsSync(resolve(directory, "index.html")),
			"standalone release must exist",
		);
		const html = read("index.html");
		assert.ok(html.includes(site.title));
		assert.match(html, /data-pagefind-ignore/);
		assert.match(html, /name="robots" content="noindex, nofollow"/);
		assert.doesNotMatch(
			html,
			/id="(?:navbar|swup-container|left-sidebar|right-sidebar)"/,
		);
		for (const match of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
			assert.ok(
				match[1].startsWith(base),
				`HTML URL escaped ${base}: ${match[1]}`,
			);
		}
	});

	test(`${site.directory} keeps its install identity and worker inside its path`, () => {
		assert.ok(
			existsSync(resolve(directory, "manifest.webmanifest")),
			"manifest must exist",
		);
		const manifest = JSON.parse(read("manifest.webmanifest"));
		assert.equal(manifest.id, base);
		assert.equal(manifest.scope, base);
		assert.equal(manifest.start_url, `${base}?source=pwa`);
		for (const icon of manifest.icons) {
			assert.ok(!icon.src.startsWith("/") && !icon.src.includes(".."));
			assert.ok(existsSync(resolve(directory, icon.src)));
		}
		const worker = read("sw.js");
		assert.ok(worker.includes("new URL(self.registration.scope).pathname"));
		assert.ok(worker.includes("new URL(path, self.registration.scope)"));
		assert.doesNotMatch(worker, /__CACHE_VERSION__|__PRECACHE_FILES__/);
	});

	test(`${site.directory} contains a complete runtime release and forty downloads`, () => {
		assert.ok(
			existsSync(resolve(directory, "pwa-build.json")),
			"runtime manifest must exist",
		);
		const metadata = JSON.parse(read("pwa-build.json"));
		assert.match(metadata.version, /^[a-f0-9]{16}$/);
		const downloads = metadata.files.filter((file: string) =>
			file.startsWith("archives/"),
		);
		assert.equal(downloads.length, 40);
		assert.ok(
			downloads.every((file: string) =>
				file.startsWith(`archives/${site.prefix}-X-`),
			),
		);
		for (const file of metadata.files) {
			assert.ok(!file.startsWith("/") && !file.includes(".."));
			assert.doesNotMatch(file, /\.(?:ts|map|blend|mp4)$/);
			assert.ok(statSync(resolve(directory, file)).size > 0);
			assert.ok(statSync(resolve(directory, file)).size < 25 * 1024 * 1024);
			if (file.endsWith(".css")) {
				for (const match of read(file).matchAll(/url\(["']?(\/[^\s)"']+)/g)) {
					assert.ok(
						match[1].startsWith(base),
						`CSS URL escaped ${base}: ${match[1]}`,
					);
				}
			}
		}
		assert.match(
			read("licenses/rhine-lab-ui-MIT.txt"),
			/Copyright \(c\) 2026 LBEILC/,
		);
		assert.ok(existsSync(resolve(directory, "fonts/NOTICE.txt")));
		assert.ok(existsSync(resolve(directory, "fonts/MiSans-license.pdf")));
		assert.ok(!existsSync(resolve(directory, "fonts/novecento")));
	});
}

test("Rhine pages do not become main-site navigation or article entrances", () => {
	const navigation = readFileSync(
		resolve(root, "src/config/navBarConfig.ts"),
		"utf8",
	);
	assert.doesNotMatch(navigation, /RhineGenshin|RhineStarRail/);
});

test("Rhine response rules are scoped to the two standalone directories", () => {
	const path = resolve(root, "public/_headers");
	assert.ok(existsSync(path), "scoped response rules must exist");
	const headers = readFileSync(path, "utf8");
	const rules = headers.split(/\r?\n/).filter((line) => line.startsWith("/"));
	assert.ok(rules.length > 0);
	assert.ok(rules.every((rule) => /^\/Rhine(?:Genshin|StarRail)\//.test(rule)));
});
