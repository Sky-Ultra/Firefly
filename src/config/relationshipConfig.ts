import type { RelationshipConfig } from "../types/relationshipConfig";

export const relationshipConfig: RelationshipConfig = {
	// 后续请替换为真实标题
	title: "恋爱计时",
	// 后续请替换为真实开始时间；建议保留明确的时区偏移
	startAt: "2026-01-01T00:00:00+11:00",
	people: [
		{
			name: "名字 A",
			// 可填写 public 路径、src/assets 相对路径或远程 URL；留空时显示姓名首字
			avatar: "",
		},
		{
			name: "名字 B",
			avatar: "",
		},
	],
	heart: "❤️",
};
