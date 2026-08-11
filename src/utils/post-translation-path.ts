function normalizePath(filePath: string): string {
	return filePath.replaceAll("\\", "/");
}

export function normalizeTranslationModuleId(modulePath: string): string {
	const normalized = normalizePath(modulePath);
	const marker = "/content/translations/";
	const markerIndex = normalized.lastIndexOf(marker);
	if (markerIndex === -1) {
		throw new Error(
			`Expected a paired English Markdown or MDX module under content/translations: ${modulePath}`,
		);
	}

	const relativePath = normalized.slice(markerIndex + marker.length);
	const match = relativePath.match(/^(.*)\.en\.(md|mdx)$/i);
	if (!match) {
		throw new Error(
			`Expected a paired English Markdown or MDX module ending in .en.md or .en.mdx: ${modulePath}`,
		);
	}

	const withoutExtension = match[1].replace(/\/index$/i, "");
	if (!withoutExtension) {
		throw new Error(
			`Expected a paired English Markdown or MDX article ID: ${modulePath}`,
		);
	}
	return withoutExtension;
}

export function buildTranslationModuleIndex<T>(
	modules: Record<string, T>,
): Map<string, T> {
	const index = new Map<string, T>();
	for (const modulePath of Object.keys(modules).sort((left, right) =>
		left.localeCompare(right),
	)) {
		const id = normalizeTranslationModuleId(modulePath);
		if (index.has(id)) {
			throw new Error(
				`Duplicate English translation modules normalize to article ID "${id}".`,
			);
		}
		index.set(id, modules[modulePath]);
	}
	return index;
}
