import React, { useState, useEffect } from 'react';
import { Position, Word } from '../types';

interface GridProps {
  grid: string[][];
  words: Word[];
  onWordFound: (word: Word) => void;
  isPaused: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, words, onWordFound, isPaused }) => {
  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);

  const handleMouseDown = (row: number, col: number) => {
    if (isPaused) return;
    setSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!selecting || isPaused) return;
    setSelectedCells([...selectedCells, { row, col }]);
  };

  const handleMouseUp = () => {
    if (isPaused) return;
    setSelecting(false);
    checkWord();
  };

  const checkWord = () => {
    if (selectedCells.length < 2) return;
    
    const selectedWord = selectedCells
      .map(pos => grid[pos.row][pos.col])
      .join('');

    const foundWord = words.find(word => {
      const wordStart = word.start;
      const wordEnd = word.end;
      const selectedStart = selectedCells[0];
      const selectedEnd = selectedCells[selectedCells.length - 1];

      return (
        !word.found &&
        ((wordStart.row === selectedStart.row && wordStart.col === selectedStart.col &&
          wordEnd.row === selectedEnd.row && wordEnd.col === selectedEnd.col) ||
         (wordStart.row === selectedEnd.row && wordStart.col === selectedEnd.col &&
          wordEnd.row === selectedStart.row && wordEnd.col === selectedStart.col))
      );
    });

    if (foundWord) {
      onWordFound(foundWord);
    }

    setSelectedCells([]);
  };

  return (
    <div 
      className="grid gap-1"
      style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
        userSelect: 'none'
      }}
      onMouseLeave={() => setSelecting(false)}
    >
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const isSelected = selectedCells.some(
            cell => cell.row === rowIndex && cell.col === colIndex
          );
          const isFound = words.some(
            word => word.found && (
              (word.start.row === rowIndex && word.start.col === colIndex) ||
              (word.end.row === rowIndex && word.end.col === colIndex)
            )
          );

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-10 h-10 flex items-center justify-center rounded
                font-bold text-lg cursor-pointer
                ${isSelected ? 'bg-blue-500 text-white' : 'bg-white'}
                ${isFound ? 'bg-green-500 text-white' : ''}
                ${isPaused ? 'opacity-50' : ''}
                transition-colors duration-200
              `}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onMouseUp={handleMouseUp}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;