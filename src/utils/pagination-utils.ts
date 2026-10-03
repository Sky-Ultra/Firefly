import type { SiteConfig } from "../types/siteConfig";

export function getPostListPageSize(
	postCount: number,
	pagination: SiteConfig["pagination"],
): number {
	return pagination.enable === false
		? Math.max(postCount, 1)
		: pagination.postsPerPage;
}
