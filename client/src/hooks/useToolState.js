// src/hooks/useToolState.js
import { useState } from "react";

export function useToolState() {
  const [tool, setTool] = useState("draw");  // draw | ruler | circle | square | cone | move
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [coneAngle, setConeAngle] = useState(60);

  return {
    tool,
    setTool,
    color,
    setColor,
    lineWidth,
    setLineWidth,
    coneAngle,
    setConeAngle,
  };
}
