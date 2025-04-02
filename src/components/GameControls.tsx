import React from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  timeRemaining: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  onPauseToggle,
  onRestart,
  timeRemaining,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md mb-4">
      <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
      <div className="flex gap-2">
        <button
          onClick={onPauseToggle}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
        <button
          onClick={onRestart}
          className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default GameControls;