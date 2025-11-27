'use client';

import { useGameStore } from "../store/useGameStore";

const Controls = () => {
  const clearSelection = useGameStore((state) => state.clearSelection);
  const submitWord = useGameStore((state) => state.submitWord);

  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={clearSelection}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Clear
      </button>
      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        Options
      </button>
      <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
        Bag
      </button>
      <button
        onClick={submitWord}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Play
      </button>
    </div>
  );
};

export default Controls;
