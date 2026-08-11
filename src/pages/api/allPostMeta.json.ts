import { getSortedPosts } from "@/utils/content-utils";

export async function GET() {
	const posts = await getSortedPosts();

	const allPostsData = posts
		.map((post) => ({
			id: post.id,
			title: post.data.title,
			titleEn: post.data.titleEn,
			description: post.data.description,
			descriptionEn: post.data.descriptionEn,
			published: post.data.published.getTime(),
			category: post.data.category || "",
			categoryEn: post.data.categoryEn,
			password: !!post.data.password,
		}))
		// 日历按纯日期排序，忽略置顶
		.sort((a, b) => b.published - a.published);

	return new Response(JSON.stringify(allPostsData));
}
