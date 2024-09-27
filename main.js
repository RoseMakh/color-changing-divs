const cc = console.log; //for testing
const container = document.getElementById("container");
const resetBtn = document.getElementById("reset");
const hslValueDisplay = document.getElementById("hslValue");

let changeSize = "Large";
let sizeValue = "";
let speed = 0;
let startDiv = 1;
let prevStartDiv = 0;
let divsNum = 0;
let prevDivsNum = 0;
let divVars = {};

let changeMode = "Hue";
//Hue , Saturation , Lightness

//For the colorChange function
let d;
let id;

resetBtn.addEventListener("click", resetGrid);

function changeDivsSize() {
  for (const child of container.children) {
    document.getElementById(child.id).style.width = sizeValue;
    document.getElementById(child.id).style.height = sizeValue;
  }
}

function removeDivs() {
  cc("remove divs");
  for (const e in divVars) {
    if (Number(e.substring(3)) > Math.pow(divsNum, 2)) {
      document.getElementById(e).remove();
      delete divVars[e];
    }
  }
  cc("divVars inside of remove");
  cc(divVars);
}

function determineStartDiv() {}

function determineNums() {
  switch (changeSize) {
    case "Small":
      divsNum = 32;
      sizeValue = 400 / divsNum + "px"; //12.5px
      break;
    case "Medium":
      divsNum = 16;
      sizeValue = 400 / divsNum + "px"; //25px
      break;
    case "Large":
      divsNum = 8;
      sizeValue = 400 / divsNum + "px"; //50px
      break;
  }

  if (prevDivsNum !== 0) {
    //larger divs, fewer divs
    if (prevDivsNum > divsNum) {
      removeDivs();
    }

    changeDivsSize();

    //smaller divs, more divs
    if (prevDivsNum < divsNum) {
      addDivs(Math.pow(prevDivsNum, 2) + 1);
    }
  }
}
determineNums();

//ADDING DIVS INTO DIVVARS AND DOM DYNAMICALLY
function addDivs(divs) {
  for (let i = divs; i <= Math.pow(divsNum, 2); i++) {
    let divName = "div" + i;
    let newDiv = document.createElement("DIV");
    newDiv.setAttribute("id", divName);

    container.append(newDiv);
    let getNewDiv = document.getElementById(divName);

    getNewDiv.style.width = sizeValue;
    getNewDiv.style.height = sizeValue;
    getNewDiv.addEventListener("mousemove", colorChange);

    if (!divVars[divName]) {
      divVars[divName] = {
        divHue: 340,
        directionHue: 1,
        divSaturation: 100,
        directionSaturation: 1,
        divLightness: 50,
        directionLightness: 1,
        moused: false,
      };
    }
  }
}
addDivs(1);

function selectMode() {
  changeMode = this.value;
}

let modeOptions = document.querySelectorAll("input[name = mode]");
modeOptions.forEach((e) => {
  e.addEventListener("click", selectMode);
});

function selectSize() {
  if (this.value !== changeSize) {
    prevDivsNum = divsNum;
    changeSize = this.value;
    determineNums();
  }
}

let sizeOptions = document.querySelectorAll("input[name = size]");
sizeOptions.forEach((e) => {
  e.addEventListener("click", selectSize);
});

function colorChange() {
  d = divVars[this.id];
  id = document.getElementById(this.id);
  d.moused = true;
  cc(this.id);
  hslValueDisplay.textContent = `Current Color: hsl( ${d.divHue}, ${d.divSaturation}, ${d.divLightness} )`;

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
  //let x = divVars;
  for (const e in divVars) {
    divVars[e] = {
      divHue: 340,
      directionHue: 1,
      divSaturation: 100,
      directionSaturation: 1,
      divLightness: 50,
      directionLightness: 1,
      moused: false,
    };
  }
  for (const child of container.children) {
    document.getElementById(child.id).style.backgroundColor = "white";
  }
  document.getElementById("hslValue").textContent =
    "Mouse over a square to see its current HSL value.";
}
