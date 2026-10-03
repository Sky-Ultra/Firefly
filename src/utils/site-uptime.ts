export type SiteUptime = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

const DEFAULT_SITE_START_DATE = "2026-07-09";

export function getSiteStartTimestamp(startDate?: string): number {
	const timestamp = Date.parse(startDate || DEFAULT_SITE_START_DATE);
	return Number.isFinite(timestamp)
		? timestamp
		: Date.parse(DEFAULT_SITE_START_DATE);
}

export function getSiteUptime(
	start: number,
	now: number = Date.now(),
): SiteUptime {
	const elapsed = now - start;
	const totalSeconds = Number.isFinite(elapsed)
		? Math.floor(Math.max(0, elapsed) / 1000)
		: 0;
	return {
		days: Math.floor(totalSeconds / 86_400),
		hours: Math.floor((totalSeconds % 86_400) / 3600),
		minutes: Math.floor((totalSeconds % 3600) / 60),
		seconds: totalSeconds % 60,
	};
}
