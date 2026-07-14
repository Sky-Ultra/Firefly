import type { RelationshipConfig } from "../types/relationshipConfig";
import { profileConfig } from "./profileConfig";

export const relationshipConfig: RelationshipConfig = {
	// 后续请替换为真实标题
	title: "恋爱计时",
	// 2026 年 2 月 6 日悉尼时间零点起算；明确时区可避免访客所在地不同导致日期偏移
	startAt: "2026-02-06T00:00:00+11:00",
	people: [
		{
			name: "Sky",
			// 与个人资料卡共用同一个头像配置，后续更换头像时会同步更新
			avatar: profileConfig.avatar,
			avatarAlt: "Sky 的头像",
		},
		{
			name: "爱弥斯",
			avatar: "assets/images/relationship/aimisi.png",
			avatarAlt: "爱弥斯的头像",
		},
	],
	heart: "❤️",
};
