import {
	advanceLikeCombo,
	getHeartOrigin,
	HEART_BURST_COUNT,
	type LikeCombo,
	MAX_HEART_PARTICLES,
	MAX_LIKE_NOTICES,
} from "./site-like-effects";

type Notice = {
	element: HTMLElement;
	trigger: HTMLButtonElement;
	timer?: number;
	closing: boolean;
	animation?: Animation;
};

class SiteLikeToast extends HTMLElement {
	private notices = new Map<HTMLElement, Notice>();
	private layoutAnimations = new Map<HTMLElement, Animation>();
	private particles = new Map<HTMLElement, Animation>();
	private combo: LikeCombo = { count: 0, lastAt: Number.NEGATIVE_INFINITY };
	private motionQuery?: MediaQueryList;
	private announceFrame = 0;

	private readonly handleClick = (event: MouseEvent) => {
		if (!(event.target instanceof Element)) return;
		const trigger = event.target.closest<HTMLButtonElement>(
			"button[data-site-like]",
		);
		if (trigger) {
			this.addNotice(trigger);
			const combo = advanceLikeCombo(this.combo, performance.now());
			this.combo = combo;
			if (combo.burst && !this.motionQuery?.matches) this.burst(event, trigger);
			return;
		}
		if (event.target.closest("[data-like-toast-close]")) {
			const notice = this.findNotice(event.target);
			if (notice) this.close(notice);
		}
	};

	private readonly handleKey = (event: KeyboardEvent) => {
		if (event.key !== "Escape" || !this.notices.size) return;
		const focused = this.findNotice(document.activeElement);
		const latest = [...this.notices.values()]
			.reverse()
			.find((item) => !item.closing);
		if (focused || latest) this.close((focused || latest) as Notice);
	};

	private readonly handleFocusIn = (event: FocusEvent) => {
		const notice = this.findNotice(event.target);
		if (notice) window.clearTimeout(notice.timer);
	};
	private readonly handleFocusOut = (event: FocusEvent) => {
		const notice = this.findNotice(event.target);
		if (!notice || notice.closing) return;
		if (
			event.relatedTarget instanceof Node &&
			notice.element.contains(event.relatedTarget)
		)
			return;
		this.startTimer(notice);
	};
	private readonly resetCombo = () => {
		this.combo = { count: 0, lastAt: Number.NEGATIVE_INFINITY };
	};
	private readonly handleMotion = () => {
		if (!this.motionQuery?.matches) return;
		this.clearParticles();
		for (const animation of this.layoutAnimations.values()) animation.cancel();
		this.layoutAnimations.clear();
		for (const notice of [...this.notices.values()]) {
			notice.animation?.cancel();
			notice.animation = undefined;
			if (notice.closing) this.dispose(notice);
		}
		this.syncState();
	};

	connectedCallback() {
		this.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
		this.motionQuery.addEventListener("change", this.handleMotion);
		document.addEventListener("click", this.handleClick);
		document.addEventListener("keydown", this.handleKey);
		document.addEventListener("swup:visit:start", this.resetCombo);
		this.addEventListener("focusin", this.handleFocusIn);
		this.addEventListener("focusout", this.handleFocusOut);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.handleClick);
		document.removeEventListener("keydown", this.handleKey);
		document.removeEventListener("swup:visit:start", this.resetCombo);
		this.removeEventListener("focusin", this.handleFocusIn);
		this.removeEventListener("focusout", this.handleFocusOut);
		this.motionQuery?.removeEventListener("change", this.handleMotion);
		cancelAnimationFrame(this.announceFrame);
		for (const notice of [...this.notices.values()]) this.dispose(notice);
		this.clearParticles();
		this.resetCombo();
		this.syncState();
	}

	private findNotice(target: EventTarget | null) {
		if (!(target instanceof Element)) return undefined;
		const row = target.closest<HTMLElement>("[data-like-notice]");
		return row ? this.notices.get(row) : undefined;
	}

	private addNotice(trigger: HTMLButtonElement) {
		const template = this.querySelector<HTMLTemplateElement>(
			"[data-like-toast-template]",
		);
		const stack = this.querySelector("[data-like-toast-stack]");
		const fragment = template?.content.cloneNode(true) as
			| DocumentFragment
			| undefined;
		const element = fragment?.querySelector<HTMLElement>("[data-like-notice]");
		if (!element || !stack) return;
		const notice: Notice = { element, trigger, closing: false };
		this.withLayoutChange(() => {
			while (this.notices.size >= MAX_LIKE_NOTICES) {
				const oldest = this.notices.values().next().value;
				if (oldest) this.dispose(oldest);
			}
			stack.append(element);
			this.notices.set(element, notice);
			this.syncState();
		});
		notice.animation = element.animate(
			this.motionQuery?.matches
				? [{ opacity: 0 }, { opacity: 1 }]
				: [
						{ opacity: 0, transform: "translateY(12px)" },
						{ opacity: 1, transform: "translateY(0)" },
					],
			{
				duration: this.motionQuery?.matches ? 100 : 240,
				easing: "cubic-bezier(.2,.8,.2,1)",
			},
		);
		this.startTimer(notice);
		const announcement = this.querySelector("[data-like-announcement]");
		if (announcement) {
			announcement.textContent = "";
			cancelAnimationFrame(this.announceFrame);
			this.announceFrame = requestAnimationFrame(() => {
				announcement.textContent = document.documentElement.lang.startsWith(
					"en",
				)
					? "Thank you! I like you too ❤!"
					: "谢谢！我也喜欢你❤！";
			});
		}
	}

	private startTimer(notice: Notice) {
		window.clearTimeout(notice.timer);
		notice.timer = window.setTimeout(() => {
			if (!notice.element.contains(document.activeElement)) this.close(notice);
		}, 5000);
	}

	private close(notice: Notice) {
		if (notice.closing || !this.notices.has(notice.element)) return;
		notice.closing = true;
		window.clearTimeout(notice.timer);
		const restoreFocus = notice.element.contains(document.activeElement);
		if (restoreFocus && notice.trigger.isConnected)
			notice.trigger.focus({ preventScroll: true });
		notice.element.inert = true;
		notice.animation?.cancel();
		const animation = notice.element.animate(
			this.motionQuery?.matches
				? [{ opacity: 1 }, { opacity: 0 }]
				: [
						{ opacity: 1, transform: "translateX(0)" },
						{ opacity: 0, transform: "translateX(12px)" },
					],
			{
				duration: this.motionQuery?.matches ? 100 : 160,
				fill: "forwards",
				easing: "ease-out",
			},
		);
		notice.animation = animation;
		void animation.finished
			.then(() => {
				if (
					this.notices.has(notice.element) &&
					notice.animation === animation
				) {
					this.withLayoutChange(() => this.dispose(notice));
					this.syncState();
				}
			})
			.catch(() => {});
	}

	private dispose(notice: Notice) {
		window.clearTimeout(notice.timer);
		notice.animation?.cancel();
		this.layoutAnimations.get(notice.element)?.cancel();
		this.layoutAnimations.delete(notice.element);
		this.notices.delete(notice.element);
		if (
			notice.element.contains(document.activeElement) &&
			notice.trigger.isConnected
		) {
			notice.trigger.focus({ preventScroll: true });
		}
		notice.element.remove();
	}

	private withLayoutChange(change: () => void) {
		const before = new Map(
			[...this.notices.keys()].map((element) => [
				element,
				element.getBoundingClientRect().top,
			]),
		);
		for (const animation of this.layoutAnimations.values()) animation.cancel();
		this.layoutAnimations.clear();
		change();
		if (this.motionQuery?.matches) return;
		for (const [element, previousTop] of before) {
			if (!this.notices.has(element)) continue;
			const delta = previousTop - element.getBoundingClientRect().top;
			if (Math.abs(delta) < 1) continue;
			const animation = element.animate(
				[{ translate: `0 ${delta}px` }, { translate: "0 0" }],
				{
					duration: 240,
					easing: "cubic-bezier(.2,.8,.2,1)",
				},
			);
			this.layoutAnimations.set(element, animation);
			void animation.finished
				.then(() => {
					if (this.layoutAnimations.get(element) === animation)
						this.layoutAnimations.delete(element);
				})
				.catch(() => {});
		}
	}

	private syncState() {
		this.dataset.state = this.notices.size ? "visible" : "hidden";
		this.setAttribute("aria-hidden", String(!this.notices.size));
	}

	private burst(event: MouseEvent, trigger: HTMLButtonElement) {
		const layer = this.nextElementSibling;
		if (
			!(layer instanceof HTMLElement) ||
			!layer.hasAttribute("data-like-hearts")
		)
			return;
		const origin = getHeartOrigin(
			event.clientX,
			event.clientY,
			trigger.getBoundingClientRect(),
			innerWidth,
			innerHeight,
		);
		const emojis = ["❤", "💗", "💖", "💞"];
		for (let i = 0; i < HEART_BURST_COUNT; i++) {
			while (this.particles.size >= MAX_HEART_PARTICLES) {
				const oldest = this.particles.entries().next().value;
				if (oldest) {
					oldest[1].cancel();
					oldest[0].remove();
					this.particles.delete(oldest[0]);
				}
			}
			const heart = document.createElement("span");
			heart.textContent = emojis[i % emojis.length];
			heart.className = "site-like-heart";
			heart.style.left = `${origin.x}px`;
			heart.style.top = `${origin.y}px`;
			layer.append(heart);
			const spread = (i - (HEART_BURST_COUNT - 1) / 2) * 18;
			const rise = 64 + Math.random() * 48;
			const animation = heart.animate(
				[
					{ opacity: 0, transform: "translate(-50%, -50%) scale(.6)" },
					{ opacity: 1, offset: 0.18 },
					{
						opacity: 0,
						transform: `translate(calc(-50% + ${spread}px), calc(-50% - ${rise}px)) scale(1.15) rotate(${spread / 2}deg)`,
					},
				],
				{
					duration: 750 + Math.random() * 300,
					easing: "cubic-bezier(.2,.6,.4,1)",
				},
			);
			this.particles.set(heart, animation);
			void animation.finished
				.catch(() => {})
				.then(() => {
					heart.remove();
					this.particles.delete(heart);
				});
		}
	}

	private clearParticles() {
		for (const [heart, animation] of this.particles) {
			animation.cancel();
			heart.remove();
		}
		this.particles.clear();
	}
}

if (!customElements.get("site-like-toast"))
	customElements.define("site-like-toast", SiteLikeToast);
