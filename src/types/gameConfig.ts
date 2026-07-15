export type GameStatus = "playing" | "played";

export type GameItem = {
	id: string;
	title: string;
	year: string;
	status: GameStatus;
	image: string;
	url: string;
	score?: number;
	tags?: string[];
};

export type GameCategory = {
	id: string;
	name: string;
	description: string;
	icon: string;
	items: GameItem[];
	trailingEllipsis?: boolean;
};

export type GamesPageConfig = {
	title: string;
	description: string;
	categories: GameCategory[];
};
