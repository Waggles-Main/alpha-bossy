export const ANTE_BASE_SCORES = [20, 50, 125, 300, 650, 1200, 2100, 3000];

export function getBlindConfig(ante: number, roundNumber: number) {
    // Ensure ante is within bounds (1-8), default to last if over (Endless mode logic can be added later)
    const baseIndex = Math.min(Math.max(ante, 1), ANTE_BASE_SCORES.length) - 1;
    const baseScore = ANTE_BASE_SCORES[baseIndex];

    let multiplier = 1.0;
    if (roundNumber === 2) multiplier = 1.5; // Big Blind
    if (roundNumber === 3) multiplier = 2.0; // Boss Blind

    // If we go beyond Ante 8 (Endless), we might want a formula, but for now just clamp or scale linearly?
    // User only provided 1-8. Let's just strictly follow the array for now.
    // If Ante > 8, we can just multiply the last value by some factor.
    let targetScore = Math.floor(baseScore * multiplier);

    if (ante > 8) {
        const extraAnte = ante - 8;
        targetScore = Math.floor(ANTE_BASE_SCORES[7] * Math.pow(1.5, extraAnte) * multiplier);
    }

    return {
        targetScore,
        reward: 3 + ante,
    };
}
