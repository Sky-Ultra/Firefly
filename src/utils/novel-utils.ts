import type { Novel, NovelSource } from "@/types/novels";

export function normalizeNovelTitle(value: string): string {
	return value
		.normalize("NFKC")
		.toLocaleLowerCase()
		.replaceAll("锺", "钟")
		.replace(/[\s《》〈〉「」⌈⌋“”‘’【】·•．.：:，,、！？!?（）()—-]/gu, "");
}
/** Fail the build on repeated works; collections and separately requested stories remain distinct. */
export function assertUniqueNovels(books: readonly Novel[]): void {
	const ids = new Set<string>();
	const titles = new Map<string, string>();
	for (const book of books) {
		if (ids.has(book.id)) throw new Error(`Duplicate novel id: ${book.id}`);
		ids.add(book.id);
		for (const title of [book.title, ...(book.aliases || [])]) {
			const key = normalizeNovelTitle(title);
			const owner = titles.get(key);
			if (owner && owner !== book.id)
				throw new Error(`Duplicate novel title or alias: ${title}`);
			titles.set(key, book.id);
		}
	}
}
export const novelSources = {
	qimao: { zh: "七猫免费小说", en: "Qimao" },
	wikisource: { zh: "维基文库", en: "Wikisource" },
	weread: { zh: "微信读书", en: "WeRead" },
	gutenberg: { zh: "古腾堡计划", en: "Project Gutenberg" },
	xinhua: { zh: "新华书店", en: "Xinhua Books" },
	aozora: { zh: "青空文库", en: "Aozora Bunko" },
	fadedpage: { zh: "Faded Page", en: "Faded Page" },
} as const;

export const novelCategories = {
	classics: { zh: "中国古典", en: "Chinese classics" },
	chinese: { zh: "中国现当代", en: "Modern Chinese" },
	world: { zh: "外国文学", en: "World literature" },
	scifi: { zh: "科幻", en: "Science fiction" },
	drama: { zh: "戏剧", en: "Drama" },
	essays: { zh: "散文与哲思", en: "Essays & philosophy" },
	short: { zh: "中短篇与小说集", en: "Short fiction" },
} as const;

export function novelAccessLabel(source: NovelSource): {
	zh: string;
	en: string;
} {
	if (source.access === "partial")
		return { zh: "部分篇目", en: "Partial text" };
	if (source.access === "preview") return { zh: "试读", en: "Preview" };
	return (
		{
			zh: { zh: "阅读", en: "Read" },
			en: { zh: "英文版", en: "English" },
			ja: { zh: "日文版", en: "Japanese" },
			ru: { zh: "俄文版", en: "Russian" },
		} as const
	)[source.language];
}

export function novelStatusLabel(access: NovelSource["access"]): {
	zh: string;
	en: string;
} {
	return {
		open: { zh: "可直读", en: "Open reading" },
		preview: { zh: "平台试读", en: "Preview" },
		partial: { zh: "部分篇目", en: "Partial text" },
	}[access];
}
