import assert from "node:assert/strict";
import test from "node:test";
import { registerJellyHover } from "../src/utils/jelly-hover";

function fixture(profile = "avatar") {
	const globals = ["window", "document", "HTMLElement", "customElements"];
	const original = new Map(
		globals.map((name) => [
			name,
			Object.getOwnPropertyDescriptor(globalThis, name),
		]),
	);
	const frames = new Map<number, FrameRequestCallback>();
	let nextFrame = 0;
	let now = performance.now();
	class MotionQuery extends EventTarget {
		matches = true;
	}
	const query = new MotionQuery();
	class WindowFixture extends EventTarget {
		matchMedia() {
			return query;
		}
		requestAnimationFrame(callback: FrameRequestCallback) {
			frames.set(++nextFrame, callback);
			return nextFrame;
		}
		cancelAnimationFrame(id: number) {
			frames.delete(id);
		}
	}
	class DocumentFixture extends EventTarget {
		hidden = false;
	}
	class ElementFixture extends EventTarget {
		isConnected = true;
		disabled = false;
		dataset: Record<string, string> = { jellyProfile: profile };
		values = new Map<string, string>();
		style = {
			setProperty: (key: string, value: string) => this.values.set(key, value),
			removeProperty: (key: string) => this.values.delete(key),
		};
		bounds = { left: 20, top: 40, width: 120, height: 120 };
		visual = { isConnected: true, matches: () => this.disabled };
		getBoundingClientRect() {
			return this.bounds;
		}
		querySelector() {
			return this.visual;
		}
		hasAttribute(name: string) {
			return name === "data-jelly-active" && "jellyActive" in this.dataset;
		}
		connectedCallback() {}
		disconnectedCallback() {}
	}
	const registry = new Map<string, CustomElementConstructor>();
	const windowFixture = new WindowFixture();
	const documentFixture = new DocumentFixture();
	for (const [name, value] of Object.entries({
		window: windowFixture,
		document: documentFixture,
		HTMLElement: ElementFixture,
		customElements: {
			get: (key: string) => registry.get(key),
			define: (key: string, value: CustomElementConstructor) =>
				registry.set(key, value),
		},
	})) {
		Object.defineProperty(globalThis, name, { configurable: true, value });
	}
	registerJellyHover();
	registerJellyHover();
	assert.equal(registry.size, 1);
	const Host = registry.get("jelly-hover") as unknown as typeof ElementFixture;
	const host = new Host();
	host.connectedCallback();
	host.connectedCallback();
	const pointer = (type: string, x = 140, y = 160, pointerType = "mouse") => {
		const event = new Event(type, { cancelable: true });
		Object.assign(event, { clientX: x, clientY: y, pointerType });
		host.dispatchEvent(event);
		return event;
	};
	const flush = () => {
		now += 1000 / 120;
		const pending = [...frames.values()];
		frames.clear();
		for (const callback of pending) callback(now);
	};
	const settle = () => {
		for (let i = 0; i < 300 && frames.size; i++) flush();
		assert.equal(
			frames.size,
			0,
			"the spring must stop its frame loop when settled",
		);
	};
	return {
		host,
		frames,
		query,
		windowFixture,
		documentFixture,
		pointer,
		flush,
		settle,
		cleanup() {
			host.isConnected = false;
			host.disconnectedCallback();
			for (const [name, descriptor] of original) {
				if (descriptor) Object.defineProperty(globalThis, name, descriptor);
				else Reflect.deleteProperty(globalThis, name);
			}
		},
	};
}

test("avatar spring retargets continuously, uses fixed host geometry and returns exactly to rest", () => {
	const f = fixture();
	try {
		const bounds = { ...f.host.bounds };
		f.pointer("pointerenter");
		for (let i = 0; i < 15; i++) f.flush();
		const before = f.host.values.get("--jelly-x");
		assert.ok(Number.parseFloat(before || "0") > 0);
		f.pointer("pointermove", 20, 40);
		assert.equal(
			f.host.values.get("--jelly-x"),
			before,
			"retargeting must not synchronously snap the image",
		);
		f.settle();
		assert.equal(f.host.values.get("--jelly-x"), "-6.000px");
		assert.deepEqual(
			f.host.bounds,
			bounds,
			"the hit area never moves with its child",
		);
		f.pointer("pointerleave");
		f.settle();
		assert.equal(f.host.values.size, 0);
		assert.equal("jellyMoving" in f.host.dataset, false);
		f.pointer("pointerenter");
		f.pointer("pointerleave");
		f.pointer("pointerenter", 20, 40);
		f.pointer("pointerleave");
		f.settle();
		assert.equal(
			f.host.values.size,
			0,
			"rapid enter/leave must not leave residual offsets",
		);
	} finally {
		f.cleanup();
	}
});

test("touch, disabled buttons and reduced-motion changes do not leave moving controls", () => {
	const f = fixture("control");
	try {
		f.pointer("pointerenter", 140, 160, "touch");
		assert.equal(f.frames.size, 0);
		f.host.disabled = true;
		f.pointer("pointerenter");
		assert.equal(f.frames.size, 0);
		f.host.disabled = false;
		f.pointer("pointerenter");
		f.flush();
		assert.ok(f.frames.size > 0);
		f.host.disabled = true;
		f.flush();
		assert.equal(f.frames.size, 0);
		assert.equal(f.host.values.size, 0);
		f.host.disabled = false;
		f.pointer("pointerenter");
		f.flush();
		f.query.matches = false;
		f.query.dispatchEvent(new Event("change"));
		assert.equal(f.frames.size, 0);
		assert.equal(f.host.values.size, 0);
		assert.equal(f.pointer("click").defaultPrevented, false);
	} finally {
		f.cleanup();
	}
});

test("a settled pagination hover resets when its click disables the button", () => {
	const f = fixture("control");
	try {
		f.pointer("pointerenter");
		f.settle();
		assert.equal(f.host.values.get("--jelly-x"), "1.800px");
		assert.equal(f.pointer("click").defaultPrevented, false);
		// Svelte updates disabled during the click task, before the next paint.
		f.host.disabled = true;
		f.flush();
		assert.equal(f.host.values.size, 0);
		assert.equal("jellyActive" in f.host.dataset, false);
	} finally {
		f.cleanup();
	}
});

test("scroll, resize, backgrounding and disconnect cleanly stop work and remove listeners", () => {
	const f = fixture();
	try {
		f.pointer("pointerenter");
		f.flush();
		f.windowFixture.dispatchEvent(new Event("scroll"));
		f.settle();
		assert.equal(f.host.values.size, 0);
		f.pointer("pointerenter");
		f.flush();
		f.windowFixture.dispatchEvent(new Event("resize"));
		assert.equal(f.host.values.size, 0);
		f.pointer("pointerenter");
		f.flush();
		f.documentFixture.hidden = true;
		f.documentFixture.dispatchEvent(new Event("visibilitychange"));
		assert.equal(f.frames.size, 0);
		f.pointer("pointerenter");
		f.flush();
		f.host.disconnectedCallback();
		assert.equal(f.frames.size, 0);
		assert.equal(f.host.values.size, 0);
		f.pointer("pointerenter");
		f.windowFixture.dispatchEvent(new Event("resize"));
		assert.equal(
			f.frames.size,
			0,
			"a removed Swup or Svelte element must no longer react",
		);
	} finally {
		f.cleanup();
	}
});
