let players = [];

// ✅ Carica i dati salvati dal localStorage all'avvio
window.onload = function() {
  const saved = localStorage.getItem("players");
  if (saved) {
    players = JSON.parse(saved);
    renderPlayers();
  }
};

function addPlayer() {
  const name = document.getElementById("name").value.trim();
  const nation = document.getElementById("nation").value.trim();
  const club = document.getElementById("club").value.trim();
  const league = document.getElementById("league").value.trim();
  const position = document.getElementById("position").value.trim();
  const rating = parseInt(document.getElementById("rating").value);

  if (!name) return alert("Inserisci almeno il nome del giocatore!");

  const player = { name, nation, club, league, position, rating: rating || 0 };
  players.push(player);
  savePlayers();
  renderPlayers();

  // pulisci i campi
  document.querySelectorAll("input").forEach(i => i.value = "");
}

function renderPlayers() {
  const tbody = document.querySelector("#playerTable tbody");
  tbody.innerHTML = "";
  players.forEach((p, index) => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.nation}</td>
      <td>${p.club}</td>
      <td>${p.league}</td>
      <td>${p.position}</td>
      <td>${p.rating}</td>
      <td><button onclick="deletePlayer(${index})">❌</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// ✅ Salva l’array nel localStorage
function savePlayers() {
  localStorage.setItem("players", JSON.stringify(players));
}

// 🗑️ Elimina un giocatore
function deletePlayer(index) {
  if (confirm("Vuoi davvero eliminare questo giocatore?")) {
    players.splice(index, 1);
    savePlayers();
    renderPlayers();
  }
}
