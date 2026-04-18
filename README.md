# TripFlow（PWA Beta）

面向年轻用户的旅行规划 PWA 原型：支持多城市行程规划、交通方案对比、预算拆解、历史/分享、离线缓存。

当前已接入半真实数据能力：
- 实时天气（Open-Meteo）`POST /api/weather`
- 生成行程后前端会自动拉取天气并展示每日出行风险提示
- 交通步骤支持实时路网补强（OSRM）+ 可选第三方交通 provider（`TRANSPORT_PROVIDER_URL`）

## 本地运行

```bash
node src/server.js
```

默认地址：`http://localhost:5173`

可选环境变量：
- `TRANSPORT_PROVIDER_URL`：第三方交通 API 地址（`POST`），用于覆盖/增强默认估算交通数据。

## 测试

```bash
node test/run-tests.js
```

## PWA Beta 验收

1. 打开 `http://localhost:5173`，访问一次主要页面后断网刷新，验证离线可用。
2. 在 Chrome/Edge 使用 HTTPS 域名（或 localhost）访问，验证安装入口。
3. 访问 `GET /api/health` 验证服务健康状态。
4. 在“预算结果”页点击生成方案后，确认出现“实时天气（Beta）”卡片。

## Docker 部署

```bash
docker build -t tripflow-pwa-beta .
docker run --name tripflow -p 5173:5173 tripflow-pwa-beta
```

健康检查：

```bash
curl http://localhost:5173/api/health
```

## 清单

见 `PWA_BETA_CHECKLIST.md`。

## Render 一键部署（可选）

仓库根目录已提供 `render.yaml`，将代码仓库连接到 Render 后可直接按 Blueprint 创建服务，健康检查路径为 `/api/health`。

公网部署与域名绑定完整步骤见：`DEPLOY_PUBLIC_CN.md`。
