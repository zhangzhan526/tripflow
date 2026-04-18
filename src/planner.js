"use strict";

const FLEX_BUFFER_HOURS = 0.5;

function round2(value) {
  return Math.round(value * 100) / 100;
}

function sum(numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

function uniq(arr) {
  return [...new Set(arr)];
}

function buildSegments(cities, distanceMatrix) {
  const segments = [];
  for (let i = 0; i < cities.length - 1; i += 1) {
    const from = cities[i];
    const to = cities[i + 1];
    const key = `${from}-${to}`;
    const reverse = `${to}-${from}`;
    const distanceKm = distanceMatrix[key] ?? distanceMatrix[reverse] ?? 300;
    segments.push({ from, to, distanceKm });
  }
  return segments;
}

function calcCommonCost(input) {
  const days = input.days;
  const travelers = input.travelers;
  const attractionsCount = sum(Object.values(input.attractionsByCity || {}).map((x) => Number(x || 0)));
  const ticketAvg = input.studentMode ? 45 : 80;
  const attractionCost = attractionsCount * ticketAvg;

  const hotelNightly = input.studentMode ? 160 : 260;
  const rooms = Math.ceil(travelers / 2);
  const baseHotelCost = rooms * hotelNightly * days;
  const selectedHotelCost = Number.isFinite(Number(input.selectedHotelCost)) ? Math.max(0, Number(input.selectedHotelCost)) : 0;
  const hotelCost = selectedHotelCost > 0 ? selectedHotelCost : baseHotelCost;

  const mealsPerDay = input.studentMode ? 90 : 140;
  const baseMealCost = travelers * mealsPerDay * days;
  const foodExtra = Number.isFinite(Number(input.foodExtra)) ? Math.max(0, Number(input.foodExtra)) : 0;
  const mealCost = baseMealCost + foodExtra;

  return {
    attractionsCount,
    attractionCost: round2(attractionCost),
    baseHotelCost: round2(baseHotelCost),
    selectedHotelCost: round2(selectedHotelCost),
    hotelCost: round2(hotelCost),
    baseMealCost: round2(baseMealCost),
    foodExtra: round2(foodExtra),
    mealCost: round2(mealCost),
    commonCost: round2(attractionCost + hotelCost + mealCost)
  };
}

function calcRailPlan(input, segments, common) {
  const travelers = input.travelers;
  const studentDiscount = input.studentMode ? 0.75 : 1;
  const railTicket = sum(segments.map((s) => s.distanceKm * 0.42 * travelers * studentDiscount));
  const cityTransit = input.days * travelers * 20;
  const transportCost = railTicket + cityTransit;

  const onTrainHours = sum(segments.map((s) => s.distanceKm / 220));
  const stationWaitHours = segments.length * 1.5;
  const intraCityHours = input.days * 1.4;
  const sightseeingHours = input.days * 8.8;
  const bufferHours = input.days * FLEX_BUFFER_HOURS;

  const tight = sightseeingHours + onTrainHours + stationWaitHours + intraCityHours + bufferHours;
  const relaxed = tight + input.days * 1.3;

  return {
    mode: "rail",
    label: "省钱公共交通版",
    totalCost: round2(common.commonCost + transportCost),
    totalHoursTight: round2(tight),
    totalHoursRelaxed: round2(relaxed),
    freedomScore: 4.8,
    convenienceScore: round2(Math.max(5.2, 8.8 - segments.length * 0.45)),
    details: {
      transportCost: round2(transportCost),
      items: {
        railTicket: round2(railTicket),
        cityTransit: round2(cityTransit)
      },
      time: {
        onTrainHours: round2(onTrainHours),
        stationWaitHours: round2(stationWaitHours),
        intraCityHours: round2(intraCityHours),
        sightseeingHours: round2(sightseeingHours),
        bufferHours: round2(bufferHours)
      },
      scenicHint: "已自动标注沿线山海/田园/峡谷等景观和靠窗建议。"
    }
  };
}

function calcAirPlan(input, segments, common) {
  const travelers = input.travelers;
  const flightTicket = sum(segments.map((s) => Math.max(380, s.distanceKm * 0.9) * travelers));
  const airportShuttle = segments.length * travelers * 55;
  const transportCost = flightTicket + airportShuttle;

  const inAirHours = sum(segments.map((s) => s.distanceKm / 700));
  const airportProcessHours = segments.length * 2.3;
  const intraCityHours = input.days * 1.5;
  const sightseeingHours = input.days * 8.9;
  const bufferHours = input.days * FLEX_BUFFER_HOURS;

  const tight = sightseeingHours + inAirHours + airportProcessHours + intraCityHours + bufferHours;
  const relaxed = tight + input.days * 1.1;

  return {
    mode: "air",
    label: "高效高铁飞机版",
    totalCost: round2(common.commonCost + transportCost),
    totalHoursTight: round2(tight),
    totalHoursRelaxed: round2(relaxed),
    freedomScore: 5.4,
    convenienceScore: round2(Math.max(6, 9.1 - segments.length * 0.3)),
    details: {
      transportCost: round2(transportCost),
      items: {
        flightTicket: round2(flightTicket),
        airportShuttle: round2(airportShuttle)
      },
      time: {
        inAirHours: round2(inAirHours),
        airportProcessHours: round2(airportProcessHours),
        intraCityHours: round2(intraCityHours),
        sightseeingHours: round2(sightseeingHours),
        bufferHours: round2(bufferHours)
      },
      shuttleHint: "已纳入机场到市区接驳时间与费用。"
    }
  };
}

function calcPrivateCarPlan(input, segments, common) {
  const totalDistance = sum(segments.map((s) => s.distanceKm));
  const energyPrice = input.carEnergy === "ev" ? 0.18 : 0.72;
  const energyCost = totalDistance * input.energyPerKm * energyPrice;
  const toll = totalDistance * 0.45;
  const parking = input.days * 45;
  const transportCost = energyCost + toll + parking;

  const driveHours = totalDistance / 78 + input.days * 1.2;
  const sightseeingHours = input.days * 8.8;
  const bufferHours = input.days * FLEX_BUFFER_HOURS;

  const tight = sightseeingHours + driveHours + bufferHours;
  const relaxed = tight + input.days * 0.9;

  return {
    mode: "privateCar",
    label: "自有车自驾版",
    totalCost: round2(common.commonCost + transportCost),
    totalHoursTight: round2(tight),
    totalHoursRelaxed: round2(relaxed),
    freedomScore: 9.3,
    convenienceScore: 7.6,
    details: {
      transportCost: round2(transportCost),
      items: {
        energyCost: round2(energyCost),
        toll: round2(toll),
        parking: round2(parking)
      },
      time: {
        driveHours: round2(driveHours),
        sightseeingHours: round2(sightseeingHours),
        bufferHours: round2(bufferHours)
      },
      totalDistanceKm: round2(totalDistance),
      routeOptions: ["最快时效路线", "最短距离路线", "景观自驾路线"]
    }
  };
}

function calcRentalCarPlan(input, segments, common) {
  const totalDistance = sum(segments.map((s) => s.distanceKm));
  const baseDaily = input.studentMode ? 210 : 260;
  const rentalFee = baseDaily * input.days;
  const serviceFee = 30 * input.days;
  const insurance = 40 * input.days;
  const cityPickupFee = 0;
  const fuel = totalDistance * 0.085 * 8.2;
  const toll = totalDistance * 0.45;
  const parking = input.days * 55;
  const transportCost = rentalFee + serviceFee + insurance + cityPickupFee + fuel + toll + parking;

  const driveHours = totalDistance / 78 + input.days * 1.2;
  const pickupReturnHours = 1.5;
  const sightseeingHours = input.days * 8.8;
  const bufferHours = input.days * FLEX_BUFFER_HOURS;

  const tight = sightseeingHours + driveHours + pickupReturnHours + bufferHours;
  const relaxed = tight + input.days;

  return {
    mode: "rentalCar",
    label: "城市内租车中转版",
    totalCost: round2(common.commonCost + transportCost),
    totalHoursTight: round2(tight),
    totalHoursRelaxed: round2(relaxed),
    freedomScore: 8.7,
    convenienceScore: 8.1,
    details: {
      transportCost: round2(transportCost),
      items: {
        rentalFee: round2(rentalFee),
        serviceFee: round2(serviceFee),
        insurance: round2(insurance),
        cityPickupFee: round2(cityPickupFee),
        fuel: round2(fuel),
        toll: round2(toll),
        parking: round2(parking)
      },
      time: {
        driveHours: round2(driveHours),
        pickupReturnHours: round2(pickupReturnHours),
        sightseeingHours: round2(sightseeingHours),
        bufferHours: round2(bufferHours)
      },
      totalDistanceKm: round2(totalDistance),
      rentalSupport: ["信用免押说明", "验车 checklist", "满油取还规则"]
    }
  };
}

function calcSegmentModeSelection(input, segments, common) {
  const travelers = input.travelers;
  const studentDiscount = input.studentMode ? 0.75 : 1;
  const energyPrice = input.carEnergy === "ev" ? 0.18 : 0.72;

  const items = {
    railTicket: 0,
    flightTicket: 0,
    airportShuttle: 0,
    energyCost: 0,
    toll: 0,
    parking: 0,
    rentalFee: 0,
    serviceFee: 0,
    insurance: 0,
    cityPickupFee: 0,
    fuel: 0,
    cityTransit: input.days * travelers * 20
  };

  const time = {
    onTrainHours: 0,
    stationWaitHours: 0,
    inAirHours: 0,
    airportProcessHours: 0,
    driveHours: 0,
    pickupReturnHours: 0,
    intraCityHours: input.days * 1.4,
    sightseeingHours: input.days * 8.8,
    bufferHours: input.days * FLEX_BUFFER_HOURS
  };

  let hasDrive = false;
  let hasRental = false;
  const appliedModes = {};

  for (const seg of segments) {
    const key = `${seg.from}-${seg.to}`;
    const mode = input.segmentModes?.[key] || input.selectedMode || "rail";
    appliedModes[key] = mode;

    if (mode === "rail") {
      items.railTicket += seg.distanceKm * 0.42 * travelers * studentDiscount;
      time.onTrainHours += seg.distanceKm / 220;
      time.stationWaitHours += 1.5;
      continue;
    }

    if (mode === "air") {
      items.flightTicket += Math.max(380, seg.distanceKm * 0.9) * travelers;
      items.airportShuttle += travelers * 55;
      time.inAirHours += seg.distanceKm / 700;
      time.airportProcessHours += 2.3;
      continue;
    }

    if (mode === "privateCar") {
      hasDrive = true;
      items.energyCost += seg.distanceKm * input.energyPerKm * energyPrice;
      items.toll += seg.distanceKm * 0.45;
      time.driveHours += seg.distanceKm / 78;
      continue;
    }

    hasDrive = true;
    hasRental = true;
    items.fuel += seg.distanceKm * 0.085 * 8.2;
    items.toll += seg.distanceKm * 0.45;
    time.driveHours += seg.distanceKm / 78;
  }

  if (hasDrive) {
    items.parking += input.days * (hasRental ? 55 : 45);
  }
  if (hasRental) {
    const baseDaily = input.studentMode ? 210 : 260;
    items.rentalFee += baseDaily * input.days;
    items.serviceFee += 30 * input.days;
    items.insurance += 40 * input.days;
    time.pickupReturnHours += 1.5;
  }

  const transportCost = round2(sum(Object.values(items)));
  const tight = round2(sum(Object.values(time)));
  const relaxed = round2(tight + input.days * (hasRental ? 1 : 1.1));

  const uniqueModes = [...new Set(Object.values(appliedModes))];
  const selectedMode = uniqueModes.length === 1 ? uniqueModes[0] : "mixed";
  const label = uniqueModes.length === 1 ? `按段${selectedMode}方案` : "多段混合交通版";

  return {
    mode: selectedMode,
    label,
    totalCost: round2(common.commonCost + transportCost),
    totalHoursTight: tight,
    totalHoursRelaxed: relaxed,
    freedomScore: uniqueModes.includes("privateCar") || uniqueModes.includes("rentalCar") ? 8.4 : 6.5,
    convenienceScore: uniqueModes.includes("air") ? 7.9 : 7.1,
    details: {
      transportCost,
      items,
      time,
      segmentModes: appliedModes
    }
  };
}

function resolveBudgetAlerts(plans, budgetLimit) {
  return plans.map((plan) => {
    if (!Number.isFinite(budgetLimit)) return { mode: plan.mode, overBudget: false, overBy: 0 };
    const overBy = round2(Math.max(0, plan.totalCost - budgetLimit));
    return { mode: plan.mode, overBudget: overBy > 0, overBy };
  });
}

function shouldSuggestRental(input) {
  const reasons = [];
  if (Boolean(input.dispersedSpots)) reasons.push("已选景点分散");
  if (Boolean(input.publicTransitSparse)) reasons.push("公共交通班次较少");
  if (Number(input.lastMileHours || 0) > 1) reasons.push("末端接驳预计超过 1 小时");
  return { shouldSuggest: reasons.length > 0, reasons };
}

function generateDailyPlan(cities, days, attractionsByCity) {
  const daily = [];
  for (let i = 0; i < days; i += 1) {
    const city = cities[Math.min(i, cities.length - 1)];
    daily.push({
      day: i + 1,
      city,
      highlights: [
        `地标打卡 x${Math.max(1, Math.floor((attractionsByCity[city] || 2) / 2))}`,
        "拍照出片点",
        "美食聚集区"
      ],
      timeTemplate: {
        morning: "09:00-12:00 景点游玩",
        afternoon: "13:30-17:30 城市串联/景点间交通",
        evening: "19:00-21:00 夜游与餐饮"
      },
      flexBufferMinutes: 30
    });
  }
  return daily;
}

function buildReturnPlan(cities, departureCity) {
  const lastCity = cities[cities.length - 1];
  return {
    lastCity,
    returnTo: departureCity,
    note: "已自动生成返程交通闭环建议。"
  };
}

function buildDetailedCostBreakdown(common, selectedPlan) {
  const details = selectedPlan?.details || {};
  const transportItems = Object.entries(details.items || {}).map(([key, amount]) => ({ key, amount: round2(amount) }));
  const baseItems = [{ key: "attractionCost", amount: common.attractionCost }];
  if (common.selectedHotelCost > 0) {
    baseItems.push({ key: "selectedHotelCost", amount: common.selectedHotelCost });
  } else {
    baseItems.push({ key: "hotelCost", amount: common.hotelCost });
  }
  baseItems.push({ key: "mealCost", amount: common.baseMealCost });
  if (common.foodExtra > 0) baseItems.push({ key: "foodExtra", amount: common.foodExtra });

  const include = [...baseItems, ...transportItems];
  const transportCost = selectedPlan?.details?.transportCost || 0;
  const usageMap = {
    attractionCost: "景点门票和活动入场费用",
    selectedHotelCost: "你已选择酒店方案费用",
    hotelCost: "系统按人数与天数估算住宿费用",
    mealCost: "基础餐饮预算（每日三餐）",
    foodExtra: "你勾选的特色餐饮附加费用",
    railTicket: "跨城高铁票",
    cityTransit: "地铁/公交/短距离打车",
    flightTicket: "跨城机票",
    airportShuttle: "机场往返市区接驳",
    energyCost: "自驾油费/电费",
    fuel: "租车用油/电成本",
    toll: "高速通行费",
    parking: "景区与城市停车费",
    rentalFee: "租车基础日租",
    serviceFee: "门店服务与手续费用",
    insurance: "基础保险费用",
    cityPickupFee: "异地或特殊取还车费用"
  };
  const fluctuationMap = {
    attractionCost: "浮动约 ±20%",
    selectedHotelCost: "浮动约 ±25%",
    hotelCost: "浮动约 ±25%",
    mealCost: "浮动约 ±20%",
    foodExtra: "浮动约 ±30%",
    railTicket: "浮动约 ±15%",
    cityTransit: "浮动约 ±20%",
    flightTicket: "浮动约 ±35%",
    airportShuttle: "浮动约 ±20%",
    energyCost: "浮动约 ±25%",
    fuel: "浮动约 ±25%",
    toll: "浮动约 ±10%",
    parking: "浮动约 ±30%",
    rentalFee: "浮动约 ±25%",
    serviceFee: "浮动约 ±10%",
    insurance: "浮动约 ±10%",
    cityPickupFee: "浮动约 ±50%"
  };

  const detailedItems = include.map((item) => ({
    ...item,
    usage: usageMap[item.key] || "行程必要费用项",
    fluctuation: fluctuationMap[item.key] || "浮动约 ±20%"
  }));
  return {
    include: detailedItems,
    total: round2(common.commonCost + transportCost),
    explain: "以上费用包含固定旅行成本和当前所选交通方式的明细成本，实际会随日期、票量与酒店库存波动。"
  };
}

function buildDetailedTimeBreakdown(selectedPlan) {
  const t = selectedPlan?.details?.time || {};
  const usageMap = {
    onTrainHours: "列车运行与途中停靠",
    stationWaitHours: "进站安检、候车与换乘",
    inAirHours: "飞行在途时长",
    airportProcessHours: "值机、安检与到达取行李",
    intraCityHours: "城市内景点之间通勤",
    sightseeingHours: "景点游玩与活动体验",
    bufferHours: "预留机动时间（拍照/排队/临时停留）",
    driveHours: "自驾路段驾驶时间",
    pickupReturnHours: "租车取还车办理时间"
  };
  const items = Object.entries(t).map(([key, hours]) => ({ key, hours: round2(hours), usage: usageMap[key] || "行程耗时项" }));
  return {
    include: items,
    tight: selectedPlan?.totalHoursTight || 0,
    relaxed: selectedPlan?.totalHoursRelaxed || 0,
    explain: "紧凑时长用于效率优先，宽松时长额外加入拍照、排队与临时停留冗余。"
  };
}

function normalize01(value, min, max, reverse = false) {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return 0.5;
  const ratio = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, ratio));
  return reverse ? 1 - clamped : clamped;
}

function preferenceWeights(preference) {
  const p = String(preference || "balanced");
  if (p === "saveMoney") return { cost: 0.56, time: 0.2, comfort: 0.24, label: "省钱优先" };
  if (p === "saveTime") return { cost: 0.2, time: 0.56, comfort: 0.24, label: "省时优先" };
  if (p === "comfort") return { cost: 0.2, time: 0.22, comfort: 0.58, label: "舒适优先" };
  return { cost: 0.34, time: 0.33, comfort: 0.33, label: "均衡优先" };
}

function rankPlansByPreference(plans, preference) {
  const weights = preferenceWeights(preference);
  const costs = plans.map((x) => x.totalCost);
  const times = plans.map((x) => x.totalHoursTight);
  const comforts = plans.map((x) => Number(x.convenienceScore || 0) * 0.55 + Number(x.freedomScore || 0) * 0.45);

  const costMin = Math.min(...costs);
  const costMax = Math.max(...costs);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const comfortMin = Math.min(...comforts);
  const comfortMax = Math.max(...comforts);

  const ranked = plans
    .map((plan, idx) => {
      const costScore = normalize01(plan.totalCost, costMin, costMax, true);
      const timeScore = normalize01(plan.totalHoursTight, timeMin, timeMax, true);
      const comfortScore = normalize01(comforts[idx], comfortMin, comfortMax, false);
      const score = round2(costScore * weights.cost + timeScore * weights.time + comfortScore * weights.comfort);
      return { ...plan, recommendScore: score, scoreBreakdown: { costScore, timeScore, comfortScore } };
    })
    .sort((a, b) => b.recommendScore - a.recommendScore);

  return {
    preferenceLabel: weights.label,
    ranked
  };
}

function buildHumanReminders(input, selectedPlan, budgetAlerts) {
  const reminders = [];
  const overBudget = budgetAlerts.find((x) => x.mode === selectedPlan.mode && x.overBudget);
  if (overBudget) reminders.push(`当前方案较预算超出 ${overBudget.overBy} 元，可减少收费景点或降低住宿档位。`);
  if (selectedPlan.mode === "rail") reminders.push("高铁方案建议提前 3-7 天锁票，热门时段优先选择可候补车次。");
  if (selectedPlan.mode === "air") reminders.push("飞机方案建议预留机场安检和托运行李时间，避免衔接过紧。");
  if (selectedPlan.mode === "privateCar") reminders.push("自驾方案请关注连续驾驶时长，建议每 2 小时休息一次。");
  if (selectedPlan.mode === "rentalCar") reminders.push("租车方案默认用于城市内多景点中转，不建议作为跨城主交通。");
  if (selectedPlan.mode === "mixed") reminders.push("你选择了多段混合交通，请重点关注跨段衔接与换乘时间。");
  if (Number(input.lastMileHours || 0) > 1) reminders.push("末端接驳耗时偏长，建议优先选择距离地铁/公交站更近的景点组合。");
  reminders.push("系统已为每日行程预留 30 分钟弹性缓冲。");
  return reminders;
}

function planTrip(input) {
  if (!input || !Array.isArray(input.cities) || input.cities.length < 2) {
    throw new Error("cities 至少需要 2 个城市（含出发地与目标地）");
  }
  if (!Number.isFinite(input.days) || input.days <= 0) throw new Error("days 必须大于 0");
  if (!Number.isFinite(input.travelers) || input.travelers <= 0) throw new Error("travelers 必须大于 0");

  const cities = input.cities.map((x) => String(x).trim()).filter(Boolean);
  const departureCity = input.departureCity || cities[0];
  const planningCities =
    Boolean(input.returnToDeparture) && cities[cities.length - 1] !== departureCity ? [...cities, departureCity] : cities;
  const segments = buildSegments(planningCities, input.distanceMatrix || {});
  const common = calcCommonCost(input);

  const plans = [
    calcRailPlan(input, segments, common),
    calcAirPlan(input, segments, common),
    calcPrivateCarPlan(input, segments, common),
    calcRentalCarPlan(input, segments, common)
  ];

  const budgetAlerts = resolveBudgetAlerts(plans, input.budgetLimit);
  const ranking = rankPlansByPreference(plans, input.travelPreference);
  const carSuggestion = shouldSuggestRental(input);
  const hasSegmentModes = Boolean(input.segmentModes && Object.keys(input.segmentModes).length > 0);
  const segmentPlan = hasSegmentModes ? calcSegmentModeSelection(input, segments, common) : null;
  const selectedMode = segmentPlan?.mode || input.selectedMode || ranking.ranked[0]?.mode || plans[0].mode;
  const selectedPlan = segmentPlan || plans.find((x) => x.mode === selectedMode) || plans[0];

  return {
    summary: {
      departureCity,
      cities,
      totalCities: uniq(cities).length,
      days: input.days,
      travelers: input.travelers,
      relation: input.relation || "friends",
      studentMode: Boolean(input.studentMode),
      travelPreference: ranking.preferenceLabel,
      selectedMode,
      segmentModes: input.segmentModes || {},
      selectedTickets: input.selectedTickets || {},
      returnToDeparture: Boolean(input.returnToDeparture)
    },
    costs: common,
    carSuggestion,
    plans,
    topRecommendations: ranking.ranked.slice(0, 3).map((x, idx) => ({
      rank: idx + 1,
      mode: x.mode,
      label: x.label,
      recommendScore: x.recommendScore,
      totalCost: x.totalCost,
      totalHoursTight: x.totalHoursTight
    })),
    budgetAlerts,
    selectedCostBreakdown: buildDetailedCostBreakdown(common, selectedPlan),
    selectedTimeBreakdown: buildDetailedTimeBreakdown(selectedPlan),
    reminders: buildHumanReminders(input, selectedPlan, budgetAlerts),
    dailyPlan: generateDailyPlan(cities, input.days, input.attractionsByCity || {}),
    crossCityConnections: segments.map((s) => ({
      from: s.from,
      to: s.to,
      distanceKm: s.distanceKm,
      publicTransitHint: "自动匹配上一城市结束时间后的最近车次/航班",
      selfDriveHint: "自动规避拥堵并优先引导至景点停车点"
    })),
    returnPlan: {
      ...buildReturnPlan(cities, departureCity),
      includedInEstimate: Boolean(input.returnToDeparture),
      returnSegment:
        Boolean(input.returnToDeparture) && segments.length
          ? {
              from: segments[segments.length - 1].from,
              to: segments[segments.length - 1].to,
              distanceKm: segments[segments.length - 1].distanceKm
            }
          : null
    },
    generatedAt: new Date().toISOString()
  };
}

function applyEmergencyAdaptation(planResult, event) {
  const cloned = JSON.parse(JSON.stringify(planResult));
  const e = event || {};
  const type = e.type || "general";
  let action = "已完成通用行程重排";

  if (type === "spotClosed") {
    action = "检测到景点闭园，已替换同类型景点并重排行程。";
    if (cloned.dailyPlan?.[0]) cloned.dailyPlan[0].highlights[0] = "同类型替代景点";
  } else if (type === "transportDelay") {
    action = "检测到交通晚点，已自动延后衔接并保留 30 分钟缓冲。";
    cloned.crossCityConnections = (cloned.crossCityConnections || []).map((item) => ({
      ...item,
      publicTransitHint: `${item.publicTransitHint}（已做晚点容错）`
    }));
  } else if (type === "roadBlocked") {
    action = "检测到道路封闭，已切换绕行自驾路线并重算耗时。";
    cloned.crossCityConnections = (cloned.crossCityConnections || []).map((item) => ({
      ...item,
      selfDriveHint: "已切换绕行路线并重算驾驶时长"
    }));
  } else if (type === "extremeWeather") {
    action = "检测到极端天气，已优先调整为室内景点与安全交通方案。";
    if (cloned.dailyPlan?.[0]) cloned.dailyPlan[0].highlights[1] = "室内替代方案";
  }

  cloned.emergency = {
    eventType: type,
    detail: e.detail || "",
    action,
    adaptedAt: new Date().toISOString()
  };
  return cloned;
}

module.exports = {
  planTrip,
  applyEmergencyAdaptation
};
