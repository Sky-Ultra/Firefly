import type { PlacesPageConfig } from "@/types/placesConfig";

// 足迹数据独立维护，不与相册、朋友圈或爱情树共用。
// 后续在 places 填入你确认过的地点、日期和照片即可；examples 只用于预览。
export const placesConfig: PlacesPageConfig = {
	title: "去过的地方",
	titleEn: "Places I've been",
	description: "足迹地图与旅行记录，把走过的路慢慢收藏。",
	descriptionEn: "A little collection of journeys, places and memories.",
	previewWithExamples: true,
	places: [],
	examples: [
		{
			id: "demo-west-lake",
			name: "西湖",
			nameEn: "West Lake",
			country: "中国",
			countryEn: "China",
			region: "浙江",
			regionEn: "Zhejiang",
			city: "杭州",
			cityEn: "Hangzhou",
			coordinates: [30.243, 120.15],
			tags: [
				{ name: "旅游", nameEn: "Travel" },
				{ name: "散步", nameEn: "Walks" },
			],
			visits: [
				{ start: "2026-09-12", end: "2026-09-14" },
				{ start: "2025-10-01" },
			],
			note: "这里将放你的旅行记忆。这是演示条目，不代表真实到访。",
			noteEn:
				"Your travel memories will go here. This is an example, not an actual visit.",
			photos: [
				{
					src: "/assets/images/places/demo-lake.svg",
					alt: "湖光山色示例插画",
					altEn: "Example lake illustration",
				},
				{
					src: "/assets/images/places/demo-mountain.svg",
					alt: "山间日落示例插画",
					altEn: "Example mountain illustration",
				},
			],
		},
		{
			id: "demo-lingyin",
			name: "灵隐寺",
			nameEn: "Lingyin Temple",
			country: "中国",
			countryEn: "China",
			region: "浙江",
			regionEn: "Zhejiang",
			city: "杭州",
			cityEn: "Hangzhou",
			coordinates: [30.24, 120.101],
			tags: [{ name: "爬山", nameEn: "Hiking" }],
			visits: [{ start: "2026-09-13" }],
			note: "示例地点，用于预览相邻地点的聚合与地图定位。",
			noteEn: "An example for previewing nearby markers and map navigation.",
			photos: [
				{
					src: "/assets/images/places/demo-mountain.svg",
					alt: "山林示例插画",
					altEn: "Example forest illustration",
				},
			],
		},
		{
			id: "demo-shanghai",
			name: "外滩",
			nameEn: "The Bund",
			country: "中国",
			countryEn: "China",
			region: "上海",
			regionEn: "Shanghai",
			city: "上海",
			cityEn: "Shanghai",
			coordinates: [31.24, 121.491],
			tags: [{ name: "旅游", nameEn: "Travel" }],
			visits: [{ start: "2026-07-18", end: "2026-07-20" }],
			note: "城市、日期、分类和照片之后都可以替换为你的记录。",
			noteEn:
				"The city, dates, tags and photos can all be replaced with your own.",
			photos: [
				{
					src: "/assets/images/places/demo-city.svg",
					alt: "城市夜色示例插画",
					altEn: "Example city illustration",
				},
			],
		},
		{
			id: "demo-beijing",
			name: "景山公园",
			nameEn: "Jingshan Park",
			country: "中国",
			countryEn: "China",
			region: "北京",
			regionEn: "Beijing",
			city: "北京",
			cityEn: "Beijing",
			coordinates: [39.925, 116.396],
			tags: [{ name: "散步", nameEn: "Walks" }],
			visits: [{ start: "2026-05-02" }],
			note: "每一站都可以留下几句话，和当时的风景。",
			noteEn: "Each stop can hold a few words and a glimpse of the scenery.",
			photos: [
				{
					src: "/assets/images/places/demo-lake.svg",
					alt: "公园远山示例插画",
					altEn: "Example park illustration",
				},
			],
		},
	],
	map: {
		center: [31, 115],
		zoom: 4,
		tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
	},
};
