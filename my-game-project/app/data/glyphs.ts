import { Glyph } from '../types/Glyph';

export const GLYPHS: Record<string, Glyph> = {
    'big-a': {
        id: 'big-a',
        name: 'Big A',
        description: 'Played "A" tiles give +3 Mult.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+3 Mult per A',
        imageSrc: '/assets/glyphs/big-a.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'A') {
                return { mult: 3 };
            }
            return null;
        }
    },
    'little-a': {
        id: 'little-a',
        name: 'Little a',
        description: 'Played "A" tiles give +20 Chips.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+20 Chips per A',
        imageSrc: '/assets/glyphs/little-a.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'A') {
                return { points: 20 };
            }
            return null;
        },
    },
    // --- E ---
    'big-e': {
        id: 'big-e',
        name: 'Big E',
        description: 'Played "E" tiles give +3 Mult.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+3 Mult per E',
        imageSrc: '/assets/glyphs/big-e.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'E') return { mult: 3 };
            return null;
        }
    },
    'little-e': {
        id: 'little-e',
        name: 'Little e',
        description: 'Played "E" tiles give +20 Chips.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+20 Chips per E',
        imageSrc: '/assets/glyphs/little-e.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'E') return { points: 20 };
            return null;
        }
    },

    // --- I ---
    'big-i': {
        id: 'big-i',
        name: 'Big I',
        description: 'Played "I" tiles give +3 Mult.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+3 Mult per I',
        imageSrc: '/assets/glyphs/big-i.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'I') return { mult: 3 };
            return null;
        }
    },
    'little-i': {
        id: 'little-i',
        name: 'Little i',
        description: 'Played "I" tiles give +20 Chips.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+20 Chips per I',
        imageSrc: '/assets/glyphs/little-i.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'I') return { points: 20 };
            return null;
        }
    },

    // --- O ---
    'big-o': {
        id: 'big-o',
        name: 'Big O',
        description: 'Played "O" tiles give +3 Mult.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+3 Mult per O',
        imageSrc: '/assets/glyphs/big-o.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'O') return { mult: 3 };
            return null;
        }
    },
    'little-o': {
        id: 'little-o',
        name: 'Little o',
        description: 'Played "O" tiles give +20 Chips.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+20 Chips per O',
        imageSrc: '/assets/glyphs/little-o.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'O') return { points: 20 };
            return null;
        }
    },

    // --- U ---
    'big-u': {
        id: 'big-u',
        name: 'Big U',
        description: 'Played "U" tiles give +3 Mult.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+3 Mult per U',
        imageSrc: '/assets/glyphs/big-u.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'U') return { mult: 3 };
            return null;
        }
    },
    'little-u': {
        id: 'little-u',
        name: 'Little u',
        description: 'Played "U" tiles give +20 Chips.',
        rarity: 'Common',
        sellValue: 2,
        baseCost: 5,
        effectDescription: '+20 Chips per U',
        imageSrc: '/assets/glyphs/little-u.png',
        trigger: 'per_card',
        calculate: (context, tile) => {
            if (tile && tile.letter === 'U') return { points: 20 };
            return null;
        }
    }
};
