// ====================== UI MANAGER ======================
let currentScreen = "dashboard";
let transferSearchQuery = "";
let transferFilter = "all";
let tacticsDirty = false;
let pendingLineup = null;
let pendingFormation = null;

// ====================== MAIN RENDER ======================
function renderApp() {
  renderSidebar();
  renderTopBar();
  renderScreen(currentScreen);
}

function renderScreen(screen) {
  currentScreen = screen;
  const main = document.getElementById("main-content");
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-item[data-screen="${screen}"]`);
  if (activeNav) activeNav.classList.add("active");

  switch(screen) {
    case "dashboard":   main.innerHTML = renderDashboard(); break;
    case "squad":       main.innerHTML = renderSquad(); break;
    case "tactics":     renderTacticsScreen(); break;
    case "transfers":   main.innerHTML = renderTransfers(); break;
    case "fixtures":    main.innerHTML = renderFixtures(); break;
    case "league":      main.innerHTML = renderLeague(); break;
    case "finance":     main.innerHTML = renderFinance(); break;
    case "players":     main.innerHTML = renderPlayerDatabase(); break;
    default:            main.innerHTML = renderDashboard();
  }
  attachEventListeners();
}

function renderSidebar() {
  const team = getTeam(STATE.userTeamId);
  document.getElementById("sidebar").innerHTML = `
    <div class="club-badge">${team.badge}</div>
    <div class="club-name">${team.shortName}</div>
    <nav class="sidebar-nav">
      ${navItem("dashboard","🏠","Panel")}
      ${navItem("squad","👥","Kadro")}
      ${navItem("tactics","⚽","Taktik")}
      ${navItem("transfers","🔄","Transfer")}
      ${navItem("fixtures","📅","Fikstür")}
      ${navItem("league","🏆","Lig Tablosu")}
      ${navItem("finance","💰","Finans")}
      ${navItem("players","🔍","Oyuncu DB")}
    </nav>
    <div class="sidebar-footer">
      <button class="btn-sm" onclick="showSaveMenu()">💾 Kaydet</button>
    </div>
  `;
}

function navItem(screen, icon, label) {
  const active = currentScreen === screen ? "active" : "";
  return `<div class="nav-item ${active}" data-screen="${screen}" onclick="renderScreen('${screen}')">
    <span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>
  </div>`;
}

function renderTopBar() {
  const team = getTeam(STATE.userTeamId);
  const finance = STATE.finances[STATE.userTeamId];
  const next = getNextUserMatch();
  const nextStr = next
    ? `${getTeam(next.home).shortName} vs ${getTeam(next.away).shortName} (Hf.${next.matchday})`
    : "Sezon bitti";
  document.getElementById("top-bar").innerHTML = `
    <div class="top-left">
      <span class="top-date">📅 ${formatDate(STATE.date)}</span>
      <span class="top-week">Hafta ${STATE.week}</span>
    </div>
    <div class="top-center">
      <span class="top-next">⚽ Sıradaki: ${nextStr}</span>
    </div>
    <div class="top-right">
      <span class="top-budget">💶 €${fmtVal(finance.budget)}K</span>
      <span class="top-wages">👔 €${fmtVal(finance.wageBill)}K/ay</span>
      <button class="btn-play" onclick="handleAdvanceWeek()">▶ Haftayı İlerlet</button>
    </div>
  `;
}

// ====================== DASHBOARD ======================
function renderDashboard() {
  const standings = getStandings();
  const userPos = standings.findIndex(s => s.teamId === STATE.userTeamId) + 1;
  const userStat = standings.find(s => s.teamId === STATE.userTeamId);
  const next = getNextUserMatch();
  const recentResults = STATE.fixtures.filter(f => f.played &&
    (f.home === STATE.userTeamId || f.away === STATE.userTeamId)).slice(-5).reverse();
  const topScorers = getTopScorers().slice(0,5);
  const teamPlayers = getTeamPlayers(STATE.userTeamId);
  const injured = teamPlayers.filter(p => p.injured);
  const suspended = teamPlayers.filter(p => p.suspended);

  return `
    <div class="screen-header"><h1>Yönetim Paneli</h1></div>
    <div class="dashboard-grid">
      <div class="card col-span-2">
        <h3>📊 Takım Durumu</h3>
        <div class="stat-row">
          <div class="stat-box"><div class="stat-val">${userPos}.</div><div class="stat-lbl">Sıralama</div></div>
          <div class="stat-box"><div class="stat-val">${userStat?.pts||0}</div><div class="stat-lbl">Puan</div></div>
          <div class="stat-box"><div class="stat-val">${userStat?.w||0}G ${userStat?.d||0}B ${userStat?.l||0}M</div><div class="stat-lbl">G/B/M</div></div>
          <div class="stat-box"><div class="stat-val">${userStat?.gf||0}:${userStat?.ga||0}</div><div class="stat-lbl">Gol Averajı</div></div>
          <div class="stat-box"><div class="stat-val">${Math.round(getTeamStrength(STATE.userTeamId))}</div><div class="stat-lbl">Takım Gücü</div></div>
        </div>
      </div>

      ${next ? `
      <div class="card">
        <h3>⚽ Sıradaki Maç</h3>
        <div class="next-match">
          <div class="nm-team home">${getTeam(next.home).badge} ${getTeam(next.home).name}</div>
          <div class="nm-vs">VS</div>
          <div class="nm-team away">${getTeam(next.away).name} ${getTeam(next.away).badge}</div>
        </div>
        <div class="nm-info">${next.home === STATE.userTeamId ? "🏠 Ev Sahibi" : "✈️ Deplasman"} • ${next.matchday}. Hafta</div>
        <button class="btn-primary" onclick="handlePlayMatch()">🎮 Maçı Oyna</button>
      </div>` : `<div class="card"><h3>🏆 Sezon Bitti!</h3><p>Tebrikler, sezon tamamlandı.</p></div>`}

      <div class="card">
        <h3>📰 Son Haberler</h3>
        <div class="news-list">
          ${STATE.news.slice(0,8).map(n => `
            <div class="news-item news-${n.type}">
              <span class="news-icon">${n.type==="transfer"?"🔄":n.type==="match"?"⚽":"ℹ️"}</span>
              <div>
                <div class="news-msg">${n.msg}</div>
                <div class="news-date">${n.date}</div>
              </div>
            </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>📋 Son Sonuçlar</h3>
        ${recentResults.length === 0 ? "<p class='muted'>Henüz sonuç yok</p>" :
          recentResults.map(f => {
            const isHome = f.home === STATE.userTeamId;
            const myG = isHome ? f.homeGoals : f.awayGoals;
            const oppG = isHome ? f.awayGoals : f.homeGoals;
            const opp = getTeam(isHome ? f.away : f.home);
            const res = myG > oppG ? "win" : myG < oppG ? "loss" : "draw";
            return `<div class="result-item result-${res}">
              <span>${isHome?"🏠":"✈️"} ${opp.shortName}</span>
              <span class="result-score">${myG} - ${oppG}</span>
              <span class="result-badge">${res==="win"?"G":res==="draw"?"B":"M"}</span>
            </div>`;
          }).join("")}
      </div>

      <div class="card">
        <h3>🏥 Sakatlık/Ceza Listesi</h3>
        ${injured.length === 0 && suspended.length === 0 ? "<p class='muted'>Tüm oyuncular hazır!</p>" : ""}
        ${injured.map(p => `<div class="alert-item alert-injury">🤕 ${p.name} — ${p.injuryDays} gün</div>`).join("")}
        ${suspended.map(p => `<div class="alert-item alert-suspend">🟨 ${p.name} — Cezalı</div>`).join("")}
      </div>

      <div class="card">
        <h3>🥅 Gol Krallığı</h3>
        ${topScorers.length === 0 ? "<p class='muted'>Henüz gol atılmadı</p>" :
          topScorers.map((s,i) => `<div class="scorer-item">
            <span class="scorer-rank">${i+1}.</span>
            <span>${s.player.name}</span>
            <span class="muted">${getTeam(s.player.teamId)?.shortName||"?"}</span>
            <span class="scorer-goals">${s.goals} ⚽</span>
          </div>`).join("")}
      </div>

      <div class="card col-span-2">
        <h3>🏆 Lig Tablosu (İlk 5)</h3>
        <table class="standings-table">
          <tr><th>#</th><th>Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>A</th><th>P</th></tr>
          ${standings.slice(0,5).map((s,i) => {
            const t = getTeam(s.teamId);
            const isUser = s.teamId === STATE.userTeamId;
            return `<tr class="${isUser?"user-row":""}">
              <td>${i+1}</td><td>${t.badge} ${t.shortName}</td>
              <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
              <td>${s.gf}:${s.ga}</td><td class="pts">${s.pts}</td>
            </tr>`;
          }).join("")}
        </table>
        <button class="btn-link" onclick="renderScreen('league')">Tamamını gör →</button>
      </div>
    </div>
  `;
}

// ====================== SQUAD SCREEN ======================
function renderSquad() {
  const players = getTeamPlayers(STATE.userTeamId).sort((a,b) => {
    const posOrder = {GK:0,CB:1,RB:2,LB:3,DM:4,CM:5,RM:6,LM:7,CAM:8,RW:9,LW:10,ST:11};
    return (posOrder[a.pos]||9) - (posOrder[b.pos]||9);
  });

  return `
    <div class="screen-header">
      <h1>👥 Kadro Yönetimi</h1>
      <div class="header-actions">
        <span class="muted">${players.length} oyuncu</span>
      </div>
    </div>
    <div class="squad-filters">
      <span class="filter-label">Sırala:</span>
      <button class="btn-sm" onclick="sortSquad('pos')">Mevki</button>
      <button class="btn-sm" onclick="sortSquad('overall')">Genel</button>
      <button class="btn-sm" onclick="sortSquad('age')">Yaş</button>
      <button class="btn-sm" onclick="sortSquad('value')">Değer</button>
    </div>
    <div class="squad-table-wrap">
      <table class="squad-table">
        <thead>
          <tr>
            <th>Oyuncu</th><th>Mev</th><th>Yaş</th><th>Mil</th>
            <th>Hız</th><th>Şut</th><th>Pas</th><th>Çal</th><th>Sav</th><th>Fiz</th>
            <th>Genel</th><th>Değer</th><th>Ücret</th><th>Form</th><th>Kondisyon</th><th>Moral</th><th>Durum</th><th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          ${players.map(p => renderPlayerRow(p)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPlayerRow(p) {
  const ov = calcOverall(p, p.pos);
  const status = p.injured ? `<span class="badge badge-injury">🤕 ${p.injuryDays}g</span>`
    : p.suspended ? `<span class="badge badge-suspend">🟨 Cezalı</span>`
    : `<span class="badge badge-ok">✓</span>`;
  const form = getPlayerForm(p);
  const fitColor = p.fitness > 80 ? "green" : p.fitness > 60 ? "yellow" : "red";
  const morColor = p.morale > 70 ? "green" : p.morale > 45 ? "yellow" : "red";
  return `<tr class="${p.injured?"row-injured":p.suspended?"row-suspended":""}">
    <td class="player-name-cell">
      <span class="player-name" onclick="showPlayerDetail(${p.id})">${p.name}</span>
    </td>
    <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
    <td>${p.age}</td>
    <td>${p.nat}</td>
    <td>${p.pac}</td><td>${p.sho}</td><td>${p.pas}</td><td>${p.dri}</td><td>${p.def}</td><td>${p.phy}</td>
    <td><span class="overall-badge ov-${getOvClass(ov)}">${ov}</span></td>
    <td>€${fmtVal(p.value)}K</td>
    <td>€${p.wage}K</td>
    <td>${form}</td>
    <td><div class="mini-bar"><div class="mini-fill fill-${fitColor}" style="width:${p.fitness}%"></div></div> ${p.fitness}%</td>
    <td><div class="mini-bar"><div class="mini-fill fill-${morColor}" style="width:${p.morale}%"></div></div> ${p.morale}%</td>
    <td>${status}</td>
    <td>
      <button class="btn-xs" onclick="showPlayerDetail(${p.id})">📋</button>
      <button class="btn-xs btn-sell" onclick="showTransferDialog(${p.id})">💰</button>
    </td>
  </tr>`;
}

function getOvClass(ov) {
  if (ov >= 85) return "elite";
  if (ov >= 78) return "high";
  if (ov >= 70) return "mid";
  return "low";
}

// ====================== TACTICS SCREEN ======================
function renderTacticsScreen() {
  const lineup = pendingLineup ? { formation: pendingFormation, players: pendingLineup }
    : getLineup(STATE.userTeamId);
  const formation = lineup.formation;
  const formDef = FORMATIONS[formation];
  const playerIds = lineup.players;
  const squad = getTeamPlayers(STATE.userTeamId);
  const html = `
    <div class="screen-header">
      <h1>⚽ Taktik & Diziliş</h1>
      <div class="header-actions">
        ${tacticsDirty ? '<span class="badge badge-warn">Kaydedilmemiş değişiklikler</span>' : ''}
        <button class="btn-primary" onclick="saveTactics()">💾 Kaydet</button>
        <button class="btn-sm" onclick="autoFillLineup()">🤖 Otomatik</button>
      </div>
    </div>
    <div class="tactics-layout">
      <div class="tactics-left">
        <div class="formation-selector">
          <label>Diziliş:</label>
          ${Object.keys(FORMATIONS).map(f =>
            `<button class="btn-formation ${f===formation?"active":""}" onclick="changeFormation('${f}')">${f}</button>`
          ).join("")}
        </div>
        <div class="pitch-container">
          <div class="pitch">
            ${formDef.slots.map((slot, i) => {
              const pid = playerIds[i];
              const p = pid ? getPlayer(pid) : null;
              const ov = p ? calcOverall(p, slot) : 0;
              const coord = formDef.coords[i];
              return `<div class="pitch-player" style="left:${coord.x}%;top:${coord.y}%"
                data-slot="${i}" onclick="openSlotPicker(${i})">
                <div class="pp-slot">${slot}</div>
                <div class="pp-name">${p ? p.name.split(" ").pop() : "—"}</div>
                ${p ? `<div class="pp-ov ov-${getOvClass(ov)}">${ov}</div>` : ""}
              </div>`;
            }).join("")}
          </div>
        </div>
        <div class="bench-section">
          <h3>Yedek Bench</h3>
          <div class="bench-list">
            ${squad.filter(p => !playerIds.includes(p.id)).slice(0,7).map(p =>
              `<div class="bench-player">
                <span class="pos-badge pos-${p.pos}">${p.pos}</span>
                <span>${p.name}</span>
                <span class="muted">${calcOverall(p,p.pos)}</span>
              </div>`).join("")}
          </div>
        </div>
      </div>
      <div class="tactics-right">
        <div class="team-instructions card">
          <h3>Takım Talimatları</h3>
          <div class="instruction-row">
            <label>Mentalite:</label>
            <select id="mentality" class="select-input">
              <option>Çok Saldırgan</option><option selected>Saldırgan</option>
              <option>Dengeli</option><option>Savunmacı</option><option>Çok Savunmacı</option>
            </select>
          </div>
          <div class="instruction-row">
            <label>Pressing:</label>
            <input type="range" min="1" max="10" value="6" class="range-input">
          </div>
          <div class="instruction-row">
            <label>Hat Genişliği:</label>
            <input type="range" min="1" max="10" value="5" class="range-input">
          </div>
          <div class="instruction-row">
            <label>Defans Derinliği:</label>
            <input type="range" min="1" max="10" value="5" class="range-input">
          </div>
          <div class="instruction-row">
            <label>Tempo:</label>
            <input type="range" min="1" max="10" value="6" class="range-input">
          </div>
        </div>
        <div class="lineup-list card">
          <h3>İlk 11</h3>
          ${formDef.slots.map((slot, i) => {
            const pid = playerIds[i];
            const p = pid ? getPlayer(pid) : null;
            return `<div class="lineup-row">
              <span class="pos-badge pos-${slot}">${slot}</span>
              <span class="lineup-name">${p ? p.name : "—"}</span>
              ${p ? `<span class="lineup-ov ov-${getOvClass(calcOverall(p,slot))}">${calcOverall(p,slot)}</span>` : ""}
              <button class="btn-xs" onclick="openSlotPicker(${i})">✏️</button>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>
    <div id="slot-picker-modal" class="modal hidden"></div>
  `;
  document.getElementById("main-content").innerHTML = html;
  attachEventListeners();
}

function changeFormation(f) {
  pendingFormation = f;
  if (!pendingLineup) pendingLineup = [...(getLineup(STATE.userTeamId).players || [])];
  // Resize array to match new formation slot count
  const slots = FORMATIONS[f].slots.length;
  while (pendingLineup.length < slots) pendingLineup.push(null);
  pendingLineup = pendingLineup.slice(0, slots);
  tacticsDirty = true;
  renderTacticsScreen();
}

function openSlotPicker(slotIndex) {
  const lineup = pendingLineup ? { formation: pendingFormation, players: pendingLineup }
    : getLineup(STATE.userTeamId);
  const slot = FORMATIONS[lineup.formation].slots[slotIndex];
  const squad = getTeamPlayers(STATE.userTeamId);
  const currentPids = lineup.players;

  const modal = document.getElementById("slot-picker-modal");
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${slot} Pozisyonu için Oyuncu Seç</h3>
        <button onclick="document.getElementById('slot-picker-modal').classList.add('hidden')">✕</button>
      </div>
      <div class="modal-body">
        <table class="squad-table">
          <tr><th>Oyuncu</th><th>Mev</th><th>Genel</th><th>Uyum</th><th>Kondiyon</th><th></th></tr>
          ${squad.sort((a,b)=>calcOverall(b,slot)-calcOverall(a,slot)).map(p => {
            const compat = POSITION_COMPAT[slot]?.[p.pos] || 0;
            const ov = calcOverall(p, slot);
            const inUse = currentPids.indexOf(p.id);
            return `<tr class="${inUse>=0&&inUse!==slotIndex?"row-in-use":""}">
              <td>${p.name}</td>
              <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
              <td><span class="overall-badge ov-${getOvClass(ov)}">${ov}</span></td>
              <td><span class="compat-bar" style="background:${compat>80?"#00d084":compat>50?"#f5a623":"#e8262a"}">${compat}%</span></td>
              <td>${p.fitness}%</td>
              <td><button class="btn-xs btn-primary" onclick="assignPlayer(${slotIndex},${p.id})">Seç</button></td>
            </tr>`;
          }).join("")}
        </table>
      </div>
    </div>
  `;
}

function assignPlayer(slotIndex, playerId) {
  if (!pendingLineup) pendingLineup = [...(getLineup(STATE.userTeamId).players || [])];
  if (!pendingFormation) pendingFormation = getLineup(STATE.userTeamId).formation;

  // If player is already in another slot, swap
  const existingSlot = pendingLineup.indexOf(playerId);
  const displaced = pendingLineup[slotIndex];
  if (existingSlot >= 0) pendingLineup[existingSlot] = displaced;
  pendingLineup[slotIndex] = playerId;
  tacticsDirty = true;

  document.getElementById("slot-picker-modal")?.classList.add("hidden");
  renderTacticsScreen();
}

function saveTactics() {
  if (pendingFormation && pendingLineup) {
    setLineup(STATE.userTeamId, pendingFormation, pendingLineup);
    pendingLineup = null;
    pendingFormation = null;
    tacticsDirty = false;
    showToast("Diziliş kaydedildi!");
  }
  renderTacticsScreen();
}

function autoFillLineup() {
  pendingLineup = null;
  pendingFormation = getLineup(STATE.userTeamId).formation;
  autoSetLineup(STATE.userTeamId);
  tacticsDirty = false;
  renderTacticsScreen();
  showToast("Diziliş otomatik olarak ayarlandı.");
}

// ====================== TRANSFERS SCREEN ======================
function renderTransfers() {
  const finance = STATE.finances[STATE.userTeamId];
  const myPlayers = getTeamPlayers(STATE.userTeamId);
  const allAvailable = [...STATE.freeAgents, ...STATE.players.filter(p => p.teamId !== STATE.userTeamId)];
  const filtered = allAvailable.filter(p => {
    if (transferFilter === "free") return !p.teamId;
    if (transferFilter === "foreign") return p.nat !== "TUR";
    if (transferFilter === "turkish") return p.nat === "TUR";
    return true;
  }).filter(p => !transferSearchQuery || p.name.toLowerCase().includes(transferSearchQuery.toLowerCase()));

  const pendingBids = STATE.bids.filter(b => b.fromTeamId === STATE.userTeamId);

  return `
    <div class="screen-header">
      <h1>🔄 Transfer Pazarı</h1>
      <span class="muted">Bütçe: €${fmtVal(finance.budget)}K • ${STATE.transferWindow ? '🟢 Transfer Penceresi Açık' : '🔴 Transfer Penceresi Kapalı'}</span>
    </div>

    <div class="transfer-layout">
      <div class="transfer-main">
        <div class="transfer-tabs">
          <button class="${transferFilter==="all"?"tab-active":""}" onclick="setTransferFilter('all')">Tüm Oyuncular</button>
          <button class="${transferFilter==="free"?"tab-active":""}" onclick="setTransferFilter('free')">Serbest Oyuncular</button>
          <button class="${transferFilter==="turkish"?"tab-active":""}" onclick="setTransferFilter('turkish')">Yerli</button>
          <button class="${transferFilter==="foreign"?"tab-active":""}" onclick="setTransferFilter('foreign')">Yabancı</button>
        </div>
        <div class="search-bar">
          <input type="text" id="transfer-search" placeholder="🔍 Oyuncu ara..." value="${transferSearchQuery}"
            oninput="setTransferSearch(this.value)" class="search-input">
        </div>
        <table class="squad-table">
          <thead>
            <tr><th>Oyuncu</th><th>Mev</th><th>Yaş</th><th>Mil</th><th>Genel</th><th>Takım</th><th>Değer</th><th>Ücret/ay</th><th>Kontrat</th><th>İşlem</th></tr>
          </thead>
          <tbody>
            ${filtered.slice(0,50).map(p => {
              const ov = calcOverall(p, p.pos);
              const team = p.teamId ? getTeam(p.teamId) : null;
              return `<tr>
                <td><span class="player-name" onclick="showPlayerDetail(${p.id})">${p.name}</span></td>
                <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
                <td>${p.age}</td><td>${p.nat}</td>
                <td><span class="overall-badge ov-${getOvClass(ov)}">${ov}</span></td>
                <td>${team ? team.shortName : '<span class="free-agent">Serbest</span>'}</td>
                <td>€${fmtVal(p.value)}K</td>
                <td>€${p.wage}K</td>
                <td>${p.contractEnd}</td>
                <td>
                  ${STATE.transferWindow
                    ? `<button class="btn-xs btn-primary" onclick="openBidDialog(${p.id})">Teklif Ver</button>`
                    : `<span class="muted">Kapalı</span>`}
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        ${filtered.length > 50 ? `<p class="muted center">+${filtered.length-50} daha sonuç - aramanızı daraltın</p>` : ""}
      </div>
      <div class="transfer-sidebar">
        <div class="card">
          <h3>📤 Satılık Oyuncularım</h3>
          ${myPlayers.map(p => `
            <div class="sellable-player">
              <span>${p.name}</span>
              <span class="muted">€${fmtVal(p.value)}K</span>
              <button class="btn-xs" onclick="showTransferDialog(${p.id})">Sat</button>
            </div>`).join("")}
        </div>
        <div class="card">
          <h3>📬 Tekliflerim</h3>
          ${pendingBids.length === 0 ? "<p class='muted'>Aktif teklif yok</p>" :
            pendingBids.map(b => {
              const p = getPlayer(b.playerId);
              return `<div class="bid-item bid-${b.status}">
                <div>${p?.name}</div>
                <div>€${fmtVal(b.amount)}K</div>
                <div class="bid-status">${b.status==="pending"?"⏳ Bekliyor":b.status==="accepted"?"✅ Kabul":"❌ Reddedildi"}</div>
              </div>`;
            }).join("")}
        </div>
      </div>
    </div>
    <div id="bid-modal" class="modal hidden"></div>
    <div id="sell-modal" class="modal hidden"></div>
  `;
}

function setTransferFilter(f) { transferFilter = f; renderScreen("transfers"); }
function setTransferSearch(q) { transferSearchQuery = q; renderScreen("transfers"); }

function openBidDialog(playerId) {
  const p = getPlayer(playerId);
  const finance = STATE.finances[STATE.userTeamId];
  let modal = document.getElementById("bid-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "bid-modal";
    modal.className = "modal";
    document.body.appendChild(modal);
  }
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>💰 ${p.name} için Teklif Ver</h3>
        <button onclick="document.getElementById('bid-modal').classList.add('hidden')">✕</button>
      </div>
      <div class="modal-body">
        <div class="player-detail-header">
          <span class="pos-badge pos-${p.pos}">${p.pos}</span>
          <span>${p.nat} • ${p.age} yaş</span>
        </div>
        <div class="stat-row">
          <div class="stat-box"><div class="stat-val">${calcOverall(p,p.pos)}</div><div class="stat-lbl">Genel</div></div>
          <div class="stat-box"><div class="stat-val">€${fmtVal(p.value)}K</div><div class="stat-lbl">Değer</div></div>
          <div class="stat-box"><div class="stat-val">€${p.wage}K/ay</div><div class="stat-lbl">Ücret</div></div>
        </div>
        <div class="bid-input-row">
          <label>Teklif Miktarı (€K):</label>
          <input type="number" id="bid-amount" value="${Math.round(p.value * 1.1)}" min="${Math.round(p.value*0.5)}" max="${finance.budget}" class="text-input">
        </div>
        <div class="muted">Bütçeniz: €${fmtVal(finance.budget)}K</div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="submitBid(${playerId})">✅ Teklif Yap</button>
          <button class="btn-sm" onclick="document.getElementById('bid-modal').classList.add('hidden')">İptal</button>
        </div>
      </div>
    </div>
  `;
}

function submitBid(playerId) {
  const amount = parseInt(document.getElementById("bid-amount").value);
  const result = makeTransferBid(STATE.userTeamId, playerId, amount);
  document.getElementById("bid-modal")?.classList.add("hidden");
  showToast(result.msg, result.ok ? "success" : "error");
  renderScreen("transfers");
}

function showTransferDialog(playerId) {
  const p = getPlayer(playerId);
  const modal = document.getElementById("sell-modal") || document.createElement("div");
  if (!modal.id) { modal.id = "sell-modal"; modal.className = "modal"; document.body.appendChild(modal); }
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>💸 ${p.name} - Transfer</h3>
        <button onclick="document.getElementById('sell-modal').classList.add('hidden')">✕</button>
      </div>
      <div class="modal-body">
        <div class="muted">Piyasa Değeri: €${fmtVal(p.value)}K</div>
        <div class="bid-input-row">
          <label>Satış Fiyatı (€K):</label>
          <input type="number" id="sell-amount" value="${p.value}" class="text-input">
        </div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="listForSale(${p.id})">📢 Satışa Çıkar</button>
          <button class="btn-danger" onclick="releasePlayer(${p.id});renderScreen('squad')">🗑️ Serbest Bırak</button>
          <button class="btn-sm" onclick="document.getElementById('sell-modal').classList.add('hidden')">İptal</button>
        </div>
      </div>
    </div>
  `;
}

function listForSale(playerId) {
  const p = getPlayer(playerId);
  if (p) { p.transferListed = true; showToast(`${p.name} satışa çıkarıldı!`); }
  document.getElementById("sell-modal")?.classList.add("hidden");
  renderScreen("squad");
}

// ====================== FIXTURES SCREEN ======================
function renderFixtures() {
  const userFixtures = STATE.fixtures.filter(f =>
    f.home === STATE.userTeamId || f.away === STATE.userTeamId
  );

  const byMatchday = {};
  for (const f of userFixtures) {
    if (!byMatchday[f.matchday]) byMatchday[f.matchday] = [];
    byMatchday[f.matchday].push(f);
  }

  return `
    <div class="screen-header"><h1>📅 Fikstür</h1></div>
    <div class="fixtures-list">
      ${Object.entries(byMatchday).map(([md, matches]) => `
        <div class="matchday-block">
          <div class="matchday-header">${md}. Hafta</div>
          ${matches.map(f => {
            const h = getTeam(f.home), a = getTeam(f.away);
            const isHome = f.home === STATE.userTeamId;
            const venue = isHome ? "🏠" : "✈️";
            if (f.played) {
              const myG = isHome ? f.homeGoals : f.awayGoals;
              const oppG = isHome ? f.awayGoals : f.homeGoals;
              const res = myG > oppG ? "win" : myG < oppG ? "loss" : "draw";
              return `<div class="fixture-item fixture-played fixture-${res}">
                <span class="fixture-venue">${venue}</span>
                <div class="fixture-teams">
                  <span class="${f.home===STATE.userTeamId?"user-team":""}">${h.badge} ${h.name}</span>
                  <span class="fixture-score ${res}">${f.homeGoals} - ${f.awayGoals}</span>
                  <span class="${f.away===STATE.userTeamId?"user-team":""}">${a.name} ${a.badge}</span>
                </div>
                <button class="btn-xs" onclick="showMatchReport(${STATE.fixtures.indexOf(f)})">📊</button>
              </div>`;
            } else {
              return `<div class="fixture-item fixture-upcoming">
                <span class="fixture-venue">${venue}</span>
                <div class="fixture-teams">
                  <span>${h.badge} ${h.name}</span>
                  <span class="fixture-vs">VS</span>
                  <span>${a.name} ${a.badge}</span>
                </div>
              </div>`;
            }
          }).join("")}
        </div>`).join("")}
    </div>
    <div id="match-report-modal" class="modal hidden"></div>
  `;
}

function showMatchReport(fixtureIndex) {
  const f = STATE.fixtures[fixtureIndex];
  const h = getTeam(f.home), a = getTeam(f.away);
  const modal = document.getElementById("match-report-modal");
  modal.classList.remove("hidden");

  const goals = (f.events||[]).filter(e=>e.type==="goal");
  const yellows = (f.events||[]).filter(e=>e.type==="yellow");
  const reds = (f.events||[]).filter(e=>e.type==="red");

  modal.innerHTML = `
    <div class="modal-content modal-wide">
      <div class="modal-header">
        <h3>📊 Maç Raporu — ${h.name} vs ${a.name}</h3>
        <button onclick="document.getElementById('match-report-modal').classList.add('hidden')">✕</button>
      </div>
      <div class="modal-body">
        <div class="match-score-display">
          <div class="msd-team">${h.badge}<br>${h.name}</div>
          <div class="msd-score">${f.homeGoals} - ${f.awayGoals}</div>
          <div class="msd-team">${a.badge}<br>${a.name}</div>
        </div>
        <div class="match-events">
          ${(f.events||[]).filter(e=>["goal","yellow","red","injury"].includes(e.type)).map(ev => `
            <div class="match-event event-${ev.type}">
              <span class="ev-min">${ev.min}'</span>
              <span class="ev-icon">${ev.type==="goal"?"⚽":ev.type==="yellow"?"🟨":ev.type==="red"?"🟥":"🤕"}</span>
              <span class="ev-desc">${ev.comment || ev.playerName || ""}</span>
              ${ev.assistName ? `<span class="muted">(Asist: ${ev.assistName})</span>` : ""}
            </div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

// ====================== LEAGUE SCREEN ======================
function renderLeague() {
  const standings = getStandings();
  return `
    <div class="screen-header"><h1>🏆 Lig Tablosu</h1></div>
    <div class="league-layout">
      <div class="standings-card card">
        <table class="standings-table full">
          <thead>
            <tr><th>#</th><th>Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>GF</th><th>GA</th><th>Av</th><th>P</th></tr>
          </thead>
          <tbody>
            ${standings.map((s,i) => {
              const t = getTeam(s.teamId);
              const isUser = s.teamId === STATE.userTeamId;
              const zone = i < 2 ? "cl" : i < 4 ? "el" : i >= 8 ? "rel" : "";
              return `<tr class="${isUser?"user-row":""} zone-${zone}">
                <td class="rank-cell">${i+1}${i===0?"🥇":i===1?"🥈":i===2?"🥉":""}</td>
                <td class="team-cell">${t.badge} <strong>${t.name}</strong></td>
                <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
                <td>${s.gf}</td><td>${s.ga}</td><td>${s.gf-s.ga>0?"+":""}${s.gf-s.ga}</td>
                <td class="pts"><strong>${s.pts}</strong></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        <div class="zone-legend">
          <span class="zone-cl">■ Şampiyonlar Ligi</span>
          <span class="zone-el">■ Avrupa Ligi</span>
          <span class="zone-rel">■ Küme Düşme</span>
        </div>
      </div>
      <div class="league-right">
        <div class="card">
          <h3>🥅 Gol Krallığı</h3>
          ${getTopScorers().map((s,i) => `
            <div class="scorer-item">
              <span class="scorer-rank">${i+1}.</span>
              <div>
                <div>${s.player.name}</div>
                <div class="muted">${getTeam(s.player.teamId)?.name||"?"}</div>
              </div>
              <span class="scorer-goals">${s.goals} ⚽</span>
            </div>`).join("") || "<p class='muted'>Henüz gol yok</p>"}
        </div>
        <div class="card">
          <h3>📊 Hafta ${STATE.week} Sonuçları</h3>
          ${(()=>{ const played = STATE.fixtures.filter(f=>f.played); if(!played.length) return []; const maxMd = Math.max(...played.map(f=>f.matchday)); return played.filter(f=>f.matchday===maxMd); })().slice(0,5).map(f => `
            <div class="result-row">
              <span>${getTeam(f.home).shortName}</span>
              <span class="result-score-sm">${f.homeGoals}-${f.awayGoals}</span>
              <span>${getTeam(f.away).shortName}</span>
            </div>`).join("") || "<p class='muted'>Sonuç yok</p>"}
        </div>
      </div>
    </div>
  `;
}

// ====================== FINANCE SCREEN ======================
function renderFinance() {
  const finance = STATE.finances[STATE.userTeamId];
  const team = getTeam(STATE.userTeamId);
  const players = getTeamPlayers(STATE.userTeamId).sort((a,b)=>b.wage-a.wage);
  const totalWage = players.reduce((s,p)=>s+p.wage,0);

  return `
    <div class="screen-header"><h1>💰 Finansal Yönetim</h1></div>
    <div class="finance-grid">
      <div class="card">
        <h3>💶 Genel Bakış</h3>
        <div class="finance-stat"><label>Transfer Bütçesi</label><span class="finance-val green">€${fmtVal(finance.budget)}K</span></div>
        <div class="finance-stat"><label>Aylık Ücret Faturası</label><span class="finance-val red">€${fmtVal(totalWage)}K/ay</span></div>
        <div class="finance-stat"><label>Yıllık Ücret Maliyeti</label><span class="finance-val red">€${fmtVal(totalWage*12)}K/yıl</span></div>
        <div class="finance-stat"><label>Stadyum Kapasitesi</label><span class="finance-val">${team.stadium}</span></div>
        <div class="finance-stat"><label>Taraftarlık Seviyesi</label><span class="finance-val">${"⭐".repeat(Math.round(team.prestige/20))}</span></div>
      </div>
      <div class="card">
        <h3>💼 Ücret Dağılımı</h3>
        ${players.slice(0,10).map(p => {
          const pct = Math.round((p.wage/totalWage)*100);
          return `<div class="wage-row">
            <span class="wage-name">${p.name}</span>
            <div class="wage-bar-wrap">
              <div class="wage-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="wage-amt">€${p.wage}K</span>
          </div>`;
        }).join("")}
      </div>
      <div class="card col-span-2">
        <h3>📊 Kadro Değerleri</h3>
        <div class="value-list">
          ${players.slice(0,15).map(p => `
            <div class="value-row">
              <span>${p.name}</span>
              <span class="pos-badge pos-${p.pos}">${p.pos}</span>
              <div class="value-bar-wrap"><div class="value-bar-fill" style="width:${Math.min(100,(p.value/1500))}%"></div></div>
              <span class="value-amt">€${fmtVal(p.value)}K</span>
            </div>`).join("")}
        </div>
        <div class="finance-stat">
          <label>Toplam Kadro Değeri</label>
          <span class="finance-val green">€${fmtVal(players.reduce((s,p)=>s+p.value,0))}K</span>
        </div>
      </div>
    </div>
  `;
}

// ====================== PLAYER DATABASE ======================
function renderPlayerDatabase() {
  return `
    <div class="screen-header"><h1>🔍 Oyuncu Veri Tabanı</h1></div>
    <p class="muted">Transfer ekranından oyuncu arayabilirsiniz.</p>
    <button class="btn-primary" onclick="renderScreen('transfers')">Transfer Pazarına Git →</button>
  `;
}

// ====================== PLAYER DETAIL ======================
function showPlayerDetail(playerId) {
  const p = getPlayer(playerId);
  if (!p) return;
  const ov = calcOverall(p, p.pos);
  const team = p.teamId ? getTeam(p.teamId) : null;
  const radar = renderRadar(p);

  const existing = document.getElementById("player-detail-modal");
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.id = "player-detail-modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content modal-wide">
      <div class="modal-header">
        <h3>${p.name}</h3>
        <button onclick="document.getElementById('player-detail-modal').remove()">✕</button>
      </div>
      <div class="modal-body player-detail">
        <div class="pd-left">
          <div class="pd-overall ov-${getOvClass(ov)}">${ov}</div>
          <div class="pd-pos"><span class="pos-badge pos-${p.pos}">${p.pos}</span>${p.pos2?`<span class="pos-badge pos-${p.pos2}">${p.pos2}</span>`:""}</div>
          <div class="pd-info">${p.nat} • ${p.age} yaş</div>
          <div class="pd-info">${team?team.name:"Serbest Oyuncu"}</div>
          <div class="pd-info">Kontrat: ${p.contractEnd}</div>
          <div class="pd-value">💶 €${fmtVal(p.value)}K</div>
          <div class="pd-wage">💼 €${p.wage}K/ay</div>
          <div class="pd-fitness">💪 Kondisyon: ${p.fitness}%</div>
          <div class="pd-morale">😊 Moral: ${p.morale}%</div>
          ${p.injured ? `<div class="badge badge-injury">🤕 Sakatlandı — ${p.injuryDays} gün</div>` : ""}
          ${p.suspended ? `<div class="badge badge-suspend">🟨 Cezalı</div>` : ""}
        </div>
        <div class="pd-right">
          <div class="attrs-grid">
            <div class="attr-item"><span class="attr-lbl">Hız</span><div class="attr-bar"><div class="attr-fill" style="width:${p.pac}%"></div></div><span class="attr-val">${p.pac}</span></div>
            <div class="attr-item"><span class="attr-lbl">Şut</span><div class="attr-bar"><div class="attr-fill" style="width:${p.sho}%"></div></div><span class="attr-val">${p.sho}</span></div>
            <div class="attr-item"><span class="attr-lbl">Pas</span><div class="attr-bar"><div class="attr-fill" style="width:${p.pas}%"></div></div><span class="attr-val">${p.pas}</span></div>
            <div class="attr-item"><span class="attr-lbl">Çalım</span><div class="attr-bar"><div class="attr-fill" style="width:${p.dri}%"></div></div><span class="attr-val">${p.dri}</span></div>
            <div class="attr-item"><span class="attr-lbl">Savunma</span><div class="attr-bar"><div class="attr-fill" style="width:${p.def}%"></div></div><span class="attr-val">${p.def}</span></div>
            <div class="attr-item"><span class="attr-lbl">Fizik</span><div class="attr-bar"><div class="attr-fill" style="width:${p.phy}%"></div></div><span class="attr-val">${p.phy}</span></div>
          </div>
          <div class="form-history">
            <h4>Son Form</h4>
            <div class="form-bars">
              ${p.form.map(r => `<div class="form-bar" style="height:${r*10}%;background:${r>=7?"#00d084":r>=5?"#f5a623":"#e8262a"}" title="${r}"></div>`).join("")}
            </div>
          </div>
        </div>
      </div>
      ${p.teamId !== STATE.userTeamId && STATE.transferWindow
        ? `<div class="modal-footer"><button class="btn-primary" onclick="document.getElementById('player-detail-modal').remove();openBidDialog(${p.id})">💰 Teklif Ver</button></div>`
        : ""}
    </div>
  `;
  document.body.appendChild(modal);
}

function renderRadar(p) { return ""; } // placeholder

// ====================== MATCH PLAY ======================
function handlePlayMatch() {
  const next = getNextUserMatch();
  if (!next) return;
  const idx = STATE.fixtures.indexOf(next);
  const matchState = startLiveMatch(idx);
  showLiveMatchScreen(matchState);
}

function showLiveMatchScreen(matchState) {
  const f = matchState.fixture;
  const h = getTeam(f.home), a = getTeam(f.away);
  const overlay = document.getElementById("match-overlay");
  overlay.classList.remove("hidden");

  overlay.innerHTML = `
    <div class="live-match">
      <div class="lm-header">
        <div class="lm-team home">${h.badge} ${h.name}</div>
        <div class="lm-score" id="live-score">0 - 0</div>
        <div class="lm-team away">${a.name} ${a.badge}</div>
      </div>
      <div class="lm-pitch">
        <div class="lm-minute" id="live-minute">⚽ Maç Başlıyor...</div>
      </div>
      <div class="lm-commentary" id="live-commentary"></div>
      <div id="lm-progress" class="lm-progress-bar"><div id="lm-progress-fill" style="width:0%"></div></div>
      <button id="lm-skip" class="btn-primary" onclick="finishLiveMatch(${STATE.fixtures.indexOf(f)})">⏭ Bitir</button>
    </div>
  `;

  let currentHome = 0, currentAway = 0;
  const events = matchState.events;
  let i = 0;

  function nextEvent() {
    if (i >= events.length) {
      document.getElementById("lm-skip").textContent = "✅ Devam Et";
      document.getElementById("lm-skip").onclick = () => {
        overlay.classList.add("hidden");
        renderScreen("dashboard");
      };
      return;
    }
    const ev = events[i++];
    const min = ev.min || 0;
    document.getElementById("live-minute").textContent = `⏱ ${min}'`;
    document.getElementById("lm-progress-fill").style.width = `${(min/94)*100}%`;

    if (ev.type === "goal") {
      if (ev.team === f.home) currentHome++;
      else currentAway++;
      document.getElementById("live-score").textContent = `${currentHome} - ${currentAway}`;
    }

    const commentary = document.getElementById("live-commentary");
    const line = document.createElement("div");
    line.className = `commentary-line commentary-${ev.type}`;
    line.innerHTML = `<span class="cm-min">${min}'</span> ${ev.comment || ""}`;
    commentary.insertBefore(line, commentary.firstChild);

    // Keep only last 8 lines
    while (commentary.children.length > 8) commentary.removeChild(commentary.lastChild);

    const delay = ev.type === "goal" ? 1200 : ev.type === "kickoff" || ev.type === "fulltime" ? 1500 : 600;
    setTimeout(nextEvent, delay);
  }

  setTimeout(nextEvent, 500);
}

function finishLiveMatch(fixtureIndex) {
  document.getElementById("match-overlay").classList.add("hidden");
  renderScreen("dashboard");
}

// ====================== WEEK ADVANCE ======================
function handleAdvanceWeek() {
  const next = getNextUserMatch();
  if (next && !next.played) {
    if (!confirm(`${getTeam(next.home).name} - ${getTeam(next.away).name} maçı var. Maçı atlamak istiyor musunuz? (Hayır: Maçı oyna)`)) {
      handlePlayMatch();
      return;
    }
  }
  const results = advanceWeek();
  renderApp();
  if (results.length > 0) {
    const userResult = results.find(r => r.fixture.home === STATE.userTeamId || r.fixture.away === STATE.userTeamId);
    if (userResult) {
      const f = userResult.fixture;
      showToast(`${getTeam(f.home).name} ${f.homeGoals} - ${f.awayGoals} ${getTeam(f.away).name}`, "match");
    }
  }
}

// ====================== HELPERS ======================
function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(()=>toast.remove(),400); }, 3500);
}

function showSaveMenu() {
  saveGame();
  showToast("Oyun kaydedildi! 💾", "success");
}

function sortSquad(by) {
  // Re-render squad with different sort - simplified
  renderScreen("squad");
}

function attachEventListeners() {
  // Close modals on backdrop click
  document.querySelectorAll(".modal").forEach(m => {
    m.onclick = (e) => { if (e.target === m) m.classList.add("hidden"); };
  });
}
