import { create } from 'zustand';
import { getBlindConfig } from '../lib/mechanics/blinds';
import { Glyph } from '../types/Glyph';
import { generateShopItems } from '../lib/rng';
import { Upgrade } from '../types/Upgrade';
import { UPGRADES } from '../data/upgrades';
import { calculateHandScore } from '../lib/scoring';
import { TileData } from '../types/Tile';
import { createTileBag, shuffle, resolveBlankTiles } from '../lib/tileUtils';
import { Boss, BOSS_KEYS, BOSSES } from '../data/bosses';


// --- Zustand Store ---

export type GameStage =
  | 'SMALL_BLIND' | 'EVENT_1' | 'SHOP_1'
  | 'BIG_BLIND' | 'EVENT_2' | 'SHOP_2'
  | 'BOSS_BLIND' | 'SHOP_3';

export type { TileData };

export interface GameState {
  tileBag: TileData[];
  gridTiles: TileData[];
  selectedTileIds: number[];
  wordValidity: 'VALID' | 'INVALID' | 'UNKNOWN';
  resolvedWord: string | null;
  activeModal: 'BAG' | 'GAME_OVER' | 'ROUND_CLEARED' | 'OPTIONS' | 'VICTORY' | null;

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

  // Boss State
  currentBoss: Boss | null;
  encounteredBosses: string[];
  disabledGlyphIds: string[]; // For Crimson Heart
  forcedTileId: number | null; // For Cerulean Bell



  // Actions
  // App Flow
  appPhase: 'START_SCREEN' | 'MAIN_MENU' | 'GAME';
  isRunActive: boolean;

  // Actions
  // Actions
  goToMenu: () => void;
  startGame: () => void;
  resumeGame: () => void;
  goToStartScreen: () => void;

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
  // New Actions
  buyGlyph: (glyph: Glyph) => void;
  sellGlyph: (index: number) => void;
  moveGlyph: (fromIndex: number, toIndex: number) => void;
  generateShop: () => void;
  // Dev Actions
  addMoney: (amount: number) => void;
  beatRound: () => void;

  rerollCost: number;
  shopItems: Glyph[];
  inventory: Glyph[];

  // Upgrades
  ownedUpgrades: string[]; // IDs
  availableUpgrades: Upgrade[];
  hasPurchasedUpgradeThisRound: boolean;
  buyUpgrade: (upgrade: Upgrade) => void;
}

export const useGameStore = create<GameState>((set, get) => {
  return {
    // --- State ---
    appPhase: 'START_SCREEN', // Default, will be checked by Page
    isRunActive: false,
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

    rerollCost: 5,
    shopItems: [],
    inventory: [],

    ownedUpgrades: [],
    availableUpgrades: [],
    hasPurchasedUpgradeThisRound: false,

    currentBoss: null,
    encounteredBosses: [],
    disabledGlyphIds: [],
    forcedTileId: null,



    // --- Actions ---
    goToMenu: () => set({ appPhase: 'MAIN_MENU' }),
    startGame: () => {
      // Initialize game state AND switch phase
      get().initGame();
      set({ appPhase: 'GAME' });
    },
    resumeGame: () => set({ appPhase: 'GAME' }),
    goToStartScreen: () => set({ appPhase: 'START_SCREEN' }),

    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),

    initGame: () => {
      const fullBag = shuffle(createTileBag());
      const initialGrid = fullBag.slice(0, 16);
      const remainingBag = fullBag.slice(16);
      const blindConfig = getBlindConfig(1, 1); // Round 1, Blind 1 (Small)

      set({
        isRunActive: false, // Reset explicit run active flag on init (until startGame sets it true, or if called manually)
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
        // Upgrades Logic: Initial State
        money: 4,
        wordsRemaining: 5 + (get().ownedUpgrades?.includes('wordy') ? 1 : 0) + (get().ownedUpgrades?.includes('wordy_plus') ? 1 : 0),
        discardsRemaining: 3 + (get().ownedUpgrades?.includes('wasteful') ? 1 : 0) + (get().ownedUpgrades?.includes('wasteful_plus') ? 1 : 0),
        roundWords: [],
        activeModal: null,
        shopItems: [],
        inventory: [],
        rerollCost: Math.max(1, 5 - (get().ownedUpgrades?.includes('reroll') ? 2 : 0) - (get().ownedUpgrades?.includes('reroll_plus') ? 2 : 0)),
        ownedUpgrades: [],
        availableUpgrades: [],
        hasPurchasedUpgradeThisRound: false,
        currentBoss: null,
        encounteredBosses: [],
        disabledGlyphIds: [],
        forcedTileId: null,
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
      const { selectedTileIds, gridTiles, refillGrid, wordsRemaining, roundScore, targetScore, clearSelection, money, inventory } = get();

      if (selectedTileIds.length === 0 || wordsRemaining <= 0) {
        return;
      }

      const selectedTiles = selectedTileIds.map(id => gridTiles.find(t => t.id === id)).filter(Boolean) as TileData[];
      const validWord = await resolveBlankTiles(selectedTiles);

      if (validWord) {
        console.log(`'${validWord}' is a valid word!`);

        const { currentBoss, forcedTileId, tileBag } = get();

        // Cerulean Bell Check
        if (currentBoss?.id === 'cerulean_bell' && forcedTileId) {
          if (!selectedTileIds.includes(forcedTileId)) {
            // Check if tile is even in grid? It should be if forced.
            console.log("Must use forced tile!");
            // TODO: Add visual feedback or error? For now just return.
            // Ideally we shouldn't even let them submit, but for now:
            // Actually, verify tile exists in grid logic first.
            const forcedTileInGrid = gridTiles.find(t => t.id === forcedTileId);
            if (forcedTileInGrid) {
              return; // Fail silently or add toast later
            }
          }
        }

        const heldTiles = gridTiles.filter(t => !selectedTileIds.includes(t.id));

        // Calculate verbose level
        const verboseLevel = (get().ownedUpgrades.includes('verbose') ? 1 : 0) + (get().ownedUpgrades.includes('verbose_plus') ? 1 : 0);

        // Filter out disabled glyphs
        const activeInventory = inventory.filter(g => !get().disabledGlyphIds.includes(g.id));

        const result = calculateHandScore(selectedTiles, activeInventory, heldTiles, verboseLevel, currentBoss?.id || null);

        const newScore = roundScore + result.totalScore;
        const newWords = wordsRemaining - 1;
        const isWin = newScore >= targetScore;
        let newMoney = money + result.moneyEarned;

        // The Tooth Logic
        if (currentBoss?.id === 'the_tooth') {
          newMoney -= selectedTiles.length;
        }

        const newRoundWords = [...get().roundWords, { word: validWord, score: result.totalScore }];

        console.log("Scoring Breakdown:", result.breakdown);

        refillGrid(selectedTileIds);

        // Crimson Heart Logic (Post-Hand)
        let nextDisabledGlyphIds: string[] = [];
        if (currentBoss?.id === 'crimson_heart' && inventory.length > 0) {
          const randomGlyph = inventory[Math.floor(Math.random() * inventory.length)];
          nextDisabledGlyphIds = [randomGlyph.id];
          // Note: id might not be unique if multiple copies. ideally use instanceId or index.
          // But inventory is Glyph[], glyph has id.
          // Let's assume for now we disable ALL copies of that glyph type OR we need unique IDs.
          // Glyph interface has instanceId? Let's check Glyph.ts... Yes.
          if (randomGlyph.instanceId) {
            nextDisabledGlyphIds = [randomGlyph.instanceId];
          } else {
            // Fallback if no instanceId (shouldn't happen if properly initialized)
            // Just disable by ID (type) might be too harsh if they have 2.
          }
        }

        // Cerulean Bell Logic (Post-Refill)
        let nextForcedTileId = null;
        if (currentBoss?.id === 'cerulean_bell') {
          // Pick a random tile from the NEW grid
          // We need to access the updated grid. `refillGrid` updates state.
          // However, `refillGrid` is sync but `set` might batch? Zustand `set` is sync.
          // Let's get state again.
          const newGrid = get().gridTiles;
          // Filter out empty?
          const validTiles = newGrid.filter(t => t.type !== 'EMPTY');
          if (validTiles.length > 0) {
            const randomTile = validTiles[Math.floor(Math.random() * validTiles.length)];
            nextForcedTileId = randomTile.id;
          }
        }

        set({
          roundScore: newScore,
          wordsRemaining: newWords,
          roundWords: newRoundWords,
          money: newMoney,
          disabledGlyphIds: nextDisabledGlyphIds,
          forcedTileId: nextForcedTileId
        });

        if (isWin) {
          // Check for Victory (Round 8 Boss)
          if (get().currentRound === 8 && get().currentStage === 'BOSS_BLIND') {
            set({ activeModal: 'VICTORY' });
          } else {
            set({ activeModal: 'ROUND_CLEARED' });
          }
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
          wordsRemaining: 5 + (get().ownedUpgrades?.includes('wordy') ? 1 : 0) + (get().ownedUpgrades?.includes('wordy_plus') ? 1 : 0), // Reset to 5 + upgrades
          discardsRemaining: 3 + (get().ownedUpgrades?.includes('wasteful') ? 1 : 0) + (get().ownedUpgrades?.includes('wasteful_plus') ? 1 : 0) // Reset to 3 + upgrades
          // Do NOT reset hasPurchasedUpgradeThisRound here. It's carried over from SHOP_3.
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

          // Select Boss
          const { encounteredBosses } = get();
          const allPotentialBosses = BOSS_KEYS.filter(key => BOSSES[key].minAnte <= currentRound);

          let potentialBosses = allPotentialBosses.filter(key => !encounteredBosses.includes(key));
          if (potentialBosses.length === 0) {
            // Reset if all encountered (or just pick from all)
            potentialBosses = allPotentialBosses;
          }

          const bossKey = potentialBosses[Math.floor(Math.random() * potentialBosses.length)];
          const boss = BOSSES[bossKey];

          // Add to encountered
          set({ encounteredBosses: [...encounteredBosses, boss.id] });

          // Apply Boss Scalar Modifiers
          if (boss.id === 'the_wall') {
            newTargetScore = newTargetScore * 2; // "4x base" - normally Boss is 2x base. So 4x is 2 * 2x? 
            // Base Blind Config: Boss is 2x Base.
            // The Wall Effect: "4x base". So yes, 2 * BossScore.
          }
          if (boss.id === 'the_needle') {
            newTargetScore = config.baseScore; // "1x base"
          }

          set({ currentBoss: boss });
        }
        // Reset Boss if not Boss Blind
        if (nextStage !== 'BOSS_BLIND') {
          set({ currentBoss: null, disabledGlyphIds: [], forcedTileId: null });
        }

        set({
          currentStage: nextStage,
          currentReward: nextReward,
          targetScore: newTargetScore,
          roundScore: 0,
          roundWords: (nextStage.includes('BLIND')) ? [] : get().roundWords,
          activeModal: null,
          wordsRemaining: 5 + (get().ownedUpgrades?.includes('wordy') ? 1 : 0) + (get().ownedUpgrades?.includes('wordy_plus') ? 1 : 0), // Base
          discardsRemaining: 3 + (get().ownedUpgrades?.includes('wasteful') ? 1 : 0) + (get().ownedUpgrades?.includes('wasteful_plus') ? 1 : 0), // Base
          rerollCost: Math.max(1, 5 - (get().ownedUpgrades?.includes('reroll') ? 2 : 0) - (get().ownedUpgrades?.includes('reroll_plus') ? 2 : 0)),
          hasPurchasedUpgradeThisRound: nextStage === 'SHOP_3' ? false : get().hasPurchasedUpgradeThisRound
        });

        // Apply Boss Start Effects
        if (nextStage === 'BOSS_BLIND') {
          const { currentBoss } = get();
          if (currentBoss?.id === 'the_water') {
            set({ discardsRemaining: 0 });
          }
          if (currentBoss?.id === 'the_manacle') {
            set(state => ({ wordsRemaining: state.wordsRemaining - 1 }));
          }
          if (currentBoss?.id === 'the_needle') {
            set({ wordsRemaining: 1 });
          }
          if (currentBoss?.id === 'cerulean_bell') {
            // Force initial tile
            const { gridTiles } = get();
            const validTiles = gridTiles.filter(t => t.type !== 'EMPTY');
            if (validTiles.length > 0) {
              set({ forcedTileId: validTiles[Math.floor(Math.random() * validTiles.length)].id });
            }
          }
          if (currentBoss?.id === 'crimson_heart') {
            // Disable initial glyph
            const { inventory } = get();
            if (inventory.length > 0) {
              // Try to find one with instanceId, else first
              const target = inventory[0];
              set({ disabledGlyphIds: [target.instanceId || target.id] });
            }
          }
        }

        if (nextStage.includes('SHOP')) {
          get().generateShop();
        }
      }
    },

    rerollShop: () => {
      const { money, rerollCost, inventory, ownedUpgrades } = get();
      if (money >= rerollCost) {
        // Only refresh Glyphs (Shop Items)
        const shopSize = 2 + (ownedUpgrades.includes('overstock') ? 1 : 0) + (ownedUpgrades.includes('overstock_plus') ? 1 : 0);
        const newItems = generateShopItems(shopSize, inventory);

        set({
          money: money - rerollCost,
          rerollCost: rerollCost + 2,
          shopItems: newItems
          // availableUpgrades is preserved
        });
      }
    },

    generateShop: () => {
      const { inventory, ownedUpgrades } = get();
      // Overstock: Base 2 + 1 (Overstock) + 1 (Plus)
      const shopSize = 2 + (ownedUpgrades.includes('overstock') ? 1 : 0) + (ownedUpgrades.includes('overstock_plus') ? 1 : 0);
      const newItems = generateShopItems(shopSize, inventory); // Pass inventory to exclude owned

      // Generate Upgrades available for this shop
      const potentialUpgrades = Object.values(UPGRADES).filter(u => {
        // 1. Must not be already owned
        if (ownedUpgrades.includes(u.id)) return false;

        // 2. If dependent, must own base upgrade
        if (u.type === 'DEPENDENT' && u.baseUpgradeId) {
          return ownedUpgrades.includes(u.baseUpgradeId);
        }

        return true;
      });

      // Select 1 random upgrade if any available
      let selectedUpgrades: Upgrade[] = [];
      if (potentialUpgrades.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialUpgrades.length);
        selectedUpgrades = [potentialUpgrades[randomIndex]];
      }

      set({
        shopItems: newItems,
        availableUpgrades: selectedUpgrades
      });
    },

    buyGlyph: (glyph: Glyph) => {
      const { money, inventory, shopItems, ownedUpgrades } = get();
      const cost = glyph.baseCost || 0; // Or calculate dynamic cost

      const glyphLimit = 5 + (ownedUpgrades.includes('glyph_slot') ? 1 : 0) + (ownedUpgrades.includes('glyph_slot_plus') ? 1 : 0);

      if (money >= cost && inventory.length < glyphLimit) {
        set({
          money: money - cost,
          inventory: [...inventory, glyph],
          shopItems: shopItems.filter(item => item !== glyph) // Remove bought item
        });
      }
    },

    sellGlyph: (index: number) => {
      const { inventory, money } = get();
      const glyph = inventory[index];
      if (!glyph) return;

      const newInventory = [...inventory];
      newInventory.splice(index, 1);

      set({
        inventory: newInventory,
        money: money + glyph.sellValue
      });
    },

    moveGlyph: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const newInventory = [...state.inventory];
        const [movedGlyph] = newInventory.splice(fromIndex, 1);
        newInventory.splice(toIndex, 0, movedGlyph);
        return { inventory: newInventory };
      });
    },

    buyUpgrade: (upgrade: Upgrade) => {
      const { money, ownedUpgrades, hasPurchasedUpgradeThisRound } = get();
      if (money >= upgrade.cost && !ownedUpgrades.includes(upgrade.id) && !hasPurchasedUpgradeThisRound) {
        set({
          money: money - upgrade.cost,
          ownedUpgrades: [...ownedUpgrades, upgrade.id],
          hasPurchasedUpgradeThisRound: true
        });
        // Apply immediate effects if any
        // Wasteful (Discards)
        if (upgrade.id === 'wasteful' || upgrade.id === 'wasteful_plus') {
          set((state) => ({ discardsRemaining: state.discardsRemaining + 1 }));
        }

        // Wordy (Hands/Words)
        if (upgrade.id === 'wordy' || upgrade.id === 'wordy_plus') {
          set((state) => ({ wordsRemaining: state.wordsRemaining + 1 }));
        }

        // Reroll (Cost reduction immediate?)
        // If we buy reroll, current reroll cost should decrease immediately?
        // Current logic: rerollCost is state.
        if (upgrade.id === 'reroll' || upgrade.id === 'reroll_plus') {
          set((state) => ({ rerollCost: Math.max(1, state.rerollCost - 2) }));
        }

        if (upgrade.onBuy) {
          upgrade.onBuy(get());
        }
      }
    },

    addMoney: (amount: number) => {
      set((state) => ({ money: state.money + amount }));
    },

    beatRound: () => {
      const { targetScore } = get();
      set({ roundScore: targetScore, activeModal: 'ROUND_CLEARED' });
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
