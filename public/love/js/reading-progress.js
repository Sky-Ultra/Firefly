function getPageReadingProgress(bounds, viewportHeight) {
	const scrollRange = bounds.height - viewportHeight;
	if (scrollRange <= 0) return bounds.top < 0 ? 1 : 0;
	return Math.max(0, Math.min(1, -bounds.top / scrollRange));
}

function initReadingProgress() {
	const bar = document.getElementById("love-reading-progress");
	const badge = document.getElementById("love-reading-percentage");
	const pages = Array.from(document.querySelectorAll("main > section"));
	let started = false;
	let frame = 0;

	function render() {
		frame = 0;
		if (!started) return;
		const visiblePages = pages.filter(page => !page.hidden);
		let currentPage = visiblePages[0];
		for (const page of visiblePages) {
			if (page.getBoundingClientRect().top <= 1) currentPage = page;
		}
		if (!currentPage) return;
		const fraction = getPageReadingProgress(currentPage.getBoundingClientRect(), window.innerHeight);
		const percentage = Math.round(fraction * 100);
		bar.style.setProperty("--reading-progress", String(fraction));
		bar.setAttribute("aria-valuenow", String(percentage));
		bar.setAttribute("aria-label", `第 ${pages.indexOf(currentPage) + 1} 页阅读进度`);
		badge.textContent = `${percentage}%`;
	}

	function scheduleRender() {
		if (started && !frame) frame = requestAnimationFrame(render);
	}

	window.addEventListener("scroll", scheduleRender, { passive: true });
	window.addEventListener("resize", scheduleRender, { passive: true });
	if (typeof ResizeObserver === "function") {
		const observer = new ResizeObserver(scheduleRender);
		for (const page of pages) observer.observe(page);
	}
	return {
		start() {
			started = true;
			bar.hidden = false;
			badge.hidden = false;
			render();
		},
	};
}
