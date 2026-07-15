---
title: 每日一言组件的实现方式
published: 2026-07-15
description: 给 Firefly 的侧栏做一张每日一言卡片，让同一天的内容保持稳定，并处理接口超时、缓存、多实例复用与站内切页后的组件生命周期。
image: random
tags: [Astro, Firefly, 组件, 使用指南]
category: 博客指南
draft: false
---

侧栏里的一句话看起来没有多少代码：请求接口，把文字放进卡片，就结束了。实际接进博客之后，我很快遇到了几个不太舒服的细节——每切一次页面句子就变一次、左右侧栏同时出现时会发出重复请求，网络稍慢还会让“加载中”一直挂在那里。

于是现在这张「今日一言」卡片多做了几件事：同一天只取一条内容，多个组件共用同一次请求；接口不可用时及时换成本地句子；到了第二天，即使网页一直没有关闭，也会自动更新。

## 先确定组件的行为

这次需要的效果并不复杂：

- 卡片显示一句正文和出处，样式沿用 Firefly 的侧栏组件；
- 点击卡片可以前往这句话在一言网站上的详情页；
- 同一个浏览器在同一天内看到的内容保持不变；
- 接口超时或返回异常时显示预设文案，不留下空白卡片；
- 桌面侧栏与移动端组件同时存在时，只发出一次请求。

这里的“每日”按访问者设备的本地日期计算。悉尼已经进入新的一天时，不必等到其他时区也跨过零点；访客自己的零点就是组件更新的边界。

## 把接口和回退内容放进配置

容易调整的内容仍然留在 `src/config/visitorWidgetsConfig.ts`，组件只负责读取和展示：

```ts
dailyQuote: {
	api: "https://v1.hitokoto.cn/?encode=json&max_length=45&c=d&c=i&c=k",
	fallbackText: "心有微光，自会抵达想去的地方。",
	fallbackAuthor: "本站",
},
```

`max_length=45` 用来限制句子长度，避免一张侧栏卡片被撑得太高。后面的分类参数决定内容范围，以后想换风格时只改这里，不需要碰组件结构。

对应的类型放在 `src/types/visitorWidgetsConfig.ts`：

```ts
dailyQuote: {
	api: string;
	fallbackText: string;
	fallbackAuthor: string;
};
```

这样少写一项配置或把地址写成其他类型，TypeScript 会在构建前直接指出来。

## 先搭好卡片外壳

组件文件是 `src/components/widget/DailyQuote.astro`。外层直接使用项目已有的 `card-base`，标题颜色、圆角和暗色模式就会自动跟随本站主题。

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

接口地址和备用文字通过 `data-*` 传给浏览器端脚本。这样组件不需要把配置再抄一遍，也方便同一个模板渲染在不同位置。

`daily-quote-widget` 是一个自定义元素。它在没有脚本时仍能留下完整的 HTML 外壳；脚本加载后，再接管请求、缓存和文字更新。

## 给接口返回值划清边界

一言接口返回的字段很多，卡片实际只关心正文、出处、作者和 UUID。先为这几项写一个窄一些的类型：

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

`QuoteResponse` 对应远端数据，字段都按“不一定存在”处理；`QuoteData` 则是组件内部已经整理好的结果。接口数据进入页面之前先转换一次，后面的渲染逻辑就不用反复判断字段。

出处由作者和作品名拼起来：

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

有作者时会显示“作者 · 出处”，只有作品名时也不会多出一个空分隔符。

## 同一天只取一次内容

日期键使用访问者本地时间生成：

```ts
function getLocalDateKey() {
	return new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}
```

`en-CA` 会得到类似 `2026-07-15` 的稳定格式，很适合拿来做缓存键。缓存里同时保存日期和整理后的句子：

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

日期相同就直接使用；日期不同则重新请求。读取和写入都放在 `try...catch` 中，因为隐私模式或严格的浏览器策略可能禁用本地存储。缓存失效不应该让整张卡片也跟着失效。

## 别让一次请求无限等待

请求前先创建 `AbortController`，八秒后主动取消：

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

这里没有把错误直接显示给读者。天气、统计这类卡片出现错误提示还有排查价值，一句每日文案则更适合安静地换成本地内容。无论接口失败还是超时，侧栏的尺寸和阅读节奏都不会突然改变。

## 多张卡片共用同一个请求

Firefly 在宽屏侧栏和移动端底部可能各渲染一份组件。如果每个实例都独立执行 `fetch`，第一次打开页面就会拿到两句不同的话。

现在的做法是在当前页面运行环境中共享一个 Promise：

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

第一个实例负责创建请求，后面的实例等待同一个 Promise。它们最后拿到完全一致的正文，也不会给接口增加无意义的访问。

## 到零点以后自动换一句

如果博客页面开了一整晚，只依赖下次刷新并不算真正的“每日”。自定义元素在连接到页面时计算距离下一个本地零点还有多久：

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

定时点放在零点后一秒，避开设备时间刚好切换时的边界。组件离开页面时清理计时器，站内跳转多次也不会在后台积累一串旧任务。

## 渲染时只改文字

最后一步只更新三个已经存在的节点：

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

正文使用 `textContent`，不把远端内容当作 HTML 插入。接口返回 UUID 时才生成详情链接；本地回退句子没有对应页面，就去掉 `href`，避免出现一个看似能点击却没有目标的链接。

## 把组件放进侧栏

在 `src/components/layout/SideBar.astro` 中引入组件，并加入映射表：

```ts
import DailyQuote from "@/components/widget/DailyQuote.astro";

const componentMap = {
	// 其他侧栏组件……
	dailyQuote: DailyQuote,
};
```

然后在 `src/config/sidebarConfig.ts` 决定它出现的位置：

```ts
{
	type: "dailyQuote",
	enable: true,
	position: "top",
	showOnPostPage: true,
},
```

如果只想在主页显示，把 `showOnPostPage` 改成 `false`；不想展示时则把 `enable` 改成 `false`。移动端底部组件也使用同一个 `type`，不用再写第二套卡片。

## 后面通常只需要改配置

日常调整集中在 `src/config/visitorWidgetsConfig.ts`：

- 修改 `api`，调整一言分类和最大长度；
- 修改 `fallbackText`，更换断网时显示的句子；
- 修改 `fallbackAuthor`，更换回退内容的署名。

卡片位置则由 `src/config/sidebarConfig.ts` 控制。除非要改变缓存规则或展示结构，否则组件文件不需要经常修改。

这张卡片最终仍然只占侧栏里很小的一块地方。缓存、回退和生命周期这些代码平时几乎不会被读者注意到，但它们能保证无论接口快慢、页面怎样切换，那句话都稳稳地留在那里。对一个每天都会出现的小组件来说，这种不打扰人的稳定感比多做几种动画更重要。
