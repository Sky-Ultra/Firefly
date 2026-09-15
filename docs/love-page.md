# 独立爱情树页面

- 地址：`/love/`，静态文件位于 `public/love/`，随 Firefly 构建发布。
- 该 HTML 不使用博客布局；不添加主站导航入口、返回链接、RSS 或站内搜索结果。
- `noindex, nofollow, noarchive` 用于请求搜索引擎不收录。公共 URL 和公开 GitHub 源码仍可读取内容，这不是访问控制。
- 文字在 `public/love/config.js`。称呼为用户指定的 `sy：`，没有原模板的两个人名、纪念日或计时器。
- 背景音乐沿用原项目，首次点击爱心后播放，右下角音乐按钮可暂停。
- 电脑保持左侧情书、右侧树的布局；窄屏将信件放在树下方，以保证可读性。

## 来源

基于 https://github.com/qzydustin/love-letter-website ，上游提交 `27778fb00a3a2ea813c701f592dd9ec02ca19b1b`。
MIT 声明保存在 `public/love/LICENSE`，未复制上游域名的 CNAME。

## 动画回退

接入、文案和移除计时器作为基础提交；随后将心跳、飘落增强作为独立提交。
只回退后一个动画提交即可保留 `/love/` 页面及这封信。
