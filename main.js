//VARIABLE DECLARATIONS
const cc = console.log; //for testing
const getMain = document.getElementsByTagName("main")[0]; //the <main> element
const getDivContainer = document.getElementById("divContainer"); //container that holds the divs
const getContentContainer2 = document.getElementById("contentContainer2");
const getResetBtn = document.getElementById("resetBtn"); //button that resets hsl in the object and resets all divs background color to default
const getPrintBtn = document.getElementById("printBtn");
const getInnerBtn = document.getElementById("innerBtn");
const getSelectBtn = document.getElementById("selectBtn");
const getHslValue = document.getElementById("hslValue"); //element that displays the HSL value of the current or last div
const getMobileMenuDiv = document.getElementById("mobileMenuDiv");
const getMobileMenuBtn = document.getElementById("mobileMenuBtn");
const getMobileMenuP = document.getElementById("mobileMenuP");
const getDateP = document.getElementById("dateP");
const getSelectModeSelections = document.getElementById("selectModeSelections");
const getHiddenPrintables = document.getElementById("hiddenPrintables");

let divSize = "Large"; //div size
let sizeValue = ""; //current height/width for divs
let speed = 0; //speed at which an HSL parameter changes
let startDiv = 1; //number of the starting div for adding divs to the divContainer
let prevStartDiv = 0; //the previous value of startDiv
let divsNum = 0; //number of divs per row or column
let prevDivsNum = 0; //previous number or divs per row or column
let divContainerSize = Math.min(400, window.visualViewport.width * 0.9); //height and width of the div container
let divVars = {}; //object that holds all the div stats
let selectModeDivArray = []; //holds the HSL values of selected divs in Div Select Mode

let innerOrSelectMousable = false;

let currentElem;
//let divSelectMode = ""; //Options: inner, hsl

//Used to determine which HSL parameter to manipulate
//Options -- Hue , Saturation , Lightness
let hslMode = "Hue";

//Options -- mouse: mouseover actions allowed; inner: inner mode only; select: select mode only
let mouseoverMode = "mouse";

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

getHslValue.textContent = hslValueDisplayDefault;

getDateP.textContent = `Printed on ${new Date().toLocaleDateString("en-us", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})}`;

//set the size of the color divs
getDivContainer.style.height = divContainerSize + "px";
getDivContainer.style.width = divContainerSize + "px";

//toggle 1 class of 1 or more elements. when invoking, pass in as many elements as desired after the class name
function toggleClass(className, ...elements) {
  for (i = 0; i < elements.length; i++) {
    elements[i].classList.toggle(className);
  }
}

//change the layout if viewport orientation is vertical/portrait
if (window.visualViewport.width < window.visualViewport.height) {
  function mobileMenuHideShow() {
    toggleClass("hiddenByMove", getMobileMenuDiv);
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

  getMobileMenuDiv.classList.add("mobileMenuMobile", "hiddenByMove");
  toggleClass("hiddenByDisplay", getMobileMenuP);
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
  switch (divSize) {
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
    getNewDiv.addEventListener("click", divInnerorSelectMode);

    //If the div's object isn't in divVars, add it
    if (!divVars[divName]) {
      divVars[divName] = { ...divVarsDivStatsDefault };
    }
  }
}
addDivs(1); //the first time this runs, the first div is div1

//selects hue, saturation, or lightness
function selectMode() {
  hslMode = this.value;
}

//Add event listener to the mode select radio inputs
let modeOptions = document.querySelectorAll("input[name = mode]");
modeOptions.forEach((e) => {
  e.addEventListener("click", selectMode);
});

//if user selects a new size, update variables before calculating the new values
function selectSize() {
  if (this.value !== divSize) {
    prevDivsNum = divsNum;
    divSize = this.value;
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
  if (
    (mouseoverMode === "inner" && innerOrSelectMousable != true) ||
    mouseoverMode === "select"
  ) {
    return;
  }
  d = divVars[this.id];
  id = document.getElementById(this.id);

  getHslValue.textContent = `${d.divHue}, ${d.divSaturation}, ${d.divLightness}`;

  //Change some values depending on the current HSL parameter mode
  if (hslMode === "Lightness" || hslMode === "Saturation") {
    speed = 1;
    if (d["div" + hslMode] >= 100) {
      d["div" + hslMode] = 99;
      d["direction" + hslMode] = -1;
    }
    if (d["div" + hslMode] <= 0) {
      d["div" + hslMode] = 1;
      d["direction" + hslMode] = 1;
    }
  } else {
    speed = 5;
    if (d["div" + hslMode] > 360) {
      d["div" + hslMode] = 0;
    }
  }

  //Update the HSL value display
  d["div" + hslMode] += speed * d["direction" + hslMode];
  id.style.backgroundColor = `hsl(${d.divHue} ${d.divSaturation} ${d.divLightness})`;
}

//FUNCTION FOR DIV INNER AND SELECT MODES
function divInnerorSelectMode() {
  ////Stuff for Inner Mode
  if (mouseoverMode === "inner") {
    innerOrSelectMousable === false
      ? (innerOrSelectMousable = true)
      : (innerOrSelectMousable = false);
  }

  ////Stuff for Select Mode
  function pushColor(elem, getElem) {
    let elemHslVal = "";

    if (elem !== "white") {
      elemHslVal = `hsl( ${divVars[elem].divHue}, ${divVars[elem].divSaturation}, ${divVars[elem].divLightness} )`;
    } else {
      elemHslVal = `hsl( ${divVarsDivStatsDefault.divHue}, 100, 100 )`;
      // selectModeDivArray.push(elemHslVal);
    }
    selectModeDivArray.push(elemHslVal);
  }

  if (mouseoverMode === "select") {
    let elem = this.id;
    getElem = document.getElementById(elem);
    //cc("getelem is " + getElem);
    if (!this.classList.contains("selectModeDivMarker")) {
      if (
        this.style.backgroundColor === "white" &&
        !selectModeDivArray.includes(
          `hsl( ${divVarsDivStatsDefault.divHue}, 100, 100 )`
        )
      ) {
        pushColor("white");
        getElem.classList.toggle("selectModeDivMarker");
        //toggleClass("selectModeDivMarker", [getElem]);
      } else if (!selectModeDivArray.includes(elemHslVal)) {
        pushColor(getElem);
        getElem.classList.toggle("selectModeDivMarker");
        //toggleClass("selectModeDivMarker", [getElem]);
      }
    } else {
      //remove div's hsl value from the array
      selectModeDivArray = selectModeDivArray.filter((e) => e !== elemHslVal);
      getElem.classList.toggle("selectModeDivMarker");
      //toggleClass("selectModeDivMarker", [getElem]);
    }
  }
  cc("selectmodearr is " + selectModeDivArray);
}
//}

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

  //toggle whether or not color divs can be moused over (for inner and select modes)
  //correctly sets the variables for divInnerMode and divSelectMode
  if (this.id === "selectBtn" || this.id === "innerBtn") {
    mouseoverMode !== thisBtnModeName
      ? innerOrSelectMousable === false
      : innerOrSelectMousable === true;
  }

  mouseoverMode === "mouse"
    ? (mouseoverMode = thisBtnModeName)
    : (mouseoverMode = "mouse");

  toggleClass("noMouseoverModeMarker", getDivContainer);
  document.getElementById(this.id).classList.toggle("noMouseoverModeMarker");

  toggleClass("deactivatedBtn", getInnerBtn, getSelectBtn);
  document.getElementById(this.id).classList.toggle("deactivatedBtn");
}

////ADD BUTTON EVENT LISTENERS (except mobile menu hamburger button)
document
  .getElementById("innerBtn")
  .addEventListener("click", ChangeMouseoverMode);

document
  .getElementById("selectBtn")
  .addEventListener("click", ChangeMouseoverMode);

getResetBtn.addEventListener("click", resetGrid);
getPrintBtn.addEventListener("click", print.bind(window));

//Reset the divs, div objects, and HSL value display to their defaults
function resetGrid() {
  for (const e in divVars) {
    divVars[e] = { ...divVarsDivStatsDefault };
  }
  for (const child of getDivContainer.children) {
    document.getElementById(child.id).style.backgroundColor =
      divBackgroundColorDefault;
  }
  getHslValue.textContent = hslValueDisplayDefault;
}

////BEFORE AND AFTER PRINT FUNCTIONS

function beforePrint() {
  toggleClass("hiddenByDisplay", getHiddenPrintables);
}

function afterPrint() {
  toggleClass("hiddenByDisplay", getHiddenPrintables);
}

window.addEventListener("beforeprint", beforePrint);

window.addEventListener("afterprint", afterPrint);
