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
				id: "bilibili-1274103564492341249",
				date: "2026-11-24T10:52:33+08:00",
				content:
					"我们不要再抑郁焦虑了  我们一起去过正常的生活吧.\n我们手握手一起看电影吧   我们闭着眼躺在床上拥抱吧   我们在马路上一起逛街吧   我们早上睡醒互相蹭蹭彼此吧   我们去药店买健胃消食片一起去吃自助餐吧   我们傍晚洗完澡穿着睡衣手牵手在小区楼下散步吧   我们手握手一起在幸福的现实受健康生活吧……\n想想就很幸福,我们以后有个家吧……",
				contentEn:
					"Let’s leave the gloom and worry behind and live an ordinary life together.\nLet’s hold hands at the movies, lie in bed with our eyes closed and cuddle, and go window-shopping together. Let’s snuggle when we wake up, stop at the pharmacy for digestive tablets before going to a buffet, and hold hands on a walk around the neighborhood in our pajamas after our evening showers. Let’s hold hands and live a happy, healthy life together for real…\nJust thinking about it makes me happy. Let’s have a home together someday…",
				contentParts: [
					{
						text: "我们不要再抑郁焦虑了  我们一起去过正常的生活吧.\n我们手握手一起看电影吧   我们闭着眼躺在床上拥抱吧   我们在马路上一起逛街吧   我们早上睡醒互相蹭蹭彼此吧   我们去药店买健胃消食片一起去吃自助餐吧   我们傍晚洗完澡穿着睡衣手牵手在小区楼下散步吧   我们手握手一起在幸福的现实受健康生活吧……",
						textEn:
							"Let’s leave the gloom and worry behind and live an ordinary life together.\nLet’s hold hands at the movies, lie in bed with our eyes closed and cuddle, and go window-shopping together. Let’s snuggle when we wake up, stop at the pharmacy for digestive tablets before going to a buffet, and hold hands on a walk around the neighborhood in our pajamas after our evening showers. Let’s hold hands and live a happy, healthy life together for real…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "\n想想就很幸福,我们以后有个家吧……",
						textEn:
							"\nJust thinking about it makes me happy. Let’s have a home together someday…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
			},
			{
				id: "bilibili-1274079486953914389",
				date: "2026-11-24T09:19:07+08:00",
				content:
					"这期的发型太他妈神了，我承认你才是真正的菠萝头……我也要卸下小小菠萝的名号了",
				contentEn:
					"That haircut is fucking incredible. I admit it, you’re the real pineapple head…I guess I’ll have to give up the Little Pineapple title, too.",
				contentParts: [
					{
						text: "这期的发型太他妈神了，我承认你才是真正的菠萝头……",
						textEn:
							"That haircut is fucking incredible. I admit it, you’re the real pineapple head…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						text: "我也要卸下小小菠萝的名号了",
						textEn:
							"I guess I’ll have to give up the Little Pineapple title, too.",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1E7hE6aEH3/",
					title: "OpenAI的100多个数学成果与数学顾问组的成立",
					titleEn:
						"OpenAI’s 100-plus mathematical results and the creation of its math advisory group",
					poster: {
						src: "/assets/images/moments/bilibili-BV1E7hE6aEH3.webp",
						alt: "OpenAI的100多个数学成果与数学顾问组的成立：视频封面",
						altEn:
							"Video cover: OpenAI’s 100-plus mathematical results and the creation of its math advisory group",
					},
				},
			},
			{
				id: "bilibili-1273894051733569537",
				date: "2026-11-23T21:19:32+08:00",
				content:
					"虽然神了，但是学到了！妙手回春呀……既然与她无缘，那一切都无法影响我向前的脚步……！向着星辰与深渊！但实话实说，感觉真有点相似……",
				contentEn:
					"That was wild, but I learned something! What a save… If she and I aren’t meant to be, nothing can stop me from moving forward…! To the stars and the abyss! Honestly though, it does feel a little familiar…",
				contentParts: [
					{
						text: "虽然神了，但是学到了！妙手回春呀……既然与她无缘，那一切都无法影响我向前的脚步……！向着星辰与深渊！",
						textEn:
							"That was wild, but I learned something! What a save… If she and I aren’t meant to be, nothing can stop me from moving forward…! To the stars and the abyss! ",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						text: "但实话实说，感觉真有点相似……",
						textEn: "Honestly though, it does feel a little familiar…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1rF336AEfh/",
					title: "大学国奖做题龙终究在他喜欢的女生面前低下了头",
					titleEn:
						"The national scholarship winner finally hangs his head in front of his crush",
					poster: {
						src: "/assets/images/moments/bilibili-BV1rF336AEfh.webp",
						alt: "大学国奖做题龙终究在他喜欢的女生面前低下了头：视频封面",
						altEn:
							"Video cover: The national scholarship winner finally hangs his head in front of his crush",
					},
				},
			},
			{
				id: "bilibili-1273730499386277895",
				date: "2026-11-23T10:44:52+08:00",
				content: "这对没话说……99",
				contentEn: "Nothing to add about this couple… may they last forever",
				contentParts: [
					{
						text: "这对没话说……99",
						textEn: "Nothing to add about this couple… may they last forever",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV184yGzEEQk/",
					title: "【雷利尔❤️索琳蒂丝】非凡之爱",
					titleEn: "Rayliel ❤️ Solintis | No Ordinary Love",
					poster: {
						src: "/assets/images/moments/bilibili-BV184yGzEEQk.webp",
						alt: "【雷利尔❤️索琳蒂丝】非凡之爱：视频封面",
						altEn: "Video cover: Rayliel ❤️ Solintis | No Ordinary Love",
					},
				},
			},
			{
				id: "bilibili-1273680510207393801",
				date: "2026-11-23T07:30:53+08:00",
				content: "坏菜了……",
				contentEn: "We’re cooked…",
				contentParts: [
					{
						text: "坏菜了……",
						textEn: "We’re cooked…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1z1YV6REDU/",
					title: "AI的副作用，把学生变成末人",
					titleEn:
						"The side effects of AI: turning students into Nietzsche’s last men",
					poster: {
						src: "/assets/images/moments/bilibili-BV1z1YV6REDU.webp",
						alt: "AI的副作用，把学生变成末人：视频封面",
						altEn:
							"Video cover: The side effects of AI: turning students into Nietzsche’s last men",
					},
				},
			},
			{
				id: "bilibili-1273568042207412231",
				date: "2026-11-23T00:14:27+08:00",
				content: "我喜欢……不怼，兄弟你……！",
				contentEn: "I like… wait, bro, you…!",
				contentParts: [
					{
						text: "我喜欢……不怼，兄弟你……！",
						textEn: "I like… wait, bro, you…!",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV19fN76sEs4/",
					title: "睦子米拍黄瓜教学",
					titleEn: "Mutsumi’s smashed cucumber tutorial",
					poster: {
						src: "/assets/images/moments/bilibili-BV19fN76sEs4.webp",
						alt: "睦子米拍黄瓜教学：视频封面",
						altEn: "Video cover: Mutsumi’s smashed cucumber tutorial",
					},
				},
			},
			{
				id: "memories-keep-shining-nov22",
				date: "2026-11-22T20:31:20+11:00",
				content: "你知道，梦终有一天会醒，但回忆中的事物会一直闪耀。",
				contentEn:
					"You know, one day we’ll wake from the dream, but the things we remember will keep on shining.",
			},
			{
				id: "bilibili-1273449685795733513",
				date: "2026-11-22T16:35:10+08:00",
				content: "这才是AI的正确用法，而不是证明黎曼猜想",
				contentEn:
					"Now this is what AI is for, not proving the Riemann hypothesis",
				contentParts: [
					{
						text: "这才是AI的正确用法，而不是证明黎曼猜想",
						textEn:
							"Now this is what AI is for, not proving the Riemann hypothesis",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1vQybzKEhr/",
					title:
						"《520AM》司凤版⚡思罢吗乐队激情演奏！小时候这集听哭了😭【AI MV大赛】",
					titleEn:
						"520AM, Sifeng version ⚡ The Avengers band goes all out! This made me cry as a kid 😭 [AI music video contest]",
					poster: {
						src: "/assets/images/moments/bilibili-BV1vQybzKEhr.webp",
						alt: "《520AM》司凤版⚡思罢吗乐队激情演奏！小时候这集听哭了😭【AI MV大赛】：视频封面",
						altEn:
							"Video cover: 520AM, Sifeng version ⚡ The Avengers band goes all out! This made me cry as a kid 😭 [AI music video contest]",
					},
				},
			},
			{
				id: "how-does-longing-fade-nov21",
				date: "2026-11-21T21:52:34+11:00",
				content:
					"性压抑尚可自己解决，那爱压抑呢，想把头靠在你的脖颈说一些暖味的话，用指尖在你的手掌写下我的名字，从额头一直吻到胸前，想记住你瞳孔的颜色脉搏的跳动身上的味道，爱要如何自己消解......",
				contentEn:
					"Sexual frustration is something I can deal with on my own. But what about all this pent-up love? I want to rest my head against your neck and whisper something intimate, trace my name on your palm, kiss you from your forehead down to your chest. I want to remember the color of your eyes, the beat of your pulse, your scent. How do I ease that longing on my own......",
			},
			{
				id: "bilibili-1272831829003468808",
				date: "2026-11-21T00:37:34+08:00",
				content: "笑死我了，也算是全程见证了",
				contentEn: "I’m dying. I got to watch this whole thing unfold",
				contentParts: [
					{
						text: "笑死我了，也算是全程见证了",
						textEn: "I’m dying. I got to watch this whole thing unfold",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1aDyszHErp/",
					title:
						"我设计的元素周期表UI居然被谷歌采纳了 😱😱😱，整活整到官方去了",
					titleEn:
						"Google actually adopted the periodic table UI I designed 😱😱😱 My bit made it into the official product",
					poster: {
						src: "/assets/images/moments/bilibili-BV1aDyszHErp.webp",
						alt: "我设计的元素周期表UI居然被谷歌采纳了 😱😱😱，整活整到官方去了：视频封面",
						altEn:
							"Video cover: Google actually adopted the periodic table UI I designed 😱😱😱 My bit made it into the official product",
					},
				},
			},
			{
				id: "ordinary-days-nov20",
				date: "2026-11-20T22:30:00+11:00",
				content: "被酒莫惊春睡重，赌书消得泼茶香，当时只道是寻常...",
				contentEn:
					"Don’t wake me from my wine-heavy spring sleep. We wagered on lines from books and spilled our fragrant tea. Back then I thought those days were ordinary...",
			},
			{
				id: "bilibili-1272698723639492624",
				date: "2026-11-20T16:01:03+08:00",
				content: "坏菜了孩子们，这期好像真有用…",
				contentEn: "Oh no, guys, this one might actually be useful…",
				contentParts: [
					{
						text: "坏菜了孩子们，这期好像真有用…",
						textEn: "Oh no, guys, this one might actually be useful…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1uVWB6HEB2/",
					title: "如何使用康神判定氧化还原发生条件",
					titleEn:
						"How to use the Kangshen method to tell when a redox reaction can occur",
					poster: {
						src: "/assets/images/moments/bilibili-BV1uVWB6HEB2.webp",
						alt: "如何使用康神判定氧化还原发生条件：视频封面",
						altEn:
							"Video cover: How to use the Kangshen method to tell when a redox reaction can occur",
					},
				},
			},
			{
				id: "bilibili-1272225315166355474",
				date: "2026-11-19T09:23:59+08:00",
				content: "这个好像是真的能用吧…",
				contentEn: "Wait, this one actually looks usable…",
				contentParts: [
					{
						text: "这个好像是真的能用吧…",
						textEn: "Wait, this one actually looks usable…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Smpj69EWz/",
					title:
						"MyGo 是一个用 Go 开发跨平台桌面应用的框架，可以用网页前端写界面，也能完全用 Go 构建原生 UI，两种方式还能混用",
					titleEn:
						"MyGo: a cross-platform Go framework for desktop apps with web, native Go or hybrid interfaces",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Smpj69EWz.webp",
						alt: "MyGo 是一个用 Go 开发跨平台桌面应用的框架，可以用网页前端写界面，也能完全用 Go 构建原生 UI，两种方式还能混用：视频封面",
						altEn:
							"Video cover: MyGo: a cross-platform Go framework for desktop apps with web, native Go or hybrid interfaces",
					},
				},
			},
			{
				id: "bilibili-1272206340052221977",
				date: "2026-11-19T08:10:21+08:00",
				content: "相顾无言 唯有泪千行…",
				contentEn:
					"We look at each other without a word, only a thousand lines of tears…",
				contentParts: [
					{
						text: "相顾无言 唯有泪千行…",
						textEn:
							"We look at each other without a word, only a thousand lines of tears…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV13Qsg61EWA/",
					title: "如果有一天，你最想见的人站在你面前，第一句话你会说什么",
					titleEn:
						"If the person you most want to see stood before you one day, what would you say first?",
					poster: {
						src: "/assets/images/moments/bilibili-BV13Qsg61EWA.webp",
						alt: "如果有一天，你最想见的人站在你面前，第一句话你会说什么：视频封面",
						altEn:
							"Video cover: If the person you most want to see stood before you one day, what would you say first?",
					},
				},
			},
			{
				id: "bilibili-1272118464961576961",
				date: "2026-11-19T02:29:21+08:00",
				content: "孤君幻眷空化情…",
				contentEn:
					"A lonely heart, an imagined love, and all that feeling come to nothing…",
				contentParts: [
					{
						text: "孤君幻眷空化情…",
						textEn:
							"A lonely heart, an imagined love, and all that feeling come to nothing…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1N1sp6MEJR/",
					title:
						"你说终其一生只为寻求一双为你流泪的眼睛 我站在你身后早已泪流满面",
					titleEn:
						"You spent your life searching for eyes that would cry for you. I stood behind you, already in tears.",
					poster: {
						src: "/assets/images/moments/bilibili-BV1N1sp6MEJR.webp",
						alt: "你说终其一生只为寻求一双为你流泪的眼睛 我站在你身后早已泪流满面：视频封面",
						altEn:
							"Video cover: You spent your life searching for eyes that would cry for you. I stood behind you, already in tears.",
					},
				},
			},
			{
				id: "beauty-of-this-world-nov18",
				date: "2026-11-18T17:32:41+11:00",
				content: "May you the beauty of this world\nalways shine",
				contentEn: "May you the beauty of this world\nalways shine",
			},
			{
				id: "bilibili-1271928275274301443",
				date: "2026-11-18T14:11:19+08:00",
				content: "停下来吧，求你了。我有个朋友已经破防了\n空悲切…",
				contentEn:
					"Stop, please. I have a friend who already can’t take it\nNothing left but sorrow…",
				contentParts: [
					{
						text: "停下来吧，求你了。我有个朋友已经破防了",
						textEn: "Stop, please. I have a friend who already can’t take it",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "\n空悲切…",
						textEn: "\nNothing left but sorrow…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1LwMX6FEGU/",
					title: "“表白失败了不要做朋友”",
					titleEn: "“Don’t stay friends after a rejected confession”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1LwMX6FEGU.webp",
						alt: "“表白失败了不要做朋友”：视频封面",
						altEn:
							"Video cover: “Don’t stay friends after a rejected confession”",
					},
				},
			},
			{
				id: "bilibili-1271927351830118401",
				date: "2026-11-18T14:07:44+08:00",
				content: "不经一番寒彻骨，怎得梅花扑鼻香…",
				contentEn:
					"How could plum blossoms smell so sweet without the bitter cold…",
				contentParts: [
					{
						text: "不经一番寒彻骨，怎得梅花扑鼻香…",
						textEn:
							"How could plum blossoms smell so sweet without the bitter cold…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1nJWC6QEzy/",
					title: "以你的见解 如何理解这句话",
					titleEn: "What does this line mean to you?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1nJWC6QEzy.webp",
						alt: "以你的见解 如何理解这句话：视频封面",
						altEn: "Video cover: What does this line mean to you?",
					},
				},
			},
			{
				id: "bilibili-1271754316217057282",
				date: "2026-11-18T02:56:16+08:00",
				content: "给你了，我不考了，放我走吧",
				contentEn: "You can have it. I’m not taking the exam. Just let me go",
				contentParts: [
					{
						text: "给你了，我不考了，放我走吧",
						textEn: "You can have it. I’m not taking the exam. Just let me go",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1DfsA6dEJa/",
					title: "🥒兄弟兄弟我找到你的考研对手了🥒",
					titleEn:
						"🥒 Bro, I found your rival for the grad school entrance exam 🥒",
					poster: {
						src: "/assets/images/moments/bilibili-BV1DfsA6dEJa.webp",
						alt: "🥒兄弟兄弟我找到你的考研对手了🥒：视频封面",
						altEn:
							"Video cover: 🥒 Bro, I found your rival for the grad school entrance exam 🥒",
					},
				},
			},
			{
				id: "bilibili-1271687379148603399",
				date: "2026-11-17T22:36:31+08:00",
				content:
					"“要是你日后遇上比你娘子更好的女子怎么办？”\n“更好的女子自有更好的男子相配，与我何干？”...我喜欢你",
				contentEn:
					"“What if one day you meet a woman who’s better than your wife?”\n“A better woman will find a better man to match. What’s that to me?”…I like you",
				contentParts: [
					{
						text: "“要是你日后遇上比你娘子更好的女子怎么办？”\n“更好的女子自有更好的男子相配，与我何干？”",
						textEn:
							"“What if one day you meet a woman who’s better than your wife?”\n“A better woman will find a better man to match. What’s that to me?”",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "...我喜欢你",
						textEn: "…I like you",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1FrxC6sEB8/",
					title: "“爱你永远都不是选择题”",
					titleEn: "“Loving you was never a multiple-choice question”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1FrxC6sEB8.webp",
						alt: "“爱你永远都不是选择题”：视频封面",
						altEn:
							"Video cover: “Loving you was never a multiple-choice question”",
					},
				},
			},
			{
				id: "bilibili-1271581632718962695",
				date: "2026-11-17T15:46:10+08:00",
				content: "《文明6》",
				contentEn: "Civilization VI",
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1BBsG6wEvj/",
					title: "又是类魂…",
					titleEn: "Another Soulslike…",
					poster: {
						src: "/assets/images/moments/bilibili-BV1BBsG6wEvj.webp",
						alt: "又是类魂…：视频封面",
						altEn: "Video cover: Another Soulslike…",
					},
				},
			},
			{
				id: "bilibili-1271538743183933443",
				date: "2026-11-17T12:59:44+08:00",
				content: "好处说完了，坏处呢…？",
				contentEn: "Okay, that’s the upside. What’s the downside…?",
				contentParts: [
					{
						text: "好处说完了，坏处呢…？",
						textEn: "Okay, that’s the upside. What’s the downside…?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1KZsJ6YEay/",
					title: "百合看多了是会雌堕成南梁的",
					titleEn: "Watch enough yuri and you’ll turn into a femboy",
					poster: {
						src: "/assets/images/moments/bilibili-BV1KZsJ6YEay.webp",
						alt: "百合看多了是会雌堕成南梁的：视频封面",
						altEn:
							"Video cover: Watch enough yuri and you’ll turn into a femboy",
					},
				},
			},
			{
				id: "bilibili-1271329148772548633",
				date: "2026-11-16T23:26:24+08:00",
				content: "我找借口时be like：",
				contentEn: "Me coming up with an excuse: ",
				contentParts: [
					{
						text: "我找借口时be like：",
						textEn: "Me coming up with an excuse: ",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1MjWB6JE5G/",
					title: "一杆最多能连撞几颗球？",
					titleEn: "How many balls can you hit in a row with one shot?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1MjWB6JE5G.webp",
						alt: "一杆最多能连撞几颗球？：视频封面",
						altEn:
							"Video cover: How many balls can you hit in a row with one shot?",
					},
				},
			},
			{
				id: "bilibili-1271297185651097606",
				date: "2026-11-16T21:22:22+08:00",
				content: "我爱她，我爱…\n她是我的「伊德莉拉」…",
				contentEn: "I love her, I love…\nShe’s my Idrila…",
				contentParts: [
					{
						text: "我爱她，我爱…",
						textEn: "I love her, I love…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "\n她是我的「伊德莉拉」…",
						textEn: "\nShe’s my Idrila…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1M6sV6SEBJ/",
					title: "“陪伴你，是最长情的告白”",
					titleEn:
						"“Staying by your side is the most lasting declaration of love”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1M6sV6SEBJ.webp",
						alt: "“陪伴你，是最长情的告白”：视频封面",
						altEn:
							"Video cover: “Staying by your side is the most lasting declaration of love”",
					},
				},
			},
			{
				id: "bilibili-1270940080564863032",
				date: "2026-11-15T22:16:37+08:00",
				content: "第一步 申请2.4万兆内存",
				contentEn: "Step one: allocate 24,000 MB of memory",
				contentParts: [
					{
						text: "第一步 申请2.4万兆内存",
						textEn: "Step one: allocate 24,000 MB of memory",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1WStn6BEwS/",
					title: "新排序算法：许家印排序",
					titleEn: "A new sorting algorithm: Xu Jiayin sort",
					poster: {
						src: "/assets/images/moments/bilibili-BV1WStn6BEwS.webp",
						alt: "新排序算法：许家印排序：视频封面",
						altEn: "Video cover: A new sorting algorithm: Xu Jiayin sort",
					},
				},
			},
			{
				id: "bilibili-1270876918784196632",
				date: "2026-11-15T18:11:31+08:00",
				content:
					"一开始对这种司凤版我都是以一种鄙夷，嫌弃，唾弃的感觉去看了，可不知什么时候开始，我竟然生出了一种从未有过的感觉，像是重新回到子宫一般的包裹感，给予我安全，熟悉的呵护，有激起我对其他新的司凤音乐的寻找。现在我已经离不开这种风格的音乐了，自从听到这首歌开始我的灵魂才是真正的完整",
				contentEn:
					"At first I looked down on these Sifeng remixes. I couldn’t stand them. Then somewhere along the way I started feeling something I’d never felt before, like being wrapped up in the womb again. That familiar sense of safety and care sent me looking for more Sifeng songs. Now I can’t live without this kind of music. It was only when I heard this song that my soul finally felt whole",
				contentParts: [
					{
						text: "一开始对这种司凤版我都是以一种鄙夷，嫌弃，唾弃的感觉去看了，可不知什么时候开始，我竟然生出了一种从未有过的感觉，像是重新回到子宫一般的包裹感，给予我安全，熟悉的呵护，有激起我对其他新的司凤音乐的寻找。",
						textEn:
							"At first I looked down on these Sifeng remixes. I couldn’t stand them. Then somewhere along the way I started feeling something I’d never felt before, like being wrapped up in the womb again. That familiar sense of safety and care sent me looking for more Sifeng songs. ",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						text: "现在我已经离不开这种风格的音乐了，自从听到这首歌开始我的灵魂才是真正的完整",
						textEn:
							"Now I can’t live without this kind of music. It was only when I heard this song that my soul finally felt whole",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1oopb6KEBg/",
					title: "⚡我不曾司凤⚡",
					titleEn: "⚡ I Was Never Sifeng ⚡",
					poster: {
						src: "/assets/images/moments/bilibili-BV1oopb6KEBg.webp",
						alt: "⚡我不曾司凤⚡：视频封面",
						altEn: "Video cover: ⚡ I Was Never Sifeng ⚡",
					},
				},
			},
			{
				id: "bilibili-1270589314897543176",
				date: "2026-11-14T23:35:28+08:00",
				content:
					"真的有点吓人了......真的遇到这种就别结婚了吧，真的...自己幸福一点...",
				contentEn:
					"That’s actually a little scary...... If it’s really like that, maybe don’t get married. Seriously... give yourself a chance to be happy...",
				contentParts: [
					{
						text: "真的有点吓人了......真的遇到这种就别结婚了吧，真的...自己幸福一点...",
						textEn:
							"That’s actually a little scary...... If it’s really like that, maybe don’t get married. Seriously... give yourself a chance to be happy...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1c8xN6EEUD/",
					title: "长辈嘴里女生婚后生活belike",
					titleEn: "Married life for women, according to the older generation",
					poster: {
						src: "/assets/images/moments/bilibili-BV1c8xN6EEUD.webp",
						alt: "长辈嘴里女生婚后生活belike：视频封面",
						altEn:
							"Video cover: Married life for women, according to the older generation",
					},
				},
			},
			{
				id: "bilibili-1270490410408476678",
				date: "2026-11-14T17:11:40+08:00",
				content: "“雕栏玉砌应犹在，只是朱颜改”",
				contentEn:
					"“The carved railings and jade steps must still be there, though the youthful faces have changed.”",
				contentParts: [
					{
						text: "“雕栏玉砌应犹在，只是朱颜改”",
						textEn:
							"“The carved railings and jade steps must still be there, though the youthful faces have changed.”",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1HFWY6dEP6/",
					title: "再见 黄仁勋",
					titleEn: "Goodbye, Jensen Huang",
					poster: {
						src: "/assets/images/moments/bilibili-BV1HFWY6dEP6.webp",
						alt: "再见 黄仁勋：视频封面",
						altEn: "Video cover: Goodbye, Jensen Huang",
					},
				},
			},
			{
				id: "christmas-wish-nov18",
				date: "2026-11-18T19:24:56+11:00",
				content:
					"好想和你一起过圣诞 踩雪 戴互送的围巾喝热可可 做饼干 一直这样幸福地生活 就算冷也值得了",
				contentEn:
					"I want to spend Christmas with you, walking through the snow, wearing the scarves we gave each other, drinking hot cocoa and making cookies. If we could always live this happily, even the cold would be worth it.",
			},
			{
				id: "summer-regret-nov14",
				date: "2026-11-14T17:46:04+11:00",
				content: "夏天太有生命力了，连遗憾都肆意疯长……",
				contentEn: "Summer is so full of life that even regrets grow wild……",
			},
			{
				id: "pure-love-frustration-nov15",
				date: "2026-11-15T19:39:28+11:00",
				content:
					"我恨这个世界所有不搞纯爱的傻B。一谈恋爱被你们谈的像上厕所一样随便，把原本单纯善良的人都变得不敢轻易尝试恋爱，在这个社会搞纯爱的我像他妈叶问赤手空拳去参加二战一样搞笑。",
				contentEn:
					"I hate all the idiots in this world who refuse to take sincere love seriously. You treat falling in love as casually as going to the bathroom, making people who were once simple and kind afraid to even try a relationship. Trying to love purely in this society makes me look as fucking ridiculous as Ip Man entering World War II bare-handed.",
			},
			{
				id: "love-needs-no-conditions-nov15",
				date: "2026-11-15T22:43:39+11:00",
				content: "∵这题没有条件\n∴喜欢你无需条件.",
				contentEn:
					"∵ This problem has no conditions\n∴ Liking you needs no conditions.",
				images: [
					{
						src: "/assets/images/moments/love-without-conditions-nov15.webp",
						fit: "contain",
						width: 2000,
						height: 1500,
						alt: "手写几何图案与“Love = 520°、I love you”字样",
						altEn:
							"A handwritten geometry sketch with “Love = 520°” and “I love you.”",
					},
				],
			},
			{
				id: "bilibili-1270486635114397731",
				date: "2026-11-14T16:57:01+08:00",
				content: "依旧句句不提，依旧句句不离",
				contentEn:
					"Still never saying it outright, yet never talking about anything else",
				contentParts: [
					{
						text: "依旧句句不提，依旧句句不离",
						textEn:
							"Still never saying it outright, yet never talking about anything else",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1r8WB6zEdP/",
					title: "当管理者是一群精神变态，人口锐减成为了发展必然。",
					titleEn:
						"When the people in charge are psychopaths, population decline becomes inevitable.",
					poster: {
						src: "/assets/images/moments/bilibili-BV1r8WB6zEdP.webp",
						alt: "当管理者是一群精神变态，人口锐减成为了发展必然。：视频封面",
						altEn:
							"Video cover: When the people in charge are psychopaths, population decline becomes inevitable.",
					},
				},
			},
			{
				id: "bilibili-1270474506137239560",
				date: "2026-11-14T16:09:57+08:00",
				content: "不用暧昧了，孩子直接叫哈基维利吧",
				contentEn:
					"No need for ambiguity anymore. The kids can just call him Hakivelli",
				contentParts: [
					{
						text: "不用暧昧了，孩子直接叫哈基维利吧",
						textEn:
							"No need for ambiguity anymore. The kids can just call him Hakivelli",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1kXWD6GEq2/",
					title: "好像有点暧昧了",
					titleEn: "This seems a little romantic",
					poster: {
						src: "/assets/images/moments/bilibili-BV1kXWD6GEq2.webp",
						alt: "好像有点暧昧了：视频封面",
						altEn: "Video cover: This seems a little romantic",
					},
				},
			},
			{
				id: "bilibili-1270253044698710053",
				date: "2026-11-14T01:50:34+08:00",
				content: "就许愿😭就许愿😭就许愿😭",
				contentEn: "Just wishing 😭 Just wishing 😭 Just wishing 😭",
				contentParts: [
					{
						text: "就许愿😭就许愿😭就许愿😭",
						textEn: "Just wishing 😭 Just wishing 😭 Just wishing 😭",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1gPWo6gE1R/",
					title: "在Vibe Coding时候能不能别纯许愿…",
					titleEn: "Could we stop treating Vibe Coding as pure wish-making…",
					poster: {
						src: "/assets/images/moments/bilibili-BV1gPWo6gE1R.webp",
						alt: "在Vibe Coding时候能不能别纯许愿…：视频封面",
						altEn:
							"Video cover: Could we stop treating Vibe Coding as pure wish-making…",
					},
				},
			},
			{
				id: "bilibili-1270236260026286082",
				date: "2026-11-14T00:45:26+08:00",
				content:
					"这就是漂泊的终点呀…岸宝谢谢你…我永远爱你…所以挚友是什么意思呢…爱你一遍又一遍啦",
				contentEn:
					"So this is where the journey ends…Thank you, Shorekeeper…I will always love you…So what exactly does “dearest friend” mean…Loving you over and over again",
				contentParts: [
					{
						text: "这就是漂泊的终点呀…",
						textEn: "So this is where the journey ends…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						text: "岸宝谢谢你…",
						textEn: "Thank you, Shorekeeper…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "我永远爱你…",
						textEn: "I will always love you…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "所以挚友是什么意思呢…",
						textEn: "So what exactly does “dearest friend” mean…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-87f8d3511a71e47b14e63a5b5a39cff85c4a48e1.webp",
							alt: "[鸣潮·致予新世界动态表情包_拜托拜托！]",
							altEn: "Please, please!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-87f8d3511a71e47b14e63a5b5a39cff85c4a48e1.webp",
							alt: "[鸣潮·致予新世界动态表情包_拜托拜托！]",
							altEn: "Please, please!",
						},
					},
					{
						text: "爱你一遍又一遍啦",
						textEn: "Loving you over and over again",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1XTWB6sE2U/",
					title: "【大鸣王潮1566】爱你一遍又一遍",
					titleEn:
						"[The Great Wuthering Dynasty 1566] Loving you again and again",
					poster: {
						src: "/assets/images/moments/bilibili-BV1XTWB6sE2U.webp",
						alt: "【大鸣王潮1566】爱你一遍又一遍：视频封面",
						altEn:
							"Video cover: [The Great Wuthering Dynasty 1566] Loving you again and again",
					},
				},
			},
			{
				id: "bilibili-1270215927644815382",
				date: "2026-11-13T23:26:32+08:00",
				content: "甜甜甜甜!",
				contentEn: "So, so, so sweet!",
				contentParts: [
					{
						text: "甜甜甜甜!",
						textEn: "So, so, so sweet!",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0d607209dee106aa4df6904c11ac3cdd9d70c26f.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_捏捏]",
							altEn: "Squish",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0d607209dee106aa4df6904c11ac3cdd9d70c26f.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_捏捏]",
							altEn: "Squish",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0d607209dee106aa4df6904c11ac3cdd9d70c26f.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_捏捏]",
							altEn: "Squish",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1rzWy6oEo2/",
					title: "【星穹铁道】如何召唤阿哈",
					titleEn: "[Honkai: Star Rail] How to summon Aha",
					poster: {
						src: "/assets/images/moments/bilibili-BV1rzWy6oEo2.webp",
						alt: "【星穹铁道】如何召唤阿哈：视频封面",
						altEn: "Video cover: [Honkai: Star Rail] How to summon Aha",
					},
				},
			},
			{
				id: "bilibili-1270214317020545041",
				date: "2026-11-13T23:20:17+08:00",
				content: "正常来说这是三创音乐，但是你不能创死我啊……",
				contentEn:
					"Normally this would be a third-generation remix, but you can't remix me into the grave……",
				contentParts: [
					{
						text: "正常来说这是三创音乐，但是你不能创死我啊……",
						textEn:
							"Normally this would be a third-generation remix, but you can't remix me into the grave……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-be882665ddea29ce845459f160fbc988aa8609be.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_大手]",
							altEn: "Big hands",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-be882665ddea29ce845459f160fbc988aa8609be.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_大手]",
							altEn: "Big hands",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-be882665ddea29ce845459f160fbc988aa8609be.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_大手]",
							altEn: "Big hands",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1eDp16LELi/",
					title: "《肘我》司凤版丨转发给你喜欢仇远的朋友并什么也不说",
					titleEn:
						"“Elbow Me,” Sifeng version: share it with your friend who likes Qiuyuan and say nothing",
					poster: {
						src: "/assets/images/moments/bilibili-BV1eDp16LELi.webp",
						alt: "《肘我》司凤版丨转发给你喜欢仇远的朋友并什么也不说：视频封面",
						altEn:
							"Video cover: “Elbow Me,” Sifeng version: share it with your friend who likes Qiuyuan and say nothing",
					},
				},
			},
			{
				id: "bilibili-1270195827191578629",
				date: "2026-11-13T22:08:32+08:00",
				content: "对的对的对的，99",
				contentEn: "Yes, yes, yes—may you stay together forever",
				contentParts: [
					{
						text: "对的对的对的，99",
						textEn: "Yes, yes, yes—may you stay together forever",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1QJW96aEYu/",
					title: "根本不可能有这样的阿哈！",
					titleEn: "There is no way Aha would be like this!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1QJW96aEYu.webp",
						alt: "根本不可能有这样的阿哈！：视频封面",
						altEn: "Video cover: There is no way Aha would be like this!",
					},
				},
			},
			{
				id: "bilibili-1270192696134205457",
				date: "2026-11-13T21:56:23+08:00",
				content: "看完这个视频，怎么感觉脑袋都轻了不少……",
				contentEn:
					"Why does my head feel so much lighter after watching this……",
				contentParts: [
					{
						text: "看完这个视频，怎么感觉脑袋都轻了不少……",
						textEn:
							"Why does my head feel so much lighter after watching this……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1MYxm6jEKv/",
					title: "决战智力之巅😄",
					titleEn: "A showdown at the peak of intelligence 😄",
					poster: {
						src: "/assets/images/moments/bilibili-BV1MYxm6jEKv.webp",
						alt: "决战智力之巅😄：视频封面",
						altEn: "Video cover: A showdown at the peak of intelligence 😄",
					},
				},
			},
			{
				id: "bilibili-1270188929447886889",
				date: "2026-11-13T21:41:46+08:00",
				content: "气笑了…\n我将立即行动",
				contentEn:
					"I'm laughing out of sheer exasperation…\nI shall act immediately",
				contentParts: [
					{
						text: "气笑了…",
						textEn: "I'm laughing out of sheer exasperation…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						text: "\n我将立即行动",
						textEn: "\nI shall act immediately",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-174f78bd569805a883dc738e3cb8492c5d5526d7.webp",
							alt: "[鸣潮·致予新世界动态表情包_知道啦~]",
							altEn: "Got it",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-174f78bd569805a883dc738e3cb8492c5d5526d7.webp",
							alt: "[鸣潮·致予新世界动态表情包_知道啦~]",
							altEn: "Got it",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1tsWQ6nEPu/",
					title: "“表白神曲”《我只对你没感觉》适合转发给对象或好友！",
					titleEn:
						"The “confession anthem” No Feelings for You: perfect for sending to your partner or friends!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1tsWQ6nEPu.webp",
						alt: "“表白神曲”《我只对你没感觉》适合转发给对象或好友！：视频封面",
						altEn:
							"Video cover: The “confession anthem” No Feelings for You: perfect for sending to your partner or friends!",
					},
				},
			},
			{
				id: "bilibili-1270154131612368903",
				date: "2026-11-13T19:26:44+08:00",
				content: "神作啊",
				contentEn: "A masterpiece",
				contentParts: [
					{
						text: "神作啊",
						textEn: "A masterpiece",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1fpWX66E7b/",
					title: "“别把我留在没有你的地狱”",
					titleEn: "“Don't leave me in a hell without you”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1fpWX66E7b.webp",
						alt: "“别把我留在没有你的地狱”：视频封面",
						altEn: "Video cover: “Don't leave me in a hell without you”",
					},
				},
			},
			{
				id: "bilibili-1270136698356891665",
				date: "2026-11-13T18:19:05+08:00",
				content: "我tm犯天条了吗？两个刀子一起吃……",
				contentEn:
					"What heavenly law did I break? Two emotional knives at once……",
				contentParts: [
					{
						text: "我tm犯天条了吗？两个刀子一起吃……",
						textEn:
							"What heavenly law did I break? Two emotional knives at once……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1k9WD6rEhg/",
					title: "《崩坏三》动画短片：「你好，世界」",
					titleEn: "Honkai Impact 3rd animated short: Hello, World",
					poster: {
						src: "/assets/images/moments/bilibili-BV1k9WD6rEhg.webp",
						alt: "《崩坏三》动画短片：「你好，世界」：视频封面",
						altEn:
							"Video cover: Honkai Impact 3rd animated short: Hello, World",
					},
				},
			},
			{
				id: "bilibili-1270118002377883649",
				date: "2026-11-13T17:06:32+08:00",
				content: "这野史哪里野了…？正的很啊\n依旧想看什么自己剪",
				contentEn:
					"What's so unofficial about this version of history…? It seems perfectly legitimate\nAs always, edit whatever you want to see yourself",
				contentParts: [
					{
						text: "这野史哪里野了…？正的很啊",
						textEn:
							"What's so unofficial about this version of history…? It seems perfectly legitimate",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						text: "\n依旧想看什么自己剪",
						textEn: "\nAs always, edit whatever you want to see yourself",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV19hWX6NECh/",
					title: "流萤:布兑!剧本不是这样的Σ(ﾟДﾟ)",
					titleEn: "Firefly: Wait! This isn't how the script goes Σ(ﾟДﾟ)",
					poster: {
						src: "/assets/images/moments/bilibili-BV19hWX6NECh.webp",
						alt: "流萤:布兑!剧本不是这样的Σ(ﾟДﾟ)：视频封面",
						altEn:
							"Video cover: Firefly: Wait! This isn't how the script goes Σ(ﾟДﾟ)",
					},
				},
			},
			{
				id: "bilibili-1270112333009518613",
				date: "2026-11-13T16:44:32+08:00",
				content: "能想出这个视频的，家里真得请高人了……",
				contentEn:
					"Whoever dreamed up this video really needs an exorcist at home……",
				contentParts: [
					{
						text: "能想出这个视频的，家里真得请高人了……",
						textEn:
							"Whoever dreamed up this video really needs an exorcist at home……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1zFW96LEU2/",
					title: "⚡️蛋载派对《蛋载之爱》⚡️",
					titleEn: "⚡ Eggy Party: Eggy Love ⚡",
					poster: {
						src: "/assets/images/moments/bilibili-BV1zFW96LEU2.webp",
						alt: "⚡️蛋载派对《蛋载之爱》⚡️：视频封面",
						altEn: "Video cover: ⚡ Eggy Party: Eggy Love ⚡",
					},
				},
			},
			{
				id: "bilibili-1270111817645948965",
				date: "2026-11-13T16:42:32+08:00",
				content: "再度和你",
				contentEn: "With you once more",
				contentParts: [
					{
						text: "再度和你",
						textEn: "With you once more",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1SeWU62Emq/",
					title: "【崩铁动画】一同迈向明天",
					titleEn: "[Star Rail Animation] Toward Tomorrow Together",
					poster: {
						src: "/assets/images/moments/bilibili-BV1SeWU62Emq.webp",
						alt: "【崩铁动画】一同迈向明天：视频封面",
						altEn:
							"Video cover: [Star Rail Animation] Toward Tomorrow Together",
					},
				},
			},
			{
				id: "bilibili-1269896983359782917",
				date: "2026-11-13T02:48:52+08:00",
				content: "简单，社会存在决定社会意识…\n",
				contentEn:
					"Simple: social existence determines social consciousness…\n",
				contentParts: [
					{
						text: "简单，社会存在决定社会意识…",
						textEn: "Simple: social existence determines social consciousness…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						text: "\n",
						textEn: "\n",
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1piKH6SEG2/",
					title: "为什么很多描写女性的词都会被污名化？",
					titleEn: "Why do so many words describing women become stigmatized?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1piKH6SEG2.webp",
						alt: "为什么很多描写女性的词都会被污名化？：视频封面",
						altEn:
							"Video cover: Why do so many words describing women become stigmatized?",
					},
				},
			},
			{
				id: "bilibili-1269884356118183940",
				date: "2026-11-13T01:59:52+08:00",
				content: "呵呵，可这就是这片土地的文化底色……",
				contentEn: "Heh, but this is the cultural foundation of this land……",
				contentParts: [
					{
						text: "呵呵，可这就是这片土地的文化底色……",
						textEn: "Heh, but this is the cultural foundation of this land……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1FuHV6cEkZ/",
					title: "击鼓传花，原来是很多人童年焦虑的起点",
					titleEn:
						"Pass the parcel: where many people's childhood anxiety began",
					poster: {
						src: "/assets/images/moments/bilibili-BV1FuHV6cEkZ.webp",
						alt: "击鼓传花，原来是很多人童年焦虑的起点：视频封面",
						altEn:
							"Video cover: Pass the parcel: where many people's childhood anxiety began",
					},
				},
			},
			{
				id: "bilibili-1269878807026728965",
				date: "2026-11-13T01:38:20+08:00",
				content:
					"老一辈见过饿死的，没见过睡不够猝死的，而我们见过猝死的，没见过饿死的……更何况，从根本而言，老一辈只是想让你听话而已……呵呵",
				contentEn:
					"The older generation saw people starve, not people die from too little sleep; we've seen people die from exhaustion, not from starvation……Besides, at the heart of it, the older generation simply wants you to obey…… heh",
				contentParts: [
					{
						text: "老一辈见过饿死的，没见过睡不够猝死的，而我们见过猝死的，没见过饿死的……",
						textEn:
							"The older generation saw people starve, not people die from too little sleep; we've seen people die from exhaustion, not from starvation……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "更何况，从根本而言，老一辈只是想让你听话而已……呵呵",
						textEn:
							"Besides, at the heart of it, the older generation simply wants you to obey…… heh",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-346deace16b660643b67da13d98202e2ed6d83a8.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊...我吗？]",
							altEn: "Huh... me?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-346deace16b660643b67da13d98202e2ed6d83a8.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊...我吗？]",
							altEn: "Huh... me?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-174f78bd569805a883dc738e3cb8492c5d5526d7.webp",
							alt: "[鸣潮·致予新世界动态表情包_知道啦~]",
							altEn: "Got it",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Yan36kEDX/",
					title: "老一辈为什么 对你睡懒觉有这么大执念",
					titleEn: "Why are older people so obsessed with you sleeping in?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Yan36kEDX.webp",
						alt: "老一辈为什么 对你睡懒觉有这么大执念：视频封面",
						altEn:
							"Video cover: Why are older people so obsessed with you sleeping in?",
					},
				},
			},
			{
				id: "bilibili-1269873184960675846",
				date: "2026-11-13T01:16:31+08:00",
				content: "我真得发明时光机了",
				contentEn: "I really need to invent a time machine",
				contentParts: [
					{
						text: "我真得发明时光机了",
						textEn: "I really need to invent a time machine",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1gkxd6GEeR/",
					title: "挑战在澳洲第一大学穿奶蛙放雨爱不被发现",
					titleEn:
						"Trying to wear a frog costume and play Rainy Love at Australia's top university without being noticed",
					poster: {
						src: "/assets/images/moments/bilibili-BV1gkxd6GEeR.webp",
						alt: "挑战在澳洲第一大学穿奶蛙放雨爱不被发现：视频封面",
						altEn:
							"Video cover: Trying to wear a frog costume and play Rainy Love at Australia's top university without being noticed",
					},
				},
			},
			{
				id: "bilibili-1269862537737797637",
				date: "2026-11-13T00:35:12+08:00",
				content: "这说的是人话吗…？这话也太糙了……",
				contentEn:
					"Is this something a human would say…?That is far too coarse……",
				contentParts: [
					{
						text: "这说的是人话吗…？",
						textEn: "Is this something a human would say…?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-87f8d3511a71e47b14e63a5b5a39cff85c4a48e1.webp",
							alt: "[鸣潮·致予新世界动态表情包_拜托拜托！]",
							altEn: "Please, please!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-87f8d3511a71e47b14e63a5b5a39cff85c4a48e1.webp",
							alt: "[鸣潮·致予新世界动态表情包_拜托拜托！]",
							altEn: "Please, please!",
						},
					},
					{
						text: "这话也太糙了……",
						textEn: "That is far too coarse……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1nxW16xEzN/",
					title: "【天空岛TV】判罚之钉是尼伯龙根的格调",
					titleEn: "[Celestia TV] The Nail of Judgment is Nibelung's style",
					poster: {
						src: "/assets/images/moments/bilibili-BV1nxW16xEzN.webp",
						alt: "【天空岛TV】判罚之钉是尼伯龙根的格调：视频封面",
						altEn:
							"Video cover: [Celestia TV] The Nail of Judgment is Nibelung's style",
					},
				},
			},
			{
				id: "bilibili-1269819819958468630",
				date: "2026-11-12T21:49:26+08:00",
				content:
					"我觉得这个已经不能叫享福TV了，应该叫抽卡TV抽到SSR就赢了……然后依旧认为给口饭就叫养育之恩了，哈哈，还是那句话，对自己负责，对孩子负责，对社会负责，养不起就别生",
				contentEn:
					"I don't think this can be called Good-Life TV anymore. It should be Gacha TVPull an SSR and you win……And they still think providing a mouthful of food deserves a lifetime debt of gratitude. Ha. As I keep saying: be responsible to yourself, to your children, and to society. If you can't afford to raise children, don't have them",
				contentParts: [
					{
						text: "我觉得这个已经不能叫享福TV了，应该叫抽卡TV",
						textEn:
							"I don't think this can be called Good-Life TV anymore. It should be Gacha TV",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						text: "抽到SSR就赢了……",
						textEn: "Pull an SSR and you win……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						text: "然后依旧认为给口饭就叫养育之恩了，哈哈，还是那句话，对自己负责，对孩子负责，对社会负责，养不起就别生",
						textEn:
							"And they still think providing a mouthful of food deserves a lifetime debt of gratitude. Ha. As I keep saying: be responsible to yourself, to your children, and to society. If you can't afford to raise children, don't have them",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1qUWy6DE1r/",
					title: "【享福TV】依旧多子多福，依旧人丁兴旺",
					titleEn:
						"[Good-Life TV] Still more children, more blessings, and a flourishing family",
					poster: {
						src: "/assets/images/moments/bilibili-BV1qUWy6DE1r.webp",
						alt: "【享福TV】依旧多子多福，依旧人丁兴旺：视频封面",
						altEn:
							"Video cover: [Good-Life TV] Still more children, more blessings, and a flourishing family",
					},
				},
			},
			{
				id: "bilibili-1269803099681193987",
				date: "2026-11-12T20:44:33+08:00",
				content:
					"有点吓人了，国内压力这么大吗……？国内的朋友们，你们一定要好好的呀",
				contentEn:
					"This is a little frightening. Is the pressure back home really this intense……?Friends back home, please take good care of yourselves",
				contentParts: [
					{
						text: "有点吓人了，国内压力这么大吗……？",
						textEn:
							"This is a little frightening. Is the pressure back home really this intense……?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "国内的朋友们，你们一定要好好的呀",
						textEn: "Friends back home, please take good care of yourselves",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1LX4J6XE5H/",
					title: "《关于室友考研破防了这件事》",
					titleEn:
						"My roommate's breakdown over the postgraduate entrance exam",
					poster: {
						src: "/assets/images/moments/bilibili-BV1LX4J6XE5H.webp",
						alt: "《关于室友考研破防了这件事》：视频封面",
						altEn:
							"Video cover: My roommate's breakdown over the postgraduate entrance exam",
					},
				},
			},
			{
				id: "bilibili-1269746277229264904",
				date: "2026-11-12T17:04:03+08:00",
				content:
					"“我说话刻薄吗？只是实话实说罢了，接受不了的人才应该自己反思原因…”",
				contentEn:
					"“Am I being harsh? I'm only telling the truth. Those who can't accept it should reflect on their own reasons…”",
				contentParts: [
					{
						text: "“我说话刻薄吗？只是实话实说罢了，接受不了的人才应该自己反思原因…”",
						textEn:
							"“Am I being harsh? I'm only telling the truth. Those who can't accept it should reflect on their own reasons…”",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV18yGt6FE9L/",
					title: "你因为外貌追求我，我因为外貌拒绝你，刻薄在哪？",
					titleEn:
						"You pursue me for my looks; I reject you for yours. Where is the cruelty?",
					poster: {
						src: "/assets/images/moments/bilibili-BV18yGt6FE9L.webp",
						alt: "你因为外貌追求我，我因为外貌拒绝你，刻薄在哪？：视频封面",
						altEn:
							"Video cover: You pursue me for my looks; I reject you for yours. Where is the cruelty?",
					},
				},
			},
			{
				id: "bilibili-1269744739641458694",
				date: "2026-11-12T16:58:05+08:00",
				content: "别笑，老一辈觉得这种生活可有烟火气了😋😋",
				contentEn:
					"Don't laugh—the older generation thinks this kind of life is wonderfully down-to-earth 😋😋",
				contentParts: [
					{
						text: "别笑，老一辈觉得这种生活可有烟火气了😋😋",
						textEn:
							"Don't laugh—the older generation thinks this kind of life is wonderfully down-to-earth 😋😋",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1khW76EEax/",
					title: "【智人TV】下班看到这一幕，悬着的心可以死了，力工日常",
					titleEn:
						"[Homo Sapiens TV] Coming home from manual work to this: the suspense can finally kill you",
					poster: {
						src: "/assets/images/moments/bilibili-BV1khW76EEax.webp",
						alt: "【智人TV】下班看到这一幕，悬着的心可以死了，力工日常：视频封面",
						altEn:
							"Video cover: [Homo Sapiens TV] Coming home from manual work to this: the suspense can finally kill you",
					},
				},
			},
			{
				id: "bilibili-1269715241791389697",
				date: "2026-11-12T15:03:37+08:00",
				content: "原神玩家们，我们不打顺风局，咱们改日再战",
				contentEn:
					"Genshin players, we don't fight easy victories. Let's come back another day",
				contentParts: [
					{
						text: "原神玩家们，我们不打顺风局，咱们改日再战",
						textEn:
							"Genshin players, we don't fight easy victories. Let's come back another day",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4a5d1412fba5336c1273ec0e0f07dba7747a9a4c.webp",
							alt: "[鸣潮·致予新世界动态表情包_交给我吧！]",
							altEn: "Leave it to me!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4a5d1412fba5336c1273ec0e0f07dba7747a9a4c.webp",
							alt: "[鸣潮·致予新世界动态表情包_交给我吧！]",
							altEn: "Leave it to me!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4a5d1412fba5336c1273ec0e0f07dba7747a9a4c.webp",
							alt: "[鸣潮·致予新世界动态表情包_交给我吧！]",
							altEn: "Leave it to me!",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV14VWV65EL8/",
					title: "难绷tv原神蕴藏着宇宙级真相",
					titleEn:
						"Can't-Keep-a-Straight-Face TV: Genshin contains cosmic truths",
					poster: {
						src: "/assets/images/moments/bilibili-BV14VWV65EL8.webp",
						alt: "难绷tv原神蕴藏着宇宙级真相：视频封面",
						altEn:
							"Video cover: Can't-Keep-a-Straight-Face TV: Genshin contains cosmic truths",
					},
				},
			},
			{
				id: "bilibili-1269708880986767392",
				date: "2026-11-12T14:38:56+08:00",
				content: "？？",
				contentEn: "??",
				contentParts: [
					{
						text: "？？",
						textEn: "??",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1HJW168E9n/",
					title: "和爱弥斯谈恋爱的好处！",
					titleEn: "The perks of dating Aemeath!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1HJW168E9n.webp",
						alt: "和爱弥斯谈恋爱的好处！：视频封面",
						altEn: "Video cover: The perks of dating Aemeath!",
					},
				},
			},
			{
				id: "bilibili-1269491680165232646",
				date: "2026-11-12T00:36:05+08:00",
				content: "这是……梦想啊……",
				contentEn: "This is…… the dream……",
				contentParts: [
					{
						text: "这是……梦想啊……",
						textEn: "This is…… the dream……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-9533d4d827199227a205247bf7b9526ea8ae7de2.webp",
							alt: "[鸣潮·致予新世界动态表情包_摸摸头]",
							altEn: "Head pats",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-9533d4d827199227a205247bf7b9526ea8ae7de2.webp",
							alt: "[鸣潮·致予新世界动态表情包_摸摸头]",
							altEn: "Head pats",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-9533d4d827199227a205247bf7b9526ea8ae7de2.webp",
							alt: "[鸣潮·致予新世界动态表情包_摸摸头]",
							altEn: "Head pats",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1TyWT6fEAe/",
					title: "两个人都干净又纯粹着相爱的恋爱",
					titleEn:
						"A love between two people who are both sincere and untainted",
					poster: {
						src: "/assets/images/moments/bilibili-BV1TyWT6fEAe.webp",
						alt: "两个人都干净又纯粹着相爱的恋爱：视频封面",
						altEn:
							"Video cover: A love between two people who are both sincere and untainted",
					},
				},
			},
			{
				id: "bilibili-1269328080595320837",
				date: "2026-11-11T14:01:14+08:00",
				content:
					"我们一般管这种叫老不死的……我一般上去就是一脚，然后反手就是一拳，管你是谁呢呵呵",
				contentEn:
					"We usually call people like this old bastards…… I'd normally go straight in with a kick and then a punch. I don't care who you are, heh",
				contentParts: [
					{
						text: "我们一般管这种叫老不死的……我一般上去就是一脚，然后反手就是一拳，管你是谁呢呵呵",
						textEn:
							"We usually call people like this old bastards…… I'd normally go straight in with a kick and then a punch. I don't care who you are, heh",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-da70f8576272fcedaefb7e0cb3628b32327d6aa9.webp",
							alt: "[鸣潮·致予新世界动态表情包_姐有的是钱]",
							altEn: "I've got the money",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-da70f8576272fcedaefb7e0cb3628b32327d6aa9.webp",
							alt: "[鸣潮·致予新世界动态表情包_姐有的是钱]",
							altEn: "I've got the money",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1g34w6ZEbd/",
					title:
						"为什么有的长辈一吵架就喜欢给小辈儿跪下磕头？  #科普  #涨知识  #每天跟我涨知识",
					titleEn:
						"Why do some elders kneel and kowtow to younger relatives during arguments? #Science #LearnSomethingNew",
					poster: {
						src: "/assets/images/moments/bilibili-BV1g34w6ZEbd.webp",
						alt: "为什么有的长辈一吵架就喜欢给小辈儿跪下磕头？  #科普  #涨知识  #每天跟我涨知识：视频封面",
						altEn:
							"Video cover: Why do some elders kneel and kowtow to younger relatives during arguments? #Science #LearnSomethingNew",
					},
				},
			},
			{
				id: "bilibili-1269124516333748229",
				date: "2026-11-11T00:51:18+08:00",
				content: "我的生日怎么突然就不快乐了\n下次朋友过生日就给她放这首歌好吧",
				contentEn:
					"Why has my birthday suddenly become so unhappy?\nI'll play this for her next time a friend has a birthday",
				contentParts: [
					{
						text: "我的生日怎么突然就不快乐了",
						textEn: "Why has my birthday suddenly become so unhappy?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						text: "\n下次朋友过生日就给她放这首歌好吧",
						textEn:
							"\nI'll play this for her next time a friend has a birthday",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1bin86XEMg/",
					title: '《祝你生日快乐》| 司凤版⚡"一年中最通透的一天"⚡',
					titleEn:
						"Happy Birthday, Sifeng version: “the clearest day of the year”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1bin86XEMg.webp",
						alt: '《祝你生日快乐》| 司凤版⚡"一年中最通透的一天"⚡：视频封面',
						altEn:
							"Video cover: Happy Birthday, Sifeng version: “the clearest day of the year”",
					},
				},
			},
			{
				id: "bilibili-1269107203271294995",
				date: "2026-11-10T23:44:07+08:00",
				content: "我爱你！！😘😘",
				contentEn: "I love you!! 😘😘",
				contentParts: [
					{
						text: "我爱你！！😘😘",
						textEn: "I love you!! 😘😘",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1i24P6rEmt/",
					title: "大家好，这里是 DeepSeek Harness，正式入驻 B 站！",
					titleEn:
						"Hello, this is DeepSeek Harness. We are officially on Bilibili!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1i24P6rEmt.webp",
						alt: "大家好，这里是 DeepSeek Harness，正式入驻 B 站！：视频封面",
						altEn:
							"Video cover: Hello, this is DeepSeek Harness. We are officially on Bilibili!",
					},
				},
			},
			{
				id: "bilibili-1269056204832768003",
				date: "2026-11-10T20:26:13+08:00",
				content:
					"天呐……太心酸了……这个地方只有生存，没有生活……不多说，我会带着我的我的伊德莉拉一起来国外的……",
				contentEn:
					"Oh, this is so heartbreaking……There is only survival here, no living……I won't say more. I'll bring my, my Idrila abroad with me……",
				contentParts: [
					{
						text: "天呐……太心酸了……",
						textEn: "Oh, this is so heartbreaking……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "这个地方只有生存，没有生活……",
						textEn: "There is only survival here, no living……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-346deace16b660643b67da13d98202e2ed6d83a8.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊...我吗？]",
							altEn: "Huh... me?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-346deace16b660643b67da13d98202e2ed6d83a8.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊...我吗？]",
							altEn: "Huh... me?",
						},
					},
					{
						text: "不多说，我会带着我的我的伊德莉拉一起来国外的……",
						textEn:
							"I won't say more. I'll bring my, my Idrila abroad with me……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1pn8E6iEPD/",
					title:
						"农民自杀、工人跳楼、骑手崩溃——中国工农阶层的心理健康问题/  中国百业013",
					titleEn:
						"Farmer suicides, workers jumping, delivery riders breaking down: mental health among China's workers and farmers / China's Trades 013",
					poster: {
						src: "/assets/images/moments/bilibili-BV1pn8E6iEPD.webp",
						alt: "农民自杀、工人跳楼、骑手崩溃——中国工农阶层的心理健康问题/  中国百业013：视频封面",
						altEn:
							"Video cover: Farmer suicides, workers jumping, delivery riders breaking down: mental health among China's workers and farmers / China's Trades 013",
					},
				},
			},
			{
				id: "bilibili-1269055126790733828",
				date: "2026-11-10T20:22:02+08:00",
				content: "雀食雀食",
				contentEn: "Exactly, exactly",
				contentParts: [
					{
						text: "雀食雀食",
						textEn: "Exactly, exactly",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-2dacb2fd47c53ee201539c79ee1e296ccc643d05.webp",
							alt: "[鸣潮·致予新世界动态表情包_为你打call]",
							altEn: "Cheering for you",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1VMTx6EEUj/",
					title: "只因年轻人不愿做笠公，老笠公就破防了",
					titleEn:
						"Young people don't want to be husbands, and the older husbands lose it",
					poster: {
						src: "/assets/images/moments/bilibili-BV1VMTx6EEUj.webp",
						alt: "只因年轻人不愿做笠公，老笠公就破防了：视频封面",
						altEn:
							"Video cover: Young people don't want to be husbands, and the older husbands lose it",
					},
				},
			},
			{
				id: "bilibili-1268774300356182016",
				date: "2026-11-10T02:12:17+08:00",
				content: "依旧尘世七执政，依旧竹林七贤，依旧战国七雄",
				contentEn:
					"Still the Seven of Teyvat, still the Seven Sages of the Bamboo Grove, still the Seven Warring States",
				contentParts: [
					{
						text: "依旧尘世七执政，依旧竹林七贤，依旧战国七雄",
						textEn:
							"Still the Seven of Teyvat, still the Seven Sages of the Bamboo Grove, still the Seven Warring States",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1XVaN6DEKm/",
					title: "火遍全球以后，“黑人抬棺”的他们后来怎么样了？",
					titleEn:
						"What happened to the Ghanaian pallbearers after they became famous worldwide?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1XVaN6DEKm.webp",
						alt: "火遍全球以后，“黑人抬棺”的他们后来怎么样了？：视频封面",
						altEn:
							"Video cover: What happened to the Ghanaian pallbearers after they became famous worldwide?",
					},
				},
			},
			{
				id: "bilibili-1268770696869183491",
				date: "2026-11-10T01:58:18+08:00",
				content: "那“现代”中国确实很进步了，那进步确实很大了",
				contentEn:
					"Well, “modern” China really has progressed. What enormous progress indeed",
				contentParts: [
					{
						text: "那“现代”中国确实很进步了，那进步确实很大了",
						textEn:
							"Well, “modern” China really has progressed. What enormous progress indeed",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Ty4t6cEB9/",
					title: "有伄戼问，为什么古代要给丫鬟小厮发工资呢？",
					titleEn: "Why were maids and servants paid wages in ancient times?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Ty4t6cEB9.webp",
						alt: "有伄戼问，为什么古代要给丫鬟小厮发工资呢？：视频封面",
						altEn:
							"Video cover: Why were maids and servants paid wages in ancient times?",
					},
				},
			},
			{
				id: "bilibili-1268755015964557320",
				date: "2026-11-10T00:57:27+08:00",
				content:
					"唉……真的很辛酸呀现在国内就业情况过度饱和的人口与巨大的竞争压力……唉，这也是我为何希望，可以带着我喜欢的女孩一起来国外生活呀……国内太累了真的不想在国内被饿死……实在太累了呀……",
				contentEn:
					"Sigh…… the employment situation back home really is so painfulAn oversaturated population and enormous competitive pressure……Sigh, that's also why I hope I can bring the girl I like abroad with me…… it's too exhausting back homeI really don't want to starve back home……It's just too exhausting……",
				contentParts: [
					{
						text: "唉……真的很辛酸呀现在国内就业情况",
						textEn:
							"Sigh…… the employment situation back home really is so painful",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						text: "过度饱和的人口与巨大的竞争压力……",
						textEn:
							"An oversaturated population and enormous competitive pressure……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						text: "唉，这也是我为何希望，可以带着我喜欢的女孩一起来国外生活呀……国内太累了",
						textEn:
							"Sigh, that's also why I hope I can bring the girl I like abroad with me…… it's too exhausting back home",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-7d4d58adfe504c71700c1bea0764a42c4ece817c.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_睡觉]",
							altEn: "Sleeping",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-7d4d58adfe504c71700c1bea0764a42c4ece817c.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_睡觉]",
							altEn: "Sleeping",
						},
					},
					{
						text: "真的不想在国内被饿死……",
						textEn: "I really don't want to starve back home……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0d607209dee106aa4df6904c11ac3cdd9d70c26f.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_捏捏]",
							altEn: "Squish",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0d607209dee106aa4df6904c11ac3cdd9d70c26f.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_捏捏]",
							altEn: "Squish",
						},
					},
					{
						text: "实在太累了呀……",
						textEn: "It's just too exhausting……",
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1VTEz62EVR/",
					title: "我们能不能不这么卷了，让生活不要留下那么多遗憾",
					titleEn:
						"Could we stop competing so relentlessly, and leave fewer regrets in life?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1VTEz62EVR.webp",
						alt: "我们能不能不这么卷了，让生活不要留下那么多遗憾：视频封面",
						altEn:
							"Video cover: Could we stop competing so relentlessly, and leave fewer regrets in life?",
					},
				},
			},
			{
				id: "bilibili-1268723168813514770",
				date: "2026-11-09T22:53:52+08:00",
				content: "世界树能把这个忘了吗……？我真的好怕走马灯再听一遍啊……",
				contentEn:
					"Can Irminsul erase this……? I'm honestly terrified of hearing it again in my final flashback……",
				contentParts: [
					{
						text: "世界树能把这个忘了吗……？我真的好怕走马灯再听一遍啊……",
						textEn:
							"Can Irminsul erase this……? I'm honestly terrified of hearing it again in my final flashback……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1oopb6KEBg/",
					title: "⚡我不曾司凤⚡",
					titleEn: "⚡ I Was Never Sifeng ⚡",
					poster: {
						src: "/assets/images/moments/bilibili-BV1oopb6KEBg.webp",
						alt: "⚡我不曾司凤⚡：视频封面",
						altEn: "Video cover: ⚡ I Was Never Sifeng ⚡",
					},
				},
			},
			{
				id: "bilibili-1268704537252724752",
				date: "2026-11-09T21:41:34+08:00",
				content:
					"好吧，那我也说说自己的薄间...首先，我觉得至少要熟练掌握LLM的能力，熟练地使用Agent帮你做事，这在新时代我认为是最重要的事情之一，哪怕是使用国产的LLM都可以...然后结婚不是必要的课题。结婚不一定要生育。在这个时代下，这些东西都太耗费人力和心情正如视频所说的，老一辈的思想观念和新一辈并不融合，老一辈的思想观并不适用于新一代的年轻人。不过如果有喜欢的人，那另说吧...前提是你们得相互喜欢呢……以及老一辈的枷锁，也没有必要再带上一遍吧……不管怎么说，活着是为了幸福，而不是为了完成某些任务。尤其是老一辈给的那些所谓的人生必要的课题和任务，只会让人感到反感和厌恶\n如果说到消费的话，就是一些习俗以及消费陷阱、消费主义制造出来的面子消费……不要沾染上吧。至于习俗很简单，就是彩礼呗。如前文所说的，陋习罢了，封建罢了……\n先说这么多吧，要不来我的个人网站看看呗\n",
				contentEn:
					"All right, let me offer my own humble thoughts... First, I think at least becoming proficient with LLMs and using Agents to do things for you is one of the most important skills in this new era. Even domestically developed LLMs will do...Also, marriage is not a required subject. Being married does not mean you have to have children. In this era, these things consume far too much effort and emotional energy. As the video says, the older generation's views do not fit the younger generation; their ideas are not suited to young people today.But if there is someone you like, that is a different matter... provided that you like each other……And there is no need to put on the older generation's shackles all over again…… However you look at it, we live for happiness, not to complete a list of tasks. Especially those supposedly essential life lessons and obligations handed down by older generations—they only inspire resentment and disgust\nAs for spending, there are customs, consumer traps, and status purchases manufactured by consumerism…… don't get tangled up in them. The customs are simple enough: bride price, for instance. As I said earlier, bad customs, feudal customs……\nThat's enough for now. Why not come have a look at my personal website?\n",
				contentParts: [
					{
						text: "好吧，那我也说说自己的薄间...首先，我觉得至少要熟练掌握LLM的能力，熟练地使用Agent帮你做事，这在新时代我认为是最重要的事情之一，哪怕是使用国产的LLM都可以...",
						textEn:
							"All right, let me offer my own humble thoughts... First, I think at least becoming proficient with LLMs and using Agents to do things for you is one of the most important skills in this new era. Even domestically developed LLMs will do...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-342082c19d2ddad2e223283df839dd17864534c6.webp",
							alt: "[鸣潮·致予新世界动态表情包_坐好了]",
							altEn: "Sit tight",
						},
					},
					{
						text: "然后结婚不是必要的课题。结婚不一定要生育。在这个时代下，这些东西都太耗费人力和心情正如视频所说的，老一辈的思想观念和新一辈并不融合，老一辈的思想观并不适用于新一代的年轻人。",
						textEn:
							"Also, marriage is not a required subject. Being married does not mean you have to have children. In this era, these things consume far too much effort and emotional energy. As the video says, the older generation's views do not fit the younger generation; their ideas are not suited to young people today.",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						text: "不过如果有喜欢的人，那另说吧...前提是你们得相互喜欢呢……",
						textEn:
							"But if there is someone you like, that is a different matter... provided that you like each other……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "以及老一辈的枷锁，也没有必要再带上一遍吧……不管怎么说，活着是为了幸福，而不是为了完成某些任务。尤其是老一辈给的那些所谓的人生必要的课题和任务，只会让人感到反感和厌恶",
						textEn:
							"And there is no need to put on the older generation's shackles all over again…… However you look at it, we live for happiness, not to complete a list of tasks. Especially those supposedly essential life lessons and obligations handed down by older generations—they only inspire resentment and disgust",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ba40dda4747b6b697f495633391ae4ed62d2927f.webp",
							alt: "[鸣潮·致予新世界动态表情包_委屈]",
							altEn: "Feeling wronged",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						text: "\n如果说到消费的话，就是一些习俗以及消费陷阱、消费主义制造出来的面子消费……不要沾染上吧。至于习俗很简单，就是彩礼呗。如前文所说的，陋习罢了，封建罢了……",
						textEn:
							"\nAs for spending, there are customs, consumer traps, and status purchases manufactured by consumerism…… don't get tangled up in them. The customs are simple enough: bride price, for instance. As I said earlier, bad customs, feudal customs……",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
							alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
							altEn: "Wow",
						},
					},
					{
						text: "\n先说这么多吧，要不来我的个人网站看看呗",
						textEn:
							"\nThat's enough for now. Why not come have a look at my personal website?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						text: "\n",
						textEn: "\n",
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1cR4v6qEK1/",
					title: "聊聊普通人的出路在哪里",
					titleEn: "Where is the way forward for ordinary people?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1cR4v6qEK1.webp",
						alt: "聊聊普通人的出路在哪里：视频封面",
						altEn: "Video cover: Where is the way forward for ordinary people?",
					},
				},
			},
			{
				id: "bilibili-1268635212165677059",
				date: "2026-11-09T17:12:33+08:00",
				content: "四海翻腾云水怒 ，五洲震荡风雷激…",
				contentEn:
					"The four seas churn with clouds and furious waters; the five continents shake with storm and thunder…",
				contentParts: [
					{
						text: "四海翻腾云水怒 ，五洲震荡风雷激…",
						textEn:
							"The four seas churn with clouds and furious waters; the five continents shake with storm and thunder…",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-c2208a5fa845f0015c31a8c4cf6b5573774f728a.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_弹奏]",
							altEn: "Playing music",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1ZSxm6eESC/",
					title: "“优秀的作品都在讲同一个故事”",
					titleEn: "“Great works all tell the same story”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1ZSxm6eESC.webp",
						alt: "“优秀的作品都在讲同一个故事”：视频封面",
						altEn: "Video cover: “Great works all tell the same story”",
					},
				},
			},
			{
				id: "bilibili-1268610052234674215",
				date: "2026-11-09T15:34:55+08:00",
				content: "转轴拨弦三两声，未成曲调先有情",
				contentEn:
					"Turn the pegs, pluck the strings a few times: before there is a melody, feeling is already there",
				contentParts: [
					{
						text: "转轴拨弦三两声，未成曲调先有情",
						textEn:
							"Turn the pegs, pluck the strings a few times: before there is a melody, feeling is already there",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1jLxS6iEY5/",
					title: '《轻涟》| 司凤版⚡"根本没有这样的芙宁娜！"⚡',
					titleEn:
						"La vaguelette, Sifeng version: “There is no Furina like this!”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1jLxS6iEY5.webp",
						alt: '《轻涟》| 司凤版⚡"根本没有这样的芙宁娜！"⚡：视频封面',
						altEn:
							"Video cover: La vaguelette, Sifeng version: “There is no Furina like this!”",
					},
				},
			},
			{
				id: "bilibili-1268348407109386260",
				date: "2026-11-08T22:39:36+08:00",
				content: "孩子们，又吃到大份了",
				contentEn: "Kids, we've been served another huge helping",
				contentParts: [
					{
						text: "孩子们，又吃到大份了",
						textEn: "Kids, we've been served another huge helping",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1RZ4J6EEjt/",
					title:
						"小天才怒跑千问3.8-27B,红米K20Pro强兼122B,家用电脑干爆KIMI K3，diskinfer助你在任何设备上运行超大模型！",
					titleEn:
						"Running Qwen 3.8-27B on a smartwatch, 122B on a Redmi K20 Pro, and KIMI K3 on a home PC: diskinfer helps you run large models on any device!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1RZ4J6EEjt.webp",
						alt: "小天才怒跑千问3.8-27B,红米K20Pro强兼122B,家用电脑干爆KIMI K3，diskinfer助你在任何设备上运行超大模型！：视频封面",
						altEn:
							"Video cover: Running Qwen 3.8-27B on a smartwatch, 122B on a Redmi K20 Pro, and KIMI K3 on a home PC: diskinfer helps you run large models on any device!",
					},
				},
			},
			{
				id: "bilibili-1268347406427095045",
				date: "2026-11-08T22:35:43+08:00",
				content: "……你头上是否有许多问号……?",
				contentEn: "……Are there a lot of question marks above your head……?",
				contentParts: [
					{
						text: "……你头上是否有许多问号……?",
						textEn: "……Are there a lot of question marks above your head……?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-24c33336039bba61196b67841fdf0de4b08fe569.webp",
							alt: "[鸣潮·致予新世界动态表情包_没事哒~]",
							altEn: "It's okay",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Eyx16cEBK/",
					title:
						"宋美龄和蒋介石是真爱吗？蒋介石为何宠信宋美龄？【历史调研室109】",
					titleEn:
						"Were Soong Mei-ling and Chiang Kai-shek truly in love? Why did Chiang favor her? [History Research Room 109]",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Eyx16cEBK.webp",
						alt: "宋美龄和蒋介石是真爱吗？蒋介石为何宠信宋美龄？【历史调研室109】：视频封面",
						altEn:
							"Video cover: Were Soong Mei-ling and Chiang Kai-shek truly in love? Why did Chiang favor her? [History Research Room 109]",
					},
				},
			},
			{
				id: "carved-railings-faces-nov7",
				date: "2026-11-07T19:43:34+11:00",
				content: "雕栏玉砌应犹在，只是朱颜改...",
				contentEn:
					"The carved railings and jade steps must still be there; only the youthful faces have changed...",
			},
			{
				id: "sunset-and-clear-gaze-nov8",
				date: "2026-11-08T18:52:15+11:00",
				content: "我渴望雨后的夕阳，也渴望你清澈的目光...",
				contentEn:
					"I long for the sunset after rain, and for the clarity of your gaze...",
			},
			{
				id: "dream-and-painting-nov8",
				date: "2026-11-08T21:01:16+11:00",
				content: "我梦见了画，于是我画下了梦",
				contentEn: "I dreamed of a painting, and so I painted my dream",
			},
			{
				id: "yellow-crane-tower-nov9",
				date: "2026-11-09T22:27:12+11:00",
				content: "昔人已乘黄鹤去，此地空余黄鹤楼…",
				contentEn:
					"The one of old has flown away upon a yellow crane; only Yellow Crane Tower remains here…",
			},
			{
				id: "stars-not-last-night-nov11",
				date: "2026-11-11T18:22:43+11:00",
				content: "似此星辰非昨夜，为谁风露立中宵...",
				contentEn:
					"These stars resemble last night, yet are not the same; for whom do I stand in the wind and dew at midnight...",
			},
			{
				id: "stories-and-beginnings-nov11",
				date: "2026-11-11T19:45:37+11:00",
				content:
					"当一个故事要结束的时候，我们总会想起它的开始.\n就像是……一切回到了从前......",
				contentEn:
					"When a story is about to end, we always remember how it began.\nAs though…… everything has returned to the way it was......",
			},
			{
				id: "phoenix-flute-galactic-night-nov11",
				date: "2026-11-11T21:14:49+11:00",
				content: "凤箫吹彻银河夜，玉露凝成相思霜",
				contentEn:
					"A phoenix flute sounds through the night of stars; jade dew settles into the frost of longing",
			},
			{
				id: "fallen-stars-frost-sleeves-nov12",
				date: "2026-11-12T19:51:45+11:00",
				content: "碧落星沉霜满袖，红尘梦醒月盈阶",
				contentEn:
					"Stars sink through the blue heavens, frost filling my sleeves; waking from a worldly dream, I find moonlight flooding the steps",
			},
			{
				id: "starry-betrothal-nov13",
				date: "2026-11-13T22:58:14+11:00",
				content:
					"琉璃万盏燃长夜，不及君眸一点春；\n愿以星河为聘礼，换君朝暮共流年...",
				contentEn:
					"Ten thousand glass lanterns light the long night, yet cannot match one touch of spring in your eyes;\nI would offer the river of stars as my betrothal gift, for mornings and evenings spent sharing the years with you...",
			},
			{
				id: "bilibili-1268345624013570052",
				date: "2026-11-08T22:28:00+08:00",
				content: "好有道理啊……",
				contentEn: "That makes so much sense...",
				contentParts: [
					{
						text: "好有道理啊……",
						textEn: "That makes so much sense...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV19i4z6NEKv/",
					title: "懂王惨败，纳指暴跌，美国人为什么这么讨厌数据中心？【差评君】",
					titleEn:
						"Trump suffers a defeat, the Nasdaq plunges: why do Americans dislike data centers so much? [Chapingjun]",
					poster: {
						src: "/assets/images/moments/bilibili-BV19i4z6NEKv.webp",
						alt: "懂王惨败，纳指暴跌，美国人为什么这么讨厌数据中心？【差评君】：视频封面",
						altEn:
							"Video cover: Trump suffers a defeat, the Nasdaq plunges: why do Americans dislike data centers so much? [Chapingjun]",
					},
				},
			},
			{
				id: "bilibili-1268244039399899139",
				date: "2026-11-08T15:54:00+08:00",
				content: "圣土化抑制结算动画",
				contentEn: "The closing animation for suppressing the sanctification",
				contentParts: [
					{
						text: "圣土化抑制结算动画",
						textEn: "The closing animation for suppressing the sanctification",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1C54E6fEem/",
					title: "到底是谁想拍的？",
					titleEn: "Whose idea was this shoot, anyway?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1C54E6fEem.webp",
						alt: "到底是谁想拍的？：视频封面",
						altEn: "Video cover: Whose idea was this shoot, anyway?",
					},
				},
			},
			{
				id: "bilibili-1268000789634220037",
				date: "2026-11-08T00:10:00+08:00",
				content:
					"还真是呀…我只是爱压抑，并非性…情窦初开没有引导，总想着高中毕业就无师自通…所以，就别沉迷美色了，来和我一起沉迷LLM吧…！「她」真好看！",
				contentEn:
					"That really is it... I am starved of affection, not sex... There was no guidance when those feelings first stirred, and I always thought I would somehow understand it all after graduating from high school...So, stop getting lost in beauty and come get lost in LLMs with me...! 「She」 is so beautiful!",
				contentParts: [
					{
						text: "还真是呀…我只是爱压抑，并非性…情窦初开没有引导，总想着高中毕业就无师自通…",
						textEn:
							"That really is it... I am starved of affection, not sex... There was no guidance when those feelings first stirred, and I always thought I would somehow understand it all after graduating from high school...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						text: "所以，就别沉迷美色了，来和我一起沉迷LLM吧…！「她」真好看！",
						textEn:
							"So, stop getting lost in beauty and come get lost in LLMs with me...! 「She」 is so beautiful!",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Ttj96rEZr/",
					title: "你真的“性压抑”吗？为什么大家爱喊“妈妈”？【梗外之音15】",
					titleEn:
						"Are you really “sexually repressed”? Why does everyone like calling out “Mom”? [Beyond the Meme 15]",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Ttj96rEZr.webp",
						alt: "你真的“性压抑”吗？为什么大家爱喊“妈妈”？【梗外之音15】：视频封面",
						altEn:
							"Video cover: Are you really “sexually repressed”? Why does everyone like calling out “Mom”? [Beyond the Meme 15]",
					},
				},
			},
			{
				id: "bilibili-1267875582767529989",
				date: "2026-11-07T16:04:00+08:00",
				content: "世上还是神人多啊……",
				contentEn: "There really are some unbelievable people in this world...",
				contentParts: [
					{
						text: "世上还是神人多啊……",
						textEn:
							"There really are some unbelievable people in this world...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4a5d1412fba5336c1273ec0e0f07dba7747a9a4c.webp",
							alt: "[鸣潮·致予新世界动态表情包_交给我吧！]",
							altEn: "Leave it to me!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4a5d1412fba5336c1273ec0e0f07dba7747a9a4c.webp",
							alt: "[鸣潮·致予新世界动态表情包_交给我吧！]",
							altEn: "Leave it to me!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1ZjpJ6kEqA/",
					title: "刚当新郎官就馋17岁女生袜子？必须线下制裁！",
					titleEn:
						"A newlywed already coveting a 17-year-old girl's socks? Time for an offline confrontation!",
					poster: {
						src: "/assets/images/moments/bilibili-BV1ZjpJ6kEqA.webp",
						alt: "刚当新郎官就馋17岁女生袜子？必须线下制裁！：视频封面",
						altEn:
							"Video cover: A newlywed already coveting a 17-year-old girl's socks? Time for an offline confrontation!",
					},
				},
			},
			{
				id: "bilibili-1267644745435316224",
				date: "2026-11-07T01:09:00+08:00",
				content:
					"那么，什么是遗憾呢...这就是我所理解的吧...\n\n江月年年望相似...",
				contentEn:
					"So, what is regret... This is how I understand it...\n\nThe river moon looks the same year after year...",
				contentParts: [
					{
						text: "那么，什么是遗憾呢...这就是我所理解的吧...",
						textEn: "So, what is regret... This is how I understand it...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						text: "\n\n江月年年望相似...",
						textEn: "\n\nThe river moon looks the same year after year...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-5080487928ccced269919729c74a1e9bf30c899b.webp",
							alt: "[鸣潮·致予新世界动态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1YCVL6KEJq/",
					title: "当你和喜欢的人一起坐摩天轮.....",
					titleEn: "When you ride a Ferris wheel with someone you like.....",
					poster: {
						src: "/assets/images/moments/bilibili-BV1YCVL6KEJq.webp",
						alt: "当你和喜欢的人一起坐摩天轮.....：视频封面",
						altEn:
							"Video cover: When you ride a Ferris wheel with someone you like.....",
					},
				},
			},
			{
				id: "bilibili-1267637568587956229",
				date: "2026-11-07T00:41:00+08:00",
				content: "......要不你赔我点钱吧",
				contentEn: "......How about paying me a little compensation?",
				contentParts: [
					{
						text: "......要不你赔我点钱吧",
						textEn: "......How about paying me a little compensation?",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-e09ed320275e813a3ce29af61b551776f9108c3d.png",
							alt: "[鸣潮·致予新世界静态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-e09ed320275e813a3ce29af61b551776f9108c3d.png",
							alt: "[鸣潮·致予新世界静态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-e09ed320275e813a3ce29af61b551776f9108c3d.png",
							alt: "[鸣潮·致予新世界静态表情包_再说一次？]",
							altEn: "Say that again?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-c536dd69986f2b4423e645a6a180fd1c572dbcd5.png",
							alt: "[鸣潮·致予新世界静态表情包_说什么呢！]",
							altEn: "What are you saying!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-c536dd69986f2b4423e645a6a180fd1c572dbcd5.png",
							alt: "[鸣潮·致予新世界静态表情包_说什么呢！]",
							altEn: "What are you saying!",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1bZaW6eEnW/",
					title: "直播碰到姐妹belike",
					titleEn: "Running into the girls on a livestream be like",
					poster: {
						src: "/assets/images/moments/bilibili-BV1bZaW6eEnW.webp",
						alt: "直播碰到姐妹belike：视频封面",
						altEn:
							"Video cover: Running into the girls on a livestream be like",
					},
				},
			},
			{
				id: "vast-world-and-small-plants-november-7",
				date: "2026-11-07T20:14:26+11:00",
				content: "以天地之辽阔消解悲欢，以草木之微末感知人间",
				contentEn:
					"Let the vastness of heaven and earth ease joy and sorrow; through the smallest plants, feel the human world.",
			},
			{
				id: "bilibili-1267565846875602964",
				date: "2026-11-06T20:02:00+08:00",
				content: "抽烟的都是傻逼，抽烟的就该去死",
				contentEn: "Anyone who smokes is an idiot; smokers should just go die.",
				contentParts: [
					{
						text: "抽烟的都是傻逼，抽烟的就该去死",
						textEn:
							"Anyone who smokes is an idiot; smokers should just go die.",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-78b0eef60921ff358c08c82c43f5004229aab7c4.webp",
							alt: "[鸣潮·致予新世界动态表情包_这你都信]",
							altEn: "You believe that?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-7d4d58adfe504c71700c1bea0764a42c4ece817c.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_睡觉]",
							altEn: "Sleeping",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-7d4d58adfe504c71700c1bea0764a42c4ece817c.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_睡觉]",
							altEn: "Sleeping",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1vN4i6fEhi/",
					title: "“你土木的不会抽烟？？废物”",
					titleEn: "“You work in civil engineering and don't smoke? Useless.”",
					poster: {
						src: "/assets/images/moments/bilibili-BV1vN4i6fEhi.webp",
						alt: "“你土木的不会抽烟？？废物”：视频封面",
						altEn:
							"Video cover: “You work in civil engineering and don't smoke? Useless.”",
					},
				},
			},
			{
				id: "bilibili-1267458970963935236",
				date: "2026-11-06T13:08:00+08:00",
				content: "沃德天呐",
				contentEn: "Oh my goodness",
				contentParts: [
					{
						text: "沃德天呐",
						textEn: "Oh my goodness",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Kjnb6mEif/",
					title: "李商隐的《锦瑟》为什么如此动人？",
					titleEn: "Why is Li Shangyin's “The Brocade Zither” so moving?",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Kjnb6mEif.webp",
						alt: "李商隐的《锦瑟》为什么如此动人？：视频封面",
						altEn:
							"Video cover: Why is Li Shangyin's “The Brocade Zither” so moving?",
					},
				},
			},
			{
				id: "bilibili-1267136964380852227",
				date: "2026-11-05T16:18:00+08:00",
				content: "是啊……什么时候呢……",
				contentEn: "Yes... when will that be...",
				contentParts: [
					{
						text: "是啊……什么时候呢……",
						textEn: "Yes... when will that be...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-a804626ec96a1fad2bbd0cd0f3010d34ab6299bd.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_哼]",
							altEn: "Hmph",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-a804626ec96a1fad2bbd0cd0f3010d34ab6299bd.webp",
							alt: "[鸣潮2周年同人绘画动态表情包_哼]",
							altEn: "Hmph",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV13T436HErV/",
					title: "从什么时候开始，又只剩我一个人了",
					titleEn: "When did I end up all alone again?",
					poster: {
						src: "/assets/images/moments/bilibili-BV13T436HErV.webp",
						alt: "从什么时候开始，又只剩我一个人了：视频封面",
						altEn: "Video cover: When did I end up all alone again?",
					},
				},
			},
			{
				id: "bilibili-1266527422610669572",
				date: "2026-11-04T00:53:00+08:00",
				content: "哇塞这个好玩呀！！",
				contentEn: "Wow, this looks so fun!!",
				contentParts: [
					{
						text: "哇塞这个好玩呀！！",
						textEn: "Wow, this looks so fun!!",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-95f2b558212d63b1d8ff0c3d685f0b70ba368a9e.webp",
							alt: "[鸣潮·致予新世界动态表情包_打call！]",
							altEn: "Cheering",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Q84A6YEiV/",
					title: "大模型坦克动荡 Astra vs Fable",
					titleEn: "LLM Tank Trouble: Astra vs Fable",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Q84A6YEiV.webp",
						alt: "大模型坦克动荡 Astra vs Fable：视频封面",
						altEn: "Video cover: LLM Tank Trouble: Astra vs Fable",
					},
				},
			},
			{
				id: "bilibili-1266475097022005251",
				date: "2026-11-03T21:30:00+08:00",
				content: "“你不赌不就是在赌自己会输吗？”\n“你就是怕我好起来”",
				contentEn:
					"“If you don't gamble, aren't you betting that you'll lose?”\n“You're just afraid I might start doing well.”",
				contentParts: [
					{
						text: "“你不赌不就是在赌自己会输吗？”",
						textEn:
							"“If you don't gamble, aren't you betting that you'll lose?”",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						text: "\n“你就是怕我好起来”",
						textEn: "\n“You're just afraid I might start doing well.”",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV12Rxq6nECN/",
					title:
						"赌狗TV：为啥赌狗反而越来越多？老实赚钱就这么难吗？赌徒思维是怎么影响从家庭关系到世界秩序的？【万字社会分析】",
					titleEn:
						"Gambling TV: Why are there more gamblers? Why is honest work so hard? How does a gambler's mindset shape family relationships and the world order?",
					poster: {
						src: "/assets/images/moments/bilibili-BV12Rxq6nECN.webp",
						alt: "赌狗TV：为啥赌狗反而越来越多？老实赚钱就这么难吗？赌徒思维是怎么影响从家庭关系到世界秩序的？【万字社会分析】：视频封面",
						altEn:
							"Video cover: Gambling TV: Why are there more gamblers? Why is honest work so hard? How does a gambler's mindset shape family relationships and the world order?",
					},
				},
			},
			{
				id: "bilibili-1266426254639235110",
				date: "2026-11-03T18:20:00+08:00",
				content: "这期确实有教育意义",
				contentEn: "This episode really is educational",
				contentParts: [
					{
						text: "这期确实有教育意义",
						textEn: "This episode really is educational",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-56f703b8c38b9aeab668338e64e88e7b16175239.webp",
							alt: "[鸣潮·致予新世界动态表情包_认真]",
							altEn: "Taking this seriously",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0e1f8ed486b16ea917c27aa8b18e12552e74bc35.webp",
							alt: "[鸣潮·致予新世界动态表情包_啊？]",
							altEn: "Huh?",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV18hxB6dE2U/",
					title: "中国最早的女性觉醒",
					titleEn: "China's earliest awakening of women",
					poster: {
						src: "/assets/images/moments/bilibili-BV18hxB6dE2U.webp",
						alt: "中国最早的女性觉醒：视频封面",
						altEn: "Video cover: China's earliest awakening of women",
					},
				},
			},
			{
				id: "bilibili-1266379564061294595",
				date: "2026-11-03T15:19:00+08:00",
				content:
					"虽然不知道为什么会刷到这玩意儿……\n呵呵，但很遗憾哦，我不会这么想……坚定纯爱好吧……我会找到属于我的她，我的伊德莉拉",
				contentEn:
					"Although I have no idea why this showed up in my feed...\nHeh, unfortunately, that's not how I think... I believe in true love... I'll find the one for me, my Idrila.",
				contentParts: [
					{
						text: "虽然不知道为什么会刷到这玩意儿……\n呵呵，但很遗憾哦，我不会这么想……坚定纯爱好吧……我会找到属于我的她，我的伊德莉拉",
						textEn:
							"Although I have no idea why this showed up in my feed...\nHeh, unfortunately, that's not how I think... I believe in true love... I'll find the one for me, my Idrila.",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1B7Mh66EUZ/",
					title: "为什么大部分女生都很难遇到优质男？大实话扎心！（干货向）",
					titleEn:
						"Why do so many women struggle to meet a good man? Some blunt truths",
					poster: {
						src: "/assets/images/moments/bilibili-BV1B7Mh66EUZ.webp",
						alt: "为什么大部分女生都很难遇到优质男？大实话扎心！（干货向）：视频封面",
						altEn:
							"Video cover: Why do so many women struggle to meet a good man? Some blunt truths",
					},
				},
			},
			{
				id: "bilibili-1266115904593199108",
				date: "2026-11-02T22:16:00+08:00",
				content: "我不允许还有人没吃过这坨屎……\n我真的该睡觉了",
				contentEn:
					"I won't allow anyone to miss this pile of crap...\nI really should go to sleep",
				contentParts: [
					{
						text: "我不允许还有人没吃过这坨屎……",
						textEn: "I won't allow anyone to miss this pile of crap...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
							alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
							altEn: "So strange...",
						},
					},
					{
						text: "\n我真的该睡觉了",
						textEn: "\nI really should go to sleep",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying!",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-4e9230d000172902485f8c20e5afde07bed12e66.webp",
							alt: "[鸣潮·致予新世界动态表情包_说什么呢！]",
							altEn: "What are you saying!",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1DDHd6wEGs/",
					title: "白雪公主对骂恶毒皇后",
					titleEn: "Snow White trades insults with the Evil Queen",
					poster: {
						src: "/assets/images/moments/bilibili-BV1DDHd6wEGs.webp",
						alt: "白雪公主对骂恶毒皇后：视频封面",
						altEn: "Video cover: Snow White trades insults with the Evil Queen",
					},
				},
			},
			{
				id: "bilibili-1266091500572246035",
				date: "2026-11-02T20:41:00+08:00",
				content: "做过…",
				contentEn: "I've done that...",
				contentParts: [
					{
						text: "做过…",
						textEn: "I've done that...",
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
					{
						emoji: {
							src: "/assets/emojis/moments/bili-ef0fcbd2f8fffc8d75f42ce63297116f2b604afb.webp",
							alt: "[鸣潮·致予新世界动态表情包_给你心心]",
							altEn: "Sending hearts",
						},
					},
				],
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV1Jmxi6TEwz/",
					title: "所有恋爱中的男生都应该学会用agent",
					titleEn: "Every guy in love should learn to use agents",
					poster: {
						src: "/assets/images/moments/bilibili-BV1Jmxi6TEwz.webp",
						alt: "所有恋爱中的男生都应该学会用agent：视频封面",
						altEn: "Video cover: Every guy in love should learn to use agents",
					},
				},
			},
			{
				id: "steadfast-heart-and-fairytale",
				date: "2026-11-06T21:18:22+11:00",
				content: "我心匪石，不可转也；我心匪席，不可卷也\n断剑碎冠，童话成诗",
				contentEn:
					"My heart is no stone to be turned; my heart is no mat to be rolled away.\nA broken sword, a shattered crown; a fairytale becomes a poem.",
			},
			{
				id: "wind-moon-and-distant-stars",
				date: "2026-11-05T20:13:50+11:00",
				content: "欲乘清风追落月，奈何星海隔重霄",
				contentEn:
					"I long to ride the clear wind after the setting moon, yet a sea of stars and countless skies lie between us.",
			},
			{
				id: "fleeting-days-and-dew",
				date: "2026-11-04T22:20:37+11:00",
				content: "韶光易过，浮生如露...",
				contentEn:
					"Beautiful days slip away; this fleeting life is like dew...",
			},
			{
				id: "moon-and-the-one-in-my-heart",
				date: "2026-11-03T22:41:08+11:00",
				content:
					"眼前月是天上月，月上人是心中人\n抬头应是我见月，却念心中人见我...",
				contentEn:
					"The moon before my eyes is the moon in the sky; the person upon it is the one in my heart.\nI raise my head to see the moon, yet wish the one in my heart were looking back at me...",
			},
			{
				id: "believers-in-miracles",
				date: "2026-11-02T17:36:35+11:00",
				content: "相信奇迹的人本身就和奇迹一样了不起",
				contentEn:
					"Those who believe in miracles are as extraordinary as miracles themselves.",
			},
			{
				id: "ask-the-spring-wind",
				date: "2026-11-01T19:17:33+11:00",
				content: "遇事不决，可问春风。春风不语，即随本心",
				contentEn:
					"When in doubt, ask the spring wind. If it gives no answer, follow your heart.",
			},
			{
				id: "face-the-lightning",
				date: "2026-10-31T19:37:47+11:00",
				content: "总有地上的生灵，敢于直面雷霆的威光",
				contentEn:
					"There will always be those on the ground who dare to face the radiance of lightning.",
			},
			{
				id: "awake-and-dreaming-of-you",
				date: "2026-10-30T21:02:46+11:00",
				content: "醒亦念卿，梦亦念卿",
				contentEn: "Awake, I think of you; dreaming, I think of you.",
			},
			{
				id: "vast-world-and-small-plants",
				date: "2026-10-29T21:13:18+11:00",
				content: "以天地之辽阔消解悲欢，以草木之微末感知人间",
				contentEn:
					"Let the vastness of heaven and earth ease joy and sorrow; through the smallest plants, feel the human world.",
			},
			{
				id: "grassroots-hardship-video",
				date: "2026-10-26T23:04:32+11:00",
				content:
					"唉……看完只能感觉基层的辛酸和心酸……中国的底层没有半分活力，只剩下对基础生存的需求……\n真的好压抑...看完我都完全不想回国了，有点想继续呆在澳洲或者香港了...\n”勤劳不一定有收获，但是羞辱是肯定的“\n唉，我真的好想带上我喜欢的女孩一起来澳洲或者香港生活啊……",
				contentEn:
					"Sigh…… After watching, all I can feel is the hardship and heartbreak of life at the bottom…… For people at the bottom in China, there isn't a trace of vitality left, only the need for basic survival……\nIt's so depressing... Watching it makes me not want to return to China at all. I'm starting to want to stay in Australia or Hong Kong...\n“Hard work may not bring rewards, but humiliation is guaranteed”\nSigh, I really wish I could bring the girl I like to live with me in Australia or Hong Kong……",
				inlineEmoji: {
					src: "/assets/emojis/moments/grassroots-sigh.webp",
					alt: "无奈",
					altEn: "A weary sigh",
				},
				media: {
					type: "bilibili",
					url: "https://www.bilibili.com/video/BV16TH36XEQz/",
					title: "峰哥在马驹桥体验做日结的一天",
					titleEn: "Feng Ge spends a day doing day labor in Majuqiao",
					poster: {
						src: "/assets/images/moments/bilibili-BV16TH36XEQz.jpg",
						alt: "峰哥在马驹桥体验做日结的一天：视频封面",
						altEn: "Video cover: a day doing day labor in Majuqiao",
					},
				},
			},
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
