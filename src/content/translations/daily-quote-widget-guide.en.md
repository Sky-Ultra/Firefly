---
translationOf: daily-quote-widget-guide.md
sourceHash: sha256:76d27602f2ab2465037ff8835ffb3a47479dd0420cf26026df030fa314c94a9f
---

This post records how the Daily Quote card in the sidebar is put together. It fetches a line from the Hitokoto API and caches it against the visitor's local date. If the request fails, the card falls back to a line stored in the site configuration.

## Configure the API and Fallback Copy

Everything that should be easy to change lives in `src/config/visitorWidgetsConfig.ts`. The component itself only reads the settings and renders the result:

```ts
dailyQuote: {
	api: "https://v1.hitokoto.cn/?encode=json&max_length=45&c=d&c=i&c=k",
	fallbackText: "心有微光，自会抵达想去的地方。",
	fallbackAuthor: "本站",
},
```

The `max_length=45` parameter keeps unexpectedly long lines from stretching the sidebar layout. The category parameters that follow decide what kinds of quotes the API may return. To change the tone, edit the URL; the component structure can stay as it is.

The matching type lives in `src/types/visitorWidgetsConfig.ts`:

```ts
dailyQuote: {
	api: string;
	fallbackText: string;
	fallbackAuthor: string;
};
```

This type catches incomplete configuration before a build and prevents the component from receiving values of the wrong kind.

## Build the Card

The component is `src/components/widget/DailyQuote.astro`. Its outer element uses the project's existing `card-base` class so its background, corners, and dark-mode behaviour match the other sidebar cards.

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

The API URL and fallback text pass into the browser script through `data-*` attributes. That keeps the template and script from maintaining separate copies of the same configuration.

`daily-quote-widget` is a custom element. Its complete card markup remains on the page even before JavaScript loads. Once the script is ready, it handles the request, reads the cache, and replaces the placeholder text.

## Normalise the API Response

The Hitokoto response includes several fields, but this card only needs the quote, its source, its author, and a UUID. Define one type for the remote payload and another for the shape used inside the component:

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

Every property in `QuoteResponse` is optional because it describes data outside our control. `QuoteData` is the clean, predictable form used by the card. Converting at the boundary means the rendering code does not have to keep checking the API's field names.

The author and source are combined like this:

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

When both values exist, the card shows “author · source”. If only one is present, no stray separator is left behind.

## Cache One Quote Per Local Date

The quote should remain the same throughout a visitor's day, so the cache key is based on their local calendar date:

```ts
function getLocalDateKey() {
	return new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}
```

The `en-CA` locale produces a stable date such as `2026-07-15`. Both that date and the normalised quote are stored together:

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

A matching date returns the cached value immediately; otherwise, the component makes a fresh request. Keep reads and writes inside `try...catch`, since private browsing or browser policy may restrict `localStorage`. The quote card should still work when caching does not.

## Handle Timeouts and Failed Requests

The request uses `AbortController` with an eight-second timeout:

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

Whether the network fails, the response is invalid, or the timer expires, the component returns the configured fallback rather than showing an error to the reader. The card keeps its shape, and a temporary problem with an external service never interrupts the page.

## Share One Request Between Several Instances

Firefly may render the card in the desktop sidebar and again near the bottom of the mobile page. Separate requests would waste a round trip and could even produce two different quotes on the same visit.

Instead, every instance on the current page shares one Promise:

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

The first instance creates the request for that date; every other instance waits for the same Promise. All cards show the same text without hitting the API twice.

## Refresh Automatically at Midnight

If a tab remains open for a long time, checking the date only on page load is not enough. When the custom element connects, it calculates the time until the next local midnight and schedules another load:

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

The timer fires one second after midnight to avoid an awkward boundary at the exact instant the date changes. When the component leaves the page, it clears the timer so repeated client-side navigation does not leave old tasks behind.

## Update the Page Safely

Once the data arrives, only the text and link nodes already inside the card need to change:

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

The quote is assigned through `textContent`, so remote data is never parsed as HTML. If the API provides a UUID, the card links to that quote's detail page. A fallback quote has no such page, so its `href` is removed rather than left pointing nowhere.

## Add the Widget to the Sidebar

Import the component in `src/components/layout/SideBar.astro` and add it to the component map:

```ts
import DailyQuote from "@/components/widget/DailyQuote.astro";

const componentMap = {
	// 其他侧栏组件……
	dailyQuote: DailyQuote,
};
```

Then choose where it appears in `src/config/sidebarConfig.ts`:

```ts
{
	type: "dailyQuote",
	enable: true,
	position: "top",
	showOnPostPage: true,
},
```

Set `showOnPostPage` to `false` to keep the card on the homepage and other non-article pages. Set `enable` to `false` to turn it off entirely. The mobile area can use the same `type`; it does not need a second implementation.

## Ongoing Maintenance

Most routine changes belong in `src/config/visitorWidgetsConfig.ts`:

- Change `api` to adjust the quote categories or maximum length
- Change `fallbackText` to replace the line shown when the request fails
- Change `fallbackAuthor` to update its attribution

The card's location is controlled by `src/config/sidebarConfig.ts`. Unless the cache rules, request strategy, or markup need to change, the component file can usually be left alone.
