/** biome-ignore-all lint/style/noNonNullAssertion: DOM fixtures must fail loudly. */
import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { mountPrivateArticleReader } from "../src/utils/private-article-client";

const flush = async () => {
	for (let i = 0; i < 8; i++) await new Promise<void>((r) => setImmediate(r));
};

async function fixture(length?: number) {
	const view = new Window({ url: "https://example.test/posts/one/" });
	view.document.body.innerHTML = `<div data-article="liking" ${length ? `data-password-length="${length}"` : ""}><div data-private-ui><form data-private-form><input data-private-password type="password" disabled><button data-private-submit disabled></button></form><p data-private-status></p><p data-private-error hidden></p><button data-private-retry hidden></button></div><div data-private-content hidden></div></div>`;
	const root = view.document.body.firstElementChild!;
	const previous = new Map<string, PropertyDescriptor | undefined>();
	let unlocks = 0;
	for (const [key, value] of Object.entries({
		window: view,
		document: view.document,
		sessionStorage: view.sessionStorage,
		fetch: async (url: string) => {
			if (url.endsWith("/status"))
				return Response.json({
					remaining: 5,
					locked: false,
					resetAt: Date.now() + 3600000,
				});
			if (url.endsWith("/content"))
				return Response.json({ error: "unauthorized" }, { status: 401 });
			unlocks++;
			return Response.json(
				{
					error: "incorrect",
					remaining: 4,
					locked: false,
					resetAt: Date.now() + 3600000,
				},
				{ status: 401 },
			);
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
	await flush();
	return {
		root,
		input: root.querySelector<HTMLInputElement>("input")!,
		async submit(value: string) {
			this.input.value = value;
			root
				.querySelector("form")!
				.dispatchEvent(
					new view.Event("submit", { bubbles: true, cancelable: true }),
				);
			await flush();
		},
		getUnlocks: () => unlocks,
		async close() {
			dispose();
			await view.happyDOM.close();
			for (const [key, descriptor] of previous) {
				if (descriptor) Object.defineProperty(globalThis, key, descriptor);
				else Reflect.deleteProperty(globalThis, key);
			}
		},
	};
}

test("a mismatched browser-filled password never reaches verification or spends quota", async () => {
	const f = await fixture(4);
	try {
		await f.submit("accountpw!");
		assert.equal(f.getUnlocks(), 0);
		assert.equal(
			f.root.querySelector<HTMLElement>("[data-private-error]")!.hidden,
			false,
		);
		assert.match(
			f.root.querySelector("[data-private-error]")!.textContent!,
			/4/,
		);
		assert.match(
			f.root.querySelector("[data-private-status]")!.textContent!,
			/5/,
		);
		assert.equal(f.input.disabled, false);
		await f.submit("9999");
		assert.equal(
			f.getUnlocks(),
			1,
			"matching-length guesses still use the real backend",
		);
	} finally {
		await f.close();
	}
});

test("eight-character articles use their own declared length", async () => {
	const f = await fixture(8);
	try {
		await f.submit("9999");
		assert.equal(f.getUnlocks(), 0);
		await f.submit("99999999");
		assert.equal(f.getUnlocks(), 1);
	} finally {
		await f.close();
	}
});

test("older cached markup without length metadata remains usable", async () => {
	const f = await fixture();
	try {
		await f.submit("9999");
		assert.equal(f.getUnlocks(), 1);
	} finally {
		await f.close();
	}
});
