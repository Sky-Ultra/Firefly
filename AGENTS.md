# Repository Guidelines

## Current temporary offline state

The owner requested on 2026-10-30 that the site remain offline, and subsequently explicitly authorized reopening after the server-side private-article migration is complete and tested. Passwords must stay unchanged; daily attempts reset at 04:00 Asia/Shanghai. Keep the site offline until private content has been imported and all security checks pass. Keep the maintenance build and Worker guard active during other edits. Do not automatically restore normal publishing, switch deployment versions back, or serve the normal site until that instruction arrives. Read `docs/TEMPORARY-OFFLINE.md` for the preserved online state and restoration steps.

## Project Structure & Module Organization

Firefly is an Astro 7 site with Svelte islands and TypeScript configuration. Main source code lives in `src/`: routes in `src/pages`, layouts in `src/layouts`, reusable UI in `src/components`, styles in `src/styles`, content in `src/content`, helpers in `src/utils`, and Markdown/HTML plugins in `src/plugins`. Site configuration is split across `src/config` with matching type definitions in `src/types`; prefer imports from `@/config` when available. Static files served directly belong in `public`, source-managed images in `src/assets`, docs in `docs` and `Firefly-Docs`, and automation in `scripts`.

## Build, Test, and Development Commands

Use `pnpm`; the `preinstall` script enforces it.

- `pnpm dev` or `pnpm start`: run the local Astro dev server.
- `pnpm check`: run Astro diagnostics.
- `pnpm type-check`: run TypeScript with `--noEmit`.
- `pnpm format`: format `src` with Biome.
- `pnpm lint`: run Biome checks and safe fixes on `src`.
- `pnpm build`: generate icons, LQIPs, the Astro build, font subsets, and Pagefind search output in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: scaffold a new content post.

## Coding Style & Naming Conventions

### Changelog links

When publishing changelog entries, link mentioned articles, site pages, and features with an existing public destination to their actual site URL. This includes the About Me page (`/about/`), Tools (`/tools/`), Places (`/places/`), and Games (`/games/`). Preserve the author's wording and dates, keep the paired English changelog synchronized, and do not invent destinations for features without a public page.

Highlight every “重要更新” label with `<mark class="theme-highlight">重要更新</mark>` and its English “Major update” counterpart with the same class. Highlight only the label, not the following colon or the rest of the entry, and reuse the existing theme-aware highlighter.

### Site-specific visual consistency

New sidebar widgets and card-style components must continue the site's pale outline motif and gentle hover finish. Reuse `SidebarDecoration.astro` and the existing styles; choose a motif relevant to the component, with the blossom fallback for new widgets. Keep card backgrounds opaque in normal wallpaper modes; only on the homepage in fullscreen transparent (overlay) mode, sidebar cards follow the shared --card-bg-transparent value. Preserve the original opaque sidebars and wallpaper behavior on article and other pages in classic mode. The explicit fullscreen-layout="fairytale" opt-in is a separate presentation with its own namespaced background and card-opacity settings; never apply its selectors to classic mode or reset the existing wallpaper preferences. Keep decorations non-interactive and hidden from assistive technology, and retain reduced-motion support. Article cards share this finish via `post-card-decoration.css`. Do not add decoration over reading content or obscure controls.

For emoji or sticker assets newly added or explicitly refreshed anywhere on the site (including Moments), inspect and remove any external matte/background color before publication, regardless of its color. Use real-alpha PNG/WebP (or an animation-preserving transparent format), keeping the original subject colors, white details, linework, aspect ratio and animation frames/timing. Retain the original source for recovery and check edges over light, theme-colored, dark and fairytale glass surfaces. Never simulate removal with CSS blend modes/filters or spread an emoji beyond the positions explicitly requested by the user. Existing transparent assets do not need another cutout.

The homepage banner title stays plain, without stickers or character companions. Do not restore the removed homepage sticker, nine-character row, or characters flanking the homepage title. Preserve the profile card's two character companions and reusable draggable-sticker support unless the user asks to remove them.

Biome is the formatter and linter. It uses tabs for indentation and double quotes for JavaScript/TypeScript strings. Keep Astro and Svelte components in `PascalCase` (`PostCard.astro`, `ArchivePanel.svelte`), config modules in `camelCase` ending with `Config.ts`, and utilities in descriptive kebab case such as `date-utils.ts`. Keep `src/types` aligned with `src/config`. Avoid unrelated formatting churn.

## Testing Guidelines

There is no dedicated unit-test framework configured. Before submitting changes, run `pnpm check`, `pnpm type-check`, and `pnpm build` for rendering, content, or generated asset work. For visual or interactive changes, verify with `pnpm dev` or `pnpm preview` and include screenshots in the PR. Name future tests near the feature they cover, using the local file name as the stem.

## Commit & Pull Request Guidelines

Use Conventional Commits, matching the current history: `feat: ...`, `fix: ...`, and `chore: ...`. Keep commits and PRs focused on one concern. PRs should include a concise summary, linked issues when relevant, validation commands run, and screenshots for UI changes. Discuss major features or design changes in an issue or discussion before implementation.

## Security & Configuration Tips

Do not commit secrets, tokens, or service keys in config files. Keep deployment-specific settings in the target platform environment, and review generated files such as `dist`, `src/constants/lqips.json`, and `src/constants/icons.ts` before committing them.

Embedded standalone pages must namespace document styles to their own root class and keep their document-only CSS and bridge scripts inline. Do not let their root font, palette, background, or element resets enter article route assets.
