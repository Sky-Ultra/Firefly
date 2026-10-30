import { DurableObject } from "cloudflare:workers";
import {
	b64url,
	counterState,
	counterSummary,
	finishCounter,
	inheritCounters,
	reserveCounter,
	trafficCounter,
	verifyPassword,
} from "./private-core.mjs";

export class PrivateArticleBackend extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
		this.sql = ctx.storage.sql;
		this.sql.exec(
			"CREATE TABLE IF NOT EXISTS private_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
		);
	}
	read(key) {
		return (
			this.sql
				.exec("SELECT value FROM private_state WHERE key = ?", key)
				.toArray()
				.map((row) => JSON.parse(row.value))[0] ?? null
		);
	}
	write(key, value) {
		this.sql.exec(
			"INSERT INTO private_state(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
			key,
			JSON.stringify(value),
		);
	}
	async fetch(request) {
		const input = await request.json();
		const now = Date.now();
		if (input.op === "traffic")
			return this.ctx.storage.transactionSync(() => {
				const next = trafficCounter(this.read("traffic"), now);
				this.write("traffic", next.state);
				return Response.json(next.result);
			});
		if (input.op === "key") {
			let value = this.read("session-key");
			if (!value) {
				value = b64url(crypto.getRandomValues(new Uint8Array(32)));
				this.write("session-key", value);
			}
			return Response.json({ key: value });
		}
		if (input.op === "nonce") {
			return this.ctx.storage.transactionSync(() => {
				this.sql.exec(
					"DELETE FROM private_state WHERE key LIKE 'nonce:%' AND CAST(value AS INTEGER) < ?",
					now,
				);
				if (this.read(`nonce:${input.nonce}`))
					return Response.json({ ok: false });
				this.write(`nonce:${input.nonce}`, now + 600000);
				return Response.json({ ok: true });
			});
		}
		if (input.op === "import") {
			const record = input.record;
			if (
				!record ||
				typeof record.html !== "string" ||
				record.html.length > 900000 ||
				typeof record.version !== "string" ||
				typeof record.verifier?.hash !== "string" ||
				typeof record.verifier?.salt !== "string" ||
				!/^[a-f0-9]{64}$/.test(record.limitGroup || "") ||
				record.verifier.iterations !== 100000
			)
				return Response.json({ ok: false }, { status: 400 });
			this.write("article", record);
			return Response.json({ ok: true, version: record.version });
		}
		if (input.op === "health") {
			const r = this.read("article");
			return Response.json({
				ready: !!r,
				version: r?.version ?? null,
				contentHash: r?.contentHash ?? null,
				limitGroup: /^[a-f0-9]{64}$/.test(r?.limitGroup || "")
					? r.limitGroup
					: null,
			});
		}
		if (input.op === "verify") {
			const r = this.read("article");
			if (!r) return Response.json({ unavailable: true }, { status: 503 });
			const ok = await verifyPassword(input.password, r.verifier);
			return Response.json({
				ok,
				version: ok ? r.version : undefined,
			});
		}
		if (input.op === "content") {
			const r = this.read("article");
			return r && input.version === r.version
				? Response.json({ html: r.html, version: r.version })
				: Response.json({ error: "unauthorized" }, { status: 401 });
		}
		if (["status", "snapshot", "reserve", "finish"].includes(input.op)) {
			const snapshots = await Promise.all(
				(input.legacyCounters || []).map(async (name) => {
					const stub = this.env.PRIVATE_ARTICLES.get(
						this.env.PRIVATE_ARTICLES.idFromName(name),
					);
					const response = await stub.fetch("https://private.internal/", {
						method: "POST",
						body: JSON.stringify({ op: "snapshot" }),
					});
					if (!response.ok) throw Error("legacy_counter_unavailable");
					return { name, state: await response.json() };
				}),
			);
			return this.ctx.storage.transactionSync(() => {
				const now = Date.now();
				const previous = input.legacyCounters
					? inheritCounters(this.read("counter"), now, snapshots)
					: this.read("counter");
				let next;
				if (input.op === "reserve")
					next = reserveCounter(previous, now, input.id);
				else if (input.op === "finish")
					next = finishCounter(previous, now, input.id, input.outcome);
				else {
					const state = counterState(previous, now);
					next = { state, result: counterSummary(state, now) };
				}
				this.write("counter", next.state);
				if (input.op === "snapshot") return Response.json(next.state);
				return Response.json(next.result);
			});
		}
		return Response.json({ error: "unknown_operation" }, { status: 404 });
	}
}
