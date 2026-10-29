export type FullscreenLayout = "classic" | "fairytale";
export interface FairytaleSettings {
	blur: number;
	wallpaperOpacity: number;
	cardOpacity: number;
}
export const FULLSCREEN_LAYOUT_KEY = "firefly:fullscreen-layout";
export const FAIRYTALE_SETTINGS_KEY = "firefly:fairytale-settings";
export const FAIRYTALE_DEFAULTS: Readonly<FairytaleSettings> = {
	blur: 10,
	wallpaperOpacity: 1,
	cardOpacity: 0.74,
};
type PreferenceStorage = Pick<Storage, "getItem" | "setItem">;

export function normalizeFairytaleSettings(value: unknown): FairytaleSettings {
	const candidate =
		value && typeof value === "object"
			? (value as Partial<FairytaleSettings>)
			: {};
	const number = (key: keyof FairytaleSettings, min: number, max: number) => {
		const input = candidate[key];
		return typeof input === "number" && Number.isFinite(input)
			? Math.min(max, Math.max(min, input))
			: FAIRYTALE_DEFAULTS[key];
	};
	return {
		blur: number("blur", 0, 24),
		wallpaperOpacity: number("wallpaperOpacity", 0.2, 1),
		cardOpacity: number("cardOpacity", 0.2, 1),
	};
}
export function readFullscreenPreferences(storage?: PreferenceStorage): {
	layout: FullscreenLayout;
	settings: FairytaleSettings;
} {
	let layout: FullscreenLayout = "classic";
	let settings = { ...FAIRYTALE_DEFAULTS };
	try {
		const store = storage ?? window.localStorage;
		layout =
			store.getItem(FULLSCREEN_LAYOUT_KEY) === "fairytale"
				? "fairytale"
				: "classic";
		settings = normalizeFairytaleSettings(
			JSON.parse(store.getItem(FAIRYTALE_SETTINGS_KEY) || "null"),
		);
	} catch {
		/* Storage is optional; keep the existing classic layout. */
	}
	return { layout, settings };
}
export function applyFairytaleSettings(
	settings: FairytaleSettings,
	root: HTMLElement = document.documentElement,
): void {
	const values = normalizeFairytaleSettings(settings);
	root.style.setProperty("--fairytale-blur", `${values.blur}px`);
	root.style.setProperty(
		"--fairytale-wallpaper-opacity",
		String(values.wallpaperOpacity),
	);
	root.style.setProperty(
		"--fairytale-card-opacity",
		String(values.cardOpacity),
	);
}
export function setFullscreenLayout(layout: FullscreenLayout): void {
	const grid = document.getElementById("main-grid");
	const preserveReading =
		document.documentElement.dataset.wallpaperMode === "fullscreen" &&
		!document.body.classList.contains("is-home");
	const previousTop = grid?.getBoundingClientRect().top;
	try {
		localStorage.setItem(FULLSCREEN_LAYOUT_KEY, layout);
	} catch {
		/* Still usable for this visit. */
	}
	document.documentElement.dataset.fullscreenLayout = layout;
	window.dispatchEvent(
		new CustomEvent("firefly:fullscreen-layout-change", { detail: { layout } }),
	);
	if (preserveReading && grid && previousTop !== undefined)
		requestAnimationFrame(() => {
			window.scrollBy({
				top: grid.getBoundingClientRect().top - previousTop,
				behavior: "instant",
			});
		});
}
export function setFairytaleSettings(settings: FairytaleSettings): void {
	const values = normalizeFairytaleSettings(settings);
	try {
		localStorage.setItem(FAIRYTALE_SETTINGS_KEY, JSON.stringify(values));
	} catch {
		/* Still usable for this visit. */
	}
	applyFairytaleSettings(values);
	window.dispatchEvent(new CustomEvent("firefly:fairytale-settings-change"));
}
