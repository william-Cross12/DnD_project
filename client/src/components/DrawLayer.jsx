// src/components/DrawLayer.jsx
import React, { useEffect, useRef } from "react";

export default function DrawLayer({ socket, scale, origin }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctxRef.current = canvas.getContext("2d");
    ctxRef.current.lineCap = "round";
  }, []);

  // Re-draw on zoom/pan
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.setTransform(scale, 0, 0, scale, origin.x * scale, origin.y * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: store strokes locally
    // You may sync them here later

  }, [scale, origin]);

  // Handle strokes from server
  useEffect(() => {
    function handleStroke(stroke) {
      const ctx = ctxRef.current;
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, origin.x * scale, origin.y * scale);

      ctx.strokeStyle = stroke.color || "black";
      ctx.lineWidth = stroke.width || 3;

      const pts = stroke.points;
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1]);
      }
      ctx.stroke();
      ctx.restore();
    }

    socket.on("stroke", handleStroke);
    return () => socket.off("stroke", handleStroke);
  }, [socket, scale, origin]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",  // drawing happens via preview layer
        zIndex: 20,
      }}
    />
  );
}
