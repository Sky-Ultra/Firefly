const BVID = /^BV[0-9A-Za-z]{10}$/;
const BILIBILI_HOSTS = new Set([
	"www.bilibili.com",
	"bilibili.com",
	"m.bilibili.com",
]);

export function safeSocialLink(value: string): string | null {
	try {
		const url = new URL(value.trim());
		if (
			!["https:", "http:"].includes(url.protocol) ||
			url.username ||
			url.password
		)
			return null;
		return url.href;
	} catch {
		return null;
	}
}

export function bilibiliVideo(
	value: string,
): { bvid: string; page: number; href: string; player: string } | null {
	let bvid = value.trim();
	let page = 1;
	if (!BVID.test(bvid)) {
		const safe = safeSocialLink(value);
		if (!safe) return null;
		const url = new URL(safe);
		if (!BILIBILI_HOSTS.has(url.hostname) || url.port) return null;
		bvid = url.pathname.match(/^\/video\/(BV[0-9A-Za-z]{10})\/?$/)?.[1] ?? "";
		const requestedPage = Number(url.searchParams.get("p") ?? 1);
		if (
			Number.isSafeInteger(requestedPage) &&
			requestedPage > 0 &&
			requestedPage <= 10000
		)
			page = requestedPage;
	}
	if (!BVID.test(bvid)) return null;
	const href = new URL(`https://www.bilibili.com/video/${bvid}/`);
	if (page > 1) href.searchParams.set("p", String(page));
	const player = new URL("https://player.bilibili.com/player.html");
	player.searchParams.set("bvid", bvid);
	player.searchParams.set("p", String(page));
	player.searchParams.set("autoplay", "0");
	player.searchParams.set("poster", "1");
	return { bvid, page, href: href.href, player: player.href };
}
