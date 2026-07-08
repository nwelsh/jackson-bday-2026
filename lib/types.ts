export interface Cell {
  row: number;
  col: number;

  visited: boolean;

  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Position {
  row: number;
  col: number;
}