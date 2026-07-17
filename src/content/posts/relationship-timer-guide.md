---
title: 在 Firefly 中实现恋爱计时组件
published: 2026-07-17
description: 丝丝线线牵连，春秋几声叹
image: random
tags: [Astro, 组件, 使用指南]
category: 指南
draft: false
---

本文记录「恋爱计时」卡片的实现过程。界面参考了 [Hyde Blog 的恋爱计时组件](https://seasir.top/posts/RelationshipTimer/)，代码则根据本站现有的 Firefly 项目结构重新编写。

## 组件效果与功能

这个组件主要包含三部分：

- 卡片标题和双方名字；
- 两张圆形头像，以及中间轻微跳动的爱心；
- 按年、月、日、时、分、秒显示的计时内容，每秒更新一次。

桌面端可以将它放在侧栏，移动端则可以加入底部组件列表。头像未配置时，可回退显示名字首字符，避免出现空白或破图。

## 拆分配置与类型

名字、头像和起始日期属于可变内容，适合集中放在配置文件中，而不是直接写进组件模板。

先在 `src/types/relationshipConfig.ts` 中定义配置类型：

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

然后创建 `src/config/relationshipConfig.ts`：

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

第一张头像直接复用个人资料卡中的配置。以后修改站点头像时，恋爱计时组件也会同步更新，不需要重复维护。

`startAt` 建议使用完整的 ISO 8601 时间。示例中的 `+11:00` 是悉尼夏令时的 UTC 偏移，可以让浏览器准确识别起始时间。相比只写 `2026-02-06`，完整时间格式在不同运行环境中更稳定，也更容易排查时区问题。

## 搭建组件结构

组件文件放在 `src/components/widget/RelationshipTimer.astro`。外层继续使用 Firefly 自带的 `WidgetLayout`，这样可以直接沿用站点现有的圆角、背景色和暗色模式样式。

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

`widgetId` 会在每次渲染时生成独立值。即使桌面侧栏和移动端组件同时存在，也不会使用重复的 HTML `id`。

头像使用 `ImageWrapper` 处理，而不是直接写普通的 `<img>`。这样既能保留 Astro 的图片优化，也能统一处理懒加载、尺寸和响应式资源：

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

计时字段不需要分别设置六个全局 `id`。这里使用 `data-timer-unit` 标记各个单位，脚本只在当前组件内部查找并更新对应元素：

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

## 按自然日历计算时长

如果只显示累计天数，直接计算两个时间戳的差值即可。但组件需要分别显示年、月和日，不能简单地将毫秒除以 365 天或 30 天，因为每个月的天数不同，闰年也会影响结果。

这里采用逐段计算的方式：从起始日期开始，依次增加完整的年、月和日，再把剩余毫秒换算为时、分、秒。

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

切换年份或月份前，先把日期设为当月 1 日，可以避免“1 月 31 日加一个月”产生日期溢出。随后再根据目标月份的实际天数修正日期，因此二月和闰年也能得到正确结果。

## 管理计时器生命周期

Firefly 的页面切换不一定会触发完整刷新。如果直接在 `window` 上创建全局 `setInterval`，组件离开页面后，计时任务仍可能继续运行。多次切换页面后，还可能出现重复计时器。

为避免这个问题，可以使用自定义元素管理组件的创建和销毁：

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

元素挂载时启动计时，移除时清理定时任务。所有查询都限定在当前元素内部，因此页面上同时存在多个组件实例时，它们也只会更新自己的内容。

## 注册侧栏组件

在 `src/components/layout/SideBar.astro` 中引入组件，并将它加入组件映射表：

```ts
import RelationshipTimer from "@/components/widget/RelationshipTimer.astro";

const componentMap = {
	// 其他组件……
	relationship: RelationshipTimer,
};
```

接着在 `src/types/sidebarConfig.ts` 的 `WidgetComponentType` 联合类型中加入 `"relationship"`。这样如果配置中的组件名称写错，TypeScript 会在构建前直接提示。

最后在 `src/config/sidebarConfig.ts` 中添加组件配置：

```ts
{
	type: "relationship",
	enable: true,
	position: "sticky",
	showOnPostPage: false,
},
```

`position: "sticky"` 表示组件按照侧栏布局正常排列；`showOnPostPage: false` 表示它只显示在首页等非文章页面。若希望文章页也显示，将其改为 `true` 即可。

移动端可以添加相同类型的配置，但不需要填写 `position`。

## 修改配置与构建检查

组件完成后，日常需要调整的内容都集中在 `src/config/relationshipConfig.ts`：

- 修改 `startAt`，调整计时起点；
- 修改 `people`，更换名字和头像；
- 修改 `heart`，替换中间的符号；
- 修改 `title`，更换卡片标题。

头像文件可以统一放在 `src/assets/images/relationship/`。如果暂时没有头像，建议保留首字符回退样式，避免页面出现破图图标。

完成修改后，运行以下命令检查类型并确认项目可以正常构建：

```bash
pnpm check
pnpm type-check
pnpm build
```

这个组件不依赖接口，也没有复杂的数据来源。配置好起始时间和头像后，它就会在侧栏中持续记录两个人共同经过的时间。
