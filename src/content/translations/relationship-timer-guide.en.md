---
translationOf: relationship-timer-guide.md
sourceHash: sha256:b0bcc74cdf24f42836b1a12019971561ec3146a02f6179e3f035a120da608be2
---

This post records how the Relationship Timer card was built.  
The examples need a second name for their variables, so I use “Aimisi”, a character I like. Her portrait is blurred in the live widget, although the original image can still be found by inspecting the site's source.

## What the Widget Does

The card has three main parts:

- A title and the two names
- Two circular portraits with a gently pulsing heart between them
- A duration shown in years, months, days, hours, minutes, and seconds, updated once per second

On desktop it can sit in the sidebar; on mobile it can join the widgets below the main feed. If a portrait is missing, the card falls back to the first character of the person's name instead of leaving a blank or broken image.

## Separate Configuration from Types

Names, portraits, and the starting date are expected to change. They belong in one configuration file rather than directly inside the component template.

First, define the shape in `src/types/relationshipConfig.ts`:

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

Then create `src/config/relationshipConfig.ts`:

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

The first portrait reuses the profile-card setting. If the site's main avatar changes later, the timer follows it automatically and no second path has to be maintained.

Use a complete ISO 8601 timestamp for `startAt`. The `+11:00` in this example is the UTC offset during Sydney daylight saving time, which lets the browser interpret the starting instant precisely. A full timestamp is more predictable across environments than a bare date such as `2026-02-06`, and makes timezone mistakes easier to diagnose.

## Build the Component Markup

The component lives at `src/components/widget/RelationshipTimer.astro`. Its outer shell uses Firefly's existing `WidgetLayout`, which keeps the card's corners, background, and dark-mode styling consistent with the rest of the sidebar.

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

`widgetId` is unique for every render. Even when the desktop sidebar and mobile widget both exist, they never reuse the same HTML `id`.

The portraits use `ImageWrapper` rather than a plain `<img>`. This preserves Astro's image optimisation and gives both images the same lazy-loading, sizing, and responsive-source behaviour:

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

The six time values do not need six global IDs. Each unit receives a `data-timer-unit` attribute, and the script searches only inside the current card:

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

## Calculate Calendar Time Correctly

If the card showed only a total number of days, subtracting two timestamps would be enough. Splitting the result into years, months, and days is different: months have unequal lengths, and leap years matter. Dividing milliseconds by 365 or 30 days will drift.

Instead, advance from the starting date through complete years, complete months, and complete days. Only then convert the remaining milliseconds into hours, minutes, and seconds.

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

Before changing the year or month, the helper moves the date to the first day of that month. This prevents a date such as 31 January from overflowing when a month is added. It then clamps the day to the actual length of the destination month, which also handles February and leap years correctly.

## Manage the Timer Lifecycle

Firefly's client-side navigation does not always reload the page. A global `setInterval` could keep running after the card has disappeared and create duplicate timers after several navigations.

A custom element gives the timer a clear setup and cleanup lifecycle:

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

The element starts when it is attached and clears the pending task when removed. Every query is scoped to the element itself, so several cards on one page update only their own values.

## Register the Sidebar Widget

Import the component in `src/components/layout/SideBar.astro` and add it to the component map:

```ts
import RelationshipTimer from "@/components/widget/RelationshipTimer.astro";

const componentMap = {
	// 其他组件……
	relationship: RelationshipTimer,
};
```

Then add `"relationship"` to the `WidgetComponentType` union in `src/types/sidebarConfig.ts`. A misspelled widget type will then fail at build time instead of disappearing silently.

Finally, add the widget to `src/config/sidebarConfig.ts`:

```ts
{
	type: "relationship",
	enable: true,
	position: "sticky",
	showOnPostPage: false,
},
```

`position: "sticky"` keeps the card in the normal sidebar flow. With `showOnPostPage: false`, it appears on the homepage and other non-article pages only; change the value to `true` if it should also appear beside articles.

The mobile configuration can use the same type without a `position` value.

## Change the Settings and Check the Build

Once the component exists, everyday edits stay in `src/config/relationshipConfig.ts`:

- Change `startAt` to move the starting point
- Change `people` to update the names or portraits
- Change `heart` to use a different symbol between them
- Change `title` to rename the card

Portrait files can live together in `src/assets/images/relationship/`. If one is not ready, keep the initial-letter fallback so the page never shows a broken-image icon.

After editing the configuration, run these commands to check the types and confirm that the site still builds:

```bash
pnpm check
pnpm type-check
pnpm build
```

The widget has no API dependency or complicated data source. Once the starting time and portraits are configured, it can quietly keep track of the time shared by two people.
