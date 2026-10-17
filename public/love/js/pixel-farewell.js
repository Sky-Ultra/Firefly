const PixelFarewellConfig = Object.freeze({ countdown: 12000, scatter: 2800, assemble: 2400, maxPixels: 6500, face: "╥﹏╥..." });

function farewellClamp(value) { return Math.max(0, Math.min(1, value)); }
function farewellEase(value) { return 1 - (1 - farewellClamp(value)) ** 3; }

function getFarewellFacePose(part, time, size) {
	const t = time / 1000;
	const envelope = 1 - Math.exp(-Math.max(0, time) / 700);
	const scale = Math.max(0.4, Math.min(1.6, size / 180));
	const floating = Math.sin(t * 1.15) * 1.8 * scale * envelope;
	const side = part === "left-eye" ? -1 : 1;
	const isEye = part === "left-eye" || part === "right-eye";
	const rotation = isEye ? Math.sin(t * 1.5 + side * 0.3) * 0.018 * envelope : 0;
	return {
		dx: isEye ? Math.sin(t * 1.4 + side * 0.35) * 1.4 * scale * envelope : 0,
		dy: floating + (isEye ? (Math.sin(t * 2 + side * 0.45) * 4 + Math.sin(t * 6) * 0.45) * scale * envelope : 0),
		cos: Math.cos(rotation), sin: Math.sin(rotation),
		scaleY: isEye ? 1 + Math.sin(t * 1.7 + side * 0.4) * 0.022 * envelope : 1,
		wavePhase: t * 2.4, waveAmplitude: 5.5 * scale * envelope,
	};
}

function getFarewellFacePoint(point, time, size, pose = getFarewellFacePose(point.part, time, size)) {
	if (point.part === "mouth") {
		return { x: point.x, y: point.y + pose.dy + Math.sin(point.localX * Math.PI * 1.4 + pose.wavePhase) * pose.waveAmplitude };
	}
	const x = point.x - point.pivotX;
	const y = (point.y - point.pivotY) * pose.scaleY;
	return { x: point.pivotX + x * pose.cos - y * pose.sin + pose.dx, y: point.pivotY + x * pose.sin + y * pose.cos + pose.dy };
}

function makeFarewellParticle(point, target, width, height, random = Math.random) {
	return {
		x: point.x, y: point.y, color: point.color, alpha: point.alpha,
		tx: target.x, ty: target.y,
		ex: -40 - random() * width * 0.5, ey: -60 - random() * height * 0.55,
		cx: width * (0.08 + random() * 0.4), cy: height * (0.05 + random() * 0.2),
		delay: farewellClamp((point.x / width + point.y / height) * 0.12 + random() * 0.08),
		arrival: random() * 0.23, sway: 8 + random() * 20, seed: random() * Math.PI * 2,
		size: 1.5 + random() * 1.3,
		pink: ["#dc96b1", "#dfa2ba", "#ce8aa5", "#e6adc3"][Math.floor(random() * 4)],
	};
}

function getFarewellScatterState(particle, progress) {
	const t = farewellClamp((progress - particle.delay) / (1 - particle.delay));
	const eased = t * t * (3 - 2 * t);
	const wave = Math.sin(t * Math.PI * 2 + particle.seed) * particle.sway * t * (1 - t);
	return {
		x: particle.x + (particle.ex - particle.x) * eased + wave,
		y: particle.y + (particle.ey - particle.y) * eased - wave * 0.4,
		alpha: particle.alpha * (1 - farewellClamp((t - 0.35) / 0.65)),
		size: particle.size * (1 - t * 0.35),
	};
}

function getFarewellAssemblyState(particle, progress) {
	const t = farewellClamp((progress - particle.arrival) / (1 - particle.arrival));
	const eased = farewellEase(t);
	const u = 1 - eased;
	return {
		x: u * u * particle.ex + 2 * u * eased * particle.cx + eased * eased * particle.tx,
		y: u * u * particle.ey + 2 * u * eased * particle.cy + eased * eased * particle.ty,
		alpha: farewellClamp(t * 5),
		size: particle.size + (2.35 - particle.size) * eased,
	};
}

function sampleFarewellMask(context, width, height, step, limit = PixelFarewellConfig.maxPixels) {
	const pixels = context.getImageData(0, 0, width, height).data;
	const points = [];
	for (let y = 0; y < height; y += step) {
		for (let x = 0; x < width; x += step) {
			const offset = (y * width + x) * 4;
			if (pixels[offset + 3] < 48) continue;
			points.push({ x, y, color: `rgb(${pixels[offset]} ${pixels[offset + 1]} ${pixels[offset + 2]})`, alpha: pixels[offset + 3] / 255 });
		}
	}
	if (points.length <= limit) return points;
	const stride = points.length / limit;
	return Array.from({ length: limit }, (_, index) => points[Math.floor(index * stride)]);
}

function createPixelFarewellRenderer(section) {
	const canvas = document.getElementById("third-page-pixel-canvas");
	const result = document.getElementById("third-page-pixel-result");
	const article = section.querySelector(".afterword-content");
	const context = canvas.getContext("2d");
	let width = 0;
	let height = 0;
	let targets = [];
	let particles = [];
	let faceSize = 0;

	function makeMask() {
		const mask = document.createElement("canvas");
		mask.width = width;
		mask.height = height;
		return mask.getContext("2d", { willReadFrequently: true });
	}

	function makeFace() {
		const mask = makeMask();
		let size = Math.max(64, Math.min(260, width * 0.245));
		const font = () => `600 ${size}px "PingFang SC", "Microsoft YaHei", sans-serif`;
		mask.font = font();
		if (mask.measureText(PixelFarewellConfig.face).width > width * 0.84) {
			size *= width * 0.84 / mask.measureText(PixelFarewellConfig.face).width;
			mask.font = font();
		}
		mask.fillStyle = "#dc96b1";
		mask.textAlign = "center";
		mask.textBaseline = "middle";
		mask.fillText(PixelFarewellConfig.face, width / 2, height * 0.45);
		faceSize = size;
		const characters = Array.from(PixelFarewellConfig.face);
		const names = ["left-eye", "mouth", "right-eye", "dots", "dots", "dots"];
		const left = (width - mask.measureText(PixelFarewellConfig.face).width) / 2;
		const edges = characters.map((_, index) => left + mask.measureText(characters.slice(0, index + 1).join("")).width);
		const points = sampleFarewellMask(mask, width, height, 3);
		const bounds = {};
		for (const point of points) {
			const index = edges.findIndex(edge => point.x < edge);
			point.part = names[index < 0 ? names.length - 1 : index];
			const group = bounds[point.part] ??= { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
			group.left = Math.min(group.left, point.x); group.right = Math.max(group.right, point.x);
			group.top = Math.min(group.top, point.y); group.bottom = Math.max(group.bottom, point.y);
		}
		for (const point of points) {
			const group = bounds[point.part];
			point.pivotX = (group.left + group.right) / 2;
			point.pivotY = (group.top + group.bottom) / 2;
			point.localX = (point.x - point.pivotX) / Math.max(1, (group.right - group.left) / 2);
		}
		return points;
	}

	function resize() {
		if (!context) { result.classList.add("pixel-fallback"); return; }
		const nextWidth = document.documentElement.clientWidth;
		const nextHeight = window.innerHeight;
		if (width === nextWidth && height === nextHeight) return;
		const sx = width ? nextWidth / width : 1;
		const sy = height ? nextHeight / height : 1;
		width = nextWidth;
		height = nextHeight;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.ceil(width * dpr);
		canvas.height = Math.ceil(height * dpr);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.imageSmoothingEnabled = false;
		targets = makeFace();
		for (let index = 0; index < particles.length; index++) {
			const particle = particles[index];
			particle.x *= sx; particle.ex *= sx; particle.cx *= sx;
			particle.y *= sy; particle.ey *= sy; particle.cy *= sy;
			const target = targets[index % targets.length];
			if (target) { particle.tx = target.x; particle.ty = target.y; }
		}
	}

	function capture() {
		if (!context) return false;
		resize();
		const mask = makeMask();
		const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
		const range = document.createRange();
		let node;
		while ((node = walker.nextNode())) {
			if (!node.textContent.trim()) continue;
			range.selectNodeContents(node);
			const bounds = range.getBoundingClientRect();
			if (bounds.bottom < 0 || bounds.top > height || bounds.right < 0 || bounds.left > width) continue;
			const style = getComputedStyle(node.parentElement);
			const opacity = Number(style.opacity);
			if (opacity < 0.05 || style.visibility === "hidden") continue;
			mask.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			mask.fillStyle = style.color;
			mask.globalAlpha = opacity;
			mask.textBaseline = "top";
			let offset = 0;
			for (const character of node.textContent) {
				range.setStart(node, offset);
				offset += character.length;
				range.setEnd(node, offset);
				const rect = range.getBoundingClientRect();
				if (!character.trim() || rect.bottom < 0 || rect.top > height) continue;
				mask.fillText(character, rect.left, rect.top);
			}
		}
		const points = sampleFarewellMask(mask, width, height, 2);
		const origins = points.length ? points : targets;
		if (!origins.length || !targets.length) return false;
		const count = Math.max(origins.length, targets.length);
		particles = Array.from({ length: count }, (_, index) => {
			const target = targets[Math.floor(index * targets.length / count)];
			const point = origins[Math.floor(index * origins.length / count)];
			return makeFarewellParticle(point, target, width, height);
		});
		canvas.dataset.pixelCount = String(particles.length);
		return true;
	}

	function draw(progress, assembling) {
		if (!context) return;
		context.clearRect(0, 0, width, height);
		for (const particle of particles) {
			const state = assembling ? getFarewellAssemblyState(particle, progress) : getFarewellScatterState(particle, progress);
			if (state.alpha <= 0) continue;
			context.globalAlpha = state.alpha;
			context.fillStyle = assembling ? particle.pink : particle.color;
			context.fillRect(Math.round(state.x), Math.round(state.y), state.size, state.size);
		}
		context.globalAlpha = 1;
	}

	function finish(time = 0) {
		if (!context) { result.classList.add("pixel-fallback"); return; }
		resize();
		context.clearRect(0, 0, width, height);
		context.globalAlpha = 1;
		context.fillStyle = "#dc96b1";
		const motion = prefersReducedMotion() ? "still" : "animated";
		if (canvas.dataset.faceMotion !== motion) canvas.dataset.faceMotion = motion;
		const poses = Object.fromEntries(["left-eye", "mouth", "right-eye", "dots"].map(part => [part, getFarewellFacePose(part, time, faceSize)]));
		for (const point of targets) {
			const position = motion === "still" ? point : getFarewellFacePoint(point, time, faceSize, poses[point.part]);
			context.fillRect(Math.round(position.x), Math.round(position.y), 2.35, 2.35);
		}
	}

	return {
		capture, resize, finish,
		scatter: progress => draw(progress, false),
		assemble: progress => draw(progress, true),
		clear() { if (context) context.clearRect(0, 0, width, height); particles = []; },
	};
}

function initPixelFarewell(section, renderer = createPixelFarewellRenderer(section)) {
	const countdown = document.getElementById("third-page-countdown");
	const number = document.getElementById("third-page-countdown-number");
	const canvas = document.getElementById("third-page-pixel-canvas");
	const result = document.getElementById("third-page-pixel-result");
	const replay = document.getElementById("third-page-pixel-replay");
	const article = section.querySelector(".afterword-content");
	let phase = "idle";
	let elapsed = 0;
	let lastTime = null;
	let frame = 0;

	function inView() {
		const bounds = section.getBoundingClientRect();
		return !section.hidden && !document.hidden && bounds.top < window.innerHeight * 0.62 && bounds.bottom > window.innerHeight * 0.35;
	}

	function setPhase(value) { phase = value; section.dataset.pixelPhase = value; }

	function pause() {
		cancelAnimationFrame(frame);
		frame = 0;
		lastTime = null;
		countdown.hidden = true;
		canvas.hidden = true;
		result.hidden = true;
	}

	function beginDispersal() {
		let captured = false;
		try { captured = renderer.capture(); } catch { /* A static face remains available if canvas capture is unsupported. */ }
		section.classList.add("third-page-text-disintegrated");
		article.setAttribute("aria-hidden", "true");
		setPhase(prefersReducedMotion() || !captured ? "complete" : "dispersing");
	}

	function render() {
		countdown.hidden = phase !== "countdown";
		canvas.hidden = phase === "countdown";
		result.hidden = phase !== "complete";
		if (phase === "countdown") number.textContent = String(Math.max(0, Math.ceil((PixelFarewellConfig.countdown - elapsed) / 1000)));
		if (phase === "dispersing") renderer.scatter(elapsed / PixelFarewellConfig.scatter);
		if (phase === "assembling") renderer.assemble(elapsed / PixelFarewellConfig.assemble);
		if (phase === "complete") renderer.finish(elapsed);
	}

	function tick(now) {
		frame = 0;
		if (!inView()) { pause(); return; }
		if (lastTime !== null) elapsed += Math.max(0, now - lastTime);
		lastTime = now;
		if (phase === "countdown" && elapsed >= PixelFarewellConfig.countdown) {
			elapsed -= PixelFarewellConfig.countdown;
			beginDispersal();
		}
		if (phase === "dispersing" && elapsed >= PixelFarewellConfig.scatter) {
			elapsed -= PixelFarewellConfig.scatter;
			setPhase("assembling");
		}
		if (phase === "assembling" && elapsed >= PixelFarewellConfig.assemble) {
			elapsed = 0;
			setPhase("complete");
		}
		render();
		if (phase !== "complete" || !prefersReducedMotion()) frame = requestAnimationFrame(tick);
	}

	function syncActivity() {
		if (phase === "idle") return;
		if (!inView()) { pause(); return; }
		if (phase === "complete" && prefersReducedMotion()) render();
		else if (!frame) frame = requestAnimationFrame(tick);
	}

	function restart() {
		pause();
		elapsed = 0;
		section.classList.remove("third-page-text-disintegrated");
		article.removeAttribute("aria-hidden");
		renderer.clear();
		setPhase("countdown");
		number.textContent = String(Math.ceil(PixelFarewellConfig.countdown / 1000));
		syncActivity();
	}

	replay.addEventListener("click", restart);
	window.addEventListener("scroll", syncActivity, { passive: true });
	window.addEventListener("resize", () => { renderer.resize(); syncActivity(); }, { passive: true });
	document.addEventListener("visibilitychange", syncActivity);
	return { start() { if (phase === "idle") restart(); } };
}
