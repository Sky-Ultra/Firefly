---
translationOf: markdown-extended.md
sourceHash: sha256:1986adaebd13b6665b6349fa85ced6013e87d61cf0ed1536a5b88323712a6b96
---

## GitHub Repository Cards

You can add a live card for any GitHub repository. When the page loads, the card fetches the repository details from the GitHub API.

::github{repo="CuteLeaf/Firefly"}

Use `::github{repo="CuteLeaf/Firefly"}` to create a repository card.

```markdown
::github{repo="CuteLeaf/Firefly"}
```

## Configuring Admonitions

Firefly uses the [rehype-callouts](https://github.com/lin-stephanie/rehype-callouts) plugin and provides four callout themes: `GitHub`, `Obsidian`, `VitePress`, and `Docusaurus`. Choose one in `src/config/siteConfig.ts`:

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  // ...
  rehypeCallouts: {
    // 选项: "github" | "obsidian" | "vitepress" | "docusaurus"
    theme: "github",
  },
  // ...
};
```

Note: **Restart the development server after changing this setting.**

Each theme supports a slightly different set of callout types and its own syntax. The lists below make the differences easier to compare.

### 1. GitHub Theme

GitHub provides five standard callout types.

![GitHub](../posts/images/github.avif)

**Basic syntax**

```markdown
> [!NOTE] NOTE
> 突出显示用户应该考虑的信息。

> [!TIP] TIP
> 可选信息，帮助用户更成功。

> [!IMPORTANT] IMPORTANT
> 用户成功所必需的关键信息。

> [!WARNING] WARNING
> 关键内容，需要立即注意。

> [!CAUTION] CAUTION
> 行动的负面潜在后果。

> [!NOTE] 自定义标题
> 这是一个带有自定义标题的示例。
```

---

### 2. Obsidian Theme

[Obsidian](https://obsidian.md/) supports a much wider collection of callout types and aliases.

<details>
<summary>Show the Obsidian syntax list</summary>

```markdown

> [!NOTE] NOTE
> 通用的笔记块。

> [!ABSTRACT] ABSTRACT
> 文章的摘要。

> [!SUMMARY] SUMMARY
> 文章的总结（同 Abstract）。

> [!TLDR] TLDR
> 太长不看（同 Abstract）。

> [!INFO] INFO
> 提供额外信息。

> [!TODO] TODO
> 需要完成的事项。

> [!TIP] TIP
> 实用技巧或提示。

> [!HINT] HINT
> 暗示（同 Tip）。

> [!IMPORTANT] IMPORTANT
> 重要信息（Obsidian 风格通常使用类似的图标）。

> [!SUCCESS] SUCCESS
> 操作成功。

> [!CHECK] CHECK
> 检查通过（同 Success）。

> [!DONE] DONE
> 已完成（同 Success）。

> [!QUESTION] QUESTION
> 提出问题。

> [!HELP] HELP
> 寻求帮助（同 Question）。

> [!FAQ] FAQ
> 常见问题（同 Question）。

> [!WARNING] WARNING
> 警告信息。

> [!CAUTION] CAUTION
> 注意事项（同 Warning）。

> [!ATTENTION] ATTENTION
> 引起注意（同 Warning）。

> [!FAILURE] FAILURE
> 操作失败。

> [!FAIL] FAIL
> 失败（同 Failure）。

> [!MISSING] MISSING
> 缺失内容（同 Failure）。

> [!DANGER] DANGER
> 危险操作警告。

> [!ERROR] ERROR
> 错误信息（同 Danger）。

> [!BUG] BUG
> 报告软件缺陷。

> [!EXAMPLE] EXAMPLE
> 展示一个例子。

> [!QUOTE] QUOTE
> 引用一段话。

> [!CITE] CITE
> 引证（同 Quote）。

> [!NOTE] 自定义标题
> 这是一个带有自定义标题的示例。
```
</details>

![Obsidian](../posts/images/obsidian.avif)

---

### 3. VitePress Theme

The [VitePress](https://vitepress.dev/) theme uses a clean, modern default style. It currently offers the same **five** basic types as GitHub.

<details>
<summary>Show the VitePress syntax list</summary>

```markdown
> [!NOTE] NOTE
> 对应 GitHub 的 Note。

> [!TIP] TIP
> 对应 GitHub 的 Tip。

> [!IMPORTANT] IMPORTANT
> 对应 GitHub 的 Important。

> [!WARNING] WARNING
> 对应 GitHub 的 Warning。

> [!CAUTION] CAUTION
> 对应 GitHub 的 Caution。

> [!TIP] 自定义标题
> VitePress 风格同样支持自定义标题。
```
</details>

![VitePress](../posts/images/vitepress.avif)

---

### 4. Docusaurus Theme

The [Docusaurus](https://docusaurus.io/docs/markdown-features/admonitions) theme offers five callout types with its own modern styling.

<details>
<summary>Show the Docusaurus syntax list</summary>

The available callout types are `note`, `tip`, `info`, `warning`, and `danger`.

```markdown
:::note
突出显示用户应该考虑的信息，即使在快速浏览时也是如此。
:::

:::tip
可选信息，帮助用户更成功。
:::

:::info
一般信息。
:::

:::warning
由于潜在风险需要用户立即注意的关键内容。
:::

:::danger
行动的负面潜在后果。
:::

:::tip[自定义标题]
可选信息，帮助用户更成功。
:::
```

</details>

![Docusaurus](../posts/images/docusaurus.avif)

---

## Spoilers

Text can be hidden behind a spoiler, and the hidden part may still contain **Markdown** formatting.

The answer is :spoiler[hidden **right here**]!

```markdown
内容 :spoiler[被隐藏了 **哈哈**]！
```

## Image Gallery Grid

Wrap several images in `[grid]` and `[/grid]` to place them side by side. This is useful for galleries and comparisons. The layout responds automatically to the number of images inside the block, with support for up to four images in one row.

**Matching image heights:** When images in the same row have different dimensions or aspect ratios, the grid fills the available height much like a tiled gallery. Shorter or awkwardly proportioned images are centered and cropped with `object-cover`, so their borders remain aligned without gaps. The lightbox still shows the full image after a click. For the best first impression, use images with similar proportions in the same row.

**Aligned captions:** Captions in the same row share a consistent baseline, regardless of the image dimensions above them.

[grid]
![Example image one](../posts/images/firefly1.avif)
![Example image two](../posts/images/firefly2.avif)
![Example image three](../posts/images/firefly3.avif)
[/grid]

**Basic syntax**

```markdown
[grid]
![示例图片一](./images/firefly1.avif)
![示例图片二](./images/firefly2.avif)
![示例图片二](./images/firefly3.avif)
[/grid]
```


---
