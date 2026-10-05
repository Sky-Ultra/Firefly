import type { CommentConfig } from "@/types/commentConfig";
import type { LicenseConfig } from "@/types/licenseConfig";

export type FooterBadge = {
	label: string;
	value: string;
	icon: string;
	color: string;
	iconColor: string;
	href?: string;
};

export type FooterBadgeOptions = {
	commentService: CommentConfig["type"];
	umamiEnabled: boolean;
	license: LicenseConfig;
};

const commentNames: Record<Exclude<CommentConfig["type"], "none">, string> = {
	twikoo: "Twikoo",
	waline: "Waline",
	giscus: "Giscus",
	disqus: "Disqus",
	artalk: "Artalk",
};

export function getFooterBadges({
	commentService,
	umamiEnabled,
	license,
}: FooterBadgeOptions): FooterBadge[] {
	const badges: FooterBadge[] = [
		{
			label: "Build",
			value: "Astro",
			icon: "simple-icons:astro",
			color: "#7e22ce",
			iconColor: "#d8b4fe",
		},
		{
			label: "Style",
			value: "Tailwind CSS",
			icon: "simple-icons:tailwindcss",
			color: "#0e7490",
			iconColor: "#67e8f9",
		},
	];

	if (commentService !== "none") {
		badges.push({
			label: "Comments",
			value: commentNames[commentService],
			icon: "material-symbols:chat-bubble-outline",
			color: "#0369a1",
			iconColor: "#7dd3fc",
		});
	}

	badges.push(
		{
			label: "Search",
			value: "Pagefind",
			icon: "material-symbols:search-rounded",
			color: "#0f766e",
			iconColor: "#5eead4",
		},
		{
			label: "CDN",
			value: "Cloudflare",
			icon: "simple-icons:cloudflare",
			color: "#b45309",
			iconColor: "#fdba74",
		},
	);

	if (umamiEnabled) {
		badges.push({
			label: "Count",
			value: "Umami",
			icon: "material-symbols:bar-chart-rounded",
			color: "#374151",
			iconColor: "#d1d5db",
		});
	}

	if (license.enable) {
		badges.push({
			label: "Copyright",
			value: license.name,
			icon: "material-symbols:copyright-rounded",
			color: "#b91c1c",
			iconColor: "#fda4af",
			href: license.url,
		});
	}

	return badges;
}
