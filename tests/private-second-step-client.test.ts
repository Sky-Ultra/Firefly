/** biome-ignore-all lint/style/noNonNullAssertion: Fixture elements are asserted by construction. */
import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { mountPrivateArticleReader } from "../src/utils/private-article-client";

const flush = async () => {
	for (let i = 0; i < 8; i++) await new Promise<void>((r) => setImmediate(r));
};
test("sequential reader updates the hint and length, clears secrets, shares remaining errors and resynchronizes expiry", async () => {
	const view = new Window({
		url: "https://example.test/posts/long-night-love-letter/",
	});
	view.document.body.innerHTML =
		'<div data-article="long-night-love-letter" data-password-length="8" data-first-hint="First fixture hint"><div data-private-ui><p data-private-step hidden></p><p data-private-hint-text></p><p data-private-hint-details>Example</p><form data-private-form><input data-private-password type="password" disabled><button data-private-submit disabled></button></form><p data-private-status></p><p data-private-error hidden></p><button data-private-retry hidden></button></div><div data-private-content hidden></div></div>';
	const root = view.document.body.firstElementChild!;
	const input = root.querySelector<HTMLInputElement>("input")!;
	const requests: { password: string; step: number }[] = [];
	let phase = 1;
	let expire = false;
	let remaining = 5;
	const state = () => ({
		step: phase,
		steps: 2,
		remaining,
		locked: false,
		resetAt: Date.now() + 3600000,
		...(phase === 2 ? { passwordLength: 3, hint: "Second fixture hint" } : {}),
	});
	const previous = new Map<string, PropertyDescriptor | undefined>();
	for (const [key, value] of Object.entries({
		window: view,
		document: view.document,
		sessionStorage: view.sessionStorage,
		CustomEvent: view.CustomEvent,
		fetch: async (url: string, init: RequestInit) => {
			if (url.endsWith("/status")) return Response.json(state());
			if (url.endsWith("/content"))
				return Response.json({ error: "unauthorized" }, { status: 401 });
			const body = JSON.parse(String(init.body));
			requests.push(body);
			assert.equal(init.cache, "no-store");
			assert.equal(init.credentials, "same-origin");
			if (expire) {
				expire = false;
				phase = 1;
				return Response.json(
					{ ...state(), error: "step_changed" },
					{ status: 409 },
				);
			}
			if (phase === 1 && body.password === "11111111") {
				phase = 2;
				return Response.json({ ok: true, ...state() });
			}
			if (phase === 2 && body.password === "名字甲")
				return Response.json({
					ok: true,
					...state(),
					html: "<p data-reading-body>Test-only unlocked text</p>",
				});
			remaining--;
			return Response.json({ error: "incorrect", ...state() }, { status: 401 });
		},
	})) {
		previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
		Object.defineProperty(globalThis, key, {
			configurable: true,
			writable: true,
			value,
		});
	}
	const dispose = mountPrivateArticleReader(root as unknown as HTMLElement);
	const submit = async (value: string) => {
		input.value = value;
		root
			.querySelector("form")!
			.dispatchEvent(
				new view.Event("submit", { bubbles: true, cancelable: true }),
			);
		await flush();
	};
	try {
		await flush();
		assert.match(
			root.querySelector("[data-private-step]")!.textContent!,
			/1 \/ 2/,
		);
		await submit("11111111");
		assert.equal(requests.length, 1);
		assert.equal(requests[0].step, 1);
		assert.equal(input.value, "");
		assert.match(input.placeholder, /3/);
		assert.equal(
			root.querySelector<HTMLElement>("[data-private-content]")!.hidden,
			true,
		);
		assert.match(
			root.querySelector("[data-private-hint-text]")!.textContent!,
			/Second fixture hint/,
		);
		assert.equal(
			root.querySelector<HTMLElement>("[data-private-hint-details]")!.hidden,
			true,
		);
		assert.equal(
			root.querySelector<HTMLElement>("[data-private-error]")!.dataset.kind,
			"info",
		);
		await submit("11111111");
		assert.equal(
			requests.length,
			1,
			"stale first-step autofill must not spend second-step quota",
		);
		await submit("名字错");
		assert.equal(requests.length, 2);
		assert.equal(requests[1].step, 2);
		assert.match(
			root.querySelector("[data-private-status]")!.textContent!,
			/4/,
		);
		assert.equal(input.value, "");
		expire = true;
		await submit("名字甲");
		assert.match(input.placeholder, /8/);
		assert.match(
			root.querySelector("[data-private-hint-text]")!.textContent!,
			/First fixture hint/,
		);
		assert.match(
			root.querySelector("[data-private-step]")!.textContent!,
			/1 \/ 2/,
		);
		await submit("11111111");
		await submit("名字甲");
		assert.equal(
			root.querySelector<HTMLElement>("[data-private-content]")!.hidden,
			false,
		);
		assert.equal(
			root.querySelector<HTMLElement>("[data-private-ui]")!.hidden,
			true,
		);
		assert.equal(input.value, "");
		assert.equal(view.sessionStorage.length, 0);
		assert.equal(view.localStorage.length, 0);
	} finally {
		dispose();
		await view.happyDOM.close();
		for (const [key, descriptor] of previous) {
			if (descriptor) Object.defineProperty(globalThis, key, descriptor);
			else Reflect.deleteProperty(globalThis, key);
		}
	}
});
