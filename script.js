var CONST_MAX_VERTICES = 500;

var canvas = document.getElementById( "gl-canvas" );
gl = WebGLUtils.setupWebGL( canvas );

var vBufferId = gl.createBuffer();
var cBufferId = gl.createBuffer();

var isDrawing = false;

function initialize(){
  if ( !gl ) { alert( "WebGL isn't available" ); }

  // Resize Canvas for the first time
  resizeCanvas();

  // Initialize Data
  initAndClearData();

  // Setup WebGL
  setupWebGL();

  // Show the canvas color
  gl.clear( gl.COLOR_BUFFER_BIT );
}
window.onload = () => initialize();

function setupWebGL(){
  // Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

  // Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader");
  gl.useProgram( program );

  // Load Data ke GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * CONST_MAX_VERTICES, gl.STATIC_DRAW);
  var vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * CONST_MAX_VERTICES, gl.STATIC_DRAW);
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
}
window.addEventListener("resize", () => resizeCanvas());

// ********************** CANVAS ****************************

function resizeCanvas(){
  gl.canvas.width = (9 / 12) * window.innerWidth;
  gl.canvas.height = (9 / 12) * window.innerWidth;
  gl.viewport( 0, 0, canvas.width, canvas.height );
}

function canvasListenForMouseDown(event) {
  if (selectMode.value == "draw"){
    if (selectShape.value == "line") {
      isDrawing = !isDrawing;

      if (isDrawing){
        // this starts the draw, pushing two vertices for mousemove event to change the second one
        const pos = getCursorPos(event);
        data["line"]["vertices"].push([pos.x,pos.y,pos.x,pos.y]);
        data["line"]["colors"].push([0,0,0,1,0,0,0,1]);
        // console.log("Left? : " + x + " ; Top? : " + y + ".");
      }
    }
    else if (selectShape.value == "square"){

    }
    else if (selectShape.value == "rectangle"){

    }
    else if (selectShape.value == "polygon"){

    }
  }
  else if (selectMode.value == "change-color"){

  }
  else if (selectMode.value == "move-point"){

  }
}
canvas.addEventListener("mousedown", (event) => canvasListenForMouseDown(event));

function canvasListenForMouseMove(event){
  if (selectMode.value == "draw"){
    if (selectShape.value == "line") {
      if (isDrawing){
        // change the second coordinate of line, then rerender
        const pos = getCursorPos(event);
        data["line"]["vertices"][data["line"]["vertices"].length - 1][2] = pos.x;
        data["line"]["vertices"][data["line"]["vertices"].length - 1][3] = pos.y;
        render();
      }
    }
    else if (selectShape.value == "square"){

    }
    else if (selectShape.value == "rectangle"){

    }
    else if (selectShape.value == "polygon"){

    }
  }
  else if (selectMode.value == "change-color"){

  }
  else if (selectMode.value == "move-point"){

  }
}
canvas.addEventListener("mousemove", (event) => canvasListenForMouseMove(event));

function clearCanvas(){ 
  initAndClearData();
  gl.clear( gl.COLOR_BUFFER_BIT ); 
}

// ************************ MOUSE ***************************

function getCursorPos(event){
  const rect = event.target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / gl.canvas.width) * 2 - 1;
  const y = (((event.clientY - rect.top) / gl.canvas.width) * 2 - 1) * -1;

  return {x: x, y: y};
}

// ************************ RENDER ***************************

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );

  // Lines
  gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(data["line"]["vertices"]));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(data["line"]["colors"]));

  if (data["line"]["vertices"].length != 0) {
    for (var i = 0; i < data["line"]["vertices"].length; i++) {
      gl.drawArrays(gl.LINES, i*2 , 2);
    }
  }
}  