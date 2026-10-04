# Rhine Subpath Deployment Implementation Plan

> **For agentic workers:** Execute this deployment inline and use verification-before-completion before publishing. The existing applications are not being redesigned.

**Goal:** Publish the current Genshin and Star Rail applications at `/RhineGenshin/` and `/RhineStarRail/` on `xiaoxiaoboluo.cn`, without main-site entrances.

**Architecture:** Build each existing Vite application with its own absolute base URL. Store only its runtime release under a separate Firefly `public` directory. Astro and the existing Cloudflare Workers Git build publish those directories with the unchanged main site; no iframe, shared layout, extra service, or new domain is needed.

**Tech Stack:** Existing TypeScript/Three.js/Vite applications; Astro 7 static files; Cloudflare Workers static assets.

## Global Constraints

- Paths are exactly `/RhineGenshin/` and `/RhineStarRail/`, without spaces.
- Do not add navigation, article, footer, search, or sitemap entrances.
- Preserve both source repositories, including the Star Rail project's uncommitted customization.
- Do not introduce paid Novecento font files; retain each application's existing fallback artwork and MiSans resources.
- Service workers, manifests, icons, models, downloads and caches stay within their own subpath.
- Retain upstream MIT and third-party notices. Do not publish source repositories, research files, reference videos, or secrets.
- Only this task's files may enter the main-site commit. Future removal consists of removing the selected public directory, its scoped header rules, and matching validation cases.

## Task 1: Verify the deployment contract

- [ ] Add `tests/rhine-sites.test.ts` covering both standalone HTML pages, base-prefixed HTML/CSS URLs, scoped manifests and service workers, complete runtime files, licensing and the absence of main-site entrances.
- [ ] Run `node_modules/.bin/tsx.cmd --test tests/rhine-sites.test.ts`; expect failures because the two releases do not yet exist.

## Task 2: Prepare the two releases

- [ ] In each original project, run its existing content checks and TypeScript checks. Do not commit or reset either source repository.
- [ ] Build with `node node_modules/vite/bin/vite.js build --base /RhineGenshin/ --outDir <fresh temporary directory>` and the equivalent Star Rail base. Preserve source visual and animation code.
- [ ] Normalize only the release manifest's `id`, `scope` and `start_url` to its new base. Mark release HTML `data-pagefind-ignore` and `noindex` so site search does not become an entrance.
- [ ] Include the upstream MIT license; generate the original scoped service worker with the complete release file list and byte-derived cache version.
- [ ] Copy only verified runtime files into `public/RhineGenshin/` and `public/RhineStarRail/`. Add `public/_headers` rules limited to those two paths for HTML/service-worker freshness and noindex.
- [ ] Rerun the deployment contract; all tests must pass.

## Task 3: Verify and publish

- [ ] Run the full main-site tests, Astro check, TypeScript check and production build. Review generated caches separately and preserve unrelated source files.
- [ ] Verify both built pages in Edge: entry, animation, navigation between archives, text, downloads and separate worker scopes. Verify main-site navigation/search remains unchanged.
- [ ] Commit only the two releases, scoped headers, contract tests and deployment documentation with `feat: deploy standalone Rhine archive pages`.
- [ ] Recheck the remote branch before a normal non-force push; publish through the existing Git-connected Cloudflare build.
- [ ] Check Cloudflare's deployment result and the two real HTTPS URLs. Return links only after the published content is verified, or explain a concrete blocker.
