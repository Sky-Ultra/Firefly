# Firefly 全文章双语切换设计

## 目标

将 `src/content/posts` 中现有的 17 篇 Markdown/MDX 文章全部纳入网站已有的中英文切换机制。访客在同一文章网址点击右上角翻译按钮后，文章标题、摘要、元数据和正文即时切换为英文，不刷新页面，也不改变封面、正文图片或链接。

此后新增文章必须同时提供英文版；中文版发生修改时，构建检查必须能够发现英文版尚未同步，避免过期翻译上线。

## 已确认的内容边界

- 翻译全部 17 篇文章，包括 10 篇公开文章和 7 篇 `draft: true` 的隐藏文章。
- 翻译面向读者的文字：标题、摘要、标签、分类、正文、标题层级、图片替代文字、提示框、表格、列表和说明性文字。
- 保持技术结构不变：代码语法、变量名、函数名、命令、文件路径、网址、链接目标、Markdown/MDX 结构、Mermaid/PlantUML 语法和嵌入组件参数不做无必要改动。
- 代码块中的自然语言注释或示例输出不要求翻译；只有代码块外的说明正文需要翻译。
- 每日一言与主页欢迎词继续遵守现有规则，不随语言按钮翻译。
- “个人网站基础介绍”中文版中的 `80%` 修正为 `60%`，英文版同步改为 `roughly 60%`。

## 方案选择

采用“中文原稿 + 独立英文稿”的一对一配对结构，不将两种语言混写在一个 Markdown 文件内，也不创建单独的 `/en/` 路由。

原因：

- 与当前“个人网站基础介绍”的即时切换方式一致。
- 中文原稿保持简洁，不会因双语内容而变得难以编辑。
- 英文稿仍然是完整 Markdown/MDX，图片、表格、提示框和组件能力不受限制。
- 同一路由切换避免重复文章卡片、重复评论和两套链接结构。

## 文件组织

中文原稿继续保存在：

```text
src/content/posts/<article-id>.md
src/content/posts/<article-id>.mdx
src/content/posts/<directory>/index.md
```

英文稿镜像文章 ID，并使用 `.en` 标识：

```text
src/content/translations/<article-id>.en.md
src/content/translations/<article-id>.en.mdx
src/content/translations/<directory>/index.en.md
```

例如：

```text
src/content/posts/code-examples.md
src/content/translations/code-examples.en.md

src/content/posts/guide/index.md
src/content/translations/guide/index.en.md

src/content/posts/mdx-example.mdx
src/content/translations/mdx-example.en.mdx
```

英文稿不加入 Astro 的 `posts` 内容集合，因此不会被当作独立文章生成、计数或出现在文章列表中。

## 文章元数据

中文文章 Frontmatter 保存中文字段与对应英文展示字段：

```yaml
title: 每日一言组件的实现方式
titleEn: How the Daily Quote Widget Works
description: 介绍每日一言组件的接口配置、缓存策略、请求复用与自动刷新方式
descriptionEn: How the daily quote widget handles its API, caching, request reuse, and automatic refreshes.
tags: [Astro, 组件, 使用指南]
tagsEn: [Astro, Components, Guides]
category: 指南
categoryEn: Guides
```

`content.config.ts` 将 `titleEn`、`descriptionEn`、`tagsEn` 和 `categoryEn` 设为所有文章的必填字段。这样以后新增文章但遗漏英文元数据时，`astro check` 会直接失败。

`scripts/new-post.js` 的文章模板同时生成上述中英文字段，并创建匹配的英文稿骨架；骨架不能通过正式构建，直至正文翻译完成并写入有效同步指纹。

## 英文稿与同步指纹

每份英文稿包含不显示给访客的 Frontmatter：

```yaml
---
translationOf: code-examples.md
sourceHash: sha256:<中文原稿完整文件的 SHA-256>
---
```

同步检查脚本 `scripts/check-post-translations.ts` 执行以下规则：

1. 枚举 `src/content/posts` 下所有 `.md` 和 `.mdx` 文件，包括草稿。
2. 按相对路径寻找唯一匹配的 `.en.md` 或 `.en.mdx`。
3. 检查 `translationOf` 是否指向正确中文原稿。
4. 对中文原稿完整文件计算 SHA-256，并与英文稿的 `sourceHash` 比较。
5. 检查英文正文不是空白或占位内容。
6. 检查没有多余、找不到中文来源的孤立英文稿。

任何缺失、重复、孤立或指纹过期都会使检查以非零状态退出，并打印具体文章路径。完整中文文件参与哈希，因此日期或其他 Frontmatter 的修改也会触发同步检查；这属于有意采用的严格策略，宁可要求确认一次，也不允许漏掉可能影响英文展示的改动。

`package.json` 的 `check`/`build` 工作流在 Astro 检查或构建前运行此脚本。更新一篇中文文章时，必须同步检查英文稿，然后更新该英文稿的 `sourceHash`。

## 构建期配对与页面渲染

新增集中式工具 `src/utils/post-translations.ts`，通过 `import.meta.glob` 载入 `src/content/translations` 下所有英文 Markdown/MDX 模块，并按文章 ID 返回：

- 英文正文组件；
- 英文标题层级，用于英文目录；
- 英文正文的字数和预计阅读时间；
- 配对是否存在的类型安全结果。

文章页不再硬编码导入“个人网站基础介绍”的英文稿，而是对每个文章 ID 使用相同配对逻辑。中文和英文正文都在构建期编译，页面内分别放入：

```html
<div data-language-only="zh-CN">...</div>
<div data-language-only="en" hidden>...</div>
```

已有 `LanguageManager` 继续负责即时切换和 `localStorage` 语言记忆。切换语言时同步更新：

- 浏览器标签页标题；
- 文章页标题、摘要和读者可见元数据；
- 正文；
- 目录文字与锚点；
- 字数和预计阅读时间；
- 上一篇、下一篇与推荐文章的标题和摘要；
- 首页、归档、搜索结果和日历等位置出现的文章标题。

封面与正文图片复用中文文章资源，不生成重复图片；英文图片替代文字写在英文稿中。文章网址、评论线程、永久链接和分享地址保持不变。

## 加密文章

加密文章的中英文正文必须一起进入现有 `EncryptedPost` 构建时加密流程。英文正文不得以明文形式额外输出在页面源码中。解锁后再根据当前语言显示对应正文；密码、会话缓存和关闭浏览器后失效等行为保持不变。

## 搜索与索引

同一文章仍只生成一个网址和一个文章列表项。页面可以同时包含中英文构建产物，但 Pagefind 只将其归入同一文章结果，避免产生两个可点击结果。中文查询和英文查询都可以找到该文章。

JSON-LD、Open Graph 和初始服务端 HTML 继续以站点默认中文为主；语言按钮属于客户端偏好切换。本次不增加独立英文 URL、`hreflang` 或第二套 RSS。

## 翻译质量规则

- 使用自然、地道的英文重写句子，不逐字机械翻译，也不擅自增加原文没有的结论。
- 保留作者语气：教程保持清晰直接，个人表达保持克制和真诚，示例文章保持教学口吻。
- Astro、Markdown、MDX、KaTeX、Mermaid、PlantUML、Cloudflare Workers 等官方技术名称按标准写法保留。
- 相同术语在所有文章中保持一致，例如“侧栏”统一为 `sidebar`，“瀑布流”统一为 `masonry layout`，“每日一言”作为组件名称统一为 `Daily Quote`。
- 中文书名号、引号和标点按英文语境调整；代码、数学公式、链接目标和文件路径保持原样。
- 不翻译作者名、品牌名、域名、账号、变量名或作品正式名称，除非该作品存在明确官方英文名。
- 完成每篇翻译后进行中英逐段核对，确认没有漏段、错链、错图、代码围栏损坏或标题层级变化。

## 现有文章迁移

本次迁移覆盖以下 17 篇：

1. `code-examples.md`
2. `daily-quote-widget-guide.md`
3. `draft.md`
4. `encrypted-demo.md`
5. `firefly.md`
6. `firefly-layout-system.md`
7. `guide/index.md`
8. `katex-math-example.md`
9. `markdown-extended.md`
10. `markdown-mermaid.md`
11. `markdown-plantuml.md`
12. `markdown-tutorial.md`
13. `mdx-example.mdx`
14. `music-module-guide.md`
15. `personal-website-introduction/index.md`
16. `relationship-timer-guide.md`
17. `video.md`

现有 `src/content/translations/personal-website-introduction-en.md` 将迁移为镜像命名 `src/content/translations/personal-website-introduction/index.en.md`，并加入同步指纹。

## 错误处理

- 英文稿缺失或同步指纹过期：开发检查和生产构建失败，输出中文原稿与期望英文稿路径。
- 英文 Markdown/MDX 编译失败：沿用 Astro 构建错误并定位到具体文件。
- 浏览器存储不可用：沿用现有语言管理器行为，当前页面仍可切换，但不持久化偏好。
- 客户端切换时某个局部英文值缺失：构建阶段已禁止该状态进入产物，不在运行时静默回退为混合语言。

## 测试与验收

### 自动化检查

- 先为文章配对、缺失英文稿、孤立英文稿、过期 `sourceHash` 和扩展名匹配编写失败测试。
- 为文章页面通用英文模块查找、正文双语容器、英文标题/目录/阅读统计切换编写构建契约测试。
- 为加密文章验证英文正文不以明文出现在最终 HTML。
- 运行 `pnpm check`、`pnpm type-check` 和 `pnpm build`。

### 内容验收

- 逐篇比较中英文标题层级和段落数量。
- 检查全部内部图片、外部链接、代码围栏、表格、数学公式与嵌入组件。
- 在中英文模式下抽查首页文章卡片、文章详情、目录、上一篇/下一篇、推荐文章和搜索。
- 刷新页面验证语言偏好保留；从文章返回首页后仍保持当前语言。
- 在生产构建中确认草稿不对访客展示，但其英文稿仍通过完整性检查。

## 非目标

- 不创建 `/en/` 独立路由。
- 不翻译每日一言和主页欢迎词。
- 不复制或替换现有图片。
- 不改变文章是否公开、置顶、加密或评论开关。
- 不引入在线机器翻译服务或运行时翻译 API。
