// app/components/Tile.tsx
import React from 'react';
import clsx from 'clsx';
import { TileData } from '../store/useGameStore';

interface TileProps {
  tile: TileData;
  isSelected: boolean;
  isForced?: boolean;
  onClick: (id: number) => void;
}

const Tile: React.FC<TileProps> = ({ tile, isSelected, isForced, onClick }) => {
  const { id, letter, points, type } = tile;

  const displayLetter = letter === 'Blank' ? '' : letter;
  const isQu = letter.toUpperCase() === 'QU';
  const isEmpty = type === 'EMPTY';

  return (
    <div
      onClick={() => onClick(id)}
      className={clsx(
        "w-24 h-24 rounded-lg flex items-center justify-center font-bold border-2 transition-all duration-150 ease-in-out relative",
        {
          // Empty/disabled state
          'bg-gray-800 border-gray-900 cursor-not-allowed': isEmpty,

          // Default state
          'bg-gray-700 border-gray-500 cursor-pointer': !isSelected && !isEmpty && !isForced,
          'hover:bg-gray-600 hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg': !isSelected && !isEmpty,

          // Forced State (Cerulean Bell)
          'bg-gray-700 border-cerulean-500 shadow-[0_0_15px_rgba(14,165,233,0.6)] animate-pulse': isForced && !isSelected,
          'bg-blue-600 border-cerulean-300 shadow-[0_0_20px_rgba(14,165,233,0.9)] scale-105': isForced && isSelected,

          // Selected state
          'bg-blue-500 border-blue-300 scale-105 cursor-pointer': isSelected && !isEmpty && !isForced,
        }
      )}
    >
      {!isEmpty && (
        <>
          <span className={clsx('transition-transform text-white', {
            'text-3xl': isQu,
            'text-4xl': !isQu,
            'transform -translate-y-1': isSelected,
          })}>
            {displayLetter}
          </span>

          {points > 0 && (
            <span className={clsx("absolute bottom-1 right-2 text-lg font-medium text-point-blue transition-transform", {
              'transform -translate-y-1': isSelected,
            })}>
              {points}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Tile;
