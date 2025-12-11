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
* **Math:** Implement basic math to calculate point total. E.g. CAT 'C=3 points, A=1 point, T=1 point 5 points total, no mults, and no mult mult bonus for word length.
* **UI:** Display "Base Points x Mult x Mult Mult" in a 'ScoreDisplay' component.


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
    * `Target = Base * Small Ante = 1x base	Big Ante = 1.5x base	Round Boss = 2x base

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
  calculate: (context: GameState) => number; // Returns modifier
}
```

---

## Phase 4: Roguelike Story (Placeholder)
**Goal:** Narrative events and progression.

* **Placeholder:** This section will detail the "Events" logic, random encounters, and storylets (Roguelike choices) that occur between blinds.
* **Features:**
    * Event Pool Management.
    * Choice UI (Narrative text + distinct options).
    * Persistent metaprogression (Unlocks). 
     
  