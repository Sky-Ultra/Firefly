import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import { getImageQuality } from "@/utils/image-utils";

export const RANDOM_COVER_IMAGE = "random";

export interface RandomCoverImage {
	id: string;
	previewUrl: string;
	originalUrl: string;
}

const randomCoverModules = import.meta.glob<ImageMetadata>(
	"../Useing Picture/**/*.{png,jpg,jpeg,webp,avif}",
	{
		eager: true,
		import: "default",
	},
);

const randomCoverOriginalModules = import.meta.glob<string>(
	"../Useing Picture/**/*.{png,jpg,jpeg,webp,avif}",
	{
		eager: true,
		import: "default",
		query: "?url",
	},
);

const mobileHomeWallpaperOriginalModules = import.meta.glob<string>(
	"../Using Picture mobile/**/*.{png,jpg,jpeg,webp,avif}",
	{
		eager: true,
		import: "default",
		query: "?url",
	},
);

let randomCoverImagesPromise: Promise<RandomCoverImage[]> | undefined;

export function isRandomCoverImage(image?: string): boolean {
	return image === RANDOM_COVER_IMAGE;
}

/**
 * 扫描 src/Useing Picture，同时保留原图地址并生成适合列表预览的 WebP 资源。
 * 文件名排序只用于保证服务端首屏回退图稳定；浏览器会在每次页面加载时重新洗牌。
 */
export function getRandomCoverImages(): Promise<RandomCoverImage[]> {
	if (!randomCoverImagesPromise) {
		const images = Object.entries(randomCoverModules).sort(([a], [b]) =>
			a.localeCompare(b, "zh-CN"),
		);

		if (images.length === 0) {
			throw new Error(
				"随机封面图片池为空：请向 src/Useing Picture 添加 jpg、jpeg、png、webp 或 avif 图片。",
			);
		}

		randomCoverImagesPromise = Promise.all(
			images.map(async ([id, image]) => {
				const originalUrl = randomCoverOriginalModules[id];
				if (!originalUrl) {
					throw new Error(`无法读取随机封面原图：${id}`);
				}
				const result = await getImage({
					src: image,
					width: Math.min(image.width, 1200),
					format: "webp",
					quality: getImageQuality(),
				});
				return {
					id,
					previewUrl: result.src,
					originalUrl,
				};
			}),
		);
	}

	return randomCoverImagesPromise;
}

/**
 * 扫描移动端首页专用壁纸池。这里保留原图 URL，不参与文章封面分配。
 */
export function getMobileHomeWallpaperImages(): RandomCoverImage[] {
	const images = Object.entries(mobileHomeWallpaperOriginalModules).sort(
		([a], [b]) => a.localeCompare(b, "zh-CN"),
	);

	if (images.length === 0) {
		throw new Error(
			"移动端首页壁纸池为空：请向 src/Using Picture mobile 添加 jpg、jpeg、png、webp 或 avif 图片。",
		);
	}

	return images.map(([id, originalUrl]) => ({
		id,
		previewUrl: originalUrl,
		originalUrl,
	}));
}
