import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const managerSource = readFileSync(
	new URL("../src/components/features/MusicManager.astro", import.meta.url),
	"utf8",
);
const managerScript = managerSource.match(
	/<script is:inline[^>]*>([\s\S]*?)<\/script>/,
)?.[1];
assert.ok(managerScript);

function createPlayer() {
	const listeners = new Map<string, Array<() => void>>();
	const events: Array<{ type: string; detail: Record<string, unknown> }> = [];
	const timers = new Map<number, () => void>();
	let nextTimerId = 0;
	const audio = {
		src: "",
		currentTime: 0,
		duration: Number.NaN,
		paused: true,
		readyState: 0,
		volume: 0.7,
		style: { display: "" },
		loadCount: 0,
		addEventListener(name: string, listener: () => void) {
			listeners.set(name, [...(listeners.get(name) ?? []), listener]);
		},
		load() {
			this.loadCount++;
		},
		play() {
			return Promise.resolve();
		},
		pause() {
			this.paused = true;
		},
		emit(name: string) {
			for (const listener of listeners.get(name) ?? []) listener();
		},
	};
	const config = {
		mode: "meting",
		volume: 0.7,
		playMode: "list",
		meting: {
			api: "https://primary.test/?server=:server&type=:type&id=:id&r=:r",
			fallbackApis: [
				"https://backup.test/?server=:server&type=:type&id=:id&r=:r",
			],
			server: "netease",
			type: "playlist",
			id: "list",
			requestTimeoutMs: 8000,
			playlistOrder: {
				songApi: "https://primary.test/?server=:server&type=:type&id=:id&r=:r",
				baseHeadCount: 0,
				pinnedSongs: [
					{
						name: "Unavailable",
						artist: "Artist",
						server: "tencent",
						id: "bad",
					},
				],
				insertedSongs: [],
			},
		},
		i18n: { error: "Player Error", noSongs: "No songs" },
	};
	const context = {
		managerConfigStr: JSON.stringify(config),
		window: {
			__fireflyMusic: null as null | Record<
				string,
				(...args: unknown[]) => unknown
			>,
			dispatchEvent(event: { type: string; detail: Record<string, unknown> }) {
				events.push(event);
			},
			addEventListener() {},
		},
		document: {
			createElement() {
				return audio;
			},
			body: { appendChild() {} },
			addEventListener() {},
		},
		localStorage: {
			getItem() {
				return null;
			},
			setItem() {},
		},
		CustomEvent: class {
			type: string;
			detail: Record<string, unknown>;
			constructor(type: string, options: { detail: Record<string, unknown> }) {
				this.type = type;
				this.detail = options.detail;
			}
		},
		fetch: async (url: string) => {
			if (url.includes("type=playlist")) {
				return {
					ok: true,
					json: async () => [
						{
							name: "Available",
							artist: "Artist",
							url: "https://primary.test/?server=netease&type=url&id=good",
							lrc: "",
						},
					],
				};
			}
			return { ok: true, text: async () => "" };
		},
		AbortController,
		URL,
		setTimeout(callback: () => void) {
			const id = ++nextTimerId;
			timers.set(id, callback);
			return id;
		},
		clearTimeout(id: number) {
			timers.delete(id);
		},
		console,
	};
	runInNewContext(managerScript, context);
	const manager = context.window.__fireflyMusic;
	assert.ok(manager);
	return {
		audio,
		manager,
		events,
		fireTimeout() {
			const first = timers.entries().next().value;
			assert.ok(first);
			timers.delete(first[0]);
			first[1]();
		},
	};
}

test("an audio error retries the same song through another API, then skips it", async () => {
	const { audio, manager } = createPlayer();
	await manager.init();
	assert.match(audio.src, /primary\.test.*id=bad/);

	audio.emit("error");
	assert.match(audio.src, /backup\.test.*id=bad/);

	audio.emit("error");
	assert.equal(manager.getState().track.name, "Available");
	assert.match(audio.src, /id=good/);
});

test("exhausting the playlist stops retrying and keeps the song title", async () => {
	const { audio, manager, events } = createPlayer();
	await manager.init();
	for (let i = 0; i < 4; i++) audio.emit("error");

	assert.equal(audio.loadCount, 4);
	assert.equal(manager.getState().track.name, "Available");
	assert.equal(events.at(-1)?.type, "fm:error");
});

test("a rejected play promise also tries the backup source", async () => {
	const { audio, manager } = createPlayer();
	await manager.init();
	audio.play = () =>
		Promise.reject(
			Object.assign(new Error("No supported source"), {
				name: "NotSupportedError",
			}),
		);
	manager.togglePlay();
	await Promise.resolve();
	await Promise.resolve();
	assert.match(audio.src, /backup\.test.*id=bad/);
});

test("a source that never loads times out and tries the backup", async () => {
	const { audio, manager, fireTimeout } = createPlayer();
	await manager.init();
	audio.play = () => new Promise<void>(() => {});
	manager.togglePlay();
	fireTimeout();
	assert.match(audio.src, /backup\.test.*id=bad/);
});
