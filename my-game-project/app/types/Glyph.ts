import type { TileData } from './Tile';

export interface ScoreModifier {
    points?: number;    // +Chips
    mult?: number;      // +Mult
    xMult?: number;     // xMult
    money?: number;     // +$
}

export type GlyphTrigger = 'pre_score' | 'per_card' | 'on_discard' | 'passive';

export interface GlyphCalculationContext {
    playedTiles: TileData[];
    gridTiles?: TileData[];
    inventory?: Glyph[];
    // Context needed for complexity
}

export interface Glyph {
    id: string;
    name: string;
    description: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
    sellValue: number;
    baseCost?: number;

    // Visuals
    effectDescription: string;
    imageSrc: string;

    // Logic
    trigger: GlyphTrigger;
    // Returns modifier or null provided the context and specifically the tile if strictly a per-card check
    calculate: (context: GlyphCalculationContext, tile?: TileData) => ScoreModifier | null;

    instanceId?: string;
}

export type GlyphStats = ScoreModifier;
