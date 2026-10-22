import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const mathPath = new URL("../src/utils/reading-progress.ts", import.meta.url);
const math = existsSync(mathPath)
	? await import("../src/utils/reading-progress")
	: null;
const runtimePath = new URL(
	"../src/utils/reading-progress-runtime.ts",
	import.meta.url,
);
const runtimeModule = existsSync(runtimePath)
	? await import("../src/utils/reading-progress-runtime")
	: null;

function progress(top: number, height: number, viewport = 800, inset = 0) {
	assert.ok(math, "The article-body progress helper must exist");
	return math.getReadingProgress({ top, height }, viewport, inset);
}

function source(path: string): string {
	const location = new URL(`../${path}`, import.meta.url);
	return existsSync(location) ? readFileSync(location, "utf8") : "";
}

test("long article progress starts at the body and reaches its end before comments", () => {
	assert.equal(progress(300, 2_000), 0);
	assert.equal(progress(0, 2_000), 0);
	assert.equal(progress(-600, 2_000), 0.5);
	assert.equal(progress(-1_200, 2_000), 1);
});

test("a visible header reduces the reading viewport", () => {
	assert.equal(progress(72, 2_000, 800, 72), 0);
	assert.equal(progress(-564, 2_000, 800, 72), 0.5);
	assert.equal(progress(-1_200, 2_000, 800, 72), 1);
});

test("progress clamps before the body and after its end, including overscroll", () => {
	assert.equal(progress(3_000, 2_000), 0);
	assert.equal(progress(-5_000, 2_000), 1);
});

test("short articles finish when the complete body fits in the reading viewport", () => {
	assert.equal(progress(700, 200), 0);
	assert.equal(progress(600, 200), 1);
	assert.equal(progress(72, 600, 800, 72), 1);
	assert.equal(progress(0, 800), 1);
});

test("empty bodies and unusable geometry never manufacture completion", () => {
	assert.equal(progress(-100, 0), 0);
	assert.equal(progress(0, -100), 0);
	assert.equal(progress(0, 2_000, 0), 0);
	assert.equal(progress(Number.NaN, 2_000), 0);
	assert.equal(progress(0, Number.POSITIVE_INFINITY), 0);
	assert.equal(progress(0, 2_000, 800, 800), 0);
});

test("only the four language body wrappers are marked, including encrypted content", () => {
	const article = source("src/pages/posts/[...slug].astro");
	assert.equal((article.match(/data-reading-body/g) || []).length, 4);
	assert.equal(
		(
			article.match(
				/data-language-only="(?:zh-CN|en)" data-pagefind-body data-reading-body/g,
			) || []
		).length,
		4,
	);
	assert.match(
		article,
		/<EncryptedPost[\s\S]*?data-reading-body[\s\S]*?<\/EncryptedPost>/,
	);
});

test("the hidden progress control occupies no flex slot and precedes home and top", () => {
	const controls = source("src/components/controls/FloatingControls.astro");
	assert.ok(controls.indexOf("<ReadingProgress") >= 0);
	assert.ok(
		controls.indexOf("<ReadingProgress") < controls.indexOf("<BackToHome"),
	);
	assert.ok(
		controls.indexOf("<ReadingProgress") < controls.indexOf("<BackToTop"),
	);
	const component = source("src/components/controls/ReadingProgress.astro");
	assert.match(component, /<article-reading-progress[^>]*hidden/);
	assert.match(
		component,
		/article-reading-progress\[hidden\]\s*\{\s*display: none/,
	);
	assert.match(component, /<button[\s\S]*?type="button"[\s\S]*?aria-label=/);
	assert.match(component, /stroke-dasharray="100"/);
	assert.match(component, /data-reading-percentage/);
});

test("the runtime refreshes route, language, decryption and size changes with cleanup", () => {
	const runtime = source("src/utils/reading-progress-runtime.ts");
	for (const event of [
		"firefly:language-change",
		"swup:contentReplaced",
		"swup:enable",
		"password:decrypted",
	])
		assert.ok(runtime.includes(event), `Missing ${event} refresh`);
	assert.match(runtime, /ResizeObserver/);
	assert.match(runtime, /MutationObserver/);
	assert.match(runtime, /fonts/);
	assert.match(runtime, /passive: true/);
	assert.match(runtime, /cancelAnimationFrame/);
	assert.match(runtime, /disconnectedCallback/);
	assert.match(runtime, /prefers-reduced-motion/);
	assert.doesNotMatch(runtime, /setInterval|setTimeout/);
});

function runtimeFixture() {
	assert.ok(runtimeModule, "The article progress runtime must exist");
	const descriptors = new Map(
		[
			"window",
			"document",
			"HTMLElement",
			"customElements",
			"ResizeObserver",
			"MutationObserver",
			"getComputedStyle",
		].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]),
	);
	const frames = new Map<number, FrameRequestCallback>();
	let nextFrame = 0;
	const value = { textContent: "0%" };
	const attributes = new Map<string, string>();
	const ring = {
		setAttribute: (name: string, content: string) =>
			attributes.set(`ring:${name}`, content),
	};
	const button = Object.assign(new EventTarget(), {
		setAttribute: (name: string, content: string) =>
			attributes.set(name, content),
	});
	const geometry = { top: -600, height: 2_000 };
	const body = {
		isConnected: true,
		textContent: "Article body",
		getClientRects: () => [geometry],
		getBoundingClientRect: () => geometry,
		querySelector: () => null,
	};
	let bodyHidden = false;
	const wrapper = {
		closest: () => (bodyHidden ? {} : null),
		querySelector: () => body,
	};
	const post = Object.assign(new EventTarget(), {
		querySelectorAll: () => wrappers,
	});
	let wrappers = [wrapper];
	let currentPost: typeof post | null = post;
	const hooks = new Map<string, Set<() => void>>();
	const swup = {
		hooks: {
			on(name: string, handler: () => void) {
				if (!hooks.has(name)) hooks.set(name, new Set());
				hooks.get(name)?.add(handler);
			},
			off(name: string, handler: () => void) {
				hooks.get(name)?.delete(handler);
			},
		},
	};
	let reducedMotion = false;
	let scrollOptions: ScrollToOptions | undefined;
	const windowFixture = Object.assign(new EventTarget(), {
		swup,
		scrollY: 1_000,
		innerHeight: 800,
		requestAnimationFrame(callback: FrameRequestCallback) {
			frames.set(++nextFrame, callback);
			return nextFrame;
		},
		cancelAnimationFrame(id: number) {
			frames.delete(id);
		},
		matchMedia: () => ({ matches: reducedMotion }),
		scrollTo: (options: ScrollToOptions) => {
			scrollOptions = options;
		},
	});
	const documentFixture = Object.assign(new EventTarget(), {
		fonts: new EventTarget(),
		documentElement: { dataset: { language: "zh-CN" } },
		querySelector: () => currentPost,
		getElementById: () => null,
	});
	class ElementFixture extends EventTarget {
		hidden = true;
		isConnected = true;
		querySelector(selector: string) {
			return selector === "button"
				? button
				: selector === "[data-reading-ring]"
					? ring
					: value;
		}
	}
	class ObserverFixture {
		static instances: ObserverFixture[] = [];
		observed = new Set<unknown>();
		constructor(public callback: () => void) {
			ObserverFixture.instances.push(this);
		}
		observe(target: unknown) {
			this.observed.add(target);
		}
		unobserve(target: unknown) {
			this.observed.delete(target);
		}
		disconnect() {
			this.observed.clear();
		}
	}
	const registry = new Map<string, CustomElementConstructor>();
	Object.assign(globalThis, {
		window: windowFixture,
		document: documentFixture,
		HTMLElement: ElementFixture,
		customElements: {
			get: (name: string) => registry.get(name),
			define: (name: string, elementClass: CustomElementConstructor) =>
				registry.set(name, elementClass),
		},
		ResizeObserver: ObserverFixture,
		MutationObserver: ObserverFixture,
		getComputedStyle: () => ({ position: "static" }),
	});
	runtimeModule.registerReadingProgress();
	const Constructor = registry.get("article-reading-progress");
	assert.ok(Constructor);
	const host = new Constructor() as unknown as ElementFixture & {
		connectedCallback(): void;
		disconnectedCallback(): void;
	};
	host.connectedCallback();
	const flush = () => {
		const pending = [...frames.values()];
		frames.clear();
		for (const callback of pending) callback(0);
	};
	return {
		host,
		value,
		attributes,
		button,
		geometry,
		frames,
		post,
		windowFixture,
		documentFixture,
		observers: ObserverFixture.instances,
		flush,
		emitHook: (name: string) => {
			for (const callback of hooks.get(name) ?? []) callback();
		},
		setPost: (present: boolean) => {
			currentPost = present ? post : null;
		},
		setLocked: (locked: boolean) => {
			wrappers = locked ? [] : [wrapper];
		},
		setBodyHidden: (hidden: boolean) => {
			bodyHidden = hidden;
		},
		setReducedMotion: () => {
			reducedMotion = true;
		},
		getScrollOptions: () => scrollOptions,
		getHookCount: () =>
			[...hooks.values()].reduce((count, handlers) => count + handlers.size, 0),
		restore: () => {
			host.isConnected = false;
			host.disconnectedCallback();
			for (const [name, descriptor] of descriptors) {
				if (descriptor) Object.defineProperty(globalThis, name, descriptor);
				else Reflect.deleteProperty(globalThis, name);
			}
		},
	};
}

test("runtime coalesces real events and updates geometry, language and reduced-motion clicks", () => {
	const fixture = runtimeFixture();
	try {
		fixture.flush();
		assert.equal(fixture.host.hidden, false);
		assert.equal(fixture.value.textContent, "50%");
		assert.equal(fixture.attributes.get("ring:stroke-dashoffset"), "50");
		fixture.geometry.height = 3_000;
		fixture.documentFixture.documentElement.dataset.language = "en";
		fixture.documentFixture.dispatchEvent(new Event("firefly:language-change"));
		fixture.windowFixture.dispatchEvent(new Event("scroll"));
		fixture.windowFixture.dispatchEvent(new Event("scroll"));
		assert.equal(fixture.frames.size, 1);
		fixture.flush();
		assert.equal(fixture.value.textContent, "27%");
		assert.match(
			fixture.attributes.get("aria-label") ?? "",
			/Reading progress 27%/,
		);
		assert.equal(
			fixture.frames.size,
			0,
			"updates must not perpetually schedule frames",
		);
		fixture.setReducedMotion();
		fixture.button.dispatchEvent(new Event("click"));
		assert.deepEqual(fixture.getScrollOptions(), {
			top: 400,
			behavior: "instant",
		});
	} finally {
		fixture.restore();
	}
});

test("locked, hidden and non-article bodies disappear; route and disconnect cleanup release resources", () => {
	const fixture = runtimeFixture();
	try {
		fixture.setLocked(true);
		fixture.flush();
		assert.equal(fixture.host.hidden, true);
		fixture.setLocked(false);
		fixture.documentFixture.dispatchEvent(new Event("password:decrypted"));
		fixture.flush();
		assert.equal(fixture.host.hidden, false);
		fixture.setBodyHidden(true);
		fixture.documentFixture.dispatchEvent(new Event("firefly:language-change"));
		fixture.flush();
		assert.equal(fixture.host.hidden, true);
		fixture.setBodyHidden(false);
		fixture.emitHook("visit:start");
		fixture.setPost(false);
		fixture.emitHook("content:replace");
		fixture.flush();
		assert.equal(fixture.host.hidden, true);
		assert.ok(
			fixture.observers.every((observer) => observer.observed.size === 0),
		);
		fixture.post.dispatchEvent(new Event("load"));
		assert.equal(fixture.frames.size, 0);
		fixture.setPost(true);
		fixture.emitHook("content:replace");
		fixture.flush();
		assert.equal(fixture.host.hidden, false);
		assert.equal(fixture.getHookCount(), 4);
		fixture.host.isConnected = false;
		fixture.host.disconnectedCallback();
		assert.equal(fixture.getHookCount(), 0);
		assert.ok(
			fixture.observers.every((observer) => observer.observed.size === 0),
		);
		fixture.documentFixture.dispatchEvent(new Event("firefly:language-change"));
		fixture.windowFixture.dispatchEvent(new Event("scroll"));
		assert.equal(fixture.frames.size, 0);
	} finally {
		fixture.restore();
	}
});
