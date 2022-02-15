var CONST_MAX_VERTICES = 100;

var canvas = document.getElementById( "gl-canvas" );
gl = WebGLUtils.setupWebGL( canvas );

var vBufferId = gl.createBuffer();
var cBufferId = gl.createBuffer();

var lineVertices = [] // x1,y1,x2,y2
var lineColors = []

window.onload = function init(){
  if ( !gl ) { alert( "WebGL isn't available" ); }

  // Resize Canvas for the first time
  resizeCanvas();

  // Setup WebGL
  setupWebGL();

  // Render for the first time
  render();
}

function resizeCanvas(){
  gl.canvas.width = (4 / 5) * window.innerWidth;
  gl.canvas.height = (4 / 5) * window.innerWidth;
}
window.addEventListener("resize", () => resizeCanvas());

canvas.addEventListener("mousedown", (e) => {
  // the canvas is defined as -1 to 1 (both horizontally and vertically)

  var rect = e.target.getBoundingClientRect();
  var x = ((e.clientX - rect.left) / gl.canvas.width) * 2 - 1;
  var y = (((e.clientY - rect.top) / gl.canvas.width) * 2 - 1) * -1;
  lineVertices.push([x,y,x+0.2,y]);
  lineColors.push([0,0,0,1,0,0,0,1]);
  // lineColors.push([0.8470588235294118,0.13333333333333333,0.13333333333333333,1,0.8470588235294118,0.13333333333333333,0.13333333333333333,1]);
  render();
  console.log("Left? : " + x + " ; Top? : " + y + ".");
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
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(lineVertices));
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(lineColors));
  if (lineVertices.length != 0) {
    for (var i = 0; i < lineVertices.length; i++) {
      gl.drawArrays(gl.LINES, i*2 , 2);
    }
  }

  // [x1,y1,x2,y2]
}  