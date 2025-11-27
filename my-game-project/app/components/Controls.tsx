'use client';

const Controls = () => {
  const handleClear = () => {
    // aDD CLEAR LOGIC HERE
    console.log('Clear button clicked');
  };

  const handlePlay = () => {
    // ADD PLAY LOGIC HERE
    console.log('Play button clicked');
  };

  return (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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
        onClick={handlePlay}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Play
      </button>
    </div>
  );
};

export default Controls;
