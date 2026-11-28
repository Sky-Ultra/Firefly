import type { PersonalPagesConfig } from "@/types/personalPagesConfig";
import { personalPagesConfig } from "./personalPagesConfig";

export const momentsConfig: PersonalPagesConfig["moments"] = {
	...personalPagesConfig.moments,
	items: [
		{
			id: "androgyny-and-care-nov27",
			date: "2026-11-27T21:44:08+11:00",
			content:
				"阅读时碰到了 androgynous 这个词，查了一下是“雌雄同体”的意思。\n\n想到最近经常刷到的关于雌雄同体高级人类的解释。它指的是一个人突破了单一的性别特质，既具备坚毅、果断与边界感，又兼具细腻、敏锐与高共情，是一种极度成熟、内核自洽的人格。\n\n又联系到原生家庭中关于缺爱的表述，留守儿童和单亲家庭往往多发。因为抚养者通常是单一的（只有父性或母性甚至都无），必然伴随某种特质的缺位。\n\n于是脑子里突然冒出一个问题：\n如果是由这样一个兼具两性优质特质，且能提供高度情感支持的“高级人类”独立抚养长大，小孩依旧会产生那种缺爱感吗？",
			contentEn:
				"I came across the word “androgynous” while reading. I looked it up and found that it means combining masculine and feminine qualities.\n\nIt reminded me of something I keep seeing online about the “highly evolved androgynous person.” The idea is that someone grows beyond the traits assigned to one gender. They can be resilient, decisive, and good at setting boundaries while also being perceptive, sensitive, and empathetic. The posts describe it as a deeply mature personality at ease with itself.\n\nThat made me think of how people talk about feeling unloved growing up, especially among children whose parents have moved away for work or who live in single-parent households. In that account there may be only one caregiver providing one kind of care, paternal or maternal, or neither, so some qualities are assumed to be missing.\n\nThen a question came to mind:\nIf a child were raised by just one of these “highly evolved” people, who combined the best traits associated with both genders and offered plenty of emotional support, would the child still grow up feeling that kind of absence of love?",
		},
		{
			id: "time-spent-on-computing-nov27",
			date: "2026-11-27T18:32:12+11:00",
			content:
				"我很庆幸，在最压抑、最内卷的大学时代，我大二就已经摆脱了应试教育的束缚，没有活成千篇一律的样子。\n\n我到现在还记得，第一次做出一个前端抽象语法树，接上现成的后端，最后成功跑通了一个可以算加减乘除的计算器时，我激动得不行。\n\n现在回头看，我甚至已经记不清当时到底做过哪些实验，只模糊记得一些课程编号：15-445、15-213、CS144这些？很奇怪，这些编号当年我几乎可以脱口而出。那时候可以和网友和朋友们聊B+树，聊缓冲池，聊异步调度；也会很认真地用调试工具一行一行地找程序漏洞。\n\n但后来去做人工智能，这些东西几乎全忘了。现在再碰到一个项目跑不通，第一反应就是把报错和代码一起扔给AI，甚至都让AI智能体来接管任务了。\n\n我也经常会想，如果我大一、大二的时候就进实验室做科研，会不会现在完全是另一条路。也许我能早几年开始写论文，早几年知道基准测试、消融实验、截止日期是怎么回事。\n\n那些知识没有帮我提高绩点，没有直接变成论文，也没有决定我后来做什么方向。但如果再回到大一，我还是会去看那些书，还是会去写那些注定会被我忘掉的代码。\n\n因为人生的长远轨迹实在太长了，选择很多，回报又太少太慢。大家根本不知道一件事会不会在五年十年以后真正影响你的轨迹。所以人在很年轻的时候，本来就需要一些探索。\n\n我第一次发现，原来我真的会因为想弄懂一个东西而废寝忘食。没有考试，没有绩点，没有死线。我喜欢那些系统的严谨，喜欢一个巨大的系统最后可以被拆成一个又一个明确的机制，再一点一点拼起来。\n\n我第一次真正觉得：原来我是真的喜欢计算机。\n\n真正留下来的，不是B+树具体怎么分裂，是你知道自己曾经真的因为“想搞明白一个问题”而坐在那里一整天；知道自己不是只能靠绩点、论文、录用通知才能驱动。这些东西会变成一个人的一部分。我至少想知道自己最后要成为一个什么样的人。人总不能最后只剩一张纸，写满酒色财气、功名利禄。至少应该有一些东西，是自己真正喜欢过、认真相信过，也愿意为它浪费过时间的。",
			contentEn:
				"I’m glad that in the most stifling and competitive years of college, I’d already shaken off the grip of exam-driven education by my sophomore year. I didn’t end up living the same life as everyone else.\n\nI still remember how excited I was the first time I built a front end around an abstract syntax tree, hooked it up to an existing back end, and got a calculator working that could add, subtract, multiply, and divide.\n\nLooking back, I can hardly remember which labs I did. I vaguely remember course numbers like 15-445, 15-213, and CS144. It’s odd to think I could rattle those off without a pause back then. I used to talk with friends online and off about B+ trees, buffer pools, and asynchronous scheduling. I’d also sit with a debugger and go through the program line by line looking for bugs.\n\nThen I went into AI and forgot almost all of it. Now when a project won’t run, my first instinct is to give the error and the code to AI. Sometimes I let an agent take over the task entirely.\n\nI often wonder whether I’d be on a completely different path if I’d joined a research lab in my first or second year. Maybe I’d have started writing papers earlier and learned sooner what benchmarks, ablation studies, and deadlines were all about.\n\nNone of that knowledge raised my GPA, led directly to a paper, or determined what I went on to work on. But if I could go back to my first year, I’d still read those books. I’d still write the code I was bound to forget.\n\nA life takes a long time to unfold. There are plenty of choices, and the returns are often small and slow. Nobody can really tell whether something will change your course five or ten years down the line. That’s why you need room to explore when you’re young.\n\nIt was the first time I realized I could forget to eat or sleep because I wanted to understand something. There was no exam, no GPA, no deadline. I loved the rigor of those systems and how you could break something huge into clear mechanisms and then fit them back together piece by piece.\n\nFor the first time, I thought, I really do love computing.\n\nWhat stayed with me was the knowledge that I’d once spent an entire day in that chair just because I wanted to figure something out. I knew that grades, papers, and acceptance letters weren’t the only things that could drive me. Those experiences become part of who you are. At the very least, I want to know what kind of person I’m becoming. A life has to amount to more than a sheet of paper crowded with pleasures, money, titles, and honors. There ought to be something you genuinely loved, believed in, and were willing to spend time on for its own sake.",
		},
		{
			id: "bilibili-1275280888083513369",
			date: "2026-11-27T15:01:10+08:00",
			content: "这Astra字写的这么好看…",
			contentEn: "Astra’s handwriting is so nice…",
			contentParts: [
				{
					text: "这Astra字写的这么好看…",
					textEn: "Astra’s handwriting is so nice…",
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
				url: "https://www.bilibili.com/video/BV1tHyBzmEYp/",
				title: "眩晕瘫坐！GPT完全手写2026年高考数学试卷，24分钟150分满分！",
				titleEn:
					"Dizzy and stunned! GPT handwrites the 2026 gaokao math paper and scores 150 out of 150 in 24 minutes",
				poster: {
					src: "/assets/images/moments/bilibili-BV1tHyBzmEYp.webp",
					alt: "眩晕瘫坐！GPT完全手写2026年高考数学试卷，24分钟150分满分！：视频封面",
					altEn:
						"Video cover: Dizzy and stunned! GPT handwrites the 2026 gaokao math paper and scores 150 out of 150 in 24 minutes",
				},
			},
		},
		{
			id: "bilibili-1275260169167568905",
			date: "2026-11-27T13:40:46+08:00",
			content: "那还说啥了，给你了孩子有这水平随便玩吧…",
			contentEn:
				"What else can I say? It’s yours.If the kid’s that good, let them play all they want…",
			contentParts: [
				{
					text: "那还说啥了，给你了",
					textEn: "What else can I say? It’s yours.",
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
					text: "孩子有这水平随便玩吧…",
					textEn: "If the kid’s that good, let them play all they want…",
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
				url: "https://www.bilibili.com/video/BV1Say5zXEeG/",
				title: "我循声守卫2📢",
				titleEn: "I’m the Clicker Guard 2 📢",
				poster: {
					src: "/assets/images/moments/bilibili-BV1Say5zXEeG.webp",
					alt: "我循声守卫2📢：视频封面",
					altEn: "Video cover: I’m the Clicker Guard 2 📢",
				},
			},
		},
		{
			id: "bilibili-1275234983466762243",
			date: "2026-11-27T12:03:02+08:00",
			content: "我不行了🤣🤣我以为这是串子比赛🤣",
			contentEn: "I can’t 🤣🤣 I thought this was a trolling contest 🤣",
			contentParts: [
				{
					text: "我不行了🤣🤣我以为这是串子比赛🤣",
					textEn: "I can’t 🤣🤣 I thought this was a trolling contest 🤣",
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
				url: "https://www.bilibili.com/video/BV1wtymzvEMM/",
				title: "任正非成深圳诗词大赛主角，大部分作品都是歌颂夸赞",
				titleEn:
					"Ren Zhengfei takes center stage in Shenzhen’s poetry contest, where most entries sing his praises",
				poster: {
					src: "/assets/images/moments/bilibili-BV1wtymzvEMM.webp",
					alt: "任正非成深圳诗词大赛主角，大部分作品都是歌颂夸赞：视频封面",
					altEn:
						"Video cover: Ren Zhengfei takes center stage in Shenzhen’s poetry contest, where most entries sing his praises",
				},
			},
		},
		{
			id: "bilibili-1275234571149901826",
			date: "2026-11-27T12:01:26+08:00",
			content: "求求你教我怎么串吧",
			contentEn: "Please teach me how to troll like that",
			contentParts: [
				{
					text: "求求你教我怎么串吧",
					textEn: "Please teach me how to troll like that",
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
				url: "https://www.bilibili.com/video/BV1TtykzcE9i/",
				title: "黄仁勋实际上已经完蛋了",
				titleEn: "Jensen Huang is actually finished already",
				poster: {
					src: "/assets/images/moments/bilibili-BV1TtykzcE9i.webp",
					alt: "黄仁勋实际上已经完蛋了：视频封面",
					altEn: "Video cover: Jensen Huang is actually finished already",
				},
			},
		},
		{
			id: "bilibili-1275232187408449544",
			date: "2026-11-27T11:52:11+08:00",
			content: "真好啊……根本没有这样的生活😭😭😭😭\n我只是区罢了……",
			contentEn:
				"That sounds so nice…… There’s no life like that for me 😭😭😭😭\nI’m just bitter about it……",
			contentParts: [
				{
					text: "真好啊……根本没有这样的生活😭😭😭😭\n我只是区罢了……",
					textEn:
						"That sounds so nice…… There’s no life like that for me 😭😭😭😭\nI’m just bitter about it……",
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
						src: "/assets/emojis/moments/bili-0677df2c369315a08477c7ae60fef9b4d179b984.webp",
						alt: "[鸣潮·致予新世界动态表情包_好奇怪...]",
						altEn: "So strange...",
					},
				},
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1NuyDzLEEs/",
				title: "我发现两个人真的很喜欢彼此以后 会有一个特别幼稚的习惯",
				titleEn:
					"I noticed that when two people really like each other, they pick up one especially childish habit",
				poster: {
					src: "/assets/images/moments/bilibili-BV1NuyDzLEEs.webp",
					alt: "我发现两个人真的很喜欢彼此以后 会有一个特别幼稚的习惯：视频封面",
					altEn:
						"Video cover: I noticed that when two people really like each other, they pick up one especially childish habit",
				},
			},
		},
		{
			id: "bilibili-1275215295311511575",
			date: "2026-11-27T10:46:38+08:00",
			content: "笑死我了",
			contentEn: "I’m dying",
			contentParts: [
				{
					text: "笑死我了",
					textEn: "I’m dying",
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
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1iFsg6nEsq/",
				title: "图灵奖得主：中国高校过于看重国际声望 而忽略本科教育",
				titleEn:
					"Turing Award winner: Chinese universities care too much about international prestige and neglect undergraduate education",
				poster: {
					src: "/assets/images/moments/bilibili-BV1iFsg6nEsq.webp",
					alt: "图灵奖得主：中国高校过于看重国际声望 而忽略本科教育：视频封面",
					altEn:
						"Video cover: Turing Award winner: Chinese universities care too much about international prestige and neglect undergraduate education",
				},
			},
		},
		{
			id: "bilibili-1274999924221542457",
			date: "2026-11-26T20:50:53+08:00",
			content: "笑死了",
			contentEn: "I’m dying",
			contentParts: [
				{
					text: "笑死了",
					textEn: "I’m dying",
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
				url: "https://www.bilibili.com/video/BV1ahyUzHEQ9/",
				title: "当我在大学食堂绑定了KPL直播系统后...",
				titleEn:
					"I hooked up my university cafeteria to a KPL broadcast system...",
				poster: {
					src: "/assets/images/moments/bilibili-BV1ahyUzHEQ9.webp",
					alt: "当我在大学食堂绑定了KPL直播系统后...：视频封面",
					altEn:
						"Video cover: I hooked up my university cafeteria to a KPL broadcast system...",
				},
			},
		},
		{
			id: "bilibili-1274998876234842112",
			date: "2026-11-26T20:46:49+08:00",
			content: "老大嫁作商人妇…",
			contentEn: "Boss married a merchant and became his wife…",
			contentParts: [
				{
					text: "老大嫁作商人妇…",
					textEn: "Boss married a merchant and became his wife…",
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
				url: "https://www.bilibili.com/video/BV1whyLzVENM/",
				title: "🤓👆🏻老大我们怎么有公司社保了！",
				titleEn:
					"🤓👆🏻 Boss, since when do we have company social insurance?!",
				poster: {
					src: "/assets/images/moments/bilibili-BV1whyLzVENM.webp",
					alt: "🤓👆🏻老大我们怎么有公司社保了！：视频封面",
					altEn:
						"Video cover: 🤓👆🏻 Boss, since when do we have company social insurance?!",
				},
			},
		},
		{
			id: "bilibili-1274979849494069249",
			date: "2026-11-26T19:32:59+08:00",
			content: "TCP真的笑死我了",
			contentEn: "The TCP joke is killing me",
			contentParts: [
				{
					text: "TCP真的笑死我了",
					textEn: "The TCP joke is killing me",
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
					emoji: {
						src: "/assets/emojis/moments/bili-23b19246702e841f43fb28c307406bd3fbe54046.webp",
						alt: "[鸣潮·致予新世界动态表情包_哇哦~]",
						altEn: "Wow",
					},
				},
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1BNy6zTEtw/",
				title:
					"婚礼现场新郎“复盘”恋爱账走红！恋爱不到1300天 新娘提了1341次分手他回了1342次“不行”",
				titleEn:
					"A groom’s wedding recap goes viral: in under 1,300 days, the bride tried to break up 1,341 times and he said no 1,342 times",
				poster: {
					src: "/assets/images/moments/bilibili-BV1BNy6zTEtw.webp",
					alt: "婚礼现场新郎“复盘”恋爱账走红！恋爱不到1300天 新娘提了1341次分手他回了1342次“不行”：视频封面",
					altEn:
						"Video cover: A groom’s wedding recap goes viral: in under 1,300 days, the bride tried to break up 1,341 times and he said no 1,342 times",
				},
			},
		},
		{
			id: "with-her-forever-nov26",
			date: "2026-11-26T20:49:30+11:00",
			content:
				"谁不想一谈好几年\n狗屁新鲜感\n恶心\n重新认识一个人太难了\n我已经没有精力去认识了\n我想和一个人永远在一起\n永远\n我只想和她在一起\n永远...呀",
			contentEn:
				"Who doesn’t want a relationship that lasts for years?\nFuck the thrill of something new\nIt disgusts me\nGetting to know someone all over again is too hard\nI don’t have the energy for it anymore\nI want to be with one person forever\nForever\nI just want to be with her\nForever… you know",
		},
		{
			id: "bilibili-1274928322808119318",
			date: "2026-11-26T16:13:02+08:00",
			content: "长脑子了…",
			contentEn: "I can feel my brain growing…",
			contentParts: [
				{
					text: "长脑子了…",
					textEn: "I can feel my brain growing…",
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
				url: "https://www.bilibili.com/video/BV1PEsh6ZEEY/",
				title:
					"我给《Minecraft》里的一只鸡定下两条规则，结果它造出了这个 - Catica - 英语原声/中配",
				titleEn:
					"I gave a chicken in Minecraft two rules, and it built this — Catica (English original / Chinese dub)",
				poster: {
					src: "/assets/images/moments/bilibili-BV1PEsh6ZEEY.webp",
					alt: "我给《Minecraft》里的一只鸡定下两条规则，结果它造出了这个 - Catica - 英语原声/中配：视频封面",
					altEn:
						"Video cover: I gave a chicken in Minecraft two rules, and it built this — Catica (English original / Chinese dub)",
				},
			},
		},
		{
			id: "bilibili-1274926763710873616",
			date: "2026-11-26T16:06:59+08:00",
			content: "好样的，没丢份…👍🏻",
			contentEn: "Well done. You made us proud…👍🏻",
			contentParts: [
				{
					text: "好样的，没丢份…👍🏻",
					textEn: "Well done. You made us proud…👍🏻",
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
				url: "https://www.bilibili.com/video/BV1kYyQzmEyn/",
				title: "我还是觉得挽昼三合一是对德蕾琪娜的不公平",
				titleEn:
					"I still think making Dialyn three characters in one is unfair to her",
				poster: {
					src: "/assets/images/moments/bilibili-BV1kYyQzmEyn.webp",
					alt: "我还是觉得挽昼三合一是对德蕾琪娜的不公平：视频封面",
					altEn:
						"Video cover: I still think making Dialyn three characters in one is unfair to her",
				},
			},
		},
		{
			id: "bilibili-1274823096076861448",
			date: "2026-11-26T09:24:42+08:00",
			content:
				"没绷住…\n刀工依旧什么钱都不愿意花，最愿意花的就是结婚的钱贷款结婚的鲨臂来",
			contentEn:
				"I lost it…\nThese guys still won’t spend money on anything except getting marriedHere come the idiots taking out loans to get married",
			contentParts: [
				{
					text: "没绷住…",
					textEn: "I lost it…",
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
					text: "\n刀工依旧什么钱都不愿意花，最愿意花的就是结婚的钱",
					textEn:
						"\nThese guys still won’t spend money on anything except getting married",
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
					emoji: {
						src: "/assets/emojis/moments/bili-f417f03c04c919547dafe18dfacf86d605b0403f.webp",
						alt: "[鸣潮2周年同人绘画动态表情包_拔刀]",
						altEn: "Drawing a sword",
					},
				},
				{
					emoji: {
						src: "/assets/emojis/moments/bili-f417f03c04c919547dafe18dfacf86d605b0403f.webp",
						alt: "[鸣潮2周年同人绘画动态表情包_拔刀]",
						altEn: "Drawing a sword",
					},
				},
				{
					text: "贷款结婚的鲨臂来",
					textEn: "Here come the idiots taking out loans to get married",
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
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1cSnj6iELT/",
				title: "两个力工比彩礼",
				titleEn: "Two workers compare bride prices",
				poster: {
					src: "/assets/images/moments/bilibili-BV1cSnj6iELT.webp",
					alt: "两个力工比彩礼：视频封面",
					altEn: "Video cover: Two workers compare bride prices",
				},
			},
		},
		{
			id: "bilibili-1274817169017798661",
			date: "2026-11-26T09:01:42+08:00",
			content: "比那糟糕…",
			contentEn: "It’s worse than that…",
			contentParts: [
				{
					text: "比那糟糕…",
					textEn: "It’s worse than that…",
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
				url: "https://www.bilibili.com/video/BV1SUyRzPEf1/",
				title: "他们不会牵过手了吧…？",
				titleEn: "They haven’t actually held hands, have they…?",
				poster: {
					src: "/assets/images/moments/bilibili-BV1SUyRzPEf1.webp",
					alt: "他们不会牵过手了吧…？：视频封面",
					altEn: "Video cover: They haven’t actually held hands, have they…?",
				},
			},
		},
		{
			id: "bilibili-1274809738763173892",
			date: "2026-11-26T08:32:52+08:00",
			content: "笑死我了呀，这个我也能干好吧",
			contentEn: "I’m dying. Even I could do that job, right?",
			contentParts: [
				{
					text: "笑死我了呀，这个我也能干好吧",
					textEn: "I’m dying. Even I could do that job, right?",
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
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1xGW36TEwZ/",
				title: "Token Infra工程师面试体验",
				titleEn: "What a Token Infra engineer interview is like",
				poster: {
					src: "/assets/images/moments/bilibili-BV1xGW36TEwZ.webp",
					alt: "Token Infra工程师面试体验：视频封面",
					altEn: "Video cover: What a Token Infra engineer interview is like",
				},
			},
		},
		{
			id: "bilibili-1274648170653024293",
			date: "2026-11-25T22:05:54+08:00",
			content: "帅哭了",
			contentEn: "So cool I could cry",
			contentParts: [
				{
					text: "帅哭了",
					textEn: "So cool I could cry",
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
				url: "https://www.bilibili.com/video/BV1esyZz7ExF/",
				title: "《绝区零》挽昼角色展示 | 日陨之前",
				titleEn:
					"Zenless Zone Zero | Dialyn Character Showcase: Before the Sun Falls",
				poster: {
					src: "/assets/images/moments/bilibili-BV1esyZz7ExF.webp",
					alt: "《绝区零》挽昼角色展示 | 日陨之前：视频封面",
					altEn:
						"Video cover: Zenless Zone Zero | Dialyn Character Showcase: Before the Sun Falls",
				},
			},
		},
		{
			id: "bilibili-1274593796346085414",
			date: "2026-11-25T18:34:54+08:00",
			content:
				"请输入文本\n\n我们不要再聊音乐、游戏、二次元和小动物了好吗？ 我们可以聊聊你最近的项目进展吗？ 做到哪一步了呀，有能放进简历的成果了吗？ 你负责的部分多吗，面试的时候能讲清楚吗？ 如果还没想好读研还是工作，要不要两边都准备一下？ 辛苦一点也没关系，多一个选择总是好的。 \n\n你想去哪个城市实习呀，北京、上海，还是杭州？ 对工资有要求吗，房补和饭补呢？ 如果钱少一点，但能在简历上多一个大厂名字，你愿意去吗？ 一周能到岗几天，至少能做三个月吗？ 你手上有几个 offer了，最想去的那家回复了吗？ 邮箱看过了吗，垃圾箱里也找找呢？ 说不定是你漏看了。\n\n对了，你开始学AI了吗，Agent做出来了吗？ 只会调用接口是不是不太够呀，要不要再加点东西？ 你最近是不是又收藏了几个教程，后来打开过吗？ 没关系，我们可以一起学。 你导师最近有空看吗，实验室的卡排得上吗？\n\n 我们聊点轻松的吧，你秋招准备得怎么样了？ 公园明年还在那里，但今年的岗位明年不一定有。 小猫应该会有人喂的，你收藏的那个岗位今晚就截止了。\n\n 你先别看天了，你网申填完了吗？ 要不我们找家咖啡馆坐坐，窗边有插座，正好把简历再改一遍。\n\n好了你也别看了，我喜欢你",
			contentEn:
				"Enter text\n\nCan we stop talking about music, games, anime, and little animals? Can we talk about how your project’s going? How far along are you? Is there anything you can put on your résumé yet? Did you do a substantial part of the work, and can you explain it clearly in an interview? If you haven’t decided between grad school and work, how about preparing for both? A little extra work is fine. It’s always good to have another option.\n\nWhere do you want to intern, Beijing, Shanghai, or Hangzhou? What kind of salary do you want? Do you need a housing or meal allowance? If the pay is a bit lower but you get a big company on your résumé, would you take it? How many days a week can you work? Can you commit to at least three months? How many offers do you have? Has your first choice replied? Have you checked your email? Look in spam, too. Maybe you missed it.\n\nOh, have you started learning AI? Did you build an agent yet? Just calling an API might not be enough. Want to add something else? Have you bookmarked more tutorials lately? Did you ever open them? It’s okay, we can learn together. Does your advisor have time to look at it? Can you get time on the lab’s GPUs?\n\nLet’s talk about something lighter. How’s your fall recruiting prep going? The park will be there next year, but this year’s jobs might not be. Someone will probably feed the cat. That job you saved closes tonight.\n\nStop looking at the sky for a minute. Have you finished your online applications? We could sit at a café. There’s a power outlet by the window, and we can go over your résumé one more time.\n\nOkay, stop looking. I like you",
			contentParts: [
				{
					text: "请输入文本\n\n我们不要再聊音乐、游戏、二次元和小动物了好吗？ 我们可以聊聊你最近的项目进展吗？ 做到哪一步了呀，有能放进简历的成果了吗？ 你负责的部分多吗，面试的时候能讲清楚吗？ 如果还没想好读研还是工作，要不要两边都准备一下？ 辛苦一点也没关系，多一个选择总是好的。 \n\n你想去哪个城市实习呀，北京、上海，还是杭州？ 对工资有要求吗，房补和饭补呢？ 如果钱少一点，但能在简历上多一个大厂名字，你愿意去吗？ 一周能到岗几天，至少能做三个月吗？ 你手上有几个 offer了，最想去的那家回复了吗？ 邮箱看过了吗，垃圾箱里也找找呢？ 说不定是你漏看了。\n\n对了，你开始学AI了吗，Agent做出来了吗？ 只会调用接口是不是不太够呀，要不要再加点东西？ 你最近是不是又收藏了几个教程，后来打开过吗？ 没关系，我们可以一起学。 你导师最近有空看吗，实验室的卡排得上吗？",
					textEn:
						"Enter text\n\nCan we stop talking about music, games, anime, and little animals? Can we talk about how your project’s going? How far along are you? Is there anything you can put on your résumé yet? Did you do a substantial part of the work, and can you explain it clearly in an interview? If you haven’t decided between grad school and work, how about preparing for both? A little extra work is fine. It’s always good to have another option.\n\nWhere do you want to intern, Beijing, Shanghai, or Hangzhou? What kind of salary do you want? Do you need a housing or meal allowance? If the pay is a bit lower but you get a big company on your résumé, would you take it? How many days a week can you work? Can you commit to at least three months? How many offers do you have? Has your first choice replied? Have you checked your email? Look in spam, too. Maybe you missed it.\n\nOh, have you started learning AI? Did you build an agent yet? Just calling an API might not be enough. Want to add something else? Have you bookmarked more tutorials lately? Did you ever open them? It’s okay, we can learn together. Does your advisor have time to look at it? Can you get time on the lab’s GPUs?",
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
					text: "\n\n 我们聊点轻松的吧，你秋招准备得怎么样了？ 公园明年还在那里，但今年的岗位明年不一定有。 小猫应该会有人喂的，你收藏的那个岗位今晚就截止了。\n\n 你先别看天了，你网申填完了吗？ 要不我们找家咖啡馆坐坐，窗边有插座，正好把简历再改一遍。\n\n好了你也别看了，我喜欢你",
					textEn:
						"\n\nLet’s talk about something lighter. How’s your fall recruiting prep going? The park will be there next year, but this year’s jobs might not be. Someone will probably feed the cat. That job you saved closes tonight.\n\nStop looking at the sky for a minute. Have you finished your online applications? We could sit at a café. There’s a power outlet by the window, and we can go over your résumé one more time.\n\nOkay, stop looking. I like you",
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
			images: [
				{
					src: "/assets/images/moments/bilibili-1274593796346085414.webp",
					width: 960,
					height: 1016,
					fit: "contain",
					alt: "一张戴女仆头饰的粉发角色表情图",
					altEn:
						"Reaction image of a pink-haired character in a maid headdress",
				},
			],
		},
		{
			id: "clouds-part-nov25",
			date: "2026-11-25T21:01:36+11:00",
			content: "拨开云雾见天日，守得云开见明月",
			contentEn:
				"Sweep away the mist to see the sun. Wait for the clouds to part and the bright moon appears.",
		},
		{
			id: "twenty-and-still-loving-nov25",
			date: "2026-11-25T19:07:22+11:00",
			content:
				"都20岁的人了\n谈个恋爱还是想着搞纯爱\n还是和小孩一样\n无时无刻期待着对方的消息\n自己无论多忙也想和对方说话\n遇到喜欢的人\n看见什么就会想着给对方买\n还是高敏感人群\n会内耗焦虑\n会想东想西\n老天爷在这个快餐式的恋爱时代\n像我们这种人真的会幸福吗",
			contentEn:
				"I’m already twenty\nStill hoping for something pure when I fall in love\nStill like a kid\nWaiting for a message from them all the time\nWanting to talk to them no matter how busy I am\nWhen I meet someone I like\nEverything I see makes me want to buy it for them\nStill too sensitive\nGetting anxious and wearing myself out\nOverthinking every little thing\nGod, in this age of fast-food romance\nCan people like us really be happy?",
		},
		{
			id: "bilibili-1274312609167835138",
			date: "2026-11-25T00:23:45+08:00",
			content: "根本没有这样的HTML！！",
			contentEn: "There’s no such thing as HTML like that!!",
			contentParts: [
				{
					text: "根本没有这样的HTML！！",
					textEn: "There’s no such thing as HTML like that!!",
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
				url: "https://www.bilibili.com/video/BV1jdyGzbE8u/",
				title:
					"我做了一个无法关闭广告且越充值广告越多的网站。大家可以去体验一下。【B站AI创造公开赛】",
				titleEn:
					"I made a website where you can’t close ads and paying adds even more. Give it a try! [Bilibili AI Creation Open]",
				poster: {
					src: "/assets/images/moments/bilibili-BV1jdyGzbE8u.webp",
					alt: "我做了一个无法关闭广告且越充值广告越多的网站。大家可以去体验一下。【B站AI创造公开赛】：视频封面",
					altEn:
						"Video cover: I made a website where you can’t close ads and paying adds even more. Give it a try! [Bilibili AI Creation Open]",
				},
			},
		},
		{
			id: "bilibili-1274279366139838498",
			date: "2026-11-24T22:14:45+08:00",
			content: "哥几个，我真的怕了",
			contentEn: "Guys, I’m honestly scared",
			contentParts: [
				{
					text: "哥几个，我真的怕了",
					textEn: "Guys, I’m honestly scared",
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
				url: "https://www.bilibili.com/video/BV1jYyez9EQG/",
				title: "玩绝区零的都不是好东西…..",
				titleEn: "Everyone who plays Zenless Zone Zero is up to no good…",
				poster: {
					src: "/assets/images/moments/bilibili-BV1jYyez9EQG.webp",
					alt: "玩绝区零的都不是好东西…..：视频封面",
					altEn:
						"Video cover: Everyone who plays Zenless Zone Zero is up to no good…",
				},
			},
		},
		{
			id: "bilibili-1274255378706595863",
			date: "2026-11-24T20:41:40+08:00",
			content: "好像串了",
			contentEn: "Looks like they got their wires crossed",
			contentParts: [
				{
					text: "好像串了",
					textEn: "Looks like they got their wires crossed",
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
				url: "https://www.bilibili.com/video/BV1eAyLzaE2A/",
				title: "这期盐都不盐了",
				titleEn: "They’re not even pretending to be subtle anymore",
				poster: {
					src: "/assets/images/moments/bilibili-BV1eAyLzaE2A.webp",
					alt: "这期盐都不盐了：视频封面",
					altEn:
						"Video cover: They’re not even pretending to be subtle anymore",
				},
			},
		},
		{
			id: "bilibili-1274237365630533650",
			date: "2026-11-24T19:31:46+08:00",
			content: "轻松绷住…",
			contentEn: "I definitely kept a straight face…",
			contentParts: [
				{
					text: "轻松绷住…",
					textEn: "I definitely kept a straight face…",
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
				url: "https://www.bilibili.com/video/BV1z4s66VEic/",
				title: "爆笑！评论区网友全是添乱的",
				titleEn: "I’m dying! Everyone in the comments is making things worse",
				poster: {
					src: "/assets/images/moments/bilibili-BV1z4s66VEic.webp",
					alt: "爆笑！评论区网友全是添乱的：视频封面",
					altEn:
						"Video cover: I’m dying! Everyone in the comments is making things worse",
				},
			},
		},
		{
			id: "bilibili-1274218961665261575",
			date: "2026-11-24T18:20:21+08:00",
			content: "对的对的",
			contentEn: "Exactly, exactly",
			contentParts: [
				{
					text: "对的对的",
					textEn: "Exactly, exactly",
				},
				{
					emoji: {
						src: "/assets/emojis/moments/bili-9dd5b961cb9a24a0e5feaeabbd8d6e6835f454fb.webp",
						alt: "[鸣潮2周年同人绘画动态表情包_对的]",
						altEn: "Exactly",
					},
				},
				{
					emoji: {
						src: "/assets/emojis/moments/bili-9dd5b961cb9a24a0e5feaeabbd8d6e6835f454fb.webp",
						alt: "[鸣潮2周年同人绘画动态表情包_对的]",
						altEn: "Exactly",
					},
				},
				{
					emoji: {
						src: "/assets/emojis/moments/bili-9dd5b961cb9a24a0e5feaeabbd8d6e6835f454fb.webp",
						alt: "[鸣潮2周年同人绘画动态表情包_对的]",
						altEn: "Exactly",
					},
				},
			],
			media: {
				type: "bilibili",
				url: "https://www.bilibili.com/video/BV1vryfzsEXN/",
				title: "大内卷时代，普通人该如何时间管理？",
				titleEn:
					"How can ordinary people manage their time in the age of relentless competition?",
				poster: {
					src: "/assets/images/moments/bilibili-BV1vryfzsEXN.webp",
					alt: "大内卷时代，普通人该如何时间管理？：视频封面",
					altEn:
						"Video cover: How can ordinary people manage their time in the age of relentless competition?",
				},
			},
		},
		...personalPagesConfig.moments.items,
	],
};
