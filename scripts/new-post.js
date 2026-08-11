/* This is a script to create paired Chinese and English post files. */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: pnpm new-post -- <filename>`);
	process.exit(1);
}

let fileName = args[0];

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

const sourceRelativePath = fileName.replaceAll("\\", "/");
const extension = path.extname(sourceRelativePath).slice(1).toLowerCase();
const baseName = sourceRelativePath.slice(0, -(extension.length + 1));
const translationRelativePath = `${baseName}.en.${extension}`;
const targetDir = path.resolve("./src/content/posts");
const translationDir = path.resolve("./src/content/translations");
const fullPath = path.join(targetDir, sourceRelativePath);
const translationPath = path.join(translationDir, translationRelativePath);

if (fs.existsSync(fullPath) || fs.existsSync(translationPath)) {
	console.error(
		`Error: Refusing to create a partial pair because ${fullPath} or ${translationPath} already exists.`,
	);
	process.exit(1);
}

const dirPath = path.dirname(fullPath);
const translationDirPath = path.dirname(translationPath);
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath, { recursive: true });
}
if (!fs.existsSync(translationDirPath)) {
	fs.mkdirSync(translationDirPath, { recursive: true });
}

const content = `---
title: ${JSON.stringify(args[0])}
titleEn: ""
published: ${getDate()}
description: ""
descriptionEn: ""
image: random
tags: []
tagsEn: []
category: ""
categoryEn: ""
draft: false
lang: ""
---
`;

const translationContent = `---
translationOf: ${JSON.stringify(sourceRelativePath)}
sourceHash: ""
---

Translate this article
`;

fs.writeFileSync(fullPath, content, "utf8");
fs.writeFileSync(translationPath, translationContent, "utf8");

console.log(`Post pair created:\n- ${fullPath}\n- ${translationPath}`);
