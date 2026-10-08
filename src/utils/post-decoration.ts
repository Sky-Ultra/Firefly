import type { SidebarDecoration } from "./sidebar-decoration";

const motifs: SidebarDecoration[] = [
	"blossom",
	"paper-plane",
	"quote",
	"orbit",
	"constellation",
	"chat",
];

export function getPostDecoration(
	id: string,
	category: string | null,
	tags: string[],
): SidebarDecoration {
	const topic = [category || "", ...tags].join(" ").toLowerCase();
	if (/音乐|music/.test(topic)) return "orbit";
	if (/astro|代码|office|指南|guide/.test(topic)) return "window";
	if (/更新日志|changelog/.test(topic)) return "clock";
	if (/欢迎词|句子|quote/.test(topic)) return "quote";
	const hash = Array.from(id).reduce(
		(total, char) => (total * 31 + (char.codePointAt(0) || 0)) >>> 0,
		7,
	);
	return motifs[hash % motifs.length];
}
