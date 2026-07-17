---
title: 每日一言组件的实现方式
published: 2026-07-14
description: 介绍每日一言组件的接口配置、缓存策略、请求复用与自动刷新方式
image: random
tags: [Astro, 组件, 使用指南]
category: 指南
draft: false
---

这篇文章记录本站「每日一言」侧栏组件的实现过程。组件会从一言接口获取内容，并按访问者的本地日期进行缓存；当接口请求失败时，则自动显示预设文案。

## 配置接口与回退内容

可调整的内容统一放在 `src/config/visitorWidgetsConfig.ts` 中，组件只负责读取配置和渲染结果：

```ts
dailyQuote: {
	api: "https://v1.hitokoto.cn/?encode=json&max_length=45&c=d&c=i&c=k",
	fallbackText: "心有微光，自会抵达想去的地方。",
	fallbackAuthor: "本站",
},
```

`max_length=45` 用于限制句子长度，避免内容过长影响侧栏布局。后面的分类参数决定返回内容的范围，调整文案风格时只需修改接口地址，不必改动组件结构。

对应的类型定义位于 `src/types/visitorWidgetsConfig.ts`：

```ts
dailyQuote: {
	api: string;
	fallbackText: string;
	fallbackAuthor: string;
};
```

类型约束可以在构建前检查配置是否完整，也能避免将错误的数据类型传入组件。

## 创建卡片结构

组件文件为 `src/components/widget/DailyQuote.astro`。外层沿用项目已有的 `card-base` 样式，使圆角、背景和暗色模式与其他侧栏卡片保持一致。

```astro
---
import { Icon } from "astro-icon/components";
import { visitorWidgetsConfig } from "@/config/visitorWidgetsConfig";

const config = visitorWidgetsConfig.dailyQuote;
---

<daily-quote-widget
	class="block card-base p-4"
	data-api={config.api}
	data-fallback-text={config.fallbackText}
	data-fallback-author={config.fallbackAuthor}
>
	<div class="mb-3 ml-4 flex items-center gap-2 font-bold text-lg">
		<Icon name="material-symbols:auto-awesome-rounded" />
		<span>今日一言</span>
	</div>

	<a data-quote-link target="_blank" rel="noopener noreferrer">
		<blockquote data-quote-text>“正在获取今日一言…”</blockquote>
		<p data-quote-author>—— 一言</p>
	</a>
</daily-quote-widget>
```

接口地址和备用文案通过 `data-*` 属性传给浏览器端脚本，避免在模板与脚本中重复维护同一份配置。

`daily-quote-widget` 是一个自定义元素。即使脚本尚未加载，页面仍会保留完整的卡片结构；脚本运行后，再负责请求数据、读取缓存和更新文字。

## 整理接口数据

一言接口会返回多个字段，但组件实际只需要正文、出处、作者和 UUID。先为远端响应和组件内部数据分别定义类型：

```ts
type QuoteData = {
	text: string;
	author: string;
	uuid?: string;
};

type QuoteResponse = {
	hitokoto?: string;
	from?: string;
	from_who?: string | null;
	uuid?: string;
};
```

`QuoteResponse` 对应接口的原始响应，因此字段都按可选值处理；`QuoteData` 则是经过整理后供组件使用的统一格式。数据在入口处完成转换后，后续渲染逻辑无需反复判断接口字段。

作者与出处通过以下方式组合：

```ts
const source = [data.from_who, data.from]
	.filter((item): item is string => Boolean(item))
	.join(" · ");

const quote: QuoteData = {
	text: data.hitokoto,
	author: source || "一言",
	uuid: data.uuid,
};
```

当作者和作品名同时存在时，页面会显示“作者 · 出处”；只有其中一项时，也不会出现多余的分隔符。

## 按日期缓存内容

每日一言应当在同一天保持一致，因此缓存键需要基于访问者的本地日期生成：

```ts
function getLocalDateKey() {
	return new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}
```

`en-CA` 会生成类似 `2026-07-15` 的日期格式，适合作为稳定的缓存标识。缓存中同时保存日期和整理后的内容：

```ts
type QuoteCache = {
	date: string;
	value: QuoteData;
};

const QUOTE_CACHE_KEY = "firefly-daily-quote-v1";

function readQuoteCache(): QuoteData | null {
	try {
		const cache = JSON.parse(
			localStorage.getItem(QUOTE_CACHE_KEY) || "null",
		) as QuoteCache | null;

		return cache?.date === getLocalDateKey() ? cache.value : null;
	} catch {
		return null;
	}
}
```

缓存日期与当天一致时直接返回内容，否则重新请求接口。读取和写入操作都应放在 `try...catch` 中，因为部分隐私模式或浏览器策略可能限制 `localStorage`。即使缓存不可用，组件仍应正常工作。

## 处理请求超时与失败

接口请求使用 `AbortController` 设置八秒超时：

```ts
const controller = new AbortController();
const timer = window.setTimeout(() => controller.abort(), 8000);

try {
	const response = await fetch(api, {
		signal: controller.signal,
		headers: { Accept: "application/json" },
	});

	if (!response.ok) {
		throw new Error(`Request failed: ${response.status}`);
	}

	// 整理并缓存接口数据
} catch {
	return {
		text: fallbackText,
		author: fallbackAuthor,
	};
} finally {
	window.clearTimeout(timer);
}
```

请求失败、响应异常或超时后，组件会直接返回配置中的备用文案，而不是向读者显示错误信息。这样既能保持卡片尺寸稳定，也不会因外部接口暂时不可用而影响页面阅读。

## 让多个实例共享请求

Firefly 可能同时在桌面侧栏和移动端底部渲染组件。如果每个实例分别请求接口，同一次访问不仅会产生重复请求，还可能显示两句不同的内容。

这里在当前页面环境中共享同一个 Promise：

```ts
const quoteRuntime = window as Window & {
	__fireflyDailyQuotePromise?: Promise<QuoteData>;
	__fireflyDailyQuoteDate?: string;
};

function loadCurrentQuote() {
	const dateKey = getLocalDateKey();
	if (quoteRuntime.__fireflyDailyQuoteDate !== dateKey) {
		quoteRuntime.__fireflyDailyQuoteDate = dateKey;
		quoteRuntime.__fireflyDailyQuotePromise = loadQuote(this);
	}

	quoteRuntime.__fireflyDailyQuotePromise?.then((quote) =>
		this.renderQuote(quote),
	);
}
```

当天第一次加载时创建请求，其余实例等待同一个 Promise。这样所有卡片都会显示相同内容，同时避免重复访问接口。

## 在午夜自动刷新

如果页面长时间保持打开，仅在刷新页面时检查日期并不能保证内容按天更新。自定义元素会在连接到页面时计算距离下一个本地零点的时间，并安排一次刷新：

```ts
class DailyQuoteWidget extends HTMLElement {
	private midnightTimer: number | undefined;

	connectedCallback() {
		this.loadCurrentQuote();
		this.scheduleMidnightRefresh();
	}

	disconnectedCallback() {
		if (this.midnightTimer !== undefined) {
			window.clearTimeout(this.midnightTimer);
		}
	}

	private scheduleMidnightRefresh() {
		const now = new Date();
		const tomorrow = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1,
			0,
			0,
			1,
		);

		this.midnightTimer = window.setTimeout(() => {
			this.loadCurrentQuote();
			this.scheduleMidnightRefresh();
		}, tomorrow.getTime() - now.getTime());
	}
}
```

刷新时间设在零点后一秒，用于避开日期切换瞬间可能出现的边界问题。组件离开页面时会清除计时器，避免站内多次跳转后留下重复任务。

## 安全更新页面内容

取得数据后，只需更新卡片中已经存在的文字和链接节点：

```ts
private renderQuote(quote: QuoteData) {
	const text = this.querySelector<HTMLElement>("[data-quote-text]");
	const author = this.querySelector<HTMLElement>("[data-quote-author]");
	const link = this.querySelector<HTMLAnchorElement>("[data-quote-link]");

	if (text) text.textContent = `“${quote.text}”`;
	if (author) author.textContent = `—— ${quote.author}`;

	if (link) {
		if (quote.uuid) {
			link.href = `https://hitokoto.cn/?uuid=${encodeURIComponent(quote.uuid)}`;
		} else {
			link.removeAttribute("href");
		}
	}
}
```

正文使用 `textContent` 写入，不会将远端数据当作 HTML 解析。接口返回 UUID 时，卡片会链接到对应的一言详情页；备用文案没有详情页面，因此会移除 `href`，避免保留无效链接。

## 注册到侧栏

在 `src/components/layout/SideBar.astro` 中引入组件，并加入组件映射表：

```ts
import DailyQuote from "@/components/widget/DailyQuote.astro";

const componentMap = {
	// 其他侧栏组件……
	dailyQuote: DailyQuote,
};
```

然后在 `src/config/sidebarConfig.ts` 中配置显示位置：

```ts
{
	type: "dailyQuote",
	enable: true,
	position: "top",
	showOnPostPage: true,
},
```

将 `showOnPostPage` 设为 `false` 后，组件只会在主页等非文章页面显示；将 `enable` 设为 `false` 则会完全关闭该组件。移动端底部区域可以继续使用同一个 `type`，无需再创建另一套实现。

## 后续维护

日常需要调整的内容主要集中在 `src/config/visitorWidgetsConfig.ts`：

- 修改 `api`，调整一言分类或最大长度；
- 修改 `fallbackText`，更换请求失败时显示的文案；
- 修改 `fallbackAuthor`，更换备用文案的署名。

组件的显示位置由 `src/config/sidebarConfig.ts` 控制。除非需要修改缓存规则、请求策略或卡片结构，否则通常不必改动组件文件。
