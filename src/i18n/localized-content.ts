import type I18nKey from "./i18nKey";
import type { SiteLanguage } from "./runtime-language";
import { getTranslation } from "./translation";

export type LocalizedString = Readonly<{
	zh: string;
	en: string;
}>;

export function localized(zh: string, en: string): LocalizedString {
	return { zh, en };
}

export function isLocalizedString(value: unknown): value is LocalizedString {
	if (!value || typeof value !== "object") return false;
	const candidate = value as Partial<LocalizedString>;
	return typeof candidate.zh === "string" && typeof candidate.en === "string";
}

export function getLocalizedValue(
	value: LocalizedString,
	language: SiteLanguage,
): string {
	return language === "en" ? value.en : value.zh;
}

export function localizedI18n(key: I18nKey): LocalizedString {
	return localized(getTranslation("zh_CN")[key], getTranslation("en")[key]);
}
