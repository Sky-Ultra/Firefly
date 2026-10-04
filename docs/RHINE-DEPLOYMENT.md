# 独立 Rhine 档案页面

## 部署边界

2026-10-05 按用户要求，将两个本地网站的当前版本作为独立静态发行包部署到现有主站：

| 原项目 | 独立路径 | 离线发行版本 |
| --- | --- | --- |
| `E:\Codex Project\Rhine Genshin` | `/RhineGenshin/` | `6d98d8bcac0ac0a1` |
| `E:\Codex Project\Rhine StarRail` | `/RhineStarRail/` | `5bf980f6230eb026` |

文件分别位于 `public/RhineGenshin/` 与 `public/RhineStarRail/`。主站正常 Astro 构建将其原样复制到 `dist`，沿用 GitHub `Sky-Ultra/Firefly` 的 `master` 与 Cloudflare `firefly` 的自动构建。构建命令仍为 `pnpm run build`，部署命令仍为 `npx wrangler deploy`；未修改 Cloudflare 配置、DNS 或主站导航。

两个页面不使用主站布局，不加入菜单、文章、站内搜索或 sitemap。静态 HTML 的 `data-pagefind-ignore` 阻止其成为站内搜索入口；`robots` 与路径限定的 `X-Robots-Tag` 提示搜索引擎不索引。没有添加密码或访问控制，知道 URL 的访客仍可直接访问。

## 资源和缓存

- 使用原项目的 Vite 构建，分别指定 `--base /RhineGenshin/` 与 `--base /RhineStarRail/`。图片、字体、音频、模型、图标、正文导出与 JS/CSS 都使用各自路径。
- 两个 Web App Manifest 的 `id`、`scope` 与 `start_url` 分别限定在对应目录。
- Service Worker 沿用原项目实现；注册作用域与缓存前缀包含当前子路径，不接管主站或另一个档案页面。
- Git 字节保留规则只作用于这两个发行目录，避免上传时换行转换改变已验证资源与离线版本；主站源码的换行规则不变。
- 每个页面保留 40 份 TXT 下载及完整离线资源。未上传原仓库、参考视频、Blender 源工程、研究截图、依赖目录或机密。
- 保留上游 LBEILC/RhineLabUI 的 MIT 声明、MiSans 许可与 NOTICE、Rolling Number 许可及音频来源说明。第三方原作名称、标志、字体和采样音频继续遵循各自权利；不声称这些资源被 MIT 重新授权。
- 本地没有 Novecento 独立许可 kit，本次未获取或发布该字体，继续使用项目已有的固定图形／MiSans 回退。

## 更新与移除

原项目源码与本地未提交改动保持不变。当前主站保存的是发行快照；以后修改原项目时，应重新构建并完整替换对应目录，检查 `pwa-build.json` 的文件列表与版本，勿仅覆盖单个 JS 文件。

如用户要求移除某一个页面，只需删除对应 `public` 目录、`public/_headers` 中该路径的规则，并调整 `tests/rhine-sites.test.ts` 的对应验证项，然后正常构建、提交和部署；另一个页面与主站可保留。已安装离线副本的设备可能仍有缓存，需要用户自行移除安装或清理该页面的站点数据。移除线上文件不保证抹除第三方保存的副本。

## 本次验证

- 原神内容 62 项、星穹内容 18 项、星穹开场 5 项、星穹正文 4 项检查通过；两项目的视口与 TypeScript 检查通过。
- 主站 179 项回归测试通过（含发行包字节保留验证），Astro 检查 206 文件无错误／警告／提示，TypeScript 检查和完整构建通过。
- Pagefind 仍索引原有 20 页面，不包含这两个独立页面。
- Edge 生产预览中两页面能进入原始三维界面、显示正文与详细叙述，TXT 下载链接使用正确路径，两套离线资源均准备完成。
- 上线后需核对 Cloudflare 的对应提交构建成功、实际 HTTPS 页面及资源返回；以聊天交付中的实际结果为准。
