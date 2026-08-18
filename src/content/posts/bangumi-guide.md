---
title: 番组计划的实现方式和原理
titleEn: How the Bangumi Tracker Works
published: 2026-08-09
description: 介绍如何从 Bangumi API 同步收藏，并组织分类、状态筛选、分页与封面卡片
descriptionEn: How the site syncs a Bangumi collection and turns it into browsable tabs, status filters, pages, and cover cards.
image: random
tags: [Astro, Svelte, 番组计划, 使用指南]
tagsEn: [Astro, Svelte, Bangumi, Guides]
category: 指南
categoryEn: Guides
draft: true
---


## 这里记录的是什么

现在页面里有三栏：

- 动画；
- 书籍；
- 音乐。

游戏已经移到独立的“游戏”页面，所以番组页中的 `game` 开关保持关闭。每个分类都会显示条目数量，并按“全部、看过、在看、想看、搁置、抛弃”等状态继续筛选。书籍和音乐会换成“读过、在读”“听过、在听”等更合适的称呼。

条目卡片使用封面作为主体，叠加标题、年份、评分、状态和少量标签。点击后打开配置好的 Bangumi 条目详情页。

## 配置从用户 ID 开始

站点级设置放在 `src/config/siteConfig.ts`：

```ts
bangumi: {
	userId: "1143164",
	mode: "dynamic",
	apiUrl: "https://bgmapi.anibt.net",
	subjectBaseUrl: "https://bgmmi.anibt.net/subject/",
	categoryOrder: ["anime", "book", "music"],
	excludedSubjectIds: {
		book: [328731],
	},
	featuredSubjects: {
		anime: [
			{ subjectId: 604826, collectionType: 2 },
			{ subjectId: 400602, collectionType: 2 },
		],
	},
},
```

`userId` 对应公开的 Bangumi 用户 ID。`apiUrl` 用来取收藏和条目信息，`subjectBaseUrl` 决定卡片最终跳向哪里。这两个地址分开配置，换 API 代理时不会误改详情链接。

分类是否启用在 `src/pages/bangumi.astro` 中声明：

```ts
categories: {
	book: true,
	anime: true,
	music: true,
	game: false,
	real: false,
},
```

Bangumi 的类型编号并不连续，页面用一张映射表把分类名与接口参数对应起来：

```ts
const categoryMap = {
	book: { id: "book", subjectType: 1 },
	anime: { id: "anime", subjectType: 2 },
	music: { id: "music", subjectType: 3 },
	game: { id: "game", subjectType: 4 },
	real: { id: "real", subjectType: 6 },
};
```

以后恢复某个分类时，需要同时确认分类开关、`categoryOrder` 和导航用途。只把 `game` 改成 `true` 虽然能取到游戏收藏，但会和本站已经独立出来的游戏页重复。

## 构建时取数据，还是打开页面再取

取数据有两种办法，我最后选了动态模式。

`static` 在构建网站时请求 Bangumi，生成的页面打开得快，也不要求访问者能够连接接口；缺点是收藏变化后必须重新构建。

`dynamic` 在访问页面时由浏览器请求接口。收藏状态更新后不必重新部署，代价是首次进入会经历加载过程，并且结果受到访问者网络与接口状态影响。本网站目前使用动态模式。

Astro 页面根据模式传入不同参数：

```astro
<BangumiGrid
	client:load
	subjectBaseUrl={bangumiConfig.subjectBaseUrl}
	fetchConfig={{
		username: bangumiConfig.username,
		apiUrl: bangumiConfig.apiUrl,
		categories: bangumiConfig.categories,
		categoryOrder: siteConfig.bangumi?.categoryOrder || [],
		pagination: bangumiConfig.pagination,
		excludedSubjectIds: siteConfig.bangumi?.excludedSubjectIds || {},
		featuredSubjects: siteConfig.bangumi?.featuredSubjects || {},
	}}
/>
```

`client:load` 让 Svelte 组件在页面加载后立即接管交互。标题和页面骨架仍由 Astro 输出，收藏数据、标签切换和分页则在浏览器端完成。

## 收藏多了，就一页一页拿

Bangumi 收藏接口使用 `limit` 和 `offset` 分页。项目每次取 50 条，直到接口返回的数量少于上限：

```ts
async function fetchCategory(
	apiUrl: string,
	username: string,
	subjectType: number,
	pagination: { limit: number; delay: number; maxTotal: number },
) {
	const { limit, delay, maxTotal } = pagination;
	let offset = 0;
	const allItems = [];

	while (true) {
		if (maxTotal > 0 && allItems.length >= maxTotal) break;

		const url = `${apiUrl}/v0/users/${username}/collections?subject_type=${subjectType}&limit=${limit}&offset=${offset}`;
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);

		const data = await response.json();
		const batch = data.data || [];
		if (batch.length === 0) break;

		allItems.push(...batch);
		offset += limit;
		if (batch.length < limit) break;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	return allItems;
}
```

短暂延迟可以减轻连续分页对接口的压力，`maxTotal` 则给循环加了一道上限。接口报错时，组件结束加载状态并显示统一错误卡片，不会把已经不完整的数据伪装成全部收藏。

## 有些条目不展示，有些要放在前面

公开收藏不一定等于想在网站上展示的全部内容。`excludedSubjectIds` 会在请求完成后按分类过滤条目：

```ts
const excludedIds = new Set(excludedSubjectIds[categoryKey] || []);
const filteredData = excludedIds.size > 0
	? fetchedData.filter((item) => !excludedIds.has(item.subject_id))
	: fetchedData;
```

`featuredSubjects` 处理另一种需求：让指定作品排在分类前面，并强制使用给定收藏状态。若指定条目不在用户收藏中，`applyFeaturedSubjects()` 会再请求一次条目详情，把结果整理成统一的 `UserSubjectCollection`。

```ts
return [
	...featuredItems.filter(
		(item): item is UserSubjectCollection => item !== null,
	),
	...items.filter((item) => !featuredIds.has(item.subject_id)),
];
```

这也是当前几部动画能够固定出现在前排的原因。配置只保存条目 ID 和状态，封面、名称、年份等资料仍由 Bangumi 提供。

## 页面不需要整份 API 响应

页面使用 `src/types/bangumi.ts` 中的 `UserSubjectCollection`。收藏状态是数字枚举：

```ts
// 1: 想看，2: 看过，3: 在看，4: 搁置，5: 抛弃
export type CollectionType = 1 | 2 | 3 | 4 | 5;

// 1: 书籍，2: 动画，3: 音乐，4: 游戏，6: 三次元
export type SubjectType = 1 | 2 | 3 | 4 | 6;
```

补充置顶条目时，`normalizeSubject()` 只保留页面会用到的字段，并给缺失的图片、评分和标签准备默认值。这样卡片组件不必反复判断 API 的嵌套字段是否存在。

## 切标签时，顺手记进 URL

`BangumiGrid.svelte` 先按照 `categoryOrder` 排列已启用分类，再生成顶部标签。当前标签保存在 Svelte 状态中：

```ts
let activeTab = $state("");

function handleTabChange(tabId: string) {
	activeTab = tabId;
}
```

点击标签时，组件还会把分类写进 URL hash：

```ts
function clickTab(tabId: string) {
	onTabChange(tabId);
	const nextHash = `#${encodeURIComponent(tabId)}`;
	if (window.location.hash !== nextHash) {
		window.history.replaceState(null, "", nextHash);
	}
}
```

页面已经加载后，前进、后退或手动修改 hash，标签会跟着变化，不必重新请求所有数据。当前代码在静态模式下还会读取首次访问时的 hash；动态模式取得数据后会先选中第一个分类，因此直接打开 `/bangumi/#book` 暂时不会自动落到书籍标签。这是现有实现仍可补上的一处细节。

## 换了筛选，页码要回到开头

每个分类交给独立的 `BangumiSection.svelte`。组件先把收藏数字映射为内部状态：

```ts
const STATUS_MAP: Record<number, string> = {
	1: "wish",
	2: "collect",
	3: "doing",
	4: "on_hold",
	5: "dropped",
};
```

筛选按钮只显示数量不为零的状态。切换筛选时，页码会回到第一页，避免读者原先停在第四页，而新结果只有一页时看到空白：

```ts
function handleFilterChange(filter: string) {
	activeFilter = filter;
	currentPage = 1;
}

const pagedItems = $derived(
	filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	),
);
```

当前每页展示 24 项。这里的分页只切分已经取得的数组，不会在每次翻页时再次访问 Bangumi。

## 封面不要一次全加载

动画、书籍和音乐可能累积出很多封面。如果页面初始化时全部请求，隐藏标签也会占用带宽。`BangumiSection` 只给当前分类的卡片传入 `loadImage=true`：

```svelte
<Card item={item} loadImage={isActive} {subjectBaseUrl} />
```

卡片据此决定是否立即写入图片 `src`，同时保留懒加载和低清占位层：

```svelte
<img
	src={loadImage ? coverSrc : undefined}
	data-src={loadImage ? undefined : coverSrc}
	alt={title}
	loading="lazy"
	decoding="async"
	onload={handleLoad}
/>
```

图片成功后才提高透明度并移除占位效果。网络较慢时，卡片尺寸仍然稳定，不会因为封面尚未抵达而上下跳动。

## 平时要改的，其实都在配置里

动态模式开始请求时，页面先显示标签、筛选器、卡片和分页的骨架。接口失败或没有数据时，再切换为对应的说明区。加载、成功、空数据和错误各自有明确分支，卡片组件不需要兼顾整页状态。

以后增删条目时，我通常不碰组件，只改 `src/config/siteConfig.ts`：

- 更换 `userId`，展示另一个公开收藏；
- 调整 `categoryOrder`，改变分类顺序；
- 在 `excludedSubjectIds` 中隐藏条目；
- 在 `featuredSubjects` 中固定条目及其状态；
- 在静态与动态模式之间切换。

真正需要动 Svelte 组件的情况，通常是增加新的筛选规则、调整分页方式或改变卡片信息。收藏内容本身留在 Bangumi 管理，会比把几十个作品逐项写进博客配置轻松得多。
