import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildMaintenance } from "../scripts/build-maintenance.mjs";
import worker from "../scripts/maintenance-worker.mjs";

test("maintenance covers home, article, asset and subproject URLs with noncached 503 responses", async () => {
	for (const path of [
		"/",
		"/posts/liking/",
		"/moments/",
		"/api/allPostMeta.json",
		"/rss.xml",
		"/_astro/old.js",
		"/assets/emojis/moments/grassroots-sigh.webp",
		"/RhineGenshin/",
		"/RhineStarRail/",
		"/RhineWuwa/",
		"/RhineZZZ/",
		"/Stickerwebsite/",
		"/?preview=true",
	]) {
		const response = worker.fetch(
			new Request(`https://xiaoxiaoboluo.cn${path}`),
		);
		assert.equal(response.status, 503, path);
		assert.match(response.headers.get("Cache-Control") || "", /no-store/);
		assert.match(response.headers.get("X-Robots-Tag") || "", /noindex/);
		assert.match(await response.text(), /网站暂时下线/);
	}
	const head = worker.fetch(
		new Request("https://firefly.xiaoxiaoboluo.workers.dev/", {
			method: "HEAD",
		}),
	);
	assert.equal(head.status, 503);
	assert.equal(await head.text(), "");
	assert.equal(
		worker.fetch(new Request("https://xiaoxiaoboluo.cn/", { method: "POST" }))
			.status,
		503,
	);
});

test("offline output removes old generated pages and retains only standalone maintenance files", async () => {
	const root = await mkdtemp(join(tmpdir(), "firefly-maintenance-"));
	try {
		await mkdir(join(root, "dist/posts"), { recursive: true });
		await writeFile(join(root, "dist/posts/old.html"), "old content");
		await writeFile(join(root, "source.txt"), "preserve source");
		buildMaintenance(root);
		assert.deepEqual((await readdir(join(root, "dist"))).sort(), [
			".nojekyll",
			"404.html",
			"index.html",
			"robots.txt",
		]);
		assert.equal(
			readFileSync(join(root, "source.txt"), "utf8"),
			"preserve source",
		);
		assert.match(
			readFileSync(join(root, "dist/404.html"), "utf8"),
			/网站暂时下线/,
		);
	} finally {
		// Explicit test-owned temporary root only.
		await rm(root, { recursive: true, force: true });
	}
});

test("public builds remain offline and the Worker runs before all assets", () => {
	const pkg = JSON.parse(
		readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	);
	const config = JSON.parse(
		readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
	);
	assert.match(pkg.scripts.build, /check-post-translations.*build-maintenance/);
	assert.match(pkg.scripts["build:site"], /astro build/);
	assert.equal(config.main, "scripts/maintenance-worker.mjs");
	assert.equal(config.assets.run_worker_first, true);
	assert.equal(config.preview_urls, false);
});
