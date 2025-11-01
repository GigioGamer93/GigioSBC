const team = [
  {name:"Alisson", position:"GK", rating:90, nation:"BRA", club:"Liverpool"},
  {name:"Robertson", position:"LB", rating:87, nation:"SCO", club:"Liverpool"},
  {name:"Varane", position:"CB", rating:88, nation:"FRA", club:"Man Utd"},
  {name:"Alaba", position:"CB", rating:88, nation:"AUT", club:"Real Madrid"},
  {name:"De Bruyne", position:"CM", rating:91, nation:"BEL", club:"Man City"},
  {name:"Verratti", position:"CM", rating:88, nation:"ITA", club:"PSG"},
  {name:"Modric", position:"CM", rating:89, nation:"CRO", club:"Real Madrid"},
  {name:"Messi", position:"RW", rating:92, nation:"ARG", club:"Inter Miami"},
  {name:"Neymar", position:"LW", rating:91, nation:"BRA", club:"PSG"},
  {name:"Haaland", position:"ST", rating:91, nation:"NOR", club:"Man City"},
  {name:"Ronaldo", position:"ST", rating:91, nation:"POR", club:"Al-Nassr"}
];

let dragged = null;

// Layout moduli
function getFormationLayout(formation){
  switch(formation){
    case "4-4-2":
      return [
        {x:50,y:90}, {x:20,y:70},{x:40,y:70},{x:60,y:70},{x:80,y:70},
        {x:20,y:50},{x:40,y:50},{x:60,y:50},{x:80,y:50},
        {x:35,y:30},{x:65,y:30}
      ];
    case "4-3-3":
      return [
        {x:50,y:90},{x:20,y:70},{x:40,y:70},{x:60,y:70},{x:80,y:70},
        {x:30,y:50},{x:50,y:50},{x:70,y:50},
        {x:20,y:30},{x:50,y:25},{x:80,y:30}
      ];
    case "3-5-2":
      return [
        {x:50,y:90},{x:25,y:70},{x:50,y:70},{x:75,y:70},
        {x:10,y:50},{x:30,y:50},{x:50,y:50},{x:70,y:50},{x:90,y:50},
        {x:35,y:30},{x:65,y:30}
      ];
    default: return [];
  }
}

// Disegna pool giocatori
function drawPlayerPool(){
  const pool = document.getElementById("playerPool");
  pool.innerHTML = "";
  const roleFilter = document.getElementById("filterRole").value;
  team.forEach((player,i)=>{
    if(roleFilter!=="all" && player.position!==roleFilter) return;
    const div = document.createElement("div");
    div.classList.add("player-card");
    div.draggable = true;
    div.dataset.index = i;
    div.innerHTML = `${player.name}<br>${player.position} (${player.rating})<br>${player.club}`;
    div.addEventListener("dragstart", e=>{
      dragged = div;
      div.style.opacity="0.6";
    });
    div.addEventListener("dragend", e=>{
      dragged=null;
      div.style.opacity="1";
    });
    pool.appendChild(div);
  });
}

// Disegna formazione
function drawFormation(){
  const formation = document.getElementById("formation").value;
  const layout = getFormationLayout(formation);
  const field = document.getElementById("formationField");
  field.innerHTML = "";
  layout.forEach((pos,i)=>{
    const player = team[i] || {name:"-", position:"", rating:""};
    const dot = document.createElement("div");
    dot.classList.add("player-dot");
    dot.style.left = pos.x + "%";
    dot.style.top = pos.y + "%";
    dot.innerHTML = `${player.name}<br>${player.position}`;
    dot.addEventListener("dragover", e=>e.preventDefault());
    dot.addEventListener("drop", e=>{
      e.preventDefault();
      if(!dragged) return;
      dot.innerHTML = dragged.innerHTML;
    });
    field.appendChild(dot);
  });

  field.addEventListener("dragover", e=>e.preventDefault());
  field.addEventListener("drop", e=>{
    e.preventDefault();
    if(!dragged) return;
    const rect = field.getBoundingClientRect();
    const x = ((e.clientX-rect.left)/rect.width)*100;
    const y = ((e.clientY-rect.top)/rect.height)*100;

    // Snap posizione più vicina
    let closest = layout[0];
    let minDist = Number.MAX_VALUE;
    layout.forEach(pos=>{
      const dist = Math.hypot(pos.x-x,pos.y-y);
      if(dist<minDist){minDist=dist; closest=pos;}
    });

    const dot = document.createElement("div");
    dot.classList.add("player-dot","highlight");
    dot.innerHTML = dragged.innerHTML;
    dot.style.left = closest.x+"%";
    dot.style.top = closest.y+"%";
    field.appendChild(dot);
    setTimeout(()=>dot.classList.remove("highlight"),500);
  });
}

// Reset formazione
function resetFormation(){
  drawFormation();
}

// Eventi
document.getElementById("formation").addEventListener("change", drawFormation);
document.getElementById("filterRole").addEventListener("change", drawPlayerPool);
document.getElementById("resetBtn").addEventListener("click", resetFormation);

// Carica inizialmente
window.onload = ()=>{
  drawPlayerPool();
  drawFormation();
};
