import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
	computeSourceHash,
	getTranslationRelativePath,
	validatePostTranslations,
} from "../scripts/lib/post-translation-validator";

function createFixture() {
	const root = mkdtempSync(path.join(tmpdir(), "firefly-post-translations-"));
	const postsDir = path.join(root, "posts");
	const translationsDir = path.join(root, "translations");
	mkdirSync(postsDir, { recursive: true });
	mkdirSync(translationsDir, { recursive: true });

	return {
		postsDir,
		translationsDir,
		writePost(relativePath: string, content: string) {
			const target = path.join(postsDir, relativePath);
			mkdirSync(path.dirname(target), { recursive: true });
			writeFileSync(target, content, "utf8");
		},
		writeTranslation(relativePath: string, content: string) {
			const target = path.join(translationsDir, relativePath);
			mkdirSync(path.dirname(target), { recursive: true });
			writeFileSync(target, content, "utf8");
		},
		cleanup() {
			rmSync(root, { recursive: true, force: true });
		},
	};
}

function translation(
	sourcePath: string,
	source: string,
	body = "Translated body",
) {
	return `---\ntranslationOf: ${sourcePath}\nsourceHash: ${computeSourceHash(source)}\n---\n\n${body}\n`;
}

test("maps Markdown, MDX, and nested index paths", () => {
	assert.equal(
		getTranslationRelativePath("code-examples.md"),
		"code-examples.en.md",
	);
	assert.equal(
		getTranslationRelativePath("mdx-example.mdx"),
		"mdx-example.en.mdx",
	);
	assert.equal(
		getTranslationRelativePath("guide\\index.md"),
		"guide/index.en.md",
	);
	assert.throws(
		() => getTranslationRelativePath("cover.png"),
		/Markdown or MDX/i,
	);
});

test("creates a prefixed, deterministic SHA-256 hash", () => {
	assert.match(computeSourceHash("hello"), /^sha256:[a-f0-9]{64}$/);
	assert.equal(computeSourceHash("hello"), computeSourceHash("hello"));
	assert.notEqual(computeSourceHash("hello"), computeSourceHash("hello!"));
});

test("accepts valid Markdown, MDX, and nested pairs", () => {
	const fixture = createFixture();
	try {
		for (const sourcePath of ["post.md", "demo.mdx", "guide/index.md"]) {
			const source = `---\ntitle: ${sourcePath}\n---\n\nSource body\n`;
			fixture.writePost(sourcePath, source);
			fixture.writeTranslation(
				getTranslationRelativePath(sourcePath),
				translation(sourcePath, source),
			);
		}

		assert.deepEqual(
			validatePostTranslations({
				postsDir: fixture.postsDir,
				translationsDir: fixture.translationsDir,
			}),
			[],
		);
	} finally {
		fixture.cleanup();
	}
});

test("reports a missing translation", () => {
	const fixture = createFixture();
	try {
		fixture.writePost("missing.md", "Missing source");
		const issues = validatePostTranslations(fixture);
		assert.deepEqual(
			issues.map((issue) => issue.code),
			["missing-translation"],
		);
		assert.equal(issues[0]?.sourcePath, "missing.md");
		assert.equal(issues[0]?.translationPath, "missing.en.md");
	} finally {
		fixture.cleanup();
	}
});

test("reports an orphan translation", () => {
	const fixture = createFixture();
	try {
		fixture.writeTranslation(
			"orphan.en.md",
			"---\ntranslationOf: orphan.md\nsourceHash: sha256:deadbeef\n---\n\nOrphan\n",
		);
		const issues = validatePostTranslations(fixture);
		assert.deepEqual(
			issues.map((issue) => issue.code),
			["orphan-translation"],
		);
		assert.equal(issues[0]?.translationPath, "orphan.en.md");
	} finally {
		fixture.cleanup();
	}
});

test("reports wrong translationOf and a stale hash", () => {
	const fixture = createFixture();
	try {
		const source = "Current source";
		fixture.writePost("post.md", source);
		fixture.writeTranslation(
			"post.en.md",
			"---\ntranslationOf: other.md\nsourceHash: sha256:deadbeef\n---\n\nEnglish body\n",
		);
		const codes = validatePostTranslations(fixture).map((issue) => issue.code);
		assert.deepEqual(codes, ["invalid-translation-of", "stale-source-hash"]);
	} finally {
		fixture.cleanup();
	}
});

test("reports a missing hash", () => {
	const fixture = createFixture();
	try {
		fixture.writePost("post.md", "Source");
		fixture.writeTranslation(
			"post.en.md",
			"---\ntranslationOf: post.md\n---\n\nEnglish body\n",
		);
		assert.deepEqual(
			validatePostTranslations(fixture).map((issue) => issue.code),
			["missing-source-hash"],
		);
	} finally {
		fixture.cleanup();
	}
});

test("reports blank and placeholder-only bodies", () => {
	for (const body of ["", "TODO", "Translate this article"]) {
		const fixture = createFixture();
		try {
			const source = "Source";
			fixture.writePost("post.md", source);
			fixture.writeTranslation(
				"post.en.md",
				translation("post.md", source, body),
			);
			assert.deepEqual(
				validatePostTranslations(fixture).map((issue) => issue.code),
				["empty-translation"],
			);
		} finally {
			fixture.cleanup();
		}
	}
});

test("returns stable paths and readable messages", () => {
	const fixture = createFixture();
	try {
		fixture.writePost("nested/post.md", "Source");
		const [issue] = validatePostTranslations(fixture);
		assert.equal(issue?.sourcePath, "nested/post.md");
		assert.equal(issue?.translationPath, "nested/post.en.md");
		assert.match(issue?.message ?? "", /nested\/post\.md/);
	} finally {
		fixture.cleanup();
	}
});
