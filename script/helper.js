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

function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
}

let INF = 10000;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function onSegment(p, q, r) {
  if (q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)) {
    return true;
  }
  return false;
}

function orientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x)
    - (q.x - p.x) * (r.y - q.y);

  if (val == 0) {
    return 0;
  }
  return (val > 0) ? 1 : 2;
}


function doIntersect(p1, q1, p2, q2) {
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  if (o1 != o2 && o3 != o4) {
    return true;
  }

  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }

  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }


  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }

  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  return false;
}


function isInside(polygon, n, p) {
  if (n < 3) {
    return false;
  }

  let extreme = new Point(INF, p.y);

  let count = 0, i = 0;
  do {
    let next = (i + 1) % n;


    if (doIntersect(polygon[i], polygon[next], p, extreme)) {
      if (orientation(polygon[i], p, polygon[next]) == 0) {
        return onSegment(polygon[i], p,
          polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i != 0);

  return (count % 2 == 1);
}

function getArrOfPoints(polygon) {
  var arr = [];
  for (var i = 0; i < polygon.length; i += 2) {
    arr.push(new Point(polygon[i], polygon[i + 1]));
  }
  return arr;
}