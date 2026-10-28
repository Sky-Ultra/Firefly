import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
	encryptContent,
	getPasswordLength,
	resolveContentPassword,
	sealContent,
} from "../src/utils/crypto-utils";

async function decrypt(payload: string, password: string): Promise<string> {
	const raw = Buffer.from(payload, "base64");
	const material = await webcrypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveKey"],
	);
	const key = await webcrypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: raw.subarray(0, 16),
			iterations: 100000,
			hash: "SHA-256",
		},
		material,
		{ name: "AES-GCM", length: 256 },
		false,
		["decrypt"],
	);
	const result = await webcrypto.subtle.decrypt(
		{ name: "AES-GCM", iv: raw.subarray(16, 28) },
		key,
		Buffer.concat([raw.subarray(44), raw.subarray(28, 44)]),
	);
	return new TextDecoder().decode(result);
}

test("build password references preserve leading zeroes and retain literal-password support", () => {
	assert.equal(
		resolveContentPassword("env:TEST_PASSWORD", { TEST_PASSWORD: "0123" }),
		"0123",
	);
	assert.equal(resolveContentPassword("literal-demo", {}), "literal-demo");
});

test("password lengths use actual keys, including leading zeroes and Unicode characters", () => {
	assert.equal(
		getPasswordLength(
			resolveContentPassword("env:TEST_KEY", { TEST_KEY: "0123" }),
		),
		4,
	);
	assert.equal(getPasswordLength("01234567"), 8);
	assert.equal(getPasswordLength("a❤😀"), 3);
});

test("source-sealed content carries only ciphertext and actual length with fresh nonces", async () => {
	const html =
		'<div data-reading-body><p>Private test body <mark class="theme-highlight">highlight</mark></p></div>';
	const first = sealContent(html, "01234567");
	const second = sealContent(html, "01234567");
	assert.deepEqual(Object.keys(first).sort(), ["passwordLength", "payload"]);
	assert.equal(first.passwordLength, 8);
	assert.notEqual(first.payload, second.payload);
	assert.equal(await decrypt(first.payload, "01234567"), html);
	await assert.rejects(decrypt(first.payload, "wrong"));
	assert.throws(() => sealContent(html, ""));
});

test("missing or malformed password references fail closed without exposing values", () => {
	for (const environment of [
		{},
		{ TEST_PASSWORD: "" },
		{ TEST_PASSWORD: "  " },
	]) {
		assert.throws(
			() => resolveContentPassword("env:TEST_PASSWORD", environment),
			/Missing encrypted-content build variable/,
		);
	}
	assert.throws(
		() => resolveContentPassword("env:bad variable", {}),
		/Invalid encrypted-content password variable name/,
	);
});

test("browser-compatible decryption retains bilingual markup and rejects the wrong password", async () => {
	const body =
		'<div data-language-only="zh-CN"><p>测试正文 <mark>高光</mark></p></div><div data-language-only="en" hidden><p>Test body</p></div>';
	const payload = encryptContent(body, "0123", "test-post");
	assert.ok(!payload.includes("测试正文"));
	assert.equal(await decrypt(payload, "0123"), body);
	await assert.rejects(decrypt(payload, "wrong-password"));
});

test("the requested two posts share a build-secret reference and the exact two-line hint", () => {
	for (const slug of ["liking", "love-tree-guide"]) {
		const source = readFileSync(
			new URL(`../src/content/posts/${slug}.md`, import.meta.url),
			"utf8",
		).replaceAll("\r\n", "\n");
		assert.match(source, /^password: env:PRIVATE_POST_PASSWORD$/m);
		assert.match(source, /^passwordHint: \|-\n {2}⌈她⌋的诞日\n {2}例:0427$/m);
	}
});
