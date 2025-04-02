export interface Position {
  row: number;
  col: number;
}

export interface Word {
  word: string;
  start: Position;
  end: Position;
  found: boolean;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  foundWords: Word[];
  totalWords: Word[];
}