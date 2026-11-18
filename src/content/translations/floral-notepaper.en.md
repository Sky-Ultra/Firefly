---
translationOf: floral-notepaper.md
sourceHash: sha256:3f3376d3dff31b212d7d9bc11b4bfe6196f27550f0eee7f29f6015824c2d605c
---

Floral Notepaper uses Tauri 2, React and Rust. This walkthrough follows commit [8b624e0][snapshot] on `main`, where the configured version is 1.2.0. It looks at how notes are saved, how the small windows are reused, and how the app displays Markdown and images.

## React and Rust

In the frontend entry point, `App.tsx`, the initial URL determines which view to render.

```tsx
{activeView === "main" ? (
  <MainWindow />
) : activeView === "notepad" ? (
  <NotePad initialNoteId={route.noteId} />
) : (
  <TileShowcase noteId={route.noteId} />
)}
```

Rust supplies the URL when it creates a window. For example, `index.html?view=notepad` opens a sticky note, while `index.html?view=tile&noteId=...` opens a tile for a particular note. The windows share frontend assets, and React manages the UI state within each one. [Application entry point][app]

File operations reach Rust through Tauri commands. The frontend interface for updating a note is short.

```ts
export function updateNote(id: string, request: SaveNoteRequest): Promise<Note> {
  return invoke("notes_update", { id, request });
}
```

On the Rust side, `lib.rs` registers the corresponding command.

```rust
#[tauri::command]
fn notes_update(app: AppHandle, id: String, request: SaveNoteRequest) -> Result<Note, AppError> {
    let note = default_store()?.update_note(&id, request)?;
    let _ = app.emit("notes-changed", ());
    Ok(note)
}
```

Once `NoteStore` finishes writing, the command returns the updated note and broadcasts a change event. React handles input and display, while Rust handles local files and system features. Commands and events connect the two. See [Tauri's command documentation][tauri-commands] and the project's wrappers in [notes/api.ts][notes-api] and [lib.rs][commands].

## Markdown files and their index

The app stores note bodies directly as `.md` files. Categories correspond to subdirectories under `notes`. The data directory has the following layout.

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

`metadata.json` stores IDs, titles, file names, categories, creation and modification times, character counts and summaries. The list view can read this metadata without opening every file. Opening a note for editing looks up its file by ID and reads the body. [Note service][note-store]

New notes receive a UUID. A sanitized title is appended to that ID to form the file name.

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

The ID identifies the note, while the title makes the file easier to recognize. Renaming a note can change the file name, but its ID stays the same. The app also keeps the title separate from the Markdown body, which contains the text the user entered.

An update writes to the new path first, updates the index, then removes the file it replaced. The code checks whether the two paths refer to the same file. On Windows, this avoids deleting the freshly written file when only the capitalization of its name has changed.

The JSON index is replaced via a temporary file.

```rust
serde_json::to_writer_pretty(&mut temp_file, value)?;
temp_file.write_all(b"\n")?;
temp_file.sync_all()?;
drop(temp_file);
fs::rename(&temp_path, path)?;
```

This atomic write applies to the JSON file. The note body is written separately with `fs::write`. If the index is missing, the app scans the note files to rebuild it. If parsing fails, it attempts to back up the damaged index before rebuilding readable records. Reconstructed timestamps and other details can differ from the originals, which makes the backup useful. [JSON writes][json-io] · [Index reconstruction][note-store]

## Save state

The main window tracks five save states: `idle`, `dirty`, `saving`, `saved` and `error`. With autosave enabled, a 900 ms pause in typing triggers a save. Typing again restarts the timer.

Saves run in sequence on a Promise chain.

```ts
const run = saveQueueRef.current.then(() => performSave(force));
saveQueueRef.current = run.catch(() => undefined);
return run;
```

When a write actually begins, `performSave()` takes a snapshot of the current note ID, title and body. After the write, it checks whether the user is still editing the same note and whether anything has changed in the meantime.

```ts
const contentChanged =
  contentValueRef.current !== contentSnapshot || titleValueRef.current !== titleSnapshot;
settleSaveState(contentChanged ? "dirty" : "saved");
```

Saving an older snapshot therefore leaves newer edits marked as dirty. If the user has switched notes, the result of the previous save does not overwrite the current view's save state. [Main window save logic][main-window]

Cross-window updates use the `notes-changed` event mentioned earlier. The main window refreshes the list on receipt. It rereads the active note only when the note has no unsaved changes and no save is in progress. If the user switches notes during the asynchronous read, a load sequence number and the current ID allow the app to discard the stale result.

This synchronization relies on local files and change events. The save queue belongs to the main window component, so it does not establish that arbitrary windows can merge conflicts. When several windows edit the same note, each still has its own editing state.

The small window has its own save policy. Before pinning an existing note as a tile, a setting controls whether it is saved first. A new note without an ID must first be created. This flow is independent of the main window's 900 ms autosave. [Sticky note save policy][surface-policy]

## Sticky note window pool

Quick notes are opened frequently. In `desktop.rs`, a pool caches up to two idle windows. That capacity limits the number of idle windows in the cache, not the overall number of open windows.

After startup, the app staggers the prewarming of hidden windows and includes `standby=1` in the URL.

```rust
WebviewUrl::App("index.html?view=notepad&standby=1".into()),
```

When a new quick note is requested, the app first tries the pool. It restores the window size, shows and focuses the window, then sends an activation event.

```rust
let _ = window.show();
let _ = window.set_focus();
let _ = window.emit("notepad:activate", label.clone());
```

When the frontend receives an event matching its window label, it clears the previous note ID, title, body and state and opens a blank note. The app then replenishes the pool in the background. [Window pool implementation][desktop]

Closing a sticky note first hides the window and attempts to return it to the pool. If the pool is full, the window closes. If the window is recycled, its frontend clears the note body and list and goes dormant. A dormant window skips list refreshes and reads the list again on its next activation. [Sticky note component][notepad]

On Windows, a hidden WebView also receives the Low memory usage target, which returns to Normal when the window is taken out. Reuse avoids creating a WebView each time while allowing the hidden editor to release the previous note.

## Tile mode

Tiles and sticky notes share `NotePad`. The `TileShowcase` component specifies the initial mode.

```tsx
return <NotePad initialNoteId={noteId} initialSurfaceMode="tile" />;
```

In `tile` mode, the user can pin, copy and read the content. Editing takes place in `pad` mode. Rust creates a borderless, always-on-top tile that skips the taskbar and can look up an existing window by note ID. [Tile entry point][tile-entry] · [Window creation][desktop]

Switching modes preserves the current window bounds. The implementation of [getSurfaceTargetBounds()][surface-mode] returns the size and position it receives, so switching from the editor to a tile does not force the window back to its default size.

Double-clicking to edit and returning to the tile after a manual save each have a separate setting. A small function defines when a manual save returns to tile mode.

```ts
return enabled && Boolean(noteId) && currentMode === "pad" && !isAutoSave;
```

Autosave does not trigger that switch, so the user can continue typing without being sent back to the tile. [Mode and save policy][surface-policy]

The tile's appearance is defined in `Tile.tsx`. Its background is configurable. Text and border colors are mixed toward dark colors on light backgrounds and toward white on dark backgrounds, with separate opacities for the title, body and corner marks. The four corner marks are SVG paths. Markdown display can also be enabled independently. [Tile appearance][tile]

## Markdown preview

`MarkdownPreview.tsx` uses `react-markdown`. The `remark-gfm` plugin parses GFM tables, strikethrough and task lists. Formulas pass through `remark-math` and `rehype-katex`, and `rehype-slug` creates heading anchors. The project has its own plugin for callouts.

By default the preview does not parse raw HTML. When the relevant setting is enabled, the pipeline adds `rehypeRaw` and sanitizes the nodes with an extended schema.

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

Code blocks have language labels, horizontal scrolling and copy buttons. External links open through the operating system, while internal anchors scroll within the current document. The preview component loads through a dynamic import, bringing in rendering dependencies when this path is needed. [Preview implementation][markdown]

Task list items can be checked directly. Using source positions from the syntax tree, `rehypeTaskLists` finds the character offset inside `[ ]` or `[x]` and attaches it to the checkbox node. A click replaces that one character.

```ts
onContentChange(
  content.slice(0, offset) + (checked ? "x" : " ") + content.slice(offset + 1),
);
```

Indentation, line breaks and surrounding Markdown remain intact. The interaction updates the original text without having to serialize the entire syntax tree back to Markdown. [Task item positions][task-lists]

## Split-view scrolling

Source and preview paragraphs have different heights, especially when a document contains images, tables or formulas. Floral Notepaper matches scroll positions using logical blocks.

First, `scrollSync.ts` splits the source into headings, paragraphs, lists, code blocks and other sections. It creates a hidden measuring element with the textarea's font, line height, width and wrapping settings and measures the actual offset of each block in the editor. On the preview side, top-level rendered nodes are numbered and measured in order, producing a second set of anchors.

Between anchors, the position is calculated by linear interpolation.

```ts
const sourceRange = source[high] - source[low];
if (sourceRange <= 0) return target[high];
const progress = (position - source[low]) / sourceRange;
return target[low] + (target[high] - target[low]) * progress;
```

The mapping includes the start and end of the document. It handles duplicate, out-of-range and reversed offsets so the scroll target stays monotonic. Long measurements yield to the event loop in batches, and obsolete measurements can be canceled when new input changes the layout. [Scroll synchronization][scroll-sync]

## Image attachments

When an image is pasted, the program first ensures that the note has been saved and has an ID. It writes the image to the note's attachment directory. The returned path resembles `images/note-UUID/image-UUID.png` and is inserted at the cursor using ordinary Markdown image syntax. [Pasting images][image-paste]

The binary data travels as a raw Tauri payload. The note ID and file extension are sent in request headers.

```ts
return invoke("images_save", data, {
  headers: { "x-note-id": noteId, "x-image-ext": extension },
});
```

This avoids expanding the image into a JavaScript number array and encoding it as JSON. Rust validates the image format, creates a new file name and writes the file locally. [Image API][image-api]

During preview, `resolveMarkdownImageSrc()` recognizes paths starting with `images/`, combines them with the current data directory and converts them to a WebView-readable URL with `convertFileSrc()`. Windows backslashes are normalized first.

The note contains a relative reference, which continues to work when the whole data directory is moved. The current Markdown export function writes only the body and does not bundle the image directory. A note with images depends on its attachments as well as its `.md` file. [Image source resolution][image-src] · [Export implementation][note-store]

The main window distinguishes library notes from external files opened directly. Importing creates a new library record. Saving an external file writes back to its original path and records its modification time for subsequent change detection. [Saving external files][main-window]

## System tray and shortcuts

Rust sets up the system tray and shortcuts in `desktop.rs`. Shortcuts resolve to one of two actions, opening a sticky note or toggling window visibility. Window operations then run on the main thread. A setting can place a new note near the cursor, with position calculations handled by native code.

Closing the main window either hides it in the tray or exits the application, depending on the configuration. Explicitly exiting from the menu first records that the app is quitting, so the close handler does not hide it again. [Desktop lifecycle][desktop]

Platform details have separate implementations. On macOS, hiding a full-screen window uses native notifications. On Windows, the app has a keyboard hook and manages the WebView memory usage target. React shares the interface across platforms, while system interactions follow the platform-specific branches.

## Application updates

The updater is an independent module under `src-tauri/src/updater`. It tracks checking, availability, download, installation and waiting for installation. Automatic checks are enabled by default, automatic downloads are disabled, and the check interval is 24 hours. [Updater states and defaults][updater-types]

Before installation, the open editors also need attention. Rust broadcasts `update://prepare-install`. A sticky note window in the `dirty` state tries to save, replying with `ready` on success or `failed` if the save fails. The native layer collects the responses and returns an error if a window reports failure or the wait times out. [Pre-install coordination][updater-commands]

This is another use of multi-window state. The updater needs to know which windows still exist, and each editor needs to report whether its changes have been saved. Finishing the download and being ready to quit for installation are two separate stages.

## Where to find the source

| Location | What it covers |
| --- | --- |
| [src/App.tsx][app] | Window views, theme and configuration events |
| [src/features/notes/api.ts][notes-api] | Frontend note command wrappers and error handling |
| [src-tauri/src/services/notes.rs][note-store] | Markdown files, metadata, categories, attachments and data migration |
| [src/components/MainWindow.tsx][main-window] | Main editor, save queue, external files and split view |
| [src/components/NotePad.tsx][notepad] | Note input, pool activation, tile and editor modes |
| [src-tauri/src/desktop.rs][desktop] | Native window pool, system tray, shortcuts and closing behavior |
| [src/features/markdown/MarkdownPreview.tsx][markdown] | Rendering Markdown, formulas, task items and links |
| [src/features/markdown/scrollSync.ts][scroll-sync] | Scroll mapping between the editor and preview |
| [src/features/images/useImagePaste.ts][image-paste] | Pasting, dropping images and inserting text |
| [src-tauri/src/updater/commands.rs][updater-commands] | Update commands and coordination of saves before installation |

The project uses the [MIT license][license] and credits `Copyright (c) 2026 Achilng`. The code excerpts retain the parts relevant to the features discussed above.

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
