import { createHash, createHmac, createPrivateKey } from "node:crypto";

/** Owner-only stable grouping. Never publish the key, password or group ID. */
export function passwordQuotaGroup(privateKeyPem, password) {
	if (typeof password !== "string" || !password.length)
		throw Error("Missing private article credential.");
	const key = createHash("sha256")
		.update("firefly:password-quota-key:v1\0")
		.update(
			createPrivateKey(privateKeyPem).export({ type: "pkcs8", format: "der" }),
		)
		.digest();
	return createHmac("sha256", key)
		.update("firefly:password-quota:v1\0")
		.update(password)
		.digest("hex");
}
