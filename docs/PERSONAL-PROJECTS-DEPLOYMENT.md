# 本人项目部署（2026-10-26）

按用户要求，以下文件夹的当前工作内容作为独立静态网站部署；路径为原文件夹名去掉空格，保留大小写。

| 本地来源 | 主站路径 | 发行版本 | 内容 |
| --- | --- | --- | --- |
| `E:\Codex Project\Rhine Wuwa` | `/RhineWuwa/` | `414a906816e78297` | 115 份鸣潮档案及 TXT |
| `E:\Codex Project\Rhine ZZZ` | `/RhineZZZ/` | `714033d1abf67cdd` | 72 份绝区零档案及 TXT |
| `E:\Codex Project\Sticker website` | `/Stickerwebsite/` | 当前运行文件快照 | 贴点照片贴纸工作台 |

## 发布边界

- 入口位于神器库 `/tools/` 的“本人项目”，继续新标签页打开。保留原有 Rhine Genshin 卡片和金色高光；不增加主导航入口，不调整 Rhine StarRail。
- 主站发布目录为 `public/RhineWuwa/`、`public/RhineZZZ/`、`public/Stickerwebsite/`，由现有 Astro 构建复制至 `dist`，继续沿用 `Sky-Ultra/Firefly` 的 master 和 Cloudflare firefly 自动发布。无需另启服务或修改 DNS。
- 保留三个网站各自的页面、动画和功能，未把它们改成主站文章。独立页面继续排除站内全文搜索和搜索引擎索引。
- 只发布公开运行资源，不复制源码仓库、依赖、工作记录、测试、启动脚本或本机服务脚本。档案站保留上游 MIT、Rolling Number、MiSans 与音频来源；未发布 Novecento 独立授权字体。

## 从最新文件夹重新生成

档案站先执行自身 prebuild，重新生成目录、完整正文及 TXT，再通过各自内容、视口和 TypeScript 检查。使用现有 Vite，分别指定 `--base /RhineWuwa/` 和 `--base /RhineZZZ/`，输出到各自工程内 `work/firefly-deployment/site`。没有覆盖原项目的 dist，也没有提交或重置其原有工作区改动。

发行 HTML 增加 noindex；Manifest 的 id、scope、start_url 限定在对应路径。在最终 HTML、Manifest 与许可证就绪后重新计算 PWA 版本。沿用原 worker 的路径内缓存与更新逻辑，收藏和偏好使用原项目独立存储键。

主站只接收 pwa-build.json 列出的文件，另附 sw.js、pwa-build.json、update.html 与 update.js。每份离线清单中的文件必须存在、非空且小于 25 MiB；Git 对三个发行目录保留原始字节。后续更新应重新生成完整发行包后替换对应目录，不要只覆盖单个 bundle。

贴纸站是无构建、无运行依赖的静态应用。只复制原静态服务器公开的 HTML、CSS、JS 及 assets；照片编辑和导出继续在访客浏览器内完成。响应头保留其原静态服务器的 CSP、Referrer-Policy 和 nosniff，路径内文件重新验证缓存。

## 移除

如用户要求移除一个项目，删除其对应 public 目录，移除 toolsConfig.ts 中的该项、该路径的 _headers 规则及 .gitattributes 规则，再调整对应部署测试并正常发布即可；其他项目独立保留。已安装的离线应用可能仍有用户设备上的副本。

## 同批更新

- 朋友圈新增 2026-10-23 两条：18:56“蜉蝣不识千秋夜，也借星光渡此生”，20:12“花开未敢传心事，花落方知春已深。”；时区为 Australia/Sydney，保留原有动态。
- 首页原本电脑、手机各 10 张轮播，现通过 common.carousel.count 各配置 16 张。图库继续自动扫描且分设备独立，新增照片在下次构建后加入候选池。
- 首页壁纸输出高清 WebP，质量 92，电脑最长宽 3200、手机最长宽 1440，均不放大原图。文章封面、海报和原图地址保留原有用途。
- 轮播优先加载当前与下一张，只保留相邻三张的解码资源；后台暂停并保留用户暂停选择，跨设备断点重新准备对应图库，表单输入不触发快捷键。
- 构建后验证首页图库公开的原图地址，补齐 Astro 对重复来源图像可能漏出的原始文件。该步骤只读两个指定图库并写入 dist/_astro，保留原始字节；修复此前 6 张默认 AVIF 原图的 404。
