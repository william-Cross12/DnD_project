// src/hooks/useTransform.js
import { useState } from "react";

export function useTransform() {
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  function zoom(delta, mouseX, mouseY) {
    const zoomFactor = delta > 0 ? 0.9 : 1.1;
    setScale(s => s * zoomFactor);
  }

  function panStart(e) {}
  function panMove(e) {}
  function panEnd(e) {}

  function toMapCoords(e) {
    const bounds = e.target.getBoundingClientRect();
    return {
      x: (e.clientX - bounds.left) / scale - origin.x,
      y: (e.clientY - bounds.top) / scale - origin.y,
    };
  }

  return { scale, origin, setScale, setOrigin, zoom, panStart, panMove, panEnd, toMapCoords };
}
