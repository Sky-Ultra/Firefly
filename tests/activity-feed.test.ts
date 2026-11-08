import assert from "node:assert/strict";
import test from "node:test";
import { buildActivityFeed } from "../src/utils/activity-feed";

const links = {
	post: (id: string) => `/base/posts/${id.replace(/\.(md|mdx)$/i, "")}/`,
	moment: (id: string) => `/base/moments/#${id}`,
};

const post = (
	id: string,
	published: string,
	extra: { draft?: boolean; password?: string } = {},
) => ({
	id,
	data: {
		title: `文章 ${id}`,
		titleEn: `Post ${id}`,
		published: new Date(published),
		...extra,
	},
});

test("sorts by full publication timestamps while preserving the site's day-only labels", () => {
	const feed = buildActivityFeed(
		[
			post("a-earlier", "2026-10-20T02:00:00Z"),
			post("z-later", "2026-10-20T23:00:00Z"),
		],
		[{ id: "middle", date: "2026-10-20T12:00:00Z", content: "片刻" }],
		links,
	);
	assert.deepEqual(
		feed.map((item) => item.id),
		["post:z-later", "moment:middle", "post:a-earlier"],
	);
	assert.equal(feed[0].date, "2026-10-20");
});

test("merges all public source items in descending chronology, independent of pinned post order", () => {
	const posts = [
		post("old-pinned", "2026-06-01"),
		post("latest", "2026-10-23"),
	];
	const moments = [
		{ id: "middle", date: "2026-09-23T20:00:00+10:00", content: "片刻" },
	];
	const feed = buildActivityFeed(posts, moments, links);
	assert.deepEqual(
		feed.map((item) => item.id),
		["post:latest", "moment:middle", "post:old-pinned"],
	);
	assert.deepEqual(
		posts.map((item) => item.id),
		["old-pinned", "latest"],
	);
	assert.equal(feed.length, posts.length + moments.length);
});

test("excludes drafts and password-protected posts even when development provides them", () => {
	const feed = buildActivityFeed(
		[
			post("public", "2026-10-20"),
			post("draft", "2026-10-23", { draft: true }),
			post("locked", "2026-10-22", { password: "secret" }),
		],
		[],
		links,
	);
	assert.deepEqual(
		feed.map((item) => item.id),
		["post:public"],
	);
	assert.doesNotMatch(JSON.stringify(feed), /secret|locked|draft/);
});

test("ties use a deterministic source identity, regardless of input ordering", () => {
	const posts = [post("z", "2026-10-20"), post("a", "2026-10-20")];
	const moments = [
		{ id: "same-day", date: "2026-10-20T00:00:00Z", content: "同日" },
	];
	const first = buildActivityFeed(posts, moments, links);
	const second = buildActivityFeed([...posts].reverse(), moments, links);
	assert.deepEqual(first, second);
	assert.deepEqual(
		first.map((item) => item.id),
		["moment:same-day", "post:a", "post:z"],
	);
});

test("uses supplied canonical links, preserves translations and newlines, and emits day-only article dates", () => {
	const feed = buildActivityFeed(
		[post("nested/hello.mdx", "2026-10-20")],
		[
			{
				id: "hello-world",
				date: "2026-10-21T22:49:00+11:00",
				content: "第一行\n第二行",
				contentEn: "First line\nSecond line",
			},
		],
		links,
	);
	assert.deepEqual(feed[0], {
		id: "moment:hello-world",
		kind: "moment",
		date: "2026-10-21T22:49:00+11:00",
		href: "/base/moments/#hello-world",
		content: "第一行\n第二行",
		contentEn: "First line\nSecond line",
	});
	assert.deepEqual(feed[1], {
		id: "post:nested/hello.mdx",
		kind: "post",
		date: "2026-10-20",
		href: "/base/posts/nested/hello/",
		title: "文章 nested/hello.mdx",
		titleEn: "Post nested/hello.mdx",
	});
});

test("includes later additions without a fixed list or count and falls back to original text", () => {
	const initial = buildActivityFeed([], [], links);
	const added = buildActivityFeed(
		[{ id: "new", data: { title: "新文章", published: "2027-01-01" } }],
		[
			{
				id: "new-moment",
				date: "2027-01-02T10:00:00+11:00",
				content: "新动态",
			},
		],
		links,
	);
	assert.equal(initial.length, 0);
	assert.equal(added.length, 2);
	assert.equal(added[0].kind === "moment" && added[0].contentEn, "新动态");
	assert.equal(added[1].kind === "post" && added[1].titleEn, "新文章");
});

test("ignores invalid source dates instead of inventing publication times", () => {
	assert.deepEqual(
		buildActivityFeed(
			[post("invalid", "invalid")],
			[{ id: "invalid", date: "invalid", content: "没有日期" }],
			links,
		),
		[],
	);
});

test("video previews carry only validated display metadata and preserve their moment destination", () => {
	const moment = {
		id: "future-video",
		date: "2027-01-02T20:00:00+11:00",
		content: "video text",
		media: {
			type: "bilibili" as const,
			url: "https://www.bilibili.com/video/BV16TH36XEQz/",
			title: "视频标题",
			titleEn: "Video title",
			poster: { src: "/cover.webp", alt: "封面" },
		},
	};
	const original = structuredClone(moment);
	const [activity] = buildActivityFeed([], [moment], links);
	assert.equal(activity.kind, "moment");
	if (activity.kind !== "moment") return;
	assert.equal(activity.href, "/base/moments/#future-video");
	assert.deepEqual(activity.video, {
		title: "视频标题",
		titleEn: "Video title",
		poster: { src: "/cover.webp", alt: "封面" },
	});
	assert.ok(!("media" in activity));
	assert.ok(activity.video);
	assert.ok(!("url" in activity.video));
	assert.notEqual(activity.video?.poster, moment.media.poster);
	assert.deepEqual(moment, original);
});

test("plain moments, link-only moments and invalid video URLs do not gain a video preview", () => {
	for (const media of [
		undefined,
		{
			type: "link" as const,
			url: "https://www.bilibili.com/video/BV16TH36XEQz/",
		},
		{
			type: "bilibili" as const,
			url: "https://evil.test/video/BV16TH36XEQz/",
			title: "Not a Bilibili video",
		},
	]) {
		const [activity] = buildActivityFeed(
			[],
			[
				{
					id: "plain",
					date: "2027-01-01",
					content: "unchanged",
					...(media ? { media } : {}),
				},
			],
			links,
		);
		assert.ok(!("video" in activity));
	}
});

test("video moments without a cover or translation still have a readable title preview", () => {
	const [activity] = buildActivityFeed(
		[],
		[
			{
				id: "no-cover",
				date: "2027-01-01",
				content: "text",
				media: { type: "bilibili", url: "BV16TH36XEQz", title: "原始标题" },
			},
		],
		links,
	);
	assert.ok(activity.kind === "moment" && activity.video);
	if (activity.kind === "moment")
		assert.deepEqual(activity.video, {
			title: "原始标题",
			titleEn: "原始标题",
		});
});
