"use strict";

const https = require("node:https");

function round2(value) {
  return Math.round(value * 100) / 100;
}

function normalizeCityName(city) {
  return String(city || "")
    .trim()
    .replace(/(特别行政区|自治区|自治州|地区)$/u, "")
    .replace(/(省|市)$/u, "");
}

function fetchJson(url, method = "GET", body = null, timeoutMs = 9000) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      url,
      {
        method,
        timeout: timeoutMs,
        headers: {
          "User-Agent": "TripFlow/1.0",
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const txt = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`upstream status ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(txt));
          } catch (_err) {
            reject(new Error("upstream parse error"));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("upstream timeout")));
    if (payload) req.write(payload);
    req.end();
  });
}

async function geocodeCity(city, cache) {
  const normalized = normalizeCityName(city);
  if (cache.has(normalized)) return cache.get(normalized);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalized)}&count=1&language=zh&format=json`;
  const data = await fetchJson(url);
  const row = data?.results?.[0];
  if (!row) throw new Error(`city geocode not found: ${city}`);
  const out = { city, latitude: row.latitude, longitude: row.longitude };
  cache.set(normalized, out);
  return out;
}

async function fetchRoadRoute(from, to, cache) {
  const fromGeo = await geocodeCity(from, cache);
  const toGeo = await geocodeCity(to, cache);
  const coords = `${fromGeo.longitude},${fromGeo.latitude};${toGeo.longitude},${toGeo.latitude}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false&alternatives=false&steps=false`;
  const data = await fetchJson(url);
  const route = data?.routes?.[0];
  if (!route) throw new Error(`route not found: ${from}-${to}`);
  return {
    distanceKm: round2(Number(route.distance || 0) / 1000),
    durationHours: round2(Number(route.duration || 0) / 3600),
    source: "OSRM"
  };
}

async function enrichFromProvider(base, payload) {
  const providerUrl = process.env.TRANSPORT_PROVIDER_URL;
  if (!providerUrl) return { base, providerUsed: false };
  try {
    const remote = await fetchJson(providerUrl, "POST", payload, 10000);
    if (!remote || typeof remote !== "object") return { base, providerUsed: false };
    return {
      base: {
        ...base,
        ...remote,
        providerMeta: {
          source: "third-party-provider",
          usedAt: new Date().toISOString()
        }
      },
      providerUsed: true
    };
  } catch (_err) {
    return { base, providerUsed: false };
  }
}

async function enrichTransportOptions(base, payload) {
  const merged = await enrichFromProvider(base, payload);
  const result = merged.base;
  const segments = Array.isArray(result.segmentOptions) ? result.segmentOptions : [];
  if (!segments.length) return result;

  const cache = new Map();
  let liveCount = 0;
  const roadDistances = [];

  for (const seg of segments) {
    try {
      const road = await fetchRoadRoute(seg.from, seg.to, cache);
      seg.liveRoad = road;
      seg.dataSource = {
        rail: "estimated",
        air: "estimated",
        road: road.source
      };
      roadDistances.push(road.distanceKm);
      liveCount += 1;
    } catch (_err) {
      seg.liveRoad = null;
      seg.dataSource = {
        rail: "estimated",
        air: "estimated",
        road: "estimated"
      };
    }
  }

  if (roadDistances.length) {
    const totalRoadKm = roadDistances.reduce((acc, n) => acc + n, 0);
    const travelers = Math.max(1, Number(payload?.travelers || 1));
    const fuelCost = totalRoadKm * 0.085 * 8.2;
    const toll = totalRoadKm * 0.45;
    const parking = Math.max(1, Number(payload?.days || 1)) * 45;
    const privateCarMode = (result.modeSummary || []).find((x) => x.mode === "privateCar");
    if (privateCarMode) {
      privateCarMode.etaHours = round2(totalRoadKm / 78 + (payload?.days || 1) * 1.1);
      privateCarMode.costPerPerson = Math.round((fuelCost + toll + parking) / travelers);
      privateCarMode.recommendReason = "已基于实时路网距离估算自驾里程、时长与成本。";
    }
    result.liveRoadSummary = {
      used: true,
      segmentsWithLiveRoad: liveCount,
      totalSegments: segments.length,
      source: "OSRM",
      totalRoadKm: round2(totalRoadKm)
    };
  } else {
    result.liveRoadSummary = {
      used: false,
      segmentsWithLiveRoad: 0,
      totalSegments: segments.length,
      source: "estimated",
      totalRoadKm: 0
    };
  }

  return result;
}

module.exports = {
  enrichTransportOptions
};
