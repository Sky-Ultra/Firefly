import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const source = readFileSync(
	new URL("../src/utils/immersive-slideshow.ts", import.meta.url),
	"utf8",
);
const runtime = transpileModule(source.replace(/^export /gm, ""), {
	compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
}).outputText;
const flush = async () => {
	for (let i = 0; i < 5; i++) await new Promise<void>((r) => setImmediate(r));
};
function fixture(
	options: {
		mobile?: boolean;
		broken?: Set<string>;
		hold?: boolean;
		fullscreen?: boolean;
		reduced?: boolean;
	} = {},
) {
	const view = new Window({
		url: "https://example.test/",
		settings: { enableImageFileLoading: false },
	});
	Object.defineProperty(view, "innerWidth", {
		value: options.mobile ? 390 : 1440,
	});
	let hidden = false;
	Object.defineProperty(view.document, "hidden", { get: () => hidden });
	view.matchMedia = (query: string) =>
		({
			matches: query.includes("reduce") ? !!options.reduced : !!options.mobile,
		}) as ReturnType<typeof view.matchMedia>;
	const covers = (prefix: string, count: number) =>
		Array.from({ length: count }, (_, i) => ({
			wallpaperUrl: `/${prefix}-${i}.webp`,
			originalUrl: `/${prefix}-${i}.jpg`,
		}));
	const carrier = view.document.createElement("div");
	carrier.dataset.randomCoverWallpaperOnly = "true";
	carrier.dataset.randomCoverPool = JSON.stringify(covers("desktop", 5));
	carrier.dataset.randomCoverMobileHomeWallpaper = JSON.stringify(
		covers("mobile", 4),
	);
	view.document.body.append(carrier);
	const normal = view.document.createElement("div");
	normal.id = "banner-images-container";
	normal.innerHTML =
		'<div class="slide-item lg:block active" data-wallpaper-src="/desktop-1.webp"></div><div class="slide-item lg:hidden active" data-wallpaper-src="/mobile-1.webp"></div>';
	view.document.body.append(normal);
	const trigger = view.document.createElement("button");
	trigger.id = "display-settings-switch";
	view.document.body.append(trigger);
	trigger.focus();
	const dialog = view.document.createElement("dialog");
	dialog.dataset.interval = "6500";
	dialog.innerHTML =
		"<img data-immersive-image><img data-immersive-image><div data-immersive-controls><button data-immersive-prev></button><button data-immersive-pause><span data-immersive-pause-icon></span></button><button data-immersive-next></button><button data-immersive-exit></button></div><p data-immersive-hint></p><p data-immersive-status></p>";
	view.document.body.append(dialog);
	dialog.showModal = () => {
		dialog.open = true;
	};
	dialog.close = () => {
		dialog.open = false;
		dialog.dispatchEvent(new view.Event("close"));
	};
	if (options.fullscreen) {
		dialog.requestFullscreen = async () => {
			Object.defineProperty(view.document, "fullscreenElement", {
				value: dialog,
				configurable: true,
			});
			view.document.dispatchEvent(new view.Event("fullscreenchange"));
		};
		view.document.exitFullscreen = async () => {
			Object.defineProperty(view.document, "fullscreenElement", {
				value: null,
				configurable: true,
			});
			view.document.dispatchEvent(new view.Event("fullscreenchange"));
		};
	}
	const timers = new Map<number, { callback: () => void; delay: number }>();
	let id = 0;
	view.setTimeout = ((callback: () => void, delay: number) => {
		timers.set(++id, { callback, delay });
		return id;
	}) as typeof view.setTimeout;
	view.clearTimeout = ((key: number) => {
		timers.delete(key);
	}) as typeof view.clearTimeout;
	const requests: string[] = [];
	const pending: Array<() => void> = [];
	function FakeImage() {
		const image = view.document.createElement("img");
		let src = "";
		Object.defineProperty(image, "src", {
			get: () => src,
			set: (value: string) => {
				src = value;
				requests.push(value);
				const complete = () => {
					if (src !== value) return;
					if (options.broken?.has(value))
						image.onerror?.(new view.Event("error"));
					else image.onload?.(new view.Event("load"));
				};
				if (options.hold) pending.push(complete);
				else queueMicrotask(complete);
			},
		});
		Object.defineProperty(image, "complete", { get: () => false });
		image.decode = () => Promise.resolve();
		return image;
	}
	const math = Object.create(Math);
	math.random = () => 0;
	const context = {
		window: view,
		document: view.document,
		HTMLElement: view.HTMLElement,
		Element: view.Element,
		Image: FakeImage,
		Event: view.Event,
		CustomEvent: view.CustomEvent,
		AbortController: view.AbortController,
		Math: math,
		console,
	};
	const dispose = runInNewContext(
		`${runtime}\nmountImmersiveSlideshow(document.querySelector("dialog"));`,
		context,
	) as () => void;
	const changes: boolean[] = [];
	view.addEventListener("firefly:immersive-change", (event) =>
		changes.push((event as unknown as CustomEvent).detail.active),
	);
	const tick = (delay: number) => {
		const entry = [...timers].find(([, t]) => t.delay === delay);
		assert.ok(entry, `expected a ${delay}ms timer`);
		timers.delete(entry[0]);
		entry[1].callback();
	};
	const open = () =>
		view.dispatchEvent(new view.CustomEvent("firefly:immersive-open"));
	const key = (key: string) =>
		dialog.dispatchEvent(
			new view.KeyboardEvent("keydown", {
				key,
				bubbles: true,
				cancelable: true,
			}),
		);
	return {
		view,
		dialog,
		carrier,
		normal,
		trigger,
		requests,
		pending,
		timers,
		changes,
		open,
		key,
		tick,
		click: (selector: string) =>
			dialog
				.querySelector(selector)
				?.dispatchEvent(new view.MouseEvent("click", { bubbles: true })),
		current: () =>
			dialog.querySelector("img[data-active]")?.getAttribute("src"),
		hasPlayback: () => [...timers.values()].some((t) => t.delay === 6500),
		hide: (value: boolean) => {
			hidden = value;
			view.document.dispatchEvent(new view.Event("visibilitychange"));
		},
		close: async () => {
			dispose();
			await view.happyDOM.close();
		},
	};
}
for (const mobile of [false, true]) {
	test(`immersive ${mobile ? "mobile" : "desktop"} uses the complete unique pool and preloads only the next image`, async () => {
		const f = fixture({ mobile });
		try {
			assert.equal(f.requests.length, 0);
			const before = f.normal.outerHTML;
			f.open();
			await flush();
			const count = mobile ? 4 : 5;
			const device = mobile ? "mobile" : "desktop";
			assert.equal(f.dialog.open, true);
			assert.equal(f.dialog.dataset.poolCount, String(count));
			assert.equal(f.current(), `/${device}-1.webp`);
			assert.equal(f.requests.length, 2);
			const seen = new Set([f.current()]);
			for (let i = 1; i < count; i++) {
				f.tick(6500);
				await flush();
				seen.add(f.current());
			}
			assert.equal(seen.size, count);
			assert.equal(
				f.normal.outerHTML,
				before,
				"normal assignments and active classes must stay untouched",
			);
			f.tick(6500);
			await flush();
			assert.equal(f.current(), `/${device}-1.webp`);
			f.key("Escape");
			f.tick(230);
			assert.equal(f.dialog.open, false);
			assert.deepEqual(f.changes, [true, false]);
			assert.equal(f.normal.outerHTML, before);
			assert.equal(f.timers.size, 0);
			assert.equal(f.view.document.activeElement, f.trigger);
			assert.equal(f.dialog.querySelectorAll("img[src]").length, 0);
		} finally {
			await f.close();
		}
	});
}
test("pause, previous/next, hidden-tab suspension and resumption preserve independent state", async () => {
	const f = fixture();
	try {
		f.open();
		await flush();
		f.key(" ");
		assert.equal(f.hasPlayback(), false);
		const first = f.current();
		f.key("ArrowRight");
		await flush();
		assert.notEqual(f.current(), first);
		assert.equal(f.hasPlayback(), false);
		f.key("ArrowLeft");
		await flush();
		assert.equal(f.current(), first);
		f.hide(true);
		f.hide(false);
		assert.equal(f.hasPlayback(), false);
		f.click("[data-immersive-pause]");
		assert.equal(f.hasPlayback(), true);
		f.hide(true);
		assert.equal(f.hasPlayback(), false);
		f.hide(false);
		assert.equal(f.hasPlayback(), true);
		f.key("q");
		f.tick(230);
		assert.equal(f.dialog.open, false);
	} finally {
		await f.close();
	}
});
test("loading failures skip bad images without touching the normal carousel", async () => {
	const f = fixture({ broken: new Set(["/desktop-1.webp"]) });
	try {
		const before = f.normal.outerHTML;
		f.open();
		await flush();
		assert.notEqual(f.current(), "/desktop-1.webp");
		assert.ok(f.current());
		f.tick(6500);
		await flush();
		assert.ok(f.current());
		assert.equal(f.normal.outerHTML, before);
	} finally {
		await f.close();
	}
});
test("an exit during a slow load cancels pending work and a later open starts cleanly", async () => {
	const f = fixture({ hold: true });
	try {
		f.open();
		assert.equal(f.current(), undefined);
		f.key("Escape");
		f.tick(230);
		f.pending.splice(0).forEach((resolve) => {
			resolve();
		});
		await flush();
		assert.equal(f.dialog.open, false);
		assert.equal(f.current(), undefined);
		assert.equal(f.timers.size, 0);
		f.open();
		f.pending.splice(0).forEach((resolve) => {
			resolve();
		});
		await flush();
		assert.equal(f.dialog.open, true);
		assert.ok(f.current());
	} finally {
		await f.close();
	}
});
test("native browser fullscreen exit also closes the viewer and restores focus", async () => {
	const f = fixture({ fullscreen: true });
	try {
		f.open();
		await flush();
		assert.equal(f.view.document.fullscreenElement, f.dialog);
		await f.view.document.exitFullscreen();
		f.tick(230);
		assert.equal(f.dialog.open, false);
		assert.deepEqual(f.changes, [true, false]);
		assert.equal(f.view.document.activeElement, f.trigger);
	} finally {
		await f.close();
	}
});
test("unsupported fullscreen and reduced motion still provide an immediately dismissible viewport viewer", async () => {
	const f = fixture({ reduced: true });
	try {
		f.open();
		await flush();
		assert.equal(f.dialog.open, true);
		f.click("[data-immersive-exit]");
		assert.equal(f.dialog.open, false);
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});
test("repeated entry and navigation cleanup do not duplicate viewers, playback timers or pause notifications", async () => {
	const f = fixture();
	try {
		f.open();
		f.open();
		await flush();
		assert.deepEqual(f.changes, [true]);
		assert.equal(
			[...f.timers.values()].filter((t) => t.delay === 6500).length,
			1,
		);
		f.view.document.dispatchEvent(new f.view.Event("swup:visit:start"));
		assert.equal(f.dialog.open, false);
		assert.equal(f.timers.size, 0);
		assert.deepEqual(f.changes, [true, false]);
		f.open();
		await flush();
		assert.equal(f.dialog.open, true);
	} finally {
		await f.close();
	}
});

test("a slow first image times out and advances while keeping exit responsive", async () => {
	const f = fixture({ hold: true });
	try {
		f.open();
		f.tick(15000);
		await flush();
		assert.equal(f.requests.length, 2);
		f.pending.splice(0).forEach((resolve) => {
			resolve();
		});
		await flush();
		assert.ok(f.current());
		assert.notEqual(f.current(), "/desktop-1.webp");
		f.key("Escape");
		f.tick(230);
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});
test("a fully unavailable library provides an error and still permits immediate exit", async () => {
	const broken = new Set(
		Array.from({ length: 5 }, (_, i) => `/desktop-${i}.webp`),
	);
	const f = fixture({ broken });
	try {
		f.open();
		await flush();
		assert.match(
			f.dialog.querySelector("[data-immersive-status]")?.textContent || "",
			/暂时未能加载/,
		);
		assert.equal(f.hasPlayback(), false);
		f.click("[data-immersive-exit]");
		f.tick(230);
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});
test("subsequent entries pick up additions to the shared library without changing normal slots", async () => {
	const f = fixture();
	try {
		f.open();
		await flush();
		f.key("Escape");
		f.tick(230);
		const covers = JSON.parse(f.carrier.dataset.randomCoverPool || "[]");
		covers.push({ wallpaperUrl: "/new-wallpaper.webp" });
		f.carrier.dataset.randomCoverPool = JSON.stringify(covers);
		f.open();
		await flush();
		assert.equal(f.dialog.dataset.poolCount, "6");
		assert.equal(f.normal.querySelectorAll(".slide-item").length, 2);
	} finally {
		await f.close();
	}
});
