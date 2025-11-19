# Detailed Feedback: Project Phases

## Phase 1: The Mechanics Prototype (The "Toy")
**Goal:** A player can select tiles, validate a word, and see a score calculation. No shop, no levels, just the board.

### Project Setup
* Initialize Next.js with TypeScript and Tailwind CSS.
* Set up Zustand store structure (`/store/useGameStore.ts`).
* **Task:** Create the Dictionary Utility (`/lib/dictionary.ts`). Load the word list into a JS `Set` for instant validation.

### The Grid & Tile Components
* **Task:** Create `<Tile />` component (visuals only).
* **Task:** Create `<Grid />` component (renders 4x4 grid).
* **Logic:** Implement the "Selection" logic.
    * *Input:* Click/Drag across adjacent tiles (Boggle style).
    * *Validation:* Ensure selected tiles are neighbors.

### Word Validation & Basic Scoring
* **Task:** Create `handleWordSubmit()` function.
* **Logic:** Check `dictionary.has(word)`.
* **Math:** Implement basic Poker Hand logic (Length of word = Hand Type).
    * *Example:* 3 letters = "Three of a Kind" equivalent; 5 letters = "Flush" equivalent.
* **UI:** Display "Base Score + Mult" in a `ScoreDisplay` component.

---

## Phase 2: The Game Loop (Structure)
**Goal:** A player can play a Round, beat a Score Target (Blind), and advance to the next Round.



### The Round Manager
* **Store Update:** Add `round`, `ante`, `handsRemaining`, `discardsRemaining` to Zustand.
* **Task:** Implement `evaluatePlay()`.
    * Subtract 1 from `handsRemaining`.
    * Add score to `currentRoundScore`.
* **Task:** Implement `evaluateDiscard()`.
    * Clear selected tiles, refill grid from "Deck", subtract 1 from `discardsRemaining`.

### Win/Loss Conditions
* **Logic:** Check `currentRoundScore >= targetScore`.
* **UI:** Create `<GameEndModal />` (Victory/Defeat screens).
* **Flow:** logic for `nextRound()` (Resets hands/discards, increases target score).

### The Blind System
* **Task:** Create `lib/mechanics/blinds.ts`.
* **Logic:** Define the scaling curve.
    * `Target = Base * (GrowthFactor)^Ante`

---

## Phase 3: The Modifier System (The Hardest Part)
**Goal:** "Character Glyphs" (Jokers) actually affect the math.

### The Joker/Glyph Architecture
* **Concept:** This replaces `card_character.lua`.
* **Task:** Create `types/Glyph.ts`.

```typescript
type TriggerType = 'onScore' | 'onDiscard' | 'onSelect';

interface Glyph {
  id: string;
  description: string;
  trigger: TriggerType;
  calculate: (context: GameState) => number; // Returns modifier
}