'use client';

import React, { useEffect } from 'react';
// @ts-ignore
import { useGameStore, TileData, getWordLengthMultiplier } from '../store/useGameStore';
import { clsx } from 'clsx';

const ScoreDisplay = () => {
  // Directly selecting state to ensure reactivity
  const gridTiles = useGameStore((state) => state.gridTiles);
  const selectedTileIds = useGameStore((state) => state.selectedTileIds);
  const toggleTile = useGameStore((state) => state.toggleTile);
  const wordValidity = useGameStore((state) => state.wordValidity);
  const validateCurrentWord = useGameStore((state) => state.validateCurrentWord);

  const roundScore = useGameStore((state) => state.roundScore);
  const targetScore = useGameStore((state) => state.targetScore);
  const currentRound = useGameStore((state) => state.currentRound);
  const currentStage = useGameStore((state) => state.currentStage);
  const wordsRemaining = useGameStore((state) => state.wordsRemaining);
  const discardsRemaining = useGameStore((state) => state.discardsRemaining);
  const money = useGameStore((state) => state.money);

  useEffect(() => {
    const handler = setTimeout(() => {
      validateCurrentWord();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedTileIds, validateCurrentWord]);


  const selectedTiles = selectedTileIds
    .map(id => gridTiles.find(tile => tile.id === id))
    .filter((tile): tile is TileData => tile !== undefined);

  // --- Scoring Logic (Preview) ---
  // Must match useGameStore.ts submitWord logic
  const currentBasePoints = selectedTiles.reduce((total, tile) => total + tile.points, 0);
  const wordLength = selectedTiles.length;
  // Simple Mult for now: Length of word
  const currentMult = getWordLengthMultiplier(wordLength);
  const previewScore = currentBasePoints * currentMult;


  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">

      {/* HUD / Stats Bar */}
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700 text-white">

        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-400">Round Score</span>
          <div className="text-3xl font-mono font-bold">
            <span className="text-white">{roundScore}</span>
            <span className="text-gray-500"> / {targetScore}</span>
          </div>
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-400/80">Round</div>
            <div className="text-2xl font-bold text-orange-400">{currentRound}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400/80">Stage</div>
            <div className="text-lg font-bold text-blue-400 truncate max-w-[120px]" title={currentStage}>
              {currentStage.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="flex gap-8 text-right">
          <div className="flex flex-col text-center">
            <span className="text-xs uppercase tracking-widest text-blue-500">Words</span>
            <span className="text-2xl font-bold text-blue-500">{wordsRemaining}</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xs uppercase tracking-widest text-red-500">Discards</span>
            <span className="text-2xl font-bold text-red-500">{discardsRemaining}</span>
          </div>
        </div>
        <div className="flex flex-col text-center pl-4 border-l border-gray-700">
          <span className="text-xs uppercase tracking-widest text-amber-500">$</span>
          <span className="text-2xl font-bold text-amber-500">${money}</span>
        </div>
      </div>

      {/* Word Construction & Preview Area */}
      <div className="p-4 bg-gray-800 text-white rounded-lg shadow-inner w-full text-center">

        {/* Word Validity Indicator */}
        <div className="h-6 mb-2">
          {wordValidity !== 'UNKNOWN' && (
            <span className={clsx("font-bold text-lg", {
              'text-green-400': wordValidity === 'VALID',
              'text-red-400': wordValidity === 'INVALID',
            })}>
              {wordValidity}
            </span>
          )}
        </div>

        {/* Selected Tiles */}
        <div className="flex justify-center items-center space-x-1 min-h-[48px] mb-4">
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
            <p className="text-gray-500 italic">Select tiles...</p>
          )}
        </div>

        {/* Hand Score Preview */}
        {selectedTiles.length > 0 && (
          <div className="border-t border-gray-700 pt-3 flex justify-center items-center gap-2">
            <span className="text-blue-400 font-bold text-2xl">{currentBasePoints}</span>
            <span className="text-gray-500">x</span>
            <span className="text-red-400 font-bold text-2xl">{currentMult}</span>
            <span className="text-gray-500">=</span>
            <span className="text-white font-bold text-3xl">{previewScore}</span>
          </div>
        )}
      </div>
    </div >
  );
};

export default ScoreDisplay;
