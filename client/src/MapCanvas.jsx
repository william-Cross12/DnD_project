import React, { useRef, useEffect, useState } from "react";
import DrawLayer from "./components/DrawLayer";
import ImageLayer from "./components/ImageLayer";
import GridLayer from "./components/GridLayer";
import CanvasLayer from "./components/CanvasLayer";
import useCanvasTools from "./hooks/useCanvasTools";

export default function MapCanvas({ socket, tool, color, lineWidth }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1); // zoom factor
  const [origin, setOrigin] = useState({ x: 0, y: 0 }); // pan offset
  const [localColor, setLocalColor] = useState(color || "#000000");

  // update local color if toolbar changes
  useEffect(() => setLocalColor(color || "#000000"), [color]);

  const toolHandlers = useCanvasTools({
    tool,
    socket,
    scale,
    origin,
    color: localColor,
    lineWidth,
    setScale,
    setOrigin
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "1000px",
        height: "700px",
        overflow: "hidden",
        border: "1px solid #555"
      }}
    >
      <ImageLayer scale={scale} origin={origin} />
      <GridLayer scale={scale} origin={origin} />
      <DrawLayer socket={socket} scale={scale} origin={origin} />
      <CanvasLayer {...toolHandlers} />
    </div>
  );
}
