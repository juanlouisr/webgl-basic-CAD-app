var currPolygonVerticeArr = [];
var currPolygonColorArr = [];

function handleMousePolygon(event, mode, interactionType){
  if (mode == "draw"){
    if (selectPolygonMode.value == "parametric"){
      if (interactionType == "mouse-down"){
        const pos = getCursorPos(event);
        pointOfRef = pos;
        data["polygon"]["vertices"].push(initVertexArray(pos.x, pos.y, inputPolygonNode.value));
        data["polygon"]["colors"].push(initColorArray(shapeColor, inputPolygonNode.value));
      }
      else if (interactionType == "mouse-move"){
        const pos = getCursorPos(event);
        
        data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1
        ][0] = pos.x;
        data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1
        ][1] = pos.y;
  
        for (var i = 2; i < data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1
        ].length; i+=2) {
          var prevPoint = data["polygon"]["vertices"][
          data["polygon"]["vertices"].length - 1];
          var newPoint = rotate(pointOfRef.x,pointOfRef.y,
            prevPoint[i-2],prevPoint[i-1],
            360/inputPolygonNode.value);
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
    else {
      if (currPolygonVertices < inputPolygonNode.value) {
        if (interactionType == "mouse-down") {
          const pos = getCursorPos(event);
          data["line"]["vertices"].push(initVertexArray(pos.x, pos.y, 2));
          data["line"]["colors"].push(initColorArray(shapeColor, 2));
          if (currPolygonVertices > 0) {
            data["line"]["vertices"][data["line"]["vertices"].length - 1][0] =
            data["line"]["vertices"][data["line"]["vertices"].length - 2][2];
            data["line"]["vertices"][data["line"]["vertices"].length - 1][1] =
            data["line"]["vertices"][data["line"]["vertices"].length - 2][3];
          }
          currPolygonVertices++;
          if (currPolygonVertices == inputPolygonNode.value) {
            // Membuat shape polygon dari titik2 di line
            data["polygon"]["vertices"].push(initVertexArray(pos.x, pos.y, inputPolygonNode.value));
            data["polygon"]["colors"].push(initColorArray(shapeColor, inputPolygonNode.value));
            for (var i = data["polygon"]["vertices"][
              data["polygon"]["vertices"].length - 1
            ].length-1; i >= 0; i-=2) {
              data["polygon"]["vertices"][
                data["polygon"]["vertices"].length - 1
              ][i-1] = data["line"]["vertices"][data["line"]["vertices"].length - 1][0];
              data["polygon"]["vertices"][
                data["polygon"]["vertices"].length - 1
              ][i] = data["line"]["vertices"][data["line"]["vertices"].length - 1][1];
              data["line"]["vertices"].pop();
              data["line"]["colors"].pop();
            }
            currPolygonVertices = 0;
          }
          render();
        } 
        else if (interactionType == "mouse-move") {
          if (currPolygonVertices > 0
             && currPolygonVertices < inputPolygonNode.value) {
            const pos = getCursorPos(event);
            data["line"]["vertices"][data["line"]["vertices"].length - 1][2] = pos.x;
            data["line"]["vertices"][data["line"]["vertices"].length - 1][3] = pos.y;
          }
          render();
        }
      } else {
        isDrawing = false;
      }
    }
    
  }

  else if (mode == "move-point"){
    const pos = getCursorPos(event);
    data["polygon"]["vertices"][currVertexToDrag.shapeIndex][currVertexToDrag.firstVertIdx] =
      pos.x;
    data["polygon"]["vertices"][currVertexToDrag.shapeIndex][currVertexToDrag.firstVertIdx+1] =
      pos.y;
    render();
  }
}

function renderPolygons(shader){
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
      gl.drawArrays(gl.TRIANGLE_FAN, countVert, polygonVert);
      countVert += polygonVert;
    }
  }

}