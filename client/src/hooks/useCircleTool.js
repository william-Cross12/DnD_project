// src/hooks/useCircleTool.js
import { useRef } from "react";

export function useCircleTool(previewCtx) {
  const start = useRef(null);

  function startHandler(p) {
    start.current = p;
  }

  function move(p) {
    if (!start.current) return;

    const ctx = previewCtx.current;
    const dx = p.x - start.current.x;
    const dy = p.y - start.current.y;
    const r = Math.sqrt(dx * dx + dy * dy);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.arc(start.current.x, start.current.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function end() {
    previewCtx.current.clearRect(0, 0, previewCtx.current.canvas.width, previewCtx.current.canvas.height);
    start.current = null;
  }

  return { start: startHandler, move, end };
}
