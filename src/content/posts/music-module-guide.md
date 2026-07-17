---
title: Astro 音乐模块的设计与实现
published: 2026-07-15
description: 介绍音乐播放器的组件结构、状态管理、歌单配置与歌词同步方式
image: random
tags: [Astro, 音乐, 组件, 使用指南]
category: 指南
draft: false
---

这篇文章记录本站音乐模块的整体设计与实现。播放器支持侧栏与顶栏同时显示，并提供歌单加载、播放控制、歌词同步和本地音乐等功能。

## 组件结构

音乐模块由三个组件组成，各自负责不同的功能：

- `Music.astro`：侧栏卡片的外层组件，负责标题、布局和实例编号；
- `MusicPlayer.astro`：播放器界面，包含封面、控制按钮、进度条、歌单和歌词抽屉；
- `MusicManager.astro`：全局播放管理器，负责音频实例、播放状态和歌单数据。

这种结构将界面与播放逻辑分开。页面可以同时显示多个播放器界面，但始终共用同一个音频实例。在侧栏暂停音乐，顶栏的播放状态会同步更新；从顶栏切换歌曲后，侧栏中的歌名和封面也会随之变化。

侧栏组件本身只负责载入播放器：

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

每个播放器都会生成独立的 `id`，避免侧栏和顶栏误选中对方的 DOM 元素。它们共享播放状态，但各自维护界面节点。

## 使用单例音频实例

真正的 `<audio>` 元素由 `MusicManager.astro` 创建：

```js
if (window.__fireflyMusic) return;

var audio = document.createElement("audio");
audio.crossOrigin = "anonymous";
audio.style.display = "none";
document.body.appendChild(audio);
```

`window.__fireflyMusic` 用于判断管理器是否已经初始化。Firefly 使用站内无刷新切页，如果每次切换页面都创建新的音频元素，页面停留一段时间后可能出现多个播放器同时运行的问题。

管理器脚本同时使用了 `data-swup-ignore-script`，避免在页面切换时重复执行。只要当前标签页没有关闭，播放进度、音量和当前歌曲都可以继续保留。

## 配置在线歌单

音乐模块的主要配置位于 `src/config/musicConfig.ts`。本站目前使用 Meting 歌单模式：

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

请求发送前，`:server`、`:type` 和 `:id` 会被替换为配置中的实际值。如果主接口请求失败，管理器会依次尝试备用接口；任意一个接口返回有效歌单后，播放器即可继续初始化。

不同 Meting 接口返回的字段名称可能并不一致，因此需要先将数据整理为统一格式：

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

例如，歌曲名称可能使用 `title` 或 `name`，封面字段也可能是 `pic` 或 `cover`。在数据入口统一处理后，播放器界面无需关心具体使用了哪个接口。

## 配置本地音乐

不希望依赖第三方接口时，可以将模式改为 `local`，并直接在配置文件中维护歌曲信息：

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

以 `/` 开头的路径会从 `public` 目录读取。以上示例中的音频文件应放在 `public/assets/music/`，封面和歌词文件同理。

歌曲地址也可以使用完整的远程 URL，但对应服务器需要允许浏览器跨域访问音频和歌词资源。

本地模式不依赖外部歌单接口，稳定性更高，也便于自行管理文件。不过，音频会占用站点存储空间和流量。歌曲较多时，更适合将文件放在对象存储或 CDN 中，而不是直接提交到代码仓库。

## 集中管理播放状态

播放状态统一保存在管理器中，播放器组件只负责展示和接收用户操作：

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

这里保存了歌单、当前歌曲、播放状态、播放模式、音量和歌词等信息。

音量会写入浏览器的本地存储。读者调整音量后，再次打开网站时仍会使用上一次的设置，而不是恢复到默认值。

播放模式在配置中使用字符串表示：

- `list`：列表循环；
- `one`：单曲循环；
- `random`：随机播放。

初始化时，管理器会将这些配置转换为内部状态。歌曲播放结束后，再根据当前模式决定重播、顺序切换或随机选择下一首。

## 通过事件同步多个界面

`MusicPlayer.astro` 不会直接操作隐藏的 `<audio>` 元素，而是调用全局管理器提供的方法：

```js
window.__fireflyMusic.togglePlay();
window.__fireflyMusic.playNext();
window.__fireflyMusic.setVolume(value);
```

播放状态发生变化后，管理器会向页面广播自定义事件：

```js
window.dispatchEvent(
	new CustomEvent("fm:play-state", {
		detail: { isPlaying: true },
	}),
);
```

所有 `MusicPlayer` 实例都会监听相同的 `fm:*` 事件，常用事件包括：

- `fm:init`：歌单加载完成；
- `fm:track`：当前歌曲发生变化；
- `fm:play-state`：播放或暂停状态变化；
- `fm:time`：播放进度更新；
- `fm:volume`：音量或静音状态变化；
- `fm:lyrics`：歌词加载完成或失败；
- `fm:lrc-index`：当前歌词行发生变化。

这样一来，各个播放器界面不需要互相查找或修改 DOM。以后增加移动端播放器或迷你播放器时，只需接入相同的管理器和事件即可。

## 处理快速切歌

切换歌曲时，播放器会更新 `audio.src`，并可能立即调用 `audio.play()`。如果用户连续点击“下一首”，先发起的异步播放任务可能比后发起的任务更晚结束，从而覆盖当前状态。

这里通过递增的版本号忽略已经过期的结果：

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

每次加载新歌曲时，`loadVersion` 都会增加。旧任务返回后，如果版本号与当前值不一致，就不会继续修改播放状态。

## 解析并同步歌词

歌词既可以填写 LRC 文件地址，也可以直接传入 LRC 文本。解析器会读取 `[01:23.45]` 这类时间标签，将其转换为秒数并按时间排序：

```js
function parseLRC(lrc) {
	var timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
	// 每一行会整理成 { time, text }
}
```

音频触发 `timeupdate` 事件时，管理器会查找当前进度对应的歌词行，并广播 `fm:lrc-index`。播放器界面收到序号后，会高亮当前歌词，并将其平滑滚动到歌词区域中间。

没有歌词不会影响音频播放。远程歌词加载失败时，播放器只会显示相应提示，不会中断当前歌曲。

## 优化长歌单渲染

`MusicPlayer.astro` 的歌单抽屉使用了简单的虚拟列表。播放器会根据滚动位置，仅渲染当前可见区域及其附近的歌曲，并保留少量缓冲项。

对于较短的歌单，这项优化并不明显；但当歌单包含数百首歌曲时，可以减少一次性创建的封面、按钮和文本节点，使抽屉打开和滚动更加稳定。

## 设置显示位置

侧栏播放器的位置由 `src/config/sidebarConfig.ts` 控制：

```ts
{
	type: "music",
	enable: true,
	position: "sticky",
	showOnPostPage: true,
},
```

将 `enable` 设为 `false` 可以关闭侧栏音乐卡片；`showOnPostPage` 用于控制文章页面是否显示该组件。

顶栏入口则由音乐配置中的 `showInNavbar` 控制：

```ts
showInNavbar: true,
```

侧栏和顶栏只是两个不同的操作界面，背后都连接同一个 `MusicManager`。关闭其中一个入口，不会影响另一个入口的播放功能和歌单内容。

## 日常配置

播放器的播放控制、进度同步和歌词处理都集中在管理器中。日常更换歌曲时，一般不需要修改 `MusicPlayer.astro` 或 `MusicManager.astro`：

- 使用网易云歌单时，维护 `meting.id` 对应的歌单；
- 使用本地音乐时，在 `local.playlist` 中添加歌曲；
- 修改 `volume` 可以调整默认音量；
- 修改 `playMode` 可以设置默认播放模式；
- 不需要歌词功能时，将 `showLyrics` 设为 `false`。

完成配置后，重新构建站点即可。
