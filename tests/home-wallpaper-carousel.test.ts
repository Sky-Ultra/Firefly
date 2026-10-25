import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { type HTMLElement as HappyElement, Window } from "happy-dom";
import { backgroundWallpaper } from "../src/config/backgroundWallpaper";

const layout = readFileSync(
	new URL("../src/layouts/MainGridLayout.astro", import.meta.url),
	"utf8",
);
const runtime = layout.match(
	/\(function initBannerCarousel\(\) \{[\s\S]*?\n\s*\}\)\(\);/,
)?.[0];
assert.ok(runtime);
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

function fixture(initialHidden = false) {
	const view = new Window({
		url: "https://example.test/",
		settings: { enableImageFileLoading: false },
	});
	let hidden = initialHidden;
	Object.defineProperty(view.document, "hidden", { get: () => hidden });
	Object.defineProperty(view, "innerWidth", { value: 1440, writable: true });
	view.document.documentElement.setAttribute(
		"data-wallpaper-mode",
		"fullscreen",
	);
	const container = view.document.createElement("div");
	container.id = "banner-images-container";
	container.dataset.carouselEnabled = "true";
	container.dataset.carouselInterval = "6500";
	container.dataset.carouselEffect = "zoom";
	const count = backgroundWallpaper.common?.carousel?.count ?? 0;
	for (const device of ["mobile", "desktop"]) {
		for (let index = 0; index < count; index++) {
			const slide = view.document.createElement("div");
			slide.className = `slide-item ${device === "mobile" ? "block lg:hidden" : "hidden lg:block"} ${index === 0 ? "active" : ""}`;
			slide.dataset.wallpaperSrc = `/${device}-${index}.webp`;
			const image = view.document.createElement("img");
			image.src = "data:image/gif;base64,placeholder";
			Object.defineProperty(image, "complete", {
				get: () => !image.src.startsWith("data:"),
			});
			Object.defineProperty(image, "naturalWidth", {
				get: () => (image.src.startsWith("data:") ? 0 : 100),
			});
			Object.defineProperty(image, "decode", {
				value: () => Promise.resolve(),
			});
			slide.appendChild(image);
			container.appendChild(slide);
		}
	}
	view.document.body.appendChild(container);
	const timers = new Map<number, () => void>();
	let nextTimer = 0;
	const math = Object.create(Math);
	math.random = () => 0;
	runInNewContext(runtime, {
		window: view,
		document: view.document,
		localStorage: view.localStorage,
		WeakMap,
		Set,
		Promise,
		Math: math,
		console,
		setTimeout: (callback: () => void) => {
			const id = ++nextTimer;
			timers.set(id, callback);
			return id;
		},
		clearTimeout: (id: number) => timers.delete(id),
	});
	const slides = (device: string) =>
		[...container.querySelectorAll(".slide-item")].filter((slide) =>
			slide.classList.contains(device === "desktop" ? "lg:block" : "lg:hidden"),
		);
	return {
		view,
		timers,
		slides,
		loaded: (device: string) =>
			slides(device).filter(
				(slide) => slide.getAttribute("data-wallpaper-load-state") === "loaded",
			),
		active: (device: string) =>
			slides(device).findIndex((slide) => slide.classList.contains("active")),
		key: (key: string, target: HappyElement = view.document.body) => {
			const event = new view.KeyboardEvent("keydown", {
				key,
				bubbles: true,
				cancelable: true,
			});
			target.dispatchEvent(event);
			return event;
		},
		hide: (value: boolean) => {
			hidden = value;
			view.document.dispatchEvent(new view.Event("visibilitychange"));
		},
		resize: (width: number) => {
			Object.defineProperty(view, "innerWidth", {
				value: width,
				writable: true,
			});
			view.dispatchEvent(new view.Event("resize"));
		},
		tick: () => {
			const entry = timers.entries().next().value;
			assert.ok(entry);
			timers.delete(entry[0]);
			entry[1]();
		},
		close: () => view.happyDOM.close(),
	};
}

test("sixteen slots per device load only current and next, retaining at most three decoded slides", async () => {
	assert.equal(backgroundWallpaper.common?.carousel?.count, 16);
	const f = fixture();
	try {
		await flush();
		assert.equal(f.slides("desktop").length, 16);
		assert.equal(f.slides("mobile").length, 16);
		assert.equal(f.loaded("desktop").length, 2);
		assert.equal(f.loaded("mobile").length, 0);
		for (let index = 0; index < 20; index++) {
			f.key("ArrowRight");
			await flush();
			assert.equal(f.active("desktop"), (index + 1) % 16);
			assert.ok(f.loaded("desktop").length <= 3);
			assert.equal(f.timers.size, 1);
		}
	} finally {
		await f.close();
	}
});

test("typing spaces and arrows in form controls does not pause or change the wallpaper", async () => {
	const f = fixture();
	try {
		await flush();
		for (const tag of ["input", "textarea", "button", "select"]) {
			const control = f.view.document.createElement(tag);
			f.view.document.body.appendChild(control);
			assert.equal(f.key(" ", control).defaultPrevented, false);
			f.key("ArrowRight", control);
			await flush();
			assert.equal(f.active("desktop"), 0);
			assert.equal(f.timers.size, 1);
		}
	} finally {
		await f.close();
	}
});

test("backgrounding pauses autoplay and resuming cannot duplicate an in-flight timer", async () => {
	const f = fixture();
	try {
		await flush();
		f.tick();
		f.hide(true);
		assert.equal(f.timers.size, 0);
		f.hide(false);
		await flush();
		assert.equal(f.timers.size, 1);
		f.key(" ");
		assert.equal(f.timers.size, 0);
		f.hide(true);
		f.hide(false);
		await flush();
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});

test("crossing the mobile breakpoint prepares that device without stale desktop transitions", async () => {
	const f = fixture();
	try {
		await flush();
		f.key("ArrowRight");
		f.resize(390);
		await flush();
		assert.equal(f.loaded("desktop").length, 0);
		assert.equal(f.loaded("mobile").length, 2);
		assert.equal(f.active("mobile"), 0);
		assert.equal(f.timers.size, 1);
		f.key("ArrowRight");
		await flush();
		assert.equal(f.active("mobile"), 1);
		f.resize(1440);
		await flush();
		assert.ok(f.loaded("desktop").length >= 2);
		assert.equal(f.loaded("mobile").length, 0);
	} finally {
		await f.close();
	}
});

test("a homepage first opened in the background starts autoplay when it becomes visible", async () => {
	const f = fixture(true);
	try {
		await flush();
		assert.equal(f.timers.size, 0);
		f.hide(false);
		await flush();
		assert.equal(f.timers.size, 1);
	} finally {
		await f.close();
	}
});
