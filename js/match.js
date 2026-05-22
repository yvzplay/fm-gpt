// ====================== MATCH SIMULATION ENGINE ======================

function simulateMatch(homeId, awayId) {
  const homePlayers = getStartingEleven(homeId);
  const awayPlayers = getStartingEleven(awayId);

  const homeStr = teamMatchStrength(homeId, homePlayers);
  const awayStr = teamMatchStrength(awayId, awayPlayers);

  const homeAdv = 1.08; // home advantage
  const adjHome = homeStr * homeAdv;
  const adjAway = awayStr;

  // Expected goals based on strength ratio
  const total = adjHome + adjAway;
  const homeProb = adjHome / total;

  // Poisson-like goal generation
  const avgGoals = 2.5 + (Math.abs(homeStr - awayStr) / 100);
  const homeExpected = avgGoals * homeProb;
  const awayExpected = avgGoals * (1 - homeProb);

  const homeGoals = poissonSample(homeExpected);
  const awayGoals = poissonSample(awayExpected);

  // Generate events
  const events = generateEvents(homeId, awayId, homeGoals, awayGoals, homePlayers, awayPlayers);

  // Update player stats
  updatePlayerStats(homePlayers, awayPlayers, homeGoals, awayGoals, events);

  return { homeGoals, awayGoals, events, homeStr: Math.round(homeStr), awayStr: Math.round(awayStr) };
}

function getStartingEleven(teamId) {
  const lineup = getLineup(teamId);
  return lineup.players
    .map(id => id ? getPlayer(id) : null)
    .filter(Boolean)
    .slice(0, 11);
}

function teamMatchStrength(teamId, players) {
  if (!players || players.length === 0) {
    // Fallback: use all team players
    const tp = getTeamPlayers(teamId).slice(0, 11);
    if (tp.length === 0) return 60;
    return tp.reduce((s,p) => s + calcOverall(p,p.pos), 0) / tp.length;
  }
  const lineup = getLineup(teamId);
  const slots = FORMATIONS[lineup.formation]?.slots || [];
  let total = 0;
  players.forEach((p, i) => {
    const slot = slots[i] || p.pos;
    const ov = calcOverall(p, slot);
    const fitnessMulti = 0.7 + (p.fitness / 100) * 0.3;
    const moraleMulti = 0.9 + (p.morale / 100) * 0.2;
    total += ov * fitnessMulti * moraleMulti;
  });
  return total / players.length;
}

function poissonSample(lambda) {
  let L = Math.exp(-lambda), k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

function generateEvents(homeId, awayId, homeGoals, awayGoals, homePlayers, awayPlayers) {
  const events = [];
  const homeTeam = getTeam(homeId);
  const awayTeam = getTeam(awayId);

  // Distribute goals across minutes
  const homeGoalMins = randomMinutes(homeGoals);
  const awayGoalMins = randomMinutes(awayGoals);

  const homeAttackers = homePlayers.filter(p => ["ST","CAM","RW","LW","CF"].includes(p.pos));
  const awayAttackers = awayPlayers.filter(p => ["ST","CAM","RW","LW","CF"].includes(p.pos));

  for (const min of homeGoalMins) {
    const scorer = pickScorer(homeAttackers, homePlayers);
    const assist = pickAssist(homePlayers, scorer);
    events.push({
      min, type: "goal", team: homeId,
      playerId: scorer?.id,
      playerName: scorer?.name || "?",
      assistId: assist?.id,
      assistName: assist?.name,
      comment: COMMENTARY.goal[Math.floor(Math.random()*COMMENTARY.goal.length)]
    });
  }

  for (const min of awayGoalMins) {
    const scorer = pickScorer(awayAttackers, awayPlayers);
    const assist = pickAssist(awayPlayers, scorer);
    events.push({
      min, type: "goal", team: awayId,
      playerId: scorer?.id,
      playerName: scorer?.name || "?",
      assistId: assist?.id,
      assistName: assist?.name,
      comment: COMMENTARY.goal[Math.floor(Math.random()*COMMENTARY.goal.length)]
    });
  }

  // Yellow cards (2-4 per match)
  const yellows = 1 + Math.floor(Math.random()*4);
  for (let i = 0; i < yellows; i++) {
    const min = 5 + Math.floor(Math.random()*80);
    const isHome = Math.random() < 0.5;
    const pool = isHome ? homePlayers : awayPlayers;
    const p = pool[Math.floor(Math.random()*pool.length)];
    if (p) {
      events.push({ min, type: "yellow", team: isHome ? homeId : awayId, playerId: p.id, playerName: p.name,
        comment: COMMENTARY.yellow[Math.floor(Math.random()*COMMENTARY.yellow.length)] });
    }
  }

  // Red card (8% chance)
  if (Math.random() < 0.08) {
    const min = 30 + Math.floor(Math.random()*55);
    const isHome = Math.random() < 0.5;
    const pool = isHome ? homePlayers : awayPlayers;
    const p = pool[Math.floor(Math.random()*pool.length)];
    if (p) {
      events.push({ min, type: "red", team: isHome ? homeId : awayId, playerId: p.id, playerName: p.name,
        comment: COMMENTARY.red[Math.floor(Math.random()*COMMENTARY.red.length)] });
    }
  }

  // Injury (15% chance)
  if (Math.random() < 0.15) {
    const min = 10 + Math.floor(Math.random()*75);
    const isHome = Math.random() < 0.5;
    const pool = isHome ? homePlayers : awayPlayers;
    const p = pool[Math.floor(Math.random()*pool.length)];
    if (p) {
      const days = 7 + Math.floor(Math.random()*35);
      events.push({ min, type: "injury", team: isHome ? homeId : awayId, playerId: p.id, playerName: p.name,
        days, comment: `${p.name} sakatlıkla oyunu bıraktı. Tahmini süre: ${days} gün.` });
    }
  }

  // Substitutions
  const subMins = [60,65,70,75,80];
  for (let i = 0; i < 3; i++) {
    events.push({ min: subMins[i], type: "sub", team: homeId, comment: `${homeTeam.name} değişiklik yapıyor.` });
    events.push({ min: subMins[i]+2, type: "sub", team: awayId, comment: `${awayTeam.name} değişiklik yapıyor.` });
  }

  // Sort by minute
  events.sort((a,b) => a.min - b.min);

  // Add match context events
  events.unshift({ min: 0, type: "kickoff", comment: `Maç başladı! ${homeTeam.name} - ${awayTeam.name}` });
  events.push({ min: 90, type: "fulltime", comment: `Maç sona erdi! ${homeTeam.name} ${homeGoals} - ${awayGoals} ${awayTeam.name}` });

  return events;
}

function randomMinutes(count) {
  const mins = [];
  for (let i = 0; i < count; i++) {
    mins.push(1 + Math.floor(Math.random()*92));
  }
  return mins.sort((a,b)=>a-b);
}

function pickScorer(attackers, allPlayers) {
  const pool = attackers.length > 0 ? attackers : allPlayers;
  // Weight by shooting
  const total = pool.reduce((s,p)=>s+p.sho,0);
  let rand = Math.random()*total;
  for (const p of pool) {
    rand -= p.sho;
    if (rand <= 0) return p;
  }
  return pool[0];
}

function pickAssist(allPlayers, scorer) {
  const pool = allPlayers.filter(p => p !== scorer);
  if (pool.length === 0) return null;
  // Weight by passing
  const total = pool.reduce((s,p)=>s+p.pas,0);
  let rand = Math.random()*total;
  for (const p of pool) {
    rand -= p.pas;
    if (rand <= 0) return p;
  }
  return pool[0];
}

function updatePlayerStats(homePlayers, awayPlayers, homeGoals, awayGoals, events) {
  // Update fitness
  const allPlayers = [...homePlayers, ...awayPlayers];
  for (const p of allPlayers) {
    const real = getPlayer(p.id);
    if (!real) continue;
    real.fitness = Math.max(50, real.fitness - (10 + Math.floor(Math.random()*10)));
    // Update form (match rating 1-10)
    const rating = generateMatchRating(p, events);
    real.form = [rating, ...real.form.slice(0,4)];
  }

  // Handle injuries from events
  for (const ev of events) {
    if (ev.type === "injury" && ev.playerId) {
      const p = getPlayer(ev.playerId);
      if (p) { p.injured = true; p.injuryDays = ev.days; p.fitness = 0; }
    }
    if (ev.type === "yellow" && ev.playerId) {
      const p = getPlayer(ev.playerId);
      if (p) p.yellowCards = (p.yellowCards || 0) + 1;
    }
    if (ev.type === "red" && ev.playerId) {
      const p = getPlayer(ev.playerId);
      if (p) p.suspended = true;
    }
  }
}

function generateMatchRating(player, events) {
  let rating = 6.0;
  for (const ev of events) {
    if (ev.playerId === player.id) {
      if (ev.type === "goal") rating += 1.5;
      if (ev.type === "yellow") rating -= 0.5;
      if (ev.type === "red") rating -= 2;
    }
    if (ev.assistId === player.id) rating += 0.8;
  }
  rating += (Math.random() - 0.5) * 2;
  return Math.max(3, Math.min(10, Math.round(rating * 10) / 10));
}

// ====================== LIVE MATCH SIMULATION ======================
// Used for user's match - shows events one by one with delay

let liveMatchState = null;

function startLiveMatch(fixtureIndex) {
  const fixture = STATE.fixtures[fixtureIndex];
  if (!fixture) return null;

  const result = simulateMatch(fixture.home, fixture.away);
  fixture.played = true;
  fixture.homeGoals = result.homeGoals;
  fixture.awayGoals = result.awayGoals;
  fixture.events = result.events;

  // Update morale based on result
  const isUserHome = fixture.home === STATE.userTeamId;
  const userGoals = isUserHome ? result.homeGoals : result.awayGoals;
  const oppGoals = isUserHome ? result.awayGoals : result.homeGoals;
  const userPlayers = getTeamPlayers(STATE.userTeamId);
  for (const p of userPlayers) {
    if (userGoals > oppGoals) p.morale = Math.min(100, p.morale + 10);
    else if (userGoals < oppGoals) p.morale = Math.max(10, p.morale - 10);
    else p.morale = Math.min(100, p.morale + 3);
  }

  liveMatchState = {
    fixture,
    events: result.events,
    currentEventIndex: 0,
    homeGoals: result.homeGoals,
    awayGoals: result.awayGoals,
    displayedHomeGoals: 0,
    displayedAwayGoals: 0
  };

  addNews(buildResultNews(fixture), "match");
  saveGame();
  return liveMatchState;
}

function buildResultNews(f) {
  const h = getTeam(f.home), a = getTeam(f.away);
  return `${h.name} ${f.homeGoals} - ${f.awayGoals} ${a.name} (Maç ${f.matchday}. Hafta)`;
}
