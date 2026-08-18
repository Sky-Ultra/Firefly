---
translationOf: bangumi-guide.md
sourceHash: sha256:d30d694652bc7826795023c8d62460ed53ed9595e4b47d251b34ea21652a4d25
---

I call this page the “Bangumi Tracker,” but it is not a broadcast timetable in the usual sense. It is closer to an open shelf: what I have watched, which book I am still reading, and what I have set aside all move with my Bangumi collection.

Astro lays out the page, then Svelte takes over the list. Tabs, filters, and pagination can therefore change without reloading the whole page.

## First, what this page is actually tracking

The page currently has three shelves:

- Anime
- Books
- Music

Games have their own page, so the `game` switch remains off in the Bangumi tracker. Each category reports its total and can be narrowed further by status: all, completed, in progress, planned, on hold, or dropped. Books and music use the more natural “read/reading” and “listened/listening” wording.

A cover fills most of each card, with the title, year, score, status, and a few tags layered above it. Selecting a card opens the configured Bangumi subject page.

## Start with the user ID

Site-level settings live in `src/config/siteConfig.ts`:

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

`userId` is the public Bangumi user ID. `apiUrl` supplies collection and subject data, while `subjectBaseUrl` controls where a card leads. Keeping the two separate makes it possible to change an API proxy without accidentally rewriting every destination link.

Enabled categories are declared in `src/pages/bangumi.astro`:

```ts
categories: {
	book: true,
	anime: true,
	music: true,
	game: false,
	real: false,
},
```

Bangumi's subject type numbers are not consecutive. A small map pairs each site category with the API value:

```ts
const categoryMap = {
	book: { id: "book", subjectType: 1 },
	anime: { id: "anime", subjectType: 2 },
	music: { id: "music", subjectType: 3 },
	game: { id: "game", subjectType: 4 },
	real: { id: "real", subjectType: 6 },
};
```

Restoring a category later means checking its switch, `categoryOrder`, and place in the navigation. Turning `game` on would fetch the collection correctly, but it would also duplicate this site's separate games page.

## Fetch at build time or in the browser

There are two ways to fetch the data. I settled on dynamic mode for this site.

In `static` mode, the site requests Bangumi during the build. The published page opens quickly and does not depend on the reader reaching the API, but collection changes require another deployment.

In `dynamic` mode, the browser requests the API when the page opens. New collection states appear without rebuilding the site, at the cost of an initial loading step and a dependency on the reader's connection. This site currently uses dynamic mode.

The Astro page passes a different set of props depending on that choice:

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

`client:load` hydrates the Svelte component as soon as the page is ready. Astro still provides the title and outer page structure; collection data, tabs, filters, and pagination then run in the browser.

## Large collections arrive one page at a time

The Bangumi collection endpoint uses `limit` and `offset`. The site requests 50 records at a time until a batch arrives below the limit:

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

A short delay avoids hitting the endpoint with a burst of pagination requests, while `maxTotal` gives the loop a hard ceiling. If a request fails, the component leaves its loading state and shows one error panel. It does not present a partial response as though it were the complete collection.

## Hide some subjects and bring others forward

A public collection is not always identical to the list intended for a personal site. `excludedSubjectIds` filters selected subjects after fetching:

```ts
const excludedIds = new Set(excludedSubjectIds[categoryKey] || []);
const filteredData = excludedIds.size > 0
	? fetchedData.filter((item) => !excludedIds.has(item.subject_id))
	: fetchedData;
```

`featuredSubjects` handles the opposite requirement. It moves selected works to the front and applies a chosen collection status. If a featured subject is missing from the user's collection, `applyFeaturedSubjects()` fetches its subject record separately and normalises it into a `UserSubjectCollection`.

```ts
return [
	...featuredItems.filter(
		(item): item is UserSubjectCollection => item !== null,
	),
	...items.filter((item) => !featuredIds.has(item.subject_id)),
];
```

That is how several anime entries remain at the start of the current list. Configuration stores only the subject ID and status; Bangumi still supplies the cover, title, year, and other details.

## The page does not need the whole API response

The page works with `UserSubjectCollection` from `src/types/bangumi.ts`. Collection status is a numeric union:

```ts
// 1: planned, 2: completed, 3: in progress, 4: on hold, 5: dropped
export type CollectionType = 1 | 2 | 3 | 4 | 5;

// 1: book, 2: anime, 3: music, 4: game, 6: live action
export type SubjectType = 1 | 2 | 3 | 4 | 6;
```

When a featured entry needs to be added, `normalizeSubject()` keeps only the fields used by the page and supplies defaults for missing images, scores, and tags. The card does not have to repeat checks against every nested API field.

## Remember the tab in the URL

`BangumiGrid.svelte` orders the enabled categories through `categoryOrder`, then creates the tabs. The active category stays in Svelte state:

```ts
let activeTab = $state("");

function handleTabChange(tabId: string) {
	activeTab = tabId;
}
```

Selecting a tab also writes the category to the URL hash:

```ts
function clickTab(tabId: string) {
	onTabChange(tabId);
	const nextHash = `#${encodeURIComponent(tabId)}`;
	if (window.location.hash !== nextHash) {
		window.history.replaceState(null, "", nextHash);
	}
}
```

Once the page is running, browser history or a hand-edited hash changes the tab without fetching the collection again. Static mode also reads the hash on the initial visit. Dynamic mode currently selects its first category after the data arrives, so opening `/bangumi/#book` directly does not yet land on Books. That is one remaining edge case in the present implementation.

## Reset the page when the filter changes

Each category is handed to its own `BangumiSection.svelte`. It first maps Bangumi's collection numbers to internal names:

```ts
const STATUS_MAP: Record<number, string> = {
	1: "wish",
	2: "collect",
	3: "doing",
	4: "on_hold",
	5: "dropped",
};
```

Only statuses with at least one result become filter buttons. Changing a filter also returns to page one. Without that reset, a reader on page four could select a one-page subset and be left looking at an empty grid:

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

The current page size is 24. Pagination slices an array that has already been loaded; moving between pages does not make another Bangumi request.

## Do not load every cover at once

Anime, books, and music can add up to a long list of images. Loading every cover during initialization would spend bandwidth on tabs the reader may never open. `BangumiSection` passes `loadImage=true` only to cards in the active category:

```svelte
<Card item={item} loadImage={isActive} {subjectBaseUrl} />
```

The card decides whether to set its image `src`, while retaining native lazy loading and a low-detail placeholder:

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

Opacity rises and the placeholder clears only after the image has loaded. A slow connection therefore leaves a stable card rather than a collapsing space.

## Most changes belong in configuration

Dynamic mode begins with skeletons for tabs, filters, cards, and pagination. A failed request or an empty response then moves to its own explanatory state. Loading, success, empty data, and failure remain separate, leaving the card component to deal only with a single subject.

When I add, remove, or reorder subjects, I usually leave the components alone and edit `src/config/siteConfig.ts`:

- Change `userId` to show another public collection
- Reorder categories through `categoryOrder`
- Hide subjects with `excludedSubjectIds`
- Fix subjects and statuses at the front through `featuredSubjects`
- Switch between static and dynamic loading

The Svelte components usually need editing only when the filtering rules, pagination model, or card design changes. The collection itself is far easier to maintain in Bangumi than as dozens of hand-written objects in the blog configuration.
