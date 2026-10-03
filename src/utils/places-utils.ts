import type { PlaceItem, PlaceVisit } from "@/types/placesConfig";

export interface PlacesFilter {
	year?: string;
	tag?: string;
}

export interface PlacesSummary {
	places: number;
	visits: number;
	thisYear: number;
	regions: number;
}

export interface ProjectedPlace {
	place: PlaceItem;
	x: number;
	y: number;
}

function validDate(value: string): boolean {
	if (/^\d{4}-\d{2}$/.test(value)) return validDate(`${value}-01`);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = new Date(`${value}T00:00:00Z`);
	return (
		Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
	);
}

/** 月份与旬仅用于排序，内部比较值不作为实际到访日展示或保存。 */
function visitSortKey(visit: PlaceVisit): string {
	if (visit.start.length !== 7) return visit.start;
	const day =
		visit.period === "late" ? "21" : visit.period === "mid" ? "11" : "01";
	return `${visit.start}-${day}`;
}

export function sortVisits(visits: PlaceVisit[]): PlaceVisit[] {
	return [...visits].sort((a, b) =>
		visitSortKey(b).localeCompare(visitSortKey(a)),
	);
}

export function validatePlaces(places: PlaceItem[]): void {
	const ids = new Set<string>();
	for (const place of places) {
		if (!place.id || ids.has(place.id))
			throw new Error(`足迹 ID 为空或重复：${place.id}`);
		ids.add(place.id);
		const [lat, lng] = place.coordinates;
		if (
			!Number.isFinite(lat) ||
			!Number.isFinite(lng) ||
			Math.abs(lat) > 85 ||
			Math.abs(lng) > 180
		) {
			throw new Error(`足迹坐标无效：${place.id}（需要 WGS84 [纬度, 经度]）`);
		}
		if (!place.visits.length && !place.currentLocation)
			throw new Error(`足迹缺少到访日期：${place.id}`);
		if (
			place.mapZoom !== undefined &&
			(!Number.isFinite(place.mapZoom) ||
				place.mapZoom < 2 ||
				place.mapZoom > 18)
		)
			throw new Error(`足迹地图缩放无效：${place.id}`);
		for (const visit of place.visits) {
			if (
				!validDate(visit.start) ||
				(visit.end &&
					(!validDate(visit.end) ||
						(visit.end.length === 7 ? `${visit.end}-31` : visit.end) <
							visitSortKey({ start: visit.start }))) ||
				(visit.period !== undefined &&
					(visit.start.length !== 7 ||
						visit.end !== undefined ||
						!["early", "mid", "late"].includes(visit.period)))
			) {
				throw new Error(`足迹日期无效：${place.id}`);
			}
		}
		if (
			place.boundary &&
			(place.boundary.length < 3 ||
				place.boundary.some(
					([a, b]) =>
						!Number.isFinite(a) ||
						!Number.isFinite(b) ||
						Math.abs(a) > 85 ||
						Math.abs(b) > 180,
				))
		) {
			throw new Error(`足迹区域边界无效：${place.id}`);
		}
	}
}

export function visitInYear(visit: PlaceVisit, year: string): boolean {
	return (
		visit.start.slice(0, 4) <= year &&
		(visit.end ?? visit.start).slice(0, 4) >= year
	);
}

export function getPlacesYears(places: PlaceItem[]): string[] {
	const years = new Set<string>();
	for (const place of places) {
		for (const visit of place.visits) {
			const first = Number(visit.start.slice(0, 4));
			const last = Number((visit.end ?? visit.start).slice(0, 4));
			for (let year = first; year <= last; year++) years.add(String(year));
		}
	}
	return [...years].sort((a, b) => Number(b) - Number(a));
}

export function filterPlaces(
	places: PlaceItem[],
	filter: PlacesFilter,
): PlaceItem[] {
	return places.filter(
		(place) =>
			(!filter.year ||
				place.visits.some((visit) =>
					visitInYear(visit, filter.year as string),
				)) &&
			(!filter.tag || place.tags.some((tag) => tag.name === filter.tag)),
	);
}

export function summarizePlaces(
	places: PlaceItem[],
	filter: PlacesFilter = {},
	currentYear: number = new Date().getFullYear(),
): PlacesSummary {
	const visible = filterPlaces(places, filter);
	const visits = visible
		.flatMap((place) => place.visits)
		.filter((visit) => !filter.year || visitInYear(visit, filter.year));
	return {
		places: visible.length,
		visits: visits.length,
		thisYear: visits.filter((visit) => visitInYear(visit, String(currentYear)))
			.length,
		regions: new Set(visible.map((place) => `${place.country}/${place.region}`))
			.size,
	};
}

export function latestVisit(place: PlaceItem): PlaceVisit | undefined {
	return sortVisits(place.visits)[0];
}

export function sortPlaces(places: PlaceItem[]): PlaceItem[] {
	return [...places].sort((a, b) => {
		const visitA = latestVisit(a);
		const visitB = latestVisit(b);
		return (visitB ? visitSortKey(visitB) : "").localeCompare(
			visitA ? visitSortKey(visitA) : "",
		);
	});
}

export function formatPlaceDates(
	visit: PlaceVisit | undefined,
	english = false,
): string {
	if (!visit) return "";
	const start = visit.start.replaceAll("-", ".");
	if (visit.period) {
		const labels = english
			? { early: "early month", mid: "mid-month", late: "late month" }
			: { early: "上旬", mid: "中旬", late: "下旬" };
		return `${start} · ${labels[visit.period]}`;
	}
	return visit.end && visit.end !== visit.start
		? `${start} — ${visit.end.replaceAll("-", ".")}`
		: start;
}

export function formatPlaceLocation(place: PlaceItem, english = false): string {
	const country = english ? (place.countryEn ?? place.country) : place.country;
	const region = english ? (place.regionEn ?? place.region) : place.region;
	const city = english ? (place.cityEn ?? place.city) : place.city;
	return `${region === city ? country : region} · ${city}`;
}

/** 按屏幕距离聚合；缩放后重新计算，不把不同缩放级别的相邻地点永久合并。 */
export function clusterPlaces(
	points: ProjectedPlace[],
	radius = 48,
): ProjectedPlace[][] {
	const groups: ProjectedPlace[][] = [];
	for (const point of points) {
		const group = groups.find((members) => {
			const x = members.reduce((sum, item) => sum + item.x, 0) / members.length;
			const y = members.reduce((sum, item) => sum + item.y, 0) / members.length;
			return Math.hypot(point.x - x, point.y - y) <= radius;
		});
		if (group) group.push(point);
		else groups.push([point]);
	}
	return groups;
}
