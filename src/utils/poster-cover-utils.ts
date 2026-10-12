/** Select uniformly from the pool, excluding the last successful cover when possible. */
export function getNextPosterCover(
	coverImages: readonly string[],
	fallbackCover: string | null,
	previousCover: string | null = null,
	random: () => number = Math.random,
): string | null {
	const candidates = [
		...new Set(coverImages.map((image) => image.trim()).filter(Boolean)),
	];
	if (candidates.length === 0) return fallbackCover;
	const alternatives = candidates.filter((image) => image !== previousCover);
	const pool = alternatives.length > 0 ? alternatives : candidates;
	return pool[Math.floor(random() * pool.length)] ?? fallbackCover;
}
