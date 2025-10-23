import React, { useRef, useEffect } from "react";

const GameCanvas = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastTime = useRef(performance.now());

  const player = useRef({
    x: 100,
    y: 300,
    size: 20,
    color: "red",
    velY: 0,
  });

  const keys = useRef({});
  const gameStarted = useRef(false);
  const score = useRef(0);

  const Colors = ["brown", "saddlebrown", "darkred", "red", "darkblue", "blue", "darkgreen", "green", "purple", "indigo"];

  const Obstacles = useRef([
    { x: 400, y: 0, width: 50, height: 250, color: "purple", passed: false },
    { x: 700, y: 0, width: 50, height: 300, color: "indigo", passed: false },
  ]);

  const gravity = 1200;
  const jumpForce = -450;
  const sceneSpeed = 150;
  const gap = 180;

  function resetGame() {
    player.current.y = 300;
    player.current.velY = 0;
    Obstacles.current = [
      { x: 400, y: 0, width: 50, height: 250, color: "brown", passed: false },
      { x: 700, y: 0, width: 50, height: 300, color: "saddlebrown", passed: false },
    ];
    gameStarted.current = false;
    score.current = 0;
  }

  const checkCollision = (px, py, size, obs) => {
    const top = { x: obs.x, y: 0, w: obs.width, h: obs.height };
    const bottom = {
      x: obs.x,
      y: obs.height + gap,
      w: obs.width,
      h: height - obs.height - gap,
    };
    return (
      (px + size > top.x &&
        px - size < top.x + top.w &&
        py - size < top.h) ||
      (px + size > bottom.x &&
        px - size < bottom.x + bottom.w &&
        py + size > bottom.y)
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleKeyDown = (e) => (keys.current[e.key] = true);
    const handleKeyUp = (e) => (keys.current[e.key] = false);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    const gameLoop = (timestamp) => {
      const dt = (timestamp - lastTime.current) / 1000;
      lastTime.current = timestamp;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, width, height);

      if (!gameStarted.current) {
        ctx.fillStyle = "black";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE to Start", width / 2, height / 2);
        ctx.fillText(`Score: ${score.current}`, width / 2, height / 2 + 50);

        if (keys.current[" "]) {
          gameStarted.current = true;
          player.current.velY = jumpForce;
        }
        ctx.beginPath();
        ctx.arc(
          player.current.x,
          player.current.y,
          player.current.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = player.current.color;
        ctx.fill();
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
      }
      if (keys.current[" "] && player.current.velY >= 0) {
        player.current.velY = jumpForce;
      }
      player.current.velY += gravity * dt;
      player.current.y += player.current.velY * dt;
      if (player.current.y + player.current.size > height) {
        resetGame();
      }
      Obstacles.current.forEach((obs) => {
        obs.x -= sceneSpeed * dt;
        if (!obs.passed && obs.x + obs.width < player.current.x) {
          score.current += 1;
          obs.passed = true;
        }
        if (obs.x + obs.width < 0) {
          obs.x = width;
          obs.height = Math.random() * (height - gap - 100) + 50;
          obs.color = Colors[Math.floor(Math.random() * Colors.length)];
          obs.passed = false;
        }
      });
      let collided = Obstacles.current.some((obs) =>
        checkCollision(
          player.current.x,
          player.current.y,
          player.current.size,
          obs
        )
      );
      if (collided) {
        // player.current.color = "black";
        resetGame();
      } else {
        player.current.color = "red";
      }
      Obstacles.current.forEach((obs) => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, 0, obs.width, obs.height);
        // obs.color = Colors[Math.floor(Math.random() * Colors.length)];
        ctx.fillStyle = obs.color;
        ctx.fillRect(
          obs.x,
          obs.height + gap,
          obs.width,
          height - obs.height - gap
        );
      });
      ctx.beginPath();
      ctx.arc(
        player.current.x,
        player.current.y,
        player.current.size,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = player.current.color;
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score.current}`, 20, 40);
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "2px solid black",
        display: "block",
        margin: "100px auto",
      }}
    />
  );
};

export default GameCanvas;
