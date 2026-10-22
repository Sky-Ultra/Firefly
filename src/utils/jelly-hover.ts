import {
	advanceHoverSpring,
	type HoverSpring,
	isHoverSpringSettled,
} from "./card-hover-motion";
import { getJellyHoverTarget } from "./jelly-hover-motion";

export function registerJellyHover(): void {
	if (customElements.get("jelly-hover")) return;
	class JellyHover extends HTMLElement {
		private x: HoverSpring = { position: 0, velocity: 0 };
		private y: HoverSpring = { position: 0, velocity: 0 };
		private target = { x: 0, y: 0 };
		private frame = 0;
		private previousTime = 0;
		private controller?: AbortController;
		private motionQuery?: MediaQueryList;
		private surface: HTMLElement | null = null;

		private readonly track = (event: PointerEvent) => {
			if (event.pointerType !== "mouse" || !this.motionQuery?.matches) return;
			this.surface = this.querySelector<HTMLElement>(
				":scope > [data-jelly-surface]",
			);
			if (!this.surface || this.unavailable()) {
				this.reset();
				return;
			}
			// The hit area never moves: pointer coordinates cannot chase the animated image.
			this.target = getJellyHoverTarget(
				event.clientX,
				event.clientY,
				this.getBoundingClientRect(),
				this.dataset.jellyProfile || "card",
			);
			this.dataset.jellyActive = "";
			this.start();
		};
		private unavailable() {
			return (
				!this.surface?.isConnected ||
				this.surface.matches(':disabled, [aria-disabled="true"]')
			);
		}
		private readonly release = () => {
			if (
				!this.frame &&
				!this.hasAttribute("data-jelly-active") &&
				this.x.position === 0 &&
				this.y.position === 0
			)
				return;
			delete this.dataset.jellyActive;
			this.target = { x: 0, y: 0 };
			if (this.motionQuery?.matches && !this.unavailable()) this.start();
			else this.reset();
		};
		private readonly reset = () => {
			window.cancelAnimationFrame(this.frame);
			this.frame = 0;
			this.x = { position: 0, velocity: 0 };
			this.y = { position: 0, velocity: 0 };
			this.target = { x: 0, y: 0 };
			this.style.removeProperty("--jelly-x");
			this.style.removeProperty("--jelly-y");
			delete this.dataset.jellyActive;
			delete this.dataset.jellyMoving;
		};
		private readonly visibility = () => {
			if (document.hidden) this.reset();
		};
		private readonly verifyAfterClick = () => {
			// Validate after Svelte has flushed the click's disabled/DOM updates.
			if (this.hasAttribute("data-jelly-active")) this.start();
		};

		connectedCallback() {
			if (this.controller) return;
			this.controller = new AbortController();
			const { signal } = this.controller;
			this.motionQuery = window.matchMedia(
				"(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
			);
			this.addEventListener("pointerenter", this.track, { signal });
			this.addEventListener("pointermove", this.track, {
				signal,
				passive: true,
			});
			this.addEventListener("pointerleave", this.release, { signal });
			this.addEventListener("pointercancel", this.reset, { signal });
			this.addEventListener("click", this.verifyAfterClick, { signal });
			window.addEventListener("scroll", this.release, {
				signal,
				passive: true,
			});
			window.addEventListener("resize", this.reset, { signal, passive: true });
			window.addEventListener("blur", this.reset, { signal });
			document.addEventListener("visibilitychange", this.visibility, {
				signal,
			});
			this.motionQuery.addEventListener("change", this.reset, { signal });
		}
		disconnectedCallback() {
			this.controller?.abort();
			this.controller = undefined;
			this.reset();
			this.surface = null;
		}
		private start() {
			if (this.frame) return;
			this.previousTime = performance.now();
			this.dataset.jellyMoving = "";
			this.frame = window.requestAnimationFrame(this.update);
		}
		private readonly update = (time: number) => {
			this.frame = 0;
			if (
				!this.isConnected ||
				!this.motionQuery?.matches ||
				this.unavailable()
			) {
				this.reset();
				return;
			}
			const elapsed = (time - this.previousTime) / 1000;
			this.previousTime = time;
			this.x = advanceHoverSpring(this.x, this.target.x, elapsed);
			this.y = advanceHoverSpring(this.y, this.target.y, elapsed);
			const settled =
				isHoverSpringSettled(this.x, this.target.x) &&
				isHoverSpringSettled(this.y, this.target.y);
			if (settled) {
				this.x = { position: this.target.x, velocity: 0 };
				this.y = { position: this.target.y, velocity: 0 };
				delete this.dataset.jellyMoving;
				if (this.target.x === 0 && this.target.y === 0) {
					this.reset();
					return;
				}
			}
			this.style.setProperty("--jelly-x", `${this.x.position.toFixed(3)}px`);
			this.style.setProperty("--jelly-y", `${this.y.position.toFixed(3)}px`);
			if (!settled) this.frame = window.requestAnimationFrame(this.update);
		};
	}
	customElements.define("jelly-hover", JellyHover);
}
