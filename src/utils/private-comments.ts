type BrowserView = Window & typeof globalThis;
type Draft = { nick: string; mail: string; link: string; comment: string };

/** Static document only: private text must never be embedded in srcdoc or DOM attributes. */
export function buildPrivateCommentDocument(script: string): string {
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'none'; base-uri 'none'; frame-src 'none'; object-src 'none'"><style>
*{box-sizing:border-box}html,body{margin:0;padding:0;background:transparent;color:var(--pc-text,#4b5563);font:14px/1.65 Arial,"Microsoft YaHei",sans-serif}body{padding:1px 0}button,input,textarea{font:inherit}button{cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}[hidden]{display:none!important}.row{display:flex;gap:16px}.avatar{width:40px;height:40px;flex:none;color:var(--pc-muted,#c0c4cc);margin-top:1px}.main{min-width:0;flex:1}.meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}.field{display:flex;min-width:120px;flex:1;border:1px solid var(--pc-border,#e5e7eb);border-radius:4px;overflow:hidden;background:var(--pc-bg,#fff)}.field span{padding:5px 10px;background:var(--pc-soft,#fdf0f5);color:var(--pc-muted,#909399);font-size:12px;white-space:nowrap}.field input{min-width:0;width:100%;border:0;padding:5px 10px;outline:0;background:transparent;color:inherit;font-size:12px}.field:focus-within,textarea:focus{border-color:var(--pc-accent,#e875a0)}textarea{display:block;width:100%;resize:vertical;min-height:90px;border:1px solid var(--pc-border,#e5e7eb);border-radius:4px;padding:8px 12px;outline:0;background:var(--pc-bg,#fff);color:inherit;line-height:1.5}input::placeholder,textarea::placeholder{color:var(--pc-muted,#909399)}.counter{text-align:right;font-size:12px;color:var(--pc-muted,#909399);margin:2px 5px}.actions{display:flex;align-items:center;gap:8px;margin:8px 0 18px}.actions .spacer{flex:1}.button{padding:7px 15px;border:1px solid var(--pc-border,#e5e7eb);border-radius:4px;background:var(--pc-soft,#fdf0f5);color:var(--pc-text,#4b5563);font-size:12px;line-height:1.2}.primary{background:var(--pc-accent,#e875a0);border-color:var(--pc-accent,#e875a0);color:white}.icon-button{border:0;background:transparent;color:inherit;padding:3px;font-size:19px;line-height:1}.preview{padding:12px;border:1px solid var(--pc-border,#e5e7eb);border-radius:4px;white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 16px}.emojis{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}.emojis button{border:0;background:transparent;font-size:20px;padding:3px}.private-comment{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--pc-border,#e5e7eb)}.nick{font-weight:600;color:var(--pc-text,#4b5563);font-size:14px}.date{font-size:12px;color:var(--pc-muted,#909399);margin-left:10px}.content{white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0;font-size:14px;line-height:1.8}.comment-actions{display:flex;justify-content:flex-end;gap:16px}.comment-actions button{padding:0;border:0;background:transparent;color:var(--pc-accent,#e875a0);font-size:12px}.replies{padding-left:16px;border-left:1px solid var(--pc-border,#e5e7eb);margin-top:10px}.reply-form{margin-top:10px}.reply-form textarea{min-height:64px}.reply-form button{margin-top:8px}.preview:empty{display:none}.button:focus-visible,.icon-button:focus-visible,.comment-actions button:focus-visible{outline:2px solid var(--pc-accent,#e875a0);outline-offset:3px}@media(max-width:480px){.row,.private-comment{gap:10px}.avatar{width:32px;height:32px}.field{min-width:110px}.field span{padding:5px 7px}.field input{padding:5px 7px}}
</style></head><body><form id="private-form" autocomplete="off"><div class="row"><div class="avatar" data-avatar></div><div class="main"><div class="meta"><label class="field"><span data-label="nick">昵称</span><input id="nick" aria-label="昵称" placeholder="必填" autocomplete="off" required maxlength="100"></label><label class="field"><span data-label="mail">邮箱</span><input id="mail" aria-label="邮箱" placeholder="必填" type="email" autocomplete="off" required maxlength="254"></label><label class="field"><span data-label="link">网址</span><input id="link" aria-label="网址" placeholder="选填" autocomplete="off" maxlength="500"></label></div><textarea id="comment" aria-label="评论内容" autocomplete="off" spellcheck="false" maxlength="500"></textarea><div class="counter" id="counter">0/500</div></div></div><div class="actions"><button type="button" class="icon-button" id="emoji" aria-label="表情">☺</button><span class="spacer"></span><button type="button" class="button" id="preview-button">预览</button><button type="submit" class="button primary" id="send" disabled>发送</button></div><div class="emojis" id="emojis" hidden></div><div id="preview" class="preview" hidden></div></form><section id="comments" aria-live="polite"></section><script>${script.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
}

export function registerPrivateComments(
	script: string,
	view: BrowserView = window,
): void {
	if (view.customElements.get("private-comment-branch")) return;
	class PrivateCommentBranch extends view.HTMLElement {
		private controller?: AbortController;
		private observer?: MutationObserver;
		private themeObserver?: MutationObserver;
		private toggle?: HTMLInputElement;
		private editor?: HTMLIFrameElement;
		private feed?: HTMLIFrameElement;
		private editorReady = false;
		private feedReady = false;
		private ports?: MessageChannel;
		private active = false;
		private clearing = false;
		private pending?: Draft;
		private publicDrafts = new Map<
			HTMLTextAreaElement,
			{ value: string; formId: string }
		>();
		private transferredField?: HTMLTextAreaElement;
		private loadingDraft?: string;
		private transferredDraft = false;
		private count = 0;
		private lastFocused?: HTMLElement;
		private originalStates = new Map<
			HTMLElement,
			{ hidden: HTMLElement["hidden"]; inert: boolean }
		>();
		private countState?: {
			element: HTMLElement;
			container: HTMLElement;
			role: string | null;
			label: string | null;
		};

		connectedCallback() {
			view.queueMicrotask(() => {
				if (this.isConnected) this.connect();
			});
		}

		private connect() {
			if (this.controller) return;
			this.toggle =
				this.querySelector<HTMLInputElement>("[data-private-toggle]") ??
				undefined;
			if (!this.toggle) return;
			this.controller = new view.AbortController();
			const { signal } = this.controller;
			this.toggle.checked = false;
			this.toggle.addEventListener("change", this.changeMode, { signal });
			this.closest("comment-mascot")?.addEventListener(
				"firefly:comment-mascot-ready",
				this.configureFrames,
				{ signal },
			);
			this.addEventListener(
				"focusin",
				(event) => {
					const target = event.target as Element;
					const form = target.closest<HTMLElement>(".tk-submit");
					if (form) this.lastFocused = form;
				},
				{ signal },
			);
			for (const type of [
				"click",
				"submit",
				"keydown",
				"keyup",
				"paste",
				"drop",
				"input",
				"beforeinput",
			]) {
				this.addEventListener(type, this.blockNormalSender, {
					capture: true,
					signal,
				});
			}
			view.addEventListener("message", this.onMessage, { signal });
			view.addEventListener("pagehide", this.reset, { signal });
			view.addEventListener("pageshow", this.reset, { signal });
			view.document.addEventListener("swup:visit:start", this.reset, {
				signal,
			});
			view.document.addEventListener(
				"firefly:language-change",
				this.configureFrames,
				{ signal },
			);
			this.observer = new view.MutationObserver(this.sync);
			const publicRoot = this.querySelector("[data-public-comments]");
			if (publicRoot)
				this.observer.observe(publicRoot, {
					childList: true,
					subtree: true,
					characterData: true,
				});
			this.themeObserver = new view.MutationObserver(this.configureFrames);
			this.themeObserver.observe(view.document.documentElement, {
				attributes: true,
				attributeFilter: ["class", "style"],
			});
			// If this module is blocked or fails to start, the SSR option stays disabled.
			this.toggle.disabled = false;
		}

		disconnectedCallback() {
			this.controller?.abort();
			this.controller = undefined;
			this.observer?.disconnect();
			this.themeObserver?.disconnect();
			this.reset();
		}

		private readonly blockNormalSender = (event: Event) => {
			if (
				!this.active ||
				this.clearing ||
				!(event.target instanceof view.Element)
			)
				return;
			if (!event.target.closest(".tk-submit")) return;
			event.preventDefault();
			event.stopImmediatePropagation();
		};

		private mainForm(): HTMLElement | undefined {
			return this.lastFocused?.isConnected
				? this.lastFocused
				: (this.querySelector<HTMLElement>(".tk-submit") ?? undefined);
		}

		private clearPublicDraft() {
			this.clearing = true;
			try {
				for (const textarea of this.querySelectorAll<HTMLTextAreaElement>(
					".tk-submit textarea",
				)) {
					if (!textarea.value && !textarea.defaultValue) continue;
					textarea.value = "";
					textarea.defaultValue = "";
					textarea.dispatchEvent(new view.Event("input", { bubbles: true }));
				}
				// Only this SDK's content draft is removed; identities and login tokens are untouched.
				try {
					view.localStorage.removeItem("twikoo-draft");
				} catch {
					/* Storage may be unavailable. */
				}
			} finally {
				this.clearing = false;
			}
		}

		private readonly changeMode = () => {
			if (
				!this.active &&
				this.querySelector(".tk-submit .tk-send.is-loading")
			) {
				if (this.toggle) this.toggle.checked = false;
				return;
			}
			if (this.toggle?.checked) {
				const form = this.mainForm();
				const fields = form?.querySelectorAll<HTMLInputElement>(
					".tk-meta-input input",
				);
				const selectedField =
					form?.querySelector<HTMLTextAreaElement>("textarea");
				if (!selectedField) {
					try {
						this.loadingDraft =
							view.localStorage.getItem("twikoo-draft") || undefined;
					} catch {
						this.loadingDraft = undefined;
					}
				}
				this.publicDrafts.clear();
				for (const field of this.querySelectorAll<HTMLTextAreaElement>(
					".tk-submit textarea",
				))
					this.publicDrafts.set(field, {
						value: field.value,
						formId: field.closest(".tk-comment")?.id || "",
					});
				if (!this.editor) {
					this.pending = {
						nick: fields?.[0]?.value ?? "",
						mail: fields?.[1]?.value ?? "",
						link: fields?.[2]?.value ?? "",
						comment: selectedField?.value ?? this.loadingDraft ?? "",
					};
					this.transferredDraft = true;
					this.transferredField = selectedField ?? undefined;
				} else this.transferredDraft = false;
				this.clearPublicDraft();
				this.active = true;
				this.dataset.privateActive = "";
				if (!this.editor) this.createFrames();
				if (this.editor) this.editor.hidden = false;
			} else {
				this.active = false;
				delete this.dataset.privateActive;
				if (this.editor) this.editor.hidden = true;
				for (const [field, saved] of this.publicDrafts) {
					const target = field.isConnected
						? field
						: saved.formId
							? view.document
									.getElementById(saved.formId)
									?.querySelector<HTMLTextAreaElement>(".tk-submit textarea")
							: this.querySelector<HTMLTextAreaElement>(".tk-submit textarea");
					if (target && saved.value) {
						target.value = saved.value;
						target.dispatchEvent(new view.Event("input", { bubbles: true }));
					}
				}
				this.publicDrafts.clear();
				if (this.loadingDraft) {
					const field = this.querySelector<HTMLTextAreaElement>(
						".tk-submit textarea",
					);
					if (field) {
						field.value = this.loadingDraft;
						field.dispatchEvent(new view.Event("input", { bubbles: true }));
					} else {
						try {
							view.localStorage.setItem("twikoo-draft", this.loadingDraft);
						} catch {
							/* Preserve memory-only behavior if storage is blocked. */
						}
					}
					this.loadingDraft = undefined;
				}
			}
			this.sync();
		};

		private frame(role: "editor" | "feed"): HTMLIFrameElement {
			const frame = view.document.createElement("iframe");
			frame.setAttribute("sandbox", "allow-scripts");
			frame.setAttribute("referrerpolicy", "no-referrer");
			frame.setAttribute("data-private-comment-frame", role);
			frame.setAttribute("data-clarity-mask", "true");
			frame.className = "private-comment-frame rr-block";
			frame.title = role === "editor" ? "评论输入框" : "评论";
			frame.style.cssText = `display:block;width:100%;border:0;height:${role === "editor" ? 220 : 0}px;color-scheme:light dark;`;
			frame.srcdoc = buildPrivateCommentDocument(script);
			return frame;
		}

		private createFrames() {
			this.editor = this.frame("editor");
			this.feed = this.frame("feed");
			this.feed.hidden = true;
			const mount = this.querySelector("[data-private-mount]");
			mount?.append(this.editor, this.feed);
		}

		private config() {
			const palette: Record<string, string> = {};
			const probe = view.document.createElement("span");
			probe.hidden = true;
			(this.querySelector(".twikoo") || this).append(probe);
			for (const [name, color] of Object.entries({
				accent: "var(--tk-accent,var(--primary))",
				bg: "var(--tk-bg,var(--card-bg))",
				border: "var(--tk-border,var(--line-divider))",
				text: "var(--tk-text,var(--deep-text))",
				muted: "var(--tk-muted,var(--content-meta))",
				soft: "var(--btn-regular-bg)",
			})) {
				probe.style.color = color;
				palette[name] = view.getComputedStyle(probe).color;
			}
			probe.remove();
			const textarea =
				this.mainForm()?.querySelector<HTMLTextAreaElement>("textarea");
			const textStyle = view.getComputedStyle(
				this.querySelector(".tk-comment .tk-content") ||
					this.querySelector(".twikoo") ||
					this,
			);
			const icons = Array.from(
				this.querySelectorAll(
					".tk-comment .tk-main > .tk-row .tk-action > .tk-action-link",
				),
			)
				.slice(0, 3)
				.map((button) => {
					const svg = button.querySelector("svg");
					return {
						viewBox: svg?.getAttribute("viewBox") || "0 0 24 24",
						paths: Array.from(svg?.querySelectorAll("path") || [])
							.map((path) => path.getAttribute("d") || "")
							.filter((path) => /^[a-z0-9.,+\-\s]+$/i.test(path)),
					};
				});
			return {
				mascotImage:
					this.closest<HTMLElement>("comment-mascot")?.style.getPropertyValue(
						"--comment-mascot-image",
					) || "",
				fontSize: textStyle.fontSize,
				fontFamily: textStyle.fontFamily,
				showExtras: !!this.querySelector(".tk-comment .tk-extras"),
				icons,
				language: view.document.documentElement.dataset.language || "zh-CN",
				palette,
				placeholder:
					textarea?.placeholder ||
					"氢氦锂铍硼的锌灵~\nFeel free to chime in here",
				maxLength:
					textarea && textarea.maxLength > 0 ? textarea.maxLength : 500,
				requireMail: true,
			};
		}

		private readonly configureFrames = () => {
			if (!this.editor && !this.feed) return;
			const config = this.config();
			this.editor?.contentWindow?.postMessage(
				{ type: "private-comment:configure", config },
				"*",
			);
			this.feed?.contentWindow?.postMessage(
				{ type: "private-comment:configure", config },
				"*",
			);
		};

		private readonly onMessage = (event: MessageEvent) => {
			if (event.origin !== "null") return;
			if (!event.source) return;
			const role =
				event.source === this.editor?.contentWindow
					? "editor"
					: event.source === this.feed?.contentWindow
						? "feed"
						: undefined;
			if (!role || !event.data || typeof event.data !== "object") return;
			const frame = role === "editor" ? this.editor : this.feed;
			if (event.data.type === "private-comment:ready") {
				frame?.contentWindow?.postMessage(
					{
						type: "private-comment:init",
						role,
						config: this.config(),
						...(role === "editor" && this.pending
							? { draft: this.pending }
							: {}),
					},
					"*",
				);
				if (role === "editor") {
					this.editorReady = true;
					this.pending = undefined;
				} else this.feedReady = true;
				if (this.editorReady && this.feedReady) {
					this.ports?.port1.close();
					this.ports?.port2.close();
					this.ports = new view.MessageChannel();
					this.editor?.contentWindow?.postMessage(
						{ type: "private-comment:port" },
						"*",
						[this.ports.port1],
					);
					this.feed?.contentWindow?.postMessage(
						{ type: "private-comment:port" },
						"*",
						[this.ports.port2],
					);
				}
			} else if (
				event.data.type === "private-comment:height" &&
				Number.isFinite(event.data.height)
			) {
				if (frame)
					frame.style.height = `${Math.max(role === "editor" ? 180 : 0, Math.min(20000, event.data.height))}px`;
			} else if (
				role === "editor" &&
				event.data.type === "private-comment:sent" &&
				Number.isInteger(event.data.count)
			) {
				this.count = Math.max(0, Math.min(50, event.data.count));
				if (this.transferredDraft) {
					if (this.transferredField)
						this.publicDrafts.delete(this.transferredField);
					this.transferredField = undefined;
					this.loadingDraft = undefined;
					this.transferredDraft = false;
				}
				if (this.feed) this.feed.hidden = this.count === 0;
				this.sync();
			}
		};

		private readonly sync = () => {
			for (const form of this.querySelectorAll<HTMLElement>(".tk-submit")) {
				if (this.active) {
					if (!this.originalStates.has(form))
						this.originalStates.set(form, {
							hidden: form.hidden,
							inert: form.inert,
						});
					form.hidden = true;
					form.inert = true;
				} else {
					const original = this.originalStates.get(form);
					if (original) {
						form.hidden = original.hidden;
						form.inert = original.inert;
						this.originalStates.delete(form);
					}
				}
			}
			const container = this.querySelector(".tk-comments-container");
			const title = container?.querySelector(".tk-comments-title");
			if (this.feed && title && this.feed.previousElementSibling !== title)
				title.after(this.feed);
			if (this.count > 0) {
				this.dataset.hasPrivateComments = "";
				const container = this.querySelector<HTMLElement>(".tk-comments-count");
				const count = container?.querySelector<HTMLElement>("span");
				if (container && count && /^\s*\d+\s*$/.test(count.textContent || "")) {
					if (this.countState?.element !== count) {
						this.clearCountPresentation();
						count.style.setProperty(
							"--private-count-font",
							view.getComputedStyle(count).fontSize,
						);
						this.countState = {
							element: count,
							container,
							role: count.getAttribute("role"),
							label: count.getAttribute("aria-label"),
						};
					}
					count.dataset.privateTotal = String(
						Number(count.textContent) + this.count,
					);
					count.setAttribute("role", "img");
					count.setAttribute("aria-label", count.dataset.privateTotal);
					container.setAttribute("data-private-count-visible", "");
				}
			}
		};

		private clearCountPresentation() {
			if (this.countState) {
				const { element, role, label } = this.countState;
				if (role === null) element.removeAttribute("role");
				else element.setAttribute("role", role);
				if (label === null) element.removeAttribute("aria-label");
				else element.setAttribute("aria-label", label);
			}
			this.countState?.element.removeAttribute("data-private-total");
			this.countState?.element.style.removeProperty("--private-count-font");
			this.countState?.container.removeAttribute("data-private-count-visible");
			this.countState = undefined;
		}

		private readonly reset = () => {
			this.active = false;
			delete this.dataset.privateActive;
			delete this.dataset.hasPrivateComments;
			if (this.toggle) this.toggle.checked = false;
			this.pending = undefined;
			this.publicDrafts.clear();
			this.transferredField = undefined;
			this.loadingDraft = undefined;
			this.count = 0;
			this.transferredDraft = false;
			this.editor?.remove();
			this.feed?.remove();
			this.editor = undefined;
			this.feed = undefined;
			this.editorReady = false;
			this.feedReady = false;
			this.ports?.port1.close();
			this.ports?.port2.close();
			this.ports = undefined;
			this.clearCountPresentation();
			this.sync();
		};
	}
	view.customElements.define("private-comment-branch", PrivateCommentBranch);
}
