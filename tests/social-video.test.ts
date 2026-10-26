import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { Window } from "happy-dom";
import { personalPagesConfig } from "../src/config/personalPagesConfig";
import { buildActivityFeed } from "../src/utils/activity-feed";
import { bilibiliVideo, safeSocialLink } from "../src/utils/social-media-utils";
import { registerSocialVideoElement } from "../src/utils/social-video-runtime";

function fixture(
	player = "https://player.bilibili.com/player.html?bvid=BV16TH36XEQz&autoplay=1",
) {
	const view = new Window({
		url: "https://example.test/moments/",
		settings: { disableIframePageLoading: true },
	});
	const timers = new Map<number, { callback: () => void; delay: number }>();
	let next = 0;
	let manualError = false;
	const createElement = view.document.createElement.bind(view.document);
	Object.defineProperty(view.document, "createElement", {
		value: (name: string) => {
			const element = createElement(name);
			// Happy DOM reports disabled network loading as an immediate error.
			// Keep unit tests offline and dispatch the intended player events below.
			if (name === "iframe")
				element.addEventListener(
					"error",
					(event) => {
						if (!manualError) event.stopImmediatePropagation();
					},
					{ capture: true },
				);
			return element;
		},
	});
	Object.defineProperty(view, "setTimeout", {
		value: (callback: () => void, delay: number) => {
			const id = ++next;
			timers.set(id, { callback, delay });
			return id;
		},
	});
	Object.defineProperty(view, "clearTimeout", {
		value: (id: number) => timers.delete(id),
	});
	registerSocialVideoElement(
		view as unknown as Parameters<typeof registerSocialVideoElement>[0],
	);
	const root = view.document.createElement("moment-video-player");
	root.dataset.playerUrl = player;
	root.dataset.titleZh = "测试视频";
	root.innerHTML =
		'<dialog open data-video-dialog data-expanded="false"><div data-video-stage><div data-video-frame></div><button data-video-load>加载视频</button></div><button data-video-retry hidden>重新加载</button><button data-video-expand disabled aria-expanded="false"><span data-video-expand-label>放大</span><span data-video-collapse-label hidden>收起</span></button><a href="https://www.bilibili.com/video/BV16TH36XEQz/" target="_blank" rel="noopener noreferrer">去B站</a><p data-video-status hidden></p></dialog>';
	view.document.body.appendChild(root);
	const load = root.querySelector<HTMLButtonElement>("[data-video-load]");
	const expand = root.querySelector<HTMLButtonElement>("[data-video-expand]");
	const dialog = root.querySelector<HTMLDialogElement>("dialog");
	assert.ok(load && expand && dialog);
	return {
		view,
		root,
		load,
		expand,
		dialog,
		timers,
		frame: () => root.querySelector("iframe"),
		loaded: () =>
			root.querySelector("iframe")?.dispatchEvent(new view.Event("load")),
		error: () => {
			manualError = true;
			root.querySelector("iframe")?.dispatchEvent(new view.Event("error"));
			manualError = false;
		},
		timeout: () => {
			const entry = [...timers.entries()].find(
				([, value]) => value.delay === 15000,
			);
			assert.ok(entry);
			timers.delete(entry[0]);
			entry[1].callback();
		},
		close: async () => {
			root.remove();
			timers.clear();
			await view.happyDOM.close();
		},
	};
}

test("Bilibili URLs are normalized and cannot enable autoplay or escape the official player", () => {
	const result = bilibiliVideo(
		"https://www.bilibili.com/video/BV16TH36XEQz/?p=2&autoplay=1&tracking=ignored",
	);
	assert.ok(result);
	assert.equal(result.href, "https://www.bilibili.com/video/BV16TH36XEQz/?p=2");
	assert.equal(new URL(result.player).origin, "https://player.bilibili.com");
	assert.equal(new URL(result.player).searchParams.get("autoplay"), "0");
	assert.equal(bilibiliVideo("BV16TH36XEQz")?.page, 1);
	for (const value of [
		"javascript:alert(1)",
		"https://evil.test/video/BV16TH36XEQz/",
		"https://www.bilibili.com.evil.test/video/BV16TH36XEQz/",
		"https://user:secret@www.bilibili.com/video/BV16TH36XEQz/",
		"https://www.bilibili.com/video/invalid/",
	])
		assert.equal(bilibiliVideo(value), null, value);
	assert.equal(
		safeSocialLink("https://example.com/article"),
		"https://example.com/article",
	);
	assert.equal(safeSocialLink("data:text/html,unsafe"), null);
});

test("the video creates no iframe until clicked and repeat clicks create only one paused-by-default player", async () => {
	const f = fixture();
	try {
		assert.equal(f.frame(), null);
		f.load.click();
		f.load.click();
		const frame = f.frame();
		assert.ok(frame);
		assert.equal(f.root.querySelectorAll("iframe").length, 1);
		assert.equal(new URL(frame.src).searchParams.get("autoplay"), "0");
		assert.ok(
			!frame.allow
				.split(";")
				.map((part) => part.trim())
				.includes("autoplay"),
		);
		assert.equal(frame.allowFullscreen, true);
		assert.equal(frame.loading, "eager");
		assert.ok(!frame.getAttribute("sandbox")?.includes("allow-top-navigation"));
		assert.equal(f.expand.disabled, false);
		f.loaded();
		assert.equal(f.expand.disabled, false);
		assert.equal(f.load.hidden, true);
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});

test("enlarge, Escape and collapse keep the same iframe and cleanly restore the page", async () => {
	const f = fixture();
	try {
		f.load.click();
		f.loaded();
		const frame = f.frame();
		f.expand.click();
		assert.equal(f.dialog.dataset.expanded, "true");
		assert.equal(
			f.view.document.documentElement.classList.contains(
				"has-moment-video-dialog",
			),
			true,
		);
		assert.equal(f.frame(), frame);
		f.dialog.dispatchEvent(new f.view.Event("cancel", { cancelable: true }));
		assert.equal(f.dialog.dataset.expanded, "false");
		assert.equal(f.dialog.open, true);
		assert.equal(f.frame(), frame);
		assert.equal(
			f.view.document.documentElement.classList.contains(
				"has-moment-video-dialog",
			),
			false,
		);
		f.expand.click();
		f.root.remove();
		assert.equal(
			f.view.document.documentElement.classList.contains(
				"has-moment-video-dialog",
			),
			false,
		);
		assert.equal(f.frame(), null);
		f.view.document.body.appendChild(f.root);
		assert.equal(f.load.hidden, false);
		assert.equal(f.load.disabled, false);
	} finally {
		await f.close();
	}
});

test("a failed load can retry while unsafe sources never create an iframe", async () => {
	const f = fixture();
	try {
		f.load.click();
		const first = f.frame();
		f.timeout();
		assert.equal(f.frame(), first);
		assert.match(
			f.root.querySelector("[data-video-status]")?.textContent ?? "",
			/较慢|longer/,
		);
		const retry = f.root.querySelector<HTMLButtonElement>("[data-video-retry]");
		assert.ok(retry);
		retry.click();
		assert.notEqual(f.frame(), first);
		assert.ok(f.frame());
		f.loaded();
		f.expand.click();
		f.error();
		assert.equal(f.dialog.dataset.expanded, "false");
		assert.equal(f.load.disabled, false);
		assert.equal(
			f.view.document.documentElement.classList.contains(
				"has-moment-video-dialog",
			),
			false,
		);
	} finally {
		await f.close();
	}
	const unsafe = fixture("https://evil.test/player.html?bvid=BV16TH36XEQz");
	try {
		unsafe.load.click();
		assert.equal(unsafe.frame(), null);
	} finally {
		await unsafe.close();
	}
});

test("the new moment preserves all 31 earlier records, exact text and the requested current timestamp", () => {
	const items = personalPagesConfig.moments.items;
	const moment = items.find((item) => item.id === "grassroots-hardship-video");
	assert.ok(moment);
	assert.equal(moment.date, "2026-10-26T23:04:32+11:00");
	assert.equal(
		moment.content,
		"唉……看完只能感觉基层的辛酸和心酸……中国的底层没有半分活力，只剩下对基础生存的需求……\n真的好压抑...看完我都完全不想回国了，有点想继续呆在澳洲或者香港了...\n”勤劳不一定有收获，但是羞辱是肯定的“\n唉，我真的好想带上我喜欢的女孩一起来澳洲或者香港生活啊……",
	);
	const original = items.filter((item) => item !== moment);
	assert.equal(original.length, 31);
	assert.equal(
		createHash("sha256").update(JSON.stringify(original)).digest("hex"),
		"3f37ec678dfcbeafbcbbcefa6fc249a440bfebea670ecec171452083f557bf6a",
	);
	assert.equal(moment.media?.type, "bilibili");
});

test("the user emoji appears only on its assigned moment and never enters timeline media or image pools", () => {
	const items = personalPagesConfig.moments.items;
	const decorated = items.filter((item) => item.inlineEmoji);
	assert.deepEqual(
		decorated.map((item) => item.id),
		["grassroots-hardship-video"],
	);
	const emoji = decorated[0].inlineEmoji;
	assert.ok(emoji);
	assert.equal(emoji.src, "/assets/emojis/moments/grassroots-sigh.jpg");
	const path = new URL(`../public${emoji.src}`, import.meta.url);
	assert.ok(existsSync(path));
	assert.equal(
		createHash("sha256").update(readFileSync(path)).digest("hex"),
		"9ba6bd74dc6bc818eddf617b4292d7608099f5fcb9346e1c609dc273a6941fd0",
	);
	const activity = buildActivityFeed([], items, {
		post: (id) => `/posts/${id}/`,
		moment: (id) => `/moments/#${id}`,
	}).find((item) => item.id === "moment:grassroots-hardship-video");
	assert.ok(activity);
	assert.ok(!("inlineEmoji" in activity));
	assert.ok(!("media" in activity));
});
