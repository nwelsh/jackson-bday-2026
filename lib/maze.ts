import { Cell } from "./types";

function createGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,

      visited: false,

      top: true,
      right: true,
      bottom: true,
      left: true,
    }))
  );
}

function getNeighbors(
  grid: Cell[][],
  cell: Cell
): { cell: Cell; direction: string }[] {
  const neighbors = [];

  const { row, col } = cell;

  if (row > 0 && !grid[row - 1][col].visited)
    neighbors.push({ cell: grid[row - 1][col], direction: "top" });

  if (col < grid[0].length - 1 && !grid[row][col + 1].visited)
    neighbors.push({ cell: grid[row][col + 1], direction: "right" });

  if (row < grid.length - 1 && !grid[row + 1][col].visited)
    neighbors.push({ cell: grid[row + 1][col], direction: "bottom" });

  if (col > 0 && !grid[row][col - 1].visited)
    neighbors.push({ cell: grid[row][col - 1], direction: "left" });

  return neighbors;
}

function removeWalls(current: Cell, next: Cell, direction: string) {
  switch (direction) {
    case "top":
      current.top = false;
      next.bottom = false;
      break;

    case "right":
      current.right = false;
      next.left = false;
      break;

    case "bottom":
      current.bottom = false;
      next.top = false;
      break;

    case "left":
      current.left = false;
      next.right = false;
      break;
  }
}

export function generateMaze(rows: number, cols: number) {
  const grid = createGrid(rows, cols);

  const stack: Cell[] = [];

  let current = grid[0][0];

  current.visited = true;

  while (true) {
    const neighbors = getNeighbors(grid, current);

    if (neighbors.length > 0) {
      const random =
        neighbors[Math.floor(Math.random() * neighbors.length)];

      stack.push(current);

      removeWalls(current, random.cell, random.direction);

      current = random.cell;

      current.visited = true;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    } else {
      break;
    }
  }

  return grid;
}