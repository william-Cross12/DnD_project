// src/components/GridLayer.jsx
import React, { useEffect, useRef } from "react";

export default function GridLayer({ scale, origin }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const size = 50 * scale; // grid cell size

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;

    ctx.beginPath();

    // vertical lines
    for (let x = origin.x * scale; x < canvas.width; x += size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    // horizontal lines
    for (let y = origin.y * scale; y < canvas.height; y += size) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
  }, [scale, origin]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}
