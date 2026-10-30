import assert from "node:assert/strict";
import {
	createHash,
	generateKeyPairSync,
	pbkdf2Sync,
	randomBytes,
	randomUUID,
	sign,
} from "node:crypto";
import test from "node:test";
import { passwordQuotaGroup } from "../scripts/password-quota-group.mjs";
import { privateRequest } from "../worker/gateway.mjs";
import {
	b64url,
	counterState,
	counterSummary,
	finishCounter,
	inheritCounters,
	periodAt,
	reserveCounter,
	trafficCounter,
	verifyPassword,
} from "../worker/private-core.mjs";

const TEST_PASSWORD = "test-only-long-password!";
const OTHER_PASSWORD = "different-test-only-password!";
function fixture() {
	const states = new Map<
		string,
		{
			key?: string;
			article?: typeof record;
			counter?: ReturnType<typeof counterState>;
			nonces?: Set<string>;
			traffic?: ReturnType<typeof trafficCounter>["state"];
		}
	>();
	const salt = randomBytes(24);
	const record = {
		limitGroup: "a".repeat(64),
		version: "test-v1",
		html: "<div data-reading-body><p>Private fixture <mark>highlight</mark></p></div>",
		verifier: {
			salt: salt.toString("base64"),
			iterations: 100000,
			hash: pbkdf2Sync(TEST_PASSWORD, salt, 100000, 32, "sha256").toString(
				"base64",
			),
		},
	};
	for (const slug of ["liking", "love-tree-guide", "long-night-love-letter"])
		states.set(`content:${slug}`, { article: record });
	states.set("content:long-night-love-letter", {
		article: {
			...record,
			limitGroup: "b".repeat(64),
			verifier: {
				...record.verifier,
				hash: pbkdf2Sync(OTHER_PASSWORD, salt, 100000, 32, "sha256").toString(
					"base64",
				),
			},
		},
	});
	let verifications = 0;
	const env = {
		ASSETS: { fetch: async () => new Response("public") },
		PRIVATE_ARTICLES: {
			idFromName: (name: string) => name,
			get: (name: string) => ({
				fetch: async (_url: string, init: RequestInit) => {
					const input = JSON.parse(String(init.body));
					const state = states.get(name) || {};
					states.set(name, state);
					const now = Date.now();
					if (input.op === "traffic") {
						const next = trafficCounter(state.traffic, now);
						state.traffic = next.state;
						return Response.json(next.result);
					}
					if (input.op === "key") {
						state.key ||= b64url(randomBytes(32));
						return Response.json({ key: state.key });
					}
					if (input.op === "health")
						return Response.json({
							ready: !!state.article,
							version: state.article?.version,
							limitGroup: state.article?.limitGroup,
						});
					if (input.op === "verify") {
						verifications++;
						const ok = await verifyPassword(
							input.password,
							state.article.verifier,
						);
						return Response.json({
							ok,
							version: ok ? state.article.version : undefined,
						});
					}
					if (input.op === "content")
						return input.version === state.article.version
							? Response.json({ html: state.article.html })
							: Response.json({ error: "unauthorized" }, { status: 401 });
					if (input.op === "nonce") {
						state.nonces ||= new Set();
						if (state.nonces.has(input.nonce))
							return Response.json({ ok: false });
						state.nonces.add(input.nonce);
						return Response.json({ ok: true });
					}
					if (input.op === "import") {
						state.article = input.record;
						return Response.json({ ok: true });
					}
					if (input.op === "snapshot") {
						state.counter = counterState(state.counter, now);
						return Response.json(state.counter);
					}
					if (input.legacyCounters)
						state.counter = inheritCounters(
							state.counter,
							now,
							input.legacyCounters.map((legacy: string) => ({
								name: legacy,
								state: states.get(legacy)?.counter,
							})),
						);
					let result:
						| ReturnType<typeof reserveCounter>
						| ReturnType<typeof finishCounter>;
					if (input.op === "reserve") {
						result = reserveCounter(state.counter, now, input.id);
						state.counter = result.state;
						return Response.json(result.result);
					}
					if (input.op === "finish") {
						result = finishCounter(state.counter, now, input.id, input.outcome);
						state.counter = result.state;
						return Response.json(result.result);
					}
					state.counter = counterState(state.counter, now);
					return Response.json(counterSummary(state.counter, now));
				},
			}),
		},
	};
	const request = (
		action: string,
		{
			password,
			cookie = "",
			ip = "203.0.113.1",
			article = "liking",
			origin = "https://example.test",
		}: {
			password?: string;
			cookie?: string;
			ip?: string;
			article?: string;
			origin?: string;
		} = {},
	) =>
		new Request(`https://example.test/api/private/${article}/${action}`, {
			method: password === undefined ? "GET" : "POST",
			headers: {
				"CF-Connecting-IP": ip,
				Origin: origin,
				Cookie: cookie,
				...(password === undefined
					? {}
					: { "Content-Type": "application/json" }),
			},
			body: password === undefined ? undefined : JSON.stringify({ password }),
		});
	return {
		env,
		request,
		states,
		record,
		getVerifications: () => verifications,
	};
}
function jar(response: Response, existing = "") {
	const values = new Map(
		existing
			.split(/;\s*/)
			.filter(Boolean)
			.map((p) => {
				const i = p.indexOf("=");
				return [p.slice(0, i), p.slice(i + 1)];
			}),
	);
	for (const item of response.headers.getSetCookie()) {
		const pair = item.split(";")[0];
		const i = pair.indexOf("=");
		values.set(pair.slice(0, i), pair.slice(i + 1));
	}
	return [...values].map(([key, value]) => `${key}=${value}`).join("; ");
}

test("Beijing 04:00 boundary uses server time and expired reservations fail closed", () => {
	const before = Date.parse("2026-10-29T19:59:59Z");
	const after = Date.parse("2026-10-29T20:00:00Z");
	assert.equal(periodAt(before).resetAt, after);
	assert.equal(periodAt(after).resetAt, after + 86400000);
	let state: ReturnType<typeof counterState> | undefined;
	for (let i = 0; i < 5; i++) {
		const next = reserveCounter(state, before, `r${i}`);
		state = next.state;
		assert.equal(next.result.ok, true);
	}
	assert.equal(reserveCounter(state, before, "overflow").result.ok, false);
	assert.equal(
		counterState(state, before + 60001).failures,
		0,
		"new day resets old reservations",
	);
	const start = Date.parse("2026-10-30T03:00:00Z");
	state = undefined;
	for (let i = 0; i < 5; i++)
		state = reserveCounter(state, start, `r${i}`).state;
	assert.equal(counterState(state, start + 60001).failures, 5);
});
test("equal private passwords derive the same stable opaque quota group", () => {
	const key = generateKeyPairSync("ed25519").privateKey.export({
		type: "pkcs8",
		format: "pem",
	});
	const same = passwordQuotaGroup(key, TEST_PASSWORD);
	assert.match(same, /^[a-f0-9]{64}$/);
	assert.equal(passwordQuotaGroup(key, TEST_PASSWORD), same);
	assert.notEqual(passwordQuotaGroup(key, OTHER_PASSWORD), same);
	assert.notEqual(
		same,
		createHash("sha256").update(TEST_PASSWORD).digest("hex"),
	);
});
test("same-password articles share five failures while a different password stays independent", async () => {
	const f = fixture();
	const cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	for (let i = 0; i < 5; i++) {
		const response = await privateRequest(
			f.request("unlock", {
				cookie,
				password: "wrong",
				article: i % 2 ? "love-tree-guide" : "liking",
			}),
			f.env,
			{ online: true },
		);
		assert.equal(response.status, 401);
		assert.equal((await response.json()).remaining, 4 - i);
	}
	for (const article of ["liking", "love-tree-guide"]) {
		const response = await privateRequest(
			f.request("unlock", { cookie: "", password: TEST_PASSWORD, article }),
			f.env,
			{ online: true },
		);
		assert.equal(response.status, 429);
	}
	const other = await privateRequest(
		f.request("unlock", {
			cookie,
			password: OTHER_PASSWORD,
			article: "long-night-love-letter",
		}),
		f.env,
		{ online: true },
	);
	assert.equal(other.status, 200);
	assert.equal((await other.json()).remaining, 5);
});
test("concurrent guesses distributed across matching articles still get at most five verifications", async () => {
	const f = fixture();
	const cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	const responses = await Promise.all(
		Array.from({ length: 30 }, (_, i) =>
			privateRequest(
				f.request("unlock", {
					cookie,
					password: "wrong",
					article: i % 2 ? "love-tree-guide" : "liking",
				}),
				f.env,
				{ online: true },
			),
		),
	);
	assert.equal(f.getVerifications(), 5);
	assert.equal(responses.filter((r) => r.status === 401).length, 5);
	assert.equal(responses.filter((r) => r.status === 429).length, 25);
});
test("pre-existing article failures and pending work carry into the shared quota exactly once", () => {
	const now = Date.parse("2026-10-30T04:00:00Z");
	const a = counterState(undefined, now);
	a.failures = 2;
	const b = reserveCounter(undefined, now, "old-request").state;
	b.failures = 1;
	const snapshots = [
		{ name: "a", state: a },
		{ name: "b", state: b },
	];
	let state = inheritCounters(undefined, now, snapshots);
	assert.equal(state.failures, 3);
	assert.equal(Object.keys(state.pending).length, 1);
	state = inheritCounters(state, now, snapshots);
	assert.equal(state.failures, 3);
	state = reserveCounter(state, now, "new-request").state;
	assert.equal(reserveCounter(state, now, "overflow").result.ok, false);
	state = finishCounter(state, now, "new-request", "incorrect").state;
	state = inheritCounters(state, now + 60001, snapshots);
	assert.equal(state.failures, 5);
	state = inheritCounters(state, now + 60002, snapshots);
	assert.equal(state.failures, 5);
	assert.equal(
		inheritCounters(state, periodAt(now).resetAt, snapshots).failures,
		0,
	);
});
test("legacy per-article server counts are summed before accepting a grouped verification", async () => {
	const f = fixture();
	const ipHash = createHash("sha256").update("203.0.113.1").digest("hex");
	const first = counterState(undefined, Date.now());
	first.failures = 3;
	const second = counterState(undefined, Date.now());
	second.failures = 1;
	f.states.set(`ip:liking:${ipHash}`, { counter: first });
	f.states.set(`ip:love-tree-guide:${ipHash}`, { counter: second });
	const status = await privateRequest(f.request("status"), f.env, {
		online: true,
	});
	assert.equal((await status.json()).remaining, 1);
	const last = await privateRequest(
		f.request("unlock", { password: "wrong", article: "love-tree-guide" }),
		f.env,
		{ online: true },
	);
	assert.equal((await last.json()).remaining, 0);
	assert.equal(
		(
			await privateRequest(
				f.request("unlock", { password: TEST_PASSWORD }),
				f.env,
				{ online: true },
			)
		).status,
		429,
	);
	assert.equal(f.getVerifications(), 1);
});
test("five wrong passwords lock the IP even after deleting all cookies", async () => {
	const f = fixture();
	const cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	for (let i = 1; i <= 5; i++) {
		const r = await privateRequest(
			f.request("unlock", { password: "incorrect", cookie }),
			f.env,
			{ online: true },
		);
		const data = await r.json();
		assert.equal(r.status, 401);
		assert.equal(data.remaining, 5 - i);
		assert.equal(data.locked, i === 5);
	}
	const sixth = await privateRequest(
		f.request("unlock", { password: TEST_PASSWORD, cookie: "" }),
		f.env,
		{ online: true },
	);
	assert.equal(sixth.status, 429);
	assert.equal(f.getVerifications(), 5);
});
test("a signed device identifier retains its lock when its IP changes", async () => {
	const f = fixture();
	const cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	for (let i = 0; i < 5; i++)
		await privateRequest(
			f.request("unlock", {
				password: "wrong",
				cookie,
				ip: `203.0.113.${i + 1}`,
			}),
			f.env,
			{ online: true },
		);
	assert.equal(
		(
			await privateRequest(
				f.request("unlock", {
					password: TEST_PASSWORD,
					cookie,
					ip: "198.51.100.90",
				}),
				f.env,
				{ online: true },
			)
		).status,
		429,
	);
});
test("parallel requests cannot get more than five password verifications", async () => {
	const f = fixture();
	const cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	await Promise.all(
		Array.from({ length: 30 }, () =>
			privateRequest(
				f.request("unlock", { password: "wrong", cookie }),
				f.env,
				{ online: true },
			),
		),
	);
	assert.ok(f.getVerifications() <= 5);
	assert.equal(
		(
			await privateRequest(f.request("status", { cookie }), f.env, {
				online: true,
			})
		).status,
		200,
	);
	const state = await (
		await privateRequest(f.request("status", { cookie }), f.env, {
			online: true,
		})
	).json();
	assert.equal(state.locked, true);
});
test("only a valid article-scoped HttpOnly session can retrieve content", async () => {
	const f = fixture();
	assert.equal(
		(await privateRequest(f.request("content"), f.env, { online: true }))
			.status,
		401,
	);
	let cookie = jar(
		await privateRequest(f.request("status"), f.env, { online: true }),
	);
	const login = await privateRequest(
		f.request("unlock", { password: TEST_PASSWORD, cookie }),
		f.env,
		{ online: true },
	);
	assert.equal(login.status, 200);
	assert.match(login.headers.getSetCookie().join(";"), /HttpOnly/);
	cookie = jar(login, cookie);
	const content = await privateRequest(
		f.request("content", { cookie }),
		f.env,
		{ online: true },
	);
	assert.equal((await content.json()).html, f.record.html);
	assert.equal(
		(
			await privateRequest(
				f.request("content", { cookie, article: "love-tree-guide" }),
				f.env,
				{ online: true },
			)
		).status,
		401,
	);
	assert.equal(
		(
			await privateRequest(
				f.request("content", { cookie: cookie.replace("eyJ", "ayJ") }),
				f.env,
				{ online: true },
			)
		).status,
		401,
	);
	assert.equal(
		(
			await privateRequest(
				f.request("status", { origin: "https://bad.test" }),
				f.env,
				{ online: true },
			)
		).status,
		403,
	);
});
test("missing storage fails closed and the release gate retains maintenance", async () => {
	const f = fixture();
	assert.equal(
		(
			await privateRequest(new Request("https://example.test/"), f.env, {
				online: false,
			})
		).status,
		503,
	);
	assert.equal(
		(
			await privateRequest(
				f.request("unlock", { password: TEST_PASSWORD }),
				{ ASSETS: f.env.ASSETS },
				{ online: true },
			)
		).status,
		503,
	);
	assert.equal(
		(
			await privateRequest(new Request("https://example.test/"), f.env, {
				online: true,
			})
		).status,
		200,
	);
});
test("owner import requires a valid signature, bounded timestamp and unique nonce", async () => {
	const f = fixture();
	const pair = generateKeyPairSync("ed25519");
	const publicKey = pair.publicKey
		.export({ type: "spki", format: "der" })
		.toString("base64");
	const body = JSON.stringify({ action: "health" });
	const time = String(Date.now());
	const nonce = randomUUID();
	const path = "/api/private/_admin";
	const message = `POST\n${path}\n${time}\n${nonce}\n${createHash("sha256").update(body).digest("hex")}`;
	const headers = {
		"X-Firefly-Time": time,
		"X-Firefly-Nonce": nonce,
		"X-Firefly-Signature": sign(
			null,
			Buffer.from(message),
			pair.privateKey,
		).toString("base64"),
	};
	const make = () =>
		new Request(`https://example.test${path}`, {
			method: "POST",
			headers,
			body,
		});
	assert.equal(
		(
			await privateRequest(make(), f.env, {
				online: false,
				adminPublicKey: publicKey,
			})
		).status,
		200,
	);
	assert.equal(
		(
			await privateRequest(make(), f.env, {
				online: false,
				adminPublicKey: publicKey,
			})
		).status,
		409,
	);
	assert.equal(
		(
			await privateRequest(
				new Request(`https://example.test${path}`, { method: "POST", body }),
				f.env,
				{ online: false, adminPublicKey: publicKey },
			)
		).status,
		403,
	);
});

test("API traffic is bounded independently of the five incorrect-password quota", () => {
	let state: ReturnType<typeof trafficCounter>["state"] | undefined;
	for (let i = 0; i < 60; i++) {
		const next = trafficCounter(state, 100000);
		state = next.state;
		assert.equal(next.result.ok, true);
	}
	assert.equal(trafficCounter(state, 100001).result.ok, false);
	assert.equal(trafficCounter(state, 160001).result.ok, true);
});
