import { personalPagesConfig } from "@/config/personalPagesConfig";
import changelogZh from "@/content/posts/personal-website-changelog.md?raw";
import changelogEn from "@/content/translations/personal-website-changelog.en.md?raw";
import { type ActivityItem, buildActivityFeed } from "@/utils/activity-feed";
import { buildChangelogActivities } from "@/utils/changelog-activity";
import { getSortedPostsList } from "@/utils/content-utils";
import { getPostUrlBySlug, url } from "@/utils/url-utils";

async function loadTimeline() {
	const posts = await getSortedPostsList();
	const changelog = await buildChangelogActivities(
		changelogZh,
		changelogEn,
		url("/posts/personal-website-changelog/"),
	);
	return buildActivityFeed(
		posts,
		personalPagesConfig.moments.items,
		{
			post: getPostUrlBySlug,
			moment: (id) => `${url("/moments/#")}${id}`,
		},
		changelog,
	);
}

// A static build renders the same sidebar on many routes. Parse the changelog once.
let timeline: ReturnType<typeof loadTimeline> | undefined;
export function getSiteTimeline(): Promise<ActivityItem[]> {
	if (import.meta.env.DEV) return loadTimeline();
	timeline ??= loadTimeline();
	return timeline;
}
