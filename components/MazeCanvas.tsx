"use client";

import { useEffect, useRef, useState } from "react";
import { generateMaze } from "../lib/maze";
import { Cell } from "../lib/types";

const ROWS = 8;
const COLS = 8;

export default function MazeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerImage = useRef<HTMLImageElement | null>(null);
  const exitImage = useRef<HTMLImageElement | null>(null);

  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze(ROWS, COLS));

  const [player, setPlayer] = useState({
    row: 0,
    col: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const startTouch = useRef({ x: 0, y: 0 });

  const sayings = [
    "Jackson says: time for BDUBS 🍗",
    "I LOVE BDUBS!!!!!!!!! 🧞‍♂️",
    "I am jackson 🐸",
    "I am 24 🎅🏽",
    "Did you know buffalo wild wings serves chicken wings? 🍔",
    "Call me chicken Jack 🦴",
    "Ask me what movie im working on 🫦",
    "Ask me what i ate for lunch today 👠",
    "remember when i kept tickling nick gomez HAHAHAHHAHAHA",
    "remember when i kept trying to pick up Jake HAHHHAHAHAHAH",
    "remember when i kissed jordyn 🙊",

  ];

  useEffect(() => {
    const player = new Image();

    player.src =
      (process.env.NODE_ENV === "production" ? "/jackson-bday-2026" : "") +
      "/jackson.png";

    player.onload = () => {
      playerImage.current = player;
      draw();
    };

    const exit = new Image();

    exit.src =
      (process.env.NODE_ENV === "production" ? "/jackson-bday-2026" : "") +
      "/gold.png";

    exit.onload = () => {
      exitImage.current = exit;
      draw();
    };
  }, []);

  useEffect(() => {
    draw();
  }, [maze, player]);

  function draw() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const size = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = size;
    canvas.height = size;

    const cellSize = size / COLS;

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, size, size);

    // Maze walls
    ctx.strokeStyle = "#00ffbf";
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

    // Exit image
    const exit = exitImage.current;

    if (exit) {
      ctx.drawImage(
        exit,
        (COLS - 1) * cellSize + cellSize * 0.15,
        (ROWS - 1) * cellSize + cellSize * 0.15,
        cellSize * 0.7,
        cellSize * 0.7,
      );
    }

    // Player image
    const img = playerImage.current;

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

    const next = { ...player };

    if (direction === "up" && !cell.top) next.row--;
    if (direction === "down" && !cell.bottom) next.row++;
    if (direction === "left" && !cell.left) next.col--;
    if (direction === "right" && !cell.right) next.col++;

    if (next.row < 0 || next.col < 0 || next.row >= ROWS || next.col >= COLS) {
      return;
    }

    setPlayer(next);

    // Reached exit
    if (next.row === ROWS - 1 && next.col === COLS - 1) {
      const randomMessage = sayings[Math.floor(Math.random() * sayings.length)];

      setMessage(randomMessage);
      setShowModal(true);
    }
  }

  function restartMaze() {
    setShowModal(false);

    setMaze(generateMaze(ROWS, COLS));

    setPlayer({
      row: 0,
      col: 0,
    });
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
    <div className="maze-container">
      <h1 className="title">HELP JACKSON GET TO BDUBS 🍗</h1>

      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <h1 className="text">happy birthday jackson</h1>

      <h1 className="text">💖 Mike and Nicole</h1>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{message}</p>

            <button onClick={restartMaze}>ok</button>
          </div>
        </div>
      )}
    </div>
  );
}
