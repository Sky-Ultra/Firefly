import type { MomentItem } from "../types/personalPagesConfig";

export type ActivityPost = {
	id: string;
	data: {
		title: string;
		titleEn?: string;
		published: Date | string;
		draft?: boolean;
		password?: string;
	};
};

type ActivityBase = {
	id: string;
	date: string;
	href: string;
};

export type PostActivity = ActivityBase & {
	kind: "post";
	title: string;
	titleEn: string;
};

export type MomentActivity = ActivityBase & {
	kind: "moment";
	content: string;
	contentEn: string;
};

export type ActivityItem = PostActivity | MomentActivity;

export type ActivityLinks = {
	post: (id: string) => string;
	moment: (id: string) => string;
};

/** Build a public timeline from metadata alone, without changing either source. */
export function buildActivityFeed(
	posts: readonly ActivityPost[],
	moments: readonly MomentItem[],
	links: ActivityLinks,
): ActivityItem[] {
	const activities: ActivityItem[] = [];
	const publicationTimes = new Map<string, number>();
	for (const post of posts) {
		if (post.data.draft || post.data.password) continue;
		const published = new Date(post.data.published);
		if (!Number.isFinite(published.getTime())) continue;
		publicationTimes.set(`post:${post.id}`, published.getTime());
		activities.push({
			id: `post:${post.id}`,
			kind: "post",
			// Posts have a publication day, rather than an invented publication time.
			date: published.toISOString().slice(0, 10),
			href: links.post(post.id),
			title: post.data.title,
			titleEn: post.data.titleEn ?? post.data.title,
		});
	}
	for (const moment of moments) {
		if (!Number.isFinite(new Date(moment.date).getTime())) continue;
		activities.push({
			id: `moment:${moment.id}`,
			kind: "moment",
			date: moment.date,
			href: links.moment(moment.id),
			content: moment.content,
			contentEn: moment.contentEn ?? moment.content,
		});
	}
	return activities.sort((a, b) => {
		const timeOf = (item: ActivityItem) =>
			publicationTimes.get(item.id) ?? new Date(item.date).getTime();
		const chronology = timeOf(b) - timeOf(a);
		if (chronology !== 0) return chronology;
		return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	});
}
