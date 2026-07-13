export type RelationshipPersonConfig = {
	name: string;
	avatar?: string;
	avatarAlt?: string;
};

export type RelationshipConfig = {
	/** 组件标题 */
	title?: string;
	/**
	 * 开始时间。推荐使用带时区的完整 ISO 8601 时间，
	 * 例如：2026-01-01T00:00:00+11:00。
	 */
	startAt: string;
	/** 双方资料 */
	people: readonly [RelationshipPersonConfig, RelationshipPersonConfig];
	/** 两人之间显示的符号 */
	heart?: string;
};
