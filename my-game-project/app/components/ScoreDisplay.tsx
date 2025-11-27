'use client';

import React from 'react';
import { useGameStore, TileData } from '../store/useGameStore';

const ScoreDisplay = () => {
  const gridTiles = useGameStore((state) => state.gridTiles);
  const selectedTileIds = useGameStore((state) => state.selectedTileIds);

  const selectedTiles = selectedTileIds
    .map(id => gridTiles.find(tile => tile.id === id))
    .filter((tile): tile is TileData => tile !== undefined);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-inner min-h-[60px]">
      <h2 className="text-lg font-bold mb-2">Current Word</h2>
      <div className="flex items-center space-x-1">
        {selectedTiles.length > 0 ? (
          selectedTiles.map(tile => (
            <div key={tile.id} className="flex justify-center items-center w-10 h-10 bg-blue-500 text-white font-bold text-xl rounded">
              {tile.letter}
            </div>
          ))
        ) : (
          <p className="text-gray-400">Select tiles to form a word...</p>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
