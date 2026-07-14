export type DeviceItem = {
	name: string;
	category: string;
	specs: string;
	description: string;
	icon?: string;
	image?: string;
	imageFit?: "cover" | "contain";
	imagePosition?: string;
	price?: string;
	url?: string;
};

export type SocialImage = {
	src: string;
	alt: string;
};

export type MomentItem = {
	id: string;
	date: string;
	content: string;
	tags?: string[];
	location?: string;
	images?: SocialImage[];
};

export type DiaryItem = MomentItem & {
	mood?: string;
};

export type PersonalPagesConfig = {
	devices: {
		title: string;
		description: string;
		items: DeviceItem[];
	};
	moments: {
		title: string;
		description: string;
		items: MomentItem[];
	};
	diary: {
		title: string;
		description: string;
		items: DiaryItem[];
	};
};
