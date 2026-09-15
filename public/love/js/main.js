async function startApp() {
	initContent(CONFIG);
	scaleContent();
	const startMusic = initMusic();
	const staticCanvas = initCanvas("static-canvas");
	const groundCanvas = initCanvas("ground-canvas");
	const dynamicCanvas = initCanvas("canvas");
	const tree = new Tree(staticCanvas, dynamicCanvas, groundCanvas,
		StageConfig.width, StageConfig.height, TreeShape, CONFIG);
	const button = document.getElementById("start-button");
	await new Promise(resolve => {
		button.addEventListener("click", () => {
			button.hidden = true;
			startMusic();
			resolve();
		}, { once: true });
	});

	const { seed, footer } = tree;
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
	startHeartJumpAnimation(tree);
}

document.addEventListener("DOMContentLoaded", startApp);
