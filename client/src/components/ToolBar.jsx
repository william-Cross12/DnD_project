// src/components/ToolBar.jsx
import React from "react";

export default function ToolBar({ tool, setTool, color, setColor }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: 10,
      marginBottom: 10,
      background: "#222",
      color: "#fff",
      borderRadius: 6
    }}>
      <button onClick={() => setTool("draw")}>✏️ Draw</button>
      <button onClick={() => setTool("ruler")}>📏 Ruler</button>
      <button onClick={() => setTool("circle")}>⚪ Circle</button>
      <button onClick={() => setTool("square")}>⬛ Square</button>
      <button onClick={() => setTool("cone")}>📐 Cone</button>
      <button onClick={() => setTool("pan")}>🖐️ Pan / Zoom</button>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
}
