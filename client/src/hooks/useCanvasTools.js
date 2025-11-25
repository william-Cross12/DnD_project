// src/hooks/useCanvasTool.js
import { useRef, useState, useCallback, useEffect } from "react";

export default function useCanvasTools({ tool, socket, scale, origin, color, lineWidth = 3, setScale, setOrigin }) {
  const previewCanvasRef = useRef(null);
  const isDown = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  // for freehand drawing
  const pointsRef = useRef([]);

  function getPos(e) {
    const rect = previewCanvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale - origin.x,
      y: (e.clientY - rect.top) / scale - origin.y
    };
  }

  function onMouseDown(e) {
    const pos = getPos(e);
    isDown.current = true;
    start.current = pos;

    if (tool === "draw") {
      pointsRef.current = [pos.x, pos.y];
      const ctx = previewCanvasRef.current.getContext("2d");
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function onMouseMove(e) {
    if (!isDown.current) return;
    const current = getPos(e);
    const ctx = previewCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);

    if (tool === "ruler") {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.current.x, start.current.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    } else if (tool === "circle") {
      const dx = current.x - start.current.x;
      const dy = current.y - start.current.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(start.current.x, start.current.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tool === "draw") {
      // append and draw freehand preview
      pointsRef.current.push(current.x, current.y);
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      const pts = pointsRef.current;
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) {
        ctx.lineTo(pts[i], pts[i + 1]);
      }
      ctx.stroke();
    } else if (tool === "pan") {
      // dragging to pan -> adjust origin
      const dx = (current.x - start.current.x);
      const dy = (current.y - start.current.y);
      // update start for smooth continuous panning
      start.current = current;
      setOrigin(o => ({ x: o.x + dx, y: o.y + dy }));
    }
  }

  function onMouseUp(e) {
    if (!isDown.current) return;
    isDown.current = false;
    const end = getPos(e);
    const ctx = previewCanvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);

    if (tool === "ruler") {
      const dx = end.x - start.current.x;
      const dy = end.y - start.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      console.log("Distance:", distance);
    } else if (tool === "circle") {
      // create a circle stroke made of many points and emit as a stroke
      const dx = end.x - start.current.x;
      const dy = end.y - start.current.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      const segments = 32;
      const pts = [];
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(start.current.x + Math.cos(theta) * r);
        pts.push(start.current.y + Math.sin(theta) * r);
      }
      socket && socket.emit("draw-stroke", { points: pts, color, width: lineWidth });
    } else if (tool === "draw") {
      if (pointsRef.current.length >= 4) {
        socket && socket.emit("draw-stroke", {
          points: pointsRef.current,
          color,
          width: lineWidth
        });
      }
      pointsRef.current = [];
    }
  }

  // zoom handler via wheel event
  const onWheel = useCallback((e) => {
    if (!e.deltaY) return;
    const delta = Math.sign(e.deltaY);
    const zoomFactor = delta > 0 ? 0.9 : 1.1;
    // clamp scale
    setScale(s => {
      let next = Math.max(0.2, Math.min(4, s * zoomFactor));
      return next;
    });
    e.preventDefault();
  }, [setScale]);

  // keep canvas sized to parent container size
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return {
    previewCanvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel
  };
}
