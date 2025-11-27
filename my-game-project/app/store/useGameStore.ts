import { create } from 'zustand';
import { isValidWord } from '../../lib/dictionary';

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
  type?: 'EMPTY';
}

// --- Helper Functions ---

const createTileBag = (): TileData[] => {
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

  const bag: TileData[] = [];
  let idCounter = 0;
  for (const letter in distribution) {
    const { quantity, points } = distribution[letter];
    for (let i = 0; i < quantity; i++) {
      bag.push({ letter, points, id: idCounter++ });
    }
  }
  return bag;
};

const shuffle = (array: TileData[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


// --- Zustand Store ---

// This helper function is our "Word Detective"
// It takes the selected tiles and finds the first valid word, solving for blanks.
async function resolveBlankTiles(tiles: TileData[]): Promise<string | null> {
  const blankIndices = tiles.map((t, i) => t.letter === 'Blank' ? i : -1).filter(i => i !== -1);

  // Case 1: No blanks, just a simple check
  if (blankIndices.length === 0) {
    const word = tiles.map(t => t.letter).join('');
    return await isValidWord(word) ? word : null;
  }

  // Case 2: Blanks exist, start the search
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const wordTemplate = tiles.map(t => t.letter);

  // This recursive function will try every letter for each blank
  async function findFirstValid(template: string[], blankIndexPosition: number): Promise<string | null> {
    if (blankIndexPosition >= blankIndices.length) {
      const finalWord = template.join('');
      return await isValidWord(finalWord) ? finalWord : null;
    }

    const currentBlankIndex = blankIndices[blankIndexPosition];
    for (const char of alphabet) {
      template[currentBlankIndex] = char;
      const result = await findFirstValid(template, blankIndexPosition + 1);
      if (result) {
        return result; // Found a valid word, so we stop searching and return it
      }
    }
    
    // Reset for next iteration if this path failed
    template[currentBlankIndex] = 'Blank';
    return null;
  }

  return await findFirstValid(wordTemplate, 0);
}


interface GameState {
  tileBag: TileData[];
  gridTiles: TileData[];
  selectedTileIds: number[];
  wordValidity: 'VALID' | 'INVALID' | 'UNKNOWN';
  resolvedWord: string | null; // To store the word found by the resolver
  activeModal: 'BAG' | null;
  initGame: () => void;
  refillGrid: (usedTileIds: number[]) => void;
  toggleTile: (tileId: number) => void;
  clearSelection: () => void;
  submitWord: () => Promise<void>;
  validateCurrentWord: () => Promise<void>;
  openModal: (modal: 'BAG') => void;
  closeModal: () => void;
}

export const useGameStore = create<GameState>((set, get) => {
  return {
    // --- State ---
    tileBag: [],
    gridTiles: [],
    selectedTileIds: [],
    wordValidity: 'UNKNOWN',
    resolvedWord: null,
    activeModal: null,

    // --- Actions ---
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),
    
    initGame: () => {
      const fullBag = shuffle(createTileBag());
      const initialGrid = fullBag.slice(0, 16);
      const remainingBag = fullBag.slice(16);

      set({ 
        gridTiles: initialGrid, 
        tileBag: remainingBag,
        selectedTileIds: [], 
        wordValidity: 'UNKNOWN',
        resolvedWord: null,
      });
    },

    refillGrid: (usedTileIds: number[]) => {
      set((state) => {
        const newTilesFromBag = state.tileBag.slice(0, usedTileIds.length);
        const remainingBag = state.tileBag.slice(usedTileIds.length);
    
        const newGridTiles = [...state.gridTiles]; // Create a mutable copy
    
        usedTileIds.forEach(id => {
          const gridIndex = newGridTiles.findIndex(t => t.id === id);
          if (gridIndex === -1) return; 
    
          const newTile = newTilesFromBag.shift(); 
    
          if (newTile) {
            // We have a tile from the bag, use it but keep the old ID for stability
            newGridTiles[gridIndex] = { ...newTile, id: id };
          } else {
            // The bag is empty, use a placeholder tile
            newGridTiles[gridIndex] = { id: id, letter: ' ', points: 0, type: 'EMPTY' };
          }
        });
    
        return {
          gridTiles: newGridTiles,
          tileBag: remainingBag,
        };
      });
    },

    toggleTile: (tileId: number) => {
      set((state) => {
        // Do not allow selecting empty tiles
        const tile = state.gridTiles.find(t => t.id === tileId);
        if (tile?.type === 'EMPTY') {
          return {}; // Return empty object to not change state
        }

        const selectedIds = new Set(state.selectedTileIds);
        if (selectedIds.has(tileId)) {
          selectedIds.delete(tileId);
        } else {
          selectedIds.add(tileId);
        }
        // Reset validity on change, the component will trigger a re-validation
        return { selectedTileIds: Array.from(selectedIds), wordValidity: 'UNKNOWN', resolvedWord: null };
      });
    },

    clearSelection: () => {
      set({ selectedTileIds: [], wordValidity: 'UNKNOWN', resolvedWord: null });
    },

    submitWord: async () => {
      const { selectedTileIds, gridTiles, refillGrid } = get();
      if (selectedTileIds.length === 0) {
        return;
      }
    
      const selectedTiles = selectedTileIds.map(id => gridTiles.find(t => t.id === id)).filter(Boolean) as TileData[];
      const validWord = await resolveBlankTiles(selectedTiles);
    
      if (validWord) {
        console.log(`'${validWord}' is a valid word!`);
        // TODO: Add scoring logic
        refillGrid(selectedTileIds);
      } else {
        const attemptedWord = selectedTiles.map(t => t.letter).join('');
        console.log(`'${attemptedWord}' is not a valid word.`);
        // TODO: Add penalty or feedback
      }
    
      get().clearSelection();
    },

    validateCurrentWord: async () => {
      const { selectedTileIds, gridTiles } = get();

      if (selectedTileIds.length < 3) {
        set({ wordValidity: 'UNKNOWN', resolvedWord: null });
        return;
      }
    
      const selectedTiles = selectedTileIds.map(id => gridTiles.find(t => t.id === id)).filter(Boolean) as TileData[];
      const validWord = await resolveBlankTiles(selectedTiles);
    
      set({ 
        wordValidity: validWord ? 'VALID' : 'INVALID',
        resolvedWord: validWord 
      });
    },
  };
});

// Initialize the first set of tiles.
useGameStore.getState().initGame();
