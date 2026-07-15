import type {
	BangumiFeaturedSubject,
	SlimSubject,
	SubjectImages,
	SubjectType,
	UserSubjectCollection,
} from "@/types/bangumi";

type SubjectApiResponse = {
	id: number;
	type: SubjectType;
	name: string;
	name_cn?: string;
	summary?: string;
	date?: string | null;
	images?: Partial<SubjectImages> | null;
	volumes?: number;
	eps?: number;
	collection?: { collect?: number };
	rating?: { score?: number; rank?: number };
	tags?: Array<{ name: string; count?: number }>;
};

function normalizeSubject(subject: SubjectApiResponse): SlimSubject {
	const images = subject.images || {};

	return {
		id: subject.id,
		type: subject.type,
		name: subject.name,
		name_cn: subject.name_cn || "",
		short_summary: subject.summary || "",
		date: subject.date || null,
		images: {
			large: images.large || "",
			common: images.common || "",
			medium: images.medium || images.common || images.large || "",
			small: images.small || images.medium || "",
			grid: images.grid || images.small || images.medium || "",
		},
		volumes: subject.volumes || 0,
		eps: subject.eps || 0,
		collection_total: subject.collection?.collect || 0,
		score: subject.rating?.score || 0,
		rank: subject.rating?.rank || 0,
		tags: (subject.tags || []).map((tag) => ({
			name: tag.name,
			count: tag.count || 0,
			total_cont: 0,
		})),
	};
}

async function createCollection(
	apiUrl: string,
	featured: BangumiFeaturedSubject,
): Promise<UserSubjectCollection | null> {
	try {
		const response = await fetch(
			`${apiUrl}/v0/subjects/${featured.subjectId}`,
			{ headers: { Accept: "application/json" } },
		);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const subject = normalizeSubject(
			(await response.json()) as SubjectApiResponse,
		);
		return {
			subject_id: subject.id,
			subject_type: subject.type,
			rate: 0,
			type: featured.collectionType,
			comment: null,
			tags: [],
			ep_status: 0,
			vol_status: 0,
			updated_at: "1970-01-01T00:00:00.000Z",
			private: false,
			subject,
		};
	} catch (error) {
		console.warn(`[Bangumi] 无法补充条目 ${featured.subjectId}:`, error);
		return null;
	}
}

export async function applyFeaturedSubjects(
	items: UserSubjectCollection[],
	featuredSubjects: BangumiFeaturedSubject[],
	apiUrl: string,
): Promise<UserSubjectCollection[]> {
	if (featuredSubjects.length === 0) return items;

	const itemMap = new Map(items.map((item) => [item.subject_id, item]));
	const featuredItems = await Promise.all(
		featuredSubjects.map(async (featured) => {
			const existing = itemMap.get(featured.subjectId);
			if (existing) {
				return { ...existing, type: featured.collectionType };
			}
			return createCollection(apiUrl, featured);
		}),
	);
	const featuredIds = new Set(
		featuredSubjects.map((featured) => featured.subjectId),
	);

	return [
		...featuredItems.filter(
			(item): item is UserSubjectCollection => item !== null,
		),
		...items.filter((item) => !featuredIds.has(item.subject_id)),
	];
}
