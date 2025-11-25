// src/components/CanvasLayer.jsx
import React, { useEffect } from "react";

export default function CanvasLayer({
  previewCanvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel
}) {
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }, [previewCanvasRef]);

  return (
    <canvas
      ref={previewCanvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        zIndex: 30,        // top-most layer
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    />
  );
}