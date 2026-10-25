import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, resolve, sep } from "node:path";
import test from "node:test";
import { ensureRandomCoverOriginals } from "../scripts/ensure-random-cover-originals.mjs";

async function removeFixture(root: string) {
	assert.ok(root.startsWith(resolve(tmpdir()) + sep));
	assert.ok(basename(root).startsWith("firefly-cover-assets-"));
	await rm(root, { recursive: true, force: true });
}

async function fixture(id: string, originalUrl: string) {
	const root = await mkdtemp(resolve(tmpdir(), "firefly-cover-assets-"));
	await mkdir(resolve(root, "src/Useing Picture"), { recursive: true });
	await mkdir(resolve(root, "dist/_astro"), { recursive: true });
	const pool = JSON.stringify([{ id, originalUrl }]).replaceAll('"', "&quot;");
	await writeFile(
		resolve(root, "dist/index.html"),
		`<div data-random-cover-pool="${pool}"></div>`,
	);
	return root;
}

test("restores a missing encoded original with exact bytes and leaves existing assets unchanged", async () => {
	const root = await fixture(
		"../Useing Picture/原图.avif",
		"/_astro/%E5%8E%9F%E5%9B%BE.hash.avif",
	);
	try {
		const bytes = Buffer.from([0, 1, 10, 13, 128, 255]);
		await writeFile(resolve(root, "src/Useing Picture/原图.avif"), bytes);
		assert.deepEqual(await ensureRandomCoverOriginals(root), {
			checked: 1,
			restored: 1,
		});
		assert.deepEqual(
			await readFile(resolve(root, "dist/_astro/原图.hash.avif")),
			bytes,
		);
		await writeFile(
			resolve(root, "src/Useing Picture/原图.avif"),
			"later source",
		);
		assert.deepEqual(await ensureRandomCoverOriginals(root), {
			checked: 1,
			restored: 0,
		});
		assert.deepEqual(
			await readFile(resolve(root, "dist/_astro/原图.hash.avif")),
			bytes,
		);
	} finally {
		await removeFixture(root);
	}
});

test("rejects sources outside the image pools and output paths outside generated assets", async () => {
	for (const [id, url, message] of [
		["../../.env", "/_astro/file.avif", /source escaped/],
		["../Useing Picture/file.avif", "/outside/file.avif", /URL escaped/],
		[
			"../Useing Picture/file.avif",
			"/_astro/%2e%2e%2foutside.avif",
			/path escaped/,
		],
	] as const) {
		const root = await fixture(id, url);
		try {
			await assert.rejects(ensureRandomCoverOriginals(root), message);
		} finally {
			await removeFixture(root);
		}
	}
});
