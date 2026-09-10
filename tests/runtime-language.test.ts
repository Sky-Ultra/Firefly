import assert from "node:assert/strict";
import test from "node:test";
import {
	getLocalizedValue,
	isLocalizedString,
	localized,
} from "../src/i18n/localized-content";
import {
	DEFAULT_LANGUAGE,
	detectBrowserLanguage,
	LANGUAGE_STORAGE_KEY,
	normalizeLanguage,
	readStoredLanguage,
	resolveInitialLanguage,
	writeStoredLanguage,
} from "../src/i18n/runtime-language";

test("defaults to Chinese and accepts only supported stored values", () => {
	assert.equal(DEFAULT_LANGUAGE, "zh-CN");
	assert.equal(normalizeLanguage("en"), "en");
	assert.equal(normalizeLanguage("zh-CN"), "zh-CN");
	assert.equal(normalizeLanguage("invalid"), "zh-CN");
	assert.equal(readStoredLanguage({ getItem: () => "en" }), "en");
});

test("detects Chinese only from the browser's primary language", () => {
	assert.equal(detectBrowserLanguage(["zh-CN"]), "zh-CN");
	assert.equal(detectBrowserLanguage(["zh-TW", "en-US"]), "zh-CN");
	assert.equal(detectBrowserLanguage(["ZH_hans"]), "zh-CN");
	assert.equal(detectBrowserLanguage(["en-AU", "zh-CN"]), "en");
	assert.equal(detectBrowserLanguage(["ja-JP"]), "en");
	assert.equal(detectBrowserLanguage([]), "en");
});

test("uses a saved choice before browser language detection", () => {
	assert.equal(
		resolveInitialLanguage({ getItem: () => "zh-CN" }, ["en-AU"]),
		"zh-CN",
	);
	assert.equal(
		resolveInitialLanguage({ getItem: () => "en" }, ["zh-CN"]),
		"en",
	);
	assert.equal(
		resolveInitialLanguage({ getItem: () => null }, ["en-AU"]),
		"en",
	);
	assert.equal(
		resolveInitialLanguage(
			{
				getItem: () => {
					throw new Error("blocked");
				},
			},
			["zh-HK"],
		),
		"zh-CN",
	);
});

test("storage failures do not prevent language switching", () => {
	assert.equal(
		readStoredLanguage({
			getItem: () => {
				throw new Error("blocked");
			},
		}),
		"zh-CN",
	);

	let storedKey = "";
	let storedValue = "";
	writeStoredLanguage(
		{
			setItem: (key, value) => {
				storedKey = key;
				storedValue = value;
			},
		},
		"en",
	);
	assert.equal(storedKey, LANGUAGE_STORAGE_KEY);
	assert.equal(storedValue, "en");
});

test("selects curated localized content", () => {
	const value = localized("查看详情", "View details");
	assert.equal(getLocalizedValue(value, "zh-CN"), "查看详情");
	assert.equal(getLocalizedValue(value, "en"), "View details");
	assert.equal(isLocalizedString(value), true);
	assert.equal(isLocalizedString("查看详情"), false);
});
