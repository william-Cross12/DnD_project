// src/hooks/useDrawTool.js
import { useRef } from "react";

export function useDrawTool(socket, previewCtx, toolState) {
  const points = useRef([]);

  function start(p) {
    points.current = [p.x, p.y];
  }

  function move(p) {
    points.current.push(p.x, p.y);

    // preview last segment
    const pts = points.current;
    const len = pts.length;
    if (len >= 4) {
      previewCtx.current.beginPath();
      previewCtx.current.strokeStyle = toolState.color;
      previewCtx.current.lineWidth = toolState.lineWidth;
      previewCtx.current.moveTo(pts[len - 4], pts[len - 3]);
      previewCtx.current.lineTo(pts[len - 2], pts[len - 1]);
      previewCtx.current.stroke();
    }
  }

  function end() {
    if (points.current.length < 4) return;

    socket.emit("draw-stroke", {
      points: points.current,
      color: toolState.color,
      width: toolState.lineWidth,
    });

    points.current = [];
  }

  return { start, move, end };
}
