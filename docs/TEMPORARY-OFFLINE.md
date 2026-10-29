> 安全迁移更新：用户已明确授权“后端验证改造完成并测试后直接上线”。迁移期间继续停站。不能回滚到旧的静态私密文章版本恢复上线，否则会重新发布可离线猜测的密文/正文。后续恢复必须使用新的服务器保护版本，保持旧预览地址关闭。

# 临时下线：等待用户明确要求恢复

用户于 2026-10-30 要求网站暂时下线，直到用户说“重新上线”。没有定时恢复任务。不要因普通内容或界面更新而擅自恢复正常发布。

## 已保存的正常状态

- 最后正常在线的 Git 提交：`62e9f5c097dc5611fd905f0d6e84815af53ae7bf`。
- 最后正常 Cloudflare 版本短号：`3c724792`，预览地址 `https://3c724792-firefly.xiaoxiaoboluo.workers.dev`；正常预览原先开启。
- 正常 Cloudflare 项目：`firefly`；自定义域名、DNS、Git 连接、构建环境变量不作删除或重建。
- 正常 Wrangler 配置只有 name、compatibility_date、compatibility_flags、assets.directory；可从上述提交恢复。
- 原完整构建命令原样保存在 package.json 的 `build:site`。原 package.json/wrangler.jsonc 的额外本地备份位于本任务工作区 `.site-refresh/maintenance-2026-10-30/`。
- 所有文章、图片、项目源码及原始素材仍在仓库，未删除。

## 当前发布方式

- `pnpm build` 检查翻译后只生成维护页、404 维护页及 robots.txt，避免 GitHub Pages 镜像继续发布原内容。
- Cloudflare Worker 总是先执行，所有路径和方法返回 503 维护页面；包括文章直链、静态文件、API/RSS 路径、Rhine 子项目及 workers.dev 入口。
- 临时设置 `preview_urls:false`，同时停用旧版本及分支预览地址，避免通过历史预览访问正常内容。版本历史本身保留。
- 页面无外部资源、追踪、脚本或自动刷新。no-store/Retry-After 只控制缓存和重试提示，不会自动恢复网站。
- GitHub Pages 的首页为维护提示，旧直链为维护 404。正常源码的 Astro CI 检查仍可运行，但其产物不用于公开发布。

## 用户明确要求“重新上线”后

1. 保留停站期间用户新增的内容改动，不整体回退源码历史。
2. 若维护提交之后没有交叉改动，可单独 revert 本次临时下线提交；否则只恢复本次改动的构建/部署字段与维护说明。
3. package.json：把 `build:site` 原值还原为 `build`，移除备用 `build:site`。wrangler.jsonc：移除维护 main、assets.run_worker_first、preview_urls:false，恢复原静态资产部署；核对预览设置恢复到原先开启状态。
4. 清除 AGENTS.md 的“当前临时下线”要求；保留本档案以便追溯。维护脚本可以删除或保留为未引用备份；同步移除/还原 tests/maintenance.test.ts 的当前停站断言。
5. 构建、发布正常站点，并核对首页、文章、资源和各项目入口。只有公网恢复正常后才报告重新上线。

新响应无法收回访客此前已经下载或离线缓存的内容；本次关闭的是后续服务器访问。
