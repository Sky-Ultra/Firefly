<script lang="ts">
// Structure and motion adapted from fqzlr/shirone-fq DisplaySettings/SegmentedButton (MIT).
import Icon from "@/components/common/Icon.svelte";
import type { WALLPAPER_MODE } from "@/types/config";
import FairytaleSlider from "./FairytaleSlider.svelte";

let {
	hue,
	blur,
	cardOpacity,
	layout,
	wallpaperMode,
	titleEnabled,
	carouselEnabled,
	sakuraEnabled,
	allowLayout,
	allowMasonry,
	allowTitle,
	allowCarousel,
	allowSakura,
	onResetHue,
	onResetLayout,
	defaultHue,
	defaultLayout,
	onHueChange,
	onBlurChange,
	onCardOpacityChange,
	onClassic,
	onWallpaperChange,
	onResetTransparency,
	onLayoutChange,
	onTitleToggle,
	onCarouselToggle,
	onSakuraToggle,
	onImmersive,
}: {
	hue: number;
	blur: number;
	cardOpacity: number;
	layout: "list" | "grid" | "masonry";
	wallpaperMode: WALLPAPER_MODE;
	titleEnabled: boolean;
	carouselEnabled: boolean;
	sakuraEnabled: boolean;
	allowLayout: boolean;
	allowMasonry: boolean;
	allowTitle: boolean;
	allowCarousel: boolean;
	allowSakura: boolean;
	onResetHue: () => void;
	onResetLayout: () => void;
	defaultHue: number;
	defaultLayout: "list" | "grid" | "masonry";
	onHueChange: (value: number) => void;
	onBlurChange: (value: number) => void;
	onCardOpacityChange: (value: number) => void;
	onClassic: () => void;
	onWallpaperChange: (mode: WALLPAPER_MODE) => void;
	onResetTransparency: () => void;
	onLayoutChange: (layout: "list" | "grid" | "masonry") => void;
	onTitleToggle: () => void;
	onCarouselToggle: () => void;
	onSakuraToggle: () => void;
	onImmersive: () => void;
} = $props();
let tab = $state("wallpaper");
const tabs = [
	{
		id: "appearance",
		label: "外观",
		en: "Appearance",
		icon: "material-symbols:palette-outline",
	},
	{
		id: "wallpaper",
		label: "壁纸",
		en: "Wallpaper",
		icon: "material-symbols:wallpaper",
	},
	{
		id: "effects",
		label: "特效",
		en: "Effects",
		icon: "material-symbols:wand-stars-outline-rounded",
	},
];
const modes: { value: WALLPAPER_MODE; label: string; icon: string }[] = [
	{ value: "banner", label: "横幅", icon: "material-symbols:image-outline" },
	{
		value: "fullscreen",
		label: "全屏壁纸",
		icon: "material-symbols:wallpaper",
	},
	{
		value: "overlay",
		label: "覆盖透明",
		icon: "material-symbols:full-coverage-outline-rounded",
	},
	{ value: "none", label: "纯色", icon: "material-symbols:hide-image-outline" },
];
</script>

<div class="fairytale-control-panel" data-fairytale-panel>
	<div class="ft-tabs" role="tablist" aria-label="主题设置">
		{#each tabs as item}
			<button type="button" role="tab" aria-selected={tab===item.id} aria-controls={`fairytale-tab-${item.id}`} class:chosen={tab===item.id} onclick={()=>tab=item.id}>
				{#if item.id === "appearance"}<Icon icon="material-symbols:palette-outline" class="text-[1.25rem]" />{:else if item.id === "wallpaper"}<Icon icon="material-symbols:wallpaper" class="text-[1.25rem]" />{:else}<Icon icon="material-symbols:wand-stars-outline-rounded" class="text-[1.25rem]" />{/if}<span data-i18n-zh={item.label} data-i18n-en={item.en}>{item.label}</span>
			</button>
		{/each}
	</div>
	<div class="ft-body" role="tabpanel" id={`fairytale-tab-${tab}`}>
		{#if tab==="wallpaper"}
			<section>
				<h3>页面背景</h3>
				<div class="ft-modes" role="radiogroup" aria-label="页面背景">
					{#each modes as mode}
						<label class="ft-mode" class:chosen={wallpaperMode===mode.value}><input type="radio" name="fairytale-wallpaper-mode" checked={wallpaperMode===mode.value} onchange={()=>onWallpaperChange(mode.value)} /><Icon icon={mode.icon} class="text-[1.2rem]" /><span>{mode.label}</span></label>
					{/each}
				</div>
			</section>
			<section>
				<h3>全屏布局</h3>
				<div class="ft-segmented" role="group" aria-label="全屏布局">
					<label><input type="radio" name="fairytale-layout" onchange={onClassic} /><span>经典模式</span></label>
					<label class="chosen"><input type="radio" name="fairytale-layout" checked /><span class="ft-check" aria-hidden="true"><Icon icon="material-symbols:check" class="text-base" /></span><span>童话模式</span></label>
				</div>
			</section>
			<section>
				<div class="ft-section-heading"><h3>透明设置</h3><button type="button" class="ft-reset" aria-label="恢复童话默认设置" title="恢复默认" onclick={onResetTransparency}><Icon icon="fa7-solid:arrow-rotate-left" class="text-[.75rem]" /></button></div>
				<div class="ft-slider-row"><div class="ft-slider-label"><span>背景模糊度</span><output>{blur.toFixed(1)}px</output></div><FairytaleSlider label="童话背景模糊度" min={0} max={20} step={0.5} value={blur} onValueChange={onBlurChange} /></div>
				<div class="ft-slider-row"><div class="ft-slider-label"><span>卡片透明度</span><output>{Math.round(cardOpacity*100)}%</output></div><FairytaleSlider label="童话卡片透明度" min={20} max={100} step={1} value={Math.round(cardOpacity*100)} onValueChange={(value)=>onCardOpacityChange(value/100)} /></div>
			</section>
			{#if allowTitle || allowCarousel}
				<section><h3>壁纸设置</h3>
					{#if allowTitle}<button type="button" class="ft-toggle" role="switch" aria-checked={titleEnabled} onclick={onTitleToggle}><span>首页壁纸标题</span><span class="ft-switch" class:on={titleEnabled}><span>{titleEnabled?"✓":""}</span></span></button>{/if}
					{#if allowCarousel}<button type="button" class="ft-toggle" role="switch" aria-checked={carouselEnabled} onclick={onCarouselToggle}><span>壁纸轮播</span><span class="ft-switch" class:on={carouselEnabled}><span>{carouselEnabled?"✓":""}</span></span></button>{/if}
				</section>
			{/if}
			<button type="button" class="ft-immersive" onclick={onImmersive}><Icon icon="material-symbols:fullscreen-rounded" class="text-lg" /><span>沉浸式播放</span></button>
		{:else if tab==="appearance"}
			<section><div class="ft-section-heading"><h3>主题色相</h3>{#if hue!==defaultHue}<button type="button" class="ft-reset" aria-label="恢复默认主题色" onclick={onResetHue}><Icon icon="fa7-solid:arrow-rotate-left" class="text-[.75rem]" /></button>{/if}</div><div class="ft-slider-row"><div class="ft-slider-label"><span>主题色相</span><output>{hue}°</output></div><FairytaleSlider label="主题色相" value={hue} min={0} max={360} step={5} onValueChange={onHueChange} /></div></section>
			{#if allowLayout}<section><div class="ft-section-heading"><h3>文章布局</h3>{#if layout!==defaultLayout}<button type="button" class="ft-reset" aria-label="恢复默认文章布局" onclick={onResetLayout}><Icon icon="fa7-solid:arrow-rotate-left" class="text-[.75rem]" /></button>{/if}</div><div class="ft-segmented" role="group" aria-label="文章布局">{#each [{value:"list" as const,label:"列表"},{value:"grid" as const,label:"网格"},...(allowMasonry?[{value:"masonry" as const,label:"瀑布流"}]:[])] as item}<label class:chosen={layout===item.value}><input type="radio" name="fairytale-post-layout" checked={layout===item.value} onchange={()=>onLayoutChange(item.value)} /><span>{item.label}</span></label>{/each}</div></section>{/if}
		{:else}
			<section><h3>特效设置</h3>{#if allowSakura}<button type="button" class="ft-toggle" role="switch" aria-checked={sakuraEnabled} onclick={onSakuraToggle}><span>樱花特效</span><span class="ft-switch" class:on={sakuraEnabled}><span>{sakuraEnabled?"✓":""}</span></span></button>{/if}</section>
		{/if}
	</div>
</div>

<style>
.fairytale-control-panel { --ft-text:#252329; --ft-muted:#66616b; --ft-surface:color-mix(in srgb,var(--card-bg) 94%,#777); --ft-high:color-mix(in srgb,var(--card-bg) 97%,#777); --ft-selected:var(--btn-regular-bg-hover); color:var(--ft-text); display:flex; flex-direction:column; gap:.5rem; font-size:max(.8rem,12px); }
:global(html.dark) .fairytale-control-panel { --ft-text:#eeebf1; --ft-muted:#c3bdc8; }
.ft-tabs { display:flex; gap:2px; height:2.25rem; padding:2px; border-radius:.75rem; background:var(--ft-surface); flex:none; }
.ft-tabs button { flex:1; display:flex; align-items:center; justify-content:center; gap:.4rem; min-width:0; border:0; border-radius:.5rem; color:var(--ft-muted); background:transparent; font-size:max(.75rem,12px); font-weight:600; cursor:pointer; transition:background-color .15s cubic-bezier(.2,0,0,1),color .15s cubic-bezier(.2,0,0,1); }
.ft-tabs button.chosen { color:var(--ft-text); background:var(--ft-selected); box-shadow:0 1px 2px rgb(0 0 0 / 8%); }
.ft-body { padding:.75rem .5rem .5rem; border-radius:.75rem; background:var(--ft-surface); }
section + section { margin-top:1rem; }
h3 { margin:0 0 .65rem .25rem; font-size:.875rem; line-height:1.5; font-weight:700; }
.ft-section-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:.45rem; }
.ft-section-heading h3 { margin-bottom:0; }
.ft-reset { display:grid; place-items:center; width:1.75rem; height:1.75rem; border:0; border-radius:.5rem; background:transparent; color:var(--ft-text); cursor:pointer; }
.ft-modes { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem; }
.ft-mode { display:flex; align-items:center; justify-content:center; gap:.5rem; padding:.625rem .5rem; border-radius:.75rem; background:var(--ft-high); color:var(--ft-muted); cursor:pointer; font-size:max(.75rem,12px); font-weight:600; }
.ft-mode.chosen { background:var(--ft-selected); color:var(--ft-text); }
.ft-mode input,.ft-segmented input { position:absolute; width:1px; height:1px; opacity:0; overflow:hidden; clip:rect(0 0 0 0); clip-path:inset(50%); }
.ft-segmented { display:flex; gap:2px; padding:2px; border-radius:.75rem; background:var(--ft-high); }
.ft-segmented label { flex:1; display:flex; align-items:center; justify-content:center; gap:.25rem; min-width:0; height:2rem; padding:0 .5rem; border-radius:.5rem; font-size:max(.75rem,12px); color:var(--ft-muted); cursor:pointer; transition:background-color .15s cubic-bezier(.2,0,0,1),color .15s cubic-bezier(.2,0,0,1); }
.ft-segmented label.chosen { background:var(--ft-selected); color:var(--ft-text); }
.ft-check { transform-origin:bottom left; animation:ft-check-in .15s cubic-bezier(.2,0,0,1); }
.ft-slider-row { display:flex; flex-direction:column; gap:.25rem; padding:.625rem .75rem; border-radius:.75rem; background:var(--ft-high); }
.ft-slider-row + .ft-slider-row { margin-top:.5rem; }
.ft-slider-label { display:flex; align-items:center; justify-content:space-between; gap:.5rem; font-size:max(.75rem,12px); font-weight:600; color:var(--ft-muted); }
output { font-weight:400; font-variant-numeric:tabular-nums; }
.ft-toggle { display:flex; align-items:center; justify-content:space-between; gap:.6rem; width:100%; padding:.625rem .75rem; border:0; border-radius:.75rem; background:var(--ft-high); color:var(--ft-text); font-size:max(.8rem,12px); font-weight:600; cursor:pointer; }
.ft-toggle + .ft-toggle { margin-top:.5rem; }
.ft-switch { width:3.25rem; height:2rem; border:2px solid var(--ft-muted); border-radius:999px; display:flex; align-items:center; padding:.125rem; background:transparent; transition:background-color .25s cubic-bezier(.2,0,0,1); }
.ft-switch span { display:grid; place-items:center; width:1.25rem; height:1.25rem; border-radius:50%; background:var(--ft-muted); color:var(--card-bg); font-size:max(.8rem,12px); transition:transform .25s cubic-bezier(.2,0,0,1); }
.ft-switch.on { background:var(--primary); border-color:var(--primary); }
.ft-switch.on span { transform:translateX(1.25rem); background:var(--card-bg); color:var(--primary); }
.ft-immersive { width:100%; display:flex; align-items:center; justify-content:center; gap:.5rem; margin-top:.75rem; padding:.5rem; border:1px solid var(--line-divider); border-radius:.75rem; color:var(--ft-text); background:transparent; cursor:pointer; font-size:max(.8rem,12px); }
button:focus-visible,label:has(input:focus-visible) { outline:2px solid var(--primary); outline-offset:2px; }
@keyframes ft-check-in { from { opacity:0; transform:scale(.5); } to { opacity:1; transform:scale(1); } }
@media(prefers-reduced-motion:reduce) { .ft-check { animation:none; } .ft-tabs button,.ft-segmented label,.ft-switch,.ft-switch span { transition:none; } }
</style>
