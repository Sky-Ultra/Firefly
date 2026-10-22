import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string): string => {
	const file = new URL(`../src/${path}`, import.meta.url);
	assert.ok(existsSync(file), `${path} exists`);
	return readFileSync(file, "utf8");
};

test("the windsock puts About first and only exposes enabled existing destinations", async () => {
	source("utils/footer-destinations.ts");
	const { getFooterDestinations } = await import(
		"../src/utils/footer-destinations"
	);
	const destinations = getFooterDestinations({
		games: true,
		gallery: true,
		guestbook: true,
	});
	assert.equal(destinations[0].path, "/about/");
	assert.equal(destinations[0].label, "关于我");
	assert.equal(
		new Set(destinations.map((item) => item.path)).size,
		destinations.length,
	);
	assert.ok(destinations.every((item) => item.path.startsWith("/")));
	assert.ok(destinations.every((item) => item.labelEn && item.icon));
	assert.deepEqual(
		getFooterDestinations({
			games: false,
			gallery: false,
			guestbook: false,
		}).map((item) => item.path),
		["/about/", "/archive/", "/moments/", "/tools/", "/places/"],
	);
	assert.ok(
		!destinations.some((item) => /rss|subscribe|friends/.test(item.path)),
	);
});

test("the new footer section sits directly below the existing character row without replacing it", () => {
	const footer = source("components/layout/Footer.astro");
	assert.ok(
		footer.indexOf("<FooterWindsock />") >
			footer.indexOf('class="site-footer-characters"'),
	);
	assert.ok(
		footer.indexOf("<FooterWindsock />") < footer.indexOf("<FooterBadges />"),
	);
	const windsock = source("components/layout/FooterWindsock.astro");
	assert.match(windsock, /风向标/);
	assert.match(windsock, /喜欢本站/);
	assert.match(windsock, /SidebarDecoration/);
	assert.match(windsock, /data-site-like/);
	assert.doesNotMatch(windsock, /订阅|subscribe|like-count|fetch\(/);
	assert.doesNotMatch(windsock, /elastic-links\.css|post-card-motion\.css/);
});

test("the dismissible thanks toast is outside transformed footer ancestors and has accessible feedback", () => {
	const layout = source("layouts/Layout.astro");
	assert.match(layout, /<SiteLikeToast\s*\/>/);
	assert.ok(layout.indexOf("<SiteLikeToast />") < layout.indexOf("<slot />"));
	const toast = source("components/features/SiteLikeToast.astro");
	assert.match(toast, /role="status"/);
	assert.match(toast, /aria-live="polite"/);
	assert.match(toast, /data-like-toast-close/);
	assert.match(toast, /disconnectedCallback/);
	assert.match(toast, /removeEventListener/);
	assert.match(toast, /clearTimeout/);
	assert.match(toast, /zh="谢谢！我也喜欢你❤！"/);
	assert.doesNotMatch(toast, /fetch\(|XMLHttpRequest|localStorage|\.proxy\(/);
	const css = source("styles/footer-windsock.css");
	assert.match(css, /position:\s*fixed/);
	assert.match(css, /env\(safe-area-inset-bottom/);
	assert.match(css, /prefers-reduced-motion: reduce/);
});

test("the thank-you card shares the existing welcome toast's visual treatment", () => {
	const welcome = source("components/features/WelcomeToast.astro");
	const thanks = source("styles/footer-windsock.css");
	for (const [className, properties] of [
		[
			"welcome-toast-card",
			[
				"gap",
				"padding",
				"border",
				"border-radius",
				"background",
				"box-shadow",
				"color",
				"backdrop-filter",
			],
		],
		[
			"welcome-toast-message",
			["font-size", "font-weight", "line-height", "color"],
		],
		[
			"welcome-toast-close",
			["width", "height", "border-radius", "background", "color", "font-size"],
		],
	] as const) {
		const originalRule = welcome.match(
			new RegExp(`\\.${className}\\s*\\{([^}]+)`),
		)?.[1];
		const thankYouRule = thanks.match(
			new RegExp(`site-like-toast \\.${className}\\s*\\{([^}]+)`),
		)?.[1];
		assert.ok(originalRule && thankYouRule, className);
		for (const property of properties) {
			const declaration = new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`);
			assert.equal(
				thankYouRule.match(declaration)?.[1].trim(),
				originalRule.match(declaration)?.[1].trim(),
				`${className}: ${property}`,
			);
		}
	}
});

test("the like action stays visibly button-like and the two visitor notices do not overlap", () => {
	const css = source("styles/footer-windsock.css");
	assert.match(
		css,
		/\.site-windsock-like\s*\{[^}]*background:\s*var\(--btn-regular-bg\)/s,
	);
	assert.match(
		css,
		/body:has\(site-like-toast\[data-state="visible"\]\) welcome-visitor-toast\[data-state="visible"\]\s*\{[^}]*visibility:\s*hidden/s,
	);
});

test("footer and thanks icons are self-contained after Swup navigation and mobile sidebar removal", () => {
	for (const path of [
		"components/layout/FooterWindsock.astro",
		"components/features/SiteLikeToast.astro",
	]) {
		const icons = Array.from(source(path).matchAll(/<Icon\b[^>]*>/g));
		assert.ok(icons.length > 0);
		for (const [icon] of icons) assert.match(icon, /is:inline/);
	}
});

test("keyboard focus pauses dismissal and closing restores the original like button without scrolling", () => {
	const toast = source("components/features/SiteLikeToast.astro");
	assert.match(toast, /addEventListener\("focusin"/);
	assert.match(toast, /addEventListener\("focusout"/);
	assert.match(toast, /removeEventListener\("focusin"/);
	assert.match(toast, /removeEventListener\("focusout"/);
	assert.match(toast, /contains\(document\.activeElement\)/);
	assert.match(toast, /focus\(\{\s*preventScroll:\s*true\s*\}\)/);
});
