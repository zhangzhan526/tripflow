# TripFlow PWA Beta 清单（2026-04-18）

## 1) 可安装（Installable）
- [x] `manifest.webmanifest` 完整化：`id/scope/description/orientation/icons`
- [x] 提供 `192/512 + maskable` 图标
- [x] 提供 `apple-touch-icon`
- [x] 前端接入安装按钮与 `beforeinstallprompt/appinstalled`

验收方式：
1. 使用 HTTPS 域名访问（或 localhost）。
2. Chrome/Edge 打开后，地址栏出现安装入口或页面右上角“安装应用”按钮可触发安装。
3. 安装后可在桌面/手机主屏打开。

## 2) 可离线演示（Offline Demo Ready）
- [x] Service Worker 预缓存关键资源
- [x] 增加 `offline.html` 离线兜底页
- [x] 导航请求离线回退到离线页
- [x] 静态资源使用缓存优先 + 后台更新策略

验收方式：
1. 首次在线访问后断网。
2. 刷新页面仍可打开已缓存页面。
3. 路由跳转失败时可落到离线页。

## 3) 可部署（Deployable）
- [x] 新增健康检查接口：`GET /api/health`
- [x] 新增 `Dockerfile`
- [x] 新增 `.dockerignore`
- [x] 静态资源 MIME 类型补全（`png/svg/ico`）

验收方式：
1. 容器启动后访问 `/api/health` 返回 `ok: true`。
2. `manifest`、图标、`sw.js` 可正常加载。

## 4) 当前 Beta 边界（未做）
- [ ] 真实机票/酒店/天气 API 对接
- [ ] 用户账号与云端数据同步
- [ ] 推送通知与埋点分析
- [ ] 商店上架（Android APK / iOS IPA）

补充说明（2026-04-18）：
- 已完成天气 API 半真实接入：`POST /api/weather`，数据源 Open-Meteo。
- 机票/酒店仍为估算模型，未接入外部实时票价。

## 5) 下一阶段建议（按优先级）
1. 部署到公网 HTTPS（Render/Railway/Fly.io 任一）并做真机安装演示。
2. 接入真实地图与交通数据，替换估算模型。
3. 加账号体系，把本地 `db.json` 迁移到云数据库。
