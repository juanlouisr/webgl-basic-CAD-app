function getSecondVertexX(x1, x2) {
  if (x1 < x2) {
    x = x2;
  } else {
    x = x1;
  }
  return x;
}

function getSecondVertexY(y1, y2) {
  if (y1 > y2) {
    y = y1;
  } else {
    y = y2;
  }
  return y;
}

function getEdgeLength(x1, y1, x2, y2) {
  distancePow = (x1 - x2) ** 2 + (y1 - y2) ** 2;
  length = Math.sqrt(distancePow / 2);
  return length;
}

function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
}

function initVertexArray(x, y, n) {
  vertexArray = [];
  for (i = 0; i < n; i++) {
    vertexArray.push(x);
    vertexArray.push(y);
  }
  return vertexArray;
}

function initColorArray(shapeColor, n) {
  colorArray = [];
  for (i = 0; i < n; i++) {
    colorArray.push(shapeColor.r / 255);
    colorArray.push(shapeColor.g / 255);
    colorArray.push(shapeColor.b / 255);
    colorArray.push(1);
  }
  return colorArray;
}
