async function startApp() {
	initContent(CONFIG);
	scaleContent();
	const startMusic = initMusic();
	const staticCanvas = initCanvas("static-canvas");
	const groundCanvas = initCanvas("ground-canvas");
	const dynamicCanvas = initCanvas("canvas");
	const tree = new Tree(staticCanvas, dynamicCanvas, groundCanvas,
		StageConfig.width, StageConfig.height, TreeShape, CONFIG);
	const { seed, footer } = tree;
	const button = document.getElementById("start-button");
	await new Promise(resolve => {
		button.addEventListener("click", async () => {
			button.disabled = true;
			startMusic();
			await animateOpening(button, seed, staticCanvas);
			button.hidden = true;
			startAmbientHeartPetals();
			resolve();
		}, { once: true });
	});

	seed.drawHeart();
	await animateSeedShrink(seed);
	await animateSeedMove(seed, footer);
	await animateTreeGrow(tree);
	await animateFlowerBloom(tree);
	tree.resetFallingBlooms();
	footer.draw();
	await animateTreeMove(staticCanvas);
	document.body.classList.add("letter-open");
	const letter = document.getElementById("letter");
	letter.hidden = false;
	typewriter(letter);
	const treeCaption = document.getElementById("tree-caption");
	treeCaption.hidden = false;
	startTreeCaptionCarousel(treeCaption, CONFIG.treeCaptions, CONFIG.treeCaptionInterval);
	startHeartJumpAnimation(tree);
}

document.addEventListener("DOMContentLoaded", startApp);
