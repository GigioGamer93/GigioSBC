let players = [];

function addPlayer() {
  const name = document.getElementById("name").value;
  const nation = document.getElementById("nation").value;
  const club = document.getElementById("club").value;
  const league = document.getElementById("league").value;
  const position = document.getElementById("position").value;
  const rating = parseInt(document.getElementById("rating").value);

  if (!name) return alert("Inserisci almeno il nome del giocatore!");

  const player = { name, nation, club, league, position, rating };
  players.push(player);
  renderPlayers();

  // pulisci i campi
  document.querySelectorAll("input").forEach(i => i.value = "");
}

function renderPlayers() {
  const tbody = document.querySelector("#playerTable tbody");
  tbody.innerHTML = "";
  players.forEach(p => {
    const row = `<tr>
      <td>${p.name}</td>
      <td>${p.nation}</td>
      <td>${p.club}</td>
      <td>${p.league}</td>
      <td>${p.position}</td>
      <td>${p.rating || ""}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}
