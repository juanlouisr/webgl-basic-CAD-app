var selectMode = document.getElementById("select-mode");
var selectShape = document.getElementById("select-shape");
var selectPolygonMode = document.getElementById("select-polygon-mode");
var inputPolygonNode = document.getElementById("input-polygon-node");

var optionShape = document.getElementById("option-shape");
var optionPolygonNode = document.getElementById("option-polygon-node");
var optionPolygonDrawMode = document.getElementById("option-polygon-draw-mode");
var optionColor = document.getElementById("option-color");
var shapeColor = hexToRGB(document.getElementById("shape-color").value);

var helpText = document.getElementById("help-text");

// Options
optionPolygonNode.style.visibility = "hidden";
optionPolygonDrawMode.style.visibility = "hidden";
selectMode.onchange = () => {
  optionShape.style.visibility = "hidden";
  optionColor.style.visibility = "hidden";

  optionPolygonNode.style.visibility = "hidden";
  optionPolygonDrawMode.style.visibility = "hidden";

  if (selectMode.value == "draw") {
    optionShape.style.visibility = "visible";
    optionColor.style.visibility = "visible";

    if (selectShape.value == "polygon"){
      optionPolygonNode.style.visibility = "visible";
      optionPolygonDrawMode.style.visibility = "visible";
    }
  } else if (selectMode.value == "change-color") {
    optionColor.style.visibility = "visible";
  } else if (selectMode.value == "move-point") {
    optionColor.style.visibility = "hidden";
  }
};
selectShape.onchange = () => {
  optionPolygonNode.style.visibility = "hidden";
  optionPolygonDrawMode.style.visibility = "hidden";

  if (selectShape.value == "polygon"){
    optionPolygonNode.style.visibility = "visible";
    optionPolygonDrawMode.style.visibility = "visible";
  }
}

// Help Text
helpText.style.visibility = "hidden";

// Button On Clicks
document.getElementById("btn-load").onchange = (e) => {
  loadFile = e.target.files[0];
  reader = new FileReader();
  reader.onload = (e) => {
    data = JSON.parse(e.target.result);
    render();
  };
  reader.readAsText(loadFile);
};

document.getElementById("btn-save").onclick = () => {
  download(JSON.stringify(data), "2d-cad.json", "text/plain");
};

document.getElementById("btn-help").onclick = () => {
  helpText.style.visibility = "visible";
};

document.getElementById("btn-clear").onclick = () => clearCanvas();

//Set color changes
document.getElementById("shape-color").onchange = (e) => {
  shapeColor = hexToRGB(e.target.value);
};
