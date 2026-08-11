import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

type ExpectedMetadata = {
	titleEn: string;
	descriptionEn: string;
	tagsEn: string[];
	categoryEn: "Showcase" | "Guides";
	bodyHash: string;
};

const expected: Record<string, ExpectedMetadata> = {
	"code-examples.md": {
		titleEn: "Code Block Showcase",
		descriptionEn:
			"How Expressive Code blocks look inside Markdown posts on this site.",
		tagsEn: ["Markdown"],
		categoryEn: "Showcase",
		bodyHash:
			"2e4f1f646c5035d7265b79d54ab855c0266972d3c605251d9364b48c610c40c7",
	},
	"daily-quote-widget-guide.md": {
		titleEn: "How the Daily Quote Widget Works",
		descriptionEn:
			"How the Daily Quote widget handles API configuration, caching, request reuse, and automatic refreshes.",
		tagsEn: ["Astro", "Components", "Guides"],
		categoryEn: "Guides",
		bodyHash:
			"1f4beea3175f4307b4f1de9e7f53d3dfd1e21ae7788b13276791aac79cea7fca",
	},
	"draft.md": {
		titleEn: "Draft Post Example",
		descriptionEn: "",
		tagsEn: ["Markdown", "Blogging", "Showcase"],
		categoryEn: "Showcase",
		bodyHash:
			"aa471397c176709758875a0bf6def0ce6947f1ce7f4b021be015f0fa220c2f4f",
	},
	"encrypted-demo.md": {
		titleEn: "Encrypted Firefly Posts",
		descriptionEn:
			"A password-protected sample post that demonstrates Firefly's article encryption.",
		tagsEn: ["Examples", "Password Protection"],
		categoryEn: "Showcase",
		bodyHash:
			"0f78622ac162e0e684b07d979203530e4c1d64966ec7741917659281c6e8986f",
	},
	"firefly-layout-system.md": {
		titleEn: "Understanding Firefly's Layout System",
		descriptionEn:
			"An overview of Firefly's sidebar and post-list layouts, including responsive grid columns.",
		tagsEn: ["Layouts", "Blogging", "Guides"],
		categoryEn: "Guides",
		bodyHash:
			"f1ef52874678174e83de0ec3f5435f7cb9ca7c5011fb6157b0d471c32e137c3c",
	},
	"firefly.md": {
		titleEn: "Firefly: A Fresh, Modern Astro Blog Theme",
		descriptionEn:
			"Firefly is a clean, modern personal blog theme built with Astro and Fuwari, with modular features and extensive visual customization.",
		tagsEn: ["Markdown", "Blogging", "Themes", "Templates"],
		categoryEn: "Showcase",
		bodyHash:
			"bf686e8b15d779f5b8f4905454a7aef35397ffdd96c48599539bd1c6a9e9d2f1",
	},
	"guide/index.md": {
		titleEn: "Firefly Quick Start Guide",
		descriptionEn: "How to get started with the Firefly blog template.",
		tagsEn: ["Blogging", "Markdown", "Guides"],
		categoryEn: "Guides",
		bodyHash:
			"0c79fb681e3310c3e214c267b9e21441dbd18f5fc977e689b152553e669d7df7",
	},
	"katex-math-example.md": {
		titleEn: "KaTeX Formula Rendering Showcase",
		descriptionEn:
			"Examples of KaTeX rendering, from inline and block equations to more complex notation.",
		tagsEn: ["KaTeX", "Math", "Examples"],
		categoryEn: "Showcase",
		bodyHash:
			"73f6685eae94f8c339f9f0c6790c39976a51689439be923d0dbbe6e384df8578",
	},
	"markdown-extended.md": {
		titleEn: "Extended Markdown Features",
		descriptionEn: "A tour of the Markdown features available on this site.",
		tagsEn: ["Showcase", "Examples", "Markdown"],
		categoryEn: "Showcase",
		bodyHash:
			"7c1171b79f65de57115d7b724854beefd960f36b438a38103859b639f3e6f924",
	},
	"markdown-mermaid.md": {
		titleEn: "Mermaid Diagrams in Markdown",
		descriptionEn:
			"A compact Markdown post showing how Mermaid diagrams are written and rendered.",
		tagsEn: ["Markdown", "Blogging", "Mermaid"],
		categoryEn: "Showcase",
		bodyHash:
			"943a6d4683a2ed80ff4e8309373b4caf64799ce014912e97648979ff294b31f3",
	},
	"markdown-plantuml.md": {
		titleEn: "PlantUML Diagrams in Markdown",
		descriptionEn:
			"A sample post for checking PlantUML rendering, theme switching, and interaction on this site.",
		tagsEn: ["PlantUML", "Markdown"],
		categoryEn: "Showcase",
		bodyHash:
			"72fb7410c29b6e3bd7a0cc615c3c49ec5f5b4ffb1870cae6ea12902836f7dd04",
	},
	"markdown-tutorial.md": {
		titleEn: "Markdown Tutorial",
		descriptionEn: "A concise Markdown blog example.",
		tagsEn: ["Markdown", "Article Examples"],
		categoryEn: "Showcase",
		bodyHash:
			"983a8f1db51d53a33e523b3c0730f51156d587d41ff5a429569e5c21c5b31295",
	},
	"mdx-example.mdx": {
		titleEn: "MDX Article Showcase",
		descriptionEn:
			"An MDX sample that shows how JSX can be used inside Markdown.",
		tagsEn: ["MDX", "Markdown", "Article Examples"],
		categoryEn: "Showcase",
		bodyHash:
			"f34d9ace570d15eecff265940ad01c7681852f23e0f5d04839484b4710f2fb9f",
	},
	"music-module-guide.md": {
		titleEn: "How the Music Module Works",
		descriptionEn:
			"How the music player is structured, how its state is managed, and how playlists and lyrics stay in sync.",
		tagsEn: ["Astro", "Music", "Components", "Guides"],
		categoryEn: "Guides",
		bodyHash:
			"2267b43f43b7fc8e03e3224517259f5ee2aa0de2184d297ae6d09472946f3436",
	},
	"personal-website-introduction/index.md": {
		titleEn: "A Brief Introduction to My Website",
		descriptionEn: "Nice to meet you—here's a quick look around my website.",
		tagsEn: ["Guides"],
		categoryEn: "Guides",
		bodyHash:
			"2638e57d859734fbab4a13cc9a4e543efb6942c9d15fbe748dcbd078b65f2de4",
	},
	"relationship-timer-guide.md": {
		titleEn: "How the Relationship Timer Works",
		descriptionEn:
			"Threads intertwined; the seasons pass with a few quiet sighs.",
		tagsEn: ["Astro", "Components", "Guides"],
		categoryEn: "Guides",
		bodyHash:
			"0b23f54a873c5cf770eaaca55005362174a794d988adde0adba788a60fd89358",
	},
	"video.md": {
		titleEn: "Embedding Video in a Post",
		descriptionEn: "How to embed a video in a blog post.",
		tagsEn: ["Examples", "Video"],
		categoryEn: "Showcase",
		bodyHash:
			"6af2a8ac8cda0f49153a363e72b3bc022e4c5de4b39b4eac14393fbd2c3e0a20",
	},
};

function splitDocument(relativePath: string): {
	frontmatter: string;
	body: string;
} {
	const content = readFileSync(
		new URL(`../src/content/posts/${relativePath}`, import.meta.url),
		"utf8",
	)
		.replace(/^\uFEFF/, "")
		.replaceAll("\r\n", "\n");
	assert.ok(content.startsWith("---\n"), `${relativePath} needs frontmatter`);
	const end = content.indexOf("\n---", 4);
	assert.notEqual(end, -1, `${relativePath} has unclosed frontmatter`);
	return {
		frontmatter: content.slice(4, end),
		body: content.slice(end + 4).replace(/^\n+/, ""),
	};
}

function readScalar(frontmatter: string, key: string): string | undefined {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
	if (!match) return undefined;
	const raw = match[1].trim();
	if (raw.startsWith('"') && raw.endsWith('"')) return JSON.parse(raw);
	if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1);
	return raw;
}

function readArray(frontmatter: string, key: string): string[] | undefined {
	const raw = readScalar(frontmatter, key);
	if (raw === undefined || !raw.startsWith("[") || !raw.endsWith("]")) {
		return undefined;
	}
	const body = raw.slice(1, -1).trim();
	if (!body) return [];
	return body
		.split(",")
		.map((value) =>
			value.trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2"),
		);
}

for (const [relativePath, metadata] of Object.entries(expected)) {
	test(`${relativePath} declares complete English metadata`, () => {
		const { frontmatter } = splitDocument(relativePath);
		assert.equal(readScalar(frontmatter, "titleEn"), metadata.titleEn);
		assert.equal(
			readScalar(frontmatter, "descriptionEn"),
			metadata.descriptionEn,
		);
		assert.deepEqual(readArray(frontmatter, "tagsEn"), metadata.tagsEn);
		assert.equal(readScalar(frontmatter, "categoryEn"), metadata.categoryEn);
	});

	test(`${relativePath} keeps its Chinese body unchanged`, () => {
		const { body } = splitDocument(relativePath);
		const hash = createHash("sha256").update(body, "utf8").digest("hex");
		assert.equal(hash, metadata.bodyHash);
	});
}

test("the personal introduction uses the requested 60 percent figure", () => {
	const { body } = splitDocument("personal-website-introduction/index.md");
	assert.match(body, /总修改工作的60%/);
	assert.doesNotMatch(body, /总修改工作的80%/);
});
