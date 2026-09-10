export type SiteLanguage = "zh-CN" | "en";

export const DEFAULT_LANGUAGE: SiteLanguage = "zh-CN";
export const LANGUAGE_STORAGE_KEY = "firefly-language";
export const LANGUAGE_CHANGE_EVENT = "firefly:language-change";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

export function normalizeLanguage(value: unknown): SiteLanguage {
	return value === "en" ? "en" : DEFAULT_LANGUAGE;
}

export function detectBrowserLanguage(
	languages?: readonly string[] | null,
): SiteLanguage {
	const primaryLanguage = languages?.find(
		(language) => typeof language === "string" && language.trim().length > 0,
	);
	return primaryLanguage && /^zh(?:[-_]|$)/i.test(primaryLanguage.trim())
		? DEFAULT_LANGUAGE
		: "en";
}

export function resolveInitialLanguage(
	storage: ReadableStorage | null | undefined,
	browserLanguages?: readonly string[] | null,
): SiteLanguage {
	try {
		const stored = storage?.getItem(LANGUAGE_STORAGE_KEY);
		if (stored === DEFAULT_LANGUAGE || stored === "en") return stored;
	} catch {
		// Fall through to browser language detection when storage is unavailable.
	}
	return detectBrowserLanguage(browserLanguages);
}

export function readStoredLanguage(
	storage?: ReadableStorage | null,
): SiteLanguage {
	try {
		return normalizeLanguage(storage?.getItem(LANGUAGE_STORAGE_KEY));
	} catch {
		return DEFAULT_LANGUAGE;
	}
}

export function writeStoredLanguage(
	storage: WritableStorage | null | undefined,
	language: SiteLanguage,
): void {
	try {
		storage?.setItem(LANGUAGE_STORAGE_KEY, language);
	} catch {
		// Browsers may block storage in private contexts; the live switch still works.
	}
}
