import { readdirSync } from "node:fs";
import path from "node:path";
import { validatePostTranslations } from "./lib/post-translation-validator";

function countMarkdownFiles(root: string): number {
	let count = 0;
	for (const entry of readdirSync(root, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			count += countMarkdownFiles(path.join(root, entry.name));
		} else if (/\.(md|mdx)$/i.test(entry.name)) {
			count += 1;
		}
	}
	return count;
}

const postsDir = path.resolve("src/content/posts");
const translationsDir = path.resolve("src/content/translations");
const issues = validatePostTranslations({ postsDir, translationsDir });

if (issues.length > 0) {
	console.error(
		`Post translation validation failed with ${issues.length} issue(s):`,
	);
	for (const issue of issues) {
		console.error(`- [${issue.code}] ${issue.message}`);
	}
	process.exitCode = 1;
} else {
	console.log(
		`Post translations valid: ${countMarkdownFiles(postsDir)} pair(s).`,
	);
}
