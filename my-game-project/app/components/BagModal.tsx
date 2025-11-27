// app/components/BagModal.tsx
'use client';

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import Modal from './Modal';

const BagModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);
  const tileBag = useGameStore((state) => state.tileBag);

  // Create a frequency map of the letters in the bag
  const letterCounts = tileBag.reduce((acc, tile) => {
    acc[tile.letter] = (acc[tile.letter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedLetters = Object.keys(letterCounts).sort();

  return (
    <Modal
      isOpen={activeModal === 'BAG'}
      onClose={closeModal}
      title={`Tiles Remaining (${tileBag.length})`}
    >
      <div className="grid grid-cols-6 gap-4 pt-4">
        {sortedLetters.map(letter => {
          const tile = tileBag.find(t => t.letter === letter); // Find a sample tile for points
          if (!tile) return null;

          return (
            <div key={letter} className="flex items-center justify-center p-2 rounded-md bg-gray-700">
              <span className="font-bold text-xl text-white">{letter === 'Blank' ? '?' : letter}</span>
              <span className="font-semibold text-xs text-gray-400 ml-1">x{letterCounts[letter]}</span>
              <span className="absolute bottom-1 right-2 text-xs font-medium text-point-blue">{tile.points}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default BagModal;
