// Owner-only management: the signing key and vault must be outside this repo.

import {
	createHash,
	pbkdf2Sync,
	randomUUID,
	sign,
	timingSafeEqual,
} from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { passwordQuotaGroup } from "./password-quota-group.mjs";

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
const privateKey = readFileSync(resolve(home, "owner-private-key.pem"), "utf8");
const credentials =
	action === "import"
		? JSON.parse(
				readFileSync(resolve(home, "existing-credentials.json"), "utf8"),
			)
		: null;
const selectedSlug = option("--slug");
const secondCredentials =
	action === "import"
		? (() => {
				try {
					return JSON.parse(
						readFileSync(resolve(home, "secondary-credentials.json"), "utf8"),
					);
				} catch {
					return {};
				}
			})()
		: {};
const body = JSON.stringify(
	action === "import"
		? {
				action,
				records: JSON.parse(
					readFileSync(resolve(home, "private-seed.json"), "utf8"),
				)
					.records.filter((item) => !selectedSlug || item.slug === selectedSlug)
					.map((item) => {
						const password = credentials[item.slug];
						const { verifier } = item.record;
						const expected = Buffer.from(verifier.hash, "base64");
						const actual = pbkdf2Sync(
							password,
							Buffer.from(verifier.salt, "base64"),
							verifier.iterations,
							32,
							"sha256",
						);
						if (
							expected.length !== actual.length ||
							!timingSafeEqual(expected, actual)
						)
							throw Error(
								"Private credentials do not match the stored verifier. Import cancelled.",
							);
						if (item.record.secondVerifier) {
							const second = item.record.secondVerifier;
							const value = secondCredentials[item.slug];
							if (typeof value !== "string")
								throw Error(
									"Missing private secondary credential. Import cancelled.",
								);
							const expectedSecond = Buffer.from(second.hash, "base64");
							const actualSecond = pbkdf2Sync(
								value,
								Buffer.from(second.salt, "base64"),
								second.iterations,
								32,
								"sha256",
							);
							if (
								expectedSecond.length !== actualSecond.length ||
								!timingSafeEqual(expectedSecond, actualSecond) ||
								value.length !== item.record.secondPasswordLength
							)
								throw Error(
									"Secondary credentials do not match. Import cancelled.",
								);
						}
						return {
							...item,
							record: {
								...item.record,
								limitGroup: passwordQuotaGroup(privateKey, password),
							},
						};
					}),
			}
		: { action },
);
if (action === "import" && JSON.parse(body).records.length === 0)
	throw Error("No matching private article. Import cancelled.");
const time = String(Date.now());
const nonce = randomUUID();
const url = new URL("/api/private/_admin", base);
const digest = createHash("sha256").update(body).digest("hex");
const message = `POST\n${url.pathname}${url.search}\n${time}\n${nonce}\n${digest}`;
const signature = sign(null, Buffer.from(message), privateKey).toString(
	"base64",
);
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
