import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import sanitizeHtml from "sanitize-html";
import type { ChangelogActivity } from "./activity-feed";

export interface ChangelogSection {
	date: string;
	heading: string;
	markdown: string;
}
const months = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
];
function headingDate(heading: string): string | undefined {
	const zh = heading.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
	const en = heading.match(/^([A-Za-z]+) (\d{1,2}), (\d{4})$/);
	const year = zh ? Number(zh[1]) : en ? Number(en[3]) : 0;
	const month = zh
		? Number(zh[2])
		: en
			? months.indexOf(en[1].toLowerCase()) + 1
			: 0;
	const day = zh ? Number(zh[3]) : en ? Number(en[2]) : 0;
	if (!year || !month || !day) return;
	const date = new Date(Date.UTC(year, month - 1, day));
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	)
		return;
	return date.toISOString().slice(0, 10);
}

/** Daily entries use their written dates. Frontmatter and headings inside code fences are excluded. */
export function parseChangelogSections(document: string): ChangelogSection[] {
	const sections: ChangelogSection[] = [];
	let current: ChangelogSection | undefined;
	let fence = "";
	for (const line of document.replaceAll("\r\n", "\n").split("\n")) {
		const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
		if (delimiter) {
			if (!fence) fence = delimiter[1];
			else if (
				delimiter[1][0] === fence[0] &&
				delimiter[1].length >= fence.length
			)
				fence = "";
			if (current) current.markdown += `${line}\n`;
			continue;
		}
		const heading = !fence ? line.match(/^##\s+(.+?)\s*$/)?.[1] : undefined;
		if (heading) {
			const date = headingDate(heading);
			current = date ? { date, heading, markdown: "" } : undefined;
			if (current) sections.push(current);
		} else if (current) current.markdown += `${line}\n`;
	}
	return sections
		.map((section) => ({ ...section, markdown: section.markdown.trim() }))
		.filter((section) => section.markdown);
}

export async function buildChangelogActivities(
	zh: string,
	en: string,
	href: string,
): Promise<ChangelogActivity[]> {
	const english = new Map(
		parseChangelogSections(en).map((section) => [section.date, section]),
	);
	const processor = await createMarkdownProcessor({
		syntaxHighlight: false,
		smartypants: false,
	});
	async function render(markdown: string) {
		const { code } = await processor.render(markdown);
		return sanitizeHtml(code, {
			allowedTags: [
				"p",
				"ul",
				"ol",
				"li",
				"a",
				"mark",
				"code",
				"strong",
				"em",
				"s",
				"del",
				"br",
				"blockquote",
			],
			allowedAttributes: { a: ["href", "title"], mark: ["class"] },
			allowedClasses: { mark: ["theme-highlight"] },
			allowedSchemes: ["http", "https", "mailto"],
		});
	}
	return Promise.all(
		parseChangelogSections(zh).map(async (section) => ({
			id: `changelog:${section.date}`,
			kind: "changelog" as const,
			date: section.date,
			href: `${href}#${section.heading.replaceAll(".", "")}`,
			hrefEn: `${href}#${(english.get(section.date)?.heading || section.heading).toLowerCase().replaceAll(",", "").replaceAll(" ", "-")}`,
			html: await render(section.markdown),
			htmlEn: await render(
				english.get(section.date)?.markdown || section.markdown,
			),
		})),
	);
}
