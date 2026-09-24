import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

type PostData = {
	title: string;
	titleEn: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	descriptionEn: string;
	image: string;
	tags: string[];
	tagsEn: string[];
	category: string | null;
	categoryEn: string;
	lang: string;
	pinned: boolean;
	author: string;
	sourceLink: string;
	licenseName: string;
	licenseUrl: string;
	comment: boolean;
	password: string;
	passwordHint: string;
	prevTitle: string;
	prevTitleEn: string;
	prevSlug: string;
	nextTitle: string;
	nextTitleEn: string;
	nextSlug: string;
};

const postsCollection: ReturnType<
	typeof defineCollection<z.ZodType<PostData>>
> = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		descriptionEn: z.string(),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		tagsEn: z.array(z.string()),
		category: z.string().optional().nullable().default(""),
		categoryEn: z.string(),
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		comment: z.boolean().optional().default(false),
		password: z.string().optional().default(""),
		passwordHint: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevTitleEn: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextTitleEn: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection: ReturnType<
	typeof defineCollection<z.ZodType<Record<string, unknown>>>
> = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

export const collections: {
	posts: typeof postsCollection;
	spec: typeof specCollection;
} = {
	posts: postsCollection,
	spec: specCollection,
};
