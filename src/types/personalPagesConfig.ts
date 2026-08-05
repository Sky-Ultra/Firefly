export type DeviceItem = {
	name: string;
	category: string;
	categoryEn?: string;
	specs: string;
	specsEn?: string;
	description: string;
	descriptionEn?: string;
	icon?: string;
	image?: string;
	imageFit?: "cover" | "contain";
	imagePosition?: string;
	price?: string;
	priceEn?: string;
	url?: string;
};

export type SocialImage = {
	src: string;
	alt: string;
	altEn?: string;
};

export type MomentItem = {
	id: string;
	date: string;
	content: string;
	contentEn?: string;
	tags?: string[];
	tagsEn?: string[];
	location?: string;
	locationEn?: string;
	images?: SocialImage[];
};

export type DiaryItem = MomentItem & {
	mood?: string;
};

export type PersonalPagesConfig = {
	devices: {
		title: string;
		titleEn?: string;
		description: string;
		descriptionEn?: string;
		items: DeviceItem[];
	};
	moments: {
		title: string;
		titleEn?: string;
		description: string;
		descriptionEn?: string;
		items: MomentItem[];
	};
	diary: {
		title: string;
		titleEn?: string;
		description: string;
		descriptionEn?: string;
		items: DiaryItem[];
	};
};
