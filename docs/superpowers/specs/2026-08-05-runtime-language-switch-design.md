# Runtime Chinese–English Language Switch Design

## Purpose

Add an immediate Chinese–English language switch to Firefly without duplicating routes or relying on machine translation. Chinese remains the default. The visitor's choice persists across page navigation and later visits.

The site interface and non-post personal content receive curated English translations. Ordinary blog posts remain Chinese. The post `personal-website-introduction` is the sole initial exception and receives a complete English version, including its card title, description, page title, body, image alternative text, and document metadata.

## Confirmed Requirements

- Desktop: place the language button immediately before the palette button in the navbar utility area.
- Mobile: place the language button inside the existing right-side tools panel so the primary navbar does not become narrower.
- A click changes the current page immediately; it must not require a reload.
- Store the selected language in `localStorage` and reuse it after internal navigation and on later visits.
- Default to Simplified Chinese when there is no saved preference.
- Synchronize the root document language between `zh-CN` and `en`.
- Do not call third-party translation services.
- Never translate Daily Quote content or the rotating sentences in the home-page banner.
- Do not translate ordinary post titles, descriptions, tags, categories, or bodies.
- Translate the complete `personal-website-introduction` post while keeping its existing URL, cover, images, pinned state, publication date, tags, and category.
- Future interface and translated personal content must provide both Chinese and English at authoring time.

## Approaches Considered

### Declarative bilingual data with a runtime controller — selected

Each translatable value is identified explicitly. Common interface strings use keyed dictionaries; personal content uses typed Chinese/English values. A small browser-side controller applies the selected language to marked elements and notifies interactive components.

This approach is deterministic, works without network access, prevents accidental post translation, and makes missing English content detectable during development.

### Separate `/en/` routes — rejected

Separate locale routes would provide clear language-specific URLs, but would duplicate route generation and require page navigation or reloads when switching. That conflicts with the confirmed immediate-switch interaction.

### Automatic DOM text replacement — rejected

Replacing matching text nodes after rendering would be quick but brittle. It could translate article text accidentally, mishandle repeated phrases with different meanings, and make future maintenance difficult.

## Architecture

### 1. Shared runtime language state

Create a browser-safe language module with these concepts:

- Supported values: `zh-CN` and `en`.
- Storage key: `firefly-language`.
- Default: `zh-CN`.
- Public operations: read the current language, set a language, toggle language, translate a dictionary key, and subscribe to changes.
- Change notification: dispatch a single document-level event after updating state.

The initial language is applied from an inline head script before visible page content paints. This avoids a Chinese flash for visitors who previously selected English. The same initialization updates `<html lang>`.

Firefly's page-transition lifecycle must reapply the saved language to newly inserted content without resetting the visitor's choice or adding duplicate event listeners.

### 2. Translation sources

Use two complementary sources:

1. Existing `src/i18n/i18nKey.ts` and `src/i18n/languages/*.ts` dictionaries for reusable interface terms such as Home, Search, Categories, View details, and accessibility labels.
2. A typed `LocalizedString` model for authored personal content:

```ts
export type LocalizedString = {
	zh: string;
	en: string;
};
```

Translated configuration fields must use `LocalizedString`, even when the official name is identical in both languages. IDs, URLs, image paths, dates, scores, prices stored as numbers, and other non-language values remain plain values.

This strict model intentionally makes an omitted English value a type error. Helper functions expose the Chinese server-rendered value and the two values required by the runtime marker.

### 3. Declarative rendering

Astro UI receives a small localized-text component or equivalent helper that renders Chinese as the server fallback and includes the English value in data attributes. The runtime controller changes only explicitly marked content.

The same mechanism supports:

- text content;
- `title` and `aria-label` attributes;
- input placeholders;
- document titles and descriptions;
- dynamic labels containing counts or values.

Interactive Svelte components subscribe to the shared language state where their rendered strings depend on local component state. Static Astro markup uses declarative markers. A mutation observer may reapply translations only to marked nodes added after initial rendering; it must never scan or translate arbitrary text.

### 4. Language switch control

Create a dedicated language-switch control rather than embedding translation logic in `Navbar.astro`.

Desktop behavior:

- Place the control before the display-settings palette button.
- Use a compact translation/language icon visually consistent with the existing music, palette, and theme controls.
- Expose the target action through localized `title` and `aria-label` text, for example “Switch to English” while Chinese is active and “切换至中文” while English is active.
- Show a restrained `中` or `EN` state indicator without changing navbar height.

Mobile behavior:

- Add the control to the existing tools panel beside Search, Music, and Theme.
- Keep the existing primary mobile navbar items unchanged.
- Close the tools panel after the language is changed.

Keyboard activation, visible focus behavior, and screen-reader labels are required on both layouts.

## Translation Scope

### Shared interface

Translate visible navigation and UI surrounding content:

- desktop and mobile navigation;
- dropdown menus and mobile tools;
- search controls and result-state messages;
- display, wallpaper, layout, light/dark, and effect settings;
- category bar, pagination, archives, categories, tags, and search pages;
- sidebars, widget headings, site statistics, site information, weather labels, calendar labels, and footer;
- copy, share, table-of-contents, metadata, related-post, encryption, and article-page controls;
- welcome, loading, empty-state, unavailable, error, and accessibility messages;
- 404 page.

Hidden or disabled features such as Friends, RSS, and Sponsor do not need new visible entrances, but reusable common strings may remain in the dictionary.

### Personal and feature pages

Translate authored content and interface text on:

- About Me and all skill-group descriptions;
- Devices, including category names, specifications, descriptions, prices, filter labels, and detail actions;
- Games, including page copy, category copy, official English titles where applicable, statuses, and tags;
- Gallery list and album detail pages, including album name, description, location, tags, photo counts, filters, and empty states;
- Relationship Timer, including heading, names where translation is meaningful, avatar alternative text, and duration units;
- Bangumi, Anime, Music, Moments, Diary, and Guestbook page interface text and authored records;
- the footer and standalone personal-page headers.

The translation should read naturally rather than mirror Chinese word order. Brand names, product model names, game titles, and established English terminology use official forms where available.

### Explicit exclusions

The following remain Chinese in both language modes:

- Daily Quote quotation and attribution;
- all home-page banner carousel sentences;
- all ordinary post titles, descriptions, tags, categories, and Markdown/MDX bodies;
- user-authored lyrics and external API content unless that source already supplies English.

Interface labels surrounding excluded content still translate.

## Translated Post Exception

### Storage

Add a dedicated content collection for post translations outside `src/content/posts`. A translation entry contains:

- the source post ID;
- locale (`en` for the initial implementation);
- translated title;
- translated description;
- translated Markdown body.

The English file for `personal-website-introduction` lives in this collection. Because it is not part of the `posts` collection, it cannot create a second post card, route, archive item, RSS entry, or site-statistics record.

### Rendering

At build time, the post card and post route look up a translation by source post ID. For this post only:

- the card exposes both titles and descriptions to the runtime controller;
- the post route renders Chinese and English bodies into separate language containers;
- only the active body is visible and accessible;
- the document title and description follow the active language;
- both versions reuse the existing random cover assignment and the same two article-local images;
- English image alternative text is authored in the English Markdown file.

The route remains `/posts/personal-website-introduction/`. Tags and category remain the existing Chinese values, matching the general rule that post taxonomy is not translated yet.

If a post has no matching translation entry, it renders the existing Chinese title, description, and body in both modes without warnings visible to visitors.

## Data Flow

1. The inline initializer reads `firefly-language` before paint and sets the root language attribute.
2. Astro serves Chinese fallback text plus declarative translation metadata.
3. The runtime controller applies the chosen language to marked text and attributes.
4. The language button calls the controller's toggle operation.
5. The controller updates storage, `<html lang>`, marked DOM, document metadata, and subscribers.
6. Svelte islands update language-dependent dynamic strings.
7. After a Firefly page transition, the controller applies the current language to the new page content.
8. Excluded content has no translation marker, so the controller cannot alter it.

## Fallback and Error Behavior

- Invalid or unavailable stored values fall back to `zh-CN` and are replaced with the valid default.
- A missing common English dictionary entry falls back to the Chinese value during development and is reported by validation; it must not render an empty string.
- A missing personal-content English value is a type-check failure.
- A missing post translation keeps the original Chinese post visible.
- Storage access failures, including privacy-mode restrictions, must not prevent the current page from switching; persistence alone may be unavailable.
- Repeated page transitions must not register duplicate click handlers, observers, or language-change listeners.

## Authoring Rules for Future Changes

- New reusable UI terms require entries in the key enum and both Simplified Chinese and English dictionaries.
- New About, Device, Game, Gallery, Relationship, Moment, or Diary text uses `LocalizedString` fields.
- Daily Quote and home-banner sentences remain plain Chinese strings and must not be wrapped with localization markers.
- New ordinary posts require no English content.
- A post receives an English version only by adding a translation-collection entry with the matching source post ID.
- Translation text must be reviewed for natural English; external automatic translation is not used at runtime.

## Verification Strategy

### Automated behavior tests

Add focused tests for:

- default language resolution;
- valid saved-language restoration;
- invalid saved-language fallback;
- language toggle and persistence;
- dictionary lookup and Chinese fallback;
- declarative text and attribute updates;
- document-language updates;
- missing translated-post fallback;
- `personal-website-introduction` translation lookup without an extra post entry.

Tests must be written and observed failing before implementation, then made to pass with minimal production changes.

### Static and build verification

Run:

- Biome checks for every changed source file;
- `pnpm type-check`;
- `pnpm check`;
- `pnpm build`.

Inspect generated HTML to confirm:

- the language control appears once in the desktop navbar and once in the mobile tools panel;
- ordinary posts contain no English body or automatic translation marker;
- the selected post has one route and one card, with both language variants available;
- Daily Quote and banner sentences have no localization markers;
- hidden Friends, RSS, and Sponsor entrances remain hidden.

### Browser verification

Verify desktop and mobile layouts in Chinese and English:

- switch without reload;
- persistence after navigation and a fresh visit;
- no flash of Chinese for a saved English preference;
- correct wrapping for longer English labels;
- keyboard and screen-reader labels;
- About, Devices, Games, Gallery, Relationship Timer, and the selected post;
- ordinary posts, Daily Quote, and banner sentences staying Chinese;
- page transitions and dynamic components updating once without stale text.

