var CONST_MAX_VERTICES = 500;

var canvas = document.getElementById("gl-canvas");
gl = canvas.getContext("webgl");

var isDrawing = false;
// var color = document.getElementById("shape-color").value;
// var shapeColor = hexToRGB(color);

var pointOfRef = {};
var shapeOfRef = [];
var currVertexToDrag = {};
var currShapeSelected = {};
var currPolygonVertices = 0;

function initialize() {
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Resize Canvas Size
  resizeCanvas();

  // Initialize Data
  initAndClearData();

  // Init Canvas
  initCanvas();
}
window.onload = () => initialize();

// ********************** CANVAS ****************************
function initCanvas() {
  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
function resizeCanvas() {
  gl.canvas.width = window.innerWidth * 0.7;
  gl.canvas.height = window.innerWidth * 0.7;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", () => resizeCanvas(gl), false);

function canvasListenForMouseDown(event) {
  isDrawing = !isDrawing; 
  if (selectMode.value == "draw" 
    && selectShape.value == "polygon"
    && currPolygonVertices < inputPolygonNode.value 
    && selectPolygonMode.value == "per-line") {
      isDrawing = true;
    }
  if (!isDrawing)  {
    // reset arraynya
    pointOfRef = {};
    currVertexToDrag = {};
    currShapeSelected = {};
    shapeOfRef = [];
    return;
  }

  switch (selectMode.value) {
    case "draw":
      switch (selectShape.value) {
        case "line":
          handleMouseLine(event, "draw", "mouse-down");
          break;
        case "square":
          handleMouseSquare(event, "draw", "mouse-down");
          break;
        case "rectangle":
          handleMouseRectangle(event, "draw", "mouse-down");
          break;
        case "polygon":
          handleMousePolygon(event, "draw", "mouse-down");
          break;
      }
      break;

    case "change-color":
      isDrawing = !isDrawing;
      getShape(event);
      getLine(event);
      console.log(currShapeSelected);
      if (currShapeSelected.type === undefined)
        break;

      color = document.getElementById("shape-color").value;
      shapeColor = hexToRGB(color);
      console.log(data[currShapeSelected.type]["colors"]);
      var currShapeColorArr
        = data[currShapeSelected.type]["colors"][currShapeSelected.shapeIndex];
      data[currShapeSelected.type]["colors"][currShapeSelected.shapeIndex]
        = initColorArray(shapeColor, currShapeColorArr.length/4);
      render();
      break;

    case "move-point":
      getNearestVertex(event);
      console.log(currVertexToDrag);
      break;

    case "move-shape":
      getShape(event);
      getLine(event);
      if (currShapeSelected.type === undefined)
        break;
      shapeOfRef = [...data[currShapeSelected.type]["vertices"]
      [currShapeSelected.shapeIndex]];
      pointOfRef = getCursorPos(event);
      break;
  }
}
canvas.addEventListener("mousedown", (event) =>
  canvasListenForMouseDown(event)
);

function canvasListenForMouseMove(event) {
  if (!isDrawing) return;

  switch (selectMode.value) {
    case "draw":
      switch (selectShape.value) {
        case "line":
          handleMouseLine(event, "draw", "mouse-move");
          break;
        case "square":
          handleMouseSquare(event, "draw", "mouse-move");
          break;
        case "rectangle":
          handleMouseRectangle(event, "draw", "mouse-move");
          break;
        case "polygon":
          handleMousePolygon(event, "draw", "mouse-move");
          break;
      }
      break;

    case "move-point":
      switch (currVertexToDrag.type) {
        case "line":
          handleMouseLine(event, "move-point");
          break;
        case "square":
          handleMouseSquare(event, "move-point");
          break;
        case "rectangle":
          handleMouseRectangle(event, "move-point");
          break;
        case "polygon":
          handleMousePolygon(event, "move-point");
          break;
      }
      break;

    case "move-shape":
      if (currShapeSelected.type === undefined)
        break;
      const pos = getCursorPos(event);
      for (let i = 0; i < data[currShapeSelected.type]["vertices"]
      [currShapeSelected.shapeIndex].length; i += 2) {
        var deltaX = pos.x - pointOfRef.x;
        var deltaY = pos.y - pointOfRef.y;
        data[currShapeSelected.type]["vertices"]
        [currShapeSelected.shapeIndex][i]
          = shapeOfRef[i] + deltaX;
        data[currShapeSelected.type]["vertices"]
        [currShapeSelected.shapeIndex]
        [i + 1] = shapeOfRef[i + 1] + deltaY;
      }
      render();
      break;
  }
}
canvas.addEventListener("mousemove", (event) =>
  canvasListenForMouseMove(event)
);

function clearCanvas() {
  initAndClearData();
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// ************************ MOUSE ***************************
function getCursorPos(event) {
  const rect = event.target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / gl.canvas.width) * 2 - 1;
  const y = (((event.clientY - rect.top) / gl.canvas.width) * 2 - 1) * -1;

  return { x: x, y: y };
}

function getNearestVertex(event) {
  const pos = getCursorPos(event);
  const errorDelta = 0.03;
  const types = ["line", "square", "rectangle", "polygon"];

  types
    .filter((type) => data[type] !== undefined)
    .forEach((type) => {
      if (data[type]["vertices"] !== undefined)
        for (var index = 0; index < data[type]["vertices"].length; index++) {
          for (var x = 0; x < data[type]["vertices"][index].length; x += 2) {
            var a = data[type]["vertices"][index][x];
            var b = data[type]["vertices"][index][x + 1];
            if (pos.x - errorDelta <= a && a <= pos.x + errorDelta) {
              if (pos.y - errorDelta <= b && b <= pos.y + errorDelta) {
                console.log("Ketemu titik di: " + a + " " + b);
                currVertexToDrag = {
                  type: type,
                  shapeIndex: index,
                  firstVertIdx: x,
                  x: a,
                  y: b,
                };
                break;
              }
            }
          }
        }
    });
}

function getShape(event) {
  const pos = getCursorPos(event);
  const types = ["square", "rectangle", "polygon"];
  types
    .filter((type) => data[type] !== undefined)
    .forEach((type) => {
      for (var index = 0; index < data[type]["vertices"].length; index++) {
        var polygons = getArrOfPoints(data[type]["vertices"][index]);
        if (isInside(polygons, polygons.length, pos)) {
          currShapeSelected = {
            type: type,
            shapeIndex: index,
          };
          break;
        }
      }
    });
}

function getLine(event) {
  const pos = getCursorPos(event);
  for (var i = 0; i < data["line"]["vertices"].length; i++) {
    var currLine = data["line"]["vertices"][i];
    if (isInline({ x: currLine[0], y: currLine[1] },
      { x: currLine[2], y: currLine[3] }, { x: pos.x, y: pos.y })) {
      currShapeSelected = {
        type: "line",
        shapeIndex: i,
      };
      break;
    }
  }
}


// ************************ RENDER ***************************
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  var shader = initShaders(gl);

  renderLines(shader);
  renderSquares(shader);
  renderRectangles(shader);
  renderPolygons(shader);
}
