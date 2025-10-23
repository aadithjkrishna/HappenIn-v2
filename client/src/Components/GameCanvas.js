// GameCanvas.js
import React, { useRef, useEffect } from "react";

const GameCanvas = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const player = { x: 50, y: 50, size: 50, color: "red" };
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.size, player.size);
      player.x += 1;
      if (player.x > width) player.x = -player.size;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{
      border: "1px solid black",
      position: "absolute",
      top: "100px",
      left: "200px",
    }} />;
};

export default GameCanvas;