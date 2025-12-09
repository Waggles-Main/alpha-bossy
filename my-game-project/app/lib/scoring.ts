import { TileData } from '../store/useGameStore';
import { Glyph, GlyphCalculationContext, ScoreModifier } from '../types/Glyph';

export interface ScoreResult {
    totalScore: number;
    basePoints: number; // Blue (Chips)
    baseMult: number;   // Red (Mult)
    totalXMult?: number; // Purple (X Mult) - Optional for backward compat if needed, but we'll set it.
    moneyEarned: number;
    breakdown: string[]; // Log of what happened for debug/UI
}

export const getWordLengthMultiplier = (length: number, offset: number = 0): number => {
    // Effective length shifts us up the table.
    // Length 5 with offset 1 (Verbose) -> Effective 6 -> x2 multiplier.
    const effectiveLength = length + offset;

    if (effectiveLength <= 5) return 1;
    const multipliers: { [key: number]: number } = {
        6: 2, 7: 3, 8: 5, 9: 8, 10: 13,
        11: 21, 12: 34, 13: 55, 14: 89,
        15: 144, 16: 233
    };
    return multipliers[effectiveLength] || (effectiveLength > 16 ? 233 : 1);
};

export const calculateHandScore = (
    playedTiles: TileData[],
    inventory: Glyph[],
    gridTiles: TileData[] = [], // Needed for Grid Phase
    verboseLevel: number = 0
): ScoreResult => {
    let points = 0;
    let mult = 0;
    let money = 0;
    const breakdown: string[] = [];

    // Context for Glyphs
    const context: GlyphCalculationContext = {
        playedTiles,
        gridTiles,
        inventory
    };

    // --- PHASE 1: PRE-SCORING ---
    // "Glyphs that have modifiers get triggered from left to right."
    inventory.filter(g => g.trigger === 'pre_score').forEach(glyph => {
        const mod = glyph.calculate(context);
        if (mod) {
            if (mod.points) { points += mod.points; breakdown.push(`${glyph.name}: +${mod.points} Points`); }
            if (mod.mult) { mult += mod.mult; breakdown.push(`${glyph.name}: +${mod.mult} Mult`); }
            if (mod.xMult) { /* Pre-score usually additive mult, but if xMult exists handle it? usually passive */ }
            if (mod.money) { money += mod.money; breakdown.push(`${glyph.name}: +$${mod.money}`); }
        }
    });

    // --- PHASE 2: PLAYED WORD SCORING ---
    // "Analyzed left to right"

    // A. Base Points from Tiles
    // B. Tile Editions (Foil/Holo/Poly)
    // C. Glyph Per-Card Effects
    // D. Gold Seal ($)

    // User: "Adding Base Points"
    // User: "Triggering Own Tile Effects" (Editions)
    // User: "Triggering Glyph Effects" (Per Card)

    // Note: Word Length Multiplier (Fibonacci) logic from existing code.
    // Existing code applied length multiplier to *Tile Points*.
    // User says: "Adding base points... then Multiplier effects".
    // Let's accumulate Tile Points first.

    let handBasePoints = 0; // Accumulated from tiles

    playedTiles.forEach(tile => {
        // 1. Tile Base Points
        let tilePoints = tile.points;
        handBasePoints += tilePoints;
        // breakdown.push(`Tile ${tile.letter}: +${tilePoints} Points`);

        // 2. Tile Editions (Foil, Holo, Poly)
        if (tile.edition === 'Foil') {
            points += 50;
            breakdown.push(`Foil ${tile.letter}: +50 Points`);
        }
        if (tile.edition === 'Holographic') {
            mult += 10;
            breakdown.push(`Holo ${tile.letter}: +10 Mult`);
        }
        // Polychrome is x1.5 xMult. We'll handle xMult logic accumulating later or immediately?
        // User: "Triggering... Poly (1.5 xMult)"
        // If we have a running Mult, xMult applies to it? 
        // Usually Balatro calculates: (Base Chips + Mod Chips) * (Base Mult + Mod Mult) * xMults...
        // We need a separate accumulator for xMult or apply it to 'mult' variable?
        // "analyzed left to right... adding the points, bonus effects, multiplier effects"
        // Implies xMult applies to the CURRENT Mult? Or total? 
        // Standard is Total. I'll maintain a list of xMults to apply at end of phase or strictly left-to-right?
        // "Triggering... Poly... triggered after main effect"
        // Let's treat xMult as a separate multiplier for the final calc.
    });

    // Add collected Hand Base Points to Global Points
    // BUT! We also need the Word Length Multiplier (Fibonacci).
    // Existing code: basePoints * lengthMultiplier.
    // Let's apply Length Multiplier to the Hand Base Points NOW?
    // (Removed duplicate lenMult logic that was here)

    points += handBasePoints;
    breakdown.push(`Base Tile Points: +${handBasePoints} Points`);

    // Iterating tiles AGAIN for Per-Card logic (Left to Right strict flow?)
    // User: "Tiles are Scored from Left to Right... The specific order is: Adding Base Points... Triggering Own... Triggering Glyph..."
    // So we should do it all in one loop.

    // Let's reset and do the loop properly.
    // Reset accumulated values for loop re-run?
    // Actually, `handBasePoints` is "Adding Base Points".
    // Let's rewrite the loop above to be the main loop.

    // RESTARTING VARS FOR LOOP
    points = 0; // Chips
    mult = 0;   // Base Mult (Red) - Accumulate from cards/glyphs

    // Default XMult is 1
    let totalXMult = 1;

    // Message for start
    // breakdown.push(`Start: Length ${playedTiles.length}`);

    playedTiles.forEach(tile => {
        // 1. Add Base Points
        points += tile.points;

        // 2. Tile Editions
        if (tile.edition === 'Foil') { points += 50; breakdown.push(`Foil: +50 Points`); }
        if (tile.edition === 'Holographic') { mult += 10; breakdown.push(`Holo: +10 Mult`); }
        if (tile.edition === 'Polychrome') { totalXMult *= 1.5; breakdown.push(`Poly: x1.5 Mult`); }

        // 3. Trigger Glyph Effects (Per Card)
        inventory.filter(g => g.trigger === 'per_card').forEach(glyph => {
            const mod = glyph.calculate(context, tile);
            if (mod) {
                if (mod.points) { points += mod.points; breakdown.push(`${glyph.name}: +${mod.points} Points`); }
                if (mod.mult) { mult += mod.mult; breakdown.push(`${glyph.name}: +${mod.mult} Mult`); }
                if (mod.xMult) { totalXMult *= mod.xMult; breakdown.push(`${glyph.name}: x${mod.xMult} Mult`); }
                if (mod.money) { money += mod.money; breakdown.push(`${glyph.name}: +$${mod.money}`); }
            }
        });

        // 4. Gold Seal
        if (tile.seal === 'Gold') {
            money += 3;
            breakdown.push(`Gold Seal: +$3`);
        }
    });

    // --- PHASE 3: GRID EFFECTS ---
    gridTiles.forEach(tile => {
        if (tile.enhancement === 'Steel') {
            totalXMult *= 1.5;
            breakdown.push(`Steel Tile: x1.5 Mult`);
        }
        if (tile.seal === 'Red') {
            if (tile.enhancement === 'Steel') {
                totalXMult *= 1.5;
                breakdown.push(`Red Seal (Steel): x1.5 Mult`);
            }
        }
    });

    // --- PHASE 4: PASSIVE / FINAL GLYPHS ---
    inventory.filter(g => g.trigger === 'passive').forEach(glyph => {
        const mod = glyph.calculate(context);
        if (mod) {
            if (mod.points) { points += mod.points; breakdown.push(`${glyph.name}: +${mod.points} Points`); }
            if (mod.mult) { mult += mod.mult; breakdown.push(`${glyph.name}: +${mod.mult} Mult`); }
            if (mod.xMult) { totalXMult *= mod.xMult; breakdown.push(`${glyph.name}: x${mod.xMult} Mult`); }
            if (mod.money) { money += mod.money; breakdown.push(`${glyph.name}: +$${mod.money}`); }
        }
    });

    // --- FINAL ADJUSTMENTS ---

    // 1. Ensure Base Mult is at least 1
    if (mult < 1) mult = 1;

    // 2. Apply Word Length Multiplier as X Mult (Purple)
    const lenMult = getWordLengthMultiplier(playedTiles.length, verboseLevel);
    if (lenMult > 1) {
        totalXMult *= lenMult;
        breakdown.push(`Word Length (${playedTiles.length}): x${lenMult} Mult`);
    }

    // FINAL CALC
    const finalScore = Math.floor(points * mult * totalXMult);

    breakdown.push(`Total: ${points} x ${mult} x ${totalXMult.toFixed(2)} = ${finalScore}`);

    return {
        totalScore: finalScore,
        basePoints: points,
        baseMult: mult,
        totalXMult: totalXMult, // Exposed for UI
        moneyEarned: money,
        breakdown
    };
};
