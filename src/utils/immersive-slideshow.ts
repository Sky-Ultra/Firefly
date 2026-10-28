type Cover = { wallpaperUrl?: string; originalUrl?: string };

/** Full library, independent from the normal carousel's reserved assignments. */
export function getImmersivePool(
	carrier: HTMLElement,
	mobile: boolean,
): string[] {
	try {
		const covers: Cover[] = JSON.parse(
			(mobile
				? carrier.dataset.randomCoverMobileHomeWallpaper
				: carrier.dataset.randomCoverPool) || "[]",
		);
		return [
			...new Set(
				covers
					.map((cover) => cover.wallpaperUrl || cover.originalUrl)
					.filter(
						(source): source is string =>
							typeof source === "string" &&
							source.startsWith("/") &&
							!source.startsWith("//"),
					),
			),
		];
	} catch {
		return [];
	}
}

export function mountImmersiveSlideshow(dialog: HTMLDialogElement): () => void {
	const images = [
		...dialog.querySelectorAll<HTMLImageElement>("[data-immersive-image]"),
	];
	const statusElement = dialog.querySelector<HTMLElement>(
		"[data-immersive-status]",
	);
	const pauseElement = dialog.querySelector<HTMLButtonElement>(
		"[data-immersive-pause]",
	);
	const pauseIconElement = dialog.querySelector<HTMLElement>(
		"[data-immersive-pause-icon]",
	);
	const hintElement = dialog.querySelector<HTMLElement>(
		"[data-immersive-hint]",
	);
	if (
		images.length !== 2 ||
		!statusElement ||
		!pauseElement ||
		!pauseIconElement ||
		!hintElement
	)
		return () => {};
	const status = statusElement;
	const pause = pauseElement;
	const pauseIcon = pauseIconElement;
	const hint = hintElement;
	const scope = new AbortController();
	const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const interval = Math.max(3000, Number(dialog.dataset.interval) || 6500);
	let active = false;
	let closing = false;
	let ownedFullscreen = false;
	let busy = false;
	let paused = false;
	let generation = 0;
	let current = -1;
	let layer = 0;
	let pool: string[] = [];
	let timer: number | undefined;
	let controlsTimer: number | undefined;
	let closeTimer: number | undefined;
	let trigger: HTMLElement | null = null;
	let pointerX: number | null = null;
	let pointerY = 0;
	let preloaded: {
		url: string;
		image: HTMLImageElement;
		ready: Promise<boolean>;
		cancel: () => void;
	} | null = null;
	const cancelLoads = new Set<() => void>();
	const failed = new Set<string>();
	const text = (zh: string, en: string) =>
		document.documentElement.lang.startsWith("en") ? en : zh;
	const emit = (value: boolean) =>
		window.dispatchEvent(
			new CustomEvent("firefly:immersive-change", {
				detail: { active: value },
			}),
		);
	const clearPlayback = () => {
		window.clearTimeout(timer);
		timer = undefined;
	};

	function showControls() {
		dialog.removeAttribute("data-controls-hidden");
		window.clearTimeout(controlsTimer);
		if (active && !closing)
			controlsTimer = window.setTimeout(
				() => dialog.setAttribute("data-controls-hidden", ""),
				3200,
			);
	}
	function syncLabels() {
		pause.setAttribute(
			"aria-label",
			paused
				? text("继续播放", "Resume playback")
				: text("暂停播放", "Pause playback"),
		);
		pause.title = pause.getAttribute("aria-label") || "";
		pauseIcon.textContent = paused ? "▷" : "Ⅱ";
		hint.textContent = window.matchMedia("(pointer: coarse)").matches
			? text(
					"轻点显示按钮 · 左右滑动切换",
					"Tap for controls · Swipe to change",
				)
			: text(
					"Esc 退出 · ← → 切换 · 空格暂停",
					"Esc to exit · ← → to change · Space to pause",
				);
		for (const [selector, zh, en] of [
			["[data-immersive-prev]", "上一张", "Previous image"],
			["[data-immersive-next]", "下一张", "Next image"],
			["[data-immersive-exit]", "退出沉浸式播放", "Exit immersive playback"],
		]) {
			const button = dialog.querySelector<HTMLButtonElement>(selector);
			button?.setAttribute("aria-label", text(zh, en));
			if (button) button.title = text(zh, en);
		}
	}
	function load(url: string) {
		if (preloaded?.url === url) return preloaded.ready;
		if (preloaded) {
			preloaded.cancel();
			preloaded = null;
		}
		const image = new Image();
		image.decoding = "async";
		let cancelLoad = () => {};
		const ready = new Promise<boolean>((resolve) => {
			let settled = false;
			const finish = (success: boolean) => {
				if (settled) return;
				settled = true;
				window.clearTimeout(timeout);
				image.onload = null;
				image.onerror = null;
				cancelLoads.delete(cancel);
				resolve(success);
			};
			const cancel = () => {
				image.removeAttribute("src");
				finish(false);
			};
			const timeout = window.setTimeout(() => {
				failed.add(url);
				cancel();
			}, 15000);
			cancelLoad = cancel;
			cancelLoads.add(cancel);
			image.onload = () => {
				const decoded =
					typeof image.decode === "function"
						? image.decode().catch(() => {})
						: Promise.resolve();
				void decoded.then(() => finish(true));
			};
			image.onerror = () => {
				failed.add(url);
				finish(false);
			};
			image.src = url;
			if (image.complete && image.naturalWidth > 0)
				image.onload(new Event("load"));
		});
		preloaded = { url, image, ready, cancel: cancelLoad };
		return ready;
	}
	function schedule() {
		clearPlayback();
		if (active && !closing && !paused && !document.hidden && pool.length > 1) {
			timer = window.setTimeout(() => {
				void advance(1);
			}, interval);
		}
	}
	function prepareNext() {
		if (!active || closing || document.hidden || pool.length < 2) return;
		const next = pool[(current + 1) % pool.length];
		if (!failed.has(next)) void load(next);
	}
	async function advance(direction: number, initial = false) {
		if (!active || closing || busy) return;
		busy = true;
		clearPlayback();
		const token = generation;
		let candidate = initial
			? 0
			: (current + direction + pool.length) % pool.length;
		let selected = -1;
		for (let attempts = 0; attempts < pool.length; attempts++) {
			if (!active || closing || token !== generation) return;
			if (!failed.has(pool[candidate]) && (await load(pool[candidate]))) {
				selected = candidate;
				break;
			}
			candidate = (candidate + direction + pool.length) % pool.length;
		}
		if (!active || closing || token !== generation) return;
		busy = false;
		if (selected < 0) {
			status.textContent = text(
				"图片暂时未能加载，请稍后退出重试。",
				"Images could not load. Please exit and try again later.",
			);
			showControls();
			return;
		}
		current = selected;
		const nextLayer = initial ? layer : 1 - layer;
		images[nextLayer].src = pool[current];
		images[nextLayer].setAttribute("data-active", "");
		images[1 - nextLayer].removeAttribute("data-active");
		layer = nextLayer;
		status.textContent = "";
		dialog.dataset.currentIndex = String(current);
		prepareNext();
		schedule();
	}
	function finishClose() {
		window.clearTimeout(closeTimer);
		if (!active) return;
		active = false;
		closing = false;
		generation++;
		if (dialog.open) dialog.close();
		dialog.removeAttribute("data-closing");
		dialog.removeAttribute("data-controls-hidden");
		document.documentElement.classList.remove("immersive-playback");
		images.forEach((image) => {
			image.removeAttribute("src");
			image.removeAttribute("data-active");
		});
		preloaded?.image.removeAttribute("src");
		preloaded = null;
		pool = [];
		delete dialog.dataset.poolCount;
		delete dialog.dataset.currentIndex;
		emit(false);
		if (trigger?.isConnected) trigger.focus({ preventScroll: true });
		trigger = null;
	}
	function close(immediate = false) {
		if (!active || closing) return;
		closing = true;
		generation++;
		clearPlayback();
		window.clearTimeout(controlsTimer);
		for (const cancel of [...cancelLoads]) cancel();
		if (document.fullscreenElement === dialog)
			void document.exitFullscreen().catch(() => {});
		ownedFullscreen = false;
		if (immediate || motion.matches) finishClose();
		else {
			dialog.setAttribute("data-closing", "");
			closeTimer = window.setTimeout(finishClose, 230);
		}
	}
	function open() {
		if (active) return;
		const carrier = document.querySelector<HTMLElement>(
			"[data-random-cover-wallpaper-only][data-random-cover-pool]",
		);
		if (!carrier) return;
		const mobile = window.innerWidth < 1024;
		pool = getImmersivePool(carrier, mobile);
		if (!pool.length) return;
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		const selector = mobile
			? '.slide-item[class~="lg:hidden"].active'
			: '.slide-item[class~="lg:block"].active';
		const normalCurrent = document.querySelector<HTMLElement>(
			`#banner-images-container ${selector}`,
		)?.dataset.wallpaperSrc;
		const first = normalCurrent ? pool.indexOf(normalCurrent) : -1;
		if (first > 0) [pool[0], pool[first]] = [pool[first], pool[0]];
		trigger =
			document.getElementById("display-settings-switch") ||
			(document.activeElement instanceof HTMLElement
				? document.activeElement
				: null);
		try {
			dialog.showModal();
		} catch {
			pool = [];
			trigger = null;
			return;
		}
		active = true;
		closing = false;
		paused = false;
		busy = false;
		current = -1;
		failed.clear();
		generation++;
		document.documentElement.classList.add("immersive-playback");
		dialog.dataset.poolCount = String(pool.length);
		dialog.dataset.device = mobile ? "mobile" : "desktop";
		dialog.toggleAttribute("data-suspended", document.hidden);
		status.textContent = text("正在展开画面…", "Opening the view…");
		syncLabels();
		emit(true);
		dialog.focus({ preventScroll: true });
		showControls();
		void advance(1, true);
		// A viewport dialog also works when browser fullscreen is unsupported or denied.
		if (!document.fullscreenElement && dialog.requestFullscreen) {
			const token = generation;
			void dialog
				.requestFullscreen()
				.then(() => {
					if (token !== generation || !active || closing) {
						if (document.fullscreenElement === dialog)
							void document.exitFullscreen().catch(() => {});
						return;
					}
					ownedFullscreen = document.fullscreenElement === dialog;
				})
				.catch(() => {});
		}
	}
	function onKey(event: KeyboardEvent) {
		if (!active || closing || event.ctrlKey || event.metaKey || event.altKey)
			return;
		if (event.key === "Escape" || event.key.toLowerCase() === "q") {
			event.preventDefault();
			close();
		} else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
			event.preventDefault();
			void advance(event.key === "ArrowRight" ? 1 : -1);
			showControls();
		} else if (
			event.key === " " &&
			!(event.target instanceof Element && event.target.closest("button"))
		) {
			event.preventDefault();
			paused = !paused;
			syncLabels();
			if (paused) clearPlayback();
			else schedule();
			showControls();
		}
	}
	function onClick(event: MouseEvent) {
		const target = event.target instanceof Element ? event.target : null;
		if (target?.closest("[data-immersive-exit]")) close();
		else if (target?.closest("[data-immersive-next]")) void advance(1);
		else if (target?.closest("[data-immersive-prev]")) void advance(-1);
		else if (target?.closest("[data-immersive-pause]")) {
			paused = !paused;
			syncLabels();
			if (paused) clearPlayback();
			else schedule();
		}
		showControls();
	}
	const options = { signal: scope.signal };
	window.addEventListener("firefly:immersive-open", open, options);
	dialog.addEventListener("click", onClick, options);
	dialog.addEventListener("pointermove", showControls, options);
	dialog.addEventListener(
		"pointerdown",
		(event) => {
			pointerX = event.clientX;
			pointerY = event.clientY;
		},
		options,
	);
	dialog.addEventListener(
		"pointerup",
		(event) => {
			if (
				pointerX === null ||
				(event.target instanceof Element && event.target.closest("button"))
			)
				return;
			const delta = event.clientX - pointerX;
			if (
				Math.abs(delta) > 55 &&
				Math.abs(delta) > Math.abs(event.clientY - pointerY) * 1.3
			)
				void advance(delta > 0 ? -1 : 1);
			pointerX = null;
			showControls();
		},
		options,
	);
	dialog.addEventListener(
		"pointercancel",
		() => {
			pointerX = null;
		},
		options,
	);
	dialog.addEventListener(
		"cancel",
		(event) => {
			event.preventDefault();
			close();
		},
		options,
	);
	dialog.addEventListener(
		"close",
		() => {
			if (active && !closing) close(true);
		},
		options,
	);
	document.addEventListener("keydown", onKey, { ...options, capture: true });
	document.addEventListener(
		"fullscreenchange",
		() => {
			if (active && ownedFullscreen && document.fullscreenElement !== dialog)
				close();
		},
		options,
	);
	document.addEventListener(
		"visibilitychange",
		() => {
			if (!active || closing) return;
			dialog.toggleAttribute("data-suspended", document.hidden);
			if (document.hidden) clearPlayback();
			else {
				prepareNext();
				schedule();
			}
		},
		options,
	);
	document.addEventListener(
		"firefly:language-change",
		() => {
			if (active) syncLabels();
		},
		options,
	);
	document.addEventListener("swup:visit:start", () => close(true), options);
	document.addEventListener("astro:before-swap", () => close(true), options);
	window.addEventListener("pagehide", () => close(true), options);
	return () => {
		close(true);
		// A pending fade must also be disposed when this component is removed.
		if (active) finishClose();
		scope.abort();
	};
}
