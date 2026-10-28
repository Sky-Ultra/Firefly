import { normalizeNovelTitle, novelStatusLabel } from "@/utils/novel-utils";

export interface NovelFacetRecord {
	sources: readonly string[];
	categories: readonly string[];
	search: string;
}
export interface NovelFilters {
	source: string;
	category: string;
	query: string;
}
export function matchesNovelFilters(
	record: NovelFacetRecord,
	filters: NovelFilters,
): boolean {
	return (
		(filters.source === "all" || record.sources.includes(filters.source)) &&
		(filters.category === "all" ||
			record.categories.includes(filters.category)) &&
		normalizeNovelTitle(record.search).includes(
			normalizeNovelTitle(filters.query),
		)
	);
}

export function mountNovelWall(wall: HTMLElement): () => void {
	const grid = wall.querySelector<HTMLElement>("[data-novel-grid]");
	const input = wall.querySelector<HTMLInputElement>("[data-novel-search]");
	const sort = wall.querySelector<HTMLSelectElement>("[data-novel-sort]");
	const results = wall.querySelector<HTMLElement>("[data-novel-results]");
	const pageLabel = wall.querySelector<HTMLElement>("[data-novel-page]");
	const pagination = wall.querySelector<HTMLElement>("[data-novel-pagination]");
	const empty = wall.querySelector<HTMLElement>("[data-novel-empty]");
	const tools = wall.querySelector<HTMLElement>("[data-novel-tools]");
	const previous = wall.querySelector<HTMLButtonElement>(
		"[data-novel-previous]",
	);
	const next = wall.querySelector<HTMLButtonElement>("[data-novel-next]");
	if (
		!grid ||
		!input ||
		!sort ||
		!results ||
		!pageLabel ||
		!pagination ||
		!empty ||
		!tools ||
		!previous ||
		!next
	)
		return () => {};
	const list = Array.from(
		grid.querySelectorAll<HTMLElement>("[data-novel-item]"),
	).map((element, index) => ({
		element,
		index,
		title: element.dataset.title || "",
		author: element.dataset.author || "",
		sources: (element.dataset.sources || "").split(" "),
		categories: (element.dataset.categories || "").split(" "),
		search: element.dataset.search || "",
	}));
	const sourceButtons = Array.from(
		wall.querySelectorAll<HTMLButtonElement>("[data-novel-source]"),
	);
	const categoryButtons = Array.from(
		wall.querySelectorAll<HTMLButtonElement>("[data-novel-category]"),
	);
	const filters: NovelFilters = { source: "all", category: "all", query: "" };
	const PAGE_SIZE = 12;
	let page = 1;
	let searchTimer: number | undefined;
	const scope = new AbortController();
	const collator = new Intl.Collator("zh-CN", {
		numeric: true,
		sensitivity: "base",
	});
	const english = () => document.documentElement.lang.startsWith("en");
	function render() {
		const selected = list.filter((book) => matchesNovelFilters(book, filters));
		selected.sort((a, b) =>
			sort?.value === "title"
				? collator.compare(a.title, b.title)
				: sort?.value === "author"
					? collator.compare(a.author, b.author) ||
						collator.compare(a.title, b.title)
					: a.index - b.index,
		);
		const pages = Math.max(1, Math.ceil(selected.length / PAGE_SIZE));
		page = Math.min(page, pages);
		const visible = new Set(
			selected.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		);
		list.forEach((book) => {
			book.element.hidden = !visible.has(book);
			const selectedSource =
				filters.source === "all"
					? null
					: book.element.querySelector<HTMLAnchorElement>(
							`[data-novel-reading-source="${filters.source}"]`,
						);
			const destination =
				selectedSource?.href || book.element.dataset.defaultHref;
			const status = book.element.querySelector<HTMLElement>(
				"[data-novel-access-status]",
			);
			const access =
				selectedSource?.dataset.novelAccess ||
				book.element.dataset.defaultAccess ||
				"preview";
			if (
				status &&
				(access === "open" || access === "partial" || access === "preview")
			) {
				const label = novelStatusLabel(access);
				status.dataset.access = access;
				status.setAttribute("data-i18n-zh", label.zh);
				status.setAttribute("data-i18n-en", label.en);
				status.textContent = english() ? label.en : label.zh;
			}
			if (destination)
				book.element
					.querySelectorAll<HTMLAnchorElement>("[data-primary-reading]")
					.forEach((link) => {
						link.href = destination;
					});
		});
		// DOM order follows the visual and keyboard order; hidden records stay available without JS.
		grid?.append(...selected.map((book) => book.element));
		for (const [buttons, dimension] of [
			[sourceButtons, "source"],
			[categoryButtons, "category"],
		] as const) {
			for (const button of buttons) {
				const value =
					dimension === "source"
						? button.dataset.novelSource
						: button.dataset.novelCategory;
				if (!value) continue;
				const count = list.filter((book) =>
					matchesNovelFilters(book, { ...filters, [dimension]: value }),
				).length;
				button.setAttribute(
					"aria-pressed",
					String(filters[dimension] === value),
				);
				button.disabled =
					count === 0 && value !== "all" && value !== filters[dimension];
				const counter = button.querySelector<HTMLElement>(
					"[data-filter-count]",
				);
				if (counter) counter.textContent = String(count);
			}
		}
		if (results)
			results.textContent = english()
				? `${selected.length} of ${list.length} works`
				: `共 ${selected.length} 部作品 / 收录 ${list.length} 部`;
		if (pageLabel)
			pageLabel.textContent = english()
				? `Page ${page} / ${pages}`
				: `第 ${page} / ${pages} 页`;
		if (pagination) pagination.hidden = selected.length <= PAGE_SIZE;
		if (empty) empty.hidden = selected.length > 0;
		if (previous) previous.disabled = page <= 1;
		if (next) next.disabled = page >= pages;
	}
	function reset() {
		filters.source = "all";
		filters.category = "all";
		filters.query = "";
		page = 1;
		if (input) input.value = "";
		if (sort) sort.value = "original";
		window.clearTimeout(searchTimer);
		render();
	}
	function onClick(event: MouseEvent) {
		const target =
			event.target instanceof Element
				? event.target.closest<HTMLButtonElement>("button")
				: null;
		if (!target || target.disabled) return;
		if (target.hasAttribute("data-novel-reset")) {
			reset();
			return;
		}
		if (target.dataset.novelSource) {
			filters.source = target.dataset.novelSource;
			page = 1;
			render();
		} else if (target.dataset.novelCategory) {
			filters.category = target.dataset.novelCategory;
			page = 1;
			render();
		} else if (
			target.hasAttribute("data-novel-previous") ||
			target.hasAttribute("data-novel-next")
		) {
			page += target.hasAttribute("data-novel-next") ? 1 : -1;
			render();
			grid?.scrollIntoView({
				block: "start",
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
					? "instant"
					: "smooth",
			});
		}
	}
	input.addEventListener(
		"input",
		() => {
			window.clearTimeout(searchTimer);
			searchTimer = window.setTimeout(() => {
				filters.query = input.value.trim();
				page = 1;
				render();
			}, 120);
		},
		{ signal: scope.signal },
	);
	sort.addEventListener(
		"change",
		() => {
			page = 1;
			render();
		},
		{ signal: scope.signal },
	);
	wall.addEventListener("click", onClick, { signal: scope.signal });
	document.addEventListener("firefly:language-change", render, {
		signal: scope.signal,
	});
	tools.hidden = false;
	render();
	return () => {
		window.clearTimeout(searchTimer);
		scope.abort();
	};
}
