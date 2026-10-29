import manifest from "../../public/assets/images/comment-mascots/manifest.json";

export function chooseCommentMascot(
	random: () => number = Math.random,
): (typeof manifest.items)[number] | undefined {
	return manifest.items[
		Math.min(
			manifest.items.length - 1,
			Math.floor(random() * manifest.items.length),
		)
	];
}

// One choice per document load; soft navigation and reply forms keep the same character.
const chosen = chooseCommentMascot();
const images = new Map<string, Promise<string>>();
function imageData(src: string): Promise<string> {
	let promise = images.get(src);
	if (!promise) {
		promise = fetch(src)
			.then((response) => {
				if (!response.ok) throw new Error("Mascot unavailable");
				return response.blob();
			})
			.then(
				(blob) =>
					new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result));
						reader.onerror = () => reject(reader.error);
						reader.readAsDataURL(blob);
					}),
			);
		images.set(src, promise);
	}
	return promise;
}
export function registerCommentMascot(): void {
	if (customElements.get("comment-mascot")) return;
	class CommentMascot extends HTMLElement {
		private observer?: IntersectionObserver;
		private scope?: AbortController;
		private generation = 0;
		connectedCallback() {
			this.scope = new AbortController();
			const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
			const update = () => {
				if (!chosen) return;
				const generation = ++this.generation;
				imageData(motion.matches ? chosen.still : chosen.src)
					.then((data) => {
						if (!this.isConnected || generation !== this.generation) return;
						this.style.setProperty("--comment-mascot-image", `url("${data}")`);
						this.dataset.mascotReady = "true";
						this.dispatchEvent(
							new CustomEvent("firefly:comment-mascot-ready", {
								bubbles: true,
							}),
						);
					})
					.catch(() => {}); // Decoration failure never blocks comments.
			};
			this.observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						this.observer?.disconnect();
						update();
						motion.addEventListener("change", update, {
							signal: this.scope?.signal,
						});
					}
				},
				{ rootMargin: "150px" },
			);
			this.observer.observe(this);
		}
		disconnectedCallback() {
			this.generation++;
			this.observer?.disconnect();
			this.scope?.abort();
		}
	}
	customElements.define("comment-mascot", CommentMascot);
}
