type AccessState = {
	step?: 1 | 2;
	steps?: number;
	passwordLength?: number;
	hint?: string;
	remaining: number;
	locked: boolean;
	resetAt: number;
	reason?: string;
	error?: string;
	html?: string;
};
export function mountPrivateArticleReader(root: HTMLElement): () => void {
	const article = root.dataset.article || "";
	const firstLength = Number(root.dataset.passwordLength || 0);
	const firstHint = (root.dataset.firstHint || "").split(/\r?\n/);
	const hintText = root.querySelector<HTMLElement>("[data-private-hint-text]");
	const hintDetails = root.querySelector<HTMLElement>(
		"[data-private-hint-details]",
	);
	const stepNode = root.querySelector<HTMLElement>("[data-private-step]");
	const uiNode = root.querySelector<HTMLElement>("[data-private-ui]");
	const formNode = root.querySelector<HTMLFormElement>("[data-private-form]");
	const inputNode = root.querySelector<HTMLInputElement>(
		"[data-private-password]",
	);
	const submitNode = root.querySelector<HTMLButtonElement>(
		"[data-private-submit]",
	);
	const statusNode = root.querySelector<HTMLElement>("[data-private-status]");
	const errorNode = root.querySelector<HTMLElement>("[data-private-error]");
	const contentNode = root.querySelector<HTMLElement>("[data-private-content]");
	const retryNode = root.querySelector<HTMLButtonElement>(
		"[data-private-retry]",
	);
	const example = root.querySelector<HTMLElement>("[data-private-example]");
	if (
		!uiNode ||
		!article ||
		!formNode ||
		!inputNode ||
		!submitNode ||
		!statusNode ||
		!errorNode ||
		!contentNode ||
		!retryNode
	)
		return () => {};
	const ui = uiNode;
	const form = formNode;
	const input = inputNode;
	const firstInputName = input.name;
	const originalType = input.type;
	const presentationAttributes = [
		"inputmode",
		"lang",
		"spellcheck",
		"autocapitalize",
		"autocorrect",
	] as const;
	const originalPresentation = new Map(
		presentationAttributes.map((name) => [name, input.getAttribute(name)]),
	);
	let nativeChineseApplied = false;
	let composing = false;
	let imeConfirming = false;
	const chineseSecondStep = () =>
		article === "long-night-love-letter" && state?.step === 2;
	const submit = submitNode;
	const status = statusNode;
	const error = errorNode;
	const content = contentNode;
	const retry = retryNode;
	const scope = new AbortController();
	const { signal } = scope;
	let busy = false;
	let unlocked = false;
	let state: AccessState | undefined;
	let ready = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	const english = () => document.documentElement.dataset.language === "en";
	const text = (zh: string, en: string) => (english() ? en : zh);
	// Remove only the legacy plaintext-password cache for this article.
	try {
		sessionStorage.removeItem(`pw:${article}`);
		sessionStorage.removeItem(`pw:${article}.md`);
	} catch {
		/* Optional storage. */
	}
	const expectedLength = () =>
		state?.step === 2 ? Number(state.passwordLength || 0) : firstLength;
	function restoreInputPresentation() {
		input.type = originalType;
		input.name = firstInputName;
		for (const [name, value] of originalPresentation) {
			if (value === null) input.removeAttribute(name);
			else input.setAttribute(name, value);
		}
	}
	function paint() {
		if (signal.aborted || unlocked) return;
		const second = state?.step === 2;
		const nativeChinese = chineseSecondStep();
		if (nativeChinese !== nativeChineseApplied) {
			input.type = nativeChinese ? "text" : originalType;
			if (nativeChinese) {
				input.setAttribute("inputmode", "text");
				input.setAttribute("lang", "zh-CN");
				input.setAttribute("spellcheck", "false");
				input.setAttribute("autocapitalize", "off");
				input.setAttribute("autocorrect", "off");
			} else {
				restoreInputPresentation();
				composing = false;
				imeConfirming = false;
			}
			nativeChineseApplied = nativeChinese;
		}
		if (stepNode) {
			stepNode.hidden = state?.steps !== 2;
			stepNode.textContent = second
				? text("第二重验证 · 2 / 2", "Second verification · 2 / 2")
				: text("第一重验证 · 1 / 2", "First verification · 1 / 2");
		}
		if (hintText && (firstHint[0] || second))
			hintText.textContent =
				text("密码提示：", "Password hint: ") +
				(second ? state?.hint || "" : firstHint[0]);
		if (hintDetails) {
			hintDetails.hidden = second;
			hintDetails.textContent = second ? "" : firstHint.slice(1).join("\n");
		}
		input.name = second ? `${firstInputName}-second` : firstInputName;
		const length = expectedLength();
		if (length > 0) {
			const zh = nativeChinese
				? `请输入中文密码：${length}个字`
				: `请输入密码：${length}位数`;
			const en = nativeChinese
				? `Enter ${length} Chinese characters`
				: `Enter password: ${length} characters`;
			input.placeholder = text(zh, en);
			input.setAttribute("aria-label", text(zh, en));
			input.dataset.i18nZh = zh;
			input.dataset.i18nEn = en;
		}
		input.disabled = busy || !ready || !!state?.locked;
		submit.disabled = input.disabled;
		submit.textContent = busy
			? text("验证中…", "Verifying…")
			: state?.locked
				? text("今日已锁定", "Locked today")
				: state?.steps === 2 && !second
					? text("下一步", "Continue")
					: text("解锁", "Unlock");
		if (!ready && busy)
			status.textContent = text(
				"正在连接验证服务…",
				"Connecting to verification service…",
			);
		else if (!ready)
			status.textContent = text(
				"验证服务暂时不可用，请重新连接。",
				"Verification is unavailable. Please reconnect.",
			);
		else if (state?.locked && state.steps === 2)
			status.textContent = text(
				"两重验证今日已累计输错 5 次，今日已锁定。每天北京时间 04:00 重置。",
				"Both verification steps are locked after 5 total incorrect attempts. Resets at 04:00 Beijing time.",
			);
		else if (state?.locked)
			status.textContent = text(
				"此密码今日已累计输错 5 次，使用相同密码的文章均已锁定。每天北京时间 04:00 重置。",
				"This password is locked after 5 incorrect attempts across articles sharing it. Resets at 04:00 Beijing time.",
			);
		else if (state?.steps === 2)
			status.textContent = text(
				`两重验证今日共还可输错 ${state.remaining} 次，共用次数。每天北京时间 04:00 重置。`,
				`${state.remaining} total incorrect attempts remaining across both steps. Resets at 04:00 Beijing time.`,
			);
		else
			status.textContent = text(
				`此密码今日还可输错 ${state?.remaining ?? 5} 次，相同密码的文章共用次数。每天北京时间 04:00 重置。`,
				`${state?.remaining ?? 5} incorrect attempts remaining, shared by articles with the same password. Resets at 04:00 Beijing time.`,
			);
		retry.hidden = ready;
	}
	async function api(action: string, password?: string) {
		const control = new AbortController();
		const timeout = setTimeout(() => control.abort(), 20000);
		const abort = () => control.abort();
		signal.addEventListener("abort", abort, { once: true });
		try {
			const response = await fetch(
				`/api/private/${encodeURIComponent(article)}/${action}`,
				{
					method: password === undefined ? "GET" : "POST",
					credentials: "same-origin",
					cache: "no-store",
					headers:
						password === undefined
							? {}
							: { "Content-Type": "application/json" },
					body:
						password === undefined
							? undefined
							: JSON.stringify({
									password,
									...(state?.steps === 2 ? { step: state.step ?? 1 } : {}),
								}),
					signal: control.signal,
				},
			);
			const data = (await response.json()) as AccessState;
			return { response, data };
		} finally {
			clearTimeout(timeout);
			signal.removeEventListener("abort", abort);
		}
	}
	function show(html: string) {
		if (signal.aborted || !root.isConnected) return;
		unlocked = true;
		clearTimeout(timer);
		content.innerHTML = html;
		const extras = root.querySelector<HTMLTemplateElement>(
			"[data-private-extras]",
		);
		if (extras) content.appendChild(extras.content.cloneNode(true));
		for (const body of content.querySelectorAll<HTMLElement>(
			"[data-reading-body]",
		)) {
			const headings = [...body.querySelectorAll<HTMLElement>("h2[id],h3[id]")];
			if (headings.length > 2) {
				const details = document.createElement("details");
				details.className = "private-toc";
				const summary = document.createElement("summary");
				summary.textContent =
					body.dataset.languageOnly === "en" ? "Contents" : "文章目录";
				details.append(summary);
				const list = document.createElement("ul");
				for (const heading of headings) {
					const item = document.createElement("li");
					const link = document.createElement("a");
					link.href = `#${encodeURIComponent(heading.id)}`;
					link.textContent = heading.textContent;
					item.append(link);
					list.append(item);
				}
				details.append(list);
				body.prepend(details);
			}
		}
		window.fireflyLanguage?.apply(content);
		for (const oldScript of content.querySelectorAll<HTMLScriptElement>(
			"script",
		)) {
			const script = document.createElement("script");
			for (const attribute of oldScript.attributes)
				script.setAttribute(attribute.name, attribute.value);
			script.textContent = oldScript.textContent;
			oldScript.replaceWith(script);
		}
		for (const image of content.querySelectorAll<HTMLImageElement>("img")) {
			const loaded = () => {
				image.style.opacity = "1";
				image.parentElement
					?.querySelector(".lqip-placeholder")
					?.classList.add("loaded");
			};
			if (image.complete && image.naturalWidth) loaded();
			else image.addEventListener("load", loaded, { once: true, signal });
		}
		content.hidden = false;
		ui.hidden = true;
		document.dispatchEvent(new CustomEvent("password:decrypted"));
	}
	async function connect() {
		if (signal.aborted || busy || unlocked) return;
		busy = true;
		paint();
		try {
			const { response, data } = await api("status");
			if (signal.aborted) return;
			if (!response.ok) throw Error("unavailable");
			state = data;
			ready = true;
			const cached = await api("content");
			if (cached.response.ok && cached.data.html) show(cached.data.html);
		} catch {
			ready = false;
		} finally {
			busy = false;
			paint();
		}
	}
	if (article === "long-night-love-letter") {
		input.addEventListener(
			"compositionstart",
			() => {
				if (chineseSecondStep()) composing = true;
			},
			{ signal },
		);
		input.addEventListener(
			"compositionend",
			() => {
				composing = false;
			},
			{ signal },
		);
		input.addEventListener(
			"keydown",
			(event) => {
				if (!chineseSecondStep()) return;
				imeConfirming =
					(event.isComposing || composing || event.key === "Process") &&
					(event.key === "Enter" ||
						event.code === "Enter" ||
						event.key === "Process");
			},
			{ signal },
		);
		input.addEventListener(
			"keyup",
			() => {
				imeConfirming = false;
			},
			{ signal },
		);
		submit.addEventListener(
			"pointerdown",
			() => {
				imeConfirming = false;
			},
			{ signal },
		);
	}
	form.addEventListener(
		"submit",
		async (event) => {
			event.preventDefault();
			if (chineseSecondStep() && (composing || imeConfirming)) return;
			if (busy || !ready || state?.locked || unlocked || !input.value) return;
			const password = input.value;
			// Content passphrases are not the visitor's saved site-account password.
			// Reject impossible lengths locally; the backend still counts all real guesses.
			if (
				Number.isInteger(expectedLength()) &&
				expectedLength() > 0 &&
				password.length !== expectedLength()
			) {
				delete error.dataset.kind;
				error.textContent = text(
					`请输入本篇文章的 ${expectedLength()} 位密码；若浏览器自动填入了账户密码，请手动替换。`,
					`Enter this article's ${expectedLength()}-character password. Replace any site-account password filled by your browser.`,
				);
				error.hidden = false;
				if (example) example.hidden = true;
				input.focus();
				input.select();
				return;
			}
			busy = true;
			delete error.dataset.kind;
			error.hidden = true;
			if (example) example.hidden = true;
			paint();
			try {
				const { response, data } = await api("unlock", password);
				if (signal.aborted) return;
				if (response.ok && data.html) {
					input.value = "";
					show(data.html);
					return;
				}
				if (
					(response.ok && data.step === 2) ||
					(response.status === 409 && data.step)
				) {
					state = data;
					ready = true;
					input.value = "";
					error.dataset.kind = "info";
					error.textContent =
						response.status === 409
							? text(
									"验证阶段已更新，请按当前提示继续。",
									"Verification step changed. Continue with the current hint.",
								)
							: text(
									"第一重验证通过，请继续输入第二个密码。",
									"First verification passed. Enter the second password.",
								);
					error.hidden = false;
					return;
				}
				if (response.status === 429 && data.error === "rate_limited") {
					error.textContent = text(
						"请求过于频繁，请稍后重试。",
						"Too many requests. Please try again shortly.",
					);
					error.hidden = false;
					return;
				}
				if (response.status === 401 || response.status === 429) {
					state = data;
					ready = true;
					error.textContent =
						data.reason === "busy"
							? text(
									"有验证请求正在处理，请稍后再试。",
									"Verification is in progress. Try again shortly.",
								)
							: article === "long-night-love-letter"
								? text(
										"欸，看来不是写给你的哦...！",
										"Oh, it seems this wasn't written for you...!",
									)
								: text("密码不正确。", "Incorrect password.");
					error.hidden = false;
					if (
						state?.step !== 2 &&
						response.status === 401 &&
						password === root.dataset.example &&
						example
					) {
						example.hidden = false;
						clearTimeout(timer);
						timer = setTimeout(() => {
							example.hidden = true;
						}, 6000);
					}
					input.value = "";
				} else throw Error("unavailable");
			} catch {
				if (!signal.aborted) {
					error.textContent = text(
						"验证暂时不可用，请稍后重试。",
						"Verification is temporarily unavailable.",
					);
					error.hidden = false;
				}
			} finally {
				busy = false;
				paint();
				if (!input.disabled && !unlocked) input.focus();
			}
		},
		{ signal },
	);
	retry.addEventListener(
		"click",
		() => {
			void connect();
		},
		{ signal },
	);
	document.addEventListener("firefly:language-change", paint, { signal });
	const interval = setInterval(() => {
		if (state?.locked && Date.now() >= state.resetAt && !busy) void connect();
	}, 30000);
	void connect();
	return () => {
		scope.abort();
		clearTimeout(timer);
		clearInterval(interval);
		input.value = "";
		if (nativeChineseApplied) restoreInputPresentation();
	};
}
