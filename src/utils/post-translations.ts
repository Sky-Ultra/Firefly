import type { MarkdownHeading } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { buildTranslationModuleIndex } from "./post-translation-path";

type TranslationFrontmatter = {
	translationOf: string;
	sourceHash: string;
	words?: number;
	minutes?: number;
};

type TranslationModule = {
	Content: AstroComponentFactory;
	frontmatter: TranslationFrontmatter;
	getHeadings: () => MarkdownHeading[];
};

export type PostTranslation = {
	Content: AstroComponentFactory;
	headings: MarkdownHeading[];
	words: number;
	minutes: number;
	translationOf: string;
	sourceHash: string;
};

const translationModules = import.meta.glob<TranslationModule>(
	"../content/translations/**/*.{md,mdx}",
	{ eager: true },
);
const translationIndex = buildTranslationModuleIndex(translationModules);

export function getPostTranslation(id: string): PostTranslation {
	const normalizedId = id
		.replaceAll("\\", "/")
		.replace(/\.(md|mdx)$/i, "")
		.replace(/\/index$/i, "");
	const translation = translationIndex.get(normalizedId);
	if (!translation) {
		throw new Error(`Missing compiled English translation for post "${id}".`);
	}

	return {
		Content: translation.Content,
		headings: translation.getHeadings(),
		words: Number(translation.frontmatter.words ?? 0),
		minutes: Number(translation.frontmatter.minutes ?? 0),
		translationOf: translation.frontmatter.translationOf,
		sourceHash: translation.frontmatter.sourceHash,
	};
}
