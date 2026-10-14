---
title: 莱茵生命档案的代码实现和细节
titleEn: Rhine Lab Archives — Implementation and Details
published: 2026-10-14
description: |-
  由无数切片组成和海洋
  现已开放源代码解析...
descriptionEn: |-
  An ocean made from countless slices
  The source code is now open, with an explanation of how it works...
image: random
tags: [展示]
tagsEn: [Showcase]
category: 展示
categoryEn: Showcase
author: Sky
comment: true
draft: false
---

这页基于 LBEILC 的 RhineLabUI 改编，保留了原工程的开场、三维模型和交互方式，下面按当前这版代码，记录页面里这些效果是怎样接起来的。具体剧情就不展开了，主要看内容与画面的关系。

## 先把页面和文件对上

项目使用 TypeScript、Three.js 和 Vite，没有引入 React 或 Vue。HTML 入口很短，主体只有一个舞台容器：

```html
<main id="viewport"><div id="stage"></div></main>
<script type="module" src="/src/main.ts"></script>
```

`main.ts` 负责建立界面，Three.js 的画布放在 `three-scene` 中。开场文字、检索窗口和阅读正文都是 DOM 元素；档案阵列、玻璃材质、光照和镜头则在 WebGL 场景里。

读源码时，可以先按画面里的功能找文件：

| 文件或目录 | 对应的页面内容 |
| --- | --- |
| `src/main.ts` | 页面结构、模式切换、选档、详情、检索和设置入口 |
| `content/archives.json`、`src/data.ts` | 档案正文、分类、编号与数据入口 |
| `src/boot.ts`、`src/boot-motion.ts`、`src/boot-*-tracks.ts` | 开场文字、标志、扫描圆环和时间轴 |
| `src/startup.ts` | 资源准备、点击进入、声音失败后的重试与无声入口 |
| `src/scene.ts` | 三维阵列、选中模型、抽取、归位和镜头 |
| `src/archive-layout.ts`、`src/archive-loop.ts`、`src/archive-drag.ts` | 内容位置、首尾循环、拖动与惯性 |
| `src/motion.ts` | 阵列波浪、静止起伏、抽取高度和运动阻尼 |
| `src/decryption.ts`、`src/glass-reveal.ts`、`src/document-decryption.ts` | 解密线、玻璃清晰度与正文遮罩 |
| `src/model-viewer.ts`、`src/viewer-camera.ts` | 独立模型查看器、拆解和视角复位 |
| `src/viewport-layout.ts`、`src/responsive.css` | 桌面、紧凑窗口和手机竖屏的布局 |
| `src/render-quality.ts`、`src/motion-preferences.ts` | 画质参数与各项动态效果开关 |
| `src/audio.ts`、`src/pwa.ts` | 音乐、交互声音、离线资源与更新入口 |
| `public/assets/`、`art/` | 页面使用的 GLB，以及 Blender 工程和建模脚本 |
| `scripts/archive-content.mjs`、`scripts/export-records.mjs` | 内容校验、TXT 下载文件与档案目录生成 |

目录里还留着 Wallpaper Engine 工作台、音乐律动和一些对照实验。它们有各自的入口和构建条件，普通网页主要走开场、阵列与详情这条路径。看见某个模块存在时，还需要回到 `main.ts` 确认它在什么条件下启用。

## 内容都放在一份 JSON 里

当前 `archives.json` 有 169 份档案，编号从 `X-001` 到 `X-169`。数量按实际数据统计如下：

| 分类 | 数量 |
| --- | ---: |
| 魔神任务 | 50 |
| 传说任务栏目 | 79 |
| 世界任务 | 16 |
| 典籍藏书 | 16 |
| 旅途拾语 | 8 |

这里的“传说任务”是界面栏目，包含 61 份正式传说任务和 18 份部族纪闻。栏目名称与条目的实际类型分开记录，不能直接把 79 都算成正式传说任务。这个表只说明本项目当前收录的数量。

每份档案除了中英文标题，还有地域、篇章、相关人物、概述、分节叙述、阅读札记和资料出处。字段与画面可以这样对照：

| 字段 | 显示在哪里 |
| --- | --- |
| `id` | 选档编号、收藏记录和 TXT 文件名 |
| `title`、`en` | 中文标题与英文目录标题 |
| `category` | 分类标签、检索筛选与三维列的归属 |
| `department` | 详情里的“地域”，沿用了原工程的字段名 |
| `date` | “篇章 / 出处”；在这版里记录任务类型、章幕或选读范围 |
| `taskParts` | 世界任务系列的分部与正式标题 |
| `lead` | 相关人物、作者或叙述者 |
| `abstract` | 第一个页签“概述” |
| `narrative` | 第二个页签“详细叙述”，每节有标题和正文 |
| `findings` | 第三个页签“阅读札记” |
| `source` | 详情底部的资料出处，以及导出文本中的来源 |

数据通过 `src/data.ts` 进入页面：

```ts
export const records: ArchiveRecord[] = content.records;
export const categories = ["全部档案", ...content.categories];
export const archiveColumns = content.columns;
```

检索分类和三维列使用同一组名称，但顺序可以不同。阵列从左到右是世界任务、传说任务、魔神任务、典籍藏书、旅途拾语，让魔神任务位于中央。

界面里出现的 `JOURNEY DATABASE` 对应的就是这份静态资料。内容随项目提供，阅读和检索都在浏览器中完成。

## 开场按同一条时间轴播放

默认启用声音时，页面先准备模型和字体，再等待点击或按键进入。`StartupGate` 管理这一层入口：资源没准备好时按钮不可用，准备完成后才显示“点击进入”。点击还会解锁浏览器的音频播放，声音未就绪时可以重试，也可以无声进入。

开场进入以后，`BootSequence` 根据当前时间更新文字、SVG 标志与圆环。标志的笔画通过 `strokeDasharray` 和 `strokeDashoffset` 控制显示长度；圆环则根据半径、起始角和弧长重新计算路径，几个小圆和橙色点各有自己的轨迹。

`bootMotion()` 保留了参考片的时间坐标：

```ts
const t = appTime + 5;
const f = Math.floor(t * 25 + 0.00001);
```

`t` 对应原参考片的秒数，`f` 是按 25 帧计算的帧号。当前开场从白底部分开始，正常启动的起点对应原片约 6.76 秒。代码里的这些时间需要结合坐标原点看，不能都当成点击以后经过的秒数。

文字出现、扫描、欢迎画面和后面的阵列入场，都从当前播放时间取状态。连续的位置变化使用采样轨迹插值，短暂的闪变则按帧号判断。浏览器逐帧绘制 DOM、SVG 和三维场景，原参考视频只用于测量与对照。

页面的主要模式只有三个：

```ts
type Mode = "boot" | "archive" | "detail";
```

`setMode()` 会一起更新舞台状态、界面可操作性、声音场景和三维目标。这样，从开场跳到阵列，或者从阵列进入详情时，文字与模型都切换到同一个模式。

开场可以跳过，也可以从页脚重播。完整播放时，它会接着演示阵列入场、选中档案和抽取，最后进入详情。

## 玻璃档案从哪里来

三维档案来自 `public/assets/archive-cassette.glb`。`art/` 中保留了对应的 Blender 工程，以及外壳、内构和拆解模型的制作脚本。网页运行时加载导出的 GLB 就够了。

`ArchiveScene.load()` 读取模型，遍历其中的网格，再按材质名称处理玻璃、陶瓷内构、边框和紧固件。选中模型的玻璃基础参数有这一段：

```ts
mat.color.set("#fffdfa");
mat.transmission = 0.9;
mat.thickness = 0.12;
mat.roughness = 0.21;
mat.ior = 1.46;
mat.attenuationColor = new THREE.Color("#eee6df");
mat.attenuationDistance = 2;
```

`transmission` 控制透射，`thickness` 和 `ior` 参与玻璃的折射表现，`roughness` 决定表面的粗糙程度。这是加载时的基础设置，后续选中状态和解密过程还会继续调整材质。

场景里的暖灰背景、柔和阴影、远处雾气和景深共同决定了档案的前后层次。

背景阵列使用 `InstancedMesh`：

```ts
const inst = new THREE.InstancedMesh(geom, arrayMat, count);
```

同一类零件共用几何与材质，每个档案位置通过实例矩阵改变。外壳、边框和紧固件可以批量绘制；选中的那份则用独立模型保留更完整的内构，便于抽取和近距离观察。

档案上的标签也会随选档更新。`drawLabel()` 在 Canvas 上写入 `TEYVAT LOG`、编号和标记，再把 Canvas 作为纹理贴到模型上，因此无需为每个编号准备一张图片。

## 那排档案为什么滑不到头

这里要分清三件事：JSON 里的内容、内容所属的列，以及屏幕上正在绘制的档案位置。

`createArchiveLayout()` 先按分类建立索引，再为每份内容记录 `lane`、`row` 和 `slot`。分类可以有不同数量，内容槽位按最长的一列扩展。当前最长列有 79 份，代码保留前面的 12 行偏移后，`slotRows` 是 91。

这些内容槽位与开场的固定阵列分开。原片对照保留 160 个物理位置，正常交互则会根据实际镜头和视口计算需要显示的位置。新增一份正文，不需要连带修改开场的模型数量和动作。

首尾循环使用的取余函数很短：

```ts
export function wrap(value: number, count: number) {
  return ((value % count) + count) % count;
}
```

它也处理负数，因此向前越过第一项后，仍能得到最后一项的索引。五个分类按五列循环，每一列的内容再按自己的条数循环：

```ts
export function fileAtCell({ lane, row }: ArchiveCell, origin: ArchiveCell = { lane: 0, row: 0 }) {
  const files = columnFiles(wrap(lane + origin.lane, archiveColumns.length));
  return files[wrap(row + origin.row - 12, files.length)];
}
```

画面位置可以继续向前，内容编号则在这一列中重新循环。`nearestOccurrence()` 会寻找靠近当前画面的同一条内容，方向键跨过首尾时也继续向相邻位置移动，不会突然倒着滑回去。

切换分类时，`columnMemory` 保留各列最近选中的内容。看完一个世界任务，切到书籍，再切回来，仍然能回到刚才的位置；这份选择记忆在当前页面会话中维护。

底部最多显示八个刻度。`fileTickWindow()` 从当前选档附近取出一段窗口，计数器则显示该列的实际总数。所以 79 份内容的一列依然只有八个可见刻度，翻阅时窗口跟着移动。

编号和标题的滚动来自 `@kitlangton/rolling-number`。数字保留两位或三位格式，标题使用 `createRollingText()`，时长统一为 460 毫秒。快速连续选档时，显示内容继续向最新目标滚动；进入详情后则结束滚动，直接留下最终标题。

## 拖动、惯性和选档波浪

阵列在透视镜头下是倾斜的，屏幕上的水平移动与竖直移动都可能影响列和行。`ArchiveDrag` 会先计算这两个三维方向在屏幕上的投影，再求逆，把指针位移换回两个轨道的移动量。

拖动可以沿斜向走，也可以在中途转弯。代码保存最近约 120 毫秒的运动样本，松手时估算真实速度；如果松手前已经停住，就不再追加明显的滑行。

`ArchiveMomentum` 的减速部分是这样：

```ts
const decay = Math.exp(-this.friction * dt);
this.value += (this.velocity * (1 - decay)) / this.friction;
this.velocity *= decay;
```

这里的摩擦系数是 `2.4`。滑行距离取决于松手速度，速度降下来以后，再用弹簧运动吸附到附近的整格位置。列与行共用自由滑行阶段，斜向拖动松手后仍能沿着原方向减速。

选档时，当前模型会轻抬，附近的档案同时产生波浪。主要计算在 `baselineSelectionWave()` 中：

```ts
export function baselineSelectionWave(distance: number, age: number) {
  if (age < 0 || age > 3.2) return 0;
  return (
    0.8 *
    smooth(age / 0.2) *
    Math.exp(-age * 1.15) *
    Math.cos((distance - age * 8) * 0.58) *
    bell(distance - age * 8, 3.4)
  );
}
```

`distance` 是离这次选档位置的距离，`age` 是触发以后经过的时间。`age * 8` 让波峰向外传播，指数衰减让它慢慢平息，余弦保留了波峰后面的波谷。每个档案都按自己的位置取高度，相邻档案连起来才形成一片波浪。

选中模型的预览抬升目标是 `0.4` 个场景单位。停止操作一段时间后，阵列还可以用 `idleWave()` 做轻微起伏。波浪、静止起伏和拖动惯性都有独立的动态效果开关。

## 打开档案时，模型和镜头各做一件事

点击 `ACCESS FILE` 或按 Enter，会让页面进入 `detail`。选中档案沿竖直方向升起，交互详情的目标抬升高度是：

```ts
export const INSPECTION_LIFT = 4.05;
```

模型的位置更新中，抬升量只加在纵坐标上：

```ts
this.model.position.set(
  chosen.x - trackX,
  chosen.y + field(selectedRow, selectedLane) + this.lift.value + hoverLift(this.selectedCell) - this.presentationDrop(this.selectedCell),
  chosen.z + entryZ + this.rail.value,
);
```

镜头随后调整方向、距离与观察目标，完成从整排档案到单份详情的构图。桌面端模型留在左边，右侧出现正文。抽取仍然发生在原来的阵列位置上，近景由镜头负责。

旋转检查要等档案获得净空。代码会计算附近档案的顶部，确认当前模型已经抬到足够高的位置，再允许拖动旋转。

返回阵列时，档案先在当前高度转正，再下降。快速换选时，旧档案会暂时保留自己的模型和归位状态；如果又选回它，就接着当时的升降与旋转位置继续运动。这个处理让连续操作时的动作能接得上。

## 玻璃变清楚，正文也跟着揭开

解密分成几个阶段：等待、两端连线、保持连接、向中间收束、玻璃揭示，最后完全清晰。`DecryptionController` 把这些阶段整理成一个 `DecryptionFrame`，模型、叠在画面上的线和正文都读取它。

解密线的端点写在模型坐标里。`InspectionOverlay` 通过当前模型与镜头把坐标投影到屏幕，所以镜头移动时，线仍然贴着同一块档案表面。

玻璃的清晰范围从上往下推进。`glass-reveal.ts` 根据进度和盖板上的高度计算当前区域的清晰程度，磨砂端的粗糙度为 `0.42`，清晰端为 `0.025`。过渡边缘带着一小段柔化范围，移动过程中会看到上半部分先清楚，随后下半部分也逐渐显露。

正文的遮罩使用同一条解密进度。等玻璃开始变清楚，文字遮罩才开始移开：

```ts
if (this.started === null && frame.clarity > 0) this.started = now;
if (this.started !== null)
  this.progress = Math.min(1, Math.max(0, (now - this.started) / 0.95));
```

`DocumentDecryption.refresh()` 会遍历实际文本节点，用 `Range.getClientRects()` 测量每一行文字，然后为这些行添加装饰遮罩。标题换行、正文变长，都能按真实排版生成遮罩，原来的文字节点保留在文档里。

字体分包加载完成后，文字宽度可能变化，代码还会重新测量遮罩，同时保留已经进行到的揭示进度。这里需要跟着实际排版走，固定几根黑条很难对齐不同长度的内容。

## 正文的四个页签

详情页依次提供“概述”“详细叙述”“阅读札记”和“阅读足迹”。标题、地域、篇章和相关人物放在页签上方，收藏与导出放在阅读区下方。

“详细叙述”由 `renderNarrative()` 生成。任务类条目先显示篇章和任务标题，世界任务还会列出系列分部；随后逐节输出标题和正文：

```ts
record.narrative.map((section) => `<section class="narrative-section"><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.text)}</p></section>`).join("")
```

数据按纯文本处理，再经过 `escapeHtml()` 写入模板。JSON 里的 Markdown 标记不会自动变成富文本，正文层次由 `heading`、`text` 和数组结构决定。

任务、书籍和拾语使用不同的说明文字，详细叙述也明确提示包含情节信息。概要与札记是编辑内容，资料出处单独保留在详情底部。

“阅读足迹”只记录当前会话。打开详情时，`recordAccess()` 把编号与时间放进内存数组；页签最多显示当前档案最近四次访问。它和持久化收藏分开，刷新页面后不会继续保存这份足迹。

切页签时，正文短暂淡入，下划线移动到新按钮的位置。收藏操作只改按钮、数量和反馈，不重新建立整块详情，因此当前页签和阅读位置可以保留。

## 模型可以单独拆开看

详情里的“360° 查看档案模型”打开的是独立场景。它有自己的镜头、控制器与模型实例，主阵列暂停绘制，当前档案选择继续保留。

这里加载 `archive-assembly.glb`。各个网格通过 `userData.assemblyPart` 分进六组：紧固件、透明盖板、折射环组、光学核心、信息基板、背板与框架。

拆解由一个公共进度 `spread` 控制：

```ts
for (const part of PARTS) {
  this.groups.get(part.id)!.position.z = part.depth * this.spread.value;
}
```

每组的 `depth` 不同，进度从 0 走到 1，各层就沿局部 Z 方向分开；重组时回到 0。它们使用同一个进度，拆到一半切换成重组也能从当前位置接着走。

旋转、平移和缩放通过 `OrbitControls` 接收输入，再由 `ViewerCameraMotion` 平滑更新实际镜头。桌面支持拖动、滚轮和方向键，手机支持单指旋转、双指缩放与平移。清晰与磨砂的切换独立于拆解进度，不会把当前观察角度重置。

关闭查看器时，会释放本次模型的几何、材质和标签纹理，并把焦点还给打开它的按钮。模型载入途中关闭窗口也会取消这次请求的接入，避免较晚返回的资源重新出现在已经关闭的窗口里。

## 检索、收藏与导出

检索窗口把编号、中文标题、英文标题、地域和人物连成可搜索的字符串，再结合分类与收藏状态筛选：

```ts
(modal !== "saved" || saved.has(r.id)) &&
(filter === "全部档案" || r.category === filter) &&
`${r.id} ${r.title} ${r.en} ${r.department} ${r.lead}`
  .toLowerCase()
  .includes(searchQuery.toLowerCase())
```

这是一段浏览器中的子串匹配，英文大小写不会影响结果。当前搜索范围是上面列出的字段，详细叙述不在这段检索字符串里。点击结果后，窗口先完成退出，再选中并打开对应档案。

收藏使用稳定编号，并保存在当前浏览器中：

```ts
const saved = new Set<string>(readLocal<string[]>("teyvat-saved", []));
```

设置保存在另一个键 `teyvat-settings` 中。这样，提瓦特改编版的收藏与偏好有自己的命名空间。新增内容时继续追加编号，已有编号保持不变，才能让收藏仍指向原来的条目。

`EXPORT` 下载的是预先生成的 UTF-8 TXT，文件名形如 `TEYVAT-X-001.txt`。网页、下载正文和 Markdown 档案目录都从 `archives.json` 生成，避免另外维护一份文本后漏掉更新。TXT 包含概述、详细叙述、札记和来源，当前会话的阅读足迹不写进下载文件。

弹窗出现时，背景界面设为 `inert`，焦点留在窗口内；退出结束后才移除节点并恢复焦点。检索框输入、页签方向键和阵列导航也各自处理，打字时不会同时把档案切走。

## 手机上的模型和阅读区域

这页用宽高比判断竖屏，并另外处理窄窗口与触摸横屏：

```ts
const portrait = width / height < 1.05;
const compact = portrait || width < 1100 || (coarse && height < 600);
const scale = compact ? 1 : height / 1080;
```

桌面沿着 1080 高度的基准缩放界面，紧凑布局使用实际像素尺寸。镜头的显示范围和模型构图则由 `archiveFraming()` 计算。

竖屏详情把模型放在上方，正文放进下方独立滚动区：

```css
[data-layout="portrait"] .detail-content { left: var(--edge); right: var(--edge); width: auto; top: 54%; bottom: 40px; padding-top: 12px; border-top: 1px solid #aaa496; }
```

正文变长后，可以继续在阅读区内滚动，模型留在上面。紧凑布局也调整了字号、按钮高度和检索结果列，模型手势与文字滚动分别处理。

手机软键盘弹出时，`fit()` 读取 `visualViewport`，更新弹窗可用的顶部位置和高度。这个变化主要调整窗口，不会为了键盘重新安排整个三维阵列。

开场另有铺满实际视口的布局，显式的逐帧对照才固定使用 `1920 × 1080`。检查适配时，需要区分开场舞台和进入阅读后的布局。

## 画质与动态效果分开设置

画质预设包括性能、原始、高和极高，也可以自定义。参数涉及渲染比例、像素密度、阴影、环境遮蔽、景深、抗锯齿、透射分辨率与纹理过滤。

`renderDimensions()` 会先计算请求的像素比例，再受像素预算与设备纹理尺寸限制：

```ts
const ratio = Math.min(
  requested,
  Math.sqrt(pixelBudget / Math.max(1, width * height)),
  maxTextureSize / Math.max(1, width, height),
);
```

普通模式的默认预算是 `8_294_400` 像素，超级性能模式使用 `921_600`。这些限制作用于三维画布与相关渲染目标，DOM 正文仍按正常字号显示。

超级性能模式还会关闭部分光影与后期处理，简化背景材质，保留选中档案的结构。它读取一套有效画质配置，原先保存的自定义设置继续保留，关闭以后可以恢复。

动态效果另有完整、减少和自定义选项。开场、波浪、惯性、抽取、模型解密、正文揭示、滚动标题和查看器动作都可以分别控制。首次进入会参考系统的减少动态效果偏好，已经保存的页面设置优先。

明暗切换也有自己的过渡。`ThemeWave` 以当前选中的位置为起点，根据行列距离给各份档案安排延迟，玻璃阵列逐张换色，背景与文字同步变化。切到一半再反向切换，会从已经显示出来的颜色继续计算。

渲染内部也做了几项减少重复工作的处理。阵列按镜头计算可见范围，裁掉屏幕外的实例后紧凑提交；共同移动的零件共享实例矩阵。画面静止时，还会比较镜头、材质、纹理和模型状态，输入相同时复用已经绘制的画布。

因此页面的更新循环还可以继续维护选择和输入状态，同时省去重复的三维绘制。阴影和部分深度数据也在同一帧中复用；实际成本仍会随画质和设备变化。

## 声音和离线资源

背景音乐分成 `atmosphere`、`motif` 和 `pulse` 三条轨道，使用 Web Audio 同步循环。开场、阵列、详情和查看器分别调整三条轨道的音量比例，切换时用渐变衔接，音乐的播放位置继续保留。

交互声音单独处理：切档、抽取、归位与拆组使用玻璃声，窗口操作和启动反馈使用电子音；逐字输入使用原参考片记录的短音采样。快速操作时，代码会限制同类声音的触发间隔和同时播放的数量。

声音与音乐有独立开关和音量。完整开场的声音读取同一条时间轴，大幅跳过时间时会停止当前效果，不把漏过的提示音集中补播。

项目也保留了 PWA 功能。开发模式不注册 Service Worker；生产模式满足安全上下文等条件后，才准备离线副本。

`scripts/pwa-worker.js` 按构建版本缓存页面、脚本、模型、字体与下载文本。只有一整套资源保存成功，这个版本才完成安装；中途失败会删除该次不完整缓存，已有版本继续保留。

新版本准备好以后显示更新入口，正在阅读的页面不会被主动重载。点击更新后，再通知等待中的 Service Worker 接管并重启页面。

模型的正式资源名还带着内容哈希，由 `vite.config.ts` 生成。Blender 导出的稳定文件名继续保留，生产资源地址则能对应到具体文件内容。

## 后面维护时，从哪里改

日常维护可以先按内容、画面和交互分别找入口：

| 要调整的内容 | 主要位置 |
| --- | --- |
| 增加条目、修订正文或来源 | `content/archives.json` |
| 分类与三维列的顺序 | JSON 的 `categories`、`columns` |
| 详情字段、页签和检索范围 | `src/main.ts`、`src/archive-narrative.ts` |
| 开场文字、轨迹和显示时机 | `src/boot-motion.ts`、各个 `boot-*-tracks.ts`、`src/boot.ts` |
| 抽取、归位、波浪与镜头 | `src/motion.ts`、`src/scene.ts` |
| 玻璃揭示与正文遮罩 | `src/glass-reveal.ts`、`src/decryption.ts`、`src/document-decryption.ts` |
| 查看器部件与拆解距离 | `src/model-viewer.ts` 的 `PARTS`，以及拆解 GLB 的部件标记 |
| 配色和阅读排版 | `src/style.css`、`src/theme.css`、`src/responsive.css` |
| 画质和动作预设 | `src/render-quality.ts`、`src/motion-preferences.ts` |
| 音乐与交互声音 | `src/audio.ts`、`public/audio/` 和音频生成脚本 |
| 修改模型本体 | `art/` 的 Blender 工程和脚本，导出到 `public/assets/` |

内容新增到数组末尾，使用紧接上一条的编号。五类都保持非空，世界任务填写系列分部；字段规则在 `content/README.md` 中。

`scripts/archive-content.mjs` 校验编号、字段、分类、分节正文和来源链接格式，再由导出脚本同步 TXT 与目录。字段验证能检查数据结构，剧情、正式任务类型和资料出处仍需要单独核对。

修改内容后，项目提供的同步与检查命令是：

```powershell
npm run export:archives
npm run check:content
npm run check:viewport
npm run build
```

其中导出会更新 `public/archives/` 和 `docs/GENSHIN-CATALOG.md`，开发与构建的前置脚本也会执行这一流程。
