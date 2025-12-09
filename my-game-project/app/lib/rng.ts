import { Glyph } from '../types/Glyph';
import { GLYPHS } from '../data/glyphs';

type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

const RARITY_WEIGHTS: Record<Rarity, number> = {
    Common: 0.69,
    Uncommon: 0.25,
    Rare: 0.05,
    Legendary: 0.01
};

export const getRandomRarity = (): Rarity => {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const rarity of ['Common', 'Uncommon', 'Rare', 'Legendary'] as Rarity[]) {
        cumulativeWeight += RARITY_WEIGHTS[rarity];
        if (random <= cumulativeWeight) {
            return rarity;
        }
    }

    return 'Common'; // Fallback
};

export const getRandomGlyph = (targetRarity: Rarity): Glyph | null => {
    const availableGlyphs = Object.values(GLYPHS).filter(g => g.rarity === targetRarity);

    if (availableGlyphs.length === 0) {
        // Fallback logic if no glyphs of this rarity exist yet
        // For now, return any glyph or null
        return availableGlyphs[0] || Object.values(GLYPHS)[0] || null;
    }

    const randomIndex = Math.floor(Math.random() * availableGlyphs.length);
    return availableGlyphs[randomIndex];
};

export const generateShopItems = (count: number, excludeList: Glyph[] = []): Glyph[] => {
    const shopItems: Glyph[] = [];

    // Get all available glyph keys
    const allGlyphKeys = Object.keys(GLYPHS);

    // Filter out glyphs that are already in the excludeList (inventory)
    // We compare based on ID, since instanceId is unique per instance
    const ownedIds = new Set(excludeList.map(g => g.id));
    const availableGlyphKeys = allGlyphKeys.filter(key => !ownedIds.has(GLYPHS[key].id));

    // If we have fewer available glyphs than requested count, just return what's possible
    if (availableGlyphKeys.length < count) {
        return availableGlyphKeys.map(key => ({
            ...GLYPHS[key],
            instanceId: crypto.randomUUID()
        }));
    }

    let attempts = 0;
    while (shopItems.length < count && attempts < 50) {
        attempts++;
        const rarity = getRandomRarity();
        const potentialGlyphs = availableGlyphKeys.filter(k => GLYPHS[k].rarity === rarity);

        if (potentialGlyphs.length === 0) continue; // No glyphs of this rarity available

        const randomKey = potentialGlyphs[Math.floor(Math.random() * potentialGlyphs.length)];
        const candidate = GLYPHS[randomKey];

        // Ensure not already selected in this shop batch
        if (!shopItems.find(i => i.id === candidate.id)) {
            shopItems.push({
                ...candidate,
                instanceId: crypto.randomUUID()
            });
        }
    }

    // If we failed to fill up (e.g. strict rarity weights), just fill with any available
    // excluding ones we already picked or own
    if (shopItems.length < count) {
        const remainingKeys = availableGlyphKeys.filter(k => !shopItems.find(i => i.id === GLYPHS[k].id));
        while (shopItems.length < count && remainingKeys.length > 0) {
            const key = remainingKeys.pop()!;
            shopItems.push({
                ...GLYPHS[key],
                instanceId: crypto.randomUUID()
            });
        }
    }

    return shopItems;
};
