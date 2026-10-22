type PageSwitches = { games: boolean; gallery: boolean; guestbook: boolean };
export type FooterDestination = {
	path: string;
	label: string;
	labelEn: string;
	icon: string;
};

export function getFooterDestinations(
	pages: PageSwitches,
): FooterDestination[] {
	return [
		{
			path: "/about/",
			label: "关于我",
			labelEn: "About Me",
			icon: "material-symbols:person-outline-rounded",
		},
		{
			path: "/archive/",
			label: "文章归档",
			labelEn: "Archive",
			icon: "material-symbols:history-rounded",
		},
		{
			path: "/moments/",
			label: "朋友圈",
			labelEn: "Moments",
			icon: "material-symbols:chat-bubble-outline-rounded",
		},
		{
			path: "/tools/",
			label: "神器库",
			labelEn: "Tools",
			icon: "material-symbols:construction-rounded",
		},
		{
			path: "/places/",
			label: "足迹",
			labelEn: "Places",
			icon: "material-symbols:location-on-outline-rounded",
		},
		...(pages.games
			? [
					{
						path: "/games/",
						label: "游戏",
						labelEn: "Games",
						icon: "material-symbols:sports-esports-outline-rounded",
					},
				]
			: []),
		...(pages.gallery
			? [
					{
						path: "/gallery/",
						label: "相册",
						labelEn: "Gallery",
						icon: "material-symbols:photo-library-outline-rounded",
					},
				]
			: []),
		...(pages.guestbook
			? [
					{
						path: "/guestbook/",
						label: "留言板",
						labelEn: "Guestbook",
						icon: "material-symbols:forum-outline-rounded",
					},
				]
			: []),
	];
}
