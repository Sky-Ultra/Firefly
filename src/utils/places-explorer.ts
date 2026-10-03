import type { PlaceItem, PlacesPageConfig } from "@/types/placesConfig";
import {
	type LeafletGroup,
	type LeafletMap,
	type LeafletRuntime,
	type LeafletTiles,
	loadLeaflet,
} from "./leaflet-loader";
import {
	clusterPlaces,
	filterPlaces,
	formatPlaceDates,
	formatPlaceLocation,
	getPlacesYears,
	latestVisit,
	sortPlaces,
	sortVisits,
	summarizePlaces,
	visitInYear,
} from "./places-utils";

class PlacesExplorer extends HTMLElement {
	private config!: PlacesPageConfig;
	private demo = false;
	private year = "";
	private tag = "";
	private selectedId = "";
	private highlights = true;
	private clusters = true;
	private library?: LeafletRuntime;
	private map?: LeafletMap;
	private markers?: LeafletGroup;
	private regions?: LeafletGroup;
	private tiles?: LeafletTiles;
	private resizeObserver?: ResizeObserver;
	private loadTimer?: number;
	private mount = 0;
	private loading = false;

	private get english(): boolean {
		return document.documentElement.dataset.language === "en";
	}
	private get items(): PlaceItem[] {
		return this.demo ? this.config.examples : this.config.places;
	}
	private get visible(): PlaceItem[] {
		return filterPlaces(this.items, { year: this.year, tag: this.tag });
	}
	private text(zh: string, en: string): string {
		return this.english ? en : zh;
	}
	private field(place: PlaceItem, name: "name" | "city" | "region"): string {
		return (this.english ? place[`${name}En`] : undefined) ?? place[name];
	}
	private setText(selector: string, value: string): void {
		const node = this.querySelector<HTMLElement>(selector);
		if (node) node.textContent = value;
	}
	private setHidden(selector: string, hidden: boolean): void {
		const node = this.querySelector<HTMLElement>(selector);
		if (node) node.hidden = hidden;
	}

	connectedCallback(): void {
		this.mount++;
		this.config = JSON.parse(
			this.querySelector("[data-places-config]")?.textContent ?? "{}",
		);
		this.demo = this.dataset.demo === "true";
		this.addEventListener("click", this.handleClick);
		this.addEventListener("change", this.handleChange);
		document.addEventListener("firefly:language-change", this.handleLanguage);
		document.addEventListener("fullscreenchange", this.handleFullscreen);
		document.addEventListener("keydown", this.handleEscape);
		this.renderFilters();
		this.render();
		void this.initializeMap();
	}

	disconnectedCallback(): void {
		this.mount++;
		this.loading = false;
		this.removeEventListener("click", this.handleClick);
		this.removeEventListener("change", this.handleChange);
		document.removeEventListener(
			"firefly:language-change",
			this.handleLanguage,
		);
		document.removeEventListener("fullscreenchange", this.handleFullscreen);
		document.removeEventListener("keydown", this.handleEscape);
		this.resizeObserver?.disconnect();
		window.clearTimeout(this.loadTimer);
		this.map?.remove();
		this.map = undefined;
		this.tiles = undefined;
		this.closeExpandedMap();
	}

	private renderFilters(): void {
		const select = this.querySelector<HTMLSelectElement>("[data-year]");
		if (select) {
			select.replaceChildren(
				new Option(this.text("全部年份", "All years"), ""),
				...getPlacesYears(this.items).map((year) => new Option(year, year)),
			);
			select.value = this.year;
			select.setAttribute(
				"aria-label",
				this.text("按年份筛选", "Filter by year"),
			);
		}
		const tags = new Map(
			this.items.flatMap((place) => place.tags).map((tag) => [tag.name, tag]),
		);
		const buttons = [...tags.values()].map((tag) => {
			const button = document.createElement("button");
			button.type = "button";
			button.className = "places-filter-chip";
			button.dataset.tag = tag.name;
			button.textContent = this.english ? (tag.nameEn ?? tag.name) : tag.name;
			button.setAttribute("aria-pressed", String(this.tag === tag.name));
			return button;
		});
		this.querySelector("[data-tag-filters]")?.replaceChildren(...buttons);
	}

	private render(): void {
		const filtered = this.visible;
		const summary = summarizePlaces(this.items, {
			year: this.year,
			tag: this.tag,
		});
		for (const [key, value] of Object.entries(summary))
			this.setText(`[data-stat="${key}"]`, String(value));
		this.setHidden("[data-preview-notice]", !this.demo);
		this.setHidden("[data-filters]", this.items.length === 0);
		this.querySelector("[data-action='all']")?.setAttribute(
			"aria-pressed",
			String(!this.year && !this.tag),
		);
		this.querySelectorAll<HTMLButtonElement>("[data-tag]").forEach((button) => {
			button.setAttribute(
				"aria-pressed",
				String(button.dataset.tag === this.tag),
			);
		});
		this.querySelectorAll<HTMLElement>("[data-place-card]").forEach((card) => {
			const place = filtered.find((item) => item.id === card.dataset.placeCard);
			card.hidden =
				card.dataset.source !== (this.demo ? "demo" : "real") || !place;
			card.dataset.selected = String(
				card.dataset.placeCard === this.selectedId,
			);
			if (!place || card.hidden) return;
			const visits = place.visits.filter(
				(visit) => !this.year || visitInYear(visit, this.year),
			);
			const latest = sortVisits(visits)[0];
			const date = card.querySelector("[data-card-dates]");
			if (date)
				date.textContent = place.currentLocation
					? this.text("现居", "Currently based here")
					: formatPlaceDates(latest, this.english);
			card.querySelectorAll<HTMLElement>("[data-visit]").forEach((item) => {
				const visit = sortVisits(place.visits)[Number(item.dataset.visit)];
				item.hidden = !visit || (!!this.year && !visitInYear(visit, this.year));
				const time = item.querySelector("time");
				if (time) time.textContent = formatPlaceDates(visit, this.english);
			});
			const count = card.querySelector("[data-card-visits]");
			if (count)
				count.textContent = place.currentLocation
					? this.text("当前所在地 · 社区范围", "Current location · suburb only")
					: this.text(
							`到访 ${visits.length} 次`,
							`${visits.length} visit${visits.length === 1 ? "" : "s"}`,
						);
		});
		const recent = sortPlaces(
			this.items.filter((place) => place.visits.length > 0),
		)[0];
		this.setHidden("[data-recent]", !recent);
		if (recent) {
			this.setText(
				"[data-recent-city]",
				formatPlaceLocation(recent, this.english),
			);
			this.setText("[data-recent-name]", this.field(recent, "name"));
			this.setText(
				"[data-recent-date]",
				formatPlaceDates(latestVisit(recent), this.english),
			);
			this.setText(
				"[data-recent-tag]",
				this.english
					? (recent.tags[0]?.nameEn ?? recent.tags[0]?.name ?? "")
					: (recent.tags[0]?.name ?? ""),
			);
		}
		this.setText(
			"[data-results]",
			this.text(
				`${filtered.length} 个地点 · ${summary.visits} 次到访${this.demo ? " · 示例数据" : ""}`,
				`${filtered.length} places · ${summary.visits} visits${this.demo ? " · Examples" : ""}`,
			),
		);
		this.setHidden("[data-empty]", filtered.length > 0);
		this.setText(
			"[data-empty-title]",
			this.items.length
				? this.text("这一页风景，暂时留白", "No places match yet")
				: this.text("下一站，慢慢记录", "One journey at a time"),
		);
		this.setText(
			"[data-empty-description]",
			this.items.length
				? this.text(
						"没有符合筛选条件的地点，试试其他年份或分类。",
						"Try a different year or tag.",
					)
				: this.text(
						"真实足迹还未填写，等你把走过的地方分享给我。",
						"Real places haven't been added yet. Your journeys will appear here.",
					),
		);
		this.setHidden(
			"[data-empty] [data-action='mode']",
			this.items.length > 0 || !this.config.examples.length,
		);
		this.querySelectorAll<HTMLImageElement>("[data-alt-zh]").forEach(
			(image) => {
				image.alt =
					(this.english ? image.dataset.altEn : image.dataset.altZh) ?? "";
			},
		);
		const labels: Record<string, [string, string]> = {
			fullscreen: ["全屏地图", "Expand map"],
			reset: ["重置地图视角", "Reset map view"],
			"zoom-in": ["放大地图", "Zoom in"],
			"zoom-out": ["缩小地图", "Zoom out"],
		};
		for (const [action, label] of Object.entries(labels)) {
			const button = this.querySelector<HTMLButtonElement>(
				`[data-action="${action}"]`,
			);
			if (button) {
				button.title = this.text(...label);
				button.setAttribute("aria-label", button.title);
			}
		}
		this.querySelectorAll<HTMLButtonElement>("[data-photo-step]").forEach(
			(button) => {
				button.setAttribute(
					"aria-label",
					button.dataset.photoStep === "1"
						? this.text("下一张照片", "Next photo")
						: this.text("上一张照片", "Previous photo"),
				);
			},
		);
		this.renderMarkers();
	}

	private async initializeMap(): Promise<void> {
		if (this.loading || this.map) return;
		this.loading = true;
		const mount = this.mount;
		this.showStatus(this.text("正在展开地图…", "Opening the map…"));
		try {
			const library = await loadLeaflet();
			if (!this.isConnected || this.mount !== mount) return;
			const container = this.querySelector<HTMLElement>("[data-map]");
			if (!container) return;
			this.library = library;
			this.map = library.map(container, {
				zoomControl: false,
				scrollWheelZoom: false,
				minZoom: 2,
				maxZoom: 18,
				worldCopyJump: true,
			});
			this.map.setView(this.config.map.center, this.config.map.zoom);
			this.markers = library.layerGroup().addTo(this.map);
			this.regions = library.layerGroup().addTo(this.map);
			this.tiles = library.tileLayer(this.config.map.tileUrl, {
				attribution: this.config.map.attribution,
				maxZoom: 19,
				keepBuffer: 1,
			});
			this.tiles.on("tileload", () => {
				window.clearTimeout(this.loadTimer);
				this.setHidden("[data-map-status]", true);
			});
			this.tiles.on("tileerror", () =>
				this.showStatus(
					this.text(
						"地图底图暂未加载，足迹和列表仍可使用。",
						"Map tiles are unavailable; markers and records still work.",
					),
					true,
					true,
				),
			);
			this.tiles.addTo(this.map);
			this.loadTimer = window.setTimeout(
				() =>
					this.showStatus(
						this.text(
							"地图加载较慢，可以重试；地点列表不受影响。",
							"The map is taking longer. Retry, or explore the records below.",
						),
						true,
						true,
					),
				10000,
			);
			this.map.on("moveend", () => this.renderMarkers());
			this.resizeObserver = new ResizeObserver(() =>
				this.map?.invalidateSize({ pan: false }),
			);
			this.resizeObserver.observe(container);
			this.resetView(false);
			this.renderMarkers();
		} catch {
			if (this.isConnected && this.mount === mount)
				this.showStatus(
					this.text(
						"地图未能加载，请重试。地点记录仍可阅读。",
						"The map couldn't load. Retry, or read the records below.",
					),
					true,
				);
		} finally {
			if (this.mount === mount) this.loading = false;
		}
	}

	private showStatus(message: string, retry = false, warning = false): void {
		const status = this.querySelector<HTMLElement>("[data-map-status]");
		if (!status || !this.isConnected) return;
		status.hidden = false;
		status.dataset.state = warning ? "warning" : "loading";
		this.setText("[data-map-status-text]", message);
		this.setHidden("[data-map-status] button", !retry);
	}

	private resetView(animate = true): void {
		if (!this.map) return;
		this.selectedId = "";
		this.updateSelectedCard();
		this.map.closePopup();
		const points = this.visible.map((place) => place.coordinates);
		if (points.length)
			this.map.fitBounds(points, { padding: [55, 75], maxZoom: 10, animate });
		else
			this.map.setView(this.config.map.center, this.config.map.zoom, {
				animate,
			});
	}

	private popup(place: PlaceItem): HTMLElement {
		const popup = document.createElement("div");
		popup.className = "places-popup";
		const heading = document.createElement("h3");
		heading.textContent = this.field(place, "name");
		const location = document.createElement("p");
		location.textContent = formatPlaceLocation(place, this.english);
		const date = document.createElement("p");
		date.textContent = place.currentLocation
			? this.text("现居 · 仅标注社区范围", "Current location · suburb only")
			: formatPlaceDates(latestVisit(place), this.english);
		const button = document.createElement("button");
		button.type = "button";
		button.dataset.record = place.id;
		button.textContent = this.text("查看这段记录 →", "See this memory →");
		popup.append(heading, location, date, button);
		return popup;
	}

	private renderMarkers(): void {
		const library = this.library;
		const map = this.map;
		const markers = this.markers;
		const regions = this.regions;
		if (!library || !map || !markers || !regions) return;
		markers.clearLayers();
		regions.clearLayers();
		const color = getComputedStyle(this).getPropertyValue("--primary").trim();
		const projected = this.visible.map((place) => ({
			place,
			...map.latLngToContainerPoint(place.coordinates),
		}));
		const groups =
			this.clusters && map.getZoom() < 17
				? clusterPlaces(projected)
				: projected.map((point) => [point]);
		for (const group of groups) {
			if (
				group.length > 1 &&
				!group.some((point) => point.place.id === this.selectedId)
			) {
				const coordinates: [number, number] = [
					group.reduce((sum, point) => sum + point.place.coordinates[0], 0) /
						group.length,
					group.reduce((sum, point) => sum + point.place.coordinates[1], 0) /
						group.length,
				];
				library
					.marker(coordinates, {
						title: this.text(
							`${group.length} 个地点，点击展开`,
							`${group.length} places. Select to zoom in.`,
						),
						icon: library.divIcon({
							className: "places-cluster-icon",
							html: `<span class="places-cluster">${group.length}</span>`,
							iconSize: [42, 42],
							iconAnchor: [21, 21],
						}),
					})
					.on("click", () => {
						const same = group.every(
							(point) =>
								Math.hypot(
									point.place.coordinates[0] - coordinates[0],
									point.place.coordinates[1] - coordinates[1],
								) < 0.00001,
						);
						if (same) map.flyTo(coordinates, 17, { duration: 0.8 });
						else
							map.fitBounds(
								group.map((point) => point.place.coordinates),
								{ padding: [65, 75], maxZoom: 17 },
							);
					})
					.addTo(markers);
			} else {
				for (const { place } of group) {
					const marker = library
						.marker(place.coordinates, {
							title: this.field(place, "name"),
							riseOnHover: true,
							icon: library.divIcon({
								className: "places-pin-icon",
								html: '<svg class="places-pin" viewBox="0 0 32 40" aria-hidden="true"><path d="M16 1C8 1 2 7 2 15c0 10 14 23 14 23s14-13 14-23C30 7 24 1 16 1Z" fill="currentColor" stroke="white" stroke-width="2"/><circle cx="16" cy="15" r="5" fill="white"/></svg>',
								iconSize: [32, 40],
								iconAnchor: [16, 39],
								popupAnchor: [0, -35],
							}),
						})
						.bindPopup(this.popup(place))
						.addTo(markers);
					marker.on("click", () => {
						this.selectedId = place.id;
						this.updateSelectedCard();
					});
					if (place.id === this.selectedId) marker.openPopup();
				}
			}
		}
		if (this.highlights) {
			for (const place of this.visible) {
				const options = {
					color,
					fillColor: color,
					fillOpacity: 0.1,
					opacity: 0.45,
					weight: 1.5,
					interactive: false,
				};
				if (place.boundary)
					library.polygon(place.boundary, options).addTo(regions);
				else
					library
						.circle(place.coordinates, { ...options, radius: 18000 })
						.addTo(regions);
			}
		}
	}

	private updateSelectedCard(): void {
		this.querySelectorAll<HTMLElement>("[data-place-card]").forEach((card) => {
			card.dataset.selected = String(
				card.dataset.placeCard === this.selectedId,
			);
		});
	}

	private handleClick = (event: Event): void => {
		const button = (event.target as Element).closest<HTMLButtonElement>(
			"button",
		);
		if (!button || !this.contains(button)) return;
		if (button.dataset.tag) {
			this.tag = this.tag === button.dataset.tag ? "" : button.dataset.tag;
			this.selectedId = "";
			this.render();
			this.resetView();
			return;
		}
		if (button.dataset.locate) {
			const place = this.visible.find(
				(item) => item.id === button.dataset.locate,
			);
			if (!place || !this.map) return;
			this.selectedId = place.id;
			this.updateSelectedCard();
			this.querySelector("[data-map-shell]")?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			this.map.flyTo(place.coordinates, place.mapZoom ?? 12, { duration: 1 });
			this.renderMarkers();
			return;
		}
		if (button.dataset.record) {
			const card = [
				...this.querySelectorAll<HTMLElement>("[data-place-card]"),
			].find(
				(item) =>
					!item.hidden && item.dataset.placeCard === button.dataset.record,
			);
			card?.scrollIntoView({ behavior: "smooth", block: "center" });
			return;
		}
		if (button.dataset.photoStep) {
			const card = button.closest("[data-place-card]");
			const photos = [
				...(card?.querySelectorAll<HTMLImageElement>("[data-photo]") ?? []),
			];
			const index = photos.findIndex((photo) => !photo.hidden);
			const next =
				(index + Number(button.dataset.photoStep) + photos.length) %
				photos.length;
			photos.forEach((photo, i) => {
				photo.hidden = i !== next;
			});
			const count = card?.querySelector("[data-photo-count]");
			if (count) count.textContent = `${next + 1} / ${photos.length}`;
			return;
		}
		switch (button.dataset.action) {
			case "mode":
				this.demo = !this.demo;
				this.year = "";
				this.tag = "";
				this.selectedId = "";
				this.dataset.demo = String(this.demo);
				this.renderFilters();
				this.render();
				this.resetView();
				break;
			case "all":
				this.year = "";
				this.tag = "";
				this.renderFilters();
				this.render();
				this.resetView();
				break;
			case "zoom-in":
				this.map?.zoomIn();
				break;
			case "zoom-out":
				this.map?.zoomOut();
				break;
			case "reset":
				this.resetView();
				this.updateSelectedCard();
				break;
			case "highlight":
				this.highlights = !this.highlights;
				button.setAttribute("aria-checked", String(this.highlights));
				this.renderMarkers();
				break;
			case "cluster":
				this.clusters = !this.clusters;
				button.setAttribute("aria-checked", String(this.clusters));
				this.renderMarkers();
				break;
			case "fullscreen":
				void this.toggleFullscreen();
				break;
			case "retry":
				if (this.tiles) {
					this.showStatus(
						this.text("正在重新加载地图…", "Reloading the map…"),
						true,
						true,
					);
					this.tiles.redraw();
				} else void this.initializeMap();
				break;
		}
	};

	private handleChange = (event: Event): void => {
		if (
			!(event.target instanceof HTMLSelectElement) ||
			!event.target.matches("[data-year]")
		)
			return;
		this.year = event.target.value;
		this.selectedId = "";
		this.render();
		this.resetView();
	};
	private handleLanguage = (): void => {
		this.renderFilters();
		this.render();
	};
	private handleFullscreen = (): void => {
		const expanded =
			Boolean(document.fullscreenElement) ||
			this.querySelector("[data-map-shell]")?.classList.contains("is-expanded");
		this.querySelector("[data-action='fullscreen']")?.setAttribute(
			"aria-pressed",
			String(expanded),
		);
		this.map?.invalidateSize({ pan: false });
	};
	private handleEscape = (event: KeyboardEvent): void => {
		if (event.key !== "Escape") return;
		this.closeExpandedMap();
		this.handleFullscreen();
	};
	private closeExpandedMap(): void {
		const shell = this.querySelector<HTMLElement>("[data-map-shell]");
		if (!shell) return;
		if (shell.hasAttribute("popover")) {
			if (shell.matches(":popover-open")) shell.hidePopover();
			shell.removeAttribute("popover");
		}
		shell.classList.remove("is-expanded");
	}
	private async toggleFullscreen(): Promise<void> {
		const shell = this.querySelector<HTMLElement>("[data-map-shell]");
		if (!shell) return;
		if (document.fullscreenElement) await document.exitFullscreen();
		else if (shell.classList.contains("is-expanded")) this.closeExpandedMap();
		else {
			try {
				await shell.requestFullscreen();
			} catch {
				// 顶层 popover 不受外层 transform 的固定定位包含块影响。
				if (typeof shell.showPopover === "function") {
					shell.setAttribute("popover", "manual");
					shell.showPopover();
				}
				shell.classList.add("is-expanded");
			}
		}
		this.handleFullscreen();
	}
}

if (!customElements.get("places-explorer"))
	customElements.define("places-explorer", PlacesExplorer);
