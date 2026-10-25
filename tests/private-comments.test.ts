/** biome-ignore-all lint/style/noNonNullAssertion: Required DOM fixture nodes must fail loudly if absent. */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { Window } from "happy-dom";

const source = (path: string) =>
	readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
async function feature() {
	assert.ok(
		existsSync(new URL("../src/utils/private-comments.ts", import.meta.url)),
		"An isolated local comment branch exists",
	);
	return import("../src/utils/private-comments");
}
const frameScript = () => source("src/scripts/private-comment-frame.js");

test("private frame is opaque, cannot submit forms or make network requests, and contains no submitted data", async () => {
	const { buildPrivateCommentDocument } = await feature();
	const html = buildPrivateCommentDocument(frameScript());
	assert.match(html, /connect-src 'none'/);
	assert.match(html, /default-src 'none'/);
	assert.match(html, /form-action 'none'/);
	assert.doesNotMatch(
		frameScript(),
		/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB)\b/,
	);
});

test("entering private mode transfers the unsent draft and clears Twikoo's draft without touching saved identity", async () => {
	const { registerPrivateComments } = await feature();
	const view = new Window({
		url: "https://example.test/posts/one/",
		settings: { disableIframePageLoading: true },
	});
	registerPrivateComments(
		frameScript(),
		view as unknown as globalThis.Window & typeof globalThis,
	);
	view.localStorage.setItem("twikoo-draft", "private-probe-123");
	view.localStorage.setItem(
		"twikoo",
		'{"nick":"Visitor","mail":"test@example.com"}',
	);
	view.document.body.innerHTML = `<private-comment-branch><label><input type="checkbox" data-private-toggle>私密发送</label><div data-private-mount></div><div data-public-comments><div class="tk-submit"><div class="tk-meta-input"><input value="Visitor"><input value="test@example.com"><input></div><textarea>private-probe-123</textarea><button>发送</button></div><div class="tk-comments-container">Public comments</div></div></private-comment-branch>`;
	const root = view.document.querySelector("private-comment-branch")!;
	await Promise.resolve();
	const checkbox = root.querySelector(
		"input[type=checkbox]",
	) as unknown as HTMLInputElement;
	const textarea = root.querySelector(
		"textarea",
	) as unknown as HTMLTextAreaElement;
	let sends = 0;
	root.querySelector("button")!.addEventListener("click", () => {
		sends++;
	});
	checkbox.checked = true;
	checkbox.dispatchEvent(new view.Event("change", { bubbles: true }));
	const frame = root.querySelector("iframe")!;
	assert.equal(frame.getAttribute("sandbox"), "allow-scripts");
	assert.doesNotMatch(frame.outerHTML, /private-probe-123/);
	assert.equal(textarea.value, "");
	assert.equal(textarea.defaultValue, "");
	assert.equal(view.localStorage.getItem("twikoo-draft"), null);
	assert.ok(view.localStorage.getItem("twikoo")!.includes("Visitor"));
	assert.equal(root.querySelector(".tk-submit")!.hasAttribute("hidden"), true);
	root
		.querySelector("button")!
		.dispatchEvent(
			new view.MouseEvent("click", { bubbles: true, cancelable: true }),
		);
	assert.equal(
		sends,
		0,
		"The normal sender cannot run while private mode is active",
	);
	assert.equal(
		root.querySelector(".tk-comments-container")!.textContent,
		"Public comments",
	);
	checkbox.checked = false;
	checkbox.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.equal(
		root
			.querySelector('iframe[data-private-comment-frame="editor"]')!
			.hasAttribute("hidden"),
		true,
	);
	assert.equal(root.querySelector(".tk-submit")!.hasAttribute("hidden"), false);
	root
		.querySelector("button")!
		.dispatchEvent(new view.MouseEvent("click", { bubbles: true }));
	assert.equal(sends, 1, "Ordinary sending remains unchanged when unchecked");
	await view.happyDOM.close();
});

test("navigation/pagehide destroys private content and resets the checkbox", async () => {
	const { registerPrivateComments } = await feature();
	const view = new Window({ settings: { disableIframePageLoading: true } });
	registerPrivateComments(
		frameScript(),
		view as unknown as globalThis.Window & typeof globalThis,
	);
	view.document.body.innerHTML = `<private-comment-branch><input type="checkbox" data-private-toggle><div data-private-mount></div><div data-public-comments><div class="tk-submit"><textarea></textarea></div></div></private-comment-branch>`;
	const input = view.document.querySelector("input")!;
	await Promise.resolve();
	input.checked = true;
	input.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.ok(view.document.querySelector("iframe"));
	view.dispatchEvent(new view.Event("pagehide"));
	assert.equal(view.document.querySelector("iframe"), null);
	assert.equal(input.checked, false);
	await view.happyDOM.close();
});

test("other ordinary drafts survive switching, and local counts never overwrite provider-owned text", async () => {
	const { registerPrivateComments } = await feature();
	const view = new Window({ settings: { disableIframePageLoading: true } });
	registerPrivateComments(
		frameScript(),
		view as unknown as globalThis.Window & typeof globalThis,
	);
	view.document.body.innerHTML = `<private-comment-branch><input type="checkbox" data-private-toggle><div data-private-mount></div><div data-public-comments><div class="tk-submit"><textarea>Ordinary unsent main draft</textarea></div><div class="tk-comments-container"><div class="tk-comments-title"><span class="tk-comments-count"><span>7</span><span> 条评论</span></span></div><div class="tk-comment" id="reply-target"><div class="tk-submit"><textarea>Draft selected for private sending</textarea></div></div></div></div></private-comment-branch>`;
	await Promise.resolve();
	const toggle = view.document.querySelector("input")!;
	const fields = view.document.querySelectorAll("textarea");
	fields[1].dispatchEvent(new view.FocusEvent("focusin", { bubbles: true }));
	toggle.checked = true;
	toggle.dispatchEvent(new view.Event("change", { bubbles: true }));
	const frame = view.document.querySelector(
		'iframe[data-private-comment-frame="editor"]',
	)!;
	view.dispatchEvent(
		new view.MessageEvent("message", {
			origin: "null",
			source: frame.contentWindow,
			data: { type: "private-comment:sent", count: 1 },
		}),
	);
	const number = view.document.querySelector(".tk-comments-count > span")!;
	assert.equal(
		number.textContent,
		"7",
		"The provider's DOM/state remains its real server count",
	);
	assert.equal(number.getAttribute("data-private-total"), "8");
	assert.equal(number.getAttribute("aria-label"), "8");
	const originalTextNode = number.firstChild!;
	originalTextNode.nodeValue = "8";
	await new Promise((resolve) => setTimeout(resolve, 0));
	assert.equal(
		number.firstChild,
		originalTextNode,
		"Vue's original text node is never replaced",
	);
	assert.equal(number.getAttribute("data-private-total"), "9");
	toggle.checked = false;
	toggle.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.equal(fields[0].value, "Ordinary unsent main draft");
	assert.equal(
		fields[1].value,
		"",
		"The already privately sent text is not copied into the ordinary sender",
	);
	view.dispatchEvent(new view.Event("pagehide"));
	assert.equal(number.textContent, "8");
	assert.equal(number.hasAttribute("data-private-total"), false);
	assert.equal(number.hasAttribute("aria-label"), false);
	await view.happyDOM.close();
});

test("an already-running ordinary send is never converted, cleared or cancelled by the toggle", async () => {
	const { registerPrivateComments } = await feature();
	const view = new Window({ settings: { disableIframePageLoading: true } });
	registerPrivateComments(
		frameScript(),
		view as unknown as globalThis.Window & typeof globalThis,
	);
	view.document.body.innerHTML = `<private-comment-branch><input type="checkbox" data-private-toggle><div data-private-mount></div><div data-public-comments><div class="tk-submit"><textarea>Ordinary in-flight comment</textarea><button class="tk-send is-loading">发送</button></div></div></private-comment-branch>`;
	await Promise.resolve();
	const toggle = view.document.querySelector("input")!;
	toggle.checked = true;
	toggle.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.equal(toggle.checked, false);
	assert.equal(
		view.document.querySelector("textarea")!.value,
		"Ordinary in-flight comment",
	);
	assert.equal(view.document.querySelector("iframe"), null);
	await view.happyDOM.close();
});

test("a pre-existing ordinary draft is preserved even if the provider has not loaded yet", async () => {
	const { registerPrivateComments } = await feature();
	const view = new Window({ settings: { disableIframePageLoading: true } });
	registerPrivateComments(
		frameScript(),
		view as unknown as globalThis.Window & typeof globalThis,
	);
	view.localStorage.setItem(
		"twikoo-draft",
		"Ordinary draft before provider startup",
	);
	view.document.body.innerHTML = `<private-comment-branch><input type="checkbox" data-private-toggle><div data-private-mount></div><div data-public-comments></div></private-comment-branch>`;
	await Promise.resolve();
	const toggle = view.document.querySelector("input")!;
	toggle.checked = true;
	toggle.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.equal(view.localStorage.getItem("twikoo-draft"), null);
	toggle.checked = false;
	toggle.dispatchEvent(new view.Event("change", { bubbles: true }));
	assert.equal(
		view.localStorage.getItem("twikoo-draft"),
		"Ordinary draft before provider startup",
	);
	await view.happyDOM.close();
});

test("local submit and preview keep text inert, support repeat sends and send no content to the parent", async () => {
	const { buildPrivateCommentDocument } = await feature();
	const view = new Window({ url: "https://example.test/" });
	const html = buildPrivateCommentDocument("");
	view.document.write(html.replace(/<script>[\s\S]*?<\/script>/g, ""));
	const messages: unknown[] = [];
	view.postMessage = ((data: unknown) => {
		messages.push(data);
	}) as typeof view.postMessage;
	Object.defineProperty(view, "localStorage", {
		get() {
			throw new Error("Private comments must not use storage");
		},
	});
	view.fetch = (() => {
		throw new Error("Private comments must not make requests");
	}) as typeof view.fetch;
	view.eval(frameScript());
	view.eval(
		`window.dispatchEvent(new MessageEvent("message", { source: parent, data: ${JSON.stringify({ type: "private-comment:init", draft: { nick: "Visitor", mail: "test@example.com", link: "", comment: "<img src=https://example.test/leak>secret-abc" }, config: { language: "zh-CN", maxLength: 500, placeholder: "test", requireMail: true, palette: {} } })} }));`,
	);
	const form = view.document.querySelector("form")!;
	const textarea = view.document.querySelector("textarea")!;
	assert.equal(
		view.document.getElementById("send")!.getAttribute("type"),
		"button",
		"Sandboxed local sending must not depend on native form submission",
	);
	assert.match(textarea.value, /secret-abc/);
	form.dispatchEvent(
		new view.Event("submit", { bubbles: true, cancelable: true }),
	);
	assert.equal(view.document.querySelectorAll(".private-comment").length, 1);
	assert.equal(
		view.document.querySelectorAll(".private-comment img").length,
		0,
	);
	assert.match(
		view.document.querySelector(".private-comment")!.textContent!,
		/secret-abc/,
	);
	assert.equal(textarea.value, "");
	textarea.value = "Second private comment";
	textarea.dispatchEvent(new view.Event("input", { bubbles: true }));
	form.dispatchEvent(
		new view.Event("submit", { bubbles: true, cancelable: true }),
	);
	assert.equal(view.document.querySelectorAll(".private-comment").length, 2);
	assert.doesNotMatch(
		JSON.stringify(messages),
		/secret-abc|Second private comment|test@example.com/,
	);
	await view.happyDOM.close();
});

test("only the Twikoo integration gains the unchecked private-send option and replay exclusion", async () => {
	await feature();
	const component = source("src/components/comment/Twikoo.astro");
	assert.match(component, /private-comment-branch/);
	assert.match(component, /私密发送/);
	assert.match(component, /data-private-toggle/);
	assert.match(component, /data-private-toggle[^>]*disabled/);
	assert.doesNotMatch(component, /type="checkbox"[^>]*\bchecked\b/);
	assert.match(
		source("src/components/analytics/UmamiAnalytics.astro"),
		/data-private-comment-frame/,
	);
});
