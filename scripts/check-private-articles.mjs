import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ARTICLES, passwordLengths } from "../worker/private-core.mjs";
import { PUBLIC_SITE_ONLINE } from "../worker/site-state.mjs";

const deployment = JSON.parse(readFileSync(resolve("wrangler.jsonc"), "utf8"));
if (!PUBLIC_SITE_ONLINE && deployment.assets.run_worker_first !== true)
	throw Error("Offline mode must run the Worker before every asset.");
if (
	PUBLIC_SITE_ONLINE &&
	deployment.assets.run_worker_first !== true &&
	!deployment.assets.run_worker_first?.includes("/api/private/*")
)
	throw Error("Private API routes must run through the Worker before assets.");

const directory = resolve("src/content/posts");
for (const name of readdirSync(directory)) {
	if (!/\.mdx?$/.test(name)) continue;
	const source = readFileSync(resolve(directory, name), "utf8").replaceAll(
		"\r\n",
		"\n",
	);
	const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) continue;
	const [, head, body] = match;
	if (/^draft: true$/m.test(head) || !/^password:\s*\S+/m.test(head)) continue;
	const slug = name.replace(/\.mdx?$/, "");
	if (
		!ARTICLES.includes(slug) ||
		!/^serverProtected: true$/m.test(head) ||
		!/^password: server$/m.test(head) ||
		/^sealedContent:/m.test(head) ||
		body.trim() !== "正文由服务器验证后提供。"
	)
		throw Error(
			`Protected article ${slug} must use server-only content; no plaintext or downloadable ciphertext is allowed.`,
		);
	if (
		!new RegExp(`^serverPasswordLength: ${passwordLengths[slug]}$`, "m").test(
			head,
		)
	)
		throw Error(`Wrong public password-length metadata: ${slug}`);
}
console.log("Protected article publishing guard passed.");
