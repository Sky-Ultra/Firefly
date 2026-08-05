# Runtime Chinese–English Language Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Add a persistent, instant Chinese–English interface switch, curated English versions of public personal content, and a complete English version of \`personal-website-introduction\` while keeping all other posts, Daily Quote, and home-banner sentences Chinese.

**Architecture:** A framework-neutral runtime controller owns the saved language and updates only declaratively marked DOM text and attributes. Astro content/configuration uses strict bilingual values, while a separate post-translation collection renders the one translated post without creating another post route or card. A Svelte navbar control toggles the shared runtime and Firefly page transitions reapply the current language.

**Tech Stack:** Astro 7, Svelte 5, TypeScript 6, Node test runner through \`tsx\`, Biome, Firefly/Swup page transitions.

## Global Constraints

- Default language is Simplified Chinese (\`zh-CN\`); English is \`en\`.
- Persist language under \`firefly-language\` and switch without page reload.
- Desktop control appears immediately before the palette button; mobile control appears inside the right-side tools panel.
- Do not call translation APIs or load translations from the network.
- Never translate Daily Quote content or home-banner carousel sentences.
- Ordinary post titles, descriptions, tags, categories, and bodies stay Chinese.
- \`personal-website-introduction\` is the sole translated post; its route, card count, images, cover, date, pinned state, tags, and category do not change.
- Hidden Friends/RSS/Sponsor entrances stay hidden.
- New translated personal content must provide both Chinese and English at authoring time.

---

### Task 1: Runtime language state

**Files:**
- Create: \`src/i18n/runtime-language.ts\`
- Create: \`tests/runtime-language.test.ts\`
- Modify: \`package.json\`

**Interfaces:**
- Produces: \`SiteLanguage\`, \`DEFAULT_LANGUAGE\`, \`LANGUAGE_STORAGE_KEY\`, \`normalizeLanguage(value)\`, \`readStoredLanguage(storage)\`, and \`writeStoredLanguage(storage, language)\`.
- Consumers: Tasks 2–7.

- [ ] **Step 1: Write a failing state test**

\`\`\`ts
import assert from "node:assert/strict";
import test from "node:test";
import {
	DEFAULT_LANGUAGE,
	normalizeLanguage,
	readStoredLanguage,
} from "../src/i18n/runtime-language";

test("defaults to Chinese and accepts only supported stored values", () => {
	assert.equal(DEFAULT_LANGUAGE, "zh-CN");
	assert.equal(normalizeLanguage("en"), "en");
	assert.equal(normalizeLanguage("invalid"), "zh-CN");
	assert.equal(readStoredLanguage({ getItem: () => "en" }), "en");
});
\`\`\`

- [ ] **Step 2: Run the test and verify RED**

Run: \`pnpm exec tsx --test tests/runtime-language.test.ts\`

Expected: FAIL because \`src/i18n/runtime-language.ts\` does not exist.

- [ ] **Step 3: Implement the pure state functions**

\`\`\`ts
export type SiteLanguage = "zh-CN" | "en";
export const DEFAULT_LANGUAGE: SiteLanguage = "zh-CN";
export const LANGUAGE_STORAGE_KEY = "firefly-language";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

export function normalizeLanguage(value: unknown): SiteLanguage {
	return value === "en" ? "en" : DEFAULT_LANGUAGE;
}

export function readStoredLanguage(storage?: ReadableStorage | null): SiteLanguage {
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
		// Switching remains available when persistence is blocked.
	}
}
\`\`\`

- [ ] **Step 4: Add the test script and verify GREEN**

Add to \`package.json\`:

\`\`\`json
"test:i18n": "tsx --test tests/*.test.ts"
\`\`\`

Run: \`pnpm test:i18n\`

Expected: all runtime state tests pass.

- [ ] **Step 5: Commit**

\`\`\`powershell
git add package.json src/i18n/runtime-language.ts tests/runtime-language.test.ts
git commit -m "feat: add runtime language state"
\`\`\`

### Task 2: Declarative DOM translation controller

**Files:**
- Create: \`src/i18n/localized-content.ts\`
- Create: \`src/components/common/LocalizedText.astro\`
- Create: \`src/components/features/LanguageManager.astro\`
- Modify: \`src/i18n/runtime-language.ts\`
- Modify: \`tests/runtime-language.test.ts\`
- Modify: \`src/layouts/Layout.astro\`

**Interfaces:**
- Produces: \`LocalizedString\`, \`localized(zh, en)\`, \`getLocalizedValue(value, language)\`, global \`window.fireflyLanguage\`, and event \`firefly:language-change\` with \`{ language }\`.
- DOM contract: \`data-i18n-zh\`, \`data-i18n-en\`, optional \`data-i18n-attr="title|aria-label|placeholder|content"\`.

- [ ] **Step 1: Add a failing localized-value test**

\`\`\`ts
import { getLocalizedValue, localized } from "../src/i18n/localized-content";

test("selects curated localized content", () => {
	const value = localized("查看详情", "View details");
	assert.equal(getLocalizedValue(value, "zh-CN"), "查看详情");
	assert.equal(getLocalizedValue(value, "en"), "View details");
});
\`\`\`

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: FAIL because localized-content is missing.

- [ ] **Step 3: Implement the typed value helper**

\`\`\`ts
import type { SiteLanguage } from "./runtime-language";

export type LocalizedString = Readonly<{ zh: string; en: string }>;
export const localized = (zh: string, en: string): LocalizedString => ({ zh, en });
export const getLocalizedValue = (
	value: LocalizedString,
	language: SiteLanguage,
): string => (language === "en" ? value.en : value.zh);
\`\`\`

\`LocalizedText.astro\` renders a configurable inline or block element with Chinese fallback and both values in data attributes. It accepts an attribute mode for \`title\`, \`aria-label\`, and \`placeholder\`.

- [ ] **Step 4: Implement \`LanguageManager.astro\`**

The manager must read the preference before paint, set \`<html lang>\`, update only explicit markers, update marked attributes, dispatch one language-change event, expose \`get/set/toggle/apply\`, reapply after Firefly page replacement, and prevent duplicate listeners.

- [ ] **Step 5: Mount the manager in \`Layout.astro\` and verify GREEN**

Run: \`pnpm test:i18n\`

Expected: runtime and localized-content tests pass.

- [ ] **Step 6: Commit**

\`\`\`powershell
git add src/i18n src/components/common/LocalizedText.astro src/components/features/LanguageManager.astro src/layouts/Layout.astro tests
git commit -m "feat: add declarative language manager"
\`\`\`

### Task 3: Navbar language control

**Files:**
- Create: \`src/components/controls/LanguageSwitch.svelte\`
- Modify: \`src/components/layout/Navbar.astro\`
- Modify: \`src/i18n/i18nKey.ts\`
- Modify: \`src/i18n/languages/zh_CN.ts\`
- Modify: \`src/i18n/languages/en.ts\`
- Create: \`tests/language-build-contract.test.ts\`

**Interfaces:**
- Consumes: \`window.fireflyLanguage\` and \`firefly:language-change\`.
- Produces: desktop control \`#language-switch\` and mobile control \`#mobile-language-switch\`.

- [ ] **Step 1: Add a failing source-contract test**

Read \`Navbar.astro\` and assert that the desktop language switch precedes \`display-settings-switch\`, the mobile tools panel contains \`mobile-language-switch\`, primary mobile navigation remains present, and no Friends/RSS/Sponsor entrance is introduced.

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: FAIL because the language switch IDs are absent.

- [ ] **Step 3: Implement the Svelte switch**

Initialize from the global manager, toggle on click, react to language-change events, display a translation icon plus \`中\` or \`EN\`, and expose “Switch to English” or “切换至中文” through \`title\` and \`aria-label\`.

- [ ] **Step 4: Mount both controls and verify GREEN**

Desktop is before the palette control. Mobile is in \`mobile-tools-panel\` and closes the panel after switching. Preserve existing control height and alignment.

Run: \`pnpm test:i18n\`

- [ ] **Step 5: Commit**

\`\`\`powershell
git add src/components/controls/LanguageSwitch.svelte src/components/layout/Navbar.astro src/i18n tests/language-build-contract.test.ts
git commit -m "feat: add navbar language switch"
\`\`\`

### Task 4: Shared interface localization

**Files:**
- Modify: \`src/config/navBarConfig.ts\`
- Modify: \`src/components/layout/DropdownMenu.astro\`
- Modify: \`src/components/layout/CategoryBar.astro\`
- Modify: \`src/components/layout/Footer.astro\`
- Modify: \`src/components/layout/PostMeta.astro\`
- Modify: \`src/components/layout/PostStats.astro\`
- Modify: \`src/components/controls/Search.svelte\`
- Modify: \`src/components/controls/DisplaySettingsIntegrated.svelte\`
- Modify: \`src/components/widget/SiteStats.astro\`
- Modify: \`src/components/widget/SiteInfo.astro\`
- Modify: \`src/components/widget/Weather.astro\`
- Modify: \`src/components/widget/Calendar.astro\`
- Modify: \`src/pages/404.astro\`
- Modify: \`src/pages/archive.astro\`
- Modify: \`src/pages/categories/index.astro\`
- Modify: \`src/pages/tags/index.astro\`
- Modify: \`src/i18n/i18nKey.ts\`
- Modify: \`src/i18n/languages/zh_CN.ts\`
- Modify: \`src/i18n/languages/en.ts\`
- Create: \`tests/interface-translation-coverage.test.ts\`

**Interfaces:**
- Common UI uses dictionary keys plus explicit runtime markers.
- Post-derived title, description, tags, and category remain unmarked unless Task 7 supplies a translation.

- [ ] **Step 1: Add a failing coverage test**

Check the listed public UI files for visible hard-coded Chinese strings, allowing comments and explicit excluded content only.

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: FAIL with untranslated UI locations.

- [ ] **Step 3: Convert common interface strings**

Provide natural English dictionary entries and explicit markers for text, labels, tooltips, and placeholders. Localize count templates without translating post-originated data or re-enabling hidden pages.

- [ ] **Step 4: Verify GREEN and commit**

\`\`\`powershell
pnpm test:i18n
git add src/config/navBarConfig.ts src/components src/pages src/i18n tests/interface-translation-coverage.test.ts
git commit -m "feat: localize shared site interface"
\`\`\`

### Task 5: Personal content and feature-page translations

**Files:**
- Modify: \`src/types/personalPagesConfig.ts\`
- Modify: \`src/types/gameConfig.ts\`
- Modify: \`src/types/galleryConfig.ts\`
- Modify: \`src/types/relationshipConfig.ts\`
- Modify: \`src/config/personalPagesConfig.ts\`
- Modify: \`src/config/gameConfig.ts\`
- Modify: \`src/config/galleryConfig.ts\`
- Modify: \`src/config/relationshipConfig.ts\`
- Modify: \`src/pages/about.astro\`
- Modify: \`src/pages/devices.astro\`
- Modify: \`src/pages/games.astro\`
- Modify: \`src/pages/gallery/index.astro\`
- Modify: \`src/pages/gallery/[album].astro\`
- Modify: \`src/pages/moments.astro\`
- Modify: \`src/pages/diary.astro\`
- Modify: \`src/pages/guestbook.astro\`
- Modify: \`src/components/pages/games/GameCard.astro\`
- Modify: \`src/components/pages/games/GameSection.astro\`
- Modify: \`src/components/pages/gallery/AlbumCard.astro\`
- Modify: \`src/components/widget/RelationshipTimer.astro\`
- Create: \`tests/personal-content-coverage.test.ts\`

**Interfaces:**
- Translatable configuration fields use \`LocalizedString\`.
- IDs, dates, URLs, scores, images, and layout flags remain stable and untranslated.

- [ ] **Step 1: Add a failing typed-content test**

Import the personal, game, gallery, and relationship configurations and recursively assert non-empty \`zh\` and \`en\` values for every declared localized field. Assert Daily Quote and banner configuration are not converted.

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: FAIL because the personal fields are plain strings.

- [ ] **Step 3: Convert configuration types and values**

Use curated English, including:

- \`我的设备\` → \`My Devices\`;
- \`不分昼夜，无论远近\` → \`Near or far, day or night.\`;
- \`游戏\` → \`Games\`;
- \`二游\` → \`Gacha Games\`;
- \`其他游戏\` → \`Other Games\`;
- \`相册\` → \`Gallery\`;
- \`恋爱计时\` → \`Together Since\`;
- frozen duration units → \`years\`, \`months\`, \`hours\`, \`minutes\`, \`seconds\`.

Use official English game/product names where available and keep prices and identifiers unchanged.

- [ ] **Step 4: Render localized values**

Filters use stable IDs rather than translated labels. Gallery search indexes both language variants. About, Devices, Games, Gallery, Moments, Diary, Guestbook, and Relationship Timer switch without reload.

- [ ] **Step 5: Verify GREEN and commit**

\`\`\`powershell
pnpm test:i18n
git add src/types src/config src/pages src/components tests/personal-content-coverage.test.ts
git commit -m "feat: translate personal site content"
\`\`\`

### Task 6: Dynamic feature pages and explicit exclusions

**Files:**
- Modify: \`src/pages/anime.astro\`
- Modify: \`src/pages/bangumi.astro\`
- Modify: \`src/pages/music.astro\`
- Modify: \`src/components/pages/anime/AnimeCard.svelte\`
- Modify: \`src/components/pages/anime/AnimeDetailModal.svelte\`
- Modify: \`src/components/pages/anime/AnimeGrid.svelte\`
- Modify: \`src/components/pages/bangumi/BangumiGrid.svelte\`
- Modify: \`src/components/features/MusicPlayer.astro\`
- Modify: \`src/components/features/WelcomeToast.astro\`
- Modify: \`src/components/widget/DailyQuote.astro\`
- Modify: \`src/components/features/TypewriterText.astro\`
- Create: \`tests/exclusion-contract.test.ts\`

**Interfaces:**
- Dynamic components respond to \`firefly:language-change\`.
- Daily Quote and TypewriterText content remain unmarked Chinese content.

- [ ] **Step 1: Add failing exclusion and dynamic-component contracts**

Assert Daily Quote quotation nodes and banner sentence nodes contain no localization markers. Assert interactive feature components provide English interface labels and listen for the shared language event.

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: dynamic component contracts fail.

- [ ] **Step 3: Localize dynamic interface state**

Translate filters, statuses, empty/error messages, tooltips, and playback controls without translating API titles, lyrics, Daily Quote content, or banner sentences.

- [ ] **Step 4: Verify GREEN and commit**

\`\`\`powershell
pnpm test:i18n
git add src/pages src/components tests/exclusion-contract.test.ts
git commit -m "feat: localize interactive feature pages"
\`\`\`

### Task 7: Selected post translation

**Files:**
- Modify: \`src/content.config.ts\`
- Create: \`src/content/post-translations/personal-website-introduction.en.md\`
- Modify: \`src/pages/[...page].astro\`
- Modify: \`src/components/layout/PostCard.astro\`
- Modify: \`src/pages/posts/[...slug].astro\`
- Create: \`src/utils/post-translation-utils.ts\`
- Create: \`tests/post-translation.test.ts\`

**Interfaces:**
- Translation schema: \`{ sourcePostId: string; locale: "en"; title: string; description: string }\` plus Markdown body.
- Produces: \`getPostTranslation(sourcePostId, locale)\` and \`getPostTranslationMap(locale)\`.

- [ ] **Step 1: Add a failing translation lookup test**

Assert the English file is outside \`src/content/posts\`, uses source ID \`personal-website-introduction\`, has title \`An Introduction to My Personal Website\`, cannot add a second post route/card, and leaves ordinary posts untranslated.

- [ ] **Step 2: Run \`pnpm test:i18n\` and verify RED**

Expected: FAIL because the translation collection does not exist.

- [ ] **Step 3: Add the collection and curated English Markdown**

Translate the original meaning naturally, retain both local image references with English alternative text, and preserve GitHub, Cloudflare, Cloudflare Workers, WeChat, Instagram, WhatsApp, GPT Codex, and xiaoxiaoboluo.cn names.

- [ ] **Step 4: Connect card and post rendering**

The selected card exposes bilingual title/description. The post route renders Chinese and English body containers with only the active version visible and accessible. Document title/description follow language; tags/category stay Chinese.

- [ ] **Step 5: Verify route uniqueness, GREEN, and commit**

\`\`\`powershell
pnpm test:i18n
git add src/content.config.ts src/content/post-translations src/pages src/components/layout/PostCard.astro src/utils/post-translation-utils.ts tests/post-translation.test.ts
git commit -m "feat: translate personal website introduction"
\`\`\`

### Task 8: Full verification and visual QA

**Files:**
- Modify only files required by verification findings.

- [ ] **Step 1: Run automated and static checks**

\`\`\`powershell
pnpm test:i18n
pnpm exec biome check src tests
pnpm type-check
pnpm check
pnpm build
\`\`\`

Expected: all commands exit 0. Existing network-only font/Bilibili warnings may be recorded if sandbox policy blocks those requests; no source diagnostic or build error is acceptable.

- [ ] **Step 2: Inspect generated output**

Assert in \`dist\`:

- desktop and mobile language controls exist exactly once each;
- \`/posts/personal-website-introduction/\` exists exactly once;
- the selected post has both body variants;
- ordinary posts have no English-body marker;
- Daily Quote and banner sentences have no translation marker;
- Friends, RSS, and Sponsor entrances remain absent.

- [ ] **Step 3: Run browser QA**

At desktop and mobile widths verify immediate switching, persistence, page navigation, long English wrapping, keyboard focus, About, Devices, Games, Gallery, Relationship Timer, the translated post, one ordinary post, Daily Quote, and banner sentences.

- [ ] **Step 4: Re-run all checks after visual fixes**

Run all commands from Step 1 again and require the same result.

- [ ] **Step 5: Commit final fixes if any**

\`\`\`powershell
git add src tests package.json
git commit -m "fix: polish bilingual site experience"
\`\`\`

