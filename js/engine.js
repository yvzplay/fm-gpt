// ====================== GAME STATE ======================
const STATE = {
  userTeamId: null,
  players: [],
  freeAgents: [],
  fixtures: [],
  date: null, // JS Date
  week: 0,
  season: 2024,
  transferWindow: true, // open at start, closes after matchday 3
  news: [],
  lineups: {}, // teamId -> { formation, players: [11 player ids] }
  finances: {}, // teamId -> { budget, wageBill }
  bids: [], // { fromTeamId, toTeamId, playerId, amount, status }
  scoutedPlayers: [], // player ids scouted by user
  injuryList: [], // { playerId, returnDate }
};

function initGame(teamId) {
  STATE.userTeamId = teamId;
  STATE.players = PLAYERS_INIT.map(p => ({...p}));
  STATE.freeAgents = FREE_AGENTS_INIT.map(p => ({...p}));
  STATE.fixtures = generateFixtures();
  STATE.date = new Date(2024, 7, 10); // Aug 10, 2024
  STATE.week = 1;
  STATE.news = [];
  STATE.bids = [];
  STATE.scoutedPlayers = [];

  // Initialize finances
  for (const t of TEAMS) {
    STATE.finances[t.id] = {
      budget: t.budget,
      wageBill: getTeamPlayers(t.id).reduce((s,p) => s + p.wage, 0)
    };
  }

  // Initialize default lineups for all teams
  for (const t of TEAMS) {
    autoSetLineup(t.id);
  }

  addNews(`Sezon başladı! ${getTeam(teamId).name} ile Süper Lig'e hazırsınız!`, "info");
  saveGame();
}

function getTeam(id) { return TEAMS.find(t => t.id === id); }
function getTeamPlayers(teamId) { return STATE.players.filter(p => p.teamId === teamId); }
function getPlayer(id) { return STATE.players.find(p => p.id === id) || STATE.freeAgents.find(p => p.id === id); }

function autoSetLineup(teamId) {
  const formation = "4-3-3";
  const formDef = FORMATIONS[formation];
  const squad = getTeamPlayers(teamId).filter(p => !p.injured && !p.suspended);
  const slots = formDef.slots;
  const chosen = [];
  const used = new Set();

  for (const slot of slots) {
    // Find best player for this slot
    const eligible = squad.filter(p => !used.has(p.id));
    let best = null, bestScore = -1;
    for (const p of eligible) {
      const compat = (POSITION_COMPAT[slot] && POSITION_COMPAT[slot][p.pos]) || 0;
      const score = calcOverall(p, slot) * (p.fitness / 100);
      if (score > bestScore) { bestScore = score; best = p; }
    }
    if (best) { chosen.push(best.id); used.add(best.id); }
    else { chosen.push(null); }
  }

  STATE.lineups[teamId] = { formation, players: chosen };
}

function setLineup(teamId, formation, playerIds) {
  STATE.lineups[teamId] = { formation, players: playerIds };
  saveGame();
}

function getLineup(teamId) {
  if (!STATE.lineups[teamId]) autoSetLineup(teamId);
  return STATE.lineups[teamId];
}

// ====================== STANDINGS ======================
function getStandings() {
  const table = {};
  for (const t of TEAMS) {
    table[t.id] = { teamId: t.id, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
  }
  for (const f of STATE.fixtures) {
    if (!f.played) continue;
    const h = table[f.home], a = table[f.away];
    h.p++; a.p++;
    h.gf += f.homeGoals; h.ga += f.awayGoals;
    a.gf += f.awayGoals; a.ga += f.homeGoals;
    if (f.homeGoals > f.awayGoals) { h.w++; h.pts+=3; a.l++; }
    else if (f.homeGoals < f.awayGoals) { a.w++; a.pts+=3; h.l++; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  return Object.values(table).sort((a,b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga, gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

// ====================== TRANSFER SYSTEM ======================
function makeTransferBid(fromTeamId, playerId, amount) {
  const player = getPlayer(playerId);
  if (!player) return { ok: false, msg: "Oyuncu bulunamadı." };
  const finance = STATE.finances[fromTeamId];
  if (amount > finance.budget) return { ok: false, msg: "Yeterli bütçe yok." };

  // Remove old bid for same player from same team
  STATE.bids = STATE.bids.filter(b => !(b.fromTeamId === fromTeamId && b.playerId === playerId));

  STATE.bids.push({ id: Date.now(), fromTeamId, toTeamId: player.teamId, playerId, amount, status: "pending" });

  // AI auto-response
  const minAccept = player.value * 0.85;
  if (amount >= minAccept) {
    return acceptBid(STATE.bids[STATE.bids.length - 1].id);
  } else {
    const bid = STATE.bids[STATE.bids.length - 1];
    bid.status = "rejected";
    return { ok: false, msg: `Teklif reddedildi. Minimum kabul değeri: €${fmtVal(minAccept)}` };
  }
}

function acceptBid(bidId) {
  const bid = STATE.bids.find(b => b.id === bidId);
  if (!bid) return { ok: false, msg: "Teklif bulunamadı." };
  const player = getPlayer(bid.playerId);
  if (!player) return { ok: false, msg: "Oyuncu bulunamadı." };

  // Wage negotiation (player wants ~market rate)
  const newWage = Math.round(player.wage * (0.9 + Math.random() * 0.4));
  const maxWage = STATE.finances[bid.fromTeamId].wageBill * 0.15;
  if (newWage > STATE.finances[bid.fromTeamId].budget * 0.1) {
    bid.status = "rejected";
    return { ok: false, msg: `Oyuncu ücret anlaşması sağlanamadı. İstenen ücret: €${fmtVal(newWage)}k/ay` };
  }

  // Execute transfer
  STATE.finances[bid.fromTeamId].budget -= bid.amount;
  if (bid.toTeamId) STATE.finances[bid.toTeamId].budget += bid.amount;

  const oldTeam = player.teamId;
  player.teamId = bid.fromTeamId;
  player.wage = newWage;
  player.morale = 75;

  // Remove from free agents if applicable
  if (!oldTeam) {
    STATE.freeAgents = STATE.freeAgents.filter(p => p.id !== player.id);
    if (!STATE.players.find(p => p.id === player.id)) STATE.players.push(player);
  }

  bid.status = "accepted";
  addNews(`${player.name}, €${fmtVal(bid.amount)}k karşılığında ${getTeam(bid.fromTeamId).name}'a transfer oldu!`, "transfer");
  autoSetLineup(bid.fromTeamId);
  if (oldTeam) autoSetLineup(oldTeam);
  saveGame();
  return { ok: true, msg: `Transfer tamamlandı! ${player.name} kadronuza katıldı.`, wage: newWage };
}

function sellPlayer(playerId, toTeamId, amount) {
  return makeTransferBid(toTeamId, playerId, amount);
}

function releasePlayer(playerId) {
  const player = getPlayer(playerId);
  if (!player || player.teamId !== STATE.userTeamId) return;
  STATE.finances[STATE.userTeamId].budget += Math.round(player.value * 0.05); // small compensation
  player.teamId = null;
  STATE.players = STATE.players.filter(p => p.id !== playerId);
  STATE.freeAgents.push(player);
  addNews(`${player.name} serbest bırakıldı.`, "info");
  saveGame();
}

// ====================== WEEK ADVANCE ======================
function getCurrentMatchday() {
  // Map week to matchday (roughly 1 matchday per week, sometimes 2)
  return Math.min(Math.ceil(STATE.week / 1), 18);
}

function getNextUserMatch() {
  return STATE.fixtures.find(f =>
    (f.home === STATE.userTeamId || f.away === STATE.userTeamId) && !f.played
  );
}

function advanceWeek() {
  STATE.week++;
  STATE.date.setDate(STATE.date.getDate() + 7);

  // Simulate all unplayed matches up to current matchday
  const md = getCurrentMatchday();
  const toPlay = STATE.fixtures.filter(f => !f.played && f.matchday === md);
  const results = [];
  for (const f of toPlay) {
    const res = simulateMatch(f.home, f.away);
    f.played = true;
    f.homeGoals = res.homeGoals;
    f.awayGoals = res.awayGoals;
    f.events = res.events;
    results.push({ fixture: f, ...res });
  }

  // Weekly player updates
  weeklyPlayerUpdate();

  // Transfer window management
  if (md > 3) STATE.transferWindow = false;
  if (md >= 14 && md <= 16) STATE.transferWindow = true; // winter window

  // AI transfers
  if (STATE.transferWindow && STATE.week % 2 === 0) doAITransfers();

  addNews(`Hafta ${STATE.week} tamamlandı.`, "match");
  saveGame();
  return results;
}

function weeklyPlayerUpdate() {
  for (const p of STATE.players) {
    // Fitness recovery
    p.fitness = Math.min(100, p.fitness + (p.injured ? 0 : 5));
    // Morale drift toward 65
    p.morale = Math.round(p.morale * 0.95 + 65 * 0.05);
    // Injury recovery
    if (p.injured) {
      p.injuryDays = Math.max(0, p.injuryDays - 7);
      if (p.injuryDays <= 0) { p.injured = false; p.injuryDays = 0; }
    }
    // Card suspension reset
    if (p.yellowCards >= 5) { p.suspended = true; p.yellowCards = 0; }
    else p.suspended = false;
    // Young player development
    if (p.age <= 23 && Math.random() < 0.05) {
      const attrs = ['pac','sho','pas','dri','def','phy'];
      const attr = attrs[Math.floor(Math.random()*attrs.length)];
      if (p[attr] < 90) p[attr]++;
    }
    // Veteran decline
    if (p.age >= 34 && Math.random() < 0.03) {
      const attrs = ['pac','phy'];
      const attr = attrs[Math.floor(Math.random()*attrs.length)];
      if (p[attr] > 50) p[attr]--;
    }
  }
}

function doAITransfers() {
  // Simple AI: each team randomly scouts a free agent
  for (const t of TEAMS) {
    if (t.id === STATE.userTeamId) continue;
    if (Math.random() > 0.3) continue;
    const finance = STATE.finances[t.id];
    const affordable = STATE.freeAgents.filter(p => p.value <= finance.budget * 0.3);
    if (affordable.length === 0) continue;
    const target = affordable[Math.floor(Math.random() * affordable.length)];
    const bid = Math.round(target.value * (0.9 + Math.random() * 0.3));
    makeTransferBid(t.id, target.id, bid);
  }
}

// ====================== NEWS ======================
function addNews(msg, type = "info") {
  STATE.news.unshift({ msg, type, date: formatDate(STATE.date), week: STATE.week });
  if (STATE.news.length > 50) STATE.news.pop();
}

// ====================== SAVE/LOAD ======================
function saveGame() {
  try {
    const save = {
      userTeamId: STATE.userTeamId,
      players: STATE.players,
      freeAgents: STATE.freeAgents,
      fixtures: STATE.fixtures,
      date: STATE.date.toISOString(),
      week: STATE.week,
      season: STATE.season,
      transferWindow: STATE.transferWindow,
      news: STATE.news,
      lineups: STATE.lineups,
      finances: STATE.finances,
      bids: STATE.bids,
      scoutedPlayers: STATE.scoutedPlayers,
    };
    localStorage.setItem('fm_turkey_save', JSON.stringify(save));
  } catch(e) { console.warn("Save failed:", e); }
}

function loadGame() {
  try {
    const raw = localStorage.getItem('fm_turkey_save');
    if (!raw) return false;
    const save = JSON.parse(raw);
    Object.assign(STATE, save);
    STATE.date = new Date(save.date);
    return true;
  } catch(e) { console.warn("Load failed:", e); return false; }
}

function deleteSave() {
  localStorage.removeItem('fm_turkey_save');
}

// ====================== HELPERS ======================
function formatDate(d) {
  const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtVal(v) {
  if (v >= 1000) return (v/1000).toFixed(1) + "M";
  return v + "K";
}

function getTeamStrength(teamId) {
  const lineup = getLineup(teamId);
  const players = lineup.players.map(id => id ? getPlayer(id) : null).filter(Boolean);
  if (players.length === 0) return 60;
  const avg = players.reduce((s,p) => s + calcOverall(p, p.pos), 0) / players.length;
  return avg;
}

function getTopScorers() {
  // Rough estimation from match events
  const scores = {};
  for (const f of STATE.fixtures) {
    if (!f.played || !f.events) continue;
    for (const ev of f.events) {
      if (ev.type === "goal" && ev.playerId) {
        scores[ev.playerId] = (scores[ev.playerId] || 0) + 1;
      }
    }
  }
  return Object.entries(scores)
    .sort((a,b) => b[1]-a[1])
    .slice(0,10)
    .map(([id,g]) => ({ player: getPlayer(+id), goals: g }))
    .filter(x => x.player);
}

function getPlayerForm(player) {
  const avg = player.form.reduce((s,v)=>s+v,0)/player.form.length;
  if (avg >= 8) return "🔥";
  if (avg >= 7) return "↑";
  if (avg >= 5.5) return "→";
  return "↓";
}
