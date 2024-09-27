const cc = console.log;
const container = document.getElementById("container");
const resetBtn = document.getElementById("reset");

let speed = 0;
let divsNum = 40;
let divVars = {};

let changeMode = "Hue";
//Hue , Saturation , Lightness

resetBtn.addEventListener("click", resetGrid);

//ADDING DIVS INTO DIVVARS DYNAMICALLY
for (let i = 1; i <= divsNum; i++) {
  let divName = "div" + i;
  let newDiv = document.createElement("DIV");
  newDiv.setAttribute("id", divName);

  container.append(newDiv);
  let getNewDiv = document.getElementById(divName);

  getNewDiv.addEventListener("mousemove", colorChange);

  divVars[divName] = {
    divHue: 340,
    directionHue: 1,
    divSaturation: 100,
    directionSaturation: 1,
    divLightness: 50,
    directionLightness: 1,
  };
}

function selectMode() {
  changeMode = this.value;
}

let modeOptions = document.querySelectorAll("input[name = mode]");
modeOptions.forEach((e) => {
  e.addEventListener("click", selectMode);
});

function colorChange() {
  let d = divVars[this.id];
  let id = document.getElementById(this.id);

  if (changeMode === "Lightness" || changeMode === "Saturation") {
    speed = 1;
    if (d["div" + changeMode] >= 100) {
      d["div" + changeMode] = 99;
      d["direction" + changeMode] = -1;
    }
    if (d["div" + changeMode] <= 0) {
      d["div" + changeMode] = 1;
      d["direction" + changeMode] = 1;
    }
  } else {
    speed = 5;
    if (d["div" + changeMode] > 360) {
      d["div" + changeMode] = 0;
    }
  }
  d["div" + changeMode] += speed * d["direction" + changeMode];
  id.style.backgroundColor = `hsl(${d.divHue} ${d.divSaturation} ${d.divLightness})`;
}

function resetGrid() {
  let x = divVars;
  for (const e in x) {
    x[e] = {
      divHue: 340,
      directionHue: 1,
      divSaturation: 100,
      directionSaturation: 1,
      divLightness: 50,
      directionLightness: 1,
    };
  }
  for (const child of container.children) {
    document.getElementById(child.id).style.backgroundColor = "white";
  }
}
