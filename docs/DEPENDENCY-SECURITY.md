# Dependency security maintenance

Use Node >=22.12 and exactly pnpm 9.14.4, matching `packageManager`, GitHub Actions and Cloudflare. Run `pnpm install --frozen-lockfile` before validating. Other pnpm majors can interpret package overrides differently; a successful install with a different manager is not evidence that the deployed graph is protected.

## 2026-10-30 audit

The tested update retains Astro 7, Svelte 5, the existing site design, private-article backend and external comment service. It updates Astro, Sharp, Markdown rendering, HTML sanitization, Satori and KaTeX, and pins compatible transitive security fixes with pnpm overrides. KaTeX is pinned to 0.18.2 to avoid the deprecated 0.18.11 release with breaking changes.

`@swup/plugin@3.0.1` ships its executable browser/plugin code prebuilt. Its unused microbundle development CLI is removed from the installed dependency graph; the site never runs that CLI. Swup navigation and its compiled runtime remain installed and are regression checked.

Two upstream packages have no published patched version at the audit date. Their local patches are applied by pnpm and recorded with hashes in the frozen lockfile:

- `extract-zip@2.0.1`: reject symbolic-link entries before opening or creating links. Icon ZIP imports need ordinary files/directories only. This disables symlink ZIP extraction for all users of this dependency. It addresses the archive-symlink vectors in [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3). No site endpoint accepts ZIP uploads for extraction.
- `deepmerge@4.3.1`: filter `__proto__`, `constructor` and `prototype` keys while enumerating both inputs, including null-prototype dictionaries. Source, CommonJS and UMD distributions are patched. This addresses the returned-object prototype poisoning in [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4).

`tests/dependency-security.test.ts` verifies actual merge/extraction behavior. Ordinary object/array merges and SVG ZIP extraction must keep working. These tests failed against the unpatched packages and pass with the patches. GitHub Actions runs these with the other regression tests on Node 22 and 24.

Version-only audit tools still report the three advisory records above because patching does not change upstream version numbers. Do not dismiss these as upstream-fixed or claim a zero-warning audit. Revisit and replace the patches when official fixed releases exist. Existing peer-range warnings for the inherited Starlight/Expressive Code integrations also remain; builds and route/rendering checks determine compatibility for this specific site.

Before publishing dependency changes run `pnpm check`, `pnpm type-check`, `pnpm test:i18n`, `pnpm build` and `pnpm audit --prod`. Inspect runtime navigation, rendered maths, search, music and both share modes. Verify that private HTML support-script URLs still exist in the new build. Never copy private article HTML, verifiers, credentials or signing keys into the public build or repository for testing.
