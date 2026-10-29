<script lang="ts">
// Dock geometry/motion adapted from fqzlr/shirone-fq (MIT; LICENSES/Shirone-fq.txt).
import { onMount, tick } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import {
	clampMusicDock,
	FLOATING_MUSIC_KEY,
	FLOATING_MUSIC_POSITION_KEY,
	type MusicManager,
	type MusicSnapshot,
	readFloatingMusicDismissed,
	subscribeFloatingMusic,
} from "@/utils/floating-music";

let snapshot = $state.raw<MusicSnapshot | null>(null);
let manager: MusicManager | undefined;
let root: HTMLDivElement;
let ready = $state(false);
let dismissed = $state(false);
let expanded = $state(false);
let pinned = false;
let hovered = false;
let lyricsPill = $state(false);
let panel = $state<"list" | "lyrics" | null>(null);
let position = $state({ x: 24, y: 0 });
let dragging = $state(false);
let drag: { id: number; px: number; py: number; x: number; y: number } | null =
	null;
let moved = false;
let suppressClick = false;
let collapseTimer: ReturnType<typeof setTimeout> | undefined;
let lyricHoldUntil = 0;
let lastLine = -2;
let lyricList: HTMLDivElement | undefined;
let coverFailed = $state(false);
let seeking = $state(false);
let seekValue = $state(0);
const playing = $derived(snapshot?.isPlaying ?? false);
const shape = $derived(
	expanded ? "bar" : playing && lyricsPill ? "pill" : "disc",
);
const title = $derived(snapshot?.track?.name || "音乐");
const cover = $derived(snapshot?.track?.pic || "");
const artist = $derived(snapshot?.track?.artist || "我的歌单");
const currentLine = $derived(
	snapshot?.lyrics[snapshot.currentLrcIndex]?.text || title,
);
const duration = $derived(
	Number.isFinite(snapshot?.duration)
		? Math.max(0, snapshot?.duration || 0)
		: 0,
);
const time = $derived(seeking ? seekValue : snapshot?.currentTime || 0);
const hasTracks = $derived((snapshot?.playlist.length ?? 0) > 0);
const modeLabels = ["列表循环", "单曲循环", "随机播放"];
function formatTime(value: number) {
	const seconds = Math.max(0, Math.floor(value || 0));
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function clearCollapse() {
	clearTimeout(collapseTimer);
}
function collapse() {
	clearCollapse();
	expanded = false;
	panel = null;
	pinned = false;
}
function toggleExpanded() {
	if (suppressClick) {
		suppressClick = false;
		return;
	}
	if (pinned && expanded) collapse();
	else {
		expanded = true;
		pinned = true;
		clearCollapse();
	}
}
function updateToggles() {
	document
		.querySelectorAll("[data-floating-music-toggle]")
		.forEach((button) => {
			button.setAttribute("aria-pressed", String(!dismissed));
		});
}
function dismiss(value: boolean) {
	dismissed = value;
	collapse();
	try {
		localStorage.setItem(FLOATING_MUSIC_KEY, String(value));
	} catch {
		/* Optional preference. */
	}
	updateToggles();
}
function clamp() {
	if (!ready || !root) return;
	const rem =
		Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
		16;
	const infoHeight =
		root.querySelector<HTMLElement>(".music-float-player__info-surface")
			?.offsetHeight || 100;
	const above =
		shape === "bar"
			? infoHeight -
				1.375 * rem +
				(panel ? Math.min(16 * rem, innerHeight * 0.4) + 0.5 * rem : 0)
			: shape === "pill"
				? rem
				: 0.5 * rem;
	const point = clampMusicDock(
		position,
		{ width: innerWidth, height: innerHeight },
		{
			width:
				shape === "disc" ? 4 * rem : Math.min(21.25 * rem, innerWidth - 24),
			above,
			below: 4 * rem,
		},
	);
	if (point.x !== position.x || point.y !== position.y) position = point;
}
function pointerDown(event: PointerEvent) {
	if (event.button !== 0 || !event.isPrimary) return;
	drag = {
		id: event.pointerId,
		px: event.clientX,
		py: event.clientY,
		x: position.x,
		y: position.y,
	};
	moved = false;
	(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}
function pointerMove(event: PointerEvent) {
	if (!drag || drag.id !== event.pointerId) return;
	const dx = event.clientX - drag.px;
	const dy = event.clientY - drag.py;
	if (!moved && Math.hypot(dx, dy) < 5) return;
	moved = true;
	dragging = true;
	position = { x: drag.x + dx, y: drag.y + dy };
	clamp();
}
function pointerEnd(event: PointerEvent) {
	if (!drag || drag.id !== event.pointerId) return;
	drag = null;
	dragging = false;
	if (moved) {
		suppressClick = event.type !== "pointercancel";
		try {
			localStorage.setItem(
				FLOATING_MUSIC_POSITION_KEY,
				JSON.stringify(position),
			);
		} catch {
			/* Optional preference. */
		}
	}
}
function commitSeek() {
	if (!seeking) return;
	manager?.seekToTime(seekValue);
	seeking = false;
}
function holdLyrics() {
	lyricHoldUntil = Date.now() + 3000;
}
function togglePanel() {
	panel = panel ? null : "list";
	expanded = true;
	pinned = true;
}
onMount(() => {
	manager = window.__fireflyMusic;
	if (!manager) return;
	const unsubscribe = subscribeFloatingMusic(manager, window, (state) => {
		snapshot = state;
	});
	dismissed = readFloatingMusicDismissed(localStorage);
	position = { x: 24, y: Math.max(90, innerHeight - 152) };
	try {
		const stored = JSON.parse(
			localStorage.getItem(FLOATING_MUSIC_POSITION_KEY) || "null",
		);
		if (stored && Number.isFinite(stored.x) && Number.isFinite(stored.y))
			position = stored;
	} catch {
		/* Use default. */
	}
	ready = true;
	void tick().then(clamp);
	updateToggles();
	void manager.init();
	const scope = new AbortController();
	const { signal } = scope;
	document.addEventListener(
		"click",
		(event) => {
			const target = event.target as Element | null;
			if (target?.closest("[data-floating-music-toggle]")) {
				dismiss(!dismissed);
				if (!dismissed) {
					expanded = true;
					pinned = true;
				}
				return;
			}
			if (root && target && !event.composedPath().includes(root)) collapse();
		},
		{ signal },
	);
	document.addEventListener(
		"pointermove",
		(event) => {
			if (event.pointerType !== "mouse" || dismissed || dragging) return;
			const inside = !!root && event.composedPath().includes(root);
			if (inside === hovered) return;
			hovered = inside;
			clearCollapse();
			if (inside) expanded = true;
			else if (!pinned && !panel && !root?.contains(document.activeElement))
				collapseTimer = setTimeout(collapse, 160);
		},
		{ passive: true, signal },
	);
	document.addEventListener(
		"keydown",
		(event) => {
			if (event.key === "Escape" && root?.contains(document.activeElement)) {
				event.stopPropagation();
				collapse();
				root
					.querySelector<HTMLButtonElement>(".music-float-disc__hit")
					?.focus();
			}
		},
		{ signal },
	);
	window.addEventListener("resize", clamp, { passive: true, signal });
	window.addEventListener(
		"storage",
		(event) => {
			if (event.key === FLOATING_MUSIC_KEY || event.key === null) {
				dismissed = readFloatingMusicDismissed(localStorage);
				updateToggles();
			}
		},
		{ signal },
	);
	document.addEventListener("swup:pageView", updateToggles, { signal });
	document.addEventListener("astro:page-load", updateToggles, { signal });
	return () => {
		unsubscribe();
		scope.abort();
		clearCollapse();
	};
});
$effect(() => {
	void shape;
	void panel;
	if (ready) void tick().then(clamp);
});
$effect(() => {
	const src = cover;
	if (src) coverFailed = false;
});
$effect(() => {
	const index = snapshot?.currentLrcIndex ?? -1;
	if (panel !== "lyrics" || !expanded) {
		lastLine = -2;
		return;
	}
	if (index === lastLine || Date.now() < lyricHoldUntil) return;
	lastLine = index;
	void tick().then(() => {
		const line = lyricList?.querySelector<HTMLElement>('[aria-current="true"]');
		if (line && lyricList)
			lyricList.scrollTo({
				top:
					line.offsetTop -
					lyricList.offsetTop -
					lyricList.clientHeight / 2 +
					line.offsetHeight / 2,
				behavior: "auto",
			});
	});
});
</script>

<div bind:this={root} class="music-float-player" class:music-float-player--ready={ready && !dismissed} class:music-float-player--bar={shape==="bar"} class:music-float-player--pill={shape==="pill"} class:music-float-player--panel-open={panel!==null} class:music-float-player--dragging={dragging} style={`transform:translate(${position.x}px,${position.y}px)`} role="region" aria-label="悬浮音乐播放器" aria-hidden={!ready || dismissed} inert={!ready || dismissed}>
 <div class="music-float-player__stage">
  <div class="music-float-player__panel" inert={!expanded || !panel} aria-hidden={!expanded || !panel}>
   <div class="music-float-player__panel-clip"><div class="music-float-player__panel-body">
    <div class="music-float-player__tabs" role="tablist" aria-label="音乐面板"><button type="button" role="tab" aria-selected={panel==="list"} aria-controls="floating-music-list" class:active={panel==="list"} onclick={()=>panel="list"}>列表</button><button type="button" role="tab" aria-selected={panel==="lyrics"} aria-controls="floating-music-lyrics" class:active={panel==="lyrics"} onclick={()=>panel="lyrics"}>歌词</button></div>
    <div class="music-float-player__views" id={panel==="lyrics"?"floating-music-lyrics":"floating-music-list"} role="tabpanel" bind:this={lyricList} onwheel={holdLyrics} ontouchstart={holdLyrics}>
     {#if expanded && panel==="list"}
      {#each snapshot?.playlist || [] as track,index}<button type="button" class="dock-track" aria-current={snapshot?.currentIndex===index?"true":undefined} onclick={()=>manager?.playTrackByIndex(index)}><span class="music-float-player__item-cover">{#if track.pic}<img src={track.pic} alt="" loading="lazy" decoding="async" />{:else}<Icon icon="material-symbols:music-note-rounded" />{/if}</span><span><strong>{track.name}</strong><small>{track.artist}</small></span>{#if snapshot?.currentIndex===index}<span class="dock-playing" aria-hidden="true">♪</span>{/if}</button>{/each}
      {#if !hasTracks}<p class="music-float-player__empty">{snapshot?.error || "正在加载歌单…"}</p>{/if}
     {:else if expanded && panel==="lyrics"}
      {#each snapshot?.lyrics || [] as line,index}<button type="button" class="dock-lyric" aria-current={snapshot?.currentLrcIndex===index?"true":undefined} onclick={()=>manager?.seekToTime(line.time)}>{line.text}</button>{/each}
      {#if !snapshot?.lyrics.length}<p class="music-float-player__empty">暂无歌词</p>{/if}
     {/if}
    </div>
   </div></div>
  </div>
  <div class="music-float-player__info" inert={!expanded} aria-hidden={!expanded}>
   <div class="music-float-player__info-clip"><div class="music-float-player__info-surface">
    <button type="button" class="music-float-player__close" aria-label="关闭悬浮播放器" title="关闭悬浮播放器" onclick={()=>dismiss(true)}><Icon icon="material-symbols:close-rounded" /></button>
    <strong class="music-float-player__title" title={title}>{title}</strong><span class="music-float-player__artist" title={artist}>{artist}</span>
    <div class="dock-progress"><span>{formatTime(time)}</span><input type="range" min="0" max={duration||1} step="0.1" value={Math.min(time,duration||1)} disabled={!duration} aria-label="播放进度" aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`} oninput={(event)=>{seeking=true;seekValue=event.currentTarget.valueAsNumber;}} onchange={commitSeek} onpointercancel={()=>seeking=false} /><span>{formatTime(duration)}</span></div>
   </div></div>
  </div>
  <div class="music-float-player__bar">
   <span class="music-float-player__pill-text" aria-hidden={shape!=="pill"}><span class="music-float-player__pill-label">{currentLine}</span></span>
   <div class="music-float-player__toolbar" inert={!expanded} aria-hidden={!expanded}>
    <button type="button" class="dock-icon" aria-label={`播放模式：${modeLabels[snapshot?.playMode||0]}`} title={modeLabels[snapshot?.playMode||0]} disabled={!hasTracks} onclick={()=>manager?.cyclePlayMode()}>{#if snapshot?.playMode===1}<Icon icon="material-symbols:repeat-one-rounded" />{:else if snapshot?.playMode===2}<Icon icon="material-symbols:shuffle-rounded" />{:else}<Icon icon="material-symbols:repeat-rounded" />{/if}</button>
    <button type="button" class="dock-icon" aria-label="胶囊歌词" aria-pressed={lyricsPill} title="胶囊歌词" onclick={()=>lyricsPill=!lyricsPill}><Icon icon="material-symbols:graphic-eq-rounded" /></button>
    <button type="button" class="dock-icon dock-skip" aria-label="上一首" title="上一首" disabled={!hasTracks} onclick={()=>manager?.playPrev()}><Icon icon="material-symbols:skip-previous-rounded" /></button>
    <button type="button" class="dock-icon dock-play" aria-label={playing?"暂停":"播放"} title={playing?"暂停":"播放"} disabled={!hasTracks} onclick={()=>manager?.togglePlay()}>{#if playing}<Icon icon="material-symbols:pause-rounded" />{:else}<Icon icon="material-symbols:play-arrow-rounded" />{/if}</button>
    <button type="button" class="dock-icon dock-skip" aria-label="下一首" title="下一首" disabled={!hasTracks} onclick={()=>manager?.playNext()}><Icon icon="material-symbols:skip-next-rounded" /></button>
    <button type="button" class="dock-icon" aria-label="列表" title="列表" aria-expanded={panel!==null} onclick={togglePanel}><Icon icon="material-symbols:queue-music-rounded" /></button>
    <div class="music-float-player__volume"><button type="button" class="dock-icon" aria-label={snapshot?.isMuted?"取消静音":"静音"} title="音量" onclick={()=>manager?.toggleMute()}>{#if snapshot?.isMuted}<Icon icon="material-symbols:volume-off-rounded" />{:else}<Icon icon="material-symbols:volume-up-rounded" />{/if}</button><div class="music-float-player__volume-pop"><span class="music-float-player__volume-value">{Math.round((snapshot?.volume??.7)*100)}</span><input class="dock-volume" type="range" min="0" max="100" step="1" value={(snapshot?.volume??.7)*100} aria-label="音量" aria-orientation="vertical" oninput={(event)=>manager?.setVolume(event.currentTarget.valueAsNumber/100)} /></div></div>
   </div>
  </div>
  <div class="music-float-player__disc"><div class="music-float-disc" class:music-float-disc--paused={!playing}>
   <button type="button" class="music-float-disc__hit" aria-label={`${expanded?"收起":"展开"}音乐播放器（可拖动）`} aria-expanded={expanded} onpointerdown={pointerDown} onpointermove={pointerMove} onpointerup={pointerEnd} onpointercancel={pointerEnd} onclick={toggleExpanded}>
    <span class="music-float-disc__spin" aria-hidden="true">{#if cover && !coverFailed}<img src={cover} width="64" height="64" alt="" draggable="false" decoding="async" onerror={()=>coverFailed=true} />{:else}<Icon icon="material-symbols:music-note-rounded" />{/if}</span><span class="music-float-disc__toggle" aria-hidden="true">{#if playing}<Icon icon="material-symbols:pause-rounded" />{:else}<Icon icon="material-symbols:play-arrow-rounded" />{/if}</span>
   </button>
  </div></div>
 </div>
</div>
