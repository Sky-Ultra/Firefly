export type HoverSpring = { position: number; velocity: number };
type CardBounds = { left: number; top: number; width: number; height: number };

export function getCardHoverTarget(
	x: number,
	y: number,
	bounds: CardBounds,
	strength = 1,
): { x: number; y: number } {
	if (bounds.width <= 0 || bounds.height <= 0) return { x: 0, y: 0 };
	const clamp = (value: number) => Math.max(-1, Math.min(1, value));
	const amount = Number.isFinite(strength)
		? Math.max(0, Math.min(1, strength))
		: 1;
	return {
		x: clamp(((x - bounds.left) / bounds.width - 0.5) * 2) * 6 * amount,
		y: clamp(((y - bounds.top) / bounds.height - 0.5) * 2) * 5 * amount,
	};
}

export function advanceHoverSpring(
	state: HoverSpring,
	target: number,
	seconds: number,
): HoverSpring {
	const elapsed = Math.max(0, Math.min(seconds, 0.064));
	const steps = Math.max(1, Math.ceil(elapsed * 120));
	const step = elapsed / steps;
	let { position, velocity } = state;
	for (let i = 0; i < steps; i++) {
		velocity += ((target - position) * 290 - velocity * 25) * step;
		position += velocity * step;
	}
	return { position, velocity };
}

export function isHoverSpringSettled(
	state: HoverSpring,
	target: number,
): boolean {
	return (
		Math.abs(state.position - target) < 0.008 && Math.abs(state.velocity) < 0.04
	);
}
