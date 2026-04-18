
    (function () {
      const SPOT_DB = [
        { id: 1, name: "西湖", city: "杭州", province: "浙江", imgs: ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=900&q=80"], tags: ["经典", "免费"], filter: ["推荐", "春季", "都市"], duration: 4, ticket: 0, transport: 5, desc: "世界文化遗产，适合轻松慢游。" },
        { id: 2, name: "灵隐寺", city: "杭州", province: "浙江", imgs: ["https://images.unsplash.com/photo-1603491656337-3b4911479179?auto=format&fit=crop&w=900&q=80"], tags: ["寺庙", "祈福"], filter: ["推荐", "春季"], duration: 2, ticket: 75, transport: 4, desc: "千年古刹，杭州热门文化景点。" },
        { id: 3, name: "八大关", city: "青岛", province: "山东", imgs: ["https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80"], tags: ["海边", "拍照"], filter: ["推荐", "海边", "都市"], duration: 2.5, ticket: 0, transport: 5, desc: "海边街区建筑群，日落出片。" },
        { id: 4, name: "小麦岛", city: "青岛", province: "山东", imgs: ["https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80"], tags: ["海边", "日落"], filter: ["海边"], duration: 2, ticket: 0, transport: 4, desc: "海岸草坪与落日视野绝佳。" },
        { id: 5, name: "洱海", city: "大理", province: "云南", imgs: ["https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80"], tags: ["湖景", "骑行"], filter: ["推荐", "山野", "春季"], duration: 4, ticket: 0, transport: 3, desc: "风花雪月代表景观，适合城市内租车中转。" },
        { id: 6, name: "喜洲古镇", city: "大理", province: "云南", imgs: ["https://images.unsplash.com/photo-1629978009230-a2f7d6b0f6c1?auto=format&fit=crop&w=900&q=80"], tags: ["古镇"], filter: ["古城", "山野"], duration: 2, ticket: 0, transport: 3, desc: "白族古镇，慢游体验好。" },
        { id: 7, name: "中央大街", city: "哈尔滨", province: "黑龙江", imgs: ["https://images.unsplash.com/photo-1541535881962-3bb380b08458?auto=format&fit=crop&w=900&q=80"], tags: ["都市", "夜景"], filter: ["推荐", "都市"], duration: 2.5, ticket: 0, transport: 5, desc: "冰城城市名片，夜景优质。" },
        { id: 8, name: "冰雪大世界", city: "哈尔滨", province: "黑龙江", imgs: ["https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=900&q=80"], tags: ["冬季"], filter: ["推荐", "都市"], duration: 4, ticket: 328, transport: 4, desc: "冬季热门目的地，建议提前预约。" },
        { id: 9, name: "拙政园", city: "苏州", province: "江苏", imgs: ["https://images.unsplash.com/photo-1582561424760-19e1b4c8e3d2?auto=format&fit=crop&w=900&q=80"], tags: ["园林"], filter: ["古城", "推荐"], duration: 2.5, ticket: 80, transport: 5, desc: "江南园林代表景点。" },
        { id: 10, name: "平江路", city: "苏州", province: "江苏", imgs: ["https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80"], tags: ["古街"], filter: ["古城"], duration: 2, ticket: 0, transport: 5, desc: "古城慢生活街区。" },
        { id: 11, name: "夫子庙秦淮河", city: "南京", province: "江苏", imgs: ["https://images.unsplash.com/photo-1581337201117-3c5b4d7c1f6a?auto=format&fit=crop&w=900&q=80"], tags: ["夜景", "美食"], filter: ["推荐", "都市"], duration: 2, ticket: 0, transport: 5, desc: "夜游体验好，配套成熟。" },
        { id: 12, name: "黄山风景区", city: "黄山", province: "安徽", imgs: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80"], tags: ["山野"], filter: ["推荐", "山野", "春季"], duration: 8, ticket: 190, transport: 3, desc: "云海和日出经典线路。" }
      ];

      const INTERCITY = {
        "南京-杭州": { km: 280, trainH: 1.5, price: 120, scenic: true, bestSeat: "左侧靠窗", desc: "宁杭高铁，太湖沿岸", trains: [{ id: "G7351", depart: "08:30", arrive: "10:00", price: 120, left: 23 }, { id: "G7353", depart: "09:45", arrive: "11:15", price: 120, left: 8 }] },
        "杭州-黄山": { km: 210, trainH: 1.5, price: 80, scenic: true, bestSeat: "右侧靠窗", desc: "杭黄高铁，富春江风景段", trains: [{ id: "D5577", depart: "10:20", arrive: "12:05", price: 80, left: 15 }] },
        "杭州-苏州": { km: 160, trainH: 1.1, price: 78, scenic: false, trains: [{ id: "G7542", depart: "09:10", arrive: "10:18", price: 78, left: 12 }] },
        "苏州-南京": { km: 220, trainH: 1.2, price: 95, scenic: false, trains: [{ id: "G7028", depart: "13:10", arrive: "14:20", price: 95, left: 16 }] },
        "上海-杭州": { km: 180, trainH: 1.0, price: 80, scenic: false, trains: [{ id: "G7305", depart: "08:00", arrive: "08:58", price: 80, left: 20 }] },
        "北京-上海": { km: 1200, trainH: 4.6, price: 550, scenic: false, trains: [{ id: "G1", depart: "09:00", arrive: "13:36", price: 550, left: 36 }] }
      };

      const HOTELS = {
        "杭州": [{ name: "西湖美居酒店", price: 320, tags: ["近西湖", "含早"] }, { name: "如家精选", price: 220, tags: ["性价比", "地铁口"] }],
        "黄山": [{ name: "黄山白云宾馆", price: 580, tags: ["山顶", "观日出"] }, { name: "汤口镇民宿", price: 180, tags: ["山脚", "接驳车"] }],
        "青岛": [{ name: "海景假日酒店", price: 380, tags: ["海景", "近商圈"] }, { name: "地铁口青年酒店", price: 230, tags: ["交通便利"] }],
        "大理": [{ name: "洱海轻奢民宿", price: 360, tags: ["海景", "停车方便"] }, { name: "古城舒适酒店", price: 240, tags: ["近古城"] }],
        "default": [{ name: "舒适型酒店", price: 220, tags: ["干净卫生"] }]
      };

      const FOODS = {
        "杭州": [{ name: "西湖醋鱼", price: 88 }, { name: "龙井虾仁", price: 68 }, { name: "片儿川", price: 25 }],
        "黄山": [{ name: "毛豆腐", price: 30 }, { name: "臭鳜鱼", price: 98 }, { name: "徽州烧饼", price: 10 }],
        "青岛": [{ name: "辣炒蛤蜊", price: 58 }, { name: "海鲜锅贴", price: 48 }],
        "大理": [{ name: "乳扇", price: 25 }, { name: "酸辣鱼", price: 78 }],
        "default": [{ name: "当地特色小吃", price: 30 }]
      };

      function getIntercity(a, b) {
        const k = `${a}-${b}`;
        const r = `${b}-${a}`;
        return INTERCITY[k] || INTERCITY[r] || { km: 300, trainH: 2, price: 120, scenic: false, trains: [] };
      }

      function fmtMoney(n) {
        return `¥${Math.round(Number(n || 0))}`;
      }

      const app = {
        currentFilter: "推荐",
        currentStep: 1,
        startCity: "南京",
        destCities: ["杭州", "黄山"],
        startDate: "2026-05-01",
        days: 5,
        people: 2,
        budget: 5000,
        student: false,
        selectedSpots: {},
        selectedTransportMode: {},
        selectedTrains: {},
        selectedFoods: {},
        selectedHotel: {},
        customSpots: [],
        costItems: [],
        currentDetailSpot: null,

        init() {
          this.renderFeed();
          this.loadHistory();
        },
        showView(id) {
          document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
          document.getElementById(id).classList.add("active");
          if (id === "historyView") this.renderHistoryList();
        },
        backToHome() {
          this.showView("homeView");
        },
        toast(msg) {
          const t = document.getElementById("toast");
          t.textContent = msg;
          t.classList.add("show");
          setTimeout(() => t.classList.remove("show"), 1800);
        },
        setFilter(filter) {
          this.currentFilter = filter;
          document.querySelectorAll(".chip").forEach((el) => el.classList.toggle("active", el.dataset.filter === filter));
          this.renderFeed();
        },
        renderFeed() {
          const list = SPOT_DB.filter((s) => s.filter.includes(this.currentFilter));
          const html = list
            .map(
              (spot) => `
                <div class="spot-card" onclick="app.openDetail(${spot.id})">
                  <div class="card-img" style="background-image:url('${spot.imgs[0]}')"></div>
                  <div class="card-info">
                    <div class="card-title">${spot.name}</div>
                    <div class="card-tags">${spot.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
                    <div class="price">${spot.ticket ? fmtMoney(spot.ticket) : "免费"}</div>
                  </div>
                </div>
              `
            )
            .join("");
          document.getElementById("feedContainer").innerHTML = html || '<div class="empty-msg" style="grid-column:span 2">暂无该分类景点</div>';
        },
        openDetail(id) {
          const spot = SPOT_DB.find((x) => x.id === id);
          if (!spot) return;
          this.currentDetailSpot = spot;
          const gallery = spot.imgs.map((img) => `<div class="gallery-img" style="background-image:url('${img}')"></div>`).join("");
          document.getElementById("detailContent").innerHTML = `
            <div class="step-card">
              <div class="card-img" style="height:230px;border-radius:16px;background-image:url('${spot.imgs[0]}')"></div>
              <h2 style="margin-top:10px">${spot.name}</h2>
              <div class="card-tags" style="margin-top:8px">
                <span class="tag">📍 ${spot.city}</span>
                <span class="tag">⏱ ${spot.duration}h</span>
                <span class="tag">🎫 ${spot.ticket ? fmtMoney(spot.ticket) : "免费"}</span>
              </div>
              <p style="margin-top:8px;line-height:1.6">${spot.desc}</p>
              <div class="img-gallery">${gallery}</div>
            </div>
          `;
          document.getElementById("startPlanFromDetailBtn").onclick = () => this.startPlanFromDetail(spot);
          this.showView("detailView");
        },
        startPlanFromDetail(spot) {
          this.destCities = [spot.city];
          this.selectedSpots = { [spot.city]: new Set([spot.name]) };
          this.selectedFoods = {};
          this.selectedHotel = {};
          this.resetPlanState();
          this.showView("planView");
          this.renderPlanStep(1);
        },
        startCustomPlan() {
          this.destCities = ["杭州"];
          this.selectedSpots = {};
          this.selectedFoods = {};
          this.selectedHotel = {};
          this.resetPlanState();
          this.showView("planView");
          this.renderPlanStep(1);
        },
        resetPlanState() {
          this.currentStep = 1;
          this.selectedTransportMode = {};
          this.selectedTrains = {};
          this.costItems = [];
        },
        renderPlanStep(step) {
          this.currentStep = step;
          const container = document.getElementById("planStepContainer");
          if (step === 1) container.innerHTML = this.step1HTML();
          else if (step === 2) container.innerHTML = this.step2HTML();
          else if (step === 3) container.innerHTML = this.step3HTML();
          else if (step === 4) container.innerHTML = this.step4FoodHTML();
          else if (step === 5) container.innerHTML = this.step5CostHTML();
        },
        step1HTML() {
          const citiesHtml = this.destCities
            .map((c, i) => `<div class="cost-line"><span><i class="fas fa-grip-lines"></i> ${c}</span><i class="fas fa-trash" onclick="app.removeDestCity(${i})"></i></div>`)
            .join("");
          return `
            <div class="step-card">
              <h3>① 基础信息</h3>
              <label>出发地（城市/省份）</label>
              <input id="startCityInput" class="input-field" value="${this.startCity}" placeholder="如：南京" oninput="app.showCitySuggestions('start')" />
              <div id="startSuggestions" class="suggestion-list"></div>

              <label>目的地（按顺序）</label>
              ${citiesHtml}
              <div class="flex-row">
                <input id="newCityInput" class="input-field" placeholder="添加城市" oninput="app.showCitySuggestions('dest')" />
                <button class="btn btn-outline btn-sm" onclick="app.addDestCity()">添加</button>
              </div>
              <div id="destSuggestions" class="suggestion-list"></div>

              <div class="flex-row">
                <div style="flex:1">
                  <label>出发日期</label>
                  <input id="startDateInput" type="date" class="input-field" value="${this.startDate}" />
                </div>
                <div style="flex:1">
                  <label>天数</label>
                  <input id="daysInput" type="number" class="input-field" value="${this.days}" />
                </div>
              </div>
              <div class="flex-row">
                <div style="flex:1">
                  <label>人数</label>
                  <input id="peopleInput" type="number" class="input-field" value="${this.people}" />
                </div>
                <div style="flex:1">
                  <label>预算（元）</label>
                  <input id="budgetInput" type="number" class="input-field" value="${this.budget}" />
                </div>
              </div>
              <label><input id="studentCheck" type="checkbox" ${this.student ? "checked" : ""} /> 学生模式</label>
              <button class="btn" onclick="app.goToStep(2)">下一步：城际交通</button>
            </div>
          `;
        },
        showCitySuggestions(type) {
          const input = document.getElementById(type === "start" ? "startCityInput" : "newCityInput");
          const listDiv = document.getElementById(type === "start" ? "startSuggestions" : "destSuggestions");
          const q = input.value.trim().toLowerCase();
          if (!q) return (listDiv.innerHTML = "");
          const set = new Set();
          SPOT_DB.forEach((s) => {
            if (s.city.toLowerCase().includes(q) || s.province.toLowerCase().includes(q)) set.add(s.city);
          });
          const arr = [...set].slice(0, 8);
          listDiv.innerHTML = arr.length
            ? arr.map((m) => `<div class="suggestion-item" onclick="app.selectSuggestion('${type}','${m}')">${m}</div>`).join("")
            : `<div class="suggestion-item">未找到，支持手动输入</div>`;
        },
        selectSuggestion(type, value) {
          if (type === "start") {
            document.getElementById("startCityInput").value = value;
            this.startCity = value;
          } else {
            document.getElementById("newCityInput").value = value;
          }
          document.getElementById(type === "start" ? "startSuggestions" : "destSuggestions").innerHTML = "";
        },
        addDestCity() {
          const input = document.getElementById("newCityInput");
          const city = input.value.trim();
          if (!city) return;
          if (!this.destCities.includes(city)) this.destCities.push(city);
          input.value = "";
          this.renderPlanStep(1);
        },
        removeDestCity(i) {
          this.destCities.splice(i, 1);
          this.renderPlanStep(1);
        },
        goToStep(step) {
          if (step === 2) {
            this.startCity = document.getElementById("startCityInput").value.trim() || this.startCity;
            this.startDate = document.getElementById("startDateInput").value || this.startDate;
            this.days = Math.max(1, parseInt(document.getElementById("daysInput").value || "1", 10));
            this.people = Math.max(1, parseInt(document.getElementById("peopleInput").value || "1", 10));
            this.budget = Math.max(0, parseFloat(document.getElementById("budgetInput").value || "0"));
            this.student = document.getElementById("studentCheck").checked;
          }
          this.renderPlanStep(step);
        },
        step2HTML() {
          let html = `<div class="step-card"><h3>② 城际交通规划</h3>`;
          let totalHours = 0;
          let totalCost = 0;
          for (let i = 0; i < this.destCities.length; i += 1) {
            const from = i === 0 ? this.startCity : this.destCities[i - 1];
            const to = this.destCities[i];
            const inter = getIntercity(from, to);
            const key = `${from}-${to}`;
            const selected = this.selectedTransportMode[key] || "高铁";
            html += `<div class="city-header">${from} → ${to}</div>`;

            const modes = [
              { id: "高铁", icon: "train", cost: inter.price || 120, time: inter.trainH, pros: "准点率高", cons: "高峰票紧张" },
              { id: "飞机", icon: "plane", cost: 450, time: 2.5, pros: "长距离省时", cons: "机场往返耗时" },
              { id: "自驾", icon: "car", cost: Math.round(inter.km * 1.3), time: inter.km / 80, pros: "灵活自由", cons: "疲劳驾驶风险" },
              { id: "租车", icon: "car-side", cost: 800, time: inter.km / 80, pros: "异地还车可选", cons: "成本较高" }
            ];

            modes.forEach((m) => {
              html += `
                <div class="transport-option ${selected === m.id ? "selected" : ""}" onclick="app.selectTransportForSegment('${from}','${to}','${m.id}')">
                  <div class="flex-row" style="justify-content:space-between">
                    <span><i class="fas fa-${m.icon}"></i> ${m.id}</span>
                    <span>${fmtMoney(m.cost)} · ${m.time.toFixed(1)}h</span>
                  </div>
                  <div class="pros-cons">👍 ${m.pros} ｜ 👎 ${m.cons}</div>
                  ${
                    m.id === "高铁" && inter.scenic
                      ? `<div class="ticket-line">观景建议：${inter.desc} · ${inter.bestSeat}</div>`
                      : ""
                  }
                  ${
                    m.id === "高铁"
                      ? (inter.trains || [])
                          .map(
                            (t) =>
                              `<div class="ticket-line" onclick="event.stopPropagation();app.selectTrain('${from}','${to}','${t.id}')">${t.id} ${t.depart}-${t.arrive} ${fmtMoney(
                                t.price
                              )} 余票${t.left} ${this.selectedTrains[key] === t.id ? "✅" : ""}</div>`
                          )
                          .join("")
                      : ""
                  }
                </div>
              `;
            });

            const cur = modes.find((x) => x.id === selected) || modes[0];
            totalHours += cur.time;
            totalCost += cur.cost * this.people;
          }
          html += `
            <div class="scenic-tip"><i class="fas fa-lightbulb"></i> 当前已选交通预计：总耗时 ${totalHours.toFixed(1)}h，交通费用约 ${fmtMoney(totalCost)}。</div>
            <div class="flex-row">
              <button class="btn btn-outline" onclick="app.goToStep(1)">上一步</button>
              <button class="btn" onclick="app.goToStep(3)">下一步：景点选择</button>
            </div>
          </div>
          `;
          return html;
        },
        selectTransportForSegment(from, to, mode) {
          this.selectedTransportMode[`${from}-${to}`] = mode;
          this.renderPlanStep(2);
        },
        selectTrain(from, to, tid) {
          this.selectedTrains[`${from}-${to}`] = tid;
          this.toast(`已选 ${tid}`);
          this.renderPlanStep(2);
        },
        step3HTML() {
          const all = [...SPOT_DB, ...this.customSpots];
          let html = `
            <div class="step-card">
              <h3>③ 景点选择</h3>
              <div class="flex-row">
                <input id="customSpotName" class="input-field" placeholder="自定义景点名称" />
                <input id="customSpotCity" class="input-field" placeholder="所在城市" />
                <button class="btn btn-outline btn-sm" onclick="app.addCustomSpot()">添加</button>
              </div>
          `;
          this.destCities.forEach((city) => {
            const spots = all.filter((s) => s.city === city);
            html += `<div class="city-header">📍 ${city} <span class="tag">${spots.length}个</span></div>`;
            if (!spots.length) {
              html += `<div class="empty-msg">暂无该城市景点，可使用上方自定义添加。</div>`;
            } else {
              html += `<div class="spot-grid">`;
              spots.forEach((s) => {
                const selected = this.selectedSpots[city]?.has(s.name);
                html += `
                  <div class="mini-spot ${selected ? "selected" : ""}" onclick="app.toggleSpot('${city}','${s.name}')">
                    <div class="mini-img" style="background-image:url('${s.imgs[0]}')"></div>
                    <div class="mini-info">
                      <div class="mini-name">${s.name}</div>
                      <div class="mini-meta"><span>${s.duration}h</span><span>${s.ticket ? fmtMoney(s.ticket) : "免费"}</span></div>
                    </div>
                  </div>
                `;
              });
              html += `</div>`;
            }
          });
          if (this.shouldSuggestRental()) {
            html += `<div class="scenic-tip">⚠️ 检测到部分景点接驳不便，建议目的地城市内使用租车中转。 <button class="btn btn-sm" onclick="app.recommendRental()">一键推荐</button></div>`;
          }
          html += `
              <div class="flex-row">
                <button class="btn btn-outline" onclick="app.goToStep(2)">上一步</button>
                <button class="btn" onclick="app.goToStep(4)">下一步：特色美食</button>
              </div>
            </div>
          `;
          return html;
        },
        shouldSuggestRental() {
          const all = [...SPOT_DB, ...this.customSpots];
          let lowTransportCount = 0;
          this.destCities.forEach((city) => {
            const set = this.selectedSpots[city] || new Set();
            all.filter((s) => s.city === city && set.has(s.name)).forEach((s) => {
              if (s.transport <= 3) lowTransportCount += 1;
            });
          });
          return lowTransportCount >= 2;
        },
        recommendRental() {
          for (let i = 0; i < this.destCities.length; i += 1) {
            const from = i === 0 ? this.startCity : this.destCities[i - 1];
            const to = this.destCities[i];
            this.selectedTransportMode[`${from}-${to}`] = "租车";
          }
          this.toast("已将城际段切换为租车建议");
          this.renderPlanStep(3);
        },
        addCustomSpot() {
          const n = document.getElementById("customSpotName").value.trim();
          const c = document.getElementById("customSpotCity").value.trim();
          if (!n || !c) return this.toast("请填写景点名和城市");
          this.customSpots.push({
            id: Date.now(),
            name: n,
            city: c,
            province: "自定义",
            imgs: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80"],
            tags: ["自定义"],
            filter: ["推荐"],
            duration: 2,
            ticket: 0,
            transport: 4,
            desc: "用户自定义景点"
          });
          if (!this.destCities.includes(c)) this.destCities.push(c);
          this.toast(`已添加 ${n}`);
          this.renderPlanStep(3);
        },
        toggleSpot(city, name) {
          if (!this.selectedSpots[city]) this.selectedSpots[city] = new Set();
          const set = this.selectedSpots[city];
          if (set.has(name)) set.delete(name);
          else set.add(name);
          this.renderPlanStep(3);
        },
        step4FoodHTML() {
          let html = `<div class="step-card"><h3>④ 特色美食（可跳过）</h3><p style="margin:8px 0 12px;color:#64748b;font-size:.88rem">勾选后将按人数计入餐饮预算。</p>`;
          this.destCities.forEach((city) => {
            const foods = FOODS[city] || FOODS.default;
            html += `<div class="city-header">${city}</div>`;
            foods.forEach((f) => {
              const checked = this.selectedFoods[city]?.has(f.name) ? "checked" : "";
              html += `<label class="food-item"><input type="checkbox" ${checked} onchange="app.toggleFood('${city}','${f.name}')"/>${f.name} · ${fmtMoney(
                f.price
              )}/人</label>`;
            });
          });
          html += `
            <div class="flex-row" style="margin-top:12px">
              <button class="btn btn-outline" onclick="app.goToStep(3)">上一步</button>
              <button class="btn" onclick="app.goToStep(5)">下一步：费用明细</button>
            </div>
          </div>`;
          return html;
        },
        toggleFood(city, name) {
          if (!this.selectedFoods[city]) this.selectedFoods[city] = new Set();
          const set = this.selectedFoods[city];
          if (set.has(name)) set.delete(name);
          else set.add(name);
          this.renderPlanStep(4);
        },
        step5CostHTML() {
          const all = [...SPOT_DB, ...this.customSpots];
          const items = [];

          let transTotal = 0;
          let transDetail = "";
          for (let i = 0; i < this.destCities.length; i += 1) {
            const from = i === 0 ? this.startCity : this.destCities[i - 1];
            const to = this.destCities[i];
            const key = `${from}-${to}`;
            const inter = getIntercity(from, to);
            const mode = this.selectedTransportMode[key] || "高铁";
            const unit = mode === "高铁" ? inter.price || 120 : mode === "飞机" ? 450 : Math.round(inter.km * 1.3);
            const cost = unit * this.people;
            transTotal += cost;
            transDetail += `${from}→${to} ${mode} ${fmtMoney(cost)} ${this.selectedTrains[key] ? `(${this.selectedTrains[key]})` : ""}<br/>`;
          }
          items.push({ name: "交通费", cost: transTotal, detail: transDetail || "无" });

          let ticketTotal = 0;
          let ticketDetail = "";
          Object.keys(this.selectedSpots).forEach((city) => {
            all.filter((s) => s.city === city).forEach((s) => {
              if (this.selectedSpots[city].has(s.name)) {
                const c = s.ticket * (this.student ? 0.5 : 1) * this.people;
                ticketTotal += c;
                ticketDetail += `${s.name} ${fmtMoney(c)} `;
              }
            });
          });
          items.push({ name: "景点门票", cost: ticketTotal, detail: ticketDetail || "未选择收费景点" });

          let hotelTotal = 0;
          let hotelHtml = `<div style="margin:8px 0 4px"><b>选择酒店（可修改预算）</b></div>`;
          this.destCities.forEach((city) => {
            const hotels = HOTELS[city] || HOTELS.default;
            hotelHtml += `<div style="margin-top:8px"><b>${city}</b>`;
            hotels.forEach((h) => {
              const selected = this.selectedHotel[city]?.name === h.name;
              hotelHtml += `<div class="hotel-card ${selected ? "selected" : ""}" onclick="app.selectHotel('${city}','${h.name}',${h.price})">${h.name} · ${fmtMoney(
                h.price
              )}/晚 <span class="tag">${h.tags.join(" ")}</span></div>`;
            });
            hotelHtml += `</div>`;
            if (this.selectedHotel[city]) hotelTotal += this.selectedHotel[city].price * this.days;
          });
          items.push({ name: "住宿", cost: hotelTotal, detail: hotelTotal ? "已按所选酒店计算" : "未选择酒店，默认不计入" });

          let foodTotal = this.days * 100 * this.people;
          let foodExtra = 0;
          let foodDetail = `基础餐费 ${fmtMoney(foodTotal)} `;
          Object.keys(this.selectedFoods).forEach((city) => {
            const foods = FOODS[city] || FOODS.default;
            this.selectedFoods[city].forEach((name) => {
              const f = foods.find((x) => x.name === name);
              if (f) {
                foodExtra += f.price * this.people;
                foodDetail += `+ ${name} ${fmtMoney(f.price * this.people)} `;
              }
            });
          });
          foodTotal += foodExtra;
          items.push({ name: "餐饮", cost: foodTotal, detail: foodDetail });

          this.costItems = items;
          const total = items.reduce((sum, x) => sum + x.cost, 0);
          const over = this.budget > 0 && total > this.budget ? `<span style="color:#cb3740">超预算 ${fmtMoney(total - this.budget)}</span>` : "";

          let html = `<div class="step-card"><h3>⑤ 费用明细（透明预算）</h3>`;
          items.forEach((it) => {
            html += `<div class="cost-line"><span>${it.name}</span><strong>${fmtMoney(it.cost)}</strong></div><div class="cost-detail">${it.detail}</div>`;
          });
          html += hotelHtml;
          html += `<div class="cost-line"><b>总计</b><b>${fmtMoney(total)} ${over}</b></div>`;
          html += `
            <div class="flex-row" style="margin-top:12px">
              <button class="btn btn-outline" onclick="app.goToStep(4)">上一步</button>
              <button class="btn" onclick="app.finishPlan()">保存行程</button>
            </div>
          </div>`;
          return html;
        },
        selectHotel(city, name, price) {
          this.selectedHotel[city] = { name, price };
          this.renderPlanStep(5);
        },
        finishPlan() {
          const history = JSON.parse(localStorage.getItem("travelHistory") || "[]");
          history.unshift({
            ts: new Date().toISOString(),
            startCity: this.startCity,
            cities: this.destCities,
            days: this.days,
            people: this.people,
            total: this.costItems.reduce((s, i) => s + i.cost, 0),
            cost: this.costItems
          });
          localStorage.setItem("travelHistory", JSON.stringify(history));
          this.toast("已保存行程");
          this.showView("homeView");
        },
        loadHistory() {
          const history = JSON.parse(localStorage.getItem("travelHistory") || "[]");
          const c = document.getElementById("historyList");
          c.innerHTML = history.length
            ? history
                .map(
                  (h) =>
                    `<div class="cost-line"><span>${h.startCity} → ${(h.cities || []).join(" → ")}</span><strong>${fmtMoney(h.total || 0)}</strong></div><div class="cost-detail">${new Date(
                      h.ts
                    ).toLocaleString("zh-CN")}</div>`
                )
                .join("")
            : `<div class="empty-msg">暂无历史记录</div>`;
        },
        renderHistoryList() {
          this.loadHistory();
        }
      };

      window.app = app;
      window.onload = () => app.init();
    })();
  