import { generate } from 'random-words';
import { Word, Position } from '../types';

const GRID_SIZE = 10;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const generateGrid = (words: string[]): [string[][], Word[]] => {
  const grid = Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill('.')
  );
  
  const placedWords: Word[] = [];
  
  for (const word of words) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 100) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      
      if (canPlaceWord(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        placedWords.push({
          word,
          start: { row, col },
          end: { 
            row: row + direction[0] * (word.length - 1),
            col: col + direction[1] * (word.length - 1)
          },
          found: false
        });
        placed = true;
      }
      
      attempts++;
    }
  }

  // Fill remaining spaces with random letters
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '.') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return [grid, placedWords];
};

const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: number[]
): boolean => {
  if (
    row + direction[0] * (word.length - 1) < 0 ||
    row + direction[0] * (word.length - 1) >= GRID_SIZE ||
    col + direction[1] * (word.length - 1) < 0 ||
    col + direction[1] * (word.length - 1) >= GRID_SIZE
  ) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const currentRow = row + direction[0] * i;
    const currentCol = col + direction[1] * i;
    if (
      grid[currentRow][currentCol] !== '.' &&
      grid[currentRow][currentCol] !== word[i].toUpperCase()
    ) {
      return false;
    }
  }

  return true;
};

const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: number[]
): void => {
  for (let i = 0; i < word.length; i++) {
    const currentRow = row + direction[0] * i;
    const currentCol = col + direction[1] * i;
    grid[currentRow][currentCol] = word[i].toUpperCase();
  }
};

export const generateNewGame = (): [string[][], Word[]] => {
  const words = generate({ exactly: 8, minLength: 4, maxLength: 8 })
    .map(word => word.toUpperCase());
  return generateGrid(words);
};