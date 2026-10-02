# 足迹页面

页面：`/places/`；入口：导航栏 → 我的 → 足迹。

## 添加真实足迹

编辑 `src/config/placesConfig.ts` 的 `places` 数组。每个地点包含：

- 唯一 `id`、名称、国家、地区、城市（可附英文）。
- `coordinates: [纬度, 经度]`，使用 WGS84，不直接使用高德 GCJ02 坐标。
- `visits: [{ start: "2026-10-03", end: "2026-10-05" }]`；同一地点再次到访时追加日期，不必重复创建地点。
- `tags` 为旅行分类；`note` 是旅行记忆；可添加 `photos: [{ src: "/assets/images/places/xxx.jpg", alt: "照片说明" }]`。
- 照片保存于 `public/assets/images/places/`；无照片时显示占位插画。多张照片可逐张切换。
- 可选 `boundary` 为真实区域边界 `[纬度, 经度][]`；不填写时地图显示地点光晕，不冒充行政边界。

地区数按“国家/地区”去重；到访次数按日期区间计数；跨年到访参与各个覆盖年份的筛选。

当前真实地点为空，`examples` 仅为交互预览，页面会明确显示“示例预览”。一旦填写真实地点，页面自动使用真实数据；也可将 `previewWithExamples` 设为 `false`，默认展示空白真实足迹。示例插画由本项目绘制，未使用参考网站的旅行照片。

## 地图与隐私

地图使用本站托管的 Leaflet 1.9.4 与 OpenStreetMap 栅格底图，不需要账号或 API 密钥，不调用访客定位。
仅按当前地图视野请求底图，遵循浏览器缓存与地图署名要求，不提供离线下载或批量预取。
底图依赖访客与服务端的网络状况；加载失败会显示重试提示，地点列表不受影响。
未来更换服务时，在配置的 `map.tileUrl` 与 `map.attribution` 一起调整，保留新服务要求的署名。

Leaflet 官方发行文件来自 `https://unpkg.com/leaflet@1.9.4/dist/`，保留 `public/vendor/leaflet/LICENSE`。
官方 SHA-256：JS `20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=`；CSS `p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=`。

视觉结构参考 https://seasir.top/places/，本页独立实现，不复制参考站点的账号、地图密钥或个人记录。
