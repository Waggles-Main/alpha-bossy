import { TileData } from '../types/Tile';
import { isValidWord } from './dictionary';

export const createTileBag = (): TileData[] => {
    const distribution: { [letter: string]: { quantity: number; points: number } } = {
        'E': { quantity: 12, points: 1 }, 'A': { quantity: 9, points: 1 },
        'I': { quantity: 9, points: 1 }, 'O': { quantity: 8, points: 1 },
        'N': { quantity: 6, points: 1 }, 'R': { quantity: 6, points: 1 },
        'T': { quantity: 6, points: 1 }, 'L': { quantity: 4, points: 1 },
        'S': { quantity: 4, points: 1 }, 'U': { quantity: 4, points: 1 },
        'D': { quantity: 4, points: 2 }, 'G': { quantity: 3, points: 2 },
        'B': { quantity: 2, points: 3 }, 'C': { quantity: 2, points: 3 },
        'M': { quantity: 2, points: 3 }, 'P': { quantity: 2, points: 3 },
        'F': { quantity: 2, points: 4 }, 'H': { quantity: 2, points: 4 },
        'V': { quantity: 2, points: 4 }, 'W': { quantity: 2, points: 4 },
        'Y': { quantity: 2, points: 4 }, 'K': { quantity: 1, points: 5 },
        'J': { quantity: 1, points: 8 }, 'X': { quantity: 1, points: 8 },
        'Qu': { quantity: 1, points: 10 }, 'Z': { quantity: 1, points: 10 },
        'Blank': { quantity: 2, points: 0 },
    };

    const bag: TileData[] = [];
    let idCounter = 0;
    for (const letter in distribution) {
        const { quantity, points } = distribution[letter];
        for (let i = 0; i < quantity; i++) {
            // TileData requires id, but type, edition, etc are optional
            // Note: useGameStore defines TileData exporting it? 
            // Circular dependency if I import TileData from store?
            // Yes.
            // I should Move TileData definition to a types file effectively.
            // For now I will define it here or import from types if available.
            // The store had: export interface TileData ...
            // I will duplicate strictly the structure or move it to types/Tile.ts
            bag.push({ letter, points, id: idCounter++ });
        }
    }
    return bag;
};

export const shuffle = (array: TileData[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function resolveBlankTiles(tiles: TileData[]): Promise<string | null> {
    const blankIndices = tiles.map((t, i) => t.letter === 'Blank' ? i : -1).filter(i => i !== -1);

    if (blankIndices.length === 0) {
        const word = tiles.map(t => t.letter).join('');
        return await isValidWord(word) ? word : null;
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const wordTemplate = tiles.map(t => t.letter);

    async function findFirstValid(template: string[], blankIndexPosition: number): Promise<string | null> {
        if (blankIndexPosition >= blankIndices.length) {
            const finalWord = template.join('');
            return await isValidWord(finalWord) ? finalWord : null;
        }

        const currentBlankIndex = blankIndices[blankIndexPosition];
        for (const char of alphabet) {
            template[currentBlankIndex] = char;
            const result = await findFirstValid(template, blankIndexPosition + 1);
            if (result) {
                return result;
            }
        }

        template[currentBlankIndex] = 'Blank';
        return null;
    }

    return await findFirstValid(wordTemplate, 0);
}
