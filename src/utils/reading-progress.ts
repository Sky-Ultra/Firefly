/** Progress through the body, from its top at the reading inset to its bottom in view. */
export function getReadingProgress(
	body: { top: number; height: number },
	viewportBottom: number,
	topInset = 0,
): number {
	if (
		![body.top, body.height, viewportBottom, topInset].every(Number.isFinite) ||
		body.height <= 0 ||
		viewportBottom <= 0
	) {
		return 0;
	}

	const inset = Math.max(0, topInset);
	const readingHeight = viewportBottom - inset;
	if (readingHeight <= 0) return 0;

	// A short body needs no scrolling once its final line is visible.
	if (body.height <= readingHeight) {
		return body.top + body.height <= viewportBottom ? 1 : 0;
	}

	return Math.min(
		1,
		Math.max(0, (inset - body.top) / (body.height - readingHeight)),
	);
}
