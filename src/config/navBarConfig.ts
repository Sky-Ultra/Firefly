import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,
	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		nameEn: "Posts",
		nameEnMobile: "Posts",
		url: "#",
		icon: "material-symbols:article",
		children: [
			// 归档
			LinkPresets.Archive,

			// 分类
			LinkPresets.Categories,

			// 标签
			LinkPresets.Tags,
		],
	});

	// 动态及其子菜单
	links.push({
		name: "动态",
		nameEn: "Activity",
		nameEnMobile: "Feed",
		url: "#",
		icon: "material-symbols:bolt-rounded",
		children: [
			LinkPresets.Moments,
			LinkPresets.Gallery,
			LinkPresets.Guestbook,
			LinkPresets.Diary,
		],
	});

	// 我的及其子菜单
	links.push({
		name: "我的",
		nameEn: "Personal",
		nameEnMobile: "Mine",
		url: "#",
		icon: "material-symbols:person",
		children: [
			// 番组计划
			LinkPresets.Bangumi,

			// 游戏
			LinkPresets.Games,

			// 友链
			LinkPresets.Friends,

			// 追番
			LinkPresets.Anime,

			// 设备
			LinkPresets.Devices,

			// 音乐
			LinkPresets.Music,
		],
	});

	// 原“关于”与“链接”菜单不再展示，改为独立的“关于我”入口
	links.push(LinkPresets.About);

	// 文档链接
	// links.push({
	// 	name: "文档",
	// 	url: "https://docs-firefly.cuteleaf.cn",
	// 	external: true,
	// 	icon: "material-symbols:docs",
	// });

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		nameEn: "Home",
		nameEnMobile: "Home",
		url: "/",
		icon: "material-symbols:home",
	},
	Archive: {
		name: "归档",
		nameEn: "Archive",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "分类",
		nameEn: "Categories",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "标签",
		nameEn: "Tags",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "友链",
		nameEn: "Friends",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	Guestbook: {
		name: "留言",
		nameEn: "Guestbook",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "关于我",
		nameEn: "About Me",
		nameEnMobile: "About",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Bangumi: {
		name: "番组计划",
		nameEn: "Media List",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	Games: {
		name: "游戏",
		nameEn: "Games",
		url: "/games/",
		icon: "material-symbols:sports-esports-rounded",
		pageKey: "games",
	},
	Gallery: {
		name: "相册",
		nameEn: "Gallery",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Anime: {
		name: "追番",
		nameEn: "Anime",
		url: "/anime/",
		icon: "material-symbols:live-tv",
		pageKey: "anime",
	},
	Moments: {
		name: "朋友圈",
		nameEn: "Moments",
		url: "/moments/",
		icon: "material-symbols:diversity-1-rounded",
	},
	Diary: {
		name: "日记",
		nameEn: "Diary",
		url: "/diary/",
		icon: "material-symbols:book-2-rounded",
	},
	Devices: {
		name: "设备",
		nameEn: "Devices",
		url: "/devices/",
		icon: "material-symbols:devices-rounded",
	},
	Music: {
		name: "音乐",
		nameEn: "Music",
		url: "/music/",
		icon: "material-symbols:music-note-rounded",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
