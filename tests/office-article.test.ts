import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const articlePath = new URL(
	"../src/content/posts/install-and-activate-microsoft-office/index.md",
	import.meta.url,
);
const translationPath = new URL(
	"../src/content/translations/install-and-activate-microsoft-office/index.en.md",
	import.meta.url,
);

test("publishes the Office guide with the requested metadata", () => {
	assert.ok(existsSync(articlePath));
	const article = readFileSync(articlePath, "utf8");
	assert.match(article, /^title: 安装并激活 Microsoft Office$/m);
	assert.match(article, /^published: 2026-09-22$/m);
	assert.match(article, /^image: random$/m);
	assert.match(article, /^comment: true$/m);
});

test("keeps all six source screenshots beside the relevant instructions", () => {
	const article = readFileSync(articlePath, "utf8");
	const imageNames = [
		"office-tool-plus-home.png",
		"office-deployment-page.png",
		"office-products-and-languages.png",
		"office-deployment-settings.png",
		"office-activation-page.png",
		"clear-activation-information.png",
	];
	for (const imageName of imageNames) {
		assert.match(article, new RegExp(`\\(\\./${imageName}\\)`));
		assert.ok(
			existsSync(new URL(`../src/content/posts/install-and-activate-microsoft-office/${imageName}`, import.meta.url)),
		);
	}
});

test("preserves the guide's source links and troubleshooting text", () => {
	const article = readFileSync(articlePath, "utf8");
	assert.match(article, /https:\/\/github\.com\/YerongAI\/Office-Tool/);
	assert.match(article, /https:\/\/www\.officetool\.plus\/zh-cn\//);
	assert.match(article, /https:\/\/monitor\.yerong\.org\/kms\//);
	assert.match(article, /https:\/\/github\.com\/zbezj\/HEU_KMS_Activator\/releases\/tag\/64\.0\.0/);
	assert.match(article, /^## 疑难解答$/m);
});

test("keeps the paired English translation current", () => {
	const article = readFileSync(articlePath, "utf8");
	const translation = readFileSync(translationPath, "utf8");
	const sourceHash = createHash("sha256").update(article, "utf8").digest("hex");
	assert.match(
		translation,
		/^translationOf: install-and-activate-microsoft-office\/index\.md$/m,
	);
	assert.match(
		translation,
		new RegExp(`^sourceHash: sha256:${sourceHash}$`, "m"),
	);
});
