import type { VisitorWidgetsConfig } from "@/types/visitorWidgetsConfig";

export const visitorWidgetsConfig: VisitorWidgetsConfig = {
	welcomeToast: {
		enabled: true,
		homepageOnly: true,
		locationApi: "https://ipwho.is/",
		fallbackMessage: "你好，欢迎来到我的博客",
		fallbackMessageEn: "Hello, welcome to my blog",
		subtitle: "欢迎来到我的博客",
		subtitleEn: "Welcome to my blog",
		visibleDuration: 5_000,
		fadeDuration: 500,
	},
	copyToast: {
		message: "✨ 复制成功，转载请标注本文地址",
		messageEn: "✨ Copied. Please include a link when reposting.",
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
				textsEn: [
					"Moonlight drifts across the cup; I lean against a lone boat and count the distant stars.",
					"Lanterns turn the night to day, and ten thousand homes shine bright.",
					"We share this mortal world—where might the fading lights be found?",
					"No need for a cold flute to play through the night; one song has already reached the far shore.",
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
				textsEn: [
					"Morning mist parts to reveal the hills, while the river carries the rosy dawn.",
					"Morning light asks nothing of the world; it simply falls on blossoms and old books.",
				],
				interval: 10_000,
				icon: "morning",
			},
			{
				startHour: 12,
				endHour: 18,
				texts: ["上下天光，一碧万顷", "长日无声花自落，小楼听雨到黄昏"],
				textsEn: [
					"Sky and water meet in a boundless sweep of blue.",
					"Through the long, quiet day, petals fall; in a small tower, I listen to rain until dusk.",
				],
				interval: 10_000,
				icon: "afternoon",
			},
			{
				startHour: 18,
				endHour: 24,
				texts: ["醉后不知天在水，满船惊梦压星河"],
				textsEn: [
					"Drunk, I cannot tell sky from water; dreams fill the boat beneath the river of stars.",
				],
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
		birthday: {
			month: 4,
			day: 27,
		},
		festivals: [
			{
				name: "元旦",
				nameEn: "New Year's Day",
				calendar: "gregorian",
				month: 1,
				day: 1,
			},
			{
				name: "春节",
				nameEn: "Lunar New Year",
				calendar: "chinese",
				month: 1,
				day: 1,
			},
			{
				name: "元宵节",
				nameEn: "Lantern Festival",
				calendar: "chinese",
				month: 1,
				day: 15,
			},
			{
				name: "情人节",
				nameEn: "Valentine's Day",
				calendar: "gregorian",
				month: 2,
				day: 14,
			},
			{
				name: "劳动节",
				nameEn: "Labour Day",
				calendar: "gregorian",
				month: 5,
				day: 1,
			},
			{
				name: "端午节",
				nameEn: "Dragon Boat Festival",
				calendar: "chinese",
				month: 5,
				day: 5,
			},
			{
				name: "七夕",
				nameEn: "Qixi Festival",
				calendar: "chinese",
				month: 7,
				day: 7,
			},
			{
				name: "中秋",
				nameEn: "Mid-Autumn Festival",
				calendar: "chinese",
				month: 8,
				day: 15,
			},
			{
				name: "国庆节",
				nameEn: "National Day",
				calendar: "gregorian",
				month: 10,
				day: 1,
			},
			{
				name: "圣诞节",
				nameEn: "Christmas",
				calendar: "gregorian",
				month: 12,
				day: 25,
			},
		],
	},
};
