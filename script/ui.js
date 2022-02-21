var selectMode = document.getElementById("select-mode");
var selectShape = document.getElementById("select-shape");
var inputPolygonNode = document.getElementById("input-polygon-node");

var optionShape = document.getElementById("option-shape");
var optionPolygonNode = document.getElementById("option-polygon-node");
var optionColor = document.getElementById("option-color");

//temporary
optionColor.style.visibility = "hidden";
// TODO : refactor to make switching better

// set visibility of select options
selectMode.onchange = () => {
  optionShape.style.visibility = "hidden";
  optionPolygonNode.style.visibility = "hidden";
  optionColor.style.visibility = "hidden";
  if (selectMode.value == "draw") {
    optionShape.style.visibility = "visible";
    optionPolygonNode.style.visibility = "visible";
  } else if (selectMode.value == "change-color") {
    optionColor.style.visibility = "visible";
  }
};

// Button On Clicks
document.getElementById("btn-load").onchange = (e) => {
  loadFile = e.target.files[0];
  console.log(loadFile);
};

document.getElementById("btn-save").onclick = () => {
  download(JSON.stringify(data), "2d-cad.json", "text/plain");
};

document.getElementById("btn-help").onclick = () => {
  console.log("help");
};

document.getElementById("btn-clear").onclick = () => clearCanvas();
