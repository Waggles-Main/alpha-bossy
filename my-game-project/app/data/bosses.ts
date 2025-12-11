export interface Boss {
    id: string;
    name: string;
    description: string;
    minAnte: number;
}

export const BOSSES: Record<string, Boss> = {
    the_wall: {
        id: 'the_wall',
        name: 'The Wall',
        description: 'Extra large blind (4x Base Score)',
        minAnte: 2,
    },
    the_water: {
        id: 'the_water',
        name: 'The Water',
        description: 'Start with 0 discards',
        minAnte: 2,
    },
    the_manacle: {
        id: 'the_manacle',
        name: 'The Manacle',
        description: '-1 Word Size',
        minAnte: 1,
    },
    the_needle: {
        id: 'the_needle',
        name: 'The Needle',
        description: 'Play only 1 word',
        minAnte: 2,
    },
    the_tooth: {
        id: 'the_tooth',
        name: 'The Tooth',
        description: 'Lose $1 per tile played',
        minAnte: 1,
    },
    crimson_heart: {
        id: 'crimson_heart',
        name: 'Crimson Heart',
        description: 'One random glyph disabled every hand',
        minAnte: 1,
    },
    cerulean_bell: {
        id: 'cerulean_bell',
        name: 'Cerulean Bell',
        description: 'Forces 1 tile to always be used',
        minAnte: 1,
    },
    the_flint: {
        id: 'the_flint',
        name: 'The Flint',
        description: 'Base Chips and Mult are halved',
        minAnte: 2,
    },
};

export const BOSS_KEYS = Object.keys(BOSSES);
