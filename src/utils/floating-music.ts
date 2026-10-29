export type MusicManager = NonNullable<Window["__fireflyMusic"]>;
export type MusicSnapshot = ReturnType<MusicManager["getState"]>;
export const FLOATING_MUSIC_KEY = "firefly:floating-music-dismissed";
export const FLOATING_MUSIC_POSITION_KEY = "firefly:floating-music-position";

/** A view subscription only: no additional audio, playlist requests or playback state. */
export function subscribeFloatingMusic(
	manager: MusicManager,
	view: Window,
	update: (snapshot: MusicSnapshot) => void,
): () => void {
	const events = [
		"fm:init",
		"fm:track",
		"fm:time",
		"fm:play-state",
		"fm:mode",
		"fm:volume",
		"fm:lyrics",
		"fm:lrc-index",
		"fm:error",
	];
	const sync = () => update(manager.getState());
	events.forEach((event) => {
		view.addEventListener(event, sync);
	});
	sync();
	return () => {
		events.forEach((event) => {
			view.removeEventListener(event, sync);
		});
	};
}

export function readFloatingMusicDismissed(
	storage: Pick<Storage, "getItem">,
): boolean {
	try {
		return storage.getItem(FLOATING_MUSIC_KEY) === "true";
	} catch {
		return false;
	}
}

export function clampMusicDock(
	point: { x: number; y: number },
	viewport: { width: number; height: number },
	box: { width: number; above: number; below: number },
): { x: number; y: number } {
	const bounded = (value: number, min: number, max: number) =>
		Math.min(
			Math.max(min, Number.isFinite(value) ? value : min),
			Math.max(min, max),
		);
	return {
		x: bounded(point.x, 12, viewport.width - box.width - 12),
		y: bounded(point.y, box.above + 12, viewport.height - box.below - 12),
	};
}
