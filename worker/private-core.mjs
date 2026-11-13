export const MAX_FAILURES = 5;
export const DAY = 86400000;
export const RESERVATION_MS = 60000;
export const SESSION_MS = 2 * 60 * 60 * 1000;
export const DEVICE_MS = 30 * DAY;
export const STEP_MS = 10 * 60 * 1000;
export const SECOND_STEP_ARTICLES = ["long-night-love-letter"];
export const DEVICE_COOKIE = "__Host-firefly-reader";
export function trafficCounter(previous, now) {
	const times = (previous?.times || []).filter((time) => time > now - 60000);
	if (times.length >= 60)
		return {
			state: { times },
			result: {
				ok: false,
				retryAfter: Math.max(1, Math.ceil((times[0] + 60000 - now) / 1000)),
			},
		};
	times.push(now);
	return { state: { times }, result: { ok: true } };
}
export const ARTICLES = ["liking", "love-tree-guide", "long-night-love-letter"];
export const passwordLengths = {
	liking: 4,
	"love-tree-guide": 4,
	"long-night-love-letter": 8,
};
const encoder = new TextEncoder();
export async function verifyPassword(password, verifier) {
	const material = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const actual = new Uint8Array(
		await crypto.subtle.deriveBits(
			{
				name: "PBKDF2",
				salt: fromB64(verifier.salt),
				iterations: verifier.iterations,
				hash: "SHA-256",
			},
			material,
			256,
		),
	);
	const expected = fromB64(verifier.hash);
	let difference = actual.length ^ expected.length;
	for (let i = 0; i < actual.length; i++)
		difference |= actual[i] ^ (expected[i] ?? 0);
	return difference === 0;
}
/** @type {{ readonly maxFailures: number, readonly resetSchedule: "daily" | "weekly" }} */
export const DAILY_QUOTA = Object.freeze({
	maxFailures: 5,
	resetSchedule: "daily",
});
export const LETTER_WEEKLY_QUOTA = Object.freeze({
	maxFailures: 6,
	resetSchedule: "weekly",
});
const WEEK = 7 * DAY;
// 1970-01-05 04:00 Asia/Shanghai (Monday), expressed in UTC.
const WEEK_ANCHOR = Date.UTC(1970, 0, 4, 20);
export function quotaPolicyForArticles(articles) {
	return articles.includes("long-night-love-letter")
		? LETTER_WEEKLY_QUOTA
		: DAILY_QUOTA;
}
function effectiveQuota(previous, policy = DAILY_QUOTA) {
	// A rolling-deploy request without policy metadata must not downgrade or
	// reset a counter already migrated to the weekly rule.
	return previous?.resetSchedule === "weekly" ||
		policy.resetSchedule === "weekly"
		? LETTER_WEEKLY_QUOTA
		: DAILY_QUOTA;
}
export function periodAt(now, policy = DAILY_QUOTA) {
	if (policy.resetSchedule === "weekly") {
		const period = Math.floor((now - WEEK_ANCHOR) / WEEK);
		return { period, resetAt: WEEK_ANCHOR + (period + 1) * WEEK };
	}
	const period = Math.floor((now + 4 * 3600000) / DAY);
	return { period, resetAt: (period + 1) * DAY - 4 * 3600000 };
}
export function counterState(previous, now, requested = DAILY_QUOTA) {
	const policy = effectiveQuota(previous, requested);
	const time = periodAt(now, policy);
	const oldSchedule = previous?.resetSchedule || "daily";
	const samePeriod =
		oldSchedule === policy.resetSchedule && previous?.period === time.period;
	// Preserve today's stored failures and pending reservations when first
	// moving this existing password group to weekly. Never clear the namespace.
	const migrateToday =
		oldSchedule === "daily" &&
		policy.resetSchedule === "weekly" &&
		previous?.period === periodAt(now).period;
	const state =
		samePeriod || migrateToday
			? structuredClone(previous)
			: { period: time.period, failures: 0, pending: {} };
	state.period = time.period;
	if (policy.resetSchedule === "weekly") state.resetSchedule = "weekly";
	for (const [id, until] of Object.entries(state.pending))
		if (until <= now) {
			delete state.pending[id];
			state.failures = Math.min(policy.maxFailures, state.failures + 1);
		}
	return state;
}
export function counterSummary(state, now, requested = DAILY_QUOTA) {
	const policy = effectiveQuota(state, requested);
	return {
		failures: state.failures,
		remaining: Math.max(0, policy.maxFailures - state.failures),
		locked: state.failures >= policy.maxFailures,
		resetAt: periodAt(now, policy).resetAt,
	};
}
/** Carry pre-group per-article quotas forward without resetting or double charging. */
export function inheritCounters(
	previous,
	now,
	snapshots,
	requested = DAILY_QUOTA,
) {
	const policy = effectiveQuota(previous, requested);
	const own = previous ? structuredClone(previous) : undefined;
	if (own)
		for (const id of Object.keys(own.pending))
			if (id.startsWith("legacy:")) delete own.pending[id];
	const state = counterState(own, now, policy);
	const legacy = snapshots.map(({ name, state: old }) => ({
		name,
		state: counterState(old, now, policy),
	}));
	const failures = Math.min(
		policy.maxFailures,
		legacy.reduce((total, item) => total + item.state.failures, 0),
	);
	const delta = Math.max(0, failures - (state.inheritedFailures || 0));
	state.failures = Math.min(policy.maxFailures, state.failures + delta);
	state.inheritedFailures = Math.max(failures, state.inheritedFailures || 0);
	for (const item of legacy)
		for (const [id, until] of Object.entries(item.state.pending))
			state.pending[`legacy:${item.name}:${id}`] = until;
	return state;
}
export function reserveCounter(previous, now, id, requested = DAILY_QUOTA) {
	const policy = effectiveQuota(previous, requested);
	const state = counterState(previous, now, policy);
	const summary = counterSummary(state, now, policy);
	if (summary.locked)
		return { state, result: { ...summary, ok: false, reason: "locked" } };
	if (state.failures + Object.keys(state.pending).length >= policy.maxFailures)
		return { state, result: { ...summary, ok: false, reason: "busy" } };
	state.pending[id] = now + RESERVATION_MS;
	return { state, result: { ...summary, ok: true } };
}
export function finishCounter(
	previous,
	now,
	id,
	outcome,
	requested = DAILY_QUOTA,
) {
	const policy = effectiveQuota(previous, requested);
	const state = counterState(previous, now, policy);
	if (Object.hasOwn(state.pending, id)) {
		delete state.pending[id];
		if (outcome === "incorrect")
			state.failures = Math.min(policy.maxFailures, state.failures + 1);
	}
	return { state, result: counterSummary(state, now, policy) };
}
export function b64url(bytes) {
	let str = "";
	for (const b of bytes) str += String.fromCharCode(b);
	return btoa(str)
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replace(/=+$/g, "");
}
export function fromB64(value) {
	const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
	return Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0));
}
export async function sha256(value) {
	const raw = await crypto.subtle.digest("SHA-256", encoder.encode(value));
	return [...new Uint8Array(raw)]
		.map((v) => v.toString(16).padStart(2, "0"))
		.join("");
}
async function hmacKey(secret) {
	return crypto.subtle.importKey(
		"raw",
		fromB64(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);
}
export async function signToken(payload, secret) {
	const data = b64url(encoder.encode(JSON.stringify(payload)));
	return `${data}.${b64url(new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(data))))}`;
}
export async function verifyToken(token, secret, type, now) {
	try {
		if (!token || token.length > 2048) return null;
		const parts = token.split(".");
		if (parts.length !== 2) return null;
		if (
			!(await crypto.subtle.verify(
				"HMAC",
				await hmacKey(secret),
				fromB64(parts[1]),
				encoder.encode(parts[0]),
			))
		)
			return null;
		const payload = JSON.parse(new TextDecoder().decode(fromB64(parts[0])));
		return payload.type === type &&
			Number.isFinite(payload.exp) &&
			payload.exp > now &&
			typeof payload.device === "string" &&
			/^[a-f0-9-]{36}$/.test(payload.device)
			? payload
			: null;
	} catch {
		return null;
	}
}
export function readCookies(request) {
	const cookies = Object.create(null);
	for (const pair of (request.headers.get("Cookie") || "").split(";")) {
		const i = pair.indexOf("=");
		if (i > 0) cookies[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
	}
	return cookies;
}
export function cookie(name, value, seconds) {
	return `${name}=${value}; Path=/; Max-Age=${seconds}; Secure; HttpOnly; SameSite=Strict`;
}
export function stepCookie(article) {
	return `__Host-firefly-step-${article}`;
}
export function sessionCookie(article) {
	return `__Host-firefly-article-${article}`;
}
export function json(data, status = 200, cookies = []) {
	const headers = new Headers({
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store, max-age=0",
		"Cloudflare-CDN-Cache-Control": "no-store",
		Vary: "Cookie",
		"X-Robots-Tag": "noindex, nofollow",
		"X-Content-Type-Options": "nosniff",
	});
	for (const value of cookies) headers.append("Set-Cookie", value);
	if (status === 429)
		headers.set(
			"Retry-After",
			String(
				data.retryAfter ??
					(data.reason === "busy"
						? 2
						: Math.max(1, Math.ceil((data.resetAt - Date.now()) / 1000))),
			),
		);
	return new Response(JSON.stringify(data), { status, headers });
}
export async function readBody(request, maximum = 8192) {
	if (!request.body) return "";
	const reader = request.body.getReader();
	const parts = [];
	let total = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.length;
		if (total > maximum) {
			await reader.cancel();
			throw Error("body_too_large");
		}
		parts.push(value);
	}
	const bytes = new Uint8Array(total);
	let cursor = 0;
	for (const part of parts) {
		bytes.set(part, cursor);
		cursor += part.length;
	}
	return new TextDecoder().decode(bytes);
}

export function validVerifier(value) {
	try {
		return (
			value?.iterations === 100000 &&
			typeof value.salt === "string" &&
			typeof value.hash === "string" &&
			fromB64(value.salt).length >= 16 &&
			fromB64(value.salt).length <= 64 &&
			fromB64(value.hash).length === 32
		);
	} catch {
		return false;
	}
}

export function validSecondStepRecord(record) {
	return (
		validVerifier(record?.secondVerifier) &&
		Number.isInteger(record.secondPasswordLength) &&
		record.secondPasswordLength >= 1 &&
		record.secondPasswordLength <= 256 &&
		typeof record.secondHint === "string" &&
		record.secondHint.length > 0 &&
		record.secondHint.length <= 256
	);
}
