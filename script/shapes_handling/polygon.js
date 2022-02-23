function handleMousePolygon(event, mode, interactionType){
  if (mode == "draw"){
    if (inputPolygonNode.value < 3) return;
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
      // console.log(polygonVert);
      gl.drawArrays(gl.TRIANGLE_FAN, countVert, polygonVert);
      countVert += polygonVert;
    }
  }

}