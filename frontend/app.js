// FM-GPT Frontend Application

const API_BASE = 'http://localhost:5000/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  const root = document.getElementById('root');
  
  // Render header
  root.innerHTML = `
    <header class="header">
      <div class="container">
        <h1>⚽ FM-GPT - Football Manager</h1>
        <nav class="nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#teams">Teams</a>
          <a href="#matches">Matches</a>
          <a href="#transfers">Transfers</a>
          <a href="#finance">Finance</a>
        </nav>
      </div>
    </header>
    <main class="container" style="padding-top: 20px;">
      <div id="content"></div>
    </main>
  `;
  
  // Check API health and load teams
  try {
    const health = await fetch(`${API_BASE}/health`).then(r => r.json());
    console.log('Server status:', health);
    loadTeams();
  } catch (error) {
    console.error('Failed to connect to server:', error);
    document.getElementById('content').innerHTML = `
      <div class="error">
        <strong>Error:</strong> Could not connect to server. Make sure the backend is running on http://localhost:5000
      </div>
    `;
  }
}

async function loadTeams() {
  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading">Loading teams...</div>';
  
  try {
    // In a real app, fetch from API
    // For now, load from local data file
    const teamsData = await loadTeamsData();
    renderTeams(teamsData);
  } catch (error) {
    console.error('Error loading teams:', error);
    content.innerHTML = `<div class="error">Error loading teams</div>`;
  }
}

async function loadTeamsData() {
  // This would be replaced with actual API calls
  const response = await fetch('../data/teams-super-lig.json');
  return response.json();
}

function renderTeams(data) {
  const content = document.getElementById('content');
  const { league, teams } = data;
  
  let html = `
    <div class="card">
      <h2 class="card-title">${league} - Top 10 Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>City</th>
            <th>Stadium</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  teams.forEach((team) => {
    html += `
      <tr>
        <td>${team.league_position}</td>
        <td><strong>${team.name}</strong></td>
        <td>${team.city}</td>
        <td>${team.stadium}</td>
        <td>$${(team.budget / 1000000).toFixed(1)}M</td>
        <td>
          <button class="button button-primary" onclick="selectTeam(${team.id}, '${team.name}')">Manage</button>
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  content.innerHTML = html;
}

function selectTeam(teamId, teamName) {
  alert(`Team ${teamName} (ID: ${teamId}) selected!\n\nCareer mode coming soon...`);
  // This would navigate to team management screen
}
