const assert = require("node:assert/strict");
const { planTrip, applyEmergencyAdaptation } = require("../src/planner");
const { createWeatherClient } = require("../src/weather");

function createInput(overrides = {}) {
  return {
    cities: ["北京", "西安", "成都"],
    days: 4,
    travelers: 2,
    relation: "friends",
    studentMode: false,
    budgetLimit: 7000,
    dispersedSpots: false,
    publicTransitSparse: true,
    lastMileHours: 0.8,
    rentalCrossCity: false,
    carEnergy: "fuel",
    energyPerKm: 0.08,
    selectedMode: "rail",
    segmentModes: {
      "北京-西安": "rail",
      "西安-成都": "air"
    },
    selectedTickets: {
      "北京-西安": "G131",
      "西安-成都": "MU3215"
    },
    distanceMatrix: {
      "北京-西安": 1210,
      "西安-成都": 710
    },
    attractionsByCity: {
      西安: 4,
      成都: 5
    },
    foodExtra: 180,
    selectedHotelCost: 1200,
    ...overrides
  };
}

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

addTest("should generate 4 plans", () => {
  const result = planTrip(createInput());
  assert.equal(result.plans.length, 4);
  assert.deepEqual(result.plans.map((p) => p.mode), ["rail", "air", "privateCar", "rentalCar"]);
});

addTest("student mode should reduce base common costs", () => {
  const normal = planTrip(createInput({ studentMode: false, foodExtra: 0, selectedHotelCost: 0 }));
  const student = planTrip(createInput({ studentMode: true, foodExtra: 0, selectedHotelCost: 0 }));
  assert.ok(student.costs.commonCost < normal.costs.commonCost);
});

addTest("should trigger car recommendation with sparse transit", () => {
  const result = planTrip(createInput({ publicTransitSparse: true }));
  assert.equal(result.carSuggestion.shouldSuggest, true);
  assert.ok(result.carSuggestion.reasons.includes("公共交通班次较少"));
});

addTest("should calculate budget alerts", () => {
  const result = planTrip(createInput({ budgetLimit: 3000 }));
  assert.equal(result.budgetAlerts.length, 4);
  assert.ok(result.budgetAlerts.some((x) => x.overBudget));
});

addTest("should reject invalid city list", () => {
  assert.throws(() => planTrip(createInput({ cities: ["北京"] })), /至少需要 2 个城市/);
});

addTest("should include selected cost breakdown", () => {
  const result = planTrip(createInput({ selectedMode: "air" }));
  assert.ok(result.selectedCostBreakdown);
  assert.ok(result.selectedCostBreakdown.total > 0);
});

addTest("should include segment modes and selected tickets in summary", () => {
  const result = planTrip(createInput());
  assert.equal(result.summary.segmentModes["北京-西安"], "rail");
  assert.equal(result.summary.selectedTickets["西安-成都"], "MU3215");
});

addTest("food and selected hotel cost should be merged into detailed breakdown", () => {
  const result = planTrip(createInput({ selectedMode: "rail", foodExtra: 260, selectedHotelCost: 900 }));
  const keys = result.selectedCostBreakdown.include.map((x) => x.key);
  assert.ok(keys.includes("foodExtra"));
  assert.ok(keys.includes("selectedHotelCost"));
});

addTest("emergency adaptation should annotate action", () => {
  const result = planTrip(createInput());
  const adapted = applyEmergencyAdaptation(result, { type: "roadBlocked" });
  assert.equal(adapted.emergency.eventType, "roadBlocked");
  assert.ok(adapted.emergency.action.includes("绕行"));
});

addTest("preference ranking should return top recommendations", () => {
  const result = planTrip(createInput({ travelPreference: "saveTime" }));
  assert.ok(Array.isArray(result.topRecommendations));
  assert.ok(result.topRecommendations.length >= 2);
  assert.equal(result.summary.travelPreference, "省时优先");
});

addTest("returnToDeparture should add return segment into cross-city connections", () => {
  const result = planTrip(
    createInput({
      cities: ["北京", "西安", "成都"],
      departureCity: "北京",
      returnToDeparture: true,
      distanceMatrix: {
        "北京-西安": 1210,
        "西安-成都": 710,
        "成都-北京": 1800
      }
    })
  );
  assert.equal(result.returnPlan.includedInEstimate, true);
  assert.ok((result.crossCityConnections || []).some((x) => x.from === "成都" && x.to === "北京"));
});

addTest("weather client should build route daily data from upstream payload", async () => {
  const mockedFetch = async (url) => {
    if (url.includes("geocoding-api.open-meteo.com")) {
      return {
        results: [{ name: "北京", latitude: 39.9, longitude: 116.4, timezone: "Asia/Shanghai" }]
      };
    }
    if (url.includes("api.open-meteo.com")) {
      return {
        daily: {
          time: ["2026-04-18", "2026-04-19"],
          weather_code: [0, 61],
          temperature_2m_max: [27, 18],
          temperature_2m_min: [16, 11],
          precipitation_probability_max: [8, 75]
        }
      };
    }
    throw new Error(`unexpected url: ${url}`);
  };

  const client = createWeatherClient({ fetchJsonImpl: mockedFetch });
  const result = await client.getTripWeather({
    cities: ["北京"],
    startDate: "2026-04-18",
    days: 2
  });

  assert.equal(result.routeDaily.length, 2);
  assert.equal(result.routeDaily[0].condition, "晴");
  assert.equal(result.routeDaily[1].condition, "降雨");
  assert.ok(result.routeDaily[0].travelScore > result.routeDaily[1].travelScore);
});

addTest("weather client should degrade gracefully when city geocoding fails", async () => {
  const mockedFetch = async () => ({ results: [] });
  const client = createWeatherClient({ fetchJsonImpl: mockedFetch });
  const result = await client.getTripWeather({
    cities: ["不存在城市"],
    startDate: "2026-04-18",
    days: 1
  });

  assert.equal(result.errors.length, 1);
  assert.equal(result.routeDaily[0].condition, "暂无预报");
  assert.equal(result.summary.riskLevel, "unknown");
});

let pass = 0;
let fail = 0;

async function run() {
  for (const t of tests) {
    try {
      await t.fn();
      pass += 1;
      console.log(`[PASS] ${t.name}`);
    } catch (err) {
      fail += 1;
      console.error(`[FAIL] ${t.name}`);
      console.error(`  ${err.message}`);
    }
  }

  console.log(`\nTotal: ${tests.length}, Pass: ${pass}, Fail: ${fail}`);
  if (fail > 0) process.exitCode = 1;
}

run().catch((err) => {
  console.error(`[FAIL] ${err.message}`);
  process.exitCode = 1;
});
