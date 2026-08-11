---
translationOf: guide/index.md
sourceHash: sha256:01446e6e0a782fcb4ad441f3b2c2512ab562d8c791afaefe98bbc6f097ababf8
---



This blog template is built with [Astro](https://astro.build/). If something is not covered here, the [Astro documentation](https://docs.astro.build/) is the best place to look next.

## Post Front Matter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [前端, 开发]
category: 前端开发
draft: false
---
```




| Property      | Description |
|---------------|-------------|
| `title`       | The post title. |
| `published`   | The publication date. |
| `updated`     | The date of the latest update. If omitted, the publication date is used. |
| `pinned`      | Whether the post should be pinned to the top of the article list. |
| `description` | A short summary shown on the homepage. |
| `image`       | The cover image path.<br/>1. Starts with `http://` or `https://`: use a remote image<br/>2. Starts with `/`: use an image from `public`<br/>3. Has no prefix: resolve the path relative to the Markdown file |
| `tags`        | The post tags. |
| `category`    | The post category. |
| `lang`        | The post language code, such as `zh-CN`. Set this only when it differs from the site's default language. |
| `licenseName` | The name of the content licence. |
| `licenseUrl`  | A link to the content licence. |
| `author`      | The post author. |
| `sourceLink`  | A source or reference link for the article. |
| `draft`       | Draft posts are not shown to visitors. |
| `comment`     | Whether comments are enabled for this post. Defaults to `true`. |
| `slug`        | A custom post URL. If omitted, the file name is used. |
| `password`    | A post password. When set, the body is encrypted with AES-256-GCM and visitors must enter the password to read it. |
| `passwordHint`| An optional hint shown above the password field. |

## Where Post Files Belong

Place article files in `src/content/posts/`. You may also create subdirectories to keep a post and its assets together.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## Custom Post URLs (Slugs)

### What Is a Slug?

A slug is the custom part of a post's URL path. If no slug is set, the system uses the file name.

### Slug Examples

#### Example 1: Use the File Name
```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
---
```
File: `src/content/posts/my-first-blog-post.md`

URL: `/posts/my-first-blog-post`

#### Example 2: Set a Custom Slug
```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
slug: hello-world
---
```
File: `src/content/posts/my-first-blog-post.md`

URL: `/posts/hello-world`

#### Example 3: Use a Slug for a Non-English File Name
```yaml
---
title: 如何使用 Firefly 博客主题
published: 2023-09-09
slug: how-to-use-firefly-blog-theme
---
```
File: `src/content/posts/如何使用Firefly博客主题.md`

URL: `/posts/how-to-use-firefly-blog-theme`

### Slug Guidelines

1. **Use English words and hyphens:** `my-awesome-post`, not `my awesome post`
2. **Keep it short:** Avoid unnecessarily long slugs
3. **Make it descriptive:** The URL should hint at the post's subject
4. **Avoid special characters:** Stick to letters, numbers, and hyphens
5. **Stay consistent:** Follow one naming pattern across the blog

### Notes

- Once a slug has been published, avoid changing it unless necessary; doing so can break existing links and affect SEO
- If several posts share the same slug, the later one will replace the earlier route
- Slugs are converted to lowercase automatically
