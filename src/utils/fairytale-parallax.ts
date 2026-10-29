/** Independent desktop-only motion; does not own carousel images or playback. */
export const FAIRYTALE_PARALLAX_KEY = "firefly:fairytale-parallax";
export const FAIRYTALE_PARALLAX_STRENGTH_KEY =
	"firefly:fairytale-parallax-strength";
export const PARALLAX_DEFAULT_STRENGTH = 115;
export function normalizeParallaxStrength(value: unknown): number {
	return typeof value === "number" && Number.isFinite(value)
		? Math.round(Math.min(200, Math.max(0, value)) / 5) * 5
		: PARALLAX_DEFAULT_STRENGTH;
}
export function readParallaxStrength(
	storage?: Pick<Storage, "getItem">,
): number {
	try {
		const value = (storage ?? window.localStorage).getItem(
			FAIRYTALE_PARALLAX_STRENGTH_KEY,
		);
		return value?.trim()
			? normalizeParallaxStrength(Number(value))
			: PARALLAX_DEFAULT_STRENGTH;
	} catch {
		return PARALLAX_DEFAULT_STRENGTH;
	}
}
export function setParallaxStrength(value: number): void {
	const strength = normalizeParallaxStrength(value);
	try {
		localStorage.setItem(FAIRYTALE_PARALLAX_STRENGTH_KEY, String(strength));
	} catch {
		/* Optional preference. */
	}
	window.dispatchEvent(
		new CustomEvent("firefly:fairytale-parallax-strength-change", {
			detail: { strength },
		}),
	);
}
export function parallaxScale(
	width: number,
	height: number,
	strength: number,
): number {
	const factor = normalizeParallaxStrength(strength) / 100;
	return Math.max(
		1.035,
		1 +
			2 *
				Math.max(
					(14 * factor) / Math.max(1, width),
					(10 * factor) / Math.max(1, height),
				),
	);
}
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
	strength: number = PARALLAX_DEFAULT_STRENGTH,
): { x: number; y: number } {
	const normalized = (value: number, size: number) =>
		Math.max(-1, Math.min(1, (value / Math.max(1, size)) * 2 - 1));
	const factor = normalizeParallaxStrength(strength) / 100;
	return {
		x: -normalized(x, width) * 14 * factor,
		y: -normalized(y, height) * 10 * factor,
	};
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
	let strength = readParallaxStrength();
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
	function updateScale() {
		layer.style.setProperty(
			"--fairytale-parallax-scale",
			String(
				parallaxScale(
					hero.clientWidth || window.innerWidth,
					hero.clientHeight || window.innerHeight,
					strength,
				),
			),
		);
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
			strength,
		);
		targetX = offset.x;
		targetY = offset.y;
		schedule();
	}
	function sync() {
		const wasPermitted = permitted;
		permitted =
			enabled &&
			strength > 0 &&
			fine.matches &&
			!reduced.matches &&
			!document.hidden &&
			!immersed &&
			root.dataset.wallpaperMode === "fullscreen" &&
			root.dataset.fullscreenLayout === "fairytale";
		// Keep the overscan scale while scrolling/reading. Dropping the scale
		// on the first scroll pixel would create a visible wallpaper zoom jump.
		layer.toggleAttribute("data-parallax-enabled", permitted);
		if (permitted && !wasPermitted) updateScale();
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
		"firefly:fairytale-parallax-strength-change",
		(event) => {
			const previous = strength;
			strength = normalizeParallaxStrength(
				(event as CustomEvent<{ strength: number }>).detail.strength,
			);
			if (previous > 0) {
				targetX *= strength / previous;
				targetY *= strength / previous;
			}
			updateScale();
			sync();
			schedule();
		},
		{ signal },
	);
	window.addEventListener(
		"storage",
		(event) => {
			if (
				event.key === FAIRYTALE_PARALLAX_KEY ||
				event.key === FAIRYTALE_PARALLAX_STRENGTH_KEY ||
				event.key === null
			) {
				enabled = readFairytaleParallax();
				strength = readParallaxStrength();
				reset(true);
				updateScale();
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
			updateScale();
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
		layer.style.removeProperty("--fairytale-parallax-scale");
	};
}
