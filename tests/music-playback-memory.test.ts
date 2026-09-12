import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const manager = readFileSync(
	new URL("../src/components/features/MusicManager.astro", import.meta.url),
	"utf8",
);

test("music playback memory stores a stable track identity and progress locally", () => {
	assert.match(manager, /firefly-music-playback-v1/);
	assert.match(manager, /function getTrackKey\(track\)/);
	assert.match(manager, /track\.name/);
	assert.match(manager, /track\.artist/);
	assert.match(manager, /localStorage\.getItem\(PLAYBACK_MEMORY_KEY\)/);
	assert.match(manager, /localStorage\.setItem\(PLAYBACK_MEMORY_KEY/);
	assert.match(manager, /currentTime:\s*rememberedTime/);
});

test("music playback memory restores the matching song without autoplay", () => {
	assert.match(
		manager,
		/state\.playlist\.findIndex\(function \(track\) \{\s*return getTrackKey\(track\) === playbackMemory\.trackKey;/s,
	);
	assert.match(manager, /loadTrack\(startIndex, false, resumeTime\)/);
	assert.match(manager, /audio\.addEventListener\('loadedmetadata', restore/);
});

test("music playback progress is saved during playback and before leaving", () => {
	assert.match(
		manager,
		/audio\.addEventListener\('timeupdate',[\s\S]*persistPlaybackMemory\(false\)/,
	);
	assert.match(manager, /audio\.addEventListener\('pause',[\s\S]*persistPlaybackMemory\(true\)/);
	assert.match(manager, /audio\.addEventListener\('seeked',[\s\S]*persistPlaybackMemory\(true\)/);
	assert.match(manager, /window\.addEventListener\('pagehide',[\s\S]*persistPlaybackMemory\(true\)/);
	assert.match(manager, /document\.visibilityState === 'hidden'/);
});
