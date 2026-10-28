import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const component = readFileSync(
	new URL(
		"../src/components/features/RandomCoverProvider.astro",
		import.meta.url,
	),
	"utf8",
);
const source = component.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
const runtime = transpileModule(source, {
	compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
}).outputText;

function fixture() {
	const view = new Window({
		url: "https://example.test/about/",
		settings: { enableImageFileLoading: false },
	});
	const images = (prefix: string) =>
		Array.from({ length: 60 }, (_, index) => ({
			id: `${prefix}:${index}`,
			previewUrl: `/${prefix}-${index}-preview.webp`,
			originalUrl: `/${prefix}-${index}-original.jpg`,
			wallpaperUrl: `/${prefix}-${index}-wallpaper.webp`,
		}));
	const pool = view.document.createElement("div");
	pool.dataset.randomCoverPool = JSON.stringify(images("desktop"));
	pool.dataset.randomCoverMobileHomeWallpaper = JSON.stringify(
		images("mobile"),
	);
	pool.dataset.randomCoverHomeWallpaper = "true";
	pool.dataset.randomCoverWallpaperOnly = "true";
	view.document.body.appendChild(pool);
	const wallpaper = view.document.createElement("div");
	wallpaper.id = "banner-images-container";
	wallpaper.dataset.wallpaperAwaitingAssignment = "true";
	for (const device of ["mobile", "desktop"]) {
		for (let index = 0; index < 21; index++) {
			const slide = view.document.createElement("div");
			slide.className = `slide-item ${device === "mobile" ? "lg:hidden" : "lg:block"} ${index === 3 ? "active" : ""}`;
			slide.dataset.index = String(index);
			slide.appendChild(view.document.createElement("img"));
			wallpaper.appendChild(slide);
		}
	}
	view.document.body.appendChild(wallpaper);
	const page = view.document.createElement("main");
	view.document.body.appendChild(page);
	let ready = 0;
	view.addEventListener("firefly:wallpaper-assignments-ready", () => ready++);
	const start = () =>
		runInNewContext(runtime, {
			window: view,
			document: view.document,
			CustomEvent: view.CustomEvent,
			console: { ...console, error: () => {} },
		});
	const navigate = (key: string, original = false) => {
		page.innerHTML = `<div data-random-cover-key="${key}"><img data-cover-img></div><div data-random-cover-shared="true" ${original ? 'data-random-cover-original-articles="true"' : ""}></div>`;
		view.document.dispatchEvent(new view.CustomEvent("swup:contentReplaced"));
		return page.querySelector("img")?.getAttribute("src");
	};
	return {
		view,
		pool,
		page,
		wallpaper,
		start,
		navigate,
		ready: () => ready,
		close: () => view.happyDOM.close(),
	};
}

test("a direct non-home entry assigns both full libraries before reserving article covers", async () => {
	const f = fixture();
	try {
		f.start();
		assert.equal(f.ready(), 1);
		assert.equal(f.wallpaper.dataset.wallpaperAwaitingAssignment, "false");
		for (const device of ["desktop", "mobile"]) {
			const sources = Array.from(f.wallpaper.querySelectorAll(".slide-item"))
				.filter((el) =>
					el.classList.contains(
						device === "desktop" ? "lg:block" : "lg:hidden",
					),
				)
				.map((el) => el.getAttribute("data-wallpaper-src"));
			assert.equal(new Set(sources).size, 21);
			assert.ok(
				sources.every(
					(src) =>
						src?.startsWith(`/${device}-`) && src.endsWith("-wallpaper.webp"),
				),
			);
		}
		const article = f.navigate("post:a");
		assert.ok(article?.endsWith("-preview.webp"));
		const reserved = Array.from(
			f.wallpaper.querySelectorAll("[data-wallpaper-src]"),
		).map((el) =>
			el
				.getAttribute("data-wallpaper-src")
				?.replace("-wallpaper.webp", "-preview.webp"),
		);
		assert.ok(!reserved.includes(article));
	} finally {
		await f.close();
	}
});

test("navigation and returning home preserve loaded wallpaper sources, active position and readiness", async () => {
	const f = fixture();
	try {
		f.start();
		const slides = Array.from(f.wallpaper.querySelectorAll(".slide-item"));
		for (const slide of slides)
			slide.setAttribute("data-wallpaper-load-state", "loaded");
		const before = f.wallpaper.innerHTML;
		const first = f.navigate("post:first");
		assert.ok(f.navigate("post:detail", true)?.endsWith("-original.jpg"));
		assert.equal(f.navigate("post:first"), first);
		assert.equal(f.wallpaper.innerHTML, before);
		assert.equal(
			f.ready(),
			1,
			"article navigation must never reassign the persistent wallpaper",
		);
	} finally {
		await f.close();
	}
});

test("an invalid independent carrier cannot prevent the shared wallpaper and article providers initializing", async () => {
	const f = fixture();
	try {
		const invalid = f.view.document.createElement("div");
		invalid.dataset.randomCoverPool = "invalid JSON";
		f.view.document.body.prepend(invalid);
		f.start();
		assert.equal(f.ready(), 1);
		assert.ok(f.navigate("post:after-invalid")?.endsWith("-preview.webp"));
	} finally {
		await f.close();
	}
});
