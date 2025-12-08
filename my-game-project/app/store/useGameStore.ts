import { create } from 'zustand';
import { isValidWord } from '../../lib/dictionary';
// @ts-ignore
import { getBlindConfig } from '../../lib/mechanics/blinds';

export const getWordLengthMultiplier = (length: number): number => {
  if (length <= 5) return 1;
  const multipliers: { [key: number]: number } = {
    6: 2, 7: 3, 8: 5, 9: 8, 10: 13,
    11: 21, 12: 34, 13: 55, 14: 89,
    15: 144, 16: 233
  };
  return multipliers[length] || 1;
};

// --- Data Structures ---

export interface TileBlueprint {
  letter: string;
  points: number;
}

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

async function resolveBlankTiles(tiles: TileData[]): Promise<string | null> {
  const blankIndices = tiles.map((t, i) => t.letter === 'Blank' ? i : -1).filter(i => i !== -1);

  if (blankIndices.length === 0) {
    const word = tiles.map(t => t.letter).join('');
    return await isValidWord(word) ? word : null;
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const wordTemplate = tiles.map(t => t.letter);

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
        return result;
      }
    }

    template[currentBlankIndex] = 'Blank';
    return null;
  }

  return await findFirstValid(wordTemplate, 0);
}

export type GameStage =
  | 'SMALL_BLIND' | 'EVENT_1' | 'SHOP_1'
  | 'BIG_BLIND' | 'EVENT_2' | 'SHOP_2'
  | 'BOSS_BLIND' | 'SHOP_3';

interface GameState {
  tileBag: TileData[];
  gridTiles: TileData[];
  selectedTileIds: number[];
  wordValidity: 'VALID' | 'INVALID' | 'UNKNOWN';
  resolvedWord: string | null;
  activeModal: 'BAG' | 'GAME_OVER' | 'ROUND_CLEARED' | null;

  // Phase 2 + Core Loop State
  currentRound: number; // Was 'ante'
  currentStage: GameStage;

  roundScore: number;
  targetScore: number;
  wordsRemaining: number;
  discardsRemaining: number;

  money: number;
  currentReward: number;
  roundWords: { word: string, score: number }[];

  // Actions
  initGame: () => void;
  refillGrid: (usedTileIds: number[]) => void;
  toggleTile: (tileId: number) => void;
  clearSelection: () => void;
  submitWord: () => Promise<void>;
  discardSelection: () => void;
  validateCurrentWord: () => Promise<void>;
  openModal: (modal: GameState['activeModal']) => void;
  closeModal: () => void;
  advanceStage: () => void;
  rerollShop: () => void;
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

    currentRound: 1,
    currentStage: 'SMALL_BLIND',
    roundScore: 0,
    targetScore: 20,
    currentReward: 3,
    money: 0,
    roundWords: [],
    wordsRemaining: 4,
    discardsRemaining: 3,

    // --- Actions ---
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),

    initGame: () => {
      const fullBag = shuffle(createTileBag());
      const initialGrid = fullBag.slice(0, 16);
      const remainingBag = fullBag.slice(16);
      const blindConfig = getBlindConfig(1, 1); // Round 1, Blind 1 (Small)

      set({
        gridTiles: initialGrid,
        tileBag: remainingBag,
        selectedTileIds: [],
        wordValidity: 'UNKNOWN',
        resolvedWord: null,
        currentRound: 1,
        currentStage: 'SMALL_BLIND',
        roundScore: 0,
        targetScore: blindConfig.targetScore,
        currentReward: blindConfig.reward,
        money: 4,
        wordsRemaining: 5,
        discardsRemaining: 3,
        roundWords: [],
        activeModal: null
      });
    },

    refillGrid: (usedTileIds: number[]) => {
      set((state) => {
        const newTilesFromBag = state.tileBag.slice(0, usedTileIds.length);
        const remainingBag = state.tileBag.slice(usedTileIds.length);

        const newGridTiles = [...state.gridTiles];

        usedTileIds.forEach(id => {
          const gridIndex = newGridTiles.findIndex(t => t.id === id);
          if (gridIndex === -1) return;

          const newTile = newTilesFromBag.shift();

          if (newTile) {
            newGridTiles[gridIndex] = { ...newTile, id: id };
          } else {
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
        const tile = state.gridTiles.find(t => t.id === tileId);
        if (tile?.type === 'EMPTY') {
          return {};
        }

        const selectedIds = new Set(state.selectedTileIds);
        if (selectedIds.has(tileId)) {
          selectedIds.delete(tileId);
        } else {
          selectedIds.add(tileId);
        }
        return { selectedTileIds: Array.from(selectedIds), wordValidity: 'UNKNOWN', resolvedWord: null };
      });
    },

    clearSelection: () => {
      set({ selectedTileIds: [], wordValidity: 'UNKNOWN', resolvedWord: null });
    },

    discardSelection: () => {
      const { discardsRemaining, selectedTileIds, refillGrid, clearSelection } = get();
      if (discardsRemaining > 0 && selectedTileIds.length > 0) {
        refillGrid(selectedTileIds);
        set({ discardsRemaining: discardsRemaining - 1 });
        clearSelection();
      }
    },

    submitWord: async () => {
      const { selectedTileIds, gridTiles, refillGrid, wordsRemaining, roundScore, targetScore, clearSelection } = get();

      if (selectedTileIds.length === 0 || wordsRemaining <= 0) {
        return;
      }

      const selectedTiles = selectedTileIds.map(id => gridTiles.find(t => t.id === id)).filter(Boolean) as TileData[];
      const validWord = await resolveBlankTiles(selectedTiles);

      if (validWord) {
        console.log(`'${validWord}' is a valid word!`);

        const basePoints = selectedTiles.reduce((sum, t) => sum + t.points, 0);
        const wordLength = selectedTiles.length;
        const lengthMultiplier = getWordLengthMultiplier(wordLength);
        const handScore = basePoints * lengthMultiplier;

        const newScore = roundScore + handScore;
        const newWords = wordsRemaining - 1;
        const isWin = newScore >= targetScore;

        const newRoundWords = [...get().roundWords, { word: validWord, score: handScore }];

        refillGrid(selectedTileIds);

        set({
          roundScore: newScore,
          wordsRemaining: newWords,
          roundWords: newRoundWords
        });

        if (isWin) {
          set({ activeModal: 'ROUND_CLEARED' });
        } else if (newWords <= 0) {
          set({ activeModal: 'GAME_OVER' });
        }

      } else {
        const attemptedWord = selectedTiles.map(t => t.letter).join('');
        console.log(`'${attemptedWord}' is not a valid word.`);
      }

      clearSelection();
    },

    advanceStage: () => {
      const { currentStage, currentRound, initGame, currentReward, money } = get();

      // Add reward to money when leaving a blind
      if (currentStage === 'SMALL_BLIND' || currentStage === 'BIG_BLIND' || currentStage === 'BOSS_BLIND') {
        const newMoney = money + currentReward;
        set({ money: newMoney });
      }

      if (currentStage === 'SHOP_3') {
        const nextRound = currentRound + 1;
        if (nextRound > 8) {
          initGame();
          return;
        }
        set({
          currentRound: nextRound,
          currentStage: 'SMALL_BLIND',
          currentReward: 3,
          roundScore: 0,
          roundWords: [],
          activeModal: null,
          wordsRemaining: 5, // Reset to 5
          discardsRemaining: 3 // Reset to 3
        });
      } else {
        const stages: GameStage[] = [
          'SMALL_BLIND', 'EVENT_1', 'SHOP_1',
          'BIG_BLIND', 'EVENT_2', 'SHOP_2',
          'BOSS_BLIND', 'SHOP_3'
        ];
        const currentIndex = stages.indexOf(currentStage);
        const nextStage = stages[currentIndex + 1];

        // Determine next reward
        let nextReward = 0;
        if (nextStage === 'SMALL_BLIND') nextReward = 3;
        else if (nextStage === 'BIG_BLIND') nextReward = 4;
        else if (nextStage === 'BOSS_BLIND') nextReward = 5;

        // Determine next target score if entering a blind
        let newTargetScore = get().targetScore;

        if (nextStage === 'SMALL_BLIND') {
          const config = getBlindConfig(currentRound, 1);
          newTargetScore = config.targetScore;
        } else if (nextStage === 'BIG_BLIND') {
          const config = getBlindConfig(currentRound, 2);
          newTargetScore = config.targetScore;
        } else if (nextStage === 'BOSS_BLIND') {
          const config = getBlindConfig(currentRound, 3);
          newTargetScore = config.targetScore;
        }

        set({
          currentStage: nextStage,
          currentReward: nextReward,
          targetScore: newTargetScore,
          roundScore: 0,
          roundWords: (nextStage.includes('BLIND')) ? [] : get().roundWords,
          activeModal: null,
          wordsRemaining: 5, // Reset to 5 every stage
          discardsRemaining: 3 // Reset to 3 every stage
        });
      }
    },

    rerollShop: () => {
      const { money } = get();
      if (money >= 5) {
        set({ money: money - 5 });
        // Logic to refresh shop items would go here
      }
    },

    validateCurrentWord: async () => {
      const { selectedTileIds, gridTiles } = get();

      if (selectedTileIds.length < 2) {
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

useGameStore.getState().initGame();
