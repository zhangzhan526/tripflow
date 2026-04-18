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
