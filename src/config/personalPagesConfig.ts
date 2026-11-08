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
