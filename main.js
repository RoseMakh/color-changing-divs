//VARIABLE DECLARATIONS
const cc = console.log; //for testing
const getMain = document.getElementsByTagName("main")[0]; //the <main> element
const getDivContainer = document.getElementById("divContainer"); //container that holds the divs
const getResetBtn = document.getElementById("resetBtn"); //button that resets hsl in the object and resets all divs background color to default
const hslValueDisplay = document.getElementById("hslValue"); //element that displays the HSL value of the current or last div
const getMobileMenuDiv = document.getElementById("mobileMenuDiv");
const getMobileMenuBtn = document.getElementById("mobileMenuBtn");

let changeSize = "Large"; //div size
let sizeValue = ""; //current height/width for divs
let speed = 0; //speed at which an HSL parameter changes
let startDiv = 1; //number of the starting div for adding divs to the divContainer
let prevStartDiv = 0; //the previous value of startDiv
let divsNum = 0; //number of divs per row or column
let prevDivsNum = 0; //previous number or divs per row or column
let divContainerSize = Math.min(400, window.visualViewport.width * 0.9); //height and width of the div container
let divVars = {}; //object that holds all the div stats

//Used to determine which HSL parameter to manipulate
//Options: Hue , Saturation , Lightness
let changeMode = "Hue";

let mouseoverMode = "mouse";
//mouse: mouseover actions allowed; inner: inner mode only; select: select mode only

//Used inside the colorChange function only. Declared here so they aren't created anew on every mouse move
let d;
let id;

//DEFAULT VALUES
const hslValueDisplayDefault = "???, ???, ???";
const divBackgroundColorDefault = "white";
const divVarsDivStatsDefault = {
  divHue: 340,
  directionHue: 1,
  divSaturation: 100,
  directionSaturation: 1,
  divLightness: 50,
  directionLightness: 1,
};
////END OF VARIABLE DECLARATIONS SECTION

hslValueDisplay.textContent = hslValueDisplayDefault;

//set the size of the color divs
getDivContainer.style.height = divContainerSize + "px";
getDivContainer.style.width = divContainerSize + "px";

//change the layout if viewport orientation is vertical/portrait
if (window.visualViewport.width < window.visualViewport.height) {
  function mobileMenuHideShow() {
    getMobileMenuDiv.classList.toggle("hiddenByMove");
  }

  getMain.style.height = window.visualViewport.height + "px";
  getMain.style.overflow = "hidden"; //prevent scrolling

  //create the button that shows and hides the mobile menu
  let newBtn = document.createElement("BUTTON");
  newBtn.setAttribute("id", "mobileMenuBtn");
  getMain.append(newBtn);
  document
    .getElementById("mobileMenuBtn")
    .addEventListener("click", mobileMenuHideShow);

  getMobileMenuDiv.classList.add("mobleMenuMobile", "hiddenByMove");
  document.getElementById("mobileMenuP").classList.toggle("hiddenByDisplay");
}

function changeDivsSize() {
  for (const child of getDivContainer.children) {
    document.getElementById(child.id).style.width = sizeValue;
    document.getElementById(child.id).style.height = sizeValue;
  }
}

//Remove divs from divContainer and div objects from divVars
function removeDivs() {
  for (const e in divVars) {
    if (Number(e.substring(3)) > Math.pow(divsNum, 2)) {
      document.getElementById(e).remove();
      delete divVars[e];
    }
  }
}

//Update the number of divs per column/row and the height/width of the divs
function determineNums() {
  switch (changeSize) {
    case "Small":
      divsNum = 20;
      sizeValue = divContainerSize / divsNum + "px";
      break;
    case "Medium":
      divsNum = 14;
      sizeValue = divContainerSize / divsNum + "px";
      break;
    case "Large":
      divsNum = 8;
      sizeValue = divContainerSize / divsNum + "px";
      break;
  }

  //This if statement doesn't run on load
  if (prevDivsNum !== 0) {
    //larger divs = fewer divs, so remove some before changing their sizes
    if (prevDivsNum > divsNum) {
      removeDivs();
    }

    changeDivsSize();

    //smaller divs = more divs, so add some to the divContainer
    if (prevDivsNum < divsNum) {
      addDivs(Math.pow(prevDivsNum, 2) + 1);
    }
  }
}
determineNums();

//Add divs into the divContainer element and the divVars object
//startDiv is always passed in as the argument
function addDivs(divs) {
  for (let i = divs; i <= Math.pow(divsNum, 2); i++) {
    let divName = "div" + i;
    let newDiv = document.createElement("DIV");
    newDiv.setAttribute("id", divName);

    getDivContainer.append(newDiv);
    let getNewDiv = document.getElementById(divName);

    getNewDiv.style.width = sizeValue;
    getNewDiv.style.height = sizeValue;
    getNewDiv.style.backgroundColor = divBackgroundColorDefault;
    getNewDiv.addEventListener("mousemove", colorChange);

    //If the div's object isn't in divVars, add it
    if (!divVars[divName]) {
      divVars[divName] = { ...divVarsDivStatsDefault };
    }
  }
}
addDivs(1); //the first div is div1

//selects hue, saturation, or lightness
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
  if (mouseoverMode === "mouse") {
    d = divVars[this.id];
    id = document.getElementById(this.id);

    hslValueDisplay.textContent = `${d.divHue}, ${d.divSaturation}, ${d.divLightness}`;

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
}

////MOUSEOVER MODE FUNCTIONS

//get the button's mode by removing Btn from the end of its id
function getMouseoverModeName(string) {
  const len = string.length;
  let i = string.split("");
  for (j = len - 1; j > len - 4; j--) {
    i.pop();
  }
  return i.join("");
}

//change the mouseover mode and toggle style classes accordingly
function ChangeMouseoverMode() {
  if (
    (this.id === "selectBtn" && mouseoverMode === "inner") ||
    (this.id === "innerBtn" && mouseoverMode === "select")
  ) {
    return;
  }

  const thisBtnModeName = getMouseoverModeName(this.id);

  mouseoverMode === "mouse"
    ? (mouseoverMode = thisBtnModeName)
    : (mouseoverMode = "mouse");

  getDivContainer.classList.toggle("noMouseoverModeMarker");
  document.getElementById(this.id).classList.toggle("noMouseoverModeMarker");
}

document
  .getElementById("innerBtn")
  .addEventListener("click", ChangeMouseoverMode);

document
  .getElementById("selectBtn")
  .addEventListener("click", ChangeMouseoverMode);

getResetBtn.addEventListener("click", resetGrid);
document
  .getElementById("printBtn")
  .addEventListener("click", print.bind(window));

//Reset the divs, div objects, and HSL value display to their defaults
function resetGrid() {
  for (const e in divVars) {
    divVars[e] = { ...divVarsDivStatsDefault };
  }
  for (const child of getDivContainer.children) {
    document.getElementById(child.id).style.backgroundColor =
      divBackgroundColorDefault;
  }
  hslValueDisplay.textContent = hslValueDisplayDefault;
}

////BEFORE AND AFTER PRINT FUNCTIONS

window.addEventListener("beforeprint", (event) => {
  let newP = document.createElement("P");
  newP.textContent = `test`;
  getMain.append(newP);
  newP.textContent = `Printed on ${new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
});

window.addEventListener("afterprint", (event) => {
  getMain.lastElementChild.remove();
});
