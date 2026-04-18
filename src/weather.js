"use strict";

const https = require("node:https");

const MAX_FORECAST_DAYS = 14;

function round1(value) {
  return Math.round(value * 10) / 10;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, offset) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function parseStartDate(input) {
  const txt = String(input || "").trim();
  if (!txt) return new Date();
  const date = new Date(`${txt}T00:00:00`);
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
}

function normalizeCityName(city) {
  return String(city || "")
    .trim()
    .replace(/(特别行政区|自治区|自治州|地区)$/u, "")
    .replace(/(省|市)$/u, "");
}

function weatherCodeToText(code) {
  const c = Number(code);
  if (c === 0) return "晴";
  if ([1, 2].includes(c)) return "多云";
  if (c === 3) return "阴";
  if ([45, 48].includes(c)) return "雾";
  if ([51, 53, 55, 56, 57].includes(c)) return "毛毛雨";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return "降雨";
  if ([71, 73, 75, 77, 85, 86].includes(c)) return "降雪";
  if ([95, 96, 99].includes(c)) return "雷暴";
  return "未知";
}

function codePenalty(code) {
  const c = Number(code);
  if (c === 0) return 0;
  if ([1, 2, 3].includes(c)) return 4;
  if ([45, 48].includes(c)) return 12;
  if ([51, 53, 55, 56, 57].includes(c)) return 10;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return 20;
  if ([71, 73, 75, 77, 85, 86].includes(c)) return 25;
  if ([95, 96, 99].includes(c)) return 35;
  return 8;
}

function calcTravelScore(tempMax, tempMin, precipProbability, weatherCode) {
  const avgTemp = (Number(tempMax) + Number(tempMin)) / 2;
  const comfortPenalty = Math.abs(avgTemp - 22) * 1.4;
  const precipPenalty = Number(precipProbability || 0) * 0.32;
  const severePenalty = codePenalty(weatherCode);
  return round1(clamp(100 - comfortPenalty - precipPenalty - severePenalty, 0, 100));
}

function buildDailyAdvice(score, precipProbability, weatherCode) {
  if (Number(precipProbability || 0) >= 70 || [95, 96, 99].includes(Number(weatherCode))) {
    return "建议优先安排室内行程并预留改签空间。";
  }
  if (score < 55) return "建议减少跨城移动，优先近距离景点。";
  if (score < 75) return "建议常规出行，准备雨具或防晒用品。";
  return "天气较适合户外行程，可按原计划推进。";
}

function fetchJson(url, timeoutMs = 9000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        timeout: timeoutMs,
        headers: {
          "User-Agent": "TripFlow/1.0"
        }
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`weather upstream status ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (_err) {
            reject(new Error("weather upstream JSON parse failed"));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("weather upstream timeout")));
  });
}

function createWeatherClient({ fetchJsonImpl = fetchJson } = {}) {
  async function geocodeCity(city) {
    const query = encodeURIComponent(normalizeCityName(city));
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=zh&format=json`;
    const data = await fetchJsonImpl(url);
    const first = data?.results?.[0];
    if (!first) throw new Error(`未找到城市坐标: ${city}`);
    return {
      city,
      resolvedName: first.name || city,
      latitude: first.latitude,
      longitude: first.longitude,
      timezone: first.timezone || "Asia/Shanghai"
    };
  }

  async function forecastCity(location, startDate, endDate) {
    const query = [
      `latitude=${encodeURIComponent(location.latitude)}`,
      `longitude=${encodeURIComponent(location.longitude)}`,
      "daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      "timezone=Asia%2FShanghai",
      `start_date=${encodeURIComponent(startDate)}`,
      `end_date=${encodeURIComponent(endDate)}`
    ].join("&");
    const url = `https://api.open-meteo.com/v1/forecast?${query}`;
    const data = await fetchJsonImpl(url);
    const daily = data?.daily || {};
    const len = Math.min(
      daily.time?.length || 0,
      daily.weather_code?.length || 0,
      daily.temperature_2m_max?.length || 0,
      daily.temperature_2m_min?.length || 0,
      daily.precipitation_probability_max?.length || 0
    );

    const rows = [];
    for (let i = 0; i < len; i += 1) {
      const weatherCode = Number(daily.weather_code[i]);
      const tempMax = Number(daily.temperature_2m_max[i]);
      const tempMin = Number(daily.temperature_2m_min[i]);
      const precipProbability = Number(daily.precipitation_probability_max[i]);
      const travelScore = calcTravelScore(tempMax, tempMin, precipProbability, weatherCode);
      rows.push({
        date: daily.time[i],
        weatherCode,
        condition: weatherCodeToText(weatherCode),
        tempMax: round1(tempMax),
        tempMin: round1(tempMin),
        precipProbability: round1(precipProbability),
        travelScore,
        advice: buildDailyAdvice(travelScore, precipProbability, weatherCode)
      });
    }
    return rows;
  }

  async function getTripWeather(payload) {
    const cities = (payload?.cities || []).map((x) => String(x).trim()).filter(Boolean);
    if (!cities.length) throw new Error("cities 不能为空");

    const start = parseStartDate(payload?.startDate);
    const startDate = toDateISO(start);
    const requestedDays = Math.max(1, Number(payload?.days || 1));
    const forecastDays = Math.min(MAX_FORECAST_DAYS, Math.floor(requestedDays));
    const endDate = toDateISO(addDays(start, forecastDays - 1));

    const uniqCities = [...new Set(cities)];
    const byCity = [];
    const cityDailyMap = {};
    const errors = [];

    for (const city of uniqCities) {
      try {
        const location = await geocodeCity(city);
        const daily = await forecastCity(location, startDate, endDate);
        cityDailyMap[city] = daily;
        byCity.push({
          city,
          resolvedName: location.resolvedName,
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: location.timezone,
          daily
        });
      } catch (err) {
        cityDailyMap[city] = [];
        errors.push({ city, message: err.message || "weather fetch failed" });
      }
    }

    const routeDaily = [];
    for (let i = 0; i < forecastDays; i += 1) {
      const city = cities[Math.min(i, cities.length - 1)];
      const date = toDateISO(addDays(start, i));
      const rows = cityDailyMap[city] || [];
      const matched = rows.find((x) => x.date === date) || rows[i] || null;

      if (!matched) {
        routeDaily.push({
          day: i + 1,
          date,
          city,
          condition: "暂无预报",
          tempMax: null,
          tempMin: null,
          precipProbability: null,
          travelScore: null,
          advice: "暂未获取到实时天气，建议临近出发前再次确认。"
        });
        continue;
      }

      routeDaily.push({
        day: i + 1,
        date,
        city,
        ...matched
      });
    }

    const scoredDays = routeDaily.filter((x) => Number.isFinite(x.travelScore));
    const avgScore = scoredDays.length ? round1(scoredDays.reduce((acc, x) => acc + x.travelScore, 0) / scoredDays.length) : null;
    const worstDay = scoredDays.length ? scoredDays.reduce((a, b) => (a.travelScore <= b.travelScore ? a : b)) : null;

    const notes = [];
    if (requestedDays > MAX_FORECAST_DAYS) {
      notes.push(`实时天气仅提供前 ${MAX_FORECAST_DAYS} 天，后续天数请临近出发前再刷新。`);
    }
    if (errors.length) {
      notes.push(`部分城市天气获取失败：${errors.map((x) => x.city).join("、")}。`);
    }

    const riskLevel = avgScore === null ? "unknown" : avgScore < 55 ? "high" : avgScore < 75 ? "medium" : "low";

    return {
      source: "Open-Meteo",
      generatedAt: new Date().toISOString(),
      request: {
        startDate,
        requestedDays: Math.floor(requestedDays),
        forecastDays
      },
      byCity,
      routeDaily,
      summary: {
        riskLevel,
        avgScore,
        worstDay: worstDay
          ? {
              day: worstDay.day,
              date: worstDay.date,
              city: worstDay.city,
              travelScore: worstDay.travelScore
            }
          : null,
        notes
      },
      errors
    };
  }

  return {
    getTripWeather
  };
}

const defaultClient = createWeatherClient();

module.exports = {
  getTripWeather: defaultClient.getTripWeather,
  createWeatherClient,
  weatherCodeToText,
  calcTravelScore
};
