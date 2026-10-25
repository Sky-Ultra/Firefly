function getPageReadingProgress(bounds, viewportHeight) {
	const scrollRange = bounds.height - viewportHeight;
	if (scrollRange <= 0) return bounds.top < 0 ? 1 : 0;
	return Math.max(0, Math.min(1, -bounds.top / scrollRange));
}

function isNextPageArrowVisible(bounds, viewportHeight) {
	return bounds.top <= 1 && bounds.bottom > 1 && getPageReadingProgress(bounds, viewportHeight) >= 0.8;
}

function initReadingProgress({ onReset = () => {} } = {}) {
	const bar = document.getElementById("love-reading-progress");
	const badge = document.getElementById("love-reading-percentage");
	const value = document.getElementById("love-reading-percentage-value");
	const pages = Array.from(document.querySelectorAll("main > section"));
	let started = false;
	let frame = 0;

	function getCurrentPage() {
		const visiblePages = pages.filter(page => !page.hidden);
		let currentPage = visiblePages[0];
		for (const page of visiblePages) {
			if (page.getBoundingClientRect().top <= 1) currentPage = page;
		}
		return currentPage;
	}

	function render() {
		frame = 0;
		if (!started) return;
		const currentPage = getCurrentPage();
		if (!currentPage) return;
		const fraction = getPageReadingProgress(currentPage.getBoundingClientRect(), window.innerHeight);
		const percentage = Math.round(fraction * 100);
		bar.style.setProperty("--reading-progress", String(fraction));
		bar.setAttribute("aria-valuenow", String(percentage));
		bar.setAttribute("aria-label", `第 ${pages.indexOf(currentPage) + 1} 页阅读进度`);
		value.textContent = `${percentage}%`;
		badge.disabled = currentPage.id === "love-third-page";
		badge.setAttribute("aria-label", `第 ${pages.indexOf(currentPage) + 1} 页阅读进度 ${percentage}%${badge.disabled ? "" : "，返回本页顶部并重新播放文字"}`);
		badge.title = badge.disabled ? "当前页阅读进度" : "返回本页顶部并重新播放文字";
	}

	function scheduleRender() {
		if (started && !frame) frame = requestAnimationFrame(render);
	}

	window.addEventListener("scroll", scheduleRender, { passive: true });
	badge.addEventListener("click", () => {
		const currentPage = getCurrentPage();
		if (!started || !currentPage || currentPage.id === "love-third-page") return;
		onReset(currentPage);
		render();
	});
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
