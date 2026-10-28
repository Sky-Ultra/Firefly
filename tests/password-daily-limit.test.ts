import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { encryptContent, sealContent } from "../src/utils/crypto-utils";

const component = readFileSync(
	new URL("../src/components/features/EncryptedContent.astro", import.meta.url),
	"utf8",
);
const runtime = component.match(
	/<script is:inline>\s*([\s\S]*?)<\/script>/,
)?.[1];
assert.ok(runtime);
const secret = "test-only-secret";
const html = "<div data-reading-body><p>Test-only protected content</p></div>";
const payload = encryptContent(html, secret, "test");

function storage() {
	const values = new Map<string, string>();
	return {
		values,
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
		removeItem: (key: string) => {
			values.delete(key);
		},
	};
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
function fixture(
	options: {
		store?: Store;
		session?: Store;
		cached?: string;
		path?: string;
		clock?: { now: number };
		fault?: boolean;
		sealedPayload?: string;
		passwordLength?: number;
		examplePassword?: string;
		extras?: string;
		locks?: {
			request: (key: string, task: () => Promise<void>) => Promise<void>;
		};
	} = {},
) {
	const view = new Window({
		url: `https://example.test${options.path ?? "/posts/test/"}`,
		settings: { enableImageFileLoading: false },
	});
	Object.defineProperty(view.document, "hidden", {
		value: false,
		configurable: true,
	});
	view.document.documentElement.setAttribute("data-language", "zh-CN");
	const store = options.store ?? storage();
	const session = options.session ?? storage();
	if (options.cached) session.setItem("pw:test", options.cached);
	const clock = options.clock ?? {
		now: new Date(2026, 9, 26, 18, 0).getTime(),
	};
	class ClockDate extends Date {
		constructor(...args: unknown[]) {
			super(args.length ? Reflect.construct(Date, args).getTime() : clock.now);
		}
		static now() {
			return clock.now;
		}
	}
	view.document.body.innerHTML = `<div id="encrypted-container" data-slug="test" data-password-example="${options.examplePassword ?? ""}" data-password-length="${options.passwordLength ?? 0}" data-encrypted="${options.sealedPayload ?? payload}"><div id="password-ui"><form id="password-form"><input id="password-input" type="password"><button id="password-submit">解锁</button></form><p id="password-example-notice" class="hidden"></p><p id="password-error" class="hidden"></p><p id="password-attempt-status"></p><p id="password-lock-countdown" class="hidden"></p></div><div id="decrypted-content" class="hidden"></div>${options.extras ? `<template data-encrypted-extras>${options.extras}</template>` : ""}</div>`;
	let decryptCalls = 0;
	const subtle = new Proxy(webcrypto.subtle, {
		get(target, key) {
			const value = Reflect.get(target, key, target);
			if (typeof value !== "function") return value;
			return (...args: unknown[]) => {
				if (key === "decrypt") {
					decryptCalls++;
					if (options.fault)
						return Promise.reject(
							new TypeError("Test-only environment failure"),
						);
				}
				return Reflect.apply(value, target, args);
			};
		},
	});
	const crypto = { subtle };
	Object.defineProperty(view, "crypto", { value: crypto });
	if (options.locks)
		Object.defineProperty(view.navigator, "locks", { value: options.locks });
	const timeouts = new Map<number, { callback: () => void; delay: number }>();
	const intervals = new Map<number, () => void>();
	let timer = 0;
	const context = {
		window: view,
		document: view.document,
		navigator: view.navigator,
		crypto,
		localStorage: store,
		sessionStorage: session,
		Date: ClockDate,
		TextEncoder,
		TextDecoder,
		Uint8Array,
		atob,
		console,
		CustomEvent: view.CustomEvent,
		setTimeout: (callback: () => void, delay: number) => {
			const id = ++timer;
			timeouts.set(id, { callback, delay });
			return id;
		},
		clearTimeout: (id: number) => timeouts.delete(id),
		setInterval: (callback: () => void) => {
			const id = ++timer;
			intervals.set(id, callback);
			return id;
		},
		clearInterval: (id: number) => intervals.delete(id),
	};
	runInNewContext(runtime, context);
	const input = view.document.querySelector("input");
	const button = view.document.querySelector("button");
	const form = view.document.querySelector("form");
	assert.ok(input && button && form);
	const key = `firefly:password-failures:v1:${view.location.pathname}`;
	const settle = async () => {
		const deadline = Date.now() + 3000;
		while (form.getAttribute("aria-busy") === "true") {
			assert.ok(Date.now() < deadline, "decryption must settle");
			await new Promise((resolve) => setTimeout(resolve, 5));
		}
	};
	const begin = (value: string) => {
		input.value = value;
		form.dispatchEvent(
			new view.Event("submit", { bubbles: true, cancelable: true }),
		);
	};
	return {
		view,
		store,
		session,
		key,
		input,
		button,
		form,
		clock,
		intervals,
		timeouts,
		begin,
		settle,
		submit: async (value: string) => {
			begin(value);
			await settle();
		},
		calls: () => decryptCalls,
		record: () => JSON.parse(store.getItem(key) ?? "null"),
		locked: () =>
			view.document.getElementById("encrypted-container")?.dataset
				.passwordLocked === "true",
		unlocked: () =>
			!view.document
				.getElementById("decrypted-content")
				?.classList.contains("hidden"),
		status: () =>
			view.document.getElementById("password-attempt-status")?.textContent ??
			"",
		resetDelay: () =>
			[...timeouts.values()].find((value) => value.callback.name === "refresh")
				?.delay,
		sync: () => view.dispatchEvent(new view.StorageEvent("storage", { key })),
		reset: () => {
			const entry = [...timeouts.entries()].find(
				([, value]) => value.callback.name === "refresh",
			);
			assert.ok(entry);
			timeouts.delete(entry[0]);
			entry[1].callback();
		},
		close: async () => {
			runInNewContext("window.__fireflyEncryptedDispose?.()", context);
			timeouts.clear();
			intervals.clear();
			await view.happyDOM.close();
		},
	};
}

test("placeholders and accessible names reflect actual lengths and follow the page language", async () => {
	for (const length of [4, 8]) {
		const f = fixture({ passwordLength: length });
		try {
			assert.equal(f.input.placeholder, `请输入密码：${length}位数`);
			assert.equal(f.input.getAttribute("aria-label"), f.input.placeholder);
			assert.equal(
				f.input.maxLength,
				-1,
				"the hint must not impose an input limit",
			);
			f.view.document.documentElement.setAttribute("data-language", "en");
			f.view.document.dispatchEvent(
				new f.view.CustomEvent("firefly:language-change"),
			);
			assert.equal(f.input.placeholder, `Enter password: ${length} characters`);
		} finally {
			await f.close();
		}
	}
});

test("sealed bodies retain highlights and attach sharing extras only after successful decryption", async () => {
	const sealed = sealContent(
		'<div data-reading-body><p>Test body <mark class="theme-highlight">marked</mark></p></div>',
		"01234567",
	);
	const f = fixture({
		sealedPayload: sealed.payload,
		passwordLength: sealed.passwordLength,
		extras: '<button id="test-share">Share test content</button>',
	});
	try {
		assert.equal(f.view.document.getElementById("test-share"), null);
		await f.submit("wrong");
		assert.equal(f.view.document.querySelector("[data-reading-body]"), null);
		await f.submit("01234567");
		assert.ok(f.unlocked());
		assert.equal(
			f.view.document.querySelector("mark.theme-highlight")?.textContent,
			"marked",
		);
		assert.equal(f.view.document.querySelectorAll("#test-share").length, 1);
		await f.submit("01234567");
		assert.equal(f.view.document.querySelectorAll("#test-share").length, 1);
	} finally {
		await f.close();
	}
});

test("the first five failures remain retryable; the sixth locks and refresh cannot reset it", async () => {
	const store = storage();
	const f = fixture({ store });
	try {
		await f.submit(" ");
		assert.equal(f.record(), null);
		for (let index = 1; index <= 5; index++) {
			await f.submit("wrong");
			assert.equal(f.record().failures, index);
			assert.equal(f.input.disabled, false);
		}
		await f.submit("wrong");
		assert.equal(f.record().failures, 6);
		assert.ok(f.locked() && f.input.disabled && f.button.disabled);
		assert.equal(f.intervals.size, 1);
		await f.submit(secret);
		assert.equal(f.calls(), 6);
		assert.equal(f.unlocked(), false);
		assert.deepEqual(Object.keys(f.record()).sort(), ["day", "failures"]);
	} finally {
		await f.close();
	}
	const reloaded = fixture({ store, cached: secret });
	try {
		await reloaded.settle();
		assert.ok(reloaded.locked());
		assert.equal(reloaded.calls(), 0);
	} finally {
		await reloaded.close();
	}
});

test("midnight preserves the lock; local 04:00 resets an open page and starts a new period", async () => {
	const clock = { now: new Date(2026, 9, 26, 23, 59).getTime() };
	const f = fixture({ clock });
	try {
		for (let index = 0; index < 6; index++) await f.submit("wrong");
		f.clock.now = new Date(2026, 9, 27, 0, 0, 0, 50).getTime();
		f.reset();
		assert.ok(f.locked() && f.input.disabled && f.button.disabled);
		assert.match(
			f.view.document.getElementById("password-lock-countdown")?.textContent ??
				"",
			/04:00/,
		);
		f.clock.now = new Date(2026, 9, 27, 3, 59, 59, 999).getTime();
		f.reset();
		assert.ok(f.locked());
		f.clock.now = new Date(2026, 9, 27, 4, 0, 0, 50).getTime();
		f.reset();
		assert.equal(f.locked(), false);
		assert.equal(f.input.disabled, false);
		assert.equal(f.intervals.size, 0);
		await f.submit("wrong");
		assert.deepEqual(f.record(), { day: "2026-10-27", failures: 1 });
	} finally {
		await f.close();
	}
});

test("early-morning attempts and legacy midnight-based records remain locked until 04:00", async () => {
	const clock = { now: new Date(2026, 9, 27, 2, 30).getTime() };
	const store = storage();
	const f = fixture({ clock, store });
	try {
		await f.submit("wrong");
		assert.deepEqual(f.record(), { day: "2026-10-26", failures: 1 });
		store.setItem(f.key, JSON.stringify({ day: "2026-10-27", failures: 6 }));
		f.sync();
		assert.ok(f.locked());
	} finally {
		await f.close();
	}
	const reloaded = fixture({ clock, store });
	try {
		assert.ok(reloaded.locked());
		clock.now = new Date(2026, 9, 27, 4).getTime();
		reloaded.reset();
		assert.equal(reloaded.locked(), false);
		await reloaded.submit("wrong");
		assert.deepEqual(reloaded.record(), { day: "2026-10-27", failures: 1 });
	} finally {
		await reloaded.close();
	}
});

test("reset timers follow calendar 04:00 through daylight-saving transition dates", async () => {
	for (const [month, day] of [
		[3, 4],
		[9, 3],
	]) {
		const clock = { now: new Date(2026, month, day, 4).getTime() };
		const f = fixture({ clock });
		try {
			const nextReset = new Date(2026, month, day + 1, 4).getTime();
			assert.equal(f.resetDelay(), nextReset - clock.now + 25);
			await f.submit("wrong");
			clock.now = nextReset - 1;
			f.reset();
			assert.match(f.status(), /已输错 1 次/);
			clock.now = nextReset;
			f.reset();
			assert.doesNotMatch(f.status(), /已输错 1 次/);
		} finally {
			await f.close();
		}
	}
});

test("a correct password on the sixth attempt unlocks without clearing earlier daily failures", async () => {
	const f = fixture();
	try {
		for (let index = 0; index < 5; index++) await f.submit("wrong");
		await f.submit(secret);
		assert.ok(f.unlocked());
		assert.equal(f.record().failures, 5);
		assert.equal(f.session.getItem("pw:test"), secret);
		assert.equal(f.intervals.size, 0);
	} finally {
		await f.close();
	}
});

test("rapid duplicate submits count once and environment errors do not spend attempts", async () => {
	const f = fixture();
	try {
		f.begin("wrong");
		f.begin("wrong");
		await f.settle();
		assert.equal(f.record().failures, 1);
		assert.equal(f.calls(), 1);
	} finally {
		await f.close();
	}
	const broken = fixture({ fault: true });
	try {
		await broken.submit(secret);
		assert.equal(broken.record(), null);
		assert.equal(broken.input.disabled, false);
	} finally {
		await broken.close();
	}
});

test("stale cached passwords and unavailable storage do not misreport correct decryption", async () => {
	const cached = fixture({ cached: "stale-cache" });
	try {
		await cached.settle();
		assert.equal(cached.record(), null);
		assert.equal(cached.session.getItem("pw:test"), null);
	} finally {
		await cached.close();
	}
	const denied = {
		getItem: () => {
			throw new Error("storage denied");
		},
		setItem: () => {
			throw new Error("storage denied");
		},
		removeItem: () => {
			throw new Error("storage denied");
		},
	};
	const f = fixture({ store: denied, session: denied });
	try {
		await f.submit("wrong");
		assert.match(f.status(), /已输错 1 次/);
		await f.submit(secret);
		assert.ok(f.unlocked());
	} finally {
		await f.close();
	}
});

test("tabs share the same daily article limit while other articles remain independent", async () => {
	const store = storage();
	let tail = Promise.resolve();
	const locks = {
		request: (_key: string, task: () => Promise<void>) => {
			const next = tail.then(task);
			tail = next.catch(() => {});
			return next;
		},
	};
	const first = fixture({ store, locks });
	const second = fixture({ store, locks });
	const other = fixture({ store, path: "/posts/other/", locks });
	try {
		for (let index = 0; index < 5; index++) await first.submit("wrong");
		first.begin("wrong");
		second.begin("wrong");
		await Promise.all([first.settle(), second.settle()]);
		second.sync();
		assert.ok(first.locked() && second.locked());
		assert.equal(first.calls() + second.calls(), 6);
		assert.equal(other.locked(), false);
		await other.submit(secret);
		assert.ok(other.unlocked());
	} finally {
		await first.close();
		await second.close();
		await other.close();
	}
});

for (const examplePassword of ["20070427", "0427"]) {
	test(`birthday example ${examplePassword} displays the requested notice and retains normal failure counting`, async () => {
		const f = fixture({ examplePassword });
		try {
			await f.submit(examplePassword);
			const notice = f.view.document.getElementById("password-example-notice");
			assert.equal(notice?.textContent, "请你不要输入我的生日呀！！");
			assert.equal(notice?.classList.contains("hidden"), false);
			assert.equal(f.record().failures, 1);
			assert.equal(f.unlocked(), false);
			await f.submit("ordinary-wrong");
			assert.equal(notice?.classList.contains("hidden"), true);
			assert.equal(f.record().failures, 2);
			await f.submit(secret);
			assert.equal(f.unlocked(), true);
		} finally {
			await f.close();
		}
	});
}
test("the example notice cannot bypass the six-failure daily lock", async () => {
	const f = fixture({ examplePassword: "0427" });
	try {
		for (let i = 0; i < 6; i++) await f.submit("0427");
		assert.equal(f.locked(), true);
		assert.equal(f.record().failures, 6);
		const calls = f.calls();
		await f.submit(secret);
		assert.equal(f.calls(), calls);
		assert.equal(f.unlocked(), false);
	} finally {
		await f.close();
	}
});
