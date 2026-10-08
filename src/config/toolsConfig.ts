export interface ToolText {
	zh: string;
	en: string;
}

export interface ToolItem {
	name: string;
	description: ToolText;
	category: ToolText;
	icon: string;
	image?: string;
	href: string;
	accent: string;
	tags: ToolText[];
	spotlight?: boolean;
}

export const personalTools: ToolItem[] = [
	{
		name: "Rhine Genshin",
		description: {
			zh: "提瓦特旅途档案：以三维档案阵列，选编原神任务、人物、典籍与旅途摘句。",
			en: "A 3D Teyvat archive: an unofficial selection of Genshin quests, characters, books and travel quotes.",
		},
		category: { zh: "本人项目", en: "My project" },
		icon: "material-symbols:inventory-2-rounded",
		image: "/RhineGenshin/icons/icon-192.png",
		href: "/RhineGenshin/",
		accent: "#dca939",
		tags: [
			{ zh: "Web", en: "Web" },
			{ zh: "3D 档案", en: "3D archive" },
			{ zh: "PWA", en: "PWA" },
		],
		spotlight: true,
	},
];

export const thirdPartyTools: ToolItem[] = [
	{
		name: "Tabby",
		description: {
			zh: "把本地 Shell、SSH 连接和终端配置收进同一个工作窗口。",
			en: "Keep local shells, SSH connections and terminal profiles in one workspace.",
		},
		category: { zh: "终端", en: "Terminal" },
		icon: "material-symbols:terminal-rounded",
		href: "https://tabby.sh/",
		accent: "#38bdf8",
		tags: [
			{ zh: "SSH", en: "SSH" },
			{ zh: "Shell", en: "Shell" },
		],
	},
	{
		name: "ShareX",
		description: {
			zh: "截图、录屏、文字识别与分享，让屏幕上的信息更容易整理。",
			en: "Capture, record, recognize text and share what is on your screen.",
		},
		category: { zh: "截图", en: "Capture" },
		icon: "material-symbols:photo-camera-rounded",
		href: "https://getsharex.com/",
		accent: "#22c55e",
		tags: [
			{ zh: "Windows", en: "Windows" },
			{ zh: "OCR", en: "OCR" },
		],
	},
	{
		name: "Raycast",
		description: {
			zh: "从键盘启动应用、搜索内容，通过扩展串联日常操作。",
			en: "Launch apps, find things and connect everyday tasks through keyboard shortcuts and extensions.",
		},
		category: { zh: "启动器", en: "Launcher" },
		icon: "material-symbols:keyboard-command-key",
		href: "https://www.raycast.com/",
		accent: "#ef4444",
		tags: [
			{ zh: "快捷操作", en: "Shortcuts" },
			{ zh: "扩展", en: "Extensions" },
		],
	},
	{
		name: "Obsidian",
		description: {
			zh: "用本地 Markdown 笔记、双向链接和图谱慢慢建立自己的知识库。",
			en: "Build a personal knowledge base with local Markdown notes, backlinks and a graph view.",
		},
		category: { zh: "知识管理", en: "Knowledge" },
		icon: "material-symbols:book-2-rounded",
		href: "https://obsidian.md/",
		accent: "#8b5cf6",
		tags: [
			{ zh: "Markdown", en: "Markdown" },
			{ zh: "本地笔记", en: "Local notes" },
		],
	},
	{
		name: "VS Code",
		description: {
			zh: "代码编辑、调试与终端融在一起，按需要扩展开发工作台。",
			en: "Edit code, debug and use a terminal in an extensible development workspace.",
		},
		category: { zh: "编辑器", en: "Editor" },
		icon: "material-symbols:code-blocks-rounded",
		href: "https://code.visualstudio.com/",
		accent: "#3b82f6",
		tags: [
			{ zh: "代码", en: "Code" },
			{ zh: "调试", en: "Debugging" },
		],
	},
	{
		name: "Neovim",
		description: {
			zh: "在终端里编辑代码，用配置和插件打磨顺手的键盘工作流。",
			en: "Edit in the terminal and shape a keyboard workflow with configuration and plugins.",
		},
		category: { zh: "编辑器", en: "Editor" },
		icon: "material-symbols:terminal-rounded",
		href: "https://neovim.io/",
		accent: "#10b981",
		tags: [
			{ zh: "终端", en: "Terminal" },
			{ zh: "Vim", en: "Vim" },
		],
	},
	{
		name: "Docker Desktop",
		description: {
			zh: "构建和运行容器，在本地组织应用及它依赖的服务。",
			en: "Build and run containers, and manage your app's supporting services locally.",
		},
		category: { zh: "容器开发", en: "Containers" },
		icon: "simple-icons:docker",
		href: "https://www.docker.com/products/docker-desktop/",
		accent: "#0ea5e9",
		tags: [
			{ zh: "Container", en: "Container" },
			{ zh: "CLI", en: "CLI" },
		],
	},
	{
		name: "Figma",
		description: {
			zh: "在协作画布里设计界面、连接交互原型并分享设计稿。",
			en: "Design interfaces, connect interactive prototypes and share work on a collaborative canvas.",
		},
		category: { zh: "设计", en: "Design" },
		icon: "simple-icons:figma",
		href: "https://www.figma.com/",
		accent: "#f97316",
		tags: [
			{ zh: "UI", en: "UI" },
			{ zh: "原型", en: "Prototypes" },
		],
	},
	{
		name: "1Password",
		description: {
			zh: "集中保管密码、通行密钥与重要资料，需要时随手取用。",
			en: "Keep passwords, passkeys and important information together, ready when you need them.",
		},
		category: { zh: "密码管理", en: "Passwords" },
		icon: "material-symbols:shield-lock-rounded",
		href: "https://1password.com/",
		accent: "#2563eb",
		tags: [
			{ zh: "密码库", en: "Vault" },
			{ zh: "通行密钥", en: "Passkeys" },
		],
	},
	{
		name: "Notion",
		description: {
			zh: "把笔记、数据库与项目页面放在一起，整理个人或团队资料。",
			en: "Organize personal or team information with notes, databases and project pages.",
		},
		category: { zh: "工作空间", en: "Workspace" },
		icon: "simple-icons:notion",
		href: "https://www.notion.com/",
		accent: "#64748b",
		tags: [
			{ zh: "笔记", en: "Notes" },
			{ zh: "数据库", en: "Databases" },
		],
	},
	{
		name: "Warp",
		description: {
			zh: "用命令块和 AI 辅助组织终端操作，连接开发过程中的任务。",
			en: "Organize terminal work with command blocks and AI assistance for development tasks.",
		},
		category: { zh: "开发终端", en: "Dev terminal" },
		icon: "material-symbols:auto-awesome-rounded",
		href: "https://www.warp.dev/",
		accent: "#a855f7",
		tags: [
			{ zh: "命令行", en: "CLI" },
			{ zh: "AI", en: "AI" },
		],
	},
	{
		name: "Arc Browser",
		description: {
			zh: "用侧边栏、空间和分屏组织网页，为不同任务留好浏览位置。",
			en: "Organize browsing with a sidebar, spaces and split views for different tasks.",
		},
		category: { zh: "浏览器", en: "Browser" },
		icon: "material-symbols:public",
		href: "https://arc.net/",
		accent: "#ec4899",
		tags: [
			{ zh: "标签空间", en: "Spaces" },
			{ zh: "分屏", en: "Split view" },
		],
	},
];
