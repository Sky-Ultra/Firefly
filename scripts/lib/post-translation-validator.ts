import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type TranslationIssueCode =
	| "missing-translation"
	| "orphan-translation"
	| "invalid-translation-of"
	| "missing-source-hash"
	| "stale-source-hash"
	| "empty-translation";

export interface TranslationIssue {
	code: TranslationIssueCode;
	sourcePath?: string;
	translationPath?: string;
	message: string;
}

export interface TranslationValidationOptions {
	postsDir: string;
	translationsDir: string;
}

type TranslationFrontmatter = {
	translationOf?: string;
	sourceHash?: string;
};

function normalizeRelativePath(filePath: string): string {
	return filePath.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isMarkdownPath(filePath: string): boolean {
	return /\.(md|mdx)$/i.test(filePath);
}

function listMarkdownFiles(root: string): string[] {
	if (!existsSync(root)) return [];

	const result: string[] = [];
	const visit = (directory: string) => {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const absolutePath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				visit(absolutePath);
			} else if (entry.isFile() && isMarkdownPath(entry.name)) {
				result.push(normalizeRelativePath(path.relative(root, absolutePath)));
			}
		}
	};

	visit(root);
	return result.sort((left, right) => left.localeCompare(right));
}

function splitDocument(content: string): {
	frontmatter: string;
	body: string;
} {
	const normalized = content.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
	const opening = normalized.match(/^---[ \t]*\n/);
	if (!opening) {
		return { frontmatter: "", body: normalized };
	}

	const closingDelimiter = /^---[ \t]*(?:\n|$)/gm;
	closingDelimiter.lastIndex = opening[0].length;
	const closing = closingDelimiter.exec(normalized);
	if (!closing) {
		return { frontmatter: "", body: normalized };
	}

	return {
		frontmatter: normalized.slice(opening[0].length, closing.index),
		body: normalized.slice(closing.index + closing[0].length),
	};
}

function parseTranslationFile(content: string): {
	frontmatter: TranslationFrontmatter;
	body: string;
} {
	const { frontmatter: frontmatterText, body } = splitDocument(content);
	const frontmatter: TranslationFrontmatter = {};

	for (const line of frontmatterText.split("\n")) {
		const separatorIndex = line.indexOf(":");
		if (separatorIndex === -1) continue;
		const key = line.slice(0, separatorIndex).trim();
		const value = line
			.slice(separatorIndex + 1)
			.trim()
			.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");

		if (key === "translationOf") frontmatter.translationOf = value;
		if (key === "sourceHash") frontmatter.sourceHash = value;
	}

	return { frontmatter, body };
}

function isEmptyOrPlaceholder(body: string): boolean {
	const value = body.trim();
	if (!value) return true;
	return /^(?:todo|translate this article)[.!\s]*$/i.test(value);
}

export function getTranslationRelativePath(sourceRelativePath: string): string {
	const normalized = normalizeRelativePath(sourceRelativePath);
	const match = normalized.match(/^(.*)\.(md|mdx)$/i);
	if (!match) {
		throw new Error(
			`Expected a Markdown or MDX source path, received: ${sourceRelativePath}`,
		);
	}
	return `${match[1]}.en.${match[2].toLowerCase()}`;
}

export function computeSourceHash(source: string): string {
	// Metadata is independently maintained in the source frontmatter. Only the
	// body needs a matching English revision; retain its paragraph spacing.
	const { body } = splitDocument(source);
	return `sha256:${createHash("sha256").update(body, "utf8").digest("hex")}`;
}

export function validatePostTranslations(
	options: TranslationValidationOptions,
): TranslationIssue[] {
	const sourcePaths = listMarkdownFiles(options.postsDir);
	const translationPaths = listMarkdownFiles(options.translationsDir);
	const expectedTranslations = new Set<string>();
	const issues: TranslationIssue[] = [];

	for (const sourcePath of sourcePaths) {
		const translationPath = getTranslationRelativePath(sourcePath);
		expectedTranslations.add(translationPath);
		const sourceAbsolutePath = path.join(options.postsDir, sourcePath);
		const translationAbsolutePath = path.join(
			options.translationsDir,
			translationPath,
		);

		if (!existsSync(translationAbsolutePath)) {
			issues.push({
				code: "missing-translation",
				sourcePath,
				translationPath,
				message: `${sourcePath} is missing its paired translation at ${translationPath}.`,
			});
			continue;
		}

		const source = readFileSync(sourceAbsolutePath, "utf8");
		const translationContent = readFileSync(translationAbsolutePath, "utf8");
		const { frontmatter, body } = parseTranslationFile(translationContent);

		if (normalizeRelativePath(frontmatter.translationOf ?? "") !== sourcePath) {
			issues.push({
				code: "invalid-translation-of",
				sourcePath,
				translationPath,
				message: `${translationPath} must declare translationOf: ${sourcePath}.`,
			});
		}

		if (!frontmatter.sourceHash) {
			issues.push({
				code: "missing-source-hash",
				sourcePath,
				translationPath,
				message: `${translationPath} does not declare sourceHash for ${sourcePath}.`,
			});
		} else if (frontmatter.sourceHash !== computeSourceHash(source)) {
			issues.push({
				code: "stale-source-hash",
				sourcePath,
				translationPath,
				message: `${translationPath} is stale because the body of ${sourcePath} has changed. Synchronize the English body, then update sourceHash. Frontmatter-only edits do not require a new hash.`,
			});
		}

		if (isEmptyOrPlaceholder(body)) {
			issues.push({
				code: "empty-translation",
				sourcePath,
				translationPath,
				message: `${translationPath} has no completed English body for ${sourcePath}.`,
			});
		}
	}

	for (const translationPath of translationPaths) {
		if (expectedTranslations.has(translationPath)) continue;
		issues.push({
			code: "orphan-translation",
			translationPath,
			message: `${translationPath} does not have a matching source post.`,
		});
	}

	return issues;
}
