---
translationOf: firefly-layout-system.md
sourceHash: sha256:16464e6ae71e34b55b28415658426eb621ddfaf5da83eece11cb1440d2f8058c
---

## 📖 Overview

Firefly has a flexible layout system that can be adapted to the content and the way you want the blog to feel. Two choices shape most pages: the **sidebar arrangement** and the **post-list layout**. Together, they determine the overall structure.

This guide covers each layout mode, where it works well, and what to expect from different combinations.

---

[grid]
![Left sidebar with list layout](../posts/images/left-list.avif)
![Right sidebar with grid layout](../posts/images/right-grid2.avif)
![Left sidebar with a three-column grid](../posts/images/left-grid3.avif)
[/grid]

[grid]
![Two sidebars with list layout](../posts/images/both-list.avif)
![Two sidebars with grid layout](../posts/images/both-grid.avif)
![Two sidebars with masonry grid](../posts/images/masonry.avif)
[/grid]


## 1. Sidebar Layouts

Sidebars hold navigation, categories, tags, statistics, and other supporting information. Firefly provides two main arrangements.

### 1.1 Single-Sidebar Mode

#### Left Sidebar (`position: "left"`)

![Left-sidebar layout](../posts/images/left-list.avif)

#### Right Sidebar (`position: "right"`)

![Right-sidebar layout](../posts/images/right-grid2.avif)

#### Characteristics

- The sidebar stays on one side of the page
- The reading area is wider and more comfortable
- The page feels simpler and less crowded

#### Good For

- Traditional blog layouts
- Blogs where navigation and categories matter
- Personal sites that give the profile card a prominent place
- Pages where the article should lead and supporting information should remain secondary

:::tip
Use `showBothSidebarsOnPostPage` to decide whether article pages should display both sidebars.

When `position` is `left` or `right`, enabling this option adds the opposite sidebar on article pages while leaving the homepage and other pages in single-sidebar mode.

This works well when most pages only need one sidebar, but articles benefit from a table of contents or another widget on the opposite side.
:::


#### Configuration Example

```typescript
// src/config/sidebarConfig.ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  enable: true,
  position: "left", // 左侧边栏
  showBothSidebarsOnPostPage: true, // 是否在文章详情页显示双侧边栏
};
```

---

### 1.2 Two-Sidebar Mode (`position: "both"`)

#### Characteristics

- Sidebars appear on both the left and right
- The main content sits in the centre
- Wide screens are used more fully
- More supporting information can remain visible
- Best suited to desktop displays with plenty of width

#### Layout Structure

![Two sidebars with list layout](../posts/images/both-list.avif)

![Two sidebars with grid layout](../posts/images/both-grid.avif)
#### Good For

- Browsing on wide desktop screens
- Information-dense blogs
- Sites with several useful sidebar widgets
- Technical blogs that need persistent navigation and reference material


#### Configuration Example

```typescript
// src/config/sidebarConfig.ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
  enable: true,
  position: "both", // 双侧边栏
```

---

## 2. Post-List Layouts

The post list is the centre of the homepage and archive pages. Firefly offers two display modes, with several options for the grid.

### 2.1 List Mode (`defaultMode: "list"`)

#### Characteristics

- A single vertical column
- Cover images remain prominent
- More space for each summary
- Well suited to slower, deeper browsing

#### List Structure

![List-mode layout](../posts/images/left-list.avif)

#### Advantages

- ✅ Large covers create a stronger first impression
- ✅ Cards can show more detail, including summaries and tags
- ✅ A good fit for image-rich blogs
- ✅ Easy to read on mobile screens
- ✅ Compatible with every sidebar arrangement

#### Configuration Example

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  postListLayout: {
    defaultMode: "list", // 列表模式
    allowSwitch: true,   // 允许用户切换
  },
};
```

---

### 2.2 Grid Mode (`defaultMode: "grid"`)

#### Characteristics

- The column count adapts to the available width
- A compact layout with higher information density
- Useful for scanning many posts quickly

#### Responsive Grid

In grid mode, `columnWidth` sets the minimum card width in pixels. The browser then calculates how many columns fit inside the container.

![Grid layout](../posts/images/left-grid3.avif)

#### Configuration Example

```typescript
// src/config/siteConfig.ts
export const siteConfig: SiteConfig = {
  postListLayout: {
    defaultMode: "grid",
    allowSwitch: true,
    grid: {
      masonry: true,      // 开启瀑布流
      columnWidth: 320,   // 卡片最小宽度(px)，浏览器自动计算列数
    },
  },
};
```

---

### 2.3 Masonry

Firefly's grid mode includes a masonry option for feeds where mixed image and text lengths produce cards of different heights. It removes the empty bands that a conventional row-based grid would leave behind.

![Masonry layout](../posts/images/masonry.avif)

- **Balanced placement:** Each card is placed into the shortest current column, making better use of vertical space.
- **No row gaps:** Absolute positioning calculates each card's exact location so it sits directly below the card above it.
- **Responsive columns:** The column count still follows `columnWidth` and the container width; no fixed count is required.
- **Easy to configure:** Toggle the feature with `postListLayout.grid.masonry` in `siteConfig.ts`.

---

## 3. Choosing a Combination

Sidebar and post-list modes can be mixed freely. These combinations are useful starting points.

| Sidebar | Post list | Recommendation | Good for |
|---------|-----------|----------------|----------|
| One sidebar | List | ⭐⭐⭐⭐⭐ | Photography, design, and personal blogs that rely on strong imagery |
| One sidebar | Grid | ⭐⭐⭐⭐⭐ | Technical notes and reference blogs that need both readability and quick scanning |
| Two sidebars | List | ⭐⭐⭐⭐⭐ | Sites with a large amount of useful sidebar information |
| Two sidebars | Grid | ⭐⭐⭐⭐⭐ | Dense, dashboard-like layouts for readers who want as much information as possible |

---

## 4. Responsive Behaviour

Firefly adjusts its layout as the screen narrows.

To preserve readability, the system makes three main changes:

1. **Fewer grid columns:** The count follows `columnWidth` and the container width, so smaller screens naturally show fewer columns.
2. **List mode becomes grid mode:** Below 380 px, list mode switches to a compact grid so the card content remains usable on very small devices.
3. **Two sidebars become one:** Below 1280 px, `tabletSidebar` decides which sidebar remains. The other is hidden, and the article table of contents moves into a floating control.

---

## 5. Frequently Asked Question

### Q1: How do I change the number of grid columns?

**A:** Adjust the minimum card width with `columnWidth`. A smaller value allows more columns in the same space; a larger value produces fewer. The browser calculates the final count from the width available.

---

## 6. Summary

Firefly's layout settings make it possible to change the shape of the blog without rebuilding its components.

Try a few combinations based on the kind of content you publish and the devices your readers use. The best layout is the one that makes your own material easiest to browse.

---

## Related Links

- 📚 [Sidebar configuration](https://docs-firefly.cuteleaf.cn/config/sidebarConfig-usage/)
- 📚 [Site configuration](https://docs-firefly.cuteleaf.cn/config/siteConfig-usage/)
- 🏠 [Firefly documentation](https://docs-firefly.cuteleaf.cn/)
- ⭐ [Firefly on GitHub](https://github.com/CuteLeaf/Firefly)
