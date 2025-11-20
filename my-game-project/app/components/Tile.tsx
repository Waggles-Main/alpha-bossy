// app/components/Tile.tsx
import React from 'react';
import clsx from 'clsx';

// The props now include everything needed to render the tile and handle interaction.
interface TileProps {
  id: number;
  letter: string;
  points: number;
  isSelected: boolean;
  onClick: (id: number) => void;
}

const Tile: React.FC<TileProps> = ({ id, letter, points, isSelected, onClick }) => {
  const displayLetter = letter === 'Blank' ? '' : letter;
  const isQu = letter.toUpperCase() === 'QU';

  return (
    <div
      // When the tile is clicked, it calls the function passed down from the Grid.
      onClick={() => onClick(id)}
      // `clsx` is a handy utility for conditionally joining class names.
      // It makes reading and managing complex states much cleaner than template literals.
      className={clsx(
        "w-24 h-24 rounded-lg flex items-center justify-center font-bold border-2 cursor-pointer transition-all duration-150 ease-in-out relative",
        {
          // Default state
          'bg-gray-700 border-gray-500': !isSelected,
          // Selected state
          'bg-blue-500 border-blue-300 scale-105': isSelected,
          // Hover state (for unselected tiles)
          'hover:bg-gray-600 hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg': !isSelected,
        }
      )}
    >
      <span className={clsx('transition-transform text-white', {
        'text-3xl': isQu,
        'text-4xl': !isQu,
        'transform -translate-y-1': isSelected, // Slightly raise the letter when selected
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
    </div>
  );
};

export default Tile;
