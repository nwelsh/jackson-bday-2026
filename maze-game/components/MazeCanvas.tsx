"use client";

import { useEffect, useRef } from "react";
import { generateMaze } from "../lib/maze";

const ROWS = 15;
const COLS = 15;

export default function MazeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const size = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = size;
    canvas.height = size;

    const maze = generateMaze(ROWS, COLS);

    const cellSize = size / COLS;

    ctx.clearRect(0, 0, size, size);

    ctx.strokeStyle = "#ffffff";
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
  }, []);

  return <canvas ref={canvasRef} />;
}