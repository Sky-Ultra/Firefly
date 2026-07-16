---
title: 音乐模块的原理和实现方式
published: 2026-07-15
description: 有关音乐模块
image: random
tags: [Astro, 音乐, 组件, 使用指南]
category: 指南
draft: false
---

## 一张界面背后其实有三层

播放器没有把所有逻辑都塞在一个组件里，而是分成三层：

- `Music.astro`：侧栏卡片的外壳，负责标题、位置和组件编号；
- `MusicPlayer.astro`：读者看得见的界面，负责按钮、封面、进度条、歌单和歌词抽屉；
- `MusicManager.astro`：真正管理音频、播放状态和歌单数据的全局管理器。

这种拆法最直接的好处，是页面上可以同时出现多张播放器界面，却始终只有一个声音来源。侧栏按下暂停，顶栏的图标也会跟着变化；在顶栏切到下一首，侧栏显示的歌名和封面同样会更新。

侧栏组件本身很薄：

```astro
---
import WidgetLayout from "@/components/common/WidgetLayout.astro";
import MusicPlayer from "@/components/features/MusicPlayer.astro";

const widgetId = `music-widget-${Math.random().toString(36).substring(2, 9)}`;
---

<WidgetLayout id={`${widgetId}-layout`} name="音乐">
	<MusicPlayer id={widgetId} />
</WidgetLayout>
```

每个界面都有独立的 `id`，所以侧栏和顶栏不会选中对方的按钮。它们只共享播放状态，不共享 DOM。

## 全站只保留一个 audio，避免并行

真正的 `<audio>` 元素由 `MusicManager.astro` 创建：

```js
if (window.__fireflyMusic) return;

var audio = document.createElement("audio");
audio.crossOrigin = "anonymous";
audio.style.display = "none";
document.body.appendChild(audio);
```

第一行的单例判断很重要。Firefly 使用站内无刷新切页，如果每次进入新文章都再创建一个音频元素，逛过几页后，后台可能同时留下好几个播放器。这里把管理器挂到 `window.__fireflyMusic`，已经存在时就不再初始化第二份。

管理器脚本还带有 `data-swup-ignore-script`，站内切页时不会被重复执行。只要当前标签页没有关闭，原来的音频元素、音量和播放进度都可以继续保留。

## 配置决定音乐来源

主要配置在 `src/config/musicConfig.ts`。目前本站使用的是 Meting 歌单模式：

```ts
export const musicPlayerConfig = {
	showInNavbar: true,
	mode: "meting",
	volume: 0.7,
	playMode: "list",
	showLyrics: true,

	meting: {
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		server: "netease",
		type: "playlist",
		id: "10046455237",
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},
};
```

`:server`、`:type` 和 `:id` 会在请求前替换成实际配置。主接口失败后，管理器会依次尝试备用接口；只要其中一个返回了有效数组，播放器就继续使用它，不必让读者手动刷新。

Meting 返回的数据会整理成播放器内部统一的格式：

```js
state.playlist = data.map(function (item) {
	return {
		name: item.title || item.name || "Unknown",
		artist: item.author || item.artist || "Unknown",
		url: item.url,
		pic: item.pic || item.cover || "",
		lrc: item.lrc,
	};
});
```

不同接口可能把歌曲名写成 `title` 或 `name`，封面也可能叫 `pic` 或 `cover`。在入口处统一字段后，后面的界面不用知道数据到底来自哪个服务。

## 不依赖接口时使用本地歌单

如果不想依赖第三方歌单，也可以把模式切换成 `local`。本地歌曲仍然写在同一个配置文件里：

```ts
mode: "local",

local: {
	playlist: [
		{
			name: "使一颗心免于哀伤",
			artist: "知更鸟 / HOYO-MiX / Chevy",
			url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
			cover: "/assets/music/cover/109951169585655912.webp",
			lrc: "/assets/music/lrc/使一颗心免于哀伤.lrc",
		},
	],
},
```

以 `/` 开头的地址从 `public` 目录读取，因此上面的音频实际放在 `public/assets/music/`。封面和歌词同理。也可以填写完整的远程 URL，不过远端服务器需要允许浏览器跨域读取音频和歌词。

本地模式更稳定，也完全由自己控制；代价是音频文件会占用站点空间和流量。歌多以后，通常更适合放在对象存储或 CDN，而不是全部提交进代码仓库。

## 状态由管理器保存，界面只负责显示

管理器内部保存当前歌单、歌曲序号、音量、播放模式和歌词状态：

```js
var state = {
	playlist: [],
	currentIndex: 0,
	isPlaying: false,
	playMode: 0,
	volume: localStorage.getItem("music-player-volume") !== null
		? parseFloat(localStorage.getItem("music-player-volume"))
		: (config.volume || 0.7),
	isMuted: false,
	lyrics: [],
	currentLrcIndex: -1,
	initialized: false,
	error: null,
};
```

音量会保存到浏览器本地。读者把声音调低后，下次打开网站仍然沿用原来的数值，不会每次都突然回到默认的 70%。

播放模式在配置中写成容易理解的字符串，初始化时再换成数字：

- `list`：列表循环；
- `one`：单曲循环；
- `random`：随机播放。

界面点击循环按钮时，只是在这三种状态之间切换。歌曲自然结束后，管理器根据当前模式决定重播、顺序播放还是随机挑选下一首。

## 事件连接所有播放器界面

播放器界面不会直接操作隐藏的 `<audio>`，而是调用全局管理器：

```js
window.__fireflyMusic.togglePlay();
window.__fireflyMusic.playNext();
window.__fireflyMusic.setVolume(value);
```

管理器发生变化后，再广播自定义事件：

```js
window.dispatchEvent(
	new CustomEvent("fm:play-state", {
		detail: { isPlaying: true },
	}),
);
```

每一张 `MusicPlayer` 都监听相同的 `fm:*` 事件。常用事件包括：

- `fm:init`：歌单加载完成；
- `fm:track`：切换了当前歌曲；
- `fm:play-state`：播放或暂停状态改变；
- `fm:time`：进度和时间更新；
- `fm:volume`：音量或静音状态改变；
- `fm:lyrics`：歌词加载完成或失败；
- `fm:lrc-index`：当前歌词行改变。

这比让侧栏直接查找顶栏按钮可靠得多。以后再增加迷你播放器或移动端播放器，只要接入这些事件，不需要重写底层播放逻辑。

## 快速切歌时避免旧请求压力过大

切换歌曲会改变 `audio.src`，也可能立刻调用 `audio.play()`。如果读者连续点了几次“下一首”，较早的播放 Promise 有机会比新的操作更晚结束，界面就可能被旧结果覆盖。

管理器使用递增版本号丢弃过期结果：

```js
var loadVersion = 0;

function loadTrack(index, autoPlay) {
	var track = state.playlist[index];
	var version = ++loadVersion;
	audio.src = track.url;

	if (autoPlay) {
		audio.play().then(function () {
			if (version !== loadVersion) return;
			state.isPlaying = true;
			emit("fm:play-state", { isPlaying: true });
		});
	}
}
```

新的歌曲一旦开始加载，旧任务持有的版本号就失效。即使它稍后返回，也不会再修改当前状态。

## 歌词跟随时间

歌词支持两种写法：LRC 文件地址，或者直接填写 LRC 文本。解析器读取形如 `[01:23.45]` 的时间标签，转换为秒数后排序：

```js
function parseLRC(lrc) {
	var timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
	// 每一行会整理成 { time, text }
}
```

音频触发 `timeupdate` 时，管理器从前往后找到最后一个不晚于当前进度的时间点，然后广播 `fm:lrc-index`。界面收到新序号后高亮对应歌词，并把它平滑滚动到歌词框中间。

没有歌词不会影响播放；远程歌词读取失败时也只会显示加载失败状态，不会中断音频。

## 歌单很长时，分段渲染

`MusicPlayer.astro` 的歌单抽屉使用了简单的虚拟列表。播放器根据滚动位置只创建当前可见区域附近的歌曲项，并额外保留少量缓冲内容。

对于只有十几首歌的歌单，这个差别并不明显；但歌单有几百首时，它能避免一次性创建几百张封面和按钮。抽屉打开速度、滚动响应和内存占用都会更稳定。

## 模块位置

侧栏位置由 `src/config/sidebarConfig.ts` 控制：

```ts
{
	type: "music",
	enable: true,
	position: "sticky",
	showOnPostPage: true,
},
```

`enable: false` 可以关闭侧栏音乐卡片；`showOnPostPage` 决定阅读文章时是否显示。顶栏入口则由音乐配置中的 `showInNavbar` 控制：

```ts
showInNavbar: true,
```

两处只是不同的操作界面，背后仍然连接同一个 `MusicManager`。关闭其中一个不会改变另一处的歌单内容。

## 歌曲更改

播放器的播放、进度和歌词同步逻辑已经集中在管理器里。日常添加歌曲时，不需要去修改 `MusicPlayer.astro` 或 `MusicManager.astro`：

- 使用网易云歌单，就维护 `meting.id` 对应的歌单；
- 使用本地音乐，就在 `local.playlist` 里继续添加歌曲对象；
- 想换初始音量或播放模式，修改 `volume` 与 `playMode`；
- 不需要歌词抽屉时，把 `showLyrics` 改成 `false`。
