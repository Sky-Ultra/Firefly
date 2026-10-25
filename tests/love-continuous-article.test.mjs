import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/afterword.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

function fixture({ reduced = false, observer = true } = {}) {
	const frames = [];
	const observers = [];
	const body = { dataset: {} };
	const context = vm.createContext({
		prefersReducedMotion: () => reduced,
		requestAnimationFrame: callback => frames.push(callback),
		cancelAnimationFrame() {},
		document: {
			body,
			createDocumentFragment: () => ({ children: [], appendChild(child) { this.children.push(child); } }),
			createElement: () => ({ textContent: "", classes: new Set(), style: { setProperty(name, value) { this[name] = value; } }, get classList() { return { add: name => this.classes.add(name) }; } }),
		},
		window: { innerHeight: 800, ...(observer ? { IntersectionObserver: true } : {}) },
		IntersectionObserver: class {
			constructor(callback, options) { this.callback = callback; this.options = options; observers.push(this); }
			observe(target) { this.target = target; }
			disconnect() { this.disconnected = true; }
		},
	});
	vm.runInContext(source, context);
	function section(id = "afterword") {
		const paragraphs = ["第一段，连续出现❤", "第二段继续输出，不重置。", "第三段\n保留换行。"].map(textContent => ({
			textContent, children: [], replaceChildren(fragment) { this.children = fragment.children; },
		}));
		return { id, dataset: {}, paragraphs, querySelectorAll: () => paragraphs, getBoundingClientRect: () => ({ top: 0, bottom: 12000 }) };
	}
	return { context, frames, observers, body, section, reveal: target => context.revealAfterwordArticle(target), flush: () => { while (frames.length) frames.shift()(); } };
}

test("every paragraph shares one strictly increasing token timeline without changing the text", () => {
	const f = fixture();
	const section = f.section();
	const originals = section.paragraphs.map(paragraph => paragraph.textContent);
	f.reveal(section);
	assert.equal(f.observers.length, 1);
	assert.equal(f.observers[0].target, section);
	assert.equal(f.observers[0].options.threshold, 0, "long mobile articles must not require 8% of the full article to enter the viewport");
	const tokens = section.paragraphs.flatMap(paragraph => paragraph.children);
	for (let index = 1; index < tokens.length; index++) {
		const difference = parseFloat(tokens[index].style["--token-delay"]) - parseFloat(tokens[index - 1].style["--token-delay"]);
		assert(Math.abs(difference - 28 / 0.9) < 0.011);
	}
	assert.deepEqual(section.paragraphs.map(paragraph => paragraph.children.map(token => token.textContent).join("")), originals);
	assert.equal(f.frames.length, 0);
	f.observers[0].callback([{ isIntersecting: true }]);
	f.flush();
	assert(tokens.every(token => token.classes.has("is-visible")), "one start schedules the entire article, including offscreen paragraphs");
});

test("the output and token slide run ten percent slower", () => {
	const f = fixture();
	const section = f.section();
	f.reveal(section);
	const interval = parseFloat(section.paragraphs[0].children[1].style["--token-delay"]);
	assert(Math.abs(28 / interval - 0.9) < 0.001);
	assert.match(styles, /transition: top 0\.356s ease, opacity 0\.356s ease, filter 0\.356s ease/);
});

test("manual restart cancels stale observers and restarts the whole article from its first token", () => {
	const f = fixture();
	const section = f.section();
	f.reveal(section);
	const oldObserver = f.observers[0];
	oldObserver.callback([{ isIntersecting: true }]);
	const oldTokens = section.paragraphs.flatMap(paragraph => paragraph.children);
	f.context.revealAfterwordArticle(section, { restart: true });
	assert.equal(oldObserver.disconnected, true);
	assert.equal(section.dataset.revealStarted, undefined);
	oldObserver.callback([{ isIntersecting: true }]);
	assert.equal(section.dataset.revealStarted, undefined, "a stale entry cannot start the replacement timeline");
	f.observers[1].callback([{ isIntersecting: true }]);
	f.flush();
	const newTokens = section.paragraphs.flatMap(paragraph => paragraph.children);
	assert.notEqual(newTokens[0], oldTokens[0]);
	assert.equal(newTokens[0].style["--token-delay"], "0.00ms");
	assert(newTokens.every(token => token.classes.has("is-visible")));
	assert(oldTokens.every(token => !token.classes.has("is-visible")));
});

test("each of pages two, three and four starts its own article once upon entry", () => {
	const f = fixture();
	for (const id of ["afterword", "love-third-page", "love-fourth-page"]) {
		const section = f.section(id);
		f.reveal(section);
		const observer = f.observers.at(-1);
		observer.callback([{ isIntersecting: false }]);
		assert.equal(section.dataset.revealStarted, undefined);
		assert.equal(section.paragraphs[0].children[0].style["--token-delay"], "0.00ms");
		observer.callback([{ isIntersecting: true }]);
		assert.equal(section.dataset.revealStarted, "true");
		f.flush();
		const count = f.observers.length;
		const firstToken = section.paragraphs[0].children[0];
		f.reveal(section);
		assert.equal(f.observers.length, count);
		assert.equal(section.paragraphs[0].children[0], firstToken);
	}
});

test("jumping straight to page four does not start page two from a stale intersection", () => {
	const f = fixture();
	const section = f.section();
	f.reveal(section);
	f.body.dataset.lovePageTarget = "4";
	f.observers[0].callback([{ isIntersecting: true }]);
	assert.equal(section.dataset.revealStarted, undefined);
	delete f.body.dataset.lovePageTarget;
	f.observers[0].callback([{ isIntersecting: true }]);
	assert.equal(section.dataset.revealStarted, "true");
});

test("reduced motion leaves original readable paragraphs without animation", () => {
	const f = fixture({ reduced: true });
	const section = f.section();
	const originals = section.paragraphs.map(paragraph => paragraph.textContent);
	f.reveal(section);
	assert.deepEqual(section.paragraphs.map(paragraph => paragraph.textContent), originals);
	assert.equal(f.frames.length, 0);
	assert.equal(f.observers.length, 0);
});

test("a browser without IntersectionObserver still outputs the complete article", () => {
	const f = fixture({ observer: false });
	const section = f.section();
	f.reveal(section);
	f.flush();
	assert.equal(section.dataset.revealStarted, "true");
	assert(section.paragraphs.flatMap(paragraph => paragraph.children).every(token => token.classes.has("is-visible")));
});
