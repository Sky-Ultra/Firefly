import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import { gamesPageConfig } from "../src/config/gameConfig";

const requestedGames = [
	{
		id: "plants-vs-zombies-battle-for-neighborville",
		category: "other",
	},
	{
		id: "battlefield-2042",
		category: "aaa",
	},
	{
		id: "battlefield-v",
		category: "aaa",
	},
	{
		id: "war-thunder",
		category: "other",
	},
	{
		id: "left-4-dead",
		category: "aaa",
	},
	{
		id: "left-4-dead-2",
		category: "aaa",
	},
	{
		id: "overcooked",
		category: "other",
	},
	{
		id: "palworld",
		category: "other",
	},
	{
		id: "payday-2",
		category: "other",
	},
	{
		id: "repo",
		category: "other",
	},
	{
		id: "civilization-vi",
		category: "aaa",
		existing: true,
	},
	{
		id: "stardew-valley",
		category: "other",
		existing: true,
	},
	{
		id: "red-dead-redemption-2",
		category: "aaa",
	},
	{
		id: "titanfall-2",
		category: "aaa",
	},
	{
		id: "tmodloader",
		category: "other",
	},
	{
		id: "war-robots",
		category: "other",
	},
	{
		id: "watch-dogs-2",
		category: "aaa",
	},
	{
		id: "terraria",
		category: "other",
		existing: true,
	},
	{
		id: "the-binding-of-isaac-rebirth",
		category: "other",
	},
	{
		id: "rainbow-six-siege",
		category: "aaa",
	},
	{
		id: "dyson-sphere-program",
		category: "other",
	},
	{
		id: "metro-2033-redux",
		category: "aaa",
	},
	{
		id: "hellslave",
		category: "other",
	},
	{
		id: "detroit-become-human",
		category: "aaa",
	},
	{
		id: "breakout-13",
		category: "other",
	},
	{
		id: "death-stranding-2-on-the-beach",
		category: "aaa",
	},
	{
		id: "counter-strike-global-offensive",
		category: "other",
	},
	{
		id: "counter-strike-condition-zero",
		category: "other",
	},
	{
		id: "dead-cells",
		category: "other",
	},
	{
		id: "death-stranding-directors-cut",
		category: "aaa",
	},
	{
		id: "deathmatch-classic",
		category: "other",
	},
	{
		id: "muse-dash",
		category: "other",
	},
	{
		id: "need-for-speed-heat",
		category: "aaa",
	},
	{
		id: "nier-automata",
		category: "aaa",
	},
	{
		id: "honkai-impact-3rd",
		category: "gacha",
	},
];
const allGames = gamesPageConfig.categories.flatMap(
	(category) => category.items,
);
const newGames = requestedGames.filter((game) => !("existing" in game));

test("Honkai Impact 3rd uses the same character-icon source as the other gacha games", () => {
	const credits = JSON.parse(
		readFileSync(
			new URL("../public/assets/games/sources.json", import.meta.url),
			"utf8",
		),
	);
	const icon = credits.covers.find(
		(cover: { id: string }) => cover.id === "honkai-impact-3rd",
	);
	assert.ok(icon);
	assert.match(icon.source, /^https:\/\/lain\.bgm\.tv\//);
	assert.equal(icon.catalogue, "https://bgm.tv/subject/172168");
});

test("every screenshot game and Honkai Impact 3rd appears exactly once", () => {
	assert.ok(allGames.length >= 54);
	assert.equal(new Set(allGames.map((game) => game.id)).size, allGames.length);
	for (const requested of requestedGames) {
		assert.equal(
			allGames.filter((game) => game.id === requested.id).length,
			1,
			requested.id,
		);
	}
});

test("requested games use the intended AAA, other, and gacha categories", () => {
	for (const requested of requestedGames) {
		const category = gamesPageConfig.categories.find((group) =>
			group.items.some((game) => game.id === requested.id),
		);
		assert.equal(category?.id, requested.category, requested.id);
	}
});

test("all games in this update are played without changing unrelated playing statuses", () => {
	for (const requested of requestedGames) {
		assert.equal(
			allGames.find((game) => game.id === requested.id)?.status,
			"played",
			requested.id,
		);
	}
	for (const id of [
		"genshin-impact",
		"honkai-star-rail",
		"wuthering-waves",
		"zenless-zone-zero",
		"minecraft",
		"spiderheck",
		"flowers-blooming-at-the-end-of-summer",
		"ori",
		"rain-world",
	]) {
		assert.equal(
			allGames.find((game) => game.id === id)?.status,
			"playing",
			id,
		);
	}
});

test("new games have local WebP covers, official Steam links, and bilingual metadata", () => {
	for (const requested of newGames) {
		const game = allGames.find((item) => item.id === requested.id);
		assert.ok(game, requested.id);
		assert.equal(game.image, `/assets/games/${requested.id}.webp`);
		const coverPath = new URL(`../public${game.image}`, import.meta.url);
		assert.ok(statSync(coverPath).size > 1000, requested.id);
		const cover = readFileSync(coverPath);
		assert.equal(cover.subarray(0, 4).toString("ascii"), "RIFF");
		assert.equal(cover.subarray(8, 12).toString("ascii"), "WEBP");
		assert.match(game.url, /^https:\/\/store\.steampowered\.com\/app\/\d+\/$/);
		assert.ok(game.titleEn?.trim(), requested.id);
		assert.match(game.year, /^\d{4}$/);
		assert.equal(game.tags?.length, game.tagsEn?.length, requested.id);
		assert.equal(game.score, undefined, "Do not invent ratings for new games");
	}
});
