import { url } from "./url-utils";

type Coordinates = [number, number];
type MapOptions = Record<string, unknown>;

export interface LeafletLayer {
	addTo(target: LeafletMap | LeafletGroup): this;
	on(event: string, callback: () => void): this;
	bindPopup(content: HTMLElement): this;
	openPopup(): this;
}

export interface LeafletGroup extends LeafletLayer {
	clearLayers(): this;
	getLayers(): LeafletLayer[];
}

export interface LeafletMap {
	setView(center: Coordinates, zoom: number, options?: MapOptions): this;
	fitBounds(points: Coordinates[], options?: MapOptions): this;
	flyTo(center: Coordinates, zoom: number, options?: MapOptions): this;
	getZoom(): number;
	getMaxZoom(): number;
	latLngToContainerPoint(coordinates: Coordinates): { x: number; y: number };
	on(event: string, callback: () => void): this;
	invalidateSize(options?: MapOptions): this;
	zoomIn(): this;
	zoomOut(): this;
	closePopup(): this;
	remove(): this;
}

export interface LeafletTiles extends LeafletLayer {
	redraw(): this;
}

export interface LeafletRuntime {
	map(container: HTMLElement, options?: MapOptions): LeafletMap;
	tileLayer(template: string, options?: MapOptions): LeafletTiles;
	layerGroup(): LeafletGroup;
	divIcon(options: MapOptions): object;
	marker(coordinates: Coordinates, options?: MapOptions): LeafletLayer;
	circle(coordinates: Coordinates, options?: MapOptions): LeafletLayer;
	polygon(coordinates: Coordinates[], options?: MapOptions): LeafletLayer;
}

declare global {
	interface Window {
		L?: LeafletRuntime;
	}
}

let libraryPromise: Promise<LeafletRuntime> | undefined;

/** 本站托管固定版本，加载失败可重试；不会在普通页面加载地图脚本。 */
export function loadLeaflet(): Promise<LeafletRuntime> {
	if (window.L) return Promise.resolve(window.L);
	if (libraryPromise) return libraryPromise;
	libraryPromise = new Promise<LeafletRuntime>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = url("/vendor/leaflet/leaflet.js");
		script.async = true;
		const finish = (error?: Error) => {
			window.clearTimeout(timeout);
			script.onload = null;
			script.onerror = null;
			if (!error && window.L) resolve(window.L);
			else {
				script.remove();
				reject(error ?? new Error("Map library unavailable"));
			}
		};
		const timeout = window.setTimeout(
			() => finish(new Error("Map library timed out")),
			12000,
		);
		script.onload = () => finish();
		script.onerror = () => finish(new Error("Map library failed to load"));
		document.head.append(script);
	}).catch((error) => {
		libraryPromise = undefined;
		throw error;
	});
	return libraryPromise;
}
