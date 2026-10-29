# 童话：参考站 Hero 源码适配

本次调整仅作用于 `fullscreen + fairytale`，经典模式和其他默认界面沿用原有分支。站点初始默认仍为经典。

## 已核对的实际源码

参考站 https://blog.fqzlr.top/ 正在使用的仓库为 https://github.com/fqzlr/shirone-fq ，不是较早的 Next.js `2025-blog-public` 项目。本次同时核对了网站实际发布的 DisplaySettings、MainGridLayout 资源与下列源文件：

- `src/components/organisms/DisplaySettings.svelte`：外观 / 壁纸 / 特效页签、壁纸选择、透明设置分组。
- `src/components/atoms/selection/Slider.svelte`：彩虹轨道、白色矩形滑块、0–20px 的模糊范围。
- `src/components/atoms/selection/SegmentedButton.svelte`：带勾选状态的分段单选控件。
- `src/components/organisms/BannerStage.astro`：固定背景、图片交叉淡入、Hero 下隐藏水波纹与底部渐变。
- `src/layouts/Layout.astro` 的 `updateWallpaperBlurProgress`：首页模糊进度为 scrollY / (视口高度 × 0.8)。标题在半个视口内淡出。

改编的控件与滚动规则保留 MIT 许可，完整许可在 `LICENSES/Shirone-fq.txt`。新面板使用本站既有图标、主题变量及功能回调，不引入或替换全站 Material 主题系统。

## 效果与隔离

- 只有童话选中时显示新的紧凑三页签面板。经典分支原有标记与样式保持一致；改动前后的经典面板标记已逐字节对照。
- 童话隐藏水波纹、底部渐变及旧横幅局部遮罩；固定背景使用统一遮罩，避免首屏与内容区之间出现色带。
- 模糊仅作用于背景图片，不对整个舞台或界面控件套滤镜。顶部进度为 0，即使滑块调到 20px，主壁纸也保持清晰。滚动后按参考站的 0.8 视口比例渐进虚化；返回顶部立即恢复清晰。
- 标题随原文档流上移，按参考站的 0.5 视口比例淡出；图片淡入使用 1.2s 和 cubic-bezier(.2,0,0,1)。降低动态效果时取消淡入。
- 文章及其他页面继续保留完整壁纸空间，可以向上滚回查看；这是按用户明确要求保留的差异。不强制重写页面跳转的滚动落点。
- 童话偏好继续使用独立的 `firefly:fullscreen-layout`、`firefly:fairytale-settings`。不改写壁纸模式、经典布局、原覆盖透明设置或水波纹偏好。旧童话壁纸透明度值保留兼容，但不再影响主壁纸或提供额外滑块。
- 背景复用原轮播当前设备的图片 URL；不修改原图库、32 / 21 张上限、原暂停状态或图片质量。经典下不为童话加载图片、不绑定滚动监听。
- 所有样式均有童话模式条件或组件局部作用域，没有根字号、全局配色或顶栏布局重置。退出时释放背景图、监听器、计时器与临时进度变量。

## 验证

重点检查顶部调整最大模糊时 scrollY 与清晰度、滚动虚化与标题淡出、水波纹/渐变隐藏、手机面板、经典往返、文章上滑、默认字号与导航尺寸，以及现有完整测试集。
