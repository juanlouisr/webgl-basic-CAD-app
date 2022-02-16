var selectMode = document.getElementById("select-mode");
var selectShape = document.getElementById("select-shape");
var inputPolygonNode = document.getElementById("input-polygon-node");

var optionShape = document.getElementById("option-shape");
var optionPolygonNode = document.getElementById("option-polygon-node");

// set visibility of select options
selectMode.onchange = () => {
  if (selectMode.value == "draw") {
    optionShape.style.visibility = "visible";
    optionPolygonNode.style.visibility = "visible";
  }
  else {
    optionShape.style.visibility = "hidden";
    optionPolygonNode.style.visibility = "hidden";
  }
}

// Button On Clicks
document.getElementById("btn-help").onclick = () => {
  console.log("help");
}

document.getElementById("btn-clear").onclick = () => {
  console.log("clear");
}
