
    (function () {
      const SPOT_DB = [
        { id: 1, name: "瑗挎箹", city: "鏉窞", province: "娴欐睙", imgs: ["https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1561016444-14f747499547?auto=format&fit=crop&w=900&q=80"], tags: ["缁忓吀", "鍏嶈垂"], filter: ["鎺ㄨ崘", "鏄ュ", "閮藉競"], duration: 4, ticket: 0, transport: 5, desc: "涓栫晫鏂囧寲閬椾骇锛岄€傚悎杞绘澗鎱㈡父銆? },
        { id: 2, name: "鐏甸殣瀵?, city: "鏉窞", province: "娴欐睙", imgs: ["https://images.unsplash.com/photo-1603491656337-3b4911479179?auto=format&fit=crop&w=900&q=80"], tags: ["瀵哄簷", "绁堢"], filter: ["鎺ㄨ崘", "鏄ュ"], duration: 2, ticket: 75, transport: 4, desc: "鍗冨勾鍙ゅ埞锛屾澀宸炵儹闂ㄦ枃鍖栨櫙鐐广€? },
        { id: 3, name: "鍏ぇ鍏?, city: "闈掑矝", province: "灞变笢", imgs: ["https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80"], tags: ["娴疯竟", "鎷嶇収"], filter: ["鎺ㄨ崘", "娴疯竟", "閮藉競"], duration: 2.5, ticket: 0, transport: 5, desc: "娴疯竟琛楀尯寤虹瓚缇わ紝鏃ヨ惤鍑虹墖銆? },
        { id: 4, name: "灏忛害宀?, city: "闈掑矝", province: "灞变笢", imgs: ["https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80"], tags: ["娴疯竟", "鏃ヨ惤"], filter: ["娴疯竟"], duration: 2, ticket: 0, transport: 4, desc: "娴峰哺鑽夊潽涓庤惤鏃ヨ閲庣粷浣炽€? },
        { id: 5, name: "娲辨捣", city: "澶х悊", province: "浜戝崡", imgs: ["https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80"], tags: ["婀栨櫙", "楠戣"], filter: ["鎺ㄨ崘", "灞遍噹", "鏄ュ"], duration: 4, ticket: 0, transport: 3, desc: "椋庤姳闆湀浠ｈ〃鏅锛岄€傚悎鍩庡競鍐呯杞︿腑杞€? },
        { id: 6, name: "鍠滄床鍙ら晣", city: "澶х悊", province: "浜戝崡", imgs: ["https://images.unsplash.com/photo-1629978009230-a2f7d6b0f6c1?auto=format&fit=crop&w=900&q=80"], tags: ["鍙ら晣"], filter: ["鍙ゅ煄", "灞遍噹"], duration: 2, ticket: 0, transport: 3, desc: "鐧芥棌鍙ら晣锛屾參娓镐綋楠屽ソ銆? },
        { id: 7, name: "涓ぎ澶ц", city: "鍝堝皵婊?, province: "榛戦緳姹?, imgs: ["https://images.unsplash.com/photo-1541535881962-3bb380b08458?auto=format&fit=crop&w=900&q=80"], tags: ["閮藉競", "澶滄櫙"], filter: ["鎺ㄨ崘", "閮藉競"], duration: 2.5, ticket: 0, transport: 5, desc: "鍐板煄鍩庡競鍚嶇墖锛屽鏅紭璐ㄣ€? },
        { id: 8, name: "鍐伴洩澶т笘鐣?, city: "鍝堝皵婊?, province: "榛戦緳姹?, imgs: ["https://images.unsplash.com/photo-1455156218388-5e61b526818b?auto=format&fit=crop&w=900&q=80"], tags: ["鍐"], filter: ["鎺ㄨ崘", "閮藉競"], duration: 4, ticket: 328, transport: 4, desc: "鍐鐑棬鐩殑鍦帮紝寤鸿鎻愬墠棰勭害銆? },
        { id: 9, name: "鎷欐斂鍥?, city: "鑻忓窞", province: "姹熻嫃", imgs: ["https://images.unsplash.com/photo-1582561424760-19e1b4c8e3d2?auto=format&fit=crop&w=900&q=80"], tags: ["鍥灄"], filter: ["鍙ゅ煄", "鎺ㄨ崘"], duration: 2.5, ticket: 80, transport: 5, desc: "姹熷崡鍥灄浠ｈ〃鏅偣銆? },
        { id: 10, name: "骞虫睙璺?, city: "鑻忓窞", province: "姹熻嫃", imgs: ["https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80"], tags: ["鍙よ"], filter: ["鍙ゅ煄"], duration: 2, ticket: 0, transport: 5, desc: "鍙ゅ煄鎱㈢敓娲昏鍖恒€? },
        { id: 11, name: "澶瓙搴欑Е娣渤", city: "鍗椾含", province: "姹熻嫃", imgs: ["https://images.unsplash.com/photo-1581337201117-3c5b4d7c1f6a?auto=format&fit=crop&w=900&q=80"], tags: ["澶滄櫙", "缇庨"], filter: ["鎺ㄨ崘", "閮藉競"], duration: 2, ticket: 0, transport: 5, desc: "澶滄父浣撻獙濂斤紝閰嶅鎴愮啛銆? },
        { id: 12, name: "榛勫北椋庢櫙鍖?, city: "榛勫北", province: "瀹夊窘", imgs: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80"], tags: ["灞遍噹"], filter: ["鎺ㄨ崘", "灞遍噹", "鏄ュ"], duration: 8, ticket: 190, transport: 3, desc: "浜戞捣鍜屾棩鍑虹粡鍏哥嚎璺€? }
      ];

      const INTERCITY = {
        "鍗椾含-鏉窞": { km: 280, trainH: 1.5, price: 120, scenic: true, bestSeat: "宸︿晶闈犵獥", desc: "瀹佹澀楂橀搧锛屽お婀栨部宀?, trains: [{ id: "G7351", depart: "08:30", arrive: "10:00", price: 120, left: 23 }, { id: "G7353", depart: "09:45", arrive: "11:15", price: 120, left: 8 }] },
        "鏉窞-榛勫北": { km: 210, trainH: 1.5, price: 80, scenic: true, bestSeat: "鍙充晶闈犵獥", desc: "鏉粍楂橀搧锛屽瘜鏄ユ睙椋庢櫙娈?, trains: [{ id: "D5577", depart: "10:20", arrive: "12:05", price: 80, left: 15 }] },
        "鏉窞-鑻忓窞": { km: 160, trainH: 1.1, price: 78, scenic: false, trains: [{ id: "G7542", depart: "09:10", arrive: "10:18", price: 78, left: 12 }] },
        "鑻忓窞-鍗椾含": { km: 220, trainH: 1.2, price: 95, scenic: false, trains: [{ id: "G7028", depart: "13:10", arrive: "14:20", price: 95, left: 16 }] },
        "涓婃捣-鏉窞": { km: 180, trainH: 1.0, price: 80, scenic: false, trains: [{ id: "G7305", depart: "08:00", arrive: "08:58", price: 80, left: 20 }] },
        "鍖椾含-涓婃捣": { km: 1200, trainH: 4.6, price: 550, scenic: false, trains: [{ id: "G1", depart: "09:00", arrive: "13:36", price: 550, left: 36 }] }
      };

      const HOTELS = {
        "鏉窞": [{ name: "瑗挎箹缇庡眳閰掑簵", price: 320, tags: ["杩戣タ婀?, "鍚棭"] }, { name: "濡傚绮鹃€?, price: 220, tags: ["鎬т环姣?, "鍦伴搧鍙?] }],
        "榛勫北": [{ name: "榛勫北鐧戒簯瀹鹃", price: 580, tags: ["灞遍《", "瑙傛棩鍑?] }, { name: "姹ゅ彛闀囨皯瀹?, price: 180, tags: ["灞辫剼", "鎺ラ┏杞?] }],
        "闈掑矝": [{ name: "娴锋櫙鍋囨棩閰掑簵", price: 380, tags: ["娴锋櫙", "杩戝晢鍦?] }, { name: "鍦伴搧鍙ｉ潚骞撮厭搴?, price: 230, tags: ["浜ら€氫究鍒?] }],
        "澶х悊": [{ name: "娲辨捣杞诲ア姘戝", price: 360, tags: ["娴锋櫙", "鍋滆溅鏂逛究"] }, { name: "鍙ゅ煄鑸掗€傞厭搴?, price: 240, tags: ["杩戝彜鍩?] }],
        "default": [{ name: "鑸掗€傚瀷閰掑簵", price: 220, tags: ["骞插噣鍗敓"] }]
      };

      const FOODS = {
        "鏉窞": [{ name: "瑗挎箹閱嬮奔", price: 88 }, { name: "榫欎簳铏句粊", price: 68 }, { name: "鐗囧効宸?, price: 25 }],
        "榛勫北": [{ name: "姣涜眴鑵?, price: 30 }, { name: "鑷硿楸?, price: 98 }, { name: "寰藉窞鐑чゼ", price: 10 }],
        "闈掑矝": [{ name: "杈ｇ倰铔よ湂", price: 58 }, { name: "娴烽矞閿呰创", price: 48 }],
        "澶х悊": [{ name: "涔虫墖", price: 25 }, { name: "閰歌荆楸?, price: 78 }],
        "default": [{ name: "褰撳湴鐗硅壊灏忓悆", price: 30 }]
      };

      function getIntercity(a, b) {
        const k = `${a}-${b}`;
        const r = `${b}-${a}`;
        return INTERCITY[k] || INTERCITY[r] || { km: 300, trainH: 2, price: 120, scenic: false, trains: [] };
      }

      function fmtMoney(n) {
        return `楼${Math.round(Number(n || 0))}`;
      }

      const app = {
        currentFilter: "鎺ㄨ崘",
        currentStep: 1,
        startCity: "鍗椾含",
        destCities: ["鏉窞", "榛勫北"],
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
                    <div class="price">${spot.ticket ? fmtMoney(spot.ticket) : "鍏嶈垂"}</div>
                  </div>
                </div>
              `
            )
            .join("");
          document.getElementById("feedContainer").innerHTML = html || '<div class="empty-msg" style="grid-column:span 2">鏆傛棤璇ュ垎绫绘櫙鐐?/div>';
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
                <span class="tag">馃搷 ${spot.city}</span>
                <span class="tag">鈴?${spot.duration}h</span>
                <span class="tag">馃帿 ${spot.ticket ? fmtMoney(spot.ticket) : "鍏嶈垂"}</span>
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
          this.destCities = ["鏉窞"];
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
              <h3>鈶?鍩虹淇℃伅</h3>
              <label>鍑哄彂鍦帮紙鍩庡競/鐪佷唤锛?/label>
              <input id="startCityInput" class="input-field" value="${this.startCity}" placeholder="濡傦細鍗椾含" oninput="app.showCitySuggestions('start')" />
              <div id="startSuggestions" class="suggestion-list"></div>

              <label>鐩殑鍦帮紙鎸夐『搴忥級</label>
              ${citiesHtml}
              <div class="flex-row">
                <input id="newCityInput" class="input-field" placeholder="娣诲姞鍩庡競" oninput="app.showCitySuggestions('dest')" />
                <button class="btn btn-outline btn-sm" onclick="app.addDestCity()">娣诲姞</button>
              </div>
              <div id="destSuggestions" class="suggestion-list"></div>

              <div class="flex-row">
                <div style="flex:1">
                  <label>鍑哄彂鏃ユ湡</label>
                  <input id="startDateInput" type="date" class="input-field" value="${this.startDate}" />
                </div>
                <div style="flex:1">
                  <label>澶╂暟</label>
                  <input id="daysInput" type="number" class="input-field" value="${this.days}" />
                </div>
              </div>
              <div class="flex-row">
                <div style="flex:1">
                  <label>浜烘暟</label>
                  <input id="peopleInput" type="number" class="input-field" value="${this.people}" />
                </div>
                <div style="flex:1">
                  <label>棰勭畻锛堝厓锛?/label>
                  <input id="budgetInput" type="number" class="input-field" value="${this.budget}" />
                </div>
              </div>
              <label><input id="studentCheck" type="checkbox" ${this.student ? "checked" : ""} /> 瀛︾敓妯″紡</label>
              <button class="btn" onclick="app.goToStep(2)">涓嬩竴姝ワ細鍩庨檯浜ら€?/button>
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
            : `<div class="suggestion-item">鏈壘鍒帮紝鏀寔鎵嬪姩杈撳叆</div>`;
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
          let html = `<div class="step-card"><h3>鈶?鍩庨檯浜ら€氳鍒?/h3>`;
          let totalHours = 0;
          let totalCost = 0;
          for (let i = 0; i < this.destCities.length; i += 1) {
            const from = i === 0 ? this.startCity : this.destCities[i - 1];
            const to = this.destCities[i];
            const inter = getIntercity(from, to);
            const key = `${from}-${to}`;
            const selected = this.selectedTransportMode[key] || "楂橀搧";
            html += `<div class="city-header">${from} 鈫?${to}</div>`;

            const modes = [
              { id: "楂橀搧", icon: "train", cost: inter.price || 120, time: inter.trainH, pros: "鍑嗙偣鐜囬珮", cons: "楂樺嘲绁ㄧ揣寮? },
              { id: "椋炴満", icon: "plane", cost: 450, time: 2.5, pros: "闀胯窛绂荤渷鏃?, cons: "鏈哄満寰€杩旇€楁椂" },
              { id: "鑷┚", icon: "car", cost: Math.round(inter.km * 1.3), time: inter.km / 80, pros: "鐏垫椿鑷敱", cons: "鐤插姵椹鹃┒椋庨櫓" },
              { id: "绉熻溅", icon: "car-side", cost: 800, time: inter.km / 80, pros: "寮傚湴杩樿溅鍙€?, cons: "鎴愭湰杈冮珮" }
            ];

            modes.forEach((m) => {
              html += `
                <div class="transport-option ${selected === m.id ? "selected" : ""}" onclick="app.selectTransportForSegment('${from}','${to}','${m.id}')">
                  <div class="flex-row" style="justify-content:space-between">
                    <span><i class="fas fa-${m.icon}"></i> ${m.id}</span>
                    <span>${fmtMoney(m.cost)} 路 ${m.time.toFixed(1)}h</span>
                  </div>
                  <div class="pros-cons">馃憤 ${m.pros} 锝?馃憥 ${m.cons}</div>
                  ${
                    m.id === "楂橀搧" && inter.scenic
                      ? `<div class="ticket-line">瑙傛櫙寤鸿锛?{inter.desc} 路 ${inter.bestSeat}</div>`
                      : ""
                  }
                  ${
                    m.id === "楂橀搧"
                      ? (inter.trains || [])
                          .map(
                            (t) =>
                              `<div class="ticket-line" onclick="event.stopPropagation();app.selectTrain('${from}','${to}','${t.id}')">${t.id} ${t.depart}-${t.arrive} ${fmtMoney(
                                t.price
                              )} 浣欑エ${t.left} ${this.selectedTrains[key] === t.id ? "鉁? : ""}</div>`
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
            <div class="scenic-tip"><i class="fas fa-lightbulb"></i> 褰撳墠宸查€変氦閫氶璁★細鎬昏€楁椂 ${totalHours.toFixed(1)}h锛屼氦閫氳垂鐢ㄧ害 ${fmtMoney(totalCost)}銆?/div>
            <div class="flex-row">
              <button class="btn btn-outline" onclick="app.goToStep(1)">涓婁竴姝?/button>
              <button class="btn" onclick="app.goToStep(3)">涓嬩竴姝ワ細鏅偣閫夋嫨</button>
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
          this.toast(`宸查€?${tid}`);
          this.renderPlanStep(2);
        },
        step3HTML() {
          const all = [...SPOT_DB, ...this.customSpots];
          let html = `
            <div class="step-card">
              <h3>鈶?鏅偣閫夋嫨</h3>
              <div class="flex-row">
                <input id="customSpotName" class="input-field" placeholder="鑷畾涔夋櫙鐐瑰悕绉? />
                <input id="customSpotCity" class="input-field" placeholder="鎵€鍦ㄥ煄甯? />
                <button class="btn btn-outline btn-sm" onclick="app.addCustomSpot()">娣诲姞</button>
              </div>
          `;
          this.destCities.forEach((city) => {
            const spots = all.filter((s) => s.city === city);
            html += `<div class="city-header">馃搷 ${city} <span class="tag">${spots.length}涓?/span></div>`;
            if (!spots.length) {
              html += `<div class="empty-msg">鏆傛棤璇ュ煄甯傛櫙鐐癸紝鍙娇鐢ㄤ笂鏂硅嚜瀹氫箟娣诲姞銆?/div>`;
            } else {
              html += `<div class="spot-grid">`;
              spots.forEach((s) => {
                const selected = this.selectedSpots[city]?.has(s.name);
                html += `
                  <div class="mini-spot ${selected ? "selected" : ""}" onclick="app.toggleSpot('${city}','${s.name}')">
                    <div class="mini-img" style="background-image:url('${s.imgs[0]}')"></div>
                    <div class="mini-info">
                      <div class="mini-name">${s.name}</div>
                      <div class="mini-meta"><span>${s.duration}h</span><span>${s.ticket ? fmtMoney(s.ticket) : "鍏嶈垂"}</span></div>
                    </div>
                  </div>
                `;
              });
              html += `</div>`;
            }
          });
          if (this.shouldSuggestRental()) {
            html += `<div class="scenic-tip">鈿狅笍 妫€娴嬪埌閮ㄥ垎鏅偣鎺ラ┏涓嶄究锛屽缓璁洰鐨勫湴鍩庡競鍐呬娇鐢ㄧ杞︿腑杞€?<button class="btn btn-sm" onclick="app.recommendRental()">涓€閿帹鑽?/button></div>`;
          }
          html += `
              <div class="flex-row">
                <button class="btn btn-outline" onclick="app.goToStep(2)">涓婁竴姝?/button>
                <button class="btn" onclick="app.goToStep(4)">涓嬩竴姝ワ細鐗硅壊缇庨</button>
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
            this.selectedTransportMode[`${from}-${to}`] = "绉熻溅";
          }
          this.toast("宸插皢鍩庨檯娈靛垏鎹负绉熻溅寤鸿");
          this.renderPlanStep(3);
        },
        addCustomSpot() {
          const n = document.getElementById("customSpotName").value.trim();
          const c = document.getElementById("customSpotCity").value.trim();
          if (!n || !c) return this.toast("璇峰～鍐欐櫙鐐瑰悕鍜屽煄甯?);
          this.customSpots.push({
            id: Date.now(),
            name: n,
            city: c,
            province: "鑷畾涔?,
            imgs: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80"],
            tags: ["鑷畾涔?],
            filter: ["鎺ㄨ崘"],
            duration: 2,
            ticket: 0,
            transport: 4,
            desc: "鐢ㄦ埛鑷畾涔夋櫙鐐?
          });
          if (!this.destCities.includes(c)) this.destCities.push(c);
          this.toast(`宸叉坊鍔?${n}`);
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
          let html = `<div class="step-card"><h3>鈶?鐗硅壊缇庨锛堝彲璺宠繃锛?/h3><p style="margin:8px 0 12px;color:#64748b;font-size:.88rem">鍕鹃€夊悗灏嗘寜浜烘暟璁″叆椁愰ギ棰勭畻銆?/p>`;
          this.destCities.forEach((city) => {
            const foods = FOODS[city] || FOODS.default;
            html += `<div class="city-header">${city}</div>`;
            foods.forEach((f) => {
              const checked = this.selectedFoods[city]?.has(f.name) ? "checked" : "";
              html += `<label class="food-item"><input type="checkbox" ${checked} onchange="app.toggleFood('${city}','${f.name}')"/>${f.name} 路 ${fmtMoney(
                f.price
              )}/浜?/label>`;
            });
          });
          html += `
            <div class="flex-row" style="margin-top:12px">
              <button class="btn btn-outline" onclick="app.goToStep(3)">涓婁竴姝?/button>
              <button class="btn" onclick="app.goToStep(5)">涓嬩竴姝ワ細璐圭敤鏄庣粏</button>
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
            const mode = this.selectedTransportMode[key] || "楂橀搧";
            const unit = mode === "楂橀搧" ? inter.price || 120 : mode === "椋炴満" ? 450 : Math.round(inter.km * 1.3);
            const cost = unit * this.people;
            transTotal += cost;
            transDetail += `${from}鈫?{to} ${mode} ${fmtMoney(cost)} ${this.selectedTrains[key] ? `(${this.selectedTrains[key]})` : ""}<br/>`;
          }
          items.push({ name: "浜ら€氳垂", cost: transTotal, detail: transDetail || "鏃? });

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
          items.push({ name: "鏅偣闂ㄧエ", cost: ticketTotal, detail: ticketDetail || "鏈€夋嫨鏀惰垂鏅偣" });

          let hotelTotal = 0;
          let hotelHtml = `<div style="margin:8px 0 4px"><b>閫夋嫨閰掑簵锛堝彲淇敼棰勭畻锛?/b></div>`;
          this.destCities.forEach((city) => {
            const hotels = HOTELS[city] || HOTELS.default;
            hotelHtml += `<div style="margin-top:8px"><b>${city}</b>`;
            hotels.forEach((h) => {
              const selected = this.selectedHotel[city]?.name === h.name;
              hotelHtml += `<div class="hotel-card ${selected ? "selected" : ""}" onclick="app.selectHotel('${city}','${h.name}',${h.price})">${h.name} 路 ${fmtMoney(
                h.price
              )}/鏅?<span class="tag">${h.tags.join(" ")}</span></div>`;
            });
            hotelHtml += `</div>`;
            if (this.selectedHotel[city]) hotelTotal += this.selectedHotel[city].price * this.days;
          });
          items.push({ name: "浣忓", cost: hotelTotal, detail: hotelTotal ? "宸叉寜鎵€閫夐厭搴楄绠? : "鏈€夋嫨閰掑簵锛岄粯璁や笉璁″叆" });

          let foodTotal = this.days * 100 * this.people;
          let foodExtra = 0;
          let foodDetail = `鍩虹椁愯垂 ${fmtMoney(foodTotal)} `;
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
          items.push({ name: "椁愰ギ", cost: foodTotal, detail: foodDetail });

          this.costItems = items;
          const total = items.reduce((sum, x) => sum + x.cost, 0);
          const over = this.budget > 0 && total > this.budget ? `<span style="color:#cb3740">瓒呴绠?${fmtMoney(total - this.budget)}</span>` : "";

          let html = `<div class="step-card"><h3>鈶?璐圭敤鏄庣粏锛堥€忔槑棰勭畻锛?/h3>`;
          items.forEach((it) => {
            html += `<div class="cost-line"><span>${it.name}</span><strong>${fmtMoney(it.cost)}</strong></div><div class="cost-detail">${it.detail}</div>`;
          });
          html += hotelHtml;
          html += `<div class="cost-line"><b>鎬昏</b><b>${fmtMoney(total)} ${over}</b></div>`;
          html += `
            <div class="flex-row" style="margin-top:12px">
              <button class="btn btn-outline" onclick="app.goToStep(4)">涓婁竴姝?/button>
              <button class="btn" onclick="app.finishPlan()">淇濆瓨琛岀▼</button>
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
          this.toast("宸蹭繚瀛樿绋?);
          this.showView("homeView");
        },
        loadHistory() {
          const history = JSON.parse(localStorage.getItem("travelHistory") || "[]");
          const c = document.getElementById("historyList");
          c.innerHTML = history.length
            ? history
                .map(
                  (h) =>
                    `<div class="cost-line"><span>${h.startCity} 鈫?${(h.cities || []).join(" 鈫?")}</span><strong>${fmtMoney(h.total || 0)}</strong></div><div class="cost-detail">${new Date(
                      h.ts
                    ).toLocaleString("zh-CN")}</div>`
                )
                .join("")
            : `<div class="empty-msg">鏆傛棤鍘嗗彶璁板綍</div>`;
        },
        renderHistoryList() {
          this.loadHistory();
        }
      };

      window.app = app;
      window.onload = () => app.init();
    })();
  
