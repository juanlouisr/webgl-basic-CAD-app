var CONST_MAX_VERTICES = 500;

var canvas = document.getElementById("gl-canvas");
gl = canvas.getContext("webgl");

// var vBufferId = gl.createBuffer();
// var cBufferId = gl.createBuffer();

var isDrawing = false;
var color = document.getElementById("shape-color").value;
var shapeColor = hexToRGB(color);

function initialize() {
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Resize Canvas Size for the first time
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
  gl.canvas.width = (9 / 12) * window.innerWidth;
  gl.canvas.height = (9 / 12) * window.innerWidth;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", () => resizeCanvas());

function canvasListenForMouseDown(event) {
  if (selectMode.value == "draw") {
    if (selectShape.value == "line") {
      isDrawing = !isDrawing;

      if (isDrawing) {
        // this starts the draw, pushing two vertices for mousemove event to change the second one
        const pos = getCursorPos(event);
        data["line"]["vertices"].push([pos.x, pos.y, pos.x, pos.y]);
        data["line"]["colors"].push([0, 0, 0, 1, 0, 0, 0, 1]);
        // console.log("Left? : " + x + " ; Top? : " + y + ".");
      }
    } else if (selectShape.value == "square") {
      isDrawing = !isDrawing;

      if (isDrawing) {
        const pos = getCursorPos(event);
        data["square"]["vertices"].push(initVertexArray(pos.x, pos.y, 4));
        data["square"]["colors"].push(initColorArray(shapeColor, 4));
      }
    } else if (selectShape.value == "rectangle") {
      isDrawing = !isDrawing;

      if (isDrawing) {
        const pos = getCursorPos(event);
        data["rectangle"]["vertices"].push(initVertexArray(pos.x, pos.y, 4));
        data["rectangle"]["colors"].push(initColorArray(shapeColor, 4));
      }
    } else if (selectShape.value == "polygon") {
      isDrawing = !isDrawing;

      if (isDrawing) {
        const pos = getCursorPos(event);
        data["polygon"]["vertices"].push(initVertexArray(pos.x, pos.y, inputPolygonNode.value));
        data["polygon"]["colors"].push(initColorArray(shapeColor, inputPolygonNode.value));
      }
    }
  } else if (selectMode.value == "change-color") {
    color = document.getElementById("shape-color").value;
    shapeColor = hexToRGB(color);
  } else if (selectMode.value == "move-point") {
    const loc = getNearestVertex(event);

  } else if (selectMode.value == "change-color") {


  }
}
canvas.addEventListener("mousedown", (event) =>
  canvasListenForMouseDown(event)
);

function canvasListenForMouseMove(event) {
  if (selectMode.value == "draw") {
    if (selectShape.value == "line") {
      if (isDrawing) {
        // change the second coordinate of line, then rerender
        const pos = getCursorPos(event);
        data["line"]["vertices"][data["line"]["vertices"].length - 1][2] =
          pos.x;
        data["line"]["vertices"][data["line"]["vertices"].length - 1][3] =
          pos.y;
        render();
      }
    } else if (selectShape.value == "square") {
      if (isDrawing) {
        const pos = getCursorPos(event);

        var posXAwal = data["square"]["vertices"]
        [data["square"]["vertices"].length - 1][0];
        var posYAwal = data["square"]["vertices"]
        [data["square"]["vertices"].length - 1][1];

        var deltaX = pos.x - posXAwal;
        
        var posY = posYAwal;

        if (pos.x > posXAwal && pos.y > posYAwal) {
          posY += deltaX;
        }
        else {
          posY -= deltaX; 
        }
        if (pos.x < posXAwal && pos.y < posYAwal) {
          posY += 2*deltaX;
        }

        data["square"]["vertices"][
          data["square"]["vertices"].length - 1
        ][2] = pos.x;
        data["square"]["vertices"][
          data["square"]["vertices"].length - 1
        ][4] = pos.x;
        data["square"]["vertices"][
          data["square"]["vertices"].length - 1
        ][5] = posY;
        data["square"]["vertices"][
          data["square"]["vertices"].length - 1
        ][7] = posY;

        render();
      }
    } else if (selectShape.value == "rectangle") {
      if (isDrawing) {
        const pos = getCursorPos(event);
        
        data["rectangle"]["vertices"][
          data["rectangle"]["vertices"].length - 1
        ][2] = pos.x;
        data["rectangle"]["vertices"][
          data["rectangle"]["vertices"].length - 1
        ][4] = pos.x;
        data["rectangle"]["vertices"][
          data["rectangle"]["vertices"].length - 1
        ][5] = pos.y;
        data["rectangle"]["vertices"][
          data["rectangle"]["vertices"].length - 1
        ][7] = pos.y;
        
        render();
      }
    } else if (selectShape.value == "polygon") {
      if (isDrawing) {
        const pos = getCursorPos(event);
        
        var posXAwal = data["polygon"]["vertices"]
        [data["polygon"]["vertices"].length - 1][0];
        var posYAwal = data["polygon"]["vertices"]
        [data["polygon"]["vertices"].length - 1][1];
        
        for (var i = 2; i < data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1
        ].length; i+=2) {
          var prevPoint = data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1];
          var newPoint = rotate(posXAwal-pos.x,posYAwal-pos.y,prevPoint[i-2],prevPoint[i-1],360/inputPolygonNode.value);
          // console.log(newPoint.x);
          // console.log(newPoint.y);
          data["polygon"]["vertices"][
            data["polygon"]["vertices"].length - 1
          ][i] = newPoint.x;
          data["polygon"]["vertices"][
            data["polygon"]["vertices"].length - 1
          ][i+1] = newPoint.y;
        }
        
        render();
      }
      

    }
  } else if (selectMode.value == "change-color") {
  } else if (selectMode.value == "move-point") {
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
  const errorDelta = 0.02;
  const types = ["line", "square", "rectangle", "polygon"];

  types
    .forEach((type) => {
      for (var index = 0; index < data[type]["vertices"].length; index++) {
        for (var x = 0; x < data[type]["vertices"][index].length; x += 2) {
          // console.log(x);
          var a = data[type]["vertices"][index][x];
          var b = data[type]["vertices"][index][x + 1];
          if (pos.x - errorDelta <= a && a <= pos.x + errorDelta) {
            if (pos.y - errorDelta <= b && b <= pos.y + errorDelta) {
              console.log("Ketemu titik di: " + a + " " + b);
              return {
                tipe: type,
                shapeIndex: index,
                vertexIndex: x,
                x: a,
                y: b,
              };
            }
          }
        }
      }
    });
}

// ************************ RENDER ***************************
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  var shader = initShaders(gl);

  // Lines
  let lineVertexBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["line"]["vertices"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexBuffer);
  activateAttr(shader, "vPosition", 2);

  let lineColorBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["line"]["colors"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
  activateAttr(shader, "vColor", 4);

  if (data["line"]["vertices"].length != 0) {
    for (var i = 0; i < data["line"]["vertices"].length; i++) {
      gl.drawArrays(gl.LINES, i * 2, 2);
    }
  }

  // Squares
  let squareVertexBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["square"]["vertices"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  activateAttr(shader, "vPosition", 2);

  let squareColorBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["square"]["colors"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, squareColorBuffer);
  activateAttr(shader, "vColor", 4);

  if (data["square"]["vertices"].length != 0) {
    for (var i = 0; i < data["square"]["vertices"].length; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
    }
  }

  // Rectangles
  let rectangleVertexBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["rectangle"]["vertices"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexBuffer);
  activateAttr(shader, "vPosition", 2);

  let rectangleColorBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["rectangle"]["colors"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleColorBuffer);
  activateAttr(shader, "vColor", 4);

  if (data["rectangle"]["vertices"].length != 0) {
    for (var i = 0; i < data["rectangle"]["vertices"].length; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
    }
  }


  // Polygon
  let polygonVertexBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["polygon"]["vertices"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, polygonVertexBuffer);
  activateAttr(shader, "vPosition", 2);

  let polygonColorBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["polygon"]["colors"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);
  activateAttr(shader, "vColor", 4);

  var countVert = 0;
  if (data["polygon"]["vertices"].length != 0) {
    for (var i = 0; i < data["polygon"]["vertices"].length; i++) {
      const polygonVert = data["polygon"]["vertices"][i].length/2;
      // console.log(polygonVert);
      gl.drawArrays(gl.TRIANGLE_FAN, countVert, polygonVert);
      countVert += polygonVert;
    }
  }

}
