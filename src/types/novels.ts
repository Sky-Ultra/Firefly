export type NovelSourceId =
	| "wikisource"
	| "weread"
	| "gutenberg"
	| "xinhua"
	| "aozora"
	| "fadedpage"
	| "qimao";
export interface NovelSource {
	site: NovelSourceId;
	url: string;
	access: "open" | "preview" | "partial";
	note?: string;
	language: "zh" | "en" | "ja" | "ru";
}
export interface Novel {
	id: string;
	title: string;
	author: string;
	genre: string;
	categories: string[];
	description: string;
	aliases?: string[];
	cover: string;
	sources: NovelSource[];
}
