/** Hero scroll ratios adapted from fqzlr/shirone-fq (MIT; LICENSES/Shirone-fq.txt). */
export function fairytaleMotion(
	scrollY: number,
	height: number,
): { blurProgress: number; titleOpacity: number } {
	const y = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
	const viewport = Number.isFinite(height) ? Math.max(1, height) : 1;
	return {
		blurProgress: Math.min(1, y / (viewport * 0.8)),
		titleOpacity: 1 - Math.min(1, y / (viewport * 0.5)),
	};
}

/** Independent background presentation. Never changes classic sources, layout preferences or palette. */
export function mountFairytaleLayout(backdrop: HTMLElement): () => void {
	const root = document.documentElement;
	const images = Array.from(
		backdrop.querySelectorAll<HTMLImageElement>("[data-fairytale-image]"),
	);
	const wrapper = document.getElementById("wallpaper-wrapper");
	const container = document.getElementById("banner-images-container");
	if (images.length !== 2 || !wrapper) return () => {};
	const scope = new AbortController();
	const { signal } = scope;
	let active = false;
	let frame = 0;
	let displayed = -1;
	let generation = 0;
	let current = "";
	let wanted = "";
	let loadTimer: number | undefined;
	let lastProgress = "";
	let sourceObserver: MutationObserver | undefined;
	let scrollScope: AbortController | undefined;
	let retryTimer: number | undefined;
	let unbindNavigation: (() => void) | undefined;
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	function enabled() {
		return (
			root.dataset.wallpaperMode === "fullscreen" &&
			root.dataset.fullscreenLayout === "fairytale"
		);
	}
	function visibleSource(): string {
		const desktop = window.innerWidth >= 1024;
		const slides = Array.from(
			container?.querySelectorAll<HTMLElement>(".slide-item.active") || [],
		);
		const slide = slides.find((item) =>
			desktop
				? !item.classList.contains("lg:hidden")
				: item.classList.contains("lg:hidden"),
		);
		const image =
			slide?.querySelector("img") ||
			wrapper?.querySelector<HTMLImageElement>("img");
		return (
			slide?.dataset.wallpaperSrc ||
			image?.currentSrc ||
			image?.getAttribute("src") ||
			""
		);
	}
	function syncImage() {
		const source = visibleSource();
		if (
			!source ||
			source.startsWith("data:") ||
			source === current ||
			source === wanted
		)
			return;
		wanted = source;
		const token = ++generation;
		window.clearTimeout(loadTimer);
		const next = displayed === 0 ? 1 : 0;
		const image = images[next];
		let settled = false;
		const finish = (success: boolean) => {
			if (!active || token !== generation || settled) return;
			settled = true;
			window.clearTimeout(loadTimer);
			image.onload = image.onerror = null;
			wanted = "";
			if (visibleSource() !== source) {
				schedule();
				return;
			}
			if (!success) {
				// Let the normal slideshow skip an unavailable image; retain the last background.
				retryTimer = window.setTimeout(schedule, 6500);
				return;
			}
			current = source;
			images.forEach((item, index) => {
				item.classList.toggle("is-visible", index === next);
			});
			displayed = next;
			root.dataset.fairytaleReady = "true";
		};
		image.onload = () => {
			if (typeof image.decode === "function")
				image
					.decode()
					.catch(() => {})
					.then(() => finish(true));
			else finish(true);
		};
		image.onerror = () => finish(false);
		loadTimer = window.setTimeout(() => finish(false), 15000);
		image.src = source;
		if (image.complete && image.naturalWidth > 0)
			image.onload?.(new Event("load"));
	}
	function update() {
		frame = 0;
		if (!active) return;
		const motion = fairytaleMotion(window.scrollY, window.innerHeight);
		const next = `${motion.blurProgress.toFixed(3)}:${motion.titleOpacity.toFixed(3)}`;
		if (next !== lastProgress) {
			root.style.setProperty(
				"--fairytale-blur-progress",
				motion.blurProgress.toFixed(3),
			);
			root.style.setProperty(
				"--fairytale-title-opacity",
				motion.titleOpacity.toFixed(3),
			);
			lastProgress = next;
		}
		syncImage();
	}
	function schedule() {
		if (active && !frame) frame = requestAnimationFrame(update);
	}
	function stop() {
		active = false;
		generation++;
		cancelAnimationFrame(frame);
		frame = 0;
		window.clearTimeout(loadTimer);
		window.clearTimeout(retryTimer);
		scrollScope?.abort();
		sourceObserver?.disconnect();
		images.forEach((image) => {
			image.onload = image.onerror = null;
			image.removeAttribute("src");
			image.classList.remove("is-visible");
		});
		current = wanted = "";
		displayed = -1;
		lastProgress = "";
		backdrop.hidden = true;
		delete root.dataset.fairytaleReady;
		root.style.removeProperty("--fairytale-progress");
		root.style.removeProperty("--fairytale-blur-progress");
		root.style.removeProperty("--fairytale-title-opacity");
	}
	function syncMode() {
		const next = enabled();
		if (active === next) {
			schedule();
			return;
		}
		if (!next) {
			stop();
			return;
		}
		active = true;
		backdrop.hidden = false;
		scrollScope = new AbortController();
		window.addEventListener("scroll", schedule, {
			passive: true,
			signal: scrollScope.signal,
		});
		window.addEventListener("resize", schedule, {
			passive: true,
			signal: scrollScope.signal,
		});
		sourceObserver = new MutationObserver(schedule);
		if (container)
			sourceObserver.observe(container, {
				subtree: true,
				attributes: true,
				attributeFilter: [
					"class",
					"data-wallpaper-src",
					"data-wallpaper-load-state",
				],
			});
		update();
	}
	function routeReady() {
		syncMode();
		schedule();
	}

	function bindNavigation() {
		const swup = window.swup;
		if (!swup?.hooks || unbindNavigation) return;
		swup.hooks.on("page:view", routeReady);
		unbindNavigation = () => swup.hooks.off("page:view", routeReady);
	}
	const modeObserver = new MutationObserver(syncMode);
	modeObserver.observe(root, {
		attributes: true,
		attributeFilter: ["data-wallpaper-mode", "data-fullscreen-layout"],
	});
	window.addEventListener("firefly:fullscreen-layout-change", syncMode, {
		signal,
	});
	window.addEventListener("firefly:fairytale-settings-change", schedule, {
		signal,
	});
	window.addEventListener("firefly:wallpaper-assignments-ready", schedule, {
		signal,
	});
	document.addEventListener("swup:pageView", routeReady, { signal });
	document.addEventListener("swup:enable", bindNavigation, { signal });
	document.addEventListener("astro:page-load", routeReady, { signal });
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", routeReady, {
			signal,
			once: true,
		});
	else queueMicrotask(routeReady);
	reduced.addEventListener("change", schedule, { signal });
	syncMode();
	bindNavigation();
	return () => {
		stop();
		unbindNavigation?.();
		modeObserver.disconnect();
		scope.abort();
	};
}
