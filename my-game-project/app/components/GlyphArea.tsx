'use client';

import React from 'react';
import { useGameStore, TileData } from '../store/useGameStore';
import GlyphCard from './GlyphCard';
import { clsx } from 'clsx';
import GameText from './GameText';

const GlyphArea = () => {
    const inventory = useGameStore((state) => state.inventory);
    const moveGlyph = useGameStore((state) => state.moveGlyph);
    const sellGlyph = useGameStore((state) => state.sellGlyph);
    const disabledGlyphIds = useGameStore((state) => state.disabledGlyphIds);
    const ownedUpgrades = useGameStore((state) => state.ownedUpgrades);

    // For Active Effect Calculation
    const selectedTileIds = useGameStore((state) => state.selectedTileIds);
    const gridTiles = useGameStore((state) => state.gridTiles);

    // Get the actual tile objects that are selected
    const selectedTiles = selectedTileIds
        .map(id => gridTiles.find(t => t.id === id))
        .filter((t): t is TileData => t !== undefined);

    // Calculate Dynamic MAX_SLOTS
    // Base 5 + ('glyph_slot' ? 1 : 0) + ('glyph_slot_plus' ? 1 : 0)
    const MAX_SLOTS = 5
        + (ownedUpgrades.includes('glyph_slot') ? 1 : 0)
        + (ownedUpgrades.includes('glyph_slot_plus') ? 1 : 0);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

        if (!isNaN(fromIndex) && fromIndex !== toIndex) {
            if (toIndex < inventory.length) {
                moveGlyph(fromIndex, toIndex);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-4 text-white">
            {/* Header / Counter */}
            <div className="flex justify-between items-end mb-1 px-4">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest"></span>
                <span className="text-sm font-bold opacity-80">{inventory.length}/{MAX_SLOTS}</span>
            </div>

            {/* Slots Container */}
            <div className="flex justify-center gap-4 flex-wrap sm:flex-nowrap bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-700">
                {Array.from({ length: MAX_SLOTS }).map((_, index) => {
                    const glyph = inventory[index];

                    // Calculate Active Effect Value
                    let activeValue = null;
                    if (glyph && selectedTiles.length > 0) {
                        let effect: any = { points: 0, mult: 0, xMult: 1, money: 0 };
                        let hasEffect = false;

                        // Per Card: Iterate tiles
                        if (glyph.trigger === 'per_card') {
                            selectedTiles.forEach(tile => {
                                const res = glyph.calculate({
                                    playedTiles: selectedTiles,
                                    gridTiles: gridTiles,
                                    inventory: inventory
                                }, tile);
                                if (res) {
                                    hasEffect = true;
                                    if (res.points) effect.points += res.points;
                                    if (res.mult) effect.mult += res.mult;
                                    if (res.xMult) effect.xMult *= res.xMult;
                                    if (res.money) effect.money += res.money;
                                }
                            });
                        }
                        // Passive/Other: Call once
                        else {
                            const res = glyph.calculate({
                                playedTiles: selectedTiles,
                                gridTiles: gridTiles,
                                inventory: inventory
                            });
                            if (res) {
                                hasEffect = true;
                                effect = res;
                            }
                        }

                        if (hasEffect) {
                            if (effect.mult > 0) activeValue = `+${effect.mult} Mult`;
                            else if (effect.points > 0) activeValue = `+${effect.points}`;
                            else if (effect.xMult > 1) activeValue = `x${effect.xMult} Mult`;
                            else if (effect.money > 0) activeValue = `+$${effect.money}`;
                        }
                    }

                    const isDisabled = glyph && disabledGlyphIds.includes(glyph.instanceId || glyph.id);

                    return (
                        <div
                            key={index}
                            className={clsx("w-24 h-32 flex-shrink-0 relative group transition-all", {
                                'opacity-50 grayscale': isDisabled // Apply visual disabled state
                            })}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {glyph ? (
                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    className="cursor-grab active:cursor-grabbing transform transition-transform hover:-translate-y-1 h-full w-full"
                                >
                                    <GlyphCard
                                        glyph={glyph}
                                        isInteractive={true}
                                        onSell={() => sellGlyph(index)}
                                    />

                                    {/* Active Effect Tooltip */}
                                    {activeValue && (
                                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-gray-600 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <GameText text={activeValue} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-600 bg-gray-900/30 flex items-center justify-center">
                                    <span className="text-gray-700 text-2xl">+</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GlyphArea;
