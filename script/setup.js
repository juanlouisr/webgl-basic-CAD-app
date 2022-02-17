
function initShaders(gl) {
  let vElm = document.getElementById("vertex-shader");
  let fElm = document.getElementById("fragment-shader");

  let vShader = loadShader(gl, gl.VERTEX_SHADER, vElm.text);
  let fShader = loadShader(gl, gl.FRAGMENT_SHADER, fElm.text);
 
  let shader = gl.createProgram();
  gl.attachShader(shader, vShader);
  gl.attachShader(shader, fShader);
  gl.linkProgram(shader);
  gl.useProgram(shader);

  return shader;
}

function loadShader(gl, shaderType, sourceId) {
  shader = gl.createShader(shaderType);
  gl.shaderSource(shader, sourceId);
  gl.compileShader(shader);

  return shader;
}

function activateAttr(shader, attrName, numOfComponent){
  let idx = gl.getAttribLocation(shader, attrName);
  gl.vertexAttribPointer(idx, numOfComponent, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(idx);
}

function fillBuffer(gl, bindType, data) {
  let buffer = gl.createBuffer();

  gl.bindBuffer(bindType, buffer);
  gl.bufferData(bindType, data, gl.STATIC_DRAW);
  // gl.bindBuffer(type, null);

  return buffer;
}