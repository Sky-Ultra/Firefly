import type { VisitorWidgetsConfig } from "@/types/visitorWidgetsConfig";

export const visitorWidgetsConfig: VisitorWidgetsConfig = {
	welcomeToast: {
		enabled: true,
		homepageOnly: true,
		locationApi: "https://ipwho.is/",
		fallbackMessage: "你好，欢迎来到我的博客",
		subtitle: "欢迎来到我的博客",
		visibleDuration: 5_000,
		fadeDuration: 500,
	},
	copyToast: {
		message: "✨ 复制成功，转载请标注本文地址",
		visibleDuration: 1600,
		fadeDuration: 400,
	},
	timeGreeting: {
		periods: [
			{
				startHour: 0,
				endHour: 6,
				texts: [
					"夜深杯底浮明月，醉倚孤舟数远星。",
					"火树银花如昼，万家灯火璀璨",
					"共此人间，何处见阑珊",
					"何须寒笛吹彻，一曲已寄天岸",
				],
				interval: 16_000,
				icon: "night",
			},
			{
				startHour: 6,
				endHour: 12,
				texts: [
					"晓雾轻分山外色，一江春水载朝霞。",
					"晨光不问人间事，只照花枝与旧书。",
				],
				interval: 10_000,
				icon: "morning",
			},
			{
				startHour: 12,
				endHour: 18,
				texts: ["上下天光，一碧万顷", "长日无声花自落，小楼听雨到黄昏"],
				interval: 10_000,
				icon: "afternoon",
			},
			{
				startHour: 18,
				endHour: 24,
				texts: ["醉后不知天在水，满船惊梦压星河"],
				icon: "evening",
			},
		],
		image: {
			src: "assets/images/DesktopWallpaper/d1.avif",
			alt: "时间问候卡片装饰图",
			position: "center",
		},
	},
	weather: {
		locationApi: "https://ipwho.is/",
		forecastApi: "https://api.open-meteo.com/v1/forecast",
		weatherCacheDuration: 15 * 60 * 1000,
		locationCacheDuration: 6 * 60 * 60 * 1000,
		fallbackLocation: {
			name: "Antarctica · McMurdo Station",
			latitude: -77.8419,
			longitude: 166.6863,
		},
	},
	dailyQuote: {
		api: "https://v1.hitokoto.cn/?encode=json&max_length=45&c=d&c=i&c=k",
		fallbackText: "心有微光，自会抵达想去的地方。",
		fallbackAuthor: "本站",
	},
	festivalCountdown: {
		festivals: [
			{ name: "元旦", calendar: "gregorian", month: 1, day: 1 },
			{ name: "春节", calendar: "chinese", month: 1, day: 1 },
			{ name: "元宵节", calendar: "chinese", month: 1, day: 15 },
			{ name: "情人节", calendar: "gregorian", month: 2, day: 14 },
			{ name: "劳动节", calendar: "gregorian", month: 5, day: 1 },
			{ name: "端午节", calendar: "chinese", month: 5, day: 5 },
			{ name: "七夕", calendar: "chinese", month: 7, day: 7 },
			{ name: "中秋", calendar: "chinese", month: 8, day: 15 },
			{ name: "国庆节", calendar: "gregorian", month: 10, day: 1 },
			{ name: "圣诞节", calendar: "gregorian", month: 12, day: 25 },
		],
	},
};
