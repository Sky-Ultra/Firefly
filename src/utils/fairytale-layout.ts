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
	const softImages = Array.from(
		backdrop.querySelectorAll<HTMLElement>("[data-fairytale-soft-image]"),
	);
	const softLayer = backdrop.querySelector<HTMLElement>(
		".fairytale-soft-layer",
	);
	const wrapper = document.getElementById("wallpaper-wrapper");
	const container = document.getElementById("banner-images-container");
	if (images.length !== 2 || !wrapper) return () => {};
	const titleSurface = wrapper;
	const scope = new AbortController();
	const { signal } = scope;
	let active = false;
	let frame = 0;
	let displayed = -1;
	let generation = 0;
	let current = "";
	let wanted = "";
	let loadTimer: number | undefined;
	let blendTimer: number | undefined;
	let paintFrame = 0;
	let lastBlur = "";
	let lastTitle = "";
	let imageDirty = true;
	let viewportWidth = window.innerWidth;
	let motionHeight = 0;
	let motionWidth = 0;
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
	function stableMotionHeight() {
		if (window.innerWidth >= 1024) return window.innerHeight;
		// Mobile browser chrome changes innerHeight during a swipe. Keep the
		// scroll timeline tied to the stable hero, recalibrating on rotation.
		if (!motionHeight || motionWidth !== window.innerWidth) {
			motionWidth = window.innerWidth;
			motionHeight = wrapper?.clientHeight || window.innerHeight;
		}
		return motionHeight;
	}
	function syncImage() {
		// Reusing the outgoing slot during a live fade would replace a visible
		// texture. Finish this blend, then reconcile only the latest source.
		if (blendTimer !== undefined) return;
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
		cancelAnimationFrame(paintFrame);
		paintFrame = 0;
		window.clearTimeout(loadTimer);
		const next = displayed === 0 ? 1 : 0;
		const image = images[next];
		if (displayed >= 0)
			[...images, ...softImages].forEach((item) => {
				item.classList.remove("is-initial");
			});
		let settled = false;
		const finish = (success: boolean) => {
			if (!active || token !== generation || settled) return;
			settled = true;
			window.clearTimeout(loadTimer);
			image.onload = image.onerror = null;
			wanted = "";
			cancelAnimationFrame(paintFrame);
			paintFrame = 0;
			if (visibleSource() !== source) {
				requestSourceSync();
				return;
			}
			if (!success) {
				// Let the normal slideshow skip an unavailable image; retain the last background.
				retryTimer = window.setTimeout(requestSourceSync, 6500);
				return;
			}
			current = source;
			const first = displayed < 0;
			const retire = () => {
				paintFrame = 0;
				if (!active || token !== generation) return;
				// A throttled tab or mobile compositor can start/advance CSS fades
				// later than the timer. Keep the old frame until BOTH incoming
				// surfaces actually reach full opacity; elapsed time is insufficient.
				if (
					!first &&
					!reduced.matches &&
					[images[next], softImages[next]].some(
						(item) =>
							item &&
							Number.parseFloat(getComputedStyle(item).opacity || "1") < 0.999,
					)
				) {
					paintFrame = requestAnimationFrame(retire);
					return;
				}
				blendTimer = undefined;
				for (const group of [images, softImages])
					group.forEach((item, index) => {
						if (index !== next) {
							item.classList.add("is-initial");
							item.classList.remove("is-visible");
							item.style.zIndex = "0";
						}
					});
				// Update the overscroll fallback only after the incoming image is
				// fully opaque, never at the beginning of a wallpaper change.
				root.style.setProperty(
					"--fairytale-canvas-image",
					`url(${JSON.stringify(image.src)})`,
				);
				requestSourceSync();
			};
			for (const group of [images, softImages])
				group.forEach((item, index) => {
					item.style.zIndex = index === next ? "2" : "1";
					if (index === next) {
						item.classList.toggle("is-initial", first || reduced.matches);
						item.classList.add("is-visible");
					}
				});
			// Keep the outgoing sharp AND blurred images opaque under the fade.
			// Fading both out/in simultaneously exposes the canvas midway through.
			displayed = next;
			root.dataset.fairytaleReady = "true";
			if (first || reduced.matches) retire();
			else blendTimer = window.setTimeout(retire, 1250);
		};
		let decoding = false;
		image.onload = () => {
			if (decoding) return;
			decoding = true;
			const soft = softImages[next] as HTMLImageElement | undefined;
			const decoded = [image, ...(soft?.tagName === "IMG" ? [soft] : [])].map(
				(item) =>
					typeof item.decode === "function" ? item.decode() : Promise.resolve(),
			);
			Promise.all(decoded)
				.then(() => {
					if (!active || token !== generation || settled) return;
					if (displayed < 0 || reduced.matches) finish(true);
					else {
						// Let the decoded, separately filtered layers reach a paint before
						// starting their opacity change (especially mobile compositors).
						paintFrame = requestAnimationFrame(() => {
							paintFrame = requestAnimationFrame(() => finish(true));
						});
					}
				})
				.catch(() => finish(false));
		};
		image.onerror = () => finish(false);
		loadTimer = window.setTimeout(() => finish(false), 15000);
		const soft = softImages[next];
		if (soft?.tagName === "IMG") (soft as HTMLImageElement).src = source;
		else
			soft?.style.setProperty(
				"background-image",
				`url(${JSON.stringify(source)})`,
			);
		image.src = source;
		if (image.complete && image.naturalWidth > 0)
			image.onload?.(new Event("load"));
	}
	function update() {
		frame = 0;
		if (!active) return;
		const motion = fairytaleMotion(window.scrollY, stableMotionHeight());
		const blur = motion.blurProgress.toFixed(3);
		const title = motion.titleOpacity.toFixed(3);
		// These values change while scrolling. Scope them to the two surfaces
		// that consume them instead of invalidating inherited styles site-wide.
		if (blur !== lastBlur) {
			if (softLayer) softLayer.style.opacity = blur;
			else backdrop.style.setProperty("--fairytale-blur-progress", blur);
			lastBlur = blur;
		}
		if (title !== lastTitle) {
			titleSurface.style.setProperty("--fairytale-title-opacity", title);
			lastTitle = title;
		}
		// Carousel mutations, assignments and viewport-width changes own source
		// discovery. Ordinary reading/scrolling never scans the slide collection.
		if (imageDirty) {
			imageDirty = false;
			syncImage();
		}
	}
	function schedule() {
		if (active && !frame) frame = requestAnimationFrame(update);
	}
	function requestSourceSync() {
		imageDirty = true;
		schedule();
	}
	function resize() {
		if (viewportWidth !== window.innerWidth) {
			viewportWidth = window.innerWidth;
			motionHeight = motionWidth = 0;
			requestSourceSync();
		} else schedule();
	}
	function stop() {
		active = false;
		generation++;
		cancelAnimationFrame(frame);
		frame = 0;
		window.clearTimeout(loadTimer);
		window.clearTimeout(blendTimer);
		blendTimer = undefined;
		cancelAnimationFrame(paintFrame);
		paintFrame = 0;
		window.clearTimeout(retryTimer);
		scrollScope?.abort();
		sourceObserver?.disconnect();
		images.forEach((image) => {
			image.onload = image.onerror = null;
			image.removeAttribute("src");
			image.classList.remove("is-visible", "is-initial");
			image.style.removeProperty("z-index");
		});
		softImages.forEach((image) => {
			image.removeAttribute("src");
			image.style.removeProperty("z-index");
			image.style.removeProperty("background-image");
			image.classList.remove("is-visible", "is-initial");
		});
		current = wanted = "";
		displayed = -1;
		lastBlur = lastTitle = "";
		imageDirty = true;
		backdrop.style.removeProperty("--fairytale-blur-progress");
		softLayer?.style.removeProperty("opacity");
		titleSurface.style.removeProperty("--fairytale-title-opacity");
		motionHeight = motionWidth = 0;
		root.style.removeProperty("--fairytale-canvas-image");
		backdrop.hidden = true;
		delete root.dataset.fairytaleReady;
		root.style.removeProperty("--fairytale-progress");
		root.style.removeProperty("--fairytale-blur-progress");
		root.style.removeProperty("--fairytale-title-opacity");
	}
	function syncMode() {
		const next = enabled();
		if (active === next) {
			requestSourceSync();
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
		window.addEventListener("resize", resize, {
			passive: true,
			signal: scrollScope.signal,
		});
		sourceObserver = new MutationObserver(requestSourceSync);
		if (container)
			sourceObserver.observe(container, {
				subtree: true,
				attributes: true,
				attributeFilter: [
					"class",
					"src",
					"srcset",
					"data-wallpaper-src",
					"data-wallpaper-load-state",
				],
			});
		update();
	}
	function routeReady() {
		syncMode();
		requestSourceSync();
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
	window.addEventListener(
		"firefly:wallpaper-assignments-ready",
		requestSourceSync,
		{
			signal,
		},
	);
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
