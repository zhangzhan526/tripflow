"use strict";

const feedCards = [
  {
    id: "spot-hz-westlake",
    kind: "seasonal",
    season: "spring",
    city: "杭州市",
    title: "西湖春日慢游",
    subtitle: "经典景区 · 轻松出片",
    image: "/assets/feeds/westlake.svg",
    tags: ["推荐", "春季", "都市"],
    budgetHint: "人均约 450-900 元",
    score: 4.8
  },
  {
    id: "spot-qd-coast",
    kind: "hot",
    season: "summer",
    city: "青岛市",
    title: "海岸线日落打卡",
    subtitle: "热门线路 · 夜景美食",
    image: "/assets/feeds/coast.svg",
    tags: ["推荐", "海边", "夏季"],
    budgetHint: "人均约 700-1300 元",
    score: 4.7
  },
  {
    id: "spot-dl-erhai",
    kind: "seasonal",
    season: "autumn",
    city: "大理市",
    title: "洱海环线轻自驾",
    subtitle: "小众秘境 · 城市内中转友好",
    image: "/assets/feeds/erhai.svg",
    tags: ["推荐", "山野", "古城"],
    budgetHint: "人均约 900-1700 元",
    score: 4.6
  },
  {
    id: "spot-hrb-ice",
    kind: "hot",
    season: "winter",
    city: "哈尔滨市",
    title: "冰雪城市夜游",
    subtitle: "冬季限定 · 城市地标",
    image: "/assets/feeds/icecity.svg",
    tags: ["推荐", "冬季", "都市"],
    budgetHint: "人均约 1100-2200 元",
    score: 4.7
  },
  {
    id: "spot-bj-citywalk",
    kind: "hot",
    season: "all",
    city: "北京市",
    title: "北京中轴线城市漫游",
    subtitle: "地标密集 · 文化打卡",
    image: "/assets/feeds/beijing.svg",
    tags: ["推荐", "都市", "古城"],
    budgetHint: "人均约 800-1500 元",
    score: 4.9
  },
  {
    id: "spot-cd-relax",
    kind: "seasonal",
    season: "all",
    city: "成都市",
    title: "成都慢节奏烟火旅行",
    subtitle: "美食浓度高 · 夜生活丰富",
    image: "/assets/feeds/chengdu.svg",
    tags: ["推荐", "都市", "山野"],
    budgetHint: "人均约 700-1400 元",
    score: 4.8
  }
];

const extendedFeedCards = [
  {
    id: "spot-sh-bund",
    kind: "hot",
    season: "all",
    city: "上海市",
    title: "外滩夜景轻漫游",
    subtitle: "经典地标 · 夜景机位密集",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "都市", "夜景"],
    budgetHint: "人均约 500-1100 元",
    score: 4.8
  },
  {
    id: "spot-xm-coast",
    kind: "seasonal",
    season: "summer",
    city: "厦门市",
    title: "鼓浪屿海风漫行",
    subtitle: "海边慢游 · 文艺街区",
    image: "https://images.unsplash.com/photo-1526481280695-3c4698f6638f?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "海边", "古城"],
    budgetHint: "人均约 800-1500 元",
    score: 4.7
  },
  {
    id: "spot-cq-mountain",
    kind: "hot",
    season: "all",
    city: "重庆市",
    title: "山城夜游与轻轨穿楼",
    subtitle: "立体城市 · 夜色氛围感",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "都市", "夜景"],
    budgetHint: "人均约 700-1400 元",
    score: 4.8
  },
  {
    id: "spot-xa-ancient",
    kind: "hot",
    season: "all",
    city: "西安市",
    title: "城墙与古都文化打卡",
    subtitle: "古城漫步 · 历史厚度高",
    image: "https://images.unsplash.com/photo-1547981609-4b6bf67dbf57?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "古城", "都市"],
    budgetHint: "人均约 650-1300 元",
    score: 4.7
  },
  {
    id: "spot-gz-urban",
    kind: "seasonal",
    season: "all",
    city: "广州市",
    title: "珠江夜航与老城美食",
    subtitle: "都市烟火 · 夜景与美食并重",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "都市", "美食"],
    budgetHint: "人均约 700-1500 元",
    score: 4.6
  },
  {
    id: "spot-sz-citywalk",
    kind: "hot",
    season: "all",
    city: "深圳市",
    title: "海湾城市走读路线",
    subtitle: "摩天楼线 · 海滨公园",
    image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "都市", "海边"],
    budgetHint: "人均约 800-1600 元",
    score: 4.6
  },
  {
    id: "spot-km-plateau",
    kind: "seasonal",
    season: "spring",
    city: "昆明市",
    title: "高原花城轻松散步",
    subtitle: "气候舒适 · 出片率高",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "山野", "春季"],
    budgetHint: "人均约 600-1200 元",
    score: 4.5
  },
  {
    id: "spot-cs-night",
    kind: "hot",
    season: "all",
    city: "长沙市",
    title: "夜市与城市烟火打卡",
    subtitle: "夜生活丰富 · 美食密度高",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    tags: ["推荐", "都市", "美食"],
    budgetHint: "人均约 650-1300 元",
    score: 4.6
  }
];

const detailById = {
  "spot-hz-westlake": {
    description: "西湖周边景点密集，适合 2-3 天轻松游，工作日更适合拍照。",
    openTime: "全天",
    ticket: "西湖免费，部分小景点收费",
    bestDurationHours: 8,
    transportRating: 4.8,
    cityTraffic: "地铁+步行便利，高峰期部分路段拥堵",
    parking: "核心区域停车位紧张",
    highlights: ["断桥", "苏堤", "龙井茶园"],
    defaultRoute: ["上海市", "杭州市"],
    activityCosts: [
      { name: "西湖环线骑行", amount: "30-80 元/人" },
      { name: "灵隐寺游览", amount: "75-120 元/人" },
      { name: "夜游河坊街", amount: "50-120 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "西湖一日游路线", url: "https://www.douyin.com/search/%E8%A5%BF%E6%B9%96%20%E4%B8%80%E6%97%A5%E6%B8%B8" },
      { platform: "小红书", title: "西湖拍照机位", url: "https://www.xiaohongshu.com/search_result?keyword=%E8%A5%BF%E6%B9%96%20%E6%8B%8D%E7%85%A7" }
    ]
  },
  "spot-qd-coast": {
    description: "白天海岸线拍照，晚上可衔接夜市和老街，适合朋友结伴。",
    openTime: "全天",
    ticket: "沿海大多数免费",
    bestDurationHours: 10,
    transportRating: 4.4,
    cityTraffic: "主城区公共交通便利，远端点位接驳时间偏长",
    parking: "旺季停车紧张",
    highlights: ["八大关", "小麦岛", "台东夜市"],
    defaultRoute: ["济南市", "青岛市"],
    activityCosts: [
      { name: "海边 Citywalk", amount: "0-30 元/人" },
      { name: "海鲜正餐", amount: "80-220 元/人" },
      { name: "夜景拍摄+咖啡", amount: "40-120 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "青岛海岸线日落", url: "https://www.douyin.com/search/%E9%9D%92%E5%B2%9B%20%E6%97%A5%E8%90%BD" },
      { platform: "小红书", title: "青岛海边打卡清单", url: "https://www.xiaohongshu.com/search_result?keyword=%E9%9D%92%E5%B2%9B%20%E6%B5%B7%E8%BE%B9" }
    ]
  },
  "spot-dl-erhai": {
    description: "景点相对分散，适合在大理市内采用租车中转提升效率。",
    openTime: "全天",
    ticket: "低门槛景点较多",
    bestDurationHours: 12,
    transportRating: 3.8,
    cityTraffic: "核心区可公交到达，远端点位建议租车中转",
    parking: "环线停车相对友好",
    highlights: ["洱海", "喜洲古镇", "双廊"],
    defaultRoute: ["昆明市", "大理市"],
    activityCosts: [
      { name: "洱海骑行/包车", amount: "80-280 元/人" },
      { name: "古镇慢游", amount: "0-50 元/人" },
      { name: "白族特色餐", amount: "60-180 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "大理洱海环线", url: "https://www.douyin.com/search/%E5%A4%A7%E7%90%86%20%E6%B4%B1%E6%B5%B7%20%E7%8E%AF%E7%BA%BF" },
      { platform: "小红书", title: "大理慢游路线", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%A4%A7%E7%90%86%20%E6%85%A2%E6%B8%B8" }
    ]
  },
  "spot-hrb-ice": {
    description: "冬季活动集中，需关注天气和保暖，打卡效率较高。",
    openTime: "全天",
    ticket: "部分冰雪项目收费",
    bestDurationHours: 9,
    transportRating: 4.3,
    cityTraffic: "主城区地铁+打车可覆盖热门点",
    parking: "冬季高峰期需提前规划停车",
    highlights: ["中央大街", "冰雪大世界", "松花江"],
    defaultRoute: ["长春市", "哈尔滨市"],
    activityCosts: [
      { name: "冰雪大世界", amount: "328-420 元/人" },
      { name: "中央大街美食", amount: "50-160 元/人" },
      { name: "交通接驳", amount: "20-80 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "哈尔滨冬季打卡", url: "https://www.douyin.com/search/%E5%93%88%E5%B0%94%E6%BB%A8%20%E5%86%AC%E5%AD%A3" },
      { platform: "小红书", title: "冰雪大世界避坑", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%86%B0%E9%9B%AA%E5%A4%A7%E4%B8%96%E7%95%8C" }
    ]
  },
  "spot-bj-citywalk": {
    description: "中轴线景点密集，适合地铁串联，文化体验强。",
    openTime: "全天",
    ticket: "景点票价差异较大",
    bestDurationHours: 10,
    transportRating: 4.9,
    cityTraffic: "地铁覆盖高，步行友好",
    parking: "核心区停车成本偏高",
    highlights: ["故宫", "景山", "前门"],
    defaultRoute: ["天津市", "北京市"],
    activityCosts: [
      { name: "故宫/景山联票", amount: "80-120 元/人" },
      { name: "中轴线步行拍照", amount: "0-40 元/人" },
      { name: "特色正餐", amount: "70-200 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "北京中轴线一日游", url: "https://www.douyin.com/search/%E5%8C%97%E4%BA%AC%20%E4%B8%AD%E8%BD%B4%E7%BA%BF" },
      { platform: "小红书", title: "故宫路线", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%95%85%E5%AE%AB%20%E8%B7%AF%E7%BA%BF" }
    ]
  },
  "spot-cd-relax": {
    description: "景点与美食高度集中，适合 3-4 天沉浸式慢游。",
    openTime: "全天",
    ticket: "多数景点低门槛",
    bestDurationHours: 10,
    transportRating: 4.6,
    cityTraffic: "地铁+网约车衔接高效",
    parking: "商圈停车高峰紧张",
    highlights: ["宽窄巷子", "锦里", "春熙路"],
    defaultRoute: ["重庆市", "成都市"],
    activityCosts: [
      { name: "熊猫基地", amount: "55-120 元/人" },
      { name: "川菜/火锅", amount: "80-220 元/人" },
      { name: "夜游打卡", amount: "20-100 元/人" }
    ],
    videos: [
      { platform: "抖音", title: "成都三日游", url: "https://www.douyin.com/search/%E6%88%90%E9%83%BD%20%E4%B8%89%E6%97%A5%E6%B8%B8" },
      { platform: "小红书", title: "成都美食打卡", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%88%90%E9%83%BD%20%E7%BE%8E%E9%A3%9F" }
    ]
  }
};

const cityAttractions = {
  杭州市: {
    hot: [
      {
        name: "西湖",
        ticket: 0,
        bestHours: 4,
        traffic: "地铁+步行",
        image: "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=900&q=80",
        budgetHint: "骑行+简餐约 120 元",
        videos: [
          { platform: "抖音", title: "西湖一日游路线", url: "https://www.douyin.com/search/%E8%A5%BF%E6%B9%96%20%E4%B8%80%E6%97%A5%E6%B8%B8" },
          { platform: "小红书", title: "西湖拍照机位", url: "https://www.xiaohongshu.com/search_result?keyword=%E8%A5%BF%E6%B9%96%20%E6%8B%8D%E7%85%A7" }
        ]
      },
      {
        name: "灵隐寺",
        ticket: 75,
        bestHours: 2.5,
        traffic: "公交直达",
        image: "https://images.unsplash.com/photo-1603491656337-3b4911479179?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+交通约 110 元",
        videos: [{ platform: "抖音", title: "灵隐寺半日攻略", url: "https://www.douyin.com/search/%E7%81%B5%E9%9A%90%E5%AF%BA%20%E6%94%BB%E7%95%A5" }]
      },
      {
        name: "河坊街",
        ticket: 0,
        bestHours: 2,
        traffic: "地铁+步行",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80",
        budgetHint: "小吃+夜游约 90 元",
        videos: [{ platform: "小红书", title: "河坊街夜游清单", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%B2%B3%E5%9D%8A%E8%A1%97%20%E5%A4%9C%E6%B8%B8" }]
      },
      {
        name: "法喜寺",
        ticket: 10,
        bestHours: 1.8,
        traffic: "公交+步行",
        image: "https://images.unsplash.com/photo-1626834086793-27aa3ae59f68?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+饮品约 60 元",
        videos: [{ platform: "抖音", title: "法喜寺机位", url: "https://www.douyin.com/search/%E6%B3%95%E5%96%9C%E5%AF%BA%20%E6%9C%BA%E4%BD%8D" }]
      }
    ],
    landmark: ["西湖", "灵隐寺", "雷峰塔", "钱塘江"],
    hiddenFree: ["九溪烟树", "小河直街", "茅家埠"],
    photo: ["法喜寺", "满觉陇", "浴鹄湾"],
    food: ["河坊街", "胜利河美食街", "武林夜市"]
  },
  青岛市: {
    hot: [
      {
        name: "八大关",
        ticket: 0,
        bestHours: 2.5,
        traffic: "公交便利",
        image: "/assets/feeds/coast.svg",
        budgetHint: "交通+咖啡约 100 元",
        videos: [{ platform: "抖音", title: "八大关机位合集", url: "https://www.douyin.com/search/%E5%85%AB%E5%A4%A7%E5%85%B3%20%E6%9C%BA%E4%BD%8D" }]
      },
      {
        name: "小麦岛",
        ticket: 0,
        bestHours: 2,
        traffic: "打车+步行",
        image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80",
        budgetHint: "拍照+简餐约 80 元",
        videos: [{ platform: "小红书", title: "小麦岛日落指南", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%B0%8F%E9%BA%A6%E5%B2%9B%20%E6%97%A5%E8%90%BD" }]
      },
      {
        name: "栈桥",
        ticket: 0,
        bestHours: 1.5,
        traffic: "地铁+步行",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
        budgetHint: "海风散步 0 成本",
        videos: [{ platform: "抖音", title: "栈桥夜景", url: "https://www.douyin.com/search/%E6%A0%88%E6%A1%A5%20%E5%A4%9C%E6%99%AF" }]
      }
    ],
    landmark: ["栈桥", "八大关", "五四广场", "奥帆中心"],
    hiddenFree: ["燕儿岛公园", "小鱼山", "信号山公园"],
    photo: ["小麦岛", "奥帆中心", "大学路"],
    food: ["台东步行街", "劈柴院", "营口路海鲜"]
  },
  大理市: {
    hot: [
      {
        name: "洱海",
        ticket: 0,
        bestHours: 4,
        traffic: "城市内租车中转更高效",
        image: "/assets/feeds/erhai.svg",
        budgetHint: "城市内租车+油费约 220 元",
        videos: [{ platform: "抖音", title: "洱海环线攻略", url: "https://www.douyin.com/search/%E6%B4%B1%E6%B5%B7%20%E7%8E%AF%E7%BA%BF" }]
      },
      {
        name: "喜洲古镇",
        ticket: 0,
        bestHours: 2,
        traffic: "公交可达，班次较疏",
        image: "https://images.unsplash.com/photo-1629978009230-a2f7d6b0f6c1?auto=format&fit=crop&w=900&q=80",
        budgetHint: "交通+餐饮约 110 元",
        videos: [{ platform: "小红书", title: "喜洲古镇慢游", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%96%9C%E6%B4%B2%E5%8F%A4%E9%95%87" }]
      },
      {
        name: "双廊",
        ticket: 0,
        bestHours: 2.5,
        traffic: "打车或租车",
        image: "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?auto=format&fit=crop&w=900&q=80",
        budgetHint: "咖啡+打卡约 120 元",
        videos: [{ platform: "抖音", title: "双廊拍照路线", url: "https://www.douyin.com/search/%E5%8F%8C%E5%BB%8A%20%E6%8B%8D%E7%85%A7" }]
      }
    ],
    landmark: ["洱海", "双廊", "喜洲古镇", "大理古城"],
    hiddenFree: ["龙龛码头", "才村", "文笔村"],
    photo: ["海舌公园", "文笔村", "磻溪S湾"],
    food: ["人民路", "古城夜市", "喜洲老街"]
  },
  哈尔滨市: {
    hot: [
      {
        name: "中央大街",
        ticket: 0,
        bestHours: 2.5,
        traffic: "地铁+步行",
        image: "/assets/feeds/icecity.svg",
        budgetHint: "甜品+餐饮约 120 元",
        videos: [{ platform: "抖音", title: "中央大街夜景", url: "https://www.douyin.com/search/%E4%B8%AD%E5%A4%AE%E5%A4%A7%E8%A1%97%20%E5%A4%9C%E6%99%AF" }]
      },
      {
        name: "冰雪大世界",
        ticket: 328,
        bestHours: 4,
        traffic: "地铁+接驳",
        image: "https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+交通约 390 元",
        videos: [{ platform: "小红书", title: "冰雪大世界避坑", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%86%B0%E9%9B%AA%E5%A4%A7%E4%B8%96%E7%95%8C" }]
      },
      {
        name: "索菲亚教堂",
        ticket: 20,
        bestHours: 1.5,
        traffic: "公交+步行",
        image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+拍照约 60 元",
        videos: [{ platform: "抖音", title: "索菲亚教堂机位", url: "https://www.douyin.com/search/%E7%B4%A2%E8%8F%B2%E4%BA%9A%E6%95%99%E5%A0%82" }]
      }
    ],
    landmark: ["中央大街", "冰雪大世界", "索菲亚教堂"],
    hiddenFree: ["群力音乐公园", "防洪纪念塔", "太阳岛外滩"],
    photo: ["松花江岸", "老道外", "斯大林公园"],
    food: ["中央大街", "道里菜市场", "师大夜市"]
  },
  北京市: {
    hot: [
      {
        name: "故宫",
        ticket: 60,
        bestHours: 4,
        traffic: "地铁直达",
        image: "/assets/feeds/beijing.svg",
        budgetHint: "门票+讲解约 120 元",
        videos: [{ platform: "小红书", title: "故宫路线", url: "https://www.xiaohongshu.com/search_result?keyword=%E6%95%85%E5%AE%AB%20%E8%B7%AF%E7%BA%BF" }]
      },
      {
        name: "颐和园",
        ticket: 30,
        bestHours: 3,
        traffic: "地铁+公交",
        image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+交通约 80 元",
        videos: [{ platform: "抖音", title: "颐和园半日游", url: "https://www.douyin.com/search/%E9%A2%90%E5%92%8C%E5%9B%AD" }]
      },
      {
        name: "前门大街",
        ticket: 0,
        bestHours: 2,
        traffic: "地铁+步行",
        image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&w=900&q=80",
        budgetHint: "小吃+拍照约 90 元",
        videos: [{ platform: "抖音", title: "前门夜景", url: "https://www.douyin.com/search/%E5%89%8D%E9%97%A8%20%E5%A4%9C%E6%99%AF" }]
      }
    ],
    landmark: ["故宫", "颐和园", "前门", "天坛"],
    hiddenFree: ["国子监街", "亮马河", "奥森公园"],
    photo: ["角楼", "景山", "隆福寺"],
    food: ["牛街", "簋街", "王府井"]
  },
  成都市: {
    hot: [
      {
        name: "成都大熊猫基地",
        ticket: 55,
        bestHours: 3.5,
        traffic: "地铁+接驳",
        image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=900&q=80",
        budgetHint: "门票+接驳约 110 元",
        videos: [{ platform: "抖音", title: "熊猫基地攻略", url: "https://www.douyin.com/search/%E7%86%8A%E7%8C%AB%E5%9F%BA%E5%9C%B0" }]
      },
      {
        name: "宽窄巷子",
        ticket: 0,
        bestHours: 2,
        traffic: "地铁直达",
        image: "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?auto=format&fit=crop&w=900&q=80",
        budgetHint: "茶馆+小吃约 100 元",
        videos: [{ platform: "小红书", title: "宽窄巷子拍照", url: "https://www.xiaohongshu.com/search_result?keyword=%E5%AE%BD%E7%AA%84%E5%B7%B7%E5%AD%90" }]
      },
      {
        name: "锦里",
        ticket: 0,
        bestHours: 2,
        traffic: "地铁+步行",
        image: "https://images.unsplash.com/photo-1600412384817-8e03beccfd91?auto=format&fit=crop&w=900&q=80",
        budgetHint: "夜游+小吃约 90 元",
        videos: [{ platform: "抖音", title: "锦里夜游", url: "https://www.douyin.com/search/%E9%94%A6%E9%87%8C%20%E5%A4%9C%E6%B8%B8" }]
      }
    ],
    landmark: ["熊猫基地", "宽窄巷子", "锦里", "春熙路"],
    hiddenFree: ["望平街", "东郊记忆", "兴隆湖"],
    photo: ["太古里", "人民公园", "锦江夜景"],
    food: ["建设路", "奎星楼街", "玉林路"]
  }
};

const cityHotels = {
  杭州市: [
    {
      name: "西湖美居酒店",
      price: 320,
      tags: ["近西湖", "含早"],
      reason: "靠近西湖与地铁，方便西湖-灵隐寺联动。",
      videoUrl: "https://www.douyin.com/search/%E6%9D%AD%E5%B7%9E%20%E8%A5%BF%E6%B9%96%E7%BE%8E%E5%B1%85%E9%85%92%E5%BA%97"
    },
    {
      name: "如家精选",
      price: 220,
      tags: ["性价比", "地铁口"],
      reason: "预算友好，通勤效率高，适合学生模式。",
      videoUrl: "https://www.douyin.com/search/%E6%9D%AD%E5%B7%9E%20%E5%A6%82%E5%AE%B6%E7%B2%BE%E9%80%89"
    }
  ],
  大理市: [
    {
      name: "洱海轻奢民宿",
      price: 360,
      tags: ["海景", "停车方便"],
      reason: "靠近洱海环线，适合自驾/租车中转。",
      videoUrl: "https://www.douyin.com/search/%E5%A4%A7%E7%90%86%20%E6%B4%B1%E6%B5%B7%20%E6%B0%91%E5%AE%BF"
    },
    {
      name: "古城舒适酒店",
      price: 240,
      tags: ["近古城", "安静"],
      reason: "步行可达古城夜游区，晚上体验更好。",
      videoUrl: "https://www.douyin.com/search/%E5%A4%A7%E7%90%86%20%E5%8F%A4%E5%9F%8E%20%E9%85%92%E5%BA%97"
    }
  ],
  青岛市: [
    {
      name: "海景假日酒店",
      price: 380,
      tags: ["海景", "近商圈"],
      reason: "靠近海岸线与夜景打卡点，适合情侣或朋友出游。",
      videoUrl: "https://www.douyin.com/search/%E9%9D%92%E5%B2%9B%20%E6%B5%B7%E6%99%AF%20%E9%85%92%E5%BA%97"
    },
    {
      name: "地铁口青年酒店",
      price: 230,
      tags: ["交通便利", "经济型"],
      reason: "去八大关、栈桥通勤成本低，适合省钱优先。",
      videoUrl: "https://www.douyin.com/search/%E9%9D%92%E5%B2%9B%20%E9%9D%92%E5%B9%B4%20%E9%85%92%E5%BA%97"
    }
  ],
  哈尔滨市: [
    {
      name: "中央大街精选",
      price: 340,
      tags: ["近景点", "暖气稳定"],
      reason: "冬季出行保暖和步行可达性更稳定。",
      videoUrl: "https://www.douyin.com/search/%E5%93%88%E5%B0%94%E6%BB%A8%20%E4%B8%AD%E5%A4%AE%E5%A4%A7%E8%A1%97%20%E9%85%92%E5%BA%97"
    },
    {
      name: "高性价比快捷",
      price: 210,
      tags: ["经济", "地铁旁"],
      reason: "预算低、地铁接驳便捷，适合多人出行。",
      videoUrl: "https://www.douyin.com/search/%E5%93%88%E5%B0%94%E6%BB%A8%20%E5%BF%AB%E6%8D%B7%E9%85%92%E5%BA%97"
    }
  ],
  北京市: [
    {
      name: "前门精选酒店",
      price: 380,
      tags: ["地铁近", "景点密集"],
      reason: "前门-故宫中轴线串联效率高，节省通勤。",
      videoUrl: "https://www.douyin.com/search/%E5%8C%97%E4%BA%AC%20%E5%89%8D%E9%97%A8%20%E9%85%92%E5%BA%97"
    },
    {
      name: "青年旅舍双床房",
      price: 240,
      tags: ["经济型", "交通方便"],
      reason: "多人拼房成本低，适合学生模式。",
      videoUrl: "https://www.douyin.com/search/%E5%8C%97%E4%BA%AC%20%E9%9D%92%E5%B9%B4%E6%97%85%E8%88%8D"
    }
  ],
  成都市: [
    {
      name: "太古里轻奢酒店",
      price: 350,
      tags: ["商圈中心", "夜游方便"],
      reason: "夜游+美食路线集中，适合第一次来成都。",
      videoUrl: "https://www.douyin.com/search/%E6%88%90%E9%83%BD%20%E5%A4%AA%E5%8F%A4%E9%87%8C%20%E9%85%92%E5%BA%97"
    },
    {
      name: "宽窄巷子舒适酒店",
      price: 260,
      tags: ["性价比", "地铁口"],
      reason: "宽窄巷子步行可达，交通和预算平衡。",
      videoUrl: "https://www.douyin.com/search/%E6%88%90%E9%83%BD%20%E5%AE%BD%E7%AA%84%E5%B7%B7%E5%AD%90%20%E9%85%92%E5%BA%97"
    }
  ],
  default: [
    {
      name: "舒适型酒店",
      price: 220,
      tags: ["干净卫生"],
      reason: "靠近城市核心交通节点，通用性较强。",
      videoUrl: "https://www.douyin.com/search/%E9%85%92%E5%BA%97%20%E5%87%BA%E8%A1%8C"
    }
  ]
};

const cityFoods = {
  杭州市: [
    { name: "西湖醋鱼", price: 88, image: "https://source.unsplash.com/640x420/?hangzhou,food,fish" },
    { name: "龙井虾仁", price: 68, image: "https://source.unsplash.com/640x420/?shrimp,chinese,food" },
    { name: "片儿川", price: 25, image: "https://source.unsplash.com/640x420/?noodle,soup,chinese" }
  ],
  大理市: [
    { name: "乳扇", price: 25, image: "https://source.unsplash.com/640x420/?yunnan,snack,food" },
    { name: "饵块", price: 20, image: "https://source.unsplash.com/640x420/?rice,cake,food" },
    { name: "酸辣鱼", price: 78, image: "https://source.unsplash.com/640x420/?fish,soup,food" }
  ],
  青岛市: [
    { name: "海鲜锅贴", price: 48, image: "https://source.unsplash.com/640x420/?dumpling,seafood" },
    { name: "辣炒蛤蜊", price: 58, image: "https://source.unsplash.com/640x420/?clam,seafood,food" },
    { name: "青岛啤酒套餐", price: 68, image: "https://source.unsplash.com/640x420/?beer,food" }
  ],
  哈尔滨市: [
    { name: "红肠拼盘", price: 55, image: "https://source.unsplash.com/640x420/?sausage,platter" },
    { name: "锅包肉", price: 68, image: "https://source.unsplash.com/640x420/?fried,pork,chinese" },
    { name: "马迭尔冰棍", price: 8, image: "https://source.unsplash.com/640x420/?ice-cream,bar" }
  ],
  北京市: [
    { name: "北京烤鸭", price: 128, image: "https://source.unsplash.com/640x420/?peking,duck" },
    { name: "炸酱面", price: 28, image: "https://source.unsplash.com/640x420/?noodle,chinese,food" },
    { name: "卤煮", price: 35, image: "https://source.unsplash.com/640x420/?stew,chinese,food" }
  ],
  成都市: [
    { name: "成都火锅", price: 128, image: "https://source.unsplash.com/640x420/?hotpot,chinese" },
    { name: "担担面", price: 22, image: "https://source.unsplash.com/640x420/?spicy,noodle" },
    { name: "甜水面", price: 18, image: "https://source.unsplash.com/640x420/?noodle,bowl" }
  ],
  default: [{ name: "当地特色小吃", price: 30, image: "https://source.unsplash.com/640x420/?street-food,chinese" }]
};

const aliasMap = new Map(
  [
    "北京",
    "北京市",
    "北京省",
    "天津",
    "天津市",
    "上海",
    "上海市",
    "重庆",
    "重庆市",
    "杭州",
    "杭州市",
    "浙江",
    "浙江省",
    "青岛",
    "青岛市",
    "山东",
    "山东省",
    "大理",
    "大理市",
    "云南",
    "云南省",
    "哈尔滨",
    "哈尔滨市",
    "黑龙江",
    "黑龙江省",
    "成都",
    "成都市",
    "四川",
    "四川省"
  ].map((raw) => [raw, raw])
);

function normalizeRegionText(input) {
  return String(input || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/(省|市|自治区|特别行政区|地区|州)$/u, "");
}

function isProvinceLike(input) {
  return /(省|自治区|特别行政区)$/u.test(String(input || "").trim());
}

function canonicalizeCity(name) {
  const input = String(name || "").trim();
  if (!input) return "";
  if (cityAttractions[input]) return input;

  const stripped = normalizeRegionText(input);
  const candidates = Object.keys(cityAttractions);
  const direct = candidates.find((city) => normalizeRegionText(city) === stripped);
  if (direct) return direct;

  for (const [alias] of aliasMap) {
    if (normalizeRegionText(alias) === stripped) {
      const found = candidates.find((city) => normalizeRegionText(city).includes(stripped) || stripped.includes(normalizeRegionText(city)));
      if (found) return found;
    }
  }

  const fuzzy = candidates.find((city) => city.includes(stripped) || stripped.includes(normalizeRegionText(city)));
  if (fuzzy) return fuzzy;
  return input.endsWith("市") ? input : `${input}市`;
}

function defaultHotSpots(city) {
  const c = canonicalizeCity(city);
  return [
    {
      name: `${c}城市地标`,
      ticket: 0,
      bestHours: 2,
      traffic: "地铁/公交可达",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=900&q=80",
      budgetHint: "城市慢游 0-80 元",
      videos: [{ platform: "抖音", title: `${c}城市打卡`, url: `https://www.douyin.com/search/${encodeURIComponent(c)}%20%E6%89%93%E5%8D%A1` }]
    },
    {
      name: `${c}热门商圈`,
      ticket: 0,
      bestHours: 2.5,
      traffic: "地铁/步行",
      image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=900&q=80",
      budgetHint: "餐饮+拍照 60-180 元",
      videos: [{ platform: "小红书", title: `${c}热门商圈攻略`, url: `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(c)}%20%E5%95%86%E5%9C%88` }]
    },
    {
      name: `${c}自然景观`,
      ticket: 20,
      bestHours: 3,
      traffic: "公交/打车",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
      budgetHint: "门票+交通 60-150 元",
      videos: [{ platform: "抖音", title: `${c}自然风景`, url: `https://www.douyin.com/search/${encodeURIComponent(c)}%20%E9%A3%8E%E6%99%AF` }]
    }
  ];
}

function ensureCityAttractions(city) {
  const normalized = canonicalizeCity(city);
  const base = cityAttractions[normalized];
  if (base && Array.isArray(base.hot) && base.hot.length) return base;
  return {
    hot: defaultHotSpots(city),
    landmark: [`${normalized}地标`, `${normalized}历史街区`, `${normalized}夜景区`],
    hiddenFree: [`${normalized}滨水步道`, `${normalized}公园`, `${normalized}老街`],
    photo: [`${normalized}观景台`, `${normalized}咖啡街`, `${normalized}文化区`],
    food: [`${normalized}美食街`, `${normalized}夜市`, `${normalized}本地小吃区`]
  };
}

function normalizeCityInput(name) {
  return canonicalizeCity(name);
}

function resolveRemoteImageByCity(city, fallback = "") {
  const normalized = canonicalizeCity(city);
  const map = {
    杭州市: "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=1200&q=80",
    青岛市: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
    大理市: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&w=1200&q=80",
    哈尔滨市: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
    北京市: "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
    成都市: "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?auto=format&fit=crop&w=1200&q=80",
    上海市: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80",
    厦门市: "https://images.unsplash.com/photo-1526481280695-3c4698f6638f?auto=format&fit=crop&w=1200&q=80",
    重庆市: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    西安市: "https://images.unsplash.com/photo-1547981609-4b6bf67dbf57?auto=format&fit=crop&w=1200&q=80",
    广州市: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    深圳市: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80",
    昆明市: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    长沙市: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
  };
  return map[normalized] || fallback;
}

function normalizeSpotImage(image, city) {
  const src = String(image || "").trim();
  if (/^https?:\/\//u.test(src)) return src;
  return resolveRemoteImageByCity(city, "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1200&q=80");
}

function buildFallbackSpotDetail(card) {
  return {
    description: `${card.city}热门线路，适合 2-3 天灵活打卡。`,
    openTime: "全天",
    ticket: "部分景点收费，以现场公示为准",
    bestDurationHours: 8,
    transportRating: 4.5,
    cityTraffic: "地铁/公交/网约车组合可覆盖主要点位",
    parking: "热门时段停车较紧张，建议错峰",
    highlights: [`${card.city}地标`, "拍照出片点", "夜游路线"],
    defaultRoute: ["上海市", card.city],
    activityCosts: [
      { name: "地标景点打卡", amount: "30-120 元/人" },
      { name: "城市交通与接驳", amount: "20-100 元/人" },
      { name: "特色餐饮", amount: "60-220 元/人" }
    ],
    videos: [{ platform: "抖音", title: `${card.title}参考`, url: `https://www.douyin.com/search/${encodeURIComponent(card.title)}` }]
  };
}

function getFeed({ season = "all", kind = "all", tag = "推荐" } = {}) {
  const merged = [...feedCards, ...extendedFeedCards];
  const filtered = merged.filter((item) => {
    const seasonPass = season === "all" || item.season === season || item.season === "all";
    const kindPass = kind === "all" || item.kind === kind;
    const tagPass = tag === "all" || tag === "推荐" || (item.tags || []).includes(tag);
    return seasonPass && kindPass && tagPass;
  });
  return filtered.map((item) => ({
    ...item,
    image: normalizeSpotImage(item.image, item.city)
  }));
}

function getSpotDetail(id) {
  const allCards = [...feedCards, ...extendedFeedCards];
  const card = allCards.find((item) => item.id === id);
  if (!card) return null;
  return {
    ...card,
    image: normalizeSpotImage(card.image, card.city),
    ...(detailById[id] || buildFallbackSpotDetail(card))
  };
}

function getCityAttractions(city) {
  const base = ensureCityAttractions(city);
  return {
    ...base,
    hot: (base.hot || []).map((spot) => ({
      ...spot,
      image: normalizeSpotImage(spot.image, city)
    }))
  };
}

function getCityHotels(city) {
  const normalized = normalizeCityInput(city);
  return cityHotels[normalized] || cityHotels.default;
}

function getCityFoods(city) {
  const normalized = normalizeCityInput(city);
  return cityFoods[normalized] || cityFoods.default;
}

function modeProsCons(mode) {
  if (mode === "rail") {
    return {
      pros: ["准点率高", "价格稳定", "可提供沿途观景位置建议"],
      cons: ["节假日余票紧张", "末端接驳可能耗时"],
      noRecommendWhen: "城市间跨度特别大且衔接时间极紧时不优先。"
    };
  }
  if (mode === "air") {
    return {
      pros: ["长距离跨城速度快", "适合多城远距串联", "整体节省跨城时间"],
      cons: ["机场往返耗时", "价格波动明显"],
      noRecommendWhen: "短距离城市串联时，机场流程会拉高总时间。"
    };
  }
  if (mode === "privateCar") {
    return {
      pros: ["行程自由度高", "行李携带更方便"],
      cons: ["连续驾驶疲劳", "需处理停车与限行"],
      noRecommendWhen: "单人长途跨城且驾驶时间过长时不推荐。"
    };
  }
  return {
    pros: ["适合同城多景点高效中转", "可灵活调整游玩顺序", "末端接驳效率高"],
    cons: ["不建议作为跨城主交通", "存在取还车流程成本"],
    noRecommendWhen: "仅推荐用于目标城市内部中转，不做跨城主方案。"
  };
}

function resolveTravelPreference(preference) {
  const p = String(preference || "balanced");
  if (p === "saveTime") return { cost: 0.2, time: 0.5, comfort: 0.3, label: "效率优先" };
  if (p === "saveMoney") return { cost: 0.55, time: 0.2, comfort: 0.25, label: "省钱优先" };
  if (p === "comfort") return { cost: 0.2, time: 0.25, comfort: 0.55, label: "舒适优先" };
  return { cost: 0.34, time: 0.33, comfort: 0.33, label: "均衡优先" };
}

function minMaxNormalize(value, min, max, reverse = false) {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return 0.5;
  const ratio = (value - min) / (max - min);
  const clamped = Math.max(0, Math.min(1, ratio));
  return reverse ? 1 - clamped : clamped;
}

function rankModeRecommendations(modeSummary, travelPreference) {
  const pref = resolveTravelPreference(travelPreference);
  const costs = modeSummary.map((x) => x.costPerPerson);
  const times = modeSummary.map((x) => x.etaHours);
  const comforts = modeSummary.map((x) => (x.comfortScore || 6 + Number(x.etaHours < 6)));

  const costMin = Math.min(...costs);
  const costMax = Math.max(...costs);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const comfortMin = Math.min(...comforts);
  const comfortMax = Math.max(...comforts);

  const ranked = modeSummary
    .map((item) => {
      const costScore = minMaxNormalize(item.costPerPerson, costMin, costMax, true);
      const timeScore = minMaxNormalize(item.etaHours, timeMin, timeMax, true);
      const comfortScore = minMaxNormalize(item.comfortScore || 6, comfortMin, comfortMax, false);
      const recommendScore = Number((costScore * pref.cost + timeScore * pref.time + comfortScore * pref.comfort).toFixed(3));
      return {
        ...item,
        recommendScore,
        scoreBreakdown: { costScore, timeScore, comfortScore }
      };
    })
    .sort((a, b) => b.recommendScore - a.recommendScore);

  return {
    preferenceLabel: pref.label,
    ranked
  };
}

function sumDistance(cities, matrix = {}) {
  let total = 0;
  for (let i = 0; i < cities.length - 1; i += 1) {
    const a = cities[i];
    const b = cities[i + 1];
    total += matrix[`${a}-${b}`] || matrix[`${b}-${a}`] || 280;
  }
  return total;
}

function scenicWindowBySegment(index) {
  const side = index % 2 === 0 ? "左侧靠窗" : "右侧靠窗";
  const scenic = ["山景", "田园", "江河", "峡谷"][index % 4];
  return {
    scenicType: scenic,
    bestCarriage: `推荐 ${Math.min(16, 4 + index)} 号车厢`,
    bestSeat: side,
    bestTime: `${String(8 + index).padStart(2, "0")}:20-${String(9 + index).padStart(2, "0")}:30`
  };
}

function parseHour(time) {
  const txt = String(time || "").trim();
  const matched = /^([01]?\d|2[0-3]):([0-5]\d)$/u.exec(txt);
  if (!matched) return 9;
  return Number(matched[1]);
}

function toHHmm(hour, minute) {
  const h = ((hour % 24) + 24) % 24;
  const m = ((minute % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function createSchedule(baseHour, count, stepMinutes) {
  const list = [];
  for (let i = -Math.floor(count / 2); i <= Math.floor(count / 2); i += 1) {
    const offset = i * stepMinutes;
    const totalMin = baseHour * 60 + offset;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    list.push(toHHmm(h, m));
  }
  return list;
}

function buildTrainOptions(distanceKm, baseHour, segIndex) {
  const depSlots = createSchedule(baseHour, 9, 30);
  return depSlots.map((depart, i) => {
    const duration = Number((distanceKm / 260 + 0.4 + (i % 3) * 0.1).toFixed(1));
    const arriveHour = parseHour(depart) + Math.floor(duration);
    const arriveMin = Math.round((duration % 1) * 60);
    const baseFare = Math.max(45, Math.round(distanceKm * 0.36));
    const seatServiceFee = 8 + (i % 3) * 2;
    const dynamicAdjust = (i % 4) * 6;
    const price = baseFare + seatServiceFee + dynamicAdjust;
    return {
      no: `${i % 2 === 0 ? "G" : "D"}${130 + segIndex * 40 + i * 3}`,
      depart,
      arrive: toHHmm(arriveHour, arriveMin),
      durationHours: duration,
      price,
      remain: Math.max(0, 30 - i * 2),
      source: "estimated",
      realtime: false,
      priceBreakdown: {
        baseFare,
        seatServiceFee,
        dynamicAdjust
      }
    };
  });
}

function buildFlightOptions(distanceKm, baseHour, segIndex) {
  const depSlots = createSchedule(baseHour + 1, 7, 40);
  return depSlots.map((depart, i) => {
    const duration = Number((distanceKm / 700 + 0.9 + (i % 2) * 0.1).toFixed(1));
    const arriveHour = parseHour(depart) + Math.floor(duration);
    const arriveMin = Math.round((duration % 1) * 60);
    const baseFare = Math.max(260, Math.round(distanceKm * 0.72));
    const airportTax = 50;
    const fuelSurcharge = Math.max(20, Math.round(distanceKm * 0.04));
    const serviceFee = 20 + (i % 3) * 10;
    return {
      no: `${i % 2 === 0 ? "MU" : "CZ"}${3200 + segIndex * 50 + i * 7}`,
      depart,
      arrive: toHHmm(arriveHour, arriveMin),
      durationHours: duration,
      price: baseFare + airportTax + fuelSurcharge + serviceFee,
      remain: Math.max(0, 18 - i),
      baggage: "20kg",
      source: "estimated",
      realtime: false,
      priceBreakdown: {
        baseFare,
        airportTax,
        fuelSurcharge,
        serviceFee
      }
    };
  });
}

function buildSegmentOptions(cities, matrix = {}, preferredTime = "09:00", payload = {}) {
  const list = [];
  const baseHour = parseHour(preferredTime);
  const days = Math.max(1, Number(payload.days || 1));
  const travelers = Math.max(1, Number(payload.travelers || 1));
  for (let i = 0; i < cities.length - 1; i += 1) {
    const from = cities[i];
    const to = cities[i + 1];
    const distanceKm = matrix[`${from}-${to}`] || matrix[`${to}-${from}`] || 280;
    const scenic = scenicWindowBySegment(i);
    const trains = buildTrainOptions(distanceKm, baseHour + i, i);
    const flights = buildFlightOptions(distanceKm, baseHour + i, i);
    const fuel = Math.round(distanceKm * 0.085 * 8.2);
    const toll = Math.round(distanceKm * 0.45);
    const parking = Math.round((days * 45) / Math.max(1, cities.length - 1));
    const driveCost = fuel + toll + parking;
    list.push({
      segment: `${from}-${to}`,
      from,
      to,
      distanceKm,
      isReturn: i === cities.length - 2 && to === cities[0] && cities.length > 2,
      driveEstimate: {
        fuel,
        toll,
        parking,
        totalCost: driveCost,
        perPersonCost: Math.round(driveCost / travelers),
        durationHours: Number((distanceKm / 78).toFixed(1))
      },
      rail: {
        scenic,
        tickets: trains
      },
      air: {
        flights
      },
      dataSource: {
        rail: "estimated",
        air: "estimated",
        road: "estimated"
      }
    });
  }
  return list;
}

function getTransportOptions(payload) {
  const cities = (payload.cities || []).map((c) => canonicalizeCity(c));
  const withReturn = Boolean(payload.returnToDeparture) && cities.length > 1 && cities[cities.length - 1] !== cities[0];
  const routeCities = withReturn ? [...cities, cities[0]] : cities;
  const totalDistance = sumDistance(routeCities, payload.distanceMatrix || {});
  const isLongCrossCity = totalDistance > 900;
  const hasSparseTransit = Boolean(payload.publicTransitSparse) || Number(payload.lastMileHours || 0) > 1;
  const preference = payload.travelPreference || "balanced";

  const modeSummary = [
    {
      mode: "rail",
      label: "高铁公共交通",
      etaHours: Number((totalDistance / 220 + routeCities.length * 0.8).toFixed(1)),
      costPerPerson: Math.round(totalDistance * 0.42),
      comfortScore: 7.2,
      recommendReason: "准点率高，综合性价比稳定，适合中短程跨城。",
      ...modeProsCons("rail")
    },
    {
      mode: "air",
      label: "飞机优先",
      etaHours: Number((totalDistance / 700 + routeCities.length * 2.2).toFixed(1)),
      costPerPerson: Math.round(Math.max(380, totalDistance * 0.9)),
      comfortScore: 8.1,
      recommendReason: "长距离跨城节省时间，适合城市间跨度大场景。",
      ...modeProsCons("air")
    },
    {
      mode: "privateCar",
      label: "自有车自驾",
      etaHours: Number((totalDistance / 78 + routeCities.length * 0.9).toFixed(1)),
      costPerPerson: Math.round((totalDistance * 0.7 + Math.max(1, payload.days || 1) * 45) / Math.max(1, payload.travelers || 1)),
      comfortScore: 7.8,
      recommendReason: "自由度高，适合行李多和路线灵活需求。",
      ...modeProsCons("privateCar")
    },
    {
      mode: "rentalCar",
      label: "城市内租车中转",
      etaHours: Number((routeCities.length * 1.3).toFixed(1)),
      costPerPerson: Math.round((220 * Math.max(1, payload.days || 1)) / Math.max(1, payload.travelers || 1)),
      comfortScore: 7.5,
      recommendReason: "主要用于目标城市内多景点接驳，减少折返。",
      ...modeProsCons("rentalCar")
    }
  ];

  const crossCityCandidates = modeSummary.filter((x) => x.mode !== "rentalCar");
  const ranked = rankModeRecommendations(crossCityCandidates, preference);
  const recommendedMainMode = ranked.ranked[0]?.mode || (isLongCrossCity ? "air" : "rail");
  const recommendedReason = `基于${ranked.preferenceLabel}计算，当前推荐 ${ranked.ranked[0]?.label || "高铁"}。租车中转仅用于城市内接驳。`;

  const rentalCityShuttleSuggestion = hasSparseTransit
    ? "建议在目标城市内使用租车中转多个景点，不建议作为跨城主交通。"
    : "当前公共交通可满足大部分接驳需求，可按需选择是否租车中转。";

  return {
    recommendedMainMode,
    recommendedReason,
    preferenceLabel: ranked.preferenceLabel,
    topRecommendations: ranked.ranked.slice(0, 3).map((x, idx) => ({
      rank: idx + 1,
      mode: x.mode,
      label: x.label,
      score: x.recommendScore,
      etaHours: x.etaHours,
      costPerPerson: x.costPerPerson
    })),
    rentalCityShuttleSuggestion,
    modeSummary: [...ranked.ranked, ...modeSummary.filter((x) => x.mode === "rentalCar")],
    segmentOptions: buildSegmentOptions(routeCities, payload.distanceMatrix || {}, payload.preferredDepartureTime || "09:00", payload),
    routeCities,
    includeReturnSegment: withReturn,
    dataSource: {
      rail: "estimated",
      air: "estimated",
      road: "estimated"
    }
  };
}

module.exports = {
  getFeed,
  getSpotDetail,
  getCityAttractions,
  getCityHotels,
  getCityFoods,
  getTransportOptions,
  normalizeCityInput,
  canonicalizeCity,
  isProvinceLike
};
