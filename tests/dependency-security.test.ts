import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import test from "node:test";
import { strToU8, zipSync } from "fflate";

const require = createRequire(import.meta.url);
const merge = require("deepmerge");
const extract = require("extract-zip");

test("merging null-prototype dictionaries cannot poison the returned prototype", () => {
	const source = JSON.parse('{"__proto__":{"injected":true},"safe":1}');
	const target = Object.create(null);
	for (const result of [merge(target, source), merge(source, { other: 2 })]) {
		assert.equal(Object.getPrototypeOf(result), Object.prototype);
		assert.equal("injected" in result, false);
		assert.equal(Object.hasOwn(result, "__proto__"), false);
	}
	assert.deepEqual(
		merge(
			{ list: [1], nested: { a: true } },
			{ list: [2], nested: { b: true } },
		),
		{ list: [1, 2], nested: { a: true, b: true } },
	);
});

test("icon archive extraction preserves regular files but rejects symbolic links", async () => {
	const parent = resolve(tmpdir());
	const root = await mkdtemp(join(parent, "firefly-zip-security-"));
	assert.ok(root.startsWith(parent + sep) && root !== parent);
	try {
		const normalZip = join(root, "normal.zip");
		const normalDir = join(root, "normal");
		await mkdir(normalDir);
		await writeFile(
			normalZip,
			zipSync({
				"icons/check.svg": strToU8('<svg xmlns="http://www.w3.org/2000/svg"/>'),
			}),
		);
		await extract(normalZip, { dir: normalDir });
		assert.match(
			await readFile(join(normalDir, "icons/check.svg"), "utf8"),
			/<svg/,
		);
		const linkZip = join(root, "link.zip");
		const linkDir = join(root, "links");
		await mkdir(linkDir);
		await writeFile(
			linkZip,
			zipSync({
				"symbolic-link": [strToU8("target.txt"), { os: 3, attrs: 0xa1ff0000 }],
			}),
		);
		await assert.rejects(
			extract(linkZip, { dir: linkDir }),
			/Symbolic links are not permitted in icon archives/,
		);
	} finally {
		const checked = resolve(root);
		assert.ok(
			checked.startsWith(parent + sep + "firefly-zip-security-") &&
				checked !== parent,
		);
		await rm(checked, { recursive: true, force: true });
	}
});
