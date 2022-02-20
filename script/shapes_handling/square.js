function handleMouseSquare(event, mode, interactionType, isDrawing){
  if (mode == "draw"){
    if (interactionType == "mouse-down"){
      if (isDrawing) {
        const pos = getCursorPos(event);
        data["square"]["vertices"].push(
          [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y],
          [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y]
        );
        data["square"]["colors"].push(
          [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
          [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]
        );
      }
    }
    else if (interactionType == "mouse-move"){
      const pos = getCursorPos(event);
      vertices = data["square"]["vertices"];
      lastIdx = data["square"]["vertices"].length - 1;
      originX = vertices[lastIdx][0];
      originY = vertices[lastIdx][1];

      // First triangle
      vertices[lastIdx][2] = pos.x;
      vertices[lastIdx][3] =
        pos.y + getEdgeLength(originX, originY, pos.x, pos.y);
      vertices[lastIdx][4] = pos.x;
      vertices[lastIdx][5] = pos.y;

      // Second triangle
      vertices[lastIdx - 1][2] =
        pos.x - getEdgeLength(originX, originY, pos.x, pos.y);
      vertices[lastIdx - 1][3] = pos.y;
      vertices[lastIdx - 1][4] = pos.x;
      vertices[lastIdx - 1][5] = pos.y;

      render();
    }
  }

  else if (mode == "move-point"){
    
  }
}

function renderSquares(shader){
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
      gl.drawArrays(gl.TRIANGLES, i * 3, 3);
    }
  }
}