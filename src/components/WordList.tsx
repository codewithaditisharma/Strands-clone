import React from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <div className="flex flex-wrap gap-2 max-w-md mt-4">
      {words.map((word, index) => (
        <div
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-medium
            ${word.found ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {word.word}
        </div>
      ))}
    </div>
  );
};

export default WordList;