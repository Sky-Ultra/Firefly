import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 禁用音乐播放器方法：
	// 模板默认侧边栏和导航栏两个都显示
	// 1. 侧边栏：在sidebarConfig.ts侧边栏配置把音乐组件enable设为false禁用即可
	// 2. 导航栏：在本配置文件把showInNavbar设为false禁用即可

	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "meting",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: true,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "10046455237",
		// 认证 token（可选）
		auth: "",
		// 超时后自动尝试下一个接口，避免播放器一直停留在加载状态
		requestTimeoutMs: 8000,
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		],
		// 最终顺序：置顶歌曲 → 原歌单前四首 → 截图歌曲 → 原歌单其余歌曲
		playlistOrder: {
			songApi:
				"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			baseHeadCount: 4,
			pinnedSongs: [
				{
					name: "星炬不熄",
					artist: "鸣潮先约电台 / 飞行雪绒 / 星炬学院毕业生",
					server: "tencent",
					id: "000nMgTC3lDi8o",
					picId: "0033K7J91KNK1q",
				},
			],
			insertedSongs: [
				{
					name: "纳塔 Natlan",
					artist: "HOYO-MiX",
					server: "tencent",
					id: "001I7BJA21W08A",
					picId: "001azs3V2JvRXC",
				},
				{
					name: "故风吟游之地",
					artist: "鸣潮先约电台 / jkinss",
					server: "tencent",
					id: "002L3eAo3iE6oS",
					picId: "003t96kr2OwgNk",
				},
				{
					name: "愿戴荣光坠入天渊",
					artist: "鸣潮先约电台 / jixwang / VISION SOUND",
					server: "tencent",
					id: "0034QXzv2ptMdw",
					picId: "004P12n30kb9Fr",
				},
				{
					name: "Against the Tide（逆潮）",
					artist: "鸣潮先约电台 / Forts / Obadiah Brown-Beach",
					server: "tencent",
					id: "0039rmgI02XQmw",
					picId: "002hqhTq2M1Xxr",
				},
				{
					name: "春涧",
					artist: "浅影阿",
					server: "tencent",
					id: "003gp2cp1RlBgh",
					picId: "003KZZPr29cRlB",
				},
				{
					name: "第57次取消发送",
					artist: "菲菲公主（陆绮菲）",
					server: "tencent",
					id: "001P6YOB0eXLlj",
					picId: "000KrDC019mc82",
				},
				{
					name: "九万字",
					artist: "黄诗扶",
					server: "tencent",
					id: "003BSJQ10mR12I",
					picId: "003Y4SZD0uCEZs",
				},
				{
					name: "做自己的光，不需要太亮",
					artist: "善宇",
					server: "tencent",
					id: "003P0SQi2nq5Vu",
					picId: "002XMKqj3cgTXA",
				},
				{
					name: "远航星的告别",
					artist: "鸣潮先约电台 / jixwang / Tarokiki / Emi Evans",
					server: "tencent",
					id: "0038W0WD0TlByu",
					picId: "004fGHuo31YOxu",
				},
				{
					name: "The King",
					artist: "Paperman",
					server: "tencent",
					id: "003fubzk4IGxGF",
					picId: "001NvNva19krNb",
				},
				{
					name: "Lightning Moment feat.fox capture plan",
					artist: "DJ OKAWARI / fox capture plan",
					server: "tencent",
					id: "000L8BlK250Vxr",
					picId: "003XzVV93Lga2e",
				},
				{
					name: "星降る海（繁星坠海）",
					artist: "Aqu3ra / 早見沙織",
					server: "tencent",
					id: "001AdB7w12o1XY",
					picId: "000GFM7M3igU02",
				},
				{
					name: "Everflow（中文版）",
					artist: "鸣潮先约电台 / 电鸟个灯泡",
					server: "tencent",
					id: "000G32401cMmHN",
					picId: "001VxIRQ1lh4hQ",
				},
				{
					name: "西楼别序",
					artist: "尹昔眠 / 小田音乐社",
					server: "tencent",
					id: "001uVkVx30HxRy",
					picId: "000Xrevb0HQESg",
				},
				{
					name: "雨爱",
					artist: "杨丞琳",
					server: "tencent",
					id: "000rh0dE2TyUic",
					picId: "000jcKFG0sQrD0",
				},
				{
					name: "堕（合唱版）",
					artist: "烟火客 / Chili辣辣",
					server: "tencent",
					id: "000ujYcq0fElOl",
				},
				{
					name: "离开我的依赖",
					artist: "王艳薇",
					server: "tencent",
					id: "001GOlCd2HImcY",
					picId: "004CSyAN1oc97b",
				},
				{
					name: "昔涟",
					artist: "张韶涵 / HOYO-MiX",
					server: "tencent",
					id: "002rhFKO3EjKAg",
					picId: "000eyy8U24wicN",
				},
				{
					name: "寄明月",
					artist: "SING女团",
					server: "tencent",
					id: "002yP4Gd0Mjr30",
					picId: "000yACPu0nXVYL",
				},
				{
					name: "Lifeline（生命线）",
					artist: "Zeraphym 六翼使徒",
					server: "tencent",
					id: "001DRnxC0twkty",
				},
				{
					name: "唯一的星光（Polaris）",
					artist: "Asia D / FOM / JAMMERC",
					server: "tencent",
					id: "004OqnVB01iwGB",
					picId: "000bw39R4V3AB4",
				},
				{
					name: "白月光与朱砂痣",
					artist: "大籽",
					server: "tencent",
					id: "002iqQ4I1wyB7L",
					picId: "000dt9Py0BrReK",
				},
				{
					name: "潮汐（Natural）",
					artist: "傅梦彤",
					server: "tencent",
					id: "000B52E60vYsiO",
					picId: "003Is5KW1hNDkI",
				},
				{
					name: "权御天下",
					artist: "洛天依",
					server: "tencent",
					id: "001xZXiW4aAhkL",
					picId: "001CCsrz3ly1sO",
				},
			],
		},
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
		],
	},
};
