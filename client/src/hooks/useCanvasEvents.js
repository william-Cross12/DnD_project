// src/hooks/useCanvasEvents.js
export function useCanvasEvents({
  toolState,
  drawTool,
  rulerTool,
  circleTool,
  squareTool,
  coneTool,
  transform,
}) {
  function handleDown(e) {
    const pos = transform.toMapCoords(e);
    switch (toolState.tool) {
      case "draw":  drawTool.start(pos); break;
      case "ruler": rulerTool.start(pos); break;
      case "circle": circleTool.start(pos); break;
      case "square": squareTool.start(pos); break;
      case "cone": coneTool.start(pos); break;
      case "move":  transform.panStart(e); break;
    }
  }

  function handleMove(e) {
    const pos = transform.toMapCoords(e);
    switch (toolState.tool) {
      case "draw":  drawTool.move(pos); break;
      case "ruler": rulerTool.move(pos); break;
      case "circle": circleTool.move(pos); break;
      case "square": squareTool.move(pos); break;
      case "cone": coneTool.move(pos); break;
      case "move":  transform.panMove(e); break;
    }
  }

  function handleUp(e) {
    const pos = transform.toMapCoords(e);
    switch (toolState.tool) {
      case "draw":  drawTool.end(pos); break;
      case "ruler": rulerTool.end(pos); break;
      case "circle": circleTool.end(pos); break;
      case "square": squareTool.end(pos); break;
      case "cone": coneTool.end(pos); break;
      case "move":  transform.panEnd(e); break;
    }
  }

  return { handleDown, handleMove, handleUp };
}
