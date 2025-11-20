import { create } from 'zustand';

// --- Data Structures ---

// A tile's fundamental data, which doesn't change.
export interface TileBlueprint {
  letter: string;
  points: number;
}

// The actual tile instance on the grid, which has a unique ID.
// We need a unique ID to track which specific tile is selected.
export interface TileData extends TileBlueprint {
  id: number;
}

// --- Helper Functions ---

const createTileBag = (): TileBlueprint[] => {
  const distribution: { [letter: string]: { quantity: number; points: number } } = {
    'E': { quantity: 12, points: 1 }, 'A': { quantity: 9, points: 1 }, 
    'I': { quantity: 9, points: 1 }, 'O': { quantity: 8, points: 1 }, 
    'N': { quantity: 6, points: 1 }, 'R': { quantity: 6, points: 1 }, 
    'T': { quantity: 6, points: 1 }, 'L': { quantity: 4, points: 1 }, 
    'S': { quantity: 4, points: 1 }, 'U': { quantity: 4, points: 1 },
    'D': { quantity: 4, points: 2 }, 'G': { quantity: 3, points: 2 },
    'B': { quantity: 2, points: 3 }, 'C': { quantity: 2, points: 3 }, 
    'M': { quantity: 2, points: 3 }, 'P': { quantity: 2, points: 3 },
    'F': { quantity: 2, points: 4 }, 'H': { quantity: 2, points: 4 }, 
    'V': { quantity: 2, points: 4 }, 'W': { quantity: 2, points: 4 }, 
    'Y': { quantity: 2, points: 4 }, 'K': { quantity: 1, points: 5 },
    'J': { quantity: 1, points: 8 }, 'X': { quantity: 1, points: 8 },
    'Qu': { quantity: 1, points: 10 }, 'Z': { quantity: 1, points: 10 },
    'Blank': { quantity: 2, points: 0 },
  };

  const bag: TileBlueprint[] = [];
  for (const letter in distribution) {
    const { quantity, points } = distribution[letter];
    for (let i = 0; i < quantity; i++) {
      bag.push({ letter, points });
    }
  }
  return bag;
};

const shuffle = (array: TileBlueprint[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


// --- Zustand Store ---

interface GameState {
  tileBag: TileBlueprint[];
  gridTiles: TileData[];
  selectedTileIds: number[];
  drawTiles: () => void;
  toggleTile: (tileId: number) => void;
}

export const useGameStore = create<GameState>((set, get) => {
  const initialBag = createTileBag();

  return {
    // --- State ---
    tileBag: initialBag,
    gridTiles: [],
    selectedTileIds: [],

    // --- Actions ---
    drawTiles: () => {
      const shuffledBag = shuffle([...get().tileBag]);
      const newGridTiles = shuffledBag.slice(0, 16).map((tile, index) => ({
        ...tile,
        id: index, // Assign a simple ID based on position
      }));
      set({ gridTiles: newGridTiles, selectedTileIds: [] }); // Reset selection
    },

    toggleTile: (tileId: number) => {
      set((state) => {
        const selectedIds = new Set(state.selectedTileIds);
        if (selectedIds.has(tileId)) {
          selectedIds.delete(tileId);
        } else {
          selectedIds.add(tileId);
        }
        return { selectedTileIds: Array.from(selectedIds) };
      });
    },
  };
});

// Initialize the first set of tiles.
useGameStore.getState().drawTiles();
