---
translationOf: music-module-guide.md
sourceHash: sha256:720b3f87074708f2ae673358f22b22dc3797ff5782835ec1303133cfe91401c9
---

This post explains the design behind the site's music module. The player can appear in both the sidebar and the navigation bar, with playlist loading, playback controls, synchronised lyrics, and support for local audio files.

## Component Structure

Three components divide the work between them:

- `Music.astro` is the outer sidebar card and provides the title, layout, and instance identifier
- `MusicPlayer.astro` renders the player itself: cover art, controls, progress, playlist, and lyrics drawer
- `MusicManager.astro` is the global playback manager, responsible for the audio element, shared state, and playlist data

Keeping the interface separate from playback makes it possible to render several player views while using only one audio element. Pause the sidebar player and the navigation-bar button changes with it. Switch tracks from the navigation bar and the sidebar updates its title and cover as well.

The sidebar component only has to load the player:

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

Every player receives its own `id`, preventing the sidebar and navigation-bar views from selecting each other's DOM nodes. They share playback state, but each keeps its own interface elements.

## Use a Single Audio Element

The actual `<audio>` element is created by `MusicManager.astro`:

```js
if (window.__fireflyMusic) return;

var audio = document.createElement("audio");
audio.crossOrigin = "anonymous";
audio.style.display = "none";
document.body.appendChild(audio);
```

`window.__fireflyMusic` tells the script whether the manager already exists. Firefly navigates between pages without a full reload; creating another audio element on each navigation would eventually leave several players running at once.

The manager script also carries `data-swup-ignore-script` so it is not executed again during page transitions. Playback position, volume, and the current track all survive for as long as the browser tab remains open.

## Configure an Online Playlist

The main settings live in `src/config/musicConfig.ts`. This site currently uses a Meting playlist:

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

Before the request is sent, `:server`, `:type`, and `:id` are replaced with their configured values. If the primary API fails, the manager tries each fallback in turn. The player can finish initialising as soon as one endpoint returns a usable playlist.

Meting services do not always use the same field names, so the response is normalised first:

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

A title might arrive as `title` or `name`, for example, while artwork could be `pic` or `cover`. Normalising that once at the boundary means the player does not need to know which API supplied the data.

## Configure Local Music

To avoid third-party playlist services, switch the mode to `local` and keep the tracks directly in the configuration:

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

A path beginning with `/` is read from the `public` directory. In this example, the audio file belongs under `public/assets/music/`; the cover and lyric files follow the same rule.

A full remote URL also works, provided the server permits cross-origin access to the audio and lyric files.

Local mode removes the playlist API as a dependency and gives you direct control over every file. The trade-off is storage and bandwidth. For a large collection, object storage or a CDN is usually a better home than the source repository.

## Keep Playback State in One Place

The manager owns all playback state. Player components only display it and pass on user actions:

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

This object tracks the playlist, current song, play state, play mode, volume, and lyrics.

Volume is saved in browser storage. When a reader returns, the site restores their last setting instead of resetting it to the default.

Playback modes use readable strings in the configuration:

- `list`: repeat the playlist in order
- `one`: repeat the current track
- `random`: choose tracks at random

During initialisation, the manager converts that setting into its internal state. When a song ends, the active mode decides whether to replay it, advance in order, or choose another track at random.

## Synchronise Several Interfaces with Events

`MusicPlayer.astro` does not manipulate the hidden `<audio>` element directly. It calls methods exposed by the global manager:

```js
window.__fireflyMusic.togglePlay();
window.__fireflyMusic.playNext();
window.__fireflyMusic.setVolume(value);
```

Whenever playback state changes, the manager broadcasts a custom event:

```js
window.dispatchEvent(
	new CustomEvent("fm:play-state", {
		detail: { isPlaying: true },
	}),
);
```

Every `MusicPlayer` instance listens for the same `fm:*` events. The main ones are:

- `fm:init`: the playlist has loaded
- `fm:track`: the current track has changed
- `fm:play-state`: playback has started or paused
- `fm:time`: playback progress has changed
- `fm:volume`: volume or mute state has changed
- `fm:lyrics`: lyrics have loaded or failed
- `fm:lrc-index`: the active lyric line has changed

The interfaces never need to find or modify each other's DOM. A future mobile player or compact player can join the same system simply by using the manager and listening for these events.

## Handle Rapid Track Changes

Changing tracks updates `audio.src` and may call `audio.play()` immediately. If someone presses “next” several times in quick succession, an earlier asynchronous play request can finish after a later one and overwrite the current state.

An incrementing version number makes stale results harmless:

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

`loadVersion` increases with every new track. When an older task returns, a mismatched version stops it from changing the playback state.

## Parse and Synchronise Lyrics

Lyrics can be either a URL to an LRC file or the LRC text itself. The parser reads timestamps such as `[01:23.45]`, converts them to seconds, and sorts the resulting lines by time:

```js
function parseLRC(lrc) {
	var timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
	// 每一行会整理成 { time, text }
}
```

On each audio `timeupdate` event, the manager finds the lyric line for the current position and broadcasts `fm:lrc-index`. The player highlights that line and scrolls it smoothly towards the middle of the lyrics panel.

Missing lyrics do not prevent the song from playing. If a remote lyric file fails to load, the player shows a small notice and leaves the audio alone.

## Keep Long Playlists Responsive

The playlist drawer in `MusicPlayer.astro` uses a simple virtual list. It renders only the currently visible tracks and a small buffer around them, based on the scroll position.

The difference is negligible for a short playlist. With hundreds of songs, however, avoiding hundreds of cover images, buttons, and text nodes at once makes the drawer much steadier to open and scroll.

## Choose Where the Player Appears

The sidebar position is controlled in `src/config/sidebarConfig.ts`:

```ts
{
	type: "music",
	enable: true,
	position: "sticky",
	showOnPostPage: true,
},
```

Set `enable` to `false` to hide the sidebar card. `showOnPostPage` decides whether it also appears on article pages.

The navigation-bar control uses `showInNavbar` from the music configuration:

```ts
showInNavbar: true,
```

The sidebar and navigation bar are only two views of the same `MusicManager`. Hiding one does not affect playback or the playlist in the other.

## Routine Configuration

Playback, progress, and lyric handling all live in the manager. Changing the music normally does not require editing `MusicPlayer.astro` or `MusicManager.astro`:

- For a NetEase Cloud Music playlist, update the playlist referenced by `meting.id`
- For local music, add tracks to `local.playlist`
- Change `volume` to set the default volume
- Change `playMode` to choose the default playback mode
- Set `showLyrics` to `false` when lyrics are not needed

Rebuild the site after updating the configuration.
