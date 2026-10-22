import {
	advanceHoverSpring,
	getCardHoverTarget,
	type HoverSpring,
	isHoverSpringSettled,
} from "./card-hover-motion";

class MagneticPostCard extends HTMLElement {
	private x: HoverSpring = { position: 0, velocity: 0 };
	private y: HoverSpring = { position: 0, velocity: 0 };
	private target = { x: 0, y: 0 };
	private frame = 0;
	private previousTime = 0;
	private motionQuery: MediaQueryList | undefined;

	private readonly trackPointer = (event: PointerEvent) => {
		if (event.pointerType !== "mouse" || !this.motionQuery?.matches) return;
		const bounds = this.getBoundingClientRect();
		this.target = getCardHoverTarget(
			event.clientX,
			event.clientY,
			{
				left: bounds.left - this.x.position,
				top: bounds.top - this.y.position,
				width: bounds.width,
				height: bounds.height,
			},
			Number(this.dataset.hoverStrength ?? 1),
		);
		this.dataset.hoverActive = "";
		this.start();
	};

	private readonly release = () => {
		delete this.dataset.hoverActive;
		this.target = { x: 0, y: 0 };
		if (this.motionQuery?.matches) this.start();
		else this.reset();
	};

	private readonly reset = () => {
		cancelAnimationFrame(this.frame);
		this.frame = 0;
		this.x = { position: 0, velocity: 0 };
		this.y = { position: 0, velocity: 0 };
		this.target = { x: 0, y: 0 };
		this.style.removeProperty("--card-hover-x");
		this.style.removeProperty("--card-hover-y");
		delete this.dataset.hoverActive;
		delete this.dataset.hoverMoving;
	};

	connectedCallback() {
		this.motionQuery = window.matchMedia(
			"(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
		);
		this.addEventListener("pointerenter", this.trackPointer);
		this.addEventListener("pointermove", this.trackPointer);
		this.addEventListener("pointerleave", this.release);
		this.addEventListener("pointercancel", this.reset);
		this.motionQuery.addEventListener("change", this.reset);
		window.addEventListener("blur", this.reset);
	}

	disconnectedCallback() {
		this.removeEventListener("pointerenter", this.trackPointer);
		this.removeEventListener("pointermove", this.trackPointer);
		this.removeEventListener("pointerleave", this.release);
		this.removeEventListener("pointercancel", this.reset);
		this.motionQuery?.removeEventListener("change", this.reset);
		window.removeEventListener("blur", this.reset);
		this.reset();
	}

	private start() {
		if (this.frame) return;
		this.previousTime = performance.now();
		this.dataset.hoverMoving = "";
		this.frame = requestAnimationFrame(this.update);
	}

	private readonly update = (time: number) => {
		this.frame = 0;
		if (!this.isConnected || !this.motionQuery?.matches) {
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
			delete this.dataset.hoverMoving;
		}
		this.style.setProperty("--card-hover-x", `${this.x.position.toFixed(3)}px`);
		this.style.setProperty("--card-hover-y", `${this.y.position.toFixed(3)}px`);
		if (!settled) this.frame = requestAnimationFrame(this.update);
	};
}

if (!customElements.get("magnetic-post-card")) {
	customElements.define("magnetic-post-card", MagneticPostCard);
}

if (!customElements.get("magnetic-menu-item")) {
	customElements.define(
		"magnetic-menu-item",
		class extends MagneticPostCard {},
	);
}
