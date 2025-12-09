export interface TileBlueprint {
    letter: string;
    points: number;
}

export interface TileData extends TileBlueprint {
    id: number;
    type?: 'EMPTY';
    edition?: 'Foil' | 'Holographic' | 'Polychrome';
    enhancement?: 'Steel' | 'Stone' | 'Glass' | 'Gold' | 'Wild';
    seal?: 'Red' | 'Gold' | 'Blue' | 'Purple';
}
