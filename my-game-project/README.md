# Alpha Bossy

A roguelike word-building game inspired by Balatro, built with Next.js, Zustand, and Tailwind CSS.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Game Mechanics

*   **Core Loop:** 9 Stages per Round (Blinds -> Events -> Shops).
*   **Word Building:** Grid-based (Boggle-style) word construction.
*   **Scoring:** Base Points x Word Length Multiplier (Fibonacci sequence).
*   **Economy:** Earn money from Blinds, Interest, and leftover Hands. Spend in Shop on Rerolls/Items.
*   **Progression:** 8 Rounds of increasing difficulty.
