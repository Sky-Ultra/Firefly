const themeProperties = [
	"--primary",
	"--card-bg",
	"--card-bg-transparent",
	"--line-divider",
	"--deep-text",
	"--content-meta",
	"--btn-content",
	"--btn-regular-bg",
];

export function registerMomentComments(): void {
	if (customElements.get("moment-comments")) return;
	class MomentComments extends HTMLElement {
		private scope?: AbortController;
		private observer?: MutationObserver;
		private frame?: HTMLIFrameElement;
		private timer?: number;
		connectedCallback() {
			queueMicrotask(() => {
				if (this.isConnected && !this.scope) this.connect();
			});
		}
		private connect() {
			this.scope = new AbortController();
			const { signal } = this.scope;
			const details = this.querySelector("details");
			const openFrame = () => {
				if (!details?.open || this.frame) return;
				const src = this.dataset.frameUrl;
				if (!src) return;
				this.frame = document.createElement("iframe");
				this.frame.dataset.momentCommentFrame = "";
				this.frame.title = "动态评论 / Comments";
				this.frame.addEventListener("load", this.syncTheme, { signal });
				this.querySelector("[data-comment-frame-mount]")?.append(this.frame);
				// Begin navigation after the frame belongs to the active page.
				this.frame.src = src;
				this.timer = window.setTimeout(() => {
					const fallback = this.querySelector<HTMLElement>(
						"[data-comment-fallback]",
					);
					const loading = this.querySelector<HTMLElement>(
						"[data-comment-loading]",
					);
					if (fallback) fallback.hidden = false;
					if (loading) loading.hidden = true;
				}, 15000);
			};
			details?.addEventListener("toggle", openFrame, { signal });
			openFrame();
			this.querySelector("[data-comment-retry]")?.addEventListener(
				"click",
				() => {
					window.clearTimeout(this.timer);
					this.frame?.remove();
					this.frame = undefined;
					const fallback = this.querySelector<HTMLElement>(
						"[data-comment-fallback]",
					);
					const loading = this.querySelector<HTMLElement>(
						"[data-comment-loading]",
					);
					if (fallback) fallback.hidden = true;
					if (loading) loading.hidden = false;
					openFrame();
				},
				{ signal },
			);
			window.addEventListener(
				"message",
				(event) => {
					if (
						event.origin !== location.origin ||
						event.source !== this.frame?.contentWindow ||
						event.data?.type !== "firefly:moment-comments-size"
					)
						return;
					const height = event.data.height;
					if (typeof height !== "number" || !Number.isFinite(height)) return;
					if (this.frame)
						this.frame.style.height = `${Math.max(180, Math.min(100000, Math.ceil(height)))}px`;
					const loading = this.querySelector<HTMLElement>(
						"[data-comment-loading]",
					);
					if (event.data.ready === true) {
						window.clearTimeout(this.timer);
						const fallback = this.querySelector<HTMLElement>(
							"[data-comment-fallback]",
						);
						if (fallback) fallback.hidden = true;
						if (loading) loading.hidden = true;
					}
				},
				{ signal },
			);
			this.observer = new MutationObserver(this.syncTheme);
			this.observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class", "style", "data-language"],
			});
			this.observer.observe(document.body, {
				attributes: true,
				attributeFilter: ["class"],
			});
			document.addEventListener("firefly:language-change", this.syncTheme, {
				signal,
			});
		}
		private readonly syncTheme = () => {
			const styles = getComputedStyle(this);
			this.frame?.contentWindow?.postMessage(
				{
					type: "firefly:moment-comments-theme",
					dark: document.documentElement.classList.contains("dark"),
					transparent: document.body.classList.contains(
						"wallpaper-transparent",
					),
					language:
						document.documentElement.dataset.language === "en" ? "en" : "zh-CN",
					palette: Object.fromEntries(
						themeProperties.map((key) => [key, styles.getPropertyValue(key)]),
					),
				},
				location.origin,
			);
		};
		disconnectedCallback() {
			window.clearTimeout(this.timer);
			this.scope?.abort();
			this.scope = undefined;
			this.observer?.disconnect();
			this.frame = undefined;
		}
	}
	customElements.define("moment-comments", MomentComments);
}
