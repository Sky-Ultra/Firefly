---
translationOf: welcome-toast-guide.md
sourceHash: sha256:26c9ad3a2ad5719092ddf916a27582de5acf4f0dcd3b565925077a425b7f2e46
---

This card stays on screen for only a few seconds. In that time, it has to recognise the homepage, look up an approximate location, deal with a timeout, and keep up when the site language changes.

I did not want a welcome message following readers around the site. It says hello at the door, then quietly steps out of the way.

## A short greeting with a longer checklist

I gave the card a few rules:

- Appear on the homepage without interrupting an article
- Show a country, region, and city when location lookup succeeds
- Fall back to a general greeting when the lookup is unavailable
- Dismiss itself after five seconds, while still offering a close button
- Switch between Chinese and English with the rest of the interface
- Stay within a phone screen and respect the visitor's reduced-motion setting

Location is used only to assemble the greeting shown for that visit. The component does not write the response to this site's `localStorage`, nor does it try to identify the visitor. IP-based location can be imprecise, so “a friend from somewhere” is an appropriate level of detail; a street-level address would not be.

## Keep the changeable parts in one place

The settings live in `src/config/visitorWidgetsConfig.ts`:

```ts
welcomeToast: {
	enabled: true,
	homepageOnly: true,
	locationApi: "https://ipwho.is/",
	fallbackMessage: "你好，欢迎来到我的博客",
	fallbackMessageEn: "Hello, welcome to my blog",
	subtitle: "欢迎来到我的博客",
	subtitleEn: "Welcome to my blog",
	visibleDuration: 5_000,
	fadeDuration: 500,
},
```

There is deliberately no layout code here. Greetings, endpoints, and timings are all likely to change, so keeping them together saves a search through both the template and its browser script.

`homepageOnly` controls the scope. Set it to `false` and the toast may appear wherever its first initialization occurs; `enabled` turns the feature off altogether. `visibleDuration` measures the time at full visibility, while `fadeDuration` belongs to the exit animation. Changing one does not quietly alter the other.

## The card should not wait for location

The main component is `src/components/features/WelcomeToast.astro`. Astro sends complete HTML before the browser tries to resolve a location:

```astro
<welcome-visitor-toast
	data-state="hidden"
	data-home-path={homePath}
	data-homepage-only={String(config.homepageOnly)}
	data-location-api={config.locationApi}
	data-fallback-message={config.fallbackMessage}
	data-fallback-message-en={config.fallbackMessageEn}
	data-visible-duration={config.visibleDuration}
	data-fade-duration={config.fadeDuration}
	role="status"
	aria-live="polite"
>
	<div class="welcome-toast-card">
		<span class="welcome-toast-icon" aria-hidden="true">👋</span>
		<div class="welcome-toast-content">
			<p data-welcome-message>{config.fallbackMessage}</p>
			<p class="welcome-toast-subtitle">{config.subtitle}</p>
		</div>
		<button type="button" data-welcome-close aria-label="关闭欢迎提示">
			<span aria-hidden="true">×</span>
		</button>
	</div>
</welcome-visitor-toast>
```

The fallback copy is already present while the request is pending, so the card never opens as an empty shell. Configuration reaches the custom element through `data-*` attributes; the template and client-side code therefore read the same values.

`src/layouts/Layout.astro` includes the component for every route. The component itself decides whether it should actually open on the current path.

## Say hello once, on the homepage

A deployed homepage is not always a literal `/`. The site may live below a base path, and some hosts expose `index.html`. The path is normalised before comparison:

```ts
function normalizePath(path: string) {
	const withoutIndex = path.replace(/index\.html$/i, "");
	return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
}
```

Once the element connects, it compares the browser path with Astro's base path:

```ts
const homepageOnly = this.dataset.homepageOnly !== "false";
const homePath = normalizePath(this.dataset.homePath || "/");

if (
	homepageOnly &&
	normalizePath(window.location.pathname) !== homePath
) {
	return;
}
```

Firefly can navigate between pages without replacing the entire document. A flag on `window` stops the toast from greeting the same reader after every internal link:

```ts
const welcomeRuntime = window as Window & {
	__fireflyWelcomeToastInitialized?: boolean;
};

if (welcomeRuntime.__fireflyWelcomeToastInitialized) return;
welcomeRuntime.__fireflyWelcomeToastInitialized = true;
```

The flag lasts only for the current page runtime. A deliberate refresh creates a new environment, so the greeting appears again as expected.

## Never wait forever for location

The browser calls the configured service directly. Only three fields are relevant:

```ts
type IpLocationResponse = {
	success?: boolean;
	country?: string;
	region?: string;
	city?: string;
};
```

Location services sometimes return the same value for both region and city. Empty and duplicate fields are removed before the text is joined:

```ts
const location = [data.country, data.region, data.city]
	.filter(
		(value, index, values): value is string =>
			Boolean(value) && values.indexOf(value) === index,
	)
	.join(" · ");
```

The request should not be allowed to hang. An `AbortController` gives it four seconds:

```ts
this.controller = new AbortController();
const timeout = window.setTimeout(() => this.controller?.abort(), 4_000);

try {
	const response = await fetch(this.dataset.locationApi || "https://ipwho.is/", {
		headers: { Accept: "application/json" },
		signal: this.controller.signal,
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	// Read and normalise the location
} catch {
	this.location = "";
	this.renderMessage();
} finally {
	window.clearTimeout(timeout);
}
```

A timeout, a failed response, or malformed location data all reach the same fallback. The reader simply sees “Hello, welcome to my blog” instead of an irrelevant network error.

## Change the sentence, not the data

A reader may use the language button while the toast is still visible. The element listens for the site's shared `firefly:language-change` event:

```ts
private readonly handleLanguageChange = () => this.renderMessage();

connectedCallback() {
	document.addEventListener(
		"firefly:language-change",
		this.handleLanguageChange,
	);
}
```

Rendering checks the language on the root element and reuses the location already in memory:

```ts
private renderMessage() {
	const message = this.querySelector<HTMLElement>("[data-welcome-message]");
	if (!message) return;

	const english = document.documentElement.dataset.language === "en";
	if (this.location) {
		message.textContent = english
			? `Hello, friend from ${this.location}`
			: `你好，来自${this.location}的朋友`;
		return;
	}

	message.textContent = english
		? this.dataset.fallbackMessageEn || "Hello, welcome to my blog"
		: this.dataset.fallbackMessage || "你好，欢迎来到我的博客";
}
```

No second location request is needed. The sentence is simply assembled again. Assigning through `textContent` also means that a value returned by the remote service cannot be interpreted as HTML.

## Enter, wait, leave

The motion does not need an animation library. A `data-state` attribute controls it:

- `hidden` places the card below the viewport and disables interaction
- `visible` moves it into view and restores opacity
- `closing` plays the exit before returning to `hidden`

The entrance begins inside `requestAnimationFrame`, giving the browser a chance to commit the initial style first:

```ts
private show() {
	window.requestAnimationFrame(() => {
		if (this.isConnected) this.dataset.state = "visible";
	});

	const visibleDuration = Number(this.dataset.visibleDuration) || 5_000;
	this.hideTimer = window.setTimeout(() => this.close(), visibleDuration);
}
```

The close button and automatic timer both end up in the same `close()` method. When the element leaves the page, it clears its timers and aborts any outstanding request, so internal navigation cannot leave stale work behind.

## Keep it out of the way on mobile

The desktop toast is fixed to the lower-right corner. Below 640px, setting both `left` and `right` makes its width follow the phone screen. `role="status"` and `aria-live="polite"` allow assistive technology to announce the updated greeting without cutting off whatever it is already reading.

When the operating system asks for reduced motion, the transition becomes effectively immediate:

```css
@media (prefers-reduced-motion: reduce) {
	welcome-visitor-toast {
		transition-duration: 1ms;
	}
}
```

A welcome card should not compete with the page it introduces. If the lookup works, it brings back a place name. If it fails, it simply falls back to an ordinary hello. The reader never needs to know that one request did not work.
