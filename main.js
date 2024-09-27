const cc = console.log;
const container = document.getElementById("container");

let divsNum = 40;
let divVars = {};

let changeMode = "lightness";

//ADDING DIVS INTO DIVVARS DYNAMICALLY
for (let i = 1; i <= divsNum; i++) {
  let divName = "div" + i;
  let newDiv = document.createElement("DIV");
  newDiv.setAttribute("id", divName);

  container.append(newDiv);
  let getNewDiv = document.getElementById(divName);

  getNewDiv.addEventListener("mousemove", colorChange);
  divVars[divName] = {
    lightnessDirection: 1,
    divHue: 340,
    divSaturation: 100,
    divLightness: 0,
  };
}

//cc(divVars.div3.name);
cc(divVars);

function colorChange() {
  /* let xx;

if (changeMode==="lightness"){
xx = "divLightness";
} */

  let d = divVars[this.id];
  let id = document.getElementById(this.id);
  if (d.divLightness >= 100) {
    d.divLightness = 99;
    d.lightnessDirection = -1;
  }
  if (d.divLightness <= 0) {
    d.divLightness = 1;
    d.lightnessDirection = 1;
  }
  d.divLightness += 1 * d.lightnessDirection;
  id.style.backgroundColor = `hsl(${d.divHue} ${d.divSaturation} ${d.divLightness})`;
}
