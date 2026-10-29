import { maintenanceResponse } from "../scripts/maintenance-page.mjs";
import { BOOTSTRAP_PUBLIC_KEY } from "./bootstrap-public-key.mjs";
import {
	ARTICLES,
	cookie,
	DEVICE_COOKIE,
	DEVICE_MS,
	fromB64,
	json,
	readBody,
	readCookies,
	SESSION_MS,
	sessionCookie,
	sha256,
	signToken,
	verifyToken,
} from "./private-core.mjs";
import { PUBLIC_SITE_ONLINE } from "./site-state.mjs";

async function rpc(env, name, input) {
	if (!env.PRIVATE_ARTICLES) throw Error("backend_unavailable");
	const stub = env.PRIVATE_ARTICLES.get(env.PRIVATE_ARTICLES.idFromName(name));
	const result = await stub.fetch("https://private.internal/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	const data = await result.json();
	if (!result.ok) throw Error(data.error || "backend_unavailable");
	return data;
}
function combined(states) {
	return {
		remaining: Math.min(...states.map((s) => s.remaining)),
		locked: states.some((s) => s.locked),
		resetAt: Math.max(...states.map((s) => s.resetAt)),
		timezone: "Asia/Shanghai",
	};
}
async function admin(request, env, publicKey) {
	if (request.method !== "POST")
		return json({ error: "method_not_allowed" }, 405);
	try {
		const raw = await readBody(request, 1000000);
		const time = request.headers.get("X-Firefly-Time");
		const nonce = request.headers.get("X-Firefly-Nonce");
		const signature = request.headers.get("X-Firefly-Signature");
		if (
			!time ||
			!nonce ||
			!signature ||
			!/^\d{13}$/.test(time) ||
			Math.abs(Date.now() - Number(time)) > 300000 ||
			!/^[-a-f0-9]{36}$/.test(nonce)
		)
			return json({ error: "forbidden" }, 403);
		const url = new URL(request.url);
		const message = `POST\n${url.pathname}${url.search}\n${time}\n${nonce}\n${await sha256(raw)}`;
		const key = await crypto.subtle.importKey(
			"spki",
			fromB64(publicKey),
			{ name: "Ed25519" },
			false,
			["verify"],
		);
		if (
			!(await crypto.subtle.verify(
				"Ed25519",
				key,
				fromB64(signature),
				new TextEncoder().encode(message),
			))
		)
			return json({ error: "forbidden" }, 403);
		if (!(await rpc(env, "authority", { op: "nonce", nonce })).ok)
			return json({ error: "replayed_request" }, 409);
		const input = JSON.parse(raw);
		if (input.action === "import") {
			if (!Array.isArray(input.records) || input.records.length > 3)
				return json({ error: "invalid_import" }, 400);
			const results = [];
			for (const item of input.records) {
				if (!ARTICLES.includes(item.slug))
					return json({ error: "unknown_article" }, 400);
				results.push({
					slug: item.slug,
					...(await rpc(env, `content:${item.slug}`, {
						op: "import",
						record: item.record,
					})),
				});
			}
			return json({ ok: true, results });
		}
		if (input.action === "health")
			return json({
				ok: true,
				articles: await Promise.all(
					ARTICLES.map(async (slug) => ({
						slug,
						...(await rpc(env, `content:${slug}`, { op: "health" })),
					})),
				),
			});
		return json({ error: "unknown_action" }, 400);
	} catch {
		return json({ error: "admin_unavailable" }, 503);
	}
}

export async function privateRequest(
	request,
	env,
	{ online = PUBLIC_SITE_ONLINE, adminPublicKey = BOOTSTRAP_PUBLIC_KEY } = {},
) {
	const url = new URL(request.url);
	if (
		url.pathname.startsWith("/api/private/") &&
		url.protocol !== "https:" &&
		!["localhost", "127.0.0.1"].includes(url.hostname)
	)
		return json({ error: "https_required" }, 400);
	if (
		url.pathname.startsWith("/api/private/") &&
		url.protocol !== "https:" &&
		!["localhost", "127.0.0.1"].includes(url.hostname)
	)
		return json({ error: "https_required" }, 400);
	if (url.pathname === "/api/private/_admin")
		return admin(request, env, adminPublicKey);
	if (!online) return maintenanceResponse(request);
	if (!url.pathname.startsWith("/api/private/"))
		return env.ASSETS.fetch(request);
	const match = url.pathname.match(
		/^\/api\/private\/([a-z0-9-]+)\/(status|unlock|content)$/,
	);
	if (!match || !ARTICLES.includes(match[1]))
		return json({ error: "not_found" }, 404);
	const [_, article, action] = match;
	if (
		(action === "unlock" && request.method !== "POST") ||
		(action !== "unlock" && request.method !== "GET")
	)
		return json({ error: "method_not_allowed" }, 405);
	if (
		(request.headers.get("Origin") &&
			request.headers.get("Origin") !== url.origin) ||
		request.headers.get("Sec-Fetch-Site") === "cross-site"
	)
		return json({ error: "forbidden" }, 403);
	const ip = request.headers.get("CF-Connecting-IP");
	if (!ip || !/^[0-9a-fA-F:.]{3,80}$/.test(ip))
		return json({ error: "backend_unavailable" }, 503);
	const cookies = [];
	const now = Date.now();
	try {
		const health = await rpc(env, `content:${article}`, { op: "health" });
		if (!health.ready) return json({ error: "backend_unavailable" }, 503);
		const secret = (await rpc(env, "authority", { op: "key" })).key;
		const incoming = readCookies(request);
		let device = await verifyToken(
			incoming[DEVICE_COOKIE],
			secret,
			"device",
			now,
		);
		if (!device) {
			device = {
				type: "device",
				device: crypto.randomUUID(),
				exp: now + DEVICE_MS,
			};
			cookies.push(
				cookie(
					DEVICE_COOKIE,
					await signToken(device, secret),
					Math.floor(DEVICE_MS / 1000),
				),
			);
		}
		const names = [
			`ip:${article}:${await sha256(ip)}`,
			`device:${article}:${await sha256(device.device)}`,
		];
		const summaries = async () =>
			combined(
				await Promise.all(
					names.map((name) => rpc(env, name, { op: "status" })),
				),
			);
		if (action === "status")
			return json({ ok: true, ...(await summaries()) }, 200, cookies);
		if (action === "content") {
			const session = await verifyToken(
				incoming[sessionCookie(article)],
				secret,
				"session",
				now,
			);
			if (
				!session ||
				session.article !== article ||
				session.device !== device.device ||
				session.version !== health.version
			)
				return json({ error: "unauthorized" }, 401, cookies);
			return json(
				await rpc(env, `content:${article}`, {
					op: "content",
					version: session.version,
				}),
				200,
				cookies,
			);
		}
		if (
			!(request.headers.get("Content-Type") || "").startsWith(
				"application/json",
			)
		)
			return json({ error: "invalid_request" }, 400, cookies);
		let input;
		try {
			input = JSON.parse(await readBody(request));
		} catch {
			return json({ error: "invalid_request" }, 400, cookies);
		}
		if (
			typeof input.password !== "string" ||
			input.password.length < 1 ||
			input.password.length > 256
		)
			return json({ error: "invalid_request" }, 400, cookies);
		const id = crypto.randomUUID();
		const reserved = [];
		try {
			for (const name of names) {
				const permit = await rpc(env, name, { op: "reserve", id });
				if (!permit.ok) {
					await Promise.all(
						reserved.map((key) =>
							rpc(env, key, { op: "finish", id, outcome: "error" }),
						),
					);
					return json(
						{ error: "limited", reason: permit.reason, ...(await summaries()) },
						429,
						cookies,
					);
				}
				reserved.push(name);
			}
		} catch (failure) {
			await Promise.allSettled(
				reserved.map((key) =>
					rpc(env, key, { op: "finish", id, outcome: "error" }),
				),
			);
			throw failure;
		}

		let outcome = "error";
		let verified;
		try {
			verified = await rpc(env, `content:${article}`, {
				op: "verify",
				password: input.password,
			});
			outcome = verified.ok ? "correct" : "incorrect";
		} finally {
			await Promise.all(
				reserved.map((key) => rpc(env, key, { op: "finish", id, outcome })),
			);
		}
		const state = await summaries();
		if (!verified.ok)
			return json({ error: "incorrect", ...state }, 401, cookies);
		const session = {
			type: "session",
			device: device.device,
			article,
			version: verified.version,
			exp: now + SESSION_MS,
		};
		cookies.push(
			cookie(
				sessionCookie(article),
				await signToken(session, secret),
				Math.floor(SESSION_MS / 1000),
			),
		);
		return json(
			{
				ok: true,
				...state,
				...(await rpc(env, `content:${article}`, {
					op: "content",
					version: verified.version,
				})),
			},
			200,
			cookies,
		);
	} catch {
		return json({ error: "backend_unavailable" }, 503, cookies);
	}
}
