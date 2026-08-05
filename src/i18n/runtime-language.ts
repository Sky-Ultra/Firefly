export type SiteLanguage = "zh-CN" | "en";

export const DEFAULT_LANGUAGE: SiteLanguage = "zh-CN";
export const LANGUAGE_STORAGE_KEY = "firefly-language";
export const LANGUAGE_CHANGE_EVENT = "firefly:language-change";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

export function normalizeLanguage(value: unknown): SiteLanguage {
	return value === "en" ? "en" : DEFAULT_LANGUAGE;
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
