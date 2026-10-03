export interface PlaceVisit {
	/** YYYY-MM-DD 或 YYYY-MM；保留回忆的时间精度，每条记录算一次到访。 */
	start: string;
	end?: string;
	/** 仅用于按月记录，不能与 end 同用。 */
	period?: "early" | "mid" | "late";
}

export interface PlacePhoto {
	src: string;
	alt: string;
	altEn?: string;
	/** 网络风景封面的开放许可与来源；不是本人旅行照片。 */
	credit?: {
		author: string;
		sourceUrl: string;
		license: string;
		licenseUrl: string;
	};
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
	/** 仅标注社区或地区范围的现居点，不虚构到访日期。 */
	currentLocation?: boolean;
	/** 地区或社区级定位不要放大到具体街道。 */
	mapZoom?: number;
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
