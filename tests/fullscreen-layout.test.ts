import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import { fairytaleMotion } from "../src/utils/fairytale-layout";
import {
	applyFairytaleSettings,
	FAIRYTALE_DEFAULTS,
	FAIRYTALE_SETTINGS_KEY,
	FULLSCREEN_LAYOUT_KEY,
	normalizeFairytaleSettings,
	readFullscreenPreferences,
} from "../src/utils/fullscreen-layout";

const source = (path: string) =>
	readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("classic is the default and corrupt or blocked storage cannot affect the existing theme", () => {
	const values = new Map([
		["wallpaperMode", "overlay"],
		["overlayBlur", "19"],
		["overlayCardOpacity", "0.3"],
	]);
	const storage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
	};
	assert.deepEqual(readFullscreenPreferences(storage), {
		layout: "classic",
		settings: FAIRYTALE_DEFAULTS,
	});
	values.set(FULLSCREEN_LAYOUT_KEY, "fairytale");
	values.set(
		FAIRYTALE_SETTINGS_KEY,
		'{"blur":7,"wallpaperOpacity":0.8,"cardOpacity":0.7}',
	);
	assert.equal(readFullscreenPreferences(storage).settings.blur, 7);
	assert.equal(values.get("overlayBlur"), "19");
	values.set(FAIRYTALE_SETTINGS_KEY, "broken json");
	assert.deepEqual(
		readFullscreenPreferences(storage).settings,
		FAIRYTALE_DEFAULTS,
	);
	assert.equal(
		readFullscreenPreferences({
			getItem: () => {
				throw Error("blocked");
			},
			setItem: () => {},
		}).layout,
		"classic",
	);
});
test("new settings are bounded and write only namespaced presentation variables", async () => {
	assert.deepEqual(
		normalizeFairytaleSettings({
			blur: 100,
			wallpaperOpacity: -1,
			cardOpacity: Number.NaN,
		}),
		{
			blur: 20,
			wallpaperOpacity: 0.2,
			cardOpacity: FAIRYTALE_DEFAULTS.cardOpacity,
		},
	);
	const view = new Window();
	try {
		view.document.documentElement.style.setProperty("--primary", "pink");
		view.document.documentElement.style.fontSize = "16px";
		applyFairytaleSettings(
			{ blur: 6, wallpaperOpacity: 0.9, cardOpacity: 0.8 },
			view.document.documentElement as unknown as HTMLElement,
		);
		assert.equal(view.document.documentElement.style.fontSize, "16px");
		assert.equal(
			view.document.documentElement.style.getPropertyValue("--primary"),
			"pink",
		);
		assert.equal(
			view.document.documentElement.style.getPropertyValue("--fairytale-blur"),
			"6px",
		);
	} finally {
		await view.happyDOM.close();
	}
});
test("every presentation selector requires both fullscreen and fairytale, with no navbar or root font reset", () => {
	const css = source("src/styles/fairytale-layout.css");
	for (const rule of css
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.matchAll(/([^{}]+)\{/g)) {
		if (rule[1].trim().startsWith("@")) continue;
		for (const selector of rule[1].split(/,\s*(?=html)/))
			assert.match(
				selector.trim(),
				/^html(?:\.dark)?\[data-wallpaper-mode="fullscreen"\]\[data-fullscreen-layout="fairytale"\]/,
			);
	}
	assert.doesNotMatch(css, /:root|font-size|font-family|#navbar|--primary\s*:/);
	assert.match(css, /#header-waves/);
	assert.match(css, /prefers-reduced-motion/);
	assert.match(
		source("src/components/features/FullscreenPreferences.astro"),
		/script is:inline data-swup-ignore-script/,
	);
});

async function fixture(layout = "classic") {
	const view = new Window({
		url: "https://example.test/",
		settings: { enableImageFileLoading: false },
	});
	view.document.documentElement.dataset.wallpaperMode = "fullscreen";
	view.document.documentElement.dataset.fullscreenLayout = layout;
	view.document.body.classList.add("is-home");
	view.document.body.innerHTML =
		'<div id="wallpaper-wrapper"><div id="banner-images-container"><div class="slide-item hidden lg:block active" data-wallpaper-src="/desktop-a.webp"><img></div><div class="slide-item hidden lg:block" data-wallpaper-src="/desktop-b.webp"><img></div><div class="slide-item block lg:hidden active" data-wallpaper-src="/mobile.webp"><img></div></div></div><main id="main-grid"></main><fairytale-layout hidden><img data-fairytale-image><img data-fairytale-image></fairytale-layout>';
	Object.defineProperty(view, "innerWidth", { value: 1440, writable: true });
	Object.defineProperty(view, "innerHeight", { value: 1000, writable: true });
	Object.defineProperty(view, "scrollY", { value: 0, writable: true });
	const timers = new Map<number, () => void>();
	const frames = new Map<number, FrameRequestCallback>();
	let next = 0;
	view.setTimeout = ((cb: () => void) => {
		timers.set(++next, cb);
		return next;
	}) as typeof view.setTimeout;
	view.clearTimeout = ((id: number) => {
		timers.delete(id);
	}) as typeof view.clearTimeout;
	const request = (cb: FrameRequestCallback) => {
		frames.set(++next, cb);
		return next;
	};
	const cancel = (id: number) => {
		frames.delete(id);
	};
	const runtime = transpileModule(
		source("src/utils/fairytale-layout.ts").replace(/^export /gm, ""),
		{
			compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
		},
	).outputText;
	const backdrop = view.document.querySelector<HTMLElement>("fairytale-layout");
	assert.ok(backdrop);
	const original = view.document.getElementById(
		"banner-images-container",
	)?.innerHTML;
	const dispose = runInNewContext(
		`${runtime}\nmountFairytaleLayout(document.querySelector('fairytale-layout'));`,
		{
			window: view,
			document: view.document,
			MutationObserver: view.MutationObserver,
			AbortController: view.AbortController,
			requestAnimationFrame: request,
			cancelAnimationFrame: cancel,
			queueMicrotask,
			Event: view.Event,
		},
	) as () => void;
	const flush = async () => {
		await new Promise<void>((resolve) => setImmediate(resolve));
		for (const [id, cb] of [...frames]) {
			frames.delete(id);
			cb(0);
		}
		await Promise.resolve();
		await Promise.resolve();
	};
	return {
		view,
		backdrop,
		timers,
		frames,
		original,
		flush,
		dispose,
		close: async () => {
			dispose();
			assert.equal(timers.size, 0);
			assert.equal(frames.size, 0);
			await view.happyDOM.close();
		},
	};
}
test("classic creates no image requests or scroll work; enabling copies only the current device image", async () => {
	const f = await fixture();
	try {
		await f.flush();
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
		assert.equal(f.timers.size, 0);
		f.view.document.documentElement.dataset.fullscreenLayout = "fairytale";
		await f.flush();
		const image = f.backdrop.querySelector<HTMLImageElement>(
			'img[src="/desktop-a.webp"]',
		);
		assert.ok(image);
		image.dispatchEvent(new f.view.Event("load"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			"true",
		);
		assert.equal(
			f.view.document.getElementById("banner-images-container")?.innerHTML,
			f.original,
		);
		Object.defineProperty(f.view, "scrollY", { value: 650, writable: true });
		f.view.dispatchEvent(new f.view.Event("scroll"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-blur-progress",
			),
			"0.813",
		);
		f.view.document.documentElement.dataset.fullscreenLayout = "classic";
		await f.flush();
		assert.equal(f.backdrop.hidden, true);
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
		assert.equal(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-progress",
			),
			"",
		);
	} finally {
		await f.close();
	}
});
test("rapid carousel changes, device resizing and deactivation cannot display an obsolete image", async () => {
	const f = await fixture("fairytale");
	try {
		await f.flush();
		const image = f.backdrop.querySelector<HTMLImageElement>("img[src]");
		assert.ok(image);
		const stale = image.onload;
		assert.ok(stale);
		const slides = f.view.document.querySelectorAll(".slide-item");
		slides[0].classList.remove("active");
		slides[1].classList.add("active");
		await f.flush();
		stale.call(image, new f.view.Event("load"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			undefined,
		);
		Object.defineProperty(f.view, "innerWidth", { value: 390, writable: true });
		f.view.dispatchEvent(new f.view.Event("resize"));
		await f.flush();
		assert.ok(f.backdrop.querySelector('img[src="/mobile.webp"]'));
		f.view.document.documentElement.dataset.wallpaperMode = "overlay";
		await f.flush();
		assert.equal(f.backdrop.hidden, true);
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
	} finally {
		await f.close();
	}
});

test("reference Hero timing keeps the top sharp even at maximum blur and separates title fading", () => {
	assert.deepEqual(fairytaleMotion(0, 1000), {
		blurProgress: 0,
		titleOpacity: 1,
	});
	assert.equal(fairytaleMotion(400, 1000).blurProgress, 0.5);
	assert.equal(fairytaleMotion(500, 1000).titleOpacity, 0);
	assert.equal(fairytaleMotion(800, 1000).blurProgress, 1);
	assert.equal(fairytaleMotion(-50, 1000).blurProgress, 0);
	assert.ok(Number.isFinite(fairytaleMotion(0, 0).blurProgress));
	const css = source("src/styles/fairytale-layout.css");
	assert.match(
		css,
		/#header-waves,[\s\S]*#wallpaper-gradient,[\s\S]*display: none !important/,
	);
	assert.doesNotMatch(css, /opacity: var\(--fairytale-wallpaper-opacity/);
	assert.match(css, /1\.2s cubic-bezier\(\.2,0,0,1\)/);
	const panel = source("src/components/controls/FairytaleDisplayPanel.svelte");
	assert.match(panel, /role="tablist"/);
	assert.match(panel, /max=\{20\} step=\{0.5\}/);
	assert.doesNotMatch(panel, /童话壁纸透明度/);
});
