function initThirdPage({ revealParagraphs, canEnter }) {
	const afterword = document.getElementById("afterword");
	const thirdPage = document.getElementById("love-third-page");
	const indicator = document.getElementById("third-page-scroll-indicator");
	let unlocked = false;
	let entered = false;
	let petals = null;
	let touchStart = null;
	let lastWheelTime = -Infinity;
	let wheelStartedAtBottom = false;
	let wheelDistance = 0;

	function eligible() {
		return canEnter() && !unlocked;
	}

	function atBottom() {
		return afterword.getBoundingClientRect().bottom <= window.innerHeight + 4;
	}

	function updateVisibility() {
		const bounds = afterword.getBoundingClientRect();
		const nearEnd = Math.min(180, window.innerHeight * 0.22);
		indicator.hidden = !eligible() || bounds.top >= 0 || bounds.bottom > window.innerHeight + nearEnd;
	}

	function beginEntry() {
		if (entered) return;
		entered = true;
		thirdPage.classList.remove("third-page-awaiting-entry");
		if (!prefersReducedMotion()) thirdPage.classList.add("third-page-entering");
		thirdPage.focus({ preventScroll: true });
		petals?.boostFor(10000);
		revealParagraphs(thirdPage);
	}

	function openThirdPage() {
		if (!eligible()) return;
		unlocked = true;
		indicator.hidden = true;
		thirdPage.hidden = false;
		if (!prefersReducedMotion() && "IntersectionObserver" in window) {
			thirdPage.classList.add("third-page-awaiting-entry");
			const entryObserver = new IntersectionObserver((entries) => {
				if (!entries.some(entry => entry.isIntersecting)) return;
				entryObserver.disconnect();
				beginEntry();
			}, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
			entryObserver.observe(thirdPage);
		} else {
			beginEntry();
		}
		thirdPage.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
	}

	function handleWheel(event) {
		if (!eligible()) return;
		const now = performance.now();
		if (!atBottom()) {
			lastWheelTime = now;
			wheelStartedAtBottom = false;
			wheelDistance = 0;
			return;
		}
		// A new push after a pause, not the momentum that reached the end.
		if (now - lastWheelTime > 260) {
			wheelStartedAtBottom = true;
			wheelDistance = 0;
		}
		lastWheelTime = now;
		if (!wheelStartedAtBottom || event.deltaY <= 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
			wheelDistance = 0;
			return;
		}
		const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
		wheelDistance += event.deltaY * unit;
		if (wheelDistance >= 180) openThirdPage();
	}

	function handleTouchStart(event) {
		touchStart = null;
		if (!eligible() || !atBottom() || event.touches.length !== 1) return;
		const touch = event.touches[0];
		touchStart = { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: performance.now() };
	}

	function handleTouchEnd(event) {
		const start = touchStart;
		touchStart = null;
		if (!start || !eligible() || !atBottom()) return;
		const touch = Array.from(event.changedTouches).find(item => item.identifier === start.id);
		if (!touch) return;
		const vertical = start.y - touch.clientY;
		const horizontal = Math.abs(start.x - touch.clientX);
		if (vertical >= 90 && vertical > horizontal * 1.3 && performance.now() - start.time <= 1000) openThirdPage();
	}

	indicator.addEventListener("click", openThirdPage);
	window.addEventListener("scroll", updateVisibility, { passive: true });
	window.addEventListener("resize", updateVisibility, { passive: true });
	window.addEventListener("wheel", handleWheel, { passive: true });
	window.addEventListener("touchstart", handleTouchStart, { passive: true });
	window.addEventListener("touchend", handleTouchEnd, { passive: true });
	window.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
	thirdPage.addEventListener("animationend", event => {
		if (event.target === thirdPage && event.animationName === "third-page-fade-in") {
			thirdPage.classList.remove("third-page-entering");
		}
	});
	updateVisibility();
	return { updateVisibility, setPetalController: controller => { petals = controller; } };
}
