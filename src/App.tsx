import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Grid from './components/Grid';
import GameControls from './components/GameControls';
import WordList from './components/WordList';
import ParticleBackground from './components/ParticleBackground';
import { generateNewGame } from './utils/gameLogic';
import { Word } from './types';

const GAME_DURATION = 180; // 3 minutes
const INITIAL_GRID_SIZE = 10;

function App() {
  const { width, height } = useWindowSize();
  const [grid, setGrid] = useState<string[][]>(
    Array(INITIAL_GRID_SIZE).fill(null).map(() => Array(INITIAL_GRID_SIZE).fill(''))
  );
  const [words, setWords] = useState<Word[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    let timer: number;
    if (!isPaused && timeRemaining > 0 && !gameOver) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining]);

  const startNewGame = () => {
    const [newGrid, newWords] = generateNewGame();
    setGrid(newGrid);
    setWords(newWords);
    setTimeRemaining(GAME_DURATION);
    setIsPaused(false);
    setGameOver(false);
    setShowConfetti(false);
  };

  const handleWordFound = (foundWord: Word) => {
    const updatedWords = words.map(word =>
      word.word === foundWord.word ? { ...word, found: true } : word
    );
    setWords(updatedWords);

    if (updatedWords.every(word => word.found)) {
      setShowConfetti(true);
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    setIsPaused(true);
  };

  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(!isPaused);
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="relative min-h-screen bg-gray-100/80 flex flex-col items-center justify-center p-4">
        {showConfetti && <Confetti width={width} height={height} recycle={false} />}
        
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Strands</h1>
          
          <GameControls
            isPaused={isPaused}
            onPauseToggle={togglePause}
            onRestart={startNewGame}
            timeRemaining={timeRemaining}
          />

          <Grid
            grid={grid}
            words={words}
            onWordFound={handleWordFound}
            isPaused={isPaused}
          />

          <WordList words={words} />

          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {words.every(word => word.found)
                    ? 'Congratulations!'
                    : 'Game Over!'}
                </h2>
                <p className="mb-4">
                  You found {words.filter(w => w.found).length} out of {words.length} words
                </p>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  New Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;