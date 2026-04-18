"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { planTrip, applyEmergencyAdaptation } = require("./planner");
const { getFeed, getSpotDetail, getCityAttractions, getCityHotels, getCityFoods, getTransportOptions } = require("./data");
const { getTripWeather } = require("./weather");
const { enrichTransportOptions } = require("./transport-live");
const {
  listTrips,
  saveTrip,
  updateTrip,
  removeTrip,
  createShare,
  getShare,
  saveOfflineCache,
  readOfflineCache
} = require("./store");

const PORT = Number(process.env.PORT || 5173);
const PUBLIC_DIR = path.join(__dirname, "..", "public");

function sendJson(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function notFound(res) {
  sendJson(res, 404, { error: "Not Found" });
}

function sendRedirect(res, location, status = 302) {
  res.writeHead(status, { Location: location });
  res.end();
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html)
  });
  res.end(html);
}

function escapeHtml(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const OUTBOUND_ALLOW_HOSTS = ["douyin.com", "www.douyin.com", "xiaohongshu.com", "www.xiaohongshu.com", "xhslink.com", "www.xhslink.com"];

function normalizeOutboundTarget(raw) {
  const txt = String(raw || "").trim();
  if (!txt) return "";
  try {
    const u = new URL(txt);
    if (!/^https?:$/u.test(u.protocol)) return "";
    const host = u.hostname.toLowerCase();
    const allow = OUTBOUND_ALLOW_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
    if (!allow) return "";
    return u.toString();
  } catch (_err) {
    return "";
  }
}

function extractXhsKeyword(targetUrl) {
  try {
    const u = new URL(targetUrl);
    const byQuery =
      u.searchParams.get("keyword") ||
      u.searchParams.get("q") ||
      u.searchParams.get("k") ||
      u.searchParams.get("query") ||
      "";
    if (byQuery) return byQuery.trim();
    const path = decodeURIComponent(u.pathname || "");
    const matched = path.match(/search_result\/(.+)$/u);
    if (matched?.[1]) return matched[1].trim();
    return "";
  } catch (_err) {
    return "";
  }
}

function renderXhsBridgePage({ keyword, target }) {
  const safeKeyword = String(keyword || "").trim();
  const appDeepLink = safeKeyword
    ? `xhsdiscover://search/result?keyword=${encodeURIComponent(safeKeyword)}&source=deeplink`
    : "xhsdiscover://search/recommend";
  const webSearchUrl = safeKeyword
    ? `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(safeKeyword)}`
    : "https://www.xiaohongshu.com/explore";
  const backupSearchUrl = safeKeyword
    ? `https://www.bing.com/search?q=${encodeURIComponent(`site:xiaohongshu.com ${safeKeyword}`)}`
    : "https://www.bing.com/search?q=site%3Axiaohongshu.com";
  const directTarget = target || webSearchUrl;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>打开小红书</title>
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif; background:#f6f7fb; color:#111827; }
    .wrap { max-width:640px; margin:0 auto; padding:20px; }
    .card { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:16px; }
    h1 { margin:0 0 10px; font-size:20px; }
    p { margin:8px 0; color:#4b5563; line-height:1.6; }
    .row { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
    .btn { display:inline-block; border-radius:10px; padding:10px 14px; text-decoration:none; border:1px solid #d1d5db; color:#111827; background:#fff; }
    .btn.primary { background:#ef4444; border-color:#ef4444; color:#fff; }
    .kw { font-weight:700; color:#111827; }
    .small { font-size:12px; color:#6b7280; margin-top:12px; }
  </style>
</head>
<body>
  <main class="wrap">
    <article class="card">
      <h1>打开小红书</h1>
      <p>关键词：<span class="kw">${escapeHtml(safeKeyword || "（未提供）")}</span></p>
      <p>部分手机浏览器会拦截小红书网页搜索页。优先使用 App 打开更稳定。</p>
      <div class="row">
        <a class="btn primary" href="${escapeHtml(appDeepLink)}">在小红书 App 打开</a>
        <a class="btn" href="${escapeHtml(directTarget)}" target="_blank" rel="noopener">尝试网页版</a>
        <a class="btn" href="${escapeHtml(backupSearchUrl)}" target="_blank" rel="noopener">备用搜索</a>
      </div>
      <p class="small">如果点击 App 无反应，请先安装/登录小红书，再返回重试。</p>
    </article>
  </main>
  <script>
    (function () {
      var app = ${JSON.stringify(appDeepLink)};
      var opened = false;
      document.addEventListener("visibilitychange", function () { if (document.hidden) opened = true; });
      setTimeout(function () { if (!opened) window.location.href = app; }, 120);
    })();
  </script>
</body>
</html>`;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (_err) {
        reject(new Error("JSON 解析失败"));
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(_req, res, pathname) {
  const target = pathname === "/" ? "/index.html" : pathname;
  if (target.includes("..")) return notFound(res);

  const filePath = path.join(PUBLIC_DIR, target);
  if (!filePath.startsWith(PUBLIC_DIR)) return notFound(res);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return notFound(res);

  const ext = path.extname(filePath).toLowerCase();
  const typeMap = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon"
  };

  const data = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": typeMap[ext] || "application/octet-stream",
    "Content-Length": data.length
  });
  res.end(data);
}

function withErrorGuard(handler) {
  return async (req, res, urlObj) => {
    try {
      await handler(req, res, urlObj);
    } catch (err) {
      sendJson(res, 400, { error: err.message || "Bad Request" });
    }
  };
}

function sumDistance(connections) {
  return connections.reduce((acc, row) => acc + (row.distanceKm || 0), 0);
}

const routes = {
  "GET /api/health": withErrorGuard(async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      service: "tripflow",
      uptimeSec: Number(process.uptime().toFixed(2)),
      timestamp: new Date().toISOString()
    });
  }),

  "GET /api/feed": withErrorGuard(async (_req, res, urlObj) => {
    const season = urlObj.searchParams.get("season") || "all";
    const kind = urlObj.searchParams.get("kind") || "all";
    const tag = urlObj.searchParams.get("tag") || "推荐";
    sendJson(res, 200, { items: getFeed({ season, kind, tag }) });
  }),

  "GET /api/spot-detail": withErrorGuard(async (_req, res, urlObj) => {
    const id = urlObj.searchParams.get("id");
    if (!id) throw new Error("缺少 id");
    const detail = getSpotDetail(id);
    if (!detail) return notFound(res);
    sendJson(res, 200, detail);
  }),

  "GET /api/attractions": withErrorGuard(async (_req, res, urlObj) => {
    const city = urlObj.searchParams.get("city");
    if (!city) throw new Error("缺少 city 参数");
    sendJson(res, 200, { city, categories: getCityAttractions(city) });
  }),

  "GET /api/hotels": withErrorGuard(async (_req, res, urlObj) => {
    const city = urlObj.searchParams.get("city");
    if (!city) throw new Error("缺少 city 参数");
    sendJson(res, 200, { city, items: getCityHotels(city) });
  }),

  "GET /api/foods": withErrorGuard(async (_req, res, urlObj) => {
    const city = urlObj.searchParams.get("city");
    if (!city) throw new Error("缺少 city 参数");
    sendJson(res, 200, { city, items: getCityFoods(city) });
  }),

  "POST /api/transport-options": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    const base = getTransportOptions(body);
    const enriched = await enrichTransportOptions(base, body);
    sendJson(res, 200, enriched);
  }),

  "POST /api/weather": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    const weather = await getTripWeather(body);
    sendJson(res, 200, weather);
  }),

  "POST /api/plan": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    const result = planTrip(body);
    saveOfflineCache("latestPlan", result);
    sendJson(res, 200, result);
  }),

  "POST /api/emergency": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    const adapted = applyEmergencyAdaptation(body.planResult, body.event);
    sendJson(res, 200, adapted);
  }),

  "GET /api/history": withErrorGuard(async (_req, res) => {
    sendJson(res, 200, { items: listTrips() });
  }),

  "POST /api/history": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    if (!body || !body.payload) throw new Error("payload 不能为空");
    const row = saveTrip(body);
    sendJson(res, 201, row);
  }),

  "PUT /api/history": withErrorGuard(async (req, res, urlObj) => {
    const id = urlObj.searchParams.get("id");
    if (!id) throw new Error("缺少 id");
    const body = await parseBody(req);
    const row = updateTrip(id, body.payload);
    if (!row) return notFound(res);
    sendJson(res, 200, row);
  }),

  "DELETE /api/history": withErrorGuard(async (_req, res, urlObj) => {
    const id = urlObj.searchParams.get("id");
    if (!id) throw new Error("缺少 id");
    const ok = removeTrip(id);
    if (!ok) return notFound(res);
    sendJson(res, 200, { ok: true });
  }),

  "POST /api/share": withErrorGuard(async (req, res) => {
    const body = await parseBody(req);
    if (!body || !body.payload) throw new Error("payload 不能为空");
    const token = createShare(body.payload);
    sendJson(res, 201, { token, link: `/share/${token}` });
  }),

  "GET /api/share": withErrorGuard(async (_req, res, urlObj) => {
    const token = urlObj.searchParams.get("token");
    if (!token) throw new Error("缺少 token");
    const row = getShare(token);
    if (!row) return notFound(res);
    sendJson(res, 200, row);
  }),

  "GET /api/export": withErrorGuard(async (_req, res, urlObj) => {
    const token = urlObj.searchParams.get("token");
    if (!token) throw new Error("缺少 token");
    const row = getShare(token);
    if (!row) return notFound(res);

    const p = row.payload;
    const plans = p.plans || [];
    const tightHours = plans.map((x) => x.totalHoursTight);
    const relaxedHours = plans.map((x) => x.totalHoursRelaxed);

    const text = [
      `行程导出时间: ${new Date().toLocaleString("zh-CN")}`,
      `城市串联: ${(p.summary?.cities || []).join(" -> ")}`,
      `天数: ${p.summary?.days || "-"}`,
      `人数: ${p.summary?.travelers || "-"}`,
      `基础预算: ${p.costs?.commonCost || "-"} 元`,
      "方案对比:",
      ...plans.map((x) => `- ${x.label}: 费用 ${x.totalCost} 元, 紧凑时长 ${x.totalHoursTight}h`)
    ].join("\n");

    sendJson(res, 200, {
      text,
      card: {
        route: p.summary?.cities || [],
        mileage: sumDistance(p.crossCityConnections || []),
        hours: {
          min: tightHours.length ? Math.min(...tightHours) : 0,
          max: relaxedHours.length ? Math.max(...relaxedHours) : 0
        }
      }
    });
  }),

  "GET /api/offline": withErrorGuard(async (_req, res, urlObj) => {
    const key = urlObj.searchParams.get("key") || "latestPlan";
    const row = readOfflineCache(key);
    if (!row) return notFound(res);
    sendJson(res, 200, row);
  }),

  "GET /go": withErrorGuard(async (_req, res, urlObj) => {
    const target = normalizeOutboundTarget(urlObj.searchParams.get("target"));
    if (!target) throw new Error("无效跳转地址");
    const host = new URL(target).hostname.toLowerCase();
    const isXhs = host === "xiaohongshu.com" || host.endsWith(".xiaohongshu.com") || host === "xhslink.com" || host.endsWith(".xhslink.com");
    if (isXhs) {
      const keyword = extractXhsKeyword(target);
      sendHtml(res, 200, renderXhsBridgePage({ keyword, target }));
      return;
    }
    sendRedirect(res, target, 302);
  })
};

function shouldServeSpa(pathname) {
  return (
    pathname === "/" ||
    pathname === "/feed" ||
    pathname.startsWith("/spot/") ||
    pathname.startsWith("/plan/") ||
    pathname === "/history" ||
    pathname.startsWith("/share/")
  );
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  const routeKey = `${req.method} ${pathname}`;

  if (routes[routeKey]) return routes[routeKey](req, res, urlObj);
  if (req.method === "GET" && shouldServeSpa(pathname)) return serveStatic(req, res, "/index.html");
  return serveStatic(req, res, pathname);
});

function startServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.removeListener("error", reject);
      console.log(`Youth Travel Planner is running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}

module.exports = {
  server,
  startServer
};
