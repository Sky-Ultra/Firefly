---
title: 花笺的便签实现原理与解析
titleEn: How Floral Notepaper Implements Desktop Notes
published: 2026-11-18
description: |-
  欢迎使用花笺，开源的轻量化便签.
  也是很实用的Markdown渲染阅读器哦
descriptionEn: |-
  Welcome to Floral Notepaper, a lightweight, open-source sticky notes app.
  It also makes a handy Markdown reader.
image: random
tags: [展示]
tagsEn: [Showcase]
category: 展示
categoryEn: Showcase
author: Sky
comment: true
draft: false
---

项目使用 Tauri 2、React 和 Rust。下面按 `main` 分支的 [8b624e0][snapshot] 这次提交阅读源码，配置中的版本号为 1.2.0。主要看笔记怎样保存、小窗怎样复用，以及 Markdown 与图片怎样显示。

## React 与 Rust

前端入口在 `App.tsx`，初始 URL 决定显示哪个界面：

```tsx
{activeView === "main" ? (
  <MainWindow />
) : activeView === "notepad" ? (
  <NotePad initialNoteId={route.noteId} />
) : (
  <TileShowcase noteId={route.noteId} />
)}
```

Rust 创建窗口时，也会给出相应地址。例如 `index.html?view=notepad` 打开便签，`index.html?view=tile&noteId=...` 打开指定笔记的磁贴。它们使用同一套前端资源，由各自窗口里的 React 管理界面状态。[入口代码][app]

文件操作通过 Tauri 命令进入 Rust。前端更新笔记的接口很短：

```ts
export function updateNote(id: string, request: SaveNoteRequest): Promise<Note> {
  return invoke("notes_update", { id, request });
}
```

Rust 侧在 `lib.rs` 注册对应命令：

```rust
#[tauri::command]
fn notes_update(app: AppHandle, id: String, request: SaveNoteRequest) -> Result<Note, AppError> {
    let note = default_store()?.update_note(&id, request)?;
    let _ = app.emit("notes-changed", ());
    Ok(note)
}
```

`NoteStore` 完成读写以后，命令返回更新后的笔记，并广播变更事件。React 负责输入和显示，Rust 负责本地文件与系统能力，两边通过命令和事件配合。这个调用方式可以对照 [Tauri 的命令文档][tauri-commands]，项目中的封装则在 [notes/api.ts][notes-api] 与 [lib.rs][commands]。

## Markdown 文件与索引

笔记正文直接保存为 `.md`，分类对应 `notes` 下的子目录。数据目录中主要有这些内容：

```text
数据目录/
├─ metadata.json
├─ notes/
│  ├─ UUID_标题.md
│  └─ 分类名/
│     └─ UUID_标题.md
├─ images/
│  └─ 笔记UUID/
│     └─ 图片UUID.png
└─ backgrounds/
```

`metadata.json` 保存编号、标题、文件名、分类、创建和更新时间、字符数与摘要。正常读取列表时，可以先取这些元数据，不必打开每篇正文；进入编辑时再按编号找到文件并读取内容。[笔记服务][note-store]

新笔记使用 UUID，标题会经过文件名处理，再拼到编号后面：

```rust
fn file_name_for(&self, id: &str, title: &str) -> String {
    let safe_title = safe_file_stem(title);
    if safe_title.is_empty() {
        format!("{id}.md")
    } else {
        format!("{id}_{safe_title}.md")
    }
}
```

这里把“识别笔记”与“方便人查看文件名”分开。修改标题可能改变文件名，笔记编号仍然保留。标题也不自动插进 Markdown 正文，正文保存的是输入的内容。

更新时先写新路径，再更新索引，最后清理被替换的旧文件。代码还会比较两个路径是否实际指向同一个文件，处理 Windows 上仅大小写变化的名称，避免清理旧名字时误删刚写入的内容。

JSON 索引使用临时文件替换：

```rust
serde_json::to_writer_pretty(&mut temp_file, value)?;
temp_file.write_all(b"\n")?;
temp_file.sync_all()?;
drop(temp_file);
fs::rename(&temp_path, path)?;
```

这段原子写入针对 JSON 文件，正文使用的仍是 `fs::write`，两者分别落盘。索引缺失时会扫描正文重建；解析失败时则尝试备份损坏索引，再重建可读取的记录。重建出的时间等信息可能与原索引不同，所以保留原件有用。[JSON 写入][json-io] · [索引重建][note-store]

## 保存状态

主窗口的保存状态有 `idle`、`dirty`、`saving`、`saved` 和 `error`。启用自动保存后，输入停顿 900 毫秒会触发保存，继续输入则重置计时。

保存还串进了一条 Promise 链，按顺序执行：

```ts
const run = saveQueueRef.current.then(() => performSave(force));
saveQueueRef.current = run.catch(() => undefined);
return run;
```

真正开始写入时，`performSave()` 读取当前笔记编号、标题和内容的快照。写入完成后，再检查用户是否仍停留在这篇笔记，以及期间有没有继续修改：

```ts
const contentChanged =
  contentValueRef.current !== contentSnapshot || titleValueRef.current !== titleSnapshot;
settleSaveState(contentChanged ? "dirty" : "saved");
```

因此，一次旧快照写入成功，不会直接把后来输入的文字也标成已保存。用户已经切换笔记时，旧保存结果也不会改掉当前页面的保存状态。[主窗口保存逻辑][main-window]

跨窗口更新使用前面提到的 `notes-changed`。主窗口监听事件后刷新列表；当前笔记没有未保存修改、也不在保存过程中时，才重新读取正文。异步读取期间如果用户换了笔记，代码会通过加载序号和当前编号检查，丢弃过期回填。

这是一套基于本地文件与事件刷新的同步方式。保存队列位于主窗口组件中，不能据此推断任意窗口之间都实现了冲突合并。尤其在多处同时修改同一篇内容时，仍要区分各个窗口自己的编辑状态。

小窗也有独立的保存策略。固定成磁贴前，已有笔记是否先保存受设置控制；没有编号的新笔记则先创建记录。这个流程与主窗口的 900 毫秒自动保存分别实现。[便签保存策略][surface-policy]

## 便签窗口池

快捷便签需要频繁呼出。`desktop.rs` 维护一个空闲窗口池，容量设为 2；它限制的是缓存的空闲小窗数量，不是应用总共只能打开两个窗口。

启动后，程序错开时间预热隐藏窗口，加载的地址带着 `standby=1`：

```rust
WebviewUrl::App("index.html?view=notepad&standby=1".into()),
```

新建快捷便签时优先从池中取窗口，恢复尺寸、显示并聚焦，然后发送激活事件：

```rust
let _ = window.show();
let _ = window.set_focus();
let _ = window.emit("notepad:activate", label.clone());
```

前端收到与自己窗口标签匹配的事件后，会清空上一次的编辑编号、标题、正文和状态，重新进入空白便签。激活以后，后台再补充空闲窗口。[窗口池实现][desktop]

关闭便签时，窗口先隐藏，再尝试放回池中。池满以后才真正关闭；回收成功时，前端也清掉正文与笔记列表，进入休眠状态。休眠窗口跳过列表刷新，下一次激活时再读取。[便签组件][notepad]

Windows 分支还会把隐藏 WebView 的内存目标等级设为 Low，取出时恢复 Normal。这是窗口复用与后台资源占用之间的处理，不必每次新建 WebView，也不需要让隐藏编辑器一直保留整篇笔记。

## 磁贴模式

磁贴与便签共用 `NotePad`，`TileShowcase` 只是指定初始模式：

```tsx
return <NotePad initialNoteId={noteId} initialSurfaceMode="tile" />;
```

进入 `tile` 后显示可固定、复制和查看的内容，编辑使用 `pad` 模式。Rust 侧的磁贴窗口设置为无边框、置顶、跳过任务栏，并可通过笔记编号找到已存在的窗口。[磁贴入口][tile-entry] · [窗口创建][desktop]

模式切换保留当前窗口边界。源码中的 [getSurfaceTargetBounds()][surface-mode] 直接返回传入的尺寸与位置，所以不会因为从编辑切到磁贴就强制缩回默认大小。

双击进入编辑、手动保存后回到磁贴，都有独立开关。手动保存返回磁贴的条件写在一个小函数中：

```ts
return enabled && Boolean(noteId) && currentMode === "pad" && !isAutoSave;
```

自动保存不会触发这次模式切换，用户正在编辑时也就不会突然被带回磁贴。[模式保存策略][surface-policy]

磁贴的视觉在 `Tile.tsx` 中。背景可以配置，文字与边框则根据背景亮度混色：浅底朝深色混合，深底朝白色混合，再给标题、正文和四角短线设置不同透明度。四角标记是 SVG 路径，Markdown 显示也可单独开启。[磁贴显示][tile]

## Markdown 预览

`MarkdownPreview.tsx` 使用 `react-markdown`。GFM 表格、删除线和任务列表由 `remark-gfm` 解析，公式经 `remark-math` 与 `rehype-katex` 处理，标题锚点由 `rehype-slug` 生成；提示块另有项目自己的插件。

默认预览不解析原始 HTML。开启相关设置以后，处理顺序加入 `rehypeRaw`，再用扩展过的 Schema 清理节点：

```ts
const rehypePluginsDefault = [rehypeKatex, rehypeSlug, rehypeTaskLists];
const rehypePluginsWithHtml = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
  rehypeKatex,
  rehypeSlug,
  rehypeTaskLists,
] as Parameters<typeof Markdown>[0]["rehypePlugins"];
```

代码块有语言标签、横向滚动和复制按钮；外部链接交给系统打开，页内锚点则滚动到当前文档。预览组件通过动态导入加载，相关渲染依赖在需要时进入这一条路径。[预览实现][markdown]

任务列表还可以直接勾选。`rehypeTaskLists` 利用语法树的位置找到原文中 `[ ]` 或 `[x]` 的字符偏移，放到复选框节点上。点击以后，只替换那一个字符：

```ts
onContentChange(
  content.slice(0, offset) + (checked ? "x" : " ") + content.slice(offset + 1),
);
```

缩进、换行和其他 Markdown 内容继续保留。待办列表显示成按钮以后，改动仍然回到原来的文本中，不需要把整棵语法树重新生成一篇 Markdown。[任务项定位][task-lists]

## 分屏滚动

源码与预览的段落高度并不相同，图片、表格和公式会让差别更明显。花笺按逻辑块建立两边的滚动对应关系。

`scrollSync.ts` 先按规则把源码分成标题、正文、列表、代码块等片段；再创建一个隐藏的测量元素，复制 textarea 的字体、行高、宽度与换行设置，测量各块在编辑区里的实际偏移。预览侧按顶层渲染节点的顺序标号并测量位置，配成两组锚点。

滚动到两个锚点之间时，使用线性插值：

```ts
const sourceRange = source[high] - source[low];
if (sourceRange <= 0) return target[high];
const progress = (position - source[low]) / sourceRange;
return target[low] + (target[high] - target[low]) * progress;
```

映射还会补上文档开头与末尾，并整理重复、越界或反向的偏移，让滚动目标保持单调。长文测量会分批让出事件循环，也支持取消过期测量，减少输入以后仍在使用旧布局的情况。[滚动同步][scroll-sync]

## 图片附件

粘贴图片时，程序先确保笔记已经保存、拿到编号，再把图片写到该笔记对应的附件目录。返回的路径形如 `images/笔记UUID/图片UUID.png`，随后作为普通 Markdown 图片语法插入光标处。[图片粘贴][image-paste]

二进制通过 Tauri 的 raw payload 传递，笔记编号和扩展名放在请求头中：

```ts
return invoke("images_save", data, {
  headers: { "x-note-id": noteId, "x-image-ext": extension },
});
```

这样可以避免先把图片展开为 JavaScript 数字数组，再用 JSON 编码。Rust 校验图片格式后，生成新的文件名并写入本地目录。[图片接口][image-api]

预览时，`resolveMarkdownImageSrc()` 识别 `images/` 开头的路径，结合当前数据目录，通过 `convertFileSrc()` 转为 WebView 可读取的地址。Windows 路径中的反斜杠也会先转换。

笔记正文保存的是相对引用，移动整套数据目录时可以继续使用。不过，当前导出 Markdown 的函数只写正文内容，没有把图片目录一起打包。带图片的笔记需要连同附件理解，单独一份 `.md` 并不包含图片字节。[图片地址处理][image-src] · [导出代码][note-store]

主窗口还区分库内笔记与直接打开的外部文件。导入会创建一份新的库内记录；外部文件的保存则写回原路径，并记录修改时间，用于后续检查文件变化。[外部文件保存][main-window]

## 托盘和快捷键

托盘与快捷键都在 Rust 的 `desktop.rs` 中建立。快捷键被解析为打开便签或切换窗口显示两种动作，再回到主线程执行窗口操作。配置允许把便签呼出在光标附近，相关位置计算也放在原生层。

主窗口关闭时，根据配置决定隐藏到托盘还是退出应用；从菜单明确退出时，则先记录应用正在退出，避免关闭事件又把窗口藏回去。窗口的“关闭”和进程的“退出”在这里分别处理。[桌面生命周期][desktop]

平台细节也分开实现。例如 macOS 全屏窗口需要配合原生通知完成隐藏，Windows 有键盘钩子与 WebView 内存等级处理。React 可以共用界面，系统交互仍然保留各平台的分支。

## 应用更新

更新是 `src-tauri/src/updater` 下的独立模块。检查、可用版本、下载、安装和等待安装分别记录状态，默认开启自动检查、关闭自动下载，检查间隔为 24 小时。[更新状态与默认值][updater-types]

安装前还要处理打开的编辑窗口。Rust 广播 `update://prepare-install`；便签窗口收到以后，在状态为 `dirty` 时尝试保存，成功返回 `ready`，这次保存失败则返回 `failed`。原生层汇总各窗口答复，收到失败或等待超时都会返回错误。[安装前协调][updater-commands]

这部分代码也再次用到了多窗口状态：更新模块需要知道有哪些窗口仍然存在，编辑器则需要回答自己是否已经保存。下载完成与可以退出安装，是两个不同阶段。

## 源码位置

继续阅读时，可以按功能找这几个入口：

| 位置 | 内容 |
| --- | --- |
| [src/App.tsx][app] | 窗口视图入口、主题与配置事件 |
| [src/features/notes/api.ts][notes-api] | 前端笔记命令封装与错误处理 |
| [src-tauri/src/services/notes.rs][note-store] | Markdown 文件、元数据、分类、附件与数据迁移 |
| [src/components/MainWindow.tsx][main-window] | 主窗口编辑、保存队列、外部文件和分屏 |
| [src/components/NotePad.tsx][notepad] | 便签输入、池激活、磁贴与编辑模式 |
| [src-tauri/src/desktop.rs][desktop] | 原生窗口池、托盘、快捷键与关闭策略 |
| [src/features/markdown/MarkdownPreview.tsx][markdown] | Markdown、公式、任务项与链接显示 |
| [src/features/markdown/scrollSync.ts][scroll-sync] | 编辑与预览的滚动映射 |
| [src/features/images/useImagePaste.ts][image-paste] | 粘贴、拖入图片与文本插入 |
| [src-tauri/src/updater/commands.rs][updater-commands] | 更新命令与安装前保存协调 |

项目采用 [MIT 许可证][license]，版权署名为 `Copyright (c) 2026 Achilng`。文中代码摘录保留了与上述功能相关的部分。

[repo]: https://github.com/Achilng/floral-notepaper
[snapshot]: https://github.com/Achilng/floral-notepaper/commit/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3
[tauri-commands]: https://v2.tauri.app/develop/calling-rust/
[app]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/App.tsx
[notes-api]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/notes/api.ts
[commands]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/lib.rs
[note-store]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/services/notes.rs
[json-io]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/json_io.rs
[main-window]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/components/MainWindow.tsx
[surface-policy]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/windows/noteSurfaceSavePolicy.ts
[surface-mode]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/windows/surfaceMode.ts
[desktop]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/desktop.rs
[notepad]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/components/NotePad.tsx
[tile-entry]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/components/TileShowcase.tsx
[tile]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/components/Tile.tsx
[markdown]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/markdown/MarkdownPreview.tsx
[task-lists]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/markdown/rehypeTaskLists.ts
[scroll-sync]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/markdown/scrollSync.ts
[image-paste]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/images/useImagePaste.ts
[image-api]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/images/api.ts
[image-src]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src/features/markdown/imageSrc.ts
[updater-types]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/updater/types.rs
[updater-commands]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/src-tauri/src/updater/commands.rs
[license]: https://github.com/Achilng/floral-notepaper/blob/8b624e0b1dc38ea66d0fcea83fd4e3117d63d8c3/LICENSE
