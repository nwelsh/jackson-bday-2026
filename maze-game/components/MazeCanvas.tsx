"use client";

// ideas
/* 
1. add music 
2. when completed, a popup shows up that says a jackson-ism 
*/

import { useEffect, useRef, useState } from "react";
import { generateMaze } from "../lib/maze";
import { Cell } from "../lib/types";

const ROWS = 15;
const COLS = 15;

export default function MazeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src =
      (process.env.NODE_ENV === "production" ? "/jackson-bday-2026" : "") +
      "/jackson.png";

    img.onload = () => {
      playerImage.current = img;
      draw();
    };
  }, []);

  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze(ROWS, COLS));

  const [player, setPlayer] = useState({
    row: 0,
    col: 0,
  });

  const startTouch = useRef({ x: 0, y: 0 });

  useEffect(() => {
    draw();
  }, [maze, player]);

  function draw() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const size = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = size;
    canvas.height = size;

    const cellSize = size / COLS;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    maze.forEach((row) => {
      row.forEach((cell) => {
        const x = cell.col * cellSize;
        const y = cell.row * cellSize;

        if (cell.top) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
          ctx.stroke();
        }

        if (cell.right) {
          ctx.beginPath();
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }

        if (cell.bottom) {
          ctx.beginPath();
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }

        if (cell.left) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
          ctx.stroke();
        }
      });
    });

    // Exit
    ctx.fillStyle = "gold";

    ctx.fillRect(
      (COLS - 1) * cellSize + cellSize * 0.3,
      (ROWS - 1) * cellSize + cellSize * 0.3,
      cellSize * 0.4,
      cellSize * 0.4,
    );

    // Player
    const img = playerImage.current;

    console.log(img);

    if (img) {
      ctx.drawImage(
        img,
        player.col * cellSize + cellSize * 0.15,
        player.row * cellSize + cellSize * 0.15,
        cellSize * 0.7,
        cellSize * 0.7,
      );
    }
  }

  function move(direction: "up" | "down" | "left" | "right") {
    const cell = maze[player.row][player.col];

    let next = { ...player };

    if (direction === "up" && !cell.top) next.row--;
    if (direction === "down" && !cell.bottom) next.row++;
    if (direction === "left" && !cell.left) next.col--;
    if (direction === "right" && !cell.right) next.col++;

    if (next.row < 0 || next.col < 0 || next.row >= ROWS || next.col >= COLS) {
      return;
    }

    setPlayer(next);

    if (next.row === ROWS - 1 && next.col === COLS - 1) {
      setTimeout(() => {
        setMaze(generateMaze(ROWS, COLS));
        setPlayer({
          row: 0,
          col: 0,
        });
      }, 300);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    startTouch.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - startTouch.current.x;
    const dy = e.changedTouches[0].clientY - startTouch.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) move("right");
      else if (dx < -30) move("left");
    } else {
      if (dy > 30) move("down");
      else if (dy < -30) move("up");
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}
