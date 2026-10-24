function initAfterword() {
	const indicator = document.getElementById("love-scroll-indicator");
	const hint = indicator.querySelector(".love-scroll-hint");
	const afterword = document.getElementById("afterword");
	const fourthPage = document.getElementById("love-fourth-page");
	let activated = false;
	let fourthActivated = false;
	const thirdPage = initThirdPage({ revealParagraphs, canEnter: () => activated, onReveal: revealFourthPage });

	function showParagraph(paragraph) {
		if (paragraph.dataset.revealed === "true") return;
		paragraph.dataset.revealed = "true";
		if (prefersReducedMotion()) return;

		const characters = Array.from(paragraph.textContent);
		const chunkSizes = [3, 5, 4, 6];
		const fragment = document.createDocumentFragment();
		const tokens = [];
		let offset = 0;
		while (offset < characters.length) {
			const size = chunkSizes[tokens.length % chunkSizes.length];
			const token = document.createElement("span");
			token.className = "afterword-token";
			token.textContent = characters.slice(offset, offset + size).join("");
			token.style.setProperty("--token-delay", `${tokens.length * 28}ms`);
			fragment.appendChild(token);
			tokens.push(token);
			offset += size;
		}
		paragraph.replaceChildren(fragment);
		requestAnimationFrame(() => {
			for (const token of tokens) token.classList.add("is-visible");
		});
	}

	function revealParagraphs(section) {
		if (!("IntersectionObserver" in window)) {
			for (const paragraph of section.querySelectorAll("p")) showParagraph(paragraph);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				observer.unobserve(entry.target);
				showParagraph(entry.target);
			}
		}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
		for (const paragraph of section.querySelectorAll("p")) observer.observe(paragraph);
	}

	function revealAfterword() {
		if (activated) return;
		activated = true;
		afterword.hidden = false;
		indicator.hidden = false;
		revealParagraphs(afterword);
		thirdPage.updateVisibility();
		updateIndicatorVisibility();
	}

	function revealFourthPage() {
		if (fourthActivated) return;
		fourthActivated = true;
		fourthPage.hidden = false;
		revealParagraphs(fourthPage);
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
