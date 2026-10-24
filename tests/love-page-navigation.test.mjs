import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/page-navigation.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/page-navigation.css", import.meta.url), "utf8");

function fixture() {
	const state = { scroll: 0, callbacks: [], navigate: [], index: null, classes: new Set(), handlers: {}, body: { dataset: {} } };
	const makeButton = number => ({ dataset: { page: String(number) }, attrs: {}, addEventListener(type, callback) { this[type] = callback; }, setAttribute(name, value) { this.attrs[name] = value; }, removeAttribute(name) { delete this.attrs[name]; }, focus() {} });
	const buttons = [1, 2, 3, 4].map(makeButton);
	const toggle = makeButton(0);
	const pages = ["love-first-page", "afterword", "love-third-page", "love-fourth-page"].map((id, index) => ({ id, hidden: index > 0, getBoundingClientRect: () => ({ top: index * 1000 - state.scroll }) }));
	const nav = {
		hidden: true, style: { setProperty(name, value) { state.index = value; } },
		classList: { toggle(name, value) { if (value) state.classes.add(name); else state.classes.delete(name); } },
		querySelectorAll: () => buttons,
		contains: target => target === toggle || buttons.includes(target),
		addEventListener(type, callback) { state.handlers[`nav:${type}`] = callback; },
	};
	const context = vm.createContext({
		document: { body: state.body, activeElement: null, getElementById: id => ({ "love-page-navigation": nav, "love-page-nav-toggle": toggle })[id] ?? pages.find(page => page.id === id), addEventListener(type, callback) { state.handlers[type] = callback; } },
		window: { matchMedia: () => ({ matches: true }), addEventListener(type, callback) { state.handlers[type] = callback; } },
		requestAnimationFrame(callback) { state.callbacks.push(callback); return state.callbacks.length; },
		ResizeObserver: class { constructor() {} observe() {} },
	});
	vm.runInContext(source, context);
	context.initPageNavigation({ navigate(number) { state.navigate.push(number); pages.forEach(page => { page.hidden = false; }); state.scroll = (number - 1) * 1000; } });
	return { state, buttons, toggle, pages, nav };
}

test("four-page navigation is available from the welcome page without adding any password gate", () => {
	assert.match(html, /id="love-page-navigation"/);
	for (let page = 1; page <= 4; page++) assert.match(html, new RegExp(`data-page="${page}"`));
	assert.match(html, /datetime="2026-10-23">2026\.10\.23<\/time>/);
	assert.doesNotMatch(html, /password-gate|protected-site|访问密码/);
	const f = fixture();
	assert.equal(f.nav.hidden, false);
	f.buttons[3].click({ preventDefault() {} });
	assert.deepEqual(f.state.navigate, [4]);
	assert.equal(f.state.body.dataset.lovePageTarget, "4");
	while (f.state.callbacks.length) f.state.callbacks.shift()();
	assert.equal(f.buttons[3].attrs["aria-current"], "page");
	assert.equal(f.state.body.dataset.lovePageTarget, undefined);
});

test("hover and mobile toggle expand the rail, selection and Escape close it", () => {
	const f = fixture();
	f.state.handlers["nav:pointerenter"]();
	assert(f.state.classes.has("is-expanded"));
	f.state.handlers["nav:pointerleave"]();
	assert(!f.state.classes.has("is-expanded"));
	f.toggle.click();
	assert.equal(f.toggle.attrs["aria-expanded"], "true");
	f.state.handlers["nav:keydown"]({ key: "Escape" });
	assert.equal(f.toggle.attrs["aria-expanded"], "false");
});

test("the active tick tracks scrolling and the rail has restrained expansion and mobile tap styling", () => {
	const f = fixture();
	f.pages.forEach(page => { page.hidden = false; });
	f.state.scroll = 2000;
	f.state.handlers.scroll();
	while (f.state.callbacks.length) f.state.callbacks.shift()();
	assert.equal(f.state.index, "2");
	assert.equal(f.buttons[2].attrs["aria-current"], "page");
	assert.match(styles, /transition:[^;]*width/);
	assert.match(styles, /\.page-nav-current[\s\S]*transition: transform/);
	assert.match(styles, /max-width: 700px/);
	assert.match(styles, /prefers-reduced-motion/);
});

test("the fourth page preserves all seventeen supplied paragraphs and seven paragraph groups", () => {
	const fourth = html.match(/<section id="love-fourth-page"[\s\S]*?<\/section>/)?.[0];
	assert(fourth);
	const paragraphs = [...fourth.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[1].replaceAll("&quot;", '"').replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&"));
	assert.equal(paragraphs.length, 17);
	assert.equal([...fourth.matchAll(/class="afterword-stanza/g)].length, 7);
	assert.equal(createHash("sha256").update(JSON.stringify(paragraphs)).digest("hex"), "97924ada6158e5073cfe12805bef29c34c237986cb1d86df90c85e44529ff956");
	assert.match(fourth, /class="afterword-content"/);
});
