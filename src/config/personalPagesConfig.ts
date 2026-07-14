import type { PersonalPagesConfig } from "@/types/personalPagesConfig";

/**
 * “我的”和“动态”菜单中新页面的内容配置。
 *
 * 图片建议放在 public/assets/images/devices、moments 或 diary 下，
 * 然后填写以 / 开头的路径，例如：/assets/images/devices/phone.webp。
 */
export const personalPagesConfig: PersonalPagesConfig = {
	devices: {
		title: "我的设备",
		description: "这里展示了我日常使用的各类设备",
		// 设备详情只填写品牌官方产品介绍页，不填写商城或购买链接。
		items: [
			{
				name: "OPPO Find X8 Ultra",
				category: "数码",
				specs: "晨曦微光 16GB+512GB",
				description: "不分昼夜，无论远近",
				image: "/assets/images/devices/oppo-find-x8-ultra.webp",
				imageFit: "contain",
				price: "7999元",
				url: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-ultra/",
			},
			{
				name: "OPPO Pad 4 Pro",
				category: "数码",
				specs: "晨曦微光 16GB+512GB",
				description: "大显身手",
				image: "/assets/images/devices/oppo-pad-4-pro.webp",
				imageFit: "contain",
				price: "3099元",
				url: "https://www.oppo.com/cn/accessories/oppo-pad-4-pro/",
			},
			{
				name: "OPPO Enco Free4",
				category: "数码",
				specs: "月光银 丹拿版",
				description: "且听风吟",
				image: "/assets/images/devices/oppo-enco-free4.webp",
				imageFit: "contain",
				price: "399元",
				url: "https://www.oppo.com/cn/accessories/oppo-enco-free4/",
			},
			{
				name: "iQOO Neo9S Pro+",
				category: "数码",
				specs: "珍珠白 12GB+256GB",
				description: "全新一代性能旗舰",
				image: "/assets/images/devices/iqoo-neo9s-pro-plus.png",
				imageFit: "contain",
				price: "2199元",
				url: "https://www.vivo.com.cn/vivo/iqooneo9sproplus/",
			},
			{
				name: "华硕天选5 Pro",
				category: "数码",
				specs: "魔幻青 32GB+3TB\ni9 14900HX  RTX4070",
				description: "性能再+1",
				image: "/assets/images/devices/asus-tuf-gaming-f16-2024.webp",
				imageFit: "contain",
				price: "8499元",
				url: "https://www.asus.com.cn/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-f16-2024/",
			},
		],
	},
	moments: {
		title: "朋友圈",
		description: "记录生活中的片刻与近况",
		items: [
			{
				id: "welcome",
				date: "2026-07-15T09:00:00+10:00",
				content:
					"这是一条朋友圈示例。之后可以在配置文件中替换文字、时间、地点、标签并添加图片。",
				tags: ["示例", "生活"],
				location: "Sydney",
			},
		],
	},
	diary: {
		title: "日记",
		description: "随时随地，分享生活",
		items: [
			{
				id: "first-note",
				date: "2026-07-15T20:00:00+10:00",
				content:
					"这里是一篇日记示例。日记支持文字、标签、地点、心情与多张图片。",
				tags: ["日常", "示例"],
				location: "Sydney",
				mood: "🌟",
			},
		],
	},
};
