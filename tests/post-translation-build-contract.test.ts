import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const schemaSource = readFileSync(
	new URL("../src/content.config.ts", import.meta.url),
	"utf8",
);
const newPostSource = readFileSync(
	new URL("../scripts/new-post.js", import.meta.url),
	"utf8",
);
const packageJson = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { scripts: Record<string, string> };

test("post schema requires all reader-facing English metadata", () => {
	for (const field of ["titleEn", "descriptionEn", "tagsEn", "categoryEn"]) {
		assert.match(schemaSource, new RegExp(`${field}: z\\.[^\\n]+`));
		assert.doesNotMatch(
			schemaSource,
			new RegExp(`${field}: z\\.[^\\n]+\\.optional\\(`),
		);
	}
	assert.match(schemaSource, /tagsEn: z\.array\(z\.string\(\)\)/);
});

test("new-post scaffolds paired Markdown and MDX translations", () => {
	for (const field of [
		"titleEn:",
		"descriptionEn:",
		"tagsEn:",
		"categoryEn:",
	]) {
		assert.ok(newPostSource.includes(field), `missing ${field}`);
	}

	assert.match(newPostSource, /\.en\.\$\{extension\}/);
	assert.match(newPostSource, /translationOf:/);
	assert.match(newPostSource, /sourceHash:/);
	assert.match(newPostSource, /Translate this article/);
	assert.match(newPostSource, /path\.dirname\(translationPath\)/);
	assert.match(newPostSource, /existsSync\(translationPath\)/);
	assert.match(newPostSource, /fileExtensionRegex/);
});

test("translation validation gates check and build", () => {
	assert.equal(
		packageJson.scripts["check:translations"],
		"tsx scripts/check-post-translations.ts",
	);
	assert.match(
		packageJson.scripts.check,
		/^tsx scripts\/check-post-translations\.ts && astro check$/,
	);
	assert.ok(
		packageJson.scripts.build.indexOf(
			"tsx scripts/check-post-translations.ts",
		) < packageJson.scripts.build.indexOf("astro build"),
	);
});
