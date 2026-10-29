import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import { novels } from "../src/config/novelsConfig";
import {
	normalizeNovelTitle,
	novelCategories,
	novelSources,
	novelStatusLabel,
} from "../src/utils/novel-utils";

const source = readFileSync(
	new URL("../src/utils/novel-wall.ts", import.meta.url),
	"utf8",
);
const runtime = transpileModule(
	source.replace(/^import[\s\S]*?;\r?\n/m, "").replace(/^export /gm, ""),
	{ compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None } },
).outputText;
function fixture() {
	const view = new Window({ url: "https://example.test/novels/" });
	const wall = view.document.createElement("div");
	view.document.body.append(wall);
	wall.innerHTML =
		'<div data-novel-tools hidden><input data-novel-search><select data-novel-sort><option value="original">Order</option><option value="title">Title</option><option value="author">Author</option></select><p data-novel-results></p><button data-novel-reset>Reset</button></div><div data-novel-grid></div><p data-novel-empty hidden></p><nav data-novel-pagination hidden><button data-novel-previous>Previous</button><span data-novel-page></span><button data-novel-next>Next</button></nav>';
	const grid = wall.querySelector<HTMLElement>("[data-novel-grid]");
	assert.ok(grid);
	grid.scrollIntoView = () => {};
	for (const book of novels) {
		const item = view.document.createElement("article");
		Object.assign(item.dataset, {
			novelItem: "",
			title: book.title,
			author: book.author,
			sources: book.sources.map((s) => s.site).join(" "),
			categories: book.categories.join(" "),
			search: [
				book.title,
				book.author,
				book.description,
				...(book.aliases || []),
			].join(" "),
		});
		item.dataset.defaultHref = book.sources[0].url;
		item.dataset.defaultAccess = book.sources[0].access;
		const state = view.document.createElement("span");
		state.dataset.novelAccessStatus = "";
		item.append(state);
		const primary = view.document.createElement("a");
		primary.dataset.primaryReading = "";
		primary.href = book.sources[0].url;
		primary.textContent = book.title;
		item.append(primary);
		for (const source of book.sources) {
			const link = view.document.createElement("a");
			link.dataset.novelReadingSource = source.site;
			link.dataset.novelAccess = source.access;
			link.href = source.url;
			item.append(link);
		}
		grid.append(item);
	}
	for (const [dimension, values] of [
		["source", Object.keys(novelSources)],
		["category", Object.keys(novelCategories)],
	] as const) {
		for (const value of ["all", ...values]) {
			const button = view.document.createElement("button");
			button.setAttribute(`data-novel-${dimension}`, value);
			button.innerHTML = "<span data-filter-count></span>";
			wall.append(button);
		}
	}
	const timers = new Map<number, () => void>();
	let timer = 0;
	view.setTimeout = ((cb: () => void) => {
		timers.set(++timer, cb);
		return timer;
	}) as typeof view.setTimeout;
	view.clearTimeout = ((id: number) => {
		timers.delete(id);
	}) as typeof view.clearTimeout;
	view.matchMedia = () =>
		({ matches: true }) as ReturnType<typeof view.matchMedia>;
	const dispose = runInNewContext(
		`${runtime}\nmountNovelWall(document.body.firstElementChild);`,
		{
			window: view,
			document: view.document,
			Element: view.Element,
			AbortController: view.AbortController,
			Intl,
			normalizeNovelTitle,
			novelStatusLabel,
		},
	) as () => void;
	const click = (selector: string) => {
		const button = wall.querySelector<HTMLButtonElement>(selector);
		assert.ok(button);
		button.click();
	};
	return {
		view,
		wall,
		grid,
		click,
		visible: () =>
			[...grid.children]
				.filter((el) => !(el as HTMLElement).hidden)
				.map((el) => el.getAttribute("data-title")),
		search: (query: string) => {
			const input = wall.querySelector<HTMLInputElement>("input");
			assert.ok(input);
			input.value = query;
			input.dispatchEvent(new view.Event("input"));
			for (const [id, cb] of [...timers]) {
				timers.delete(id);
				cb();
			}
		},
		close: async () => {
			dispose();
			assert.equal(timers.size, 0);
			await view.happyDOM.close();
		},
	};
}
test("the wall paginates without losing books and resets pages when filters change", async () => {
	const f = fixture();
	try {
		assert.equal(f.visible().length, 20);
		assert.equal(f.visible()[0], "红楼梦");
		const seen = new Set(f.visible());
		for (let p = 1; p < 3; p++) {
			f.click("[data-novel-next]");
			f.visible().forEach((title) => {
				seen.add(title);
			});
		}
		assert.equal(seen.size, 60);
		f.click('[data-novel-category="drama"]');
		assert.equal(f.visible().length, 4);
	} finally {
		await f.close();
	}
});
test("category counts combine with search without a source filter", async () => {
	const f = fixture();
	try {
		f.click('[data-novel-category="drama"]');
		assert.equal(f.visible().length, 4);
		f.search("莎士比亚");
		assert.deepEqual(f.visible(), ["哈姆雷特", "罗密欧与朱丽叶"]);
		assert.equal(
			f.wall
				.querySelector('[data-novel-category="drama"]')
				?.getAttribute("aria-pressed"),
			"true",
		);
		f.click('[data-novel-category="all"]');
		assert.equal(f.visible().length, 2);
	} finally {
		await f.close();
	}
});
test("search supports aliases, empty states and resetting the complete combination", async () => {
	const f = fixture();
	try {
		f.search("《紅樓夢》");
		assert.deepEqual(f.visible(), ["红楼梦"]);
		f.search("a nonexistent title");
		assert.equal(f.visible().length, 0);
		assert.equal(
			f.wall.querySelector<HTMLElement>("[data-novel-empty]")?.hidden,
			false,
		);
		f.click("[data-novel-reset]");
		assert.equal(f.visible().length, 20);
		assert.equal(
			f.wall.querySelector<HTMLElement>("[data-novel-empty]")?.hidden,
			true,
		);
		f.search("《子夜》");
		assert.deepEqual(f.visible(), ["子夜"]);
	} finally {
		await f.close();
	}
});
test("sorting changes keyboard/DOM order and counters respond to the site language", async () => {
	const f = fixture();
	try {
		const sort = f.wall.querySelector<HTMLSelectElement>("select");
		assert.ok(sort);
		sort.value = "title";
		sort.dispatchEvent(new f.view.Event("change"));
		const expected = [...novels]
			.sort((a, b) =>
				new Intl.Collator("zh-CN", {
					numeric: true,
					sensitivity: "base",
				}).compare(a.title, b.title),
			)
			.slice(0, 20)
			.map((b) => b.title);
		assert.deepEqual(f.visible(), expected);
		f.view.document.documentElement.lang = "en";
		f.view.document.dispatchEvent(new f.view.Event("firefly:language-change"));
		assert.match(
			f.wall.querySelector("[data-novel-results]")?.textContent || "",
			/60 of 60 works/,
		);
	} finally {
		await f.close();
	}
});

test("rendering preserves the preferred reading link independently of category and language", async () => {
	const f = fixture();
	try {
		const first = f.grid.querySelector('[data-title="红楼梦"]');
		assert.ok(first);
		f.click('[data-novel-category="classics"]');
		assert.equal(
			first.querySelector<HTMLAnchorElement>("[data-primary-reading]")?.href,
			novels[0].sources[0].url,
		);
		f.view.document.dispatchEvent(new f.view.Event("firefly:language-change"));
		assert.equal(
			first.querySelector<HTMLAnchorElement>("[data-primary-reading]")?.href,
			novels[0].sources[0].url,
		);
	} finally {
		await f.close();
	}
});
