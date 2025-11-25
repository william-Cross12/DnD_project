// src/components/ImageLayer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ImageLayer({ scale, origin }) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  // Expose a global function to set the map image (you'll replace this later)
  window.setMapImage = (file) => {
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.setTransform(scale, 0, 0, scale, origin.x * scale, origin.y * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0);
  }, [image, scale, origin]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
}
