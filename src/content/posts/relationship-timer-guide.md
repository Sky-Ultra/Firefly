---
title: 恋爱计时组件的原理和实现方式
published: 2026-07-15
description: 给 Firefly 的侧栏加一张恋爱计时卡片，记录两个人的名字、头像和相伴时间，同时处理好时区、月份天数与站内切页后的计时器清理。
image: random
tags: [Astro, Firefly, 组件, 使用指南]
category: 博客指南
draft: false
---

侧栏里的计时卡最初只是想记住一个日期：两张头像、一个爱心，再放一串不断变化的数字。真正写起来后，麻烦的地方反而不在样式，而在那些容易被忽略的小事——访客身处不同时区会不会差一天，以及站内切换页面后会不会悄悄留下好几个定时器。

这篇文章记一下现在这张「恋爱计时」卡片的实现过程。界面构思参考了 [Hyde Blog 的恋爱计时组件](https://seasir.top/posts/RelationshipTimer/)，代码则按照本站目前的 Firefly 结构重新整理过。

## 最后要做成什么

组件由三部分组成：

- 标题与双方名字；
- 两张圆形头像，中间放一个会轻微跳动的爱心；
- 年、月、日、时、分、秒六段计时，每秒更新一次。

桌面端把它放在侧栏，移动端也可以加入底部组件列表。头像缺失时显示名字的首字符，不至于让整张卡片空掉。

## 把资料留在配置文件里

名字、头像和纪念日都属于内容，不该散落在组件模板中。先在 `src/types/relationshipConfig.ts` 定义配置结构：

```ts
export type RelationshipPersonConfig = {
	name: string;
	avatar?: string;
	avatarAlt?: string;
};

export type RelationshipConfig = {
	title?: string;
	startAt: string;
	people: readonly [RelationshipPersonConfig, RelationshipPersonConfig];
	heart?: string;
};
```

随后创建 `src/config/relationshipConfig.ts`：

```ts
import type { RelationshipConfig } from "../types/relationshipConfig";
import { profileConfig } from "./profileConfig";

export const relationshipConfig: RelationshipConfig = {
	title: "恋爱计时",
	startAt: "2026-02-06T00:00:00+11:00",
	people: [
		{
			name: "Sky",
			avatar: profileConfig.avatar,
			avatarAlt: "Sky 的头像",
		},
		{
			name: "爱弥斯",
			avatar: "assets/images/relationship/aimisi.png",
			avatarAlt: "爱弥斯的头像",
		},
	],
	heart: "❤️",
};
```

第一张头像直接复用个人资料卡的配置。以后更换站点头像时，这里也会跟着变化，不必改两遍。

`startAt` 最好写成完整的 ISO 8601 时间。这里的 `+11:00` 表示悉尼夏令时的 UTC 偏移，浏览器拿到的是一个明确的时间点。只写 `2026-02-06` 虽然也能运行，但不同环境对日期字符串的解析细节容易让人心里没底。

## 组件的外壳

组件文件放在 `src/components/widget/RelationshipTimer.astro`。外层继续使用 Firefly 自带的 `WidgetLayout`，这样圆角、背景色、暗色模式和其他侧栏卡片能够保持一致。

```astro
---
import ImageWrapper from "@/components/common/ImageWrapper.astro";
import WidgetLayout from "@/components/common/WidgetLayout.astro";
import { relationshipConfig } from "@/config";
import type { WidgetComponentConfig } from "@/types/config";

interface Props {
	class?: string;
	style?: string;
	widgetConfig?: WidgetComponentConfig;
}

const { class: className, style, widgetConfig } = Astro.props;
const config = relationshipConfig;
const showTitle = widgetConfig?.showTitle !== false;
const widgetId = `relationship-${Math.random().toString(36).slice(2, 9)}`;
---

<WidgetLayout
	id={widgetId}
	name={config.title || "恋爱计时"}
	showTitle={showTitle}
	class={className}
	style={style}
>
	<relationship-timer data-start-at={config.startAt} class="block">
		<!-- 名字、头像与计时数字放在这里 -->
	</relationship-timer>
</WidgetLayout>
```

`widgetId` 每次渲染都会生成一个独立值。桌面侧栏与移动端组件同时存在时，它们不会抢用同一个 HTML `id`。

头像建议交给 `ImageWrapper` 处理，而不是直接写普通的 `<img>`。本地图片可以继续参与 Astro 的图片优化，也能统一懒加载和尺寸信息：

```astro
<div class="mb-6 flex items-center justify-center gap-4">
	<ImageWrapper
		src={config.people[0].avatar}
		alt={config.people[0].avatarAlt || config.people[0].name}
		class="h-16 w-16 rounded-full border-2 border-white shadow-md dark:border-neutral-800"
		widths={[64, 128]}
		sizes="64px"
	/>

	<span class="text-2xl text-red-500 motion-safe:animate-pulse">
		{config.heart || "❤️"}
	</span>

	<ImageWrapper
		src={config.people[1].avatar}
		alt={config.people[1].avatarAlt || config.people[1].name}
		class="h-16 w-16 rounded-full border-2 border-white shadow-md dark:border-neutral-800"
		widths={[64, 128]}
		sizes="64px"
	/>
</div>
```

计时数字不用分别设置六个全局 `id`，而是在当前组件内部使用 `data-timer-unit` 标记：

```astro
<div
	class="flex max-w-full items-center justify-center gap-x-1 overflow-x-auto whitespace-nowrap text-sm"
	role="timer"
	aria-label="相伴时间"
>
	<span data-timer-unit="years">0</span><span class="timer-unit bg-red-400">年</span>
	<span data-timer-unit="months">0</span><span class="timer-unit bg-red-300">月</span>
	<span data-timer-unit="days">0</span><span class="timer-unit bg-blue-400">天</span>
	<span data-timer-unit="hours">0</span><span class="timer-unit bg-orange-400">时</span>
	<span data-timer-unit="minutes">0</span><span class="timer-unit bg-blue-500">分</span>
	<span data-timer-unit="seconds">00</span><span class="timer-unit bg-purple-400">秒</span>
</div>
```

## 时间不能只除以 365 天

如果只显示“总天数”，两个时间戳相减就够了。但这里要拆成年月日，直接把毫秒依次除以 365 天和 30 天会逐渐产生偏差，因为月份长度并不固定。

现在的做法是沿着开始日期逐段推进：先尝试加整年，再加整月和整日，最后把剩余毫秒换算成时分秒。

```ts
type DurationParts = {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

const daysInMonth = (year: number, month: number): number =>
	new Date(year, month + 1, 0).getDate();

const addYears = (date: Date, years: number): Date => {
	const result = new Date(date);
	const month = result.getMonth();
	const day = result.getDate();
	const targetYear = result.getFullYear() + years;
	result.setDate(1);
	result.setFullYear(targetYear);
	result.setMonth(month);
	result.setDate(Math.min(day, daysInMonth(targetYear, month)));
	return result;
};

const addMonths = (date: Date, months: number): Date => {
	const result = new Date(date);
	const day = result.getDate();
	const targetMonthIndex =
		result.getFullYear() * 12 + result.getMonth() + months;
	const targetYear = Math.floor(targetMonthIndex / 12);
	const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
	result.setDate(1);
	result.setFullYear(targetYear);
	result.setMonth(targetMonth);
	result.setDate(Math.min(day, daysInMonth(targetYear, targetMonth)));
	return result;
};

const addDays = (date: Date, days: number): Date => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

const getDuration = (start: Date, now: Date): DurationParts => {
	if (now.getTime() < start.getTime()) {
		return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
	}

	let years = now.getFullYear() - start.getFullYear();
	if (addYears(start, years).getTime() > now.getTime()) years -= 1;

	let cursor = addYears(start, Math.max(0, years));
	let months =
		(now.getFullYear() - cursor.getFullYear()) * 12 +
		(now.getMonth() - cursor.getMonth());
	if (addMonths(cursor, months).getTime() > now.getTime()) months -= 1;
	months = Math.max(0, months);
	cursor = addMonths(cursor, months);

	let days = Math.floor(
		(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
			Date.UTC(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())) /
			86_400_000,
	);
	if (addDays(cursor, days).getTime() > now.getTime()) days -= 1;
	days = Math.max(0, days);
	cursor = addDays(cursor, days);

	let remaining = Math.max(0, now.getTime() - cursor.getTime());
	const hours = Math.floor(remaining / 3_600_000);
	remaining %= 3_600_000;
	const minutes = Math.floor(remaining / 60_000);
	remaining %= 60_000;
	const seconds = Math.floor(remaining / 1000);

	return { years: Math.max(0, years), months, days, hours, minutes, seconds };
};
```

把日期暂时设为每月 1 日，再切换年份或月份，是为了避开“1 月 31 日加一个月”这类自动溢出问题。最后用目标月份的实际天数夹住日期，闰年的 2 月也会自然算对。

## 让计时器跟着组件一起离开

Firefly 的页面切换不是每次都完整刷新。如果用一个挂在 `window` 上的全局 `setInterval`，组件已经离开页面后，它仍可能继续运行。多逛几篇文章，后台就会留下重复的任务。

这里用一个自定义元素管理生命周期：

```ts
class RelationshipTimerElement extends HTMLElement {
	private timeoutId?: number;

	connectedCallback(): void {
		if (this.timeoutId !== undefined) return;
		this.update();
		this.scheduleNextTick();
	}

	disconnectedCallback(): void {
		if (this.timeoutId !== undefined) window.clearTimeout(this.timeoutId);
		this.timeoutId = undefined;
	}

	private scheduleNextTick(): void {
		const delay = 1000 - (Date.now() % 1000) + 20;
		this.timeoutId = window.setTimeout(() => {
			this.update();
			this.scheduleNextTick();
		}, delay);
	}

	private update(): void {
		const startTimestamp = Date.parse(this.dataset.startAt || "");
		if (!Number.isFinite(startTimestamp)) return;

		const values = getDuration(new Date(startTimestamp), new Date());
		for (const [unit, value] of Object.entries(values)) {
			const element = this.querySelector<HTMLElement>(
				`[data-timer-unit="${unit}"]`,
			);
			if (element) {
				element.textContent =
					unit === "seconds" ? String(value).padStart(2, "0") : String(value);
			}
		}
	}
}

if (!customElements.get("relationship-timer")) {
	customElements.define("relationship-timer", RelationshipTimerElement);
}
```

元素进入页面时启动，离开时清理。查询范围也限定在 `this` 内部，所以即使页面上有两个实例，也只会更新各自的数字。

## 把它放进侧栏

在 `src/components/layout/SideBar.astro` 中引入组件，并加入映射表：

```ts
import RelationshipTimer from "@/components/widget/RelationshipTimer.astro";

const componentMap = {
	// 其他组件……
	relationship: RelationshipTimer,
};
```

同时在 `src/types/sidebarConfig.ts` 的 `WidgetComponentType` 联合类型中加入 `"relationship"`，这样配置文件写错名称时，TypeScript 会直接提醒。

最后在 `src/config/sidebarConfig.ts` 选择组件的位置：

```ts
{
	type: "relationship",
	enable: true,
	position: "sticky",
	showOnPostPage: false,
},
```

`position: "sticky"` 会让它跟随侧栏内容正常排列；`showOnPostPage: false` 表示只在主页等非文章页面显示。如果希望读文章时也能看见，把它改成 `true` 即可。移动端同样添加一份配置，只是不需要填写 `position`。

## 后续修改其实只动一处

组件完成后，日常最常改的内容都集中在 `src/config/relationshipConfig.ts`：

- 改 `startAt`，调整起算时间；
- 改 `people` 中的名字与头像；
- 改 `heart`，换成其他符号；
- 改 `title`，更换卡片标题。

头像文件建议放在 `src/assets/images/relationship/`。如果暂时没有头像，也可以在模板里保留首字符回退样式，至少不会出现破图图标。

写完后运行一次检查和构建：

```bash
pnpm check
pnpm type-check
pnpm build
```

这张卡片没有复杂的数据源，也不需要额外接口。它只是安静地待在侧栏里，把一个普通的日期一秒一秒地往前写。对我来说，这就已经够了。
