var CONST_MAX_VERTICES = 500;

var canvas = document.getElementById( "gl-canvas" );
gl = WebGLUtils.setupWebGL( canvas );

var vBufferId = gl.createBuffer();
var cBufferId = gl.createBuffer();
var isDrawing = false;

window.onload = function init(){
  if ( !gl ) { alert( "WebGL isn't available" ); }

  // Resize Canvas for the first time
  resizeCanvas();

  // Setup WebGL
  setupWebGL();

  // Show the canvas color
  gl.clear( gl.COLOR_BUFFER_BIT );
  
}

function resizeCanvas(){
  gl.canvas.width = (4 / 5) * window.innerWidth;
  gl.canvas.height = (4 / 5) * window.innerWidth;
  gl.viewport( 0, 0, canvas.width, canvas.height );
}
window.addEventListener("resize", () => resizeCanvas());

canvas.addEventListener("mousedown", (e) => {
  isDrawing = !isDrawing;

  if (isDrawing){
    // this starts the draw, pushing new vertex for mousemove event to change
    var rect = e.target.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / gl.canvas.width) * 2 - 1;
    var y = (((e.clientY - rect.top) / gl.canvas.width) * 2 - 1) * -1;
    data["line"]["vertices"].push([x,y,x,y]);
    data["line"]["colors"].push([0,0,0,1,0,0,0,1]);
    // console.log("Left? : " + x + " ; Top? : " + y + ".");
  }

});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing){
    var rect = e.target.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / gl.canvas.width) * 2 - 1;
    var y = (((e.clientY - rect.top) / gl.canvas.width) * 2 - 1) * -1;
    data["line"]["vertices"][data["line"]["vertices"].length - 1][2] = x;
    data["line"]["vertices"][data["line"]["vertices"].length - 1][3] = y;
    render();
  }
});

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

  // // Squares
  // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(squareVertices));
  // gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(squareColors));

  // if (squareVertices.length != 0) {
  //   for (var i = 0; i < data["line"]["vertices"].length; i++) {
  //     gl.drawArrays(gl.TRIANGLES, i*4 , 4);
  //   }
  // }

  // [x1,y1,x2,y2,x3,y3,x4,y4]