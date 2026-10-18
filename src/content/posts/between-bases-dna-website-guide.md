---
title: 碱基之间：脱氧核糖核酸展示网站的技术实现与知识库展示
titleEn: "Between Bases: Building a DNA Showcase and Knowledge Base"
published: 2026-10-18
description: |-
  脱氧核糖核酸及碱基展示项目技术现已开源
  现已开放源码技术解析......
  “生命的重量...”
descriptionEn: |-
  The DNA and nucleotide base showcase project is now open source
  A technical walkthrough of the source code is now available......
  “The weight of life...”
image: random
tags: [展示]
tagsEn: [Showcase]
category: 展示
categoryEn: Showcase
author: Sky
comment: true
draft: false
---

这是一个基于Three.js 的基本科普项目。作为一个基本展示的页面，我对网页进行了多轮打磨和技术调整。

## DNA、基因和染色体，先看层数。

DNA 是一种由核苷酸连接而成的分子。每个核苷酸包含糖、磷酸和碱基，A、T、G、C 记录的是碱基种类：腺嘌呤、胸腺嘧啶、鸟嘌呤和胞嘧啶。常见双链 DNA 的两侧是糖—磷酸骨架，碱基在内部配对，A 对 T，G 对 C。序列条只把其中的碱基写出来，并没有画出整个核苷酸。[NHGRI 的 DNA 介绍](https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet)可以对照这层关系。

基因则是在序列与功能的层面辨认的区段。蛋白质编码基因提供合成多肽所需的序列信息，还有一些基因以功能性 RNA 为产物。把所有基因都理解成“一份蛋白质配方”，会漏掉后面这一类。后面的 DNA→RNA→多肽实验，讨论的是蛋白质编码片段。[NHGRI：Gene](https://www.genome.gov/genetics-glossary/Gene)

再看真核细胞中的包装：DNA 与组蛋白等蛋白质一起组织成染色质，核小体是其中的基本组织单元。网站用第二件展品展示 DNA 怎样绕在组蛋白核心外面；这份结构覆盖的是局部，并不是一条完整染色体。[RCSB：1AOI](https://www.rcsb.org/structure/1AOI)

页面里的结构图、基因区段图和核小体图，因此各有自己的观察尺度。`ScientificFigure.astro` 会注明哪张来自实验坐标，哪张只是教学示意，也没有把首页那段很短的 DNA 标成一个完整基因。

## 首页的双螺旋，有一份具体的数据来源

网站的两个模型都使用 PDB 实验结构，坐标、结构元数据和二维投影一起保存在项目里：

| 展品 | 这份结构里有什么 | 实验方法与分辨率 |
| --- | --- | --- |
| [1BNA](https://www.rcsb.org/structure/1BNA) | 合成的 B 型 DNA，两条链各 12 个核苷酸，组成 12 对碱基 | X 射线衍射，1.90 Å |
| [1AOI](https://www.rcsb.org/structure/1AOI) | 146 对碱基的 DNA，绕在组蛋白八聚体外侧 | X 射线衍射，2.80 Å |

`bp` 是碱基对数量。1BNA 的两条链各有 12 个核苷酸，所以是 24 个核苷酸、12 bp。1AOI 的两条 DNA 链各有 146 个核苷酸，配成 146 bp；核心含 H2A、H2B、H3、H4 各两条组蛋白链。这些数字对应各自的实验体系，不能拿来代表所有 DNA 或核小体的完整状态。

模型载入使用 3Dmol.js。`ModelViewer.tsx` 把保存的 PDB 文本交给引擎：

```ts
v.addModel(pdb, 'pdb');
atoms.current = v.selectedAtoms({hetflag:false});
```

接下来按链、残基和原子设置显示方式。页面提供球棍、空间填充和结构概览：球棍便于找原子与连接，空间填充便于比较占据的空间，概览则简化骨架与蛋白质走向。颜色也是辨认工具，可以按链、碱基或元素切换，不是分子的真实颜色。

转动模型改变的是观察视角。这里没有计算分子动力学，也没有演示双螺旋在细胞中怎样不断运动。隐藏核小体的蛋白质部件，同样只是暂时隐藏显示，不能把这个按钮理解成一次真实的解离实验。

## 互补链的方向

DNA 两条链反向平行。5′ 和 3′ 来自糖上碳原子的编号，说明链的化学方向；把图转过去，方向关系依然成立。[OpenStax：DNA 的结构](https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing)

拿一段短序列来看：

```text
输入链       5′-ATGC-3′
对齐的互补链 3′-TACG-5′
```

逐位配对以后，下面那条链从左到右是 3′→5′。如果也要按通常的 5′→3′顺序记录，就需要从另一端开始写：

```text
反向互补链   5′-GCAT-3′
```

配对与倒转书写顺序是两个动作。`src/lib/biology.mjs` 把它们分开实现：

```js
export function complement(input) {
  const seq = normalizeSequence(input);
  const pairs = {A:'T', T:'A', G:'C', C:'G'};
  return [...seq].map(c => pairs[c]).join('');
}

export function reverseComplement(input) {
  return [...complement(input)].reverse().join('');
}
```

实验台会同时显示输入、对齐的互补链和反向互补结果，端点标签也跟着当前书写方向变化。只看字母串，很容易把 `TACG` 与 `GCAT` 混在一起；保留 5′、3′，就知道每一行是怎样读的。

输入检查也在计算前完成。页面接受 1～300 个碱基，先去掉空白并统一大小写，再按 DNA 的 `ATGC` 或 RNA 的 `AUGC` 检查。DNA 模式下输入 U，会明确提示切换类型或修改字符，错误结果也不会继续留在右边。

## 在转录之前，先设置好转录的链条

转录中，RNA 聚合酶以 DNA 的模板链为依据合成 RNA。模板按 3′→5′被读取，新 RNA 按 5′→3′延长。编码链与相应 RNA 在同方向上的序列相对应，只是 DNA 使用 T，RNA 使用 U。[OpenStax：转录](https://openstax.org/books/biology-2e/pages/15-2-prokaryotic-transcription)

因此，“把 T 换成 U”有一个前提：手里拿的是已经按 5′→3′书写的编码链。换成模板链，就还需要处理互补和方向。

默认教学片段可以有下面几种输入方式，它们对应同一段 RNA：

| 输入身份 | 书写方向与序列 |
| --- | --- |
| 编码链 | `5′-ATGGCTGAATAA-3′` |
| 模板链，按位置对齐 | `3′-TACCGACTTATT-5′` |
| 同一模板链，改按 5′→3′书写 | `5′-TTATTCAGCCAT-3′` |
| 对应 RNA | `5′-AUGGCUGAAUAA-3′` |

`transcribe()` 中处理链身份和方向的部分如下：

```js
if (identity === 'coding') {
  if (direction === 'reverse') seq = [...seq].reverse().join('');
  return seq.replaceAll('T', 'U');
}
if (direction === 'forward') seq = [...seq].reverse().join('');
return complement(seq).replaceAll('T', 'U');
```

在这个函数里，`forward` 表示输入按 5′→3′书写，`reverse` 表示按 3′→5′书写。输出统一为 5′→3′ RNA。

界面的链身份和方向是独立状态，换页签也会保留。计算依据始终摆在输入旁边，方便比较同一条链换一种写法后，结果是否仍然一致。

这张实验台只换算对应序列，省略了起始、终止与 RNA 加工等过程。DNA 仍然是模板，RNA 是新合成的分子；页面里的箭头表示信息怎样被使用。

## 三个字母一组，为什么会读出不同结果

翻译以 mRNA 的密码子为单位，每三个核苷酸组成一组。密码子对应氨基酸或终止信号，多组依次读取后决定氨基酸的排列。网站采用 NCBI 标准遗传密码表 1。[NCBI：The Genetic Codes](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG1)

默认片段分组后是：

```text
编码 DNA  5′-ATG GCT GAA TAA-3′
RNA       5′-AUG GCU GAA UAA-3′
读取结果      M   A   E  Stop
```

这里的 M、A、E 是氨基酸单字母代码，依次为甲硫氨酸、丙氨酸和谷氨酸。UAA 是终止信号，不算第四个氨基酸，所以教学产物长度是 3。

`translate()` 使用一个包含 64 个三联体的 `CODON_TABLE`，逐组查询：

```js
for (let i = 0; i + 2 < seq.length; i += 3) {
  const codon = seq.slice(i, i + 3), aa = CODON_TABLE[codon];
  codons.push({codon, aa, position:i + 1});
  if (aa === '*') {
    result.stopPosition = i + 1;
    result.afterStop = seq.slice(i + 3);
    return result;
  }
  aminoAcids.push(aa);
}
```

`i + 2 < seq.length` 保证只处理完整三联体。遇到终止信号就结束本次读取，后面的 RNA 单独保存在 `afterStop`；没有遇到终止而剩下的一两个碱基，则保存在 `remainder`，不会强行补齐。

这页还预设了阅读框：必须从 RNA 第 1 位的 AUG 开始。第 1 位不是 AUG 时，演示停止，不会偷偷往后寻找另一个起点。真实翻译还涉及起始位点识别等条件，也存在标准表之外的遗传密码及其他起始情况。这个限制说清楚后，代码的结果才有明确含义。

界面中的 `SequenceLine` 用每三位一组的间距显示 RNA，再把每个密码子的结果列在下方。字母分组、位置编号和最终产物可以逐项对照，不用只相信一个最后的答案。

## 改掉一个碱基会如何变化、变化在哪

序列变了，编码结果可能不变，也可能换掉一个氨基酸、提前终止，或者改变后续的分组方式。网站给默认片段准备了四个固定样例：

| 样例 | 编码 DNA，按新的阅读框分组 | 本模型读出的产物 |
| --- | --- | --- |
| 原始片段 | `ATG GCT GAA TAA` | M–A–E |
| 第 6 位 T→C，同义 | `ATG GCC GAA TAA` | M–A–E |
| 第 9 位 A→C，错义 | `ATG GCT GAC TAA` | M–A–D |
| 第 7 位 G→T，无义 | `ATG GCT TAA TAA` | M–A，遇到提前终止信号 |
| 删除第 4 位 G | `ATG CTG AAT AA` | M–L–N，尾部 AA 不翻译，片段内没有终止信号 |

同义样例把 RNA 中的 GCU 改成 GCC，两者仍编码丙氨酸；这说明同一种氨基酸可以对应多个密码子。错义样例把 GAA 改成 GAC，对应的氨基酸由谷氨酸 E 换成天冬氨酸 D。删除一个碱基后，从删除位置之后的三联体分组发生变化，就是这里演示的移码。[MedlinePlus：变异类型](https://medlineplus.gov/genetics/understanding/mutationsanddisorders/possiblemutations/)

删除样例还保留了两种坐标。比较原始与修改序列时，“−”占着参考第 4 位的位置，后面的参考编号不动；真正翻译时，则用删除后的连续序列重新分组。前一种表示回答“原来哪里变了”，后一种回答“现在怎样被读取”。

代码通过原有的 `translate()` 计算修改结果，变异面板没有另一套独立的翻译规则。因此可以在序列页签与变异页签之间交叉核对。

这里比较的是教学片段的编码结果。同义不表示真实生物中必然没有其他影响，错义也不能单凭这个名称就判断致病性。页面没有把几个字母的变化直接换算成疾病或身体表现。

## 复制为什么一边连续，一边分段

前面的转录输出 RNA，DNA 复制则合成新的 DNA。半保留复制的含义是：完成后，每份双链产物包含一条亲代链和一条新合成链。[OpenStax：半保留复制](https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication)

理解前导链和后随链，要把两条规则放在一起：模板反向平行，DNA 聚合酶又只能把核苷酸接到正在生长的链的 3′端，让新链按 5′→3′延长。于是，在同一个复制叉，一侧能顺着复制叉推进方向连续合成；另一侧需要反复起始，先合成冈崎片段，再处理和连接。[OpenStax：复制叉与冈崎片段](https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes)

后随链的每一个新片段同样按 5′→3′合成。画面里的左右箭头方向不同，不能据此把其中一条新链说成按 3′→5′合成。

项目用六个离散步骤讲这个过程：

1. 识别两条亲代链。
2. 局部分开，形成复制叉。
3. 引物提供新链延伸的起点。
4. 前导链连续延伸，后随链分段延伸。
5. 处理引物、补齐与连接片段。
6. 展示两份各含一条旧链与一条新链的产物。

`ReplicationLab` 用 `useReducer` 管理当前步骤、播放状态和速度。下面是状态切换的一部分：

```ts
case 'pause':return {...state,playing:false};
case 'speed':return {...state,speed:[.5,1,2].includes(action.value)?action.value:state.speed};
case 'next':return {...state,step:Math.min(5,state.step+1),playing:false};
case 'previous':return {...state,step:Math.max(0,state.step-1),playing:false};
case 'jump':return {...state,step:Math.min(5,Math.max(0,action.value)),playing:false};
case 'tick':return state.playing?{...state,step:Math.min(5,state.step+1),playing:state.step<4}:state;
```

步骤范围固定为 0～5。暂停与调速保留当前的生物学步骤，下一步、上一步和直接跳转则结束自动播放。走到最后一幅产物图就停止。

自动播放每隔 `2800 / state.speed` 毫秒推进一步。这个数值决定展示节奏，六步之间并不代表相同长度的真实生物学时间。

图形由 SVG 路径与箭头组成，褐色表示亲代链，绿色表示新 DNA，短段标记 RNA 引物。窄屏使用单独的 `MobileReplicationDiagram`，重新安排文字和路径，保留相同的链方向与步骤关系。

## 四分之一的概率，并不是每四次就要出现一次。展示随机性。

遗传实验台使用一个虚构的二倍体单基因模型：只有一个基因座，两个等位基因 A、a，每位亲本用 AA、Aa 或 aa 表示。在正常分离等假设下，Aa 亲本形成的配子有一半带 A、一半带 a。这里的 A、a 是等位基因的记号，要与 DNA 序列里代表腺嘌呤的 A 区分开。

Aa×Aa 的四格组合是：

| 亲本 A 的配子 \ 亲本 B 的配子 | A | a |
| --- | --- | --- |
| A | AA | Aa |
| a | Aa | aa |

每格概率都是 1/4，两个 Aa 格合在一起，因此 AA、Aa、aa 的理论概率分别是 25%、50%、25%。这个推导可以对照 [OpenStax 的单基因杂交解释](https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits)。

`inheritance()` 直接枚举这四种组合：

```js
export function inheritance(parentA, parentB) {
  if (!['AA','Aa','aa'].includes(parentA) || !['AA','Aa','aa'].includes(parentB))
    throw new Error('请选择 AA、Aa 或 aa。');
  const probabilities = {AA:0,Aa:0,aa:0}, cells = [];
  for (const a of parentA) for (const b of parentB) {
    const genotype = [a,b].sort().join('');
    probabilities[genotype] += .25;
    cells.push({a,b,genotype});
  }
  return {probabilities,cells};
}
```

排序让 `aA` 与 `Aa` 合并到同一个基因型。AA×aa 虽然也枚举四个配子槽位，四格最终都落在 Aa，得到的就是 100% Aa。

“抽取 1 次”“再抽取 20 次”和“抽取 1000 次”另外调用随机抽样。每次用一个随机数决定落在哪个概率区间：

```ts
const draw = random();
const genotype = draw < probabilities.AA ? 'AA'
  : draw < probabilities.AA + probabilities.Aa ? 'Aa' : 'aa';
result[genotype]++;
```

页面把理论概率与累计频率并排画出来。次数少时频率可能偏得很明显；抽样增加后通常会更接近理论概率，但不保证每次追加一批都变得更近。已经出现几个 aa，也不会要求下一次必须用别的结果来“补齐比例”。

改变亲本时，抽样计数清零，理论概率重新计算；旧实验的次数不会混进新条件。

默认面板先展示基因型。勾选完全显性模型后，才把 AA 和 Aa 合并成同一种表型，得到此条件下的 3∶1。显性描述的是等位基因与表型的关系，并不表示这个版本一定更常见、更优越或更容易遗传。[NHGRI：Dominant](https://www.genome.gov/genetics-glossary/Dominant)

A、a 在这里没有绑定真实的人类性状。模型不包含复杂性状、连锁、选择或外显率，四格计算也不承担真实健康判断。

## 模型选中位置，靠的是链和编号

理解了配对，再看三维与二维序列怎样同步。`models.json` 保存链、残基和作者编号，点击序列按钮时，会把同一个链与编号交给三维高亮。

1BNA 的作者链 A 使用 1～12 号，作者链 B 使用 13～24 号。因此，当前结构中 A 的第 n 号与 B 的第 25−n 号配对。选择 A:5 时，页面同时高亮 B:20：

```ts
const paired = {
  chain:selection.chain === 'A' ? 'B' : 'A',
  resi:25 - selection.resi
};
```

这条计算依赖 1BNA 的具体编号。换一份 PDB 文件，残基编号与链的标记都可能变化，需要重新读取映射。

1AOI 就同时保留了两套链名称：

| 部件 | 作者链 `auth` | 标准标签链 `label` |
| --- | --- | --- |
| 第一条 DNA | I | A |
| 第二条 DNA | J | B |
| 一条 H3 组蛋白 | A | C |

在这份结构里，“链 A”单独出现时并不充分：作者链 A 是蛋白质，标签链 A 是 DNA。所选部位面板把两套名称与残基号一起显示，避免查资料与操作模型时指向不同对象。这一映射也能在 [RCSB 的 1AOI 记录](https://www.rcsb.org/structure/1AOI)中核对。

首页这段序列在 DNA 意义上是回文：`CGCGAATTCGCG` 反向互补以后，得到相同的字母串。两条链按各自的 5′→3′记录时，字母相同，方向仍然相反，所以观察任务会同时引导读者看端点标签和结构中的位置。

## 三维程序的预览逻辑

页面使用 Astro 生成静态 HTML，交互部分交给 React。首页、文章、词条和来源可以先作为普通页面读取；序列实验台、模型、搜索和阅读标记再接入浏览器状态。

实验页中，这一行会让 React 在页面加载后接管实验台：

```astro
<SequenceLab client:load/>
```

正文后的问答则使用 `client:visible`，等滚动到附近再激活。静态内容与需要操作的部分分别安排加载时机，长文章不必一开始就初始化所有控件。

三维又多分了一层。首页的 React 展品外壳先显示二维投影，`HeroExhibit.tsx` 等到点击以后才渲染动态导入的查看器：

```tsx
const Viewer = lazy(() => import('./ModelViewer'));
```

查看器启动时，才从本地加载 `/vendor/3Dmol-min.js` 并读取 PDB。React 控件已能响应点击，与重型分子引擎已经加载，是两件不同的事。

二维投影也来自同一份结构快照。`prepare-models.mjs` 读取 PDB 的坐标列：

```js
x:+l.slice(30,38),y:+l.slice(38,46),z:+l.slice(46,54)
```

再旋转、投影并生成 SVG。核小体预览简化了 DNA 与蛋白质的路径，页面会标明这一点。三维不能启动时，预览、序列和部件说明继续保留，读者仍然可以查位置。

## 能操作模型，也要能回到正常阅读

手机上滚动页面经过模型时，很容易把操作误送给画布。这个项目先显示“操作模型”按钮，明确进入操作状态后再接收触摸，也提供“退出操作，继续滚动”。序列很长时，在局部容器里横向滚动，不把整页撑开。

查看器的初始化与清理放在 React 的 `useEffect` 中。关闭时中止尚未完成的请求、断开尺寸观察，清理模型、形状、标签和画布；异步请求返回得较晚，也会先检查这一代查看器是否仍然有效。

3Dmol.js 当前版本在构造时注册的一部分全局事件，由 `createManagedViewer()` 单独记录，并在该查看器关闭时解除。反复打开、关闭以后，不应留下多套模型事件继续响应。

滚轮缩放也单独处理。函数先把不同滚轮单位的增量换算为 `px`，再计算倍率：

```js
return Math.exp(-Math.max(-160,Math.min(160,px))*.0018)
```

向上滚动的负增量产生大于 1 的倍率，向下滚动则小于 1，成对的相反增量会抵消。按钮和方向键提供另一种操作方式，观察不必依赖精确的鼠标拖动。

## 文章、术语和来源怎样串联

正文保存在 `src/content/articles/`，每篇 Markdown 带有文章编号、主题、前置阅读、相关内容、配图类型、问答和来源编号。Astro 根据 `slug` 生成独立地址，文章目录则从二级标题生成。

项目的数据与功能可以按这几个入口找：

| 文件或目录 | 用途 |
| --- | --- |
| `src/content/articles/` | 24 篇 Markdown 正文及元数据 |
| `src/data/topics.json`、`paths.json` | 12 个主题与 4 条阅读路线 |
| `src/data/glossary.json`、`sources.json` | 60 个术语、35 项来源记录 |
| `src/data/models.json`、`public/models/` | 两份结构的清单、映射与原始文件 |
| `src/lib/biology.mjs` | 配对、反向互补、转录、翻译和理论遗传概率 |
| `src/components/Labs.tsx` | 三张实验台的状态和显示 |
| `src/components/ModelViewer.tsx` | 结构显示、选择、观察任务与故障替代 |
| `src/components/ScientificFigure.astro` | 正文里的结构投影和教学示意图 |
| `src/lib/search.mjs`、`storage.ts` | 本地检索与阅读记录 |
| `scripts/validate-content.mjs` | 内容、来源关联和模型快照检查 |

文章正文中，部分术语会变成可原位打开的按钮。脚本优先识别较长的词，每个词只处理一次，最多放入十二处入口，并避开链接、代码和标题。读者可以看完定义，再回到原来的段落。

检索把正文、术语、模型与实验放进同一个索引。中文问题先分词、去掉常见虚词，再要求有意义的词都能匹配；标题命中加 50 分，别名命中加 25 分，普通正文命中加 3 分，完整查询出现在标题里还会加分。搜“DNA 和基因”，会更容易找到直接讨论这层区别的文章。

收藏与“已读完”记录保存在本机的 `between-bases-v1` 中。存储被禁用或写入失败时，当前页先保留内存状态，并提示关闭以后会丢失。序列输入与遗传抽样则只在当前页面计算，不加入阅读记录。

## 计算正确，还要说明解释依据是什么

这类网站有两种需要分别核对的内容。函数能否正确计算互补序列、按终止信号停下，可以用测试检查；某段解释是否省略了重要条件、引用是否支持结论，则还需要查资料。

项目的 31 项测试涵盖了标准密码表、几种转录输入、终止与尾部、九种亲本组合、模型链映射、搜索、存储和查看器清理。本版在本地执行，31 项全部通过。内容检查还会核对文章关联、来源编号及结构快照。

来源数据没有只存一个链接，还记录了支持范围、使用限制、访问日期和核对状态。结构文件保留 SHA-256，帮助确认页面读取的是哪一份快照；它能检查文件内容有没有变化，不能代替对科学解释的判断。

文章元数据也把编辑检查与专业审阅分开：

```yaml
status: published
review_status: editorial_checked
published_at: "2026-10-17"
updated_at: "2026-10-17"
scientific_reviewed_by: null
scientific_reviewed_at: null
```

其中 `editorial_checked` 表示已有编辑核对，专业审阅字段仍然为空。部分 NCBI 教材页面受访问验证限制，来源页也保留了实际核对到什么程度，没有把目录或索引检查写成全文审读。

后面修改文章时，需要一起检查正文的 `source_ids`、实际引用、相关文章和问答；更新模型时，还要核对链名称、残基编号、组装与二维投影。`biology.mjs`、实验界面与说明文字也应同步维护，才能让读者在文章里看到的规则，与动手计算得到的结果保持一致。

至此
Sky.
