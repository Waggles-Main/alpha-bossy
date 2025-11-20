# Game Design Document

## 1. Main Menu

### Play
* **New Run**
    * **Select Tile Deck:** Choose a starting deck (e.g., Red Deck, Blue Deck, Yellow Deck, Ghost Deck). Each deck has a unique modifier.
    * **Select Stake (Difficulty):** Choose difficulty level (e.g., White Stake, Red Stake... up to Gold Stake). Higher stakes introduce penalties like higher scores required, less money, or eternal Character Glyphs.
    * **Select Seed (Optional):** Input a specific alphanumeric seed to replay a generated run.
* **Continue:** Resumes a run in progress.
* **Challenges:** Select a pre-set challenge run with specific rules and deck restrictions (e.g., "The Omelette", "Rich get Richer").

### Other Menus
* **Collection:** View discovered Character Glyphs, Tarot Tiles, Planet Tiles, Spectral Tiles, Vouchers, and deck stats.
* **Options:** Settings for audio, graphics, game speed, and high contrast UI.
* **Profile:** Manage different save slots.

---

## 2. The Run (Macro Loop)

A standard run consists of **8 Antes**. Each Ante increases the difficulty (Target Score/Points).

* **Ante 1 through 8:** The goal is to defeat the Boss Blind of Ante 8.
* **Endless Mode:** If Ante 8 is cleared, the player can choose to end the run (Victory) or continue to Ante 9+ (Endless) to see how far they can score.

### The Ante Structure
Each Ante is divided into three Blinds and two Events:

1.  **Small Blind:** Lowest target score. (Reward: $3)
2.  **Event 1:** (Random minigame or event)
3.  **Shop**
4.  **Big Blind:** Medium target score. (Reward: $4)
5.  **Event 2:** (Random minigame or event)
6.  **Shop**
7.  **Boss Blind:** Highest target score + Unique Ability/Debuff. (Reward: $5)
8.  **Shop**
9.  **Next Ante**

---

## 3. The Blind Loop (Micro Loop)

Before entering a Small or Big Blind, the player makes a choice:

### Option A: Skip Blind
* **Benefit:** Immediately gain a specific **Tag bonus** (e.g., Free Shop Rerolls, Double Money, Spawn a specific Character Glyph, Level up a Word).
* **Cost:** You forfeit the cash reward for beating the blind and forfeit access to the Shop for that round.
* *Note:* Boss Blinds cannot be skipped naturally.

### Option B: Select Blind (Combat)
Enters the Boggle gameplay phase.

### Boggle Phase
**Goal:** Score enough Points to beat the Target Score before running out of Words.

1.  **Draw Tiles:** Player draws Tiles from their deck up to their Word Size limit (Default: 8).
2.  **Action Step:**
    * **Play Word:** Select up to 5 Tiles to play a Poker Word.
        * *Valid Words:* High Card, Pair, Two Pair, Three of a Kind, Straight, Flush, Full House, Four of a Kind, Straight Flush, Royal Flush.
        * *Secret Words:* Five of a Kind, Flush House, Flush Five (must be discovered or unlocked).
    * **Discard:** Select up to 5 Tiles to discard and redraw to fill Word Size. (Costs 1 Discard use).

### Scoring Calculation
* **Base Points:** Determined by the Tile Points or additional Tile point modifier.
* **Multipliers (Mult):** Determined by Character glyphs, Word Length, Tile modifiers, or other modifiers.
* **Character Glyph Triggers:** Character Glyphs activate based on conditions (e.g., "Played “A” tiles give +3 Mult when scored", "+30 Points for each remaining Word") adding flat Points, flat Mult, or X-Mult (Multiplicative Mult).
* **Card Modifications:** Glass, Steel, Gold, or Enhanced Tiles trigger their effects.

**Formula:**
> `(Base Points + Bonus Points) x (Base Mult + Bonus Mult) x (X-Mults)`

### Check Condition
* **Score >= Target:** Victory. Excess Words yield extra money ($1 per remaining Word). Move to Shop.
* **Score < Target AND Words > 0:** Repeat Action Step.
* **Score < Target AND Words == 0:** Game Over.

---

## 4. The Shop Loop

Accessible after defeating a Blind (unless the Blind was skipped).

* **Economy:** Spending earned cash ($) to upgrade the build.

### Shop Layout
* **2 Standard Slots:** Random Character Glyphs, Tarot, Planet, or Playing Tiles.
* **2 Booster Pack Slots:** Packs that contain a selection of Tiles to choose from.
* **1 Voucher Slot:** A permanent passive upgrade for the run.

### Items
* **Character Glyphs:** The core power source. Max 5 slots (default).
    * *Rarity:* Common / Uncommon / Rare / Legendary.
    * *Editions:* Foil (+Points), Holographic (+Mult), Polychrome (x1.5 Mult), Negative (+1 Character Glyph Slot).
* **Tarot Tiles:** Consumables used to modify the deck (e.g., turn a card into a Multiplier card, remove Tiles, change suits).
* **Planet Tiles:** Consumables that permanently level up a specific Poker Word (increasing its Base Points and Base Mult).
* **Spectral Tiles:** High risk/high reward modifiers (e.g., destroy random Tiles to create a Legendary Character Glyph).
* **Playing Tiles:** Standard Tiles to add to the deck (can have Enhancements, Seals, or Editions).
* **Vouchers:** Permanent buffs (e.g., +1 Word Size, Discounted Shop, Extra Character Glyph Slot).

### Actions
* **Buy:** Purchase item.
* **Reroll:** Spend money (starts at $5, increases per use by +$2) to refresh the items in the Standard Slots.
* **Next Round:** Leave shop and proceed to the next Blind.

---

## 5. Event

This stage triggers between Blinds.

**The Pool Constraint:** Events are drawn from a unique "Event Pool." Once an Event has been encountered in a run, it is removed from the pool and cannot occur again in that session.

### Event Types

**Minigames (Skill-Based)**
* *Wordle:* Guess a 5-letter word in 6 tries. (Reward: $, Character Glyphs, or other).
* *Word Scramble:* Player is given a 5-6 letter anagram. Player submits valid words formed from those letters until all target words are found. (Reward: $, Character Glyphs, or other).

**Narrative Decisions (Roguelite Choice)**
* *The Crossroads:* Choose between "Safe Path" (Gain $10) or "Risky Path" (Lose all Discards for next Ante, gain x2 Mult Joker).
* *The Alchemist:* Offer to destroy 2 random Character Glyphs to create 1 Legendary Character Glyph.
* *Tile Mutation:* Choose to permanently convert all O’s to A’s, or remove all X tiles.

### Outcomes
* **Success/Accept:** Player gains the specified reward and proceeds to the Next Blind Selection.
* **Failure/Decline:** Player proceeds to the Next Blind Selection, often with no reward or a slight penalty (e.g., lost time/money).

---

## 6. Game Over / Win States

* **Loss:** Failing to reach the required score in a Blind.
    * *Result:* "Game Over" screen, stats shown, seed revealed, unlock progress tallied.
* **Win:** Defeating the Boss Blind of Ante 8.
    * *Result:* "Victory" screen. Unlocks new difficulties (Stakes) or Decks. Option to return to menu or start Endless Mode.