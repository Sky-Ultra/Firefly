import { createHash } from "node:crypto";
import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2] || "E:/Picture of ACGN/Wuwa GIF";
const root = path.resolve("public/assets/images/comment-mascots");
const manifestPath = path.join(root, "manifest.json");
await mkdir(root, { recursive: true });
let manifest = { version: 1, items: [] };
try {
	manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (error) {
	if (error.code !== "ENOENT") throw error;
}
const known = new Map(manifest.items.map((item) => [item.sha256, item]));
let added = 0;
for (const file of (await readdir(source, { withFileTypes: true })).sort(
	(a, b) => a.name.localeCompare(b.name),
)) {
	if (!file.isFile() || !/\.(gif|webp|png)$/i.test(file.name)) continue;
	const input = path.join(source, file.name);
	const bytes = await readFile(input);
	const sha256 = createHash("sha256").update(bytes).digest("hex");
	if (known.has(sha256)) continue;
	const info = await sharp(bytes, { animated: true }).metadata();
	const extension =
		info.format === "gif" ? ".gif" : info.format === "webp" ? ".webp" : ".png";
	const name = sha256.slice(0, 24);
	await copyFile(input, path.join(root, name + extension));
	await sharp(bytes)
		.resize({
			width: 160,
			height: 160,
			fit: "inside",
			withoutEnlargement: true,
		})
		.png()
		.toFile(path.join(root, `${name}-still.png`));
	const item = {
		sha256,
		src: `/assets/images/comment-mascots/${name}${extension}`,
		still: `/assets/images/comment-mascots/${name}-still.png`,
	};
	known.set(sha256, item);
	added++;
}
manifest.items = [...known.values()];
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
	`Comment mascots: ${manifest.items.length} unique files, ${added} added (original animations preserved).`,
);
