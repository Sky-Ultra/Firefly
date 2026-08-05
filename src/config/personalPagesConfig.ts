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
		titleEn: "My Devices",
		description: "这里展示了我日常使用的各类设备",
		descriptionEn: "A collection of the devices I use every day",
		// 设备详情只填写品牌官方产品介绍页，不填写商城或购买链接。
		items: [
			{
				name: "OPPO Find X8 Ultra",
				category: "数码",
				categoryEn: "Digital",
				specs: "晨曦微光 16GB+512GB",
				specsEn: "Dawn Glow · 16GB + 512GB",
				description: "不分昼夜，无论远近",
				descriptionEn: "Day or night, near or far",
				image: "/assets/images/devices/oppo-find-x8-ultra.webp",
				imageFit: "contain",
				price: "7999元",
				priceEn: "CNY 7,999",
				url: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-ultra/",
			},
			{
				name: "OPPO Pad 4 Pro",
				category: "数码",
				categoryEn: "Digital",
				specs: "晨曦微光 16GB+512GB",
				specsEn: "Dawn Glow · 16GB + 512GB",
				description: "大显身手",
				descriptionEn: "Made to do more",
				image: "/assets/images/devices/oppo-pad-4-pro.webp",
				imageFit: "contain",
				price: "3099元",
				priceEn: "CNY 3,099",
				url: "https://www.oppo.com/cn/accessories/oppo-pad-4-pro/",
			},
			{
				name: "OPPO Enco Free4",
				category: "数码",
				categoryEn: "Digital",
				specs: "月光银 丹拿版",
				specsEn: "Moonlight Silver · Dynaudio Edition",
				description: "且听风吟",
				descriptionEn: "Listen to the wind",
				image: "/assets/images/devices/oppo-enco-free4.webp",
				imageFit: "contain",
				price: "399元",
				priceEn: "CNY 399",
				url: "https://www.oppo.com/cn/accessories/oppo-enco-free4/",
			},
			{
				name: "iQOO Neo9S Pro+",
				category: "数码",
				categoryEn: "Digital",
				specs: "珍珠白 12GB+256GB",
				specsEn: "Pearl White · 12GB + 256GB",
				description: "全新一代性能旗舰",
				descriptionEn: "A new generation of flagship performance",
				image: "/assets/images/devices/iqoo-neo9s-pro-plus.png",
				imageFit: "contain",
				price: "2199元",
				priceEn: "CNY 2,199",
				url: "https://www.vivo.com.cn/vivo/iqooneo9sproplus/",
			},
			{
				name: "华硕天选5 Pro",
				category: "数码",
				categoryEn: "Digital",
				specs: "魔幻青 32GB+3TB\ni9 14900HX  RTX4070",
				specsEn: "Magic Teal · 32GB + 3TB\ni9-14900HX · RTX 4070",
				description: "性能再+1",
				descriptionEn: "Performance, turned up another notch",
				image: "/assets/images/devices/asus-tuf-gaming-f16-2024.webp",
				imageFit: "contain",
				price: "8499元",
				priceEn: "CNY 8,499",
				url: "https://www.asus.com.cn/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-f16-2024/",
			},
		],
	},
	moments: {
		title: "朋友圈",
		titleEn: "Moments",
		description: "记录生活中的片刻与近况",
		descriptionEn: "Small moments and recent updates from my life",
		items: [
			{
				id: "welcome",
				date: "2026-07-15T09:00:00+10:00",
				content: "我想留在大家身边，从过去...一同迈向明天。",
				contentEn:
					"I want to stay by everyone's side—from the past, moving together towards tomorrow.",
				tags: ["示例", "生活"],
				tagsEn: ["Sample", "Life"],
				location: "Sydney",
			},
		],
	},
	diary: {
		title: "日记",
		titleEn: "Diary",
		description: "随时随地，分享生活",
		descriptionEn: "Notes from life, wherever and whenever",
		items: [
			{
				id: "first-note",
				date: "2026-07-15T20:00:00+10:00",
				content: "只要不失去你的崇高，整个世界都会向你敞开",
				contentEn:
					"As long as you do not lose what is noble within you, the whole world will open itself to you.",
				tags: ["日常", "示例"],
				tagsEn: ["Daily life", "Sample"],
				location: "Sydney",
				mood: "🌟",
			},
		],
	},
};
