---
title: 告白树/恋爱树的实现方式和原理
titleEn: How the Confession / Love Tree Works
published: 2026-10-12
description: |-
  七百朵爱的花瓣组合成的爱心树...
  实际页面目前仅定向开放，但项目本身我现已经开源。欢迎取用
descriptionEn: |-
  Seven hundred petals of love come together to form a heart-shaped tree...
  The live page is currently shared only with selected people, but I have now open-sourced the project. You're welcome to use it.
image: random
tags: [展示]
tagsEn: [Showcase]
category: 展示
categoryEn: Showcase
author: Sky
comment: true
draft: false
---

七百朵爱的花瓣组合成的爱的树...  

页面目前仅定向开放，但项目本身我现已经开源。

之前的[恋爱计时组件](https://xiaoxiaoboluo.cn/posts/relationship-timer-guide/)讲的是侧栏卡片。这次想把恋爱树这页也看一遍：树怎样画出来，动画如何接上，文字又是在什么时候出现的。主要记录页面的实现。

## 先看目录里的文件

用的是普通 HTML、CSS 和 JavaScript。这个目录里的代码没有引入前端框架，也没有请求后端接口；树和花朵都由浏览器绘制。

| 文件 | 负责的内容 |
| --- | --- |
| `index.html` | 页面结构、爱心按钮、三层画布、第二页文字和控制按钮 |
| `styles.css` | 配色、桌面与手机布局、爱心跳动、花瓣飘动和文字过渡 |
| `config.js` | 入口文字、第一封信、树下轮播的句子和轮播间隔 |
| `js/geometry.js` | 坐标、贝塞尔曲线、心形范围判断和心形绘图路径 |
| `js/tree.js` | 树形参数，以及种子、地面线、树枝和花朵的绘制 |
| `js/animation.js` | 开场到开花的动画、树的移动、打字、句子轮播和飘落的爱心 |
| `js/ui.js` | 生成信的段落、缩放场景、初始化画布和音乐按钮 |
| `js/afterword.js` | 第二页的段落动画，以及向下阅读的提示 |
| `js/main.js` | 初始化页面，安排各阶段的执行顺序 |
| `bgm.mp3`、`favicon.svg` | 背景音乐和浏览器标签页上的图标 |
| `LICENSE` | 保留的 MIT 许可证和版权署名 |

`index.html` 用带有 `defer` 的脚本标签加载这些文件，顺序是配置、几何函数、动画、树、界面、第二页，最后到入口脚本。它们是普通脚本，后面的文件可以直接使用前面定义的函数和类。这里的加载顺序需要保留。

## 画布分成三层

树所在的区域叠了三张画布：

```html
<canvas id="ground-canvas" aria-hidden="true"></canvas>
<canvas id="static-canvas" aria-hidden="true"></canvas>
<canvas id="canvas" aria-hidden="true"></canvas>
```

最底层画地面线，中间层画种子、树枝和开出的花，最上层画持续飘落的花瓣。信和树下的文字则是 HTML 元素，放在画布上方。

这样分层之后，花瓣每一帧只需要清空最上面的画布。已经长好的树可以留在中间层，地面线也可以留在原处。后面树向右移动时，CSS 移动的正是 `static-canvas`，地面线不会一起挪走。

绘图使用固定的 `1100 × 680` 坐标。外面的 `scene` 按 `760px` 的基准高度占位，多出的空间用于容纳树下的句子。窗口变窄时，`scaleContent()` 会根据可用宽度计算比例：

```js
const scale = Math.min(viewport.clientWidth / StageConfig.width, 1);
viewport.style.setProperty("--scene-scale", String(scale));
```

CSS 再把这个比例应用到场景上。树形坐标始终不变，页面缩小时也不用重新计算每一根树枝。`ResizeObserver` 会在容器宽度变化后更新比例。

`initCanvas()` 还处理了屏幕像素密度：

```js
function initCanvas(id) {
	const canvas = document.getElementById(id);
	const { width, height } = StageConfig;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	canvas.getContext("2d").scale(dpr, dpr);
	return canvas;
}
```

画布的像素尺寸最多放大到两倍，绘图上下文也同步缩放。因此代码仍然可以按原来的坐标绘制，在高像素密度屏幕上又能保留更清楚的边缘。

页面的底色是 `#ffffee`，信使用 `#228567`，树下的字偏粉色。字体优先使用系统中的苹方或微软雅黑，这个目录没有额外的字体文件。

## 点击爱心以后

入口是一枚真正的 `<button>`，里面放着 SVG 爱心。它可以用鼠标点击，也可以用键盘聚焦并启动。爱心的轻微跳动来自 `heartbeat` 关键帧，一个周期是 2.4 秒，其中安排了两次幅度不同的放大。

点击后，按钮会被禁用，监听器也只执行一次。`animateOpening()` 读取 SVG 爱心和画布的实际位置，再把爱心移动到画布种子的位置。文字用 220 毫秒淡出，爱心的移动用 420 毫秒。接下来按钮隐藏，由 Canvas 里的心形接上后续动画。

`main.js` 中的这段代码能直接看出播放顺序：

```js
seed.drawHeart();
await animateSeedShrink(seed);
await animateSeedMove(seed, footer);
await animateTreeGrow(tree);
await animateFlowerBloom(tree);

tree.resetFallingBlooms();
footer.draw();
await animateTreeMove(staticCanvas);
document.body.classList.add("letter-open");
const letter = document.getElementById("letter");
letter.hidden = false;
typewriter(letter);
```

每个 `await` 都等前一个阶段结束。种子还没落下，树枝就不会开始生长；花还没开完，树也不会提前让出位置。

缩小阶段每次把爱心的比例乘以 `0.94`，直到比例降到 `0.2` 以下。下落阶段显示的是红色圆点，每步向下移动 `2.4` 个绘图单位。同时，`Footer.draw()` 会把地面线从种子所在的位置向两边延伸。

这些有限的动画都交给 `runUntil()`：

```js
async function runUntil(isDone, step, interval = 16) {
  let last = 0;
  while (!isDone()) {
    if (prefersReducedMotion()) {
      step();
      continue;
    }
    const now = await nextFrame();
    if (now - last >= interval) {
      step();
      last = now;
    }
  }
}
```

`nextFrame()` 等待的是 `requestAnimationFrame`。种子、长树和开花传入的间隔是 10 毫秒，但实际更新仍然跟着浏览器的刷新帧走，不能把这个数值直接理解成每秒绘制一百次。

有两件事在点击时就已经启动：背景音乐，以及第二页文字区域。它们不用等树长完。全屏飘动的小爱心则在 SVG 开场结束、按钮隐藏后开始出现。

## 树枝绘画是使用曲线函数

树的轮廓写在 `tree.js` 的 `TreeShape` 中。主干使用的参数摘出来是这样：

```js
from: [535, 680],
control: [570, 250],
to: [500, 200],
radius: 30,
steps: 100,
```

`from` 是起点，`to` 是终点，`control` 决定弯曲方向。Canvas 的纵坐标向下增加，所以从 `y = 680` 走到 `y = 200`，在画面里就是从地面往上生长。

几何函数用二次贝塞尔曲线计算路径上的位置：

```js
function bezier(points, t) {
  const p0 = points[0];
  const p1 = points[1];
  const p2 = points[2];
  const s = 1 - t;
  return new Point(
    p0.x * s * s + 2 * p1.x * s * t + p2.x * t * t,
    p0.y * s * s + 2 * p1.y * s * t + p2.y * t * t
  );
}
```

`t` 从 0 走到 1，得到的点就沿着整条曲线移动。`Branch.grow()` 每次只取相邻的两个位置，再画出它们之间的一小段：

```js
const t0 = this.step / this.steps;
const t1 = (this.step + 1) / this.steps;
const start = bezier(this.curve, t0);
const end = bezier(this.curve, t1);
```

树枝的粗细也会变化。当前半径按 `initialRadius × 0.97^step` 计算，越接近枝梢越细。绘制时使用两倍半径作为线宽，端点和连接处都设为圆形，并加了一点同色阴影，让各段接起来更顺。

子枝写在父枝的 `children` 中。父枝完成后才把子枝加入生长列表，同一批子枝可以一起长。树的骨架是预先给定的，每次打开都沿着这些曲线绘制；随机变化主要来自后面的花朵。

## 七百朵花怎样排成心形

每一朵花本身就是一个小心形。`geometry.js` 中的 `Heart` 类先按参数方程取点：

```js
const x = 16 * Math.sin(t) ** 3;
const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
```

这些点会被连接成一个 `Path2D`。绘制时把纵坐标取反，让心形方向适应 Canvas 坐标。种子和花朵共用这条路径，画每朵花时再分别设置位置、旋转角度和缩放比例。

整片树冠也呈心形，不过它的范围判断用的是另一条公式：

```js
function inHeart(x, y, r) {
  const nx = x / r;
  const ny = y / r;
  return (nx ** 2 + ny ** 2 - 1) ** 3 - nx ** 2 * ny ** 3 < 0;
}
```

`Tree.createBloom()` 先在一个矩形范围里随机取点，再用 `inHeart()` 判断这个点是否落在心形内部。落在里面才创建花朵，落在外面就继续尝试。

这里有两个不同的形状：`Heart` 决定一朵花怎么画，`inHeart()` 决定这朵花可以放在哪里。花朵位置没有沿着树枝逐一排列，而是填在心形范围内，叠在树枝上方，最后组成树冠。

当前配置预先准备了 700 朵花，分布范围使用 `1080 × 650`，心形判断传入的尺寸参数是 `240`。每个随机点最多尝试一千次，仍未成功时会回退到区域中心，避免一直循环。

开花时每步取出两朵新花。每朵花从 `0.1` 的比例开始，逐步放大：

```js
flower() {
  this.drawOn(this.tree.ctx);
  this.scale += 0.1;
  return this.scale <= 1;
}
```

颜色、透明度和角度也都带有随机值，所以每次打开，花朵的分布和色彩会有差别。完成放大的花会从活动列表中移除，但它已经画在静态画布上，仍然留在树冠中。

## 树让开位置，信开始打字

桌面端给静态画布加上 `shifted` 类，让树向右移动：

```css
#static-canvas { z-index: 1; transition: transform 1.5s ease-in-out; }
#static-canvas.shifted { transform: translateX(var(--tree-shift-x)); }
```

`--tree-shift-x` 默认是 `260px`。CSS 的移动持续 1.5 秒，JavaScript 等待 1600 毫秒后再显示信，所以正常播放时，树先移到右边，文字才开始出现。场景经过缩放后，屏幕上的移动距离也会按相同比例缩小。

第一封信保存在 `config.js` 的 `letter` 中。`salutation` 是称呼，`paragraphs` 是分节的正文，`closing` 是结尾。正文每一节又是一组行，`initContent()` 会为每行建立一个 `<p>`，并用 `stanza` 容器把同一节的行包起来。

写入文字时使用 `textContent`：

```js
function addLine(parent, text, className = "") {
	const p = document.createElement("p");
	p.className = className;
	p.textContent = text;
	parent.appendChild(p);
}
```

配置里的内容会按普通文字显示。需要分行时就在数组里增加一项，需要分节时就增加一组数组。

打字开始前，`typewriter()` 会保存每个段落的完整文字，再清空段落。随后把字符逐个追加到文本节点上，同一个下划线光标跟着移动到当前行。

打字的间隔并不完全相同：

```js
function charDelay(char, base) {
  if ("…".includes(char)) return base * 12;
  if ("。！？.!?".includes(char)) return base * 10;
  if ("，、；：,;:".includes(char)) return base * 5;
  return base + Math.random() * base * 0.5;
}
```

默认的 `base` 是 100 毫秒。普通字符大约停顿 100～150 毫秒，逗号停半秒，句号停一秒，省略号停得更久。换行还会停顿 800 毫秒。我觉得这里比单纯逐字出现更有用的，是标点和行尾的这些停顿，长一点的句子也能留出阅读时间。

`main.js` 调用 `typewriter(letter)` 时没有继续 `await`。因此信在打字的同时，树下轮播和持续落花也已经开始，不需要等整封信写完。

## 移动端优化

屏幕宽度到 `700px` 以下时，页面会改成上下排列：信在前，树在后，树的横向偏移归零。相关样式摘出来是这样：

```css
@media (max-width: 700px) {
	:root { --tree-shift-x: 0px; }
	#viewport { display: flex; flex-direction: column; }
	#scene { order: 2; flex-shrink: 0; transform-origin: top left; }
	#letter {
		order: 1;
		position: relative;
		width: calc(100% - 3rem);
		min-height: var(--mobile-letter-height, 0px);
		font-size: 16px;
		line-height: 1.85;
	}
}
```

这段节选只保留了排列和尺寸相关的规则。手机上的树仍然按比例缩小，信的字号则单独固定为 16 像素，避免文字也跟着整张画布缩得太小。

切换布局时，`animateMobileTreeMove()` 会先测量树的位置，再让完整的信参与排版。此时信带着 `mobile-letter-staging` 类，只占位置，暂时不可见。代码会把测得的信的高度保存下来：

```js
letter.style.setProperty("--mobile-letter-height", `${letter.getBoundingClientRect().height}px`);
```

之后开始打字，段落内容虽然被清空，信的区域仍保留完整文字所需的高度。树不会随着每一行文字出现而不断往下跳。

树的移动则通过新旧位置的差值衔接。下面是这段动画的两个关键帧：

```js
{ transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width})` },
{ transform: "translate(0, 0) scale(1)" }
```

先按新布局摆放，再用位移和缩放暂时还原到旧位置，最后播放到新位置。这样，手机端从开场进入阅读布局时，树也有一个连续的移动过程。

## 树下的句子和两种落花

树下文字由 `startTreeCaptionCarousel()` 控制。先显示 `treeCaptions` 中的第一句，剩余句子打乱顺序后轮流取出。队列用完再重新洗牌，并尽量避免前后连续出现同一句。

每句文字先逐字打出，停留一段时间，再从末尾逐字删除。输入速度是每字 100 毫秒，删除速度是每字 50 毫秒；`treeCaptionInterval` 默认是 10000 毫秒，代码会扣除打字和删除所用的时间，再计算中间停留多久。如果句子本身太长，一轮也会超过这个间隔。

这里优先用 `Intl.Segmenter` 按字素拆分文字，组合在一起的表情符号可以作为一段处理。第一封信的打字使用普通的字符遍历，两处的拆字方式并不完全一样。

画面上的落花也有两套实现：

| 看到的效果 | 实现方式 |
| --- | --- |
| 从树冠附近飘落的小心形 | Canvas 中的 `Bloom`，每帧清空动态画布后重新绘制 |
| 跨过整个屏幕的彩色小爱心 | `heart-petal-field` 中的 HTML `span`，由 CSS 关键帧移动 |

树冠落花沿用 `startHeartJumpAnimation()` 这个函数名，实际执行的是 `Bloom.fall()`。花瓣带着横向和纵向速度，逐渐下落，同时左右摆动、旋转并慢慢变淡。位置更新使用 `dt / 16` 换算时间，单次时间差还限制在 50 毫秒以内，减少长时间暂停后位置突然跳远的情况。

树冠附近同时最多有 6 片落花。生成位置会读取 CSS 中的 `--tree-shift-x`，所以桌面端的落花会跟着右移后的树冠出现，手机端也能使用归零后的偏移。

全屏小爱心使用的是文字字符 `♥`。脚本为它们随机设置颜色、大小、起点、终点和旋转角度，再交给 `heart-petal-drift` 关键帧播放。每片大约飘 16～25 秒，同时最多保留 16 片，动画结束后删除对应节点。

开始时会先放入 9 片，并设置随机的负延迟，让它们像是已经飘了一段时间。这个效果覆盖整个视口，滑到第二页也能看到。装饰层设置了 `pointer-events: none`，不会挡住按钮和滚动操作。

## 下滑的额外的“彩蛋”页面

第二页的文字直接写在 `index.html` 的 `afterword` 区域。它与第一封信的配置分开，使用正常的文章排版：内容宽度最多 `47rem`，居中显示，背景从首屏的淡黄色过渡到略暖的浅色。

`revealAfterword()` 在点击开场爱心时就取消了这一区域的 `hidden`。因此只要启动过页面，就可以往下阅读，不必等第一封信打完。底部箭头也在这个时候出现。

“向下滑动”这几个提示字稍后才显示。脚本观察的是第一节正文的第二行：

```js
const secondLine = document.querySelector("#letter .stanza p:nth-child(2)");
```

`MutationObserver` 检查这一行的文本节点，等第一个字开始打出，再把提示文字显示出来。称呼不算在这一节正文里。这里直接跟随打字的实际进度，调整前面动画的时长后，也不用另改一个固定倒计时。

箭头点击后会滚动到第二页；页面向下滚动超过 100 像素时，箭头和提示一起淡出，避免继续占着阅读区域。

第二页的文字也有动画，不过速度比首屏打字快。`IntersectionObserver` 观察每个段落，进入观察区域后，只触发一次：

```js
const observer = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		observer.unobserve(entry.target);
		showParagraph(entry.target);
	}
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
```

`showParagraph()` 把文字按 3、5、4、6 个字符的顺序循环分组，每组包进一个 `span`，后面的组比前面的组多延迟 28 毫秒。样式让它们从稍低、透明而模糊的状态回到正常文字：

```css
.afterword-token {
	position: relative;
	top: 0.4em;
	opacity: 0;
	filter: blur(2px);
	transition: top 0.32s ease, opacity 0.32s ease, filter 0.32s ease;
	transition-delay: var(--token-delay);
}
.afterword-token.is-visible { top: 0; opacity: 1; filter: none; }
```

读起来就是一小组一小组文字依次变清楚。段落触发后会解除观察，并记录已经显示过，往回滚动时不会重复播放。如果浏览器没有 `IntersectionObserver`，代码会直接处理全部段落。

## 音乐和减少动态效果的设置

背景音乐使用普通的 `<audio>`：

```html
<audio loop id="bgm" preload="none" src="/love/bgm.mp3"></audio>
```

页面初始化时把音量设为 `0.45`，但到点击爱心时才调用 `play()`，同时显示右下角的音乐按钮。按钮根据实际播放状态切换“播放背景音乐”和“暂停背景音乐”，`aria-pressed` 也会同步更新。播放失败时，页面仍然可以继续运行，按钮状态按音频的实际状态更新。

动态效果还读取了系统的 `prefers-reduced-motion` 偏好。开启减少动态效果后，有限的长树、开花过程会直接执行到完成，树的移动过渡被跳过，信直接显示完整内容。持续落花、开场爱心跳动、光标闪烁和箭头上下移动也会停用，第二页文字保持正常显示。

切换到其他标签页时，树冠落花会停止请求动画帧，全屏小爱心会清空并停止生成。回到页面以后再恢复。这两处针对的是持续落花，信的打字和树下轮播没有接入同样的页面可见性处理。

画布和装饰层使用了 `aria-hidden`，阅读内容仍留在 HTML 中。按钮有键盘焦点样式，固定在屏幕边缘的控制还考虑了 `safe-area-inset`，避免紧贴手机的安全区。

## 以后调整内容，可以从这里找

第一封信和树下句子在配置里，第二页文字在 HTML 里，树形和动画速度则各有自己的参数。常用的位置可以对照这张表：

| 想调整的内容 | 对应位置 |
| --- | --- |
| 入口显示的 `Falling for you` | `config.js` 的 `seedText` |
| 第一封信的称呼、正文和结尾 | `config.js` 的 `letter` |
| 树下轮播的句子和间隔 | `config.js` 的 `treeCaptions`、`treeCaptionInterval` |
| 第二页文字 | `index.html` 的 `afterword` 区域 |
| 入口下的更新时间 | `index.html` 的 `intro-updated` 和 `time` 元素 |
| 背景、文字颜色和排版 | `styles.css` |
| 树枝的位置、弯曲程度和粗细 | `js/tree.js` 的 `TreeShape.branches` |
| 树冠花朵数量和分布范围 | `js/tree.js` 的 `TreeShape.bloom` |
| 种子速度、开花速度和持续落花数量 | `js/animation.js` 的 `AnimationConfig` |
| 桌面端树的横向移动距离 | `styles.css` 的 `--tree-shift-x`，它会被落花脚本读取 |
| 背景音乐和初始音量 | `bgm.mp3`、`js/ui.js` 的 `initMusic()` |

有几处容易漏掉。`seedText` 会更新入口旁的文字，但浏览器标签页的 `<title>` 和按钮的 `aria-label` 仍写在 HTML 中。入口上的“最后更新时间”也是手动填写的，不会读取文件的修改日期。

`Seed` 类里保留了 `drawText()` 和 `hover()`，当前入口走的是 HTML 按钮：`main.js` 调用的是 `seed.drawHeart()`，没有调用那套 Canvas 文字绘制和像素命中判断。查入口文案或点击行为时，直接看 `initContent()` 与按钮事件更容易找到实际生效的位置。

资源地址都以 `/love/` 开头。以后如果换一个访问路径，需要一起调整 HTML 中的样式、脚本、图标和音乐地址。代码仍使用普通脚本间的全局引用，单独拷走某一个 JavaScript 文件也不会得到完整效果。

页面还写了 `noindex, nofollow, noarchive`，并用 `data-pagefind-ignore="all"` 排除站内搜索收录。这些标记控制的是收录行为，页面本身没有访问密码。后续会添加。
