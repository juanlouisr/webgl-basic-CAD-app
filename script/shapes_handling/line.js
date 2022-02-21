function handleMouseLine(event, mode, interactionType){
  if (mode == "draw"){
    if (interactionType == "mouse-down"){
      const pos = getCursorPos(event);
      data["line"]["vertices"].push([pos.x, pos.y, pos.x, pos.y]);
      data["line"]["colors"].push([0, 0, 0, 1, 0, 0, 0, 1]);
    }
    else if (interactionType == "mouse-move"){
      const pos = getCursorPos(event);
      data["line"]["vertices"][data["line"]["vertices"].length - 1][2] = pos.x;
      data["line"]["vertices"][data["line"]["vertices"].length - 1][3] = pos.y;
      render();
    }
  }

  else if (mode == "move-point"){
    const pos = getCursorPos(event);
    data["line"]["vertices"][currVertexToDrag.shapeIndex][currVertexToDrag.firstVertIdx] =
      pos.x;
    data["line"]["vertices"][currVertexToDrag.shapeIndex][currVertexToDrag.firstVertIdx+1] =
      pos.y;
    render();
  }
}

function renderLines(shader){
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
}