"use strict";

const state = {
  feedItems: [],
  selectedSpot: null,
  destinationCities: [],
  attractionCatalog: {},
  customAttractionsByCity: {},
  selectedAttractions: {},
  transportData: null,
  selectedMainMode: null,
  selectedSegmentModes: {},
  selectedSegmentTickets: {},
  selectedFoods: {},
  foodCatalog: {},
  selectedHotels: {},
  hotelCatalog: {},
  currentPlan: null,
  currentWeather: null,
  weatherError: "",
  shareToken: null,
  currentTag: "\u63a8\u8350",
  feedSearchText: "",
  feedExtraTagsExpanded: false,
  feedFabHidden: false,
  step1Snapshot: "",
  step1Dirty: false,
  segmentDetailModeByKey: {},
  segmentTimeFilterByKey: {},
  smartJudge: {
    dispersedSpots: false,
    publicTransitSparse: false,
    lastMileHours: 0.8,
    reasons: []
  }
};

let deferredInstallPrompt = null;

const routeTitles = {
  "/feed": "发现",
  "/spot": "景点详情",
  "/plan/step-1": "行程规划",
  "/plan/step-2": "交通方式",
  "/plan/step-3": "景点选择",
  "/plan/step-4": "美食与餐饮",
  "/plan/step-5": "预算结果",
  "/history": "历史行程"
};

const COST_LABEL_MAP = {
  attractionCost: "景点门票",
  hotelCost: "住宿",
  mealCost: "基础餐饮",
  railTicket: "高铁票",
  cityTransit: "市内交通",
  flightTicket: "机票",
  airportShuttle: "机场接驳",
  energyCost: "自驾油费/电费",
  toll: "高速费",
  parking: "停车费",
  rentalFee: "租车日租",
  serviceFee: "租车服务费",
  insurance: "租车保险",
  cityPickupFee: "取还车费用",
  fuel: "租车油费",
  foodExtra: "特色餐饮",
  selectedHotelCost: "已选酒店"
};

const TIME_LABEL_MAP = {
  onTrainHours: "高铁在途",
  stationWaitHours: "候车与进站",
  inAirHours: "飞行在途",
  airportProcessHours: "值机安检与落地流程",
  intraCityHours: "市内通勤",
  sightseeingHours: "景点游玩",
  bufferHours: "弹性缓冲",
  driveHours: "驾驶时长",
  pickupReturnHours: "取还车流程"
};

const RELATED_CITY_MAP = {
  杭州: ["苏州", "南京", "黄山"],
  上海: ["杭州", "苏州", "南京"],
  北京: ["天津", "石家庄", "承德"],
  成都: ["重庆", "乐山", "都江堰"],
  青岛: ["烟台", "威海", "济南"],
  大理: ["丽江", "昆明", "香格里拉"],
  哈尔滨: ["长春", "沈阳", "漠河"],
  广州: ["深圳", "珠海", "佛山"],
  西安: ["洛阳", "华山", "郑州"]
};

function $(id) {
  return document.getElementById(id);
}

function getFeedFabEl() {
  return $("feedFloatingPlanBtn") || $("fabPlanBtn");
}

function isStandaloneDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
}

function isAndroidDevice() {
  return /android/i.test(window.navigator.userAgent || "");
}

function showInstallGuide() {
  if (isStandaloneDisplayMode()) {
    window.alert("应用已安装，可从桌面图标直接打开。");
    return;
  }

  let message = "可通过浏览器菜单安装：Chrome/Edge 点击右上角菜单，选择“安装应用”或“添加到主屏幕”。";
  if (isIosDevice()) {
    message = "iPhone/iPad 安装：请用 Safari 打开本页，点击“分享”->“添加到主屏幕”。";
  } else if (isAndroidDevice()) {
    message = "Android 安装：点击浏览器右上角菜单，选择“安装应用”或“添加到主屏幕”。";
  }
  window.alert(message);
}

function updateInstallButtonVisibility() {
  const installBtn = $("installAppBtn");
  if (!installBtn) return;
  installBtn.title = deferredInstallPrompt ? "安装应用" : "查看安装方式";
  installBtn.setAttribute("aria-label", deferredInstallPrompt ? "安装应用" : "查看安装方式");
}

async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    showInstallGuide();
    return;
  }
  deferredInstallPrompt.prompt();
  try {
    await deferredInstallPrompt.userChoice;
  } finally {
    deferredInstallPrompt = null;
    updateInstallButtonVisibility();
  }
}

function escapeHtml(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const CLIENT_CITY_IMAGE_MAP = {
  杭州: "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=1200&q=80",
  青岛: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
  大理: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&w=1200&q=80",
  哈尔滨: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
  北京: "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
  成都: "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?auto=format&fit=crop&w=1200&q=80",
  上海: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
  厦门: "https://images.unsplash.com/photo-1526481280695-3c4698f6638f?auto=format&fit=crop&w=1200&q=80",
  重庆: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
  西安: "https://images.unsplash.com/photo-1547981609-4b6bf67dbf57?auto=format&fit=crop&w=1200&q=80",
  广州: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  深圳: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80",
  昆明: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  长沙: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
};

const CLIENT_SPOT_IMAGE_MAP = {
  西湖: "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=900&q=80",
  灵隐寺: "https://images.unsplash.com/photo-1603491656337-3b4911479179?auto=format&fit=crop&w=900&q=80",
  河坊街: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80",
  法喜寺: "https://images.unsplash.com/photo-1626834086793-27aa3ae59f68?auto=format&fit=crop&w=900&q=80",
  八大关: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80",
  小麦岛: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80",
  栈桥: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  洱海: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&w=900&q=80",
  喜洲古镇: "https://images.unsplash.com/photo-1629978009230-a2f7d6b0f6c1?auto=format&fit=crop&w=900&q=80",
  双廊: "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&w=900&q=80",
  中央大街: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=900&q=80",
  冰雪大世界: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=900&q=80",
  故宫: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=900&q=80",
  颐和园: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80",
  熊猫基地: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=900&q=80",
  宽窄巷子: "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?auto=format&fit=crop&w=900&q=80",
  锦里: "https://images.unsplash.com/photo-1600412384817-8e03beccfd91?auto=format&fit=crop&w=900&q=80"
};

const CLIENT_FOOD_IMAGE_MAP = {
  西湖醋鱼: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=80",
  龙井虾仁: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?auto=format&fit=crop&w=900&q=80",
  片儿川: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=900&q=80",
  乳扇: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  饵块: "https://images.unsplash.com/photo-1512058564366-c9e3e0464b5f?auto=format&fit=crop&w=900&q=80",
  酸辣鱼: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  海鲜锅贴: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  辣炒蛤蜊: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  青岛啤酒套餐: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80",
  红肠拼盘: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  锅包肉: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  马迭尔冰棍: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
  北京烤鸭: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&w=900&q=80",
  炸酱面: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80",
  卤煮: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  成都火锅: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&w=900&q=80",
  担担面: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80",
  甜水面: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=900&q=80"
};

function resolveClientCityImage(city) {
  const key = normalizeRegionText(city || "");
  const hit = Object.entries(CLIENT_CITY_IMAGE_MAP).find(([k]) => normalizeRegionText(k) === key);
  return hit?.[1] || "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80";
}

function resolveClientSpotImage(name, city, kind = "spot") {
  const text = String(name || "");
  const map = kind === "food" ? CLIENT_FOOD_IMAGE_MAP : CLIENT_SPOT_IMAGE_MAP;
  const hit = Object.entries(map).find(([k]) => text.includes(k));
  return hit?.[1] || resolveClientCityImage(city);
}

function normalizeExternalUrl(rawUrl) {
  const raw = String(rawUrl || "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw, location.origin);
    if (!/^https?:$/u.test(u.protocol)) return "";
    if (/xiaohongshu\.com$/iu.test(u.hostname) || /\.xiaohongshu\.com$/iu.test(u.hostname)) {
      const keyword = u.searchParams.get("keyword") || u.searchParams.get("q") || "";
      return keyword ? `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}` : "https://www.xiaohongshu.com/";
    }
    return u.toString();
  } catch (_err) {
    return "";
  }
}

function renderExternalAnchor(url, label) {
  const safeUrl = normalizeExternalUrl(url);
  if (!safeUrl) return "";
  const isXhs = /xiaohongshu\.com/iu.test(safeUrl);
  const target = isXhs ? "_self" : "_blank";
  const rel = isXhs ? "" : ' rel="noopener"';
  return `<a href="${escapeHtml(safeUrl)}" target="${target}"${rel}>${escapeHtml(label)}</a>`;
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "请求失败");
  return data;
}

function normalizeRegionText(input) {
  return String(input || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/(省|市|自治区|特别行政区|地区|州)$/u, "");
}

function isProvinceLike(input) {
  return /(省|自治区|特别行政区)$/u.test(String(input || "").trim());
}

function uniq(arr) {
  return [...new Set(arr)];
}

function estimateDistanceByName(from, to) {
  const a = normalizeRegionText(from);
  const b = normalizeRegionText(to);
  if (!a || !b) return 300;
  const base = 200 + Math.abs(a.charCodeAt(0) - b.charCodeAt(0)) * 7;
  const provincePenalty = isProvinceLike(from) || isProvinceLike(to) ? 260 : 0;
  return Math.max(120, Math.min(1800, base + provincePenalty));
}

function modeLabel(mode) {
  const map = {
    rail: "高铁公共交通",
    air: "飞机优先",
    privateCar: "自有车自驾",
    rentalCar: "城市内租车中转",
    mixed: "多段混合交通"
  };
  return map[mode] || mode;
}

function parseRoute(pathname) {
  if (pathname === "/" || pathname === "/feed") return { key: "/feed" };
  if (pathname.startsWith("/spot/")) return { key: "/spot", spotId: decodeURIComponent(pathname.slice(6)) };
  if (pathname.startsWith("/plan/step-")) return { key: pathname };
  if (pathname === "/history") return { key: "/history" };
  if (pathname.startsWith("/share/")) return { key: "/plan/step-5", shareToken: pathname.slice(7) };
  return { key: "/feed" };
}

function viewIdByRoute(routeKey) {
  if (routeKey === "/feed") return "route-feed";
  if (routeKey === "/spot") return "route-spot";
  if (routeKey === "/plan/step-1") return "route-plan-step-1";
  if (routeKey === "/plan/step-2") return "route-plan-step-2";
  if (routeKey === "/plan/step-3") return "route-plan-step-3";
  if (routeKey === "/plan/step-4") return "route-plan-step-4";
  if (routeKey === "/plan/step-5") return "route-plan-step-5";
  if (routeKey === "/history") return "route-history";
  return "route-feed";
}

function pathForRoute(routeKey, payload = {}) {
  if (routeKey === "/spot" && payload.spotId) return `/spot/${encodeURIComponent(payload.spotId)}`;
  return routeKey;
}

function setHeader(routeKey) {
  $("headerTitle").textContent = routeTitles[routeKey] || "发现";
  $("headerBackBtn").classList.toggle("hidden", routeKey === "/feed");
  $("installAppBtn")?.classList.toggle("hidden", routeKey !== "/feed");
  const step3Fab = $("step3FloatingNextBtn");
  if (step3Fab) step3Fab.classList.toggle("hidden", routeKey !== "/plan/step-3");
  hideFeedFabOnDemand(routeKey !== "/feed");
  updateInstallButtonVisibility();
}

function setTab(routeKey) {
  let current = "/feed";
  if (routeKey.startsWith("/plan/")) current = "/plan/step-1";
  if (routeKey === "/history") current = "/history";
  document.querySelectorAll(".tab-item").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === current);
  });
}

function normalizeRouteViewLayers(routeKey = parseRoute(location.pathname).key) {
  const activeId = viewIdByRoute(routeKey);
  document.querySelectorAll(".route-view").forEach((view) => {
    const shouldActive = view.id === activeId;
    view.classList.toggle("active", shouldActive);
    if (!shouldActive) view.classList.remove("leaving-left", "leaving-right");
  });
}

function switchView(routeKey, direction = "forward") {
  const nextId = viewIdByRoute(routeKey);
  const current = document.querySelector(".route-view.active");
  const next = $(nextId);
  if (!next || current === next) {
    normalizeRouteViewLayers(routeKey);
    setHeader(routeKey);
    setTab(routeKey);
    return;
  }

  if (current) {
    current.classList.remove("active", "leaving-left", "leaving-right");
    current.classList.add(direction === "back" ? "leaving-right" : "leaving-left");
    setTimeout(() => current.classList.remove("leaving-left", "leaving-right"), 230);
  }

  next.classList.remove("leaving-left", "leaving-right");
  next.classList.add("active");
  setHeader(routeKey);
  setTab(routeKey);
}

async function goto(routeKey, options = {}) {
  if (shouldConfirmLeaveStep1(routeKey)) {
    const ok = window.confirm("你在步骤一有未保存的填写内容，离开后可能丢失。确定继续离开吗？");
    if (!ok) return;
    state.step1Dirty = false;
  }
  const path = pathForRoute(routeKey, options.payload || {});
  if (options.push !== false) history.pushState({ routeKey, payload: options.payload || {} }, "", path);
  switchView(routeKey, options.direction || "forward");
  await onRouteEnter(routeKey, options.payload || {});
}

async function handlePopState() {
  const parsed = parseRoute(location.pathname);
  if (shouldConfirmLeaveStep1(parsed.key)) {
    const ok = window.confirm("你在步骤一有未保存的填写内容，离开后可能丢失。确定继续离开吗？");
    if (!ok) {
      history.pushState({ routeKey: "/plan/step-1" }, "", "/plan/step-1");
      return;
    }
    state.step1Dirty = false;
  }
  switchView(parsed.key, "back");
  await onRouteEnter(parsed.key, parsed);
}

function ensureStartDateDefault() {
  if ($("startDate").value) return;
  const now = new Date();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  $("startDate").value = `${now.getFullYear()}-${m}-${d}`;
}

const CITY_SUGGESTIONS = [
  "北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "成都", "重庆", "武汉", "西安", "天津",
  "长沙", "青岛", "大连", "厦门", "福州", "宁波", "无锡", "合肥", "郑州", "济南", "南昌", "昆明",
  "贵阳", "南宁", "海口", "三亚", "哈尔滨", "长春", "沈阳", "太原", "石家庄", "呼和浩特", "兰州", "西宁",
  "乌鲁木齐", "拉萨", "银川", "洛阳", "开封", "泉州", "汕头", "珠海", "佛山", "东莞", "惠州", "中山",
  "嘉兴", "湖州", "绍兴", "金华", "台州", "温州", "徐州", "扬州", "南通", "盐城", "连云港", "常州",
  "镇江", "泰州", "芜湖", "安庆", "黄山", "九江", "赣州", "上饶", "宜春", "吉安", "景德镇", "襄阳",
  "宜昌", "荆州", "十堰", "黄石", "桂林", "柳州", "北海", "湛江", "肇庆", "清远", "揭阳", "潮州",
  "梅州", "茂名", "阳江", "自贡", "绵阳", "乐山", "宜宾", "泸州", "南充", "达州", "攀枝花", "遵义",
  "毕节", "六盘水", "丽江", "大理", "曲靖", "保山", "玉溪", "临沂", "潍坊", "烟台", "威海", "济宁",
  "泰安", "德州", "聊城", "滨州", "菏泽", "唐山", "保定", "秦皇岛", "承德", "廊坊", "邯郸", "衡水",
  "晋中", "大同", "临汾", "运城", "包头", "鄂尔多斯", "赤峰", "通辽", "锦州", "丹东", "鞍山", "营口",
  "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省",
  "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省",
  "甘肃省", "青海省", "台湾省", "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区"
];

const HOT_DESTINATION_CITIES = ["杭州", "苏州", "青岛", "厦门", "成都", "重庆", "大理", "三亚", "哈尔滨", "西安"];

function formatDateISO(dateObj) {
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${dateObj.getFullYear()}-${m}-${d}`;
}

function addDaysISO(startDate, days) {
  if (!startDate || !Number.isFinite(days)) return "";
  const d = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + Math.max(0, Math.floor(days) - 1));
  return formatDateISO(d);
}

function diffDaysInclusive(startDate, endDate) {
  if (!startDate || !endDate) return NaN;
  const s = new Date(`${startDate}T00:00:00`);
  const e = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return NaN;
  return Math.floor((e.getTime() - s.getTime()) / 86400000) + 1;
}

function renderCityDataList() {
  const box = $("cityDataList");
  if (!box) return;
  box.innerHTML = CITY_SUGGESTIONS.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("");
}

function renderHotCityBars() {
  const destBox = $("hotDestinationCityBar");
  if (destBox) {
    destBox.innerHTML = HOT_DESTINATION_CITIES.map((c) => {
      const exists = state.destinationCities.some((x) => normalizeRegionText(x) === normalizeRegionText(c));
      return `<button class="suggest-chip" type="button" data-hot-destination="${escapeHtml(c)}" ${exists ? "disabled" : ""}>${escapeHtml(c)}</button>`;
    }).join("");
  }
}

function renderCityInputSuggestList(keyword = "") {
  const box = $("cityInputSuggestList");
  if (!box) return;
  const q = String(keyword || "").trim().toLowerCase();
  if (!q) {
    box.innerHTML = "";
    return;
  }
  const suggest = CITY_SUGGESTIONS.filter((c) => c.toLowerCase().includes(q)).slice(0, 10);
  box.innerHTML = suggest.length
    ? suggest.map((c) => `<button class="suggest-chip" type="button" data-city-suggest="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("")
    : `<span class="muted">未找到匹配城市，仍可手动输入省份或城市名称</span>`;
}

function syncStep1Dates(source = "days") {
  const startDate = $("startDate")?.value || "";
  const endInput = $("endDate");
  const daysInput = $("days");
  const hint = $("dateValidationHint");
  if (!endInput || !daysInput || !hint) return;

  const days = Number(daysInput.value) || 1;
  if (source === "days") {
    const endDate = addDaysISO(startDate, days);
    if (endDate) endInput.value = endDate;
  } else if (source === "end") {
    const span = diffDaysInclusive(startDate, endInput.value);
    if (Number.isFinite(span) && span > 0) daysInput.value = String(span);
  }

  const finalSpan = diffDaysInclusive(startDate, endInput.value);
  const finalDays = Number(daysInput.value) || 1;
  if (Number.isFinite(finalSpan) && finalSpan !== finalDays) {
    hint.textContent = `当前日期跨度 ${finalSpan} 天，与总天数 ${finalDays} 天不一致，已自动校正。`;
    hint.style.color = "#cb3740";
    if (source !== "days") daysInput.value = String(Math.max(1, finalSpan));
    else endInput.value = addDaysISO(startDate, finalDays);
  } else {
    hint.textContent = `行程将于 ${endInput.value || "-"} 结束，共 ${finalDays} 天。`;
    hint.style.color = "";
  }
}

function step1FormSnapshot() {
  const keys = [
    "departureCity",
    "startDate",
    "endDate",
    "preferredDepartureTime",
    "days",
    "travelers",
    "budgetLimit",
    "relation",
    "studentMode",
    "returnToDeparture",
    "travelPreference"
  ];
  const payload = {};
  for (const k of keys) {
    const el = $(k);
    if (!el) continue;
    payload[k] = el instanceof HTMLInputElement && el.type === "checkbox" ? el.checked : el.value;
  }
  payload.destinations = [...state.destinationCities];
  return JSON.stringify(payload);
}

function markStep1DirtyIfNeeded() {
  const snap = step1FormSnapshot();
  state.step1Dirty = Boolean(state.step1Snapshot && state.step1Snapshot !== snap);
}

function markStep1Saved() {
  state.step1Snapshot = step1FormSnapshot();
  state.step1Dirty = false;
}

function isStep1Active() {
  return document.querySelector(".route-view.active")?.id === "route-plan-step-1";
}

function shouldConfirmLeaveStep1(nextRouteKey) {
  if (!isStep1Active()) return false;
  if (nextRouteKey === "/plan/step-1") return false;
  markStep1DirtyIfNeeded();
  return state.step1Dirty;
}

function ensureStep1AssistUI() {
  renderCityDataList();
  renderHotCityBars();
  syncStep1Dates("days");
  markStep1Saved();
}

function setLocationHint(message, isError = false) {
  const hint = $("locationHint");
  if (!hint) return;
  hint.textContent = message || "";
  hint.style.color = isError ? "#cb3740" : "";
}

function canonicalCityInput(raw) {
  const txt = String(raw || "").trim();
  if (!txt) return "";
  if (txt.includes("省") && !txt.includes("市")) return txt;
  if (txt.endsWith("市")) return txt;
  if (txt.endsWith("省")) return txt;
  return txt;
}

function addDestinationCity(raw) {
  const city = canonicalCityInput(raw);
  if (!city) return false;
  const key = normalizeRegionText(city);
  const exists = state.destinationCities.some((x) => normalizeRegionText(x) === key);
  if (exists) return false;
  state.destinationCities.push(city);
  return true;
}

function removeDestinationCity(city) {
  const key = normalizeRegionText(city);
  state.destinationCities = state.destinationCities.filter((x) => normalizeRegionText(x) !== key);
}

function flushPendingDestinationInput() {
  const input = $("destCityInput");
  if (!input) return false;
  const value = input.value.trim();
  if (!value) return false;
  const added = addDestinationCity(value);
  input.value = "";
  renderDestinationList();
  renderRelatedCitySuggestions();
  return added;
}

function parseCitiesFromInputs() {
  const departure = $("departureCity").value.trim();
  const fromSpot = state.selectedSpot?.city ? [state.selectedSpot.city] : [];
  const merged = state.destinationCities.length ? state.destinationCities : fromSpot;
  return { departure, destinations: uniq(merged) };
}

function validateStep1BeforeTransport() {
  const { departure, destinations } = parseCitiesFromInputs();
  if (!departure) return "请先填写出发地。";
  if (!destinations.length) return "请至少添加 1 个目标城市。";
  const depNorm = normalizeRegionText(departure);
  const hasDiffDestination = destinations.some((city) => normalizeRegionText(city) !== depNorm);
  if (!hasDiffDestination) return "目标城市不能与出发地完全相同，请添加其他城市。";
  return "";
}

function buildRouteCities() {
  const { departure, destinations } = parseCitiesFromInputs();
  const depNorm = normalizeRegionText(departure);
  return [departure, ...destinations].filter((city, idx) => {
    if (!city) return false;
    if (idx === 0) return true;
    return normalizeRegionText(city) !== depNorm;
  });
}

function buildDistanceMatrix(cities) {
  const matrix = {};
  for (let i = 0; i < cities.length - 1; i += 1) {
    matrix[`${cities[i]}-${cities[i + 1]}`] = estimateDistanceByName(cities[i], cities[i + 1]);
  }
  return matrix;
}

function selectedAttractionCounts() {
  const out = {};
  for (const [city, names] of Object.entries(state.selectedAttractions)) out[city] = names.size;
  return out;
}

function selectedFoodCost() {
  const travelers = Number($("travelers").value) || 1;
  let total = 0;
  for (const [city, names] of Object.entries(state.selectedFoods)) {
    const catalog = state.foodCatalog[city] || [];
    for (const name of names) {
      const row = catalog.find((x) => x.name === name);
      if (row) total += row.price * travelers;
    }
  }
  return total;
}

function selectedHotelCost() {
  const days = Number($("days").value) || 1;
  return Object.values(state.selectedHotels).reduce((acc, h) => acc + h.price * days, 0);
}

function computeSmartJudge(cities, distanceMatrix, _selectedAttractions) {
  const destinationCities = cities.slice(1);
  const maxDistance = Math.max(0, ...Object.values(distanceMatrix));
  const longHops = Object.values(distanceMatrix).filter((d) => d > 650).length;

  const dispersedSpots = maxDistance > 700 || destinationCities.length >= 3;
  const publicTransitSparse =
    longHops >= 1 ||
    destinationCities.some((c) => isProvinceLike(c)) ||
    (dispersedSpots && destinationCities.length >= 2);
  const lastMileHours = dispersedSpots ? 1.3 : publicTransitSparse ? 1.1 : 0.7;

  const reasons = [];
  if (dispersedSpots) reasons.push("跨城段较多或距离较远，城市内外接驳成本会升高");
  if (publicTransitSparse) reasons.push("跨城或末端接驳较长，公共交通班次可能不够灵活");
  if (lastMileHours > 1) reasons.push("末端接驳预计超过 1 小时");
  return { dispersedSpots, publicTransitSparse, lastMileHours, reasons };
}

function readPayload() {
  const cities = buildRouteCities();
  const distanceMatrix = buildDistanceMatrix(cities);
  if ($("returnToDeparture")?.checked && cities.length > 1) {
    const from = cities[cities.length - 1];
    const to = cities[0];
    distanceMatrix[`${from}-${to}`] = estimateDistanceByName(from, to);
  }
  state.smartJudge = computeSmartJudge(cities, distanceMatrix, state.selectedAttractions);

  return {
    departureCity: cities[0],
    cities,
    days: Number($("days").value),
    travelers: Number($("travelers").value),
    relation: $("relation").value,
    budgetLimit: Number($("budgetLimit").value),
    startDate: $("startDate").value,
    preferredDepartureTime: $("preferredDepartureTime").value,
    travelPreference: $("travelPreference")?.value || "balanced",
    studentMode: $("studentMode").checked,
    returnToDeparture: $("returnToDeparture")?.checked !== false,
    dispersedSpots: state.smartJudge.dispersedSpots,
    publicTransitSparse: state.smartJudge.publicTransitSparse,
    selectedMode: state.selectedMainMode || "rail",
    segmentModes: state.selectedSegmentModes,
    selectedTickets: state.selectedSegmentTickets,
    rentalCrossCity: false,
    lastMileHours: state.smartJudge.lastMileHours,
    carEnergy: "fuel",
    energyPerKm: 0.075,
    attractionsByCity: selectedAttractionCounts(),
    distanceMatrix,
    foodExtra: selectedFoodCost(),
    selectedHotelCost: selectedHotelCost()
  };
}

function renderSmartJudgeInfo() {
  return;
}

function filterFeedBySearch(items, keyword) {
  const q = String(keyword || "").trim().toLowerCase();
  if (!q) return items || [];
  return (items || []).filter((x) => {
    const text = [x.title, x.subtitle, x.city, ...(x.tags || [])].join(" ").toLowerCase();
    return text.includes(q);
  });
}

function applyFeedFilters() {
  const filtered = filterFeedBySearch(state.feedItems, state.feedSearchText);
  renderFeed(filtered);
}

function updateTagMoreUI() {
  const btn = $("toggleMoreTagsBtn");
  if (!btn) return;
  btn.textContent = state.feedExtraTagsExpanded ? "\u6536\u8d77" : "\u66f4\u591a";
  btn.setAttribute("aria-expanded", String(state.feedExtraTagsExpanded));
  btn.classList.toggle("active", false);
  document.querySelectorAll("#tagFilterBar .chip-extra").forEach((el) => {
    el.classList.toggle("visible", state.feedExtraTagsExpanded);
  });
}

function hideFeedFabOnDemand(hidden) {
  const fab = getFeedFabEl();
  if (!fab) return;
  const isFeedActive = document.querySelector("#route-feed.active");
  state.feedFabHidden = isFeedActive ? false : Boolean(hidden);
  fab.classList.toggle("fab-hidden", state.feedFabHidden);
}

function installFeedImageFallback() {
  const grid = $("feedGrid");
  if (!grid || grid.dataset.fallbackBound === "1") return;
  grid.dataset.fallbackBound = "1";
  grid.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.dataset.fallbackApplied === "1") return;
      img.dataset.fallbackApplied = "1";
      img.src = img.dataset.fallbackImg || "/assets/feeds/fallback.svg";
    },
    true
  );
}

function maybeShowOnboarding() {
  const layer = $("onboardingLayer");
  if (!layer) return;
  const shown = localStorage.getItem("tripflow-onboarding-v1") === "1";
  layer.classList.toggle("hidden", shown);
}

function renderFeed(items) {
  const list = Array.isArray(items) ? items : [];
  $("feedGrid").innerHTML = list
    .map(
      (x) => `
      <article class="card feed-card" data-spot-id="${x.id}">
        <img class="cover" src="${escapeHtml(x.image)}" alt="${escapeHtml(x.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fallback-img="/assets/feeds/fallback.svg" />
        <h3>${escapeHtml(x.title)}</h3>
        <p>${escapeHtml(x.subtitle)}</p>
        <p>${escapeHtml(x.city)} \u00b7 \u8bc4\u5206 ${x.score}</p>
        <p>${escapeHtml(x.budgetHint)}</p>
        ${(x.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </article>
    `
    )
    .join("");
}

async function loadFeed() {
  const season = $("seasonSelect").value;
  const kind = $("kindSelect").value;
  const activeTag = document.querySelector("#tagFilterBar .chip.active[data-tag]")?.dataset.tag;
  const tag = activeTag || state.currentTag;
  state.currentTag = tag;
  const data = await api('/api/feed?season=' + encodeURIComponent(season) + '&kind=' + encodeURIComponent(kind) + '&tag=' + encodeURIComponent(tag));
  state.feedItems = data.items || [];
  applyFeedFilters();
}

function renderSpot(detail) {
  $("spotHero").innerHTML = `
    <img class="hero-cover" src="${escapeHtml(detail.image)}" alt="${escapeHtml(detail.title)}" />
    <h3>${escapeHtml(detail.title)}</h3>
    <p class="muted">${escapeHtml(detail.description || "")}</p>
    <p>开放时间：${escapeHtml(detail.openTime || "-")} ｜ 门票：${escapeHtml(detail.ticket || "-")}</p>
    <p>建议游玩：${detail.bestDurationHours || "-"}h ｜ 预算参考：${escapeHtml(detail.budgetHint || "-")}</p>
    <p>交通：${escapeHtml(detail.cityTraffic || "-")} ｜ 停车：${escapeHtml(detail.parking || "-")}</p>
    <p class="muted">热门点位：${(detail.highlights || []).map(escapeHtml).join("、")}</p>
  `;
}

function renderSpotCost(detail) {
  const list = detail.activityCosts || [];
  $("spotCostDetails").innerHTML = `
    <h3>费用明细（活动用途）</h3>
    ${list.length
      ? list
          .map(
            (x) => `
        <div class="cost-line">
          <span>${escapeHtml(x.name)}</span>
          <strong>${escapeHtml(x.amount)}</strong>
        </div>
      `
          )
          .join("")
      : '<p class="empty-state">暂无细项，系统将按实际选择自动拆分预算。</p>'}
    <p class="cost-extra">说明：活动费用受日期、票量、排队时长和淡旺季影响，建议预留 10%-20% 弹性预算。</p>
  `;
}

function renderSpotVideos(detail) {
  const preferredKeyword = detail.title || detail.city || "\u666f\u70b9";
  const fallbackVideos = [
    {
      platform: "\u6296\u97f3",
      title: `${preferredKeyword}\u5b9e\u62cd`,
      url: `https://www.douyin.com/search/${encodeURIComponent(preferredKeyword)}`
    },
    {
      platform: "\u5c0f\u7ea2\u4e66",
      title: `${preferredKeyword}\u653b\u7565`,
      url: `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(preferredKeyword)}`
    }
  ];
  const sourceVideos = Array.isArray(detail.videos) ? detail.videos : [];
  const validVideos = sourceVideos.filter((v) => v && v.url && v.platform);
  const videos = validVideos.length ? validVideos : fallbackVideos;
  $("spotVideos").innerHTML = `
    <h3>\u77ed\u89c6\u9891\u53c2\u8003</h3>
    ${
      videos.length
        ? `<div class="inline-links">${videos
            .map((v) => renderExternalAnchor(v.url, `${v.platform} - ${v.title}`))
            .join("")}</div>`
        : '<p class="empty-state">\u6682\u65e0\u89c6\u9891\u94fe\u63a5\u3002</p>'
    }
  `;
}

function prefillBasicFromSpot(detail) {
  const route = detail.defaultRoute || [detail.city, detail.city];
  $("departureCity").value = route[0] || "";
  state.destinationCities = route.slice(1);
  $("days").value = Math.max(2, route.length);
  ensureStartDateDefault();
  renderDestinationList();
  renderRelatedCitySuggestions();
}

async function loadSpot(spotId) {
  const detail = await api(`/api/spot-detail?id=${encodeURIComponent(spotId)}`);
  state.selectedSpot = detail;
  renderSpot(detail);
  renderSpotCost(detail);
  renderSpotVideos(detail);
  prefillBasicFromSpot(detail);
}

function segKey(seg) {
  return `${seg.from}-${seg.to}`;
}

function ensureSegmentDefaults() {
  const segments = state.transportData?.segmentOptions || [];
  if (!segments.length) return;
  const fallback = state.transportData.topRecommendations?.[0]?.mode || state.transportData.recommendedMainMode || "rail";
  for (const seg of segments) {
    const key = segKey(seg);
    if (!state.selectedSegmentModes[key]) state.selectedSegmentModes[key] = fallback;
    if (!state.segmentTimeFilterByKey[key]) state.segmentTimeFilterByKey[key] = "all";
  }
  const modes = Object.values(state.selectedSegmentModes);
  state.selectedMainMode = modes.includes("air") ? "air" : modes[0] || fallback;
}

function segmentReason(seg, mode) {
  if (mode === "rail") return seg.distanceKm > 900 ? "距离较远，高铁稳定但耗时偏长" : "距离适中，准点与成本平衡";
  if (mode === "air") return seg.distanceKm > 700 ? "长距离段，飞机可显著节省时间" : "短距离段机场流程占比高，不一定更快";
  if (mode === "privateCar") return "自由度高，适合携带行李与灵活停留";
  return "建议用于目标城市内多景点中转，不作跨城主方案";
}

function segmentRecommendedMode(seg) {
  if (seg.distanceKm > 780) return "air";
  return "rail";
}

function getTimeBucketFromHHmm(hhmm) {
  const [h] = String(hhmm || "00:00")
    .split(":")
    .map((x) => Number(x));
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function filterSegmentRowsByTime(rows, bucket) {
  if (!Array.isArray(rows)) return [];
  if (!bucket || bucket === "all") return rows;
  return rows.filter((row) => getTimeBucketFromHHmm(row.depart) === bucket);
}

function segmentDetailHTML(seg, key, mode) {
  if (!mode) return "";

  if (mode === "rentalCar") {
    return '<article class="card"><p class="muted">租车用于目标城市内多个景点中转效率更高，不建议作为跨城主交通。</p></article>';
  }

  if (mode === "privateCar") {
    const toll = seg.driveEstimate?.toll ?? Math.round(seg.distanceKm * 0.45);
    const fuel = seg.driveEstimate?.fuel ?? Math.round(seg.distanceKm * 0.08 * 8.2);
    const parking = seg.driveEstimate?.parking ?? 45;
    const durationHours = seg.liveRoad?.durationHours ?? seg.driveEstimate?.durationHours ?? Math.round((seg.distanceKm / 78) * 10) / 10;
    const distanceText = seg.liveRoad?.distanceKm ? `${seg.liveRoad.distanceKm}km（实时路网）` : `${seg.distanceKm}km（估算）`;
    return `
      <article class="card">
        <h3>${escapeHtml(seg.from)} → ${escapeHtml(seg.to)} · 自驾详情</h3>
        <p class="muted">里程 ${distanceText} ｜ 预估驾驶 ${durationHours} 小时，建议每 2 小时休息。</p>
        <p>高速费约 ${toll} 元 ｜ 油/电费约 ${fuel} 元 ｜ 停车约 ${parking} 元</p>
      </article>
    `;
  }

  const rows = mode === "air" ? seg.air.flights : seg.rail.tickets;
  const timeFilter = state.segmentTimeFilterByKey[key] || "all";
  const filteredRows = filterSegmentRowsByTime(rows, timeFilter);
  const scenic = seg.rail?.scenic;
  return `
    <article class="card">
      <h3>${escapeHtml(seg.from)} → ${escapeHtml(seg.to)} ｜ ${mode === "air" ? "航班" : "高铁"}可选时段</h3>
      ${mode === "rail" ? `<p class="muted">观景建议：${escapeHtml(scenic.bestCarriage)} / ${escapeHtml(scenic.bestSeat)} / ${escapeHtml(scenic.bestTime)}</p>` : ""}
      <div class="row wrap">
        <button class="btn ghost ${timeFilter === "all" ? "selected" : ""}" data-time-filter="${escapeHtml(key)}" data-time-bucket="all">全部</button>
        <button class="btn ghost ${timeFilter === "morning" ? "selected" : ""}" data-time-filter="${escapeHtml(key)}" data-time-bucket="morning">上午</button>
        <button class="btn ghost ${timeFilter === "afternoon" ? "selected" : ""}" data-time-filter="${escapeHtml(key)}" data-time-bucket="afternoon">下午</button>
        <button class="btn ghost ${timeFilter === "evening" ? "selected" : ""}" data-time-filter="${escapeHtml(key)}" data-time-bucket="evening">晚上</button>
      </div>
      ${(filteredRows || [])
        .map((r) => {
          const no = r.no;
          const checked = state.selectedSegmentTickets[key] === no ? "checked" : "";
          const extra = mode === "air" ? ` ｜ 行李 ${escapeHtml(r.baggage)}` : "";
          const remainText = r.remain > 0 ? `${r.remain}` : "无";
          const breakdown =
            mode === "air"
              ? `票价构成：基础票价 ${r.priceBreakdown?.baseFare || "-"} + 机建税 ${r.priceBreakdown?.airportTax || "-"} + 燃油 ${r.priceBreakdown?.fuelSurcharge || "-"}`
              : `票价构成：基础票价 ${r.priceBreakdown?.baseFare || "-"} + 服务费 ${r.priceBreakdown?.seatServiceFee || "-"} + 浮动 ${r.priceBreakdown?.dynamicAdjust || "-"}`;
          return `<label class="ticket-choice"><input type="radio" name="ticket-${escapeHtml(key)}" data-ticket-key="${escapeHtml(
            key
          )}" data-ticket-no="${escapeHtml(no)}" ${checked} />${escapeHtml(no)} ${escapeHtml(r.depart)}-${escapeHtml(r.arrive)} ｜ ${r.durationHours}h ｜ ${
            r.price
          }元${extra} ｜ 余量 ${remainText}<span class="muted">（${breakdown}）</span></label>`;
        })
        .join("")}
      ${filteredRows.length ? "" : '<p class="empty-state">该时段暂无可选班次，可切换时段查看。</p>'}
    </article>
  `;
}

function renderModeDetails(mode) {
  const info = (state.transportData?.modeSummary || []).find((x) => x.mode === mode);
  if (!info) return;
  const routeCities = state.transportData?.routeCities || [];
  const departure = routeCities[0] || "";
  const destinations = routeCities.slice(1);
  const routeLabel = destinations.length
    ? `${escapeHtml(departure)} → ${destinations.map((x) => escapeHtml(x)).join(" → ")}`
    : escapeHtml(departure);
  const top = state.transportData?.topRecommendations || [];
  const liveRoad = state.transportData?.liveRoadSummary;
  $("recommendedModeCard").innerHTML = `
    <article class="card">
      <h3>系统推荐主交通：${escapeHtml(info.label)}</h3>
      <p class="muted">路线依据：${routeLabel}</p>
      <p class="muted">${escapeHtml(state.transportData.recommendedReason || "")}</p>
      <p class="muted">推荐维度：${escapeHtml(state.transportData.preferenceLabel || "均衡优先")}</p>
      <p>预计人均成本：${info.costPerPerson} 元</p>
      <p>预计总通勤：${info.etaHours} 小时</p>
      <p class="muted">推荐理由：${escapeHtml(info.recommendReason || "")}</p>
      <p class="muted">优点：${(info.pros || []).map(escapeHtml).join("、")}</p>
      <p class="muted">缺点：${(info.cons || []).map(escapeHtml).join("、")}</p>
      <p class="muted">不推荐场景：${escapeHtml(info.noRecommendWhen || "")}</p>
      ${
        top.length
          ? `<div class="inline-links">${top
              .map((x) => `<span class="tag">TOP${x.rank} ${escapeHtml(modeLabel(x.mode))} · ${x.score}</span>`)
              .join("")}</div>`
          : ""
      }
      ${
        liveRoad
          ? `<p class="muted">路网数据：${liveRoad.used ? "已接入实时路网" : "当前为估算"} ｜ 段数 ${liveRoad.segmentsWithLiveRoad}/${liveRoad.totalSegments}</p>`
          : ""
      }
    </article>
  `;
}

function renderSegmentSelectionSummary() {
  const box = $("segmentSelectionSummary");
  if (!box) return;
  const segments = state.transportData?.segmentOptions || [];
  if (!segments.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `
    <article class="card">
      <h3>分段选择总览</h3>
      ${segments
        .map((seg, index) => {
          const key = segKey(seg);
          const chosen = state.selectedSegmentModes[key] || "未选择";
          const ticketNo = state.selectedSegmentTickets[key] ? ` ｜ 班次 ${state.selectedSegmentTickets[key]}` : "";
          const returnTag = seg.isReturn ? "（返程）" : "";
          return `<p>第 ${index + 1} 段 ${escapeHtml(seg.from)} → ${escapeHtml(seg.to)}${returnTag}：<strong>${escapeHtml(
            modeLabel(chosen)
          )}</strong>${ticketNo}</p>`;
        })
        .join("")}
    </article>
  `;
}

function renderSegmentTransport() {
  const segments = state.transportData?.segmentOptions || [];
  $("segmentTransportList").innerHTML = segments
    .map((seg, index) => {
      const key = segKey(seg);
      const selected = state.selectedSegmentModes[key] || "rail";
      const recommendedMode = segmentRecommendedMode(seg);
      const detailMode = state.segmentDetailModeByKey[key] || selected;
      const cards = [
        {
          mode: "rail",
          label: "高铁",
          price: seg.rail.tickets?.[0]?.price || 0,
          time: `${seg.rail.tickets?.[0]?.durationHours || "-"}h`,
          feature: "准点率高，可看沿线景观"
        },
        {
          mode: "air",
          label: "飞机",
          price: seg.air.flights?.[0]?.price || 0,
          time: `${seg.air.flights?.[0]?.durationHours || "-"}h`,
          feature: "跨城更省时间，适合长距离"
        },
        {
          mode: "privateCar",
          label: "自驾",
          price: seg.driveEstimate?.perPersonCost || Math.round(seg.distanceKm * 1.3),
          time: `${seg.liveRoad?.durationHours || seg.driveEstimate?.durationHours || (seg.distanceKm / 78).toFixed(1)}h`,
          feature: "自由度高，行李友好"
        },
        {
          mode: "rentalCar",
          label: "租车中转",
          price: Math.round(seg.distanceKm * 1.6),
          time: `${(seg.distanceKm / 72).toFixed(1)}h`,
          feature: "仅建议目标城市内中转"
        }
      ];
      return `
        <article class="card">
          <h3>第 ${index + 1} 段：${escapeHtml(seg.from)} → ${escapeHtml(seg.to)} ${
        seg.isReturn ? '<span class="segment-recommend-badge">返程段</span>' : ""
      } <span class="segment-recommend-badge">推荐：${recommendedMode === "air" ? "飞机" : "高铁"}</span> <span class="segment-recommend-badge">已选：${escapeHtml(
        modeLabel(selected)
      )}</span></h3>
          <p class="muted">距离约 ${seg.distanceKm}km${seg.liveRoad?.distanceKm ? `（路网 ${seg.liveRoad.distanceKm}km）` : ""} ｜ ${escapeHtml(
        segmentReason(seg, recommendedMode)
      )}</p>
          <div class="mode-summary-grid">
            ${cards
              .map(
                (m) => `
              <article class="card transport-option ${selected === m.mode ? "selected" : ""}">
                <p><strong>${m.label}</strong></p>
                <p class="muted">约 ${m.price} 元 ｜ ${m.time}</p>
                <p class="muted">${escapeHtml(m.feature)}</p>
                <p class="muted">推荐理由：${escapeHtml(segmentReason(seg, m.mode))}</p>
                <div class="row wrap">
                  <button class="btn ghost" data-segment-detail="${key}" data-mode="${m.mode}">查看详情</button>
                  <button class="btn" data-segment-select="${key}" data-mode="${m.mode}">选择此方式</button>
                </div>
                <div class="inline-ticket-detail">${detailMode === m.mode ? segmentDetailHTML(seg, key, m.mode) : ""}</div>
              </article>
            `
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
  renderSegmentSelectionSummary();
}

function renderRentalSuggestion() {
  const txt = state.transportData?.rentalCityShuttleSuggestion || "";
  $("rentalSuggestion").innerHTML = `
    <h3>租车使用建议</h3>
    <p class="muted">${escapeHtml(txt)}</p>
  `;
}

function renderTicketDetailsForSegment(key, mode) {
  state.segmentDetailModeByKey[key] = mode;
  renderSegmentTransport();
}

async function loadTransportStep() {
  const payload = readPayload();
  if (!payload.cities || payload.cities.length < 2) throw new Error("请至少填写 1 个目标城市。");
  const data = await api("/api/transport-options", { method: "POST", body: JSON.stringify(payload) });
  state.transportData = data;
  state.segmentDetailModeByKey = {};
  state.segmentTimeFilterByKey = {};
  ensureSegmentDefaults();
  renderModeDetails(state.selectedMainMode || data.recommendedMainMode || "rail");
  renderSegmentTransport();
  renderRentalSuggestion();
}

function toSimpleSpot(name, city, kind) {
  return {
    name,
    ticket: kind === "landmark" ? 30 : 0,
    bestHours: kind === "food" ? 1.5 : 2,
    traffic: "地铁/公交可达",
    budgetHint: kind === "food" ? "餐饮消费约 60-180 元" : "游玩消费约 0-120 元",
    image: resolveClientSpotImage(name, city, kind === "food" ? "food" : "spot"),
    videos: [
      {
        platform: "抖音",
        title: `${name}打卡参考`,
        url: `https://www.douyin.com/search/${encodeURIComponent(name)}`
      }
    ],
    city
  };
}

function enrichCityAttractions(city, categories = {}) {
  const items = [];
  const pushUnique = (spot) => {
    if (!spot || !spot.name) return;
    if (!items.some((x) => x.name === spot.name)) items.push({ ...spot, city });
  };

  (categories.hot || []).forEach(pushUnique);
  (categories.landmark || []).forEach((name) => pushUnique(toSimpleSpot(name, city, "landmark")));
  (categories.hiddenFree || []).forEach((name) => pushUnique(toSimpleSpot(name, city, "hidden")));
  (categories.photo || []).forEach((name) => pushUnique(toSimpleSpot(name, city, "photo")));
  (categories.food || []).forEach((name) => pushUnique(toSimpleSpot(name, city, "food")));
  (state.customAttractionsByCity[city] || []).forEach(pushUnique);

  const templates = ["城市地标", "高口碑街区", "拍照机位点", "夜游路线", "周边自然景观", "本地美食聚集区"];
  const minCount = 10;
  let idx = 0;
  while (items.length < minCount && idx < templates.length) {
    const name = `${city}${templates[idx]}`;
    pushUnique({
      name,
      ticket: idx % 2 === 0 ? 0 : 20,
      bestHours: 2 + (idx % 3) * 0.5,
      traffic: "地铁/公交可达",
      budgetHint: "建议预算 40-180 元/人",
      image: resolveClientSpotImage(name, city),
      videos: [{ platform: "抖音", title: `${name}参考`, url: `https://www.douyin.com/search/${encodeURIComponent(name)}` }]
    });
    idx += 1;
  }
  return items;
}

function renderVideoCards(city, spots) {
  const videos = spots.flatMap((spot) => (spot.videos || []).map((v) => ({ ...v, spot: spot.name })));
  if (!videos.length) return;
  $("shortVideoList").innerHTML += `
    <article class="card video-card">
      <h3>${escapeHtml(city)} · 短视频参考</h3>
      ${videos
        .slice(0, 8)
        .map((v) => `<p>${escapeHtml(v.platform)} ｜ ${escapeHtml(v.spot)}：${renderExternalAnchor(v.url, v.title)}</p>`)
        .join("")}
    </article>
  `;
}

function renderAttractionBlock(city, spots) {
  return `
    <article class="card">
      <h3>${escapeHtml(city)} · 热门景点与打卡点</h3>
      <p class="muted">共 ${spots.length} 个可选点位。</p>
      ${spots
        .map((x) => {
          const selected = state.selectedAttractions[city]?.has(x.name);
          return `
          <div class="mini-spot ${selected ? "selected" : ""}">
            <img src="${escapeHtml(x.image)}" alt="${escapeHtml(x.name)}" />
            <div class="mini-spot-body">
              <p><strong>${escapeHtml(x.name)}</strong></p>
              <p class="muted">门票 ${x.ticket} 元 ｜ 交通 ${escapeHtml(x.traffic)} ｜ 建议 ${x.bestHours || 2} 小时</p>
              <p class="muted">${escapeHtml(x.budgetHint || "预算提示待计算")}</p>
              <div class="inline-links">
                ${(x.videos || [])
                  .map((v) => renderExternalAnchor(v.url, `${v.platform} · ${v.title}`))
                  .join("")}
              </div>
              <label class="check"><input type="checkbox" data-city="${escapeHtml(city)}" data-name="${escapeHtml(x.name)}" ${
                selected ? "checked" : ""
              } />加入行程</label>
            </div>
          </div>
        `;
        })
        .join("")}
    </article>
  `;
}

function inferSpotIntent(text, city) {
  const input = String(text || "").trim();
  if (!input) return null;
  const hasNight = /(夜景|夜游|晚上|夜晚)/u.test(input);
  const hasFood = /(吃|美食|小吃|餐|火锅|咖啡)/u.test(input);
  const hasPhoto = /(拍照|出片|机位|打卡)/u.test(input);
  const hasAncient = /(古镇|古城|历史|文化)/u.test(input);
  const hasNature = /(山|海|湖|公园|自然|日出|日落)/u.test(input);

  let name = input;
  if (name.length > 24) name = name.slice(0, 24);
  if (!/[景|园|街|馆|寺|塔|湖|山|镇|城]/u.test(name)) name = `${name}打卡点`;
  const ticket = hasNature ? 20 : hasAncient ? 30 : 0;
  const bestHours = hasPhoto ? 2.5 : hasFood ? 1.5 : 2;
  const traffic = hasNight ? "地铁+打车夜间可达" : "公交/地铁可达";
  const budgetHint = hasFood
    ? "建议预算 80-220 元/人"
    : hasPhoto
    ? "建议预算 40-160 元/人"
    : "建议预算 30-140 元/人";
  const image = resolveClientSpotImage(name, city, hasFood ? "food" : "spot");

  return {
    name,
    ticket,
    bestHours,
    traffic,
    budgetHint,
    image,
    city,
    videos: [
      {
        platform: "抖音",
        title: `${name}实拍参考`,
        url: `https://www.douyin.com/search/${encodeURIComponent(name)}`
      }
    ]
  };
}

async function loadAttractionsStep() {
  const { departure, destinations } = parseCitiesFromInputs();
  if (!Object.keys(state.selectedAttractions).length) state.selectedAttractions = {};
  $("attractionSelector").innerHTML = "";
  $("shortVideoList").innerHTML = "";
  const dep = normalizeRegionText(departure);
  const targetCities = destinations.filter((city) => normalizeRegionText(city) !== dep);

  $("customSpotCity").innerHTML = targetCities.map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join("");

  for (const city of targetCities) {
    const data = await api(`/api/attractions?city=${encodeURIComponent(city)}`);
    const spots = enrichCityAttractions(city, data.categories || {});
    state.attractionCatalog[city] = spots;
    state.selectedAttractions[city] = state.selectedAttractions[city] || new Set();
    $("attractionSelector").innerHTML += renderAttractionBlock(city, spots);
    renderVideoCards(city, spots);
  }
  if (!targetCities.length) $("attractionSelector").innerHTML = `<article class="card"><p class="empty-state">请先填写目标城市后再查看景点。</p></article>`;
}

async function loadFoodStep() {
  const { departure, destinations } = parseCitiesFromInputs();
  const dep = normalizeRegionText(departure);
  const targetCities = destinations.filter((city) => normalizeRegionText(city) !== dep);
  $("foodSelector").innerHTML = "";
  state.foodCatalog = {};

  for (const city of targetCities) {
    const data = await api(`/api/foods?city=${encodeURIComponent(city)}`);
    state.foodCatalog[city] = data.items || [];
    state.selectedFoods[city] = state.selectedFoods[city] || new Set();
    $("foodSelector").innerHTML += `
      <article class="card">
        <h3>${escapeHtml(city)} · 特色美食</h3>
        ${(data.items || [])
          .map((f) => {
            const link = `https://www.douyin.com/search/${encodeURIComponent(city + " " + f.name)}`;
            const img = f.image || resolveClientSpotImage(f.name, city, "food");
            return `<label class="food-item"><input type="checkbox" data-food-city="${escapeHtml(city)}" data-food-name="${escapeHtml(f.name)}" ${
              state.selectedFoods[city].has(f.name) ? "checked" : ""
            } /><img class="food-thumb" src="${escapeHtml(img)}" alt="${escapeHtml(f.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />${escapeHtml(f.name)} ｜ ${
              f.price
            } 元/人 ${renderExternalAnchor(link, "看视频")}</label>`;
          })
          .join("")}
      </article>
    `;
  }
  if (!targetCities.length) $("foodSelector").innerHTML = `<article class="card"><p class="empty-state">未检测到目标城市，已跳过。</p></article>`;
}

async function loadHotelStep() {
  const { departure, destinations } = parseCitiesFromInputs();
  const dep = normalizeRegionText(departure);
  const targetCities = destinations.filter((city) => normalizeRegionText(city) !== dep);
  $("hotelSelector").innerHTML = `<article class="card"><h3>可选酒店（影响预算）</h3></article>`;
  state.hotelCatalog = {};

  for (const city of targetCities) {
    const data = await api(`/api/hotels?city=${encodeURIComponent(city)}`);
    state.hotelCatalog[city] = data.items || [];
    if (!state.selectedHotels[city] && data.items?.length) state.selectedHotels[city] = data.items[0];
    const selectedSpots = [...(state.selectedAttractions[city] || new Set())];
    $("hotelSelector").innerHTML += `
      <article class="card">
        <h3>${escapeHtml(city)}</h3>
        ${(data.items || [])
          .map((h) => {
            const active = state.selectedHotels[city]?.name === h.name;
            const reason = h.reason || (selectedSpots.length ? `靠近已选景点：${selectedSpots.slice(0, 2).join("、")}` : "交通换乘方便，适合首次到访");
            const videoLink =
              h.videoUrl ||
              `https://www.douyin.com/search/${encodeURIComponent(`${city} ${h.name} 酒店`)}`;
            return `<article class="hotel-card ${active ? "selected" : ""}"><strong>${escapeHtml(h.name)}</strong> ｜ ${h.price} 元/晚 <span class="tag">${(h.tags || [])
              .map(escapeHtml)
              .join(" ")}</span><p class="muted">${escapeHtml(reason)}</p><div class="row wrap"><button class="btn ${
              active ? "selected" : "ghost"
            }" type="button" data-hotel-city="${escapeHtml(city)}" data-hotel-name="${escapeHtml(
              h.name
            )}" data-hotel-price="${h.price}">选择此酒店</button>${renderExternalAnchor(videoLink, "查看短视频介绍")}</div></article>`;
          })
          .join("")}
      </article>
    `;
  }
}

function labelCostKey(key) {
  return COST_LABEL_MAP[key] || key;
}

function labelTimeKey(key) {
  return TIME_LABEL_MAP[key] || key;
}

function weatherRiskText(level) {
  if (level === "high") return "高风险";
  if (level === "medium") return "中风险";
  if (level === "low") return "低风险";
  return "未知";
}

function formatTempRange(row) {
  if (!Number.isFinite(row.tempMin) || !Number.isFinite(row.tempMax)) return "--";
  return `${row.tempMin}°C ~ ${row.tempMax}°C`;
}

function renderWeatherPanel() {
  const panel = $("weatherPanel");
  if (!panel) return;

  if (state.currentWeather?.routeDaily?.length) {
    const weather = state.currentWeather;
    panel.innerHTML = `
      <article class="card">
        <h3>实时天气（Beta）</h3>
        <p class="weather-summary">
          数据源：${escapeHtml(weather.source || "Open-Meteo")} ｜ 风险等级：${escapeHtml(weatherRiskText(weather.summary?.riskLevel))}
          ${Number.isFinite(weather.summary?.avgScore) ? ` ｜ 平均出行分：${weather.summary.avgScore}` : ""}
        </p>
        ${(weather.routeDaily || [])
          .map(
            (row) => `
          <div class="weather-row">
            <div>
              <strong>Day ${row.day}</strong>
              <div class="weather-city">${escapeHtml(row.city)}</div>
            </div>
            <div>
              <div class="weather-condition">${escapeHtml(row.condition || "暂无预报")}</div>
              <div class="weather-temp">${escapeHtml(formatTempRange(row))} ｜ 降水概率 ${
              Number.isFinite(row.precipProbability) ? `${row.precipProbability}%` : "--"
            }</div>
              <div class="cost-extra">${escapeHtml(row.advice || "")}</div>
            </div>
            <div class="weather-score">${Number.isFinite(row.travelScore) ? `${row.travelScore}分` : "--"}</div>
          </div>
        `
          )
          .join("")}
        ${
          weather.summary?.notes?.length
            ? `<p class="muted">${escapeHtml(weather.summary.notes.join(" "))}</p>`
            : ""
        }
      </article>
    `;
    return;
  }

  if (state.weatherError) {
    panel.innerHTML = `
      <article class="card">
        <h3>实时天气（Beta）</h3>
        <p class="muted">天气接口暂时不可用，当前仍可正常使用规划结果。</p>
        <p class="cost-extra">${escapeHtml(state.weatherError)}</p>
      </article>
    `;
    return;
  }

  panel.innerHTML = `
    <article class="card">
      <h3>实时天气（Beta）</h3>
      <p class="muted">生成行程后将自动拉取未来天气，辅助你判断每日出行风险。</p>
    </article>
  `;
}

function renderPlanCompareTable(result) {
  const selectedMode = result?.summary?.selectedMode;
  const plans = (result.plans || []).filter((p) => p.mode !== selectedMode);
  if (!plans.length) return "";
  return plans
    .map((p, idx) => {
      const costRows = Object.entries(p.details?.items || {}).filter(([, amount]) => Number(amount) > 0);
      const timeRows = Object.entries(p.details?.time || {}).filter(([, hours]) => Number(hours) > 0);
      return `
      <article class="card">
        <details ${idx === 0 ? "" : ""}>
          <summary><strong>${escapeHtml(p.label)}</strong> ｜ ${p.totalCost} 元 ｜ 紧凑 ${p.totalHoursTight}h</summary>
          <p class="muted">自由度 ${p.freedomScore} ｜ 便捷度 ${p.convenienceScore}</p>
          <div class="cost-line"><strong>开销明细</strong><span></span></div>
          ${
            costRows.length
              ? costRows
                  .map(
                    ([key, amount]) => `
                <div class="cost-line">
                  <span>${escapeHtml(labelCostKey(key))}</span>
                  <strong>${Number(amount).toFixed(0)} 元</strong>
                </div>
              `
                  )
                  .join("")
              : '<p class="empty-state">该方案暂无额外开销。</p>'
          }
          <div class="cost-line"><strong>时间明细</strong><span></span></div>
          ${
            timeRows.length
              ? timeRows
                  .map(
                    ([key, hours]) => `
                <div class="cost-line">
                  <span>${escapeHtml(labelTimeKey(key))}</span>
                  <strong>${Number(hours).toFixed(1)} 小时</strong>
                </div>
              `
                  )
                  .join("")
              : '<p class="empty-state">该方案暂无时间分项。</p>'
          }
        </details>
      </article>
    `;
    })
    .join("");
}

function renderPlan(result) {
  state.currentPlan = result;
  state.currentWeather = result.weather || state.currentWeather;
  state.shareToken = null;
  $("saveHistoryBtn").disabled = false;
  $("shareBtn").disabled = false;
  $("exportBtn").disabled = false;

  const alerts = [];
  if (result.carSuggestion?.shouldSuggest) alerts.push(`建议在城市内使用租车中转：${result.carSuggestion.reasons.join("、")}`);
  const over = (result.budgetAlerts || []).filter((x) => x.overBudget);
  if (over.length) alerts.push(`预算提醒：${over.map((x) => `${modeLabel(x.mode)}超出${x.overBy}元`).join("；")}`);
  $("alertBox").innerHTML = alerts.map((x) => `<div class="alert"><span class="warn">提醒</span> ${escapeHtml(x)}</div>`).join("");

  $("reminderList").innerHTML = (result.reminders || []).map((x) => `<article class="card"><p class="muted">${escapeHtml(x)}</p></article>`).join("");
  $("planSummary").innerHTML = `
    <article class="card">
      <h3>结果总览</h3>
      <p>${(result.summary.cities || []).map(escapeHtml).join(" → ")}</p>
      <p>天数 ${result.summary.days} ｜ 人数 ${result.summary.travelers} ｜ 主方案 ${escapeHtml(modeLabel(result.summary.selectedMode))}</p>
      <p class="muted">偏好策略：${escapeHtml(result.summary.travelPreference || "均衡优先")} ｜ 返程规划：${
        result.summary.returnToDeparture ? "已纳入" : "未纳入"
      }</p>
      ${
        (result.topRecommendations || []).length
          ? `<p class="muted">推荐对比：${result.topRecommendations
              .map((x) => `TOP${x.rank} ${escapeHtml(modeLabel(x.mode))}(${x.recommendScore})`)
              .join(" ｜ ")}</p>`
          : ""
      }
    </article>
  `;
  renderWeatherPanel();

  const costRows = (result.selectedCostBreakdown?.include || []).filter((x) => Number(x.amount) > 0);
  $("costBreakdown").innerHTML = `
    <article class="card">
      <h3>费用明细（用途 + 浮动区间）</h3>
      ${
        costRows.length
          ? costRows
              .map(
                (x) => `
            <div class="cost-line">
              <span>${escapeHtml(labelCostKey(x.key))}</span>
              <strong>${x.amount} 元</strong>
            </div>
            <div class="cost-extra">用途：${escapeHtml(x.usage || "")} ｜ 波动：${escapeHtml(x.fluctuation || "")}</div>
          `
              )
              .join("")
          : '<p class="empty-state">当前无可计费项目。</p>'
      }
      <p class="muted">${escapeHtml(result.selectedCostBreakdown?.explain || "")}</p>
      <p><strong>合计 ${result.selectedCostBreakdown?.total || 0} 元</strong></p>
    </article>
  `;

  $("timeBreakdown").innerHTML = `
    <article class="card">
      <h3>时间明细（当前方案）</h3>
      ${(result.selectedTimeBreakdown?.include || [])
        .map(
          (x) => `
        <div class="cost-line">
          <span>${escapeHtml(labelTimeKey(x.key))}</span>
          <strong>${x.hours} 小时</strong>
        </div>
        <div class="cost-extra">说明：${escapeHtml(x.usage || "")}</div>
      `
        )
        .join("")}
      <p>紧凑时长：${result.selectedTimeBreakdown?.tight || 0} 小时</p>
      <p>宽松时长：${result.selectedTimeBreakdown?.relaxed || 0} 小时</p>
    </article>
  `;

  $("planCards").innerHTML = renderPlanCompareTable(result);

  $("dailyPlan").innerHTML = (result.dailyPlan || [])
    .map(
      (d) => `
      <article class="card">
        <h3>Day ${d.day} ｜ ${escapeHtml(d.city)}</h3>
        <p>${escapeHtml(d.timeTemplate.morning)}</p>
        <p>${escapeHtml(d.timeTemplate.afternoon)}</p>
        <p>${escapeHtml(d.timeTemplate.evening)}</p>
      </article>
    `
    )
    .join("");
}

async function generatePlan() {
  const payload = readPayload();
  state.currentWeather = null;
  state.weatherError = "";
  renderWeatherPanel();

  const result = await api("/api/plan", { method: "POST", body: JSON.stringify(payload) });
  renderPlan(result);

  try {
    const weather = await api("/api/weather", {
      method: "POST",
      body: JSON.stringify({
        cities: payload.cities,
        startDate: payload.startDate,
        days: payload.days
      })
    });
    state.currentWeather = weather;
    state.weatherError = "";
    if (state.currentPlan) state.currentPlan.weather = weather;
  } catch (err) {
    state.weatherError = err.message || "天气服务暂不可用";
  }
  renderWeatherPanel();
}

async function refreshHistory() {
  const data = await api("/api/history");
  $("historyList").innerHTML = (data.items || [])
    .map(
      (row) => `
      <article class="card">
        <h3>${escapeHtml(row.name)}</h3>
        <p class="muted">${escapeHtml(row.createdAt)}</p>
        <p>${(row.payload.summary?.cities || []).map(escapeHtml).join(" → ")}</p>
      </article>
    `
    )
    .join("");
}

async function saveHistory() {
  if (!state.currentPlan) return;
  await api("/api/history", { method: "POST", body: JSON.stringify({ name: `行程-${new Date().toLocaleString("zh-CN")}`, payload: state.currentPlan }) });
  await refreshHistory();
}

async function copyText(txt) {
  try {
    await navigator.clipboard.writeText(txt);
    alert("已复制到剪贴板。");
  } catch (_err) {
    window.prompt("复制以下内容：", txt);
  }
}

async function sharePlan() {
  if (!state.currentPlan) return;
  const data = await api("/api/share", { method: "POST", body: JSON.stringify({ payload: state.currentPlan }) });
  state.shareToken = data.token;
  const url = `${location.origin}${data.link}`;
  await copyText(url);
}

async function exportPlan() {
  if (!state.currentPlan) return;
  if (!state.shareToken) await sharePlan();
  const data = await api(`/api/export?token=${encodeURIComponent(state.shareToken)}`);
  await copyText(data.text);
}

function guessRelatedCities(cities) {
  const rec = [];
  for (const city of cities) {
    const key = normalizeRegionText(city);
    for (const [k, arr] of Object.entries(RELATED_CITY_MAP)) {
      if (normalizeRegionText(k) === key || key.includes(normalizeRegionText(k)) || normalizeRegionText(k).includes(key)) {
        rec.push(...arr);
      }
    }
  }
  const currentKeys = cities.map((x) => normalizeRegionText(x));
  return uniq(rec).filter((x) => !currentKeys.includes(normalizeRegionText(x))).slice(0, 6);
}

function renderDestinationList() {
  const box = $("destCityList");
  if (!box) return;
  box.innerHTML = state.destinationCities.length
    ? state.destinationCities
        .map((city) => `<span class="city-chip">${escapeHtml(city)} <button data-remove-city="${escapeHtml(city)}" aria-label="删除">×</button></span>`)
        .join("")
    : '<span class="empty-state">还没有目标城市，请先添加。</span>';
  renderHotCityBars();
  markStep1DirtyIfNeeded();
}

function renderRelatedCitySuggestions() {
  const box = $("relatedCityBox");
  if (!box) return;
  const rec = guessRelatedCities(state.destinationCities);
  box.innerHTML = `
    <h3>关联城市推荐</h3>
    ${
      rec.length
        ? `<div class="row wrap">${rec
            .map((city) => `<button class="btn ghost" data-add-related="${escapeHtml(city)}">${escapeHtml(city)}</button>`)
            .join("")}</div>`
        : '<p class="empty-state">暂无关联城市推荐。</p>'
    }
  `;
}

function bindTabNavigation() {
  document.querySelectorAll(".tab-item").forEach((tab) => tab.addEventListener("click", () => goto(tab.dataset.tab)));
}

function bindHeaderBack() {
  $("headerBackBtn").addEventListener("click", () => {
    if (shouldConfirmLeaveStep1("back")) {
      const ok = window.confirm("你在步骤一有未保存的填写内容，离开后可能丢失。确定继续离开吗？");
      if (!ok) return;
      state.step1Dirty = false;
    }
    history.back();
  });
}

function bindTagFilters() {
  $("tagFilterBar").addEventListener("click", async (event) => {
    const toggleBtn = event.target.closest("#toggleMoreTagsBtn");
    if (toggleBtn) {
      state.feedExtraTagsExpanded = !state.feedExtraTagsExpanded;
      updateTagMoreUI();
      return;
    }

    const btn = event.target.closest("[data-tag]");
    if (!btn) return;
    state.currentTag = btn.dataset.tag;
    document.querySelectorAll("#tagFilterBar .chip").forEach((x) => x.classList.toggle("active", x === btn));
    await loadFeed();
  });
}

function bindFeedActions() {
  $("seasonSelect").addEventListener("change", loadFeed);
  $("kindSelect").addEventListener("change", loadFeed);

  const searchInput = $("feedSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.feedSearchText = event.target.value || "";
      applyFeedFilters();
    });
  }

  const clearBtn = $("feedSearchClearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.feedSearchText = "";
      if (searchInput) searchInput.value = "";
      applyFeedFilters();
    });
  }

  $("feedGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-spot-id]");
    if (!card) return;
    goto("/spot", { payload: { spotId: card.dataset.spotId } });
  });

  const feedView = $("route-feed");
  if (feedView && !feedView.dataset.fabScrollBound) {
    feedView.dataset.fabScrollBound = "1";
    feedView.addEventListener(
      "scroll",
      () => {
        hideFeedFabOnDemand(false);
      },
      { passive: true }
    );
  }

  getFeedFabEl()?.addEventListener("click", () => {
    state.selectedSpot = null;
    state.destinationCities = ["\u676d\u5dde"];
    state.selectedAttractions = {};
    state.customAttractionsByCity = {};
    state.selectedFoods = {};
    state.selectedHotels = {};
    state.selectedSegmentModes = {};
    state.selectedSegmentTickets = {};
    state.segmentDetailModeByKey = {};
    state.segmentTimeFilterByKey = {};
    state.transportData = null;
    $("departureCity").value = $("departureCity").value || "\u4e0a\u6d77";
    ensureStartDateDefault();
    renderDestinationList();
    renderRelatedCitySuggestions();
    goto("/plan/step-1");
  });
}

function bindPlanActions() {
  $("startPlanBtn").addEventListener("click", () => goto("/plan/step-1"));
  $("customPlanBtn").addEventListener("click", () => goto("/plan/step-1"));

  $("departureCity")?.addEventListener("input", markStep1DirtyIfNeeded);
  $("travelers")?.addEventListener("input", markStep1DirtyIfNeeded);
  $("budgetLimit")?.addEventListener("input", markStep1DirtyIfNeeded);
  $("relation")?.addEventListener("change", markStep1DirtyIfNeeded);
  $("studentMode")?.addEventListener("change", markStep1DirtyIfNeeded);
  $("returnToDeparture")?.addEventListener("change", markStep1DirtyIfNeeded);
  $("travelPreference")?.addEventListener("change", markStep1DirtyIfNeeded);
  $("preferredDepartureTime")?.addEventListener("change", markStep1DirtyIfNeeded);

  $("startDate")?.addEventListener("change", () => {
    syncStep1Dates("days");
    markStep1DirtyIfNeeded();
  });
  $("days")?.addEventListener("input", () => {
    syncStep1Dates("days");
    markStep1DirtyIfNeeded();
  });
  $("endDate")?.addEventListener("change", () => {
    syncStep1Dates("end");
    markStep1DirtyIfNeeded();
  });

  $("destCityInput")?.addEventListener("input", (event) => {
    renderCityInputSuggestList(event.target.value || "");
    markStep1DirtyIfNeeded();
  });
  $("destCityInput")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("addDestCityBtn")?.click();
    }
  });

  $("addDestCityBtn").addEventListener("click", () => {
    const input = $("destCityInput").value.trim();
    if (!input) return;
    addDestinationCity(input);
    $("destCityInput").value = "";
    renderDestinationList();
    renderRelatedCitySuggestions();
  });

  $("destCityList").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-remove-city]");
    if (!btn) return;
    removeDestinationCity(btn.dataset.removeCity);
    renderDestinationList();
    renderRelatedCitySuggestions();
  });

  $("relatedCityBox").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add-related]");
    if (!btn) return;
    addDestinationCity(btn.dataset.addRelated);
    renderDestinationList();
    renderRelatedCitySuggestions();
  });

  $("cityInputSuggestList")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-city-suggest]");
    if (!btn) return;
    const v = btn.dataset.citySuggest || "";
    $("destCityInput").value = v;
    renderCityInputSuggestList(v);
  });

  $("hotDestinationCityBar")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-hot-destination]");
    if (!btn) return;
    const city = btn.dataset.hotDestination || "";
    if (!city) return;
    addDestinationCity(city);
    renderDestinationList();
    renderRelatedCitySuggestions();
  });

  $("useCurrentLocationBtn")?.addEventListener("click", () => {
    setLocationHint("正在定位，请稍候…");
    if (!navigator.geolocation) {
      setLocationHint("当前设备不支持定位，请手动输入出发地。", true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.county || addr.state || "";
          if (city) {
            $("departureCity").value = city;
            setLocationHint(`已定位到：${city}`);
            markStep1DirtyIfNeeded();
          } else {
            setLocationHint("已获取定位，但未识别到城市名称，请手动确认。", true);
          }
        } catch (_err) {
          setLocationHint("定位解析失败。请确认浏览器能访问定位服务，或手动输入出发地。", true);
        }
      },
      (err) => {
        const msg = err?.code === 1 ? "定位权限被拒绝，请在浏览器设置中允许定位后重试。" : "定位失败，请检查网络与定位权限后重试。";
        setLocationHint(msg, true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });

  $("goStep2Btn").addEventListener("click", async () => {
    try {
      flushPendingDestinationInput();
      const step1Error = validateStep1BeforeTransport();
      if (step1Error) throw new Error(step1Error);
      syncStep1Dates("days");
      await loadTransportStep();
      markStep1Saved();
      goto("/plan/step-2");
    } catch (err) {
      const msg = err?.message || "加载交通方式失败，请稍后重试。";
      window.alert(msg);
      console.error(err);
    }
  });
  $("step2BackBtn").addEventListener("click", () => goto("/plan/step-1"));
  $("skipStep2Btn").addEventListener("click", () => goto("/plan/step-3"));
  $("goStep3Btn").addEventListener("click", async () => {
    await loadAttractionsStep();
    goto("/plan/step-3");
  });
  $("step3BackBtn").addEventListener("click", () => goto("/plan/step-2"));
  $("goStep4Btn").addEventListener("click", async () => {
    await loadFoodStep();
    goto("/plan/step-4");
  });
  $("step3FloatingNextBtn").addEventListener("click", async () => {
    await loadFoodStep();
    goto("/plan/step-4");
  });
  $("backToStep3Btn").addEventListener("click", () => goto("/plan/step-3"));
  $("goStep5Btn").addEventListener("click", async () => {
    await loadHotelStep();
    goto("/plan/step-5");
  });

  $("addCustomSpotBtn").addEventListener("click", async () => {
    const city = $("customSpotCity").value;
    const text = $("customSpotInput").value.trim();
    if (!city || !text) return;
    const spot = inferSpotIntent(text, city);
    if (!spot) return;
    state.customAttractionsByCity[city] = state.customAttractionsByCity[city] || [];
    state.customAttractionsByCity[city].push(spot);
    state.selectedAttractions[city] = state.selectedAttractions[city] || new Set();
    state.selectedAttractions[city].add(spot.name);
    $("customSpotInput").value = "";
    await loadAttractionsStep();
  });

  $("generateBtn").addEventListener("click", generatePlan);
  $("saveHistoryBtn").addEventListener("click", saveHistory);
  $("shareBtn").addEventListener("click", sharePlan);
  $("exportBtn").addEventListener("click", exportPlan);
}

function bindPlanSelections() {
  $("segmentTransportList").addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    const keyDetail = btn.dataset.segmentDetail;
    const keySelect = btn.dataset.segmentSelect;
    const keyFilter = btn.dataset.timeFilter;
    const bucket = btn.dataset.timeBucket;
    const mode = btn.dataset.mode;
    if (keyFilter && bucket) {
      state.segmentTimeFilterByKey[keyFilter] = bucket;
      renderSegmentTransport();
      return;
    }
    if (keyDetail && mode) return renderTicketDetailsForSegment(keyDetail, mode);
    if (keySelect && mode) {
      state.selectedSegmentModes[keySelect] = mode;
      state.segmentDetailModeByKey[keySelect] = mode;
      renderSegmentTransport();
    }
  });

  $("segmentTransportList").addEventListener("change", (event) => {
    const el = event.target;
    if (!(el instanceof HTMLInputElement)) return;
    const key = el.dataset.ticketKey;
    const no = el.dataset.ticketNo;
    if (!key || !no) return;
    state.selectedSegmentTickets[key] = no;
    renderSegmentSelectionSummary();
  });

  $("attractionSelector").addEventListener("change", (event) => {
    const el = event.target;
    if (!(el instanceof HTMLInputElement)) return;
    const city = el.dataset.city;
    const name = el.dataset.name;
    if (!city || !name) return;
    state.selectedAttractions[city] = state.selectedAttractions[city] || new Set();
    if (el.checked) state.selectedAttractions[city].add(name);
    else state.selectedAttractions[city].delete(name);
  });

  $("foodSelector").addEventListener("change", (event) => {
    const el = event.target;
    if (!(el instanceof HTMLInputElement)) return;
    const city = el.dataset.foodCity;
    const name = el.dataset.foodName;
    if (!city || !name) return;
    state.selectedFoods[city] = state.selectedFoods[city] || new Set();
    if (el.checked) state.selectedFoods[city].add(name);
    else state.selectedFoods[city].delete(name);
  });

  $("hotelSelector").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-hotel-city]");
    if (!btn) return;
    const city = btn.dataset.hotelCity;
    state.selectedHotels[city] = { name: btn.dataset.hotelName, price: Number(btn.dataset.hotelPrice) };
    loadHotelStep().catch((err) => alert(err.message));
  });
}

function bindHistoryActions() {
  $("refreshHistoryBtn").addEventListener("click", refreshHistory);
}

function bindPopState() {
  window.addEventListener("popstate", handlePopState);
}

function bindSwipeBack() {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  const stack = $("viewStack");
  stack.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = startX < 28;
    },
    { passive: true }
  );
  stack.addEventListener(
    "touchmove",
    (e) => {
      if (!tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dx > 68 && dy < 40) {
        tracking = false;
        history.back();
      }
    },
    { passive: true }
  );
  stack.addEventListener("touchend", () => (tracking = false), { passive: true });
}

async function onRouteEnter(routeKey, payload = {}) {
  if (routeKey === "/feed") {
    maybeShowOnboarding();
    updateTagMoreUI();
    hideFeedFabOnDemand(false);
    if (!state.feedItems.length) await loadFeed();
    else applyFeedFilters();
    return;
  }
  if (routeKey === "/spot") {
    if (payload.spotId) await loadSpot(payload.spotId);
    return;
  }
  if (routeKey === "/history") {
    await refreshHistory();
    return;
  }
  if (routeKey === "/plan/step-1") {
    ensureStartDateDefault();
    renderDestinationList();
    renderRelatedCitySuggestions();
    ensureStep1AssistUI();
    return;
  }
  if (routeKey === "/plan/step-2") {
    if (!state.transportData) await loadTransportStep();
    return;
  }
  if (routeKey === "/plan/step-3") {
    if (!$("attractionSelector").innerHTML) await loadAttractionsStep();
    return;
  }
  if (routeKey === "/plan/step-4") {
    if (!$("foodSelector").innerHTML) await loadFoodStep();
    return;
  }
  if (routeKey === "/plan/step-5") {
    renderWeatherPanel();
    if (!$("hotelSelector").innerHTML) await loadHotelStep();
    if (payload.shareToken) {
      const row = await api('/api/share?token=' + encodeURIComponent(payload.shareToken));
      if (row.payload) renderPlan(row.payload);
    }
  }
}

async function bootRoute() {
  const parsed = parseRoute(location.pathname);
  history.replaceState({ routeKey: parsed.key, payload: parsed }, "", location.pathname);
  normalizeRouteViewLayers(parsed.key);
  switchView(parsed.key, "forward");
  await onRouteEnter(parsed.key, parsed);
}

function registerSw() {
  if (!("serviceWorker" in navigator)) return;
  const host = String(location.hostname || "");
  const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (isLocalhost) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
    if ("caches" in window) {
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.filter((k) => String(k).startsWith("tripflow-pwa-")).map((k) => caches.delete(k)))
        )
        .catch(() => {});
    }
    return;
  }
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

function bindPwaInstall() {
  $("installAppBtn")?.addEventListener("click", () => {
    triggerInstallPrompt().catch(() => {});
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallButtonVisibility();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallButtonVisibility();
  });

  updateInstallButtonVisibility();
}

async function bootstrap() {
  bindTabNavigation();
  bindHeaderBack();
  bindTagFilters();
  bindFeedActions();
  bindPlanActions();
  bindPlanSelections();
  bindHistoryActions();
  bindPopState();
  bindSwipeBack();
  bindPwaInstall();

  const closeGuideBtn = $("closeOnboardingBtn");
  if (closeGuideBtn) {
    closeGuideBtn.addEventListener("click", () => {
      localStorage.setItem("tripflow-onboarding-v1", "1");
      $("onboardingLayer")?.classList.add("hidden");
    });
  }

  installFeedImageFallback();
  renderCityDataList();
  updateTagMoreUI();
  registerSw();
  window.addEventListener("pageshow", () => {
    normalizeRouteViewLayers(parseRoute(location.pathname).key);
  });
  await bootRoute();
}

bootstrap().catch((err) => {
  alert(err.message);
});
