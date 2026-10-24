<script lang="ts">
import { onMount } from "svelte";
import JellyHover from "@/components/common/JellyHover.svelte";
import {
	ARTICLE_FONT_SIZES,
	ARTICLE_WIDTHS,
	DEFAULT_ARTICLE_SHARE,
} from "@/utils/article-share-layout";
import { renderArticleShare } from "@/utils/article-share-renderer";
import { getNextPosterCover } from "@/utils/poster-cover-utils";

export let title: string;
export let description: string;
export let author: string;
export let pubDate: string;
export let url: string;
export let siteTitle: string;
export let cover: string | null;
export let covers: string[];
export let themeColor: string;
export let english = false;
export let onBack: () => void;

let width: number = DEFAULT_ARTICLE_SHARE.width;
let fontSize: number = DEFAULT_ARTICLE_SHARE.fontSize;
let showLink = true;
let showAuthorDate = true;
let images: { url: string; bytes: number }[] = [];
let generating = false;
let dirty = false;
let progress = "";
let error = "";
let controller: AbortController | undefined;
let currentCover = cover;
let saved = { width, fontSize };
const t = (zh: string, en: string) => (english ? en : zh);
const releaseImages = () =>
	images.forEach((image) => {
		URL.revokeObjectURL(image.url);
	});

onMount(() => {
	void generate();
	return () => {
		controller?.abort();
		releaseImages();
	};
});

function changed() {
	controller?.abort();
	controller = undefined;
	generating = false;
	dirty = true;
	error = "";
}

async function generate(randomize = false) {
	controller?.abort();
	const job = new AbortController();
	controller = job;
	generating = true;
	error = "";
	const selected = randomize
		? getNextPosterCover(covers, currentCover, currentCover)
		: currentCover;
	const settings = { width, fontSize, showLink, showAuthorDate };
	const timeout = window.setTimeout(
		() =>
			job.abort(
				new Error(
					t(
						"生成超时，请重试或选择较宽版式。",
						"Generation timed out. Retry or choose a wider layout.",
					),
				),
			),
		120000,
	);
	try {
		const blobs = await renderArticleShare({
			title,
			description,
			author,
			date: pubDate,
			url,
			siteTitle,
			cover: selected,
			...settings,
			color: themeColor,
			english,
			signal: job.signal,
			progress: (message) => {
				if (controller === job) progress = message;
			},
		});
		if (controller !== job) return;
		releaseImages();
		images = blobs.map((blob) => ({
			url: URL.createObjectURL(blob),
			bytes: blob.size,
		}));
		currentCover = selected;
		saved = settings;
		dirty = false;
	} catch (reason) {
		if (controller === job) {
			error =
				reason instanceof Error
					? reason.message
					: t("生成失败，请重试。", "Generation failed. Please retry.");
			if (job.signal.aborted && job.signal.reason instanceof Error)
				error = job.signal.reason.message;
		}
	} finally {
		clearTimeout(timeout);
		if (controller === job) generating = false;
	}
}

function download(index: number) {
	if (generating || dirty || !images[index]) return;
	const link = document.createElement("a");
	link.href = images[index].url;
	link.download = `${title.replace(/[<>:"/\\|?*\s]+/g, "-")}-full${images.length > 1 ? `-${index + 1}` : ""}.png`;
	link.click();
}

function reset() {
	width = DEFAULT_ARTICLE_SHARE.width;
	fontSize = DEFAULT_ARTICLE_SHARE.fontSize;
	showLink = true;
	showAuthorDate = true;
	void generate();
}
</script>

<div class="full-share" style={`--share-color: ${themeColor}`}>
	<div class="full-share-heading">
		<div><h2>{t("全文长图", "Full article image")}</h2><p>{t("保留正文与高光 · 无二维码 · 高清 PNG", "Full text and highlights · No QR code · HD PNG")}</p></div>
		<JellyHover profile="control"><button data-jelly-surface class="share-secondary" on:click={onBack}>{t("返回常规海报", "Back to poster")}</button></JellyHover>
	</div>
	<fieldset class="full-share-elements">
		<legend>{t("显示元素", "Visible elements")}</legend>
		<label><input type="checkbox" bind:checked={showLink} on:change={changed} />{t("显示底部网页链接", "Show website link at the bottom")}</label>
		<label><input type="checkbox" bind:checked={showAuthorDate} on:change={changed} />{t("显示作者与时间", "Show author and date")}</label>
	</fieldset>
	<div class="full-share-settings">
		<label>{t("排版宽度", "Layout width")}<select bind:value={width} on:change={changed}>
			{#each ARTICLE_WIDTHS as value}<option value={value}>{value === 480 ? t("窄版", "Narrow") : value === 600 ? t("推荐版", "Recommended") : t("宽版", "Wide")} · {value}px</option>{/each}
		</select></label>
		<label>{t("正文字号", "Text size")}<select bind:value={fontSize} on:change={changed}>
			{#each ARTICLE_FONT_SIZES as value}<option value={value}>{value}px{value === 18 ? t("（推荐）", " (recommended)") : ""}</option>{/each}
		</select></label>
		<JellyHover profile="control"><button data-jelly-surface class="share-secondary" on:click={reset} disabled={generating}>{t("恢复推荐", "Reset")}</button></JellyHover>
	</div>
	<p class="full-share-hint">{t("高度随全文自动延伸。默认 600px / 18px，按 2 倍清晰度导出；版式设置不会修改原文。", "Height follows the full article. Default: 600px / 18px, exported at 2× resolution. These settings do not change the original article.")}</p>
	<div class="full-share-preview" aria-busy={generating}>
		{#if images.length}
			{#each images as image, index}
				<figure>
					<img src={image.url} alt={t(`文章长图预览 ${index + 1}`, `Article image preview ${index + 1}`)} />
					{#if images.length > 1}<JellyHover profile="control"><button data-jelly-surface class="share-secondary" on:click={() => download(index)} disabled={generating || dirty}>{t(`保存第 ${index + 1} 张`, `Save image ${index + 1}`)}</button></JellyHover>{/if}
					<figcaption>{images.length > 1 ? `${index + 1} / ${images.length} · ` : ""}{saved.width * 2}px · {(image.bytes / 1024 / 1024).toFixed(1)} MB</figcaption>
				</figure>
			{/each}
		{:else if !generating && !error}<p>{t("准备生成文章长图", "Ready to render your article")}</p>{/if}
	</div>
	<div class="full-share-status" role="status" aria-live="polite">
		{#if generating}<span class="share-spinner" aria-hidden="true"></span>{progress || t("正在准备…", "Preparing…")}
		{:else if error}<span role="alert">{error}</span>
		{:else if dirty}{t("设置已更改，点击“应用并生成”更新预览后保存。", "Settings changed. Apply them before saving.")}
		{:else if images.length > 1}{t(`全文较长，为保证清晰度与设备兼容性，已完整分为 ${images.length} 张，请逐张保存。`, `The complete article is split into ${images.length} images to preserve quality and device compatibility. Save each image above.`)}
		{:else if images.length}{t("已生成完整长图，可以保存或随机换一张封面。", "Your full article image is ready. Save it or try another cover.")}{/if}
	</div>
	<div class="full-share-actions">
		<JellyHover profile="control"><button data-jelly-surface class="share-secondary" disabled={generating} on:click={() => generate(true)}>{t("随机换图并生成", "New random cover")}</button></JellyHover>
		{#if generating}<JellyHover profile="control"><button data-jelly-surface class="share-secondary" on:click={changed}>{t("取消生成", "Cancel")}</button></JellyHover>
		{:else if dirty || error || !images.length}<JellyHover profile="control"><button data-jelly-surface class="share-primary" on:click={() => generate()}>{t("应用并生成", "Apply and generate")}</button></JellyHover>
		{:else}<JellyHover profile="control"><button data-jelly-surface class="share-primary" on:click={() => download(0)}>{images.length > 1 ? t("保存第 1 张", "Save image 1") : t("保存全文长图", "Save full image")}</button></JellyHover>{/if}
	</div>
</div>

<style>
.full-share { padding: 20px; color: #344054; background: #fff; }
.full-share-heading { display: flex; gap: 12px; align-items: center; justify-content: space-between; }
h2 { margin: 0; font-size: 20px; font-weight: 700; color: #182230; }
.full-share-heading p, .full-share-hint { color: #667085; font-size: 12px; line-height: 1.8; margin: 6px 0 0; }
.full-share-settings { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; padding: 18px 0 6px; }
label { display: grid; gap: 6px; flex: 1; min-width: 120px; font-size: 12px; font-weight: 600; }
.full-share-elements { display: flex; flex-wrap: wrap; gap: 8px 20px; margin: 14px 0 0; padding: 10px 12px 12px; border: 1px solid #e4e7ec; border-radius: 10px; }
.full-share-elements legend { padding: 0 4px; color: #667085; font-size: 12px; }
.full-share-elements label { display: inline-flex; flex: none; align-items: center; gap: 8px; min-width: 0; min-height: 28px; cursor: pointer; }
.full-share-elements input { width: 16px; height: 16px; flex: none; accent-color: var(--share-color); cursor: pointer; }
.full-share-elements input:focus-visible { outline: 2px solid var(--share-color); outline-offset: 3px; }
select { width: 100%; background: #f8fafc; border: 1px solid #e4e7ec; border-radius: 9px; padding: 10px 8px; color: #344054; font-size: 13px; }
button { border-radius: 10px; font-size: 13px; padding: 11px 14px; line-height: 1.5; font-weight: 600; cursor: pointer; }
button:disabled { opacity: .5; cursor: not-allowed; }
button:focus-visible, select:focus-visible { outline: 2px solid var(--share-color); outline-offset: 3px; }
.share-secondary { background: color-mix(in srgb, var(--share-color) 9%, white); color: color-mix(in srgb, var(--share-color) 75%, #28303d); border: 1px solid color-mix(in srgb, var(--share-color) 20%, white); }
.share-primary { background: var(--share-color); color: #fff; border: 1px solid transparent; }
.full-share-preview { background: #f1f3f6; border: 1px solid #e4e7ec; border-radius: 12px; margin: 16px 0 0; padding: 14px; max-height: min(46vh, 580px); overflow: auto; overscroll-behavior: contain; min-height: 100px; }
figure { margin: 0 auto 18px; max-width: 600px; text-align: center; }
figure:last-child { margin-bottom: 0; }
figure img { display: block; width: 100%; height: auto; box-shadow: 0 3px 12px #10182812; }
figcaption { font-size: 11px; color: #667085; padding: 8px 0; }
.full-share-status { display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 10px 0; font-size: 12px; line-height: 1.8; color: #667085; }
.full-share-status [role="alert"] { color: #b42318; }
.full-share-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.full-share-actions :global(jelly-hover) { flex: 1; }
.full-share-actions button { width: 100%; }
.share-spinner { width: 16px; height: 16px; flex: none; border: 2px solid #eaecf0; border-top-color: var(--share-color); border-radius: 50%; animation: share-spin .8s linear infinite; }
@keyframes share-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .share-spinner { animation: none; } }
@media (max-width: 479px) { .full-share { padding: 14px; } .full-share-heading { align-items: start; } .full-share-heading button { padding: 9px; font-size: 11px; } .full-share-preview { padding: 8px; } }
</style>
