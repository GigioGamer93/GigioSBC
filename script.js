// variabile globale per il drag
let dragged = null;

// layout base dei moduli (percentuale su campo)
function getFormationLayout(formation) {
  switch(formation) {
    case "4-4-2":
      return [
        {x:50, y:90}, // portiere
        {x:20, y:70}, {x:40, y:70}, {x:60, y:70}, {x:80, y:70}, // difensori
        {x:20, y:50}, {x:40, y:50}, {x:60, y:50}, {x:80, y:50}, // centrocampisti
        {x:35, y:30}, {x:65, y:30} // attaccanti
      ];
    case "4-3-3":
      return [
        {x:50, y:90}, 
        {x:20, y:70}, {x:40, y:70}, {x:60, y:70}, {x:80, y:70}, 
        {x:30, y:50}, {x:50, y:50}, {x:70, y:50}, 
        {x:20, y:30}, {x:50, y:25}, {x:80, y:30} 
      ];
    case "3-5-2":
      return [
        {x:50, y:90}, 
        {x:25, y:70}, {x:50, y:70}, {x:75, y:70}, 
        {x:10, y:50}, {x:30, y:50}, {x:50, y:50}, {x:70, y:50}, {x:90, y:50}, 
        {x:35, y:30}, {x:65, y:30}
      ];
    default:
      return [];
  }
}

// disegna i giocatori sul campo
function drawFormation(formation, team) {
  const fieldDiv = document.getElementById("formationField");
  fieldDiv.innerHTML = "";

  const layout = getFormationLayout(formation);

  fieldDiv.style.position = "relative";

  layout.forEach((pos, i) => {
    const player = team[i];
    const div = document.createElement("div");
    div.classList.add("player-dot");
    div.draggable = true;
    div.dataset.index = i;

    div.style.left = pos.x + "%";
    div.style.top = pos.y + "%";

    div.innerHTML = player
      ? `${player.name}<br><small>${player.position} (${player.rating})</small>`
      : "—";

    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragend", dragEnd);

    fieldDiv.appendChild(div);
  });

  fieldDiv.addEventListener("dragover", dragOver);
  fieldDiv.addEventListener("drop", dropPlayer);

  // carica eventuali posizioni salvate
  loadPositions();
}

// eventi drag
function dragStart(e) {
  dragged = e.target;
  e.target.style.opacity = "0.6";
  e.target.classList.add("highlight");
}

function dragEnd(e) {
  e.target.style.opacity = "1";
  e.target.classList.remove("highlight");
}

function dragOver(e) {
  e.preventDefault();
}

function dropPlayer(e) {
  e.preventDefault();
  if (!dragged) return;

  const fieldDiv = e.currentTarget;
  const rect = fieldDiv.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  // SNAP automatico
  const formation = document.getElementById("formation").value;
  const layout = getFormationLayout(formation);

  let closest = layout[0];
  let minDist = Number.MAX_VALUE;
  layout.forEach(pos => {
    const dist = Math.hypot(pos.x - x, pos.y - y);
    if (dist < minDist) {
      minDist = dist;
      closest = pos;
    }
  });

  dragged.style.left = `${closest.x}%`;
  dragged.style.top = `${closest.y}%`;

  savePositions();
}

// salva le posizioni in localStorage
function savePositions() {
  const fieldDiv = document.getElementById("formationField");
  const positions = {};
  fieldDiv.querySelectorAll(".player-dot").forEach(dot => {
    positions[dot.dataset.index] = {
      left: dot.style.left,
      top: dot.style.top
    };
  });
  localStorage.setItem("playerPositions", JSON.stringify(positions));
}

// carica posizioni salvate
function loadPositions() {
  const fieldDiv = document.getElementById("formationField");
  const positions = JSON.parse(localStorage.getItem("playerPositions") || "{}");
  fieldDiv.querySelectorAll(".player-dot").forEach(dot => {
    if (positions[dot.dataset.index]) {
      dot.style.left = positions[dot.dataset.index].left;
      dot.style.top = positions[dot.dataset.index].top;
    }
  });
}

// reset con animazione e highlight
function resetFormation() {
  localStorage.removeItem("playerPositions");

  const formation = document.getElementById("formation").value;
  const layout = getFormationLayout(formation);
  const fieldDiv = document.getElementById("formationField");

  fieldDiv.querySelectorAll(".player-dot").forEach((dot, i) => {
    if (layout[i]) {
      dot.classList.add("highlight");
      dot.style.left = layout[i].x + "%";
      dot.style.top = layout[i].y + "%";

      setTimeout(() => {
        dot.classList.remove("highlight");
      }, 500);
    }
  });
}
