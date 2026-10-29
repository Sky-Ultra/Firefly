import {
	lstatSync,
	mkdirSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { maintenanceHtml } from "./maintenance-page.mjs";

export function buildMaintenance(rootDirectory) {
	const root = realpathSync(rootDirectory);
	const output = resolve(root, "dist");
	// Only the generated dist directory immediately inside the explicit root.
	if (dirname(output) !== root || basename(output) !== "dist")
		throw new Error("Unsafe build output");
	try {
		if (lstatSync(output).isSymbolicLink())
			throw new Error("Refusing a linked build output");
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	console.log(`Preparing offline-only output: ${output}`);
	rmSync(output, { recursive: true, force: true });
	mkdirSync(output, { recursive: true });
	writeFileSync(resolve(output, "index.html"), maintenanceHtml);
	writeFileSync(resolve(output, "404.html"), maintenanceHtml);
	writeFileSync(resolve(output, "robots.txt"), "User-agent: *\nDisallow: /\n");
	writeFileSync(resolve(output, ".nojekyll"), "");
	console.log("Offline output ready; original site sources are preserved.");
}

if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	buildMaintenance(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
}
