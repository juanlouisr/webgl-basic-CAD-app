function handleMouseRectangle(event, mode, interactionType){
  if (mode == "draw"){
    if (interactionType == "mouse-down"){
      const pos = getCursorPos(event);
      data["rectangle"]["vertices"].push(initVertexArray(pos.x, pos.y, 4));
      data["rectangle"]["colors"].push(initColorArray(shapeColor, 4));
    }
    else if (interactionType == "mouse-move"){
      const pos = getCursorPos(event);

      data["rectangle"]["vertices"][
        data["rectangle"]["vertices"].length - 1
      ][2] = pos.x;
      data["rectangle"]["vertices"][
        data["rectangle"]["vertices"].length - 1
      ][4] = pos.x;
      data["rectangle"]["vertices"][
        data["rectangle"]["vertices"].length - 1
      ][5] = pos.y;
      data["rectangle"]["vertices"][
        data["rectangle"]["vertices"].length - 1
      ][7] = pos.y;

      render();
    }
  }

  else if (mode == "move-point"){
    
  }
}

function renderRectangles(shader){
  let rectangleVertexBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["rectangle"]["vertices"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleVertexBuffer);
  activateAttr(shader, "vPosition", 2);

  let rectangleColorBuffer = fillBuffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(data["rectangle"]["colors"].flat(2))
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleColorBuffer);
  activateAttr(shader, "vColor", 4);

  if (data["rectangle"]["vertices"].length != 0) {
    for (var i = 0; i < data["rectangle"]["vertices"].length; i++) {
      gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
    }
  }
}