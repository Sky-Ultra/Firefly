export type SidebarDecoration =
	| "blossom"
	| "chat"
	| "quote"
	| "parcel"
	| "paper-plane"
	| "orbit"
	| "clock"
	| "constellation"
	| "window"
	| "sun-cloud";

const widgetDecorations: Record<string, SidebarDecoration> = {
	announcement: "chat",
	"quote-of-the-day": "quote",
	categories: "parcel",
	tags: "paper-plane",
	"calendar-widget": "clock",
	"site-stats": "constellation",
	"site-info": "window",
};

export function getSidebarDecoration(id: string): SidebarDecoration {
	if (id.startsWith("music-widget-") && id.endsWith("-layout")) {
		return "orbit";
	}
	if (id.startsWith("umami-stats-")) return "constellation";
	if (id.startsWith("relationship-")) return "chat";
	return Object.hasOwn(widgetDecorations, id)
		? widgetDecorations[id]
		: "blossom";
}
