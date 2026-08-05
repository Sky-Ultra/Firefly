import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "📢 欢迎来访者",
	titleEn: "📢 Welcome",

	// 公告内容
	content: "Hi，我是Sky，欢迎您！",
	contentEn: "Hi, I'm Sky. Welcome!",

	// 是否允许用户关闭公告
	closable: false,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解更多",
		textEn: "Learn more",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
