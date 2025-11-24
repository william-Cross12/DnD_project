// src/MapCanvas.jsx
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function MapCanvas({ socket }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const pointsRef = useRef([]); // accumulate points for a stroke

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 700;
    canvas.style.border = "1px solid #999";
    canvas.style.touchAction = "none";

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctxRef.current = ctx;

    // receive strokes from server
    socket.on("stroke", (stroke) => {
      // stroke.points assumed to be [x1,y1,x2,y2,...]
      drawPoints(stroke.points);
    });

    // optional: receive initial map state if server emits 'state'
    socket.on("state", (state) => {
      if (state.map && state.map.strokes) {
        state.map.strokes.forEach(s => drawPoints(s.points || s.pointsArray || []));
      }
    });

    return () => {
      socket.off("stroke");
      socket.off("state");
    };
  }, [socket]);

  function drawPoints(points) {
    if (!points || points.length < 4) return;
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.stroke();
  }

  function getPointerPos(nativeEvent) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: nativeEvent.clientX - rect.left,
      y: nativeEvent.clientY - rect.top
    };
  }

  function handleMouseDown(e) {
    setIsDrawing(true);
    const p = getPointerPos(e);
    pointsRef.current = [p.x, p.y];
  }

  function handleMouseMove(e) {
    if (!isDrawing) return;
    const p = getPointerPos(e);
    const pts = pointsRef.current;
    pts.push(p.x, p.y);
    // draw last segment locally for immediate feedback
    const len = pts.length;
    if (len >= 4) {
      const ctx = ctxRef.current;
      ctx.beginPath();
      ctx.moveTo(pts[len - 4], pts[len - 3]);
      ctx.lineTo(pts[len - 2], pts[len - 1]);
      ctx.stroke();
    }
  }

  function finishStroke() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pts = pointsRef.current;
    if (pts.length >= 4) {
      // send full stroke to server (server expects draw-stroke)
      socket.emit("draw-stroke", { points: pts, color: "black", width: 3 });
    }
    pointsRef.current = [];
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={finishStroke}
        onMouseLeave={finishStroke}
        style={{ display: "block", touchAction: "none" }}
      />
      <div style={{ marginTop: 8 }}>
        <small>Draw on the canvas. Open another browser window to see real-time sync.</small>
      </div>
    </div>
  );
}
