import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import {
	clampMusicDock,
	type MusicManager,
	type MusicSnapshot,
	readFloatingMusicDismissed,
	subscribeFloatingMusic,
} from "../src/utils/floating-music";

test("floating player subscribes to the existing manager without starting a second playback engine", async () => {
	const view = new Window();
	let calls = 0;
	let current = { currentIndex: 0, isPlaying: false } as MusicSnapshot;
	const manager = {
		getState: () => {
			calls++;
			return current;
		},
	} as MusicManager;
	let displayed: MusicSnapshot | undefined;
	const unsubscribe = subscribeFloatingMusic(
		manager,
		view as unknown as Window,
		(state) => {
			displayed = state;
		},
	);
	try {
		assert.equal(displayed, current);
		assert.equal(calls, 1);
		current = { currentIndex: 1, isPlaying: true } as MusicSnapshot;
		view.dispatchEvent(new view.CustomEvent("fm:track"));
		assert.equal(displayed, current);
		unsubscribe();
		const before = calls;
		view.dispatchEvent(new view.CustomEvent("fm:time"));
		assert.equal(calls, before);
		assert.equal(view.document.querySelectorAll("audio").length, 0);
	} finally {
		unsubscribe();
		await view.happyDOM.close();
	}
});
test("dismissal is optional and dock bounds keep expanded panels inside a narrow screen", () => {
	assert.equal(readFloatingMusicDismissed({ getItem: () => "true" }), true);
	assert.equal(
		readFloatingMusicDismissed({
			getItem: () => {
				throw Error("blocked");
			},
		}),
		false,
	);
	assert.deepEqual(
		clampMusicDock(
			{ x: 5000, y: -10 },
			{ width: 320, height: 720 },
			{ width: 296, above: 340, below: 64 },
		),
		{ x: 12, y: 352 },
	);
	assert.deepEqual(
		clampMusicDock(
			{ x: 24, y: 1000 },
			{ width: 390, height: 844 },
			{ width: 297.5, above: 90, below: 56 },
		),
		{ x: 24, y: 776 },
	);
});

test("paused metadata enables shared duration without starting audio", async () => {
	const view = new Window({ url: "https://example.test/" });
	const source = readFileSync(
		new URL("../src/components/features/MusicManager.astro", import.meta.url),
		"utf8",
	);
	const script = source.match(
		/<script is:inline[^>]*>([\s\S]*?)<\/script>/,
	)?.[1];
	assert.ok(script);
	let time: { duration: number; durationStr: string } | undefined;
	view.addEventListener("fm:time", (event) => {
		time = (event as InstanceType<typeof view.CustomEvent>).detail;
	});
	try {
		runInNewContext(script, {
			window: view,
			document: view.document,
			localStorage: view.localStorage,
			managerConfigStr: JSON.stringify({
				mode: "local",
				localPlaylist: [],
				i18n: {},
			}),
			console,
			CustomEvent: view.CustomEvent,
		});
		const audio = view.document.querySelector("audio");
		assert.ok(audio);
		Object.defineProperty(audio, "duration", { value: 230 });
		audio.dispatchEvent(new view.Event("loadedmetadata"));
		assert.equal(time?.duration, 230);
		assert.equal(time?.durationStr, "3:50");
		assert.equal(audio.paused, true);
		assert.equal(view.document.querySelectorAll("audio").length, 1);
	} finally {
		await view.happyDOM.close();
	}
});
