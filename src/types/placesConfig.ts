export interface PlaceVisit {
	/** YYYY-MM-DD；每个日期区间算一次到访。 */
	start: string;
	end?: string;
}

export interface PlacePhoto {
	src: string;
	alt: string;
	altEn?: string;
}

export interface PlaceItem {
	id: string;
	name: string;
	nameEn?: string;
	country: string;
	countryEn?: string;
	region: string;
	regionEn?: string;
	city: string;
	cityEn?: string;
	/** WGS84 坐标，顺序为 [纬度, 经度]，不要直接填写高德 GCJ02 坐标。 */
	coordinates: [number, number];
	tags: { name: string; nameEn?: string }[];
	visits: PlaceVisit[];
	note?: string;
	noteEn?: string;
	photos?: PlacePhoto[];
	/** 可选的真实区域边界（同样使用 [纬度, 经度]）；未填写时显示地点光晕。 */
	boundary?: [number, number][];
}

export interface PlacesPageConfig {
	title: string;
	titleEn: string;
	description: string;
	descriptionEn: string;
	/** 真实地点为空时是否默认展示带提示的示例。正式录入后自动使用真实地点。 */
	previewWithExamples: boolean;
	places: PlaceItem[];
	examples: PlaceItem[];
	map: {
		center: [number, number];
		zoom: number;
		tileUrl: string;
		/** 地图服务要求的署名 HTML，必须保留。 */
		attribution: string;
	};
}
