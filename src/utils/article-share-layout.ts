export const ARTICLE_WIDTHS = [480, 600, 760] as const;
export const ARTICLE_FONT_SIZES = [16, 18, 20, 22] as const;
export const DEFAULT_ARTICLE_SHARE = { width: 600, fontSize: 18 } as const;
export type ArticleSlice = { top: number; height: number };

export interface ArticleShareVisibility {
	showLink: boolean;
	showAuthorDate: boolean;
}

/** An omitted element contributes neither text nor an empty metadata/footer block. */
export function getArticleShareMetadata(
	options: ArticleShareVisibility & {
		siteTitle: string;
		author: string;
		date: string;
		url: string;
	},
): { meta: string; footer: string } {
	const byline = [
		...new Set([options.siteTitle, options.author].filter(Boolean)),
	].join(" · ");
	return {
		meta: options.showAuthorDate ? `${byline} · ${options.date}` : "",
		footer: [
			options.showAuthorDate ? byline : "",
			options.showLink ? options.url : "",
		]
			.filter(Boolean)
			.join("\n"),
	};
}

/** Two-times PNGs, with conservative mobile limits. Never reduce text resolution. */
export function planArticleSlices(
	width: number,
	height: number,
	mobile: boolean,
	breaks: readonly number[] = [],
): ArticleSlice[] {
	if (
		!Number.isFinite(width) ||
		!Number.isFinite(height) ||
		width <= 0 ||
		height <= 0
	)
		throw new Error("Invalid article dimensions");
	const limit = Math.floor(
		Math.min(
			mobile ? 2048 : 8000,
			(mobile ? 3_000_000 : 24_000_000) / (width * 4),
		),
	);
	const result: ArticleSlice[] = [];
	for (let top = 0; top < Math.ceil(height); ) {
		let end = Math.min(top + limit, Math.ceil(height));
		if (end < height) {
			const candidates = breaks.filter(
				(point) => point > top + limit * 0.55 && point <= end,
			);
			if (candidates.length) end = Math.floor(Math.max(...candidates));
		}
		result.push({ top, height: end - top });
		top = end;
	}
	return result;
}
