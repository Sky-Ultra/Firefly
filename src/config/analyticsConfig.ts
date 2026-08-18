import type { AnalyticsConfig } from "../types/analyticsConfig";

export const analyticsConfig: AnalyticsConfig = {
	// Google Analytics ID
	googleAnalyticsId: "",
	// Microsoft Clarity ID
	microsoftClarityId: "",
	// Umami 统计配置
	umamiAnalytics: {
		// Umami Website ID。推荐在部署平台设置 PUBLIC_UMAMI_WEBSITE_ID。
		websiteId: import.meta.env?.PUBLIC_UMAMI_WEBSITE_ID?.trim() || "",
		// Umami JS地址，支持使用自建
		scriptUrl:
			import.meta.env?.PUBLIC_UMAMI_SCRIPT_URL?.trim() ||
			"https://cloud.umami.is/script.js",
		// Umami 会话回放脚本地址，支持使用自建
		replaysScriptUrl: "https://cloud.umami.is/recorder.js",
		// 是否追踪出站链接
		trackOutboundLinks: true,
		// 是否收集浏览器性能指标
		collectWebVitals: false,
		// 侧栏 Umami 访问统计卡片；仅填写公开分享链接，不要填写私密 API Token
		publicStats: {
			// Umami 公开分享链接。推荐在部署平台设置 PUBLIC_UMAMI_SHARE_URL。
			shareUrl: import.meta.env?.PUBLIC_UMAMI_SHARE_URL?.trim() || "",
			// 如果你使用自己的只读代理，可在这里填写直接返回三项统计的公开接口
			apiEndpoint: import.meta.env?.PUBLIC_UMAMI_STATS_ENDPOINT?.trim() || "",
			title: "统计",
			titleEn: "Analytics",
			timezone: "Australia/Sydney",
			cacheTtlMs: 10 * 60 * 1000,
			timeoutMs: 8000,
			fallback: {
				pageviews: null,
				visits: null,
				visitors: null,
			},
		},
		// 会话回放配置
		replays: {
			// 是否启用会话回放
			enabled: false,
			// 录制会话采样率，范围 0-1，例如 0.15 表示记录 15% 的会话
			sampleRate: 0.15,
			// 隐私遮罩级别："moderate" 会遮罩所有输入框；"strict" 额外遮罩页面全部文本
			maskLevel: "moderate",
			// 单次录制最大时长（毫秒）
			maxDuration: 300000,
			// 需要排除录制的元素 CSS 选择器，例如 ".sensitive-widget"
			blockSelector: "",
		},
	},
	// 51la 统计配置
	la51Analytics: {
		// 51la 统计 ID
		Id: "",
		// 自定义 SDK JS 地址，防止 DNS 污染，留空使用默认地址
		sdkUrl: "",
		// 多个统计 ID 的数据分离标识，留空则使用 Id
		ck: "",
		// 是否开启事件分析功能
		autoTrack: false,
		//  Hash路由模式, 项目使用History API路由, 所以不必开启默认false
		hashMode: false,
		// 是否开启网站录屏功能
		screenRecord: true,
	},
};
