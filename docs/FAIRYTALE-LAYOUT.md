# 全屏布局：经典 / 童话

入口：右上角主题面板 → 全屏壁纸 → 全屏布局。默认经典，沿用原来的全部壁纸设置。童话是单独的可选显示层，不改动顶栏、字号、主题色、文章内容或经典布局代码。

视觉参考：
- https://blog.fqzlr.top/
- https://blog.fqzlr.top/posts/tech/fullscreen-hero-layout/
- 页面页脚指向的主题源码 https://github.com/LyraVoid/Shirone

用户提供的 `fqzlr/2025-blog-public` 当前为 Next.js 项目，与参考站正在使用的 Astro/Shirone 主题不同。本功能根据参考站可见交互和它的实现说明独立适配现有 Firefly，不引入主题替换或新依赖。

## 隔离边界

- `firefly:fullscreen-layout` 只存 `classic` 或 `fairytale`；`firefly:fairytale-settings` 单独存模糊度、壁纸透明度与卡片透明度。不写 `wallpaperMode`、`overlayBlur`、`overlayOpacity`、`overlayCardOpacity` 等原有偏好。
- 首帧在 head 内联读取新偏好。全部 CSS 必须同时带 `html[data-wallpaper-mode="fullscreen"][data-fullscreen-layout="fairytale"]`，不重设全局字体、调色变量或顶栏样式。
- 经典模式下不为新背景加载图片，也不监听滚动；已有轮播源、当前位置与暂停状态保持原逻辑。
- 童话读取原轮播当前设备的活动图片，以两个图片层交叉淡入。复用同一 URL 的浏览器缓存，原图片池、轮播数和图片质量不变；不把全图库一次性加载进背景。
- 背景固定在底层，随滚动从清晰过渡到用户设定的虚化值，内容卡片使用独立透明度。原横幅在文档流中的整屏空间、标题、下滑箭头与水波纹保留，所以文章和其他页面也能滚回上方查看壁纸。
- 不强制改写路由进入时的滚动落点；切换布局时仅补偿非首页阅读区域的几何位置，避免手机上增减壁纸区后丢失正在阅读的位置。
- 离开童话会撤销背景图片、观察器、滚动监听和临时进度变量。过期图片加载结果不能覆盖当前图。存储不可用时退回经典默认；降低动态效果时取消图片淡入。

## 默认值

背景模糊 10px（范围 0–24），壁纸不透明度 100%（20–100%），卡片不透明度 74%（20–100%）。界面提供恢复默认按钮。值越低越透明；背景模糊只作用于壁纸，不作用于文字或控件。
