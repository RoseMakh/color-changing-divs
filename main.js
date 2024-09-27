const cc = console.log; //for testing
const container = document.getElementById("container"); //container that holds the divs
const resetBtn = document.getElementById("reset"); //button that resets hsl in the object and resets all divs background color to white
const hslValueDisplay = document.getElementById("hslValue"); //element that displays the HSL value of the current or last div

let changeSize = "Large"; //div size
let sizeValue = ""; //current height/width for divs
let speed = 0; //speed at which an HSL parameter changes
let startDiv = 1; //number of the starting div for adding divs to the container
let prevStartDiv = 0; //the previous value of startDiv
let divsNum = 0; //number of divs per row or column
let prevDivsNum = 0; //previous number or divs per row or column
let divVars = {}; //object that holds all the div stats

//Used to determine which HSL parameter to manipulate
//Options: Hue , Saturation , Lightness
let changeMode = "Hue";

//Used inside the colorChange function only. Declared here so they aren't created anew on evey mouse move
let d;
let id;

resetBtn.addEventListener("click", resetGrid);

function changeDivsSize() {
  for (const child of container.children) {
    document.getElementById(child.id).style.width = sizeValue;
    document.getElementById(child.id).style.height = sizeValue;
  }
}

//Remove divs from container and div objects from divVars
function removeDivs() {
  for (const e in divVars) {
    if (Number(e.substring(3)) > Math.pow(divsNum, 2)) {
      document.getElementById(e).remove();
      delete divVars[e];
    }
  }
  cc(divVars);
}

//Update the number of divs per column/row and the height/width of the divs
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
    //larger divs = fewer divs, so remove some before changing their sizes
    if (prevDivsNum > divsNum) {
      removeDivs();
    }

    changeDivsSize();

    //smaller divs = more divs, so add some to the container
    if (prevDivsNum < divsNum) {
      addDivs(Math.pow(prevDivsNum, 2) + 1);
    }
  }
}
determineNums();

//Add divs into the container element and the divVars object
//startDiv is always passed in as the argument
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

    //If the div's object isn't in divVars, add it
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

//Add event listener to the mode select radio inputs
let modeOptions = document.querySelectorAll("input[name = mode]");
modeOptions.forEach((e) => {
  e.addEventListener("click", selectMode);
});

//if user selects a new size, update variables before calculating the new values
function selectSize() {
  if (this.value !== changeSize) {
    prevDivsNum = divsNum;
    changeSize = this.value;
    determineNums();
  }
}

//Add event listener to the size select radio inputs
let sizeOptions = document.querySelectorAll("input[name = size]");
sizeOptions.forEach((e) => {
  e.addEventListener("click", selectSize);
});

//Change the div colors
function colorChange() {
  d = divVars[this.id];
  id = document.getElementById(this.id);
  d.moused = true;
  cc(this.id);
  hslValueDisplay.textContent = `Current Color: hsl( ${d.divHue}, ${d.divSaturation}, ${d.divLightness} )`;

  //Change some values depending on the current HSL parameter mode
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

  //Update the HSL value display
  d["div" + changeMode] += speed * d["direction" + changeMode];
  id.style.backgroundColor = `hsl(${d.divHue} ${d.divSaturation} ${d.divLightness})`;
}

//Reset the divs, div objects, and HSL value display to their defaults
function resetGrid() {
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
