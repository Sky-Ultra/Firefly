import { getReadingProgress } from "./reading-progress";

const refreshEvents = [
	"astro:page-load",
	"swup:contentReplaced",
	"swup:content:replace",
	"swup:page:view",
	"firefly:page:loaded",
	"firefly:language-change",
	"password:decrypted",
] as const;

type SwupHooks = {
	on: (name: string, handler: () => void) => unknown;
	off: (name: string, handler: () => void) => void;
};

export function registerReadingProgress(): void {
	if (customElements.get("article-reading-progress")) return;

	class ArticleReadingProgress extends HTMLElement {
		private body: HTMLElement | null = null;
		private post: HTMLElement | null = null;
		private frame: number | undefined;
		private needsRefresh = false;
		private controller: AbortController | undefined;
		private resizeObserver: ResizeObserver | undefined;
		private mutationObserver: MutationObserver | undefined;
		private swupHooks: SwupHooks | undefined;
		private readonly removeHooks: (() => void)[] = [];
		private percentage = -1;
		private label = "";

		private readonly handleRefresh = () => {
			this.needsRefresh = true;
			this.scheduleUpdate();
		};
		private readonly handleGeometry = () => {
			if (this.post) this.scheduleUpdate();
		};
		private readonly handleScroll = () => {
			if (this.body) this.scheduleUpdate();
		};
		private readonly handleSwup = () => {
			this.bindSwup();
			this.handleRefresh();
		};
		private readonly handleVisitStart = () => {
			this.clearPost();
			this.hidden = true;
		};
		private readonly handleClick = () => {
			if (!this.body?.isConnected) return;
			window.scrollTo({
				top: Math.max(
					0,
					window.scrollY +
						this.body.getBoundingClientRect().top -
						this.getTopInset(),
				),
				behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
					? "instant"
					: "smooth",
			});
		};

		connectedCallback(): void {
			if (this.controller) return;
			this.controller = new AbortController();
			const { signal } = this.controller;
			for (const event of refreshEvents) {
				document.addEventListener(event, this.handleRefresh, { signal });
			}
			document.addEventListener("swup:enable", this.handleSwup, { signal });
			window.addEventListener("scroll", this.handleScroll, {
				passive: true,
				signal,
			});
			window.addEventListener("resize", this.handleGeometry, {
				passive: true,
				signal,
			});
			window.visualViewport?.addEventListener("resize", this.handleGeometry, {
				signal,
			});
			window.visualViewport?.addEventListener("scroll", this.handleGeometry, {
				signal,
			});
			document.fonts?.addEventListener("loadingdone", this.handleGeometry, {
				signal,
			});
			document.fonts?.addEventListener("loadingerror", this.handleGeometry, {
				signal,
			});
			this.querySelector("button")?.addEventListener(
				"click",
				this.handleClick,
				{ signal },
			);
			this.resizeObserver = new ResizeObserver(this.handleGeometry);
			this.mutationObserver = new MutationObserver(this.handleRefresh);
			this.bindSwup();
			this.handleRefresh();
		}

		disconnectedCallback(): void {
			this.controller?.abort();
			this.controller = undefined;
			this.clearPost();
			for (const remove of this.removeHooks.splice(0)) remove();
			this.swupHooks = undefined;
		}

		private bindSwup(): void {
			const hooks = window.swup?.hooks as SwupHooks | undefined;
			if (!hooks || hooks === this.swupHooks) return;
			for (const remove of this.removeHooks.splice(0)) remove();
			this.swupHooks = hooks;
			for (const [event, handler] of [
				["visit:start", this.handleVisitStart],
				["content:replace", this.handleRefresh],
				["page:view", this.handleRefresh],
				["visit:end", this.handleRefresh],
			] as const) {
				hooks.on(event, handler);
				this.removeHooks.push(() => hooks.off(event, handler));
			}
		}

		private clearPost(): void {
			this.post?.removeEventListener("load", this.handleGeometry, true);
			this.resizeObserver?.disconnect();
			this.mutationObserver?.disconnect();
			this.body = null;
			this.post = null;
			if (this.frame !== undefined) window.cancelAnimationFrame(this.frame);
			this.frame = undefined;
		}

		private refreshPost(): void {
			this.clearPost();
			this.bindSwup();
			this.post = document.querySelector<HTMLElement>("#post-container");
			if (!this.post) return;
			this.resizeObserver?.observe(this.post);
			this.mutationObserver?.observe(this.post, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ["hidden", "aria-hidden", "class", "style"],
			});
			// Cover loads can move the body without resizing the body itself.
			this.post.addEventListener("load", this.handleGeometry, {
				capture: true,
				signal: this.controller?.signal,
			});
		}

		private scheduleUpdate(): void {
			if (!this.isConnected || this.frame !== undefined) return;
			this.frame = window.requestAnimationFrame(() => {
				this.frame = undefined;
				if (this.needsRefresh) {
					this.needsRefresh = false;
					this.refreshPost();
				}
				this.update();
			});
		}

		private getTopInset(): number {
			const viewportTop = window.visualViewport?.offsetTop ?? 0;
			const navbar = document.getElementById("navbar-wrapper");
			const topRow = document.getElementById("top-row");
			if (!navbar || !topRow || navbar.classList.contains("navbar-hidden")) {
				return viewportTop;
			}
			const rect = navbar.getBoundingClientRect();
			const fixed = getComputedStyle(topRow).position === "fixed";
			const sticky = getComputedStyle(navbar).position === "sticky";
			return (fixed || sticky) &&
				rect.top <= viewportTop + 1 &&
				rect.bottom > viewportTop
				? Math.max(viewportTop, rect.bottom)
				: viewportTop;
		}

		private update(): void {
			let visibleBody: HTMLElement | null = null;
			for (const wrapper of this.post?.querySelectorAll<HTMLElement>(
				"[data-reading-body]",
			) ?? []) {
				if (wrapper.closest('[hidden], [aria-hidden="true"]')) continue;
				const candidate =
					wrapper.querySelector<HTMLElement>(".markdown-content") ?? wrapper;
				if (
					!candidate.getClientRects().length ||
					candidate.getBoundingClientRect().height <= 0
				)
					continue;
				if (
					!candidate.textContent?.trim() &&
					!candidate.querySelector("img, video, audio, svg, canvas, iframe")
				)
					continue;
				visibleBody = candidate;
				break;
			}
			if (visibleBody !== this.body) {
				if (this.body) this.resizeObserver?.unobserve(this.body);
				this.body = visibleBody;
				if (this.body) this.resizeObserver?.observe(this.body);
			}
			this.hidden = !this.body;
			if (!this.body) return;

			const viewport = window.visualViewport;
			const viewportBottom = viewport
				? viewport.offsetTop + viewport.height
				: window.innerHeight;
			const ratio = getReadingProgress(
				this.body.getBoundingClientRect(),
				viewportBottom,
				this.getTopInset(),
			);
			const percentage = Math.round(ratio * 100);
			if (percentage !== this.percentage) {
				this.percentage = percentage;
				const value = this.querySelector<HTMLElement>(
					"[data-reading-percentage]",
				);
				if (value) value.textContent = `${percentage}%`;
			}
			this.querySelector("[data-reading-ring]")?.setAttribute(
				"stroke-dashoffset",
				String(100 - ratio * 100),
			);
			const label =
				document.documentElement.dataset.language === "en"
					? `Reading progress ${percentage}%. Return to article start`
					: `阅读进度 ${percentage}%，返回正文开头`;
			if (label !== this.label) {
				this.label = label;
				const button = this.querySelector("button");
				button?.setAttribute("aria-label", label);
				button?.setAttribute("title", label);
			}
		}
	}

	customElements.define("article-reading-progress", ArticleReadingProgress);
}
