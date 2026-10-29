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
				this.frame.src = src;
				this.frame.addEventListener("load", this.syncTheme, { signal });
				this.querySelector("[data-comment-frame-mount]")?.append(this.frame);
			};
			details?.addEventListener("toggle", openFrame, { signal });
			openFrame();
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
					if (loading) loading.hidden = true;
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
			this.scope?.abort();
			this.scope = undefined;
			this.observer?.disconnect();
			this.frame = undefined;
		}
	}
	customElements.define("moment-comments", MomentComments);
}
