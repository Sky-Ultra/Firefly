/** Independent desktop-only motion; does not own carousel images or playback. */
export const FAIRYTALE_PARALLAX_KEY = "firefly:fairytale-parallax";
export function readFairytaleParallax(
	storage?: Pick<Storage, "getItem">,
): boolean {
	try {
		return (
			(storage ?? window.localStorage).getItem(FAIRYTALE_PARALLAX_KEY) !==
			"false"
		);
	} catch {
		return true;
	}
}
export function setFairytaleParallax(enabled: boolean): void {
	try {
		localStorage.setItem(FAIRYTALE_PARALLAX_KEY, String(enabled));
	} catch {
		/* Optional preference storage. */
	}
	window.dispatchEvent(
		new CustomEvent("firefly:fairytale-parallax-change", {
			detail: { enabled },
		}),
	);
}
export function parallaxOffset(
	x: number,
	y: number,
	width: number,
	height: number,
): { x: number; y: number } {
	const normalized = (value: number, size: number) =>
		Math.max(-1, Math.min(1, (value / Math.max(1, size)) * 2 - 1));
	return { x: -normalized(x, width) * 14, y: -normalized(y, height) * 10 };
}
export function mountFairytaleParallax(layer: HTMLElement): () => void {
	const root = document.documentElement;
	const heroElement = document.getElementById("wallpaper-wrapper");
	if (!heroElement) return () => {};
	const hero = heroElement;
	const scope = new AbortController();
	const { signal } = scope;
	const fine = window.matchMedia(
		"(min-width: 1024px) and (hover: hover) and (pointer: fine)",
	);
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
	let enabled = readFairytaleParallax();
	let active = false;
	let permitted = false;
	let immersed = false;
	let frame = 0;
	let x = 0;
	let y = 0;
	let targetX = 0;
	let targetY = 0;
	let previousTime = 0;
	let pointerScope: AbortController | undefined;
	function draw() {
		layer.style.setProperty("--fairytale-parallax-x", `${x.toFixed(2)}px`);
		layer.style.setProperty("--fairytale-parallax-y", `${y.toFixed(2)}px`);
	}
	function animate(time: number) {
		frame = 0;
		if (!permitted) return;
		const dt = previousTime
			? Math.min(64, Math.max(1, time - previousTime))
			: 16.67;
		previousTime = time;
		// Frame-rate-independent response; no endless render loop once settled.
		const ease = 1 - 0.9 ** (dt / 16.67);
		x += (targetX - x) * ease;
		y += (targetY - y) * ease;
		if (Math.abs(x - targetX) < 0.05 && Math.abs(y - targetY) < 0.05) {
			x = targetX;
			y = targetY;
		}
		draw();
		if (x !== targetX || y !== targetY) frame = requestAnimationFrame(animate);
		else previousTime = 0;
	}
	function schedule() {
		if (permitted && !frame) frame = requestAnimationFrame(animate);
	}
	function reset(immediate = false) {
		targetX = targetY = 0;
		if (immediate) {
			cancelAnimationFrame(frame);
			frame = 0;
			previousTime = 0;
			x = y = 0;
			draw();
		} else schedule();
	}
	function move(event: PointerEvent) {
		if (event.pointerType !== "mouse") return;
		const rect = hero.getBoundingClientRect();
		if (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		)
			return reset();
		const offset = parallaxOffset(
			event.clientX - rect.left,
			event.clientY - rect.top,
			rect.width,
			rect.height,
		);
		targetX = offset.x;
		targetY = offset.y;
		schedule();
	}
	function sync() {
		permitted =
			enabled &&
			fine.matches &&
			!reduced.matches &&
			!document.hidden &&
			!immersed &&
			root.dataset.wallpaperMode === "fullscreen" &&
			root.dataset.fullscreenLayout === "fairytale";
		// Keep the overscan scale while scrolling/reading. Dropping the scale
		// on the first scroll pixel would create a visible wallpaper zoom jump.
		layer.toggleAttribute("data-parallax-enabled", permitted);
		const next =
			permitted &&
			document.body.classList.contains("is-home") &&
			window.scrollY <= 1;
		if (active === next) {
			if (!permitted) reset(true);
			return;
		}
		active = next;
		pointerScope?.abort();
		layer.toggleAttribute("data-parallax-active", active);
		if (!active) {
			reset(!permitted);
			return;
		}
		pointerScope = new AbortController();
		window.addEventListener("pointermove", move, {
			passive: true,
			signal: pointerScope.signal,
		});
	}

	const observer = new MutationObserver(sync);
	observer.observe(root, {
		attributes: true,
		attributeFilter: ["data-wallpaper-mode", "data-fullscreen-layout"],
	});
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ["class"],
	});
	window.addEventListener(
		"firefly:fairytale-parallax-change",
		(event) => {
			enabled = (event as CustomEvent<{ enabled: boolean }>).detail.enabled;
			sync();
		},
		{ signal },
	);
	window.addEventListener(
		"storage",
		(event) => {
			if (event.key === FAIRYTALE_PARALLAX_KEY || event.key === null) {
				enabled = readFairytaleParallax();
				sync();
			}
		},
		{ signal },
	);
	window.addEventListener(
		"firefly:immersive-change",
		(event) => {
			immersed = !!(event as CustomEvent<{ active: boolean }>).detail.active;
			sync();
		},
		{ signal },
	);
	window.addEventListener("scroll", sync, { passive: true, signal });
	window.addEventListener(
		"resize",
		() => {
			reset(true);
			sync();
		},
		{ passive: true, signal },
	);
	window.addEventListener("blur", () => reset(), { signal });
	document.addEventListener("pointerleave", () => reset(), { signal });
	document.addEventListener("visibilitychange", sync, { signal });
	fine.addEventListener("change", sync, { signal });
	reduced.addEventListener("change", sync, { signal });
	sync();
	return () => {
		active = false;
		reset(true);
		pointerScope?.abort();
		observer.disconnect();
		scope.abort();
		layer.removeAttribute("data-parallax-active");
		layer.removeAttribute("data-parallax-enabled");
		layer.style.removeProperty("--fairytale-parallax-x");
		layer.style.removeProperty("--fairytale-parallax-y");
	};
}
