import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const source = (file: string) =>
	readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("video moment comments are deferred, preserve the frame while folded and reject forged size messages", async () => {
	const view = new Window({
		url: "https://example.test/moments/",
		settings: { disableIframePageLoading: true },
	});
	const timers = new Map<number, () => void>();
	let timerId = 0;
	view.setTimeout = ((callback: () => void) => {
		timers.set(++timerId, callback);
		return timerId;
	}) as typeof view.setTimeout;
	view.clearTimeout = ((id: number) => {
		timers.delete(id);
	}) as typeof view.clearTimeout;
	const runtime = transpileModule(
		source("src/utils/moment-comments.ts").replace(/^export /gm, ""),
		{
			compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
		},
	).outputText;
	runInNewContext(`${runtime}\nregisterMomentComments();`, {
		window: view,
		document: view.document,
		location: view.location,
		customElements: view.customElements,
		HTMLElement: view.HTMLElement,
		AbortController: view.AbortController,
		MutationObserver: view.MutationObserver,
		queueMicrotask,
		getComputedStyle: view.getComputedStyle.bind(view),
	});
	view.document.body.innerHTML =
		'<moment-comments data-frame-url="/moment-comments/one/"><details><summary>Comments</summary><p data-comment-loading></p><div data-comment-frame-mount></div></details></moment-comments>';
	await Promise.resolve();
	try {
		assert.equal(view.document.querySelectorAll("iframe").length, 0);
		const details = view.document.querySelector("details");
		assert.ok(details);
		details.open = true;
		details.dispatchEvent(new view.Event("toggle"));
		const frame = view.document.querySelector("iframe");
		assert.ok(frame);
		assert.equal(frame.getAttribute("src"), "/moment-comments/one/");
		details.open = false;
		details.dispatchEvent(new view.Event("toggle"));
		details.open = true;
		details.dispatchEvent(new view.Event("toggle"));
		assert.equal(view.document.querySelectorAll("iframe").length, 1);
		assert.equal(view.document.querySelector("iframe"), frame);
		view.dispatchEvent(
			new view.MessageEvent("message", {
				origin: "https://evil.test",
				source: frame.contentWindow,
				data: { type: "firefly:moment-comments-size", height: 9876 },
			}),
		);
		assert.notEqual(frame.style.height, "9876px");
		view.dispatchEvent(
			new view.MessageEvent("message", {
				origin: view.location.origin,
				source: frame.contentWindow,
				data: {
					type: "firefly:moment-comments-size",
					height: 560,
					ready: true,
				},
			}),
		);
		assert.equal(frame.style.height, "560px");
		view.dispatchEvent(
			new view.MessageEvent("message", {
				origin: view.location.origin,
				source: frame.contentWindow,
				data: { type: "firefly:moment-comments-size", height: Number.NaN },
			}),
		);
		assert.equal(frame.style.height, "560px");
		view.document.body.innerHTML =
			'<moment-comments data-frame-url="/moment-comments/early/"><details open><summary>Comments</summary><p data-comment-loading></p><div data-comment-fallback hidden><button data-comment-retry>Retry</button></div><div data-comment-frame-mount></div></details></moment-comments>';
		await Promise.resolve();
		assert.equal(
			view.document.querySelector("iframe")?.getAttribute("src"),
			"/moment-comments/early/",
			"opening before hydration must still initialize comments",
		);
		const initialFrame = view.document.querySelector("iframe");
		for (const [id, callback] of [...timers]) {
			timers.delete(id);
			callback();
		}
		assert.equal(
			view.document.querySelector<HTMLElement>("[data-comment-fallback]")
				?.hidden,
			false,
		);
		view.document
			.querySelector<HTMLButtonElement>("[data-comment-retry]")
			?.click();
		assert.equal(view.document.querySelectorAll("iframe").length, 1);
		assert.notEqual(view.document.querySelector("iframe"), initialFrame);
		view.document.body.replaceChildren();
		assert.equal(timers.size, 0, "navigation clears pending retries");
	} finally {
		await view.happyDOM.close();
	}
});

test("only video moments receive independent comment threads and overlay is a valid carousel mode", () => {
	assert.match(
		source("src/components/pages/personal/SocialFeedCard.astro"),
		/variant === "moment" && item\.media\?\.type === "bilibili" && <MomentComments/,
	);
	const page = source("src/pages/moment-comments/[id].astro");
	assert.match(page, /`\/moments\/\$\{Astro.params.id\}`/);
	assert.match(page, /fixedPath/);
	assert.match(page, /`\/moments\/#\$\{Astro.params.id\}`/);
	assert.match(page, /href=\{href\}/);
	assert.match(page, /noindex,nofollow/);
	const layout = source("src/layouts/MainGridLayout.astro");
	assert.match(
		layout,
		/return mode === WALLPAPER_BANNER \|\| mode === 'fullscreen' \|\| \(mode === 'overlay' && document\.body\.classList\.contains\('is-home'\)\)/,
	);
	assert.match(
		layout,
		/e.detail.mode === 'fullscreen' \|\| \(e.detail.mode === 'overlay' && document\.body\.classList\.contains\('is-home'\)\)/,
	);
});
