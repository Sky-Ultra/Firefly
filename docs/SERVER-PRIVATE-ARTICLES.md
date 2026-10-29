# 文章后端保护

用户于 2026-10-30 授权：完成后端改造并测试后直接恢复上线。原密码保持不变。每天北京时间 04:00 重置，每篇文章同一公网 IP 或同一签名浏览器标识累计输错五次即锁定。

## 当前结构

- 受保护文章：`liking`、`love-tree-guide`、`long-night-love-letter`。公开 Markdown 和英文翻译只保留元数据、实际阅读统计及占位文字，不含正文、密码校验值或旧密文。
- `ServerProtectedContent.astro` 与 `private-article-client.ts` 只调用同源后端。前端不解密，不保存密码，不使用本地计数控制权限。
- Cloudflare `PrivateArticleBackend` 使用 SQLite-backed Durable Objects。私有 HTML、PBKDF2 校验值及会话签名密钥只存在私有存储，不放进静态资产或公开 Git 文件。
- IP 使用 Cloudflare 设置的 CF-Connecting-IP；不信任浏览器传来的 IP 参数。浏览器令牌及文章会话是 Secure/HttpOnly/SameSite=Strict 的签名 Cookie。删除 Cookie 不清除同 IP 的服务器计数，换 IP 不清除保留下来的浏览器标识计数。
- 每个计数对象通过 SQLite 同步事务预留验证名额。预留名额与错误次数合计不得超过五，避免并发多试。验证服务失败尽量释放未验证名额；未完成的预留过期后保守计入错误，避免通过中断请求刷无限次数。
- 授权会话两小时有效，按文章、浏览器标识及私有内容版本绑定。修改/重新导入文章版本后旧会话失效。未授权时正文接口返回 401；锁定返回 429；存储不可用返回 503，绝不回退到公开密文。
- 私密页面源码、RSS、搜索索引和元数据接口不含正文。分享和全文长图组件只在授权正文加载后挂载。正文高光、双语和代码格式使用迁移前已验证的完整 HTML。

## 私有资料与导入

原始六个中英文源码副本、私有 HTML/校验值、现有密码资料和所有者签名私钥都保存在仓库之外。本任务路径为：

`C:/Users/xiaox/Documents/Codex/2026-09-12/skill/.site-refresh/server-private-2026-10-30/`

`worker/bootstrap-public-key.mjs` 只有公开验证公钥；不得把 `owner-private-key.pem`、`existing-credentials.json` 或 `private-seed.json` 提交 Git/复制到 public/dist。

导入命令（只在本地所有者环境执行）：

```powershell
node scripts/private-article-owner.mjs --home <外部私有资料目录> --action import
node scripts/private-article-owner.mjs --home <外部私有资料目录> --action health
```

所有者接口要求 Ed25519 签名、请求体摘要、五分钟内的时间戳及一次性随机值。公开路由不提供通用 Durable Object 代理或读取管理密钥的接口。正常部署不需要把私钥传给 Cloudflare 构建环境。

## 发布与恢复

- 迁移阶段 `worker/site-state.mjs` 为 false，整个网站保持维护状态，仅正确签名的所有者导入接口可用。
- 私有数据导入、内容校验、并发限次及浏览器验证通过后，才切换该状态并恢复正常构建。
- 正常 Worker 先处理 `/api/private/*`，其他公开静态资产直接沿用原有路径，保留原站布局/主题/轮播。
- 必须保留 `PRIVATE_ARTICLES` 绑定、`PrivateArticleBackend` 导出及 `private-article-v1` 迁移历史。不要通过改命名空间、类名或清库来重置计数。
- 历史预览 URL 持续关闭，不恢复旧的纯前端保护部署。`docs/TEMPORARY-OFFLINE.md` 的原版本记录仅用于历史追溯。
- 新增私密文章需要先在私有环境渲染、导入，再提交公开占位元数据与注册 ID。发布检查会拒绝把新的私密全文/密文直接放回公开文章。

## 已知边界

IP 和匿名浏览器标识不能证明同一物理设备；更换 IP 并建立新浏览器身份仍可能换一个计数身份。多人共用公网 IP 也会共享 IP 上限。若需要限定到具体的人，应另加账号或邀请名单。

按用户要求保留原密码，因此已经知道密码的人仍可正常验证。旧公开 Git 历史、历史构建产物和他人已下载的副本不能通过本次后端计数收回；本次不擅自强制重写 Git 历史或改变开源仓库可见性。
