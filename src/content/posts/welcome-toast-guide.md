---
title: 欢迎提示组件的实现方式和原理
titleEn: How the Visitor Welcome Toast Works
published: 2026-08-11
description: 从访客位置识别、失败回退到进出场动画，记录首页欢迎提示的完整实现
descriptionEn: How the homepage welcome toast handles visitor location, fallbacks, language changes, and enter-and-exit motion.
image: random
tags: [Astro, 组件, 欢迎提示, 使用指南]
tagsEn: [Astro, Components, Welcome Toast, Guides]
category: 指南
categoryEn: Guides
draft: true
---



## 一句问候，要顾及哪些事

我给这张卡片定了几条规矩：

- 只在首页出现，不打断文章阅读；
- 能取得位置时，显示国家、地区和城市；
- 位置接口不可用时，回到普通欢迎语；
- 五秒后自动收起，也允许读者立即关闭；
- 跟随站点语言切换中文或英文；
- 移动端不越出屏幕，并尊重系统的“减少动态效果”设置。

位置只用来拼出当次提示文字。组件不会把接口结果写入本站的 `localStorage`，也不会据此判断访问者身份。IP 定位本来就可能存在偏差，因此这里适合写“来自某地的朋友”，不适合显示过于精确的地址。

## 会改的内容都收进配置

组件配置位于 `src/config/visitorWidgetsConfig.ts`：

```ts
welcomeToast: {
	enabled: true,
	homepageOnly: true,
	locationApi: "https://ipwho.is/",
	fallbackMessage: "你好，欢迎来到我的博客",
	fallbackMessageEn: "Hello, welcome to my blog",
	subtitle: "欢迎来到我的博客",
	subtitleEn: "Welcome to my blog",
	visibleDuration: 5_000,
	fadeDuration: 500,
},
```

这里故意不放布局代码。欢迎语、接口地址和停留时间以后都有可能改，集中写在配置里，就不必再去模板和脚本中逐个寻找。

`homepageOnly` 控制显示范围。设为 `false` 后，组件可以在首次初始化时出现在其他页面；`enabled` 则是总开关。`visibleDuration` 是完整展示时间，`fadeDuration` 对应离场动画时长，两者分开后，改动画不必顺带改变阅读时间。

## 位置还没回来，卡片也不能空着

主体文件是 `src/components/features/WelcomeToast.astro`。Astro 先输出完整 HTML，浏览器脚本随后再尝试获取位置：

```astro
<welcome-visitor-toast
	data-state="hidden"
	data-home-path={homePath}
	data-homepage-only={String(config.homepageOnly)}
	data-location-api={config.locationApi}
	data-fallback-message={config.fallbackMessage}
	data-fallback-message-en={config.fallbackMessageEn}
	data-visible-duration={config.visibleDuration}
	data-fade-duration={config.fadeDuration}
	role="status"
	aria-live="polite"
>
	<div class="welcome-toast-card">
		<span class="welcome-toast-icon" aria-hidden="true">👋</span>
		<div class="welcome-toast-content">
			<p data-welcome-message>{config.fallbackMessage}</p>
			<p class="welcome-toast-subtitle">{config.subtitle}</p>
		</div>
		<button type="button" data-welcome-close aria-label="关闭欢迎提示">
			<span aria-hidden="true">×</span>
		</button>
	</div>
</welcome-visitor-toast>
```

接口还没响应时，卡片已有备用文字，不会留下一块空白。配置通过 `data-*` 属性交给自定义元素，模板和客户端脚本读取的是同一份值。

组件被放在 `src/layouts/Layout.astro` 中，因此所有页面都会得到这段结构。是否真正弹出，由组件自己根据路径判断。

## 只在首页说一次“你好”

部署到子路径时，首页不一定单纯等于 `/`。代码先清理末尾的 `index.html`，再补齐斜杠：

```ts
function normalizePath(path: string) {
	const withoutIndex = path.replace(/index\.html$/i, "");
	return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
}
```

连接到页面后，再比较当前路径与 Astro 提供的站点根路径：

```ts
const homepageOnly = this.dataset.homepageOnly !== "false";
const homePath = normalizePath(this.dataset.homePath || "/");

if (
	homepageOnly &&
	normalizePath(window.location.pathname) !== homePath
) {
	return;
}
```

Firefly 的站内跳转不一定刷新整个文档。为了避免每次换页都重新问候，脚本在 `window` 上保存一个初始化标记：

```ts
const welcomeRuntime = window as Window & {
	__fireflyWelcomeToastInitialized?: boolean;
};

if (welcomeRuntime.__fireflyWelcomeToastInitialized) return;
welcomeRuntime.__fireflyWelcomeToastInitialized = true;
```

这个标记只活在当前标签页的运行周期里。读者主动刷新首页后，新的页面环境仍会正常显示欢迎提示。

## 位置接口不能一直等

位置请求由浏览器直接发往配置中的接口。代码只读取 `country`、`region` 和 `city`：

```ts
type IpLocationResponse = {
	success?: boolean;
	country?: string;
	region?: string;
	city?: string;
};
```

三个字段中经常会有重复值，例如地区名与城市名相同。组合前先去掉空值和重复项：

```ts
const location = [data.country, data.region, data.city]
	.filter(
		(value, index, values): value is string =>
			Boolean(value) && values.indexOf(value) === index,
	)
	.join(" · ");
```

网络请求不能无限等待。组件用 `AbortController` 设置四秒上限：

```ts
this.controller = new AbortController();
const timeout = window.setTimeout(() => this.controller?.abort(), 4_000);

try {
	const response = await fetch(this.dataset.locationApi || "https://ipwho.is/", {
		headers: { Accept: "application/json" },
		signal: this.controller.signal,
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	// 读取并整理位置
} catch {
	this.location = "";
	this.renderMessage();
} finally {
	window.clearTimeout(timeout);
}
```

请求失败、接口返回异常或超时都会走同一个回退分支。对读者来说，只是看到“你好，欢迎来到我的博客”，不需要面对一串网络错误。

## 换语言，不必再查一遍位置

欢迎提示可能还没消失，读者就按下了右上角的语言按钮。组件监听站点统一派发的 `firefly:language-change` 事件：

```ts
private readonly handleLanguageChange = () => this.renderMessage();

connectedCallback() {
	document.addEventListener(
		"firefly:language-change",
		this.handleLanguageChange,
	);
}
```

渲染时读取根元素上的语言状态，而不是重新请求位置：

```ts
private renderMessage() {
	const message = this.querySelector<HTMLElement>("[data-welcome-message]");
	if (!message) return;

	const english = document.documentElement.dataset.language === "en";
	if (this.location) {
		message.textContent = english
			? `Hello, friend from ${this.location}`
			: `你好，来自${this.location}的朋友`;
		return;
	}

	message.textContent = english
		? this.dataset.fallbackMessageEn || "Hello, welcome to my blog"
		: this.dataset.fallbackMessage || "你好，欢迎来到我的博客";
}
```

位置数据留在组件实例中，切换语言时只重组句子。这里使用 `textContent`，接口返回的内容不会被当成 HTML 插入页面。

## 进场、停留、离场

动画没有依赖额外库，而是由 `data-state` 控制：

- `hidden`：卡片位于视口下方，不可见也不可点击；
- `visible`：上移到屏幕内并恢复透明度；
- `closing`：播放离场动画，结束后回到 `hidden`。

显示动作放进 `requestAnimationFrame`，让浏览器先提交初始样式，再发生状态变化：

```ts
private show() {
	window.requestAnimationFrame(() => {
		if (this.isConnected) this.dataset.state = "visible";
	});

	const visibleDuration = Number(this.dataset.visibleDuration) || 5_000;
	this.hideTimer = window.setTimeout(() => this.close(), visibleDuration);
}
```

关闭按钮和自动计时最后都会调用同一个 `close()`。组件离开页面时还会清除计时器并中止未完成的请求，避免站内跳转后留下旧任务。

## 别在手机上挡住页面

桌面端卡片固定在右下角；屏幕宽度小于 640px 时，同时设置 `left` 和 `right`，让卡片宽度跟随屏幕。`role="status"` 与 `aria-live="polite"` 会让辅助技术在合适的时机读出更新，而不会强行打断当前内容。

用户在系统中启用“减少动态效果”后，过渡时间会缩短到近乎瞬间：

```css
@media (prefers-reduced-motion: reduce) {
	welcome-visitor-toast {
		transition-duration: 1ms;
	}
}
```

欢迎卡片不该抢走页面的注意力。位置识别成功，它就多带回一个地名；失败了，也只是老老实实说一句普通的欢迎语。读者不必知道背后有一次请求没有成功。
