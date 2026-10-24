function initPageNavigation({ navigate }) {
	const nav = document.getElementById("love-page-navigation");
	const toggle = document.getElementById("love-page-nav-toggle");
	const buttons = Array.from(nav.querySelectorAll("button[data-page]"));
	const pages = ["love-first-page", "afterword", "love-third-page", "love-fourth-page"].map(id => document.getElementById(id));
	const marks = Array.from(toggle.querySelectorAll?.(".page-nav-toggle-line") ?? []);
	let expanded = false;
	let frame = 0;

	function setExpanded(value) {
		expanded = value;
		nav.classList.toggle("is-expanded", value);
		toggle.setAttribute("aria-expanded", String(value));
		toggle.setAttribute("aria-label", value ? "收起页面导航" : "展开页面导航");
	}

	function updateActive() {
		frame = 0;
		let current = 0;
		pages.forEach((page, index) => {
			if (!page.hidden && page.getBoundingClientRect().top <= 2) current = index;
		});
		nav.style.setProperty("--page-nav-index", String(current));
		buttons.forEach((button, index) => {
			if (index === current) button.setAttribute("aria-current", "page");
			else button.removeAttribute("aria-current");
		});
		marks.forEach((mark, index) => mark.classList.toggle("is-current", index === current));
	}

	function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(updateActive); }

	buttons.forEach(button => {
		button.addEventListener("click", event => {
			event.preventDefault();
			const page = Number(button.dataset.page);
			if (page < 1 || page > pages.length) return;
			document.body.dataset.lovePageTarget = String(page);
			setExpanded(false);
			navigate(page);
			requestAnimationFrame(() => {
				delete document.body.dataset.lovePageTarget;
				updateActive();
			});
		});
	});
	toggle.addEventListener("click", () => setExpanded(!expanded));
	nav.addEventListener("pointerenter", () => {
		if (window.matchMedia("(min-width: 701px) and (min-height: 541px) and (hover: hover) and (pointer: fine)").matches) setExpanded(true);
	});
	nav.addEventListener("pointerleave", () => {
		if (window.matchMedia("(min-width: 701px) and (min-height: 541px) and (hover: hover) and (pointer: fine)").matches && !nav.contains(document.activeElement)) setExpanded(false);
	});
	nav.addEventListener("focusout", event => { if (!nav.contains(event.relatedTarget)) setExpanded(false); });
	nav.addEventListener("keydown", event => {
		if (event.key !== "Escape") return;
		setExpanded(false);
		toggle.focus();
	});
	document.addEventListener("pointerdown", event => { if (!nav.contains(event.target)) setExpanded(false); });
	window.addEventListener("scroll", scheduleUpdate, { passive: true });
	window.addEventListener("resize", scheduleUpdate, { passive: true });
	if (typeof ResizeObserver === "function") {
		const observer = new ResizeObserver(scheduleUpdate);
		pages.forEach(page => observer.observe(page));
	}
	nav.hidden = false;
	setExpanded(false);
	updateActive();
}
