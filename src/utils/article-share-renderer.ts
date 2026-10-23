import { planArticleSlices } from "./article-share-layout";
import "@/styles/article-share.css";

export interface ArticleShareOptions {
	title: string;
	description: string;
	author: string;
	date: string;
	siteTitle: string;
	url: string;
	cover: string | null;
	width: number;
	fontSize: number;
	color: string;
	english: boolean;
	signal: AbortSignal;
	progress: (message: string) => void;
}

function textElement(
	tag: string,
	text: string,
	className: string,
): HTMLElement {
	const element = document.createElement(tag);
	element.textContent = text;
	element.className = className;
	return element;
}

export async function renderArticleShare(
	options: ArticleShareOptions,
): Promise<Blob[]> {
	const { signal, english } = options;
	const byline = [
		...new Set([options.siteTitle, options.author].filter(Boolean)),
	].join(" · ");
	const say = (zh: string, en: string) => options.progress(english ? en : zh);
	const source = Array.from(
		document.querySelectorAll<HTMLElement>(
			"[data-reading-body] .markdown-content",
		),
	).find(
		(node) =>
			node.getClientRects().length > 0 &&
			getComputedStyle(node).visibility !== "hidden",
	);
	if (!source)
		throw new Error(
			english
				? "The article is not available. Unlock it before sharing."
				: "未找到可阅读的正文，请先解锁文章再分享。",
		);
	const stage = document.createElement("div");
	stage.className = "article-export-stage";
	stage.setAttribute("aria-hidden", "true");
	stage.inert = true;
	const viewport = document.createElement("div");
	viewport.className = "article-export-viewport";
	viewport.style.width = `${options.width}px`;
	stage.append(viewport);
	const sheet = document.createElement("article");
	sheet.className = "article-export";
	sheet.lang = english ? "en" : "zh-CN";
	sheet.style.setProperty("--export-font-size", `${options.fontSize}px`);
	sheet.style.setProperty("--export-color", options.color);
	sheet.style.fontFamily = getComputedStyle(source).fontFamily;
	viewport.append(sheet);
	try {
		signal.throwIfAborted();
		say("准备正文与图片…", "Preparing article and images…");
		if (options.cover) {
			const cover = document.createElement("img");
			cover.src = new URL(options.cover, location.href).href;
			cover.alt = "";
			cover.className = "article-export-cover";
			sheet.append(cover);
		}
		const content = document.createElement("div");
		content.className = "article-export-content";
		content.append(
			textElement("p", `${byline} · ${options.date}`, "article-export-meta"),
		);
		content.append(textElement("h1", options.title, "article-export-title"));
		if (options.description)
			content.append(
				textElement("p", options.description, "article-export-description"),
			);
		const body = source.cloneNode(true) as HTMLElement;
		body.className = "custom-md article-export-body";
		body
			.querySelectorAll(
				"script, .anchor, button, .mermaid-toolbar, .plantuml-toolbar, .copy-button",
			)
			.forEach((node) => {
				node.remove();
			});
		body.querySelectorAll("[id]").forEach((node) => {
			node.removeAttribute("id");
		});
		body.querySelectorAll("details").forEach((node) => {
			node.open = true;
		});
		body.querySelectorAll("iframe, video, audio").forEach((node) => {
			const label = english
				? "Embedded media: open the original article to view."
				: "嵌入媒体：请前往原文查看。";
			node.replaceWith(textElement("p", label, "article-export-media-note"));
		});
		for (const image of body.querySelectorAll("img")) {
			image.src = new URL(
				image.currentSrc || image.getAttribute("src") || "",
				location.href,
			).href;
			image.removeAttribute("srcset");
			image.removeAttribute("sizes");
			image.loading = "eager";
		}
		content.append(body);
		content.append(
			textElement("p", `${byline}\n${options.url}`, "article-export-footer"),
		);
		sheet.append(content);
		document.body.append(stage);
		await document.fonts.ready;
		signal.throwIfAborted();
		// Fail explicitly, rather than silently exporting blank image placeholders.
		const assets = new Map<string, Promise<string>>();
		const fetchAsset = (url: string): Promise<string> => {
			if (url.startsWith("data:")) return Promise.resolve(url);
			const existing = assets.get(url);
			if (existing) return existing;
			const request = (async () => {
				const response = await fetch(url, {
					signal,
					mode: "cors",
					cache: "force-cache",
				});
				if (!response.ok)
					throw new Error(
						english
							? "An article image could not be loaded. Please retry."
							: "正文中有图片加载失败，请稍后重试。",
					);
				const blob = await response.blob();
				return await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result));
					reader.onerror = () => reject(new Error("Image read failed"));
					reader.readAsDataURL(blob);
				});
			})();
			assets.set(url, request);
			return request;
		};
		await Promise.all(
			Array.from(sheet.querySelectorAll("img"), async (image) => {
				image.src = await fetchAsset(image.src);
				await image.decode();
			}),
		);
		signal.throwIfAborted();
		// A clone's SVG retains the already rendered diagram; it is never re-executed.
		const totalHeight = Math.ceil(sheet.getBoundingClientRect().height);
		if (!totalHeight || totalHeight > 150_000)
			throw new Error(
				english
					? "This article is too large to export safely on this device."
					: "文章过长，超出当前设备的安全导出范围。",
			);
		const origin = sheet.getBoundingClientRect().top;
		const breaks = Array.from(
			body.querySelectorAll(
				"p, h1, h2, h3, h4, li, pre, table, figure, blockquote, hr",
			),
			(node) => Math.ceil(node.getBoundingClientRect().bottom - origin + 8),
		);
		const mobile = window.matchMedia("(pointer: coarse)").matches;
		const slices = planArticleSlices(
			options.width,
			totalHeight,
			mobile,
			breaks,
		);
		const { domToBlob } = await import("modern-screenshot");
		const results: Blob[] = [];
		for (let index = 0; index < slices.length; index++) {
			signal.throwIfAborted();
			say(
				`正在生成高清长图 ${index + 1}/${slices.length}…`,
				`Rendering image ${index + 1}/${slices.length}…`,
			);
			const slice = slices[index];
			viewport.style.height = `${slice.height}px`;
			sheet.style.transform = `translateY(-${slice.top}px)`;
			const blob = await domToBlob(viewport, {
				width: options.width,
				height: slice.height,
				scale: 2,
				maximumCanvasSize: mobile ? 4096 : 16000,
				type: "image/png",
				backgroundColor: "#ffffff",
				timeout: 30000,
				style: { position: "relative", left: "0", top: "0", margin: "0" },
				fetchFn: fetchAsset,
			});
			signal.throwIfAborted();
			if (!blob.size)
				throw new Error(
					english
						? "The image is empty. Please retry."
						: "图片生成失败，请重试。",
				);
			results.push(blob);
			// Yield between sections so controls, cancellation and progress can update.
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => resolve()),
			);
		}
		return results;
	} finally {
		stage.remove();
	}
}
