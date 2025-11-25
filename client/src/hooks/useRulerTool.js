// src/hooks/useRulerTool.js
import { useRef } from "react";

export function useRulerTool(previewCtx) {
  const startPos = useRef(null);

  function start(p) {
    startPos.current = p;
  }

  function move(p) {
    if (!startPos.current) return;
    const ctx = previewCtx.current;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.moveTo(startPos.current.x, startPos.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    startPos.current = null;
    previewCtx.current.clearRect(0, 0, previewCtx.current.canvas.width, previewCtx.current.canvas.height);
  }

  return { start, move, end };
}
