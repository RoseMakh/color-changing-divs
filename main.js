//VARIABLE DECLARATIONS
const cc = console.log; //for testing
const getMain = document.getElementsByTagName("main")[0]; //the <main> element
const getDivContainer = document.getElementById("divContainer"); //container that holds the divs
const getContentContainer2 = document.getElementById("contentContainer2");
const getResetBtn = document.getElementById("resetBtn"); //button that resets hsl in the object and resets all divs background color to default
const getPrintBtn = document.getElementById("printBtn");
const getInnerBtn = document.getElementById("innerBtn");
const getListBtn = document.getElementById("listBtn");
const getHslValue = document.getElementById("hslValue"); //element that displays the HSL value of the current or last div
const getMobileMenuDiv = document.getElementById("mobileMenuDiv");
const getMobileMenuBtn = document.getElementById("mobileMenuBtn");
const getTopDash = document.getElementById("topDash");
const getMiddleDash = document.getElementById("middleDash");
const getBottomDash = document.getElementById("bottomDash");
const getMobileMenuP = document.getElementById("mobileMenuP");
const getDateP = document.getElementById("dateP");
const getListModeContent = document.getElementById("listModeContent");
const getListModeHeading = document.getElementById("listModeHeading");
const getListModeSelections = document.getElementById("listModeSelections");
const getHiddenPrintables = document.getElementById("hiddenPrintables");
const getInstructionsHeading = document.getElementById("instructionsHeading");
const getInstructionsBody = document.getElementById("instructionsBody");

//TOP RIGHT CORNER BUTTONS
//holds all the follow buttons
const getFollowBtnDiv = document.getElementById("followBtnDiv");
const getBtnInstagram = document.getElementById("btnInstagram");
const getBtnFacebook = document.getElementById("btnFacebook");
const getBtnTwitterX = document.getElementById("btnTwitterX");
const getBtnFollow = document.getElementById("btnFollow");

//holds all the color scheme buttons
const getSchemeBtnDiv = document.getElementById("schemeBtnDiv");
const getBtnSchemeSystem = document.getElementById("btnSchemeSystem");
const getBtnSchemeDark = document.getElementById("btnSchemeDark");
const getBtnSchemeLight = document.getElementById("btnSchemeLight");
const getBtnScheme = document.getElementById("btnScheme");

//
////END OF CONSTANTS
let divSize = "Large"; //div size
let sizeValue = ""; //current height/width for divs
let speed = 0; //speed at which an HSL parameter changes
let startDiv = 1; //number of the starting div for adding divs to the divContainer
let prevStartDiv = 0; //the previous value of startDiv
let divsNum = 0; //number of divs per row or column
let prevDivsNum = 0; //previous number or divs per row or column
let divContainerSize = Math.min(400, window.visualViewport.width * 0.9); //height and width of the div container
let divVars = {}; //object that holds all the div stats
let listModeDivArray = []; //holds the HSL values of selected divs in Div List Mode

let innerMousable = false;

let currentElem;

//Used to determine which HSL parameter to manipulate
//Options -- Hue , Saturation , Lightness
let hslMode = "Hue";

//Options -- mouse: mouseover actions allowed; inner: inner mode only; list: List Mode only
let mouseoverMode = "mouse";

//Used inside the colorChange function only. Declared here so they aren't created anew on every mouse move
let d;
let id;

//DEFAULT VALUES
const hslValueDisplayDefault = "??? ??? ???";
const divBackgroundColorDefault = "white";
const divVarsDivStatsDefault = {
  divHue: 340,
  directionHue: 1,
  divSaturation: 100,
  directionSaturation: 1,
  divLightness: 50,
  directionLightness: 1,
  moused: false,
};
////END OF VARIABLE DECLARATIONS SECTION

getHslValue.textContent = hslValueDisplayDefault;

getDateP.textContent = `Printed on ${new Date().toLocaleDateString("en-us", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})}`;

//Animations for follow and theme menus

function animateSmallFollowBtns() {
  if (!getBtnInstagram.style.transitionDelay) {
    getBtnInstagram.style.transitionDelay = "0s";
  } else if (getBtnInstagram.style.transitionDelay === "0s") {
    getBtnInstagram.style.transitionDelay = "0.4s";
    getBtnTwitterX.style.transitionDelay = "0s";
  } else {
    getBtnInstagram.style.transitionDelay = "0s";
    getBtnTwitterX.style.transitionDelay = "0.4s";
  }
  getBtnInstagram.classList.toggle("animSlideReveal1");
  getBtnFacebook.classList.toggle("animSlideReveal2");
  getBtnTwitterX.classList.toggle("animSlideReveal3");
}

function animateSmallSchemeBtns() {
  if (!getBtnSchemeLight.style.transitionDelay) {
    getBtnSchemeLight.style.transitionDelay = "0s";
  } else if (getBtnSchemeLight.style.transitionDelay === "0s") {
    getBtnSchemeLight.style.transitionDelay = "0.4s";
    getBtnSchemeSystem.style.transitionDelay = "0s";
  } else {
    getBtnSchemeLight.style.transitionDelay = "0s";
    getBtnSchemeSystem.style.transitionDelay = "0.4s";
  }
  getBtnSchemeLight.classList.toggle("animSlideReveal1");
  getBtnSchemeDark.classList.toggle("animSlideReveal2");
  getBtnSchemeSystem.classList.toggle("animSlideReveal3");
}

getBtnFollow.addEventListener("click", animateSmallFollowBtns);
getBtnScheme.addEventListener("click", animateSmallSchemeBtns);

function animateInstructionsBody() {
  cc(this.id + " in animate instbody");
  toggleClass("hiddenByMoveHorizontal", getInstructionsBody);
  toggleClass("activeBtn", getInstructionsHeading);
}
getInstructionsHeading.addEventListener("click", animateInstructionsBody);

//close all open menus if anything other than the menu is clicked
window.addEventListener("click", function (e) {
  if (
    !getBtnFollow.contains(e.target) &&
    getBtnInstagram.classList.contains("animSlideReveal1")
  ) {
    animateSmallFollowBtns();
  } else if (
    !getBtnScheme.contains(e.target) &&
    getBtnSchemeLight.classList.contains("animSlideReveal1")
  ) {
    animateSmallSchemeBtns();
  }

  if (
    !getInstructionsHeading.contains(e.target) &&
    getInstructionsHeading.classList.contains("activeBtn")
  ) {
    animateInstructionsBody();
  }

  if (window.visualViewport.width < window.visualViewport.height) {
    if (
      !getMobileMenuDiv.contains(e.target) &&
      !getMobileMenuBtn.contains(e.target) &&
      !getMobileMenuDiv.classList.contains("hiddenByMove")
    ) {
      mobileMenuBtnAnimate();
      toggleClass("hiddenByMove", getMobileMenuDiv);
    }
  }
});

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
  //for vertical screens

  toggleClass("hiddenByDisplay", getMobileMenuBtn);

  function mobileMenuHideShow() {
    toggleClass("hiddenByMove", getMobileMenuDiv);
  }

  function mobileMenuBtnAnimate() {
    if (
      !getTopDash.classList.contains("animClassMobileBtnTopDashOpen") &&
      !getTopDash.classList.contains("animClassMobileBtnTopDashClose")
    ) {
      getTopDash.classList.add("animClassMobileBtnTopDashOpen");
      getMiddleDash.classList.add("animClassMobileBtnMiddleDashOpen");
      getBottomDash.classList.add("animClassMobileBtnBottomDashOpen");
    } else if (getTopDash.classList.contains("animClassMobileBtnTopDashOpen")) {
      getTopDash.classList.remove("animClassMobileBtnTopDashOpen");
      getTopDash.classList.add("animClassMobileBtnTopDashClose");

      getMiddleDash.classList.remove("animClassMobileBtnMiddleDashOpen");
      getMiddleDash.classList.add("animClassMobileBtnMiddleDashClose");

      getBottomDash.classList.remove("animClassMobileBtnBottomDashOpen");
      getBottomDash.classList.add("animClassMobileBtnBottomDashClose");
    } else {
      getTopDash.classList.remove("animClassMobileBtnTopDashClose");
      getTopDash.classList.add("animClassMobileBtnTopDashOpen");

      getMiddleDash.classList.remove("animClassMobileBtnMiddleDashClose");
      getMiddleDash.classList.add("animClassMobileBtnMiddleDashOpen");

      getBottomDash.classList.remove("animClassMobileBtnBottomDashClose");
      getBottomDash.classList.add("animClassMobileBtnBottomDashOpen");
    }
  }

  getMain.style.height = window.visualViewport.height + "px";
  // getMain.style.overflow = "hidden"; //prevent scrolling

  getMobileMenuBtn.addEventListener("click", () => {
    mobileMenuHideShow();
    mobileMenuBtnAnimate();
  });

  //mobileMenuHideShow

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
    getNewDiv.addEventListener("click", divInnerMode);

    //If the div's object isn't in divVars, add it
    if (!divVars[divName]) {
      divVars[divName] = { ...divVarsDivStatsDefault };
    }
  }
}
addDivs(1); //the first time this runs, the first div is div1

//for radio buttons, selects hue, saturation, or lightness
function listMode() {
  hslMode = this.value;
}

//Add event listener to the mode select radio inputs
let modeOptions = document.querySelectorAll("input[name = mode]");
modeOptions.forEach((e) => {
  e.addEventListener("click", listMode);
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
    (mouseoverMode === "inner" && innerMousable != true) ||
    mouseoverMode === "list"
  ) {
    return;
  }

  d = divVars[this.id];
  id = document.getElementById(this.id);
  d.moused = true;

  getHslValue.textContent = `${d.divHue} ${d.divSaturation} ${d.divLightness}`;

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

//FUNCTIONS FOR INNER AND LIST MODES
function divInnerMode() {
  if (mouseoverMode === "inner") {
    innerMousable === false ? (innerMousable = true) : (innerMousable = false);
  }
}

function divListModeEnter() {
  if (mouseoverMode !== "list") {
    return;
  }

  toggleClass("deactivatedBtn", getResetBtn);

  getDivContainer.classList.add("noMouseoverModeMarker-gray");

  // if (window.visualViewport.width < window.visualViewport.height) {
  //   getMain.style.overflow = "auto";
  // }
  function pushColor() {
    for (const e in divVars) {
      cc("in pushcolor " + e);
      if (divVars[e].moused === false) {
        listModeDivArray.push(`hsl(${divVarsDivStatsDefault.divHue} 100 100)`);
      } else {
        listModeDivArray.push(
          `hsl(${divVars[e].divHue} ${divVars[e].divSaturation} ${divVars[e].divLightness})`
        );
      }
    }
  }
  pushColor();

  function displayListColors() {
    //counters for forEach
    let newLi;
    let newDiv;
    let newBtn;
    let liCounter = 0;
    let makeIdListLi;
    let makeIdListDiv;
    let makeIdListBtnHolder;
    let makeIdListDeleteBtn;
    let deleteBtn =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';

    //Remove duplicates from the HSL values array
    listModeDivArray = listModeDivArray.filter(
      (item, index) => listModeDivArray.indexOf(item) === index
    );

    //Display a list of all the colors in the grid
    listModeDivArray.forEach((e) => {
      makeIdListLi = "listLi" + liCounter;
      makeIdListDiv = "listDiv" + liCounter;
      makeIdListBtnHolder = "listBtnHolder" + liCounter;
      makeIdListDeleteBtn = "listDeleteBtn" + liCounter;

      newLi = document.createElement("LI");
      newLi.setAttribute("id", makeIdListLi);
      getListModeSelections.append(newLi);
      document.getElementById(
        makeIdListLi
      ).innerHTML = `<div id=${makeIdListDiv} class="listModeSelectionsDiv"></div> ${e}`;
      document.getElementById(makeIdListDiv).style.backgroundColor = e;

      //add the remove buttons
      newDiv = document.createElement("DIV");
      newDiv.setAttribute("id", makeIdListBtnHolder);
      document.getElementById(makeIdListLi).append(newDiv);

      newBtn = document.createElement("BUTTON");
      newBtn.setAttribute("id", makeIdListDeleteBtn);
      document.getElementById(makeIdListBtnHolder).append(newBtn);
      document
        .getElementById(makeIdListDeleteBtn)
        .classList.add("listModeLiBtn");
      document.getElementById(makeIdListDeleteBtn).innerHTML = deleteBtn;
      document
        .getElementById(makeIdListDeleteBtn)
        .addEventListener("click", removeListModeItem);

      liCounter++;
    });
    toggleClass("hiddenByDisplay", getListModeContent);
  }
  displayListColors();

  //Remove selected color from the printable list
  function removeListModeItem() {
    this.parentElement.parentElement.remove();
  }
}

function divListModeExit() {
  toggleClass("deactivatedBtn", getResetBtn);

  getDivContainer.classList.remove("noMouseoverModeMarker-gray");

  //hide the hsl values list
  toggleClass("hiddenByDisplay", getListModeContent);

  //empty the hsl values list
  while (getListModeSelections.firstChild) {
    getListModeSelections.removeChild(getListModeSelections.firstChild);
  }

  //empty the hsl values array
  listModeDivArray = [];
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
    (this.id === "listBtn" && mouseoverMode === "inner") ||
    (this.id === "innerBtn" && mouseoverMode === "list")
  ) {
    return;
  }

  if (mouseoverMode === "list") {
    divListModeExit();
  }

  const thisBtnModeName = getMouseoverModeName(this.id);

  //toggle whether or not color divs can be moused over (for inner and list modes)
  //correctly sets the variables for divInnerMode and divListMode
  if (this.id === "listBtn" || this.id === "innerBtn") {
    mouseoverMode !== thisBtnModeName
      ? innerMousable === false
      : innerMousable === true;
  }

  mouseoverMode === "mouse"
    ? (mouseoverMode = thisBtnModeName)
    : (mouseoverMode = "mouse");

  toggleClass("noMouseoverModeMarker", getDivContainer);
  document.getElementById(this.id).classList.toggle("noMouseoverModeMarker");

  toggleClass("deactivatedBtn", getInnerBtn, getListBtn);
  document.getElementById(this.id).classList.toggle("deactivatedBtn");

  if (mouseoverMode === "list") {
    divListModeEnter();
  }
}

////ADD BUTTON EVENT LISTENERS (except mobile menu hamburger button)
document
  .getElementById("innerBtn")
  .addEventListener("click", ChangeMouseoverMode);

document
  .getElementById("listBtn")
  .addEventListener("click", ChangeMouseoverMode);

getResetBtn.addEventListener("click", resetGrid);
getPrintBtn.addEventListener("click", print.bind(window));

//Reset the divs, div objects, and HSL value display to their defaults
function resetGrid() {
  if (mouseoverMode === "list") {
    return;
  }

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
  // toggleClass("hiddenByDisplay", getDateP);
}

function afterPrint() {
  // toggleClass("hiddenByDisplay", getDateP);
}

window.addEventListener("beforeprint", beforePrint);

window.addEventListener("afterprint", afterPrint);
