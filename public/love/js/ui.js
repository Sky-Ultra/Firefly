function scaleContent() {
	const viewport = document.getElementById("viewport");
	function resize() {
		const scale = Math.min(viewport.clientWidth / StageConfig.width, 1);
		viewport.style.setProperty("--scene-scale", String(scale));
	}
	resize();
	new ResizeObserver(resize).observe(viewport);
}

function initContent(config) {
	const letter = document.getElementById("letter");
	letter.replaceChildren();
	function addLine(parent, text, className = "") {
		const p = document.createElement("p");
		p.className = className;
		p.textContent = text;
		parent.appendChild(p);
	}
	addLine(letter, config.letter.salutation, "salutation");
	for (const lines of config.letter.paragraphs) {
		const stanza = document.createElement("div");
		stanza.className = "stanza";
		for (const text of lines) addLine(stanza, text);
		letter.appendChild(stanza);
	}
	addLine(letter, config.letter.closing, "closing");
	document.querySelector(".intro-caption").textContent = config.seedText;
	document.querySelector("#tree-caption p").textContent = config.treeCaptions[0];
}

function initCanvas(id) {
	const canvas = document.getElementById(id);
	const { width, height } = StageConfig;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	canvas.getContext("2d").scale(dpr, dpr);
	return canvas;
}

function initMusic() {
	const audio = document.getElementById("bgm");
	const button = document.getElementById("music-toggle");
	audio.volume = 0.45;
	function update() {
		const playing = !audio.paused;
		button.setAttribute("aria-pressed", String(playing));
		button.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
		button.title = playing ? "暂停背景音乐" : "播放背景音乐";
	}
	button.addEventListener("click", () => {
		if (audio.paused) audio.play().catch(update);
		else audio.pause();
	});
	audio.addEventListener("play", update);
	audio.addEventListener("pause", update);
	return () => {
		button.hidden = false;
		audio.play().catch(update);
	};
}
