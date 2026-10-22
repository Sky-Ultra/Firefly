export const MAX_LIKE_NOTICES = 4;
export const MAX_HEART_PARTICLES = 28;
export const HEART_BURST_COUNT = 6;
const COMBO_GAP_MS = 1800;

export type LikeCombo = { count: number; lastAt: number };

export function advanceLikeCombo(
	state: LikeCombo,
	at: number,
): LikeCombo & { burst: boolean } {
	const gap = at - state.lastAt;
	const count =
		gap >= 0 && gap <= COMBO_GAP_MS ? Math.min(5, state.count + 1) : 1;
	return { count, lastAt: at, burst: count >= 5 };
}

export function getHeartOrigin(
	x: number,
	y: number,
	bounds: { left: number; top: number; width: number; height: number },
	viewportWidth: number,
	viewportHeight: number,
): { x: number; y: number } {
	const keyboard = x === 0 && y === 0;
	const originX = keyboard ? bounds.left + bounds.width / 2 : x;
	const originY = keyboard ? bounds.top + bounds.height / 2 : y;
	return {
		x: Math.max(16, Math.min(viewportWidth - 16, originX)),
		y: Math.max(16, Math.min(viewportHeight - 16, originY)),
	};
}
