type VideoWindow = Window & typeof globalThis;

export function registerSocialVideoElement(view: VideoWindow = window): void {
	if (view.customElements.get("moment-video-player")) return;
	let expandedVideo: SocialVideoElement | null = null;
	class SocialVideoElement extends view.HTMLElement {
		private abort: AbortController | null = null;
		private frame: HTMLIFrameElement | null = null;
		private timer: number | null = null;
		private expanded = false;
		private dialog: HTMLDialogElement | null = null;
		private loadButton: HTMLButtonElement | null = null;
		private expandButton: HTMLButtonElement | null = null;
		private retryButton: HTMLButtonElement | null = null;
		private status: HTMLElement | null = null;
		private stage: HTMLElement | null = null;
		private frameHost: HTMLElement | null = null;
		connectedCallback() {
			if (this.abort) return;
			this.dialog = this.querySelector("[data-video-dialog]");
			this.loadButton = this.querySelector("[data-video-load]");
			this.expandButton = this.querySelector("[data-video-expand]");
			this.retryButton = this.querySelector("[data-video-retry]");
			this.status = this.querySelector("[data-video-status]");
			this.stage = this.querySelector("[data-video-stage]");
			this.frameHost = this.querySelector("[data-video-frame]");
			if (
				!this.dialog ||
				!this.loadButton ||
				!this.expandButton ||
				!this.status ||
				!this.stage ||
				!this.frameHost
			)
				return;
			this.abort = new view.AbortController();
			this.loadButton.hidden = false;
			this.loadButton.disabled = false;
			this.expandButton.disabled = true;
			if (this.retryButton) this.retryButton.hidden = true;
			this.stage.removeAttribute("data-ready");
			this.status.hidden = true;
			this.setAttribute("aria-busy", "false");
			const options = { signal: this.abort.signal };
			this.loadButton.addEventListener("click", () => this.load(), options);
			this.retryButton?.addEventListener(
				"click",
				() => this.restart(),
				options,
			);
			this.expandButton.addEventListener(
				"click",
				() => (this.expanded ? this.collapse() : this.enlarge()),
				options,
			);
			this.dialog.addEventListener(
				"cancel",
				(event) => {
					if (this.expanded) {
						event.preventDefault();
						this.collapse();
					}
				},
				options,
			);
			this.dialog.addEventListener(
				"click",
				(event) => {
					if (!this.expanded || !this.dialog || event.target !== this.dialog)
						return;
					const bounds = this.dialog.getBoundingClientRect();
					if (
						event.clientX < bounds.left ||
						event.clientX > bounds.right ||
						event.clientY < bounds.top ||
						event.clientY > bounds.bottom
					)
						this.collapse();
				},
				options,
			);
			this.dialog.addEventListener(
				"close",
				() => {
					if (!this.dialog?.open && this.expanded) this.collapse();
				},
				options,
			);
		}
		private translated(zh: string, en: string) {
			return view.document.documentElement.dataset.language === "en" ? en : zh;
		}
		private message(zh: string, en: string) {
			if (!this.status) return;
			this.status.textContent = this.translated(zh, en);
			this.status.hidden = false;
		}
		private load() {
			if (this.frame || !this.frameHost || !this.loadButton) return;
			let source: URL;
			try {
				source = new URL(this.dataset.playerUrl ?? "");
			} catch {
				return;
			}
			if (
				source.origin !== "https://player.bilibili.com" ||
				source.pathname !== "/player.html" ||
				!/^BV[0-9A-Za-z]{10}$/.test(source.searchParams.get("bvid") ?? "")
			)
				return;
			source.searchParams.set("autoplay", "0");
			const frame = view.document.createElement("iframe");
			frame.title =
				view.document.documentElement.dataset.language === "en"
					? (this.dataset.titleEn ?? this.dataset.titleZh ?? "Bilibili video")
					: (this.dataset.titleZh ?? "B站视频");
			frame.allowFullscreen = true;
			frame.loading = "eager";
			frame.allow = "fullscreen; picture-in-picture; encrypted-media";
			frame.referrerPolicy = "strict-origin-when-cross-origin";
			frame.setAttribute(
				"sandbox",
				"allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox",
			);
			this.frame = frame;
			this.loadButton.disabled = true;
			this.loadButton.hidden = true;
			if (this.expandButton) this.expandButton.disabled = false;
			if (this.retryButton) this.retryButton.hidden = true;
			this.setAttribute("aria-busy", "true");
			this.message("正在加载播放器…", "Loading the video player…");
			frame.addEventListener(
				"load",
				() => {
					if (this.frame !== frame) return;
					this.clearTimer();
					this.stage?.setAttribute("data-ready", "true");
					if (this.loadButton) this.loadButton.hidden = true;
					if (this.expandButton) this.expandButton.disabled = false;
					if (this.status) this.status.hidden = true;
					if (this.retryButton) this.retryButton.hidden = true;
					this.setAttribute("aria-busy", "false");
				},
				{ once: true },
			);
			frame.addEventListener(
				"error",
				() => {
					if (this.frame === frame) this.failed();
				},
				{ once: true },
			);
			frame.src = source.href;
			this.timer = view.setTimeout(() => this.slow(), 15000);
			this.frameHost.appendChild(frame);
		}
		private clearTimer() {
			if (this.timer !== null) view.clearTimeout(this.timer);
			this.timer = null;
		}
		private slow() {
			this.clearTimer();
			if (!this.frame) return;
			if (this.retryButton) this.retryButton.hidden = false;
			this.setAttribute("aria-busy", "false");
			this.message(
				"播放器加载较慢，可继续等待、重新加载或去 B 站。",
				"The player is taking longer. Wait, reload, or watch on Bilibili.",
			);
		}
		private restart() {
			this.clearTimer();
			this.frame?.remove();
			this.frame = null;
			this.stage?.removeAttribute("data-ready");
			this.load();
		}
		private failed() {
			this.collapse(false);
			this.clearTimer();
			this.frame?.remove();
			this.frame = null;
			this.stage?.removeAttribute("data-ready");
			if (this.loadButton) {
				this.loadButton.hidden = false;
				this.loadButton.disabled = false;
			}
			if (this.expandButton) this.expandButton.disabled = true;
			if (this.retryButton) this.retryButton.hidden = true;
			this.setAttribute("aria-busy", "false");
			this.message(
				"暂时没加载出来，可以重试或前往 B 站。",
				"Unable to load the player. Retry or watch on Bilibili.",
			);
		}
		private enlarge() {
			if (!this.frame || !this.dialog || this.expandButton?.disabled) return;
			if (typeof this.dialog.showModal !== "function") {
				void this.frameHost?.requestFullscreen?.().catch(() => {});
				return;
			}
			expandedVideo?.collapse(false);
			this.dialog.close();
			this.expanded = true;
			expandedVideo = this;
			this.dialog.dataset.expanded = "true";
			this.dialog.setAttribute("aria-modal", "true");
			try {
				this.dialog.showModal();
			} catch {
				this.expanded = false;
				expandedVideo = null;
				this.dialog.open = true;
				this.dialog.dataset.expanded = "false";
				this.dialog.removeAttribute("aria-modal");
				return;
			}
			view.document.documentElement.classList.add("has-moment-video-dialog");
			this.labels();
			this.expandButton?.focus();
		}
		private labels() {
			this.expandButton?.setAttribute("aria-expanded", String(this.expanded));
			const open = this.querySelector<HTMLElement>("[data-video-expand-label]");
			const close = this.querySelector<HTMLElement>(
				"[data-video-collapse-label]",
			);
			if (open) open.hidden = this.expanded;
			if (close) close.hidden = !this.expanded;
		}
		private collapse(focus = true) {
			if (!this.expanded || !this.dialog) return;
			this.expanded = false;
			this.dialog.close();
			this.dialog.open = true;
			this.dialog.dataset.expanded = "false";
			this.dialog.removeAttribute("aria-modal");
			if (expandedVideo === this) {
				expandedVideo = null;
				view.document.documentElement.classList.remove(
					"has-moment-video-dialog",
				);
			}
			this.labels();
			if (focus && this.isConnected) this.expandButton?.focus();
		}
		disconnectedCallback() {
			this.collapse(false);
			this.clearTimer();
			this.abort?.abort();
			this.abort = null;
			this.frame?.remove();
			this.frame = null;
		}
	}
	view.customElements.define("moment-video-player", SocialVideoElement);
}
