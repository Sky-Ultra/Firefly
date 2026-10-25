// One timeline per article; 90% of the original speed is 10% slower.
function revealAfterwordArticle(section) {
	if (section.dataset.revealPrepared === "true") return;
	section.dataset.revealPrepared = "true";
	const paragraphs = Array.from(section.querySelectorAll("p"));
	if (prefersReducedMotion()) {
		section.dataset.revealStarted = "true";
		return;
	}

	const tokens = [];
	const chunkSizes = [3, 5, 4, 6];
	const tokenInterval = 28 / 0.9;
	for (const paragraph of paragraphs) {
		const characters = Array.from(paragraph.textContent);
		const fragment = document.createDocumentFragment();
		let offset = 0;
		while (offset < characters.length) {
			const size = chunkSizes[tokens.length % chunkSizes.length];
			const token = document.createElement("span");
			token.className = "afterword-token";
			token.textContent = characters.slice(offset, offset + size).join("");
			token.style.setProperty("--token-delay", `${(tokens.length * tokenInterval).toFixed(2)}ms`);
			fragment.appendChild(token);
			tokens.push(token);
			offset += size;
		}
		paragraph.replaceChildren(fragment);
	}

	function start() {
		if (section.dataset.revealStarted === "true") return;
		section.dataset.revealStarted = "true";
		requestAnimationFrame(() => {
			for (const token of tokens) token.classList.add("is-visible");
		});
	}

	if (!("IntersectionObserver" in window)) {
		start();
		return;
	}
	const observer = new IntersectionObserver(entries => {
		if (!entries.some(entry => entry.isIntersecting)) return;
		const destination = document.body?.dataset?.lovePageTarget;
		const pageIds = ["love-first-page", "afterword", "love-third-page", "love-fourth-page"];
		if (destination && pageIds[Number(destination) - 1] !== section.id) return;
		const bounds = section.getBoundingClientRect();
		if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
		observer.disconnect();
		start();
	}, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
	observer.observe(section);
}

function initAfterword() {
	const indicator = document.getElementById("love-scroll-indicator");
	const hint = indicator.querySelector(".love-scroll-hint");
	const afterword = document.getElementById("afterword");
	const fourthPage = document.getElementById("love-fourth-page");
	let activated = false;
	let fourthActivated = false;
	const thirdPage = initThirdPage({ revealParagraphs: revealAfterwordArticle, canEnter: () => activated, onReveal: revealFourthPage });

	function revealAfterword() {
		if (activated) return;
		activated = true;
		afterword.hidden = false;
		indicator.hidden = false;
		revealAfterwordArticle(afterword);
		thirdPage.updateVisibility();
		updateIndicatorVisibility();
	}

	function revealFourthPage() {
		if (fourthActivated) return;
		fourthActivated = true;
		fourthPage.hidden = false;
		revealAfterwordArticle(fourthPage);
	}

	function navigateToPage(page) {
		const ids = ["love-first-page", "afterword", "love-third-page", "love-fourth-page"];
		const target = document.getElementById(ids[page - 1]);
		if (!target) return;
		if (page >= 2) revealAfterword();
		if (page >= 3) thirdPage.reveal();
		if (page === 4) revealFourthPage();
		// Direct section navigation avoids passing through another page's timed effects.
		target.scrollIntoView({ behavior: "auto", block: "start" });
		target.focus({ preventScroll: true });
	}

	function showScrollHintWhenSecondLineStarts() {
		const secondLine = document.querySelector("#letter .stanza p:nth-child(2)");
		if (!secondLine) return;
		const observer = new MutationObserver(() => {
			if (!secondLine.firstChild?.textContent?.trim()) return;
			hint.hidden = false;
			observer.disconnect();
		});
		observer.observe(secondLine, { childList: true, characterData: true, subtree: true });
		if (secondLine.firstChild?.textContent?.trim()) {
			hint.hidden = false;
			observer.disconnect();
		}
	}

	function updateIndicatorVisibility() {
		indicator.classList.toggle("hide", window.scrollY > 100);
	}

	indicator.addEventListener("click", () => {
		afterword.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
	});
	window.addEventListener("scroll", updateIndicatorVisibility, { passive: true });
	return { revealAfterword, showScrollHintWhenSecondLineStarts, navigateToPage, setPetalController: thirdPage.setPetalController };
}
