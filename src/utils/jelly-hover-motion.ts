import { getCardHoverTarget } from "./card-hover-motion";

export type JellyProfile = "card" | "control" | "avatar";
const strength: Record<JellyProfile, number> = {
	card: 0.6,
	control: 0.3,
	avatar: 1,
};

export function getJellyHoverTarget(
	x: number,
	y: number,
	bounds: { left: number; top: number; width: number; height: number },
	profile: string,
): { x: number; y: number } {
	if (
		![x, y, bounds.left, bounds.top, bounds.width, bounds.height].every(
			Number.isFinite,
		)
	)
		return { x: 0, y: 0 };
	return getCardHoverTarget(
		x,
		y,
		bounds,
		strength[profile as JellyProfile] ?? strength.card,
	);
}
