# 公网部署与域名绑定（可持续迭代版）

目标：
- 让外部用户马上可访问你的演示地址
- 后续你每次改代码后可自动更新上线
- 保留持续优化能力（测试 + 回滚 + 分支发布）

---

## 1. 一次性准备

1. 把当前项目推到 GitHub（建议仓库名：`tripflow`）。
2. 确认仓库根目录存在：
   - `render.yaml`
   - `Dockerfile`
   - `.github/workflows/ci.yml`
3. 在本地先跑一次：
   - `node test/run-tests.js`
   - `node test/smoke-pwa.js`

---

## 2. 用 Render 部署公网地址（最快）

1. 登录 Render，选择 **New +** -> **Blueprint**。
2. 连接 GitHub 仓库并选择本项目。
3. Render 会读取仓库根目录的 `render.yaml` 自动创建服务。
4. 等待部署成功后，拿到默认地址（例如 `https://tripflow-pwa-beta.onrender.com`）。
5. 访问以下地址确认健康状态：
   - `/api/health`
   - `/manifest.webmanifest`

---

## 3. 绑定你的自定义域名

1. 在 Render 服务页面进入 **Settings** -> **Custom Domains**。
2. 添加你的域名（例如 `app.yourdomain.com` 或 `yourdomain.com`）。
3. 按 Render 页面提示到域名服务商配置 DNS：
   - 子域名（如 `app.yourdomain.com`）：通常配置 `CNAME` 指向你的 `*.onrender.com` 地址。
   - 根域名（如 `yourdomain.com`）：优先使用 `ALIAS/ANAME` 指向 `*.onrender.com`；若服务商不支持，再按提示用 `A` 记录。
4. 回到 Render 点击 **Verify** 完成验证。
5. 证书签发后会自动启用 HTTPS。

---

## 4. 保持“可持续修改优化”

推荐分支策略：
- `main`：生产环境（真实用户访问）
- `staging`：预发布环境（先验收再上生产）

建议流程：
1. 新功能在 `feature/*` 分支开发
2. 提 PR 到 `staging`，CI 自动跑测试
3. 预发布地址验收通过后，合并到 `main`
4. Render 自动从 `main` 部署生产

---

## 5. 数据持久化注意事项

当前项目默认用本地 JSON 文件存储（`db.json`）。
- 代码已支持通过 `DB_PATH` 环境变量指定存储位置。
- 如果生产环境容器重建，未挂载持久化磁盘时数据会丢失。

建议：
1. 早期演示可先用现有方式。
2. 正式推广前迁移到云数据库（PostgreSQL/Supabase/Neon）。

---

## 6. 上线后立刻可做的两件事

1. 在首页放“反馈入口”（微信群/邮箱/问卷）收集真实用户意见。
2. 增加基础埋点（访问量、生成行程次数、分享点击率），让你优化有数据依据。
