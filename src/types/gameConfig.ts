export type GameStatus = "playing" | "played";

export type GameItem = {
	id: string;
	title: string;
	titleEn?: string;
	year: string;
	status: GameStatus;
	image: string;
	url: string;
	score?: number;
	tags?: string[];
	tagsEn?: string[];
};

export type GameCategory = {
	id: string;
	name: string;
	nameEn?: string;
	description: string;
	descriptionEn?: string;
	icon: string;
	items: GameItem[];
	trailingEllipsis?: boolean;
};

export type GamesPageConfig = {
	title: string;
	titleEn?: string;
	description: string;
	descriptionEn?: string;
	categories: GameCategory[];
};
