import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { Window } from "happy-dom";

const source = readFileSync(new URL("../public/love/js/animation.js", import.meta.url), "utf8");

function fixture() {
	const window = new Window();
	const document = window.document;
	const motion = { matches: false };
	const waits = [];
	const context = vm.createContext({ window: { matchMedia: () => motion }, document, setTimeout(resolve) { waits.push(resolve); } });
	vm.runInContext(source, context);
	const letter = document.createElement("article");
	for (const text of ["你好❤", "再见。"] ) {
		const paragraph = document.createElement("p");
		paragraph.textContent = text;
		letter.appendChild(paragraph);
	}
	async function drain() {
		for (let count = 0; waits.length && count < 100; count++) {
			waits.shift()();
			await new Promise(resolve => setImmediate(resolve));
		}
	}
	return { context, letter, motion, drain };
}

test("restarting the first-page letter while it types keeps every original character and only one cursor", async () => {
	const f = fixture();
	const initial = f.context.typewriter(f.letter, 1);
	const replay = f.context.typewriter(f.letter, 1);
	assert.equal(f.letter.querySelectorAll(".typewriter-cursor").length, 1);
	await f.drain();
	await Promise.all([initial, replay]);
	assert.deepEqual([...f.letter.querySelectorAll("p")].map(p => p.textContent), ["你好❤", "再见。"]);
});

test("replaying with reduced motion restores the whole letter immediately", async () => {
	const f = fixture();
	const initial = f.context.typewriter(f.letter, 1);
	f.motion.matches = true;
	await f.context.typewriter(f.letter, 1);
	assert.deepEqual([...f.letter.querySelectorAll("p")].map(p => p.textContent), ["你好❤", "再见。"]);
	await f.drain();
	await initial;
});
