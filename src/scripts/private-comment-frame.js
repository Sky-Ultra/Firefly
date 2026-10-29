// Runs only inside an opaque, network-disabled sandbox. No provider SDK is loaded here.
(() => {
	const form = document.getElementById("private-form");
	const nick = document.getElementById("nick");
	const mail = document.getElementById("mail");
	const link = document.getElementById("link");
	const comment = document.getElementById("comment");
	const counter = document.getElementById("counter");
	const send = document.getElementById("send");
	send.type = "button";
	const preview = document.getElementById("preview");
	const list = document.getElementById("comments");
	const emojis = document.getElementById("emojis");
	let role = "combined";
	let language = "zh-CN";
	let limit = 500;
	let initialized = false;
	const entries = [];
	let port;
	let resizeFrame = 0;
	let icons = [];
	let showExtras = false;
	const presentation = document.createElement("style");
	presentation.textContent = `body{font-size:var(--pc-font-size,16px);font-family:var(--pc-font-family,Arial,"Microsoft YaHei",sans-serif)}textarea{font-size:14px}#comment{min-height:148px;background-image:var(--comment-mascot-image,none);background-repeat:no-repeat;background-size:92px 92px;background-position:right 10px bottom 20px}#comment:focus,#comment:not(:placeholder-shown){background-image:none}@media(max-width:640px){#comment{background-size:74px 74px}}.private-comment{border:0;padding:16px 0}.private-comment .main{position:relative}.comment-heading{padding-right:110px;min-height:24px}.nick{font-size:1em;font-weight:700}.date{font-size:.8em;margin-left:4px}.content{font-size:1em;line-height:1.5;margin:8px 0}.comment-actions{position:absolute;right:0;top:0;gap:8px;align-items:center}.comment-actions button{display:inline-flex;align-items:center;gap:3px;font-size:12px;line-height:24px}.comment-actions svg{width:16px;height:16px}.extras{font-size:.875em;line-height:1.5;color:var(--pc-muted,#909399);margin:8px 0 0}`;
	document.head.append(presentation);
	const avatar =
		'<svg viewBox="0 0 24 24" aria-hidden="true" width="100%" height="100%"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 15a8 8 0 0 1-6.4-3.2C5.7 14.7 9.9 13.5 12 13.5s6.3 1.2 6.4 3.3A8 8 0 0 1 12 20"/></svg>';
	const t = (zh, en) => (language === "en" ? en : zh);
	const control = (data) => parent.postMessage(data, "*");
	function resize() {
		cancelAnimationFrame(resizeFrame);
		resizeFrame = requestAnimationFrame(() =>
			control({
				type: "private-comment:height",
				height: Math.ceil(document.body.getBoundingClientRect().height) + 2,
			}),
		);
	}
	function update() {
		counter.textContent = `${comment.value.length}/${limit}`;
		send.disabled = !comment.value.trim() || !form.checkValidity();
		if (!preview.hidden) preview.textContent = comment.value;
		resize();
	}
	function configure(config) {
		const mascot =
			typeof config.mascotImage === "string" &&
			/^url\("data:image\/(?:gif|webp|png);base64,[A-Za-z0-9+/=]+"\)$/.test(
				config.mascotImage,
			)
				? config.mascotImage
				: "none";
		document.documentElement.style.setProperty(
			"--comment-mascot-image",
			mascot,
		);
		icons = Array.isArray(config.icons) ? config.icons.slice(0, 3) : [];
		showExtras = config.showExtras === true;
		if (typeof config.fontSize === "string")
			document.documentElement.style.setProperty(
				"--pc-font-size",
				config.fontSize,
			);
		if (typeof config.fontFamily === "string")
			document.documentElement.style.setProperty(
				"--pc-font-family",
				config.fontFamily,
			);
		language = config.language === "en" ? "en" : "zh-CN";
		document.documentElement.lang = language;
		limit = Math.min(10000, Math.max(1, Number(config.maxLength) || 500));
		comment.maxLength = limit;
		comment.placeholder = String(config.placeholder || "");
		comment.setAttribute("aria-label", t("评论内容", "Comment"));
		mail.required = config.requireMail !== false;
		for (const [id, zh, en] of [
			["nick", "昵称", "Nickname"],
			["mail", "邮箱", "Email"],
			["link", "网址", "Website"],
		]) {
			document.querySelector(`[data-label="${id}"]`).textContent = t(zh, en);
			document.getElementById(id).setAttribute("aria-label", t(zh, en));
			document.getElementById(id).placeholder =
				id === "link" || (id === "mail" && !mail.required)
					? t("选填", "Optional")
					: t("必填", "Required");
		}
		document.getElementById("preview-button").textContent = t(
			"预览",
			"Preview",
		);
		send.textContent = t("发送", "Send");
		document
			.getElementById("emoji")
			.setAttribute("aria-label", t("表情", "Emoji"));
		for (const [name, value] of Object.entries(config.palette || {})) {
			if (
				["accent", "bg", "border", "text", "muted", "soft"].includes(name) &&
				typeof value === "string"
			)
				document.documentElement.style.setProperty(`--pc-${name}`, value);
		}
		update();
	}
	function text(tag, value, className) {
		const node = document.createElement(tag);
		node.className = className;
		node.textContent = value;
		return node;
	}
	function publish() {
		if (role === "editor" && port)
			port.postMessage({ type: "entries", entries });
		else if (role === "combined") render(entries);
	}
	function actionIcon(index) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const shape = icons[index];
		svg.setAttribute(
			"viewBox",
			shape && /^[\d.\s-]+$/.test(shape.viewBox) ? shape.viewBox : "0 0 24 24",
		);
		const paths = shape?.paths?.length
			? shape.paths
			: [
					index === 2
						? "M4 4h16v12H9l-5 4V4m2 2v10l3-2h9V6H6"
						: "M8 10h4l2-6 3 2-1 4h4v9H8v-9M3 10h3v9H3v-9",
				];
		for (const d of paths) {
			if (typeof d !== "string" || !/^[a-z0-9.,+\-\s]+$/i.test(d)) continue;
			const path = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"path",
			);
			path.setAttribute("d", d);
			path.setAttribute("fill", "currentColor");
			svg.append(path);
		}
		if (index === 1 && !shape) svg.style.transform = "rotate(180deg)";
		return svg;
	}
	function render(comments) {
		list.replaceChildren();
		for (const entry of [...comments].reverse()) {
			const article = document.createElement("article");
			article.className = "private-comment";
			const image = document.createElement("div");
			image.className = "avatar";
			image.innerHTML = avatar;
			const main = document.createElement("div");
			main.className = "main";
			const heading = document.createElement("div");
			heading.className = "comment-heading";
			const date = new Date(entry.time);
			heading.append(
				text("span", entry.nick, "nick"),
				text(
					"span",
					`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
					"date",
				),
			);
			main.append(heading, text("div", entry.comment, "content"));
			const actions = document.createElement("div");
			actions.className = "comment-actions";
			const like = text("button", entry.liked ? "1" : "", "");
			like.prepend(actionIcon(0));
			like.type = "button";
			like.setAttribute("aria-label", t("点赞", "Like"));
			like.addEventListener("click", () => {
				if (port && role === "feed")
					port.postMessage({ type: "like", id: entry.id });
				else {
					entry.liked = !entry.liked;
					render(entries);
				}
			});
			const dislike = text("button", entry.disliked ? "1" : "", "");
			dislike.type = "button";
			dislike.prepend(actionIcon(1));
			dislike.setAttribute("aria-label", t("点踩", "Dislike"));
			dislike.addEventListener("click", () => {
				if (port && role === "feed")
					port.postMessage({ type: "dislike", id: entry.id });
				else {
					entry.disliked = !entry.disliked;
					render(entries);
				}
			});
			const reply = text(
				"button",
				entry.replies?.length ? String(entry.replies.length) : "",
				"",
			);
			reply.prepend(actionIcon(2));
			reply.setAttribute("aria-label", t("回复", "Reply"));
			reply.type = "button";
			const replyForm = document.createElement("form");
			replyForm.className = "reply-form";
			replyForm.hidden = true;
			const replyText = document.createElement("textarea");
			replyText.placeholder = t("回复", "Reply");
			replyText.setAttribute("aria-label", t("回复内容", "Reply text"));
			replyText.maxLength = limit;
			replyText.autocomplete = "off";
			const replySend = text("button", t("发送", "Send"), "button primary");
			replySend.type = "button";
			replyForm.append(replyText, replySend);
			reply.addEventListener("click", () => {
				replyForm.hidden = !replyForm.hidden;
				if (!replyForm.hidden) replyText.focus();
				resize();
			});
			const submitReply = (event) => {
				event.preventDefault();
				const value = replyText.value.trim();
				if (!value) return;
				if (role === "feed" && port)
					port.postMessage({ type: "reply", id: entry.id, comment: value });
				else {
					entry.replies.push({
						nick: nick.value.trim() || entry.nick,
						comment: value,
					});
					render(entries);
				}
			};
			replyForm.addEventListener("submit", submitReply);
			replySend.addEventListener("click", submitReply);
			actions.append(like, dislike, reply);
			main.append(actions);
			if (showExtras) {
				const ua = navigator.userAgent;
				const system = /Windows/.test(ua)
					? "⊞ Windows"
					: /Android/.test(ua)
						? "Android"
						: /iPhone|iPad/.test(ua)
							? "iOS"
							: /Mac/.test(ua)
								? "macOS"
								: "Linux";
				const version =
					ua.match(/Edg\/([\d.]+)/) ||
					ua.match(/Chrome\/([\d.]+)/) ||
					ua.match(/Version\/([\d.]+)/);
				const browser = /Edg\//.test(ua)
					? "Microsoft Edge"
					: /Chrome\//.test(ua)
						? "Chrome"
						: /Safari\//.test(ua)
							? "Safari"
							: "Browser";
				main.append(
					text(
						"div",
						`${system}　◉ ${browser} ${version?.[1] || ""}`,
						"extras",
					),
				);
			}
			if (entry.replies?.length) {
				const replies = document.createElement("div");
				replies.className = "replies";
				for (const item of entry.replies) {
					replies.append(
						text("span", item.nick, "nick"),
						text("div", item.comment, "content"),
					);
				}
				main.append(replies);
			}
			main.append(replyForm);
			article.append(image, main);
			list.append(article);
		}
		resize();
	}
	window.addEventListener("message", (event) => {
		if (
			event.source !== parent ||
			!event.data ||
			typeof event.data !== "object"
		)
			return;
		const data = event.data;
		if (data.type === "private-comment:init") {
			role =
				data.role === "editor" || data.role === "feed" ? data.role : "combined";
			form.hidden = role === "feed";
			list.hidden = role === "editor";
			configure(data.config || {});
			if (!initialized && data.draft) {
				for (const [field, input] of [
					["nick", nick],
					["mail", mail],
					["link", link],
					["comment", comment],
				])
					input.value = String(data.draft[field] || "").slice(
						0,
						field === "comment" ? limit : 500,
					);
			}
			initialized = true;
			update();
		} else if (data.type === "private-comment:configure")
			configure(data.config || {});
		else if (data.type === "private-comment:port" && event.ports[0]) {
			port?.close();
			port = event.ports[0];
			port.onmessage = (event) => {
				const packet = event.data;
				if (!packet || typeof packet !== "object") return;
				if (
					role === "feed" &&
					packet.type === "entries" &&
					Array.isArray(packet.entries)
				)
					render(packet.entries);
				else if (role === "editor") {
					if (packet.type === "like") {
						const entry = entries.find((item) => item.id === packet.id);
						if (entry) entry.liked = !entry.liked;
					}
					if (packet.type === "dislike") {
						const entry = entries.find((item) => item.id === packet.id);
						if (entry) entry.disliked = !entry.disliked;
					}
					if (packet.type === "reply" && typeof packet.comment === "string") {
						const entry = entries.find((item) => item.id === packet.id);
						if (entry)
							entry.replies.push({
								nick: nick.value.trim() || t("访客", "Visitor"),
								comment: packet.comment.slice(0, limit),
							});
					}
					publish();
				}
			};
			port.start();
			if (role === "feed") port.postMessage({ type: "sync" });
			else publish();
		}
	});
	const submitComment = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (!comment.value.trim() || !form.checkValidity()) return;
		entries.push({
			id: Date.now() + entries.length,
			nick: nick.value.trim(),
			comment: comment.value.trim().slice(0, limit),
			time: Date.now(),
			liked: false,
			replies: [],
		});
		if (entries.length > 50) entries.shift();
		comment.value = "";
		preview.hidden = true;
		preview.textContent = "";
		publish();
		control({ type: "private-comment:sent", count: entries.length });
		update();
	};
	form.addEventListener("submit", submitComment);
	send.addEventListener("click", submitComment);
	form.addEventListener("input", update);
	comment.addEventListener("keydown", (event) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
			event.preventDefault();
			submitComment(event);
		}
	});
	document.getElementById("preview-button").addEventListener("click", () => {
		preview.hidden = !preview.hidden;
		update();
	});
	document.getElementById("emoji").addEventListener("click", () => {
		emojis.hidden = !emojis.hidden;
		resize();
	});
	for (const emoji of ["😊", "😂", "😭", "❤", "✨", "🥺", "😅", "👍"]) {
		const button = text("button", emoji, "");
		button.type = "button";
		button.addEventListener("click", () => {
			if (comment.value.length + emoji.length <= limit)
				comment.setRangeText(
					emoji,
					comment.selectionStart,
					comment.selectionEnd,
					"end",
				);
			emojis.hidden = true;
			comment.focus();
			update();
		});
		emojis.append(button);
	}
	for (const node of document.querySelectorAll("[data-avatar]"))
		node.innerHTML = avatar;
	if (typeof ResizeObserver !== "undefined")
		new ResizeObserver(resize).observe(document.body);
	control({ type: "private-comment:ready" });
	resize();
})();
