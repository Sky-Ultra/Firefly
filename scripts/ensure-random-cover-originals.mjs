import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const decodeAttribute = (value) =>
	value
		.replaceAll("&quot;", '"')
		.replaceAll("&#39;", "'")
		.replaceAll("&lt;", "<")
		.replaceAll("&gt;", ">")
		.replaceAll("&amp;", "&");

// Astro may prune a duplicate original while retaining its optimized variants.
// Restore only the original URLs actually advertised by the homepage pools.
export async function ensureRandomCoverOriginals(root = process.cwd()) {
	const html = await readFile(resolve(root, "dist/index.html"), "utf8");
	const attributes = [
		...html.matchAll(
			/\bdata-random-cover-(?:pool|mobile-home-wallpaper)="([^"]*)"/g,
		),
	];
	if (attributes.length === 0)
		throw new Error("Homepage cover pools were not generated.");
	const originals = new Map();
	for (const attribute of attributes) {
		for (const image of JSON.parse(decodeAttribute(attribute[1])))
			originals.set(image.id, image.originalUrl);
	}
	let restored = 0;
	for (const [id, address] of originals) {
		const source = resolve(root, "src/utils", id);
		if (
			!["Useing Picture", "Using Picture mobile"].some((pool) =>
				source.startsWith(resolve(root, "src", pool) + sep),
			)
		)
			throw new Error("Cover source escaped its image pool.");
		if (address.startsWith("data:")) continue;
		const url = new URL(address, "https://build.invalid");
		if (
			url.origin !== "https://build.invalid" ||
			!url.pathname.startsWith("/_astro/")
		)
			throw new Error("Original cover URL escaped the asset directory.");
		const destination = resolve(
			root,
			"dist",
			decodeURIComponent(url.pathname).slice(1),
		);
		if (!destination.startsWith(resolve(root, "dist/_astro") + sep))
			throw new Error("Original cover path escaped the asset directory.");
		await stat(source);
		try {
			await stat(destination);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			await mkdir(dirname(destination), { recursive: true });
			await copyFile(source, destination);
			restored++;
		}
	}
	return { checked: originals.size, restored };
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	const result = await ensureRandomCoverOriginals();
	console.log(
		`Original cover resources verified: ${result.checked} files, ${result.restored} restored.`,
	);
}
