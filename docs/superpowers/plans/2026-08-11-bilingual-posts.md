# Bilingual Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 `src/content/posts` 中现有的 17 篇文章都能通过现有右上角语言按钮在同一 URL 内即时切换为高质量英文，并通过构建期校验保证今后的中英文稿始终成对且同步。

**Architecture:** 中文稿继续作为 Astro `posts` 内容集合的唯一文章来源；英文稿按相同相对路径放在 `src/content/translations`，由集中式加载器在构建期配对。文章页同时编译中英文正文，用现有 `data-language-only` 和 `LanguageManager` 切换；卡片、日历、推荐、目录和阅读统计读取双语元数据。一个独立校验器用中文源文件的 SHA-256 指纹检查缺稿、孤儿稿、空稿和过期翻译，并接入 `check` 与 `build`。

**Tech Stack:** Astro 7、Markdown/MDX、TypeScript、Node.js `node:test`、现有 `LanguageManager`、Pagefind、Biome、pnpm。

## Global Constraints

- 不创建 `/en/` 路由，不改变文章 URL、评论线程、永久链接、封面或正文图片。
- 每日一言和主页欢迎语保持中文，不纳入文章翻译切换。
- 只翻译读者可见文字；代码、命令、变量名、文件路径、URL、数学公式及 Mermaid/PlantUML 语法保持原样。
- 17 篇文章全部配对，包括 7 篇 `draft: true` 文章；不得改变现有草稿、置顶、加密或评论状态。
- 加密文章的中英文正文必须一起位于现有加密边界内，不能在生成 HTML 中泄露英文明文。
- 英文须自然、简洁并忠于原文。借用 `humanizer-zh` 的通用检查原则：删除填充句和宣传腔，避免机械三段式、重复连接词、滥用破折号及逐字硬译；不使用该技能改写中文原稿。
- 每个任务先写失败测试，再写最小实现，并在通过后单独提交 Conventional Commit。
- 不运行全仓库自动格式化；只格式化本任务涉及的源文件，避免无关改动。

## File Map

| Area | Files | Responsibility |
|---|---|---|
| Pairing validation | `scripts/lib/post-translation-validator.ts`, `scripts/check-post-translations.ts`, `tests/post-translation-validator.test.ts` | 路径映射、Frontmatter 读取、SHA-256、缺失/孤儿/空白/过期检测 |
| Content contract | `src/content.config.ts`, `scripts/new-post.js`, `package.json`, `tests/post-translation-build-contract.test.ts` | 强制双语元数据、新文章骨架、检查/构建门禁 |
| Translation loading | `src/utils/post-translations.ts`, `tests/post-translation-loader.test.ts` | `import.meta.glob` 集中加载，规范化普通、MDX 与目录型文章 ID |
| Article rendering | `src/pages/posts/[...slug].astro`, `src/layouts/MainGridLayout.astro`, `src/components/layout/SideBar.astro`, `src/components/widget/SidebarTOC.astro`, `src/components/controls/FloatingControls.astro`, `src/components/controls/FloatingTOC.astro`, `src/components/layout/PostMeta.astro`, `tests/post-translation-rendering.test.ts` | 正文、标题、元数据、目录、字数/时长即时切换，并保护加密文章 |
| Listings and discovery | `src/components/layout/PostCard.astro`, `src/components/layout/PostPage.astro`, `src/utils/content-utils.ts`, `src/pages/api/allPostMeta.json.ts`, `src/components/misc/RecommendedPost.astro`, `src/components/widget/Calendar.astro`, `src/pages/og/[...slug].ts`, `tests/post-translation-listings.test.ts` | 首页/归档卡片、上一/下一篇、推荐、日历、搜索相关可见标题切换；OG 保持中文默认 |
| English content | `src/content/translations/**/*.en.md`, `src/content/translations/**/*.en.mdx`, `src/content/posts/**/*.md`, `src/content/posts/**/*.mdx` | 17 篇英文稿、中文元数据的英文对照字段、同步指纹、80%→60% 修正 |
| QA | `tests/post-translation-content.test.ts` | 文章配对、结构、保留项与反 AI 文风的可自动检查部分 |

---

## Task 1: Build the translation-pair validator

**Files:**

- Create: `scripts/lib/post-translation-validator.ts`
- Create: `scripts/check-post-translations.ts`
- Create: `tests/post-translation-validator.test.ts`

- [ ] **Step 1: Write failing path-mapping and hash tests**

Test these exact mappings and invariants:

```ts
assert.equal(getTranslationRelativePath("code-examples.md"), "code-examples.en.md");
assert.equal(getTranslationRelativePath("mdx-example.mdx"), "mdx-example.en.mdx");
assert.equal(getTranslationRelativePath("guide/index.md"), "guide/index.en.md");
assert.match(computeSourceHash("hello"), /^sha256:[a-f0-9]{64}$/);
```

Run:

```powershell
pnpm exec tsx --test tests/post-translation-validator.test.ts
```

Expected: FAIL because the validator module does not exist.

- [ ] **Step 2: Implement deterministic path mapping and hashing**

Export these functions from `scripts/lib/post-translation-validator.ts`:

```ts
export function getTranslationRelativePath(sourceRelativePath: string): string;
export function computeSourceHash(source: string): string;
```

Normalize separators to `/`, preserve nested directories, support only `.md` and `.mdx`, and return hashes in `sha256:<hex>` form.

- [ ] **Step 3: Write failing validation-case tests**

Use temporary post/translation directories to assert one issue per case:

- missing translation;
- orphan translation;
- wrong `translationOf`;
- stale `sourceHash`;
- missing `sourceHash`;
- blank body;
- placeholder-only body such as `TODO` or `Translate this article`;
- correct `.md`, `.mdx`, and nested `index.md` pairs.

Expected issue records must expose a stable `code`, `sourcePath`, `translationPath`, and human-readable `message`.

- [ ] **Step 4: Implement the directory validator and CLI**

Export:

```ts
export type TranslationIssueCode =
	| "missing-translation"
	| "orphan-translation"
	| "invalid-translation-of"
	| "missing-source-hash"
	| "stale-source-hash"
	| "empty-translation";

export function validatePostTranslations(options: {
	postsDir: string;
	translationsDir: string;
}): TranslationIssue[];
```

The CLI must validate `src/content/posts` against `src/content/translations`, print every issue with both paths, print a success count when clean, and exit non-zero on any issue.

- [ ] **Step 5: Run the focused tests**

```powershell
pnpm exec tsx --test tests/post-translation-validator.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add scripts/lib/post-translation-validator.ts scripts/check-post-translations.ts tests/post-translation-validator.test.ts
git commit -m "test: add post translation validator"
```

---

## Task 2: Enforce bilingual metadata and future-post scaffolding

**Files:**

- Modify: `src/content.config.ts`
- Modify: `scripts/new-post.js`
- Modify: `package.json`
- Create: `tests/post-translation-build-contract.test.ts`

- [ ] **Step 1: Write failing source-contract tests**

Assert that:

- `titleEn`, `descriptionEn`, `tagsEn`, and `categoryEn` are required in the post schema;
- `new-post.js` writes all eight Chinese/English metadata fields;
- `new-post.js` creates the mirrored `.en.md` or `.en.mdx` path, including nested paths;
- the English skeleton has `translationOf` and `sourceHash` fields and deliberately fails validation until its body is translated;
- `package.json` exposes `check:translations` and invokes it before `astro check` and before `astro build`.

Run:

```powershell
pnpm exec tsx --test tests/post-translation-build-contract.test.ts
```

Expected: FAIL on the current optional schema and one-file scaffolder.

- [ ] **Step 2: Make English metadata required**

Change `src/content.config.ts` to require:

```ts
titleEn: z.string(),
descriptionEn: z.string(),
tagsEn: z.array(z.string()),
categoryEn: z.string(),
```

Keep every unrelated field and default unchanged.

- [ ] **Step 3: Extend the new-post script**

For a requested `foo.md` or `folder/index.mdx`, create:

- `src/content/posts/foo.md` or `src/content/posts/folder/index.mdx`;
- `src/content/translations/foo.en.md` or `src/content/translations/folder/index.en.mdx`.

The Chinese file must contain explicit empty English metadata values. The English file must contain `translationOf`, an empty `sourceHash`, and a visible placeholder that the validator rejects. If either target exists, stop without partially creating the pair.

- [ ] **Step 4: Add check/build gates**

Add:

```json
"check:translations": "tsx scripts/check-post-translations.ts"
```

Run it before `astro check` in `check` and before `astro build` in `build`, preserving icon, LQIP, font subset, and Pagefind steps.

- [ ] **Step 5: Run the contract tests**

```powershell
pnpm exec tsx --test tests/post-translation-build-contract.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/content.config.ts scripts/new-post.js package.json tests/post-translation-build-contract.test.ts
git commit -m "feat: enforce bilingual post metadata"
```

---

## Task 3: Add a generic build-time translation loader

**Files:**

- Create: `src/utils/post-translation-path.ts`
- Create: `src/utils/post-translations.ts`
- Create: `tests/post-translation-loader.test.ts`

- [ ] **Step 1: Write failing ID-normalization tests**

Cover these exact keys:

```ts
assert.equal(normalizeTranslationModuleId("/src/content/translations/code-examples.en.md"), "code-examples");
assert.equal(normalizeTranslationModuleId("/src/content/translations/mdx-example.en.mdx"), "mdx-example");
assert.equal(normalizeTranslationModuleId("/src/content/translations/guide/index.en.md"), "guide");
assert.equal(normalizeTranslationModuleId("/src/content/translations/personal-website-introduction/index.en.md"), "personal-website-introduction");
```

Also test rejection of non-`.en.md(x)` files and duplicate normalized IDs.

- [ ] **Step 2: Implement the pure normalizer and typed loader**

Put the Node-testable path normalizer in `post-translation-path.ts`, then import it into `post-translations.ts`. This separation prevents Node tests from evaluating Vite-only `import.meta.glob`.

Use an eager `import.meta.glob` over `../content/translations/**/*.{md,mdx}` in the loader. Return a typed record with:

```ts
type PostTranslation = {
	Content: AstroComponentFactory;
	headings: MarkdownHeading[];
	words: number;
	minutes: number;
	translationOf: string;
	sourceHash: string;
};
```

Expose `getPostTranslation(id)` and fail with a precise error for duplicate or missing modules. Collapse `/index.en.md(x)` to its directory ID so it matches Astro’s content collection IDs.

- [ ] **Step 3: Run loader tests**

```powershell
pnpm exec tsx --test tests/post-translation-loader.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add src/utils/post-translation-path.ts src/utils/post-translations.ts tests/post-translation-loader.test.ts
git commit -m "feat: load paired post translations"
```

---

## Task 4: Generalize article-page switching, including TOC and encryption

**Files:**

- Modify: `src/pages/posts/[...slug].astro`
- Modify: `src/layouts/MainGridLayout.astro`
- Modify: `src/components/layout/SideBar.astro`
- Modify: `src/components/widget/SidebarTOC.astro`
- Modify: `src/components/controls/FloatingControls.astro`
- Modify: `src/components/controls/FloatingTOC.astro`
- Modify: `src/components/layout/PostMeta.astro`
- Create: `tests/post-translation-rendering.test.ts`

- [ ] **Step 1: Write failing rendering-contract tests**

Assert the source no longer imports `personal-website-introduction-en.md`, calls `getPostTranslation(entry.id)` for every post, and renders:

- Chinese and English title/description;
- Chinese and English body containers using `data-language-only`;
- Chinese and English word counts/read times;
- Chinese and English categories/tags;
- Chinese and English TOC structures with language-specific heading IDs;
- `headingsEn` propagation through `MainGridLayout`, `SideBar`, sidebar TOC, floating controls, and floating TOC.

Also assert that both language-only body containers for password-protected posts occur inside the `EncryptedPost` subtree, never outside it.

Run:

```powershell
pnpm exec tsx --test tests/post-translation-rendering.test.ts
```

Expected: FAIL because the page is special-cased to one article.

- [ ] **Step 2: Replace the hardcoded translation import**

Load the paired English module once per article and use its compiled component, headings, word count, and minutes. Keep Chinese JSON-LD, OG metadata, initial document title, and canonical URL unchanged.

Extend `bannerPostMeta` with `titleEn`, `wordsEn`, and `minutesEn`, and make the full-screen/banner article metadata switch with the same language event. Do not recalculate the Chinese metrics from the English body or vice versa.

- [ ] **Step 3: Render all reader-facing article metadata bilingually**

Pass `tagsEn` and `categoryEn` to `PostMetadata`. Wrap language-dependent number values so English mode shows the English body’s metrics. Keep dates, cover, author, password marker, page views, and links shared.

- [ ] **Step 4: Render bilingual bodies under one route**

For unencrypted posts, render the two Markdown/MDX components as sibling language-only containers. For encrypted posts, render those same two containers as children of the single existing `EncryptedPost` wrapper. Do not duplicate the password prompt, license, comments, share URL, or cover.

- [ ] **Step 5: Add language-specific TOCs**

Add `headingsEn` to the layout chain. Render Chinese and English TOC entries with matching language-specific anchor IDs and `data-language-only`. Make the existing TOC runtime re-scan or refresh after the language-change event so highlighting and scrolling follow the visible body.

- [ ] **Step 6: Run focused tests**

```powershell
pnpm exec tsx --test tests/post-translation-rendering.test.ts tests/language-build-contract.test.ts tests/runtime-language.test.ts
```

Expected: PASS.

- [ ] **Step 7: Record the deferred encrypted-output check**

Do not run the full build yet: the translation gate is intentionally red until Tasks 7 and 8 add all 17 English files. Confirm the rendering-contract test proves both language bodies are structurally inside `EncryptedPost`; Task 9 performs the production-output leakage check after the complete content migration.

- [ ] **Step 8: Commit**

```powershell
git add src/pages/posts/[...slug].astro src/layouts/MainGridLayout.astro src/components/layout/SideBar.astro src/components/widget/SidebarTOC.astro src/components/controls/FloatingControls.astro src/components/controls/FloatingTOC.astro src/components/layout/PostMeta.astro tests/post-translation-rendering.test.ts
git commit -m "feat: switch translated post bodies in place"
```

---

## Task 5: Translate post cards, navigation, recommendation, calendar, and search-facing metadata

**Files:**

- Modify: `src/components/layout/PostCard.astro`
- Modify: `src/components/layout/PostPage.astro`
- Modify: `src/content.config.ts`
- Modify: `src/utils/content-utils.ts`
- Modify: `src/pages/api/allPostMeta.json.ts`
- Modify: `src/pages/posts/[...slug].astro`
- Modify: `src/components/misc/RecommendedPost.astro`
- Modify: `src/components/widget/Calendar.astro`
- Modify: `src/pages/og/[...slug].ts`
- Create: `tests/post-translation-listings.test.ts`

- [ ] **Step 1: Write failing listing-contract tests**

Assert that:

- post cards receive and render `titleEn`, `descriptionEn`, `tagsEn`, and `categoryEn`;
- `getSortedPosts` stores `prevTitleEn` and `nextTitleEn` alongside the current Chinese fields;
- `/api/allPostMeta.json` returns both title/description/category languages;
- recommended posts and calendar select the current language after initial load and after the existing language-change event;
- English values are escaped before insertion into any `innerHTML` template;
- the OG image endpoint continues using Chinese/default metadata and does not create a second image URL.

Run:

```powershell
pnpm exec tsx --test tests/post-translation-listings.test.ts
```

Expected: FAIL on missing bilingual data.

- [ ] **Step 2: Extend content list types and previous/next metadata**

Add internal schema fields `prevTitleEn` and `nextTitleEn`, populate them from adjacent entries, and render them with `LocalizedText` on the article page. Slugs and sort order remain shared.

- [ ] **Step 3: Complete cards and metadata chips**

Pass English tags/category through `PostPage` to `PostCard` and `PostMetadata`. Link destinations remain the existing Chinese taxonomy URLs; only the visible chip text switches in this iteration, preventing duplicate taxonomy pages.

- [ ] **Step 4: Extend the shared JSON endpoint**

Return `titleEn`, `descriptionEn`, and `categoryEn`. Preserve existing keys and ordering so current consumers remain compatible.

- [ ] **Step 5: Make client-rendered recommendations and calendar language-aware**

Read the current language through the existing runtime helper, listen for its exported language-change event, and re-render visible titles/descriptions without another fetch. Escape all text interpolated into HTML.

- [ ] **Step 6: Keep Pagefind as one result per article**

Mark the English body as additional searchable content within the same page result and ensure only the shared article title element defines Pagefind’s result metadata. Confirm that no English translation file becomes a generated route.

- [ ] **Step 7: Run focused tests and a source route check**

```powershell
pnpm exec tsx --test tests/post-translation-listings.test.ts
rg -n "translations.*getStaticPaths|params:.*\.en" src
```

Expected: tests pass; no route or `getStaticPaths` implementation enumerates translation files. The production route check is repeated against `dist` in Task 9 after all translations exist.

- [ ] **Step 8: Commit**

```powershell
git add src/content.config.ts src/components/layout/PostCard.astro src/components/layout/PostPage.astro src/utils/content-utils.ts src/pages/api/allPostMeta.json.ts src/pages/posts/[...slug].astro src/components/misc/RecommendedPost.astro src/components/widget/Calendar.astro src/pages/og/[...slug].ts tests/post-translation-listings.test.ts
git commit -m "feat: localize post discovery surfaces"
```

---

## Task 6: Add bilingual metadata to all 17 Chinese source posts

**Files:**

- Modify: `src/content/posts/code-examples.md`
- Modify: `src/content/posts/daily-quote-widget-guide.md`
- Modify: `src/content/posts/draft.md`
- Modify: `src/content/posts/encrypted-demo.md`
- Modify: `src/content/posts/firefly.md`
- Modify: `src/content/posts/firefly-layout-system.md`
- Modify: `src/content/posts/guide/index.md`
- Modify: `src/content/posts/katex-math-example.md`
- Modify: `src/content/posts/markdown-extended.md`
- Modify: `src/content/posts/markdown-mermaid.md`
- Modify: `src/content/posts/markdown-plantuml.md`
- Modify: `src/content/posts/markdown-tutorial.md`
- Modify: `src/content/posts/mdx-example.mdx`
- Modify: `src/content/posts/music-module-guide.md`
- Modify: `src/content/posts/personal-website-introduction/index.md`
- Modify: `src/content/posts/relationship-timer-guide.md`
- Modify: `src/content/posts/video.md`
- Create: `tests/post-translation-content.test.ts`

- [ ] **Step 1: Write failing metadata completeness tests**

Enumerate all 17 source paths explicitly and assert each declares `titleEn`, `descriptionEn`, `tagsEn`, and `categoryEn`. Require non-placeholder titles, tags, and categories; allow `descriptionEn: ""` only when the Chinese source description is also empty. Assert no draft, pinned, password, comment, date, image, or Chinese body value changes except the requested `80%` correction.

- [ ] **Step 2: Add approved English metadata**

Use these titles and categories consistently:

| Source | `titleEn` | `categoryEn` |
|---|---|---|
| `code-examples.md` | Code Block Showcase | Showcase |
| `daily-quote-widget-guide.md` | How the Daily Quote Widget Works | Guides |
| `draft.md` | Draft Post Example | Showcase |
| `encrypted-demo.md` | Encrypted Firefly Posts | Showcase |
| `firefly.md` | Firefly: A Fresh, Modern Astro Blog Theme | Showcase |
| `firefly-layout-system.md` | Understanding Firefly's Layout System | Guides |
| `guide/index.md` | Firefly Quick Start Guide | Guides |
| `katex-math-example.md` | KaTeX Formula Rendering Showcase | Showcase |
| `markdown-extended.md` | Extended Markdown Features | Showcase |
| `markdown-mermaid.md` | Mermaid Diagrams in Markdown | Showcase |
| `markdown-plantuml.md` | PlantUML Diagrams in Markdown | Showcase |
| `markdown-tutorial.md` | Markdown Tutorial | Showcase |
| `mdx-example.mdx` | MDX Article Showcase | Showcase |
| `music-module-guide.md` | How the Music Module Works | Guides |
| `personal-website-introduction/index.md` | A Brief Introduction to My Website | Guides |
| `relationship-timer-guide.md` | How the Relationship Timer Works | Guides |
| `video.md` | Embedding Video in a Post | Showcase |

Use concise natural descriptions that preserve each Chinese description’s meaning. Translate tag labels consistently: `组件` → `Components`, `使用指南`/`指南` → `Guides`, `展示`/`演示`/`示例` → `Showcase` or `Examples` according to role, `博客` → `Blogging`, `布局` → `Layouts`, `文章示例` → `Article Examples`, `音乐` → `Music`, `视频` → `Video`, `密码保护` → `Password Protection`.

- [ ] **Step 3: Apply the requested 60% correction**

In `personal-website-introduction/index.md`, change only the visible `80%` claim to `60%`. Do not alter the other figures or surrounding Chinese article content.

- [ ] **Step 4: Run metadata tests and Astro schema check**

```powershell
pnpm exec tsx --test tests/post-translation-content.test.ts
pnpm exec astro check
```

Expected: the metadata test passes; Astro may still fail only because English translation files have not all been added yet. Record any unrelated error before continuing.

- [ ] **Step 5: Commit**

```powershell
git add src/content/posts tests/post-translation-content.test.ts
git commit -m "content: add English post metadata"
```

---

## Task 7: Translate the showcase, Markdown, MDX, diagram, math, and video articles

**Files:**

- Create: `src/content/translations/code-examples.en.md`
- Create: `src/content/translations/draft.en.md`
- Create: `src/content/translations/encrypted-demo.en.md`
- Create: `src/content/translations/firefly.en.md`
- Create: `src/content/translations/katex-math-example.en.md`
- Create: `src/content/translations/markdown-extended.en.md`
- Create: `src/content/translations/markdown-mermaid.en.md`
- Create: `src/content/translations/markdown-plantuml.en.md`
- Create: `src/content/translations/markdown-tutorial.en.md`
- Create: `src/content/translations/mdx-example.en.mdx`
- Create: `src/content/translations/video.en.md`

- [ ] **Step 1: Add failing structural assertions for this batch**

Extend `tests/post-translation-content.test.ts` to compare each Chinese/English pair for:

- heading-level sequence;
- fenced-code count and fence language labels;
- link destination list;
- image destination list;
- Mermaid and PlantUML fence count;
- KaTeX delimiter count;
- MDX import and component tag preservation.

Run the test and confirm it fails because this batch is missing.

- [ ] **Step 2: Translate the 11 reader-facing bodies**

Preserve all Markdown/MDX mechanics exactly. Translate headings, prose, table labels, callouts, list text, alt text, and reader-facing captions. Leave code, commands, sample output, formulas, diagram syntax, import lines, component names/props, link URLs, and image paths unchanged.

- [ ] **Step 3: Perform natural-language QA**

Read each English article once without the Chinese beside it, then compare paragraph by paragraph. Revise passages that show any of these traits:

- every sentence has the same length;
- repeated “Additionally”, “Furthermore”, “This demonstrates”, or “It is worth noting”;
- promotional claims not present in Chinese;
- unnecessary three-item lists;
- frequent em dashes used as filler;
- literal Chinese word order;
- explanations added after metaphors or jokes the original leaves implicit.

Use direct instructional English for tutorials and a neutral demonstrative tone for examples. Preserve deliberate brevity in draft and encrypted examples.

- [ ] **Step 4: Add pairing frontmatter and valid hashes**

Each file must contain its exact `translationOf` relative path and a `sourceHash` computed from the complete current Chinese source file.

- [ ] **Step 5: Run the batch checks**

```powershell
pnpm exec tsx --test tests/post-translation-content.test.ts
pnpm check:translations
```

Expected: structural tests for this batch pass; until Task 8, the global validator lists the six guide/personal translations as missing and the old flat personal-site translation as one known orphan. No other issues are acceptable.

- [ ] **Step 6: Commit**

```powershell
git add src/content/translations tests/post-translation-content.test.ts
git commit -m "content: translate post examples"
```

---

## Task 8: Translate the guide and personal articles, and migrate the existing translation

**Files:**

- Create: `src/content/translations/daily-quote-widget-guide.en.md`
- Create: `src/content/translations/firefly-layout-system.en.md`
- Create: `src/content/translations/guide/index.en.md`
- Create: `src/content/translations/music-module-guide.en.md`
- Create: `src/content/translations/personal-website-introduction/index.en.md`
- Create: `src/content/translations/relationship-timer-guide.en.md`
- Delete: `src/content/translations/personal-website-introduction-en.md`
- Modify: `tests/post-translation-content.test.ts`

- [ ] **Step 1: Add failing structural assertions for this batch**

Apply the same heading, code fence, link, image, and component checks. Add explicit assertions that:

- the personal introduction retains both local image paths;
- its English claim says `roughly 60%` and contains no `80%`;
- article titles and technical terms match the approved metadata glossary;
- no old flat `personal-website-introduction-en.md` remains.

- [ ] **Step 2: Translate the six reader-facing bodies**

Keep tutorial prose practical and conversational. Retain first-person phrasing where the Chinese author speaks personally. For the relationship-timer article, preserve the restrained, personal tone rather than turning it into romantic promotional copy. Keep official product and framework names in their standard forms.

- [ ] **Step 3: Migrate and revise the personal-site translation**

Move the existing content into `personal-website-introduction/index.en.md`, add pairing frontmatter, fix the 60% claim, and polish only where needed for natural English. Keep the two relative image links working from the new mirrored directory.

- [ ] **Step 4: Apply the humanized-English review checklist**

For all 17 translations, score the following from 1–10 and revise any article scoring below 8 in a category:

- directness;
- sentence rhythm;
- respect for the reader;
- natural authorial voice;
- concision;
- fidelity to source meaning.

This is an editorial review, not a generated score stored in the repository. Do not add review notes to published Markdown.

- [ ] **Step 5: Add valid hashes and run the complete validator**

```powershell
pnpm check:translations
pnpm exec tsx --test tests/post-translation-content.test.ts
```

Expected: exactly 17 valid pairs, zero missing/orphan/stale/empty translations, and all structural checks pass.

- [ ] **Step 6: Commit**

```powershell
git add src/content/translations tests/post-translation-content.test.ts
git commit -m "content: translate post guides"
```

---

## Task 9: Verify runtime language behavior and visual integrity

**Files:**

- Modify only if a verified bug is found in files already listed above.

- [ ] **Step 1: Run all automated tests**

```powershell
pnpm test:i18n
pnpm check
pnpm type-check
pnpm build
```

Expected: all commands exit 0. Do not claim completion if one fails; diagnose the first failure before continuing.

- [ ] **Step 2: Start the production preview**

```powershell
pnpm preview
```

Use the printed local URL for browser verification.

- [ ] **Step 3: Verify public content in Chinese and English**

Check at least these routes and surfaces:

- homepage cards in grid and masonry layouts;
- `/posts/personal-website-introduction/` for title, body, two images, and `60%`;
- `/posts/daily-quote-widget-guide/` for technical prose and TOC;
- `/posts/mdx-example/` for compiled MDX;
- `/posts/katex-math-example/` for formulas;
- `/posts/markdown-mermaid/` and `/posts/markdown-plantuml/` for diagrams;
- recommended posts, previous/next links, calendar entries, and search results.

For each, switch languages without reload, verify scroll/anchor behavior, refresh and confirm the preference persists, then navigate back to the homepage and confirm the same language remains selected.

- [ ] **Step 4: Verify mobile behavior**

At a mobile viewport, confirm the existing language button remains in the tools panel, article content does not overflow, code blocks remain scrollable, TOC controls still open, and translated tags do not break card layout.

- [ ] **Step 5: Verify encrypted content**

In a development build where the draft route is available, unlock `encrypted-demo`, switch languages in both directions, and confirm only the selected body is visible. Inspect page source or build output to ensure the English paragraph is not readable outside the encrypted payload.

- [ ] **Step 6: Verify non-goals**

Confirm homepage welcome phrases and Daily Quote remain Chinese in English mode; no `.en` route, second RSS feed, duplicate article card, duplicate search result, changed cover, or altered draft visibility was introduced.

- [ ] **Step 7: Review the final diff**

```powershell
git status --short
git diff --check
git diff --stat HEAD~8..HEAD
```

Inspect unexpected files, generated artifacts, encoding changes, and unrelated formatting before finalizing.

- [ ] **Step 8: Commit any verified cleanup**

Only if QA required changes:

```powershell
git status --short
git add src tests scripts package.json
git diff --cached --check
git commit -m "fix: polish bilingual post switching"
```

Before committing, inspect the staged file list and unstage anything unrelated to Tasks 1–9. If no cleanup was needed, do not create an empty commit.

---

## Completion Criteria

- `pnpm check:translations` reports 17/17 valid pairs.
- `pnpm test:i18n`, `pnpm check`, `pnpm type-check`, and `pnpm build` all pass.
- Every public and draft article has required English metadata and a paired English Markdown/MDX file.
- The language button switches article title, description, metadata, body, TOC, metrics, card/list titles, previous/next, recommendations, calendar, and search-facing text without navigation or reload.
- Homepage welcome phrases and Daily Quote remain untranslated.
- The encrypted article leaks no readable English body before unlock.
- “个人网站基础介绍” reads `60%` in Chinese and `roughly 60%` in English.
- No translation reads like generic AI copy after the final directness/rhythm/voice review.
