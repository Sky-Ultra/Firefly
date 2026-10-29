// Owner-only management: the signing key and vault must be outside this repo.

import { createHash, randomUUID, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const option = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};
const home = option("--home") || process.env.FIREFLY_PRIVATE_HOME;
const base = new URL(option("--base") || "https://xiaoxiaoboluo.cn");
if (!home)
	throw Error(
		"Supply --home pointing to the external private vault directory.",
	);
if (
	base.protocol !== "https:" &&
	!["localhost", "127.0.0.1"].includes(base.hostname)
)
	throw Error("Private imports require HTTPS.");
const action = option("--action") || "health";
if (!["health", "import"].includes(action))
	throw Error("Unknown owner action.");
const body = JSON.stringify(
	action === "import"
		? {
				action,
				records: JSON.parse(
					readFileSync(resolve(home, "private-seed.json"), "utf8"),
				).records,
			}
		: { action },
);
const time = String(Date.now());
const nonce = randomUUID();
const url = new URL("/api/private/_admin", base);
const digest = createHash("sha256").update(body).digest("hex");
const message = `POST\n${url.pathname}${url.search}\n${time}\n${nonce}\n${digest}`;
const signature = sign(
	null,
	Buffer.from(message),
	readFileSync(resolve(home, "owner-private-key.pem"), "utf8"),
).toString("base64");
const response = await fetch(url, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"X-Firefly-Time": time,
		"X-Firefly-Nonce": nonce,
		"X-Firefly-Signature": signature,
	},
	body,
});
let result;
try {
	result = await response.json();
} catch {
	throw Error(`Owner endpoint unavailable (${response.status}).`);
}
if (!response.ok)
	throw Error(
		`Owner request failed (${response.status}): ${result.error || "unknown"}`,
	);
console.log(JSON.stringify(result));
