// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	return (tree, { data }) => {
		const sealedStats = data.astro.frontmatter.sealedReadingStats;
		if (
			sealedStats &&
			Number.isInteger(sealedStats.words) &&
			sealedStats.words >= 0 &&
			Number.isInteger(sealedStats.minutes) &&
			sealedStats.minutes >= 1
		) {
			data.astro.frontmatter.words = sealedStats.words;
			data.astro.frontmatter.minutes = sealedStats.minutes;
			return;
		}
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutes = Math.max(
			1,
			Math.round(readingTime.minutes),
		);
		data.astro.frontmatter.words = readingTime.words;
	};
}
