'use client'; // This component now uses client-side state, so we mark it as a client component.

import React from 'react';
import Tile from './Tile';
import { useGameStore } from '../store/useGameStore';

// This component's job is to arrange the tiles into a grid.
const Grid = () => {
  // THE FIX: We select each piece of state individually.
  // This prevents the component from re-rendering in a loop because the
  // selector now returns existing objects/values, not a new object every time.
  const gridTiles = useGameStore((state) => state.gridTiles);
  const selectedTileIds = useGameStore((state) => state.selectedTileIds);
  const toggleTile = useGameStore((state) => state.toggleTile);

  const selectedIdsSet = new Set(selectedTileIds);

  return (
    <div
      className="
        grid grid-cols-4 gap-4
        p-4 bg-gray-900 rounded-lg
      "
    >
      {/*
        Now we pass all the necessary data and functions down to each Tile.
        The Grid acts as a manager, telling each tile its state and what to do
        when it's interacted with.
      */}
      {gridTiles.map((tile) => (
        <Tile
          key={tile.id}
          id={tile.id}
          letter={tile.letter}
          points={tile.points}
          isSelected={selectedIdsSet.has(tile.id)}
          onClick={toggleTile}
        />
      ))}
    </div>
  );
};

export default Grid;
