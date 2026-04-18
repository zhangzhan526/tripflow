"use strict";

const http = require("node:http");
const { server, startServer } = require("../src/server");
const PORT = Number(process.env.SMOKE_PORT || 5199);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function request(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port: PORT,
        path: pathname,
        method: "GET",
        timeout: 5000
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            body: Buffer.concat(chunks).toString("utf8"),
            headers: res.headers
          });
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("request timeout")));
    req.end();
  });
}

async function waitServerReady(retry = 30) {
  for (let i = 0; i < retry; i += 1) {
    try {
      const res = await request("/api/health");
      if (res.status === 200) return true;
    } catch (_err) {
      // retry
    }
    await wait(300);
  }
  return false;
}

async function main() {
  await startServer(PORT);
  try {
    const ready = await waitServerReady();
    if (!ready) throw new Error("server did not become ready in time");

    const health = await request("/api/health");
    if (health.status !== 200) throw new Error(`/api/health status ${health.status}`);
    const healthJson = JSON.parse(health.body);
    if (!healthJson.ok) throw new Error("/api/health ok=false");

    const manifest = await request("/manifest.webmanifest");
    if (manifest.status !== 200) throw new Error(`/manifest.webmanifest status ${manifest.status}`);
    const manifestJson = JSON.parse(manifest.body);
    if (!Array.isArray(manifestJson.icons) || manifestJson.icons.length < 2) {
      throw new Error("manifest icons not configured");
    }

    const offline = await request("/offline.html");
    if (offline.status !== 200) throw new Error(`/offline.html status ${offline.status}`);
    if (!offline.body.includes("离线状态")) throw new Error("offline page content check failed");

    console.log("[PASS] health endpoint");
    console.log("[PASS] manifest endpoint");
    console.log("[PASS] offline fallback page");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((err) => {
  console.error(`[FAIL] ${err.message}`);
  process.exitCode = 1;
});
