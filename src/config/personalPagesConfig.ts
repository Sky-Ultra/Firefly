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
				id: "warm-snow-and-a-moment",
				date: "2026-10-24T19:13:00+11:00",
				content: "淡雪融时阳彩暖，一瞬芳华抵万年",
				contentEn:
					"As light snow melts, the sunlight glows warm; a fleeting moment of beauty is worth ten thousand years.",
			},
			{
				id: "moonlight-and-water-patterns",
				date: "2026-10-23T22:08:00+11:00",
				content: "鸿雁长飞光不度，鱼龙潜跃水成文",
				contentEn:
					"Wild geese fly far, yet cannot carry the moonlight; fish and dragons dive and leap, tracing patterns on the water.",
			},
			{
				id: "flowers-and-unspoken-feelings",
				date: "2026-10-23T20:12:00+11:00",
				content: "花开未敢传心事，花落方知春已深。",
				contentEn:
					"While flowers bloomed, I dared not share my feelings; only when they fell did I realize how far spring had gone.",
			},
			{
				id: "mayfly-and-starlight",
				date: "2026-10-23T18:56:00+11:00",
				content: "蜉蝣不识千秋夜，也借星光渡此生",
				contentEn:
					"The mayfly knows nothing of a thousand autumn nights, yet borrows starlight to carry it through this life.",
			},
			{
				id: "winter-snow-october-22",
				date: "2026-10-22T21:50:00+11:00",
				content: "纵有千般眷恋，终随暮雪入旧年",
				contentEn:
					"Though I hold a thousand affections, in the end they follow the evening snow into years gone by.",
			},
			{
				id: "world-execute-me",
				date: "2026-10-22T18:52:00+11:00",
				content: "world.execute(me)\n\n世界，请处决我...",
				contentEn: "world.execute(me)\n\nWorld, please execute me...",
			},
			{
				id: "half-a-moon-and-a-river-boat",
				date: "2026-10-21T18:27:00+11:00",
				content:
					"春风曾照故人眸，\n一别山河几度秋。\n若问相思何处寄，\n半轮明月半江舟。",
				contentEn:
					"Spring's breeze once lit a dear one's eyes,\nHow many autumns have passed over hills and rivers since we parted?\nIf you ask where I might send this longing,\nHalf a bright moon, a boat upon the river.",
			},
			{
				id: "randomness-and-eternity",
				date: "2026-10-20T18:16:00+11:00",
				content:
					"世间的每一次相遇，都不过是无数随机变量的一次取值。可偏偏只有你，让我在一场偶然里，生出了对⌈永恒⌋的妄想......\n宇宙不曾为任何一颗恒星停下膨胀，我也不该为某一个人停下脚步。只是偶尔回头，仍觉得那一小片星空，比整个宇宙都明亮......",
				contentEn:
					"Every encounter in this world is only one realization of countless random variables. Yet you alone, in a single chance meeting, gave rise to my fantasy of ⌈eternity⌋......\nThe universe has never paused its expansion for any star, and I should not stop moving forward for one person either. Yet when I occasionally look back, that little patch of stars still seems brighter than the entire universe......",
			},
			{
				id: "unchanged-moonlight",
				date: "2026-10-19T22:49:00+11:00",
				content: "奈何月色如初，空照满庭落叶成秋...",
				contentEn:
					"Yet the moonlight is as it was, shining in vain upon a courtyard of fallen leaves turned to autumn...",
			},
			{
				id: "question-the-stars",
				date: "2026-10-19T20:43:00+11:00",
				content: "我，将诘问群星！",
				contentEn: "I shall question the stars!",
			},
			{
				id: "empty-set-and-dreams",
				date: "2026-10-18T19:47:00+11:00",
				content:
					"空集是任何集合的子集，于是我的每个梦里都有你\n你是我的补集：现实里没有你，我就把梦当成全集...",
				contentEn:
					"The empty set is a subset of every set, and so you are in every dream of mine.\nYou are my complement: if reality has no you, I'll take my dreams as the universal set...",
			},
			{
				id: "winter-snow-and-old-years",
				date: "2026-10-18T18:35:00+11:00",
				content: "纵有千般眷恋，终随暮雪入旧年...",
				contentEn:
					"Though I hold a thousand affections, in the end they follow the evening snow into years gone by...",
			},
			{
				id: "the-years-are-finite",
				date: "2026-10-17T17:05:00+11:00",
				content: "至此间 我知觉 流年应有限...",
				contentEn:
					"At this point, I come to realize that the passing years must be finite...",
			},
			{
				id: "cold-at-the-heights",
				date: "2026-10-16T21:26:00+11:00",
				content: "高处不胜寒。",
				contentEn: "At such heights, the cold is more than one can bear.",
			},
			{
				id: "swords-and-melodies",
				date: "2026-10-14T21:41:00+11:00",
				content: "观千剑而后识器，操千曲而后晓声",
				contentEn:
					"Only after examining a thousand swords do you know a blade; only after playing a thousand melodies do you understand music.",
			},
			{
				id: "hello-thanks-goodbye",
				date: "2026-10-14T21:17:00+11:00",
				content: "「你好」、「谢谢」；最后是「再见」",
				contentEn: "「Hello」, 「Thank you」; and finally, 「Goodbye」",
			},
			{
				id: "vow-to-the-dawn",
				date: "2026-10-13T23:26:00+11:00",
				content:
					"「以晨露未晞的鲜花为誓，献与你金穗遍野的繁荣。」\n「以长夜不熄的灯火为誓，捍卫你极光映雪的山川。」\n「以追逐黎明的羽翼为誓，迎接你身披风霜的归途。」\n「群星为证，誓予破晓。」",
				contentEn:
					"「By flowers still wet with morning dew, I swear to offer you prosperity, golden grain across your fields.」\n「By lights that never fade through the long night, I swear to defend your mountains and rivers, where auroras shine upon the snow.」\n「By wings that pursue the dawn, I swear to welcome your return, weathered by wind and frost.」\n「With the stars as witnesses, I pledge myself to daybreak.」",
			},
			{
				id: "time-and-all-things",
				date: "2026-10-13T21:10:00+11:00",
				content: "时间本身就是万物的参照，所以万物都是时间的参照",
				contentEn:
					"Time itself is the reference for all things, so all things are references for time.",
			},
			{
				id: "you-in-my-memory",
				date: "2026-10-12T18:44:00+11:00",
				content: "没人能比得上我记忆中的你，即使现在的你也不行...",
				contentEn:
					"No one can compare to the you in my memory, not even the person you are now...",
			},
			{
				id: "unbound-by-things",
				date: "2026-10-11T23:13:00+11:00",
				content: "物物而不物于物，念念而不念于念",
				contentEn:
					"Engage with things without being bound by them; attend to thoughts without being held by them.",
			},
			{
				id: "she-loves-her-dream",
				date: "2026-10-11T18:50:00+11:00",
				content: "她只爱她的梦。她不爱任何人。",
				contentEn: "She loves only her dreams. She loves no one.",
			},
			{
				id: "brief-utopia",
				date: "2026-10-10T22:39:00+11:00",
				content: "你的存在是我在这个世界短暂的乌托邦...",
				contentEn: "Your presence is my brief utopia in this world...",
			},
			{
				id: "thank-you-for-leaving",
				date: "2026-10-06T18:44:00+11:00",
				content: "“我无法挽留任何从我生命中离开的人，但是感谢你们”",
				contentEn:
					"“I cannot keep anyone who leaves my life, but thank you all.”",
			},
			{
				id: "stars-upon-the-river",
				date: "2026-10-03T20:02:00+10:00",
				content: "观尘寰兮焜煌，如星落兮满江。",
				contentEn:
					"Behold the mortal world aglow, like stars falling to fill the river.",
			},
			{
				id: "golden-memory",
				date: "2026-10-01T19:29:00+10:00",
				content: "假使有一日不得不同你相别，你在我的记忆中也会如黄金般闪耀。",
				contentEn:
					"Should a day come when I must part from you, you will still shine like gold in my memory.",
			},
			{
				id: "love-and-domain",
				date: "2026-09-20T20:03:00+10:00",
				content: "“如果爱也能被量化，我的心早已超出定义域”",
				contentEn:
					"“If love could be quantified, my heart would have long since exceeded its domain.”",
			},
			{
				id: "ten-thousand-winters-and-springs",
				date: "2026-09-22T18:57:00+10:00",
				content:
					"一万个冬天以后是一万个春天，一万次离别后是一万次相见；或许过往已无可溯洄，好在还有可以与你相遇的明天。",
				contentEn:
					"After ten thousand winters come ten thousand springs, and after ten thousand farewells come ten thousand reunions; perhaps the past can no longer be retraced, but there is still a tomorrow in which I can meet you again.",
			},
			{
				id: "autumn-moon-poem",
				date: "2026-09-25T19:47:00+10:00",
				content:
					"桂子浮香秋水静，疏烟淡处玉轮低。\n若有人兮云之际，舞袂翩兮扬玉霓。\n欲寄幽芳无片语，一襟秋意不须题。\n天上月华人如愿，清辉偏向小窗西。\n既见君兮予所欢，愿随风兮鸣银鸾。",
				contentEn:
					"Osmanthus fragrance drifts above still autumn waters; beyond the thinning mist, the jade moon hangs low.\nThere you are among the clouds, your dancing sleeves lifting a rainbow of light.\nI would send you these quiet flowers, but have no words; this heart full of autumn needs no inscription.\nMay the moon above grant our wish, its clear glow turning toward the little western window.\nNow that I have met the one I cherish, may I follow the wind and hear the silver phoenix sing.",
			},
			{
				id: "love-leaves-regret",
				date: "2026-09-26T16:23:00+10:00",
				content: "自古多情空余恨...",
				contentEn:
					"Since ancient times, deep affection has left only regret...",
			},
			{
				id: "firefly-glow",
				date: "2026-09-14T22:33:00+10:00",
				content: "飞萤之火自无梦的长夜亮起，绽放在终竟的明天",
				contentEn:
					"May the firefly's glow illuminate the long, dreamless night and bloom in the tomorrow at journey's end.",
			},
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
