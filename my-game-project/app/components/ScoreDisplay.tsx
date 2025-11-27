'use client';

import React, { useEffect } from 'react';
import { useGameStore, TileData } from '../store/useGameStore';
import { clsx } from 'clsx';

const ScoreDisplay = () => {
  const gridTiles = useGameStore((state) => state.gridTiles);
  const selectedTileIds = useGameStore((state) => state.selectedTileIds);
  const toggleTile = useGameStore((state) => state.toggleTile);
  const wordValidity = useGameStore((state) => state.wordValidity);
  const validateCurrentWord = useGameStore((state) => state.validateCurrentWord);

  // This effect hook acts like a robot that watches 'selectedTileIds'.
  // When the selection changes, it waits 300ms (to prevent checking while the
  // user is still rapidly selecting) and then tells the store to validate the word.
  useEffect(() => {
    const handler = setTimeout(() => {
      validateCurrentWord();
    }, 300); // 300ms debounce

    // Cleanup function: if the user selects another tile before 300ms is up,
    // this cancels the previous timer and starts a new one.
    return () => {
      clearTimeout(handler);
    };
  }, [selectedTileIds, validateCurrentWord]);


  const selectedTiles = selectedTileIds
    .map(id => gridTiles.find(tile => tile.id === id))
    .filter((tile): tile is TileData => tile !== undefined);

  // --- Scoring Logic ---
  const currentScore = selectedTiles.reduce((total, tile) => total + tile.points, 0);
  const WORD_LENGTH_MULT_SCALING: { [key: number]: number } = {
    6: 2, 7: 3, 8: 5, 9: 8, 10: 13, 11: 21, 12: 34, 13: 55, 
    14: 89, 15: 144, 16: 233, 17: 377, 18: 610, 19: 987, 
    20: 1597, 21: 2584,
  };
  const wordLength = selectedTiles.length;
  const multMult = WORD_LENGTH_MULT_SCALING[wordLength] || 1;


  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-inner w-full max-w-md">
      {/* Word Validity Indicator */}
      <div className="h-6 mb-2 text-center">
        {wordValidity !== 'UNKNOWN' && (
          <span className={clsx("font-bold text-lg", {
            'text-green-400': wordValidity === 'VALID',
            'text-red-400': wordValidity === 'INVALID',
          })}>
            {wordValidity}
          </span>
        )}
      </div>

      {/* Current Word Display */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Current Word</h2>
        <div className="flex items-center space-x-1 min-h-[48px]">
          {selectedTiles.length > 0 ? (
            selectedTiles.map(tile => (
              <div 
                key={tile.id} 
                onClick={() => toggleTile(tile.id)}
                className="flex justify-center items-center w-10 h-10 bg-blue-500 text-white font-bold text-xl rounded cursor-pointer hover:bg-blue-600 transition-colors"
              >
                {tile.letter}
              </div>
            ))
          ) : (
            <p className="text-gray-400">Select tiles to form a word...</p>
          )}
        </div>
      </div>

      {/* Scoring Preview */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-lg font-bold mb-2">Score Preview</h3>
        <div className="flex items-center space-x-6">
          {/* Points Display */}
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-blue-400">{currentScore}</span>
            <span className="ml-2 text-lg text-gray-400">Points</span>
          </div>

          {/* Mult Mult Display (only shows if > 1) */}
          {multMult > 1 && (
            <>
              <span className="text-2xl text-gray-600">X</span>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-purple-400">{multMult}</span>
                <span className="ml-2 text-lg text-gray-400">Mult Mult</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
